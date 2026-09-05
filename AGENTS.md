# AGENTS.md — working rules for this repository

Portfolio of Adil Munawar. Next.js 14 (App Router) + Tailwind 3 + TypeScript, deployed on Vercel at https://adilmunawar.vercel.app. These rules exist because the site is tuned for low-end laptops and phones; every rule below was measured, not guessed.

## Commands

```bash
npm run build          # type-checks and reports "First Load JS" — keep "/" under ~130 kB
NEXT_DIST_DIR=.next-prod npm run build && NEXT_DIST_DIR=.next-prod npx next start -p 3100   # production preview in its own dir, safe while `npm run dev` runs
npx tsc --noEmit       # fast type check
```

There is no working lint setup. `tsconfig.tsbuildinfo` is tracked by mistake; ignore it.

## Architecture rules (do not undo)

1. **Only the hero ships JavaScript up front.** Every section below the hero is registered in `src/components/DeferredSections.tsx`, which keeps the server-rendered HTML and imports the section's chunk only within ~600px of the viewport. New sections go there, never as a direct import in `src/app/page.tsx`.
2. **Component CSS for deferred sections must live in `src/app/globals.css`.** CSS imported by a lazily loaded component is not in the server HTML and causes a large layout shift (this happened with `LogoLoop.css`).
3. **No `framer-motion` outside `src/components/Zenith/ZenithChat.tsx`.** Use `Reveal` (`src/components/Reveal.tsx`, IntersectionObserver + `.reveal/.is-visible`) or CSS keyframes in `globals.css`. Animate `transform`/`opacity` only.
4. **No `backdrop-filter` / `backdrop-blur-*` on cards, nav, chips or overlays.** Blurred elements re-blur whenever anything behind them moves. Use opaque tints (`bg-black/70`, `bg-cyber-dark/85`). The profile card has no blurs either.
5. **Touch devices get fewer ambient effects.** `@media (hover: none), (max-width: 767px)` in `globals.css` disables badge float, text shimmer, extra beams and card blend layers. Keep layout identical between breakpoints; only remove effects.
6. **Heavy readers are split out.** Markdown/syntax-highlighting/dialog code lives in `BlogPostDialog.tsx`, `CaseStudyDialog.tsx` and `Zenith/ZenithChat.tsx`, loaded with `dynamic(..., { ssr: false })` on demand and preloaded on hover/touch. Do not import `react-markdown`, `react-syntax-highlighter` or `mermaid` from a section component.
7. **Images**: always `next/image`; `fill` images need a `sizes` attribute; source files in `public/` are pre-resized (badges ≤ 360px, avatars ≤ 256px, certificates ≤ 1000px). `sharp` is installed so local optimisation is fast. Do not add multi-megabyte sources.
8. **Mobile first.** Every component must look deliberate at 375px: paddings `p-5 sm:p-6 lg:p-8`, headings `text-3xl sm:text-4xl md:text-6xl`, tap targets ≥ 44px, no horizontal overflow, nothing hidden under the fixed Zenith launcher (bottom-right).

## Design system

`docs/design-brief.md` is the design source of truth (tokens, type scale, palette, glow budget, section specs, copy rules). Read it before changing any visual. Key rules: one accent, one static glow behind the hero, no uppercase micro-labels, no hype copy, Inter + JetBrains Mono via `next/font/google`.

## Content data files

- `src/lib/projects.json` — drives `ProjectsSection.tsx`. `kind: "model"` and client/agentic entries have **no GitHub link** (`github: null`); only existing public web projects link to GitHub. Never invent metrics, dates or client names.
- `src/lib/case-studies.json`, `src/lib/blog-data.json` — markdown content rendered in the dialogs (tables via `remark-gfm`, `mermaid` fences supported in case studies).
- `src/lib/github-contributions.json`, `src/lib/leetcode-stats.json` — refreshed by GitHub Actions (`scripts/scaffold-*.mjs`).

## Working in parallel

When several agents edit at once, assign file ownership per agent and let one lead run the build and browser checks. Verify in the production preview at 375px (mobile preset) and desktop before reporting.
