"""
Tilda T123 horizontal-overflow fix.
Reads tilda-single.html → writes tilda-single-v2.html.
No visual changes — only containment fixes.
"""
import re, sys, os
sys.stdout.reconfigure(encoding='utf-8')

SRC  = "ai laboratory/prototype/tilda-upload/tilda-single.html"
DEST = "ai laboratory/prototype/tilda-upload/tilda-single-v2.html"

with open(SRC, "r", encoding="utf-8") as f:
    css_end = f.read()

# ── 1. .ailab-root root block ────────────────────────────────────────────────
# Replace overflow-x: hidden with the full containment set
css_end = css_end.replace(
    "  overflow-x: hidden;\n  -webkit-font-smoothing: antialiased;",
    "  width: 100%;\n  max-width: 100%;\n  overflow-x: clip;\n  position: relative;\n  -webkit-font-smoothing: antialiased;"
)

# ── 2. All grid-template-columns: use minmax(0, 1fr) ─────────────────────────
css_end = css_end.replace("repeat(2, 1fr)",  "repeat(2, minmax(0, 1fr))")
css_end = css_end.replace("repeat(3, 1fr)",  "repeat(3, minmax(0, 1fr))")
css_end = css_end.replace("repeat(5, 1fr)",  "repeat(5, minmax(0, 1fr))")
# "1fr 1fr" patterns (cases, apps, cta grids)
css_end = re.sub(
    r'(grid-template-columns:\s*)1fr 1fr',
    r'\1minmax(0, 1fr) minmax(0, 1fr)',
    css_end
)
# "160px 1fr" in how__step
css_end = css_end.replace("grid-template-columns: 160px 1fr",
                           "grid-template-columns: 160px minmax(0, 1fr)")
# team__grid 1fr in media query
css_end = re.sub(
    r'(grid-template-columns:\s*)1fr;',
    r'\1minmax(0, 1fr);',
    css_end
)

# ── 3. Negative-margin track-wrap: keep but ensure parent clips ───────────────
# Already handled by overflow-x: clip on .ailab-root.
# Additionally, wrap the track-wrap in its own clip context:
css_end = css_end.replace(
    ".ailab-root .cases__track-wrap {\n\n  margin-left: calc(-1 * var(--pad));\n  margin-right: calc(-1 * var(--pad));\n\n}",
    ".ailab-root .cases__track-wrap {\n\n  margin-left: calc(-1 * var(--pad));\n  margin-right: calc(-1 * var(--pad));\n  overflow-x: clip;\n\n}"
)

# ── 4. Append a Tilda compatibility patch block inside <style> ────────────────
COMPAT_PATCH = """
/* ── Tilda T123 compatibility patch ── */

/* Flex children: prevent blowout */
.ailab-root .cases__slide-left,
.ailab-root .cases__slide-right,
.ailab-root .apps__slide-info,
.ailab-root .apps__slide-preview,
.ailab-root .cta__left,
.ailab-root .cta__form,
.ailab-root .how__tl-body,
.ailab-root .how__step-body,
.ailab-root .footer__inner,
.ailab-root .footer__contacts,
.ailab-root .services__card,
.ailab-root .models__card,
.ailab-root .why__item,
.ailab-root .team__card,
.ailab-root .market__stat { min-width: 0; }

/* Sliders: hard-contain */
.ailab-root .cases__track-wrap,
.ailab-root .apps__track-wrap { overflow: hidden; max-width: 100%; }

/* Partners ticker: clip at parent boundary */
.ailab-root .partners__ticker { max-width: 100%; }

/* Nav: in Tilda context use width:100% instead of left/right:0 */
.ailab-root .nav { width: 100%; }

/* Hero canvas: never exceed root */
.ailab-root #hero-canvas { max-width: 100%; }

/* Landscape grid: force collapse on narrow Tilda containers */
@media (max-width: 900px) {
  .ailab-root .landscape__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 560px) {
  .ailab-root .landscape__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ailab-root .market__stats   { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .ailab-root .stats__grid     { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ailab-root .how__timeline   { flex-direction: column; }
  .ailab-root .how__timeline::before { display: none; }
}
"""

css_end = css_end.replace("</style>", COMPAT_PATCH + "\n</style>", 1)

with open(DEST, "w", encoding="utf-8") as f:
    f.write(css_end)

size = os.path.getsize(DEST)
print(f"OK  {DEST}")
print(f"    size: {size:,} bytes")

# ── quick sanity: check no bare 1fr grids remain ─────────────────────────────
remaining = re.findall(r'grid-template-columns:[^;]*(?<!\(0,\s)1fr', css_end)
if remaining:
    print(f"WARN: {len(remaining)} unscoped 1fr patterns remain:")
    for r in remaining[:10]:
        print(f"  {r.strip()}")
else:
    print("    grid-template-columns: all use minmax(0,1fr)")

# ── check overflow-x: hidden not on root ─────────────────────────────────────
root_block_match = re.search(r'\.ailab-root \{[^}]+\}', css_end)
if root_block_match and 'overflow-x: hidden' in root_block_match.group():
    print("WARN: .ailab-root still has overflow-x: hidden")
else:
    print("    .ailab-root overflow-x: clip  OK")
