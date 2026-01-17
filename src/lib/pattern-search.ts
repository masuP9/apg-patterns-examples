/**
 * Pattern Search utilities
 *
 * Helper functions for URL building and framework/locale detection
 * used by the PatternSearch component.
 */

import { DEFAULT_FRAMEWORK, FRAMEWORKS, isValidFramework, type Framework } from './frameworks';
import { withBase } from './utils';

/**
 * Storage key for the selected framework preference
 */
const FRAMEWORK_STORAGE_KEY = 'apg-selected-framework';

/**
 * Supported locales
 */
type Locale = 'en' | 'ja';

/**
 * Get base path from environment or default
 * Works at runtime by checking common base path patterns
 */
function getBasePath(): string {
  // Try to get from Vite/Astro env (available at build time)
  if (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) {
    const base = import.meta.env.BASE_URL;
    // Remove trailing slash
    return base.endsWith('/') ? base.slice(0, -1) : base;
  }
  return '';
}

/**
 * Remove base path from pathname for consistent path parsing
 */
function removeBasePath(pathname: string): string {
  const basePath = getBasePath();
  if (basePath && pathname.startsWith(basePath)) {
    return pathname.slice(basePath.length) || '/';
  }
  return pathname;
}

/**
 * Extract locale from document or pathname
 */
export function getLocaleFromDocument(): Locale {
  // First try document.documentElement.lang
  if (typeof document !== 'undefined') {
    const lang = document.documentElement.lang;
    if (lang === 'ja') {
      return 'ja';
    }
  }

  // Fallback to pathname check
  if (typeof window !== 'undefined') {
    const pathWithoutBase = removeBasePath(window.location.pathname);
    if (pathWithoutBase.startsWith('/ja/') || pathWithoutBase === '/ja') {
      return 'ja';
    }
  }

  return 'en';
}

/**
 * Extract framework from current URL path
 * Returns undefined if not on a pattern page
 */
export function getFrameworkFromPath(): Framework | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const pathWithoutBase = removeBasePath(window.location.pathname);

  // Match patterns like /patterns/{pattern-id}/{framework}/ or /ja/patterns/{pattern-id}/{framework}/
  const match = pathWithoutBase.match(/\/patterns\/[^/]+\/([^/]+)\/?$/);

  if (match && match[1]) {
    const framework = match[1];
    if (isValidFramework(framework)) {
      return framework;
    }
  }

  return undefined;
}

/**
 * Get preferred framework from localStorage
 */
export function getStoredFramework(): Framework | undefined {
  if (typeof localStorage === 'undefined') {
    return undefined;
  }

  try {
    const stored = localStorage.getItem(FRAMEWORK_STORAGE_KEY);
    if (stored && isValidFramework(stored)) {
      return stored;
    }
  } catch {
    // localStorage may be unavailable
  }

  return undefined;
}

/**
 * Get the preferred framework with fallback chain:
 * 1. Current URL path (if on a pattern page)
 * 2. localStorage preference
 * 3. Default framework
 */
export function getPreferredFramework(): Framework {
  return getFrameworkFromPath() ?? getStoredFramework() ?? DEFAULT_FRAMEWORK;
}

/**
 * Build URL for a pattern page
 */
export function buildPatternUrl(
  patternId: string,
  framework: Framework = DEFAULT_FRAMEWORK,
  locale: Locale = 'en'
): string {
  const basePath =
    locale === 'ja'
      ? `/ja/patterns/${patternId}/${framework}/`
      : `/patterns/${patternId}/${framework}/`;
  return withBase(basePath);
}

/**
 * Export types and constants for use in components
 */
export { FRAMEWORKS, type Framework, type Locale };
