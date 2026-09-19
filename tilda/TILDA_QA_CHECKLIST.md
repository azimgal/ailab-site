# Tilda QA Checklist — AI Laboratory

Test on: **Desktop (1440px)**, **Tablet (1024px)**, **Mobile (375px)**

---

## CSS / Visual

- [ ] No bare global selectors leaking into Tilda UI (`body`, `h1`–`h6`, `p`, `a`, `img`, `button`, `*`)
- [ ] All text inside `.ailab-site` wrapper renders with correct fonts and colors
- [ ] Design tokens (`--ailab-violet`, `--ailab-bg-dark`, etc.) resolve correctly — no fallback colors
- [ ] Hero (`#ailab-hero` / `.ac-hero`) background image loads from CDN URL
- [ ] `bg-light.svg` background loads on sections with `.ailab-section--bg-light`
- [ ] No horizontal scroll at any breakpoint
- [ ] Cards, grids, and columns stack correctly at 768px and 375px
- [ ] `clamp()` font sizes scale smoothly — no text overflow

## Header

- [ ] Header sticks to top on scroll (position: sticky via `#ailab-header-block`)
- [ ] Header background changes on scroll (`.is-scrolled` class applied)
- [ ] Logo links to `/` on both main site and Academy page
- [ ] All nav links present and correct
- [ ] Academy nav item highlighted violet on Academy page (`aria-current="page"`)
- [ ] "Записаться" CTA button scrolls to `#ailab-cta` (main) or `#ac-cta` (academy)

## Mobile Menu

- [ ] Hamburger button visible at ≤768px, hidden at ≥769px
- [ ] Tap hamburger → mobile menu slides open
- [ ] Close (×) button closes menu
- [ ] Tapping any menu link closes menu
- [ ] ESC key closes menu
- [ ] `aria-expanded` attribute toggles correctly
- [ ] Body scroll locked while menu is open

## Anchor Navigation

- [ ] `#ailab-hero`, `#ailab-build`, `#ailab-cases`, `#ailab-how`, `#ailab-team`, `#ailab-faq`, `#ailab-cta` — all scroll targets exist and scroll smoothly
- [ ] `#ac-programs`, `#ac-how`, `#ac-cta` — all Academy scroll targets exist
- [ ] Academy nav links (`/#ailab-build`, etc.) navigate to correct section on main site
- [ ] Smooth scroll offset accounts for sticky header height (no section title hidden behind header)

## JS Behaviors

- [ ] `.ailab-animate` elements fade/slide in as they enter viewport (IntersectionObserver)
- [ ] Elements visible immediately if IntersectionObserver not supported (fallback `.is-visible` applied)
- [ ] No console errors on page load
- [ ] No `null` reference errors when elements from other blocks are queried

## FAQ Accordion (Main Site — `#ailab-faq`)

- [ ] Clicking FAQ item opens answer, collapses others
- [ ] `aria-expanded` toggles on trigger button
- [ ] Re-clicking open item closes it
- [ ] Smooth max-height transition (no jump)

## FAQ Accordion (Academy — `.ac-faq`)

- [ ] Same behavior as main FAQ
- [ ] `ac-faq__trigger` → `.ac-faq__item.is-open` class applied
- [ ] Icon `+` rotates 45° when open (becomes `×`)

## What We Build Accordion (Mobile only)

- [ ] At ≤768px: clicking `.ailab-build__row` expands/collapses content
- [ ] At ≥769px: all rows visible, accordion inactive
- [ ] First item open by default on mobile

## Forms

### Main CTA Form (`#ailab-contact-form`)

- [ ] Empty submit → focus moves to input, no success shown
- [ ] Valid input → form fields hidden, `.ailab-form__success` shown
- [ ] Form does not hard-reload the page

### Academy CTA Form (`#ac-form`)

- [ ] Empty submit → focus moves to `#ac-contact`, no success shown
- [ ] Valid input → `#ac-form` hidden, `#ac-success` shown
- [ ] Form does not hard-reload the page

## Footer

- [ ] Footer year displays current year (set by JS `new Date().getFullYear()`)
- [ ] Logo image loads or fallback text renders
- [ ] Phone icon links to `tel:+77751513414`
- [ ] Telegram icon links to `https://t.me/tdm343` (opens in new tab)
- [ ] Nav links correct on main site footer (hash anchors)
- [ ] Nav links correct on Academy footer (`/` and `/#section` paths)

## Assets

- [ ] All `{{AILAB_*_URL}}` placeholders replaced — no literal `{{` in rendered HTML
- [ ] All `onerror` fallbacks work: remove image URLs temporarily and verify fallback text/hiding
- [ ] Team member photos load (main site `08-team.html`)
- [ ] Case study images load (main site `04-cases.html`)

## SEO / Accessibility

- [ ] `<title>` and `<meta name="description">` set on both pages
- [ ] Skip-to-content link (`ailab-skip`) present and functional
- [ ] All images have `alt` attributes
- [ ] ARIA labels on header, nav, mobile menu, footer
- [ ] Academy `aria-current="page"` on Academy nav item
- [ ] `role="banner"`, `role="contentinfo"`, `role="dialog"` present

## Academy-Specific

- [ ] Academy hero `bg-hero.svg` loads
- [ ] Trust bar renders correctly (horizontal scroll on mobile is acceptable)
- [ ] All 6 course cards render in 3 columns → 2 → 1 at breakpoints
- [ ] Featured card (Автоматизация) has distinct border/glow via `.ac-card--featured`
- [ ] 3 outcome stats grid: 3 cols → 1 col on mobile
- [ ] 4-step process grid: 4 cols → 2 → 1 at breakpoints; connector line hidden at tablet
- [ ] 3 instructor cards: 3 cols → 2 → 1; initials-avatar shows (no image dependency)
- [ ] 6 review cards: 3 cols → 2 → 1
- [ ] Academy FAQ accordion (separate from main site FAQ)
- [ ] Academy CTA form success state
- [ ] Footer on Academy uses `/` and `/#section` links (not hash-only)
