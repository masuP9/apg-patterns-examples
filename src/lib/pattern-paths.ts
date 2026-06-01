/**
 * Pattern definition file (llm.md) path helpers
 *
 * Centralizes the locale-aware URL / filename rules for AI-friendly
 * definition files so that the guide page and AiGuideActions share a
 * single source of truth.
 *
 * Routing responsibility is kept out of `patterns.ts` (pure pattern data)
 * on purpose. These helpers return locale-prefixed paths WITHOUT the base
 * path; callers must apply `withBase()` themselves.
 *
 * Serving routes:
 * - en: src/pages/patterns/[pattern]/[file].md.ts        (file = `${id}`)
 * - ja: src/pages/ja/patterns/[pattern]/[file].md.ts     (file = `${id}.ja`)
 */

import { type Locale, getLocalizedPath } from '@/i18n';

/**
 * Definition file name for a pattern.
 * - en: `${id}.md`
 * - ja: `${id}.ja.md`
 */
export function getPatternDefinitionFileName(id: string, locale: Locale): string {
  return locale === 'ja' ? `${id}.ja.md` : `${id}.md`;
}

/**
 * Locale-aware path to a pattern's definition file (without base path).
 * - en: `/patterns/${id}/${id}.md`
 * - ja: `/ja/patterns/${id}/${id}.ja.md`
 */
export function getPatternDefinitionPath(id: string, locale: Locale): string {
  const fileName = getPatternDefinitionFileName(id, locale);
  return getLocalizedPath(`/patterns/${id}/${fileName}`, locale);
}
