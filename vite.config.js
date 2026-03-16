import path from "path";
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// import { visualizer } from 'rollup-plugin-visualizer';

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
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag === 'lottie-player'
        }
      }
    })
    // Uncomment to analyze bundle after successful build:
    // visualizer({
    //   filename: './dist/bundle-stats.html',
    //   open: false,
    //   gzipSize: true,
    //   brotliSize: true
    // })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor chunk - Vue ecosystem
          'vue-vendor': ['vue', 'vue-router', 'pinia'],

          // External heavy libraries
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage', 'firebase/analytics'],
          'codemirror': ['codemirror', '@codemirror/state', '@codemirror/view', '@codemirror/commands', '@codemirror/language', '@codemirror/lang-javascript', '@codemirror/lang-json', '@codemirror/lang-markdown', '@codemirror/lang-html', '@codemirror/lang-css', '@codemirror/lang-sql'],
          'xterm': ['xterm', 'xterm-addon-fit', 'xterm-addon-web-links'],
          'utils': ['marked', 'dompurify', 'html2canvas', 'papaparse', 'crypto-js'],

          // Charts (large)
          'charts': ['echarts', 'vue-echarts', 'chart.js'],

          // XLSX (very large - 332KB)
          'xlsx': ['xlsx'],

          // UI components
          'ui': ['radix-vue', 'vaul-vue', '@heroicons/vue', 'lucide-vue-next'],

          // Date libraries
          'date': ['date-fns', 'date-fns-tz', 'luxon'],
        },
      },
    },
  },
});