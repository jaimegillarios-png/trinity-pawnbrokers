# Trinity Pawnbrokers — Design System (developer handoff)

This is the **source of truth** for every Trinity page. Design references are built in HTML (the `.dc.html` files); production must implement them against these tokens using the codebase's own components. **Never hard-code a hex, size, or radius that exists as a token.**

## Files in this package
- `tokens.css` — CSS custom properties (`--tr-*`). Import once, globally.
- `tokens.json` — same tokens as data (for JS/tooling, Tailwind/Style-Dictionary config, etc.).
- `WORKFLOW.md` — how changes flow from design → tokens → app going forward.
- `Trinity Design System.dc.html` — the visual spec (open in a browser) the tokens are derived from.

## Fidelity
**High-fidelity.** Match hex, type, and spacing exactly.

---

## Rules (non-negotiable)
1. **One heading size.** Every section heading is `h2` = Cormorant 500 / 38px / 1.15. Emphasis comes from the eyebrow, colour and spacing — never from resizing.
2. **Alternate white → neutral.** Sections alternate `--tr-white` and `--tr-neutral`, interrupted only by green statement bands. **Max one green band between hero and footer** per page (hero and footer don't count).
3. **Gold is an accent, never a ground.** It appears only as type, icons, hairlines, and the primary CTA fill.
4. **Type roles are fixed.** Cormorant never sets body copy; Archivo never sets headings.
   Archivo serves both the body and caps roles — the caps role originally used Jost,
   dropped so the site ships two families rather than three.
5. **Compliance chip.** Any unverified figure/claim carries the amber confirm chip (10px Archivo 600 caps, `--tr-gold-mid` bg) until signed off. Provide a global switch to hide all chips at launch.
6. **Hover = interactive only.** Hover states belong on links, buttons, and clickable cards. Non-clickable cards and logos get no hover.
7. **Success/confirm colour** is `--tr-success` (#5FA982) — used for ticks in comparison tables and reassurance rows. Use consistently; don't mix with gold for "yes".

---

## Component recipes (token-mapped)

### Eyebrow + heading (section opener)
```
eyebrow:  font var(--tr-font-caps); 500; 13px; letter-spacing .28em; uppercase; color var(--tr-gold-deep); margin-bottom 14px
h2:       font var(--tr-font-display); 500; 38px/1.15; color var(--tr-green-vault)
intro:    var(--tr-font-body) 400; 16–17px/1.7; color var(--tr-ink-72); max-width 64ch
```
Vary openers between stacked / centred / heading-beside-content — but keep these token values.

### Primary CTA (`.cta-gold`)
```
var(--tr-font-body) 700; 13px; letter-spacing .16em; uppercase
color var(--tr-green-vault); background var(--tr-gold-bright); padding 18px 34px; radius var(--tr-radius)
hover: background var(--tr-gold-mid)
```

### Ghost / phone button
```
color var(--tr-green-leaf); border 1px solid rgba(29,61,44,0.5); padding 9px 14px; radius var(--tr-radius)
hover: background var(--tr-green-vault); color var(--tr-neutral); border-color var(--tr-green-vault)
```

### Text link
```
var(--tr-font-body) 700; 12px; letter-spacing .18em; uppercase; color var(--tr-green-leaf)
underline on hover (offset 5px, 1px)   — for inline body links use default a/a:hover (leaf → gold)
```

### Card (non-clickable, on light)
```
background var(--tr-white); border 1px solid var(--tr-line); radius var(--tr-radius); padding 32px
icon:  Phosphor Light, 36px, color var(--tr-gold-deep), margin-bottom 20px
title: var(--tr-font-display) 600; 24px/1.25; color var(--tr-green-vault)
body:  var(--tr-font-body) 400; 14.5px/1.6; color var(--tr-ink-68)
NO hover.
```

### Clickable card (asset collage)
Same as above but wrapped in `<a>`; add `hover: background var(--tr-neutral)` with `transition .25s`.

### Confirm chip
```
var(--tr-font-body) 600; 10px; letter-spacing .1em; uppercase
background var(--tr-gold-mid); color var(--tr-green-vault); radius var(--tr-radius-chip); padding 3px 6px
```

### Ledger / spec row (borrow, case study)
```
row: flex; justify-content space-between; padding 15px 0; border-top var(--tr-line-strong-ish rgba(27,31,28,0.22))
label: var(--tr-font-caps) 500; 12.5px; letter-spacing .16em; uppercase; color var(--tr-ink-62)
value: var(--tr-font-display) 500; 20–24px; color var(--tr-green-vault)
```

### Comparison table (Trinity vs high street)
```
3-col grid: label (var(--tr-gold-deep) caps) | Trinity col (gold-tinted bg rgba(201,168,87,0.08), border var(--tr-line-gold), tick var(--tr-success)) | rival col (muted, ph-x at var(--tr-ink-45))
Collapses to 2-col under 960px (label spans full width).
```

### Section (band)
```
padding var(--tr-section-top) var(--tr-pad-side) var(--tr-section-bottom)
inner max-width var(--tr-container); centred
divider: border-bottom 1px solid var(--tr-line-soft)
background: var(--tr-white) or var(--tr-neutral), alternating; green bands use var(--tr-green-vault) with light text (--tr-on-green-*)
```

## Responsive
- Grids collapse 4→2→1 at ~960px / ~620px.
- Two-column split sections (`heading | content`) stack at 960px; sticky headings release to static.
- Hero clamps handle fluid display sizing.

## Assets
- Icons: **Phosphor Icons** — Light weight for line icons (`ph-light`), Fill for solid (`ph-fill`). Load both stylesheets. Colour with `--tr-gold-deep` on light, `--tr-gold-mid` on green.
- Reviews badge: **Reviews.co.uk** `badge-modern` widget, store `unbolted-financial-services`, `primaryClr`/`starsClr` = `#8A6B26`.
- Photography: Unsplash placeholders in the DCs — replace with licensed imagery.
- Press logos: `images/press-*.png`, rendered `mix-blend-mode:multiply`.
