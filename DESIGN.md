# Arkan AI Solutions — Creative System ("Atelier")

A ground-up rebrand of the Arkan landing experience. The previous Steel-Blue,
dark-default system was treated as reference only; nothing was preserved except
business facts, contact configuration, the React/Vite structure, and the
Arabic-first requirement.

---

## 1. Research summary

Design intelligence (UI/UX Pro Max engine) + web research informed every choice.

- **Design-system search** steered away from the default navy+blue "Trust &
  Authority" pattern toward a **warm ink-on-paper editorial** palette (stone/ink
  + warm accent on cream) — closer to the brief's "warm technical minimalism /
  paper surfaces / architectural" direction.
- **2026 B2B/AI references** (Moburst, SitesPlaced, Beach Marketing, Awwwards
  round-ups): the bar is *editorial typography + ruthless restraint*; "calm
  design… white space, strong typography, micro-interactions that guide rather
  than distract"; award-winning AI sites read "enterprise-ready, not crypto-bro";
  light-theme premium = cream canvas + editorial serif accents.
- **Arabic typography** (JustCreative, Ahmed Elramlawy, 29LT, The Brand Identity,
  ConveyThis, AivenSoft): successful bilingual pairings match optical weight,
  x-height and personality; **Arabic should be ~10–15% larger than Latin** with
  **line-height ≥ 1.8** for body. Reem Kufi = modern geometric kufi, ideal for
  architectural display; Readex Pro = Arabic-first humanist for readable text.
- **Display type**: Bricolage Grotesque (editorial grotesk, optical-size axis)
  vs Schibsted Grotesk — chose Bricolage for character.

These are principles, not copies. No site was reproduced.

## 2. Positioning

> **The structure your operations run on.**
> «البنية التي تقوم عليها عملياتك.»

*Arkan* literally means **the pillars a structure stands on.** The whole identity
makes that literal: AI as the load-bearing structure of a business — not neon
magic, not a dashboard. Arabic-first is a structural advantage, not a feature.

## 3. Creative direction — "Atelier" (warm technical minimalism)

- Warm **paper** surfaces, warm **ink** text, one ownable **clay** accent.
- Blueprint vocabulary: hairline grids, **registration corner marks**, precision
  diagrams, mono technical annotations and units.
- The four services are literal **أركان / pillars**; the mark is four rising
  columns with a clay keystone.
- Deliberately avoids: neon AI gradients, dark cyberpunk, robots, glowing orbs,
  blue-purple SaaS, busy glassmorphism, generic cards, decorative motion.

## 4. Typography

| Role | Latin | Arabic |
|---|---|---|
| Display / headlines | **Bricolage Grotesque** | **Reem Kufi** (geometric kufi) |
| Text / UI | **Inter** | **Readex Pro** (Arabic-first humanist) |
| Technical labels / units | system **mono** | system mono → Arabic text fallback |

- Numerals are **tabular** (`.num`, `tnum`/`ss01`) and set in the display face
  for stats — intentionally designed, never browser-default.
- Arabic is sized **+6–12%** with **line-height up to 1.85**, and is **never
  letter-spaced** (handled per-`[dir]` in tokens/base CSS).

## 5. Color system (tokens)

Light is the default identity; dark is a faithful warm-charcoal inversion. All
values live in `src/styles/tokens.css` — no hex in components.

| Token | Light | Meaning |
|---|---|---|
| `--paper` | `#F4F1E9` | page canvas (warm paper) |
| `--surface` / `--surface-2` | `#FBFAF5` / `#FFFFFF` | cards / raised |
| `--ink` | `#1C1A14` | headings / strong text |
| `--text` / `--text-muted` / `--text-faint` | `#36322A` / `#6C665A` / `#9A9384` | body scale |
| `--line` / `--line-strong` | `#E3DCCD` / `#CFC6B4` | hairlines / drawn structure |
| `--accent` (clay) | `#B5532B` | primary action, live state, key strokes |
| `--accent-ink` | `#9C4523` | clay used as text (passes AA) |
| `--band` | `#1A1810` | always-dark editorial band (final CTA + footer) |
| semantic | `--ok #3F7A4F` · `--err #B23B30` · `--warn #B07A1E` | states |

White-on-clay ≈ 5.8:1; ink-on-paper ≈ 13:1. Focus ring = clay, 2px, offset.

## 6. Information architecture

1. **Hero** — positioning + dual CTA + live operational diagram + proof stats
2. **Trust** — "we build inside the tools you already run" (Odoo, Shopify, …)
3. **Problems** — the four situations operations break in
4. **Solutions** — the four أركان (pillars) as architecture
5. **How it works** — one system, step-by-step (revealed timeline, all visible)
6. **Results** — three systems in production, with metrics
7. **Process** — Assess → Architect → Build → Operate
8. **Why Arkan** — four differentiators + founding-principle pull-quote
9. **FAQ** — sticky head + accordion
10. **Final CTA** (dark band) → **Footer** (dark band)

## 7. Motion system

`src/lib/motion.js` — one ease `cubic-bezier(0.16,1,0.3,1)`, transform/opacity
only, reveals run **once**.

- **Signature:** the operational diagram **draws** its connectors (SVG
  `pathLength`) and routes clay flow pulses (CSS, disabled under reduced-motion).
- Section reveals: soft fade + 12–26px rise, staggered children.
- Pillars / steps / cases reveal on scroll; magnetic-ish button press.
- Form: `AnimatePresence` step transitions; FAQ height animation.
- **`prefers-reduced-motion`** globally collapses durations and disables the
  flow animation and live-dot ping.

## 8. Lead form

3 short steps (contact basics → what to improve → context). No budget/pricing
questions, no fake success. Preserved from the proven implementation:
draft persistence (`sessionStorage`), inline validation + `aria-invalid`,
honeypot, focus management, keyboard nav, and — when `VITE_LEAD_WEBHOOK_URL` is
unset or fails — an **honest fallback** offering WhatsApp / email / calendar.

## 9. Accessibility (WCAG 2.2 AA target)

- Single `<h1>`, ordered section headings, landmark `<nav>/<main>/<footer>`.
- Visible clay focus ring (`:focus-visible`), `.sr-only`, labelled icon buttons.
- Modal: focus trap, Escape, scroll-lock, focus restore, `aria-modal`.
- FAQ/accordion `aria-expanded`/`aria-controls`; diagram has text + `aria-label`
  and a legible non-SVG mobile variant.
- Contrast comfortably AA+; touch targets ≥ 40px; full RTL/LTR logic.

## 10. Responsive

Verified at 375 / 768 / 1024 / 1280–1320 px in both languages, light + dark.
Arabic is intentionally laid out (diagram and copy swap sides), not mirrored.
The hero diagram switches to a semantic HTML variant ≤ 600px.

## 11. Build

`npm run build` → clean (460 modules), CSS ≈ 30.7 kB (7.3 kB gzip), no console
errors. Fonts: 4 variable families via Google Fonts (`display=swap`, preconnect).

## 12. Business content still needed from the owner

(Carried over — confirm before launch.) Production `VITE_LEAD_WEBHOOK_URL`;
final canonical domain (currently `arkan.ai`); analytics domain; **confirm the
Results/proof metrics** (40,000+ contacts, 99.7%, ~2.4s, 19 workflows, 8
platforms); WhatsApp/email/calendar details.
