# Sub-project 2 — Motion Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Replace B3 Signal with a new motion-led visual world and give every project a scroll-through preview plus a live preview where embeddable.

**Architecture:** CSS-first motion (scroll-driven animations as progressive enhancement, shared tokens), `motion/react` only in interactive client components; previews from full-page screenshots and a committed embeddability map; the visual world comes from an impeccable direction contract written before code.

**Tech Stack:** Next.js 14 · React 18 · TypeScript strict · Tailwind 3 · `motion` · Vitest · puppeteer-core.

**Spec:** `docs/superpowers/specs/2026-10-05-motion-redesign-design.md`

## Global Constraints

- Branch `v4` only; push v4 after each task (preview). Never merge v4 into main.
- Content stays in `lib/data.ts` / `lib/case-studies.ts`; never edit factual content to pass a test; new headings/eyebrows go to `lib/data.ts`.
- Motion: transform and opacity only; durations/easings only from `lib/motion-tokens.ts` or the matching CSS custom properties; content visible without JS and under reduced motion; nothing loops past 5 s; reveals run once.
- `prefers-reduced-motion: reduce` disables transforms, scroll-driven animation and the preview scroll.
- Status only via `StatusBadge` (glyph + label); `live` colour only on the live glyph.
- Colours stay raw oklch `L C H` triplets in `app/globals.css` (`:root` light, `.dark` default) so `tests/design/contrast.test.ts` keeps parsing them; WCAG AA contrast in both themes.
- Client components ≤ 9 (currently 6; LivePreview makes 7).
- No new dependency except `motion` (replacing `framer-motion`).
- Never POST to `/api/contact`; servers run keyless: `RESEND_API_KEY= GROQ_API_KEY= npx next start -p 3100`.
- Each task ends with `npm run type-check && npm run lint && npm test && npm run build`.
- Commits: `git commit -m "<subject>" -m "Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"`.
- UI tasks read `PRODUCT.md`, the new direction contract, `C:\Users\raroc\.claude\skills\impeccable\reference\craft-floor.md`, and the ECC motion skills' rules.

Note: Tasks 5–7 implement a visual world that Task 1 defines, so their code is specified by the contract rather than inline here.

---

### Task 1: Direction contract (impeccable new-work)

- [ ] Run the `impeccable` skill: `impeccable context --target app/page.tsx`, then the new-work playbook for a replacement visual world, Mode **Persuade** for the homepage and **Read** for case studies (PRODUCT.md). Treat B3 Signal as anti-reference.
- [ ] Write the contract to `.impeccable/surfaces/app-page-tsx.md` (replace), covering THESIS, OWN-WORLD, STORY, FIRST VIEWPORT, FORM, FINISH, plus a **MOTION** section: what motion means for this brand, the hero sequence, scroll choreography per section, hover/press grammar, preview behaviour, reduced-motion fallback.
- [ ] Specify in the contract: the full token set as oklch triplets for light and dark (keys: canvas, panel, ink, muted, muted-strong, line, line-strong, accent, on-accent, live, status-early, status-private, status-internal), checked for AA; typeface(s) via `next/font` (at most two families); type scale; homepage section order and content mapping to existing data; `/projects`, project page and 404 layouts.
- [ ] Commit `design: add the motion-led direction contract`.

### Task 2: Motion foundations

- [ ] `npm uninstall framer-motion && npm install motion`; change every `framer-motion` import to `motion/react`. Grep must find no `framer-motion`.
- [ ] Create `lib/motion-tokens.ts` with the spec's durations, easings, distances and springs; add matching `--dur-*`/`--ease-*` custom properties to `app/globals.css`; add the `.reveal` scroll-driven utility inside `@supports (animation-timeline: view())` and `@media (prefers-reduced-motion: no-preference)`; extend the reduced-motion block to disable the new utilities.
- [ ] Tests: `tests/design/motion-tokens.test.ts` (shape and values; CSS vars match the TS tokens); `tests/design/no-inline-motion.test.ts` (no numeric `duration:`/`ease:` literals in `components/` or `app/` outside allowed files); `tests/design/no-framer-motion.test.ts`.
- [ ] Gate; commit `feat(motion): adopt motion tokens and CSS-first reveals`.

