// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'compile',
    platformProxy: {
      enabled: true
    },
    routes: {
      strategy: 'include',
      include: ['/api/*', '/fact/*', '/about', '/archive']
    }
  }),
  site: 'https://wonder-stream.pages.dev', // Update this with your actual domain when deployed
  vite: {
    build: {
      minify: 'esbuild'
    }
  }
});
