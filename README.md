# Trinity Pawnbrokers

Marketing site for Trinity Pawnbrokers — a trading name of Open Access Finance
Ltd, which also trades as Unbolted and is authorised and regulated by the FCA
under reference 741896.

**Astro** (static output) · **Sanity** for content · **Cloudflare Pages** for hosting.

| | |
| --- | --- |
| Live (review) | https://trinity-pawnbrokers.pages.dev — **noindex**, see below |
| Content | Sanity project `7fxd9siz`, dataset `production` |
| Previous site | tagged `v1-static-site` — the hand-built static site this replaced |

## Running it

```bash
npm install
cp .env.example .env      # fill in PUBLIC_SANITY_PROJECT_ID
npm run dev               # localhost:4321
npm run studio            # the Sanity Studio, localhost:3333
```

`npm run verify` runs the type check, the build and the tests — the same three
things CI runs on every push.

## Deploying

```bash
CLOUDFLARE_ACCOUNT_ID=85ec2e0223607ccc7dff4344bb61d02a npm run deploy
```

That builds, strips the unused Cloudflare Worker (see below) and uploads to
production. The Pages project's production branch is `main`, matching GitHub —
deploying under any other branch name makes a preview, and the live URL keeps
serving whatever was there before.

Two things worth knowing:

- **Every route is prerendered.** The Cloudflare adapter emits a Worker and a
  `_routes.json` anyway, and Pages then routes most requests through it to be
  handed a file that was already on disk — which caused intermittent 522s.
  `scripts/strip-worker.mjs` removes both, and refuses to run the moment any
  route sets `export const prerender = false`.
- **The pages.dev host is noindexed** by `public/_headers`, scoped to that host
  so a real domain added later is unaffected.

## Content

Everything on every page comes from Sanity except the site chrome — the
masthead links, the footer, and the 404. `scripts/migrate-to-sanity.mjs` is the
importer: idempotent, and `--dry-run` writes `.migration-preview.json` for
review without a token.

```bash
SANITY_API_WRITE_TOKEN=... node scripts/migrate-to-sanity.mjs
```

## Design system

Tokens are the single source of truth — no page invents its own hex or type
size.

```
src/styles/trinity-tokens.css      ← tokens, imported first and globally
src/styles/trinity-components.css  ← shared chrome: masthead, footer, cards,
                                     type roles, the FAQ accordion, the trust
                                     strip, the closing band
src/styles/<page>.css              ← one file per page, imported by its route
```

A component shared between pages keeps its styles in `trinity-components.css`.
Putting them in a page's stylesheet has shipped unstyled components three times
now — the item pages, the FAQ accordion, and the closing band.

## Before this goes live on a real domain

- [ ] The representative example still reads `borrowing £[X,XXX] at [X.X]% per
      month` on the homepage and every item page. It is a financial promotion.
- [ ] Gold and watches still say "Needs confirmation" / "Awaiting compliance"
- [ ] Four figures contradict each other across pages: **fees** (homepage says
      none, the FAQ says a set-up fee is payable), **term** (6–24 months vs
      6 renewable vs 6 + one extension), **offer timing** (1 business day vs
      same day vs 3 hours), **LTV** (80% on gold only vs 80% generally)
- [ ] `/cookies` is an unfinished placeholder; there is no consent banner
- [ ] `/trust-and-security` is empty and is linked from the masthead
- [ ] Five blog articles are placeholders
- [ ] The valuation form posts to `/api/valuation`, which does not exist
- [ ] Confirm the domain, then rebuild with the real `SITE_URL`
