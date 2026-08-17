# Asset pages — content, template, build

Seven asset pages (Watches, Gold, Jewellery, Diamonds, Fine art, Handbags,
Silver) share one layout. **Content and layout are separate**: per-asset copy
lives in a data file, the layout lives in a template, and the `.html` files are
generated output.

```
src/content/<slug>.js        ← per-asset content (copy, imagery, fields, FAQs…)
        +
src/templates/asset-page.mjs ← the layout — never per-asset
src/templates/trinity.config.mjs ← phone, legal footer, CDN + widget URLs
        ↓  node scripts/build-asset-pages.mjs
<slug>.html                  ← GENERATED — do not hand-edit
```

## Editing an existing page

1. Edit `src/content/<slug>.js`.
2. `node scripts/build-asset-pages.mjs <slug>` (omit the slug to rebuild all).
3. Commit both the content file and the regenerated HTML.

The generated HTML is committed because this is a static site with no
server-side build — but it is output. Anything you type into a `.html` file is
lost on the next build.

## Adding a page

```bash
node scripts/scaffold-asset.mjs <slug> "<Display name>" <singular> <plural> [hero-image]
node scripts/build-asset-pages.mjs <slug>
```

The scaffold writes a complete content file with every writer-facing string
marked `TODO`. The build script reports how many remain, so "is this page
finished?" has an objective answer.

## What belongs where

| Belongs in **content** | Belongs in the **template** | Belongs in the **design system** |
| --- | --- | --- |
| Copy, headings, FAQs | Section order, markup | Colours, type, spacing |
| Hero image + alt text | Grid structure, classes | Component recipes |
| Valuation form fields | The 2-step form mechanics | Field, card, ledger styling |
| Worked example figures | Ledger markup | Ledger type + rules |
| Brand lists, icons chosen | Where icons render | Icon size + colour |

Rule of thumb: if you find yourself typing "watch" or "gold" in
`asset-page.mjs`, it belongs in a content file. If you type a hex or a px value
that already exists as a token, see `docs/WORKFLOW.md`.

## Current state

| Page | Content | Notes |
| --- | --- | --- |
| `watches.html` | **Written** | The reference instance. |
| `gold.html`, `jewellery.html`, `diamonds.html`, `fine-art.html`, `handbags.html`, `silver.html` | **Scaffold** | ~47 TODOs each. Hero images are stand-ins from `images/v2/`. Not linked from the homepage yet, and the specimen bar reads "PLACEHOLDER COPY — not for review". |

Before a scaffolded page goes live: write the copy, replace the hero image with
licensed photography, set the real valuation fields for that asset, get the
worked example and representative example signed off, then link it from the
homepage collage in `index.html`.
