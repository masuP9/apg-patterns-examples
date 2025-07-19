import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/demos/react/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  server: {
    port: 3001,
    host: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@components": resolve(__dirname, "./src/components"),
      "@demos": resolve(__dirname, "./src/demos"),
      "@styles": resolve(__dirname, "./src/styles"),
      "@shared": resolve(__dirname, "../shared"),
    },
  },
});
