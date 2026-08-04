# Change: Form field — label inside the field — 2026-08-04

## Tokens
None. No token values changed.

## Components (recipe change)
- **Field (new recipe `.tr-field`)** — replaces "label above a bordered input".
  One bordered box per field; the label sits on the top line inside the box,
  in micro-caps, with the value beneath.
  - box: background `--tr-white`, border 1px `--tr-line-strong`,
    radius `--tr-radius`, padding 9px 14px 10px
  - label: `--tr-font-caps` 500 / 10.5px / .14em / uppercase, `--tr-ink-62`
  - value: `--tr-font-body` 400 / 16px, `--tr-ink`, borderless and transparent
  - hover: border `--tr-ink-45`
  - focus: the **whole box** reacts via `:focus-within` — border
    `--tr-gold-deep` + 2px `--tr-focus-ring` (previously only the control did)
  - select: chevron drawn in CSS, `--tr-gold-deep`, centred on the value row
- **`.tr-label`** now means a standalone label for a non-field control
  (e.g. the photo drop zone) and matches the field label's micro-caps style.

## Notes for the design system
The field label is 10.5px caps, which is below the ramp's smallest step
(`--tr-microcaps` 12.5px). If this recipe is adopted, consider promoting it to
a token (e.g. `--tr-field-label`) rather than leaving it as a component value.
`--tr-label` (15px/1.45) is no longer used by the valuation form.

## Rationale
The label-above-a-box pattern read dated beside the rest of the page and made
the form card tall. Moving the label inside shortens each field, tightens the
card, and puts the emphasis on the value the customer types.
