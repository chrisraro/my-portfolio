# Portfolio 4.0 — Phase 2: Design System & Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio on the B3 Signal design system — warm graphite, sodium amber, status as glyph plus label — with a products-first homepage and a server-rendered `/projects` board, on a `v4` branch that merges only after the quality gates and Christian's sign-off.

**Architecture:** Design tokens are raw oklch triplets in `app/globals.css`, exposed as Tailwind colour keys and guarded by a contrast test. Each homepage section is replaced in place, one task at a time, so every commit on `v4` produces a viewable Vercel preview. Pure logic (status mapping, board grouping, field-log interleaving, proof-point parsing, metadata) lives in `lib/` with Vitest coverage. Server components render static data; only components that genuinely need interactivity are client components.

**Tech Stack:** Next.js 14 App Router · React 18 · TypeScript 5 strict · Tailwind CSS 3 · next-themes · next/font (Recursive, variable, with its MONO axis) · framer-motion 10 · Vitest 3 · `react-dom/server` for markup tests

**Amended 2026-09-23 during Task 1, by Christian's decision:** the typeface is **Recursive**, not IBM Plex — impeccable flags Plex as a training-data default, and Recursive's sans-to-mono axis gives the Operator world's two voices from one face. `DESIGN.md` is written in **Task 14** from the built site, not in Task 1; Task 1 records a direction contract in `.impeccable/surfaces/app-page-tsx.md` instead.

**Spec:** `docs/superpowers/specs/2026-09-23-design-system-homepage-design.md`

---

## Global Constraints

Every task's requirements implicitly include this section.

- **Branch:** all work happens on `v4`, cut from `main`. Pushing `v4` is authorised (it only creates a Vercel preview, per spec D6). **Never push or merge to `main`** — that needs Christian's sign-off on the preview URL.
- **Token format:** every colour token in `app/globals.css` is a raw oklch triplet, `--name: L C H;`, one per line. Tailwind wraps it as `oklch(var(--name) / <alpha-value>)` so opacity modifiers like `bg-accent/20` keep working. This is the spec's "oklch literal, one per line" requirement in the form the existing Tailwind wiring needs. `tests/design/contrast.test.ts` parses these lines; keep the format exact.
- **Tailwind colour keys (final):** `canvas` (reads `--bg`), `panel`, `ink`, `muted`, `muted-strong`, `line`, `line-strong`, `accent`, `on-accent`, `live`, `status-early`, `status-private`, `status-internal`. `canvas` is named for readability: `bg-canvas` rather than `bg-bg`.
- **Green means live, and nothing else.** `live` appears only on the live status glyph. Availability and brand accents use `accent`.
- **Status is never colour alone.** Every status renders a glyph and a text label through `StatusBadge`. A label may be visually hidden (`sr-only`) in dense layouts, never removed.
- **No count-up numbers, no scroll-linked animation, no parallax, no page transitions.** The live pulse runs **two iterations (4.8s) and stops** — WCAG 2.2.2 only requires a pause control for motion lasting over 5 seconds.
- **Under `prefers-reduced-motion`, the live pulse is removed** (`display: none`), not shortened.
- **Minimum target size 24×24px** (WCAG 2.5.8). Buttons and CTAs use `min-h-[44px]`; compact controls use at least `min-h-[32px]`.
- **Never hardcode portfolio content in components.** All copy, including section headings, comes from `lib/data.ts`.
- **Never invent a fact.** Counts shown on the page are derived from `projects`, not typed.
- **Code style:** named exports for components (pages keep their required default export), no semicolons, single quotes, kebab-case files, `@/` imports, `cn()` for class merging, braced eyebrow JSX `{'// label'}`.
- **Both API routes work with no environment variables set.** CI builds with no secrets.
- **Commits:** `type(scope): summary`, lowercase type, ending with `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`.
- **Before any UI edit, read `C:\Users\raroc\.claude\skills\impeccable\reference\craft-floor.md`** — the design quality floor and its bans — and the direction contract in `.impeccable/surfaces/app-page-tsx.md`, which is the visual authority until Task 14 writes `DESIGN.md`.
- **One grid (the contract's RAISE):** every section uses the same container, `mx-auto max-w-6xl px-5 sm:px-8`, and every numeral — proof band, counts, dates — sets `tabular-nums`.
- **Type:** one variable family, Recursive. `font-sans` is its linear sans; `font-mono` is the same family with `font-variation-settings: 'MONO' 1`. Never load a second typeface.
- **Gate for every task:** `npm run type-check && npm run lint && npm test && npm run build` all pass. If `type-check` fails pointing at a file that no longer exists under `.next/types/`, delete `.next` and re-run — it is a stale build artefact (documented in `CLAUDE.md`).

---

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `PRODUCT.md`, `.impeccable/surfaces/app-page-tsx.md` | Product truth; the homepage direction contract | 1 |
| `DESIGN.md` | The built visual world, documented from the code | 14 |
| `app/globals.css` | Token layer, base styles, type utilities, live pulse | 2 |
| `tailwind.config.js` | Colour keys and font families | 2, 13 |
| `app/layout.tsx` | Fonts, theme default, metadata, chrome | 2, 3, 6 |
| `tests/design/contrast.test.ts` | WCAG contrast for every token pair, both themes | 2 |
| `tests/design/legacy-tokens.test.ts` | No legacy colour utility survives the migration | 2 |
| `lib/data.ts` | Positioning, availability, section copy, navigation | 3, 7 |
| `lib/site-metadata.ts` | Builds page metadata from `heroContent` | 3 |
| `lib/chat-context.ts` | Adds specialism and availability to the assistant | 3 |
| `tests/content/positioning.test.ts` | Positioning data stays consistent | 3 |
| `types/index.ts` | `DisplayStatus` | 4 |
| `lib/display-status.ts` | Data status → display status + label | 4 |
| `components/ui/status-badge.tsx` | Glyph + label for one status | 4 |
| `vitest.config.ts` | Adds `.tsx` tests and the JSX transform | 4 |
| `tests/components/status-badge.test.tsx` | Markup test for every status | 4 |
| `lib/board.ts` | Board grouping and the `?band=` parameter | 5 |
| `components/ui/board-row.tsx`, `systems-board.tsx`, `board-filter.tsx` | The board | 5 |
| `app/projects/page.tsx` | Server-rendered full board with filter | 5 |
| `components/top-bar.tsx` | Sticky bar: mark, nav, availability, theme toggle | 6 |
| `components/footer.tsx` | Social links and copyright | 6 |
| `app/page.tsx` | Homepage composition (server component) | 6–11 |
| `lib/proof.ts` | Splits a proof point into numeral and label | 7 |
| `components/sections/hero.tsx`, `components/ui/proof-band.tsx` | Hero | 7 |
| `components/ui/product-panel.tsx`, `components/sections/products.tsx`, `components/sections/systems.tsx` | Work sections | 8 |
| `lib/field-log.ts`, `components/sections/field-log.tsx` | Field log | 9 |
| `components/sections/changelog.tsx`, `components/sections/stack.tsx` | Changelog and stack | 10 |
| `components/sections/contact-console.tsx` | Contact | 11 |
| `components/ui/chat-widget.tsx` | Console restyle | 12 |
| `tests/design/client-boundary.test.ts`, `tests/design/nav-anchors.test.ts` | Structural guards | 13 |
| `CLAUDE.md` | Project instructions for the new system | 1, 13 |

**Deleted along the way:** `components/navigation.tsx` (6), `components/sections/hero-section.tsx` and `about-section.tsx` (7), `works-section.tsx`, `components/ui/project-card.tsx`, `components/ui/link-preview.tsx` (8), `gallery-section.tsx`, `recommendations-section.tsx` (9), `experience-section.tsx`, `skills-section.tsx` (10), `contact-section.tsx` (11).

**Why sections are replaced in place:** each task swaps one slot in `app/page.tsx` and deletes the old file in the same commit. Every commit on `v4` therefore renders a coherent page on its Vercel preview, and there is never a pile of dead components waiting for a final sweep.

---

## Task 1: Branch and design context

**Run by the controller, not a subagent** — it drives the `impeccable` skill, which is interactive and loads its own references.

**Files:**
- Create: `PRODUCT.md`, `.impeccable/surfaces/app-page-tsx.md` (via impeccable)
- Modify: `CLAUDE.md` (Git section)

**Interfaces:**
- Consumes: the approved spec
- Produces: the direction contract every later UI task reads; the `v4` branch

- [ ] **Step 1: Cut the branch**

```bash
git switch main
git pull --ff-only
git switch -c v4
```

- [ ] **Step 2: Run `impeccable init` to write `PRODUCT.md`**

Invoke the `impeccable` skill with the `init` command. Answer its questions from the spec, verbatim where the spec gives values:

- **Product:** personal portfolio of Christian Raro, full-stack developer in Naga City, Philippines.
- **Audience:** freelance clients first (often non-technical small-business owners, especially Philippine tourism and hospitality), engineering hiring managers second.
- **Positioning:** "Full-stack developer." WordPress specialism shown as proof, not a title. Software development shown through three products of his own and two custom systems.
- **Availability:** "Open to freelance and full-time roles."
- **Design mode per surface:** homepage **Persuade**; `/projects` **Operate**; case-study pages (later phase) **Read**.
- **Success:** a visitor understands within one screen what he builds and how to hire him; every claim on the page is backed by the inventory.

- [ ] **Step 3: Record the direction contract (as executed — see the amendment note)**

impeccable's new-work method writes `DESIGN.md` only at the finish, from the built world. Before code, it records a direction contract in the surface brief. Run `impeccable concept-seed --scope direction --mode persuade`, acknowledge the seed (the user's pinned direction beats the roll), and write the six contract blocks with `impeccable surface-brief write app/page.tsx <body> app/projects/page.tsx`. The paragraph below is the original instruction, kept for the record; it is superseded.

- [ ] ~~**Step 3 (superseded): Write `DESIGN.md` for the committed world**~~

Invoke `impeccable` for new work on the homepage surface and have it record **B3 Signal** as the replacement visual world. Supply spec §2 (colour, including the exact token values from Task 2 Step 4), §3 (type), §4 (status language), §9 (motion), and these rules: green means live only; status never by colour alone; hairline rules and panels, no grid-paper texture; 8px panel radius, 4px chip radius. The incumbent look (Plus Jakarta Sans, Fraunces, red `#FF2D55`, dotted background) is evidence and anti-reference, not something to preserve.

- [ ] **Step 4: Note the branch in `CLAUDE.md`**

In `CLAUDE.md`, replace the last line of the **Git** section:

```markdown
Work happens directly on `main`; there are no other branches.
```

with:

```markdown
Work normally happens directly on `main`. **Exception, until the Portfolio 4.0
redesign merges:** the redesign is built on a `v4` branch, where each push gets a
Vercel preview URL. Content fixes still land on `main` and are merged into `v4`.
Never merge `v4` into `main` without Christian's sign-off on the preview.
```

- [ ] **Step 5: Commit and push the branch**

```bash
git add PRODUCT.md .impeccable/surfaces CLAUDE.md docs
git commit -m "docs: add PRODUCT.md and the homepage direction contract

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
git push -u origin v4
```

Expected: Vercel builds a preview for `v4`. The site on it is unchanged so far.

Vercel protects preview URLs behind a Vercel login by default. Christian can view
them while logged in. Note whether protection is on — Task 14's Lighthouse run
depends on it.

---

## Task 2: Tokens and type foundation

Replaces the whole colour system and both typefaces in one atomic change. It has to be atomic: the new `--muted` is a text colour where the old `--muted` was a surface, and the new `--accent` is the amber brand where the old `--accent` was a tinted surface. The names collide, so the old and new systems cannot coexist. A one-off script migrates every existing utility class in the same commit, so the current site renders in the new palette immediately.

**Files:**
- Create: `tests/design/contrast.test.ts`, `tests/design/legacy-tokens.test.ts`
- Modify: `app/globals.css` (rewrite), `tailwind.config.js` (rewrite), `app/layout.tsx` (fonts, theme), `components/ui/chat-widget.tsx` (one inline style), every file under `app/` and `components/` that uses a legacy colour utility (by script)

**Interfaces:**
- Consumes: nothing
- Produces: the Tailwind colour keys in Global Constraints; the CSS classes `.eyebrow`, `.text-fluid-h1`, `.text-fluid-h2`, `.live-pulse`; the CSS variable `--font-sans` (Recursive) from `next/font`. Later tasks use only these; `font-mono` is Recursive with its MONO axis on.

- [ ] **Step 1: Write the failing contrast test**

Create `tests/design/contrast.test.ts`:

