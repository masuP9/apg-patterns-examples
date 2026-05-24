/**
 * APG Upstream Watcher entrypoint.
 *
 * Polls w3c/aria-practices commits per APG slug (one slug = one issue) and
 * creates / comments issues on this repo. Designed to run daily via the
 * `apg-upstream-watch.yml` workflow but also runnable locally.
 *
 * Environment variables:
 *   GITHUB_TOKEN       (required) Token with `issues: write` for this repo.
 *                                 Read access to upstream is fine via public API.
 *   DRY_RUN            "true" to print intended actions without mutating.
 *   SINCE_OVERRIDE     ISO8601 timestamp to use instead of stored state for ALL slugs.
 *                      Useful for the first wet-run to backfill recent activity.
 *   PATTERNS_FILTER    Comma-separated patternIds; only slugs containing one of
 *                      these patterns will be processed.
 */
import {
  ISSUE_LABEL,
  REQUEST_SPACING_MS,
  TARGET_OWNER,
  TARGET_REPO,
  UPSTREAM_OWNER,
  UPSTREAM_PATH_PREFIX,
  UPSTREAM_REPO,
  UPSTREAM_REPO_FULL,
} from './watch-apg-upstream/config';
import { GitHubClient } from './watch-apg-upstream/github-client';
import { formatFollowupComment, formatIssue } from './watch-apg-upstream/issue-formatter';
import { IssueManager } from './watch-apg-upstream/issue-manager';
import { buildSlugMap, type SlugMapping } from './watch-apg-upstream/slug-resolver';
import {
  loadState,
  recordSeen,
  saveState,
  sinceFor,
  STATE_FILE,
  STATE_SCHEMA_VERSION,
} from './watch-apg-upstream/state';

interface Env {
  token: string;
  dryRun: boolean;
  sinceOverride: string | null;
  patternsFilter: Set<string> | null;
}

function readEnv(): Env {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is required');
  const dryRun = process.env.DRY_RUN === 'true';
  const sinceOverride = process.env.SINCE_OVERRIDE?.trim() || null;
  const patternsFilterRaw = process.env.PATTERNS_FILTER?.trim();
  const patternsFilter = patternsFilterRaw
    ? new Set(
        patternsFilterRaw
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      )
    : null;
  return { token, dryRun, sinceOverride, patternsFilter };
}

function shouldProcess(mapping: SlugMapping, filter: Set<string> | null): boolean {
  if (!filter) return true;
  if (filter.has(mapping.primaryPattern.id)) return true;
  return mapping.relatedPatterns.some((p) => filter.has(p.id));
}

async function main(): Promise<void> {
  const env = readEnv();
  console.log(`APG Upstream Watcher (dryRun=${env.dryRun})`);
  console.log(`  upstream: ${UPSTREAM_REPO_FULL}`);
  console.log(`  target: ${TARGET_OWNER}/${TARGET_REPO}`);
  if (env.sinceOverride) console.log(`  SINCE_OVERRIDE=${env.sinceOverride}`);
  if (env.patternsFilter) console.log(`  PATTERNS_FILTER=${[...env.patternsFilter].join(',')}`);

  const { map, skipped } = await buildSlugMap();
  console.log(`  slug count: ${map.size}, skipped patterns: ${skipped.length}`);
  if (skipped.length > 0) {
    console.warn(`  WARN: skipped patterns (no APG URL): ${skipped.join(', ')}`);
  }

  const state = loadState();
  const client = new GitHubClient({ token: env.token, requestSpacingMs: REQUEST_SPACING_MS });
  const manager = new IssueManager(client, {
    owner: TARGET_OWNER,
    repo: TARGET_REPO,
    label: ISSUE_LABEL,
    dryRun: env.dryRun,
  });

  let createdOrCommented = 0;
  let baselined = 0;
  let unchanged = 0;
  const errors: string[] = [];

  for (const [apgSlug, mapping] of map) {
    if (!shouldProcess(mapping, env.patternsFilter)) continue;

    const previousSha = state.patterns[apgSlug]?.lastSeenSha ?? null;
    const since = env.sinceOverride ?? sinceFor(state, apgSlug);
    const firstEncounter = previousSha === null && !env.sinceOverride;

    let commits;
    try {
      commits = await client.listCommitsForPath({
        owner: UPSTREAM_OWNER,
        repo: UPSTREAM_REPO,
        path: `${UPSTREAM_PATH_PREFIX}/${apgSlug}`,
        since: since ?? undefined,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`[${apgSlug}] ${msg}`);
      console.error(`[${apgSlug}] API error: ${msg}`);
      continue;
    }

    // Filter out any commit equal to lastSeenSha as a defensive cross-check
    // (since the `since` filter is inclusive at second-resolution).
    const newCommits = previousSha ? commits.filter((c) => c.sha !== previousSha) : commits;

    if (newCommits.length === 0) {
      console.log(`[${apgSlug}] no new commits`);
      unchanged++;
      continue;
    }

    const latest = newCommits[0]; // GitHub returns newest first

    if (firstEncounter) {
      console.log(
        `[${apgSlug}] first encounter, recording baseline ${latest.sha.slice(0, 7)} ` +
          `(skipping ${newCommits.length} historical commits)`
      );
      recordSeen(state, apgSlug, latest.sha, latest.committerDate);
      baselined++;
      continue;
    }

    const until = new Date().toISOString();
    const draft = formatIssue({
      mapping,
      commits: newCommits,
      since: since ?? 'baseline',
      until,
      previousSha,
      upstreamRepo: UPSTREAM_REPO_FULL,
    });
    const followupBody = formatFollowupComment({
      apgSlug,
      commits: newCommits,
      since: since ?? 'baseline',
      until,
    });

    try {
      await manager.createOrComment({
        apgSlug,
        latestSha: latest.sha,
        draft,
        followupBody,
      });
      recordSeen(state, apgSlug, latest.sha, latest.committerDate);
      createdOrCommented++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`[${apgSlug}] issue write failed: ${msg}`);
      console.error(`[${apgSlug}] issue write error: ${msg}`);
    }
  }

  state.lastRun = new Date().toISOString();
  state.schemaVersion = STATE_SCHEMA_VERSION;

  if (env.dryRun) {
    console.log('\n[dry-run] would not write state file');
  } else {
    saveState(state);
    console.log(`\nState written to ${STATE_FILE}`);
  }

  console.log(
    `\nSummary: created/commented=${createdOrCommented}, baselined=${baselined}, unchanged=${unchanged}, errors=${errors.length}`
  );
  if (errors.length > 0) {
    console.error('\nErrors:');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
