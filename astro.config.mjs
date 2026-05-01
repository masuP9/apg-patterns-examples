// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import vue from '@astrojs/vue';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

/** @typedef {'github-pages' | 'cloudflare-pages'} DeployTarget */

/**
 * Get dev server port from environment variable or generate from worktree path
 * This allows multiple worktrees to run dev servers simultaneously
 */
function getDevPort() {
  // Explicit port from environment
  if (process.env.DEV_PORT) {
    return parseInt(process.env.DEV_PORT, 10);
  }

  // Auto-generate port based on worktree path hash
  // This ensures each worktree gets a consistent, unique port
  const cwd = process.cwd();
  let hash = 0;
  for (let i = 0; i < cwd.length; i++) {
    hash = (hash * 31 + cwd.charCodeAt(i)) >>> 0;
  }
  // Port range: 4321-4399 (Astro default is 4321)
  return 4321 + (hash % 79);
}

const devPort = getDevPort();

/** @type {Record<DeployTarget, { site: string; base: string }>} */
const siteConfig = {
  'github-pages': {
    site: 'https://masup9.github.io',
    base: '/apg-patterns-examples',
  },
  'cloudflare-pages': {
    site: process.env.CF_PAGES_URL || 'https://apg-patterns-examples.pages.dev',
    base: '/',
  },
};

const deployTargetEnv = process.env.DEPLOY_TARGET || 'github-pages';

/** @type {DeployTarget} */
const deployTarget =
  deployTargetEnv in siteConfig
    ? /** @type {DeployTarget} */ (deployTargetEnv)
    : 'github-pages';

const { site, base } = siteConfig[deployTarget];

// https://astro.build/config
export default defineConfig({
  site,
  base,

  server: {
    port: devPort,
  },

  integrations: [
    react(),
    vue({
      // Disable HMR to avoid __VUE_HMR_RUNTIME__ error in development
      devtools: false,
    }),
    svelte(),
    mdx(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja'],
  },
});
