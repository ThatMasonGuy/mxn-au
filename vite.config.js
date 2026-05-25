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
    // Uncomment to analyze bundle after a build (writes dist/bundle-stats.html):
    // visualizer({
    //   filename: './dist/bundle-stats.html',
    //   open: false,
    //   gzipSize: true,
    //   brotliSize: true,
    // }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // codemirror (~990 KB with all language packs) is lazy-loaded by exactly
    // one route — FileEditor.vue — so the size is acceptable. 1100 keeps the
    // signal/noise sensible.
    chunkSizeWarningLimit: 1100,
    cssCodeSplit: true,

    rolldownOptions: {
      output: {
        codeSplitting: {
          // Default minimum so we don't end up with a long tail of tiny chunks.
          // No global maxSize: heavy libs like firebase/codemirror have tight
          // internal cross-file deps and break ("f is not a constructor") when
          // arbitrarily split. Per-group maxSize is applied below where it's safe.
          minSize: 10_000,

          groups: [
            // ── Critical path (loaded on first paint) ──────────────────────
            // Vue runtime + state. Stable, cache-friendly.
            {
              name: 'vue-core',
              test: /[\\/]node_modules[\\/](vue|@vue|vue-router|pinia|pinia-plugin-persistedstate|@vueuse)[\\/]/,
              priority: 100,
            },

            // Firebase. We import auth/firestore/database/functions/storage in
            // src/firebase.js, so it's effectively eager. Keep it together so
            // its sub-packages don't fragment into a dozen tiny chunks.
            {
              name: 'firebase',
              test: /[\\/]node_modules[\\/](@firebase|firebase)[\\/]/,
              priority: 95,
            },

            // Headless UI primitives — used by almost every page via shared components.
            {
              name: 'ui-primitives',
              test: /[\\/]node_modules[\\/](radix-vue|reka-ui|vaul-vue|@radix-icons|vue-sonner)[\\/]/,
              priority: 90,
            },

            // Icon sets. Split from other UI: they tree-shake well but the
            // total surface is large enough to deserve its own cache entry.
            {
              name: 'icons',
              test: /[\\/]node_modules[\\/](lucide-vue-next|@heroicons)[\\/]/,
              priority: 85,
            },

            // ── Heavy, route-local libraries ───────────────────────────────
            // Each of these is only pulled in by one or two lazy-loaded routes.
            // Manual grouping prevents their fragmented sub-packages (e.g.
            // @codemirror/lang-*) from sprawling into dozens of micro-chunks.

            {
              name: 'codemirror',
              test: /[\\/]node_modules[\\/](@codemirror|codemirror)[\\/]/,
              priority: 80,
            },

            // echarts is now async-loaded via src/shared/plugins/echarts.js,
            // so this chunk only downloads when a <v-chart> mounts. echarts
            // tolerates splitting (modules are mostly self-contained option/
            // component definitions), so we let maxSize break it up.
            {
              name: 'echarts',
              test: /[\\/]node_modules[\\/](echarts|zrender|vue-echarts)[\\/]/,
              priority: 80,
              maxSize: 200_000,
            },

            {
              name: 'xterm',
              test: /[\\/]node_modules[\\/](xterm|xterm-addon-fit|xterm-addon-web-links)[\\/]/,
              priority: 80,
            },

            {
              name: 'xlsx',
              test: /[\\/]node_modules[\\/]xlsx[\\/]/,
              priority: 80,
            },

            // ── Specialized data / utility groups ──────────────────────────

            // Date libs — small but used in many spots, worth caching together.
            {
              name: 'date',
              test: /[\\/]node_modules[\\/](date-fns|date-fns-tz|luxon)[\\/]/,
              priority: 70,
            },

            // Timezone database is large (~120KB) and only used by a few admin views.
            {
              name: 'tzdb',
              test: /[\\/]node_modules[\\/]@vvo[\\/]tzdb[\\/]/,
              priority: 70,
            },

            // Country data — translation features only.
            {
              name: 'countries',
              test: /[\\/]node_modules[\\/](world-countries|i18n-iso-countries|flag-icons)[\\/]/,
              priority: 70,
            },

            // Markdown ecosystem — bundled because journal/notes/legal pages
            // pull all three together.
            {
              name: 'markdown',
              test: /[\\/]node_modules[\\/](marked|markdown-it|dompurify)[\\/]/,
              priority: 65,
            },

            // html2canvas is ~200KB and only used by a couple of exporters.
            {
              name: 'html2canvas',
              test: /[\\/]node_modules[\\/]html2canvas[\\/]/,
              priority: 65,
            },

            // Form validation — used across multiple admin forms.
            {
              name: 'forms',
              test: /[\\/]node_modules[\\/](vee-validate|@vee-validate)[\\/]/,
              priority: 60,
            },

            // ── Catch-all for everything else in node_modules ──────────────
            // minShareCount: 2 means: only chunk modules that are imported by
            // 2+ entry/dynamic chunks. Single-use libs stay co-located with
            // the route that uses them, keeping initial bundles lean.
            {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 1,
              minShareCount: 2,
            },
          ],
        },
      },
    },
  },
});
