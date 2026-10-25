# Technical SEO audit

**Audit date:** 25 October 2026  
**Scope:** Astro source, build configuration and generated static HTML (`dist/`).

## Findings and implementation

- **Rendering and routes:** Astro outputs static HTML. The existing validator checks generated routes, profile presence, internal links, visible hotel rows and JSON-LD. The project expects 24 HTML routes (home, ten profiles, three region pages, two guides, compare, six trust pages, and 404).
- **Titles and descriptions:** Each route uses a route-specific title/description through `src/layouts/Base.astro`. The homepage title remains focused on “10 Best Hotels in Goa”; its description discloses curated selection and reading order. The homepage H1 uses the same target phrase. Route-specific H1 and metadata are checked in the build validator.
- **Canonical and Open Graph:** `Base.astro` emits canonical and `og:url` only when Astro’s `SITE` is configured. `astro.config.mjs` uses the same `SITE_URL` for Astro’s `site` and sitemap integration. No production domain is configured in this project, so the local/default build has no canonical or sitemap rather than a fabricated URL. Open Graph type, title, description and site name are emitted on every page. An `og:image` is intentionally omitted until image use rights and attribution are documented.
- **Sitemap and robots:** `public/robots.txt` allows crawling. The build script adds a sitemap directive only when `SITE_URL` is set; `@astrojs/sitemap` also runs only with that origin. Until the production origin is configured, there is intentionally no sitemap endpoint or sitemap reference. Do not deploy with an example/test origin.
- **Indexability:** No `noindex` meta is intended. Static hotel descriptions and links are present in HTML without JavaScript. The 404 route is generated as `404.html`, emits no canonical or Open Graph URL, and is excluded from the sitemap; the hosting platform must serve it with an actual 404 response (not verified against a production host).
- **Structured data:** Homepage JSON-LD is an `ItemList` of the ten visible hotel names with display-order positions. Its name explicitly says “curated selection” and “editorial reading order.” It includes no rating, review, price, award or unsupported property attribute; no review markup is present. It is not a claim of comparative quality. Validate the generated JSON during every build.
- **Internal linking:** The global navigation/footer link into comparison; homepage links to every profile, region, guide and methodology; profile pages link to official sites, alternatives and an individual compare URL; guide and region pages link back to the relevant hubs. The validator resolves local `href` targets in generated output.
- **URLs/status:** Astro static trailing-slash routes are used. Confirm production rewrites and `/404.html` status at the chosen host. No alternate keyword landing pages or arbitrary filter routes are generated.
- **External sources:** Hotel profile and comparison official links use each record’s hotel-specific official URL. There are no placeholder origins in visible HTML.

## Known external configuration / limits

- Set `SITE_URL` to the exact HTTPS production origin in deployment settings. Rebuild and inspect canonical URL, `sitemap-index.xml`, sitemap host and `robots.txt` reference after deployment.
- Confirm production host redirects to one preferred scheme/host and trailing-slash route behavior.
- Test a missing production URL for HTTP 404 and run Search Console sitemap inspection.
- No production domain or external Lighthouse run was available in this local audit. No live performance score is claimed.
