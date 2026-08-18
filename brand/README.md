# Trinity Pawnbrokers — logo files

`trinity-logo.svg` is the supplied master artwork and is the logo in use.
The remaining files are type-built lockups generated from the design tokens —
useful where you need the PAWNBROKERS descender or a stacked arrangement.

All are standalone SVGs with the text converted to outlines, so they render
identically anywhere with no font loading and no missing-font substitution.

| File | Use |
| --- | --- |
| `trinity-logo.svg` | **Master — supplied artwork.** Inverted mark left, TRINITY right. This is what the site masthead uses. |
| `trinity-logo-stacked.svg` | Type-built lockup — mark above the wordmark, with PAWNBROKERS. |
| `trinity-logo-horizontal.svg` | Left-aligned lockup — inverted mark left, wordmark right. For wide, short spaces. |
| `trinity-mark.svg` | The three-ball mark alone. Favicons, avatars, stamps. |
| `trinity-logo-stacked-reversed.svg` | Stacked lockup for dark backgrounds. |
| `trinity-logo-horizontal-reversed.svg` | Horizontal lockup for dark backgrounds. |

## Specification

Drawn from the design tokens — nothing here is an eyeballed value.

- **Mark** — `--tr-gold-deep` `#8A6B26`; reversed uses `--tr-gold-mid` `#C9A857`
- **TRINITY** — Cormorant Garamond 600, 30px, letter-spacing 0.2em, `--tr-ink` `#1B1F1C`
- **PAWNBROKERS** — Archivo 600, 9px, letter-spacing 0.42em, `--tr-ink` at 72%

Sizes are the source proportions; the SVGs scale losslessly to any size.

In the stacked lockup the mark sits one above two. In the horizontal lockup it
is inverted — two above one — and scaled so its height matches the *visible*
height of the two text lines (cap-top of TRINITY to the baseline of
PAWNBROKERS), not their line boxes, which carry leading and read too tall.

## Clear space and minimum size

- **Clear space** — the diameter of one mark dot on all four sides.
- **Minimum width** — 90px for the stacked lockup, 120px for the horizontal;
  below that PAWNBROKERS stops being legible. Use `trinity-mark.svg` instead.

The viewBox is cropped tight to the artwork, so add clear space in layout
rather than expecting it inside the file.

## Regenerating

Built by `scripts/make-logo-svg.py` from the Cormorant Garamond and Archivo
webfonts. Re-run it only if the type specification in `trinity-components.css`
changes — the geometry constants in the script are measured from the rendered
lockup and are commented with where each figure comes from.
