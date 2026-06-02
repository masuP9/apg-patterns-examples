// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import vue from '@astrojs/vue';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

import { getDevPort, getSiteConfig } from './scripts/deploy-target.mjs';

const devPort = getDevPort();

// Single source of truth for the deploy-target → (site, base) contract.
// Shared with playwright.config.ts and scripts/axe-check.mjs (see deploy-target.mjs).
const { site, basePath: base } = getSiteConfig();

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

  redirects: buildPatternRedirects(
    [
      ['radio-group', 'radio'],
      ['tree-view', 'treeview'],
      ['window-splitter', 'windowsplitter'],
    ],
    base
  ),
});

/**
 * Build redirects for old → new pattern slugs across all framework / locale / demo combinations.
 * Astro requires destinations to match concrete routes, so every framework is expanded explicitly.
 * The destination needs the base path prefix because Astro does not inject it into the generated
 * `<meta http-equiv="refresh">` URL.
 * @param {Array<[string, string]>} pairs
 * @param {string} basePath
 */
function buildPatternRedirects(pairs, basePath) {
  const frameworks = ['react', 'vue', 'svelte', 'astro'];
  const localePrefixes = ['', '/ja'];
  const baseSegment = basePath === '/' ? '' : basePath.replace(/\/$/, '');
  /** @type {Record<string, string>} */
  const map = {};
  for (const [oldSlug, newSlug] of pairs) {
    for (const locale of localePrefixes) {
      map[`${locale}/patterns/${oldSlug}`] = `${baseSegment}${locale}/patterns/${newSlug}`;
      for (const fw of frameworks) {
        map[`${locale}/patterns/${oldSlug}/${fw}`] =
          `${baseSegment}${locale}/patterns/${newSlug}/${fw}`;
        map[`${locale}/patterns/${oldSlug}/${fw}/demo`] =
          `${baseSegment}${locale}/patterns/${newSlug}/${fw}/demo`;
      }
    }
  }
  return map;
}
