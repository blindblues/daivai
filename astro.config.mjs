// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://blindblues.github.io',
  base: '/daivai',
  integrations: [react(), keystatic()],
});