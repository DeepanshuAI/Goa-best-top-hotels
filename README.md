# Goa, Considered

A static editorial hotel discovery directory for Goa. Built with Astro, strict TypeScript, semantic HTML and lightweight CSS.

## Run locally

```powershell
npm install
npm run dev
```

## Build and validate

```powershell
npm run check
```

`npm run check` runs Astro diagnostics, builds all static routes, checks hotel profiles and homepage rows, verifies internal links, parses ItemList JSON-LD, and checks sitemap and robots origin when `SITE_URL` is configured.

## Production origin

Set `SITE_URL` to the assigned HTTPS production origin. Do not deploy with an invented host. Astro sitemap, canonical metadata and the `robots.txt` sitemap entry use this single value.

## Documentation

See `docs/seo-research.md`, `docs/topical-map.md`, `docs/ranking-methodology.md`, `docs/content-guidelines.md`, `docs/internal-linking.md`, `docs/backlink-strategy.md`, `docs/deployment.md`, and `docs/launch-checklist.md`.
