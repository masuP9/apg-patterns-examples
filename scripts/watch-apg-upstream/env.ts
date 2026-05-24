/**
 * Environment variable parsing for the APG upstream watcher entrypoint.
 *
 * Kept separate from `watch-apg-upstream.ts` so that the validation can be
 * unit-tested without executing the watcher's `main()` at module load.
 */
import { PATTERNS } from '../../src/lib/patterns';

export interface Env {
  token: string;
  dryRun: boolean;
  sinceOverride: string | null;
  patternsFilter: Set<string> | null;
}

/**
 * Parse and validate the watcher's environment inputs.
 *
 * @param env  Process environment to read from. Defaults to `process.env`;
 *             tests pass a plain object so they do not have to mutate global
 *             state.
 *
 * Throws (`Error`) on:
 * - missing `GITHUB_TOKEN`
 * - `SINCE_OVERRIDE` that is not a valid ISO 8601 / `Date`-parsable string
 * - `PATTERNS_FILTER` containing any patternId that is not in `PATTERNS`
 *   (all unknown ids are reported in a single error so multiple typos can be
 *   fixed at once)
 */
export function readEnv(env: NodeJS.ProcessEnv = process.env): Env {
  const token = env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is required');

  const dryRun = env.DRY_RUN === 'true';

  const sinceOverrideRaw = env.SINCE_OVERRIDE?.trim() || null;
  let sinceOverride: string | null = null;
  if (sinceOverrideRaw) {
    const parsed = new Date(sinceOverrideRaw);
    if (Number.isNaN(parsed.getTime())) {
      throw new Error(
        `SINCE_OVERRIDE is not a valid ISO 8601 date: ${JSON.stringify(sinceOverrideRaw)}`
      );
    }
    sinceOverride = sinceOverrideRaw;
  }

  const patternsFilterRaw = env.PATTERNS_FILTER?.trim();
  let patternsFilter: Set<string> | null = null;
  if (patternsFilterRaw) {
    const requested = patternsFilterRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (requested.length > 0) {
      const validIds = new Set(PATTERNS.map((p) => p.id));
      const unknown = requested.filter((id) => !validIds.has(id));
      if (unknown.length > 0) {
        const sortedValid = [...validIds].sort().join(', ');
        throw new Error(
          `PATTERNS_FILTER contains unknown patternId(s): ${unknown.join(', ')}. ` +
            `Valid ids: ${sortedValid}`
        );
      }
      patternsFilter = new Set(requested);
    }
  }

  return { token, dryRun, sinceOverride, patternsFilter };
}
