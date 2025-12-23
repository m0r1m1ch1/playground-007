import type { OptimizeOptions } from '../vite-plugin-trq-image-resize';

declare module 'virtual:astro-trq-image' {
  export const config: OptimizeOptions;
}
