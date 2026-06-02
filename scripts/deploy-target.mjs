// @ts-check
/**
 * Single source of truth for the deploy-target → (site, base, dev port) contract.
 *
 * This is the Node/tooling side of the base-path contract, shared by
 * `astro.config.mjs`, `playwright.config.ts`, and `scripts/axe-check.mjs` so the
 * three can never drift (previously each computed base / dev port independently,
 * which caused local dev and the e2e config to disagree on the base path).
 *
 * App-runtime code (components, i18n) must NOT import this — it uses
 * `import.meta.env.BASE_URL` instead (see `src/lib/base-path.ts`). Both derive
 * from the same Astro `base`, just in different execution contexts.
 *
 * @typedef {'github-pages' | 'cloudflare-pages'} DeployTarget
 * @typedef {{ deployTarget: DeployTarget, site: string, basePath: string }} SiteConfig
 */

/** @type {DeployTarget} */
export const DEFAULT_DEPLOY_TARGET = 'github-pages';

/**
 * Resolve the deploy target from an env-like object.
 * Unset → default (github-pages). An explicit but unknown value fails fast.
 *
 * @param {Record<string, string | undefined>} [env]
 * @returns {DeployTarget}
 */
export function resolveDeployTarget(env = process.env) {
  const raw = env.DEPLOY_TARGET;
  if (!raw) return DEFAULT_DEPLOY_TARGET;
  if (raw === 'github-pages' || raw === 'cloudflare-pages') return raw;
  throw new Error(`Unknown DEPLOY_TARGET="${raw}". Expected "github-pages" or "cloudflare-pages".`);
}

/**
 * Resolve site + base path for the active deploy target.
 *
 * @param {Record<string, string | undefined>} [env]
 * @returns {SiteConfig}
 */
export function getSiteConfig(env = process.env) {
  const deployTarget = resolveDeployTarget(env);
  if (deployTarget === 'cloudflare-pages') {
    return {
      deployTarget,
      site: env.CF_PAGES_URL || 'https://apg-patterns-examples.pages.dev',
      basePath: '/',
    };
  }
  return {
    deployTarget,
    site: 'https://masup9.github.io',
    basePath: '/apg-patterns-examples',
  };
}

/**
 * Dev server port: explicit DEV_PORT, otherwise a stable per-worktree port
 * derived from the cwd hash so multiple worktrees can run dev simultaneously.
 * Range: 4321–4399 (Astro default is 4321).
 *
 * @param {Record<string, string | undefined>} [env]
 * @param {string} [cwd]
 * @returns {number}
 */
export function getDevPort(env = process.env, cwd = process.cwd()) {
  if (env.DEV_PORT) {
    const port = parseInt(env.DEV_PORT, 10);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error(`Invalid DEV_PORT="${env.DEV_PORT}". Expected an integer in 1–65535.`);
    }
    return port;
  }
  let hash = 0;
  for (let i = 0; i < cwd.length; i++) {
    hash = (hash * 31 + cwd.charCodeAt(i)) >>> 0;
  }
  return 4321 + (hash % 79);
}

/**
 * Normalize a base path to a URL path with a single trailing slash.
 * `/` → `/`, `/apg-patterns-examples` → `/apg-patterns-examples/`.
 *
 * @param {string} basePath
 * @returns {string}
 */
export function toBaseUrlPath(basePath) {
  if (basePath === '/' || basePath === '') return '/';
  return `${basePath.replace(/\/+$/, '')}/`;
}

/**
 * Full local base URL including the base path, e.g.
 * `http://localhost:4336/apg-patterns-examples/`.
 *
 * @param {Record<string, string | undefined>} [env]
 * @param {string} [cwd]
 * @returns {string}
 */
export function getLocalBaseUrl(env = process.env, cwd = process.cwd()) {
  const { basePath } = getSiteConfig(env);
  const port = getDevPort(env, cwd);
  return `http://localhost:${port}${toBaseUrlPath(basePath)}`;
}
