# Deployment checklist

## Before publication

- [ ] Set `SITE_URL` to the exact HTTPS production origin in Vercel project settings; do not use a placeholder, preview, or `.test` host.
- [ ] Confirm that hotel names, areas and material claims match the current source ledger in `docs/factual-audit.md`.
- [ ] Resolve all photo identity, creator, source, license/permission and credit gaps in the factual audit; remove files that cannot be cleared.
- [ ] Confirm current hotel operating status and time-sensitive facilities directly before launch; particularly check Calangute Residency’s pool status.
- [ ] Add and test a monitored editorial contact/correction route before soliciting corrections.
- [ ] Review hosting-plan terms for the intended use before adding any commercial activity.

## Build and deployment

- [ ] Use Node.js 22.23.4 or newer and the repository’s npm lockfile.
- [ ] Run `npm run check` and `npm run build` from the project directory.
- [ ] Confirm the expected static route count and inspect `dist/` plus validator output.
- [ ] Confirm one unique title, description and H1 per indexable route; canonical URLs match `SITE_URL`.
- [ ] Confirm sitemap entries are canonical/indexable and use only the production origin.
- [ ] Confirm `/robots.txt` allows public content and points to the production sitemap.
- [ ] Confirm all hotel images resolve; review actual image payload and dimensions. Regenerate WebP derivatives from the preserved originals with `node scripts/optimize-hotel-images.mjs` after any source-image change.
- [ ] Verify homepage, compare, representative profiles, regional pages, all internal links and official external URLs.
- [ ] Confirm the production 404 route returns HTTP 404 and redirects enforce one preferred hostname, HTTPS and trailing-slash policy.
- [ ] Test search/filter, four-hotel selection, persisted selection, fifth-selection feedback, reset, keyboard focus and the mobile comparison layout.
- [ ] Run Lighthouse on the deployed homepage, comparison route and one hotel profile; record actual LCP, CLS, lab data and any field INP availability. Do not treat lab TBT as INP.
- [ ] Inspect the sitemap in Search Console after domain ownership verification.

## Current launch blockers

- Photo rights/credits are not recorded for the ten user-supplied files.
- The production `SITE_URL` and preferred host are not configured, so canonical URLs and sitemap output are intentionally absent in the default local build.
- The prototype has no monitored contact/corrections channel.
- Confirm live operation and seasonal amenities directly with hotels before launch.
