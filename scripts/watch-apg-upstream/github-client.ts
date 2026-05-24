/**
 * Minimal GitHub REST client for the APG upstream watcher.
 *
 * Only fetches paths it actually needs (commits list, issues list, issue
 * create/comment, label create). Uses the global fetch (Node 22+) and adds a
 * small exponential backoff for 5xx / secondary rate-limit responses.
 */

const API_BASE = 'https://api.github.com';

export interface CommitSummary {
  sha: string;
  message: string;
  authorName: string;
  authorDate: string; // ISO 8601
  htmlUrl: string;
}

export interface IssueSummary {
  number: number;
  title: string;
  body: string;
  htmlUrl: string;
}

export interface GitHubClientOptions {
  token: string;
  /** Sleep between requests to upstream commits API (ms). Defaults to 100. */
  requestSpacingMs?: number;
  /** Max retry attempts on transient failure. Defaults to 3. */
  maxRetries?: number;
  /** Override fetch (for testing). */
  fetchImpl?: typeof fetch;
}

export class GitHubClient {
  private readonly token: string;
  private readonly spacingMs: number;
  private readonly maxRetries: number;
  private readonly fetchImpl: typeof fetch;
  private lastRequestAt = 0;

  constructor(opts: GitHubClientOptions) {
    this.token = opts.token;
    this.spacingMs = opts.requestSpacingMs ?? 100;
    this.maxRetries = opts.maxRetries ?? 3;
    this.fetchImpl = opts.fetchImpl ?? fetch;
  }

  private async throttle(): Promise<void> {
    const wait = this.spacingMs - (Date.now() - this.lastRequestAt);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    this.lastRequestAt = Date.now();
  }

  private async request(
    method: 'GET' | 'POST' | 'PATCH',
    pathname: string,
    body?: unknown
  ): Promise<Response> {
    await this.throttle();
    let attempt = 0;
    while (true) {
      const res = await this.fetchImpl(`${API_BASE}${pathname}`, {
        method,
        headers: {
          authorization: `Bearer ${this.token}`,
          accept: 'application/vnd.github+json',
          'x-github-api-version': '2022-11-28',
          'user-agent': 'apg-patterns-examples-upstream-watcher',
          ...(body ? { 'content-type': 'application/json' } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (res.ok || res.status === 404) return res;
      const transient = res.status === 429 || res.status >= 500;
      if (!transient || attempt >= this.maxRetries) {
        const text = await res.text();
        throw new Error(`GitHub API ${method} ${pathname} failed: ${res.status} ${text}`);
      }
      attempt++;
      const retryAfter = Number(res.headers.get('retry-after'));
      const backoff =
        Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 2 ** attempt * 500;
      await new Promise((r) => setTimeout(r, backoff));
    }
  }

  /**
   * Fetch commits in upstream repo touching the given path since the given ISO time.
   * `since` is inclusive on GitHub side, so we typically pass `lastSeenDate + 1s`
   * to avoid re-yielding the previously-recorded commit.
   */
  async listCommitsForPath(params: {
    owner: string;
    repo: string;
    path: string;
    since?: string;
    perPage?: number;
  }): Promise<CommitSummary[]> {
    const qs = new URLSearchParams({
      path: params.path,
      per_page: String(params.perPage ?? 100),
    });
    if (params.since) qs.set('since', params.since);
    const res = await this.request('GET', `/repos/${params.owner}/${params.repo}/commits?${qs}`);
    if (res.status === 404) return [];
    const json = (await res.json()) as Array<{
      sha: string;
      html_url: string;
      commit: { message: string; author: { name: string; date: string } | null };
    }>;
    return json.map((c) => ({
      sha: c.sha,
      message: c.commit.message,
      authorName: c.commit.author?.name ?? 'unknown',
      authorDate: c.commit.author?.date ?? new Date().toISOString(),
      htmlUrl: c.html_url,
    }));
  }

  async searchOpenIssuesWithLabel(params: {
    owner: string;
    repo: string;
    label: string;
  }): Promise<IssueSummary[]> {
    const qs = new URLSearchParams({
      state: 'open',
      labels: params.label,
      per_page: '100',
    });
    const res = await this.request('GET', `/repos/${params.owner}/${params.repo}/issues?${qs}`);
    if (res.status === 404) return [];
    const json = (await res.json()) as Array<{
      number: number;
      title: string;
      body: string | null;
      html_url: string;
      pull_request?: unknown;
    }>;
    return json
      .filter((i) => !i.pull_request)
      .map((i) => ({
        number: i.number,
        title: i.title,
        body: i.body ?? '',
        htmlUrl: i.html_url,
      }));
  }

  async createIssue(params: {
    owner: string;
    repo: string;
    title: string;
    body: string;
    labels: string[];
  }): Promise<IssueSummary> {
    const res = await this.request('POST', `/repos/${params.owner}/${params.repo}/issues`, {
      title: params.title,
      body: params.body,
      labels: params.labels,
    });
    const json = (await res.json()) as {
      number: number;
      title: string;
      body: string | null;
      html_url: string;
    };
    return {
      number: json.number,
      title: json.title,
      body: json.body ?? '',
      htmlUrl: json.html_url,
    };
  }

  async addIssueComment(params: {
    owner: string;
    repo: string;
    issueNumber: number;
    body: string;
  }): Promise<void> {
    await this.request(
      'POST',
      `/repos/${params.owner}/${params.repo}/issues/${params.issueNumber}/comments`,
      { body: params.body }
    );
  }
}
