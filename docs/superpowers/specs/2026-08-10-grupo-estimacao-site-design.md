# Design: Site Grupo Estimação / SOS Animal

**Date:** 2026-08-10  
**Status:** Approved for planning (pending user review of this file)  
**Locale:** Portuguese (default) + English toggle  
**Stack:** Static HTML / CSS / JS (no build step)

## Goal

Rebuild the shelter site as a clean, elderly-friendly landing page that makes donation via PIX obvious, explains who they are, shows animal counts over time, presents animals with stories, and transparently shows monthly costs.

Audience: older adults who are not comfortable with technology. UX priority: large type, high contrast, few choices, always-visible PIX action.

## Brand

- Primary name on header and hero: **Grupo Estimação / SOS Animal**
- Visual direction: **sky blue + warm sand** (not purple, not cream/terracotta, not dark-mode-first)
- Atmosphere via soft gradients / sand tones; hero uses real video plane (placeholder until assets arrive)
- No decorative card grids in the hero; cards only where interaction needs a container (e.g. lightbox)

## Information architecture

Top to bottom:

1. **Fixed header** — brand, large nav links, `POR | EN`
2. **Hero** — full-bleed video background placeholder; headline; primary PIX CTA
3. **Quem somos** — photo placeholder + short plain text
4. **Acompanhe o número de animais** — two charts (dogs, cats) 2003–2026 with live indicator
5. **Nossos animais** — horizontal marquee carousel; click opens story lightbox
6. **Gastos do mês** — horizontal proportional bars + note about loans / no government help
7. **Footer** — contact placeholders + PIX again
8. **Fixed bottom bar** — always-visible **COPIAR CÓDIGO PIX** (desktop and mobile)

Nav anchors (PT labels; mirrored in EN): Quem somos · Animais · Gastos · Doar.  
“Doar” scrolls to the expenses block / nearest PIX CTA (no separate fundraising progress section).

## Section details

### Hero

- Headline (PT): **HÁ MAIS DE 20 ANOS SALVANDO VIDAS.**
- EN equivalent: short, clear (e.g. “FOR OVER 20 YEARS SAVING LIVES.”)
- Background: `<video>` placeholder (muted, loop, playsinline) with dark/soft overlay for readability
- One primary CTA: **COPIAR CÓDIGO PIX**
- Brand must remain a hero-level signal (not only nav text)
- First viewport budget: brand, one headline, one short support line if needed, PIX CTA, video. No stats strips, schedules, or promo chips on the hero media

### Quem somos

Short, easy Portuguese (and English twin). No em dashes (travessões). Content grounded in user brief + academic case study (Antonio & Valencio, 2016):

- Founded by Bebete Filpi; based in Teresópolis, Rio de Janeiro
- More than 20 years rescuing animals at risk on the streets
- Highlight of the 2011 disaster in Teresópolis: civil society (Grupo Estimação) mobilized early to help pets when public response did not prioritize animals; roughly two thousand animals needed help in the acute phase
- Later connection with the SOS Animal sanctuary (Parque Estadual dos Três Picos area), which the group took on to keep caring for rescued animals
- Keep the block to a few short paragraphs; photo placeholder beside text (stack on mobile)

### Animal count charts

- Title: **ACOMPANHE O NÚMERO DE ANIMAIS** (+ EN)
- Two separate line charts: dogs and cats
- Years: 2003 through 2026
- Seed totals (combined dogs+cats), then split ~80% dogs / ~20% cats, with slightly uneven (“broken”) numbers for a natural look
  - Combined anchors: 2003 = 237, 2004 = 347, 2005 = 568; fill plausible growth through 2024; 2025 = 1200; 2026 = ~798
  - 2026 target feel: ~750 dogs and ~150 cats (exact broken integers OK)
- Live tracking cue: small blinking green/red “live” dot + short label (PT/EN)
- Charts must stay readable for older users (thick lines, large labels, high contrast). Prefer Canvas or simple SVG drawn in JS without a heavy chart library unless a tiny dependency clearly helps

