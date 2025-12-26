import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/patterns/**/*.tsx"],
      exclude: ["**/*.astro", "**/*.test.*", "**/types/**"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@patterns": resolve(__dirname, "./src/patterns"),
    },
  },
});
