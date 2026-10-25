import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
const site = process.env.SITE_URL;
export default defineConfig({ ...(site ? { site } : {}), integrations: site ? [sitemap()] : [], output: 'static' });
