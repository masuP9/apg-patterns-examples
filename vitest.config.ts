import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    vue(),
    svelte(),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "src/**/*.test.vue.ts", "src/**/*.test.svelte.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/patterns/**/*.{tsx,vue,svelte}"],
      exclude: ["**/*.astro", "**/*.test.*", "**/types/**"],
    },
    alias: {
      // Force Svelte to use client-side bundle
      svelte: "svelte",
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@patterns": resolve(__dirname, "./src/patterns"),
    },
    conditions: ["browser"],
  },
});
