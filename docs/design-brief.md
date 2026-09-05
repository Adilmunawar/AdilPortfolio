# Design brief — adilmunawar.vercel.app redesign

**Author:** Principal product design research pass · **Date:** 2026-09-05
**Scope:** Visual system, section specs, motion, copy and an implementation plan for the existing Next.js 14 + Tailwind 3.4 site.
**Hard constraints (inherited from the perf overhaul):** no `backdrop-filter`, no `framer-motion` outside the Zenith chat, only `transform`/`opacity` animations, sections below the hero stay lazily hydrated, and everything must be excellent at 375 px.

---

## 0. Research summary — what the good ones actually do

Twenty-plus sites and roundups were read for this pass. The pattern is unambiguous: the portfolios that engineers and designers consistently point to are **text-first, one-accent, low-motion** and let the work carry the page. The ones that win Awwwards are a different genre (WebGL agencies) and are the wrong reference for a hiring/consulting portfolio.

| Site | Above the fold | Nav | Type | Colour | Work presentation | Motion | Contact |
|---|---|---|---|---|---|---|---|
| [brittanychiang.com](https://brittanychiang.com) (v4) | Name, "Frontend Engineer", one sentence: "I build accessible, pixel-perfect experiences for the web." | Left sticky column: name/title + About/Experience/Projects with a line indicator that grows on the active section; socials under it | Inter throughout; big display name, small semibold section labels | Slate-900 background, slate-400 body, slate-200 headings, **one** teal accent for links/tags only | Experience = rows with a date column left, tech tags right; projects = rows with a small thumbnail, no cards-with-glow | Cursor spotlight (one glow, page level), arrow nudges on hover, active-nav line. That's it. | Short footer line crediting tools; email link |
| [leerob.com](https://leerob.com) | Name, handle, then a plain bio paragraph ("I work on ML at SpaceX…") | None — content is the nav ("Notes", "Blogs" lists) | System-ish sans, strong weight contrast between name and body | Monochrome, links are the only colour | Blogs = **title + date list**, no cards | None | Inline links |
| [rauno.me](https://rauno.me) | One sentence: "Rauno Freiberg is an Estonian interaction designer working with Vercel and Devouring Details." then a 7-line manifesto | Horizontal text links (Craft, Projects, Field Notes) | Small, quiet, tight tracking | Near-mono | Links to destinations rather than an inline gallery | Micro-only; email link shows "Copied" | Email with copy-to-clipboard |
| [paco.me](https://paco.me) | Name + "Crafting interfaces. Building polished software and web experiences." + current employer | Section headers as vertical nav (Building, Projects, Writing, Now, Connect) | Text-only hierarchy; italics for emphasis | Mono + dark mode | Projects = **title + one-line description**, no images | None visible | Twitter + email, one closing line |
| [joshwcomeau.com](https://www.joshwcomeau.com) | Content-first: articles list immediately | Horizontal: categories, courses, goodies, about | Clear size contrast, regular body | Light/dark toggle, minimal accent | Text-only article cards: title, blurb, "Read more" | Micro-interactions on controls only | Newsletter + multi-column footer |
| [jhey.dev](https://jhey.dev) | "Making your ideas click" + "design engineer crafting UI demos, experiments, and interaction patterns" | Name only; external links | Large headline / small copy | Neutral | Referenced inline (CodePen, roles) rather than a grid | Playful but scoped to demos | Live-status footer (weather, Spotify) + "AMA" |
| [emilkowal.ski](https://emilkowal.ski) | "I work on the Web team at Linear. I like to build things for designers and developers…" | Name link only | Section labels: Today, Projects, Writing | Monochrome | Projects = name + one line; writing = plain list | Deliberate, <300 ms, ease-out ([Great animations](https://emilkowal.ski/ui/great-animations)) | Newsletter, Twitter, GitHub |
| [linear.app](https://linear.app) | One statement headline + one supporting sentence + one CTA, product image below | Logo left, 6 text items, Log in / Sign up right | Inter Display-style headline, tight negative tracking, medium weight; small body | Dark near-black, white→gray text ladder, **single** accent used almost only on CTAs; gradients live in imagery, not chrome | Feature cards with hairline borders and no glow | Subtle image transitions | Multi-column text footer |
| [vercel.com/design](https://vercel.com/design) / [Geist](https://vercel.com/geist/colors) | — | — | Geist Sans for everything, Geist Mono **only** for code/paths/IDs; role-based scale (display/title/heading-24/20/16/body/label/caption) | Ten-step gray ladder: 100 bg, 200 hover bg, 400 default border, 500 hover border, 900 secondary text, 1000 primary text; blue ladder with same semantics | "Earn a surface only when it communicates grouping spacing can't"; explicit rejection of "all-caps eyebrows, decorative gradients, nested cards, decorative icons, tiny muted prose", "no gradients, glows, blobs, stripes, glass effects" | Restrained | — |
| [karpathy.ai](https://karpathy.ai) (ML) | Photo + one line: "I like to train deep neural nets on large datasets" + icon links | None; chronological headers act as nav | Plain, high contrast | Monochrome | Featured work = thumbnail + title + one sentence + link to code/post; publications = venue/year list | None ("0 frameworks… pure HTML and CSS") | Email link |
| [darpanjain.com](https://darpanjain.com) (ML) | "Lead Machine Learning Engineer with 9+ years… Applied NLP and LLMs" + role + one CTA "Explore My Work" | Horizontal: Work, Research, Blog, Resume, Endorsements, Reach Out | Minimal, whitespace-led | Neutral | Labs = cards with tags; publications = author/venue/year list | Minimal | Email, Calendly, socials |
| [lilianweng.github.io](https://lilianweng.github.io) (ML) | "Hi, this is Lilian. I'm documenting my learning notes…" | Posts, Archive, Search, Tags | Content-first | Neutral | Posts = title, date, read time, excerpt | None | Footer credit |

Roundup consensus ([Hostinger](https://www.hostinger.com/tutorials/web-developer-portfolio/), [Colorlib](https://colorlib.com/wp/developer-portfolios/), [WeAreDevelopers](https://www.wearedevelopers.com/en/magazine/561/web-developer-portfolio-inspiration-and-examples-march-2025-561), [Muzli top 100](https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/)): dark + **one** accent, big clean type + whitespace, sticky minimal nav, "simplicity works really well", 3–6 real projects with working links, and — from Muzli — portfolios "fail not at the visual stage, but at the moment reviewers start looking for judgment, clarity, and ownership."

Dark-UI craft sources ([Uxcel elevation guide](https://uxcel.com/blog/mastering-elevation-for-dark-ui-a-comprehensive-guide-342), [atmos.style](https://atmos.style/blog/dark-mode-ui-best-practices)): no pure black, elevation = **lighter surface on top**, not shadows; text as off-white, not #fff; keep AA 4.5:1.

Performance sources ([web.dev animations guide](https://web.dev/articles/animations-guide)): only `transform` and `opacity` stay on the compositor; animating `box-shadow`, `filter`, `background-position` or layout properties forces paint/layout — which is exactly what the current shimmer text, glow hovers and orb beams do.

### What that means for this site (diagnosis)

The current build is competent technically but reads as a template because of accumulation: two spinning "neon orb" beams behind everything, gradient-clipped shimmering headings in four sections, glow `box-shadow` on hover in every card, `uppercase tracking-[0.2em]` labels on chips, badges, metadata and buttons, a rotated vertical "Decrypt my codeverse" scroll cue, a ping dot on the chat launcher, three logo marquees, six identical contact cards, `rounded-3xl` on everything, and copy like "The Architectural Journal" and "Crafted with ♥". Each is defensible alone; together they are the opposite of every reference above. There is also no loaded webfont at all (`layout.tsx` has no `next/font`), so the type is whatever the OS ships.

---

## 1. Cheap vs premium — the checklist

Every item below is present on the site today. Fix = the specific replacement.

| # | Cheap tell (present now) | Why it reads cheap | Fix |
|---|---|---|---|
| 1 | Ambient glows everywhere: `NeonOrbs` beams, `blur-[120px]` blobs in Projects/Services, `hover:shadow-[0_0_40px…]` on every card, `drop-shadow` on hero name | Glow is a "look at me" device; used more than once per viewport it stops meaning anything and costs paint every frame | **One** glow per viewport, page-level, static: a single radial gradient behind the hero only. Cards get elevation from a lighter surface + hairline border, never a coloured shadow. |
| 2 | Gradient-clipped, animated ("shimmer") headings (`.text-gradient`, `.text-gradient-slow`, `animate-shimmer`) | Reads as 2019 Dribbble; animating `background-position` is paint-bound | Solid `text-primary` headings, weight 600, negative tracking. Colour goes on **one word max** in the hero only, static. |
| 3 | `uppercase tracking-[0.15–0.4em] text-[10px]` on eyebrows, chips, metadata, button labels, status pills | Vercel's brand guide explicitly rejects "all-caps eyebrows… tiny muted prose"; 10 px caps fails legibility at 375 px | Eyebrows become 13 px medium `text-secondary` sentence case (optionally in mono). Chips are 12 px sentence case. Buttons 14 px medium, normal tracking. Reserve caps for nothing. |
| 4 | Neon/accent borders on cards (`border-vivid-blue/50` on hover, `border-2 border-vivid-blue/20` on contact cards) | Every card competes; accent loses its job | Border ladder: `border-subtle` at rest, `border-strong` on hover. Accent border appears only on focus rings. |
| 5 | Ping/pulse dots (Zenith launcher `animate-ping`), infinite spin (`animate-gradient-rotate`, orb beams, `badge-float`, `scanline`) | Perpetual motion = notification-bait; battery cost; violates "animate to inform" ([Kowalski](https://emilkowal.ski/ui/great-animations)) | Zero infinite animations outside the chat window. Availability dot is a static 8 px circle. |
| 6 | Hype copy: "Decrypt my codeverse", "The Architectural Journal", "Specialized Services", "communication channel", "Crafted with ♥ by", "Zenith Architect" | Signals insecurity; every reference site uses plain declarative sentences | See §5. Say what you do, for whom, with what result. |
| 7 | Rotated vertical name + vertical scroll cue in the hero; left social rail with conic-gradient hover rings | Decoration standing in for content — the hero currently has **no readable role line, no value sentence, no CTA** | Hero rebuilt around text (§3.2). |
| 8 | Three auto-scrolling logo marquees of devicon SVGs fetched from jsdelivr | The most recognisable "portfolio template" element; externally hosted logos; nobody hires from a Vue logo | Static grouped toolkit list (§3.4). |
| 9 | `rounded-3xl` (24 px) on cards, `rounded-2xl` buttons, `h-11` pill buttons in cards | Over-rounded = consumer app / Canva. Linear/Geist use 6–12 px | Radius scale in §2.5; cards 12–14 px, buttons 8–10 px. |
| 10 | Six identical contact cards with icon-in-a-box, rotate-on-hover, gradient wash | Six equal-weight options is zero hierarchy | One email, one copy button, three text links (§3.10). |
| 11 | Icon-in-a-rounded-square for every service and contact item | Geist: "decorative icons" are rejected; they add nothing the title doesn't say | Numbers or nothing. |
| 12 | Centred everything (headings, ledes, grids) | Centred text at 375 px produces ragged 3-line headings; left-aligned is the reference default (Chiang, Rob, Coursey, Vercel) | Left-align all section headers and body copy. Centre only the hero card on mobile. |
| 13 | 9 nav items including "Collab" and "Stats" | Nav is a table of contents, not a sitemap | 5 items (§3.1). |
| 14 | Unverifiable social proof ("Alice Austen — Design Lead at Linear") | Anyone who checks loses trust in everything else | Remove anything that can't be stood behind on LinkedIn (§3.9). |
| 15 | Section themes that contradict positioning (blog is 100 % offensive-security posts under an ML-engineer hero) | Reviewers look for "judgment, clarity, and ownership" (Muzli) | Rename to "Notes", add one ML/remote-sensing note before launch, or move security posts under a tag (§3.8). |

---

## 2. Design tokens (implement in `tailwind.config.ts` + `globals.css`)

### 2.1 Typography

**Decision: Inter (variable, with the `opsz` axis) via `next/font/google`, plus JetBrains Mono for spec metadata.**

Why Inter over Geist/Manrope/General Sans:
- It is what the two closest references use: brittanychiang.com sets Inter; Linear's headlines are Inter Display. Inter 4 on Google Fonts ships the optical-size axis, so headings above ~28 px automatically get the tighter "Display" cut without a second family ([fontalternatives Geist vs Inter](https://fontalternatives.com/compare/geist-vs-inter/), [DiverseKit Geist vs Inter](https://diversekit.com/blog/geist-vs-inter)).
- `next/font/google` on Next 14.2 is guaranteed to have `Inter`; `Geist` on Google Fonts is newer and the bundled font list in 14.2 may not include it (the `geist` npm package would work but adds a dependency). Manrope is a fine alternative but its geometric a/g reads slightly "startup landing page"; Inter reads "engineering".
- Self-hosted through `next/font` = zero layout shift, no external request, `font-display: swap` handled.

```ts
// src/app/layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google';
const sans = Inter({ subsets: ['latin'], axes: ['opsz'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });
// <html className={`${sans.variable} ${mono.variable}`}>
```

```ts
// tailwind.config.ts → theme.extend
fontFamily: {
  sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
},
```

Set `font-feature-settings: "cv11", "ss01"` (single-storey a off, open digits) and `font-variant-numeric: tabular-nums` on any stat figures.

**Type scale** (role-based, mirroring Geist's display/title/heading/body/label/caption roles). Sizes are `clamp()` so there is one class per role; mobile value first, desktop second.

| Token | Mobile | Desktop | Weight | Tracking | Line-height | Use |
|---|---|---|---|---|---|---|
| `text-display` | 40 px | 64 px | 600 | −0.03em | 1.05 | Hero name only |
| `text-h1` | 34 px | 48 px | 600 | −0.025em | 1.1 | Page titles (case-study pages later) |
| `text-h2` | 28 px | 40 px | 600 | −0.02em | 1.15 | Section titles |
| `text-h3` | 18 px | 20 px | 600 | −0.01em | 1.3 | Card/row titles |
| `text-lede` | 17 px | 20 px | 400 | 0 | 1.5 | Hero sentence, section intros (`text-secondary`) |
| `text-body` | 15 px | 16 px | 400 | 0 | 1.6 | Descriptions |
| `text-small` | 13 px | 14 px | 400/500 | 0 | 1.5 | Meta rows, nav, chips |
| `text-caption` | 12 px | 12 px | 500 | 0 | 1.4 | Dates, read time (`text-tertiary`) |
| `text-mono` | 12 px | 13 px | 500 | 0 | 1.5 | Spec plates (architecture / task / data), stat figures |

Tailwind: express these as `fontSize` entries with `[size, { lineHeight, letterSpacing, fontWeight }]` tuples, e.g. `display: ['clamp(2.5rem, 1.6rem + 4vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '600' }]`.

Rules: max weight 600 (drop every `font-black`/`font-bold` on headings; 700 only for the hero name if 600 feels light). Only two weights per component. No uppercase anywhere.

### 2.2 Colour

Keep the navy-black identity but lift it off pure black and give it a proper ladder (Geist's 100→1000 semantics; [Uxcel](https://uxcel.com/blog/mastering-elevation-for-dark-ui-a-comprehensive-guide-342): "always a lighter surface on top of a darker surface").

| Token | Value | Role |
|---|---|---|
| `bg-0` | `#0b0f17` | Page background (replaces `#050a18`) |
| `bg-1` | `#111622` | Cards, nav on scroll, dialog |
| `bg-2` | `#171d2b` | Hover/raised: row hover, chips, code |
| `bg-3` | `#1e2536` | Active/pressed, spec-plate header |
| `border-subtle` | `rgba(255,255,255,0.06)` | Dividers, resting card border |
| `border-default` | `rgba(255,255,255,0.10)` | Inputs, chips |
| `border-strong` | `rgba(255,255,255,0.16)` | Hover border |
| `text-primary` | `#f2f4f8` | Headings, row titles (not `#fff`) |
| `text-secondary` | `#a4adbe` | Body, ledes (≈ 8.5:1 on bg-0) |
| `text-tertiary` | `#6f7888` | Meta, captions (≈ 4.6:1 on bg-0 — AA for 12 px medium; do not go lighter) |
| `accent` | `#0066ff` | Primary button fill, active nav line, focus ring |
| `accent-hover` | `#1a75ff` | Button hover |
| `accent-active` | `#0052cc` | Button pressed |
| `accent-text` | `#5c9dff` | Links and accent text on dark (raw `#0066ff` on `bg-0` is only ~3.3:1 and fails AA for text) |
| `accent-soft` | `rgba(0,102,255,0.12)` | Tinted chip background, selected filter |
| `accent-ring` | `rgba(0,102,255,0.45)` | `focus-visible` ring |
| `success` | `#3ddc84` | Availability dot only. Nothing else is green. |

Delete `frost-white`, `frost-blue`, `cyber-*`, the cyan `--accent` in `.dark`, and the `neon`/`neon-strong` shadows from `tailwind.config.ts`. Replace the shadcn HSL vars in `globals.css` so `--background`, `--card`, `--border`, `--muted-foreground` map onto the ladder above (border must stop being cyan — use the rgba tokens directly).

Accent budget per viewport: one filled button **or** one active indicator **plus** links. If a section has neither, it has no accent — that is fine.

### 2.3 Spacing

| Token | Mobile | Desktop (≥1024) |
|---|---|---|
| Section padding (block) | 64 px (`py-16`) | 112 px (`py-28`) |
| Section header → content | 32 px | 48 px |
| Inside-card padding | 20 px | 24 px |
| Grid/row gap | 16 px | 24 px |
| Row (list item) padding | 16 px block | 20 px block |
| Page gutter | 20 px (`px-5`) | 32 px (`px-8`) |

"Every gap has one owner" (Vercel): spacing lives on the section/grid parent, never on both child margin and parent gap. Reduce the hero from `min-h-screen` to `min-h-[calc(100svh-56px)]` on desktop and content-height on mobile so the proof strip is visible without scrolling on a phone.

### 2.4 Containers

- `container-page`: `max-w-[1120px]` (narrower than the current 1280; Chiang uses ~1280 with a 50 % sidebar, Linear ~1200, Vercel prose 6–7 of 12 columns)
- `container-prose`: `max-w-[680px]` for ledes, case-study/dialog bodies, contact block
- `container-hero-text`: `max-w-[560px]`

Grid: 12 columns desktop, 4 on mobile. Hero = 7/5, Case studies rows = 4/8, Services = 2 columns, Projects = 3 columns ≥1024, 2 at 640–1023, 1 below.

### 2.5 Radius

| Token | Value | Use |
|---|---|---|
| `rounded-xs` | 4 px | Chips, inline code |
| `rounded-sm` | 6 px | Filter tabs, small buttons |
| `rounded-md` | 8 px | Buttons, inputs |
| `rounded-lg` | 12 px | Cards, rows, spec plates |
| `rounded-xl` | 16 px | Dialogs, hero profile card wrapper |
| `rounded-full` | — | Avatars, availability pill, Zenith launcher |

Set `--radius: 0.5rem` for shadcn. Remove every `rounded-3xl`/`rounded-2xl` in section code.

### 2.6 Shadow and glow rules

- Elevation = surface step + hairline border. No `box-shadow` on cards at rest or hover. Dialog only: `0 24px 48px -12px rgba(0,0,0,0.5)` (neutral, static).
- **Exactly one glow per viewport, and it is always static and page-level**: the hero gets a single `radial-gradient(60% 50% at 70% 40%, rgba(0,102,255,0.14), transparent 70%)` painted once on `#home` via `::before`. `NeonOrbs` (two animated beam layers) is deleted. Nothing below the hero glows.
- The ProfileCard's holographic gradient counts as the hero's glow on mobile; on desktop the hero backdrop and the card share the same light source (place the radial gradient behind the card column so it reads as one).
- Focus: `outline: 2px solid accent-ring; outline-offset: 2px` on every interactive element. Never remove outlines without this replacement.
- Never transition `box-shadow` or `filter` (paint-bound). Hover feedback is `border-color` (small elements, 150 ms) and `background-color` on `bg-1→bg-2`.

---

## 3. Section-by-section specs

### 3.1 Navigation (`Navigation.tsx`)

- Height 56 px, `position: sticky; top: 0` (sticky, not fixed, so the hero doesn't need `pt-20`), `z-50`.
- At rest: transparent. After `scrollY > 8`: `bg-0` at 92 % opacity **without blur** + `border-b border-subtle`. Transition `background-color, border-color` 200 ms.
- Left: "Adil Munawar" 14 px/500 `text-primary` (links to `#home`). Centre/right (desktop): five items — **Work · Case studies · Services · Notes · Contact** — 14 px/500 `text-secondary`, active item `text-primary` with a 2 px `accent` underline sized to the text (not the padding box), transition `transform: scaleX` from 0→1 (origin left) 200 ms. Far right: one small secondary button "Email" (`mailto:`), 32 px tall.
- Drop "Home", "Stats", "Skills", "Collab", "Blog" from the nav; they still exist as sections but the nav is a TOC of what a client cares about. (Chiang: three items. Coursey: five. Linear: six.)
- Mobile (<768): name left, "Menu" text button right (not a hamburger icon alone — label it). Opens a full-width sheet under the bar (`bg-1`, `border-b`), rows 48 px tall, 16 px text, staggered `translateY(-4px)→0` + opacity 160 ms. Close on link tap and on `Escape`. Lock scroll while open.
- Keep the rAF scroll-spy; switch the active-section calculation to `IntersectionObserver` with `rootMargin: '-40% 0px -55% 0px'` so it is cheaper and correct on short sections.

### 3.2 Hero (`HeroSection.tsx`)

Current hero has no readable role, no sentence, no CTA — the text is rotated 90° or hidden on <xl. Rebuild:

**Desktop (≥1024) — two columns, 7/5, items centred vertically, `min-h-[calc(100svh-56px)]`, max 720 px tall**

Left column (`container-hero-text`):
1. Availability pill: `rounded-full bg-bg-1 border border-default px-3 h-7 text-small text-secondary` with an 8 px static `success` dot — copy "Available for ML and geospatial work · Q4 2026" (or "Booked until…" — must be true and updated).
2. `text-display`: **Adil Munawar** (`text-primary`).
3. Role line, `text-h3` weight 500 `text-secondary`: "Machine-learning engineer for agricultural remote sensing · full-stack developer". Optional: the phrase "agricultural remote sensing" in `accent-text` — this is the only coloured text in the hero.
4. One sentence, `text-lede text-secondary`, max 2 lines at desktop: see §5.
5. CTA row, gap 12 px: primary `View selected work` (filled `accent`, 40 px tall, `rounded-md`, 14 px/500 white) + secondary `Get in touch` (`bg-transparent border border-default hover:border-strong`, same size). 12 px below: three text links — GitHub · LinkedIn · Email — 13 px `text-tertiary hover:text-primary`, separated by "·". Remove the left social rail, the tooltips, the conic-gradient hover rings and the phone link.
6. Delete the rotated vertical `<h1>`, the "Decrypt my codeverse" scroll cue and the drop-shadow.

Right column: the existing `ProfileCard` (keep tilt; it is pointer-driven `transform` only) centred, width 320 px, `enableTilt` unchanged. Change its `title` prop to "ML engineer · remote sensing" and drop `status` (the pill above already says it). **`ProfileCard.css` lines 234 and 259 use `backdrop-filter: blur()` — this violates the site rule; replace with `background: rgba(17,22,34,0.85)`.** Also review the `filter: blur(36px)/blur(40px)` layers at lines 39/52: they are static (not animated), so acceptable, but line 192 drives `brightness()/contrast()/saturate()` from the `--pointer-*` variables, which repaints a filtered layer on every pointer move — replace that one layer with an opacity-driven overlay.

**Mobile (375)**
Stack: pill → name (40 px, two lines are fine) → role line (16 px) → sentence (17 px) → CTAs **full-width stacked** (primary above secondary, 44 px tall) → then the ProfileCard centred at `max-w-[280px]` → then the text links. The card goes *below* the copy so the first paint is the words; hero height is content height + `py-12`, not `min-h-screen`. Drop the absolutely positioned bottom social row (it overlaps the CTAs on short phones).

Entrance: keep `.hero-in` (transform+opacity) but reduce to translateY 12 px, duration 600 ms, stagger 60 ms across pill/name/role/sentence/CTAs/card (`animationDelay` 0…300 ms). No scale.

### 3.3 Stats / social proof (`StatsSection.tsx`)

Today: a full GitHub contribution card, a LeetCode card and a badge wall — three separate visual languages, and they sit before the work. Reference sites don't have a stats section at all; the closest premium pattern is a **proof strip** (Linear's logo row, Darpan's role line).

Spec — a single row directly under the hero (`py-10`, `border-y border-subtle`):
- 3–4 figures in `text-mono` tabular numerals 24 px/500 `text-primary` with 13 px `text-tertiary` labels underneath, e.g. **24** Models & products · **3** Case studies · **N** Client engagements · **N** Sentinel-2 scenes processed (only ship numbers that are real and can be defended; delete a figure rather than pad it).
- Then, on the same row on desktop / below on mobile, a monochrome "Worked with" list: Zaraat Dost · Nexsus Orbits · Google Developer Program — text at 14 px `text-tertiary`, or SVG wordmarks at 20 px height, `opacity-70`. No boxes.
- GitHub contribution graph: keep as a **single quiet card** inside the Toolkit section (§3.4), green scale replaced by a 4-step blue scale (`accent-soft`→`accent`), no card glow. LeetCode: drop unless the numbers are unusually strong — a hiring manager for remote-sensing ML does not weigh it. Badges: a single 32 px-tall row of monochrome badge icons with `title` tooltips, `opacity-60 hover:opacity-100`, inside Toolkit. Remove `badge-float`.
- Mobile: figures in a 2×2 grid, gap 16 px; "worked with" wraps under.

### 3.4 Skills (`SkillsSection.tsx`) — replace the marquees

Decision: **remove all three `LogoLoop` marquees and the devicon CDN images.** Replace with a static "Toolkit" block (Karpathy and Coursey have no skills section; Darpan folds them into project tags; Chiang shows them as tags on experience rows).

Spec:
- Section title `text-h2` "Toolkit" left-aligned, one-line intro.
- Four columns ≥1024 (2 columns at 640, 1 at 375) with 13 px `text-tertiary` group labels and 15 px `text-secondary` lists, one item per line:
  - **Remote sensing & ML** — PyTorch, HRNet / U-Net, temporal CNN & LSTM, scikit-learn, Google Earth Engine, xarray
  - **Geospatial data** — GDAL, Rasterio, GeoPandas, Shapely, PostGIS, QGIS
  - **Web & product** — TypeScript, Next.js, React, Node, Tailwind, Supabase / PostgreSQL
  - **Infra & LLM systems** — Docker, Azure, Vercel, RAG pipelines, MCP servers, agent orchestration
- Under the columns: the "Credentials" row (certifications) as a compact list — `Certification name · Issuer · Year` rows at 14 px with a 16 px monochrome issuer mark, **not** a thumbnail wall. Keep the certificate images reachable via a "View" link opening the existing dialog. Then the GitHub graph card and badge row from §3.3.
- No icons in the columns. No animation except the standard reveal.

### 3.5 Services (`ServicesSection.tsx`)

Six gradient icon-cards → **four numbered rows**. Services are a list of decisions the client can make, not product tiles.

Spec:
- Title `text-h2` "What I do", intro one sentence.
- Rows in a two-column grid ≥768 (one column at 375), each row: `01` in `text-mono text-tertiary`, `text-h3` title, one 15 px sentence, hairline `border-t border-subtle`. Row padding 20 px. Hover: `bg-2` fill (background-color 150 ms), no translate.
- Four services (merge the six): **ML models for crop and field mapping** · **Geospatial data pipelines** · **LLM, RAG and agent systems** · **Full-stack product engineering**. MCP servers and MLOps become sentences inside rows 3 and 1 respectively.
- Delete the blurred background blobs, the gradient wash on hover, the 16×16 icon tiles, the animated underline bar.

### 3.6 Selected work (`ProjectsSection.tsx`) — the important one

24 projects, 7 with images, most are private-client models. The current "spec plate" with a grid texture, blob and 10 px caps is the right *idea* (show the model by its specification) executed with the wrong styling. Make it look like a datasheet, which is what an ML client actually wants to read.

Structure:
1. Title `text-h2` "Selected work"; intro one sentence (existing copy is good; trim to two lines).
2. **Featured (3, `highlight: true`)** as full-width rows (`grid-cols-12`: 5 for the plate, 7 for text on desktop; stacked on mobile), `bg-1 border border-subtle rounded-lg`, padding 24 px. These carry the section.
3. **The rest** as a 3-column grid of compact cards (initial 6, "Show all 24" text button). Filters stay but become underline tabs (14 px, active = `text-primary` + 2 px accent underline), not pills.

The model card ("spec plate") when there is no screenshot:
- Header block, `bg-3 rounded-lg` inside the card, padding 16 px, containing a **2×2 key/value spec in `text-mono`**: `Architecture  HRNet-W48` · `Task  Field boundary segmentation` · `Data  Sentinel-2 / high-res RGB` · `Output  GIS polygons`. Keys `text-tertiary`, values `text-primary`. This replaces the big "HRNet-W48" display text, the grid texture and the blob.
- One **category glyph** at 20 px in the header's top-right, single-stroke SVG in `accent-text` at 60 % opacity: raster grid (segmentation), sparkline (time series), parcel polygons (geospatial pipelines), chat bubble (LLM). Four glyphs total, drawn once, no icon library. Category name sits beside it at 12 px `text-tertiary`.
- Body: `text-h3` title (`hover:text-primary`, no colour change to accent), 12 px meta line "Zaraat Dost · Agri-Tech · 2025" (`text-tertiary`, sentence case), 15 px description clamped to 3 lines in the grid / unclamped in featured rows.
- Tech: max 5 chips, 12 px sentence case, `bg-2 border border-subtle rounded-xs px-2 h-6`; overflow shows "+3".
- Footer row: text links, not buttons — `Source ↗` · `Live ↗` at 13 px/500 `accent-text`; when private, a single 13 px `text-tertiary` line "Private engagement — details on request" with no lock icon and no pill.
- Card hover: `border-strong` + `bg-2` (150 ms). No translateY, no glow, no image zoom. Featured rows with an image: image at 16:10 inside the plate column, `rounded-md`, no gradient overlay.
- Mobile: featured rows stack (plate on top, 160 px tall), grid becomes one column, cards get `p-5`, description clamp 4 lines. Keep every tap target ≥44 px (the text links get `py-2`).

Add a `metrics?: {label, value}[]` field to `projects.json` over time (IoU, F1, hectares mapped, inference time). When present, render as a second mono row in the spec header — numbers are what make model cards premium (Karpathy's featured works all lead with the result).

### 3.7 Case studies (`CaseStudiesSection.tsx`)

Three studies → **list rows**, not three equal cards.
- Title "Case studies", intro one sentence. Delete "The Architectural Journal" and the shimmer.
- Row: `grid-cols-12`, thumbnail in 4 columns (16:9, `rounded-md`, no overlay, no chip stack on the image), text in 8: `text-h3` title, 15 px excerpt (2 lines), 12 px meta "8 min read · Next.js, Supabase, pgvector" as plain text. Whole row is the button (keep the existing role/keyboard handling and dialog preload). Hairline dividers between rows, `hover:bg-2`.
- Mobile: thumbnail full-width above text, row padding 16 px.
- Dialog: keep, but restyle to `bg-1`, `rounded-xl`, `container-prose` body at 16 px/1.65 with `prose-invert` tuned to the ladder (headings `text-primary`, body `text-secondary`, links `accent-text`). P2: promote to `/case-studies/[slug]` routes so they are indexable and shareable — a dialog-only case study is invisible to Google and to anyone pasting a link.

### 3.8 Writing (`BlogSection.tsx`)

Three posts, all offensive-security. The honest, premium presentation is the **leerob / Lilian Weng list**: date · title · read time, no cards, no images.
- Title "Notes", intro: "Occasional write-ups on models, pipelines and security research."
- Rows: 14 px `text-caption` date in mono (`2025-11`), `text-h3` title, 12 px tags as plain text; hover `bg-2`. Featured-post layout removed.
- Content action (not design): add at least one note that matches the hero — e.g. "Why HRNet keeps thin field boundaries alive", "Cloud-masking Sentinel-2 for phenology stacks" — before launch. Otherwise a reviewer sees an ML engineer whose only writing is packet sniffing and game-server hacking, which undermines "judgment, clarity, ownership".

### 3.9 Testimonials (`TestimonialsSection.tsx`, `ui/minimal-testimonial.tsx`)

- Stop the 5-second auto-rotate (it moves content while people read). Show a **2×2 grid** (1 column on mobile) of short quotes: 16 px `text-secondary` quote, then 32 px avatar + 14 px name `text-primary` + 13 px role `text-tertiary`. No giant serif quotation marks, no gradient heading. Title "What collaborators say".
- Remove any testimonial that cannot be verified by clicking through to a real profile. "Alice Austen — Design Lead at Linear" is not verifiable and shares a name with a novelist; it will be read as fabricated and taints the other three. Three real quotes beat four with one doubtful.
- Fix "Marketor" → "Marketer".

### 3.10 Contact / footer (`ContactSection.tsx`)

Replace the heading + six cards + decorative divider with one block, `container-prose`, left-aligned:
- `text-h2` "Let's work together".
- One sentence: "I take on a small number of ML, geospatial and full-stack engagements. Email is best; I reply within a day."
- Email as the primary element: `adilmunawarx@gmail.com` at 20 px/500 `text-primary` as a `mailto:` link, with a **Copy** text button beside it that reads "Copied" for 1.5 s (rauno.me pattern). Below, three text links in a row: WhatsApp · LinkedIn · GitHub (13 px `text-tertiary hover:text-primary`). Drop Instagram, Telegram and Discord from contact (they are not professional channels; keep at most one in the footer).
- Location/response line in 13 px `text-tertiary`: "Lahore, Pakistan · Remote worldwide · UTC+5".
- Footer (`border-t border-subtle`, `py-8`): left "© 2026 Adil Munawar", right three links. Delete "Crafted with ♥", "UI/UX Enthusiast", the glowing divider dot and the 64 px social tiles.

### 3.11 AI chat launcher (`Zenith/ZenithOrb.tsx`)

- Move to **bottom-right** (universal convention; bottom-left collides with the mobile browser's back-gesture zone on Android and with the stacked CTA area). `right: 16px; bottom: max(16px, env(safe-area-inset-bottom))`.
- Shape: a 44 px-tall pill on all sizes: 28 px avatar + "Ask Zenith" 14 px/500 + no subtitle carousel. On mobile the label can collapse to the avatar only (44×44) when the keyboard is open.
- Surface `bg-1`, `border border-default`, neutral `0 8px 24px -8px rgba(0,0,0,0.5)` shadow (static; it is the one floating element, so a real drop shadow is justified — not a blue glow).
- Remove: `animate-ping` dot, scanline sweep, rotating subtitles, gradient wash, top hairline gradient. A static 8 px `success` dot on the avatar is enough to say "online".
- Enter once: `translateY(8px)→0` + opacity, 300 ms, 800 ms after load. Hover: `border-strong`. Pressed: `scale(0.98)`.
- The chat window keeps `framer-motion` (the allowed exception) but should adopt the same ladder (`bg-1` panel, `border-subtle`, `rounded-xl`) so it reads as part of the site, not a widget.

### 3.12 375 px acceptance checklist

- No horizontal scroll at 375 with 20 px gutters; every card has `min-w-0`.
- Hero copy visible in the first viewport including the primary CTA (card can start below the fold).
- Tap targets ≥44 px; row links padded, chips are not links.
- Headings never exceed 3 lines at 375 (`text-h2` 28 px; keep section titles ≤ 3 words).
- No hover-only affordances: "Copied", "Show all", filters all work on tap; `md:hover:` prefixes for any translate.
- Total above-the-fold JS unchanged (hero only); no marquee/orb keyframes running.

---

## 4. Motion guidelines

Grounded in [Kowalski](https://emilkowal.ski/ui/great-animations) ("shorter than 300 ms", ease-out for responses, animate to inform) and [web.dev](https://web.dev/articles/animations-guide) (compositor-only).

| Category | Duration | Easing | Properties | Notes |
|---|---|---|---|---|
| Hover / press feedback | 150 ms | `cubic-bezier(0.4, 0, 0.2, 1)` (`ease-standard`) | `background-color`, `border-color`, `color`, `transform: scale(0.98)` on press | Border/background transitions are paint but tiny; acceptable. Never `box-shadow`, `filter`. |
| State change (nav underline, tab switch, copy→copied, menu sheet) | 200 ms | `cubic-bezier(0.2, 0, 0, 1)` (`ease-out-quart`) | `transform: scaleX/translateY`, `opacity` | Interruptible (CSS transitions are). |
| Scroll reveal (`Reveal.tsx`) | 500 ms, stagger ≤ 60 ms, max 3 staggered siblings | `cubic-bezier(0.16, 1, 0.3, 1)` (`ease-out-expo`, already in globals) | `translate3d(0, 12px, 0)` + opacity | Reduce from 24 px / 700 ms / 90–120 ms stagger. Drop the `scale` variant. Trigger threshold at −8 % is fine. |
| Hero entrance | 600 ms, stagger 60 ms | `ease-out-expo` | `translate3d(0, 12px, 0)` + opacity | No scale, no x-axis slides. |
| Dialog open/close | 200 ms in / 150 ms out | `ease-out-quart` / `ease-standard` | overlay opacity; panel `scale(0.98)→1` + opacity | Panel translate 8 px on mobile instead of scale. |
| Zenith launcher enter | 300 ms | `ease-out-expo` | translateY + opacity | Once. |
| Infinite / looping | **none** outside `ZenithChat` | — | — | Delete: orb beams, `gradient-rotate`, `badge-float`, `scanline`, `professionalShimmer`, `scroll-horizontal`, `animate-ping`, `zenith-subtitle`, mermaid `flowAnimation` (replace with static dashed strokes). |

Rules:
- Animate only `transform` and `opacity` for anything larger than a button. `will-change` only on the ProfileCard while a pointer is inside it (add on `pointerenter`, remove on `pointerleave`).
- Nothing moves that the user did not cause, except the one-time reveal.
- Keep the existing `prefers-reduced-motion` block; add `.reveal { transition: none }` inside it so content is simply present.
- No parallax, no cursor-following glow (Chiang's spotlight is charming but it is a `radial-gradient` repaint on every mouse move — skip it under the perf rules).

Tailwind additions: `transitionTimingFunction: { standard: 'cubic-bezier(0.4,0,0.2,1)', 'out-quart': 'cubic-bezier(0.2,0,0,1)', 'out-expo': 'cubic-bezier(0.16,1,0.3,1)' }`, `transitionDuration: { 150, 200, 500 }`.

---

## 5. Copywriting guidelines

Voice: first person, declarative, specific nouns (crop, parcel, Sentinel-2, HRNet), numbers where true, no adjectives that grade yourself ("exceptional", "cutting-edge", "top notch"), no metaphors ("codeverse", "decrypt", "journal", "sovereign"), no exclamation marks. Sentence case everywhere. Every section title ≤ 3 words; every intro ≤ 2 lines at desktop.

Rewritten lines:

1. **Hero role line:** "Machine-learning engineer for agricultural remote sensing · full-stack developer"
2. **Hero statement:** "I train segmentation and time-series models on satellite imagery to map fields and crops, and build the web products that put those maps in front of people."
3. **Availability pill:** "Available for new engagements · from October 2026"
4. **Primary / secondary CTA:** "View selected work" / "Get in touch" (project cards: "Source ↗", "Live ↗"; list end: "Show all 24 projects")
5. **Selected work intro:** "Models and pipelines for private agri-tech clients, summarised by architecture, task and data, alongside public products with source available."
6. **Services title + intro:** "What I do" — "Four kinds of work I take on, from a single model to a shipped product."
7. **Case studies intro:** "Longer write-ups on how three systems were designed, what broke, and what I'd change."
8. **Contact:** "Let's work together" — "I take on a small number of ML, geospatial and full-stack engagements. Email is best; I reply within a day."

Also fix `layout.tsx` metadata: title "Adil Munawar — ML engineer, agricultural remote sensing"; description "Machine-learning engineer building crop and field-mapping models from satellite imagery, and full-stack developer. Lahore, remote worldwide."; remove "Zenith Architect" from `alternateName`.

---

## 6. Implementation plan

### P0 — the visual system and the two things everyone sees first (one sprint)

| File | Work |
|---|---|
| `src/app/layout.tsx` | Add `Inter` (with `opsz`) and `JetBrains_Mono` via `next/font/google`; put the CSS variables on `<html>`; update metadata copy. |
| `tailwind.config.ts` | Replace `frost-*`/`cyber-*`/`neon*` with the token ladder (§2.2); add `fontFamily`, role-based `fontSize` tuples (§2.1), radius scale (§2.5), easings/durations (§4); delete `scanline` keyframes; keep `accordion-*`. |
| `src/app/globals.css` | Remap shadcn HSL vars to the ladder; set `--radius: 0.5rem`; delete `.text-gradient*`, `professionalShimmer*`, `animate-fade-in-up`, `gradient-rotate`, `scroll-horizontal`, `badge-float`, `zenith-subtitle`, `.glass-card`, mermaid flow animation; shrink `.reveal` to 12 px/500 ms; add the hero radial-gradient `::before`; add `focus-visible` ring utility. |
| `src/app/page.tsx` + `ui/neon-orbs.tsx` | Remove `<NeonOrbs />`; delete the component and its keyframes. |
| `HeroSection.tsx` | Rebuild per §3.2 (text column + card column, CTAs, pill, mobile stack). Change `ProfileCard` props. |
| `ProfileCard.css` | Replace both `backdrop-filter` rules (lines 234, 259) with opaque `rgba` fills; gate `will-change` to pointer-inside; replace the pointer-driven `filter` layer (line 192) with an opacity overlay. |
| `Navigation.tsx` | Five items, sticky, no blur, underline indicator, labelled mobile menu (§3.1). |
| `ProjectsSection.tsx` | Datasheet spec plate, featured rows + compact grid, underline filters, text-link footer, remove glows/translate/caps (§3.6). |

### P1 — the rest of the page adopts the system

| File | Work |
|---|---|
| `StatsSection.tsx` (+ `GitHubStats.tsx`, `LeetCodeStats.tsx`, `BadgesShowcase.tsx`) | Proof strip under the hero; move graph/badges into Toolkit; drop LeetCode unless justified (§3.3). |
| `SkillsSection.tsx` (+ delete `LogoLoop.tsx`, restyle `Achievements.tsx`) | Static four-column Toolkit + credentials list (§3.4). Removes the jsdelivr devicon requests. |
| `ServicesSection.tsx` | Four numbered rows, no icons/gradients (§3.5). |
| `CaseStudiesSection.tsx` + `CaseStudyDialog.tsx` | List rows, restyled dialog on the ladder (§3.7). |
| `BlogSection.tsx` + `BlogPostDialog.tsx` | Date/title list, "Notes" (§3.8). |
| `TestimonialsSection.tsx` + `ui/minimal-testimonial.tsx` | Static 2×2 grid, remove unverifiable entry, fix typo (§3.9). |
| `ContactSection.tsx` | Single contact block + copy-email + plain footer (§3.10). |
| `Zenith/ZenithOrb.tsx` | Bottom-right pill, no ping/scanline/subtitles (§3.11); align `ZenithChat` surface tokens. |
| `ui/button.tsx`, `ui/badge.tsx`, `ui/card.tsx`, `ui/dialog.tsx` | Re-base variants on the ladder and radius scale so section code stops carrying inline colour classes. |

### P2 — content and structure that compound over time

- `projects.json`: add `metrics` and `data`/`output` fields; fill `year` (currently `null` on most entries) — dates are cheap credibility.
- Promote case studies and notes to real routes (`/work/[slug]`, `/notes/[slug]`) with static generation; keep the dialogs as a progressive enhancement or drop them.
- Write one or two ML/remote-sensing notes so "Notes" matches the hero.
- Confirm `framer-motion` is imported only under `src/components/Zenith/`; if any `ui/` remnants import it, remove them. (`package.json` still lists it — that is fine only while the chat uses it.)
- Real OG image built from the new type system (name, role line, one figure) instead of the Zenith artwork.
- Lighthouse budget: LCP < 2.0 s on a mid-range Android over 4G, CLS 0 (fonts via `next/font` fix the current unstyled-font swap), no long tasks from animations.

---

## Sources

- [brittanychiang.com](https://brittanychiang.com) · [Brittany Chiang v4 (Hostinger write-up)](https://www.hostinger.com/tutorials/web-developer-portfolio/) · [Unmatched Style gallery](https://unmatchedstyle.com/gallery/brittany-chiang.php)
- [leerob.com](https://leerob.com) · [rauno.me](https://rauno.me) · [paco.me](https://paco.me) · [joshwcomeau.com](https://www.joshwcomeau.com) · [cassie.codes](https://www.cassie.codes) (site now retired; referenced via Colorlib) · [jhey.dev](https://jhey.dev) · [emilkowal.ski](https://emilkowal.ski)
- [linear.app](https://linear.app) · [vercel.com/design](https://vercel.com/design) · [Geist introduction](https://vercel.com/geist/introduction) · [Geist typography](https://vercel.com/geist/typography) · [Geist colors](https://vercel.com/geist/colors)
- ML/AI personal sites: [karpathy.ai](https://karpathy.ai) · [darpanjain.com](https://darpanjain.com) · [lilianweng.github.io](https://lilianweng.github.io) · [mitchellsparrow.com](https://www.mitchellsparrow.com/) (via Springboard roundup)
- Roundups: [Colorlib – 21 developer portfolios](https://colorlib.com/wp/developer-portfolios/) · [Hostinger – 25 web developer portfolio examples](https://www.hostinger.com/tutorials/web-developer-portfolio/) · [WeAreDevelopers – portfolio inspiration March 2025](https://www.wearedevelopers.com/en/magazine/561/web-developer-portfolio-inspiration-and-examples-march-2025-561) · [Muzli – top 100 portfolio websites](https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/) · [Awwwards portfolio collection](https://www.awwwards.com/websites/winner_category_portfolio/) · [Springboard – ML portfolio](https://www.springboard.com/blog/data-science/machine-learning-portfolio/)
- Craft: [Emil Kowalski – Great animations](https://emilkowal.ski/ui/great-animations) · [web.dev – Animations guide](https://web.dev/articles/animations-guide) · [Uxcel – Elevation for dark UI](https://uxcel.com/blog/mastering-elevation-for-dark-ui-a-comprehensive-guide-342) · [atmos.style – Dark mode best practices](https://atmos.style/blog/dark-mode-ui-best-practices) · [DiverseKit – Geist vs Inter](https://diversekit.com/blog/geist-vs-inter) · [fontalternatives – Geist vs Inter](https://fontalternatives.com/compare/geist-vs-inter/)
