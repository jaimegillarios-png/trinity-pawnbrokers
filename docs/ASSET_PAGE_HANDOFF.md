# Handoff: Trinity Asset Page — Watches

## Overview
This is the **asset landing page** template (Watches instance) — the master layout for the six sibling asset pages (Gold, Jewellery, Diamonds, Fine art, Handbags, Silver). Each sibling swaps copy, imagery, brand lists and the valuation-form fields; the structure, type, and components are identical.

## About the Design File
`Trinity Asset Template - Watches.dc.html` is a **design reference created in HTML** — a prototype of look and behavior, not production code to ship verbatim. Recreate it in the target codebase using its existing framework/components, driven by the shared **design tokens** (`tokens.css` / `tokens.json`, same files as the Trinity Design System package — do not fork them). If the system tokens are already committed from that package, reference those and delete these copies.

## Fidelity
**High-fidelity.** Match hex, type, spacing exactly (all defined as tokens).

## Page structure (top → bottom)
1. **Top rule bar** — deep-green strip: identity left, `FCA-regulated · Ref …` right (gold).
2. **Masthead** — white; left nav (What we lend against / How it works), centred wordmark (3-dot gold mark + "TRINITY / PAWNBROKERS"), right nav (Trust & security) + phone button.
3. **Hero** — vault-green band with a watch macro image under a left-heavy gradient. Left: eyebrow, H1 ("Borrow against your watch. *Wear it again* when you repay."), intro, two CTAs (gold primary + ghost), reassurance micro-line. Right: **valuation form card** (warm-panel `#FAF8F3`), a 2-step flow (watch details → contact) with a step label divider.
4. **Trust strip** — translucent dark bar under the hero: 5 inline claims (one carries a confirm chip; last is gold "Free insured collection").
5. **What we lend against** — white; eyebrow + H2 + intro, then a 4-up card grid (Phosphor Light icon, H3, body). Non-clickable cards, no hover.
6. **What it costs to borrow** — grey; 2-col: left heading+intro + a 2×2 spec table (Loan size / Term / Fees[confirm chip] / Credit file), right the **worked-example card** (label+chip, statement, ruled ledger).
7. **How it works** — white; centred eyebrow+H2, then a 4-step row: square icon badges (white Phosphor-Fill glyph layered under Phosphor-Light ochre outline), "Step 0N" label, H4, body, joined by an animated gold connector line (fills on scroll via IntersectionObserver).
8. **How we value watches** — grey; **split layout**: sticky left heading+intro, right a 2×2 card grid.
9. **Why Trinity rather than the high street** — white; centred header, then the **comparison table** (`.compare-grid`): row labels left (ochre + inline icon), Trinity column (gold-tinted, emerald `ph-check-circle` ticks, `#5FA982`), high-street column (muted `ph-x`). One row carries a confirm chip.
10. **Proof** — grey; left the live **Reviews.co.uk badge** (`#badge-200`, store `unbolted-financial-services`, primary/stars `#8A6B26`) + line; right a **case-study card** (white, ruled ledger: Piece / Amount lent / Funds released / Outcome).
11. **Watch FAQs** — white; split: sticky left heading ("Watch FAQs" / "Asked, answered"), right a single-column accordion (serif question, gold +/− toggle, body on open).
12. **Representative example** — grey; centred white card, gold border, the FCA representative-example sentence + caveat. `box-sizing:border-box` (required — see Responsive).
13. **Closing CTA** — vault-green finale: centred eyebrow ("Get started"), 44px H2, gold CTA, phone/WhatsApp line.
14. **Footer** — darkest green `#0B1D14`.

## Colour discipline (from the system)
White ↔ grey (`#F5F4F2`) alternating bands; green (`#10271C`) reserved for hero, the closing band, and footer (`#0B1D14`). Gold is accent only. Emerald `#5FA982` = the "confirm/yes" tick colour.

## Interactions & behavior
- **Valuation form**: 2 steps with a slide transition (`stepInRight`/`stepInLeft`, 0.42s; disabled under `prefers-reduced-motion`). Step label reads "Step 1 of 2 · …".
- **How-it-works connector**: `#how-fill` width animates to 100% and step badges tint to gold, staggered, when the section scrolls into view (IntersectionObserver, threshold 0.35).
- **Reviews badge**: injected in `componentDidMount` with a rAF retry until the widget script loads.
- **FAQ accordion**: one open at a time (`state.openFaq`), +/− glyph.
- **Confirm chips**: every unverified figure carries an amber chip; a global `[data-confirm-notes="off"]` hides them all for launch.
- Hover only on interactive elements (nav underline, CTAs, links). Content cards have no hover.

## Responsive (breakpoints 1020 / 960 / 620px)
- **1020**: hero stacks (copy above form); form-card margin/padding tighten.
- **960**: all multi-col grids → 1–2 col; split sections stack (sticky headings release); rates/borrow/proof/how stack.
- **620 (phone)**: single column throughout; masthead centres; **rule bar** stacks to two centred lines; **trust strip** becomes a centred hairline-divided list; section **H2** switch to `text-wrap:wrap` (fill greedily, no balanced short lines); **Why Trinity** header left-aligns to match the table; the **comparison table stays a 3-column table** (label 54px | Trinity | High street) with compacted type/padding, header row kept.
- **`box-sizing:border-box`** is required on any `width:100%` card that has padding (e.g. the representative-example card) — without it the padding overflows the viewport on phones.

## Design Tokens
See `tokens.css` / `tokens.json`. Key additions this page relies on: `--tr-success` (#5FA982) for ticks; Phosphor Light + Fill icon sets; the confirm-chip style.

## Assets / dependencies
- **Phosphor Icons** web font — Light + Fill stylesheets (`@phosphor-icons/web@2.1.1`).
- **Reviews.co.uk** badge-modern widget (`widget.reviews.co.uk/badge-modern/dist.js`).
- Hero + card imagery: Unsplash placeholders via `image-slot` — replace with licensed photography.
- Fonts: Cormorant Garamond, Archivo (Google Fonts). Archivo also covers the
  caps role, which the original handoff gave to Jost.

## Files
- `Trinity Asset Template - Watches.dc.html` — the design reference.
- `tokens.css` / `tokens.json` — shared design tokens (same as the design-system package).
