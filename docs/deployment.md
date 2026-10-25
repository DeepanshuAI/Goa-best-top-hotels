# Local and Vercel deployment

## Requirements

Node.js 22.23.4 or newer and npm. The site is a static Astro build with no database, server functions or account system.

## Commands

```powershell
npm install
npm run dev
npm run check
$env:SITE_URL = 'https://your-project.vercel.app'
npm run build
npm run preview
```

`SITE_URL` must be the real production origin, with no trailing path. Until the Vercel subdomain is selected, production canonical tags and the sitemap integration are intentionally omitted; no invented domain is embedded. Set the same value in Vercel Project Settings → Environment Variables for Preview/Production, then redeploy. The sitemap integration generates XML only when this setting exists.

## Vercel setup

1. Put this project in its own Git repository (or connect the monorepo and set Root Directory to `outputs/goa-hotel-guide`).
2. Import the repository in Vercel. Framework preset: Astro. Root Directory: `outputs/goa-hotel-guide` if using this parent repository.
3. Install command: `npm install`; Build command: `npm run build`; Output directory: `dist`.
4. Add `SITE_URL` with the assigned production origin; deploy and verify canonical tags and `sitemap-index.xml` use that host.
5. Confirm `/robots.txt`, sitemap and route status after deployment. Submit the sitemap in Google Search Console after verifying the production domain.
6. Review terms for the chosen hosting plan against intended use. Do not add monetization until the applicable plan and commercial terms are confirmed.

The generated `robots.txt` permits crawling. Add the final sitemap URL once deployment origin is known if the sitemap is not served via the framework integration.

## Vercel plan and commercial use

No commercial features are included. Confirm the current Vercel plan terms before adding advertising, affiliate links, paid listings, lead generation or other revenue activity; choose a plan that permits the intended use.
