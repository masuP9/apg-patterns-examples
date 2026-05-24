/**
 * Minimal GitHub REST client for the APG upstream watcher.
 *
 * Only fetches paths it actually needs (commits list, issues list, issue
 * create/comment, label create). Uses the global fetch (Node 22+) and adds a
 * small exponential backoff for 5xx / secondary rate-limit responses.
 */

const API_BASE = 'https://api.github.com';

/**
 * Hard cap on the number of pages `listCommitsForPath` will follow. Each page
 * returns up to 100 commits, so 20 pages = ~2000 commits. Going beyond this in
 * a single run typically means `since` was set too far in the past; the safer
 * remedy is to narrow `since_override` rather than silently consume rate limit.
 */
const COMMITS_MAX_PAGES = 20;

/** Parse the `rel="next"` URL out of a GitHub `Link` response header. */
function parseNextLink(linkHeader: string | null): string | null {
  if (!linkHeader) return null;
  // RFC 5988 e.g.: `<https://api.github.com/...?page=2>; rel="next", <...>; rel="last"`
  const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
  return match ? match[1] : null;
}

export interface CommitSummary {
  sha: string;
  message: string;
  authorName: string;
  authorDate: string; // ISO 8601, display only
  /** Committer date in ISO 8601. Used as the watermark for the GitHub commits
   *  API `since` parameter because GitHub orders/filters commits by committer
   *  date, not author date. */
  committerDate: string;
  htmlUrl: string;
}

export interface IssueCommentSummary {
  id: number;
  body: string;
}

export interface IssueSummary {
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
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
   * Fetch commits in upstream repo touching the given path since the given ISO
   * time. `since` is inclusive on GitHub side, so we typically pass
   * `lastSeenDate + 1s` to avoid re-yielding the previously-recorded commit.
   *
   * Follows the GitHub `Link: rel="next"` pagination header to collect all
   * pages, with a hard cap of {@link COMMITS_MAX_PAGES} pages to guard against
   * accidentally wide `since` windows.
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

    const initialPath = `/repos/${params.owner}/${params.repo}/commits?${qs}`;
    const expectedHost = new URL(API_BASE).host;
    const expectedPathnamePrefix = `/repos/${params.owner}/${params.repo}/commits`;

    const all: CommitSummary[] = [];
    let nextPath: string | null = initialPath;
    let pageCount = 0;

    while (nextPath !== null) {
      pageCount++;
      if (pageCount > COMMITS_MAX_PAGES) {
        throw new Error(
          `listCommitsForPath: exceeded COMMITS_MAX_PAGES=${COMMITS_MAX_PAGES} ` +
            `for path=${params.path}. Narrow 'since' or run a one-off backfill.`
        );
      }

      const res = await this.request('GET', nextPath);
      if (res.status === 404) {
        // 404 normally means the upstream path/repo does not exist. We only
        // honor it on the first page; a 404 mid-pagination is unexpected.
        if (pageCount === 1) return [];
        throw new Error(
          `listCommitsForPath: unexpected 404 on page ${pageCount} for path=${params.path}`
        );
      }

      const json = (await res.json()) as Array<{
        sha: string;
        html_url: string;
        commit: {
          message: string;
          author: { name: string; date: string } | null;
          committer: { name: string; date: string } | null;
        };
      }>;
      for (const c of json) {
        const fallbackDate = new Date().toISOString();
        const authorDate = c.commit.author?.date ?? fallbackDate;
        // Prefer committer date for the watermark; fall back to author date
        // when the upstream commit lacks committer info (rare for real GitHub
        // commits).
        const committerDate = c.commit.committer?.date ?? authorDate;
        all.push({
          sha: c.sha,
          message: c.commit.message,
          authorName: c.commit.author?.name ?? 'unknown',
          authorDate,
          committerDate,
          htmlUrl: c.html_url,
        });
      }

      const nextUrl = parseNextLink(res.headers.get('link'));
      if (!nextUrl) {
        nextPath = null;
        break;
      }

      // Verify the next URL points back at the same commits endpoint before
      // following it, so a malformed Link header can never redirect us to a
      // different host or resource.
      let parsedNext: URL;
      try {
        parsedNext = new URL(nextUrl);
      } catch {
        throw new Error(`listCommitsForPath: malformed next URL in Link header: ${nextUrl}`);
      }
      // GitHub may advertise the next page in either the slug form
      // (`/repos/<owner>/<repo>/commits`) or the numeric form
      // (`/repositories/<id>/commits`). Both are valid for the same resource.
      const pathnameOk =
        parsedNext.pathname === expectedPathnamePrefix ||
        /^\/repositories\/\d+\/commits$/.test(parsedNext.pathname);
      if (parsedNext.host !== expectedHost || !pathnameOk) {
        throw new Error(
          `listCommitsForPath: unexpected next URL ${nextUrl} ` +
            `(expected host=${expectedHost}, pathname ${expectedPathnamePrefix} ` +
            `or /repositories/<id>/commits)`
        );
      }
      const candidate = parsedNext.pathname + parsedNext.search;
      if (candidate === nextPath) {
        // Defensive: GitHub should never advertise the current page as next,
        // but if it ever did we would loop forever.
        throw new Error(
          `listCommitsForPath: next URL equals current URL (${candidate}); aborting pagination`
        );
      }
      nextPath = candidate;
    }

    if (pageCount > 1) {
      console.log(
        `[github-client] listCommitsForPath ${params.path}: fetched ${all.length} commits across ${pageCount} pages`
      );
    }

    return all;
  }

  async listIssueComments(params: {
    owner: string;
    repo: string;
    issueNumber: number;
  }): Promise<IssueCommentSummary[]> {
    const res = await this.request(
      'GET',
      `/repos/${params.owner}/${params.repo}/issues/${params.issueNumber}/comments?per_page=100`
    );
    if (res.status === 404) return [];
    const json = (await res.json()) as Array<{ id: number; body: string | null }>;
    return json.map((c) => ({ id: c.id, body: c.body ?? '' }));
  }

  async searchIssuesWithLabel(params: {
    owner: string;
    repo: string;
    label: string;
    /** 'open' | 'closed' | 'all'. Default 'all' so that issues that the user
     *  closed as "no action needed" still match for dedup. */
    state?: 'open' | 'closed' | 'all';
  }): Promise<IssueSummary[]> {
    const qs = new URLSearchParams({
      state: params.state ?? 'all',
      labels: params.label,
      per_page: '100',
    });
    const res = await this.request('GET', `/repos/${params.owner}/${params.repo}/issues?${qs}`);
    if (res.status === 404) return [];
    const json = (await res.json()) as Array<{
      number: number;
      title: string;
      body: string | null;
      state: 'open' | 'closed';
      html_url: string;
      pull_request?: unknown;
    }>;
    return json
      .filter((i) => !i.pull_request)
      .map((i) => ({
        number: i.number,
        title: i.title,
        body: i.body ?? '',
        state: i.state,
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
      state: 'open' | 'closed';
      html_url: string;
    };
    return {
      number: json.number,
      title: json.title,
      body: json.body ?? '',
      state: json.state,
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
