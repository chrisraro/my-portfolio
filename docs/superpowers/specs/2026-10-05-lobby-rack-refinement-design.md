# Lobby Rack refinement — amber, restrained motion, AI stack

Date: 2026-10-05 · Branch: `v4.1` (preview; merge to `main` with Christian's sign-off) · Status: approved in chat

Christian's feedback on the live Lobby Rack site: the magenta accent reads "girly"; he dislikes the scroll-linked previews on every project; the desktop hero portrait is blurry; he wants his AI and automation work in the stack. Research summary: `.superpowers/sdd/motion-research.md`.

## Decisions

| # | Decision | Choice |
|---|---|---|
| D1 | Accent | **Signal amber**: dark theme ≈ `oklch(0.82 0.15 85)`; light theme a deeper amber that passes AA on the light canvas. All magenta planes/buttons/links/focus rings become amber (or ink where amber fails contrast). `live` stays green and is the only green. Early-access and staging glyphs re-checked for distinctness. |
| D2 | Catalog motion | **Restrained**: remove scroll-linked previews and the "↓ scroll" cue everywhere; remove the sunk-pocket rack mechanic (screenshots visible at rest). Cards: on `(hover: hover) and (pointer: fine)` lift `translateY(-2px)`, screenshot `scale(1.02)`, border to accent, 150–200 ms ease-out (shadow via pseudo-element opacity, never `box-shadow` animation). Grid staggers in once (30–80 ms stagger, below the fold only, gated reveal). `/projects` filter changes animate positions (FLIP via `motion/react` `layout` in a client island, or CSS View Transitions) with an instant swap under reduced motion. Card → case-study: View Transitions (same-document `document.startViewTransition` on client navigation, feature-detected; cross-fade fallback; shared element = the project screenshot → case-study header image). Hero tri-fold sequence stays. |
| D3 | Portrait | Correct `sizes` for the tall desktop panel (the square photo fills a ~390×760 panel, so it needs ~760 CSS px), `quality` ~85; verify sharp at DPR 2. |
| D4 | AI & automation | Hero keeps "Full-stack developer" with a new line under it (copy in `lib/data.ts`), e.g. "AI-enabled engineer and automations: Claude Code, Codex, Qwen Code, n8n". New skill category `AI & automation` with Claude Code, Codex, Qwen Code, n8n, Groq / LLM APIs; Render added to Tools & DevOps. Plain text, no glow or typing effects. Chat prompt, JSON-LD and llms files pick these up from data. |
| D5 | Bugs/UX | After the build: impeccable critique + audit, Lighthouse mobile, a11y review; one fix batch; one confirm. |

## Constraints (unchanged)

Content only in `lib/data.ts`/`lib/case-studies.ts`, no factual edits; tokens as raw oklch triplets with contrast tests in both themes; status only via StatusBadge; client components ≤ 9; motion tokens only, transform/opacity, reduced motion safe, nothing > 5 s; performance budget test passes and Lighthouse mobile perf does not regress (≥ 91 on `/`, ≥ 96 on `/projects`), a11y 100.

## Testing

Contrast for the new accent and on-accent pairs (both themes); green-means-live; no scroll-linked preview classes remain (guard); hover motion gated by `(hover: hover)`; reveal gating; portrait `sizes` asserts a large enough slot; skills test covers the new category; hero AI line comes from data; view-transition code feature-detected (source guard); existing suites stay green.
