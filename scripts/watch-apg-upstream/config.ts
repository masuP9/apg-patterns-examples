/**
 * Watcher-wide constants. Override at runtime via environment variables in
 * `watch-apg-upstream.ts` rather than editing here.
 */
export const UPSTREAM_OWNER = 'w3c';
export const UPSTREAM_REPO = 'aria-practices';
export const UPSTREAM_REPO_FULL = `${UPSTREAM_OWNER}/${UPSTREAM_REPO}`;

export const TARGET_OWNER = 'masuP9';
export const TARGET_REPO = 'apg-patterns-examples';

export const ISSUE_LABEL = 'apg-upstream';

/** Path inside upstream repo prefix; combined with apgSlug for `?path=` filter. */
export const UPSTREAM_PATH_PREFIX = 'content/patterns';

/** Delay between upstream API calls to stay clear of secondary rate limits. */
export const REQUEST_SPACING_MS = 100;
