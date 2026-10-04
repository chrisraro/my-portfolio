# Sub-project 2 — Motion redesign with live previews

Date: 2026-10-05 · Branch: `v4` · Status: decided autonomously (Christian asleep; decisions logged with JEV scores in `.superpowers/sdd/progress.md`), for his review on the preview

Christian is not satisfied with B3 Signal. He wants a site that showcases
motion design and gives every project a dynamic preview. Skills: impeccable
(new-work, critique, audit) and ecc:motion-ui / motion-patterns /
motion-advanced. Workflow: JEV for routing and decisions, ECC agents for
build and review.

## 1. Decisions

| # | Decision | Choice | Basis |
|---|---|---|---|
| D1 | Previews | **Scroll-shot + live.** Every project gets a full-page screenshot that scrolls through the site on hover or keyboard focus. Projects a build-time check marks embeddable also get a "Live preview" button opening the real site in an iframe dialog with a desktop/mobile width toggle. | JEV act, 0.98 |
| D2 | Motion architecture | **CSS-first.** Scroll and entrance motion are CSS scroll-driven animations and transitions applied as progressive enhancement: content is visible by default, server components stay server. The motion library is used only for interactive pieces (preview dialog, width toggle, hero text sequence if needed). | JEV act, 1.0 |
| D3 | Visual world | **Replace B3 Signal** with a new world chosen through impeccable new-work (impeccable: "redesign replaces"). Keep product truth, content, function and the test infrastructure. | Recommendation |
| D4 | Motion library | Migrate `framer-motion` to `motion` (`motion/react`), one import path everywhere; never mix. | ecc:motion-ui rule |
| D5 | Merge | v4 stays on the preview; no merge into main without Christian's sign-off. | JEV act, 0.98 |

## 2. Motion system

- `lib/motion-tokens.ts`: durations (fast 0.18, normal 0.35, slow 0.6, crawl 1.2 s), easings (smooth `[0.22,1,0.36,1]`, sharp `[0.4,0,0.2,1]`), distances (sm 8, md 16, lg 24, xl 40 px), springs (snappy, gentle). Mirrored as CSS custom properties in `app/globals.css` (`--dur-*`, `--ease-*`) so CSS and JS motion share one scale. No inline durations or easings anywhere else.
- **Scroll-driven reveals** (CSS): a utility (e.g. `.reveal`) using `animation-timeline: view()` inside `@supports (animation-timeline: view())` and `@media (prefers-reduced-motion: no-preference)`. Outside those, nothing is hidden.
- **Hero**: a kinetic type sequence (word or line reveal, SVG draw-on accent) that completes in under 2 s and never loops.
- **Interaction**: hover and press feedback on links, rows and buttons (transform/opacity only).
- **Continuous motion**: none, except the preview scroll while the pointer or focus is on it. The live pulse rule (twice, then stop) stays. Anything that loops pauses when the tab is hidden and stops within 5 s (WCAG 2.2.2).
- **Reduced motion**: `prefers-reduced-motion: reduce` removes transforms, scroll-driven animation and the preview scroll (the screenshot stays at its top); `useReducedMotion` gates the JS pieces.
- Performance: transform and opacity only; no `layout` on large containers; Lighthouse mobile performance ≥ 95.

## 3. Previews

- **Capture:** `scripts/capture-screenshots.mjs` gains a full-page mode writing `<id>-full.webp` (1440 px wide, webp, quality ~70, page height capped around 6000 px) next to the existing shots. Projects without a public URL keep the no-preview panel.
- **Embeddability:** `npm run check:embeds` (manual, hits the internet, never in CI, like `verify:urls`) reads each live URL's `X-Frame-Options` and CSP `frame-ancestors` and writes `lib/embeddable.json` (`{ [slug]: boolean, checkedAt }`), committed. Tests read it, never the network.
- **`ScrollPreview`** (server component + CSS): the full-page shot in a fixed-aspect frame, `object-fit: cover`, animating `object-position` from top to bottom on `:hover` / `:focus-visible` over a duration scaled to the page height; reduced motion keeps it at the top. Used on project pages, product panels and wherever the new homepage shows work.
- **`LivePreview`** (client component, the seventh): a button, shown only when embeddable, that opens a dialog (focus trap, Escape, return focus, inert background, `AnimatePresence mode="wait"`) containing `<iframe sandbox="allow-scripts allow-same-origin allow-popups" loading="lazy">` with a desktop/mobile width toggle and an "Open site in a new tab" link. Staging projects say so. Client components stay under 10.

## 4. Visual world and pages

Produced by impeccable new-work in the first build task: a new direction contract (`.impeccable/surfaces/app-page-tsx.md` replaced), new tokens in `app/globals.css` (same raw oklch triplet format so `tests/design/contrast.test.ts` keeps working), type choice, and the homepage information architecture. The contract must name how motion carries the brand. Pages in scope: homepage, `/projects`, `/projects/[slug]`, 404. Content stays in `lib/data.ts` and `lib/case-studies.ts`; new copy (headings, eyebrows) goes to `lib/data.ts`.

## 5. Kept as is

Content model and case studies; SEO/AIEO (JSON-LD, sitemap, llms files); privacy rules; API routes; `StatusBadge` semantics (glyph + label; green only for live); tests and CI; the client-component cap.

## 6. Testing and gates

- Unit: motion tokens shape; `embeddable.json` covers every project with a live URL; `ScrollPreview` markup (frame, alt via button label, reduced-motion class); `LivePreview` renders only when embeddable and its dialog has role, aria-modal, labelled title.
- Design guards updated for the new world (contrast, legacy tokens, green-means-live, client boundary ≤ 9).
- A source guard: no inline `duration`/`ease` numbers outside `lib/motion-tokens.ts` and `globals.css`.
- SSR guard: no `opacity:0` inline style in server HTML for proof sections (existing test kept).
- Gates (bounded passes): impeccable critique target 32/40, audit ≥ 16/20, Lighthouse mobile perf ≥ 95 and a11y 100 on `/`, one flagship, `/projects`; `ecc:a11y-architect` review including motion (2.2.2, 2.3.3).

## 7. Out of scope

Page transitions between routes (App Router exit animations are unreliable in Next 14); WebGL; video loops; a CMS.
