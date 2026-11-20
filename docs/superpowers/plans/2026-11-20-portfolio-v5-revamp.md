# Portfolio 5.0 (Isarog Trail Map) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio in the Isarog Trail Map world (spec: `docs/superpowers/specs/2026-11-20-portfolio-v5-revamp-design.md`) on branch `v5`, sprint by sprint, keeping the site building and the tests green after every task.

**Architecture:** Rebuild in place. Data modules, API routes, Chunks, live previews and content tests stay; tokens, fonts, chrome, sections and pages are replaced sprint by sprint. Between sprints the old Portfolio 4.0 sections keep rendering on transitional token aliases, removed in S6.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5 (strict), Tailwind CSS 3, `motion` (`motion/react`), next-themes, `next/font/google` (Archivo), Vitest.

## How this plan is organised

Six sprints. S1 is written out task by task below. S2 to S6 are scoped here
(files, interfaces, done criteria); each gets its own detailed plan file,
`docs/superpowers/plans/2026-11-20-portfolio-v5-s<N>.md`, written at the start
of that sprint against the names S1 actually shipped. Writing their code now
would mean guessing the names they depend on.

## Global Constraints

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

## Sprint map

| Sprint | Model | Detailed plan | Done when |
|---|---|---|---|
| S1 Foundation | Opus | this file | New tokens, Archivo, legend navigation, survey footer, trail and contour primitives, primary and secondary buttons, rewritten design tests; old sections still render. |
| S2 Homepage | Opus | `…-s2.md` | `/` is the seven-section trail page from spec §5; old homepage sections deleted. |
| S3 Projects | Sonnet | `…-s3.md` | `/projects` map and list with band filter and view-transition pan; `/projects/[slug]` and case studies rebuilt; live preview kept. |
| S4 New pages | Sonnet | `…-s4.md` | `/services` and three service pages, `/about`, `/hire`, 404, with nav items added. |
| S5 SEO, GEO, AIEO | Sonnet | `…-s5.md` | Per-route metadata, entity JSON-LD, robots, sitemap, llms files, OG card, content tests. |
| S6 Finish | Opus | `…-s6.md` | Motion polish, performance, accessibility, aliases removed, impeccable finish review, `DESIGN.md`, `CLAUDE.md`, `PRODUCT.md`. |

### File map across sprints

- **S1** creates `components/site-legend.tsx`, `components/map/contour-field.tsx`, `components/map/trail-path.tsx`, `lib/contours.ts`, `tests/design/trail-motion.test.ts`, `tests/components/chrome.test.tsx`; modifies `app/globals.css`, `tailwind.config.js`, `app/layout.tsx`, `components/footer.tsx`, `lib/motion-tokens.ts`, `lib/data.ts`, and the design tests listed in its tasks; deletes `components/top-bar.tsx`, `app/fonts/anybody-latin-wght400-800-wdth75-100.woff2`.
- **S2** creates `components/sections/trailhead.tsx`, `elevation-strip.tsx`, `fork.tsx`, `field-map.tsx`, `own-products.tsx`, `trail-journals.tsx`, `plan-the-route.tsx`, `components/map/philippines-outline.tsx`; adds `place` to `Project`; deletes the Portfolio 4.0 homepage sections and their tests.
- **S3** rewrites `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`, `components/case-study/*`; creates `components/ui/survey-plate.tsx`, `components/ui/legend-filter.tsx`; adapts `components/ui/view-transitions.tsx` and `lib/view-transition.ts`.
- **S4** creates `app/services/page.tsx`, `app/services/[slug]/page.tsx`, `app/about/page.tsx`, `app/hire/page.tsx`; rewrites `app/not-found.tsx`; adds `servicePages`, `aboutPageContent`, `hirePageContent` to `lib/data.ts`.
- **S5** modifies `lib/site-metadata.ts`, `lib/structured-data.ts`, `lib/llms.ts`, `app/robots.ts`, `app/sitemap.ts`, `app/opengraph-image.tsx`, `lib/og-palette.ts`.
- **S6** removes the transitional aliases and Portfolio 4.0 utilities from `app/globals.css`; writes `DESIGN.md` via the impeccable documenter; updates `CLAUDE.md`, `PRODUCT.md`, `.impeccable/surfaces/app-page-tsx.md`.

### Interfaces S1 hands to later sprints

- Tailwind colour keys: `canvas`, `panel`, `ink`, `muted`, `muted-strong`, `line`, `line-strong`, `contour`, `trail`, `on-trail`, `field-border`, `live`, `status-early`, `status-private`, `status-internal`. Transitional (removed in S6): `accent`, `accent-plane`, `on-accent`.
- Font: one family, Archivo, exposed as `--font-sans`; `--font-display` aliases it. Utilities: `.text-display` (condensed uppercase display), `.map-label` (condensed uppercase small label), `.eyebrow` (kept name, new style), `.tabular`.
- Buttons: `.button-primary` (trail fill, `on-trail` text), `.button-secondary` (ink outline). Both combine with `.press`.
- `<ContourField paths={string[]} viewBox={string} className?={string} />` server component, decorative SVG, `aria-hidden`.
- `<TrailPath d={string} viewBox={string} className?={string} />` server component; its path carries `pathLength="1"` and class `trail-draw`.
- `lib/contours.ts` exports `trailheadContours: string[]` and `trailheadTrail: { d: string; viewBox: string }`.
- Motion tokens: `motionTokens.duration.draw` (1.6) mirrored as `--dur-draw: 1.6s`; `--stagger-line: 70ms`.
- `<SiteLegend />` client component (replaces `TopBar`); `<Footer />` server component reading `footerContent.base: { place: string; coordinates: string }`.