```ts
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Every colour token is a raw oklch "L C H" triplet so Tailwind can wrap it as
// oklch(var(--x) / <alpha-value>). This test reads those triplets straight out
// of the stylesheet, converts them to sRGB luminance, and checks WCAG contrast
// in both themes — so a colour tweak cannot quietly break accessibility.

const CSS = readFileSync('app/globals.css', 'utf8')

const TOKENS = [
  'bg', 'panel', 'ink', 'muted', 'muted-strong', 'line', 'line-strong',
  'accent', 'on-accent', 'live', 'status-early', 'status-private', 'status-internal',
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
    const match = body.match(
      new RegExp(`(?<![\\w-])--${token}:\\s*([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+)\\s*;`),
    )
    if (!match) throw new Error(`--${token} is missing or not an "L C H" triplet in ${selector}`)
    theme[token] = [Number(match[1]), Number(match[2]), Number(match[3])]
  }
  return theme
}

// OKLCH → linear sRGB → WCAG relative luminance. Channels are clamped to the
// sRGB gamut, which is what a browser displays.
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

// WCAG 1.4.3: text needs 4.5:1.
const TEXT_PAIRS: [Token, Token][] = [
  ['ink', 'bg'], ['ink', 'panel'],
  ['muted', 'bg'], ['muted', 'panel'],
  ['muted-strong', 'bg'], ['muted-strong', 'panel'],
  ['accent', 'bg'], ['accent', 'panel'],
  ['on-accent', 'accent'],
]

// WCAG 1.4.11: status glyphs and the focus ring need 3:1.
const UI_PAIRS: [Token, Token][] = [
  ['live', 'bg'], ['live', 'panel'],
  ['status-early', 'bg'], ['status-early', 'panel'],
  ['status-private', 'bg'], ['status-private', 'panel'],
  ['status-internal', 'bg'], ['status-internal', 'panel'],
  ['accent', 'bg'], ['accent', 'panel'],
]

describe.each([
  ['light', ':root'],
  ['dark', '.dark'],
])('%s theme', (_name, selector) => {
  const theme = readTheme(selector)

  it.each(TEXT_PAIRS)('text --%s on --%s reaches 4.5:1', (fg, bg) => {
    expect(contrast(theme[fg], theme[bg])).toBeGreaterThanOrEqual(4.5)
  })

  it.each(UI_PAIRS)('glyph --%s on --%s reaches 3:1', (fg, bg) => {
    expect(contrast(theme[fg], theme[bg])).toBeGreaterThanOrEqual(3)
  })
})
```

- [ ] **Step 2: Write the failing legacy-token test**

Create `tests/design/legacy-tokens.test.ts`:

```ts
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// The pre-4.0 palette used shadcn-style names. Some collide with the new
// system (`muted`, `accent`) and mean something different there, so a leftover
// legacy class would render in the wrong colour rather than fail loudly.
const LEGACY = new RegExp(
  '(?<![\\w-])(?:bg|text|border|ring|divide|outline|placeholder|from|via|to|fill|stroke)-' +
    '(?:background|foreground|primary|primary-foreground|secondary|secondary-foreground|' +
    'card|card-foreground|popover|popover-foreground|muted-foreground|accent-foreground|border|input)' +
    '(?![\\w-])',
)
const LEGACY_VAR = /var\(--(?:background|foreground|primary|primary-rgb|secondary|card|popover|border|input|font-display)\b/

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return /\.(tsx?|css)$/.test(full) ? [full] : []
  })
}

describe('legacy colour tokens', () => {
  const files = ['app', 'components'].flatMap(sourceFiles)

  it('no component uses a legacy colour utility', () => {
    const offenders = files.filter((f) => LEGACY.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })

  it('no file reads a legacy CSS variable', () => {
    const offenders = files.filter((f) => LEGACY_VAR.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })
})
```

- [ ] **Step 3: Run both tests to verify they fail**

Run: `npm test -- tests/design`
Expected: FAIL. The contrast suite throws `--bg is missing or not an "L C H" triplet in :root`; the legacy suite lists roughly a dozen offending files.

- [ ] **Step 4: Rewrite `app/globals.css`**

Replace the entire file with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/*
 * Design tokens — B3 Signal. See DESIGN.md.
 *
 * Each colour is a raw oklch "L C H" triplet, one per line, so Tailwind can wrap
 * it as oklch(var(--x) / <alpha-value>) and opacity modifiers keep working.
 * tests/design/contrast.test.ts parses these lines — keep the format exact.
 *
 * :root is the light theme. .dark is the default: next-themes adds the class.
 * Green (--live) means a live system and nothing else.
 */
:root {
	--bg: 0.9620 0.0115 84.58;
	--panel: 0.9798 0.0086 84.57;
	--ink: 0.2070 0.0075 67.39;
	--muted: 0.5018 0.0181 67.40;
	--muted-strong: 0.3491 0.0120 62.25;
	--line: 0.8967 0.0179 81.33;
	--line-strong: 0.8300 0.0217 79.08;
	--accent: 0.5099 0.1227 54.58;
	--on-accent: 0.9798 0.0086 84.57;
	--live: 0.5599 0.1335 152.55;
	--status-early: 0.5099 0.1227 54.58;
	--status-private: 0.5644 0.0176 67.46;
	--status-internal: 0.5644 0.0176 67.46;
	--radius: 0.5rem;
}

.dark {
	--bg: 0.1838 0.0052 67.50;
	--panel: 0.2114 0.0075 67.40;
	--ink: 0.9448 0.0120 79.78;
	--muted: 0.6480 0.0193 72.97;
	--muted-strong: 0.8055 0.0195 75.29;
	--line: 0.2724 0.0117 67.30;
	--line-strong: 0.3262 0.0157 67.23;
	--accent: 0.7743 0.1479 68.78;
	--on-accent: 0.1838 0.0052 67.50;
	--live: 0.7972 0.1171 153.88;
	--status-early: 0.7743 0.1479 68.78;
	--status-private: 0.5886 0.0205 70.06;
	--status-internal: 0.5886 0.0205 70.06;
}

@layer base {
	html { scroll-behavior: smooth; }
	body {
		@apply bg-canvas text-ink;
		font-family: var(--font-sans), system-ui, sans-serif;
		line-height: 1.6;
		-webkit-font-smoothing: antialiased;
	}
	:focus-visible {
		outline: 2px solid oklch(var(--accent));
		outline-offset: 2px;
	}
}

@layer utilities {
	/* H1: 40px at a 360px viewport rising to 64px at 1280px and above. */
	.text-fluid-h1 {
		font-size: clamp(2.5rem, 1.913rem + 2.609vw, 4rem);
		line-height: 1.02;
		letter-spacing: -0.025em;
		font-weight: 600;
	}
	.text-fluid-h2 {
		font-size: clamp(1.5rem, 1.2rem + 1.25vw, 2.125rem);
		line-height: 1.1;
		letter-spacing: -0.02em;
		font-weight: 600;
	}
	/* Recursive is one family; its MONO axis is the monospace voice. */
	.font-mono { font-variation-settings: 'MONO' 1; }
	.eyebrow {
		font-family: var(--font-sans), ui-monospace, monospace;
		font-variation-settings: 'MONO' 1;
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: oklch(var(--accent));
	}
}

/*
 * Live status pulse: an opacity-only ring around the dot. Two iterations
 * (4.8s) then it stops — WCAG 2.2.2 requires a pause control only for motion
 * lasting more than five seconds. The element needs `position: relative`.
 */
@keyframes live-pulse {
	0% { opacity: 0.7; }
	100% { opacity: 0; }
}
.live-pulse::after {
	content: '';
	position: absolute;
	inset: -3px;
	border-radius: 9999px;
	border: 1px solid oklch(var(--live));
	opacity: 0;
	animation: live-pulse 2.4s ease-out 2;
}

@media (prefers-reduced-motion: reduce) {
	.live-pulse::after { display: none; }
	*, *::before, *::after {
		animation-duration: 0.001ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.001ms !important;
		scroll-behavior: auto !important;
	}
}
```

- [ ] **Step 5: Rewrite `tailwind.config.js`**

Replace the entire file with:

```js
/** @type {import('tailwindcss').Config} */
const token = (name) => `oklch(var(--${name}) / <alpha-value>)`

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: token('bg'),
        panel: token('panel'),
        ink: token('ink'),
        muted: token('muted'),
        'muted-strong': token('muted-strong'),
        line: token('line'),
        'line-strong': token('line-strong'),
        accent: token('accent'),
        'on-accent': token('on-accent'),
        live: token('live'),
        'status-early': token('status-early'),
        'status-private': token('status-private'),
        'status-internal': token('status-internal'),
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        // Same family as sans: globals.css adds font-variation-settings 'MONO' 1
        // to .font-mono, which is what makes Recursive monospaced.
        mono: ['var(--font-sans)', 'ui-monospace', 'monospace'],
        // Temporary alias so legacy `font-display` headings render in Recursive
        // until their sections are replaced. Removed in Task 13.
        display: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 6: Migrate every legacy utility class**

Write this one-off script to the OS temp directory (it is not committed) and run it from the repo root:

```bash
cat > "${TMPDIR:-/tmp}/migrate-tokens.mjs" <<'JS'
import fs from 'node:fs'
import path from 'node:path'

const PREFIX = '(bg|text|border|ring|divide|outline|placeholder|from|via|to|fill|stroke)'
const rule = (name, to) => [new RegExp(`(?<![\\w-])${PREFIX}-${name}(?![\\w-])`, 'g'), `$1-${to}`]

// Order matters. Compound names go first, and the legacy `accent` surface is
// renamed before `primary` becomes the new `accent`; the legacy `bg-muted`
// surface is renamed before `muted-foreground` becomes the new `muted`.
const RULES = [
  rule('accent-foreground', 'ink'),
  rule('accent', 'line-strong'),
  rule('primary-foreground', 'on-accent'),
  rule('primary', 'accent'),
  [/(?<![\w-])bg-muted(?![\w-])/g, 'bg-panel'],
  rule('muted-foreground', 'muted'),
  rule('card-foreground', 'ink'),
  rule('secondary-foreground', 'muted-strong'),
  rule('popover-foreground', 'ink'),
  rule('foreground', 'ink'),
  rule('background', 'canvas'),
  rule('card', 'panel'),
  rule('popover', 'panel'),
  rule('secondary', 'panel'),
  rule('border', 'line'),
  rule('input', 'line'),
]

const walk = (dir) => fs.readdirSync(dir).flatMap((e) => {
  const full = path.join(dir, e)
  return fs.statSync(full).isDirectory() ? walk(full) : /\.tsx?$/.test(full) ? [full] : []
})

for (const file of ['app', 'components'].flatMap(walk)) {
  const before = fs.readFileSync(file, 'utf8')
  let after = before
  for (const [re, to] of RULES) after = after.replace(re, to)
  if (after !== before) {
    fs.writeFileSync(file, after)
    console.log('migrated', file)
  }
}
JS
node "${TMPDIR:-/tmp}/migrate-tokens.mjs"
```

Expected: a list of roughly a dozen `migrated …` lines.

- [ ] **Step 7: Remove the chat widget's dead glow style**

In `components/ui/chat-widget.tsx`, delete this prop from the main chat button, including its surrounding `style={{ … }}`:

```tsx
              style={{
                boxShadow: '0 4px 20px rgba(var(--primary-rgb, 220, 38, 38), 0.4), 0 0 40px rgba(var(--primary-rgb, 220, 38, 38), 0.2)'
              }}
```

`--primary-rgb` was never defined anywhere, so this has always rendered its hardcoded red fallback.

- [ ] **Step 8: Switch fonts and the theme default in `app/layout.tsx`**

Replace the font import:

```tsx
import { Plus_Jakarta_Sans, Fraunces } from 'next/font/google'
```

with:

```tsx
import { Recursive } from 'next/font/google'
```

and replace the two `const` font declarations (`plusJakartaSans` and `fraunces`) with:

```tsx
// One variable family for both voices. Its MONO axis turns the same face
// monospaced for labels, numerals and domains — `.font-mono` and `.eyebrow`
// set it in globals.css. Loading only the MONO axis (weight is included by
// default for variable fonts) keeps the file small.
const recursive = Recursive({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  axes: ['MONO'],
})
```

Replace the `<html>` and `<body>` opening tags:

```tsx
    <html lang="en" suppressHydrationWarning className={recursive.variable}>
      <body>
```

And replace the `ThemeProvider` props so dark is the committed default:

```tsx
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
```

Finally, in the wrapper `<div className="min-h-screen bg-background text-foreground">` — which the Step 6 script has already rewritten to `bg-canvas text-ink` — confirm the classes read `min-h-screen bg-canvas text-ink`.

- [ ] **Step 9: Run the design tests to verify they pass**

Run: `npm test -- tests/design`
Expected: PASS — 38 contrast assertions (19 per theme) and 2 legacy assertions.

- [ ] **Step 10: Run the full gate**

Run: `npm run type-check && npm run lint && npm test && npm run build`
Expected: all pass.

- [ ] **Step 11: Look at it**

Run `npm run dev` and open `http://localhost:3000` in both themes. The existing layout should now render in warm graphite with amber accents and Recursive type, with mono labels visibly monospaced. Layout is unchanged — that is Tasks 6–11. Note anything unreadable in the task report; do not fix layout here.

- [ ] **Step 12: Commit**

```bash
git add app/globals.css tailwind.config.js app/layout.tsx app components tests/design
git commit -m "style: replace the colour system and type with B3 Signal tokens

Atomic by necessity: the new --muted and --accent collide with legacy tokens
that meant different things, so both systems cannot coexist. Every legacy
utility class is migrated in the same commit. A contrast test now checks every
text and glyph pair in both themes against WCAG, and a second test keeps legacy
utilities from coming back.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Positioning data and metadata

**Files:**
- Create: `lib/site-metadata.ts`, `tests/content/positioning.test.ts`
- Modify: `lib/data.ts`, `lib/chat-context.ts`, `app/layout.tsx`

**Interfaces:**
- Consumes: `projects`, `skills`, `contactInfo` from `lib/data.ts`
- Produces:
  - `heroContent: { name: string; title: string; location: string; lede: string; readonly specialism: string; stack: string[]; proofPoints: string[] }`
  - `availability: string`, `resumeUrl: string`
  - `sectionContent: { work, systems, changelog, stack, contact }`, each `{ eyebrow: string; title: string }`; `systems` also has `cta: string`
  - `projectsPageContent: { eyebrow: string; title: string; description: string }`
  - `navigationItems: NavigationItem[]` with hrefs `#work`, `#changelog`, `#stack`, `#contact`
  - `buildSiteMetadata(siteUrl: string): Metadata` from `@/lib/site-metadata`

- [ ] **Step 1: Write the failing test**

Create `tests/content/positioning.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { buildPortfolioContext } from '@/lib/chat-context'
import {
  availability,
  heroContent,
  navigationItems,
  projects,
  resumeUrl,
  sectionContent,
  skills,
} from '@/lib/data'
import { buildSiteMetadata } from '@/lib/site-metadata'
import { existsSync } from 'node:fs'

describe('positioning', () => {
  it('leads with the full-stack title', () => {
    expect(heroContent.title).toBe('Full-stack developer')
  })

  it('states the same number of production sites as the Sites band holds', () => {
    const sites = projects.filter((p) => p.band === 'Sites').length
    const claimed = Number(heroContent.specialism.match(/(\d+) production sites/)?.[1])
    expect(claimed).toBe(sites)
  })

  it('only names stack chips that exist in the skills list', () => {
    const ids = skills.map((s) => s.id)
    for (const id of heroContent.stack) expect(ids).toContain(id)
  })

  it('states availability and gives it to the assistant', () => {
    expect(availability.trim()).not.toBe('')
    const context = buildPortfolioContext()
    expect(context).toContain(availability)
    expect(context).toContain(heroContent.specialism)
  })

  it('points the résumé link at a file that exists', () => {
    expect(existsSync(`public${resumeUrl}`)).toBe(true)
  })

  it('gives every section a heading', () => {
    for (const section of Object.values(sectionContent)) {
      expect(section.eyebrow.startsWith('// ')).toBe(true)
      expect(section.title.trim()).not.toBe('')
    }
  })

  it('navigates to the four homepage sections', () => {
    expect(navigationItems.map((n) => n.href)).toEqual(['#work', '#changelog', '#stack', '#contact'])
  })
})

describe('site metadata', () => {
  const metadata = buildSiteMetadata('https://example.test')
  const serialized = JSON.stringify(metadata)

  it('titles the site with the current positioning', () => {
    expect(String(metadata.title)).toContain(heroContent.title)
    expect(metadata.description).toBe(heroContent.lede)
  })

  it('no longer calls Christian a software engineer or frontend developer', () => {
    expect(serialized).not.toMatch(/software engineer/i)
    expect(serialized).not.toMatch(/frontend developer/i)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- tests/content/positioning.test.ts`
Expected: FAIL — `availability` is not exported from `@/lib/data`, and `@/lib/site-metadata` cannot be resolved.

- [ ] **Step 3: Update `heroContent` in `lib/data.ts`**

Replace the whole `heroContent` declaration with:

```ts
// Positioning stays broad, so the entire differentiation burden sits on these
// claims. Every one is checkable against the data below. No years-of-experience
// figure is claimed; the dated timeline carries that.
export const heroContent = {
  name: 'Christian Raro',
  title: 'Full-stack developer',
  location: 'Naga City',
  lede: 'I build products, WordPress platforms, and the systems between them — from Naga City, for clients anywhere.',
  // A getter, not a value: `projects` is declared further down this file, and
  // reading it eagerly here would hit the temporal dead zone at module load.
  get specialism(): string {
    const sites = projects.filter((p) => p.band === 'Sites').length
    return `WordPress specialist · ${sites} production sites · WooCommerce`
  },
  // Skill ids for the hero chips; tests/content/positioning.test.ts checks each exists.
  stack: ['nextjs', 'typescript', 'supabase', 'wordpress', 'woocommerce'],
  proofPoints: [
    'Three products of my own',
    'Fifteen projects shipped',
    'Four payment gateways',
    'One NFC card system',
  ],
}

export const availability = 'Open to freelance and full-time roles'

export const resumeUrl = '/assets/resume/Raro, Christian F - Resume (DEV).pdf'
```

- [ ] **Step 4: Add section copy and replace `navigationItems` in `lib/data.ts`**

Replace the existing `navigationItems` declaration with:

```ts
export const navigationItems: NavigationItem[] = [
  { label: 'Work', href: '#work' },
  { label: 'Changelog', href: '#changelog' },
  { label: 'Stack', href: '#stack' },
  { label: 'Contact', href: '#contact' },
]

// Headings for each homepage section. The Field log uses `galleryContent`.
export const sectionContent = {
  work: { eyebrow: '// products', title: 'Products of my own' },
  systems: {
    eyebrow: '// systems',
    title: 'Custom systems and client work',
    cta: 'Browse every project',
  },
  changelog: { eyebrow: '// changelog', title: "Where I've worked" },
  stack: { eyebrow: '// stack', title: 'What I ship with' },
  contact: { eyebrow: '// contact', title: 'Start a project' },
}

export const projectsPageContent = {
  eyebrow: '// all projects',
  title: 'Everything I have shipped',
  description: 'Products of my own, custom systems, and client work — each with its live status.',
}
```

Add `NavigationItem` to the `@/types` import at the top of `lib/data.ts`.

- [ ] **Step 5: Create `lib/site-metadata.ts`**

```ts
import type { Metadata } from 'next'
import { heroContent } from '@/lib/data'

// Built from heroContent so the page, the chat assistant and every link preview
// state the same positioning. The old hand-typed metadata said "Software
// Engineer & Frontend Developer" long after the page stopped saying it.
export function buildSiteMetadata(siteUrl: string): Metadata {
  const title = `${heroContent.name} — ${heroContent.title}`
  const description = heroContent.lede
  const image = { url: '/assets/images/og-image.png', width: 1200, height: 630, alt: title }

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: [
      heroContent.name,
      heroContent.title,
      'WordPress specialist',
      'Next.js',
      'WooCommerce',
      'Naga City',
      'Philippines',
    ],
    authors: [{ name: heroContent.name }],
    creator: heroContent.name,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      title,
      description,
      siteName: heroContent.name,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}
```

- [ ] **Step 6: Use it in `app/layout.tsx`**

Replace the whole `export const metadata: Metadata = { … }` object with:

```tsx
export const metadata: Metadata = buildSiteMetadata(siteUrl)
```

and add the import:

```tsx
import { buildSiteMetadata } from '@/lib/site-metadata'
```

- [ ] **Step 7: Give the assistant specialism and availability**

In `lib/chat-context.ts`, add `availability` to the `@/lib/data` import list, and in the `OWNER INFORMATION:` block add these two lines directly after the `- Title:` line:

```
- Specialism: ${heroContent.specialism}
- Availability: ${availability}
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — every suite, including the existing `proof-band` and `chat-context` suites.

- [ ] **Step 9: Run the full gate**

Run: `npm run type-check && npm run lint && npm test && npm run build`
Expected: all pass.

- [ ] **Step 10: Commit**

```bash
git add lib/data.ts lib/site-metadata.ts lib/chat-context.ts app/layout.tsx tests/content/positioning.test.ts
git commit -m "content: full-stack positioning, availability, and derived metadata

The H1 becomes Full-stack developer. The WordPress specialism line derives its
site count from the Sites band. Metadata is now built from heroContent, which
retires the stale Software Engineer and Frontend Developer titles.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Status language

**Files:**
- Create: `lib/display-status.ts`, `components/ui/status-badge.tsx`, `tests/content/display-status.test.ts`, `tests/components/status-badge.test.tsx`
- Modify: `types/index.ts`, `vitest.config.ts`

**Interfaces:**
- Consumes: `ProjectStatus` from `@/types`
- Produces:
  - `type DisplayStatus = 'live' | 'early-access' | 'private' | 'internal'` in `@/types`
  - `displayStatus(status: ProjectStatus): DisplayStatus` and `DISPLAY_STATUS_LABEL: Record<DisplayStatus, string>` from `@/lib/display-status`
  - `<StatusBadge status={ProjectStatus} compact?={boolean} className?={string} />` from `@/components/ui/status-badge`
  - Markup tests: `tests/**/*.test.tsx` run under Vitest with the automatic JSX runtime

- [ ] **Step 1: Let Vitest run `.tsx` tests**

Replace `vitest.config.ts` with:

```ts
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Markup tests render server components with react-dom/server. The project's
  // tsconfig uses `jsx: preserve` for Next, so Vitest needs its own transform.
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
})
```

- [ ] **Step 2: Write the failing mapping test**

Create `tests/content/display-status.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { DISPLAY_STATUS_LABEL, displayStatus } from '@/lib/display-status'
import { projects } from '@/lib/data'
import type { ProjectStatus } from '@/types'

const ALL: ProjectStatus[] = ['live', 'early-access', 'auth-gated', 'ua-gated', 'internal']

describe('displayStatus', () => {
  it('maps every data status to a labelled display status', () => {
    for (const status of ALL) {
      const display = displayStatus(status)
      expect(DISPLAY_STATUS_LABEL[display]).toBeTruthy()
    }
  })

  it('shows UA-gated sites as live, because to a visitor they are', () => {
    expect(displayStatus('ua-gated')).toBe('live')
  })

  it('calls the auth-gated panel private', () => {
    expect(displayStatus('auth-gated')).toBe('private')
  })

  it('handles every status actually used in the inventory', () => {
    for (const project of projects) {
      expect(DISPLAY_STATUS_LABEL[displayStatus(project.status)]).toBeTruthy()
    }
  })
})
```

- [ ] **Step 3: Write the failing markup test**

Create `tests/components/status-badge.test.tsx`:

```tsx
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { StatusBadge } from '@/components/ui/status-badge'
import type { ProjectStatus } from '@/types'

const CASES: [ProjectStatus, string][] = [
  ['live', 'Live'],
  ['ua-gated', 'Live'],
  ['early-access', 'Early access'],
  ['auth-gated', 'Private'],
  ['internal', 'Internal'],
]

describe('StatusBadge', () => {
  it.each(CASES)('renders %s with the text label "%s"', (status, label) => {
    const html = renderToStaticMarkup(<StatusBadge status={status} />)
    expect(html).toContain(`>${label}<`)
  })

  it('keeps the label in the accessibility tree when compact', () => {
    const html = renderToStaticMarkup(<StatusBadge status="live" compact />)
    expect(html).toContain('sr-only')
    expect(html).toContain('>Live<')
  })

  it('hides the glyph from assistive technology', () => {
    const html = renderToStaticMarkup(<StatusBadge status="auth-gated" />)
    expect(html).toContain('aria-hidden="true"')
  })

  it('pulses only the live glyph', () => {
    expect(renderToStaticMarkup(<StatusBadge status="live" />)).toContain('live-pulse')
    expect(renderToStaticMarkup(<StatusBadge status="early-access" />)).not.toContain('live-pulse')
  })
})
```

- [ ] **Step 4: Run them to verify they fail**

Run: `npm test -- tests/content/display-status.test.ts tests/components`
Expected: FAIL — cannot resolve `@/lib/display-status` or `@/components/ui/status-badge`.

- [ ] **Step 5: Add the type**

In `types/index.ts`, directly after the `ProjectStatus` type, add:

```ts
// What a visitor sees. Five data statuses collapse to four: `ua-gated` sites are
// live in any browser, and only the preview mechanism needs the distinction.
export type DisplayStatus = 'live' | 'early-access' | 'private' | 'internal'
```

- [ ] **Step 6: Create `lib/display-status.ts`**

```ts
import type { DisplayStatus, ProjectStatus } from '@/types'

// A Record, so adding a ProjectStatus is a compile error until it is mapped here.
const MAP: Record<ProjectStatus, DisplayStatus> = {
  live: 'live',
  'ua-gated': 'live',
  'early-access': 'early-access',
  'auth-gated': 'private',
  internal: 'internal',
}

export const DISPLAY_STATUS_LABEL: Record<DisplayStatus, string> = {
  live: 'Live',
  'early-access': 'Early access',
  private: 'Private',
  internal: 'Internal',
}

export function displayStatus(status: ProjectStatus): DisplayStatus {
  return MAP[status]
}
```

- [ ] **Step 7: Create `components/ui/status-badge.tsx`**

```tsx
import { cn } from '@/lib/utils'
import { DISPLAY_STATUS_LABEL, displayStatus } from '@/lib/display-status'
import type { DisplayStatus, ProjectStatus } from '@/types'

// Status is never colour alone: each one has its own glyph shape and always a
// text label. Amber is both the brand colour and the early-access colour, so
// the shape is what tells them apart.
function StatusGlyph({ status }: { status: DisplayStatus }) {
  if (status === 'private') {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 12 12"
        className="h-3 w-3 text-status-private"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="2.5" y="5.5" width="7" height="5" rx="1" />
        <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" />
      </svg>
    )
  }

  const shape: Record<Exclude<DisplayStatus, 'private'>, string> = {
    live: 'live-pulse relative h-2 w-2 rounded-full bg-live',
    'early-access': 'h-2 w-2 rounded-full border-[1.5px] border-status-early',
    internal: 'h-2 w-2 rounded-[1px] bg-status-internal',
  }
  return <span aria-hidden="true" className={cn('inline-block shrink-0', shape[status])} />
}

interface StatusBadgeProps {
  status: ProjectStatus
  /** Hide the label visually in dense layouts. It stays in the accessibility tree. */
  compact?: boolean
  className?: string
}

export function StatusBadge({ status, compact = false, className }: StatusBadgeProps) {
  const display = displayStatus(status)
  return (
    <span
      data-status={display}
      className={cn('inline-flex items-center gap-1.5 font-mono text-xs text-muted', className)}
    >
      <StatusGlyph status={display} />
      <span className={compact ? 'sr-only' : undefined}>{DISPLAY_STATUS_LABEL[display]}</span>
    </span>
  )
}
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npm test -- tests/content/display-status.test.ts tests/components`
Expected: PASS — 4 mapping tests and 8 markup tests.

- [ ] **Step 9: Run the full gate**

Run: `npm run type-check && npm run lint && npm test && npm run build`
Expected: all pass.

- [ ] **Step 10: Commit**

```bash
git add types/index.ts lib/display-status.ts components/ui/status-badge.tsx vitest.config.ts tests/content/display-status.test.ts tests/components
git commit -m "feat(ui): status language — a glyph and a label for every status

Amber is both the brand colour and the early-access colour, so status is told
apart by shape and always labelled. Adds markup tests that render server
components with react-dom/server.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Systems board and `/projects`

**Files:**
- Create: `lib/board.ts`, `components/ui/board-row.tsx`, `components/ui/systems-board.tsx`, `components/ui/board-filter.tsx`, `tests/content/board.test.ts`, `tests/components/board-row.test.tsx`
- Modify: `app/projects/page.tsx` (rewrite)

**Interfaces:**
- Consumes: `StatusBadge` (Task 4); `projectsPageContent` (Task 3); `extractDomain(url: string): string` and `cn` from `@/lib/utils`
- Produces:
  - `interface BoardGroup { heading: string; projects: Project[] }`
  - `groupByBand(projects: Project[]): BoardGroup[]` — one group per band in `BAND_ORDER`, empty groups dropped
  - `groupForHomepage(projects: Project[]): BoardGroup[]` — `Custom systems`, then `Client work` (Applications + Sites)
  - `bandSlug(band: ProjectBand): string` and `parseBandParam(value: string | string[] | undefined): ProjectBand | null`
  - `<BoardRow project={Project} />`, `<SystemsBoard groups={BoardGroup[]} label={string} groupHeading={'h2' | 'h3'} />`, `<BoardFilter active={ProjectBand | null} />`

- [ ] **Step 1: Write the failing logic test**

Create `tests/content/board.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { bandSlug, groupByBand, groupForHomepage, parseBandParam } from '@/lib/board'
import { projects } from '@/lib/data'
import { BAND_ORDER } from '@/types'

describe('groupByBand', () => {
  it('groups every project exactly once, in BAND_ORDER', () => {
    const groups = groupByBand(projects)
    expect(groups.map((g) => g.heading)).toEqual([...BAND_ORDER])
    expect(groups.flatMap((g) => g.projects)).toHaveLength(projects.length)
  })

  it('drops empty groups', () => {
    const products = projects.filter((p) => p.band === 'Products')
    expect(groupByBand(products).map((g) => g.heading)).toEqual(['Products'])
  })
})

describe('groupForHomepage', () => {
  it('shows custom systems, then applications and sites together as client work', () => {
    const rest = projects.filter((p) => p.band !== 'Products')
    const groups = groupForHomepage(rest)
    expect(groups.map((g) => g.heading)).toEqual(['Custom systems', 'Client work'])
    expect(groups[1].projects.every((p) => p.band === 'Applications' || p.band === 'Sites')).toBe(true)
    expect(groups.flatMap((g) => g.projects)).toHaveLength(rest.length)
  })
})

describe('band parameter', () => {
  it('round-trips every band through its slug', () => {
    for (const band of BAND_ORDER) expect(parseBandParam(bandSlug(band))).toBe(band)
  })

  it('uses URL-safe slugs', () => {
    expect(bandSlug('Custom systems')).toBe('custom-systems')
  })

  it('treats a missing or unknown band as "all"', () => {
    expect(parseBandParam(undefined)).toBeNull()
    expect(parseBandParam('nonsense')).toBeNull()
    expect(parseBandParam(['sites', 'products'])).toBe('Sites')
  })
})
```

- [ ] **Step 2: Write the failing markup test**

Create `tests/components/board-row.test.tsx`:

```tsx
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { BoardRow } from '@/components/ui/board-row'
import { projects } from '@/lib/data'

describe('BoardRow', () => {
  it('links a project with a live URL, opening in a new tab safely', () => {
    const giya = projects.find((p) => p.slug === 'giya')!
    const html = renderToStaticMarkup(<BoardRow project={giya} />)
    expect(html).toContain('href="https://giya.ph"')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  it('renders a project with no URL as a plain row, not a dead link', () => {
    const nfc = projects.find((p) => p.slug === 'beachbus-nfc-card-system')!
    const html = renderToStaticMarkup(<BoardRow project={nfc} />)
    expect(html).not.toContain('<a')
  })

  it('never renders href="#" for any project', () => {
    for (const project of projects) {
      expect(renderToStaticMarkup(<BoardRow project={project} />)).not.toContain('href="#"')
    }
  })

  it('always states the status in words', () => {
    for (const project of projects) {
      expect(renderToStaticMarkup(<BoardRow project={project} />)).toMatch(/>(Live|Early access|Private|Internal)</)
    }
  })
})
```

- [ ] **Step 3: Run them to verify they fail**

Run: `npm test -- tests/content/board.test.ts tests/components/board-row.test.tsx`
Expected: FAIL — cannot resolve `@/lib/board` or `@/components/ui/board-row`.

- [ ] **Step 4: Create `lib/board.ts`**

```ts
import { BAND_ORDER, type Project, type ProjectBand } from '@/types'

export interface BoardGroup {
  heading: string
  projects: Project[]
}

/** One group per band, in the canonical BAND_ORDER, with empty groups dropped. */
export function groupByBand(projects: Project[]): BoardGroup[] {
  return BAND_ORDER.map((band) => ({
    heading: band,
    projects: projects.filter((p) => p.band === band),
  })).filter((group) => group.projects.length > 0)
}

/**
 * The homepage shows Applications and Sites together as "Client work" — that is
 * the distinction a visiting client cares about. /projects keeps every band.
 */
export function groupForHomepage(projects: Project[]): BoardGroup[] {
  return [
    { heading: 'Custom systems', projects: projects.filter((p) => p.band === 'Custom systems') },
    {
      heading: 'Client work',
      projects: projects.filter((p) => p.band === 'Applications' || p.band === 'Sites'),
    },
  ].filter((group) => group.projects.length > 0)
}

export function bandSlug(band: ProjectBand): string {
  return band.toLowerCase().replace(/\s+/g, '-')
}

/** Reads `?band=` from /projects. Missing or unknown means "show everything". */
export function parseBandParam(value: string | string[] | undefined): ProjectBand | null {
  const slug = Array.isArray(value) ? value[0] : value
  return BAND_ORDER.find((band) => bandSlug(band) === slug) ?? null
}
```

- [ ] **Step 5: Create `components/ui/board-row.tsx`**

```tsx
import { ArrowUpRight } from 'lucide-react'
import { StatusBadge } from '@/components/ui/status-badge'
import { cn, extractDomain } from '@/lib/utils'
import type { Project } from '@/types'

const GRID =
  'grid grid-cols-[1fr_auto] items-center gap-4 border-t border-line px-4 py-3 ' +
  'sm:grid-cols-[1.2fr_1fr_auto] md:grid-cols-[1.2fr_1fr_1.3fr_auto]'

// A row links only when there is somewhere to go. A project with no live URL
// renders as a plain row rather than a focusable href="#".
export function BoardRow({ project }: { project: Project }) {
  const href = project.links.live

  const cells = (
    <>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 font-medium text-ink">
          {project.title}
          {href && (
            <ArrowUpRight
              aria-hidden="true"
              className="h-3.5 w-3.5 text-accent opacity-0 transition-opacity group-hover:opacity-100"
            />
          )}
        </span>
        <span className="block font-mono text-xs text-muted">{project.band}</span>
      </span>
      <span className="hidden truncate font-mono text-xs text-muted sm:block">
        {href ? extractDomain(href) : '—'}
      </span>
      <span className="hidden truncate font-mono text-xs text-muted md:block">
        {project.technologies.slice(0, 3).join(' · ')}
      </span>
      <StatusBadge status={project.status} className="justify-self-end" />
    </>
  )

  if (!href) return <li className={GRID}>{cells}</li>

  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          GRID,
          'group relative transition-colors hover:bg-canvas/60',
          'before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-accent',
          'before:opacity-0 before:transition-opacity hover:before:opacity-100',
        )}
      >
        {cells}
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </li>
  )
}
```

- [ ] **Step 6: Create `components/ui/systems-board.tsx`**

```tsx
import { BoardRow } from '@/components/ui/board-row'
import type { BoardGroup } from '@/lib/board'

