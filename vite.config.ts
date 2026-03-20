import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';
import svgLoader from 'vite-svg-loader';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: mode === 'production' ? env.BASE_URL || '/' : '',
    plugins: [
      vue(),
      vueDevTools(),
      svgLoader({
        svgoConfig: {
          multipass: true,
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        public: fileURLToPath(new URL('./public', import.meta.url)),
        // 'v-onboarding': fileURLToPath(new URL('./src/vendor/v-onboarding', import.meta.url)),
      },
    },
    build: {
      assetsInlineLimit: 1024,
    },
    css: {
      devSourcemap: process.env.NODE_ENV === 'development',
      preprocessorOptions: {
        scss: {
          additionalData:
            '@import "@/assets/scss/variables.scss"; @import "@/assets/scss/mixins.scss";',
            silenceDeprecations: ['import'],
        },
      },
    },
  };
});
