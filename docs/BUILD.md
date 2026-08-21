# Trinity — build and deploy

Astro (static) + Sanity (content) + Cloudflare Pages (hosting).

## Why this shape

The public site is **prerendered at build time**. Every page is plain HTML on a
CDN edge — which is what gives us the crawlability and Core Web Vitals the
rebuild is for. There is no server to be slow, and nothing to run per request.

Content edits do not require a developer: an editor saves in Sanity, a webhook
fires a Cloudflare deploy hook, and the site rebuilds in seconds.

The Cloudflare adapter is configured even though the site is static, so a single
route can opt into server rendering later (`export const prerender = false`) —
a form endpoint, or the shop — without re-architecting.

## First run

```bash
npm install
cp .env.example .env          # fill in from sanity.io/manage
npm run dev                   # http://localhost:4321
```

The Studio is a separate app in `studio/`:

```bash
cd studio && npm install
cp .env.example .env
npm run dev                   # http://localhost:3333
```

## Importing the existing content

The hand-built site's copy lives in `legacy/`. To load it into Sanity:

```bash
export SANITY_API_WRITE_TOKEN=...          # Editor token
node scripts/migrate-to-sanity.mjs --dry-run   # inspect, writes a preview JSON
node scripts/migrate-to-sanity.mjs             # write to the dataset
```

It is idempotent — IDs come from the slug and images are content-hashed, so
re-running updates in place rather than duplicating.

## Environment

| Variable | Where | Purpose |
|---|---|---|
| `PUBLIC_SANITY_PROJECT_ID` | site | Which Sanity project to read |
| `PUBLIC_SANITY_DATASET` | site | Usually `production` |
| `SANITY_API_READ_TOKEN` | site, optional | Renders unpublished drafts |
| `SITE_URL` | site | Canonical origin — drives sitemap, canonicals, Open Graph |
| `SANITY_STUDIO_PROJECT_ID` | studio | Same project |
| `SANITY_API_WRITE_TOKEN` | migration only | Never set in CI |

`SITE_URL` must be the real domain before launch. Canonical tags and the
sitemap are generated from it, and pointing them at the wrong host is a silent
SEO failure.

## Deploy

Cloudflare Pages, build command `npm run build`, output `dist`.
Set the same environment variables in the Pages project.

Then in Sanity: **API → Webhooks → +**, pointing at the Cloudflare deploy hook,
triggering on create/update/delete for `assetPage`, `homePage`, `legalPage` and
`siteSettings`. That is what makes publishing self-service.

## SEO built in

- Per-page title and meta description, with length validation in the Studio
- Canonical URL on every page
- Open Graph and Twitter cards, share image generated at 1200×630
- `sitemap-index.xml`, generated at build and excluding noindexed pages
- `robots.txt` generated so its sitemap URL always matches the deployed origin
- Structured data: `FinancialService` (with the FCA reference as an identifier),
  `BreadcrumbList`, `FAQPage` on item pages, and a `Service` per item
- `noindex` is a switch in the Studio, per page

## What is not done yet

- The homepage route. Its content model exists; the legacy homepage is a single
  1.3MB file with 17 base64-inlined images and needs decomposing.
- Legal pages (privacy, terms, cookies, complaints) — schema exists, no content.
- The valuation form posts to `/api/valuation`, which is not implemented.
- Analytics and cookie consent.

## Tests

```bash
npm run verify     # type check, build, then test
npm test           # test against whatever is already in dist/
```

44 checks across four suites, written from the failures that actually occurred
during the rebuild rather than from a checklist:

| Suite | Guards against |
|---|---|
| `build` | Pages missing from the build; stylesheets or icon fonts not loaded — the bug that left every item page as unstyled text while the type checker stayed green |
| `structure` | A whole section disappearing; the trust strip rendering outside the hero, where its translucent background reads wrong; hidden form steps blocking submission |
| `seo` | Missing or duplicate titles and descriptions, absent canonicals, malformed structured data, an empty regulatory footer |
| `content` | Compliance markers, FAQs, comparison rows or headlines lost in migration, compared against the source content files |

CI runs the same three commands on every push (`.github/workflows/verify.yml`).
It needs `SANITY_PROJECT_ID`, `SANITY_DATASET` and `SITE_URL` as repository
variables — no token, since published content is readable without one.
