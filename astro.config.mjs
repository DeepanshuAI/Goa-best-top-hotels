import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { site } from './site.config.mjs';

export default defineConfig({ site, integrations: [sitemap({ filter: (page) => !page.endsWith('/404.html') })], output: 'static' });
