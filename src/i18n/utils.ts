/**
 * i18n utility functions
 */

export type Locale = 'en' | 'ja';

export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en', 'ja'];

/**
 * Get locale from URL path
 * /ja/patterns/... -> 'ja'
 * /patterns/... -> 'en'
 */
export function getLocaleFromUrl(url: URL): Locale {
  const pathname = url.pathname;
  // Handle base path (e.g., /apg-patterns-examples/)
  const pathWithoutBase = pathname.replace(/^\/apg-patterns-examples/, '');
  const segments = pathWithoutBase.split('/').filter(Boolean);

  if (segments[0] && locales.includes(segments[0] as Locale) && segments[0] !== defaultLocale) {
    return segments[0] as Locale;
  }
  return defaultLocale;
}

/**
 * Get localized path
 * For 'ja': /patterns/button/ -> /ja/patterns/button/
 * For 'en': /ja/patterns/button/ -> /patterns/button/
 */
export function getLocalizedPath(path: string, locale: Locale): string {
  // Remove leading slash for processing
  const cleanPath = path.replace(/^\//, '');

  // Remove existing locale prefix if present
  const pathWithoutLocale = cleanPath.replace(/^(ja|en)\//, '');

  // Add locale prefix for non-default locales
  if (locale === defaultLocale) {
    return `/${pathWithoutLocale}`;
  }
  return `/${locale}/${pathWithoutLocale}`;
}

/**
 * Get the alternate language path for language switcher
 */
export function getAlternatePath(currentPath: string, currentLocale: Locale): string {
  const targetLocale = currentLocale === 'en' ? 'ja' : 'en';
  return getLocalizedPath(currentPath, targetLocale);
}

/**
 * Check if a locale is valid
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Get language name for display
 */
export function getLanguageName(locale: Locale): string {
  const names: Record<Locale, string> = {
    en: 'English',
    ja: '日本語',
  };
  return names[locale];
}
