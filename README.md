# Trinity Pawnbrokers

Static marketing site, built against the Trinity design system.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Homepage (served at `/`) |
| `watches.html` | Watches asset page — the written reference instance |
| `gold` · `jewellery` · `diamonds` · `fine-art` · `handbags` · `silver` `.html` | Sibling asset pages — scaffolded, copy still `TODO` |
| `index-v1.html`, `index-v2.html` | Earlier homepage directions, kept for reference |

## Design system

Tokens are the single source of truth — no page invents its own hex or type size.

```
src/styles/trinity-tokens.css   ← the tokens (import first, globally)
src/styles/trinity-components.css ← global chrome: masthead, footer, buttons, cards, type
src/styles/asset-page.css       ← asset-page layout only
src/scripts/trinity-reveal.js   ← entrance animations (shared)
src/scripts/asset-page.js       ← form, FAQ, connector, reviews badge
```

Import order on every page: **tokens → components → page**.

- `docs/DESIGN_SYSTEM.md` — component recipes and the non-negotiable rules
- `docs/WORKFLOW.md` — how a change flows design → tokens → code
- `docs/ASSET_PAGES.md` — content/template split for the asset pages
- `docs/changelog/` — one file per systemic change

## Build

Nothing is required to view the site — it is plain static HTML. Two generators
keep derived files in sync:

```bash
node scripts/build-theme.mjs         # tokens.json  -> src/styles/trinity-theme.js
node scripts/build-asset-pages.mjs   # src/content/*.js -> <slug>.html
node scripts/scaffold-asset.mjs …    # new asset content file (see docs/ASSET_PAGES.md)
```

Asset `.html` files are **generated** — edit `src/content/<slug>.js` and rebuild.

## Local preview

```
python3 -m http.server 4173
```

Then open http://localhost:4173