### Task 3: Preview assets and embeddability

- [ ] `scripts/capture-screenshots.mjs`: add a `--full` mode writing `public/assets/images/projects/<id>-full.webp` (viewport 1440 wide, full page clipped to 6000 px height, `type: 'webp'`, `quality: 70`), keeping overlay dismissal. Run it for every capturable project; view each file; drop broken ones.
- [ ] `scripts/check-embeds.mjs` + `npm run check:embeds`: for each project with `links.live`, fetch headers (GET, browser UA, follow redirects); embeddable = no `X-Frame-Options` DENY/SAMEORIGIN and no CSP `frame-ancestors` excluding other origins; write `lib/embeddable.json` as `{ "checkedAt": "<ISO date>", "projects": { "<slug>": true|false } }`. Run it; commit the JSON.
- [ ] `lib/project-page.ts`: `fullShotFor(project): string | undefined` (file exists) and `isEmbeddable(project): boolean` (from the JSON; false when absent or not linkable).
- [ ] Tests: JSON covers every project with a live URL; helpers' behaviour.
- [ ] Gate; commit `feat(previews): capture full-page shots and record embeddability`.

### Task 4: ScrollPreview and LivePreview

- [ ] `components/ui/scroll-preview.tsx` (server): fixed-aspect frame, the full shot with `object-fit: cover`, CSS transition of `object-position` top → bottom on `:hover`/`:focus-visible` (token durations), off under reduced motion; focusable with an accessible name "Scroll preview of <domain>".
- [ ] `components/ui/live-preview.tsx` (client): "Live preview" button → dialog per spec §3 (focus trap, Escape, return focus, inert background, `AnimatePresence mode="wait"`, sandboxed iframe, desktop/mobile toggle, open-in-new-tab link, staging note). Tokens only.
- [ ] Tests: markup tests for both; client-boundary test still < 10.
- [ ] Gate; commit `feat(previews): add scroll-through and live previews`.

### Task 5: New tokens, type and chrome

- [ ] Apply the contract's tokens to `app/globals.css` and `tailwind.config`; fonts in `app/layout.tsx`; rebuild top bar and footer per contract with its motion grammar. Update design tests for the new world.
- [ ] Screenshot `/` at 1440 and 390, both themes; one fix batch. Gate; commit `style: apply the new visual world to tokens, type and chrome`.

### Task 6: Homepage

- [ ] Rebuild the homepage sections in the contract's order with its choreography (hero sequence < 2 s, scroll reveals, a work showcase using ScrollPreview + LivePreview). Copy from `lib/data.ts`. Keep the SSR-visible-proof test passing.
- [ ] Screenshots desktop/mobile/both themes plus a reduced-motion pass; one fix batch. Gate; commit `feat(home): rebuild the homepage in the new world`.

### Task 7: /projects, project pages, 404

- [ ] Restyle `/projects`, project pages (ScrollPreview, LivePreview button, case-study body) and the 404 per the contract, keeping every existing behaviour test (links, statuses, staging label, JSON-LD).
- [ ] Screenshots and one fix batch. Gate; commit `feat(projects): bring project pages into the new world`.

### Task 8: Gates

- [ ] Keyless server; impeccable critique (target 32/40) and audit (≥16/20) on `/` and a flagship; Lighthouse mobile on `/`, `/projects`, one flagship (perf ≥95, a11y 100); `ecc:a11y-architect` review incl. WCAG 2.2.2 and 2.3.3. One fix batch; one confirm round; record scores.

### Task 9: Documentation and final review

- [ ] Replace `DESIGN.md` from the built site (impeccable document); rewrite CLAUDE.md's Styling, Animation and Client/Server sections; final whole-branch review (opus) and its single fix batch; push v4.
