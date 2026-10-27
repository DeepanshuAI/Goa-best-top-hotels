# Goa, Considered

A static editorial hotel discovery directory for Goa, with regional guides, a hotel comparison tool, a trip-fit finder and shareable planning assets. Built with Astro, strict TypeScript, semantic HTML and lightweight CSS.

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

## Pinterest assets

The portrait assets in `public/pins/` have SVG sources and rendered PNGs. Re-render them after editing an SVG with:

```powershell
npm run pins:render
```

## Production origin

The canonical origin is defined in `site.config.mjs` as `https://goa-best-hotels.vercel.app`. An optional `SITE_URL` must match that exact production origin. Astro uses the shared site configuration for sitemap and canonical metadata.

## Documentation

See `docs/seo-research.md`, `docs/topical-map.md`, `docs/ranking-methodology.md`, `docs/content-guidelines.md`, `docs/indexing-investigation.md`, `docs/internal-linking.md`, `docs/backlink-strategy.md`, `docs/social-distribution.md`, `docs/deployment.md`, and `docs/launch-checklist.md`.
