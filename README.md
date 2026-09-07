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

- **Almost every route is prerendered.** The three that are not — the checkout
  API, the Stripe webhook and the order confirmation page — are the whole
  reason a Worker ships at all. The adapter's own `_routes.json` sends most
  requests through that Worker to be handed a file already on disk, which
  caused intermittent 522s. `scripts/routes.mjs` runs on every build and
  rewrites it as an allow-list of just those three routes; if nothing sets
  `export const prerender = false` it deletes the Worker outright.
- **The pages.dev host is noindexed** by `public/_headers`, scoped to that host
  so a real domain added later is unaffected.

## The shop

Six placeholder pieces, priced in pence because that is what Stripe charges in.
Stock is unique — an item is available or it is gone — so the checkout does two
things a normal cart does not:

- **Prices come from Sanity at request time**, never from the browser. The cart
  stores slugs only, so an edited price cannot reach Stripe.
- **A piece is held for 30 minutes** while its buyer is on the payment page, and
  the hold is written under the revision the availability check read. Two people
  clicking Checkout on the same watch at the same moment: one gets a session,
  the other gets told. The webhook marks it sold on payment and releases it if
  the session lapses.

Four secrets, all request-time (see `.env.example`):

| | |
|---|---|
| `STRIPE_SECRET_KEY` | Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | The signing secret for the endpoint below |
| `SANITY_API_WRITE_TOKEN` | Editor permission. Holds and sells stock |
| `PUBLIC_SANITY_PROJECT_ID` | Already set; the shop reuses it |

Point a Stripe webhook at `https://<host>/api/stripe-webhook` and subscribe to
`checkout.session.completed`, `checkout.session.expired`,
`checkout.session.async_payment_succeeded` and
`checkout.session.async_payment_failed`. Without it nothing is ever marked sold.

Locally: `stripe listen --forward-to localhost:4321/api/stripe-webhook`.

Missing either secret, the checkout returns 503 and says to call instead — it
will not create a session it cannot back with a hold.

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

### The shop specifically

- [ ] Six commercial answers are outstanding: what the shop sells beyond
      watches, the carrier/cost/timescale, VAT treatment (margin scheme?),
      returns address and who pays return postage, warranty terms and who
      honours them, and whether delivery is really included
- [ ] `/shipping-and-returns` and `/terms-of-sale` are written and seedable, but
      carry `[TO CONFIRM: …]` markers for exactly those answers. Search for
      `TO CONFIRM` in `scripts/shop-legal.mjs` — none may survive launch
- [ ] Both pages need seeding: `SANITY_API_WRITE_TOKEN=… node
      scripts/migrate-to-sanity.mjs`. Until then the footer and cart simply do
      not link to them
- [ ] Six products are placeholders, all titled "(placeholder)" and noindexed
- [ ] Stripe is in test mode until real keys are set
