import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
const env = loadEnv('', process.cwd(), '');
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import autoprefixer from 'autoprefixer';

import react from '@astrojs/react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  site: env.SITE_URL,
  server: {
    host: true,
    open: true,
  },
  integrations: [
    react(),
    icon(),
    sitemap({
      // サイトマップから除外したいページを追加
      filter: (page) => page !== `${env.SITE_URL}contact/complete/`,
    }),
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
      postcss: {
        plugins: [autoprefixer()],
      },
    },
    plugins: [
      svgr({
        include: '**/*.svg?react',
        svgrOptions: {
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false,
                  },
                },
              },
              'removeTitle',
              'removeDesc',
              'removeDoctype',
              'cleanupIds',
            ],
          },
        },
      }),
    ],
  },
});
