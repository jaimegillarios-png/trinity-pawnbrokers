#!/usr/bin/env python3
"""Generates the Trinity Pawnbrokers logo as standalone SVG files.

Text is converted to outlines from the same Google Fonts webfonts the site
loads (Cormorant Garamond 600, Archivo 600), so the files render identically
anywhere with no font dependency. Geometry is taken from the live CSS lockup.
"""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.misc.transform import Transform
import os
import re
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "brand")
CACHE = os.path.join(ROOT, ".fontcache")
os.makedirs(OUT, exist_ok=True)
os.makedirs(CACHE, exist_ok=True)

# The same webfonts the site loads. Cached locally so a re-run is offline.
GF = ("https://fonts.googleapis.com/css2"
      "?family=Cormorant+Garamond:wght@600&family=Archivo:wght@600&display=swap")
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")


def fetch_fonts():
    """Downloads the latin woff2 for each family into .fontcache/."""
    need = {"Cormorant Garamond": None, "Archivo": None}
    for fam in need:
        path = os.path.join(CACHE, fam.replace(" ", "-") + ".woff2")
        need[fam] = path
    if all(os.path.exists(p) for p in need.values()):
        return need

    req = urllib.request.Request(GF, headers={"User-Agent": UA})
    css = urllib.request.urlopen(req).read().decode("utf-8")
    for subset, block in re.findall(r"/\*\s*([\w-]+)\s*\*/\s*@font-face\s*\{(.*?)\}", css, re.S):
        if subset != "latin":
            continue
        fam = re.search(r"font-family:\s*'([^']+)'", block).group(1)
        url = re.search(r"url\((https[^)]+\.woff2)\)", block).group(1)
        if fam in need and not os.path.exists(need[fam]):
            with urllib.request.urlopen(url) as r, open(need[fam], "wb") as fh:
                fh.write(r.read())
            print(f"  downloaded {fam}")
    return need


_fonts = fetch_fonts()
DISPLAY = _fonts["Cormorant Garamond"]   # --tr-font-display
BODY = _fonts["Archivo"]                 # --tr-font-body

GOLD = "#8A6B26"   # --tr-gold-deep
INK = "#1B1F1C"    # --tr-ink
GOLD_MID = "#C9A857"  # --tr-gold-mid  (reversed lockups)
WHITE = "#FFFFFF"
SUB_OPACITY = "0.72"  # --tr-ink-72

_cache = {}


def load(path):
    if path not in _cache:
        f = TTFont(path)
        _cache[path] = (f, f.getGlyphSet(), f.getBestCmap(), f["head"].unitsPerEm)
    return _cache[path]


def num(v):
    return f"{round(v, 3):g}"


def run(font_path, text, size, letter_spacing):
    """Returns (path_d, ink_bounds, advance_width) with the baseline at y=0."""
    _, gs, cmap, upem = load(font_path)
    scale = size / upem
    x, parts, bounds = 0.0, [], None
    for ch in text:
        glyph = gs[cmap[ord(ch)]]

        pen = SVGPathPen(gs, ntos=num)
        glyph.draw(TransformPen(pen, Transform(scale, 0, 0, -scale, x, 0)))
        d = pen.getCommands()
        if d:
            parts.append(d)

        bp = BoundsPen(gs)
        glyph.draw(bp)
        if bp.bounds:
            x0, y0, x1, y1 = bp.bounds
            bb = (x + x0 * scale, -y1 * scale, x + x1 * scale, -y0 * scale)
            bounds = bb if bounds is None else (
                min(bounds[0], bb[0]), min(bounds[1], bb[1]),
                max(bounds[2], bb[2]), max(bounds[3], bb[3]))

        x += glyph.width * scale + letter_spacing
    return " ".join(parts), bounds, x


def dot(cx, cy, r, fill):
    return f'<circle cx="{num(cx)}" cy="{num(cy)}" r="{num(r)}" fill="{fill}"/>'


def wrap(title, w, h, body, pad=0.0):
    vb = f"{num(-pad)} {num(-pad)} {num(w + pad * 2)} {num(h + pad * 2)}"
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" '
        f'width="{num(w + pad * 2)}" height="{num(h + pad * 2)}" '
        f'role="img" aria-label="{title}">\n'
        f"  <title>{title}</title>\n{body}\n</svg>\n"
    )


# --------------------------------------------------------------------------
# Shared type runs. Sizes/tracking come straight from trinity-components.css:
#   .tr-wordmark__name  600 30px Cormorant Garamond, letter-spacing .2em (6px)
#   .tr-wordmark__sub   600 9px  Archivo,            letter-spacing .42em (3.78px)
# --------------------------------------------------------------------------
NAME_D, NAME_B, _ = run(DISPLAY, "TRINITY", 30, 6)
SUB_D, SUB_B, _ = run(BODY, "PAWNBROKERS", 9, 3.78)

NAME_W = NAME_B[2] - NAME_B[0]
SUB_W = SUB_B[2] - SUB_B[0]
CAP_H = -NAME_B[1]          # 19.62 — cap height of TRINITY at 30px
SUB_BOTTOM = SUB_B[3]       # ink below the baseline (comma-free caps: ~0.1)


