/**
 * Build a mapping from APG slug to the site's primary / related patternIds.
 *
 * APG slug is extracted from each pattern's `meta.ts` `resources[].href` field
 * (the canonical APG documentation URL). Some site patterns share an APG slug
 * (e.g. `button` is parent of `toggle-button`, `grid` is parent of `data-grid`),
 * so one APG slug can map to a primary patternId plus zero or more related ones.
 */
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { PATTERNS, type Pattern } from '../../src/lib/patterns';
import type { PatternMeta } from '../../src/lib/pattern-meta-types';

const APG_URL_RE = /^https?:\/\/www\.w3\.org\/WAI\/ARIA\/apg\/patterns\/([^/]+)\//;

export interface SlugMapping {
  apgSlug: string;
  primaryPattern: Pattern;
  relatedPatterns: Pattern[];
}

export type SlugMap = Map<string, SlugMapping>;

async function extractApgSlug(patternId: string): Promise<string | undefined> {
  const metaPath = path.resolve(process.cwd(), `src/patterns/${patternId}/meta.ts`);
  const mod = (await import(pathToFileURL(metaPath).href)) as { default?: PatternMeta };
  const meta = mod.default;
  if (!meta?.resources) return undefined;
  for (const r of meta.resources) {
    const m = APG_URL_RE.exec(r.href);
    if (m) return m[1];
  }
  return undefined;
}

/**
 * The "primary" pattern for an APG slug is the one whose id matches the slug
 * most closely. Heuristic, in order of preference:
 *   1. Exact id === slug
 *   2. Currently-set primary is exact match — keep it
 *   3. Shorter id wins (e.g. `button` over `toggle-button`)
 */
function isMorePrimary(candidate: Pattern, current: Pattern, apgSlug: string): boolean {
  if (candidate.id === apgSlug && current.id !== apgSlug) return true;
  if (current.id === apgSlug) return false;
  return candidate.id.length < current.id.length;
}

export async function buildSlugMap(): Promise<{ map: SlugMap; skipped: string[] }> {
  const map: SlugMap = new Map();
  const skipped: string[] = [];

  for (const pattern of PATTERNS) {
    const apgSlug = await extractApgSlug(pattern.id);
    if (!apgSlug) {
      skipped.push(pattern.id);
      continue;
    }
    const existing = map.get(apgSlug);
    if (!existing) {
      map.set(apgSlug, { apgSlug, primaryPattern: pattern, relatedPatterns: [] });
      continue;
    }
    if (isMorePrimary(pattern, existing.primaryPattern, apgSlug)) {
      existing.relatedPatterns.push(existing.primaryPattern);
      existing.primaryPattern = pattern;
    } else {
      existing.relatedPatterns.push(pattern);
    }
  }

  return { map, skipped };
}
