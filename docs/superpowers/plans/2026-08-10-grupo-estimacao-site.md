# Grupo Estimação / SOS Animal Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the static bilingual shelter landing page with hero video placeholder, about, live animal charts, Capaz-style animal marquee with stories, monthly expense bars, and always-visible PIX copy.

**Architecture:** Single-page static site. HTML structure + CSS design system; JS modules for i18n, PIX/toast, Canvas charts, expense bars, and marquee+lightbox adapted from Capaz Tattoo.

**Tech Stack:** HTML5, CSS3, vanilla JS (no build, no chart library)

## Global Constraints

- Portuguese default; `POR | EN` toggle; `localStorage` key `estimacao-lang`
- No em dashes (travessões) in user-facing PT copy
- PIX clipboard value exactly `08996430000117`
- Toast PT: `Prontinho! É só abrir o aplicativo do seu banco e colar o pix com o valor que desejar.`
- Visual: sky blue + warm sand; large type for older adults
- No fundraising progress bar
- No git commits unless repo exists and user requested (currently no `.git`)
- Spec: `docs/superpowers/specs/2026-08-10-grupo-estimacao-site-design.md`

## File map

| File | Responsibility |
|------|----------------|
| `index.html` | Page structure, sections, lightbox markup |
| `css/style.css` | Tokens, layout, hero, charts, marquee, expenses, PIX bar, toast |
| `js/i18n.js` | Translations + language switch |
| `js/main.js` | Header scroll, mobile nav, PIX copy, toast |
| `js/charts.js` | Dog/cat series 2003–2026 + Canvas render |
| `js/animals.js` | Marquee + story lightbox |
| `js/expenses.js` | Monthly expense horizontal bars |
| `assets/` | Placeholders (optional poster) |

Remove legacy look from old `style.css` / `script.js` (delete `script.js` after cutover).

---

### Task 1: HTML shell + CSS foundation + i18n + PIX

**Files:** Create/replace `index.html`, `css/style.css`, `js/i18n.js`, `js/main.js`; delete `script.js`

- [x] Build full `index.html` sections per spec (header, hero, about, charts, animals, expenses, footer, fixed PIX bar, toast, lightbox)
- [x] Implement CSS variables (sky/sand), large typography (Fraunces + Nunito), sticky header, fixed PIX bar, toast
- [x] Implement i18n dictionary PT/EN and `setLang`
- [x] Implement `copyPix()` with Clipboard API + fallback + toast
- [x] Verify: open page, switch language, copy PIX shows toast

### Task 2: Charts

**Files:** `js/charts.js`

- [x] Define year series with anchors; split ~80% dogs / ~20% cats; 2026 ≈ 748 dogs + 150 cats
- [x] Draw two Canvas line charts with live blinking indicator
- [x] Verify: both canvases render on load and resize

### Task 3: Expenses

**Files:** `js/expenses.js`

- [x] Config with the seven categories summing to 71800
- [x] Render horizontal bars + total + loan note (via i18n keys in HTML)
- [x] Verify: ração bar is longest; total text correct

### Task 4: Animals marquee + lightbox

**Files:** `js/animals.js` (+ CSS already in Task 1)

- [x] Adapt Capaz marquee (auto-scroll, drag, arrows, reduced-motion)
- [x] Lightbox shows image, name, story; stories switch with language
- [x] Placeholder animals (6+) with PT/EN stories
- [x] Verify: click opens story; Escape closes

### Task 5: Smoke verification

- [x] Serve locally and check mobile-ish width + desktop
- [x] Confirm no progress bar; PIX always visible; no travessões in PT about text