interface SystemsBoardProps {
  groups: BoardGroup[]
  /** Shown in the board's header bar, e.g. "systems". */
  label: string
  /** h3 on the homepage, where the section title is the h2; h2 on /projects. */
  groupHeading: 'h2' | 'h3'
}

export function SystemsBoard({ groups, label, groupHeading: Heading }: SystemsBoardProps) {
  const total = groups.reduce((n, g) => n + g.projects.length, 0)

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-panel">
      <div className="flex justify-between border-b border-line px-4 py-2.5 font-mono text-xs text-muted">
        <span>
          {label} · {total}
        </span>
        <span>status</span>
      </div>
      {groups.map((group) => {
        const id = `board-${group.heading.toLowerCase().replace(/\s+/g, '-')}`
        return (
          <section key={group.heading} aria-labelledby={id}>
            <Heading
              id={id}
              className="px-4 pb-2 pt-5 font-mono text-xs font-medium uppercase tracking-[0.1em] text-accent"
            >
              {group.heading}
            </Heading>
            <ul>
              {group.projects.map((project) => (
                <BoardRow key={project.id} project={project} />
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 7: Create `components/ui/board-filter.tsx`**

```tsx
import Link from 'next/link'
import { bandSlug } from '@/lib/board'
import { cn } from '@/lib/utils'
import { BAND_ORDER, type ProjectBand } from '@/types'

// Plain links, not client state: filtering needs no JavaScript and every
// filtered view has a URL you can share.
export function BoardFilter({ active }: { active: ProjectBand | null }) {
  const items = [
    { label: 'All', href: '/projects', current: active === null },
    ...BAND_ORDER.map((band) => ({
      label: band,
      href: `/projects?band=${bandSlug(band)}`,
      current: active === band,
    })),
  ]

  return (
    <nav aria-label="Filter projects by band">
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={cn(
                'inline-flex min-h-[32px] items-center rounded border px-3 font-mono text-xs transition-colors',
                item.current
                  ? 'border-accent text-accent'
                  : 'border-line-strong text-muted-strong hover:border-accent hover:text-accent',
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

- [ ] **Step 8: Rewrite `app/projects/page.tsx`**

Replace the whole file:

```tsx
import { BoardFilter } from '@/components/ui/board-filter'
import { SystemsBoard } from '@/components/ui/systems-board'
import { groupByBand, parseBandParam } from '@/lib/board'
import { projects, projectsPageContent } from '@/lib/data'

interface ProjectsPageProps {
  searchParams: { band?: string | string[] }
}

// Filters on the server from ?band=, so this page ships no JavaScript of its
// own. Reading search params makes it render dynamically rather than at build
// time; for fifteen rows of static data that costs nothing a visitor notices.
export default function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const band = parseBandParam(searchParams.band)
  const visible = band ? projects.filter((p) => p.band === band) : projects

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
      <p className="eyebrow mb-3">{projectsPageContent.eyebrow}</p>
      <h1 className="text-fluid-h1 mb-4 text-ink">{projectsPageContent.title}</h1>
      <p className="mb-8 max-w-2xl text-lg text-muted-strong">{projectsPageContent.description}</p>
      <div className="mb-6">
        <BoardFilter active={band} />
      </div>
      <SystemsBoard groups={groupByBand(visible)} label={band ?? 'all projects'} groupHeading="h2" />
    </div>
  )
}
```

- [ ] **Step 9: Run the tests to verify they pass**

Run: `npm test -- tests/content/board.test.ts tests/components/board-row.test.tsx`
Expected: PASS — 7 logic tests and 4 markup tests.

- [ ] **Step 10: Run the full gate and look at it**

Run: `npm run type-check && npm run lint && npm test && npm run build`
Expected: all pass; the build output lists `/projects` as dynamic (`ƒ`).

Then `npm run dev`, open `/projects` and `/projects?band=sites` in both themes, and tab through the filter and rows. Every row with a URL should be reachable by keyboard; the BeachBus NFC row should not be.

- [ ] **Step 11: Commit**

```bash
git add lib/board.ts components/ui/board-row.tsx components/ui/systems-board.tsx components/ui/board-filter.tsx app/projects/page.tsx tests/content/board.test.ts tests/components/board-row.test.tsx
git commit -m "feat(projects): server-rendered systems board with a no-JS band filter

Replaces the card grid and its useState filter. Rows without a live URL render
as plain rows, which fixes the focusable href=\"#\" the Phase 1 review found.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Chrome — top bar, skip link, footer, page scaffold

**Files:**
- Create: `components/top-bar.tsx`
- Modify: `app/layout.tsx`, `components/footer.tsx` (rewrite), `app/page.tsx` (rewrite)
- Delete: `components/navigation.tsx`

**Interfaces:**
- Consumes: `availability`, `navigationItems`, `contactInfo`, `heroContent` from `@/lib/data`
- Produces: `<TopBar />`; `<main id="main">`; `app/page.tsx` as a **server component** with each section in its final order, legacy sections wrapped in `<LegacySlot>` until replaced

- [ ] **Step 1: Create `components/top-bar.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { availability, navigationItems } from '@/lib/data'

export function TopBar() {
  const { resolvedTheme, setTheme } = useTheme()
  // The theme is unknown until mount; render a same-sized placeholder icon
  // before then so the server and client markup match.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = resolvedTheme !== 'light'

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-2 px-5 py-3 sm:px-8">
        <Link href="/" className="font-mono text-sm text-ink">
          ~/christian-raro
        </Link>

        <div className="flex items-center gap-3 md:order-last">
          <span className="hidden items-center gap-2 font-mono text-xs text-accent sm:inline-flex">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            {availability}
          </span>
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="inline-flex h-9 w-9 items-center justify-center rounded border border-line-strong text-muted-strong transition-colors hover:border-accent hover:text-accent"
          >
            {mounted ? (
              isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
            ) : (
              <span className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav aria-label="Primary" className="w-full md:w-auto">
          <ul className="flex gap-6 overflow-x-auto font-mono text-xs text-muted-strong">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={`/${item.href}`}
                  className="inline-flex min-h-[32px] items-center transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
```

Nav links are written as `/#work` so they work from `/projects` as well as the homepage.

- [ ] **Step 2: Rewrite `components/footer.tsx`**

```tsx
import { contactInfo, heroContent } from '@/lib/data'

export function Footer() {
  const links = contactInfo.socialLinks.filter((link) => link.icon !== 'mail')

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()} {heroContent.name}
        </p>
        <ul className="flex gap-5">
          {links.map((link) => (
            <li key={link.name}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[32px] items-center transition-colors hover:text-accent"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Replace the chrome in `app/layout.tsx`**

Replace the import `import { Navigation } from '@/components/navigation'` with `import { TopBar } from '@/components/top-bar'`, and replace the body of `<ToastProvider>` with:

```tsx
          <ToastProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
            >
              Skip to content
            </a>
            <div className="min-h-screen bg-canvas text-ink">
              <TopBar />
              <main id="main">{children}</main>
              <Footer />
              <ChatWidget />
            </div>
          </ToastProvider>
```

- [ ] **Step 4: Delete the old navigation**

```bash
git rm components/navigation.tsx
```

- [ ] **Step 5: Rewrite `app/page.tsx` as a server component in final section order**

```tsx
import type { ReactNode } from 'react'
import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { WorksSection } from '@/components/sections/works-section'
import { GallerySection } from '@/components/sections/gallery-section'
import { RecommendationsSection } from '@/components/sections/recommendations-section'
import { ExperienceSection } from '@/components/sections/experience-section'
import { SkillsSection } from '@/components/sections/skills-section'
import { ContactSection } from '@/components/sections/contact-section'

// Pre-4.0 sections relied on the old page's max-w-4xl wrapper. Each keeps it
// until the task that replaces it; new sections manage their own width.
function LegacySlot({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-4xl px-4 sm:px-6">{children}</div>
}

// Section order is final (spec §6). Tasks 7–11 each swap one slot.
export default function HomePage() {
  return (
    <>
      <LegacySlot>
        <HeroSection />
        <AboutSection />
      </LegacySlot>
      <LegacySlot>
        <WorksSection />
      </LegacySlot>
      <LegacySlot>
        <GallerySection />
        <RecommendationsSection />
      </LegacySlot>
      <LegacySlot>
        <ExperienceSection />
        <SkillsSection />
      </LegacySlot>
      <LegacySlot>
        <ContactSection />
      </LegacySlot>
    </>
  )
}
```

Every imported section already declares `'use client'` itself, so dropping it from the page is safe.

- [ ] **Step 6: Run the full gate**

Run: `npm run type-check && npm run lint && npm test && npm run build`
Expected: all pass.

- [ ] **Step 7: Look at it**

`npm run dev`. Check: the top bar is sticky on `/` and `/projects`; the first Tab press reveals "Skip to content", and Enter moves focus past the bar; nav links scroll to their sections (Changelog and Stack will land on the legacy experience/skills block until Task 10 gives them their `id`s); the theme toggle swaps themes without a flash of the wrong icon.

- [ ] **Step 8: Commit**

```bash
git add components/top-bar.tsx components/footer.tsx app/layout.tsx app/page.tsx
git commit -m "feat(chrome): sticky top bar with availability, skip link, server-rendered page

Gives the homepage the real navigation Phase 1 asked for and makes the page a
server component, with every section in its final order.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Hero and proof band

**Files:**
- Create: `lib/proof.ts`, `components/ui/proof-band.tsx`, `components/sections/hero.tsx`, `tests/content/proof.test.ts`
- Modify: `app/page.tsx`, `lib/data.ts` (remove `achievements`), `types/index.ts` (remove `Achievement`)
- Delete: `components/sections/hero-section.tsx`, `components/sections/about-section.tsx`

**Interfaces:**
- Consumes: `heroContent`, `resumeUrl`, `skills` (Task 3); `ImageLightbox({ src, alt, children, className })` from `@/components/ui/image-lightbox`
- Produces: `splitProofPoint(point: string): { value: string; label: string }`; `<ProofBand />`; `<Hero />`

- [ ] **Step 1: Write the failing test**

Create `tests/content/proof.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { heroContent, paymentGateways, projects } from '@/lib/data'
import { splitProofPoint } from '@/lib/proof'

describe('splitProofPoint', () => {
  it('turns the leading number word into a two-digit numeral', () => {
    expect(splitProofPoint('Fifteen projects shipped')).toEqual({ value: '15', label: 'projects shipped' })
    expect(splitProofPoint('One NFC card system')).toEqual({ value: '01', label: 'NFC card system' })
  })

  it('parses every proof point on the page', () => {
    for (const point of heroContent.proofPoints) {
      expect(splitProofPoint(point).value).toMatch(/^\d{2}$/)
    }
  })

  it('shows numerals that agree with the data', () => {
    const [products, shipped, gateways] = heroContent.proofPoints.map((p) => Number(splitProofPoint(p).value))
    expect(products).toBe(projects.filter((p) => p.band === 'Products').length)
    expect(shipped).toBe(projects.length)
    expect(gateways).toBe(paymentGateways.length)
  })

  it('refuses a point that does not start with a number word', () => {
    expect(() => splitProofPoint('Several projects')).toThrow()
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- tests/content/proof.test.ts`
Expected: FAIL — cannot resolve `@/lib/proof`.

- [ ] **Step 3: Create `lib/proof.ts`**

```ts
const NUMBER_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
}

/**
 * "Fifteen projects shipped" → { value: '15', label: 'projects shipped' }.
 * The proof points are written as sentences so they read correctly anywhere;
 * the proof band sets the number as a mono numeral. Throws rather than guessing
 * when a point does not start with a number word.
 */
export function splitProofPoint(point: string): { value: string; label: string } {
  const [first, ...rest] = point.split(' ')
  const n = NUMBER_WORDS[first.toLowerCase()]
  if (n === undefined) throw new Error(`Proof point must start with a number word: "${point}"`)
  return { value: String(n).padStart(2, '0'), label: rest.join(' ') }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/content/proof.test.ts`
Expected: PASS — 4 tests.

- [ ] **Step 5: Create `components/ui/proof-band.tsx`**

```tsx
import { heroContent } from '@/lib/data'
import { splitProofPoint } from '@/lib/proof'

// Screen readers hear the original sentence ("Fifteen projects shipped"), not
// "zero one five"; the numeral and label are visual only.
export function ProofBand() {
  return (
    <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-4">
      {heroContent.proofPoints.map((point) => {
        const { value, label } = splitProofPoint(point)
        return (
          <li key={point} className="flex flex-col bg-canvas px-4 py-4">
            <span className="sr-only">{point}</span>
            <span aria-hidden="true" className="font-mono text-3xl font-medium text-ink">
              {value}
            </span>
            <span aria-hidden="true" className="mt-1 text-sm text-muted">
              {label}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
```

- [ ] **Step 6: Create `components/sections/hero.tsx`**

```tsx
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { ProofBand } from '@/components/ui/proof-band'
import { heroContent, resumeUrl, skills } from '@/lib/data'
import { cn } from '@/lib/utils'
import type { Skill } from '@/types'

const PORTRAIT = '/assets/images/about/profile-hiking.jpg'

const SECONDARY_CTA =
  'inline-flex min-h-[44px] items-center rounded border border-line-strong px-5 font-medium text-ink transition-colors hover:border-accent hover:text-accent'

export function Hero() {
  const chips = heroContent.stack
    .map((id) => skills.find((s) => s.id === id))
    .filter((s): s is Skill => Boolean(s))

  return (
    <section id="top" aria-labelledby="hero-title" className="border-b border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-10 pt-14 sm:px-8 md:grid-cols-[1fr_auto] md:items-end md:pt-20">
        <div>
          <p className="eyebrow mb-4">
            {heroContent.name} · {heroContent.location}
          </p>
          <h1 id="hero-title" className="text-fluid-h1 text-ink">
            {heroContent.title}
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-5 max-w-[34rem] text-lg leading-relaxed text-muted-strong">{heroContent.lede}</p>
          <p className="mt-4 font-mono text-sm text-accent">{heroContent.specialism}</p>
          <ul aria-label="Core stack" className="mt-5 flex flex-wrap gap-2">
            {chips.map((skill) => (
              <li
                key={skill.id}
                className={cn(
                  'rounded border px-2.5 py-1 font-mono text-xs',
                  skill.id === 'wordpress'
                    ? 'border-accent text-accent'
                    : 'border-line-strong text-muted-strong',
                )}
              >
                {skill.name}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="inline-flex min-h-[44px] items-center gap-2 rounded bg-accent px-5 font-medium text-on-accent transition-colors hover:bg-accent/90"
            >
              Start a project
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className={SECONDARY_CTA}>
              Résumé
              <span className="sr-only">(PDF, opens in a new tab)</span>
            </a>
            <a href="#work" className={SECONDARY_CTA}>
              View work
            </a>
          </div>
        </div>

        <ImageLightbox src={PORTRAIT} alt={heroContent.name} className="justify-self-start md:justify-self-end">
          <span className="block rounded-lg border border-line-strong bg-panel p-1.5">
            <Image
              src={PORTRAIT}
              alt={heroContent.name}
              width={220}
              height={260}
              priority
              className="h-[260px] w-[220px] rounded object-cover"
            />
          </span>
        </ImageLightbox>
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-14 sm:px-8">
        <ProofBand />
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Swap the hero slot in `app/page.tsx`**

Replace:

```tsx
import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
```

with:

```tsx
import { Hero } from '@/components/sections/hero'
```

and replace:

```tsx
      <LegacySlot>
        <HeroSection />
        <AboutSection />
      </LegacySlot>
```

with:

```tsx
      <Hero />
```

The About section is retired: its content is now the hero lede and, from Task 10, the Changelog.

- [ ] **Step 8: Delete the old hero, the About section, and `achievements`**

```bash
git rm components/sections/hero-section.tsx components/sections/about-section.tsx
```

The old hero was the only reader of `achievements`. In `lib/data.ts`, delete the whole `export const achievements: Achievement[] = [ … ]` declaration and remove `Achievement` from the `@/types` import. In `types/index.ts`, delete the `Achievement` interface. Then confirm nothing else reads it:

Run: `grep -rn "achievements\|Achievement\b" app components lib tests types`
Expected: no output.

- [ ] **Step 9: Run the full gate and look at it**

Run: `npm run type-check && npm run lint && npm test && npm run build`
Expected: all pass.

Then `npm run dev` and check the hero at 360px, 768px and 1280px in both themes: the H1 should not wrap mid-word at 360px; the portrait opens its lightbox on click and on Enter; the CTA row wraps cleanly.

- [ ] **Step 10: Commit**

```bash
git add lib/proof.ts components/ui/proof-band.tsx components/sections/hero.tsx app/page.tsx lib/data.ts types/index.ts tests/content/proof.test.ts
git commit -m "feat(home): Operator hero with a derived proof band

Leads with Full-stack developer, the WordPress specialism line and the four
proof points as mono numerals. Start a project now leads the CTA row for a
freelance-first audience. Retires the About section, the verification badge,
and the achievements data only the old hero read.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Products and the systems section

**Files:**
- Create: `components/ui/product-panel.tsx`, `components/sections/products.tsx`, `components/sections/systems.tsx`
- Modify: `app/page.tsx`
- Delete: `components/sections/works-section.tsx`, `components/ui/project-card.tsx`, `components/ui/link-preview.tsx`

**Interfaces:**
- Consumes: `StatusBadge` (Task 4); `SystemsBoard`, `groupForHomepage` (Task 5); `sectionContent` (Task 3); `Reveal({ children, delay?, y?, className? })` from `@/components/ui/reveal`
- Produces: `<ProductPanel project={Project} />`, `<Products />` (section `id="work"`), `<Systems />` (section `id="systems"`)

**Motion (spec §9):** panels and the board reveal on mount through the existing `Reveal` primitive. The hero deliberately does **not**: `Reveal` renders at opacity 0 until hydration, and doing that to the H1 would delay the largest contentful paint and cost the Lighthouse Performance ≥ 90 target.

- [ ] **Step 1: Create `components/ui/product-panel.tsx`**

```tsx
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { StatusBadge } from '@/components/ui/status-badge'
import { extractDomain } from '@/lib/utils'
import type { Project } from '@/types'

export function ProductPanel({ project }: { project: Project }) {
  const href = project.links.live

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-panel">
      <div className="relative aspect-[16/10] border-b border-line bg-canvas">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} homepage`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-sm text-muted">
            {project.title}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-ink">{project.title}</h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="text-sm leading-relaxed text-muted-strong">{project.description}</p>
        <p className="font-mono text-xs text-muted">{project.technologies.slice(0, 4).join(' · ')}</p>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex min-h-[32px] items-center gap-1.5 font-mono text-sm text-accent hover:underline"
          >
            {extractDomain(href)}
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  )
}
```

- [ ] **Step 2: Create `components/sections/products.tsx`**

```tsx
import { ProductPanel } from '@/components/ui/product-panel'
import { Reveal } from '@/components/ui/reveal'
import { projects, sectionContent } from '@/lib/data'

export function Products() {
  const products = projects.filter((p) => p.band === 'Products')

  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
      <p className="eyebrow mb-3">{sectionContent.work.eyebrow}</p>
      <h2 id="work-title" className="text-fluid-h2 mb-8 text-ink">
        {sectionContent.work.title}
        <span className="ml-3 font-mono text-base font-normal text-muted">{products.length}</span>
      </h2>
      <div className="grid gap-5 md:grid-cols-3">
        {products.map((project, i) => (
          <Reveal key={project.id} delay={i * 0.06} className="h-full">
            <ProductPanel project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create `components/sections/systems.tsx`**

```tsx
import Link from 'next/link'
import { Reveal } from '@/components/ui/reveal'
import { SystemsBoard } from '@/components/ui/systems-board'
import { groupForHomepage } from '@/lib/board'
import { projects, sectionContent } from '@/lib/data'

export function Systems() {
  const rest = projects.filter((p) => p.band !== 'Products')

  return (
    <section id="systems" aria-labelledby="systems-title" className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 md:pb-20">
      <p className="eyebrow mb-3">{sectionContent.systems.eyebrow}</p>
      <h2 id="systems-title" className="text-fluid-h2 mb-8 text-ink">
        {sectionContent.systems.title}
      </h2>
      <Reveal>
        <SystemsBoard groups={groupForHomepage(rest)} label="systems" groupHeading="h3" />
      </Reveal>
      <p className="mt-5">
        <Link href="/projects" className="inline-flex min-h-[32px] items-center font-mono text-sm text-accent hover:underline">
          {sectionContent.systems.cta} →
        </Link>
      </p>
    </section>
  )
}
```

- [ ] **Step 4: Swap the work slot in `app/page.tsx`**

Replace `import { WorksSection } from '@/components/sections/works-section'` with:

```tsx
import { Products } from '@/components/sections/products'
import { Systems } from '@/components/sections/systems'
```

and replace:

```tsx
      <LegacySlot>
        <WorksSection />
      </LegacySlot>
```

with:

```tsx
      <Products />
      <Systems />
```

- [ ] **Step 5: Delete the old work components**

```bash
git rm components/sections/works-section.tsx components/ui/project-card.tsx components/ui/link-preview.tsx
```

`link-preview.tsx` fetched hover screenshots from a third-party service; Phase 4 designs the real live preview.

Run: `grep -rn "project-card\|link-preview\|ProjectCard\|LinkPreview" app components lib tests`
Expected: no output.

- [ ] **Step 6: Run the full gate and look at it**

Run: `npm run type-check && npm run lint && npm test && npm run build`
Expected: all pass.

In `npm run dev`: three product panels side by side at 1280px and stacked at 360px; the board lists 2 custom systems and 10 client-work rows; the BeachBus NFC row is not focusable; "Browse every project" opens `/projects`.

- [ ] **Step 7: Commit**

```bash
git add components/ui/product-panel.tsx components/sections/products.tsx components/sections/systems.tsx app/page.tsx
git commit -m "feat(home): products first, then the systems board

Three product panels carry the differentiator; the other twelve projects sit in
the board as custom systems and client work. Deletes the card grid and the
third-party hover-preview component.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Field log

**Files:**
- Create: `lib/field-log.ts`, `components/sections/field-log.tsx`, `tests/content/field-log.test.ts`
- Modify: `app/page.tsx`
- Delete: `components/sections/gallery-section.tsx`, `components/sections/recommendations-section.tsx`

**Interfaces:**
- Consumes: `galleryImages`, `galleryContent`, `recommendations`, `projects` from `@/lib/data`; `ImageLightbox`
- Produces:
  - `type FieldLogEntry = { kind: 'photo'; image: GalleryImage } | { kind: 'quote'; recommendation: Recommendation; project?: Project }`
  - `buildFieldLog(images: GalleryImage[], recs: Recommendation[], projects: Project[]): FieldLogEntry[]`
  - `<FieldLog />` (section `id="field-log"`) — a **server** component; only its `ImageLightbox` children are client components, which is why this does not add to the client-component count

**Spec note:** spec §6 says each testimonial "links to its project". Until Phase 4 builds case-study pages there is nothing good to link to — the only link available for the OCS panel is its login screen. Each quote therefore names its project in text now; Phase 4 turns that into a case-study link.

- [ ] **Step 1: Write the failing test**

Create `tests/content/field-log.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { galleryImages, projects, recommendations } from '@/lib/data'
import { buildFieldLog } from '@/lib/field-log'

describe('buildFieldLog', () => {
  const entries = buildFieldLog(galleryImages, recommendations, projects)

  it('includes every photo and every quote exactly once', () => {
    const photos = entries.filter((e) => e.kind === 'photo')
    const quotes = entries.filter((e) => e.kind === 'quote')
    expect(photos).toHaveLength(galleryImages.length)
    expect(quotes).toHaveLength(recommendations.length)
  })

  it('opens with a photo, so the section leads with people on site', () => {
    expect(entries[0].kind).toBe('photo')
  })

  it('places a quote after every second photo', () => {
    expect(entries.slice(0, 3).map((e) => e.kind)).toEqual(['photo', 'photo', 'quote'])
  })

  it('attaches each quote to its project when it has one', () => {
    for (const entry of entries) {
      if (entry.kind !== 'quote') continue
      if (entry.recommendation.projectId) {
        expect(entry.project?.id).toBe(entry.recommendation.projectId)
      } else {
        expect(entry.project).toBeUndefined()
      }
    }
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- tests/content/field-log.test.ts`
Expected: FAIL — cannot resolve `@/lib/field-log`.

- [ ] **Step 3: Create `lib/field-log.ts`**

```ts
import type { GalleryImage, Project, Recommendation } from '@/types'

export type FieldLogEntry =
  | { kind: 'photo'; image: GalleryImage }
  | { kind: 'quote'; recommendation: Recommendation; project?: Project }

/**
 * Photos lead; a quote follows every second photo, and any quotes left over go
 * at the end. It keeps the section about people and places without turning it
 * into a testimonial carousel.
 */
export function buildFieldLog(
  images: GalleryImage[],
  recs: Recommendation[],
  projects: Project[],
): FieldLogEntry[] {
  const quote = (recommendation: Recommendation): FieldLogEntry => ({
    kind: 'quote',
    recommendation,
    project: projects.find((p) => p.id === recommendation.projectId),
  })

  const entries: FieldLogEntry[] = []
  let next = 0
  images.forEach((image, i) => {
    entries.push({ kind: 'photo', image })
    if (i % 2 === 1 && next < recs.length) entries.push(quote(recs[next++]))
  })
  while (next < recs.length) entries.push(quote(recs[next++]))
  return entries
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/content/field-log.test.ts`
Expected: PASS — 4 tests.

- [ ] **Step 5: Create `components/sections/field-log.tsx`**

```tsx
import Image from 'next/image'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { galleryContent, galleryImages, projects, recommendations } from '@/lib/data'
import { buildFieldLog } from '@/lib/field-log'

// Captions are always visible: they are the proof, and hover-only overlays are
// unreachable on touch. Photos open full-size through real buttons.
export function FieldLog() {
  const entries = buildFieldLog(galleryImages, recommendations, projects)

  return (
    <section
      id="field-log"
      aria-labelledby="field-log-title"
      className="border-y border-line bg-panel/40"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
        <p className="eyebrow mb-3">{galleryContent.eyebrow}</p>
        <h2 id="field-log-title" className="text-fluid-h2 mb-8 text-ink">
          {galleryContent.title}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) =>
            entry.kind === 'photo' ? (
              <li key={`photo-${entry.image.id}`}>
                <figure className="overflow-hidden rounded-lg border border-line bg-panel">
                  <ImageLightbox src={entry.image.src} alt={entry.image.alt} className="w-full">
                    <span className="relative block aspect-[4/3]">
                      <Image
                        src={entry.image.src}
                        alt={entry.image.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </span>
                  </ImageLightbox>
                  <figcaption className="px-4 py-3 text-sm leading-snug text-muted-strong">
                    {entry.image.caption}
                  </figcaption>
                </figure>
              </li>
            ) : (
              <li key={`quote-${entry.recommendation.id}`}>
                <figure className="flex h-full flex-col justify-between gap-5 rounded-lg border border-line bg-panel p-5">
                  <blockquote className="leading-relaxed text-ink">
                    {'\u201C'}
                    {entry.recommendation.quote}
                    {'\u201D'}
                  </blockquote>
                  <figcaption className="font-mono text-xs leading-relaxed text-muted">
                    <span className="text-ink">{entry.recommendation.authorName}</span>
                    {' · '}
                    {entry.recommendation.authorTitle}
                    {entry.project && (
                      <span className="mt-1 block text-accent">re: {entry.project.title}</span>
                    )}
                  </figcaption>
                </figure>
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Swap the field-log slot in `app/page.tsx`**

Replace:

```tsx
import { GallerySection } from '@/components/sections/gallery-section'
import { RecommendationsSection } from '@/components/sections/recommendations-section'
```

with:

```tsx
import { FieldLog } from '@/components/sections/field-log'
```

and replace:

```tsx
      <LegacySlot>
        <GallerySection />
        <RecommendationsSection />
      </LegacySlot>
```

with:

```tsx
      <FieldLog />
```

- [ ] **Step 7: Delete the old gallery and testimonial sections**

```bash
git rm components/sections/gallery-section.tsx components/sections/recommendations-section.tsx
```

- [ ] **Step 8: Run the full gate and look at it**

Run: `npm run type-check && npm run lint && npm test && npm run build`
Expected: all pass.

In `npm run dev`: every photo shows its caption without hovering; nothing scrolls on its own; each photo opens its lightbox by click and by Enter, and Escape closes it.

- [ ] **Step 9: Commit**

```bash
git add lib/field-log.ts components/sections/field-log.tsx app/page.tsx tests/content/field-log.test.ts
git commit -m "feat(home): field log — on-site photos with permanent captions and quotes

Merges the gallery and testimonials. Captions are always visible, photos open
through real buttons, and the auto-scrolling strip is gone. Each quote names
the project it refers to.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Changelog and stack

**Files:**
- Create: `components/sections/changelog.tsx`, `components/sections/stack.tsx`
- Modify: `app/page.tsx`
- Delete: `components/sections/experience-section.tsx`, `components/sections/skills-section.tsx`

**Interfaces:**
- Consumes: `buildTimeline(): TimelineEntry[]` and `TimelineEntry { type: 'work' | 'education'; title: string; subtitle: string; note?: string; date: string; sortKey: number }` from `@/lib/timeline`; `skills`, `sectionContent`
- Produces: `<Changelog />` (section `id="changelog"`), `<Stack />` (section `id="stack"`)

These two are presentational over data that is already tested (`tests/content/timeline.test.ts`, `experience.test.ts`, `skills.test.ts`), so this task adds no new test; it is verified by the gate and by eye.

- [ ] **Step 1: Create `components/sections/changelog.tsx`**

```tsx
import { sectionContent } from '@/lib/data'
import { buildTimeline, type TimelineEntry } from '@/lib/timeline'

// Two labelled groups replace the old filled-versus-hollow dot, which encoded
// work versus education with no legend.
function Group({ label, entries }: { label: string; entries: TimelineEntry[] }) {
  return (
    <div>
      <h3 className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.1em] text-accent">{label}</h3>
      <ol className="border-l border-line">
        {entries.map((entry) => (
          <li key={`${entry.title}-${entry.subtitle}`} className="relative pb-6 pl-5 last:pb-0">
            <span aria-hidden="true" className="absolute -left-[3.5px] top-2 h-1.5 w-1.5 rounded-full bg-line-strong" />
            <p className="font-mono text-xs text-muted">{entry.date}</p>
            <p className="mt-1 font-medium text-ink">{entry.title}</p>
            <p className="text-sm text-muted-strong">{entry.subtitle}</p>
            {entry.note && <p className="mt-1 text-sm italic text-muted">{entry.note}</p>}
          </li>
        ))}
      </ol>
    </div>
  )
}

export function Changelog() {
  const timeline = buildTimeline()

  return (
    <section id="changelog" aria-labelledby="changelog-title" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
      <p className="eyebrow mb-3">{sectionContent.changelog.eyebrow}</p>
      <h2 id="changelog-title" className="text-fluid-h2 mb-10 text-ink">
        {sectionContent.changelog.title}
      </h2>
      <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
        <Group label="Work" entries={timeline.filter((e) => e.type === 'work')} />
        <Group label="Education" entries={timeline.filter((e) => e.type === 'education')} />
      </div>
    </section>
  )
}
```

If `TimelineEntry` is not exported from `lib/timeline.ts`, export it there — Task 4 of Phase 1 created it as the file's public type.

- [ ] **Step 2: Create `components/sections/stack.tsx`**

```tsx
import { sectionContent, skills } from '@/lib/data'

export function Stack() {
  const categories = Array.from(new Set(skills.map((s) => s.category)))

  return (
    <section id="stack" aria-labelledby="stack-title" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
        <p className="eyebrow mb-3">{sectionContent.stack.eyebrow}</p>
        <h2 id="stack-title" className="text-fluid-h2 mb-10 text-ink">
          {sectionContent.stack.title}
        </h2>
        <dl className="grid gap-8 sm:grid-cols-3">
          {categories.map((category) => (
            <div key={category}>
              <dt className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.1em] text-accent">
                {category}
              </dt>
              <dd>
                <ul className="space-y-1.5 font-mono text-sm text-ink">
                  {skills
                    .filter((s) => s.category === category)
                    .map((skill) => (
                      <li key={skill.id}>{skill.name}</li>
                    ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Swap the slot in `app/page.tsx`**

Replace:

```tsx
import { ExperienceSection } from '@/components/sections/experience-section'
import { SkillsSection } from '@/components/sections/skills-section'
```

with:

```tsx
import { Changelog } from '@/components/sections/changelog'
import { Stack } from '@/components/sections/stack'
```

and replace:

```tsx
      <LegacySlot>
        <ExperienceSection />
        <SkillsSection />
      </LegacySlot>
```

with:

```tsx
      <Changelog />
      <Stack />
```

- [ ] **Step 4: Delete the old sections**

```bash
git rm components/sections/experience-section.tsx components/sections/skills-section.tsx
```

- [ ] **Step 5: Run the full gate and look at it**

Run: `npm run type-check && npm run lint && npm test && npm run build`
Expected: all pass, including `tests/content/timeline.test.ts`, which still asserts the merged order.

In `npm run dev`: the Changelog shows OCS first, then Enjoy Realty with its concurrency note, and B.S. Computer Science under Education; the Changelog and Stack nav links now land on their sections.

- [ ] **Step 6: Commit**

```bash
git add components/sections/changelog.tsx components/sections/stack.tsx lib/timeline.ts app/page.tsx
git commit -m "feat(home): changelog in two labelled groups, and the stack as a mono list

Replaces the unlabelled filled/hollow timeline dots and the wall of skill pills.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Contact console

**Files:**
- Create: `components/sections/contact-console.tsx`
- Modify: `app/page.tsx`
- Delete: `components/sections/contact-section.tsx`

**Interfaces:**
- Consumes: `contactInfo`, `availability`, `resumeUrl`, `sectionContent` from `@/lib/data`; `useToast()` from `@/components/ui/toaster` (returns `{ showToast({ type, message }) }`)
- Produces: `<ContactConsole />` (section `id="contact"`), a client component

The submit behaviour is carried over **unchanged** from `contact-section.tsx`: POST to `/api/contact`; on `delivered: true`, clear and toast success; on `delivered: false`, toast and open the visitor's mail app; on error, toast with the email address. Only the presentation changes.

- [ ] **Step 1: Create `components/sections/contact-console.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/toaster'
import { availability, contactInfo, resumeUrl, sectionContent } from '@/lib/data'

const FIELD =
  'w-full rounded border border-line-strong bg-canvas px-3 py-2.5 text-ink placeholder:text-muted focus-visible:border-accent'

export function ContactConsole() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  /**
   * Hand the message off to the visitor's own mail client. Used when the server
   * has no mail provider configured, so the form still reaches a real inbox
   * instead of quietly dropping the message.
   */
  const openMailClient = () => {
    const subject = encodeURIComponent(`Portfolio message from ${formData.name}`)
    const body = encodeURIComponent(`${formData.message}\n\n\u2014 ${formData.name} (${formData.email})`)
    window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await response.json()

      if (!response.ok) {
        showToast({
          type: 'error',
          message: result.error || `Something went wrong. Email me at ${contactInfo.email}.`,
        })
        return
      }

      if (result.delivered) {
        setFormData({ name: '', email: '', message: '' })
        showToast({ type: 'success', message: "Message sent — I'll get back to you soon!" })
        return
      }

      // No mail provider configured server-side: fall back to mailto:.
      showToast({ type: 'info', message: 'Opening your email app to send this message...' })
      openMailClient()
    } catch {
      showToast({
        type: 'error',
        message: `Couldn't reach the server. Email me directly at ${contactInfo.email}.`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1fr_1.2fr] md:py-20">
        <div>
          <p className="eyebrow mb-3">{sectionContent.contact.eyebrow}</p>
          <h2 id="contact-title" className="text-fluid-h2 mb-5 text-ink">
            {sectionContent.contact.title}
          </h2>
          <p className="mb-6 inline-flex items-center gap-2 font-mono text-sm text-accent">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            {availability}
          </p>
          <ul className="space-y-2 font-mono text-sm">
            <li>
              <a href={`mailto:${contactInfo.email}`} className="inline-flex min-h-[32px] items-center text-ink hover:text-accent">
                {contactInfo.email}
              </a>
            </li>
            <li>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[32px] items-center text-ink hover:text-accent"
              >
                Download résumé
                <span className="sr-only">(PDF, opens in a new tab)</span>
              </a>
            </li>
            <li className="text-muted">{contactInfo.location}</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-line bg-panel p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="mb-1.5 block font-mono text-xs text-muted-strong">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className={FIELD}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-1.5 block font-mono text-xs text-muted-strong">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={FIELD}
              />
            </div>
          </div>
          <div>
            <label htmlFor="contact-message" className="mb-1.5 block font-mono text-xs text-muted-strong">
              What are you building?
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className={FIELD}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-[44px] items-center gap-2 rounded bg-accent px-5 font-medium text-on-accent transition-colors hover:bg-accent/90 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                Sending
              </>
            ) : (
              <>
                Send message
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Swap the contact slot and remove the scaffold in `app/page.tsx`**

This is the last legacy slot, so `LegacySlot` goes too. Replace the whole file with:

```tsx
import { Changelog } from '@/components/sections/changelog'
import { ContactConsole } from '@/components/sections/contact-console'
import { FieldLog } from '@/components/sections/field-log'
import { Hero } from '@/components/sections/hero'
import { Products } from '@/components/sections/products'
import { Stack } from '@/components/sections/stack'
import { Systems } from '@/components/sections/systems'

// Section order: spec §6. Products lead the work because three products of
// Christian's own are the differentiator the broad positioning rests on.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Products />
      <Systems />
      <FieldLog />
      <Changelog />
      <Stack />
      <ContactConsole />
    </>
  )
}
```

- [ ] **Step 3: Delete the old contact section**

```bash
git rm components/sections/contact-section.tsx
```

- [ ] **Step 4: Run the full gate**

Run: `npm run type-check && npm run lint && npm test && npm run build`
Expected: all pass.

- [ ] **Step 5: Verify the form still degrades honestly**

Start the dev server **with the mail key cleared for this process only** — this developer's shell has `RESEND_API_KEY` set, and a stray submit would send a real email:

```bash
RESEND_API_KEY= npm run dev
```

Submit the form. Expected: an info toast, then the browser tries to open a `mailto:` link. No email is sent.

- [ ] **Step 6: Commit**

```bash
git add components/sections/contact-console.tsx app/page.tsx
git commit -m "feat(home): contact console with visible labels and availability

Submit behaviour is unchanged, including the mailto fallback when no mail
provider is configured. Completes the homepage composition.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 12: Chat console

**Files:**
- Modify: `components/ui/chat-widget.tsx`

**Interfaces:**
- Consumes: the Tailwind keys from Task 2
- Produces: the same `ChatWidget` export and behaviour, restyled

Behaviour is unchanged: same state, same `/api/chat` call, same messages. Three things change: the launcher's two **infinite** pulse rings are removed (continuous motion with no pause control fails WCAG 2.2.2, the same finding the earlier audit raised for the gallery); the raw `green-400`/`green-500` "online" dots become the `live` token; and the header reads as a console.

- [ ] **Step 1: Replace the main chat button**

Find the block that starts at the comment `{/* Main Chat Button */}` and ends at that `<button>`'s closing `</button>`. Replace the whole block with:

```tsx
            {/* Main Chat Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex h-14 w-14 items-center justify-center rounded-lg border border-line-strong bg-panel text-accent shadow-lg transition-colors hover:border-accent"
              aria-label="Open chat"
            >
              <MessageCircle className="h-6 w-6" aria-hidden="true" />
              <span
                aria-hidden="true"
                className="live-pulse absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-canvas bg-live"
              />
            </button>
```

- [ ] **Step 2: Replace the slide-in label's classes**

In the `motion.div` directly under `{/* Slide-in Label */}`, set:

```tsx
                  className="cursor-pointer rounded-lg border border-line bg-panel px-4 py-2 shadow-lg"
```

and replace its inner `<span>` with:

```tsx
                  <span className="whitespace-nowrap font-mono text-xs text-ink">Ask Chunks about my work</span>
```

- [ ] **Step 3: Replace the dialog container's classes**

On the `motion.div` directly under `{/* Chat Dialog */}` → `{isOpen && (`, replace `rounded-2xl` with `rounded-lg` in its `className`, leaving the rest of the string as the Task 2 migration left it.

- [ ] **Step 4: Replace the header**

Find the block that starts at `{/* Header */}` and ends at the header `<div>`'s closing tag, immediately before `{/* Messages Container */}`. Replace it with:

```tsx
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-3">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="live-pulse relative h-2 w-2 rounded-full bg-live" />
                <div>
                  <h3 className="font-mono text-sm text-ink">~/ask chunks</h3>
                  <p className="font-mono text-xs text-muted">AI assistant · answers about my work</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded text-muted transition-colors hover:text-accent"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
```

- [ ] **Step 5: Remove unused imports and check for leftovers**

Remove `Bot` and `Sparkles` from the `lucide-react` import if nothing else in the file uses them.

Run: `grep -nE "animate-ping|animate-pulse|green-[0-9]+" components/ui/chat-widget.tsx`
Expected: no output. If a `green-*` match remains in the message list, replace it with `live`.

The typing indicator's three `animate-bounce` dots are **kept**: they run only while
a reply is loading, so they are not continuous motion under WCAG 2.2.2.

- [ ] **Step 6: Run the full gate and look at it**

Run: `npm run type-check && npm run lint && npm test && npm run build`
Expected: all pass.

In `npm run dev`: the launcher is a square panel with a single live dot that pulses twice and stops; with the OS "reduce motion" setting on, it does not pulse at all. Open the chat and send a message: behaviour is unchanged (with no `GROQ_API_KEY`, the offline reply appears).

- [ ] **Step 7: Commit**

```bash
git add components/ui/chat-widget.tsx
git commit -m "style(chat): restyle the widget as a console and stop its infinite pulse

The launcher ran two animate-ping rings forever, which fails WCAG 2.2.2 with no
pause control. The online dots now use the live token instead of raw green.
Behaviour is unchanged.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 13: Consolidation and guards

**Files:**
- Create: `tests/design/client-boundary.test.ts`, `tests/design/nav-anchors.test.ts`
- Modify: `tailwind.config.js` (remove the `display` alias), any file still using `font-display`, `CLAUDE.md`

**Interfaces:**
- Consumes: everything above
- Produces: structural guards for the spec's client-JavaScript target and nav integrity; updated project instructions

- [ ] **Step 1: Write the failing guards**

Create `tests/design/client-boundary.test.ts`:

```ts
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Spec §5: only components that need interactivity are client components.
// Everything that renders static data stays on the server. Target: under 10.
function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return full.endsWith('.tsx') ? [full] : []
  })
}

describe('client boundary', () => {
  const clientFiles = ['app', 'components']
    .flatMap(sourceFiles)
    .filter((f) => /^['"]use client['"]/.test(readFileSync(f, 'utf8').trimStart()))

  it('keeps fewer than 10 client components', () => {
    expect(clientFiles.length, clientFiles.join('\n')).toBeLessThan(10)
  })

  it('renders the homepage and /projects on the server', () => {
    expect(clientFiles).not.toContain(join('app', 'page.tsx'))
    expect(clientFiles).not.toContain(join('app', 'projects', 'page.tsx'))
  })
})
```

Create `tests/design/nav-anchors.test.ts`:

```ts
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { navigationItems } from '@/lib/data'

// A nav link whose target id no longer exists fails silently in a browser.
describe('navigation anchors', () => {
  const sections = readdirSync('components/sections')
    .map((f) => readFileSync(join('components/sections', f), 'utf8'))
    .join('\n')

  it.each(navigationItems.map((n) => [n.label, n.href]))('%s (%s) has a matching section id', (_label, href) => {
    expect(sections).toContain(`id="${href.slice(1)}"`)
  })

  it('the skip link has a target', () => {
    expect(readFileSync('app/layout.tsx', 'utf8')).toContain('id="main"')
  })
})
```

- [ ] **Step 2: Run them**

Run: `npm test -- tests/design/client-boundary.test.ts tests/design/nav-anchors.test.ts`
Expected: PASS if Tasks 6–12 landed as written. If the client-boundary test fails, its message lists the client files; find the one that renders only static data and remove its `'use client'`. Do not raise the threshold.

- [ ] **Step 3: Remove the temporary `display` font alias**

Run: `grep -rn "font-display" app components`
For every match, delete the `font-display` class from the class string. Then remove the `display: [...]` entry and its comment from `fontFamily` in `tailwind.config.js`.

Run: `grep -rn "font-display" app components tailwind.config.js`
Expected: no output.

- [ ] **Step 4: Update `CLAUDE.md`**

Replace the whole **Styling** section with:

```markdown
## Styling

- Visual authority is `DESIGN.md` (B3 Signal), with the homepage's direction
  contract in `.impeccable/surfaces/app-page-tsx.md`. Read both before UI work.
- Colours are raw oklch `L C H` triplets in `app/globals.css` — `:root` is light,
  `.dark` is the default — one per line. `tests/design/contrast.test.ts` parses
  them and checks WCAG contrast in both themes; keep the format exact.
- Tailwind colour keys: `canvas` (page), `panel`, `ink`, `muted`, `muted-strong`,
  `line`, `line-strong`, `accent`, `on-accent`, `live`, `status-early`,
  `status-private`, `status-internal`. Never raw hex, never `dark:` colour pairs.
- **Green (`live`) means a live system and nothing else.** Brand and availability
  use `accent`.
- **Status is never colour alone.** Render it only through `StatusBadge`, which
  pairs a glyph shape with a text label.
- Type: one variable family, Recursive, via `next/font`. `font-sans` is its
  linear sans; `font-mono` is the same family with its MONO axis on. Never add a
  second typeface. Numerals use `tabular-nums`. Utilities: `.eyebrow`,
  `.text-fluid-h1`, `.text-fluid-h2`.
- One grid: every section uses `mx-auto max-w-6xl px-5 sm:px-8`.
- Section headings: `<p className="eyebrow">{sectionContent.x.eyebrow}</p>` then an
  `<h2 className="text-fluid-h2">`. Copy lives in `lib/data.ts`.
- The live pulse (`.live-pulse`) runs twice and stops, and is removed under
  reduced motion. No continuous animation anywhere (WCAG 2.2.2).
```

Replace the whole **Client/Server Boundary** section with:

```markdown
## Client/Server Boundary

Components are server components by default. Only these are client components:
`components/top-bar.tsx` (theme toggle), `components/sections/contact-console.tsx`
(form), `components/ui/chat-widget.tsx`, `components/ui/image-lightbox.tsx`,
`components/ui/reveal.tsx`, `components/ui/toaster.tsx` and
`components/theme-provider.tsx`. A server component may render a client one as a
child — `FieldLog` renders `ImageLightbox` this way.
`tests/design/client-boundary.test.ts` keeps the count under 10; do not raise it.
```

In the **Testing** section, replace its first paragraph with:

```markdown
Tests live in `tests/` and run under Vitest. `tests/content/` asserts the facts the
site claims (inventory, bands, proof band, positioning, testimonials, ordering).
`tests/design/` asserts design invariants (token contrast, no legacy tokens, client
boundary, nav anchors). `tests/components/` renders server components with
`react-dom/server` and checks their markup. There are no E2E tests.
```

In **Project Structure**, replace the `components/` and `lib/` lines with:

```
components/          top-bar.tsx, footer.tsx, theme-provider.tsx
components/sections/ Homepage sections: hero, products, systems, field-log, changelog, stack, contact-console
components/ui/       Primitives: status-badge, board-row, systems-board, board-filter, product-panel, proof-band, reveal, chat-widget, toaster, image-lightbox
lib/data.ts          Single source of truth for ALL portfolio content, including section copy
lib/chat-context.ts  Builds the AI assistant's system prompt from lib/data.ts
lib/site-metadata.ts Builds page metadata from heroContent
lib/board.ts         Board grouping and the /projects ?band= parameter
lib/display-status.ts, lib/proof.ts, lib/field-log.ts, lib/dates.ts, lib/timeline.ts — pure helpers, all tested
```

- [ ] **Step 5: Run the full gate**

Run: `npm run type-check && npm run lint && npm test && npm run build`
Expected: all pass.

- [ ] **Step 6: Commit and push the branch**

```bash
git add tests/design tailwind.config.js app components CLAUDE.md
git commit -m "test: guard the client boundary and nav anchors; document the new system

Removes the temporary font-display alias and rewrites the Styling, Testing and
Client/Server sections of CLAUDE.md for B3 Signal.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
git push
```

Expected: Vercel builds the `v4` preview with the complete redesign.

---

## Task 14: Design gates and sign-off

**Run by the controller.** It drives skills and agents, and ends by handing a decision to Christian.

**Files:** whatever the gates' findings require; a findings log in `.superpowers/sdd/progress.md`

**Interfaces:**
- Consumes: the `v4` preview URL
- Produces: a merge recommendation — **not a merge**

Verification runs in bounded passes: inspect desktop and mobile together, fix everything found in one batch, confirm once, stop.

- [ ] **Step 1: `impeccable critique` and `impeccable audit`**

Run both on the assembled homepage, and critique `/projects` as well. Ask the critique to evaluate the homepage specifically as a Philippine hospitality business owner would (spec R2), and to say whether it reads as a template (spec R1).
Targets: critique **≥ 32/40**, audit **≥ 16/20** (baseline 20/40 and 7/20).

- [ ] **Step 2: `design-taste-frontend` second opinion**

Run its pre-flight check on the assembled homepage, independent of the impeccable scores.

- [ ] **Step 3: `ecc:a11y-architect` review**

Dispatch the agent over `components/` and `app/` for WCAG 2.2 AA: keyboard traversal, focus visibility, skip link, target sizes, headings order, status not by colour alone, reduced motion.

- [ ] **Step 4: Lighthouse on the preview URL, mobile**

Targets: Accessibility **100**, Performance **≥ 90**, Best Practices **≥ 95**. Run it with the Chrome DevTools MCP `lighthouse_audit` tool against the `v4` preview URL.

If the preview is behind Vercel's deployment protection, Lighthouse will audit a
login page. Do not report that as a score. Either ask Christian to allow the
preview through (a protection bypass or temporarily disabling preview
protection), or audit a local production build instead —
`npm run build && npm start`, then audit `http://localhost:3000` — and say which
target was audited in the report.

- [ ] **Step 5: Fix everything found in one batch**

Dispatch one fix subagent with the complete findings list from Steps 1–4, then re-run only the checks that failed. Log each finding and its outcome in `.superpowers/sdd/progress.md`.

- [ ] **Step 6: `impeccable polish`**

One final pass on the homepage.

- [ ] **Step 6a: Run the mechanical detector**

`impeccable context` reported no automatic design hook, so run it once over the finished UI:
`C:/Users/raroc/.claude/skills/impeccable/scripts/impeccable detect --json app components`
Fix what it reports in the same batch as Step 5's findings, or log why a finding does not apply.

- [ ] **Step 6b: Write `DESIGN.md` from the built world**

Follow impeccable's new-work section 7 (finish): the shipped documenter writes `DESIGN.md` from the code as built, and the finish review audits the build against the direction contract in `.impeccable/surfaces/app-page-tsx.md`. Every shipping raster needs its provenance recorded — the project screenshots come from `npm run capture` against the live sites; the gallery photos are Christian's own.

- [ ] **Step 7: Hand the decision to Christian**

Report the preview URL, every score against its target, and anything still open, including spec R3 (Maya and Xendit) if it is not yet resolved on `main`. **Stop.** Do not merge `v4` into `main` — the spec's merge criteria require Christian's sign-off on the preview.

---

## Self-Review

**Spec coverage.** D1 positioning → Task 3. D2/D3 Operator and B3 Signal → Tasks 1, 2. D4 products first → Tasks 6–11. D5 availability → Tasks 3, 6, 11. D6 branch → Task 1, and the push steps. §1 → Task 3. §2 colour → Task 2 (exact values, measured). §3 type → Task 2. §4 status language → Task 4. §5 components → Tasks 4–12; the dead-link fix → Task 5 with a regression test; the client-JavaScript target → Task 13's guard. §6 composition → Tasks 6–11. §7 `/projects` → Task 5. §8 theme, metadata, focus, skip link → Tasks 2, 3, 6. §9 motion → Tasks 2, 4, 12. Design workflow → Tasks 1 and 14. Testing and merge criteria → every task's gate and Task 14.

**Where this plan refines the spec.** Four places, each stated in its task:
- Tokens are raw `L C H` triplets rather than `oklch()` literals, because the existing Tailwind wiring needs triplets for opacity modifiers (Global Constraints).
- The live pulse is capped at two iterations to satisfy WCAG 2.2.2 without a pause control (Task 2).
- `FieldLog` is a server component rendering client `ImageLightbox` children, where the spec listed it as a client component — same behaviour, one fewer client file (Task 9).
- Testimonials name their project in text rather than linking to it until Phase 4 has case-study pages to link to (Task 9).
- `Reveal` is applied to the product panels and the board but not the hero, because an opacity-0 H1 would cost the performance target (Task 8).

**Additions the spec implied but did not name.** An `--on-accent` token for text on amber buttons (measured 8.9:1 dark, 5.67:1 light); `heroContent.name` so the hero states who this is; `resumeUrl` and `sectionContent` so no copy is hardcoded in components; `lib/site-metadata.ts` so metadata is testable outside Next; a legacy-token guard, because the old and new `--muted`/`--accent` collide and a leftover class would fail silently in the wrong colour.

**Placeholder scan.** No TBDs. Every code step contains the code. Tasks 1 and 14 are controller-run by design, because they drive interactive skills and end in a human decision.

**Type consistency.** `DisplayStatus`, `displayStatus`, `DISPLAY_STATUS_LABEL`, `BoardGroup`, `groupByBand`, `groupForHomepage`, `bandSlug`, `parseBandParam`, `splitProofPoint`, `FieldLogEntry`, `buildFieldLog` and `buildSiteMetadata` are each defined once and used with the same names and signatures afterward. `SystemsBoard`'s `groupHeading` is `'h3'` on the homepage (Task 8) and `'h2'` on `/projects` (Task 5), matching each page's heading structure.
