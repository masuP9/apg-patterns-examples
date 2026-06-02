import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Prepends the base URL to a path for internal links.
 * This ensures links work correctly when deployed to a subdirectory (e.g., GitHub Pages).
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  // Remove trailing slash from base and leading slash from path to avoid double slashes
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

/**
 * Strips the configured base URL prefix from a pathname (inverse of withBase).
 * `/apg-patterns-examples/ja/patterns` → `/ja/patterns`; root deploys are no-ops.
 * Derived from `import.meta.env.BASE_URL`, so it works for any deploy target.
 */
export function removeBasePath(pathname: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  if (base && (pathname === base || pathname.startsWith(`${base}/`))) {
    return pathname.slice(base.length) || '/';
  }
  return pathname;
}
