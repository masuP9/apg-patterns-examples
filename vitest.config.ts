import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), vue(), svelte()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'src/**/*.test.vue.ts', 'src/**/*.test.svelte.ts'],
    // Exclude Astro and browser tests - they have their own configs
    // - Astro: vitest.astro.config.ts (Container API)
    // - Browser: vitest.browser.config.ts (real browser with getBoundingClientRect)
    exclude: ['src/**/*.test.astro.ts', 'src/**/*.browser.test.*', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/patterns/**/*.{tsx,vue,svelte}'],
      exclude: ['**/*.astro', '**/*.test.*', '**/types/**'],
    },
    alias: {
      // Force Svelte to use client-side bundle
      svelte: 'svelte',
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@patterns': resolve(__dirname, './src/patterns'),
    },
    conditions: ['browser'],
  },
});
