import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? "/apg-patterns-examples/demos/vue/" : "/demos/vue/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  server: {
    port: 3003,
    host: true,
  },
  css: {
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@components": resolve(__dirname, "./src/components"),
      "@shared": resolve(__dirname, "../shared"),
    },
  },
})