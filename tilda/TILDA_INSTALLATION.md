# Tilda Installation Guide — AI Laboratory

## Overview

Two Tilda pages:
- **Main site** — URL `/` — 16 T123 blocks (`main/00` → `main/16`)
- **Academy** — URL `/academy` — 12 T123 blocks (`academy/00` → `academy/12`)

Install each page separately, following the exact block order below.

---

## Part 1 — Upload Assets First

Before placing any blocks, upload all assets to **Tilda CDN** (Project Settings → Files):

| Token | File | Used in |
|---|---|---|
| `{{AILAB_LOGO_URL}}` | `ai-lab-logo.svg` | Headers |
| `{{AILAB_WORDMARK_URL}}` | `ai-lab-wordmark-light-on-black.png` | Footers |
| `{{AILAB_BG_HERO_URL}}` | `bg-hero.svg` | Hero backgrounds |
| `{{AILAB_BG_LIGHT_URL}}` | `bg-light.svg` | Section backgrounds |
| `{{AILAB_ICON_PHONE_URL}}` | `phone.png` | Footers |
| `{{AILAB_ICON_TELEGRAM_URL}}` | `telegram.png` | Footers |
| `{{AILAB_TEAM_AZIM_URL}}` | `team-azim.jpg` | Main Team section |
| `{{AILAB_TEAM_ISANDER_URL}}` | `team-isander.jpg` | Main Team section |
| `{{AILAB_TEAM_ADLET_URL}}` | `team-adlet.jpg` | Main Team section |
| `{{AILAB_CASE_1_URL}}` | `case-1.jpg` | Main Cases section |
| `{{AILAB_CASE_2_URL}}` | `case-2.jpg` | Main Cases section |
| `{{AILAB_CASE_3_URL}}` | `case-3.jpg` | Main Cases section |

Note the final CDN URL for each file — you will do a find-and-replace in each block's HTML.

---

## Part 2 — Main Site Page (`/`)

### Step 1 — Create the page

1. Open Tilda project → **Add Page**
2. Choose **T123** (blank) template
3. Set URL: `/` (or leave as root if this is your primary domain page)
4. Page title: `AI Laboratory — Казахстан`
5. Page description: `AI-разработка, автоматизация и обучение для казахстанского бизнеса`

### Step 2 — Place blocks in order

Add one **HTML** block (T123) per file, in this exact sequence:

| # | File | Block purpose |
|---|---|---|
| 1 | `main/00-global-css.html` | Global styles — must be first |
| 2 | `main/01-header.html` | Sticky header + mobile menu |
| 3 | `main/02-hero.html` | Full-viewport hero |
| 4 | `main/03-what-we-build.html` | Services accordion |
| 5 | `main/04-cases.html` | Case studies |
| 6 | `main/05-tech-stack.html` | Technology logos |
| 7 | `main/06-metrics.html` | Stats row |
| 8 | `main/07-how-we-work.html` | 4-step process |
| 9 | `main/08-team.html` | Team cards |
| 10 | `main/09-why-us.html` | Differentiators |
| 11 | `main/10-pricing.html` | Pricing tiers |
| 12 | `main/11-academy-promo.html` | Academy teaser banner |
| 13 | `main/12-faq.html` | FAQ accordion |
| 14 | `main/13-final-cta.html` | Contact form |
| 15 | `main/14-footer.html` | Footer |
| 16 | `main/15-global-js.html` | All JS — must be last |

### Step 3 — Replace asset placeholders

In each block's HTML, replace every `{{TOKEN}}` with the actual CDN URL you noted in Part 1.

Use your editor's Find & Replace across all files, or replace inline in Tilda's block editor.

### Step 4 — Page Settings (SEO)

- **Title**: `AI Laboratory — AI-разработка и автоматизация в Казахстане`
- **Description**: `Строим AI-продукты, автоматизируем процессы и обучаем команды. Казахстан — Алматы, Астана.`
- **OG Image**: upload a 1200×630 preview image
- **Favicon**: upload `ai-lab-logo.svg` or a 32×32 ICO

---

## Part 3 — Academy Page (`/academy`)

### Step 1 — Create the page

1. Add Page → **T123** (blank)
2. URL: `/academy`
3. Page title: `AI Lab Academy — Обучение AI в Казахстане`
4. Description: `Практические программы по AI от инженеров AI Laboratory. Алматы, Астана, онлайн.`

### Step 2 — Place blocks in order

| # | File | Block purpose |
|---|---|---|
| 1 | `academy/00-global-css.html` | All CSS (self-contained) — must be first |
| 2 | `academy/01-header.html` | Header (Academy active state) |
| 3 | `academy/02-hero.html` | Dark hero with stats |
| 4 | `academy/03-trust-bar.html` | Trust signal strip |
| 5 | `academy/04-programs.html` | 6 course cards |
| 6 | `academy/05-outcomes.html` | 3 outcome stats |
| 7 | `academy/06-how-it-works.html` | 4-step process |
| 8 | `academy/07-instructors.html` | 3 instructor cards |
| 9 | `academy/08-reviews.html` | 6 testimonials |
| 10 | `academy/09-faq.html` | FAQ accordion |
| 11 | `academy/10-cta.html` | Contact form |
| 12 | `academy/11-footer.html` | Footer |
| 13 | `academy/12-global-js.html` | All JS — must be last |

### Step 3 — Replace asset placeholders

Same as main site — replace `{{AILAB_WORDMARK_URL}}`, `{{AILAB_ICON_PHONE_URL}}`, `{{AILAB_ICON_TELEGRAM_URL}}` in `academy/11-footer.html`.

The hero background (`{{AILAB_BG_HERO_URL}}`) and section backgrounds (`{{AILAB_BG_LIGHT_URL}}`) are referenced in `academy/00-global-css.html`.

---

## Part 4 — Form Integration

The CTA forms (`main/13-final-cta.html` and `academy/10-cta.html`) currently show a success state client-side only. To wire up real submissions:

### Option A — Custom webhook (recommended)

In `main/15-global-js.html` and `academy/12-global-js.html`, find the form submit handler and add a `fetch` call before showing success:

```js
fetch('https://your-webhook-endpoint.com/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ contact: val, source: 'main' }) // or 'academy'
});
```

Replace `https://your-webhook-endpoint.com/leads` with your actual endpoint (n8n, Make, custom FastAPI, etc.).

### Option B — Tilda native form

Replace the `<form>` markup with a Tilda Form block (TF blocks). Note: this requires restructuring the CTA section as a Tilda form block, which will use different CSS classes.

---

## Part 5 — Publish & QA

1. Publish both pages to a **test subdomain or password-protected page** first
2. Run through `TILDA_QA_CHECKLIST.md` on desktop and mobile
3. Verify all anchor links (`#ailab-hero`, `#ac-programs`, etc.) scroll correctly
4. Verify Academy header links (`/#ailab-build`) navigate to main site sections
5. Only publish to production (`ai-laboratory.kz`) after QA passes
