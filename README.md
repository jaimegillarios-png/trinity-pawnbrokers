# Trinity Pawnbrokers — Homepage

Static marketing homepage, recreated from a Claude Design prototype.

- **`index.html`** — the live page, fully self-contained (images embedded as inline WebP). Open it directly in any browser or serve it with any static host.
- **`images/`** — source masters (`*.jpg`) and optimized variants in `images/opt/` (AVIF / WebP / compressed JPEG).
- **`scripts/optimize-images.mjs`** — regenerates the optimized image variants (requires `sharp`).

## Versions
A floating **Version** toggle (bottom center) switches between **Home A** (monochrome) and **Home B** (emerald, default).

## Local preview
Any static server works, e.g.:

```
python3 -m http.server 4173
```

Then open http://localhost:4173

## Design system

Tokens are the single source of truth — never hard-code a hex, size or radius that exists as a token.

- **`src/styles/trinity-tokens.css`** — the `--tr-*` custom properties. Imported first on every page.
- **`src/styles/trinity-tokens.json`** — the same tokens as data, for tooling.
- **`src/styles/trinity-theme.js`** — *generated*. Run `node scripts/build-theme.mjs` after any token change; shaped to drop into a Tailwind `theme.extend`, and importable as a plain ES module.
- **`src/styles/asset-page.css`** — the component layer for asset pages (bands, cards, ledger, comparison table, chips…). Every value resolves to a token; tints the system doesn't name are derived with `color-mix()` at the top of the file.
- **`src/scripts/asset-page.js`** — shared behaviours (2-step valuation form, how-it-works connector, Reviews badge, FAQ accordion).
- **`docs/`** — `DESIGN_SYSTEM.md` (component recipes), `WORKFLOW.md` (how changes flow design → tokens → app), `ASSET_PAGE_HANDOFF.md` (the asset-page spec).

### Asset pages
**`watches.html`** is the master template for the six asset pages (Gold, Jewellery, Diamonds, Fine art, Handbags, Silver). Siblings swap copy, imagery, brand lists and the valuation-form fields — structure, type and components stay identical.

Set `data-confirm-notes="off"` on `<body>` to hide every amber compliance chip at launch.
