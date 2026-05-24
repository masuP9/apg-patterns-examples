import { describe, expect, it, vi } from 'vitest';
import type { GitHubClient, IssueCommentSummary, IssueSummary } from './github-client';
import { batchMarkerFor, latestMarkerFor, markerFor } from './issue-formatter';
import { IssueManager } from './issue-manager';

interface FakeState {
  issues: IssueSummary[];
  comments: Record<number, IssueCommentSummary[]>;
}

function makeFakeClient(initial: Partial<FakeState> = {}) {
  const state: FakeState = {
    issues: initial.issues ?? [],
    comments: initial.comments ?? {},
  };
  const calls = {
    createIssue: vi.fn(),
    addIssueComment: vi.fn(),
  };
  const client = {
    searchIssuesWithLabel: vi.fn(async () => state.issues),
    listIssueComments: vi.fn(
      async ({ issueNumber }: { issueNumber: number }) => state.comments[issueNumber] ?? []
    ),
    createIssue: vi.fn(async (params: { title: string; body: string }) => {
      calls.createIssue(params);
      const created: IssueSummary = {
        number: 999,
        title: params.title,
        body: params.body,
        state: 'open',
        htmlUrl: `https://example/issues/999`,
      };
      state.issues.push(created);
      return created;
    }),
    addIssueComment: vi.fn(async (params: { issueNumber: number; body: string }) => {
      calls.addIssueComment(params);
      const list = (state.comments[params.issueNumber] ??= []);
      list.push({ id: list.length + 1, body: params.body });
    }),
  } as unknown as GitHubClient;
  return { client, state, calls };
}

const baseOpts = {
  owner: 'masuP9',
  repo: 'apg-patterns-examples',
  label: 'apg-upstream',
  dryRun: false,
  logger: () => {},
};

const sampleDraft = (slug: string, latestSha = 'sha1') => ({
  title: `[APG Upstream] ${slug} に 1 件の更新`,
  body: `${markerFor(slug)}\n${latestMarkerFor(latestSha)}\n\nbody`,
  markerComment: markerFor(slug),
});

const openIssue = (overrides: Partial<IssueSummary> = {}): IssueSummary => ({
  number: 42,
  title: 'old',
  body: `${markerFor('button')}\n\nbody`,
  state: 'open',
  htmlUrl: '',
  ...overrides,
});

