/**
 * Decide whether to open a new issue or comment on an existing one for an APG
 * slug, using the HTML marker as a stable identifier.
 *
 * dry-run mode: print the action that would be taken; do NOT call any
 * mutating endpoint.
 */
import type { GitHubClient } from './github-client';
import type { IssueDraft } from './issue-formatter';
import { batchMarkerFor, markerFor } from './issue-formatter';

export interface IssueAction {
  kind: 'create' | 'comment' | 'skip';
  apgSlug: string;
  issueNumber?: number;
  reason?: string;
}

export interface IssueManagerOptions {
  owner: string;
  repo: string;
  label: string;
  dryRun: boolean;
  logger?: (msg: string) => void;
}

export class IssueManager {
  private readonly client: GitHubClient;
  private readonly opts: IssueManagerOptions;
  private readonly log: (msg: string) => void;

  constructor(client: GitHubClient, opts: IssueManagerOptions) {
    this.client = client;
    this.opts = opts;
    this.log = opts.logger ?? ((m) => console.log(m));
  }

  /**
   * Find open issues whose body contains the marker for `apgSlug`.
   * Returns them oldest-first (by issue number).
   */
  private async findExisting(apgSlug: string): Promise<Array<{ number: number; title: string }>> {
    const marker = markerFor(apgSlug);
    const all = await this.client.searchOpenIssuesWithLabel({
      owner: this.opts.owner,
      repo: this.opts.repo,
      label: this.opts.label,
    });
    return all
      .filter((i) => i.body.includes(marker))
      .map((i) => ({ number: i.number, title: i.title }))
      .sort((a, b) => a.number - b.number);
  }

  /**
   * For a slug with detected new commits, decide and execute the action.
   * Returns the planned action even in dry-run mode.
   *
   * `latestSha` is the newest commit SHA in this batch; we use it together
   * with the slug as a batch marker on the follow-up comment to avoid
   * re-posting the same comment when a previous run failed before persisting
   * state.
   */
  async createOrComment(params: {
    apgSlug: string;
    latestSha: string;
    draft: IssueDraft;
    followupBody: string;
  }): Promise<IssueAction> {
    const { apgSlug, latestSha, draft, followupBody } = params;
    const existing = await this.findExisting(apgSlug);

    if (existing.length === 0) {
      const action: IssueAction = { kind: 'create', apgSlug };
      this.log(`[${apgSlug}] would CREATE issue: "${draft.title}"`);
      if (!this.opts.dryRun) {
        const created = await this.client.createIssue({
          owner: this.opts.owner,
          repo: this.opts.repo,
          title: draft.title,
          body: draft.body,
          labels: [this.opts.label],
        });
        action.issueNumber = created.number;
        this.log(`[${apgSlug}]   → created #${created.number} (${created.htmlUrl})`);
      }
      return action;
    }

    const target = existing[0];
    if (existing.length > 1) {
      this.log(
        `[${apgSlug}]   WARN: ${existing.length} open issues match marker. Operating on oldest only.`
      );
    }

    // Idempotency check: if a previous run already commented for this exact
    // latest SHA (state push failed afterwards, so we're seeing the slug
    // again), skip re-posting.
    const batchMarker = batchMarkerFor(apgSlug, latestSha);
    const comments = await this.client.listIssueComments({
      owner: this.opts.owner,
      repo: this.opts.repo,
      issueNumber: target.number,
    });
    if (comments.some((c) => c.body.includes(batchMarker))) {
      this.log(
        `[${apgSlug}] SKIP: #${target.number} already has a comment for latest=${latestSha.slice(0, 7)}`
      );
      return {
        kind: 'skip',
        apgSlug,
        issueNumber: target.number,
        reason: 'duplicate-batch-marker',
      };
    }

    const action: IssueAction = {
      kind: 'comment',
      apgSlug,
      issueNumber: target.number,
    };
    this.log(`[${apgSlug}] would COMMENT on existing #${target.number}: "${target.title}"`);
    if (!this.opts.dryRun) {
      await this.client.addIssueComment({
        owner: this.opts.owner,
        repo: this.opts.repo,
        issueNumber: target.number,
        body: followupBody,
      });
      this.log(`[${apgSlug}]   → comment posted to #${target.number}`);
    }
    return action;
  }
}
