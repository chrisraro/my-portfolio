# Portfolio 5.0 Sprint 6 (Finish) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the Isarog Trail Map on `v5`: an impeccable finish review first, then retire every Portfolio 4.0 leftover (the `--accent*` aliases, the 4.0 utilities, the stale words), fix the font-swap shift and the portrait's weight, clear the chat launcher off the footer, shorten the phone pages, clear the craft-floor tells (eyebrows, the big-number row, identical card grids), hold the map pins at one size with a key, land the last motion (hero contour shift, plates that appear once), fix the link-preview card, give every route a meta description that fits a snippet, apply the review's findings, and rewrite `DESIGN.md`, `PRODUCT.md`, `CLAUDE.md` and the README for the world that shipped. The merge to `main` waits for Christian's sign-off on the preview.

**Architecture:** No new routes, no new client components, no new dependencies. Tokens and utilities change in `app/globals.css` and `tailwind.config.js`; their consumers change in place. One guard file, `tests/design/s6-finish.test.ts`, grows a `describe` per finished removal (each with a case proving it can fail), and `tests/design/s6-motion.test.ts` holds the new motion. The hero's pointer shift is CSS only (`:has(:hover)` on the two halves of the trailhead), so the client count stays at 8. Meta descriptions get an optional short field per page, read only by the metadata; the long answers stay for the AI files, the chat prompt and the JSON-LD.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5 (strict), Tailwind CSS 3, `next/font/google` (Archivo, `wdth`), `next/og` (edge), Vitest. Skills: `impeccable` (critique, polish, document), `modern-web-guidance` (scroll-triggered animations, `:has()`), `web-design-guidelines`.

## Decisions taken by the planner