describe('IssueManager.createOrComment', () => {
  it('creates a new issue when none exists for the slug', async () => {
    const { client, calls } = makeFakeClient();
    const manager = new IssueManager(client, baseOpts);
    const action = await manager.createOrComment({
      apgSlug: 'button',
      latestSha: 'sha1',
      draft: sampleDraft('button'),
      followupBody: 'follow-up',
    });
    expect(action.kind).toBe('create');
    expect(action.issueNumber).toBe(999);
    expect(calls.createIssue).toHaveBeenCalledTimes(1);
    expect(calls.addIssueComment).not.toHaveBeenCalled();
  });

  it('comments on the existing open issue when one matches the marker (different SHA)', async () => {
    // existing issue body carries an *older* latest marker
    const existing = openIssue({
      body: `${markerFor('button')}\n${latestMarkerFor('oldsha')}\n\nbody`,
    });
    const { client, calls } = makeFakeClient({ issues: [existing] });
    const manager = new IssueManager(client, baseOpts);
    const action = await manager.createOrComment({
      apgSlug: 'button',
      latestSha: 'newsha',
      draft: sampleDraft('button', 'newsha'),
      followupBody: 'follow-up',
    });
    expect(action).toEqual({ kind: 'comment', apgSlug: 'button', issueNumber: 42 });
    expect(calls.addIssueComment).toHaveBeenCalledWith(
      expect.objectContaining({ issueNumber: 42, body: 'follow-up' })
    );
    expect(calls.createIssue).not.toHaveBeenCalled();
  });

  it('skips when an open issue body already carries the same latest-SHA marker', async () => {
    const existing = openIssue({
      body: `${markerFor('button')}\n${latestMarkerFor('sha1')}\n\nbody`,
    });
    const { client, calls } = makeFakeClient({ issues: [existing] });
    const manager = new IssueManager(client, baseOpts);
    const action = await manager.createOrComment({
      apgSlug: 'button',
      latestSha: 'sha1',
      draft: sampleDraft('button'),
      followupBody: 'follow-up',
    });
    expect(action.kind).toBe('skip');
    expect(action.reason).toBe('same-latest-sha-in-body');
    expect(calls.addIssueComment).not.toHaveBeenCalled();
    expect(calls.createIssue).not.toHaveBeenCalled();
  });

  it('skips when a CLOSED issue already covers the same SHA (does not re-create)', async () => {
    const closed = openIssue({
      number: 100,
      state: 'closed',
      body: `${markerFor('button')}\n${latestMarkerFor('sha1')}\n\nbody`,
    });
    const { client, calls } = makeFakeClient({ issues: [closed] });
    const manager = new IssueManager(client, baseOpts);
    const action = await manager.createOrComment({
      apgSlug: 'button',
      latestSha: 'sha1',
      draft: sampleDraft('button'),
      followupBody: 'follow-up',
    });
    expect(action.kind).toBe('skip');
    expect(action.issueNumber).toBe(100);
    expect(calls.createIssue).not.toHaveBeenCalled();
    expect(calls.addIssueComment).not.toHaveBeenCalled();
  });

  it('creates a new issue when only a CLOSED issue exists for an older SHA', async () => {
    const closed = openIssue({
      number: 100,
      state: 'closed',
      body: `${markerFor('button')}\n${latestMarkerFor('oldsha')}\n\nbody`,
    });
    const { client, calls } = makeFakeClient({ issues: [closed] });
    const manager = new IssueManager(client, baseOpts);
    const action = await manager.createOrComment({
      apgSlug: 'button',
      latestSha: 'newsha',
      draft: sampleDraft('button', 'newsha'),
      followupBody: 'follow-up',
    });
    expect(action.kind).toBe('create');
    expect(calls.createIssue).toHaveBeenCalledTimes(1);
    expect(calls.addIssueComment).not.toHaveBeenCalled();
  });

  it('skips when an open issue already has a follow-up comment with the same batch marker (retry safety)', async () => {
    const existing = openIssue({
      // body has an older SHA, but a previous run already commented with sha1
      body: `${markerFor('button')}\n${latestMarkerFor('oldsha')}\n\nbody`,
    });
    const priorComment: IssueCommentSummary = {
      id: 1,
      body: `${batchMarkerFor('button', 'sha1')}\n\nold follow-up`,
    };
    const { client, calls } = makeFakeClient({
      issues: [existing],
      comments: { 42: [priorComment] },
    });
    const manager = new IssueManager(client, baseOpts);
    const action = await manager.createOrComment({
      apgSlug: 'button',
      latestSha: 'sha1',
      draft: sampleDraft('button'),
      followupBody: 'follow-up',
    });
    expect(action.kind).toBe('skip');
    expect(action.reason).toBe('duplicate-batch-comment');
    expect(calls.addIssueComment).not.toHaveBeenCalled();
    expect(calls.createIssue).not.toHaveBeenCalled();
  });

  it('does not mutate anything in dry-run mode', async () => {
    const { client, calls } = makeFakeClient();
    const manager = new IssueManager(client, { ...baseOpts, dryRun: true });
    const action = await manager.createOrComment({
      apgSlug: 'button',
      latestSha: 'sha1',
      draft: sampleDraft('button'),
      followupBody: 'follow-up',
    });
    expect(action.kind).toBe('create');
    expect(action.issueNumber).toBeUndefined();
    expect(calls.createIssue).not.toHaveBeenCalled();
    expect(calls.addIssueComment).not.toHaveBeenCalled();
  });
});
