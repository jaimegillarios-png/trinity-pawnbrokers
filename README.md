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
