/**
 * i18n module - main export
 */

// Utils
export {
  type Locale,
  defaultLocale,
  locales,
  getLocaleFromUrl,
  getLocalizedPath,
  getAlternatePath,
  isValidLocale,
  getLanguageName,
} from './utils';

// UI translations
export { ui, type UIKey, useTranslation, t } from './ui';

// Pattern translations
export { getPatternTranslation, getPatternName, getPatternDescription } from './patterns';
