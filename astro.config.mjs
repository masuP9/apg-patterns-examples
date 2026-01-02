// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import vue from '@astrojs/vue';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// Deploy target: 'github-pages' (default for production) or 'cloudflare-pages'
const deployTarget = process.env.DEPLOY_TARGET ||
  (process.env.NODE_ENV === 'production' ? 'github-pages' : 'local');

const siteConfig = {
  'github-pages': {
    site: 'https://masup9.github.io',
    base: '/apg-patterns-examples',
  },
  'cloudflare-pages': {
    site: process.env.CF_PAGES_URL || 'https://apg-patterns-examples.pages.dev',
    base: '/',
  },
  'local': {
    site: 'http://localhost:4321',
    base: '/',
  },
};

const { site, base } = siteConfig[deployTarget] || siteConfig['local'];

// https://astro.build/config
export default defineConfig({
  site,
  base,

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