---

## Sprint 1: Foundation

### Task 1: Isarog colour tokens and the contrast test

**Files:**
- Modify: `app/globals.css` (the `:root` and `.dark` blocks, lines 1-70)
- Modify: `tailwind.config.js` (`theme.extend.colors`)
- Modify: `app/layout.tsx` (`defaultTheme`)
- Rewrite: `tests/design/contrast.test.ts`
- Modify: `tests/design/og-palette.test.ts` (skip until S5)

**Interfaces:**
- Produces: the colour keys and CSS variables listed under "Interfaces S1 hands to later sprints".

- [ ] **Step 1: Rewrite the contrast test for the new palette**

Replace the whole of `tests/design/contrast.test.ts` with:

```ts
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Isarog Trail Map tokens: raw oklch "L C H" triplets, one per line, in
// app/globals.css. :root is the day survey (default), .dark the night survey.
const CSS = readFileSync('app/globals.css', 'utf8')

const TOKENS = [
  'bg', 'panel', 'ink', 'muted', 'muted-strong', 'line', 'line-strong', 'contour',
  'trail', 'on-trail', 'field-border', 'live', 'status-early', 'status-private', 'status-internal',
] as const
type Token = (typeof TOKENS)[number]
type Triplet = [number, number, number]

function block(selector: string): string {
  const start = CSS.indexOf(`${selector} {`)
  if (start === -1) throw new Error(`No "${selector} {" block in app/globals.css`)
  return CSS.slice(start, CSS.indexOf('}', start))
}

function readTheme(selector: string): Record<Token, Triplet> {
  const body = block(selector)
  const theme = {} as Record<Token, Triplet>
  for (const token of TOKENS) {
    const match = body.match(new RegExp(`(?<![\\w-])--${token}:\\s*([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+)\\s*;`))
    if (!match) throw new Error(`--${token} is missing or not an "L C H" triplet in ${selector}`)
    theme[token] = [Number(match[1]), Number(match[2]), Number(match[3])]
  }
  return theme
}

function luminance([L, C, H]: Triplet): number {
  const a = C * Math.cos((H * Math.PI) / 180)
  const b = C * Math.sin((H * Math.PI) / 180)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  const clamp = (v: number) => Math.min(1, Math.max(0, v))
  const R = clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)
  const G = clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)
  const B = clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

function contrast(x: Triplet, y: Triplet): number {
  const [hi, lo] = [luminance(x), luminance(y)].sort((p, q) => q - p)
  return (hi + 0.05) / (lo + 0.05)
}

// WCAG 1.4.3: text 4.5:1. Trail red is text too (links, the active label).
const TEXT_PAIRS: [Token, Token][] = [
  ['ink', 'bg'], ['ink', 'panel'],
  ['muted', 'bg'], ['muted', 'panel'],
  ['muted-strong', 'bg'], ['muted-strong', 'panel'],
  ['trail', 'bg'], ['trail', 'panel'],
  ['on-trail', 'trail'],
]

// WCAG 1.4.11: status glyphs, field borders and the focus ring 3:1.
const UI_PAIRS: [Token, Token][] = [
  ['live', 'bg'], ['live', 'panel'],
  ['status-early', 'bg'], ['status-early', 'panel'],
  ['status-private', 'bg'], ['status-private', 'panel'],
  ['status-internal', 'bg'], ['status-internal', 'panel'],
  ['field-border', 'bg'], ['field-border', 'panel'],
  ['trail', 'bg'],
]

describe.each([
  ['day survey', ':root'],
  ['night survey', '.dark'],
])('%s palette', (_name, selector) => {
  const theme = readTheme(selector)

  it.each(TEXT_PAIRS)('%s on %s holds 4.5:1', (fg, bg) => {
    expect(contrast(theme[fg], theme[bg])).toBeGreaterThanOrEqual(4.5)
  })

  it.each(UI_PAIRS)('%s against %s holds 3:1', (fg, bg) => {
    expect(contrast(theme[fg], theme[bg])).toBeGreaterThanOrEqual(3)
  })

  it('draws contours visibly but quieter than text', () => {
    const c = contrast(theme.contour, theme.bg)
    expect(c).toBeGreaterThanOrEqual(1.5)
    expect(c).toBeLessThan(contrast(theme.muted, theme.bg))
  })

  it('keeps the early-access violet at least 90 degrees of hue from trail red', () => {
    const d = Math.abs(theme['status-early'][2] - theme.trail[2]) % 360
    expect(Math.min(d, 360 - d)).toBeGreaterThanOrEqual(90)
  })
})

describe('theme default', () => {
  it('opens on the day survey', () => {
    expect(readFileSync('app/layout.tsx', 'utf8')).toContain('defaultTheme="light"')
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/design/contrast.test.ts`
Expected: FAIL with `--contour is missing or not an "L C H" triplet in :root`.

- [ ] **Step 3: Replace the colour tokens**

In `app/globals.css`, replace the header comment above `:root` and the colour lines of the `:root` and `.dark` blocks. Keep the `--dur-*`, `--ease-*`, `--stagger-card`, `--radius` and `--shadow-*` lines as they are. The result:

```css
/*
 * Design tokens: Isarog Trail Map (Portfolio 5.0). See
 * docs/superpowers/specs/2026-11-20-portfolio-v5-revamp-design.md §3.
 *
 * Each colour is a raw oklch "L C H" triplet, one per line, so Tailwind can wrap
 * it as oklch(var(--x) / <alpha-value>). tests/design/contrast.test.ts parses
 * these lines; keep the format exact.
 *
 * :root is the day survey and the default theme; .dark is the night survey.
 * Trail red marks the primary action and the current position only.
 * Green (--live) means a live system and nothing else.
 */
:root {
	/* …motion tokens unchanged… */
	--bg: 0.9450 0.0150 125;
	--panel: 0.9900 0.0040 120;
	--ink: 0.2300 0.0200 130;
	--muted: 0.4700 0.0250 128;
	--muted-strong: 0.3700 0.0250 128;
	--line: 0.8700 0.0200 125;
	--line-strong: 0.7800 0.0250 125;
	--contour: 0.6600 0.0600 115;
	--trail: 0.5000 0.1900 30;
	--on-trail: 0.9900 0.0040 120;
	--field-border: 0.5800 0.0300 125;
	--live: 0.5200 0.1400 152;
	--status-early: 0.5200 0.1600 285;
	--status-private: 0.5400 0.0250 128;
	--status-internal: 0.5400 0.0250 128;
	/* Transitional aliases for Portfolio 4.0 sections still on the page; removed in S6. */
	--accent: var(--trail);
	--accent-plane: var(--trail);
	--on-accent: var(--on-trail);
	/* …--radius and --shadow-* unchanged… */
}

.dark {
	--bg: 0.2100 0.0180 135;
	--panel: 0.2600 0.0200 135;
	--ink: 0.9500 0.0120 120;
	--muted: 0.7200 0.0250 125;
	--muted-strong: 0.8400 0.0200 122;
	--line: 0.3300 0.0220 135;
	--line-strong: 0.4200 0.0250 135;
	--contour: 0.4600 0.0500 120;
	--trail: 0.6800 0.1800 32;
	--on-trail: 0.1800 0.0180 135;
	--field-border: 0.5600 0.0300 130;
	--live: 0.8000 0.1500 152;
	--status-early: 0.7600 0.1200 285;
	--status-private: 0.6400 0.0250 125;
	--status-internal: 0.6400 0.0250 125;
}
```

Delete the old `--accent`, `--accent-plane` and `--on-accent` triplet lines from `.dark`. The aliases in `:root` resolve on `<html>`, the element carrying both `:root` and `.dark`, so they follow the theme.

- [ ] **Step 4: Add the Tailwind keys**

In `tailwind.config.js`, replace the `colors` object with:

```js
      colors: {
        canvas: token('bg'),
        panel: token('panel'),
        ink: token('ink'),
        muted: token('muted'),
        'muted-strong': token('muted-strong'),
        line: token('line'),
        'line-strong': token('line-strong'),
        contour: token('contour'),
        // Trail red: the primary action and the current position only.
        trail: token('trail'),
        'on-trail': token('on-trail'),
        'field-border': token('field-border'),
        live: token('live'),
        'status-early': token('status-early'),
        'status-private': token('status-private'),
        'status-internal': token('status-internal'),
        // Transitional (Portfolio 4.0 sections); removed in S6.
        accent: token('accent'),
        'accent-plane': token('accent-plane'),
        'on-accent': token('on-accent'),
      },
```

- [ ] **Step 5: Make the day survey the default theme**

In `app/layout.tsx` change `<ThemeProvider attribute="class" defaultTheme="dark">` to `<ThemeProvider attribute="class" defaultTheme="light">`.

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run tests/design/contrast.test.ts`
Expected: PASS. If a pair fails, move that token's `L` by 0.02 at a time (darker text in the day theme, lighter in the night theme) and rerun; never change the test's thresholds.

- [ ] **Step 7: Run the full suite and fix fallout**

Run: `npm test`
Expected: only tests that assert Portfolio 4.0 palette facts fail. For `tests/design/og-palette.test.ts`, change its top-level `describe(` to `describe.skip(` with the comment `// Re-enabled in S5 when the OG card moves to the trail palette.` Any other failure is a real regression: fix it before committing.

- [ ] **Step 8: Commit**

```bash
git add app/globals.css tailwind.config.js app/layout.tsx tests/design/contrast.test.ts tests/design/og-palette.test.ts
git commit -m "feat(design): Isarog Trail Map colour tokens, day survey by default"
```

### Task 2: Archivo as the single family, and the type utilities

**Files:**
- Modify: `app/layout.tsx` (font imports and `<html>` className)
- Modify: `tailwind.config.js` (`fontFamily`)
- Modify: `app/globals.css` (utilities inside `@layer components`, starting at line 133; `.eyebrow` at line 196)
- Delete: `app/fonts/anybody-latin-wght400-800-wdth75-100.woff2`
- Modify: `tests/design/performance.test.ts` (`first layout` and `display font` blocks)
- Modify: `tests/design/type-scale.test.ts`

**Interfaces:**
- Produces: `--font-sans` (Archivo), `--font-display` alias, utilities `.text-display`, `.map-label`, `.eyebrow`, `.tabular`.

- [ ] **Step 1: Rewrite the font tests**

In `tests/design/performance.test.ts`, replace the test `falls back to plain Arial, not a metric-adjusted local() face per weight and size` with:

```ts
  it('falls back to plain Arial, not a metric-adjusted local() face', () => {
    const layout = readFileSync('app/layout.tsx', 'utf8')
    expect(layout.match(/adjustFontFallback: false/g)).toHaveLength(1)
  })
```

and replace the whole `describe('display font', …)` block with:

```ts
describe('type family', () => {
  // One variable family on its width axis: condensed for display and map
  // labels, normal width for reading. Anybody and Figtree are retired.
  it('loads Archivo with its wdth axis and nothing else', () => {
    const layout = readFileSync('app/layout.tsx', 'utf8')
    expect(layout).toMatch(/import \{ Archivo \} from 'next\/font\/google'/)
    expect(layout).toMatch(/axes: \['wdth'\]/)
    expect(layout).not.toMatch(/Figtree|localFont|anybody/i)
    expect(existsSync('app/fonts/anybody-latin-wght400-800-wdth75-100.woff2')).toBe(false)
  })
})
```

Add `existsSync` to the file's `node:fs` import.

Append to `tests/design/type-scale.test.ts`:

```ts
describe('trail map type utilities', () => {
  const css = readFileSync('app/globals.css', 'utf8')

  it('sets display and map labels condensed and uppercase', () => {
    for (const cls of ['text-display', 'map-label']) {
      const body = css.match(new RegExp(String.raw`\.${cls} \{([^}]*)\}`))?.[1]
      expect(body, cls).toBeDefined()
      expect(body, cls).toMatch(/font-stretch:\s*(?:6\d|7\d)%/)
      expect(body, cls).toMatch(/text-transform:\s*uppercase/)
    }
  })

  it('gives numerals tabular figures', () => {
    expect(css).toMatch(/\.tabular \{[^}]*font-variant-numeric:\s*tabular-nums/)
  })
})
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/design/performance.test.ts tests/design/type-scale.test.ts`
Expected: FAIL on `loads Archivo with its wdth axis and nothing else` and `sets display and map labels condensed and uppercase`.

- [ ] **Step 3: Load Archivo**

In `app/layout.tsx`, replace the `Figtree` and `localFont` imports, the long font comment and both font constants with:

```tsx
import { Archivo } from 'next/font/google'

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

and set the `<html>` className to `className={archivo.variable}`.

```bash
git rm app/fonts/anybody-latin-wght400-800-wdth75-100.woff2
```

- [ ] **Step 4: Point both Tailwind families at Archivo**

In `tailwind.config.js`, replace `fontFamily` with:

```js
      fontFamily: {
        // Archivo only. `display` is the same family; width and case come
        // from .text-display and .map-label.
        sans: ['var(--font-sans)', 'Arial', 'sans-serif'],
        display: ['var(--font-sans)', 'Arial', 'sans-serif'],
      },
```

In `app/globals.css`, add `--font-display: var(--font-sans);` as the first line of the `:root` block.

- [ ] **Step 5: Add the type utilities**

Inside the existing `@layer components { … }` block of `app/globals.css`, add:

```css
	/* Display: condensed uppercase headlines (trailhead, section titles). */
	.text-display {
		font-family: var(--font-sans);
		font-stretch: 70%;
		font-weight: 800;
		text-transform: uppercase;
		line-height: 0.9;
		letter-spacing: -0.01em;
		font-size: clamp(3rem, 1.6rem + 6vw, 7.5rem);
		text-wrap: balance;
	}
	/* Map labels: place names, waypoint titles, legend keys. */
	.map-label {
		font-family: var(--font-sans);
		font-stretch: 75%;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.8125rem;
		line-height: 1.2;
	}
	.tabular {
		font-variant-numeric: tabular-nums;
	}
```

Replace the body of the existing `.eyebrow` rule with:

```css
	.eyebrow {
		font-family: var(--font-sans);
		font-stretch: 100%;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		font-size: 0.8125rem;
		color: oklch(var(--muted-strong));
	}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx vitest run tests/design/performance.test.ts tests/design/type-scale.test.ts`
Expected: PASS.

- [ ] **Step 7: Build and look**

Run: `npm run build`
Expected: build succeeds. Start `RESEND_API_KEY= GROQ_API_KEY= npx next start -p 3100`, open `http://localhost:3100` at 1440 and 390 wide, and confirm text renders in Archivo (DevTools → Computed → font-family) and nothing overflows horizontally. Old sections look off-brand; that is expected until S2.

- [ ] **Step 8: Commit**

```bash
git add app/layout.tsx tailwind.config.js app/globals.css tests/design/performance.test.ts tests/design/type-scale.test.ts
git commit -m "feat(type): Archivo on its width axis replaces Anybody and Figtree"
```

### Task 3: Draw token and the buttons

**Files:**
- Modify: `lib/motion-tokens.ts`
- Modify: `app/globals.css` (`:root` motion lines; `.button-primary` at line 219 and `.on-plane .button-primary` at line 222)
- Modify: `tests/design/motion-tokens.test.ts`
- Modify: `tests/design/primary-button.test.ts`

**Interfaces:**
- Produces: `motionTokens.duration.draw = 1.6`, `--dur-draw: 1.6s`, `--stagger-line: 70ms`, `.button-primary`, `.button-secondary`.

- [ ] **Step 1: Update the tests**

In `tests/design/motion-tokens.test.ts`, change the first assertion of `has the spec durations, distances and easings` to:

```ts
    expect(motionTokens.duration).toEqual({ fast: 0.18, normal: 0.35, slow: 0.6, crawl: 1.2, draw: 1.6 })
```

and add inside the same `describe`:

```ts
  it('staggers rising lines with a CSS token', () => {
    expect(cssVar('--stagger-line')).toBe('70ms')
  })
```

In `tests/design/primary-button.test.ts`, replace the test `is defined once, with the plane inversion` with:

```ts
  it('is defined once: trail fill with on-trail text, plus an ink-outline secondary', () => {
    expect(css).toMatch(/\.button-primary \{[^}]*bg-trail[^}]*text-on-trail/)
    expect(css).toMatch(/\.button-secondary \{[^}]*border-ink[^}]*text-ink/)
  })
```

and in `is never composed by hand from a fill and padding` replace the two `expect` lines with:

```ts
      expect(src, f).not.toMatch(/\bbg-trail\b[^"]*\bpx-\d/)
      expect(src, f).not.toMatch(/rounded bg-accent(?:-plane)? px-\d/)
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/design/motion-tokens.test.ts tests/design/primary-button.test.ts`
Expected: FAIL on the `draw` duration, `--stagger-line`, and the button definition.

- [ ] **Step 3: Add the draw token**

In `lib/motion-tokens.ts` change the duration line to:

```ts
  // draw: a trail or contour stroking in (spec §4, the "draw" verb).
  duration: { fast: 0.18, normal: 0.35, slow: 0.6, crawl: 1.2, draw: 1.6 },
```

In the `:root` block of `app/globals.css`, after `--dur-crawl: 1.2s;` add:

```css
	--dur-draw: 1.6s;
	/* Rising lines (spec §4, "rise"): each line starts this much after the one before. */
	--stagger-line: 70ms;
```

- [ ] **Step 4: Redefine the buttons**

Replace the `.button-primary` rule and delete the `.on-plane .button-primary` rule in `app/globals.css`, adding:

```css
	/* The one primary action: trail red, on-trail text (spec §3). */
	.button-primary {
		@apply inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-trail px-6 py-3 font-sans text-[0.9375rem] font-semibold text-on-trail;
	}
	/* The second path beside it: an ink outline, never filled. */
	.button-secondary {
		@apply inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border-2 border-ink bg-transparent px-6 py-3 font-sans text-[0.9375rem] font-semibold text-ink;
	}
```

Leave the `.on-plane :focus-visible` rule (line 128); it goes with the old hero in S2.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run tests/design/motion-tokens.test.ts tests/design/primary-button.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/motion-tokens.ts app/globals.css tests/design/motion-tokens.test.ts tests/design/primary-button.test.ts
git commit -m "feat(motion): draw token and the trail-red primary and outline secondary buttons"
```

### Task 4: Contour field and trail path primitives

**Files:**
- Create: `lib/contours.ts`
- Create: `components/map/contour-field.tsx`
- Create: `components/map/trail-path.tsx`
- Modify: `app/globals.css` (trail draw rules, appended)
- Create: `tests/design/trail-motion.test.ts`
- Create: `tests/components/chrome.test.tsx`

**Interfaces:**
- Produces: `trailheadContours`, `trailheadTrail`, `ContourField`, `TrailPath`, CSS class and keyframes `trail-draw`.

- [ ] **Step 1: Write the failing tests**

Create `tests/design/trail-motion.test.ts`:

```ts
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parseCssRules } from '../helpers/css-rules'

// Spec §4: the trail draws with scroll, only where the browser supports
// scroll timelines and the visitor allows motion. Elsewhere it is fully drawn.
const rules = parseCssRules(readFileSync('app/globals.css', 'utf8'))
const trail = rules.filter((r) => r.selector.includes('.trail-draw'))

describe('trail draw', () => {
  it('animates only inside both gates', () => {
    const animated = trail.filter((r) => /animation(-timeline)?\s*:/.test(r.body) && !/animation\s*:\s*none/.test(r.body))
    expect(animated.length).toBeGreaterThan(0)
    for (const r of animated) {
      expect(r.ancestors.some((a) => a.startsWith('@supports (animation-timeline:')), r.selector).toBe(true)
      expect(r.ancestors).toContain('@media (prefers-reduced-motion: no-preference)')
    }
  })

  it('is fully drawn outside the gates', () => {
    const base = trail.filter((r) => r.ancestors.every((a) => a.startsWith('@layer')))
    expect(base.length).toBeGreaterThan(0)
    for (const r of base) expect(r.body).not.toMatch(/stroke-dashoffset:\s*1\b/)
  })

  it('never loops', () => {
    for (const r of trail) expect(r.body).not.toMatch(/infinite/)
  })
})
```

Create `tests/components/chrome.test.tsx`:

```tsx
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ContourField } from '@/components/map/contour-field'
import { TrailPath } from '@/components/map/trail-path'
import { trailheadContours, trailheadTrail } from '@/lib/contours'

describe('map primitives', () => {
  it('renders contours as decorative SVG', () => {
    const html = renderToStaticMarkup(<ContourField paths={trailheadContours} viewBox="0 0 1440 900" />)
    expect(html).toContain('aria-hidden="true"')
    expect(html.match(/<path /g)?.length).toBe(trailheadContours.length)
  })

  it('renders the trail with a unit path length and the draw class', () => {
    const html = renderToStaticMarkup(<TrailPath d={trailheadTrail.d} viewBox={trailheadTrail.viewBox} />)
    expect(html).toContain('pathLength="1"')
    expect(html).toContain('trail-draw')
    expect(html).toContain('aria-hidden="true"')
  })
})
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/design/trail-motion.test.ts tests/components/chrome.test.tsx`
Expected: FAIL: no `.trail-draw` rules; cannot resolve `@/components/map/contour-field`.

- [ ] **Step 3: Author the contour and trail paths**

Create `lib/contours.ts`:

```ts
// Authored contour linework for the trailhead (spec §3). Coordinates are in a
// 1440 x 900 viewBox; the field scales with its container. Decorative only.
export const trailheadContours: string[] = [
  'M760 820 C900 600 1000 560 1180 520 S1420 420 1440 380',
  'M780 860 C930 640 1040 600 1210 560 S1430 470 1440 440',
  'M700 900 C860 700 980 660 1150 620 S1400 540 1440 520',
  'M820 760 C960 560 1060 520 1200 480 S1400 380 1440 330',
  'M860 700 C990 520 1080 480 1220 440 S1400 330 1440 280',
  'M640 900 C800 760 940 720 1120 690 S1380 620 1440 610',
  'M1080 620 C1160 560 1300 560 1360 640',
  'M1100 660 C1170 610 1290 610 1340 680',
]

// The red trail leaving the trailhead plate toward the first waypoints.
export const trailheadTrail = {
  d: 'M1290 570 C1180 640 1060 700 960 760 S760 830 640 812',
  viewBox: '0 0 1440 900',
}
```

- [ ] **Step 4: Write the components**

Create `components/map/contour-field.tsx`:

```tsx
import { cn } from '@/lib/utils'

interface ContourFieldProps {
  paths: string[]
  viewBox: string
  className?: string
}

// Survey contours behind a section. Decorative: hidden from assistive tech.
export function ContourField({ paths, viewBox, className }: ContourFieldProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={cn('pointer-events-none absolute inset-0 h-full w-full text-contour', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
    >
      {paths.map((d) => (
        <path key={d} d={d} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  )
}
```

Create `components/map/trail-path.tsx`:

```tsx
import { cn } from '@/lib/utils'

interface TrailPathProps {
  d: string
  viewBox: string
  className?: string
}

// The red trail (spec §4, "draw"). pathLength="1" lets the CSS draw it with a
// unit dash; outside the motion gates it is simply fully drawn.
export function TrailPath({ d, viewBox, className }: TrailPathProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={cn('pointer-events-none absolute inset-0 h-full w-full text-trail', className)}
      fill="none"
    >
      <path
        d={d}
        pathLength={1}
        className="trail-draw"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
```

- [ ] **Step 5: Add the draw rules**

Append to the end of `app/globals.css` (outside any `@layer`):

```css
/* The trail (spec §4): fully drawn by default; drawn with the page's scroll
 * where scroll timelines exist and motion is allowed. Never loops. */
.trail-draw {
	stroke-dasharray: 1;
	stroke-dashoffset: 0;
}

@supports (animation-timeline: scroll()) {
	@media (prefers-reduced-motion: no-preference) {
		.trail-draw {
			stroke-dashoffset: 1;
			animation: trail-draw linear both;
			animation-timeline: scroll(root);
		}
	}
}

@keyframes trail-draw {
	to {
		stroke-dashoffset: 0;
	}
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx vitest run tests/design/trail-motion.test.ts tests/components/chrome.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add lib/contours.ts components/map app/globals.css tests/design/trail-motion.test.ts tests/components/chrome.test.tsx
git commit -m "feat(map): contour field and scroll-drawn trail primitives"
```

### Task 5: The legend navigation

**Files:**
- Create: `components/site-legend.tsx` (moved from `components/top-bar.tsx`)
- Modify: `app/layout.tsx`
- Modify: `app/globals.css` (`html` scroll padding, `.legend-glass`)
- Modify: `lib/data.ts` (`navigationItems`, line 451)
- Modify: `tests/design/sticky-header.test.ts`, `tests/components/brand-mark.test.tsx`, `tests/components/sections.test.tsx` (each reads `components/top-bar.tsx` today)
- Modify: `tests/components/chrome.test.tsx`

**Interfaces:**
- Consumes: `navigationItems`, `heroContent.name`, `resumeUrl` (exported at `lib/data.ts:71`).
- Produces: `SiteLegend()` client component; CSS class `legend-glass`.

- [ ] **Step 1: Update the tests**

In `tests/design/sticky-header.test.ts`, `tests/components/brand-mark.test.tsx` and `tests/components/sections.test.tsx`, replace every `components/top-bar.tsx` with `components/site-legend.tsx` (and any `TopBar` import with `SiteLegend` from `@/components/site-legend`).

In `tests/design/sticky-header.test.ts`, replace the body of `pads the root scroller by more than the header at both breakpoints` with:

```ts
    // The legend floats 12px below the top and is 56px tall at every width.
    const base = css.match(/html \{[^}]*scroll-padding-top:\s*([\d.]+rem)/)?.[1]
    expect(base).toBeDefined()
    expect(rem(base!)).toBeGreaterThanOrEqual(12 + 56 + 8)
```

Append to `tests/components/chrome.test.tsx`:

```tsx
import { readFileSync } from 'node:fs'
import { navigationItems } from '@/lib/data'

describe('legend navigation', () => {
  const src = readFileSync('components/site-legend.tsx', 'utf8')

  it('is a frosted legend card, not a full-width bar', () => {
    expect(src).toContain('legend-glass')
    const css = readFileSync('app/globals.css', 'utf8')
    expect(css).toMatch(/\.legend-glass \{[^}]*backdrop-filter:\s*blur\(/)
  })

  it('lists Work first and keeps Contact', () => {
    expect(navigationItems[0]).toEqual({ label: 'Work', href: '/projects' })
    expect(navigationItems.map((n) => n.label)).toContain('Contact')
  })

  it('offers the résumé from the legend', () => {
    expect(src).toContain('resumeUrl')
  })
})
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/design/sticky-header.test.ts tests/components/chrome.test.tsx`
Expected: FAIL: `components/site-legend.tsx` does not exist.

- [ ] **Step 3: Create the legend from the top bar**

```bash
git mv components/top-bar.tsx components/site-legend.tsx
```

In `components/site-legend.tsx`:
- rename `export function TopBar()` to `export function SiteLegend()`;
- change the data import to `import { heroContent, navigationItems, resumeUrl } from '@/lib/data'`;
- keep both `useEffect` blocks and `switchTheme` exactly as they are (the in-page jump fix and the theme swap);
- replace the returned JSX with:

```tsx
  return (
    <header className="pointer-events-none sticky top-3 z-40 px-3 sm:px-5">
      <div className="legend-glass pointer-events-auto mx-auto flex h-14 max-w-6xl items-center gap-3 rounded border border-line px-3 sm:gap-6 sm:px-5">
        <Link href="/" className="inline-flex min-h-[44px] shrink-0 items-center gap-2 text-ink">
          <BrandMark />
          <span className="map-label text-[0.9375rem] text-ink">{heroContent.name}</span>
        </Link>

        <nav aria-label="Primary" className="min-w-0 flex-1">
          <ul className="flex overflow-x-auto p-1.5 max-sm:-my-1.5 sm:gap-1">
            {navigationItems.map((item) => {
              const href = item.href.startsWith('#') ? `/${item.href}` : item.href
              const current = !item.href.startsWith('#') && pathname.startsWith(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={href}
                    aria-current={current ? 'page' : undefined}
                    className="map-label inline-flex min-h-[44px] items-center whitespace-nowrap px-2 text-muted-strong transition-colors duration-[var(--dur-fast)] ease-[var(--ease-sharp)] hover:text-ink aria-[current=page]:text-trail"
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={resumeUrl}
            className="map-label hidden min-h-[44px] items-center px-2 text-muted-strong hover:text-ink md:inline-flex"
          >
            Résumé
          </a>
          <button
            type="button"
            onClick={() => switchTheme(isDark ? 'light' : 'dark')}
            aria-label={themeLabel}
            className="press inline-flex h-11 w-11 items-center justify-center rounded-sm border border-line-strong text-muted-strong hover:border-ink hover:text-ink"
          >
            {mounted ? isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" /> : <span className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  )
```

- [ ] **Step 4: Wire it into the layout**

In `app/layout.tsx`, replace `import { TopBar } from '@/components/top-bar'` with `import { SiteLegend } from '@/components/site-legend'`, and `<TopBar />` with `<SiteLegend />`.

- [ ] **Step 5: The glass surface and scroll padding**

In `app/globals.css`, inside `@layer components`, add:

```css
	/* The legend card (spec §3): the one frosted surface on the site. */
	.legend-glass {
		background: oklch(var(--panel) / 0.78);
		-webkit-backdrop-filter: blur(14px) saturate(1.2);
		backdrop-filter: blur(14px) saturate(1.2);
		box-shadow: var(--shadow-overlay);
	}
	@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
		.legend-glass {
			background: oklch(var(--panel));
		}
	}
```

In the `html` rule, set `scroll-padding-top: 5rem;` and delete the `@media (min-width: 768px) { html { scroll-padding-top: … } }` override.

- [ ] **Step 6: Work first in the navigation**

In `lib/data.ts` replace `navigationItems` with:

```ts
// Services, About and Hire join in S4, when their pages exist
// (tests/design/nav-anchors.test.ts checks every route has a page).
export const navigationItems: NavigationItem[] = [
  { label: 'Work', href: '/projects' },
  { label: 'Experience', href: '#changelog' },
  { label: 'Contact', href: '#contact' },
]
```

- [ ] **Step 7: Run the tests**

Run: `npm test`
Expected: PASS. The client-component count is unchanged (a rename). If `tests/components/sections.test.tsx` asserted a `Projects` nav item, update it to the new list.

- [ ] **Step 8: Commit**

```bash
git add -A components/site-legend.tsx components/top-bar.tsx app/layout.tsx app/globals.css lib/data.ts tests
git commit -m "feat(chrome): floating map-legend navigation with the résumé link"
```

### Task 6: The survey footer

**Files:**
- Modify: `components/footer.tsx`
- Modify: `lib/data.ts` (`footerContent`, line 476)
- Modify: `tests/components/chrome.test.tsx`

**Interfaces:**
- Consumes: `contactInfo.socialLinks`, `heroContent.name`, `footerContent`.
- Produces: `footerContent.base: { place: string; coordinates: string }`.

- [ ] **Step 1: Write the failing test**

Append to `tests/components/chrome.test.tsx`:

```tsx
import { Footer } from '@/components/footer'
import { footerContent } from '@/lib/data'

describe('survey footer', () => {
  const html = renderToStaticMarkup(<Footer />)

  it('marks Naga City as the base with its coordinates', () => {
    expect(footerContent.base.place).toBe('Naga City, Camarines Sur')
    expect(html).toContain(footerContent.base.place)
    expect(html).toContain(footerContent.base.coordinates)
  })

  it('carries no phone number or street address', () => {
    expect(html).not.toMatch(/\+?63[\s-]?9\d{2}|09\d{9}/)
    expect(html).not.toMatch(/\bStreet\b|\bSt\.\s|\bBarangay\b/i)
  })
})
```

Merge the new `import` lines into the existing imports at the top of the file.

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/components/chrome.test.tsx`
Expected: FAIL: `footerContent.base` is undefined.

- [ ] **Step 3: Add the base to the data**

In `lib/data.ts` replace `footerContent` with:

```ts
export const footerContent = {
  colophon: 'Surveyed in Naga City',
  // The public locality only (CLAUDE.md privacy rule): Naga City's centre,
  // rounded to two decimals.
  base: { place: 'Naga City, Camarines Sur', coordinates: '13.62° N · 123.19° E' },
}
```

- [ ] **Step 4: Rewrite the footer**

Replace `components/footer.tsx` with:

```tsx
import { contactInfo, footerContent, heroContent } from '@/lib/data'

export function Footer() {
  const links = contactInfo.socialLinks.filter((link) => link.icon !== 'mail')

  return (
    <footer className="border-t border-line">
      {/* pb-24 below lg keeps the last row clear of the fixed chat launcher. */}
      <div className="mx-auto grid max-w-6xl gap-8 px-5 pb-24 pt-12 sm:grid-cols-[1fr_auto] sm:items-end sm:px-8 lg:pb-12">
        <div>
          <p className="text-display text-[2.5rem]">{heroContent.name}</p>
          <p className="map-label mt-4 text-muted-strong">Base · {footerContent.base.place}</p>
          <p className="tabular mt-1 text-sm text-muted">{footerContent.base.coordinates}</p>
          <p className="mt-4 text-sm text-muted">
            © {new Date().getFullYear()} · {footerContent.colophon}
          </p>
        </div>
        <ul className="-ml-2 flex flex-wrap gap-x-2 sm:ml-0 sm:-mr-2">
          {links.map((link) => (
            <li key={link.name}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="map-label inline-flex min-h-[44px] items-center px-2 text-muted-strong transition-colors duration-[var(--dur-fast)] ease-[var(--ease-sharp)] hover:text-ink"
              >
                {link.name}
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
```

`tests/design/type-scale.test.ts` only guards the Portfolio 4.0 scale classes, so `text-display text-[2.5rem]` is allowed here.

- [ ] **Step 5: Run the tests**

Run: `npm test`
Expected: PASS. If `tests/content/visible-copy.test.ts` asserts the old colophon `Printed in Naga City`, point it at `footerContent.colophon`.

- [ ] **Step 6: Commit**

```bash
git add components/footer.tsx lib/data.ts tests
git commit -m "feat(chrome): survey footer with Naga City as the base"
```

### Task 7: Sprint 1 verification and preview

**Files:** none new.

- [ ] **Step 1: Full gate**

Run, in order: `npm run type-check`, `npm run lint`, `npm test`, `npm run build`.
Expected: all four pass. If `type-check` points at a deleted file under `.next/types`, delete `.next` and rerun.

- [ ] **Step 2: Look at it**

Start `RESEND_API_KEY= GROQ_API_KEY= npx next start -p 3100`. Check `/`, `/projects` and one `/projects/<slug>` at 1440 and 390 wide, in both themes:
- the legend card floats, is frosted, and its links reach `/projects` and `#contact`;
- focus rings show on the legend links and the theme button;
- the footer shows the base line and coordinates;
- text is Archivo; nothing overflows horizontally at 390.

- [ ] **Step 3: Push the branch for a preview**

```bash
git push -u origin v5
```

Report the Vercel preview URL to Christian. S1 is done when he has seen it; then write `docs/superpowers/plans/2026-11-20-portfolio-v5-s2.md`.

---

## Sprint 2 to 6 scopes (detailed plans written at each sprint's start)

### S2 Homepage (Opus)

Sections, in order, each a server component in `components/sections/`: `Trailhead` (spec §3 first viewport: `ContourField`, `TrailPath`, portrait on a survey plate, `.button-primary` "Start a project" → `#contact`, `.button-secondary` "Hire me for a role" → `#contact` until `/hire` exists in S4), `ElevationStrip` (proof counts derived from `projects`, laid on the 2020-to-now timeline from `experience` and `education` dates, with a "you are here" marker driven by the page's scroll timeline inside both gates), `Fork`, `FieldMap` (Philippines outline SVG in `components/map/philippines-outline.tsx`, pins from `project.place` rendered as `<a>` links), `OwnProducts`, `TrailJournals`, `PlanTheRoute` (the contact form rebuilt from `contact-console.tsx`, still the only form client component). New data: `heroContent` copy from spec §6, `Project.place?: { name: string; region: string; lat: number; lng: number }` set only where verified. Tests: hero copy and product count from data, every pin has a `place`, pins are links in the server HTML, the line rise behind both gates and under 2 s. Delete the Portfolio 4.0 sections (`hero`, `products`, `rack`, `case-studies`, `field-log`, `route-line`, `stack`, `contact-console`), the `.on-plane` rules, and the tests that only assert them.

### S3 Projects (Sonnet)

`/projects` with map and list views of the same data, `LegendFilter` (segmented legend key over `?band=`), view-transition pan via the adapted island; `SurveyPlate` for every screenshot at one scale; `/projects/[slug]` with trail-journal case studies for the six flagships and short pages for the rest; `LivePreview` restyled, logic unchanged. Retire `catalog-motion` and the rack tests; port the `view-transitions` tests to the new names.

### S4 New pages (Sonnet)

`servicePages` (three entries: slug, title, keyword, answer, sections, proving project ids), `aboutPageContent`, `hirePageContent` in `lib/data.ts` with interfaces in `types/index.ts`; `/services`, `/services/[slug]` (`generateStaticParams`), `/about` (story, timeline, six photos, four testimonials, résumé), `/hire`, 404 "Off the trail". Add Services, About and Hire to `navigationItems`; point the trailhead's secondary button at `/hire`. Tests: each service lists only real projects, each page opens with a 40-60 word answer, nav routes resolve.

### S5 SEO, GEO, AIEO (Sonnet)

Titles and descriptions per route from spec §6; one `Person` `@id`, `ProfilePage`, `Service`, `CreativeWork`/`SoftwareApplication`, `BreadcrumbList`, `WebSite`; `robots.ts` naming Googlebot, OAI-SearchBot, Claude-SearchBot and PerplexityBot with `/api/` disallowed; sitemap with every route; llms files covering the new pages; OG card in the trail palette (re-enable `og-palette`). Tests: titles, no telephone or street anywhere, every route in the sitemap and llms.txt.

### S6 Finish (Opus)

Hero contour pointer shift, line-by-line rise, screenshot appear-once; Lighthouse at 1440 and 390; a reduced-motion pass; remove the `--accent*` aliases and every Portfolio 4.0 utility, with a test that none remain; impeccable finish review (`impeccable-finish-reviewer`), `DESIGN.md` via the documenter, `CLAUDE.md` and `PRODUCT.md` updated; merge to `main` only after Christian signs off the preview.
