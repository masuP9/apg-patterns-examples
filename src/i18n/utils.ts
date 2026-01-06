/**
 * i18n utility functions
 *
 * Based on Astro i18n recipe:
 * https://docs.astro.build/en/recipes/i18n/
 */

import { languages, defaultLang, showDefaultLang, type Locale } from './ui';

// Re-export for convenience
export type { Locale };
export { languages, defaultLang, showDefaultLang };

// Derived values
export const locales = Object.keys(languages) as Locale[];

/**
 * Get locale from URL path
 * /ja/patterns/... -> 'ja'
 * /patterns/... -> 'en'
 */
export function getLangFromUrl(url: URL): Locale {
  const pathname = url.pathname;
  // Handle base path (e.g., /apg-patterns-examples/)
  const pathWithoutBase = pathname.replace(/^\/apg-patterns-examples/, '');
  const segments = pathWithoutBase.split('/').filter(Boolean);

  if (segments[0] && segments[0] in languages) {
    return segments[0] as Locale;
  }
  return defaultLang;
}

// Alias for backwards compatibility
export const getLocaleFromUrl = getLangFromUrl;

/**
 * Get localized path (useTranslatedPath equivalent)
 * For 'ja': /patterns/button/ -> /ja/patterns/button/
 * For 'en': /ja/patterns/button/ -> /patterns/button/
 */
export function useTranslatedPath(lang: Locale) {
  return function translatePath(path: string, l: Locale = lang): string {
    // Remove leading slash for processing
    const cleanPath = path.replace(/^\//, '');

    // Remove existing locale prefix if present
    const pathWithoutLocale = cleanPath.replace(/^(ja|en)\//, '');

    // Add locale prefix based on showDefaultLang setting
    if (!showDefaultLang && l === defaultLang) {
      return `/${pathWithoutLocale}`;
    }
    return `/${l}/${pathWithoutLocale}`;
  };
}

// Simpler version for direct use
export function getLocalizedPath(path: string, lang: Locale): string {
  return useTranslatedPath(lang)(path);
}

/**
 * Get the alternate language path for language switcher
 */
export function getAlternatePath(currentPath: string, currentLang: Locale): string {
  const targetLang = currentLang === 'en' ? 'ja' : 'en';
  return getLocalizedPath(currentPath, targetLang);
}

/**
 * Check if a locale is valid
 */
export function isValidLocale(locale: string): locale is Locale {
  return locale in languages;
}