def lockup_stacked(gold, ink, sub_fill, sub_op):
    """Mark above, wordmark centred — the masthead lockup.

    Dot geometry: 9px dots, 2.26px vertical gap, 4px horizontal gap, one dot
    above a pair. Vertical rhythm is measured from the rendered page:
    mark bottom -> TRINITY cap top = 13.88, TRINITY baseline -> PAWNBROKERS
    cap top = 15.04.
    """
    d, vgap, hgap = 9.0, 2.26, 4.0
    r = d / 2
    mark_w = d * 2 + hgap                 # 22
    mark_h = d * 2 + vgap                 # 20.26

    name_base = mark_h + 13.88 + CAP_H    # 53.76
    sub_base = name_base + 15.04 + (-SUB_B[1])

    width = max(mark_w, NAME_W, SUB_W)
    cx = width / 2
    height = sub_base + SUB_BOTTOM

    mark_x = cx - mark_w / 2
    body = "\n".join([
        "  <!-- mark -->",
        "  " + dot(mark_x + mark_w / 2, r, r, gold),
        "  " + dot(mark_x + r, d + vgap + r, r, gold),
        "  " + dot(mark_x + mark_w - r, d + vgap + r, r, gold),
        "  <!-- TRINITY -->",
        f'  <path transform="translate({num(cx - NAME_W / 2 - NAME_B[0])} {num(name_base)})"'
        f' fill="{ink}" d="{NAME_D}"/>',
        "  <!-- PAWNBROKERS -->",
        f'  <path transform="translate({num(cx - SUB_W / 2 - SUB_B[0])} {num(sub_base)})"'
        f' fill="{sub_fill}" fill-opacity="{sub_op}" d="{SUB_D}"/>',
    ])
    return width, height, body


def lockup_horizontal(gold, ink, sub_fill, sub_op):
    """Mark on the left, inverted (pair above single), text stacked to its right.

    Dot 16.1px so the mark matches the visible height of the two text lines
    (cap-top of TRINITY to the baseline of PAWNBROKERS = 36.17px). Gaps stay
    proportional to the dot: 0.251 vertical, 0.444 horizontal.
    """
    d = 16.1
    r = d / 2
    vgap, hgap = d * 0.251, d * 0.444
    mark_w = d * 2 + hgap
    mark_h = d * 2 + vgap

    gap = 13.0                            # column-gap
    text_x = mark_w + gap

    name_base = CAP_H                     # mark top aligns with TRINITY cap top
    sub_base = mark_h                     # mark bottom aligns with PAWN baseline

    width = text_x + max(NAME_W, SUB_W)
    height = max(mark_h, sub_base + SUB_BOTTOM)

    body = "\n".join([
        "  <!-- mark (inverted: pair above single) -->",
        "  " + dot(r, r, r, gold),
        "  " + dot(mark_w - r, r, r, gold),
        "  " + dot(mark_w / 2, mark_h - r, r, gold),
        "  <!-- TRINITY -->",
        f'  <path transform="translate({num(text_x - NAME_B[0])} {num(name_base)})"'
        f' fill="{ink}" d="{NAME_D}"/>',
        "  <!-- PAWNBROKERS -->",
        f'  <path transform="translate({num(text_x - SUB_B[0])} {num(sub_base)})"'
        f' fill="{sub_fill}" fill-opacity="{sub_op}" d="{SUB_D}"/>',
    ])
    return width, height, body


def mark_only(gold, d=9.0):
    r = d / 2
    vgap, hgap = d * 0.251, d * 0.444
    w = d * 2 + hgap
    h = d * 2 + vgap
    body = "\n".join([
        "  " + dot(w / 2, r, r, gold),
        "  " + dot(r, h - r, r, gold),
        "  " + dot(w - r, h - r, r, gold),
    ])
    return w, h, body


FILES = []


def emit(name, title, w, h, body):
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(wrap(title, w, h, body))
    FILES.append((name, w, h, os.path.getsize(path)))


w, h, b = lockup_stacked(GOLD, INK, INK, SUB_OPACITY)
emit("trinity-logo-stacked.svg", "Trinity Pawnbrokers", w, h, b)

w, h, b = lockup_stacked(GOLD_MID, WHITE, WHITE, "0.78")
emit("trinity-logo-stacked-reversed.svg", "Trinity Pawnbrokers", w, h, b)

w, h, b = lockup_horizontal(GOLD, INK, INK, SUB_OPACITY)
emit("trinity-logo-horizontal.svg", "Trinity Pawnbrokers", w, h, b)

w, h, b = lockup_horizontal(GOLD_MID, WHITE, WHITE, "0.78")
emit("trinity-logo-horizontal-reversed.svg", "Trinity Pawnbrokers", w, h, b)

w, h, b = mark_only(GOLD)
emit("trinity-mark.svg", "Trinity Pawnbrokers mark", w, h, b)

for name, w, h, size in FILES:
    print(f"  {name:42s} {num(w):>7s} x {num(h):<7s} {size:>6d} B")
