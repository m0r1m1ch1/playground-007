// @ts-nocheck
import type { AstroIntegration } from 'astro';
import trqImageResize from './vite-plugin-trq-image-resize';

import type { OptimizeOptions } from './vite-plugin-trq-image-resize';

export default (_config: OptimizeOptions): AstroIntegration => ({
  name: 'trq-image',
  hooks: {
    'astro:config:setup': ({ updateConfig, config, logger }) => {
      updateConfig({
        vite: {
          plugins: [
            trqImageResize({
              ...{
                outputDir: 'images',
                scales: [{ suffix: '', dpr: 1 }],
                quality: 80,
                formats: ['webp', 'avif'],
                ..._config,
              },
              root: config.root,
              srcDir: config.srcDir,
              publicDir: config.publicDir,
              logger,
            }),
          ],
        },
      });
    },
  },
});
