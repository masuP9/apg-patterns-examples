import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  plugins: [react(), vue(), svelte()],
  test: {
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: [
      'src/**/*.browser.test.{ts,tsx}',
      'src/**/*.browser.test.vue.ts',
      'src/**/*.browser.test.svelte.ts',
      'src/**/*.browser.test.astro.ts',
    ],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
    alias: {
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