### Animal carousel

- Reuse Capaz Tattoo marquee pattern (`capaztattoosite` portfolio marquee + lightbox): auto-scroll, drag, prev/next, reduced-motion fallback
- Placeholder images for animals until real photos arrive
- On click: lightbox expands with photo, name, and short story (PT + EN via i18n)
- Stories are placeholder copy editable in `js/animals.js`

### Monthly expenses (no progress / fundraising bar)

Horizontal bars only. Categories and amounts (BRL):

| Category | Amount |
|---|---|
| Ração | 40.000 |
| Impostos | 4.500 |
| Medicamentos e Vacinas | 4.800 |
| Colaboradores | 8.000 |
| Veterinário | 3.500 |
| Imprevistos e Manutenções | 3.500 |
| Débitos e Dívidas bancárias | 7.500 |

Total: **R$ 71.800** (show total clearly; sum of the rows above).

Supporting copy (PT, plain language; EN twin): many months donations are not enough; there is no government help; the shelter often needs loans to keep going. Values live in a small JS config for easy later replacement when a real table arrives.

### PIX

- Clipboard value: `08996430000117`
- Button label: **COPIAR CÓDIGO PIX** (EN: **COPY PIX CODE**)
- Success toast (PT): **Prontinho! É só abrir o aplicativo do seu banco e colar o pix com o valor que desejar.**
- EN toast: short equivalent
- Placements: hero CTA, fixed bottom bar always visible, and again near expenses / footer
- Use Clipboard API with a safe fallback; toast must be large and impossible to miss

### i18n

- Default language: Portuguese
- Toggle in header: **POR | EN**
- Persist choice in `localStorage`
- Same approach as Capaz (`data-i18n` keys + dictionary module)

## Technical architecture

```
siteabrigo/
  index.html
  css/style.css
  js/i18n.js
  js/main.js          # header, scroll, PIX, toast
  js/charts.js        # dog/cat series + render
  js/animals.js       # marquee + story lightbox
  js/expenses.js      # monthly bars
  assets/             # video, photos, placeholders
  docs/superpowers/specs/...
```

- No build step; openable via local server or static host
- Prefer adapting Capaz marquee/lightbox logic rather than inventing a new carousel
- Replace existing legacy `index.html` / `style.css` / `script.js` look; keep a clean break rather than patching the old card/emoji layout
- Respect `prefers-reduced-motion` for marquee auto-scroll and optional video motion
- Semantic HTML, large hit targets, ARIA on lightbox and language toggle

## UX rules for elderly audience

- Body text ~18–20px+, generous line-height
- Primary actions larger than typical marketing sites
- High contrast text on sand/sky backgrounds
- Minimal nav; avoid icon-only actions
- Error/success feedback in plain language (toast)
- No hover-only interactions required for core tasks (PIX, language, open animal story)

## Out of scope (this skeleton)

- Real video/photo assets (placeholders only)
- Accurate historical animal counts (approximate series OK; 2026 framed as current)
- Live backend for donations or expense updates
- CMS, forms backend, payment gateway beyond PIX copy
- Monthly fundraising progress bar (explicitly removed)

## Success criteria

- First visit understands the mission within one screenful
- Anyone can copy PIX in one tap from anywhere on the page
- Language switch works for all visible copy
- Charts, expenses, and carousel work on mobile and desktop
- Structure is easy to swap placeholders for real media and numbers later

## Source notes

- User brief (hero, sections, PIX, bilingual, Capaz carousel reference)
- Case study PDF: Antonio, L. S.; Valencio, N. F. L. da S. (2016). *Animais de estimação em contexto de desastres*. Desenvolvimento e Meio Ambiente, v. 38. Used for Quem somos tone/facts (2011 Teresópolis, Grupo Estimação role, SOS Animal sanctuary), not copied academically into the UI
