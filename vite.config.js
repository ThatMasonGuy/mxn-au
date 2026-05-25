import path from "path";
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// import { visualizer } from 'rollup-plugin-visualizer';

import tailwindcss from "@tailwindcss/vite";

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
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag === 'lottie-player'
        }
      }
    }),
    tailwindcss(),
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
  
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vue-vendor',
              test: /[\\/]node_modules[\\/](vue|vue-router|pinia)[\\/]/,
              priority: 90,
            },
            {
              name: 'firebase',
              test: /[\\/]node_modules[\\/](@firebase|firebase)[\\/]/,
              priority: 80,
            },
            {
              name: 'codemirror',
              test: /[\\/]node_modules[\\/](@codemirror|codemirror)[\\/]/,
              priority: 80,
            },
            {
              name: 'xterm',
              test: /[\\/]node_modules[\\/](xterm|xterm-addon-fit|xterm-addon-web-links)[\\/]/,
              priority: 80,
            },
            {
              name: 'charts',
              test: /[\\/]node_modules[\\/](echarts|zrender|vue-echarts|chart\.js)[\\/]/,
              priority: 80,
            },
            {
              name: 'xlsx',
              test: /[\\/]node_modules[\\/]xlsx[\\/]/,
              priority: 80,
            },
            {
              name: 'date',
              test: /[\\/]node_modules[\\/](date-fns|date-fns-tz|luxon)[\\/]/,
              priority: 70,
            },
            {
              name: 'utils',
              test: /[\\/]node_modules[\\/](marked|markdown-it|dompurify|html2canvas|papaparse|crypto-js)[\\/]/,
              priority: 70,
            },
            {
              name: 'ui',
              test: /[\\/]node_modules[\\/](radix-vue|reka-ui|vaul-vue|@heroicons|lucide-vue-next)[\\/]/,
              priority: 60,
            },
          ],
        },
      },
    },
  },
});