import { describe, expect, it, vi } from 'vitest';
import { GitHubClient } from './github-client';

interface FakePage {
  status: number;
  commits?: Array<{
    sha: string;
    message?: string;
    authorName?: string;
    authorDate?: string;
    committerDate?: string;
  }>;
  /** Full URL string to advertise as `rel="next"`. Omit to signal last page. */
  nextLinkUrl?: string;
}

function buildCommitJson(c: NonNullable<FakePage['commits']>[number]) {
  return {
    sha: c.sha,
    html_url: `https://github.com/w3c/aria-practices/commit/${c.sha}`,
    commit: {
      message: c.message ?? 'msg',
      author: { name: c.authorName ?? 'a', date: c.authorDate ?? '2026-01-01T00:00:00Z' },
      committer: { name: 'c', date: c.committerDate ?? '2026-01-02T00:00:00Z' },
    },
  };
}

function makeFetchImpl(pages: FakePage[]): typeof fetch {
  // Return one Response per call, in order. Extra calls throw.
  let i = 0;
  return vi.fn(async () => {
    if (i >= pages.length) {
      throw new Error(`fetch called more times than pages were provided (i=${i})`);
    }
    const page = pages[i++];
    const body =
      page.status === 404 ? '' : JSON.stringify((page.commits ?? []).map(buildCommitJson));
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    if (page.nextLinkUrl) {
      headers.link = `<${page.nextLinkUrl}>; rel="next", <${page.nextLinkUrl}&_last>; rel="last"`;
    }
    return new Response(body, { status: page.status, headers });
  }) as unknown as typeof fetch;
}

const baseParams = {
  owner: 'w3c',
  repo: 'aria-practices',
  path: 'content/patterns/button',
};

function makeClient(pages: FakePage[]) {
  return new GitHubClient({
    token: 'test',
    requestSpacingMs: 0,
    fetchImpl: makeFetchImpl(pages),
  });
}

describe('GitHubClient.listCommitsForPath', () => {
  it('returns commits from a single page when there is no Link header', async () => {
    const client = makeClient([
      {
        status: 200,
        commits: [{ sha: 'a' }, { sha: 'b' }],
      },
    ]);
    const commits = await client.listCommitsForPath(baseParams);
    expect(commits.map((c) => c.sha)).toEqual(['a', 'b']);
  });

  it('returns [] when the first page is 404', async () => {
    const client = makeClient([{ status: 404 }]);
    const commits = await client.listCommitsForPath(baseParams);
    expect(commits).toEqual([]);
  });

  it('follows rel="next" and concatenates commits across pages', async () => {
    const nextUrl =
      'https://api.github.com/repositories/123/commits?path=content/patterns/button&per_page=100&page=2';
    const client = makeClient([
      {
        status: 200,
        commits: [{ sha: 'a' }, { sha: 'b' }],
        nextLinkUrl: nextUrl,
      },
      {
        status: 200,
        commits: [{ sha: 'c' }, { sha: 'd' }],
      },
    ]);
    const commits = await client.listCommitsForPath(baseParams);
    expect(commits.map((c) => c.sha)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('throws when the next URL points at a different host (hijack guard)', async () => {
    const client = makeClient([
      {
        status: 200,
        commits: [{ sha: 'a' }],
        nextLinkUrl: 'https://evil.example.com/repos/w3c/aria-practices/commits?page=2',
      },
    ]);
    await expect(client.listCommitsForPath(baseParams)).rejects.toThrow(/unexpected next URL/);
  });

  it('throws when the next URL equals the current URL (infinite-loop guard)', async () => {
    // The mock returns the same Link header on every call, which would loop
    // forever without the defensive check.
    const sameUrl =
      'https://api.github.com/repos/w3c/aria-practices/commits?path=content%2Fpatterns%2Fbutton&per_page=100';
    const client = makeClient([
      {
        status: 200,
        commits: [{ sha: 'a' }],
        nextLinkUrl: sameUrl,
      },
    ]);
    await expect(client.listCommitsForPath(baseParams)).rejects.toThrow(
      /next URL equals current URL/
    );
  });

  it('throws after exceeding COMMITS_MAX_PAGES (default 20)', async () => {
    // 21 pages each linking to a distinct next page; the 21st should never be
    // fetched because the loop must throw first.
    const pages: FakePage[] = Array.from({ length: 21 }, (_, idx) => ({
      status: 200,
      commits: [{ sha: `sha${idx}` }],
      nextLinkUrl: `https://api.github.com/repos/w3c/aria-practices/commits?page=${idx + 2}`,
    }));
    const client = makeClient(pages);
    await expect(client.listCommitsForPath(baseParams)).rejects.toThrow(
      /exceeded COMMITS_MAX_PAGES=20/
    );
  });

  it('throws when a non-first page returns 404 (unexpected mid-pagination)', async () => {
    const client = makeClient([
      {
        status: 200,
        commits: [{ sha: 'a' }],
        nextLinkUrl: 'https://api.github.com/repos/w3c/aria-practices/commits?page=2',
      },
      { status: 404 },
    ]);
    await expect(client.listCommitsForPath(baseParams)).rejects.toThrow(/unexpected 404 on page 2/);
  });

  it('throws when the Link header next URL is malformed (cannot be parsed)', async () => {
    const client = makeClient([
      {
        status: 200,
        commits: [{ sha: 'a' }],
        nextLinkUrl: 'not a url',
      },
    ]);
    await expect(client.listCommitsForPath(baseParams)).rejects.toThrow(
      /malformed next URL in Link header/
    );
  });
});
