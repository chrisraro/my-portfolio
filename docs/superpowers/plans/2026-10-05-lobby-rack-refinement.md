# Lobby Rack refinement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Spec: `docs/superpowers/specs/2026-10-05-lobby-rack-refinement-design.md`.

**Goal:** amber accent, restrained catalog motion (hover lift, once-stagger, FLIP filters, view transitions), sharp portrait, AI & automation stack — on branch `v4.1`, merged to `main` after Christian's sign-off.

## Global Constraints
- Branch `v4.1`; push it after each task (Vercel preview). Do not merge into `main`.
- Never edit factual content; new copy in `lib/data.ts`. Never POST to `/api/contact`; servers keyless: `RESEND_API_KEY= GROQ_API_KEY= npx next start -p 3100`.
- Tokens are raw oklch triplets in `app/globals.css` (contrast tests both themes, AA). Green only for `live`. Status only via StatusBadge.
- Motion: tokens only (`lib/motion-tokens.ts` / CSS vars), transform/opacity, hover gated by `(hover: hover) and (pointer: fine)`, reduced motion safe, reveals gated and once, nothing > 5 s.
- Client components ≤ 9 (currently 7). Performance test passes; Lighthouse mobile perf ≥ 91 `/`, ≥ 96 `/projects`; a11y 100.
- Each task: `npm run type-check && npm run lint && npm test && npm run build`. Commits `git commit -m "<subject>" -m "Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"`.
- UI tasks read DESIGN.md, the contract `.impeccable/surfaces/app-page-tsx.md`, `C:\Users\raroc\.claude\skills\impeccable\reference\craft-floor.md`, and `.superpowers/sdd/motion-research.md`.

### Task 1: AI & automation stack + sharp portrait
- `types/index.ts`: Skill category gains `'AI & automation'`. `lib/data.ts`: add skills Claude Code, Codex, Qwen Code, n8n, Groq / LLM APIs (category AI & automation) and Render (Tools & DevOps); add `heroContent.aiLine` = "AI-enabled engineer and automations: Claude Code, Codex, Qwen Code, n8n". Stack section renders the new group; hero renders `aiLine` under the title. Tests: skills, hero line from data, stack group present.
- `components/sections/hero.tsx`: portrait `sizes` reflecting the real slot (e.g. `(min-width: 1024px) 760px, (min-width: 768px) 60vw, 100vw`) and `quality={85}`; verify with a DPR-2 screenshot at 1440 that the photo is sharp; keep the LCP/performance test passing.

### Task 2: Signal amber
- Replace the accent family in both themes with signal amber (dark ≈ `0.82 0.15 85`, light a deeper amber passing AA), recompute `on-accent`, re-check `status-early`/staging glyph distinctness, update `.on-plane` ring, OG palette (`lib/og-palette.ts`), favicon, and magenta-specific copy/comments. Update DESIGN.md token table and contract FORM. Contrast tests both themes. Screenshots both themes.

### Task 3: Restrained catalog motion
- Remove scroll-linked preview animation, the "↓ scroll" cue, and the sunk-pocket rack mechanic (screenshots visible at rest). Cards: hover lift/zoom/border per spec (gated), shadow via pseudo-element opacity. Grid stagger once below the fold (gated). Guards: no scroll-timeline preview classes remain; hover gated; reveal gating. Screenshots + reduced-motion pass.

### Task 4: FLIP filters and view transitions
- `/projects` filter: animate card positions on filter change (client island using `motion/react` `layout`, or CSS view transitions), instant under reduced motion, still works without JS (links with `?band=`).
- Card → case study: feature-detected `document.startViewTransition` on client navigation with a shared `view-transition-name` on the project screenshot and the case-study header image; cross-fade fallback; reduced-motion zeroing; `pointer-events: none` on the overlay. Client components ≤ 9. Tests: source guards for feature detection and reduced motion.

### Task 5: Gates
- impeccable critique + audit, Lighthouse mobile (`/`, `/projects`, a flagship), a11y review; one fix batch; one confirm.

### Task 6: Docs and handoff
- DESIGN.md, CLAUDE.md (accent, motion rules, AI stack); final whole-branch review and its fix batch; push `v4.1`; ask Christian to sign off for the merge.
