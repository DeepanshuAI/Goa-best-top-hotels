# Local and Vercel deployment

## Requirements

Node.js 22.23.4 or newer and npm. The site is a static Astro build with no database, server functions or account system.

## Commands

```powershell
npm install
npm run dev
npm run check
$env:SITE_URL = 'https://goa-best-hotels.vercel.app'
npm run build
npm run preview
```

`site.config.mjs` is the single source for the canonical production origin and falls back to `https://goa-best-hotels.vercel.app` when `SITE_URL` is absent. If `SITE_URL` is set, it must equal that exact HTTPS origin with no path, query, or hash; alternate preview hosts are rejected. Astro generates canonical tags, `/sitemap-index.xml`, its child sitemap, and `/robots.txt` during the build.

## Vercel setup

1. Import `DeepanshuAI/Goa-best-top-hotels` in Vercel. This repository contains the Astro project at its root, so use `.` as the Root Directory.
2. Framework preset: Astro. Install command: `npm ci`; Build command: `npm run build`; Output directory: `dist`.
3. In Project Settings → Environment Variables, add `SITE_URL` for the Production environment with the value `https://goa-best-hotels.vercel.app`. Save the variable and create a new production deployment; changes to environment variables take effect in new deployments.
4. Confirm `/robots.txt`, sitemap and route status after deployment. Submit the sitemap in Google Search Console after verifying the production domain.
5. Review terms for the chosen hosting plan against intended use. Do not add monetization until the applicable plan and commercial terms are confirmed.

The generated `robots.txt` permits crawling and points to `https://goa-best-hotels.vercel.app/sitemap-index.xml`. After deployment, open that sitemap URL and `/robots.txt` directly; then submit the working sitemap index in Search Console → Sitemaps. Use URL Inspection on the homepage and several important pages. Do not treat a submitted sitemap or Search Console's processing status as proof of indexing.

## Vercel plan and commercial use

No commercial features are included. Confirm the current Vercel plan terms before adding advertising, affiliate links, paid listings, lead generation or other revenue activity; choose a plan that permits the intended use.
