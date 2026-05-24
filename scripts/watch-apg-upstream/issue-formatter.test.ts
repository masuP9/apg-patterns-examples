import { describe, expect, it } from 'vitest';
import { batchMarkerFor, formatFollowupComment, formatIssue, markerFor } from './issue-formatter';
import type { CommitSummary } from './github-client';
import type { SlugMapping } from './slug-resolver';

const sampleCommit = (overrides: Partial<CommitSummary> = {}): CommitSummary => ({
  sha: 'abc1234def5678abc1234def5678abc1234def56',
  message: 'Fix focus order in arrow nav',
  authorName: 'Test Author',
  authorDate: '2026-05-23T10:00:00Z',
  committerDate: '2026-05-23T10:00:00Z',
  htmlUrl: 'https://github.com/w3c/aria-practices/commit/abc1234',
  ...overrides,
});

const buttonMapping: SlugMapping = {
  apgSlug: 'button',
  primaryPattern: { id: 'button', name: 'Button', description: '', icon: '' },
  relatedPatterns: [{ id: 'toggle-button', name: 'Toggle Button', description: '', icon: '' }],
};

const radioMapping: SlugMapping = {
  apgSlug: 'radio',
  primaryPattern: { id: 'radio', name: 'Radio Group', description: '', icon: '' },
  relatedPatterns: [],
};

describe('markerFor / batchMarkerFor', () => {
  it('embeds the apg slug', () => {
    expect(markerFor('button')).toBe('<!-- apg-upstream:slug=button -->');
  });

  it('embeds slug and latest SHA in batch marker', () => {
    expect(batchMarkerFor('button', 'abc1234')).toBe(
      '<!-- apg-upstream-batch:slug=button;latest=abc1234 -->'
    );
  });
});

describe('formatIssue', () => {
  it('includes the body marker, primary pattern, and commit table', () => {
    const draft = formatIssue({
      mapping: buttonMapping,
      commits: [sampleCommit()],
      since: '2026-05-22T00:00:00Z',
      until: '2026-05-24T00:00:00Z',
      previousSha: null,
      upstreamRepo: 'w3c/aria-practices',
    });
    expect(draft.title).toContain('Button');
    expect(draft.title).toContain('1 件');
    expect(draft.body).toContain('<!-- apg-upstream:slug=button -->');
    expect(draft.body).toContain('[Button](/patterns/button/)');
    expect(draft.body).toContain('Fix focus order in arrow nav');
    expect(draft.body).toContain('[abc1234]');
  });

  it('lists related patterns as a checklist when present', () => {
    const draft = formatIssue({
      mapping: buttonMapping,
      commits: [sampleCommit()],
      since: 's',
      until: 'u',
      previousSha: null,
      upstreamRepo: 'w3c/aria-practices',
    });
    expect(draft.body).toContain('### 関連パターン');
    expect(draft.body).toContain('[Toggle Button](/patterns/toggle-button/)');
  });

  it('omits the related section when there are no related patterns', () => {
    const draft = formatIssue({
      mapping: radioMapping,
      commits: [sampleCommit()],
      since: 's',
      until: 'u',
      previousSha: null,
      upstreamRepo: 'w3c/aria-practices',
    });
    expect(draft.body).not.toContain('### 関連パターン');
  });

  it('builds a compare URL only when previousSha is present', () => {
    const withPrev = formatIssue({
      mapping: radioMapping,
      commits: [sampleCommit({ sha: 'newsha00000000000000000000000000000000000' })],
      since: 's',
      until: 'u',
      previousSha: 'oldsha',
      upstreamRepo: 'w3c/aria-practices',
    });
    expect(withPrev.body).toContain('compare/oldsha...newsha');

    const withoutPrev = formatIssue({
      mapping: radioMapping,
      commits: [sampleCommit()],
      since: 's',
      until: 'u',
      previousSha: null,
      upstreamRepo: 'w3c/aria-practices',
    });
    expect(withoutPrev.body).not.toContain('compare/');
  });

  it('escapes pipe characters in commit messages so the table is not broken', () => {
    const draft = formatIssue({
      mapping: radioMapping,
      commits: [sampleCommit({ message: 'fix: foo | bar' })],
      since: 's',
      until: 'u',
      previousSha: null,
      upstreamRepo: 'w3c/aria-practices',
    });
    expect(draft.body).toContain('fix: foo \\| bar');
  });
});

describe('formatFollowupComment', () => {
  it('embeds the batch marker with the latest SHA', () => {
    const body = formatFollowupComment({
      apgSlug: 'button',
      commits: [sampleCommit({ sha: 'latestsha000000000000000000000000000000ab' })],
      since: 's',
      until: 'u',
    });
    expect(body).toContain(
      '<!-- apg-upstream-batch:slug=button;latest=latestsha000000000000000000000000000000ab -->'
    );
  });
});