1. **The line-by-line rise already ships.** `.trailhead-line` rises each authored line `0.35em → 0`, `--stagger-line` (70ms) apart, inside `prefers-reduced-motion: no-preference`, and `motion-tokens.test.ts` holds the whole sequence under 2 s. S6 adds no work for it; Task 11 only re-asserts it beside the new motion.
2. **The hero contour shift is CSS, not a pointer listener.** A listener needs a ninth client component or an unrelated job in the view-transition island. Instead the contours slide 8px (`motionTokens.distance.sm`) toward whichever half of the trailhead the pointer rests on (`.trailhead:has(.trailhead-copy:hover)` / `:has(.trailhead-plate:hover)`), on `--dur-crawl` / `--ease-smooth`, only under `(hover: hover) and (pointer: fine)` and `no-preference`. It moves only while the pointer moves between halves, never loops, and leaves the trail where it is, so the contours drift under a fixed route.
3. **Screenshots appear once on a scroll trigger.** `.plate-rise` on every `/projects` plate, own-product plate and case-study shot rises its last 16px once as it enters (`timeline-trigger` + `animation-trigger: play-forwards`, the form Portfolio 4.0's stagger proved in Chromium), transform only, nothing filled before it fires, inside `@supports (timeline-trigger: --plate view())` and `no-preference`. Without trigger support the plates sit at rest. `retired-classes` stops banning the trigger properties (the rack stagger stays banned by its own names).
4. **What replaces amber.** Focus ring and caret: `trail` (where the keyboard and the typing are: the current position). Selection: `ink` paper with `bg` text. Form `accent-color`: `ink`. Card hover and focus border: `ink`. Chat ready dot, toast icons, chip and lightbox hovers: `ink`. The chat's send button is the dialog's primary action: `trail` / `on-trail`. The skip link: `ink` / `bg`. The brand mark (trail red today through the alias, against the trail-red rule): an `ink` plane with `bg` letters, and the favicon in the day palette's hex (`#1A1F15`, `#EAEFE4`). The brochure geometry stays (open question 2).
5. **"Portfolio 4.0 utility"** means a class whose 4.0 job is gone: `.edge-code` (the mono-voice successor) and `.reveal` / `reveal-rise` (unused). `.text-page-h1`, `.text-title`, `.text-numeral` (case-study metrics), `.text-lede`, `.button-label`, `.lift-card`, `.link-draw`, `.press`, `.arrow-nudge` still do 5.0 jobs and stay, moved from `font-variation-settings: 'wdth'` to `font-stretch` like every 5.0 utility. The chat's "~/ask chunks" terminal title (the B3/4.0 voice) becomes "Ask Chunks".
6. **Shadows** take the ink hue (130 day, 135 night), with a night override; the lagoon hue 232 goes.
7. **Body fallback:** `adjustFontFallback: true`. Next computes the face from its own Archivo metrics (Arial at `size-adjust: 98.70%`, `ascent-override: 88.96%`, `descent-override: 21.28%`, `line-gap-override: 0%`, read from `next/dist/server/font-utils` on 2026-11-21), so the swap re-wraps nothing. The 4.0 note that a metric-adjusted face cost ~200ms of main thread is re-measured in Task 16; the bar is CLS ≤ 0.02 throttled on `/` and `/about` with no TBT regression over 50ms. Portrait quality 85 → 70.
8. **Chat launcher:** the footer keeps 96px (`pb-24`) under its last row at every width (from 1024px to about 1215px the last link sat under the 56px launcher), and the root scroll padding at the bottom becomes 6rem at every width.
9. **Phone pacing, concretely:** every screenshot frame is 4:3 below 640px and 3:4 from it (`SHOT_ASPECT`), one scale per width, which takes about 200px off each of `/projects`' 20 plates; the field map's places go two to a row on phones under a map capped at 18rem; the journals become one open cover and five ruled rows (Task 9). Targets at 390 wide, measured in Task 16: `/projects` ≤ 11,500px (15,094), `/services/wordpress-woocommerce` ≤ 8,200px (9,400), the field map section ≤ 1,700px (2,253).
10. **Eyebrows:** the craft floor bans an eyebrow over a section heading, so `SectionHeading` loses its eyebrow everywhere (homepage, `/about`, `/hire`, the service pages) and the 14 `eyebrow` fields that fed it go from `lib/data.ts`. The hero eyebrow stays (spec §6 pins its words). Page eyebrows above an h1 (`PageIntro`, `/projects`, the 404, project pages) stay: they name where you are and feed the breadcrumbs and cards (open question 1).
11. **The big-number row** becomes a ruled legend line: each count at title size beside its spot height and its label, the way a map prints spot heights, not a poster of four numerals.
12. **The fork** loses its two boxed cards: two columns on open paper under a drawn route that splits in two (`.fork-route`, ink, dashed, decorative). **The journals:** the first case study as the one open cover (the panel, the hover lift), the other five as ruled rows whose cue underlines on hover.
13. **Pins** counter-scale: each pin's mark and label sit in `<g class="map-pin__mark">` scaled by `1 / var(--pan-s, 1)` about the pin's own point, so a pan zooms the map, not the labels. A `MapKey` (dot = town or city, ring = region) sits in both map captions.
14. **Link-preview card:** the bottom row (name and URL) keeps to the words' column (`TEXT_WIDTH` 760), so the linework on the right third never runs behind the URL; the title is set word by word with an explicit 18px gap. The linework moves to `lib/og-linework.ts` (a route file may export only route fields), and a test keeps every path right of the words.
15. **Meta descriptions:** `metaDescription` (≤ 155 characters written, 160 tested) on the services page, each service page, `/about`, `/hire` and the 11 long project entries; `SiteRoute.metaDescription` falls back to `description`; only the metadata reads it. Drafts below are built only from each page's existing words.

## Open questions (defaults are written into the tasks)

1. Page eyebrows above an h1 (`/services`, `/about`, `/hire`, `/projects`, project pages, the 404) stay by default. Say if the ban should reach them too; they would then render only as breadcrumb and card words.
2. The brand mark keeps the 4.0 brochure geometry, recoloured ink. Redraw it for the trail map (a pin, a contour C)? Default: recolour only.
3. Focus ring and caret in trail red as "the current position" (default), or in ink?
4. The draft meta descriptions (Task 13) and the map key's two labels (Task 10) are draft copy for Christian's review.

## Hand-off for Christian (copy notes, not changed without your wording)

- About: "Closer to home I build products of my own". Only Connecta PH is placed in Naga; Iskotify, Giya and Latag name no place.
- About: "a beach shuttle in El Nido". The data supports it ("between the beaches of El Nido, Palawan"); only the "El Nido … El Nido" repeat reads awkwardly.
- 404: the eyebrow "404 · Off the trail" repeats the h1 "Off the trail". A trivial fix is the eyebrow "404".
- Hire/services: "Groq and other LLM APIs inside products" is the softest AI claim (skills list "Groq / LLM APIs"; no project names another API).
- `/projects` and `/services` titles are thin ("Projects · Christian Raro", "Services · Christian Raro"; spec §6 has no row for them).
- Draft meta descriptions (Task 13) and map key labels (Task 10).

## Global Constraints

The master plan's Global Constraints, verbatim (`docs/superpowers/plans/2026-11-20-portfolio-v5-revamp.md`):

- Branch `v5` only; never commit to `main`. Merge needs Christian's sign-off on a Vercel preview.
- `npm run type-check`, `npm run lint`, `npm test` and `npm run build` pass with no environment variables set before every commit.
- Run local servers keyless: `RESEND_API_KEY= GROQ_API_KEY= npx next start -p 3100`.
- Code style: named exports, kebab-case files, no semicolons, single quotes, `@/` imports, `cn()` from `@/lib/utils` to merge classes.
- No portfolio content hardcoded in components: copy, eyebrows and headings live in `lib/data.ts`; UI chrome labels may live in components.
- Colours are raw oklch `L C H` triplets in `app/globals.css`, one per line; `:root` is the day theme (default), `.dark` the night theme. Never raw hex in components, never `dark:` colour pairs.
- Trail red (`trail`) only on the primary action and the current position. Green (`live`) only inside `StatusBadge`.
- No numeric `duration`, `ease` or `delay` literals in `.tsx`; tokens live in `lib/motion-tokens.ts` mirrored as CSS variables.
- Motion moves by transform and stroke only; content is present at full opacity in the server HTML. Scroll-driven rules sit inside both `@supports (animation-timeline: …)` and `@media (prefers-reduced-motion: no-preference)`.
- Nothing animates continuously for more than five seconds.
- Fewer than 10 client components; the homepage and `/projects` stay server-rendered.
- No phone number, no street address, no fabricated metrics, logos or locations anywhere.
- Commit messages: `type(scope): summary`, lowercase type, ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

S6 adds:

- Implementers are subagents, test first (JEV routing: Opus for the design tasks 1, 7, 8, 9, 14, 15; Sonnet may take the mechanical tasks 2-6, 10-13). The controller runs Task 1's dispatch, every browser look and Task 16.
- Gates before every commit, from the repo root, in order: `npm run type-check` (prints nothing, exits 0), `npm run lint` (`✔ No ESLint warnings or errors`), `npm test` (ends `Test Files  N passed (N)`), `RESEND_API_KEY= GROQ_API_KEY= npm run build`. If type-check points at a file under `.next/types` that no longer exists, delete `.next` and rerun.
- Client components stay at exactly 8 (`grep -rl "^'use client'" app components`).
- Regex literals in tests: `\b` is a backslash followed by `b`, never a control byte. After writing a test file, run `grep -P '\x08' <file>`; it must print nothing.
- Content stays at full opacity in the server HTML; every new motion is transform only and sits behind its gates.
- Copy only from `lib/data.ts`, `lib/case-studies.ts` or the spec. New words in this sprint are the drafts in Tasks 10 and 13 (marked for Christian) and interface chrome ("Ask Chunks").
- No source edit outside a task's file list without the controller's say.

## File Structure

Create:
- `tests/design/s6-finish.test.ts`: guards for every S6 removal (Tasks 2, 3, 5, 6, 7, 15).
- `tests/design/s6-motion.test.ts`: the contour shift and the plate rise (Task 11).
- `tests/content/meta-descriptions.test.ts` (Task 13).
- `tests/components/map-key.test.tsx` (Task 10).
- `components/map/map-key.tsx`: the dot and ring key (Task 10).
- `lib/og-linework.ts`: the card's contours, trail and text column (Task 12).
- `.superpowers/sdd/s6-finish-findings.md` (gitignored; Task 1), `.superpowers/sdd/s6-lighthouse.md` (gitignored; Task 16).

Modify: `app/globals.css`, `tailwind.config.js`, `app/layout.tsx`, `app/icon.svg`, `app/og/[[...path]]/route.tsx`, `app/projects/page.tsx`, `app/about/page.tsx`, `app/hire/page.tsx`, `app/services/[slug]/page.tsx`, `components/brand-mark.tsx`, `components/footer.tsx`, `components/map/pin.tsx`, `components/sections/{trailhead,elevation-strip,fork,field-map,own-products,trail-journals,plan-the-route}.tsx`, `components/case-study/project-screenshots.tsx`, `components/ui/{section-heading,status-badge,chat-widget,toaster,image-lightbox,project-shot,project-plate}.tsx`, `lib/data.ts`, `lib/board.ts`, `lib/site-routes.ts`, `lib/site-metadata.ts`, `types/index.ts`, `DESIGN.md`, `PRODUCT.md`, `CLAUDE.md`, `README.md`, `.impeccable/surfaces/app-page-tsx.md`, and the tests named in each task.

## Task list

| # | Task | Model |
|---|---|---|
| 1 | Impeccable finish review | Opus reviewer (controller dispatches) |
| 2 | Retire the transitional accent aliases | Sonnet |
| 3 | Retire the 4.0 utilities and words | Sonnet |
| 4 | Body fallback and the portrait's weight | Sonnet |
| 5 | Keep the chat launcher off every target | Sonnet |
| 6 | Phone pacing: the shot frame and the field map | Sonnet |
| 7 | Section headings without eyebrows | Opus |
| 8 | The fork and the spot heights without the templates | Opus |
| 9 | The journals: one open, five on the shelf | Opus |
| 10 | Pins hold their size; a key for dot and ring | Sonnet |
| 11 | Motion: contour shift, plates appear once | Sonnet |
| 12 | The link-preview card | Sonnet |
| 13 | Meta descriptions that fit a snippet | Sonnet |
| 14 | Apply the finish-review findings | Opus |
| 15 | DESIGN.md, PRODUCT.md, CLAUDE.md, README | Opus |
| 16 | Reduced-motion pass, Lighthouse, preview | Controller |

---

### Task 1: Impeccable finish review

**Model:** Opus reviewer subagent, dispatched by the controller. Read-only on the source.

**Files:**
- Create: `.superpowers/sdd/s6-finish-findings.md` (gitignored, not committed)

**Interfaces:**
- Consumes: the built site at head `66751b6`.
- Produces: the findings file Task 14's brief is built from. Each finding: id (`F1`…), route and width, what is wrong, the craft-floor or contract line it breaks, the fix in one sentence, and a call: **S6-fixed-by-task-N** (already planned below), **fix in Task 14**, or **carry** (with why).

- [ ] **Step 1: Build and serve keyless (controller)**

```bash
RESEND_API_KEY= GROQ_API_KEY= npm run build
RESEND_API_KEY= GROQ_API_KEY= npx next start -p 3100
```

Use `.claude/launch.json` (`portfolio-keyless`, `http://127.0.0.1:3100`) for the Browser pane.

- [ ] **Step 2: Dispatch the reviewer (controller)**

Prompt the Opus subagent with exactly this brief:

> You are the impeccable finish reviewer for Portfolio 5.0 (Isarog Trail Map), branch `v5`. Load the `impeccable` skill, run its `scripts/impeccable context --target app/page.tsx` once, then follow `reference/critique.md` (design review plus detector and browser evidence) and `reference/polish.md` (sections 2-4) against the running site at http://127.0.0.1:3100. Read `.impeccable/surfaces/app-page-tsx.md` (the direction contract) and `reference/craft-floor.md`. Look at `/`, `/projects`, `/projects?band=Sites`, `/projects/el-nido-guide-ph`, `/projects/latag`, `/services`, `/services/wordpress-woocommerce`, `/about`, `/hire` and `/no-such-trail`, at 1440×900 and 390×844, day and night theme, with the keyboard and with reduced motion emulated. Check the browser surfaces (selection, caret, scrollbar, focus ring), the first viewport against the contract, rhythm between sections, phone page heights, hover and focus states. Already planned, so record each only as "S6-fixed-by-task-N" if you see it: the `--accent` aliases and amber leftovers (2), `.edge-code` and stale comments (3), font-swap shift and portrait weight (4), the chat launcher over the footer (5), phone page heights (6), section eyebrows (7), the big-number row and the fork cards (8), the journal grid (9), pin scale and the map key (10), contour shift and plate appear-once (11), the link-preview card (12), long meta descriptions (13). Do not edit any file except `.superpowers/sdd/s6-finish-findings.md`. Write every finding there in this form: `F<n> · <route> · <width/theme> · <problem> · <rule broken> · <fix in one sentence> · <call: S6-fixed-by-task-N | fix in Task 14 | carry (why)>`. Copy changes are never "fix in Task 14": put them under a final "Copy notes for Christian" heading. End with the critique's Design Health Score and its Design Specificity Verdict. Reply in under 15 lines: counts per call and the three worst findings.

- [ ] **Step 3: Triage (controller)**

Read the file. Every "fix in Task 14" finding gets an id in Task 14's brief (`.superpowers/sdd/s6-task-14-brief.md`), with its files and a test where the finding is testable. A finding that changes a visible element beyond polish (removes a section, adds copy) goes to Christian as an open question instead. Log the counts in `.superpowers/sdd/progress.md`.

---

### Task 2: Retire the transitional accent aliases

**Model:** Sonnet

**Files:**
- Create: `tests/design/s6-finish.test.ts`
- Modify: `app/globals.css`, `tailwind.config.js`, `app/layout.tsx`, `app/icon.svg`, `components/brand-mark.tsx`, `components/sections/plan-the-route.tsx`, `components/ui/chat-widget.tsx`, `components/ui/toaster.tsx`, `components/ui/image-lightbox.tsx`
- Modify tests: `tests/design/plate-motion.test.ts`, `tests/components/brand-mark.test.tsx`, `tests/components/client-surfaces.test.tsx`, `tests/design/primary-button.test.ts`

**Interfaces:**
- Consumes: the day and night tokens in `app/globals.css`; `ogPalette` hex in `lib/og-palette.ts` (`ink: '#1A1F15'`, `bg: '#EAEFE4'`).
- Produces: no `accent`, `accent-plane` or `on-accent` token, key, utility or variable anywhere; `tests/design/s6-finish.test.ts` with its shared `sources`, `css`, `tailwind` constants, which Tasks 3, 5, 6, 7 and 15 append to.

- [ ] **Step 1: Write the failing guard**

Create `tests/design/s6-finish.test.ts`:

```ts
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Sprint 6 retires what Portfolio 4.0 left behind (master plan, S6): the
// transitional amber aliases, the 4.0 utilities and the words that described
// them. One describe per finished removal; each shows its pattern can fail.
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return files(full)
    return /\.(tsx?|css|svg)$/.test(full) ? [full] : []
  })
}
const sources = ['app', 'components', 'lib'].flatMap(files).map((f) => ({ f, src: readFileSync(f, 'utf8') }))
const css = readFileSync('app/globals.css', 'utf8')
const tailwind = readFileSync('tailwind.config.js', 'utf8')

const ACCENT_CLASS =
  /(?:bg|text|border|outline|ring|fill|stroke|decoration|divide|caret|from|via|to|shadow)-(?:accent|accent-plane|on-accent)(?![\w-])/
const ACCENT_VAR = /--(?:accent|accent-plane|on-accent)(?![\w-])/

describe('the transitional accent aliases are gone', () => {
  it('catches every old form, so the guard can fail', () => {
    for (const s of ['hover:border-accent', 'bg-accent-plane', 'text-on-accent', 'focus:bg-accent-plane', 'bg-accent-plane/90']) {
      expect(s).toMatch(ACCENT_CLASS)
    }
    expect('oklch(var(--accent))').toMatch(ACCENT_VAR)
    expect('border-accented').not.toMatch(ACCENT_CLASS)
  })

  it('defines no accent token and no accent Tailwind key', () => {
    expect(css).not.toMatch(ACCENT_VAR)
    expect(tailwind).not.toMatch(/\baccent\b/)
  })

  it('leaves no accent utility or variable in any source file', () => {
    for (const { f, src } of sources) {
      expect(src, f).not.toMatch(ACCENT_CLASS)
      expect(src, f).not.toMatch(ACCENT_VAR)
    }
  })

  it('retunes the shadows from the 4.0 lagoon hue to the ink hue, in both themes', () => {
    const shadows = css.match(/--shadow-(?:lift|overlay):[^;]*/g) ?? []
    expect(shadows).toHaveLength(4)
    for (const s of shadows) expect(s).not.toMatch(/\b232\b/)
  })
})

describe('the browser surfaces wear the trail map', () => {
  it('rings focus and draws the caret in trail red (where you are), selects in ink', () => {
    expect(css).toMatch(/:focus-visible \{[^}]*outline: 2px solid oklch\(var\(--trail\)\)/)
    expect(css).toMatch(/caret-color: oklch\(var\(--trail\)\)/)
    expect(css).toMatch(/::selection \{[^}]*background: oklch\(var\(--ink\)\);[^}]*color: oklch\(var\(--bg\)\)/)
    expect(css).toMatch(/accent-color: oklch\(var\(--ink\)\)/)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/design/s6-finish.test.ts`
Expected: FAIL in "defines no accent token" (`--accent: var(--trail)`), "leaves no accent utility" (first offender `app/globals.css` or `app/icon.svg`), "retunes the shadows" (2 of 4, hue 232) and "browser surfaces".

- [ ] **Step 3: Tokens and browser surfaces in `app/globals.css`**

Replace

```css
	/* Transitional aliases for Portfolio 4.0 sections still on the page; removed in S6. */
	--accent: var(--trail);
	--accent-plane: var(--trail);
	--on-accent: var(--on-trail);
	/* Paper is square-ish: cards, panels and buttons 6px (Tailwind sm 2px for
	 * postcards, xl 10px for the dialog derive from this). */
	--radius: 0.375rem;
	/* The one in-flow shadow, only while a card is lifted; overlays share its hue. */
	--shadow-lift: 0 18px 30px -18px oklch(0.12 0.03 232 / 0.55);
	--shadow-overlay: 0 24px 48px -12px oklch(0.12 0.03 232 / 0.5);
}
```

with

```css
	/* Paper is square-ish: plates, panels and buttons 6px (Tailwind sm 2px for
	 * buttons, xl 10px for the dialog derive from this). */
	--radius: 0.375rem;
	/* The one in-flow shadow, only while a plate is lifted; overlays share its
	 * hue, the ink's, so a shadow reads as paper over paper. */
	--shadow-lift: 0 18px 30px -18px oklch(0.2 0.03 130 / 0.45);
	--shadow-overlay: 0 24px 48px -12px oklch(0.2 0.03 130 / 0.4);
}
```

In `.dark`, after `--status-internal: 0.6400 0.0250 125;` add:

```css
	--shadow-lift: 0 18px 30px -18px oklch(0.08 0.02 135 / 0.7);
	--shadow-overlay: 0 24px 48px -12px oklch(0.08 0.02 135 / 0.65);
```

In `@layer base`, replace `accent-color: oklch(var(--accent));` with `accent-color: oklch(var(--ink));`, replace `caret-color: oklch(var(--accent));` with `caret-color: oklch(var(--trail));`, replace

```css
	::selection {
		background: oklch(var(--accent-plane));
		color: oklch(var(--on-accent));
	}
```

with

```css
	::selection {
		background: oklch(var(--ink));
		color: oklch(var(--bg));
	}
```

and replace

```css
	/* Focus is the brightest thing on the page. */
	:focus-visible {
		outline: 2px solid oklch(var(--accent));
```

with

```css
	/* Focus is where the keyboard is: the current position, so trail red. */
	:focus-visible {
		outline: 2px solid oklch(var(--trail));
```

In the `.lift-card` block, replace the comment's "its border turns accent" with "its border turns ink" and "Keyboard focus gets the accent border beside the global ring" with "Keyboard focus gets the ink border beside the global ring", then replace both `border-color: oklch(var(--accent));` lines with `border-color: oklch(var(--ink));`.

- [ ] **Step 4: `tailwind.config.js`**

Delete

```js
        // Transitional (Portfolio 4.0 sections); removed in S6.
        accent: token('accent'),
        'accent-plane': token('accent-plane'),
        'on-accent': token('on-accent'),
```

and replace `// --radius is 6px: sm 2px (postcards), md 4px, DEFAULT/lg 6px (cards,` with `// --radius is 6px: sm 2px (buttons), md 4px, DEFAULT/lg 6px (plates,`.

- [ ] **Step 5: The consumers**

`app/layout.tsx`: in the skip link, replace `focus:bg-accent-plane focus:font-display focus:px-4 focus:py-2 focus:text-on-accent` with `focus:bg-ink focus:font-sans focus:px-4 focus:py-2 focus:text-canvas`.

`components/sections/plan-the-route.tsx` (the field class, line 14): replace `focus-visible:border-accent` with `focus-visible:border-ink`.

`components/ui/toaster.tsx`: replace both `` className={`${cls} text-accent`} `` with `` className={`${cls} text-ink`} ``.

`components/ui/image-lightbox.tsx`: replace `hover:border-accent hover:text-accent` with `hover:border-ink`.

`components/ui/chat-widget.tsx`:
- `CHIP`: replace `hover:border-accent hover:text-accent` with `hover:border-ink hover:text-ink`.
- Replace

```ts
// The status dots are the accent (amber), never green: green means a live system and
```

with

```ts
// The status dot is ink, never green: green means a live system and
```

  and `const DOT_READY = 'bg-accent'` with `const DOT_READY = 'bg-ink'`.
- Launcher button: replace `bg-panel text-accent shadow-overlay transition-colors hover:border-accent` with `bg-panel text-ink shadow-overlay transition-colors hover:border-ink`.
- Close button: replace `text-muted transition-colors hover:text-accent` with `text-muted transition-colors hover:text-ink`.
- Input: replace `focus-visible:border-accent` with `focus-visible:border-ink`.
- Send button (the dialog's primary action): replace `bg-accent-plane text-on-accent transition-colors hover:bg-accent-plane/90` with `bg-trail text-on-trail transition-colors hover:bg-trail/90`.

`components/brand-mark.tsx`: replace the comment block and the two style constants:

```ts
// The mark: a two-panel brochure. C sits on the front panel; R on a flap
// hinged at the crease, its free edge receding as it unfolds, held still.
// Letterforms are drawn paths, not type, on a 32 grid. The crease is a real
// gap, so the paper shows through in either theme. Fills are theme tokens: an
// ink plane with paper letters, never trail red (that marks the primary action
// and the current position only). app/icon.svg is the same geometry in the
// day theme's hex, for renderers that cannot read the page's tokens.
```

```ts
const plane = { fill: 'oklch(var(--ink))' }
const ink = { fill: 'oklch(var(--bg))' }
```

`app/icon.svg`: replace the whole file with

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="2.5 2.5 27 27">
  <!-- The brand mark: a two-panel brochure, C on the front panel, R on a flap. Same geometry as components/brand-mark.tsx, in the day theme's ink and paper as sRGB hex (lib/og-palette.ts); favicon renderers do not all read oklch. -->
  <path d="M5 3.5 H16 V28.5 H5 A1.5 1.5 0 0 1 3.5 27 V5 A1.5 1.5 0 0 1 5 3.5 Z" fill="#1A1F15"/>
  <path d="M17.25 3.5 L28.5 5 V27 L17.25 28.5 Z" fill="#1A1F15"/>
  <path d="M17.25 3.5 L28.5 5 V27 L17.25 28.5 Z" fill="#EAEFE4" fill-opacity="0.14"/>
  <path d="M13.75 11 H8.75 A3 3 0 0 0 5.75 14 V22 A3 3 0 0 0 8.75 25 H13.75 V22 H9 V14 H13.75 Z" fill="#EAEFE4"/>
  <path d="M18.5 11 H23 A4 4 0 0 1 24.6 18.67 L27.75 25 H24.5 L21.75 19 H21.5 V25 H18.5 Z M21.5 13.75 V16.75 H23 A1.5 1.5 0 0 0 23 13.75 Z" fill="#EAEFE4" fill-rule="evenodd"/>
</svg>
```

- [ ] **Step 6: The tests that named the old tokens**

`tests/design/plate-motion.test.ts`: rename `'lifts 2px, scales the shot 1.02 and turns the border accent'` to `'lifts 2px, scales the shot 1.02 and turns the border ink'` and `'gives keyboard focus the accent border without any travel'` to `'gives keyboard focus the ink border without any travel'`; in both, replace `border-color:\s*oklch\(var\(--accent\)\)` with `border-color:\s*oklch\(var\(--ink\)\)`.

`tests/components/brand-mark.test.tsx`: replace the two `toContain` lines with

```ts
    expect(html).toContain('oklch(var(--ink))')
    expect(html).toContain('oklch(var(--bg))')
    expect(html).not.toMatch(/--trail\b/)
```

`tests/components/client-surfaces.test.tsx`: replace

```ts
  it('marks the launcher with a still amber dot', () => {
    const html = renderToStaticMarkup(<ChatWidget />)
    expect(html).toMatch(/<span aria-hidden="true" class="[^"]*rounded-full[^"]*bg-accent"/)
  })
```

with

```ts
  it('marks the launcher with a still ink dot', () => {
    const html = renderToStaticMarkup(<ChatWidget />)
    expect(html).toMatch(/<span aria-hidden="true" class="[^"]*rounded-full[^"]*bg-ink"/)
  })
```

`tests/design/primary-button.test.ts`: replace the comment `// Unprefixed utilities only: focus:bg-accent-plane (the skip link) is not a resting button.` with `// Unprefixed utilities only: a focus: or hover: fill is not a resting button.`, and replace `bg-(?:trail|accent(?:-plane)?)` with `bg-trail` in that line's regex.

- [ ] **Step 7: Run the tests**

Run: `npx vitest run tests/design/s6-finish.test.ts tests/design/plate-motion.test.ts tests/components/brand-mark.test.tsx tests/components/client-surfaces.test.tsx tests/design/primary-button.test.ts tests/design/contrast.test.ts`
Expected: PASS. Then `grep -P '\x08' tests/design/s6-finish.test.ts` prints nothing.

- [ ] **Step 8: Gates and commit**

Run the four gates. Then:

```bash
git add app/globals.css tailwind.config.js app/layout.tsx app/icon.svg components/brand-mark.tsx components/sections/plan-the-route.tsx components/ui/chat-widget.tsx components/ui/toaster.tsx components/ui/image-lightbox.tsx tests/design/s6-finish.test.ts tests/design/plate-motion.test.ts tests/components/brand-mark.test.tsx tests/components/client-surfaces.test.tsx tests/design/primary-button.test.ts
git commit -m "refactor(tokens): retire the accent aliases; focus and caret in trail, selection in ink" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Retire the 4.0 utilities and words

**Model:** Sonnet

**Files:**
- Modify: `app/globals.css`, `components/ui/status-badge.tsx`, `components/ui/chat-widget.tsx`, `lib/board.ts`, `lib/data.ts`
- Modify tests: `tests/design/s6-finish.test.ts` (append), `tests/design/type-scale.test.ts`, `tests/design/performance.test.ts`, `tests/design/legacy-tokens.test.ts` (comment), `tests/components/project-page.test.tsx` (comment), `tests/content/positioning.test.ts` (comment)

**Interfaces:**
- Consumes: `.tabular` and `.map-label` (unchanged).
- Produces: no `.edge-code`, `.reveal`, `reveal-rise` rule; every width set by `font-stretch`; `heroContent.location` gone (it lost its last reader in S5).

- [ ] **Step 1: Append the failing guard**

Append to `tests/design/s6-finish.test.ts`:

```ts
const OLD_WORDS = /\b(?:Anybody|Figtree|Lobby Rack|lagoon|amber|postcards?|rack)\b/i

describe('the Portfolio 4.0 utilities and words are gone', () => {
  it('catches the old words, so the guard can fail', () => {
    for (const s of ['Anybody does the shouting', 'a rack strip', 'the amber plane', 'postcards 2px', 'Lobby Rack mark']) {
      expect(s).toMatch(OLD_WORDS)
    }
    expect('a contour track').not.toMatch(OLD_WORDS)
  })

  it('has no .edge-code, .reveal or reveal-rise rule, and no component uses edge-code', () => {
    expect(css).not.toMatch(/\.edge-code\b/)
    expect(css).not.toMatch(/\.reveal(?![\w-])/)
    expect(css).not.toMatch(/reveal-rise/)
    for (const { f, src } of sources) expect(src, f).not.toMatch(/\bedge-code\b/)
  })

  it('sets every width through font-stretch, never the old width-axis setting', () => {
    expect(css).not.toMatch(/font-variation-settings:\s*'wdth'/)
  })

  it('describes the trail map, not the retired worlds', () => {
    for (const { f, src } of sources) expect(src, f).not.toMatch(OLD_WORDS)
    expect(tailwind).not.toMatch(OLD_WORDS)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/design/s6-finish.test.ts -t "4.0 utilities"`
Expected: FAIL: `.edge-code` in globals.css, `font-variation-settings: 'wdth' 75`, and the old words in `app/globals.css` ("Anybody", "rack strip") and `lib/board.ts` ("rack").

- [ ] **Step 3: `app/globals.css`**

Replace

```css
	/* Anybody does the shouting: headings condensed at wdth 75, titles at 85. */
	h1, h2 {
		font-family: var(--font-display), system-ui, sans-serif;
		font-variation-settings: 'wdth' 75;
		text-wrap: balance;
	}
	h3, h4 {
		font-family: var(--font-display), system-ui, sans-serif;
		font-variation-settings: 'wdth' 85;
		text-wrap: balance;
	}
```

with

```css
	/* Headings set condensed: h1 and h2 at 75%, h3 and h4 a little wider. */
	h1, h2 {
		font-family: var(--font-display), system-ui, sans-serif;
		font-stretch: 75%;
		text-wrap: balance;
	}
	h3, h4 {
		font-family: var(--font-display), system-ui, sans-serif;
		font-stretch: 85%;
		text-wrap: balance;
	}
```

In `.text-page-h1` and `.text-numeral` replace `font-variation-settings: 'wdth' 75;` with `font-stretch: 75%;`; in `.text-title` replace `font-variation-settings: 'wdth' 85;` with `font-stretch: 85%;`; in `.button-label` replace `font-variation-settings: 'wdth' 100;` with `font-stretch: 100%;`.

Delete the edge-code block:

```css
	/*
	 * Edge codes: dates, domains, counts, running indexes. There is no mono
	 * family; the display face at its normal width with tabular numerals does
	 * the job. Eyebrows are edge-code labels in sentence case.
	 */
	.edge-code {
		font-family: var(--font-sans), system-ui, sans-serif;
		font-variation-settings: 'wdth' 100;
		font-weight: 500;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.04em;
	}
```

Delete the unused reveal block:

```css
/* Scroll-driven reveal: CSS only. Outside both gates content is simply visible. */
@supports (animation-timeline: view()) {
	@media (prefers-reduced-motion: no-preference) {
		/* Transform only: text is never painted (or measured for contrast) faded. */
		@keyframes reveal-rise {
			from { transform: translateY(24px); }
			to { transform: none; }
		}
		.reveal {
			animation: reveal-rise var(--dur-normal) var(--ease-smooth) both;
			animation-timeline: view();
			animation-range: entry 10% cover 30%;
		}
	}
}
```

and, in the `prefers-reduced-motion: reduce` block, the line `.reveal { animation: none !important; opacity: 1; transform: none; }`.

In the reveal-cover keyframes comment replace `/* Transform only, like reveal-rise: a case study is never read faded. */` with `/* Transform only: a case study is never read faded. */`.

Replace the ProjectShot comment

```css
/* ProjectShot (components/ui/project-shot.tsx): a still screenshot. A frame
 * away from the viewport (below the fold, or scrolled out of a rack strip)
 * skips rendering, so its full-page shot, a lazy image, is not even requested
```

with

```css
/* ProjectShot (components/ui/project-shot.tsx): a still screenshot. A frame
 * away from the viewport (below the fold) skips rendering, so its full-page
 * shot, a lazy image, is not even requested
```

Replace

```css
/* A filter change: the heading, tabs and bar are the same page, so the root
 * swaps in place (no dip) and only the named cards and tiers glide. */
```

with

```css
/* A filter change: the heading, legend and map frame are the same page, so the
 * root swaps in place (no dip) and only the named plates and band headings glide. */
```

- [ ] **Step 4: The two components and the leftovers**

`components/ui/status-badge.tsx`: replace `'inline-flex items-center gap-1.5 edge-code text-xs text-muted'` with `'inline-flex items-center gap-1.5 tabular text-xs font-medium text-muted'`.

`components/ui/chat-widget.tsx`: replace every `edge-code` class token with `tabular` (seven places: `CHIP`, the hover label, the header title and status line, the message meta line, the typing line, the footer line), then replace

```tsx
                  <h3 id="chat-title" className="tabular text-sm text-ink">~/ask chunks</h3>
```

with

```tsx
                  <h3 id="chat-title" className="map-label text-ink">Ask Chunks</h3>
```

`lib/board.ts`: replace

```ts
 * A card's edge code: a running index over the whole rack plus a label, so
 * the page reads as one numbered strip ("04 / 18 · Products").
```

with

```ts
 * A plate's catalog code: a running index over the whole inventory plus a
 * label, so the list reads as one numbered survey ("04 / 18 · Products").
```

`lib/data.ts`: delete `  location: 'Naga City',` from `heroContent` (no reader since S5's card rewrite; `contactInfo.location` is the public locality everywhere else).

- [ ] **Step 5: The tests that named the old utilities**

`tests/design/type-scale.test.ts`: replace `for (const cls of ['button-label', 'edge-code']) {` with `for (const cls of ['button-label']) {`, and in the comment above the `scaled` regex nothing changes.

`tests/design/performance.test.ts` (`describe('reveals')`): replace `for (const name of ['reveal-rise', 'reveal-cover']) {` with `for (const name of ['reveal-cover']) {`.

`tests/design/legacy-tokens.test.ts`: replace the comment lines

```ts
// B3 Signal (retired by Lobby Rack) set labels in Recursive's MONO axis. The new
// world has no mono family: edge codes use .edge-code. Tailwind no longer
```

with

```ts
// B3 Signal (retired in Portfolio 4.0) set labels in Recursive's MONO axis. The
// trail map has no mono family: codes use .tabular. Tailwind no longer
```

and `// --font-display came back in Lobby Rack as the Anybody display face, so it is` with `// --font-display came back in Portfolio 4.0 as its display face, so it is`.

`tests/components/project-page.test.tsx:372`: replace `// (StatusBadge still carries edge-code until S6; the guard here is the page's own classes.` with `// (The guard here is the page's own classes.`.

`tests/content/positioning.test.ts:69`: delete the comment line `// Lobby Rack eyebrows are edge-code labels; the B3 "// " comment prefix is retired.` (Task 7 rewrites that test.)

- [ ] **Step 6: Run the tests**

Run: `npx vitest run tests/design tests/components/status-badge.test.tsx tests/components/client-surfaces.test.tsx`
Expected: PASS. `grep -rn "edge-code\|heroContent.location" app components lib` prints nothing.

- [ ] **Step 7: Gates and commit**

```bash
git add app/globals.css components/ui/status-badge.tsx components/ui/chat-widget.tsx lib/board.ts lib/data.ts tests/design/s6-finish.test.ts tests/design/type-scale.test.ts tests/design/performance.test.ts tests/design/legacy-tokens.test.ts tests/components/project-page.test.tsx tests/content/positioning.test.ts
git commit -m "refactor(css): retire edge-code, the unused reveal and the 4.0 width settings" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Body fallback and the portrait's weight

**Model:** Sonnet

**Files:**
- Modify: `app/layout.tsx`, `components/sections/trailhead.tsx`
- Modify tests: `tests/design/performance.test.ts`

**Interfaces:**
- Consumes: `archivo.style.fontFamily` (its first entry stays the Archivo family; the display stack is unchanged).
- Produces: body text falls back to Next's Archivo-adjusted Arial face; the portrait at quality 70.

- [ ] **Step 1: Write the failing tests**

In `tests/design/performance.test.ts`, replace

```ts
  it('falls back to plain Arial, not a metric-adjusted local() face', () => {
    const layout = readFileSync('app/layout.tsx', 'utf8')
    expect(layout.match(/adjustFontFallback: false/g)).toHaveLength(1)
  })
```

with

```ts
  // S2 and S4 traces: the body re-wrapped when Archivo swapped in (CLS 0.094 on
  // /, 0.096 on /about). Next sizes Arial to Archivo's metrics (size-adjust
  // 98.70%, ascent 88.96%, descent 21.28%), so the swap moves nothing.
  it('falls back to Arial size-adjusted to Archivo, so the font swap re-wraps nothing', () => {
    const layout = readFileSync('app/layout.tsx', 'utf8')
    expect(layout.match(/adjustFontFallback: true/g)).toHaveLength(1)
    expect(layout).not.toContain('adjustFontFallback: false')
  })

  it('loads the trailhead portrait, the first viewport’s largest paint, at quality 70', () => {
    const trailhead = readFileSync('components/sections/trailhead.tsx', 'utf8')
    expect(trailhead).toContain('quality={70}')
    expect(trailhead).not.toContain('quality={85}')
  })
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/design/performance.test.ts -t "first layout"`
Expected: FAIL: `adjustFontFallback: true` not found; `quality={70}` not found.

- [ ] **Step 3: Implement**

`app/layout.tsx`: replace

```ts
// One variable family on its width axis (spec §3): condensed uppercase for
// display and map labels, normal width for body, forms and chat. The fallback
// is plain Arial: a metric-adjusted local() face cost ~200ms of main thread
// per first layout (traced in Portfolio 4.0).
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-sans',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['Arial', 'sans-serif'],
})
```

with

```ts
// One variable family on its width axis (spec §3): condensed uppercase for
// display and map labels, normal width for body, forms and chat. Body text
// falls back to Arial sized to Archivo's metrics (Next's adjusted face), so
// the swap re-wraps nothing; the S2 and S4 traces measured CLS 0.094 and 0.096
// from plain Arial. Task 16 of the S6 plan re-measures the main-thread cost.
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-sans',
  display: 'swap',
  adjustFontFallback: true,
  fallback: ['Arial', 'sans-serif'],
})
```

`components/sections/trailhead.tsx`: replace `quality={85}` with `quality={70}`.

- [ ] **Step 4: Run the tests and build**

Run: `npx vitest run tests/design/performance.test.ts tests/design/font-budget.test.ts`, then `RESEND_API_KEY= GROQ_API_KEY= npm run build`, then `grep -o "__Archivo_Fallback[^']*" .next/static/css/*.css | head -1`.
Expected: PASS; the build's CSS carries an `@font-face` for `__Archivo_Fallback_…` with `size-adjust:98.7%`.

- [ ] **Step 5: Gates and commit**

```bash
git add app/layout.tsx components/sections/trailhead.tsx tests/design/performance.test.ts
git commit -m "perf(fonts): size-adjusted body fallback; portrait at quality 70" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Keep the chat launcher off every target

**Model:** Sonnet

**Files:**
- Modify: `components/footer.tsx`, `app/globals.css`
- Modify tests: `tests/design/sticky-header.test.ts`, `tests/design/s6-finish.test.ts` (append)

**Interfaces:**
- Consumes: the launcher's geometry in `components/ui/chat-widget.tsx` (44px, 16px from the corner below 640px; 56px, 24px from 640px).
- Produces: 96px under the footer's last row and 6rem of bottom scroll padding at every width.

- [ ] **Step 1: Write the failing tests**

Append to `tests/design/s6-finish.test.ts`:

```ts
describe('the chat launcher never covers a target', () => {
  // The launcher reaches 80px up from the bottom from 640px (24 + 56). From
  // 1024px to about 1215px the footer's last link sat under it (S2 Lighthouse).
  it('keeps the footer’s last row 96px above the bottom at every width', () => {
    const footer = readFileSync('components/footer.tsx', 'utf8')
    expect(footer).toMatch(/\bpb-24\b/)
    expect(footer).not.toMatch(/\b(?:sm|md|lg|xl):pb-/)
  })
})
```

In `tests/design/sticky-header.test.ts`, replace

```ts
  it('keeps focus clear of the fixed chat launcher below sm', () => {
    expect(css).toMatch(/@media \(max-width: 639px\) \{\s*html \{\s*scroll-padding-bottom:\s*4\.5rem;/)
  })
```

with

```ts
  it('keeps focus clear of the fixed chat launcher at every width', () => {
    // 56px tall and 24px up from 640px (44px and 16px below it), plus 8px air.
    const pad = css.match(/html \{[^}]*scroll-padding-bottom:\s*([\d.]+rem)/)?.[1]
    expect(pad).toBeDefined()
    expect(rem(pad!)).toBeGreaterThanOrEqual(24 + 56 + 8)
    expect(css).not.toMatch(/@media \(max-width: 639px\) \{\s*html \{\s*scroll-padding-bottom/)
  })
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/design/s6-finish.test.ts tests/design/sticky-header.test.ts -t launcher`
Expected: FAIL: the footer has `lg:pb-12`; the padding is only in the 639px query.

- [ ] **Step 3: Implement**

`components/footer.tsx`: replace

```tsx
      {/* pb-24 below lg keeps the last row clear of the fixed chat launcher. */}
      <div className={cn(SECTION, 'grid gap-8 pb-24 pt-12 sm:grid-cols-[1fr_auto] sm:items-end lg:pb-12')}>
```

with

```tsx
      {/* pb-24 at every width keeps the last row above the fixed chat launcher (80px tall from the bottom). */}
      <div className={cn(SECTION, 'grid gap-8 pb-24 pt-12 sm:grid-cols-[1fr_auto] sm:items-end')}>
```

`app/globals.css`: in the `html` base rule, after `scroll-padding-top: 5rem;` add

```css
		/* Focused controls also stop clear of the fixed chat launcher (WCAG 2.4.11). */
		scroll-padding-bottom: 6rem;
```

and delete

```css
	/* Keeps focused controls clear of the fixed chat launcher on phones (WCAG 2.4.11). */
	@media (max-width: 639px) {
		html {
			scroll-padding-bottom: 4.5rem;
		}
	}
```

- [ ] **Step 4: Run the tests**

Run: `npx vitest run tests/design/s6-finish.test.ts tests/design/sticky-header.test.ts tests/components/chrome.test.tsx`
Expected: PASS.

- [ ] **Step 5: Gates and commit**

```bash
git add components/footer.tsx app/globals.css tests/design/s6-finish.test.ts tests/design/sticky-header.test.ts
git commit -m "fix(a11y): the chat launcher clears the footer and focused controls at every width" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

The controller confirms in Task 16 that Lighthouse's target-size audit passes at 1024, 1280 and 390, and that "Ask Chunks" in the form is never under the launcher once scrolled into view.

---

### Task 6: Phone pacing: the shot frame and the field map

**Model:** Sonnet

**Files:**
- Modify: `components/ui/project-shot.tsx`, `components/ui/project-plate.tsx`, `components/sections/own-products.tsx`, `components/case-study/project-screenshots.tsx`, `components/sections/field-map.tsx`
- Modify tests: `tests/design/survey-plate.test.ts`, `tests/design/s6-finish.test.ts` (append)

**Interfaces:**
- Produces: `export const SHOT_ASPECT = 'aspect-[4/3] sm:aspect-[3/4]'` from `@/components/ui/project-shot`, used by every screenshot frame and every no-preview frame in its place.

- [ ] **Step 1: Write the failing tests**

Append to `tests/design/s6-finish.test.ts`:

```ts
describe('phone pacing', () => {
  // /projects was 15,094px tall at 390 wide: twenty 3:4 shots in one column.
  it('frames every screenshot 4:3 below 640px and 3:4 from it: one scale per width', () => {
    const shot = readFileSync('components/ui/project-shot.tsx', 'utf8')
    expect(shot).toContain("export const SHOT_ASPECT = 'aspect-[4/3] sm:aspect-[3/4]'")
    for (const f of [
      'components/ui/project-plate.tsx',
      'components/sections/own-products.tsx',
      'components/case-study/project-screenshots.tsx',
    ]) {
      const src = readFileSync(f, 'utf8')
      expect(src, f).not.toContain('aspect-[3/4]')
      expect(src, f).toContain('SHOT_ASPECT')
    }
  })

  // The field map section was 2,253px tall at 390 wide.
  it('sets the field map’s places two to a row on a phone, under a narrower map', () => {
    const src = readFileSync('components/sections/field-map.tsx', 'utf8')
    expect(src).toContain('grid grid-cols-2 gap-x-6 gap-y-6 sm:gap-x-8')
    expect(src).toContain('max-w-[18rem] sm:max-w-md')
  })
})
```

In `tests/design/survey-plate.test.ts`, replace `expect(src).toContain("'aspect-[3/4]'")` with `expect(src).toContain("export const SHOT_ASPECT = 'aspect-[4/3] sm:aspect-[3/4]'")`.

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/design/s6-finish.test.ts tests/design/survey-plate.test.ts -t "pacing|aspect"`
Expected: FAIL: no `SHOT_ASPECT`; field-map has `sm:grid-cols-2` and `max-w-md`.

- [ ] **Step 3: Implement**

`components/ui/project-shot.tsx`: above the `ProjectShot` doc comment add

```ts
/**
 * Every screenshot frame (and the printed no-preview frame in its place): 4:3
 * on a phone, where one column of 3:4 shots made /projects 15,000px tall, and
 * 3:4 from 640px. One scale per width, every plate on one baseline.
 */
export const SHOT_ASPECT = 'aspect-[4/3] sm:aspect-[3/4]'
```

and in `classes` replace `'aspect-[3/4]',` with `SHOT_ASPECT,`. In the doc comment replace `A still screenshot in the 3:4 frame every screenshot shares` with `A still screenshot in the frame every screenshot shares (SHOT_ASPECT)`.

`components/ui/project-plate.tsx`, `components/sections/own-products.tsx` and `components/case-study/project-screenshots.tsx`: add `SHOT_ASPECT` to the existing `import { ProjectShot } from '@/components/ui/project-shot'` (making it `import { ProjectShot, SHOT_ASPECT } from '@/components/ui/project-shot'`), and replace `className="aspect-[3/4] w-full"` on `NoPreviewTag` with `` className={`${SHOT_ASPECT} w-full`} ``. In their comments, replace "3:4 frame" with "shot frame".

`components/sections/field-map.tsx`: replace `className="mx-auto w-full max-w-md lg:max-w-none"` with `className="mx-auto w-full max-w-[18rem] sm:max-w-md lg:max-w-none"`, and `<ol className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-2">` with `<ol className="mt-4 grid grid-cols-2 gap-x-6 gap-y-6 sm:gap-x-8">`.

- [ ] **Step 4: Run the tests**

Run: `npx vitest run tests/design tests/components/project-plate.test.tsx tests/components/projects-page.test.tsx tests/components/project-page.test.tsx tests/components/homepage.test.tsx`
Expected: PASS (their `toContain('aspect-[3/4]')` checks still find `sm:aspect-[3/4]`).

- [ ] **Step 5: Browser look (controller), then gates and commit**

At 390 wide: `/projects` plates show a 4:3 top-of-site crop, nothing stretched; the field map's place names fit two to a row with no overflow; at 640 and 1440 the 3:4 frame is unchanged. Record `/projects` and the field map section heights in the ledger.

```bash
git add components/ui/project-shot.tsx components/ui/project-plate.tsx components/sections/own-products.tsx components/case-study/project-screenshots.tsx components/sections/field-map.tsx tests/design/s6-finish.test.ts tests/design/survey-plate.test.ts
git commit -m "perf(layout): 4:3 shot frames and two-up places on phones" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Section headings without eyebrows

**Model:** Opus

**Design reasoning:** an eyebrow over every h2 is the template's kicker; the craft floor bans it outright, and on this site each one repeated its heading in other words ("The fork" over "Two ways up").

**Files:**
- Modify: `components/ui/section-heading.tsx`, `lib/data.ts`, `types/index.ts`, `components/sections/{elevation-strip,fork,field-map,own-products,trail-journals,plan-the-route}.tsx`, `app/about/page.tsx`, `app/hire/page.tsx`, `app/services/[slug]/page.tsx`
- Modify tests: `tests/components/homepage.test.tsx`, `tests/content/positioning.test.ts`, `tests/design/s6-finish.test.ts` (append)

**Interfaces:**
- Produces: `SectionHeading({ id: string; title: string; className?: string })`, rendering one `<h2 id class="text-section mb-10 text-ink">`. `SectionCopy` becomes `{ title: string }`.

- [ ] **Step 1: Write the failing tests**

Append to `tests/design/s6-finish.test.ts`:

```ts
describe('section headings carry their own weight', () => {
  it('SectionHeading takes no eyebrow, and no page passes one', () => {
    expect(readFileSync('components/ui/section-heading.tsx', 'utf8')).not.toMatch(/eyebrow/)
    for (const { f, src } of sources) expect(src, f).not.toMatch(/<SectionHeading[^>]*\beyebrow=/)
  })
})
```

In `tests/components/homepage.test.tsx` replace each of these six lines

```ts
    expect(html).toContain(`>${sectionContent.timeline.eyebrow}</p>`)
    expect(html).toContain(`>${fork.eyebrow}</p>`)
    expect(html).toContain(`>${fieldMap.eyebrow}</p>`)
    expect(html).toContain(`>${sectionContent.ownProducts.eyebrow}</p>`)
    expect(html).toContain(`>${sectionContent.journals.eyebrow}</p>`)
    expect(html).toContain(`>${sectionContent.contact.eyebrow}</p>`)
```

with

```ts
    expect(html).not.toContain('class="eyebrow')
```

and rename the tests that held them from `'… its heading from data'` / `'… with its heading from data'` to the same names plus `', no eyebrow'` (for example `'is the #timeline section, its heading from data, no eyebrow'`).

In `tests/content/positioning.test.ts`, replace

```ts
  it('gives every section a heading', () => {
    for (const section of Object.values(sectionContent)) {
      expect(section.eyebrow.trim()).not.toBe('')
      expect(section.eyebrow).not.toMatch(/^\/\//)
      expect(section.title.trim()).not.toBe('')
    }
  })
```

with

```ts
  it('gives every section a heading and no eyebrow', () => {
    for (const section of Object.values(sectionContent)) {
      expect(section.title.trim()).not.toBe('')
      expect('eyebrow' in section).toBe(false)
    }
  })
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/design/s6-finish.test.ts tests/components/homepage.test.tsx tests/content/positioning.test.ts`
Expected: FAIL: the section heading renders `<p class="eyebrow mb-3">`; `sectionContent.fork` has an eyebrow.

- [ ] **Step 3: The component**

Replace `components/ui/section-heading.tsx` with

```tsx
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  /** id for the h2, referenced by the section's aria-labelledby. */
  id: string
  title: string
  className?: string
}

// The heading every section shares: the h2 in the section-title style, 40px
// above the content. No eyebrow over it: the heading carries its own weight
// (impeccable craft floor). Copy comes from lib/data.ts.
export function SectionHeading({ id, title, className }: SectionHeadingProps) {
  return (
    <h2 id={id} className={cn('text-section mb-10 text-ink', className)}>
      {title}
    </h2>
  )
}
```

- [ ] **Step 4: The data and the type**

`types/index.ts`: replace

```ts
export interface SectionCopy {
  eyebrow: string
  title: string
}
```

with

```ts
export interface SectionCopy {
  title: string
}
```

`lib/data.ts`:
- `sectionContent.ownProducts`: `{ eyebrow: 'Own products', title: 'Products of my own' }` → `{ title: 'Products of my own' }`.
- `sectionContent.fieldMap`: delete `    eyebrow: 'Field map',`.
- `sectionContent.journals`: `{ eyebrow: 'Trail journals', title: 'From the brief to launch' }` → `{ title: 'From the brief to launch' }`.
- `sectionContent.timeline`: delete `    eyebrow: 'Elevation · the route so far',`.
- `sectionContent.fork`: delete `    eyebrow: 'The fork',`.
- `sectionContent.contact`: delete `    eyebrow: 'Plan the route',`.
- `galleryContent`: delete `  eyebrow: 'Field log',`.
- `servicesPageContent.proof`: `{ eyebrow: 'Proof', title: 'Projects that prove it' }` → `{ title: 'Projects that prove it' }`.
- `aboutPageContent.story`: delete `    eyebrow: 'Story',`; `timeline: { eyebrow: 'Route', title: sectionContent.timeline.title }` → `timeline: { title: sectionContent.timeline.title }`; `testimonials: { eyebrow: 'From the field', title: 'What clients and colleagues say' }` → `testimonials: { title: 'What clients and colleagues say' }`.
- `hirePageContent.stack`: delete `    eyebrow: 'Stack',`; `howIWork`: delete `    eyebrow: 'Practice',`; `history: { eyebrow: 'Route', title: 'Work history' }` → `history: { title: 'Work history' }`.

If `galleryContent` has a type with `eyebrow`, drop the field there too (type-check names it).

- [ ] **Step 5: The callers**

Remove the `eyebrow={…}` prop from every `<SectionHeading`:

- `components/sections/elevation-strip.tsx`: `<SectionHeading id="timeline-title" title={timeline.title} />`
- `components/sections/fork.tsx`: `<SectionHeading id="fork-title" title={fork.title} />`
- `components/sections/field-map.tsx`: `<SectionHeading id="work-title" title={fieldMap.title} />`
- `components/sections/own-products.tsx`: `<SectionHeading id="products-title" title={sectionContent.ownProducts.title} />`
- `components/sections/trail-journals.tsx`: `<SectionHeading id="journals-title" title={sectionContent.journals.title} />`
- `components/sections/plan-the-route.tsx`: `<SectionHeading id="contact-title" title={sectionContent.contact.title} className="mb-0" />`
- `app/about/page.tsx`: `<SectionHeading id="story-title" title={c.story.title} />`, `<SectionHeading id="route-title" title={c.timeline.title} />`, `<SectionHeading id="field-log-title" title={galleryContent.title} />`, `<SectionHeading id="testimonials-title" title={c.testimonials.title} />`
- `app/hire/page.tsx`: `<SectionHeading id="stack-title" title={c.stack.title} />`, `<SectionHeading id="practice-title" title={c.howIWork.title} />`, `<SectionHeading id="history-title" title={c.history.title} />`
- `app/services/[slug]/page.tsx`: `<SectionHeading id="proof-title" title={proof.title} />`

- [ ] **Step 6: Run the suite**

Run: `npm test`
Expected: PASS. If a test still reads a deleted `…eyebrow`, type-check names it; replace that assertion with `expect(html).not.toContain('class="eyebrow')` for the section it renders.

- [ ] **Step 7: Browser look (controller), then gates and commit**

At 1440 and 390: each section opens on its h2 with more space above it than below (the section's top padding over `mb-10`); no orphaned gap where the eyebrow was.

```bash
git add components/ui/section-heading.tsx lib/data.ts types/index.ts components/sections app/about/page.tsx app/hire/page.tsx "app/services/[slug]/page.tsx" tests/components/homepage.test.tsx tests/content/positioning.test.ts tests/design/s6-finish.test.ts
git commit -m "style(type): section headings without eyebrows" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: The fork and the spot heights without the templates

**Model:** Opus

**Design reasoning:** the fork is a route that splits, so it is drawn as one, with two legs on open paper rather than two identical boxes. Spot heights on a survey map are small figures beside a mark, so the counts read as the strip's legend, not as a poster of four numerals.

**Files:**
- Modify: `components/sections/fork.tsx`, `components/sections/elevation-strip.tsx`
- Modify tests: `tests/components/homepage.test.tsx`

**Interfaces:**
- Consumes: `sectionContent.fork`, `elevationFigures()` (unchanged).
- Produces: an `<svg class="fork-route …">`; the figures without `.text-numeral`.

- [ ] **Step 1: Write the failing tests**

In `tests/components/homepage.test.tsx`, inside `describe('Fork', …)` add

```ts
  it('draws the fork as a route that splits over open paper, not two boxed cards', () => {
    expect(html).toMatch(/<svg aria-hidden="true" focusable="false"[^>]*class="fork-route/)
    for (const card of cards) expect(card).not.toMatch(/\bbg-panel\b|\brounded\b/)
  })
```

and inside `describe('ElevationStrip', …)` add

```ts
  it('sets the counts as the strip’s legend, not a big-number row', () => {
    expect(html).not.toContain('text-numeral')
    for (const f of elevationFigures()) expect(html).toContain(`<span class="text-title tabular text-ink">${f.value}</span>`)
  })
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/components/homepage.test.tsx -t "route that splits|legend"`
Expected: FAIL: no `fork-route`; the cards carry `rounded border border-line bg-panel`; `text-numeral` present.

- [ ] **Step 3: The fork**

In `components/sections/fork.tsx`, delete `const CARD = 'flex flex-col rounded border border-line bg-panel p-6 sm:p-8'`, add above `export function Fork`

```tsx
/** The split: one leg up from the trailhead dividing in two, one over each path (decorative). */
function ForkRoute() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 100 48"
      preserveAspectRatio="none"
      className="fork-route mb-2 hidden h-12 w-full text-ink md:block"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeDasharray="6 5"
    >
      <path d="M50 0 V14 C50 30 25 30 25 48" vectorEffect="non-scaling-stroke" />
      <path d="M50 14 C50 30 75 30 75 48" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
```

replace the doc comment's last sentence with `Two legs on open paper under the drawn split; outline buttons, since the trail-red primary stays the trailhead's.`, and replace the `<ul>…</ul>` opening and the two `<li className={CARD}>` with

```tsx
      <ForkRoute />
      <ul className="grid gap-12 md:grid-cols-2 md:gap-16">
        <li className="flex flex-col border-t-2 border-ink pt-6">
```

and

```tsx
        <li className="flex flex-col border-t-2 border-ink pt-6">
```

(the two `<li>`s keep their contents unchanged).

- [ ] **Step 4: The spot heights**

In `components/sections/elevation-strip.tsx`, replace

```tsx
      <ul className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
        {figures.map((f) => (
          <li key={f.label} className="flex flex-col gap-2 border-t border-line pt-3">
            <span className="flex items-center gap-2">
              <SpotHeight />
              <span className="text-numeral text-ink">{f.value}</span>
            </span>
            <span className="text-sm leading-snug text-muted-strong">{f.label}</span>
          </li>
        ))}
      </ul>
```

with

```tsx
      {/* The strip's legend: each count beside its spot height, the way a map prints one. */}
      <ul className="flex flex-wrap gap-x-10 gap-y-4 border-y border-line py-5">
        {figures.map((f) => (
          <li key={f.label} className="flex items-baseline gap-2">
            <SpotHeight />
            <span className="text-title tabular text-ink">{f.value}</span>
            <span className="text-sm leading-snug text-muted-strong">{f.label}</span>
          </li>
        ))}
      </ul>
```

and in the doc comment replace `the proof figures as spot heights` with `the proof counts as the strip's legend of spot heights`.

- [ ] **Step 5: Run the tests**

Run: `npx vitest run tests/components/homepage.test.tsx tests/content/proof-band.test.ts tests/design`
Expected: PASS.

- [ ] **Step 6: Browser look (controller), then gates and commit**

1440: the split's two legs land over the two columns' top rules; the counts sit on one ruled line. 390: the split is hidden, the two paths stack with their rules; the counts wrap two to a line without a stranded label.

```bash
git add components/sections/fork.tsx components/sections/elevation-strip.tsx tests/components/homepage.test.tsx
git commit -m "style(home): the fork drawn as a split; counts as the strip's legend" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: The journals: one open, five on the shelf

**Model:** Opus

**Design reasoning:** six identical covers in a 3×2 grid are the card-grid default; one journal opened on the panel and five ruled rows make reading order visible and halve the section's phone height.

**Files:**
- Modify: `components/sections/trail-journals.tsx`
- Modify tests: `tests/components/homepage.test.tsx`

**Interfaces:**
- Consumes: `FLAGSHIP_SLUGS`, `getCaseStudy`, `briefLead`, `edgeCode`, `projectHref`, `TrailLinkText`, `trailLinkClass` (unchanged).
- Produces: `<ol>` of six `<li class="reveal-cover…">`; the first holds the one `lift-card` cover.

- [ ] **Step 1: Write the failing tests**

In `tests/components/homepage.test.tsx` (`describe('TrailJournals')`), replace

```ts
  it('opens one journal per flagship, so a missing study cannot silently drop a cover', () => {
    expect(html.match(/<li class="reveal-cover"/g)).toHaveLength(FLAGSHIP_SLUGS.length)
    expect(html.match(/href="\/projects\/[^"]+"/g)).toHaveLength(FLAGSHIP_SLUGS.length)
  })

  it('lifts like every catalog card and rises by transform only', () => {
    expect(html.match(/class="lift-card /g)).toHaveLength(FLAGSHIP_SLUGS.length)
    expect(html.match(/class="reveal-cover"/g)).toHaveLength(FLAGSHIP_SLUGS.length)
  })
```

with

```ts
  it('opens one journal per flagship, so a missing study cannot silently drop a cover', () => {
    expect(html.match(/<li class="reveal-cover[ "]/g)).toHaveLength(FLAGSHIP_SLUGS.length)
    expect(html.match(/href="\/projects\/[^"]+"/g)).toHaveLength(FLAGSHIP_SLUGS.length)
  })

  it('opens the first journal on the panel and shelves the other five as ruled rows', () => {
    expect(html).toMatch(/^<section[^>]*>[\s\S]*?<ol class="[^"]*lg:grid-cols-\[7fr_5fr\]/)
    expect(html.match(/class="lift-card /g)).toHaveLength(1)
    expect(html.match(/<li class="reveal-cover border-t border-line"/g)).toHaveLength(FLAGSHIP_SLUGS.length - 1)
    const lead = html.slice(html.indexOf('<li'), html.indexOf('</li>'))
    expect(lead).toContain(`href="/projects/${FLAGSHIP_SLUGS[0]}"`)
    expect(lead).toContain('bg-panel')
  })
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/components/homepage.test.tsx -t TrailJournals`
Expected: FAIL: six `lift-card` covers in a `<ul>`.

- [ ] **Step 3: Implement**

Replace the doc comment and the function in `components/sections/trail-journals.tsx` (keep the imports and `Journal`) with

```tsx
/** A journal's place line: where it runs, when its own words name the place. */
function placeLine(project: Project): string {
  return project.place ? `${project.place.name} · ${sectorNames[project.sector]}` : sectorNames[project.sector]
}

/**
 * The trail journals (spec §5): the six case studies in reading order. The
 * first lies open on the panel (its number, title, place, the brief's first
 * sentence, Christian's role) and lifts on hover like a plate; the other five
 * are on the shelf, one ruled row each, their cue underlining on hover. Each
 * opens its flagship page and is named by its title and cue. Rows rise into
 * place as they scroll in, transform only (.reveal-cover).
 */
export function TrailJournals() {
  const journals = FLAGSHIP_SLUGS.flatMap((slug): Journal[] => {
    const project = projects.find((p) => p.slug === slug)
    const study = getCaseStudy(slug)
    return project && study ? [{ project, study }] : []
  })
  const code = (i: number) => edgeCode(i + 1, journals.length, caseStudyContent.eyebrow.caseStudy)
  const [lead, ...shelf] = journals

  return (
    <section id="journals" aria-labelledby="journals-title" className={cn(SECTION, 'pb-[72px] md:pb-[112px]')}>
      <SectionHeading id="journals-title" title={sectionContent.journals.title} />
      <ol className="grid gap-x-12 lg:grid-cols-[7fr_5fr]">
        {lead && (
          <li className="reveal-cover mb-10 lg:row-span-5 lg:mb-0">
            <Link
              href={projectHref(lead.project)}
              className="lift-card group relative flex h-full min-h-[22rem] flex-col rounded border border-line bg-panel p-6 sm:p-8"
            >
              <span aria-hidden="true" className="map-label tabular text-muted">{code(0)}</span>
              <h3 className="text-title mt-8 text-ink">{lead.project.title}</h3>
              <span className="map-label mt-2 text-muted">{placeLine(lead.project)}</span>
              <span className="text-lede mt-6 max-w-[40ch] text-muted-strong">{briefLead(lead.study)}</span>
              <span className="mt-auto pt-8 text-sm text-ink">{lead.study.role}</span>
              <span className={cn(trailLinkClass('action'), 'mt-4 min-h-0')}>
                <TrailLinkText text={ctaLabels.readCaseStudy} />
              </span>
            </Link>
          </li>
        )}
        {shelf.map(({ project, study }, i) => (
          <li key={project.slug} className="reveal-cover border-t border-line" style={{ '--i': i % 3 } as CSSProperties}>
            <Link href={projectHref(project)} className="group flex flex-col py-5">
              <span aria-hidden="true" className="map-label tabular text-muted">{code(i + 1)}</span>
              <h3 className="text-title mt-2 text-ink">{project.title}</h3>
              <span className="map-label mt-1 text-muted">{placeLine(project)}</span>
              <span className="mt-3 text-sm leading-relaxed text-muted-strong">{briefLead(study)}</span>
              <span className="mt-3 text-sm text-ink">{study.role}</span>
              <span className={cn(trailLinkClass('action'), 'mt-2 min-h-[44px]')}>
                <TrailLinkText text={ctaLabels.readCaseStudy} />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
```

- [ ] **Step 4: Run the tests**

Run: `npx vitest run tests/components/homepage.test.tsx tests/design/plate-motion.test.ts tests/components/trail-link.test.tsx`
Expected: PASS (the WCAG 2.5.3 test still finds each `<h3 class="…">Title</h3>` inside a link with no `aria-label`).

- [ ] **Step 5: Browser look (controller), then gates and commit**

1440: the open journal fills the left column's height beside the five rows; hover lifts only the open one; a row's cue draws its underline. 390: the open journal, then five rows, each a 44px-tall target on its cue. Record the section's phone height.

```bash
git add components/sections/trail-journals.tsx tests/components/homepage.test.tsx
git commit -m "style(home): one open journal and five on the shelf" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Pins hold their size; a key for dot and ring

**Model:** Sonnet

**Files:**
- Create: `components/map/map-key.tsx`, `tests/components/map-key.test.tsx`
- Modify: `components/map/pin.tsx`, `components/sections/field-map.tsx`, `app/projects/page.tsx`, `app/globals.css`, `lib/data.ts`

**Interfaces:**
- Consumes: `PlaceGlyph({ precision: PlacePrecision })` (`'city' | 'region'`), `--pan-s` (written by `panStyle` on `.map-pan`).
- Produces: `MapKey({ className?: string })` server component; `sectionContent.fieldMap.key: { city: string; region: string }`; each pin's mark in `<g class="map-pin__mark" style="transform-origin:Xpx Ypx">`.

- [ ] **Step 1: Write the failing test**

Create `tests/components/map-key.test.tsx`:

```tsx
import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { MapKey } from '@/components/map/map-key'
import { Pin } from '@/components/map/pin'
import { FieldMap } from '@/components/sections/field-map'
import { projects, sectionContent } from '@/lib/data'
import { project as toMap } from '@/lib/geo'
import { placeGroups } from '@/lib/places'
import { parseCssRules } from '@/tests/helpers/css-rules'

const css = readFileSync('app/globals.css', 'utf8')

describe('map pins hold their size while the map pans', () => {
  it('scales each pin’s mark and label about its own point', () => {
    const g = placeGroups(projects)[0]
    const { x, y } = toMap(g.lat, g.lng)
    const html = renderToStaticMarkup(
      <svg>
        <Pin group={g} href="#x" />
      </svg>,
    )
    expect(html).toContain(`<g class="map-pin__mark" style="transform-origin:${x}px ${y}px">`)
  })

  it('by the inverse of the pan scale, gliding only where motion is allowed', () => {
    const rules = parseCssRules(css).filter((r) => r.selector === '.map-pin__mark')
    expect(rules.map((r) => r.body).join(';')).toMatch(/transform:\s*scale\(calc\(1 \/ var\(--pan-s, 1\)\)\)/)
    const glide = rules.find((r) => /transition/.test(r.body))
    expect(glide?.ancestors).toContain('@media (prefers-reduced-motion: no-preference)')
    expect(glide?.body).toMatch(/var\(--dur-slow\) var\(--ease-smooth\)/)
  })
})

describe('the map key', () => {
  it('names the dot and the ring from data', () => {
    const html = renderToStaticMarkup(<MapKey />)
    expect(html).toContain(`>${sectionContent.fieldMap.key.city}</li>`)
    expect(html).toContain(`>${sectionContent.fieldMap.key.region}</li>`)
    expect(html.match(/<svg aria-hidden="true"/g)).toHaveLength(2)
  })

  it('sits in the homepage map’s caption and in /projects’ map caption', () => {
    const home = renderToStaticMarkup(<FieldMap />)
    expect(home.slice(home.indexOf('<figcaption'), home.indexOf('</figcaption>'))).toContain(sectionContent.fieldMap.key.city)
    expect(readFileSync('app/projects/page.tsx', 'utf8')).toMatch(/<MapKey className="mt-2" \/>\s*<\/figcaption>/)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/components/map-key.test.tsx`
Expected: FAIL: cannot resolve `@/components/map/map-key`.

- [ ] **Step 3: Implement**

`lib/data.ts`, in `sectionContent.fieldMap` after `regionNote`:

```ts
    // The map's key (draft copy for Christian's review): what a dot and a ring mean.
    key: { city: 'Town or city', region: 'Region, pinned at its centre' },
```

`components/map/map-key.tsx`:

```tsx
import { PlaceGlyph } from '@/components/map/pin'
import { sectionContent } from '@/lib/data'
import { cn } from '@/lib/utils'

/** The map's key (spec §3: ringed and dotted pins): a dot for a town or city, a ring for a region. */
export function MapKey({ className }: { className?: string }) {
  const { key } = sectionContent.fieldMap
  return (
    <ul className={cn('flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-strong', className)}>
      <li className="flex items-center gap-2">
        <PlaceGlyph precision="city" />
        {key.city}
      </li>
      <li className="flex items-center gap-2">
        <PlaceGlyph precision="region" />
        {key.region}
      </li>
    </ul>
  )
}
```

`components/map/pin.tsx`: replace the `Pin` return with

```tsx
  return (
    <a href={href} tabIndex={-1} aria-hidden="true" className="map-pin">
      {/* Counter-scaled about its own point (.map-pin__mark), so a pan zooms the map, not the pin. */}
      <g className="map-pin__mark" style={{ transformOrigin: `${x}px ${y}px` }}>
        {group.precision === 'region' ? (
          <circle cx={x} cy={y} r={18} className="map-ring fill-none stroke-ink" strokeWidth={2} strokeDasharray="4 3" />
        ) : (
          <circle cx={x} cy={y} r={6} className="map-dot fill-ink" />
        )}
        <text x={Math.round(x + label.dx)} y={Math.round(y + label.dy)} textAnchor={label.anchor} className="map-label fill-ink text-[22px]">
          {group.name}
        </text>
      </g>
    </a>
  )
```

`components/sections/field-map.tsx`: import `MapKey` from `@/components/map/map-key` and replace

```tsx
          <figcaption className="mt-3 px-1 text-sm text-muted-strong">{fieldMap.caption}</figcaption>
```

with

```tsx
          <figcaption className="mt-3 px-1 text-sm text-muted-strong">
            {fieldMap.caption}
            <MapKey className="mt-2" />
          </figcaption>
```

`app/projects/page.tsx`: import `MapKey` and, inside the map's `<figcaption>`, after the `unpinned` line add `<MapKey className="mt-2" />` as the last child, so it reads

```tsx
            {unpinned > 0 && ` ${projectsPageContent.unpinned.replace('{count}', String(unpinned))}`}
            <MapKey className="mt-2" />
          </figcaption>
```

`app/globals.css`, after the `.map-pan` block (before `/* /Map pan */`):

```css
/* A pin keeps its size while the map pans: its mark and label scale by the
 * inverse of the layer's --pan-s about the pin's own point (transform-origin,
 * written per pin), gliding with the layer. On the homepage --pan-s is unset: 1. */
.map-pin__mark {
	transform: scale(calc(1 / var(--pan-s, 1)));
}
@media (prefers-reduced-motion: no-preference) {
	.map-pin__mark { transition: transform var(--dur-slow) var(--ease-smooth); }
}
```

- [ ] **Step 4: Run the tests**

Run: `npx vitest run tests/components/map-key.test.tsx tests/components/map-pin.test.tsx tests/components/homepage.test.tsx tests/components/projects-page.test.tsx tests/design`
Expected: PASS (the homepage pin regex still matches `class="map-pin">` and finds `cx`, `map-ring`/`map-dot` and the label inside the `<a>`).

- [ ] **Step 5: Browser look (controller), then gates and commit**

`/projects?band=Sites` at 1440 (pan scale about 1.29): labels and dots the same size as on `/projects`; the glide of the pins matches the map's. Under reduced motion: no glide, still counter-scaled.

```bash
git add components/map/map-key.tsx components/map/pin.tsx components/sections/field-map.tsx app/projects/page.tsx app/globals.css lib/data.ts tests/components/map-key.test.tsx
git commit -m "feat(map): pins hold their size through a pan; a key for dot and ring" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Motion: contour shift, plates appear once

**Model:** Sonnet. Load `modern-web-guidance` first and search "scroll-triggered animations timeline-trigger"; if the current Chromium syntax differs from the 4.0 form below, use the current one and say so in the report (the controller checks in a browser).

**Files:**
- Create: `tests/design/s6-motion.test.ts`
- Modify: `app/globals.css`, `components/sections/trailhead.tsx`, `components/ui/project-plate.tsx`, `components/sections/own-products.tsx`, `components/case-study/project-screenshots.tsx`
- Modify tests: `tests/design/retired-classes.test.ts`

**Interfaces:**
- Consumes: `ContourField`'s `className` prop; `--dur-crawl`, `--dur-normal`, `--ease-smooth`.
- Produces: classes `trailhead-contours`, `trailhead-plate`, `plate-rise`.

- [ ] **Step 1: Write the failing test**

Create `tests/design/s6-motion.test.ts`:

```ts
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parseCssRules } from '@/tests/helpers/css-rules'

// Spec §4: "The hero contours shift slightly under a fine pointer; nothing on
// touch. Headlines rise line by line; screenshots appear once as they enter view."
const css = readFileSync('app/globals.css', 'utf8')
const rules = parseCssRules(css)

describe('the headline rises line by line (shipped in S2)', () => {
  it('staggers each authored line on --stagger-line, behind no-preference', () => {
    const line = rules.find((r) => r.selector === '.trailhead-line' && /animation:/.test(r.body))
    expect(line?.body).toMatch(/calc\(var\(--i, 0\) \* var\(--stagger-line\)\)/)
    expect(line?.ancestors).toContain('@media (prefers-reduced-motion: no-preference)')
  })
})

describe('the hero contours shift under a fine pointer', () => {
  const shift = rules.filter((r) => /\.trailhead-contours/.test(r.selector) && /transform|transition/.test(r.body))

  it('only on a fine pointer with motion allowed', () => {
    expect(shift.length).toBeGreaterThanOrEqual(3)
    for (const r of shift) {
      const at = r.ancestors.join(' ')
      expect(at, r.selector).toContain('(hover: hover)')
      expect(at, r.selector).toContain('(pointer: fine)')
      expect(at, r.selector).toContain('(prefers-reduced-motion: no-preference)')
    }
  })

  it('toward the half the pointer rests on, 8px by transform, on a token', () => {
    const sel = shift.map((r) => r.selector).join(' ')
    expect(sel).toMatch(/\.trailhead:has\(\.trailhead-copy:hover\) \.trailhead-contours/)
    expect(sel).toMatch(/\.trailhead:has\(\.trailhead-plate:hover\) \.trailhead-contours/)
    const body = shift.map((r) => r.body).join(';')
    expect(body).toMatch(/translate\(-8px, -4px\)/)
    expect(body).toMatch(/translate\(8px, 4px\)/)
    expect(body).toMatch(/transition: transform var\(--dur-crawl\) var\(--ease-smooth\)/)
    expect(body).not.toMatch(/animation/)
  })

  it('names both halves and the contours in the trailhead', () => {
    const src = readFileSync('components/sections/trailhead.tsx', 'utf8')
    for (const cls of ['trailhead-contours', 'trailhead-plate', 'trailhead-copy']) expect(src, cls).toContain(cls)
  })
})

describe('screenshots appear once as they enter view', () => {
  const rise = rules.filter((r) => /\.plate-rise/.test(r.selector) && /animation/.test(r.body) && !/animation:\s*none/.test(r.body))

  it('rise on a scroll trigger, played forwards once, never scrubbed', () => {
    expect(rise.length).toBeGreaterThan(0)
    const body = rise.map((r) => r.body).join(';')
    expect(body).toMatch(/timeline-trigger:\s*--plate view\(\) entry 0% entry 100%/)
    expect(body).toMatch(/animation-trigger:\s*--plate play-forwards/)
    expect(body).toMatch(/animation-fill-mode:\s*backwards/)
    expect(body).not.toMatch(/animation-timeline/)
    for (const r of rise) {
      const at = r.ancestors.join(' ')
      expect(at).toContain('@supports (timeline-trigger: --plate view())')
      expect(at).toContain('(prefers-reduced-motion: no-preference)')
    }
  })

  it('move their last 16px by transform only', () => {
    const frames = css.match(/@keyframes plate-rise \{([\s\S]*?)\n\t\t\}/)?.[1]
    expect(frames).toBeDefined()
    expect(frames).toContain('translateY(16px)')
    expect(frames).not.toContain('opacity')
  })

  it('switch off under reduce', () => {
    const off = rules.find((r) => /\.plate-rise/.test(r.selector) && r.ancestors.includes('@media (prefers-reduced-motion: reduce)'))
    expect(off?.body).toMatch(/animation:\s*none/)
  })

  it('sit on every project plate, own-product plate and case-study shot', () => {
    for (const f of ['components/ui/project-plate.tsx', 'components/sections/own-products.tsx', 'components/case-study/project-screenshots.tsx']) {
      expect(readFileSync(f, 'utf8'), f).toContain('plate-rise')
    }
  })
})
```

In `tests/design/retired-classes.test.ts`, replace

```ts
  ['the rack stagger', /reveal-stagger|timeline-trigger|animation-trigger|--stagger-card|--c3\b|--c4\b/],
```

with

```ts
  // The trigger properties came back in S6 for .plate-rise; the rack's stagger stays gone by name.
  ['the rack stagger', /reveal-stagger|--stagger-card|--c3\b|--c4\b|--card view\(\)/],
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/design/s6-motion.test.ts`
Expected: the "line by line" test PASSES (shipped); the contour and plate tests FAIL (no rules, no classes).

- [ ] **Step 3: CSS**

In `app/globals.css`, after the `.trailhead-line { display: block; white-space: nowrap; }` rule add

```css
/* Under a fine pointer the contours drift toward the half the pointer rests
 * on (spec §4), 8px (motionTokens.distance.sm) by transform, on the crawl
 * token. The trail stays put, so the land moves under a fixed route. Nothing
 * on touch, nothing under reduced motion, and it moves only while the pointer
 * moves between halves. */
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
	.trailhead-contours { transition: transform var(--dur-crawl) var(--ease-smooth); }
	.trailhead:has(.trailhead-copy:hover) .trailhead-contours { transform: translate(-8px, -4px); }
	.trailhead:has(.trailhead-plate:hover) .trailhead-contours { transform: translate(8px, 4px); }
}
```

After the `/* /ProjectShot */` line add

```css
/*
 * Screenshots appear once (spec §4): a plate rises its last 16px as it
 * enters the viewport. A scroll trigger starts a time-based animation (not
 * scrubbed; play-forwards never reverses); nothing is filled before it fires,
 * so a plate already in view at load, or after a filter change, never moves.
 * Without trigger support the plates simply sit at rest. Transform only.
 */
@supports (timeline-trigger: --plate view()) {
	@media (prefers-reduced-motion: no-preference) {
		@keyframes plate-rise {
			from { transform: translateY(16px); }
			to { transform: none; }
		}
		.plate-rise {
			timeline-trigger: --plate view() entry 0% entry 100%;
			animation: plate-rise var(--dur-normal) var(--ease-smooth);
			animation-fill-mode: backwards;
			animation-trigger: --plate play-forwards;
		}
	}
}
```

In the `@media (prefers-reduced-motion: reduce)` block, after the `.reveal-cover { … }` rule add

```css
	.plate-rise { animation: none !important; transform: none; }
```

- [ ] **Step 4: Markup**

`components/sections/trailhead.tsx`: replace `<ContourField paths={trailheadContours} viewBox={trailheadTrail.viewBox} />` with `<ContourField paths={trailheadContours} viewBox={trailheadTrail.viewBox} className="trailhead-contours" />` and `<div className="w-full max-w-[22rem] md:justify-self-end md:pt-2">` with `<div className="trailhead-plate w-full max-w-[22rem] md:justify-self-end md:pt-2">`. In the doc comment, after `1.9s, once).` add ` Under a fine pointer the contours drift toward the half the pointer rests on (.trailhead-contours).`

`components/ui/project-plate.tsx`: replace `className="project-plate min-w-0 scroll-mt-28"` with `className="project-plate plate-rise min-w-0 scroll-mt-28"`.

`components/sections/own-products.tsx`: replace `<article aria-labelledby={titleId} className="flex flex-col">` with `<article aria-labelledby={titleId} className="plate-rise flex flex-col">`.

`components/case-study/project-screenshots.tsx`: add `plate-rise` as the first class of the outermost element of each screenshot plate it renders (the element wrapping `SurveyPlate`, or the `SurveyPlate` itself via its `className`); never on the morph-target header shot, which is in the first viewport.

- [ ] **Step 5: Run the tests**

Run: `npx vitest run tests/design tests/components`
Expected: PASS, including `plate-motion` ("drives nothing about a plate from scroll": `.plate-rise` carries no `animation-timeline` or `view-timeline`) and `motion-tokens`.

- [ ] **Step 6: Browser look (controller), then gates and commit**

Chromium, 1440: hover the headline, then the portrait: the contours drift about 8px each way over 1.2s; the trail does not move; touch emulation: nothing. Scroll `/projects`: each plate below the fold rises once as it enters; scrolling back up and down again does not replay; plates in view at load never move; a filter change does not replay them. If the trigger syntax is unsupported, the plates sit at rest (acceptable; note it in the ledger).

```bash
git add app/globals.css components/sections/trailhead.tsx components/ui/project-plate.tsx components/sections/own-products.tsx components/case-study/project-screenshots.tsx tests/design/s6-motion.test.ts tests/design/retired-classes.test.ts
git commit -m "feat(motion): hero contours drift under a fine pointer; plates rise once" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: The link-preview card

**Model:** Sonnet

**Files:**
- Create: `lib/og-linework.ts`
- Modify: `app/og/[[...path]]/route.tsx`
- Modify tests: `tests/components/og-card.test.tsx`

**Interfaces:**
- Produces (from `@/lib/og-linework`): `PAD_X = 80`, `TEXT_WIDTH = 760`, `CONTOURS: string[]`, `TRAIL: string`, `HERE: { cx: number; cy: number; r: number }`.

- [ ] **Step 1: Write the failing test**

Append to `tests/components/og-card.test.tsx` (add `import { CONTOURS, HERE, PAD_X, TEXT_WIDTH, TRAIL } from '@/lib/og-linework'` at the top):

```ts
describe('the card’s layout', () => {
  // S5 controller look: the trail and contours ran behind the site URL at the
  // bottom right, and the headline's word gap read wide.
  const xs = (d: string) => (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number).filter((_, i) => i % 2 === 0)

  it('keeps every line of the linework right of the words’ column', () => {
    const right = PAD_X + TEXT_WIDTH
    for (const d of [...CONTOURS, TRAIL]) expect(Math.min(...xs(d)), d).toBeGreaterThan(right)
    expect(HERE.cx - HERE.r).toBeGreaterThan(right)
  })

  it('sets the name and the URL inside that column, and the title word by word', () => {
    const source = readFileSync(SOURCE, 'utf8')
    expect(source.match(/maxWidth: TEXT_WIDTH/g)).toHaveLength(2)
    expect(source).toContain("card.title.split(' ').map(")
    expect(source).toContain('columnGap: 18')
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/components/og-card.test.tsx`
Expected: FAIL: cannot resolve `@/lib/og-linework`.

- [ ] **Step 3: Implement**

`lib/og-linework.ts`:

```ts
// The link-preview card's survey linework (app/og/[[...path]]/route.tsx),
// authored for 1200×630. Every line stays right of the words' column
// (PAD_X + TEXT_WIDTH = 840), so nothing runs behind a word or the site URL:
// contours, and the trail ending at the "you are here" dot, trail red's one
// use on the card. Here, not in the route file: a route may export only its
// handler and route options.
export const PAD_X = 80
export const TEXT_WIDTH = 760

export const CONTOURS = [
  'M 860 0 C 900 80 980 120 1060 140 S 1170 190 1200 200',
  'M 960 0 C 990 50 1050 80 1110 92 S 1180 110 1200 112',
  'M 880 630 C 900 540 960 470 1040 430 S 1170 330 1200 300',
  'M 960 630 C 980 560 1030 510 1100 480 S 1180 410 1200 395',
  'M 1040 630 C 1060 590 1100 560 1150 545 S 1190 530 1200 528',
]
export const TRAIL = 'M 900 630 C 930 560 980 500 1030 440 S 1100 330 1120 300'
export const HERE = { cx: 1120, cy: 300, r: 11 }
```

`app/og/[[...path]]/route.tsx`: add `import { CONTOURS, HERE, PAD_X, TEXT_WIDTH, TRAIL } from '@/lib/og-linework'`; delete the comment `// The card's survey linework, …` and the local `CONTOURS`, `TRAIL`, `HERE` constants; replace `<circle cx={HERE.cx} cy={HERE.cy} r={11} fill={c.trail} />` with `<circle cx={HERE.cx} cy={HERE.cy} r={HERE.r} fill={c.trail} />`; replace `padding: '64px 80px 56px',` with `` padding: `64px ${PAD_X}px 56px`, ``; replace `<div style={{ display: 'flex', flexDirection: 'column', maxWidth: 760 }}>` with `<div style={{ display: 'flex', flexDirection: 'column', maxWidth: TEXT_WIDTH }}>`; replace the title block

```tsx
            <div
              style={{
                display: 'flex',
                fontSize: 68,
                fontWeight: 600,
                lineHeight: 1.04,
                letterSpacing: -1,
                textTransform: 'uppercase',
              }}
            >
              {card.title}
            </div>
```

with

```tsx
            {/* Word by word with an explicit gap: the face's own space read wide in capitals. */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: 18,
                fontSize: 68,
                fontWeight: 600,
                lineHeight: 1.04,
                letterSpacing: -1,
                textTransform: 'uppercase',
              }}
            >
              {card.title.split(' ').map((word, i) => (
                <span key={`${word}-${i}`}>{word}</span>
              ))}
            </div>
```

and replace the bottom row's style

```tsx
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 24,
```

with

```tsx
              display: 'flex',
              justifyContent: 'space-between',
              maxWidth: TEXT_WIDTH,
              paddingTop: 24,
```

- [ ] **Step 4: Run the tests**

Run: `npx vitest run tests/components/og-card.test.tsx tests/design/og-palette.test.ts`
Expected: PASS (the PNG render test runs on Linux CI only).

- [ ] **Step 5: Look (controller), then gates and commit**

On the keyless server fetch `/og`, `/og/services/ai-automation`, `/og/projects/el-nido-guide-ph`: the URL ends left of the linework, no line crosses a word, "BUILT IN BICOL." reads with even word spacing, a long project title wraps inside the column.

```bash
git add lib/og-linework.ts "app/og/[[...path]]/route.tsx" tests/components/og-card.test.tsx
git commit -m "fix(seo): the card keeps its linework clear of the words and the url" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Meta descriptions that fit a snippet

**Model:** Sonnet

**Files:**
- Create: `tests/content/meta-descriptions.test.ts`
- Modify: `types/index.ts`, `lib/data.ts`, `lib/site-routes.ts`, `lib/site-metadata.ts`
- Modify tests: `tests/content/page-metadata.test.ts`

**Interfaces:**
- Produces: `Project.metaDescription?: string`; `metaDescription: string` on `ServicePage`, `ServicesPageContent`, `AboutPageContent`, `HirePageContent`; `SiteRoute.metaDescription: string` (the short line, or `description` where none is set). Only `lib/site-metadata.ts` reads it; `description` (the long answer) stays for `lib/llms.ts`, `lib/chat-context.ts` and the JSON-LD.

- [ ] **Step 1: Write the failing test**

Create `tests/content/meta-descriptions.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { aboutPageContent, hirePageContent, servicePages, servicesPageContent } from '@/lib/data'
import { buildRouteMetadata } from '@/lib/site-metadata'
import { routeFor, siteRoutes } from '@/lib/site-routes'

// S5 final review: /services*, /about, /hire and 11 of 20 project pages sent
// 160-371 character descriptions; Google cuts snippets near 155.
describe('meta descriptions', () => {
  const routes = siteRoutes()

  it('fit a snippet: 50 to 160 characters on every route', () => {
    expect(routes.length).toBeGreaterThanOrEqual(28)
    for (const r of routes) {
      expect(r.metaDescription.length, r.path).toBeGreaterThanOrEqual(50)
      expect(r.metaDescription.length, r.path).toBeLessThanOrEqual(160)
    }
  })

  it('are what the page’s metadata, Open Graph and Twitter tags send', () => {
    for (const r of routes) {
      const m = buildRouteMetadata(r.path)
      expect(m.description, r.path).toBe(r.metaDescription)
      expect((m.openGraph as { description?: string }).description, r.path).toBe(r.metaDescription)
    }
  })

  it('leave the long answers to the AI files, the chat prompt and the JSON-LD', () => {
    expect(routeFor('/about').description).toBe(aboutPageContent.answer)
    expect(routeFor('/hire').description).toBe(hirePageContent.answer)
    expect(routeFor('/services').description).toBe(servicesPageContent.answer)
    for (const s of servicePages) expect(routeFor(`/services/${s.slug}`).description).toBe(s.answer)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/content/meta-descriptions.test.ts`
Expected: FAIL: `r.metaDescription` is undefined (type-check also fails on `SiteRoute`).

- [ ] **Step 3: Types and the registry**

`types/index.ts`: in `Project`, after `description: string;` add

```ts
  /** The meta description when `description` runs past a search snippet (≤ 155 characters). */
  metaDescription?: string;
```

and add `  /** The meta description (≤ 155 characters); the answer stays for the AI files. */\n  metaDescription: string` to `ServicePage`, `ServicesPageContent`, `AboutPageContent` and `HirePageContent` (after `title`).

`lib/site-routes.ts`: in `SiteRoute`, after `description: string` add

```ts
  /** The <meta name="description">: a short line that fits a search snippet (≤ 160, held by a test). */
  metaDescription: string
```

and set it on every route:
- project: `metaDescription: p.metaDescription ?? (study ? study.brief[0] : p.description),`
- home: `metaDescription: heroContent.subheadline,`
- services: `metaDescription: servicesPageContent.metaDescription,`
- each service: `metaDescription: s.metaDescription,`
- hire: `metaDescription: hirePageContent.metaDescription,`
- about: `metaDescription: aboutPageContent.metaDescription,`
- projects: `metaDescription: projectsPageContent.description,`

`lib/site-metadata.ts`: in `buildSiteMetadata` replace the three `description: home.description,` with `description: home.metaDescription,`; in `routeMetadata` replace `const { description, path } = route` with `const { metaDescription: description, path } = route`.

`tests/content/page-metadata.test.ts`: replace `route.description` with `route.metaDescription` at lines 38, 42 and 49.

- [ ] **Step 4: The short lines (draft copy for Christian's review)**

Every line below is built only from the page's existing answer or the project's own description. In `lib/data.ts` add a `metaDescription` field, after `title`, to each page object, and after `description` to each project entry named by its `slug`:

| Where | `metaDescription` | Chars |
|---|---|---|
| `servicesPageContent` | `Full-stack web apps in Next.js and React, WordPress and WooCommerce sites with PayPal and Philippine gateways, and AI automation with n8n, LLMs and MCP.` | 152 |
| `servicePages` `full-stack-development` | `Full-stack developer in Naga City, Philippines, building web apps in Next.js, React, TypeScript and Supabase, for clients and for full-time remote roles.` | 153 |
| `servicePages` `wordpress-woocommerce` | `WordPress and WooCommerce developer in Naga City, Philippines: sites for hotels, tours and review centres, with PayPal, PayMongo, Maya and Xendit checkout.` | 155 |
| `servicePages` `ai-automation` | `AI automation engineer in Naga City, Philippines: a self-hosted n8n stack for Google Workspace and LLM workflows, and client WordPress sites run over MCP.` | 154 |
| `hirePageContent` | `Mid-level full-stack developer in Naga City, Philippines, open to full-time remote roles: Next.js, TypeScript, Supabase and WordPress, with tests and CI.` | 153 |
| `aboutPageContent` | `Web developer in Naga City, Bicol, who builds booking and payment sites for travel businesses and AI automation for teams. Studied at Bicol University.` | 151 |
| `iskotify` | `Scholarship and exam-prep platform for Filipino students: deadline reminders, AI flashcards for UPCAT, ACET and DCAT, and an AI study companion.` | 144 |
| `giya` | `Receipt-scanning rewards app for Philippine food and retail: customers scan the receipts they already get, earn points at partner venues, redeem rewards.` | 153 |
| `latag` | `Offline-first inventory and storefront tool for Philippine ukay-ukay resellers: catalogue every piece once, then share one link buyers can browse.` | 146 |
| `aman-group-web-app` | `Next.js app for Aman Group, a Naga City residential developer: a property showcase and a loan calculator for Pag-IBIG, bank and in-house financing.` | 147 |
| `skimcare` | `Android and web app that explains an agreement’s key terms in plain English or Filipino. Text recognition and a small language model run on the device.` | 151 |
| `lunad` | `Jeepney trip planner for Naga City commuters, with step-by-step guidance and saved trips. Unknown fares and routes are shown as unknown. Pre-launch.` | 148 |
| `el-nido-guide-ph` | `Multi-operator booking marketplace for El Nido tours and activities on WooCommerce and Dokan, with PayPal and Maya payments and printable invoices.` | 147 |
| `beachbus-palawan` | `Website and WooCommerce storefront for BeachBus, a hop-on, hop-off shuttle between the beaches of El Nido, Palawan: routes, timetable and passes.` | 145 |
| `acad1-review-center` | `Entrance-test review centre with nine branches across Luzon: programme tiers and schedules per branch, and online reservation with a Xendit downpayment.` | 152 |
| `aralabroad` | `Independent study-abroad guidance for Filipino students: visa steps, real costs in pesos, scholarships, and reviews of the agencies themselves.` | 143 |
| `naga-city-guide` | `WordPress directory and blog for Naga City and Camarines Sur: ten listing categories, a custom theme and plug-in, and free listings for businesses.` | 147 |

Write each as a single-quoted string; the SkimCare line's apostrophe is the typographic `’` (no escape needed). Above the `servicesPageContent` field add `// Short lines for search snippets (draft copy for Christian's review, S6); the answer stays the page's opening and the AI files' text.`

- [ ] **Step 5: Run the tests**

Run: `npx vitest run tests/content`
Expected: PASS, including `s5-surfaces` (no phone or street in the new lines), `site-routes`, `page-metadata`, `llms` and `chat-context` (unchanged: they read `description`).

- [ ] **Step 6: Gates and commit**

```bash
git add types/index.ts lib/data.ts lib/site-routes.ts lib/site-metadata.ts tests/content/meta-descriptions.test.ts tests/content/page-metadata.test.ts
git commit -m "feat(seo): meta descriptions that fit a search snippet on every route" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 14: Apply the finish-review findings

**Model:** Opus. Load `impeccable` (run its `context` once) and read `reference/craft-floor.md` and `reference/polish.md` before the first edit.

**Files:** exactly those named in `.superpowers/sdd/s6-task-14-brief.md`, which the controller writes from Task 1's findings after Tasks 2-13 land. Nothing outside it.

**Interfaces:**
- Consumes: `.superpowers/sdd/s6-finish-findings.md` (only findings called "fix in Task 14"), and every name produced by Tasks 2-13.
- Produces: one commit per finding group, each with its test.

- [ ] **Step 1: Re-check each finding against the current head**

For every finding id in the brief, open the route at the width and theme it names (the controller's server, `http://127.0.0.1:3100`, rebuilt keyless at the current head). Tasks 2-13 may have resolved it; mark those "resolved by Task N" in the brief and skip them.

- [ ] **Step 2: For each remaining finding group, write the failing test**

A markup assertion in the test file that already covers that component (`tests/components/<name>.test.tsx`), or a rule assertion through `parseCssRules` in `tests/design/s6-finish.test.ts` for CSS. A finding that only a browser can see (for example optical alignment) gets no test; the brief says so and the controller's look is its check.

- [ ] **Step 3: Run it to verify it fails, implement the brief's one-sentence fix, run it to verify it passes**

Run: `npx vitest run <the test file>` before and after.

- [ ] **Step 4: Gates and commit per group**

```bash
git add <the brief's files for this group>
git commit -m "style(<scope>): <the finding in a few words> (S6 finish F<n>)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 5: Report**

List each finding id with: commit, resolved by Task N, or left (with why). Anything that turns out to be copy goes to the hand-off list, not into `lib/data.ts`.

---

### Task 15: DESIGN.md, PRODUCT.md, CLAUDE.md, README

**Model:** Opus. Load `impeccable` and follow `reference/document.md` in scan mode for `DESIGN.md` (auto-extract tokens from `app/globals.css`, `tailwind.config.js` and the components; the qualitative language comes from the direction contract and the spec, not from a question to Christian).

**Files:**
- Rewrite: `DESIGN.md`
- Modify: `PRODUCT.md`, `CLAUDE.md`, `README.md`, `.impeccable/surfaces/app-page-tsx.md`
- Modify tests: `tests/design/s6-finish.test.ts` (append)

**Interfaces:**
- Consumes: every name above.
- Produces: docs that match the code at this head.

- [ ] **Step 1: Write the failing docs test**

Append to `tests/design/s6-finish.test.ts` (add `import { FLAGSHIP_SLUGS } from '@/lib/case-studies'` and `import { projects } from '@/lib/data'` at the top):

```ts
describe('the docs describe the trail map that shipped', () => {
  it('DESIGN.md is the Isarog Trail Map, written from the code', () => {
    const doc = readFileSync('DESIGN.md', 'utf8')
    for (const name of ['Isarog Trail Map', '--trail', '--contour', 'survey-plate', 'legend-glass', 'Archivo', 'font-stretch', 'plate-rise', 'map-pin__mark', 'trailhead-contours', 'SHOT_ASPECT', 'app/og/']) {
      expect(doc, name).toContain(name)
    }
    expect(doc).not.toMatch(/Lobby Rack|--accent|accent-plane|on-accent|edge-code|opengraph-image|on-plane|postcard|lagoon|amber/i)
  })

  it('PRODUCT.md counts the inventory the data holds', () => {
    const doc = readFileSync('PRODUCT.md', 'utf8')
    const own = projects.filter((p) => p.band === 'Products').length
    expect(doc).toContain(`${projects.length} projects`)
    expect(doc).toContain(`${own} own products`)
    expect(doc).toContain(`${FLAGSHIP_SLUGS.length} case studies`)
    expect(doc).toContain('/services')
    expect(doc).toContain('/hire')
    expect(doc).not.toMatch(/\b15 projects\b|three products|Portfolio 4\.0 redesign is built/)
  })

  it('CLAUDE.md drops the amber and the 4.0 utilities and names the S6 pieces', () => {
    const doc = readFileSync('CLAUDE.md', 'utf8')
    expect(doc).not.toMatch(/accent-plane|on-accent|Two ambers|edge-code|removed in S6|Lobby Rack|\.reveal(?![\w-])|lagoon|plain Arial|adjustFontFallback: false/)
    for (const name of ['plate-rise', 'map-pin__mark', 'trailhead-contours', 's6-finish', 's6-motion', 'metaDescription', 'SHOT_ASPECT', 'MapKey', 'adjustFontFallback: true']) {
      expect(doc, name).toContain(name)
    }
  })

  it('the direction contract no longer lists S6 work as unresolved', () => {
    expect(readFileSync('.impeccable/surfaces/app-page-tsx.md', 'utf8')).not.toMatch(/Unresolved: the contour pointer shift/)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/design/s6-finish.test.ts -t docs`
Expected: FAIL: DESIGN.md opens "Christian Raro, Portfolio 4.0 … Lobby Rack"; PRODUCT.md says 15 projects; CLAUDE.md has "Two ambers".

- [ ] **Step 3: DESIGN.md (impeccable document, scan mode)**

Replace the whole file. Frontmatter: `name: Christian Raro, Portfolio 5.0`; `description:` the contract's THESIS sentence; `colors:` every `:root` token as `oklch(L C H)` with a `-night` twin from `.dark` (bg, panel, ink, muted, muted-strong, line, line-strong, contour, trail, on-trail, field-border, live, status-early, status-private, status-internal); `typography:` display (`.text-display`), section (`.text-section`), page-h1, title, lede, body, map-label, eyebrow (hero only), each with Archivo, size, weight, line-height, tracking and `font-stretch`; `rounded:` sm, md, DEFAULT, xl from `tailwind.config.js`; `components:` button-primary (trail / on-trail), button-secondary (ink outline), survey-plate, legend-glass. Body, in the document reference's order: Overview (the thesis, the two themes from the use scene, the three verbs), Colors (trail red's rule; green means live; ink for focus-adjacent states; selection and caret), Typography (one family on its width axis; `font-stretch` everywhere; the display fallback and the size-adjusted body fallback), Layout (`SECTION`, section rhythm, `SHOT_ASPECT`, phone pacing), Elevation & Depth (none at rest, `shadow-lift` on a pseudo-element, `shadow-overlay`, ink-hued), Shapes, Components (legend, buttons, `SurveyPlate`, `ProjectPlate`, `StatusBadge`, `TrailLink`, the field map with `MapKey` and counter-scaled pins (`map-pin__mark`), the fork's split, the journals' open cover and shelf, `PlanTheRoute`, the link-preview card in `app/og/`), Motion (draw, rise, pan; the trailhead under 2 s; `trailhead-contours`; `plate-rise`; trail segments; the elevation marker; view transitions; the map pan; reduced motion), Do's and Don'ts (from the craft floor and the Global Constraints: no eyebrow over a section heading, no big-number row, no identical card grids, trail red only on the primary action and the current position). Every value comes from the code at this head.

- [ ] **Step 4: PRODUCT.md**

Edit in place:
- Users: replace the Primary/Secondary pair with "**Freelance clients and engineering hiring managers, equally** (spec §2)": keep the client description, and describe hiring managers as evaluating him for full-time remote full-stack roles.
- Positioning: replace "**three products of his own** (Iskotify, Giya, Latag)" with "**4 own products** (Iskotify, Giya, Latag, Connecta PH)"; keep the rest.
- Operating Context: replace the last bullet with "Deployed on Vercel from `main`. Portfolio 5.0 (Isarog Trail Map) is built on the `v5` branch, with a Vercel preview for every push; it merges after Christian signs off a preview."
- Capabilities and Constraints: replace the Surfaces bullet with: the homepage; `/projects`, map and list views of 20 projects in four bands with the `?band=` filter; a page per project, the 6 case studies as trail journals and the rest as short pages; `/services` with three service pages (full-stack development, WordPress and WooCommerce, AI automation); `/about`; `/hire`; the "Off the trail" 404; `/llms.txt` and `/llms-full.txt`. Write the counts as "20 projects", "6 case studies".
- Evidence on Hand: "20 projects" (state how many have live URLs by counting `links.live` in `lib/data.ts`), "6 case studies in `lib/case-studies.ts`".

- [ ] **Step 5: CLAUDE.md**

Replace the Styling section's bullets from "- Visual authority is `DESIGN.md` (Lobby Rack…" through "- **Green (`live`) means a live system and nothing else.** …enforces it." with:

```text
- Visual authority is `DESIGN.md` (Isarog Trail Map, written from the built site), with
  the homepage's direction contract and motion choreography in
  `.impeccable/surfaces/app-page-tsx.md`. Read both before UI work.
- The world: survey paper (pale green-grey by day, dark field paper by night),
  near-black ink, olive contour linework, and one trail red. No gradients, glows
  or tints. Paper is square-ish (`--radius` 6px; buttons 2px, dialog 10px).
- Colours are raw oklch `L C H` triplets in `app/globals.css`: `:root` is the
  day theme and the default, `.dark` the night theme, one per line.
  `tests/design/contrast.test.ts` parses them and checks WCAG contrast in both
  themes; keep the format exact.
- Tailwind colour keys: `canvas` (page, CSS `--bg`), `panel`, `ink`, `muted`,
  `muted-strong`, `line`, `line-strong`, `contour`, `trail`, `on-trail`,
  `field-border`, `live`, `status-early`, `status-private`, `status-internal`.
  Never raw hex, never `dark:` colour pairs. Text fields draw their border in
  `field-border` (3:1, WCAG 1.4.11), never a hairline token. There is no
  `accent` key any more (`tests/design/s6-finish.test.ts`).
- **Trail red (`trail`) marks the primary action and the current position only:**
  `.button-primary`, the chat's send button, the trail strokes, the elevation
  marker, the legend's current-page underline, the 404's dot, the focus ring
  and the caret (where the keyboard is). Hover and focus borders are `ink`;
  selection is `ink` with `bg` text; the brand mark is an ink plane.
- **One primary button:** `.button-primary` (with `.press` for the hover lift),
  defined once in `globals.css`: a trail-red fill with `on-trail` text, beside
  the ink-outline `.button-secondary`. Never compose a primary from a fill and
  padding; `tests/design/primary-button.test.ts` enforces it.
- **Green (`live`) means a live system and nothing else.** The chat
  assistant's status dot is `ink`. `live` and `.live-pulse` appear only in
  `StatusBadge`; `tests/design/green-means-live.test.ts` enforces it.
```

In the Type bullet replace "Body text falls back to plain Arial (`adjustFontFallback: false`)." with "Body text falls back to Arial sized to Archivo's metrics (`adjustFontFallback: true`), so the swap re-wraps nothing. Every width is set with `font-stretch`, never `font-variation-settings: 'wdth'`."

Replace the Section headings bullet with: "- Section headings: `SectionHeading` (`components/ui/section-heading.tsx`), one `<h2 className=\"text-section\">` with copy from `lib/data.ts`. No eyebrow over a section heading (the craft floor bans it); the hero keeps the spec's eyebrow, and page eyebrows above an h1 name where you are."

In the One grid bullet add: "Every screenshot frame and no-preview frame uses `SHOT_ASPECT` (`components/ui/project-shot.tsx`: 4:3 below 640px, 3:4 from it)."

Replace the Shadows bullet's "a card or postcard is lifted (on a card," with "a plate is lifted (on a plate,", and add "ink-hued in both themes" after `shadow-overlay`.

In Animation, replace the opening paragraph with:

```text
Three verbs only (spec §4): *draw* (trails, contours and routes stroke in),
*rise* (lines and plates lift into place, once), *pan* (the map and the page
glide to a waypoint). Screenshots are stills: nothing about a screenshot is
scrubbed by scroll; a plate rises once as it enters. The choreography is in
`DESIGN.md` (Motion) and the direction contract.
```

Replace the "Scroll-driven reveals" bullet's `(`.reveal`, `.reveal-cover`)` with `(`.reveal-cover`, the journal rows)`. After the Trailhead bullet add:

```text
- **Contour shift (`.trailhead-contours`):** under `(hover: hover) and
  (pointer: fine)` and no-preference only, the hero contours drift 8px toward
  the half the pointer rests on (`.trailhead:has(.trailhead-copy:hover)` /
  `:has(.trailhead-plate:hover)`), on `--dur-crawl`. CSS only; nothing on touch;
  the trail does not move (`tests/design/s6-motion.test.ts`).
- **Plates appear once (`.plate-rise`):** every `/projects` plate, own-product
  plate and case-study shot rises its last 16px once on a scroll trigger
  (`timeline-trigger` + `animation-trigger: play-forwards`) inside
  `@supports (timeline-trigger: --plate view())` and no-preference; nothing is
  filled before it fires; without support, plates sit at rest (`s6-motion`).
```

Replace the Catalog hover bullet's "border to `accent`" with "border to `ink`" and "Keyboard focus gets the accent border" with "Keyboard focus gets the ink border". In the Map pan bullet add: "Pins counter-scale (`.map-pin__mark`, `scale(calc(1 / var(--pan-s, 1)))` about each pin's point), so a pan zooms the map, not the labels; `MapKey` names the dot (town or city) and the ring (region) in both map captions." In "Nothing moves for more than five seconds", replace "No count-ups, parallax or continuous animation." with "No count-ups, scroll parallax or continuous animation." In Reduced motion, replace "(colour, the accent border and underlines still change, instantly)" with "(colour, the ink border and underlines still change, instantly)" and add "the contour shift, the plate rise and the pins' glide are off" after "the trailhead sequence".

In Testing, replace "early-access violet at least 90 degrees of hue from amber" with "early-access violet at least 90 degrees of hue from trail red" if `contrast.test.ts` measures against `--trail` (read it; otherwise keep the test's own words and only drop "amber"); replace "plain Arial font fallbacks" with "the size-adjusted Arial body fallback, the portrait at quality 70"; replace "accent border" in the `plate-motion` bullet with "ink border"; replace "every screenshot 3:4" with "every screenshot frame `SHOT_ASPECT`"; replace "use no 4.0 amber, `edge-code` or creases" with "use no 4.0 classes"; and add a bullet:

```text
- `s6-finish` (no `accent` token, key or utility; no `.edge-code`, `.reveal` or 4.0 width setting; no Lobby Rack, amber or rack words in the source; browser surfaces in the trail palette; the launcher clear of the footer; `SHOT_ASPECT`; no eyebrow on a section heading; these docs), `s6-motion` (the line-by-line rise, the contour shift, plates that appear once), `meta-descriptions` (every route 50-160 characters through `metaDescription`; the long answers stay for the AI files)
```

In Content Changes, after the `lib/site-routes.ts` paragraph add: "A page whose answer or description runs past a search snippet sets `metaDescription` (≤ 155 characters; `tests/content/meta-descriptions.test.ts` caps every route at 160). Only the metadata reads it; the AI files, the chat prompt and the JSON-LD keep the long answer."

In Project Structure, add `components/map/map-key.tsx` to the `components/map/` line and `lib/og-linework.ts  The link-preview card's contours, trail and text column (kept right of the words)` after the `app/og/` line.

- [ ] **Step 6: README.md and the contract**

`README.md`: in Project Structure, Styling and Motion, apply the same facts (Isarog Trail Map, no accent, `SHOT_ASPECT`, `plate-rise`, the contour shift, `MapKey`, `lib/og-linework.ts`, `metaDescription`); in Testing, add `s6-finish`, `s6-motion`, `meta-descriptions`.

`.impeccable/surfaces/app-page-tsx.md`: replace the line `Unresolved: the contour pointer shift and screenshot appear-once land in S6.` with `Resolved in S6: the contour pointer shift (.trailhead-contours) and screenshot appear-once (.plate-rise).`, and in the motion choreography add two bullets matching CLAUDE.md's contour-shift and plate-rise lines.

- [ ] **Step 7: Run the tests, gates and commit**

Run: `npm test`, then the four gates.

```bash
git add DESIGN.md PRODUCT.md CLAUDE.md README.md .impeccable/surfaces/app-page-tsx.md tests/design/s6-finish.test.ts
git commit -m "docs(design): DESIGN.md for the Isarog Trail Map; product, claude.md and readme to match" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push origin v5
```

---

### Task 16: Reduced-motion pass, Lighthouse, preview

**Model:** the controller.

**Files:**
- Create: `.superpowers/sdd/s6-lighthouse.md` (gitignored)

- [ ] **Step 1: Build and serve keyless**

```bash
RESEND_API_KEY= GROQ_API_KEY= npm run build
RESEND_API_KEY= GROQ_API_KEY= npx next start -p 3100
```

- [ ] **Step 2: Reduced-motion pass**

Emulate `prefers-reduced-motion: reduce` and walk `/`, `/projects`, `/projects?band=Sites`, `/projects/el-nido-guide-ph`, `/services/wordpress-woocommerce`, `/about`, `/hire`, 404. Pass when: the headline lines, lede and buttons are in place at first paint; the trail and every segment are fully drawn; the elevation marker rests at now; hovering the hero moves no contour; no plate rises; a filter change neither glides nor pans (the map jumps to its pan, pins already counter-scaled); a project click navigates without a morph; hover changes colour and underline only; the live pulse is gone; dialogs fade only. Any motion is a finding fixed before Step 5.

- [ ] **Step 3: Lighthouse at 1440 and 390 on every route type**

Mobile (390 wide, Slow 4G, CPU ×4) and desktop (1440) on `/`, `/projects`, `/projects/el-nido-guide-ph` (case study), `/projects/latag` (short page), `/services`, `/services/wordpress-woocommerce`, `/about`, `/hire` and `/no-such-trail` (snapshot mode). Bars: Accessibility, Best Practices, SEO 100; no failed `target-size`; CLS ≤ 0.02 on `/` and `/about` throttled; TBT no more than 50ms above the S2 baseline; LCP on `/` reported beside S2's 5.7s. Also run the target-size audit at 1024 and 1280 desktop widths. Record every score and failed audit in `.superpowers/sdd/s6-lighthouse.md`.

- [ ] **Step 4: Heights, themes and the card**

At 390, record page heights: `/projects` (≤ 11,500), `/services/wordpress-woocommerce` (≤ 8,200), the homepage field map section (≤ 1,700). At 1440 and 390, day and night, look at every route: no x-overflow, focus ring and selection in the trail palette, the brand mark ink. Fetch `/og` and two route cards once more. A miss on a target is a finding: the controller decides fix-now or carry and logs it.

- [ ] **Step 5: Final review and preview**

Dispatch the sprint's final review (Opus) over `66751b6..HEAD` with the findings file and `s6-lighthouse.md`; apply its fix-before-merge items. Push `v5`, take the Vercel preview URL, and send Christian: the preview URL, the open questions above, the copy hand-off list, and the Lighthouse table. **Merge to `main` only after Christian signs off the preview.** Then log the sprint (`log_to_daily.py`) and refresh the KOS `handoff.md`.

---

## Self-review against the brief and the spec

- **Master plan S6 scope:** hero contour pointer shift (Task 11, decision 2), line-by-line rise (shipped; decision 1, re-asserted in `s6-motion`), screenshot appear-once (Task 11, decision 3); Lighthouse at 1440 and 390 (Task 16); a reduced-motion pass (Task 16 Step 2); `--accent*` aliases and every 4.0 utility removed with a guard that none remain (Tasks 2 and 3, `s6-finish`); impeccable finish review (Task 1); `DESIGN.md` via the documenter, `CLAUDE.md` and `PRODUCT.md` updated (Task 15); merge only after sign-off (Task 16 Step 5).
- **Carries:** 1 font and CLS, portrait quality (Task 4). 2 pacing with numeric targets (Task 6, decision 9, measured in Task 16). 3 eyebrows, big-number row, fork and journals grids, each with one line of design reasoning (Tasks 7, 8, 9). 4 aliases, Tailwind keys, `.edge-code`, shadows, stale comments, guard, `ImageLightbox` and `StatusBadge` off accent and edge-code (Tasks 2, 3). 5 motion, with the rules kept in CLAUDE.md (Tasks 11, 15). 6 pins counter-scaled, ring-vs-dot key (Task 10). 7 launcher over the footer: still true from 1024 to about 1215px, fixed (Task 5), verified by Lighthouse (Task 16). 8 card linework and word gap (Task 12). 9 meta descriptions with a 160 test, drafts verbatim and marked (Task 13). 10 copy notes in the hand-off. 11 docs (Task 15). 12 controller's last task (Task 16).
- **Fixed constraints:** client components stay 8 (CSS-only pointer shift; `MapKey` and the fork split are server markup); trail red only on primary actions and the current position (decision 4; focus ring and caret recorded as the current position, open question 3); green only in `StatusBadge` (untouched); no phone, street or fabricated metric (the new copy is drawn from existing words; `s5-surfaces` runs over it); content at full opacity (every new motion is transform only and gated); `\b` written as backslash-b with a grep after each test file.
- **Placeholder scan:** every code step carries the code or the exact old and new text. Task 14 is bounded by a file the controller writes from Task 1 (the brief's requirement); Task 11 Step 4's `project-screenshots.tsx` edit names the element rule rather than a line, because that file's plate markup was not part of the planner's read; the implementer reads it and the `s6-motion` test checks the class is present.
- **Type consistency:** `SHOT_ASPECT` (Task 6) is the name Tasks 14 and 15 and the docs test use; `MapKey`, `sectionContent.fieldMap.key.{city,region}`, `.map-pin__mark` (Task 10); `trailhead-contours`, `trailhead-plate`, `plate-rise`, `--plate` (Task 11); `PAD_X`, `TEXT_WIDTH`, `CONTOURS`, `TRAIL`, `HERE.r` (Task 12); `metaDescription` on `Project`, `ServicePage`, `ServicesPageContent`, `AboutPageContent`, `HirePageContent` and `SiteRoute` (Task 13); `SectionCopy = { title }` and `SectionHeading({ id, title, className })` (Task 7), spelled the same in every task and in Task 15's docs test.

## Deferred past S6

- SoftwareApplication `applicationCategory` / `operatingSystem` (needs Christian's facts per project; a guess is a fabricated claim).
- Sitemap `lastModified` from `pagesUpdated`, once pages carry real edit dates.
- A night-theme link-preview card, if Christian prefers it.
- Redrawing the brand mark for the trail map (open question 2).
