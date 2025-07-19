import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: "/demos/svelte/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  server: {
    port: 3002,
    host: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@components": resolve(__dirname, "./src/components"),
      "@shared": resolve(__dirname, "../shared"),
    },
  },
});
