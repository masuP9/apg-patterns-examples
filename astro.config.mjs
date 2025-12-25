// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import vue from '@astrojs/vue';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

const isProd = process.env.NODE_ENV === 'production';

// https://astro.build/config
export default defineConfig({
  site: 'https://masup9.github.io',
  base: isProd ? '/apg-patterns-examples' : '/',

  integrations: [react(), vue(), svelte(), mdx()],

  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja'],
  },
});