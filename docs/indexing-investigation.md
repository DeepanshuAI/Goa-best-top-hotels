# Google indexing investigation

**Checked:** 26 October 2026  
**Site:** `https://goa-best-hotels.vercel.app/`

## What this investigation can establish

No authenticated Google Search Console session or Search Console integration is available in this environment. The site's Search Console exclusions, last crawl dates and Google-selected canonicals therefore cannot be independently inspected. The statuses in the request are user-reported; this document records the live HTTP, HTML, robots, canonical, sitemap and source checks available here. A technically eligible page is not guaranteed to be indexed.

## Live technical checks before the targeted content update

| URL | HTTP / redirect | Robots | Canonical | Sitemap | Static page checks |
|---|---|---|---|---|---|
| `/north-goa-hotels/` | 200, no redirect | `robots.txt` returned 200 and allows `/`; no meta robots or `X-Robots-Tag` restriction found | Self-referencing | Included | Unique title and description, one H1, four researched hotel rows and regional links; content was static HTML. The introduction named Anjuna despite having no Anjuna property and gave little area-level comparison. |
| `/guides/north-goa-vs-south-goa/` | 200, no redirect | Same allow rule; no meta or header restriction found | Self-referencing | Included | Unique title and description, one H1, useful regional sections and hotel links in static HTML. It did not have the comparison table referenced in the brief; a sourced decision table has now been added. |
| `/compare/` | 200, no redirect | Same allow rule; no meta or header restriction found | Self-referencing | Included | Unique title and description, one H1, full ten-property by six-criterion matrix in static HTML, source-gap explanations and profile links. This is a substantive comparison resource, so it remains indexable. |

The live XML sitemap index and child sitemap returned 200 and contain 23 unique URLs on the production origin. Each requested page appears in the child sitemap. The homepage links to the regional hub, guide and comparison; the regional page and guide link to relevant profiles and each other; Compare is in the global navigation and links to all ten profiles.

`/compare` and `/compare/` both returned 200 with no redirect in the original deployment. The no-slash response still declared `/compare/` as canonical, but allowing both forms is avoidable duplication. Astro is configured with `trailingSlash: 'always'`, and `vercel.json` sets `trailingSlash: true`. After deployment, `/compare` returned a permanent 308 to `/compare/`; `/compare/?hotels=itc-grand-goa` remained in the destination query string.

## Content and indexability decision

- **North Goa regional page:** Keep indexable. The shortlisting rows already offered hotel-specific details, but the page needed a clearer account of the actual localities represented and how the four property types differ. The update names Sinquerim-Candolim, Nerul, Vagator and Calangute, contrasts the stays with documented attributes, explains that the shortlist is not exhaustive, and links to Goa Government and GTDC beach references.
- **North Goa vs South Goa guide:** Keep indexable. The guide answers a useful location-choice question and links to the hotel records. A new table compares the represented areas, property mix and practical checks. Claims are tied to existing hotel source records and government tourism references; no travel times or distances were invented.
- **Hotel comparison:** Keep indexable. It contains a crawlable ten-hotel matrix with six meaningful attributes, each row linking to the fuller profile. The unknown-value convention distinguishes “not stated in the source checked” from confirmed absence. Its purpose and visible comparison content differ from the homepage's editorial shortlist.

The regional background links used by the North Goa page and guide are [Government of Goa: Beaches](https://www.goa.gov.in/what_to_see/beaches/) and [Goa Tourism Development Corporation: Beaches of North Goa](https://goa-tourism.com/siteseeing/beaches-of-north-goa/). Hotel-specific attributes link through each profile to its official source.

## Search Console fields to check for each URL

In Search Console, open **URL Inspection**, enter each exact trailing-slash URL, and record:

1. **Page indexing:** exact status and exclusion reason; last crawl date.
2. **Crawl:** crawl allowed? page fetch? HTTP response?
3. **Indexing:** indexing allowed? any detected `noindex`?
4. **Canonical:** user-declared canonical and Google-selected canonical.
5. **Discovery:** sitemap association and referring page(s).

Only after confirming a specific issue is fixed, use **Test Live URL** and then **Request indexing**. In **Sitemaps**, submit `https://goa-best-hotels.vercel.app/sitemap-index.xml`. These actions request processing; they do not guarantee indexing.

## Local validation

`npm run check` and `npm run build` pass for the current source. The sitemap validator checks the exact canonical URL set, unique URLs, XML structure, route canonicals, robots declaration and internal links. After deployment, live HTTP checks returned 200 for the three target pages, sitemap index and child, robots file, homepage, South Goa page and Methodology. All three target pages had a unique title, one H1, self-referencing canonical, no meta `noindex`, and no `X-Robots-Tag` header. The North/South guide table and all 60 comparison cells were present in the returned HTML. The exact Google Search Console indexing outcomes remain a manual check.
