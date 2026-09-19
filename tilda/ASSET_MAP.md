# ASSET MAP — AI Laboratory Tilda Migration

Upload all assets to Tilda via **Site Settings → Files** or any CDN/storage.
Then replace every placeholder below with the real URL.

---

## MAIN SITE ASSETS

| PLACEHOLDER | LOCAL FILE | USED IN | PURPOSE |
|---|---|---|---|
| `{{AILAB_BG_HERO_URL}}` | `prototype/bg-hero.svg` | main/02-hero.html, academy/02-hero.html | Dark hero section background |
| `{{AILAB_BG_LIGHT_URL}}` | `prototype/bg-light.svg` | main/00-global-css.html (sections 04,06,07,08,10,11), academy/00-global-css.html (sections 04,06,08) | Light tech SVG pattern, light-bg sections |
| `{{AILAB_LOGO_URL}}` | `design-system/ai-laboratory-design/assets/logos/ai-lab-logo.svg` | main/01-header.html, academy/01-header.html | Header logo |
| `{{AILAB_WORDMARK_URL}}` | `design-system/ai-laboratory-design/assets/logos/ai-lab-wordmark-light-on-black.png` | main/15-footer.html, academy/11-footer.html | Footer wordmark (light on dark) |
| `{{AILAB_BLUE_SPHERE_URL}}` | `design-system/ai-laboratory-design/assets/imagery/blue-sphere.png` | main/02-hero.html, main/05-business-first.html | Hero visual sphere + dark section ambient |
| `{{AILAB_NUMERAL_1_URL}}` | `design-system/ai-laboratory-design/assets/icons/numeral-1.png` | main/04-what-we-build.html | Direction 1 numeral |
| `{{AILAB_NUMERAL_2_URL}}` | `design-system/ai-laboratory-design/assets/icons/numeral-2.png` | main/04-what-we-build.html | Direction 2 numeral |
| `{{AILAB_NUMERAL_3_URL}}` | `design-system/ai-laboratory-design/assets/icons/numeral-3.png` | main/04-what-we-build.html | Direction 3 numeral |
| `{{AILAB_NUMERAL_4_URL}}` | `design-system/ai-laboratory-design/assets/icons/numeral-4.png` | main/04-what-we-build.html | Direction 4 numeral |
| `{{AILAB_NUMERAL_5_URL}}` | `design-system/ai-laboratory-design/assets/icons/numeral-5.png` | main/04-what-we-build.html | Direction 5 numeral |
| `{{AILAB_ICON_CONSULT_URL}}` | `design-system/ai-laboratory-design/assets/icons/direction-consult.png` | main/04-what-we-build.html | Direction 1 side icon |
| `{{AILAB_ICON_DEV_URL}}` | `design-system/ai-laboratory-design/assets/icons/direction-dev.png` | main/04-what-we-build.html | Direction 2 side icon |
| `{{AILAB_ICON_CREO_URL}}` | `design-system/ai-laboratory-design/assets/icons/direction-creo.png` | main/04-what-we-build.html | Direction 3 side icon |
| `{{AILAB_FOUNDER_DANIYAR_URL}}` | `design-system/ai-laboratory-design/assets/imagery/founder-daniyar-tanaev.png` | main/11-team.html | Daniyar Tanayev photo |
| `{{AILAB_ICON_PHONE_URL}}` | `design-system/ai-laboratory-design/assets/icons/phone.png` | main/14-final-cta.html, main/15-footer.html | Phone icon |
| `{{AILAB_ICON_TELEGRAM_URL}}` | `design-system/ai-laboratory-design/assets/icons/telegram.png` | main/14-final-cta.html, main/15-footer.html | Telegram icon |

---

## STATUS

| PLACEHOLDER | STATUS | TILDA URL (fill after upload) |
|---|---|---|
| `{{AILAB_BG_HERO_URL}}` | ⬜ Needs upload | |
| `{{AILAB_BG_LIGHT_URL}}` | ⬜ Needs upload | |
| `{{AILAB_LOGO_URL}}` | ⬜ Needs upload | |
| `{{AILAB_WORDMARK_URL}}` | ⬜ Needs upload | |
| `{{AILAB_BLUE_SPHERE_URL}}` | ⬜ Needs upload | |
| `{{AILAB_NUMERAL_1_URL}}` | ⬜ Needs upload | |
| `{{AILAB_NUMERAL_2_URL}}` | ⬜ Needs upload | |
| `{{AILAB_NUMERAL_3_URL}}` | ⬜ Needs upload | |
| `{{AILAB_NUMERAL_4_URL}}` | ⬜ Needs upload | |
| `{{AILAB_NUMERAL_5_URL}}` | ⬜ Needs upload | |
| `{{AILAB_ICON_CONSULT_URL}}` | ⬜ Needs upload | |
| `{{AILAB_ICON_DEV_URL}}` | ⬜ Needs upload | |
| `{{AILAB_ICON_CREO_URL}}` | ⬜ Needs upload | |
| `{{AILAB_FOUNDER_DANIYAR_URL}}` | ⬜ Needs upload | |
| `{{AILAB_ICON_PHONE_URL}}` | ⬜ Needs upload | |
| `{{AILAB_ICON_TELEGRAM_URL}}` | ⬜ Needs upload | |

---

## NOTES

- All `onerror` fallbacks are preserved in HTML — if an image fails to load, text fallback renders.
- Do NOT use base64 encoding for images.
- bg-hero.svg and bg-light.svg are large SVG files — upload as-is, Tilda will serve them.
- Founders Andrey Chanov and Ivan Kursakov use initials (AC, IK) — no photo asset needed unless added later.
