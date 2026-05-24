/**
 * Read/write the persistent watcher state file at `.github/apg-state.json`.
 *
 * The state records the last APG slug commit we've already turned into an issue,
 * keyed by APG slug. On first encounter of a slug we record the latest upstream
 * commit as a baseline (no issue) so we don't drown reviewers in years of
 * historical commits.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

export const STATE_SCHEMA_VERSION = 1;
export const STATE_FILE = '.github/apg-state.json';

export interface PerSlugState {
  lastSeenSha: string;
  lastSeenDate: string; // ISO 8601, used to compute `since` for next request
}

export interface WatcherState {
  schemaVersion: number;
  lastRun: string | null;
  patterns: Record<string, PerSlugState>;
}

export function loadState(filePath: string = STATE_FILE): WatcherState {
  if (!existsSync(filePath)) {
    return { schemaVersion: STATE_SCHEMA_VERSION, lastRun: null, patterns: {} };
  }
  const raw = readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw) as Partial<WatcherState>;
  if (parsed.schemaVersion !== STATE_SCHEMA_VERSION) {
    throw new Error(
      `apg-state.json schemaVersion mismatch: expected ${STATE_SCHEMA_VERSION}, got ${String(parsed.schemaVersion)}. Aborting to avoid silent data loss.`
    );
  }
  return {
    schemaVersion: STATE_SCHEMA_VERSION,
    lastRun: parsed.lastRun ?? null,
    patterns: parsed.patterns ?? {},
  };
}

export function saveState(state: WatcherState, filePath: string = STATE_FILE): void {
  const ordered: WatcherState = {
    schemaVersion: state.schemaVersion,
    lastRun: state.lastRun,
    patterns: Object.fromEntries(
      Object.entries(state.patterns).sort(([a], [b]) => a.localeCompare(b))
    ),
  };
  writeFileSync(filePath, JSON.stringify(ordered, null, 2) + '\n');
}

/**
 * Compute the `since` parameter to pass to GitHub's commits API.
 * Returns null when this slug has never been seen — caller should treat that as
 * "first encounter" and only record a baseline, not create an issue.
 */
export function sinceFor(state: WatcherState, apgSlug: string): string | null {
  const entry = state.patterns[apgSlug];
  if (!entry) return null;
  // GitHub `since` is inclusive, so step 1 second past lastSeenDate to avoid
  // re-yielding the same commit.
  const next = new Date(new Date(entry.lastSeenDate).getTime() + 1000);
  return next.toISOString();
}

export function recordSeen(state: WatcherState, apgSlug: string, sha: string, date: string): void {
  state.patterns[apgSlug] = { lastSeenSha: sha, lastSeenDate: date };
}
