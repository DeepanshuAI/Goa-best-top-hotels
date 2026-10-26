# QA results

## Sitemap repair — 26 October 2026

- Root cause: `@astrojs/sitemap` (`3.7.4`) was installed but registered only when `SITE_URL` existed. The production build had no `SITE_URL`, so the plugin did not run and `/sitemap-index.xml` returned 404. The old post-build robots script also omitted a Sitemap directive in that case.
- `npm run check`: passed; Astro reported 0 errors, 0 warnings and 0 hints. The build generated 24 Astro page routes including the 404 page, plus the static robots endpoint; the validator passed.
- `npm run build`: passed. `dist/sitemap-index.xml`, `dist/sitemap-0.xml` and `dist/robots.txt` were generated.
- Python's standard XML parser successfully parsed the sitemap index and child sitemap. The child sitemap contains 23 unique URLs on `https://goa-best-hotels.vercel.app`; they match all indexable Astro routes, excluding the 404 route and Google verification HTML file.
- The validator checks canonical origin, sitemap XML structure, unique sitemap URLs, exact correspondence with indexable static routes, robots directives, head discovery links, canonical tags and Open Graph URLs.
- Before pushing this repair, a live check of `https://goa-best-hotels.vercel.app/sitemap-index.xml` returned HTTP 404 and live `/robots.txt` showed the old conditional-generation comment. The production deployment and post-deployment HTTP check remain outstanding until Vercel deploys this commit.
- No Search Console indexing status was inspected; sitemap generation and submission do not establish that Google indexed any page.

## Current image-ratio and responsive design revision — 25 October 2026

- `npm run check`: passed; Astro reported 0 errors, 0 warnings and 0 hints. The static build generated 24 routes, and `scripts/validate-build.mjs` verified unique titles, descriptions, exactly one H1 per route, no `noindex`, local internal links, local image files, the ten crawlable hotel records, and curated ItemList JSON-LD.
- `npm run build`: passed separately after the checks; 24 static routes generated.
- A temporary reserved `.test` origin build exercised the configured-origin path. The validator confirmed canonical and Open Graph URLs match each route, all expected indexable routes appear in the sitemap, the sitemap has one origin, and `robots.txt` points to it. The build was then run again with `SITE_URL` unset; no temporary origin, canonical or sitemap remains in the default `dist/`.
- The generated image derivatives total 1,417,952 bytes across 20 files. Largest profile derivative: 220,170 bytes; largest thumbnail: 41,490 bytes. The original user files are preserved.
- The repository has no standalone test or lint script. `npm run check` runs Astro diagnostics, the production build and the build validator.
- Image-ratio diagnosis: list thumbnails had HTML `height="220"`, which continued to set a fixed used height when the CSS width shrank on mobile. The image could therefore become an 82px-wide, 220px-tall strip despite an `aspect-ratio` rule. The shared row now uses each generated thumbnail’s actual dimensions, `height: auto`, a 3:2 desktop/tablet crop, and a 16:10 mobile crop. On mobile the image sits beside the reading-order number and above the full-width hotel details; at tablet/desktop it has a 190–220px image column.
- Responsive browser checks on 25 October covered the homepage, comparison page, ITC Grand Goa profile, North Goa listing and North-vs-South guide at 360, 390, 430, 768, 1024 and 1440 CSS px. No page-level horizontal overflow was detected. The homepage hotel image measured 1.6:1 on phone widths and 1.5:1 on wider widths; profile imagery measured 3:2. All ten profile images loaded, and the North Goa listing’s four thumbnails loaded. Guide tables remain within their own horizontal-scroll containers on narrow screens. Computed body text was 16px with 25.6px line height. A mobile screenshot was visually reviewed; desktop screenshot capture was clipped to a narrower physical viewport after applying large viewport overrides, so pixel-level desktop review is not claimed.
- Browser interactions passed after the layout update: searching for “Panaji” reduced the list to one stay; the North Goa filter returned four stays; alphabetical sort placed Ahilya by the Sea first; selecting four hotels and attempting a fifth preserved the limit and announced feedback; clearing reset the selection. Comparison selection checkboxes now have hotel-specific accessible names. Keyboard-only navigation and screen-reader behavior were not formally audited.
- No current Lighthouse run was available; current LCP, INP, CLS and accessibility scores are not claimed.
- Ten user-supplied hotel images are integrated as landscape ranking thumbnails, compact comparison images and profile images. The UI keeps hotel names and editorial text primary. Provenance/licensing is not documented; see `docs/factual-audit.md`.
- Comparison supports a maximum of four saved selections, storage validation, explicit fifth-selection feedback, clear/reset controls, official hotel links and a stacked mobile layout.
- Current regional/record correction: Calangute pool status is not established in the current GTDC listing; Panaji locality is corrected to behind the Old Secretariat; unsupported value labels removed.

## Previous revision results — 25 October 2026

- `npm run check`: passed in a previous source revision; Astro reported zero errors, warnings or hints; 24 static HTML routes built.
- Previous validator checked all ten hotel profiles, crawlable homepage entries, local links and homepage ItemList JSON-LD.
- A `.test` host was used only in a separate sitemap check and then removed from the output. The production origin remains unset.
- A previous browser smoke at 375, 768 and 1280 CSS pixels exercised search/region filtering and four-hotel comparison; it does not cover current changes or requested 360/390/1024/1440 widths.
- Previous Lighthouse mobile local lab output recorded performance 100, LCP 1,276 ms, CLS 0 and TBT 34 ms. INP was not reported. These are prior lab values only, not current results or field performance.
