/**
 * i18n module - main export
 *
 * Based on Astro i18n recipe:
 * https://docs.astro.build/en/recipes/i18n/
 */

// Configuration (from ui.ts)
export { languages, defaultLang, showDefaultLang, type Locale } from './ui';

// Utils
export {
  locales,
  getLangFromUrl,
  getLocaleFromUrl, // alias
  getLocalizedPath,
  useTranslatedPath,
  getAlternatePath,
  isValidLocale,
} from './utils';

// UI translations
export { ui, type UIKey, useTranslation, t } from './ui';

// Pattern translations
export { getPatternTranslation, getPatternName, getPatternDescription } from './patterns';

// Practice translations
export { getPracticeTranslation, getPracticeName, getPracticeDescription } from './practices';
