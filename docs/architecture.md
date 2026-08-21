# Trinity — Professional Build Architecture Brief

Re-platform the current static site into a professional, CMS-backed build, with a **shop coming later**. This brief captures the recommended stack and the open decisions.

## Recommended stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router)** | Future shop = dynamic commerce (cart, checkout, webhooks, possible portal). Best commerce ecosystem + best Sanity integration. |
| CMS | **Sanity** + Visual Editing | Structured content, live preview, reusable in the future shop. |
| Styling | **Tailwind CSS** | Reuse the existing CSS-variable design tokens. |
| Images | **Sanity image CDN** (`@sanity/image-url`) + `next/image` | Stop inlining base64; proper optimization. |
| Analytics/consent | Plausible or GA4 + cookie banner | GDPR/UK requirement for a financial business. |

**SEO/compliance:** per-page metadata, Open Graph, sitemap, `robots.txt`, `FinancialService` JSON-LD; CMS-managed legal pages (Privacy / Terms / Cookies, representative APR example, complaints procedure).

## Hosting — OPEN DECISION

- **Vercel** — least friction; Next.js is native there. Best Sanity revalidation + preview deploys.
- **Cloudflare**, two ways:
  1. **DNS/CDN only, hosting on Vercel** — zero downside, common.
  2. **Cloudflare Pages hosting** — cheaper bandwidth, but Next needs the `@opennextjs/cloudflare` adapter (more setup: ISR via Workers KV, `next/image` needs a loader).
- Note: committing fully to **Cloudflare hosting** makes **Astro** the more native/cheaper fit than Next — which reopens **Astro vs Next**.

## Suggested project structure (shop-ready from day one)

```
/app
  /(marketing)   -> home, about, loan pages, legal
  /studio        -> embedded Sanity Studio
  /(shop)        -> reserved now, built in phase 2
  /api           -> webhooks, revalidate, (future) checkout
/components      -> Header, Hero, Stats, Offerings, FAQ, Press, CTA, Footer
/sanity          -> schemas, GROQ queries, client
/lib             -> image-url, utils, (future) commerce client
```

Reserving `(shop)` + `/lib/commerce` lets the shop drop in later with **no re-architecture**.

## Migration = re-platform, not redesign

1. Scaffold Next.js + Sanity + Tailwind.
2. Port each section into a component.
3. Model Sanity schemas so the client edits all content.
4. Wire Sanity images + SEO.
5. Deploy to Vercel/Cloudflare with preview URLs.

## Shop (phase 2, deferred)

- The business already has a working shop (unboltedluxury.com) on **Squarespace**; it must be **rebranded to Trinity**.
- Two paths:
  - **Rebrand on Squarespace** — fast, self-managed, but design won't match the bespoke site.
  - **Rebuild into the Next.js site** — seamless, more work; via **Shopify headless** or **Stripe Checkout**.
- For a small, unique, high-value catalogue, an **"enquire / reserve to purchase"** flow is worth considering over instant checkout.

## What the business must provide

- A **Sanity account** (create project → `projectId` / `dataset` / API token).
- A **Vercel or Cloudflare account** to deploy under.
- (Claude scaffolds all code to plug straight in; it cannot create accounts or enter credentials.)

## Open decisions to make

1. **Hosting:** Vercel vs Cloudflare (and if Cloudflare, reconsider Astro vs Next).
2. **Shop backend** (later): Squarespace-rebrand vs Shopify-headless vs Stripe.

---

*Context: this brief originated in a parallel Trinity chat that built a single-page marketing design (three-ball logo mark, Reviews.io + real press-logo strip). That work lives in the repo's git history and can be cherry-picked if useful. Continue the professional build in the v2 chat to avoid overwriting between chats.*
