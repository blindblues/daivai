// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://blindblues.github.io',
  base: '/daivai',
  integrations: [react(), keystatic()],
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  build: {
    format: 'directory'
  }
});