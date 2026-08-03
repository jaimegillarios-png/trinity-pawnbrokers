# Workflow — keeping design & code in sync

The goal: **one source of truth, changes flow one direction.** A value is defined once (in tokens), documented once (in the design system), and consumed everywhere (design DCs + production app). No page — design or code — invents its own hex/size.

```
   Trinity Design System.dc.html   ←  the human-readable spec
              │  (derives)
              ▼
   tokens.css  +  tokens.json       ←  the machine contract  ← SINGLE SOURCE OF TRUTH
        │                    │
        ▼                    ▼
   design .dc.html pages     production codebase
   (reference tokens)        (imports tokens)
```

## One-time setup in the codebase
1. Commit `tokens.css` and `tokens.json` into the repo (e.g. `src/styles/trinity-tokens.css`).
2. Import `tokens.css` once at the app root so `--tr-*` are global.
3. If you use Tailwind / Style Dictionary / CSS-in-JS, generate your theme config **from `tokens.json`** rather than re-typing values. (A ~20-line script maps `tokens.json` → your theme.)
4. Replace hard-coded colours/sizes in existing components with the `--tr-*` variables. After this, a token change updates the whole app with no component edits.

## Making a change from now on
1. **Design first in the DC.** Adjust the design system DC and/or the page DC to explore the change visually.
2. **Promote it to a token.** If the change is systemic (a colour, a type step, a spacing value), edit `tokens.css` + `tokens.json` — not the individual pages. If it's a one-off layout tweak, it stays in the page.
3. **Write a short changelog.** One markdown file per change: which tokens changed (old → new), and any component recipe that changed. (See the format below.)
4. **Hand the changelog to Claude Code.** "Apply `CHANGELOG_xxx.md` — update tokens, don't rebuild." Because the app reads tokens, most changes are a one-line token edit.

## Changelog format (copy this per change)
```markdown
# Change: <short name> — <date>
## Tokens
- --tr-neutral: #F5F1E6 → #F5F4F2
- --tr-white-band: #FAF7EC → #FFFFFF
## Components (only if a recipe changed)
- Masthead background → var(--tr-white)
- Press logos: remove hover (non-clickable)
## Rationale
One line on why.
```

## What lives where
- **Token** (in `tokens.*`): anything reused across pages — colours, type steps, spacing, radius, shadows, the confirm-chip style, success colour.
- **Component recipe** (in `DESIGN_SYSTEM.md`): how tokens compose into a button, card, section, ledger, comparison table, chip.
- **Page** (in a page's own file/component): content, one-off layout, section order.

## Versioning
- Bump the version string in `Trinity Design System.dc.html`'s top bar and a `## Changelog` list each time tokens change, so design and code can confirm they're on the same version.
- Keep old changelogs in a `changelog/` folder — they are the audit trail of the system.

## The rule that keeps it clean
If you ever find yourself typing a raw hex or px value that already exists as a token, stop — reference the token instead. That single discipline is what makes the system systematic.
