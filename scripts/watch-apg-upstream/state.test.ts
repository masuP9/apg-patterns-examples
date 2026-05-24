import { mkdtempSync, rmSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadState, recordSeen, saveState, sinceFor, STATE_SCHEMA_VERSION } from './state';

let tmp: string;
let statePath: string;

beforeEach(() => {
  tmp = mkdtempSync(join(tmpdir(), 'apg-state-'));
  statePath = join(tmp, 'state.json');
});

afterEach(() => {
  rmSync(tmp, { recursive: true, force: true });
});

describe('loadState', () => {
  it('returns an empty state when the file is missing', () => {
    const state = loadState(statePath);
    expect(state).toEqual({
      schemaVersion: STATE_SCHEMA_VERSION,
      lastRun: null,
      patterns: {},
    });
  });

  it('round-trips through save/load', () => {
    const initial = {
      schemaVersion: STATE_SCHEMA_VERSION,
      lastRun: '2026-05-24T00:00:00.000Z',
      patterns: {
        button: { lastSeenSha: 'abc', lastSeenDate: '2026-05-23T10:00:00.000Z' },
      },
    };
    saveState(initial, statePath);
    expect(existsSync(statePath)).toBe(true);
    const loaded = loadState(statePath);
    expect(loaded).toEqual(initial);
  });

  it('aborts when schemaVersion does not match', () => {
    writeFileSync(statePath, JSON.stringify({ schemaVersion: 99, lastRun: null, patterns: {} }));
    expect(() => loadState(statePath)).toThrow(/schemaVersion mismatch/);
  });
});

describe('saveState', () => {
  it('sorts pattern keys alphabetically for stable diffs', () => {
    saveState(
      {
        schemaVersion: STATE_SCHEMA_VERSION,
        lastRun: null,
        patterns: {
          treeview: { lastSeenSha: 't', lastSeenDate: '2026-01-01T00:00:00Z' },
          button: { lastSeenSha: 'b', lastSeenDate: '2026-01-01T00:00:00Z' },
          radio: { lastSeenSha: 'r', lastSeenDate: '2026-01-01T00:00:00Z' },
        },
      },
      statePath
    );
    const text = readFileSync(statePath, 'utf-8');
    const buttonIdx = text.indexOf('"button"');
    const radioIdx = text.indexOf('"radio"');
    const treeviewIdx = text.indexOf('"treeview"');
    expect(buttonIdx).toBeLessThan(radioIdx);
    expect(radioIdx).toBeLessThan(treeviewIdx);
  });
});

describe('sinceFor', () => {
  it('returns null for unknown slug (first encounter / baseline path)', () => {
    const state = loadState(statePath);
    expect(sinceFor(state, 'button')).toBeNull();
  });

  it('returns lastSeenDate + 1 second to avoid re-yielding the watermark commit', () => {
    const state = loadState(statePath);
    recordSeen(state, 'button', 'abc', '2026-05-23T10:00:00.000Z');
    expect(sinceFor(state, 'button')).toBe('2026-05-23T10:00:01.000Z');
  });
});

describe('recordSeen', () => {
  it('overwrites prior entries for the same slug', () => {
    const state = loadState(statePath);
    recordSeen(state, 'button', 'oldsha', '2026-01-01T00:00:00.000Z');
    recordSeen(state, 'button', 'newsha', '2026-05-24T00:00:00.000Z');
    expect(state.patterns.button).toEqual({
      lastSeenSha: 'newsha',
      lastSeenDate: '2026-05-24T00:00:00.000Z',
    });
  });
});
