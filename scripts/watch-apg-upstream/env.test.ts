import { describe, expect, it } from 'vitest';
import { readEnv } from './env';

const tokenEnv = { GITHUB_TOKEN: 'test-token' } satisfies NodeJS.ProcessEnv;

describe('readEnv', () => {
  it('returns parsed Env for a valid set of inputs', () => {
    const env = readEnv({
      ...tokenEnv,
      DRY_RUN: 'true',
      SINCE_OVERRIDE: '2026-01-01T00:00:00Z',
      PATTERNS_FILTER: 'button,accordion',
    });
    expect(env.token).toBe('test-token');
    expect(env.dryRun).toBe(true);
    expect(env.sinceOverride).toBe('2026-01-01T00:00:00Z');
    expect(env.patternsFilter).toEqual(new Set(['button', 'accordion']));
  });

  it('returns null filters when no override / filter is set', () => {
    const env = readEnv({ ...tokenEnv });
    expect(env.dryRun).toBe(false);
    expect(env.sinceOverride).toBeNull();
    expect(env.patternsFilter).toBeNull();
  });

  it('throws when GITHUB_TOKEN is missing', () => {
    expect(() => readEnv({})).toThrow(/GITHUB_TOKEN/);
  });

  it('throws on an invalid ISO 8601 SINCE_OVERRIDE', () => {
    expect(() => readEnv({ ...tokenEnv, SINCE_OVERRIDE: 'not-a-date' })).toThrow(
      /SINCE_OVERRIDE is not a valid ISO 8601 date/
    );
  });

  it('throws on an unknown patternId in PATTERNS_FILTER (single)', () => {
    expect(() => readEnv({ ...tokenEnv, PATTERNS_FILTER: 'nonexistent' })).toThrow(
      /unknown patternId\(s\): nonexistent/
    );
  });

  it('throws and lists all unknown patternIds when multiple typos exist', () => {
    // Includes one valid id (`button`) to confirm only unknowns are reported.
    expect(() => readEnv({ ...tokenEnv, PATTERNS_FILTER: 'foo,bar,button' })).toThrow(
      /unknown patternId\(s\): foo, bar/
    );
  });

  it('treats trailing / surrounding commas and whitespace as empty entries (not unknown ids)', () => {
    // Input that humans easily produce in CI UIs. The trim+filter chain should
    // ignore the empty tokens so we do not flag them as `unknown patternId(s): `.
    const env = readEnv({ ...tokenEnv, PATTERNS_FILTER: 'button, ,accordion,' });
    expect(env.patternsFilter).toEqual(new Set(['button', 'accordion']));
  });

  it('treats a PATTERNS_FILTER containing only whitespace / commas as no filter', () => {
    const env = readEnv({ ...tokenEnv, PATTERNS_FILTER: ' , , ' });
    expect(env.patternsFilter).toBeNull();
  });
});
