import path from "path";
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://66.94.98.250:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});