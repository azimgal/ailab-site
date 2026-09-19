import re, os

SCOPE = '.ailab-root'
INPUT  = "ai laboratory/prototype/tilda-upload/site-merged.html"
OUTPUT = "ai laboratory/prototype/tilda-upload/tilda-single.html"

with open(INPUT, "r", encoding="utf-8") as f:
    src = f.read()

# ── helpers ──────────────────────────────────────────────────────────────────

def find_close(text, start):
    """Return index right after the closing '}' that matches '{' at start."""
    depth = 0
    i = start
    n = len(text)
    in_str = False
    sc = None
    while i < n:
        c = text[i]
        if in_str:
            if c == sc and text[i-1:i] != '\\':
                in_str = False
        elif c in ('"', "'"):
            in_str = True; sc = c
        elif c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                return i + 1
        i += 1
    return n


def parse_blocks(css):
    """Yield (selector_str, content_str) for every top-level block."""
    i = 0; n = len(css)
    while i < n:
        # skip whitespace + comments
        while i < n:
            if css[i].isspace():
                i += 1
            elif css[i:i+2] == '/*':
                e = css.find('*/', i+2)
                i = (e + 2) if e != -1 else n
            else:
                break
        if i >= n: break

        # read selector up to '{'
        j = i
        in_str = False; sc = None
        while j < n:
            c = css[j]
            if in_str:
                if c == sc: in_str = False
            elif c in ('"', "'"):
                in_str = True; sc = c
            elif c == '{':
                break
            j += 1
        if j >= n: break

        raw_sel = css[i:j]
        sel = re.sub(r'/\*.*?\*/', '', raw_sel).strip()
        sel = re.sub(r'\s+', ' ', sel)

        close = find_close(css, j)
        content = css[j+1:close-1]
        i = close
        if sel:
            yield sel, content


def scope_selectors(raw, extra_prefix='  '):
    """Scope a comma-separated selector list under SCOPE."""
    parts = [p.strip() for p in raw.split(',')]
    out = []
    for p in parts:
        if not p or p in ('html', 'body', '*'): continue
        if p == ':root':
            out.append(SCOPE)
        else:
            out.append(f'{SCOPE} {p}')
    return (', '.join(out)) if out else None


def scope_media_content(inner_css):
    """Scope selectors inside a @media block."""
    lines = []
    for sel, content in parse_blocks(inner_css):
        if sel in ('*', '*, *::before, *::after', 'html', 'body'): continue
        scoped = scope_selectors(sel)
        if scoped:
            lines.append(f'  {scoped} {{\n{content}\n  }}')
    return '\n'.join(lines)


# ── CSS transform ─────────────────────────────────────────────────────────────

def transform_css(raw_css):
    out = []
    body_block = None

    for sel, content in parse_blocks(raw_css):
        # --- remove global resets ---
        if sel in ('*', '*, *::before, *::after', '*,*::before,*::after',
                   '*, *::before,*::after'):
            # Keep only box-sizing (safe to scope)
            out.append(f'{SCOPE} *, {SCOPE} *::before, {SCOPE} *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}')
            continue

        if sel == 'html':
            continue   # scroll-behavior handled below

        if sel == 'body':
            body_block = content
            continue

        # :root  →  .ailab-root (CSS vars)
        if sel == ':root':
            combined = content.strip()
            # merge body styles + scroll-behavior
            if body_block:
                combined += '\n' + body_block.strip()
                body_block = None
            combined += '\n  scroll-behavior: smooth;'
            out.append(f'{SCOPE} {{\n{combined}\n}}')
            continue

        # @keyframes / @font-face  →  keep verbatim
        if re.match(r'@(-webkit-)?keyframes|@font-face', sel):
            out.append(f'{sel} {{\n{content}\n}}')
            continue

        # @media  →  scope inner rules
        if sel.startswith('@media'):
            inner = scope_media_content(content)
            if inner:
                out.append(f'{sel} {{\n{inner}\n}}')
            continue

        # regular selector
        scoped = scope_selectors(sel)
        if scoped:
            out.append(f'{scoped} {{\n{content}\n}}')

    # flush leftover body block (if :root came before body in source)
    if body_block:
        out.append(f'{SCOPE} {{\n{body_block.strip()}\n  scroll-behavior: smooth;\n}}')

    return '\n\n'.join(out)


# ── extract parts ─────────────────────────────────────────────────────────────

# Google Fonts links
fonts_links = '\n'.join(re.findall(
    r'<link[^>]+(?:fonts\.googleapis|fonts\.gstatic)[^>]+/?>',
    src, re.IGNORECASE
))

# CSS
css_raw = re.search(r'<style>(.*?)</style>', src, re.DOTALL)
css_raw = css_raw.group(1) if css_raw else ''

# Body HTML
body_html = re.search(r'<body[^>]*>(.*?)</body>', src, re.DOTALL)
body_html = body_html.group(1).strip() if body_html else ''

# Transform CSS
scoped_css = transform_css(css_raw)

# ── collect image assets ──────────────────────────────────────────────────────

all_imgs = sorted(set(
    re.findall(r'(?:src|href|url)\s*[\(=]["\']?(img/[^\s"\')\?#]+)', src)
))

asset_list = '\n'.join(f'  • {p}' for p in all_imgs)

# ── assemble output ───────────────────────────────────────────────────────────

output = f"""{fonts_links}

<style>
{scoped_css}
</style>

<div class="ailab-root">
{body_html}
</div>

<!--
=============================================================
  ASSETS — upload these to Tilda CDN and replace img/ paths
=============================================================
{asset_list}
=============================================================
-->
"""

with open(OUTPUT, "w", encoding="utf-8") as f:
    f.write(output)

size = os.path.getsize(OUTPUT)
import sys
sys.stdout.reconfigure(encoding='utf-8')
print(f"OK {OUTPUT}")
print(f"  size : {size:,} bytes")
print(f"  assets found: {len(all_imgs)}")
for p in all_imgs:
    print(f"    {p}")
