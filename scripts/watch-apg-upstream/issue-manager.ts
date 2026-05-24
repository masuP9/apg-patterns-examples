/**
 * Decide whether to open a new issue, comment on an existing one, or skip
 * entirely, using HTML markers as stable identifiers.
 *
 * Markers used:
 * - body: `<!-- apg-upstream:slug=<slug> -->` (rough filter, every issue we
 *   open has this)
 * - body: `<!-- apg-upstream:latest=<sha> -->` (records the latest commit
 *   SHA the issue covers — survives the issue being closed and is checked
 *   even on closed issues so a closed/dismissed issue does not get
 *   re-created for the same commits)
 * - comment: `<!-- apg-upstream-batch:slug=<slug>;latest=<sha> -->` (extra
 *   safety net for retries: if a follow-up comment with the same latest SHA
 *   already exists, skip re-posting)
 *
 * Decision tree (for a slug with new commits whose latest SHA is `L`):
 *   1. Search all issues (open + closed) with `apg-upstream` label and the
 *      slug marker.
 *   2. If any issue body or any of its comments already references latest=L
 *      → SKIP (already covered).
 *   3. Else if at least one matching issue is open → COMMENT on the most
 *      recent open one (active investigation gets the new commits appended).
 *   4. Else (no open match: either first encounter, or all matches are
 *      closed) → CREATE a new issue.
 *
 * dry-run mode: print the action that would be taken; do NOT call any
 * mutating endpoint.
 */
import type { GitHubClient, IssueSummary } from './github-client';
import type { IssueDraft } from './issue-formatter';
import { batchMarkerFor, latestMarkerFor, markerFor } from './issue-formatter';

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
   * Find all issues (open + closed) whose body carries the slug marker.
   * Returned newest-first by issue number so that recent activity wins when
   * we pick a comment target.
   */
  private async findMatchingIssues(apgSlug: string): Promise<IssueSummary[]> {
    const slugMarker = markerFor(apgSlug);
    const all = await this.client.searchIssuesWithLabel({
      owner: this.opts.owner,
      repo: this.opts.repo,
      label: this.opts.label,
      state: 'all',
    });
    return all.filter((i) => i.body.includes(slugMarker)).sort((a, b) => b.number - a.number);
  }

  async createOrComment(params: {
    apgSlug: string;
    latestSha: string;
    draft: IssueDraft;
    followupBody: string;
  }): Promise<IssueAction> {
    const { apgSlug, latestSha, draft, followupBody } = params;
    const matching = await this.findMatchingIssues(apgSlug);
    const latestMarker = latestMarkerFor(latestSha);
    const batchMarker = batchMarkerFor(apgSlug, latestSha);

    // (2) Skip if any matching issue body already references this SHA.
    const sameShaInBody = matching.find((i) => i.body.includes(latestMarker));
    if (sameShaInBody) {
      this.log(
        `[${apgSlug}] SKIP: ${sameShaInBody.state} issue #${sameShaInBody.number} already covers latest=${latestSha.slice(0, 7)}`
      );
      return {
        kind: 'skip',
        apgSlug,
        issueNumber: sameShaInBody.number,
        reason: 'same-latest-sha-in-body',
      };
    }

    // (2b) Or any follow-up comment already references this batch.
    // We only check the most recent open issue's comments — closed issues
    // shouldn't have stale comments worth checking.
    const openMatches = matching.filter((i) => i.state === 'open');
    if (openMatches.length > 0) {
      const target = openMatches[0];
      const comments = await this.client.listIssueComments({
        owner: this.opts.owner,
        repo: this.opts.repo,
        issueNumber: target.number,
      });
      if (comments.some((c) => c.body.includes(batchMarker))) {
        this.log(
          `[${apgSlug}] SKIP: open #${target.number} already has a comment for latest=${latestSha.slice(0, 7)}`
        );
        return {
          kind: 'skip',
          apgSlug,
          issueNumber: target.number,
          reason: 'duplicate-batch-comment',
        };
      }

      // (3) Open issue exists but doesn't cover this SHA — add a follow-up.
      if (openMatches.length > 1) {
        this.log(
          `[${apgSlug}]   WARN: ${openMatches.length} open issues match marker. Operating on newest only.`
        );
      }
      this.log(`[${apgSlug}] would COMMENT on open #${target.number}: "${target.title}"`);
      if (!this.opts.dryRun) {
        await this.client.addIssueComment({
          owner: this.opts.owner,
          repo: this.opts.repo,
          issueNumber: target.number,
          body: followupBody,
        });
        this.log(`[${apgSlug}]   → comment posted to #${target.number}`);
      }
      return { kind: 'comment', apgSlug, issueNumber: target.number };
    }

    // (4) No open match. Either truly first encounter, or all prior matches
    // were closed by the user as "no action needed". Create a fresh issue
    // for this new batch; the latest marker in its body prevents
    // re-creation if the watcher runs again for the same SHA.
    const action: IssueAction = { kind: 'create', apgSlug };
    if (matching.length > 0) {
      this.log(
        `[${apgSlug}] all ${matching.length} prior issue(s) closed; CREATE a new one for latest=${latestSha.slice(0, 7)}`
      );
    } else {
      this.log(`[${apgSlug}] would CREATE issue: "${draft.title}"`);
    }
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
}
