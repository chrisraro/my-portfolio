# Portfolio 5.0 Sprint 3 (Projects) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/projects` (a map view and a list view of the same data, filtered by a legend key over `?band=`, the map panning to the band) and `/projects/[slug]` (trail-journal case studies for the six flagships, short pages for the rest) in the Isarog Trail Map world, retire the Portfolio 4.0 rack and its motion, and land the ten carry-overs from the S2 final review, with `npm test` green after every task.

**Architecture:** Everything stays server-rendered. New server components: `SurveyPlate` (the one plate frame), `TrailLink` (the one text-link idiom), `Pin`/`PlaceGlyph`/`PlaceMap` (moved out of the homepage field map), `ProjectPlate` (a project as one linked plate at the 3:4 scale every screenshot shares) and `LegendFilter` (links over `?band=`). The map pan is a server-computed transform (`lib/map-pan.ts`) on a layer inside a clipping frame; a client navigation changes its custom properties and a CSS transition glides it, inside the view-transition island's filter transition. No new client component (the count stays 8).

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5 (strict), Tailwind CSS 3, `motion` (`motion/react`, LivePreview only), next-themes, `next/font/google` (Archivo), Vitest. No new dependencies.

## Decisions taken by the planner

1. **Map and list on one page, both following the filter.** `/projects` renders the map (a survey plate, sticky beside the list from 1024px, above it on phones) and the list of plates, both built from the same filtered array. No `?view=` toggle: a toggle would add a control and a second URL state for the same data, and the spec's "map view and list view of the same data" holds with both visible. (Open question 1.)
2. **The pan is a CSS transition on a server-set transform.** `lib/map-pan.ts` frames the visible pins (zoom clamped 1 to 1.75, never showing past the map's edge); the page writes `--pan-x/--pan-y/--pan-s` on `.map-pan`. A client navigation keeps the element, so the new values transition (`--dur-slow`, `--ease-smooth`, transform only, no-preference only). Inside the island's filter transition the new root is live, so the pan plays there too; the island's logic is unchanged, only its names and comments move to plates. View-transition names cannot clip a moving SVG layer to its frame, so the map itself is not named.
3. **Pins on `/projects` jump to the plate in the list** (`#plate-<slug>`), the contract's "a pin opens its project's plate"; the page glides there on the existing smooth scroll (instant under reduced motion). As on the homepage, pins are out of the tab order and the tree, since the list links every project. (Open question 3.)
4. **The new equivalent of the RackCard's `sm:aspect-square` flat card:** a plate with no screenshot keeps the same `aspect-[3/4]` frame, holding the printed `NoPreviewTag`, so every plate stands at one scale on one baseline. The projects-page test holds it, with the "one link target per plate" invariant.
5. **`SECTION` lives in `components/ui/grid.ts`, not `lib/`.** `tailwind.config.js` scans `components/`, `app/` and `pages/` only; a class string in `lib/` would not be generated.
6. **CTA labels: `ctaLabels` in `lib/data.ts`.** Section copy that repeats a label (`fork.*.cta`, `contact.title`, `fieldMap.cta`, `projectsPageContent.eyebrow`) references it; a test holds each label to one literal. `Send message`, `Live preview`, `Open live site` stay component chrome (one use each).
7. **`TrailLink` replaces `ArrowLinkText` and the hand-rolled `link-draw` links.** An inline-flex link keeps its arrow beside wrapped text, so the `whitespace-nowrap` last-word trick goes.
8. **Plate and journal links are named, not read whole.** A plate's link is `aria-labelledby` its title and status (and the "Next case study" prefix where given); a journal cover's link its title (now an `h3`) and its "Read the case study" cue. `StatusBadge` gains an optional `id`.
9. **The 4.0 project page retires whole:** the amber flap and `.on-plane`, the creases, `.reveal-fold`. Decision panels sit still in S3; screenshot appear-once and any new reveal are S6 (contract "Unresolved").
10. **Facts in the project header gain `Place: <name>`** where `project.place` is set (verified data only; nothing new is claimed). (Open question 2.)
11. **Catalog numbers stay** ("07 / 20 · Sites") in `map-label tabular` type, so an own product keeps one number on `/` and `/projects`.
12. **`/projects` band sections are not deferred.** `content-visibility` clips a lifted plate's shadow; `ProjectShot` frames already skip rendering off screen. `.defer-render-lift` goes.
13. **Titles and metadata are untouched** (S5). `generateMetadata` on both routes keeps its current builders.
14. **Trail red on `/projects`:** the `.button-primary` and the current legend key (a filled dot and a 3px bar under ink text, never red text). A test holds every other `*-trail` class off the page.

## Open questions (defaults are written into the tasks)

1. Map and list side by side on one page (default), or a map/list toggle?
2. Show `Place: El Nido` (from `project.place`) in the project header's facts (default yes)?
3. A pin on `/projects` jumps to the project's plate in the list (default), or opens the project page as on the homepage?

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

S3 adds:

- Every task is implemented by a Sonnet subagent, test first. Before editing any UI file read `C:\Users\raroc\.claude\skills\impeccable\reference\craft-floor.md`; before writing a transition or a view transition load the `modern-web-guidance` skill.
- Gates before every commit, from the repo root, in order: `npm run type-check` (prints nothing, exits 0), `npm run lint` (`✔ No ESLint warnings or errors`), `npm test` (ends `Test Files  N passed (N)`), `RESEND_API_KEY= GROQ_API_KEY= npm run build` (route table lists `ƒ /projects` and `● /projects/[slug]`). If type-check points at a file under `.next/types` that no longer exists, delete `.next` and rerun.
- No `scroll(root)` anywhere. Nothing about a screenshot, a plate or the map follows the page's scroll.
- Client components stay at 8. `LegendFilter`, `ProjectPlate`, `SurveyPlate`, `TrailLink`, `PlaceMap`, `Pin` are server components (no `'use client'`).
- Keep `shot-<slug>` (`shotTransitionName`) and `data-vt-shot`: the clicked plate's shot still morphs into the project page's header shot.
- New S3 surfaces use no `accent`, `accent-plane`, `on-accent`, `edge-code` or `crease-*` class (Task 9 guards it). `text-page-h1`, `text-title`, `text-lede`, `text-numeral`, `eyebrow`, `map-label`, `tabular` stay.
- Commit with two `-m` flags: the summary, then `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## File Structure

Create:
- `components/ui/grid.ts`: `SECTION`, the one grid's class string.
- `components/ui/trail-link.tsx`: `TrailLink`, `TrailLinkText`, `trailLinkClass` (the one text-link idiom).
- `components/ui/survey-plate.tsx`: `SurveyPlate` (the one plate frame; a div, figure, span or link).
- `components/map/pin.tsx`: `Pin`, `PlaceGlyph`, `LABELS` (moved from `field-map.tsx`).
- `components/map/place-map.tsx`: `PlaceMap` (outline plus pins, for `/` and `/projects`).
- `lib/map-pan.ts`: `panTo`, `panStyle`, `IDENTITY_PAN`, `MAX_PAN_SCALE` (pure).
- `components/ui/project-plate.tsx`: `ProjectPlate` (a project as one linked plate).
- `components/ui/legend-filter.tsx`: `LegendFilter` (the `?band=` legend key).
- Tests: `tests/design/grid.test.ts`, `tests/content/cta-labels.test.ts`, `tests/components/trail-link.test.tsx`, `tests/components/survey-plate.test.tsx`, `tests/components/map-pin.test.tsx`, `tests/design/survey-plate.test.ts`, `tests/content/map-pan.test.ts`, `tests/components/project-plate.test.tsx`, `tests/components/legend-filter.test.tsx`, `tests/design/plate-motion.test.ts`, `tests/design/retired-classes.test.ts`, `tests/design/s3-surfaces.test.ts`.

Rewrite: `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`, `components/case-study/{project-header,case-study-body,read-spread,project-screenshots,project-summary}.tsx`, `components/sections/{field-map,own-products,trail-journals}.tsx`, `tests/components/{projects-page,catalog-consistency}.test.tsx`, `tests/design/view-transitions.test.tsx`.

Modify: `lib/data.ts`, `lib/view-transition.ts`, `app/globals.css`, `app/not-found.tsx`, `components/footer.tsx`, `components/sections/{trailhead,elevation-strip,fork,plan-the-route}.tsx`, `components/ui/{project-shot,status-badge,live-preview,view-transitions}.tsx`, `CLAUDE.md`, `.impeccable/surfaces/app-page-tsx.md`, and the tests named in each task.

Delete: `components/ui/rack-card.tsx`, `components/ui/rack-tier.tsx`, `components/ui/board-filter.tsx`, `components/case-study/arrow-link-text.tsx`, `tests/design/catalog-motion.test.ts`.

## Task list

| # | Task | Model |
|---|---|---|
| 1 | One grid and one set of CTA labels | Sonnet |
| 2 | Trail link, survey plate and map pin primitives | Sonnet |
| 3 | The homepage adopts the shared primitives | Sonnet |
| 4 | Projects primitives: plate, legend filter, map pan, names | Sonnet |
| 5 | `/projects` as map and list | Sonnet |
| 6 | Retire the rack | Sonnet |
| 7 | The project header without the amber flap | Sonnet |
| 8 | Case studies as trail journals; short pages | Sonnet |
| 9 | LivePreview restyled; the S3 surfaces guard | Sonnet |
| 10 | Sprint verification and docs | Sonnet |

---

### Task 1: One grid and one set of CTA labels

**Model:** Sonnet

**Files:**
- Create: `components/ui/grid.ts`
- Create: `tests/design/grid.test.ts`, `tests/content/cta-labels.test.ts`
- Modify: `lib/data.ts` (add `ctaLabels`; `sectionContent`, `projectsPageContent` reference it)
- Modify (grid and labels): `components/sections/{trailhead,elevation-strip,field-map,fork,own-products,plan-the-route,trail-journals}.tsx`, `components/footer.tsx`, `app/not-found.tsx`, `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`, `components/case-study/{project-header,read-spread,case-study-body}.tsx`
- Modify: `tests/design/primary-button.test.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `SECTION: string` from `@/components/ui/grid` (`'mx-auto max-w-6xl px-5 sm:px-8'`); `ctaLabels` from `@/lib/data`: `{ startProject: 'Start a project', hireForRole: 'Hire me for a role', allProjects: 'All projects', browseProjects: 'Browse every project', readCaseStudy: 'Read the case study', readMore: 'Read more', backHome: 'Back to the homepage', downloadResume: 'Download résumé' }` (`as const`).

- [ ] **Step 1: Write the failing tests**

Create `tests/design/grid.test.ts`:

```ts
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { SECTION } from '@/components/ui/grid'

// CLAUDE.md, Styling: one grid. Every section and read-page block centres on
// the same class string, stated once (S2 final review, carry-over 8).
function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return tsxFiles(full)
    return full.endsWith('.tsx') ? [full] : []
  })
}

describe('the one grid', () => {
  it('is one constant: centred, 6xl wide, 20px gutters, 32px from 640px', () => {
    expect(SECTION).toBe('mx-auto max-w-6xl px-5 sm:px-8')
  })

  it('lives where Tailwind looks for classes', () => {
    expect(readFileSync('tailwind.config.js', 'utf8')).toContain("'./components/**/*.{js,ts,jsx,tsx,mdx}'")
  })

  it('is never spelled out by hand in a page or component', () => {
    const offenders = ['app', 'components'].flatMap(tsxFiles).flatMap((f) =>
      Array.from(readFileSync(f, 'utf8').matchAll(/(['"`])([^'"`\n]*)\1/g))
        .map((m) => m[2])
        .filter((s) => /\bmax-w-6xl\b/.test(s) && /(^|\s)px-5(\s|$)/.test(s))
        .map((s) => `${f}: ${s}`),
    )
    expect(offenders).toEqual([])
  })

  it('is used by every homepage section, the footer and the read pages', () => {
    const users = [
      ...['trailhead', 'elevation-strip', 'field-map', 'fork', 'own-products', 'plan-the-route', 'trail-journals'].map(
        (s) => `components/sections/${s}.tsx`,
      ),
      'components/footer.tsx',
      'app/not-found.tsx',
      'app/projects/page.tsx',
      'app/projects/[slug]/page.tsx',
    ]
    for (const f of users) expect(readFileSync(f, 'utf8'), f).toContain("from '@/components/ui/grid'")
  })
})
```

Create `tests/content/cta-labels.test.ts`:

```ts
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { ctaLabels, projectsPageContent, sectionContent } from '@/lib/data'

// S2 final review, carry-over 10: one source for call-to-action labels. Each
// is spelled out once, in ctaLabels; every button, link and heading that says
// it reads it from there. Comments may name a label; code may not.
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return files(full)
    return /\.tsx?$/.test(full) ? [full] : []
  })
}
const stripComments = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
const sources = ['app', 'components', 'lib']
  .flatMap(files)
  .map((f) => ({ f: f.replace(/\\/g, '/'), src: stripComments(readFileSync(f, 'utf8')) }))
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

describe('call-to-action labels', () => {
  it('are each spelled out once, in ctaLabels', () => {
    for (const label of Object.values(ctaLabels)) {
      const quoted = new RegExp(`(['"\`])${esc(label)}\\1`, 'g')
      const hits = sources.flatMap(({ f, src }) => (src.match(quoted) ?? []).map(() => f))
      expect(hits, label).toEqual(['lib/data.ts'])
    }
  })

  it('never appear as bare JSX text', () => {
    for (const label of Object.values(ctaLabels)) {
      const text = new RegExp(`>\\s*${esc(label)}\\s*<`)
      for (const { f, src } of sources) expect(src, `${f}: ${label}`).not.toMatch(text)
    }
  })

  it('feed the section copy that repeats them', () => {
    expect(sectionContent.fork.business.cta).toBe(ctaLabels.startProject)
    expect(sectionContent.fork.team.cta).toBe(ctaLabels.hireForRole)
    expect(sectionContent.fork.team.resume).toBe(ctaLabels.downloadResume)
    expect(sectionContent.contact.title).toBe(ctaLabels.startProject)
    expect(sectionContent.fieldMap.cta).toBe(ctaLabels.browseProjects)
    expect(projectsPageContent.eyebrow).toBe(ctaLabels.allProjects)
  })
})
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/design/grid.test.ts tests/content/cta-labels.test.ts`
Expected: FAIL. `grid.test.ts` fails to import `@/components/ui/grid` (file not found); `cta-labels.test.ts` fails because `ctaLabels` is undefined (`Object.values(undefined)` throws).

- [ ] **Step 3: Add the grid constant**

Create `components/ui/grid.ts`:

```ts
// The one grid (CLAUDE.md, Styling): every section and read-page block
// centres on it. It lives in components/ because Tailwind scans components/,
// app/ and pages/ for class names, not lib/.
export const SECTION = 'mx-auto max-w-6xl px-5 sm:px-8'
```

- [ ] **Step 4: Add the CTA labels to `lib/data.ts`**

Directly above the comment `// Headings and copy for each homepage section.` (after `const gatewaySentence = …`), insert:

```ts
// Call-to-action labels, each stated once (tests/content/cta-labels.test.ts).
// Every button, link and heading that says one reads it from here.
export const ctaLabels = {
  startProject: 'Start a project',
  hireForRole: 'Hire me for a role',
  allProjects: 'All projects',
  browseProjects: 'Browse every project',
  readCaseStudy: 'Read the case study',
  readMore: 'Read more',
  backHome: 'Back to the homepage',
  downloadResume: 'Download résumé',
} as const

```

Then make these six replacements in `lib/data.ts`:

- In `sectionContent.fieldMap`: `cta: 'Browse every project',` → `cta: ctaLabels.browseProjects,`
- In `sectionContent.fork.business`: `cta: 'Start a project',` → `cta: ctaLabels.startProject,`
- In `sectionContent.fork.team`: `cta: 'Hire me for a role',` → `cta: ctaLabels.hireForRole,`
- In `sectionContent.fork.team`: `resume: 'Download résumé',` → `resume: ctaLabels.downloadResume,`
- In `sectionContent.contact`: `title: 'Start a project',` → `title: ctaLabels.startProject,`
- In `projectsPageContent`: `eyebrow: 'All projects',` → `eyebrow: ctaLabels.allProjects,`

- [ ] **Step 5: Use `SECTION` and `ctaLabels` everywhere they are spelled out**

In each file add `import { SECTION } from '@/components/ui/grid'` to the `@/components/...` imports, `cn` from `@/lib/utils` where the file does not import it yet, and `ctaLabels` to its existing `@/lib/data` import (add the import where there is none). Then:

`components/sections/elevation-strip.tsx`, `field-map.tsx`, `fork.tsx`, `own-products.tsx`, `plan-the-route.tsx`, `trail-journals.tsx`: on the `<section …>` line replace
`className="mx-auto max-w-6xl px-5 pb-[72px] sm:px-8 md:pb-[112px]"` with `className={cn(SECTION, 'pb-[72px] md:pb-[112px]')}`.

`components/sections/trailhead.tsx`:
- `<div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-28 sm:px-8 md:min-h-[44rem] md:grid-cols-[7fr_5fr] md:items-start md:gap-12 md:pb-20 md:pt-36">` → `<div className={cn(SECTION, 'relative grid gap-10 pb-16 pt-28 md:min-h-[44rem] md:grid-cols-[7fr_5fr] md:items-start md:gap-12 md:pb-20 md:pt-36')}>`
- the JSX text line `Start a project` (inside the `button-primary` link) → `{ctaLabels.startProject}`
- the JSX text line `Hire me for a role` → `{ctaLabels.hireForRole}`

`components/sections/own-products.tsx`: `<span className="link-draw">Read more</span>` → `<span className="link-draw">{ctaLabels.readMore}</span>`.

`components/sections/trail-journals.tsx`: `<span className="link-draw">Read the case study</span>` → `<span className="link-draw">{ctaLabels.readCaseStudy}</span>`.

`components/sections/plan-the-route.tsx`: `<span className="link-draw">Download résumé</span>` → `<span className="link-draw">{ctaLabels.downloadResume}</span>`.

`components/footer.tsx`: `<div className="mx-auto grid max-w-6xl gap-8 px-5 pb-24 pt-12 sm:grid-cols-[1fr_auto] sm:items-end sm:px-8 lg:pb-12">` → `<div className={cn(SECTION, 'grid gap-8 pb-24 pt-12 sm:grid-cols-[1fr_auto] sm:items-end lg:pb-12')}>`.

`app/not-found.tsx`:
- `<div className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 md:pb-24 md:pt-16">` → `<div className={cn(SECTION, 'pb-16 pt-12 md:pb-24 md:pt-16')}>`
- the JSX text line `All projects` → `{ctaLabels.allProjects}`
- `<span className="link-draw">Back to the homepage</span>` → `<span className="link-draw">{ctaLabels.backHome}</span>`

`app/projects/page.tsx`:
- `<div className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 md:pb-24 md:pt-16">` → `<div className={cn(SECTION, 'pb-16 pt-12 md:pb-24 md:pt-16')}>`
- the JSX text line `Start a project` → `{ctaLabels.startProject}`
- `<span className="link-draw">Back to the homepage</span>` → `<span className="link-draw">{ctaLabels.backHome}</span>`

`app/projects/[slug]/page.tsx`:
- `<div className="mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-8 md:pb-24">` → `<div className={cn(SECTION, 'pb-16 pt-14 md:pb-24')}>`
- the JSX text line `Start a project` → `{ctaLabels.startProject}`
- `<span className="link-draw">All projects</span>` → `<span className="link-draw">{ctaLabels.allProjects}</span>`

`components/case-study/project-header.tsx`:
- `<header className="mx-auto max-w-6xl px-5 pt-6 sm:px-8 md:pt-8">` → `<header className={cn(SECTION, 'pt-6 md:pt-8')}>`
- `<span className="link-draw">All projects</span>` → `<span className="link-draw">{ctaLabels.allProjects}</span>`
- the JSX text line `Start a project` → `{ctaLabels.startProject}`

`components/case-study/read-spread.tsx`: `<div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 md:py-16">` → `<div className={cn(SECTION, 'py-12 md:py-16')}>`.

`components/case-study/case-study-body.tsx`: `className="rack-shelf mx-auto max-w-6xl px-5 sm:px-8"` → `className={cn('rack-shelf', SECTION)}`.

- [ ] **Step 6: Point the primary-button test at the labels**

In `tests/design/primary-button.test.ts`, replace the whole `it('is used by every primary call to action', …)` block with:

```ts
  it('is used by every primary call to action', () => {
    const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const uses = (file: string, label: string) => {
      const src = readFileSync(file, 'utf8')
      // The label as JSX (after a tag's ">"), not a mention in a comment.
      const i = src.search(new RegExp(String.raw`>\s*` + esc(label)))
      expect(i, `${file}: ${label}`).toBeGreaterThan(-1)
      // From the opening tag of the control that holds the label.
      const tag = Math.max(...['<Link', '<a\n', '<a\r', '<a ', '<button'].map((t) => src.lastIndexOf(t, i)))
      return src.slice(Math.max(0, tag), i)
    }
    expect(uses('components/sections/trailhead.tsx', '{ctaLabels.startProject}')).toContain('button-primary')
    expect(uses('components/sections/trailhead.tsx', '{ctaLabels.hireForRole}')).toContain('button-secondary')
    expect(uses('components/case-study/project-header.tsx', '{ctaLabels.startProject}')).toContain('button-primary')
    expect(uses('app/projects/page.tsx', '{ctaLabels.startProject}')).toContain('button-primary')
    expect(uses('app/projects/[slug]/page.tsx', '{ctaLabels.startProject}')).toContain('button-primary')
    expect(uses('app/not-found.tsx', '{ctaLabels.allProjects}')).toContain('button-primary')
    expect(uses('components/sections/plan-the-route.tsx', 'Send message')).toContain('button-primary')
  })
```

- [ ] **Step 7: Run the new tests and the full suite**

Run: `npx vitest run tests/design/grid.test.ts tests/content/cta-labels.test.ts tests/design/primary-button.test.ts`
Expected: PASS (3 files).
Run: `npm test`
Expected: all files pass. The rendered HTML is unchanged, so `homepage`, `projects-page`, `project-page` and `not-found` pass as before.

- [ ] **Step 8: Gates and commit**

Run the four gates (Global Constraints). Then:

```bash
git add components/ui/grid.ts lib/data.ts components/sections components/footer.tsx app/not-found.tsx app/projects components/case-study tests/design/grid.test.ts tests/content/cta-labels.test.ts tests/design/primary-button.test.ts
git commit -m "refactor(ui): one grid constant and one source for cta labels" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Trail link, survey plate and map pin primitives

**Model:** Sonnet

**Files:**
- Create: `components/ui/trail-link.tsx`, `components/ui/survey-plate.tsx`, `components/map/pin.tsx`, `components/map/place-map.tsx`
- Create: `tests/components/trail-link.test.tsx`, `tests/components/survey-plate.test.tsx`, `tests/components/map-pin.test.tsx`

**Interfaces:**
- Consumes: `PlaceGroup`, `placeGroups` from `@/lib/places`; `project`, `MAP_*` from `@/lib/geo`; `PhilippinesOutline` from `@/components/map/philippines-outline`.
- Produces:
  - `TrailLink({ href: string, text: string, kind?: 'action' | 'label', external?: boolean, srText?: string, className?: string })`; `TrailLinkText({ text, kind?, external?, srText? })`; `trailLinkClass(kind?: 'action' | 'label'): string`; type `TrailLinkKind`.
  - `SurveyPlate({ as?: 'div' | 'figure' | 'span', href?: string, 'aria-labelledby'?: string, className?: string, children: ReactNode })`.
  - `Pin({ group: PlaceGroup, href: string })`, `PlaceGlyph({ precision: PlacePrecision })`, `LABELS: Record<string, { dx: number; dy: number; anchor: 'start' | 'end' }>` from `@/components/map/pin`.
  - `PlaceMap({ places: PlaceGroup[], hrefFor: (group: PlaceGroup) => string })` from `@/components/map/place-map`.

- [ ] **Step 1: Write the failing tests**

Create `tests/components/trail-link.test.tsx`:

```tsx
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { TrailLink, TrailLinkText, trailLinkClass } from '@/components/ui/trail-link'

// S2 final review, carry-over 7: the arrow link and the map-label link are one
// idiom with two weights.
describe('TrailLink', () => {
  it('is an action: button-label type, the drawn underline, an arrow that slides', () => {
    const html = renderToStaticMarkup(<TrailLink href="/projects" text="Browse every project" />)
    expect(html).toMatch(/^<a [^>]*href="\/projects"/)
    expect(html).toMatch(/class="button-label inline-flex min-h-\[44px\] items-center gap-2 text-ink"/)
    expect(html).toContain('<span class="link-draw">Browse every project</span><svg')
    expect(html).toContain('arrow-nudge')
    expect(html).not.toContain('target=')
  })

  it('keeps a wrapped label beside its arrow: the link is inline-flex, not nowrap', () => {
    const html = renderToStaticMarkup(<TrailLink href="/x" text="Part of the BeachBus Palawan case study" />)
    expect(html).toContain('inline-flex')
    expect(html).not.toContain('whitespace-nowrap')
  })

  it('is a label: map-label type, no arrow, a 32px hit area from 640px', () => {
    const html = renderToStaticMarkup(<TrailLink href="/projects/latag" text="Latag" kind="label" />)
    expect(html).toMatch(/class="map-label inline-flex min-h-\[44px\] items-center gap-1\.5 text-ink sm:min-h-\[32px\]"/)
    expect(html).toContain('<span class="link-draw">Latag</span></a>')
  })

  it('opens an external link in a new tab, says so, and points up and out', () => {
    const html = renderToStaticMarkup(<TrailLink href="https://latag.ph" text="latag.ph" kind="label" external />)
    expect(html).toMatch(/^<a href="https:\/\/latag\.ph" target="_blank" rel="noopener noreferrer"/)
    expect(html).toContain('<span class="sr-only">(opens in a new tab)</span>')
    expect(html).toContain('<svg')
    expect(html).not.toContain('arrow-nudge')
  })

  it('reads extra words to screen readers only, after the text', () => {
    const html = renderToStaticMarkup(<TrailLink href="/projects/latag" text="Read more" srText=" about Latag" />)
    expect(html).toContain('<span class="link-draw">Read more</span><span class="sr-only"> about Latag</span>')
  })

  it('merges a caller class over its own', () => {
    const html = renderToStaticMarkup(<TrailLink href="/" text="Home" kind="label" className="text-muted-strong" />)
    expect(html).toContain('text-muted-strong')
    expect(html).not.toMatch(/class="[^"]*\btext-ink\b/)
  })

  it('lends its inside and its classes to a cue inside a link that is already open', () => {
    const cue = renderToStaticMarkup(
      <span className={trailLinkClass('action')}>
        <TrailLinkText text="Read the case study" />
      </span>,
    )
    expect(cue).toMatch(/^<span class="button-label inline-flex/)
    expect(cue).toContain('<span class="link-draw">Read the case study</span><svg')
    expect(cue).not.toContain('<a ')
  })
})
```

Create `tests/components/survey-plate.test.tsx`:

```tsx
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { SurveyPlate } from '@/components/ui/survey-plate'

// Spec §3: every photo and screenshot sits in one pale plate frame.
describe('SurveyPlate', () => {
  it('is a block by default, the plate class and nothing else', () => {
    expect(renderToStaticMarkup(<SurveyPlate>x</SurveyPlate>)).toBe('<div class="survey-plate">x</div>')
  })

  it('can be the figure around a map and its caption, or a span inside a link', () => {
    expect(renderToStaticMarkup(<SurveyPlate as="figure" className="mx-auto">x</SurveyPlate>)).toBe(
      '<figure class="survey-plate mx-auto">x</figure>',
    )
    expect(renderToStaticMarkup(<SurveyPlate as="span">x</SurveyPlate>)).toBe('<span class="survey-plate">x</span>')
  })

  it('can itself be the link, named by the ids it is given', () => {
    const html = renderToStaticMarkup(
      <SurveyPlate href="/projects/latag" aria-labelledby="t s" className="lift-card">
        x
      </SurveyPlate>,
    )
    expect(html).toMatch(/^<a /)
    expect(html).toContain('href="/projects/latag"')
    expect(html).toContain('aria-labelledby="t s"')
    expect(html).toContain('class="survey-plate lift-card"')
  })
})
```

Create `tests/components/map-pin.test.tsx`:

```tsx
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { LABELS, Pin, PlaceGlyph } from '@/components/map/pin'
import { PlaceMap } from '@/components/map/place-map'
import { projects } from '@/lib/data'
import { MAP_VIEWBOX, project as toMap } from '@/lib/geo'
import { placeGroups } from '@/lib/places'

// S2 final review, carry-over 1: one pin, shared by the homepage field map and /projects.
const groups = placeGroups(projects)

describe('Pin', () => {
  it('is a real link where the caller says, out of the tab order and the tree, a ring for a region and a dot for a city', () => {
    for (const g of groups) {
      const html = renderToStaticMarkup(
        <svg>
          <Pin group={g} href={`#plate-${g.projects[0].slug}`} />
        </svg>,
      )
      expect(html, g.name).toContain(`<a href="#plate-${g.projects[0].slug}" tabindex="-1" aria-hidden="true" class="map-pin">`)
      const { x, y } = toMap(g.lat, g.lng)
      expect(html, g.name).toContain(`cx="${x}" cy="${y}"`)
      expect(html, g.name).toContain(`class="${g.precision === 'region' ? 'map-ring' : 'map-dot'} `)
      expect(html, g.name).toContain(`>${g.name}</text>`)
    }
  })

  it('sets Naga City and Bicol labels on opposite sides, since their centres nearly touch', () => {
    expect(LABELS['Naga City'].anchor).toBe('end')
    expect(LABELS.Bicol.anchor).toBe('start')
  })
})

describe('PlaceGlyph', () => {
  it('repeats the pin as a key: a dashed ring for a region, a dot for a city', () => {
    expect(renderToStaticMarkup(<PlaceGlyph precision="region" />)).toContain('stroke-dasharray="3 2"')
    expect(renderToStaticMarkup(<PlaceGlyph precision="city" />)).toContain('fill="currentColor"')
  })
})

describe('PlaceMap', () => {
  const html = renderToStaticMarkup(<PlaceMap places={groups} hrefFor={(g) => `/projects/${g.projects[0].slug}`} />)

  it('draws the outline in the projection the pins use, hidden from the tree', () => {
    expect(html).toMatch(/^<svg viewBox="[^"]+" aria-hidden="true" focusable="false"/)
    expect(html).toContain(`viewBox="${MAP_VIEWBOX}"`)
  })

  it('pins each place once, linking where hrefFor says', () => {
    expect(html.match(/<a /g)).toHaveLength(groups.length)
    for (const g of groups) expect(html).toContain(`href="/projects/${g.projects[0].slug}"`)
  })
})
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/components/trail-link.test.tsx tests/components/survey-plate.test.tsx tests/components/map-pin.test.tsx`
Expected: FAIL, each with `Failed to resolve import` for the new module.

- [ ] **Step 3: Write `TrailLink`**

Create `components/ui/trail-link.tsx`:

```tsx
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * The trail map's one text-link idiom, in two weights. An action ("Browse
 * every project", "Read more") is set in button-label type with an arrow that
 * slides on hover; a label (a project in a place list, a domain) is set in
 * map-label type. Both draw their underline from the left (.link-draw) and
 * keep a 44px hit area (32px for a label from 640px). The link is inline-flex,
 * so text that wraps keeps its arrow beside it, never alone on a line. An
 * external link opens in a new tab, says so, and points up and out instead.
 */
export type TrailLinkKind = 'action' | 'label'

const KIND: Record<TrailLinkKind, string> = {
  action: 'button-label inline-flex min-h-[44px] items-center gap-2 text-ink',
  label: 'map-label inline-flex min-h-[44px] items-center gap-1.5 text-ink sm:min-h-[32px]',
}

/** A trail link's classes, for a cue inside a link that is already open (a journal cover). */
export function trailLinkClass(kind: TrailLinkKind = 'action'): string {
  return KIND[kind]
}

interface TrailLinkTextProps {
  text: string
  kind?: TrailLinkKind
  external?: boolean
  /** Read after the text by screen readers only, e.g. " about Latag". */
  srText?: string
}

/** A trail link's inside: the underlined text, then its arrow. */
export function TrailLinkText({ text, kind = 'action', external = false, srText }: TrailLinkTextProps) {
  return (
    <>
      <span className="link-draw">{text}</span>
      {srText && <span className="sr-only">{srText}</span>}
      {external ? (
        <>
          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          <span className="sr-only">(opens in a new tab)</span>
        </>
      ) : (
        kind === 'action' && <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4 shrink-0" />
      )}
    </>
  )
}

interface TrailLinkProps extends TrailLinkTextProps {
  href: string
  className?: string
}

export function TrailLink({ href, text, kind = 'action', external = false, srText, className }: TrailLinkProps) {
  const classes = cn(KIND[kind], className)
  const inner = <TrailLinkText text={text} kind={kind} external={external} srText={srText} />
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {inner}
      </a>
    )
  }
  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  )
}
```

- [ ] **Step 4: Write `SurveyPlate`**

Create `components/ui/survey-plate.tsx`:

```tsx
import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SurveyPlateProps {
  /** A block (default), the figure around a map and its caption, or a span inside a link or button. */
  as?: 'div' | 'figure' | 'span'
  /** The plate is itself the link (a project plate). */
  href?: string
  'aria-labelledby'?: string
  className?: string
  children: ReactNode
}

/**
 * A survey plate (spec §3): the pale frame every photo, screenshot and map
 * sits in, panel paper with a line-strong hairline and an 8px margin
 * (.survey-plate in app/globals.css). The only place the class is written:
 * tests/design/survey-plate.test.ts holds every plate to this component.
 */
export function SurveyPlate({ as: Tag = 'div', href, className, children, ...aria }: SurveyPlateProps) {
  const classes = cn('survey-plate', className)
  if (href) {
    return (
      <Link href={href} className={classes} {...aria}>
        {children}
      </Link>
    )
  }
  return (
    <Tag className={classes} {...aria}>
      {children}
    </Tag>
  )
}
```

- [ ] **Step 5: Move the pin into `components/map/`**

Create `components/map/pin.tsx` (the code of `Pin`, `PlaceGlyph` and `LABELS` from `components/sections/field-map.tsx`, with `href` passed in):

```tsx
import { project as toMap } from '@/lib/geo'
import type { PlaceGroup } from '@/lib/places'
import type { PlacePrecision } from '@/types'

// Where a place's label sits beside its pin, in map units (layout, not
// content). Naga City's and Bicol's centres are about 19 units apart, so their
// labels go opposite ways; a region's ring is wider than a city's dot.
export const LABELS: Record<string, { dx: number; dy: number; anchor: 'start' | 'end' }> = {
  'Naga City': { dx: -14, dy: -10, anchor: 'end' },
  Bicol: { dx: 26, dy: 20, anchor: 'start' },
  Palawan: { dx: 26, dy: 8, anchor: 'start' },
}
const DEFAULT_LABEL = { dx: 14, dy: 7, anchor: 'start' as const }

/**
 * One pin: a ring for a region, a dot for a city, and the place's name. A real
 * link, for crawlers and pointers: on the homepage to the place's first
 * project page, on /projects to its plate in the list. It is out of the tab
 * order and the accessibility tree because the list beside the map links the
 * same projects (one link per project for keyboard and screen readers).
 */
export function Pin({ group, href }: { group: PlaceGroup; href: string }) {
  const { x, y } = toMap(group.lat, group.lng)
  const label = LABELS[group.name] ?? DEFAULT_LABEL
  return (
    <a href={href} tabIndex={-1} aria-hidden="true" className="map-pin">
      {group.precision === 'region' ? (
        <circle cx={x} cy={y} r={18} className="map-ring fill-none stroke-ink" strokeWidth={2} strokeDasharray="4 3" />
      ) : (
        <circle cx={x} cy={y} r={6} className="map-dot fill-ink" />
      )}
      <text x={Math.round(x + label.dx)} y={Math.round(y + label.dy)} textAnchor={label.anchor} className="map-label fill-ink text-[22px]">
        {group.name}
      </text>
    </a>
  )
}

/** The pin's glyph again, as the key beside a place in a list. */
export function PlaceGlyph({ precision }: { precision: PlacePrecision }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-ink">
      {precision === 'region' ? (
        <circle cx={8} cy={8} r={6} fill="none" stroke="currentColor" strokeWidth={1.5} strokeDasharray="3 2" />
      ) : (
        <circle cx={8} cy={8} r={3.5} fill="currentColor" />
      )}
    </svg>
  )
}
```

Create `components/map/place-map.tsx`:

```tsx
import { PhilippinesOutline } from '@/components/map/philippines-outline'
import { Pin } from '@/components/map/pin'
import { MAP_HEIGHT, MAP_VIEWBOX, MAP_WIDTH } from '@/lib/geo'
import type { PlaceGroup } from '@/lib/places'

interface PlaceMapProps {
  places: PlaceGroup[]
  /** Where a place's pin leads: a project page on the homepage, a plate on /projects. */
  hrefFor: (group: PlaceGroup) => string
}

/**
 * The Philippines on survey paper with a pin at each verified place (spec §5),
 * in the projection lib/geo.ts shares with the outline. Decorative to the
 * accessibility tree: the list beside it names and links every project.
 */
export function PlaceMap({ places, hrefFor }: PlaceMapProps) {
  return (
    <svg viewBox={MAP_VIEWBOX} aria-hidden="true" focusable="false" className="block h-auto w-full">
      <rect width={MAP_WIDTH} height={MAP_HEIGHT} className="fill-canvas" />
      <PhilippinesOutline />
      {places.map((group) => (
        <Pin key={group.name} group={group} href={hrefFor(group)} />
      ))}
    </svg>
  )
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx vitest run tests/components/trail-link.test.tsx tests/components/survey-plate.test.tsx tests/components/map-pin.test.tsx`
Expected: PASS (3 files). If the `SurveyPlate` link test shows the attributes in another order, it still passes: it checks each attribute with `toContain`.

- [ ] **Step 7: Gates and commit**

Run the four gates. Then:

```bash
git add components/ui/trail-link.tsx components/ui/survey-plate.tsx components/map/pin.tsx components/map/place-map.tsx tests/components/trail-link.test.tsx tests/components/survey-plate.test.tsx tests/components/map-pin.test.tsx
git commit -m "feat(ui): trail link, survey plate and shared map pin" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: The homepage adopts the shared primitives

**Model:** Sonnet

**Files:**
- Replace: `components/sections/field-map.tsx`, `components/sections/own-products.tsx`, `components/sections/trail-journals.tsx`
- Modify: `components/sections/trailhead.tsx` (portrait plate), `components/sections/plan-the-route.tsx` (`SectionHeading`, form plate), `components/ui/project-shot.tsx` (one ratio)
- Create: `tests/design/survey-plate.test.ts`
- Modify: `tests/components/homepage.test.tsx` (trailhead plate, journal covers), `tests/components/trail-link.test.tsx` (homepage idiom guard)

**Interfaces:**
- Consumes: `SECTION` (Task 1), `ctaLabels` (Task 1), `TrailLink`, `TrailLinkText`, `trailLinkClass`, `SurveyPlate`, `PlaceMap`, `PlaceGlyph` (Task 2).
- Produces: `ProjectShot` without a `ratio` prop: every shot is 3:4. Journal cover ids `journal-<slug>` (h3) and `journal-<slug>-cue`.

- [ ] **Step 1: Write the failing tests**

Create `tests/design/survey-plate.test.ts`:

```ts
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { describe, expect, it } from 'vitest'
import { FieldMap } from '@/components/sections/field-map'
import { OwnProducts } from '@/components/sections/own-products'
import { PlanTheRoute } from '@/components/sections/plan-the-route'
import { Trailhead } from '@/components/sections/trailhead'
import { ToastProvider } from '@/components/ui/toaster'

// Spec §3: every photo, screenshot and map sits in one plate frame, every
// screenshot at one scale. S2 final review, carry-over 2: the homepage's four
// hand-rolled plates go through SurveyPlate.
function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return tsxFiles(full)
    return full.endsWith('.tsx') ? [full] : []
  })
}

describe('survey plates', () => {
  it('are written only by SurveyPlate', () => {
    const offenders = ['app', 'components']
      .flatMap(tsxFiles)
      .map((f) => f.replace(/\\/g, '/'))
      .filter((f) => f !== 'components/ui/survey-plate.tsx')
      .filter((f) => /\bsurvey-plate\b/.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })

  it('frame the portrait, the field map, each own product and the form', () => {
    const sections = [
      createElement(Trailhead),
      createElement(FieldMap),
      createElement(OwnProducts),
      createElement(ToastProvider, null, createElement(PlanTheRoute)),
    ]
    for (const node of sections) expect(renderToStaticMarkup(node)).toContain('class="survey-plate')
  })
})

describe('one screenshot scale', () => {
  it('frames every ProjectShot at 3:4, with no ratio to choose', () => {
    const src = readFileSync('components/ui/project-shot.tsx', 'utf8')
    expect(src).not.toMatch(/\bratio\b/)
    expect(src).not.toContain('aspect-[9/16]')
    expect(src).toContain("'aspect-[3/4]'")
  })
})
```

In `tests/components/homepage.test.tsx`, inside `describe('Trailhead', …)`, replace the test `sets the portrait on a survey plate inside the lightbox, named once` with:

```tsx
  it('sets the portrait on a survey plate around the lightbox, named once', () => {
    expect(html).toMatch(new RegExp(`<div class="survey-plate"><button type="button" aria-label="View larger image: ${heroContent.portraitAlt}" class="[^"]*w-full`))
    expect(html).not.toMatch(/<img[^>]*alt="(Christian Raro|Portrait of)/)
  })
```

Inside `describe('TrailJournals', …)`, add after the last test:

```tsx
  it('names each cover by its h3 and its cue, not by every line on it', () => {
    for (const slug of FLAGSHIP_SLUGS) {
      const project = projects.find((p) => p.slug === slug)!
      expect(html, slug).toMatch(new RegExp(`<h3 id="journal-${slug}" class="[^"]*">${escape(project.title)}</h3>`))
      expect(html, slug).toContain(`aria-labelledby="journal-${slug} journal-${slug}-cue"`)
      expect(html, slug).toMatch(new RegExp(`<span id="journal-${slug}-cue" class="button-label`))
    }
  })
```

In `tests/components/trail-link.test.tsx`, add at the end of the file (and `import { readFileSync } from 'node:fs'` at the top):

```tsx
describe('the homepage link idiom', () => {
  it('goes through TrailLink: no hand-rolled link-draw link or ProjectLink left', () => {
    for (const f of ['field-map', 'own-products', 'trail-journals']) {
      const src = readFileSync(`components/sections/${f}.tsx`, 'utf8')
      expect(src, f).not.toContain('className="link-draw"')
      expect(src, f).not.toMatch(/function (ProjectLink|Pin|PlaceGlyph)\b|const LABELS\b/)
    }
  })
})
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/design/survey-plate.test.ts tests/components/homepage.test.tsx tests/components/trail-link.test.tsx`
Expected: FAIL: `are written only by SurveyPlate` lists the four section files; `one screenshot scale` finds `ratio`; the trailhead plate test finds the class on the button, not a wrapping div; the journals test finds no `<h3 id="journal-`; the idiom guard finds `function ProjectLink` in `field-map.tsx`.

- [ ] **Step 3: Replace `components/sections/field-map.tsx`**

```tsx
import { PlaceGlyph } from '@/components/map/pin'
import { PlaceMap } from '@/components/map/place-map'
import { SECTION } from '@/components/ui/grid'
import { SectionHeading } from '@/components/ui/section-heading'
import { SurveyPlate } from '@/components/ui/survey-plate'
import { TrailLink } from '@/components/ui/trail-link'
import { projects, sectionContent } from '@/lib/data'
import { placeGroups, unplacedProjects } from '@/lib/places'
import { projectHref } from '@/lib/project-page'
import { cn } from '@/lib/utils'

/**
 * The field map (spec §5): the Philippines with a pin wherever a project's own
 * words name the place, the places listed beside it with their projects, and
 * every other project under "No fixed point", never at a guessed point. A pin
 * opens its place's first project page. All in the server HTML; nothing here
 * runs on the client.
 */
export function FieldMap() {
  const places = placeGroups(projects)
  const unplaced = unplacedProjects(projects)
  const { fieldMap } = sectionContent

  return (
    <section id="work" aria-labelledby="work-title" className={cn(SECTION, 'pb-[72px] md:pb-[112px]')}>
      <SectionHeading id="work-title" eyebrow={fieldMap.eyebrow} title={fieldMap.title} />
      <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-12">
        <SurveyPlate as="figure" className="mx-auto w-full max-w-md lg:max-w-none">
          <PlaceMap places={places} hrefFor={(group) => projectHref(group.projects[0])} />
          <figcaption className="mt-3 px-1 text-sm text-muted-strong">{fieldMap.caption}</figcaption>
        </SurveyPlate>

        {/* An explicit width, as every grid child here: content-sized, it can collapse. */}
        <div className="w-full min-w-0">
          <h3 className="map-label text-ink">{fieldMap.placesHeading}</h3>
          <ol className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {places.map((group) => (
              <li key={group.name} className="border-t border-line pt-3">
                <p className="flex items-center gap-2 text-ink">
                  <PlaceGlyph precision={group.precision} />
                  <span className="text-title">{group.name}</span>
                </p>
                <p className="map-label mt-1 text-muted">{group.precision === 'region' ? fieldMap.regionNote : group.region}</p>
                <ul className="mt-2">
                  {group.projects.map((p) => (
                    <li key={p.id}>
                      <TrailLink href={projectHref(p)} text={p.title} kind="label" />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <h3 className="map-label mt-10 text-ink">{fieldMap.unplacedHeading}</h3>
          <p className="mt-2 max-w-[48ch] text-sm text-muted-strong">{fieldMap.unplacedNote}</p>
          <ul className="mt-3 flex flex-wrap gap-x-6">
            {unplaced.map((p) => (
              <li key={p.id}>
                <TrailLink href={projectHref(p)} text={p.title} kind="label" />
              </li>
            ))}
          </ul>

          <TrailLink href="/projects" text={fieldMap.cta} className="mt-8" />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Replace `components/sections/own-products.tsx`**

```tsx
import { LivePreview } from '@/components/ui/live-preview'
import { NoPreviewTag } from '@/components/ui/no-preview-tag'
import { ProjectShot } from '@/components/ui/project-shot'
import { SECTION } from '@/components/ui/grid'
import { SectionHeading } from '@/components/ui/section-heading'
import { StatusBadge } from '@/components/ui/status-badge'
import { SurveyPlate } from '@/components/ui/survey-plate'
import { TrailLink } from '@/components/ui/trail-link'
import { catalogOrder, projectCode } from '@/lib/board'
import { ctaLabels, projects, sectionContent } from '@/lib/data'
import { canLinkLive, fullShotFor, hasFullShot, previewFor, projectHref } from '@/lib/project-page'
import { cn, extractDomain } from '@/lib/utils'
import type { Project } from '@/types'

/**
 * One own product as a survey plate: a still of the real site (or the printed
 * reason there is none, in the same 3:4 frame) on the plate, then its catalog
 * number (the one /projects shows), name, summary, status, the detail and the
 * ways in. The screenshot links to the page "Read more" names, so it stays out
 * of the tab order.
 */
function Plate({ project, code }: { project: Project; code: string }) {
  const shot = fullShotFor(project)
  const live = canLinkLive(project) ? project.links.live : undefined
  const domain = live ? extractDomain(live) : undefined
  const preview = previewFor(project)
  const titleId = `product-${project.slug}`

  return (
    <article aria-labelledby={titleId} className="flex flex-col">
      <SurveyPlate>
        {shot ? (
          <ProjectShot
            src={shot}
            label={`Screenshot of ${domain ?? project.title}`}
            href={projectHref(project)}
            duplicateLink
            slug={project.slug}
            sizes="(min-width: 768px) 520px, calc(100vw - 58px)"
            className="w-full"
          />
        ) : (
          <NoPreviewTag project={project} className="aspect-[3/4] w-full" />
        )}
      </SurveyPlate>
      <p aria-hidden="true" className="map-label tabular mt-4 text-muted">{code}</p>
      <h3 id={titleId} className="text-title mt-2 text-ink">{project.title}</h3>
      <p className="mt-2 text-muted-strong">{project.summary}</p>
      <StatusBadge status={project.status} className="mt-3" />
      <p className="mt-4 max-w-[60ch] leading-relaxed text-muted-strong">{project.description}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        {preview && <LivePreview {...preview} />}
        <TrailLink href={projectHref(project)} text={ctaLabels.readMore} srText={` about ${project.title}`} />
        {live && domain && <TrailLink href={live} text={domain} kind="label" external className="text-muted-strong" />}
      </div>
    </article>
  )
}

/**
 * His own products (spec §5) as the page's largest plates: two to a row from
 * 768px, every plate at one scale on one baseline.
 */
export function OwnProducts() {
  const order = catalogOrder(projects, hasFullShot)
  const own = order.filter((p) => p.band === 'Products')

  return (
    <section id="products" aria-labelledby="products-title" className={cn(SECTION, 'pb-[72px] md:pb-[112px]')}>
      <SectionHeading id="products-title" eyebrow={sectionContent.ownProducts.eyebrow} title={sectionContent.ownProducts.title} />
      <div className="grid items-start gap-x-8 gap-y-14 md:grid-cols-2">
        {own.map((project) => (
          <Plate key={project.id} project={project} code={projectCode(project, order)} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Replace `components/sections/trail-journals.tsx`**

```tsx
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { SECTION } from '@/components/ui/grid'
import { SectionHeading } from '@/components/ui/section-heading'
import { TrailLinkText, trailLinkClass } from '@/components/ui/trail-link'
import { edgeCode } from '@/lib/board'
import { FLAGSHIP_SLUGS, briefLead, getCaseStudy } from '@/lib/case-studies'
import { caseStudyContent, ctaLabels, projects, sectionContent, sectorNames } from '@/lib/data'
import { projectHref } from '@/lib/project-page'
import { cn } from '@/lib/utils'
import type { CaseStudy, Project } from '@/types'

interface Journal {
  project: Project
  study: CaseStudy
}

/**
 * The trail journals (spec §5): a cover for each of the six case studies, in
 * reading order: the journal's number, the project (its h3), where it runs
 * (when its own words name the place), the brief's first sentence and
 * Christian's role. Each opens its flagship page; the link is named by the
 * title and its cue, not by every line on the cover. Covers rise into place as
 * the row scrolls in, transform only (.reveal-cover), and lift on hover like
 * every catalog card.
 */
export function TrailJournals() {
  const journals = FLAGSHIP_SLUGS.flatMap((slug): Journal[] => {
    const project = projects.find((p) => p.slug === slug)
    const study = getCaseStudy(slug)
    return project && study ? [{ project, study }] : []
  })

  return (
    <section id="journals" aria-labelledby="journals-title" className={cn(SECTION, 'pb-[72px] md:pb-[112px]')}>
      <SectionHeading id="journals-title" eyebrow={sectionContent.journals.eyebrow} title={sectionContent.journals.title} />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {journals.map(({ project, study }, i) => {
          const titleId = `journal-${project.slug}`
          return (
            <li key={project.slug} className="reveal-cover" style={{ '--i': i % 3 } as CSSProperties}>
              <Link
                href={projectHref(project)}
                aria-labelledby={`${titleId} ${titleId}-cue`}
                className="lift-card group relative flex h-full min-h-[20rem] flex-col rounded border border-line bg-panel p-6"
              >
                <span aria-hidden="true" className="map-label tabular text-muted">
                  {edgeCode(i + 1, journals.length, caseStudyContent.eyebrow.caseStudy)}
                </span>
                <h3 id={titleId} className="text-title mt-8 text-ink">
                  {project.title}
                </h3>
                <span className="map-label mt-2 text-muted">
                  {project.place ? `${project.place.name} · ${sectorNames[project.sector]}` : sectorNames[project.sector]}
                </span>
                <span className="mt-5 leading-relaxed text-muted-strong">{briefLead(study)}</span>
                <span className="mt-auto pt-6 text-sm text-ink">{study.role}</span>
                <span id={`${titleId}-cue`} className={cn(trailLinkClass('action'), 'mt-4 min-h-0')}>
                  <TrailLinkText text={ctaLabels.readCaseStudy} />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
```

- [ ] **Step 6: Put the portrait on a `SurveyPlate`**

In `components/sections/trailhead.tsx`, add `import { SurveyPlate } from '@/components/ui/survey-plate'`, then replace

```tsx
          <ImageLightbox src={PORTRAIT} alt={heroContent.portraitAlt} className="survey-plate w-full">
```

with

```tsx
          <SurveyPlate>
          <ImageLightbox src={PORTRAIT} alt={heroContent.portraitAlt} className="w-full">
```

and the matching `          </ImageLightbox>` with

```tsx
          </ImageLightbox>
          </SurveyPlate>
```

Indent the lightbox block one level inside `SurveyPlate` (Prettier-style, two spaces). The wrapper `<div className="w-full max-w-[22rem] md:justify-self-end md:pt-2">` and the comment above the lightbox stay.

- [ ] **Step 7: `SectionHeading` and `SurveyPlate` in plan the route**

In `components/sections/plan-the-route.tsx`, add `import { SectionHeading } from '@/components/ui/section-heading'` and `import { SurveyPlate } from '@/components/ui/survey-plate'`. Replace

```tsx
          <p className="eyebrow mb-3">{sectionContent.contact.eyebrow}</p>
          <h2 id="contact-title" className="text-section text-ink">
            {sectionContent.contact.title}
          </h2>
```

with

```tsx
          <SectionHeading id="contact-title" eyebrow={sectionContent.contact.eyebrow} title={sectionContent.contact.title} className="mb-0" />
```

Replace `        <form onSubmit={handleSubmit} className="survey-plate space-y-5 p-6 sm:p-8 lg:p-10">` with

```tsx
        <SurveyPlate className="p-6 sm:p-8 lg:p-10">
        <form onSubmit={handleSubmit} className="space-y-5">
```

and the form's closing `        </form>` (the one right before `      </div>\n    </section>`) with

```tsx
        </form>
        </SurveyPlate>
```

Indent the form one level inside `SurveyPlate`.

- [ ] **Step 8: One screenshot ratio**

In `components/ui/project-shot.tsx`:
- delete the two lines `  /** 3:4 (product, project page) or 9:16 (rack). */` and `  ratio?: 'portrait' | 'tall'` from `ProjectShotProps`;
- delete `  ratio = 'portrait',` from the destructured parameters;
- replace `    ratio === 'tall' ? 'aspect-[9/16]' : 'aspect-[3/4]',` with `    'aspect-[3/4]',`;
- in the component's doc comment, change "A still screenshot in a fixed-aspect frame" to "A still screenshot in the 3:4 frame every screenshot shares (one scale, spec §3)".

`components/ui/rack-card.tsx` passes no `ratio`, so it still compiles.

- [ ] **Step 9: Run the tests to verify they pass**

Run: `npx vitest run tests/design/survey-plate.test.ts tests/components/homepage.test.tsx tests/components/trail-link.test.tsx tests/components/project-shot.test.tsx tests/components/catalog-consistency.test.tsx`
Expected: PASS. `homepage` still finds `class="survey-plate"` on each product plate, the pins as `<a href="/projects/…" tabindex="-1" aria-hidden="true" class="map-pin">`, the list links as `class="map-label inline-flex` with `<span class="link-draw">Title</span>`, and `href="${p.links.live}"` on each linkable product.

- [ ] **Step 10: Gates, a look, and commit**

Run the four gates. Then start the keyless server (`.claude/launch.json` config `portfolio-keyless`, `http://127.0.0.1:3100`) and check `/` at 1440 and 390: the portrait plate keeps its width (about 334px wide at 1440), the form sits on its plate, the field map and products look as before. Then:

```bash
git add components/sections components/ui/project-shot.tsx tests/design/survey-plate.test.ts tests/components/homepage.test.tsx tests/components/trail-link.test.tsx
git commit -m "refactor(home): survey plate, trail link and shared pins on the homepage" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Projects primitives: plate, legend filter, map pan, names

**Model:** Sonnet

**Files:**
- Create: `lib/map-pan.ts`, `components/ui/project-plate.tsx`, `components/ui/legend-filter.tsx`
- Modify: `lib/view-transition.ts` (add `plateTransitionName`, `bandTransitionName`), `components/ui/status-badge.tsx` (optional `id`)
- Create: `tests/content/map-pan.test.ts`, `tests/components/project-plate.test.tsx`, `tests/components/legend-filter.test.tsx`

**Interfaces:**
- Consumes: `SurveyPlate` (Task 2); `ProjectShot` (3:4 only, Task 3); `NoPreviewTag`, `StatusBadge`; `bandSlug` from `@/lib/board`; `MAP_WIDTH`, `MAP_HEIGHT` from `@/lib/geo`.
- Produces:
  - `lib/map-pan.ts`: `interface MapPan { x: number; y: number; scale: number }` (x, y: translate in % of the layer; scale ≥ 1); `IDENTITY_PAN: MapPan`; `MAX_PAN_SCALE = 1.75`; `PAN_PADDING = 90`; `panTo(points: readonly { x: number; y: number }[]): MapPan`; `panStyle(pan: MapPan): CSSProperties` (`--pan-x`, `--pan-y`, `--pan-s`).
  - `ProjectPlate({ project: Project, code: string, labelPrefix?: string })`: renders `<li id="plate-<slug>" class="project-plate …" style="--vt-plate:plate-<slug>">` around one `SurveyPlate` link; title `h3#plate-<slug>-title`, status `#plate-<slug>-status`, prefix `#plate-<slug>-prefix`.
  - `LegendFilter({ active: ProjectBand | null, projects: readonly Project[] })`.
  - `plateTransitionName(slug: string): string` → `plate-<slug>`; `bandTransitionName(heading: string): string` → `band-<heading as slug>`.
  - `StatusBadge` accepts `id?: string`.

- [ ] **Step 1: Write the failing tests**

Create `tests/content/map-pan.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { projects } from '@/lib/data'
import { MAP_HEIGHT, MAP_WIDTH, project as toMap } from '@/lib/geo'
import { IDENTITY_PAN, MAX_PAN_SCALE, panStyle, panTo, type MapPan } from '@/lib/map-pan'
import { placeGroups } from '@/lib/places'
import { BAND_ORDER } from '@/types'

// Spec §4, "pan": a /projects filter change glides the map to the band's pins.
/** Where a map point lands in the frame, in map units, under a pan. */
const land = (pan: MapPan, p: { x: number; y: number }) => ({
  x: (pan.x / 100) * MAP_WIDTH + pan.scale * p.x,
  y: (pan.y / 100) * MAP_HEIGHT + pan.scale * p.y,
})
const pointsOf = (band?: string) =>
  placeGroups(band ? projects.filter((p) => p.band === band) : projects).map((g) => toMap(g.lat, g.lng))

describe('panTo', () => {
  it('rests on the whole map when there is nothing to frame', () => {
    expect(panTo([])).toEqual(IDENTITY_PAN)
    expect(IDENTITY_PAN).toEqual({ x: 0, y: 0, scale: 1 })
  })

  it('zooms a lone pin to the cap and centres it, where the map edge allows', () => {
    const naga = toMap(13.62, 123.19)
    const pan = panTo([naga])
    expect(pan.scale).toBe(MAX_PAN_SCALE)
    const at = land(pan, naga)
    expect(Math.abs(at.x - MAP_WIDTH / 2)).toBeLessThan(1)
    expect(Math.abs(at.y - MAP_HEIGHT / 2)).toBeLessThan(1)
  })

  it('never zooms out past the whole map, nor in past the cap', () => {
    for (const band of [undefined, ...BAND_ORDER]) {
      const { scale } = panTo(pointsOf(band))
      expect(scale, band).toBeGreaterThanOrEqual(1)
      expect(scale, band).toBeLessThanOrEqual(MAX_PAN_SCALE)
    }
  })

  it('keeps every pin of every band in the frame, and no edge of the map in view', () => {
    for (const band of BAND_ORDER) {
      const points = pointsOf(band)
      const pan = panTo(points)
      for (const p of points) {
        const at = land(pan, p)
        expect(at.x, band).toBeGreaterThanOrEqual(0)
        expect(at.x, band).toBeLessThanOrEqual(MAP_WIDTH)
        expect(at.y, band).toBeGreaterThanOrEqual(0)
        expect(at.y, band).toBeLessThanOrEqual(MAP_HEIGHT)
      }
      expect(pan.x, band).toBeLessThanOrEqual(0)
      expect(pan.y, band).toBeLessThanOrEqual(0)
      expect(pan.x, band).toBeGreaterThanOrEqual((1 - pan.scale) * 100 - 0.01)
      expect(pan.y, band).toBeGreaterThanOrEqual((1 - pan.scale) * 100 - 0.01)
    }
  })

  it('writes the pan as the custom properties .map-pan reads', () => {
    expect(panStyle({ x: -10, y: -5.5, scale: 1.5 })).toEqual({ '--pan-x': '-10%', '--pan-y': '-5.5%', '--pan-s': '1.5' })
    expect(panStyle(IDENTITY_PAN)).toEqual({ '--pan-x': '0%', '--pan-y': '0%', '--pan-s': '1' })
  })
})
```

Create `tests/components/project-plate.test.tsx`:

```tsx
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { noPreviewCopy } from '@/components/ui/no-preview-tag'
import { ProjectPlate } from '@/components/ui/project-plate'
import { projects } from '@/lib/data'
import { fullShotFor } from '@/lib/project-page'
import { bandTransitionName, plateTransitionName } from '@/lib/view-transition'
import type { Project } from '@/types'

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')
const render = (project: Project, labelPrefix?: string) =>
  renderToStaticMarkup(
    <ul>
      <ProjectPlate project={project} code="01 / 20 · Products" labelPrefix={labelPrefix} />
    </ul>,
  )
const withShot = projects.find((p) => fullShotFor(p))!
const withoutShot = projects.find((p) => !fullShotFor(p))!

describe('ProjectPlate', () => {
  it('is a list item the map pins and the filter transition can find', () => {
    const html = render(withShot)
    expect(html).toContain(
      `<li id="plate-${withShot.slug}" class="project-plate min-w-0 scroll-mt-28" style="--vt-plate:${plateTransitionName(withShot.slug)}">`,
    )
  })

  it('is one link target: one link, to the project page, in the same tab, nothing else focusable', () => {
    for (const p of projects) {
      const html = render(p)
      expect(html.match(/<a /g), p.slug).toHaveLength(1)
      expect(html, p.slug).toContain(`href="/projects/${p.slug}"`)
      expect(html, p.slug).not.toContain('target=')
      expect(html, p.slug).not.toMatch(/<button|tabindex="0"/)
    }
  })

  it('names the link by the title and the status, not by every line in it', () => {
    const html = render(withShot)
    const id = `plate-${withShot.slug}`
    expect(html).toMatch(new RegExp(`<a [^>]*aria-labelledby="${id}-title ${id}-status"`))
    expect(html).toMatch(new RegExp(`<h3 id="${id}-title" class="[^"]*">${escape(withShot.title)}</h3>`))
    expect(html).toMatch(new RegExp(`<span data-status="[^"]+" class="[^"]*" id="${id}-status">`))
  })

  it('reads a prefix first when the plate stands for more than itself', () => {
    const html = render(withShot, 'Next case study')
    const id = `plate-${withShot.slug}`
    expect(html).toContain(`<span class="sr-only" id="${id}-prefix">Next case study: </span>`)
    expect(html).toMatch(new RegExp(`aria-labelledby="${id}-prefix ${id}-title ${id}-status"`))
  })

  it('shows a still of the site at 3:4 on its survey plate, marked as a morph source', () => {
    const html = render(withShot)
    expect(html).toContain('class="survey-plate lift-card')
    expect(html).toContain('project-shot__frame')
    expect(html).toContain('aspect-[3/4]')
    expect(html).toContain(`data-vt-shot="${withShot.slug}"`)
  })

  it('keeps the same 3:4 frame when there is no screenshot, with the printed reason', () => {
    const html = render(withoutShot)
    expect(html).toContain('aspect-[3/4]')
    expect(html).toContain(escape(noPreviewCopy(withoutShot)))
    expect(html).not.toContain('project-shot__frame')
    expect(html).not.toMatch(/aspect-square|aspect-\[9\/16\]/)
  })

  it('hides the catalog number and the domain from the link name', () => {
    const html = render(withShot)
    expect(html).toContain('<span aria-hidden="true" class="map-label tabular text-muted">01 / 20 · Products</span>')
    expect(html).toMatch(/<span aria-hidden="true" class="map-label mt-auto [^"]*">[^<]+<\/span>/)
  })
})

describe('plate and band names', () => {
  it('are valid custom idents', () => {
    for (const p of projects) expect(plateTransitionName(p.slug)).toMatch(/^plate-[a-z0-9-]+$/)
    expect(bandTransitionName('Custom systems')).toBe('band-custom-systems')
  })
})
```

Create `tests/components/legend-filter.test.tsx`:

```tsx
import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { LegendFilter } from '@/components/ui/legend-filter'
import { bandSlug } from '@/lib/board'
import { projects } from '@/lib/data'
import { BAND_ORDER } from '@/types'

// Spec §3: filters are a segmented control styled as a legend key.
const keys = (html: string) => html.match(/<a [\s\S]*?<\/a>/g) ?? []

describe('LegendFilter', () => {
  const all = renderToStaticMarkup(<LegendFilter active={null} projects={projects} />)

  it('offers All, then each band, as plain links over ?band=', () => {
    const hrefs = keys(all).map((k) => k.match(/href="([^"]+)"/)?.[1])
    expect(hrefs).toEqual(['/projects', ...BAND_ORDER.map((b) => `/projects?band=${bandSlug(b)}`)])
    expect(all).toMatch(/^<nav aria-label="Filter projects by band">/)
  })

  it('counts each key from the data', () => {
    const [first, ...bands] = keys(all)
    expect(first).toContain(`<span class="tabular text-muted">${projects.length}</span>`)
    BAND_ORDER.forEach((band, i) => {
      expect(bands[i]).toContain(`>${band}<`)
      expect(bands[i]).toContain(`<span class="tabular text-muted">${projects.filter((p) => p.band === band).length}</span>`)
    })
  })

  it('marks where you are: aria-current, and the only trail red in the row', () => {
    const sites = renderToStaticMarkup(<LegendFilter active="Sites" projects={projects} />)
    const current = keys(sites).filter((k) => k.includes('aria-current="true"'))
    expect(current).toHaveLength(1)
    expect(current[0]).toContain('href="/projects?band=sites"')
    expect(current[0]).toContain('bg-trail')
    for (const k of keys(sites).filter((x) => !x.includes('aria-current'))) expect(k).not.toMatch(/-trail\b/)
    expect(keys(all)[0]).toContain('aria-current="true"')
  })

  it('sits in one row that scrolls sideways, with the focus ring drawn inward', () => {
    const row = all.match(/<ul class="([^"]*)"/)?.[1] ?? ''
    expect(row).toContain('overflow-x-auto')
    expect(row).not.toContain('flex-wrap')
    expect(all).toContain('focus-visible:outline-offset-[-3px]')
  })

  it('scrolls the current key into the row on load', () => {
    const sites = renderToStaticMarkup(<LegendFilter active="Sites" projects={projects} />)
    const li = sites.match(/<li class="([^"]*)"><a [^>]*aria-current="true"/)?.[1] ?? ''
    expect(li).toContain('[scroll-initial-target:nearest]')
  })

  it('is a server component that prefetches every filtered view', () => {
    const src = readFileSync('components/ui/legend-filter.tsx', 'utf8')
    expect(src).not.toContain("'use client'")
    expect(src).toMatch(/^\s*prefetch$/m)
  })
})
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/content/map-pan.test.ts tests/components/project-plate.test.tsx tests/components/legend-filter.test.tsx`
Expected: FAIL, each with `Failed to resolve import` for `@/lib/map-pan`, `@/components/ui/project-plate`, `@/components/ui/legend-filter`.

- [ ] **Step 3: Write `lib/map-pan.ts`**

```ts
import type { CSSProperties } from 'react'
import { MAP_HEIGHT, MAP_WIDTH } from '@/lib/geo'

// The /projects map pan (spec §4, "pan"). The map layer is the whole map,
// moved and scaled by transform (origin top left) inside a frame of the same
// size: point p lands at translate + scale * p. Pure, so it is tested without
// a browser; the page writes the result as custom properties (.map-pan).

export interface MapPan {
  /** Translate, in % of the layer's own width. */
  x: number
  /** Translate, in % of the layer's own height. */
  y: number
  scale: number
}

/** The whole map, at rest. */
export const IDENTITY_PAN: MapPan = { x: 0, y: 0, scale: 1 }

/** A lone pin zooms no further than this: labels and strokes scale with it. */
export const MAX_PAN_SCALE = 1.75

/** Room kept around the framed pins, in map units (a label runs about 90 units). */
export const PAN_PADDING = 90

const round2 = (v: number) => Math.round(v * 100) / 100
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/**
 * Frame these map points: centre their box in the frame at the largest scale
 * that fits it with padding, between 1 (the whole map) and MAX_PAN_SCALE, then
 * slide back where centring would show past the map's edge.
 */
export function panTo(points: readonly { x: number; y: number }[]): MapPan {
  if (points.length === 0) return IDENTITY_PAN
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const fit = Math.min(MAP_WIDTH / (maxX - minX + 2 * PAN_PADDING), MAP_HEIGHT / (maxY - minY + 2 * PAN_PADDING))
  const scale = clamp(fit, 1, MAX_PAN_SCALE)
  const tx = clamp(MAP_WIDTH / 2 - scale * ((minX + maxX) / 2), MAP_WIDTH * (1 - scale), 0)
  const ty = clamp(MAP_HEIGHT / 2 - scale * ((minY + maxY) / 2), MAP_HEIGHT * (1 - scale), 0)
  return { x: round2((tx / MAP_WIDTH) * 100), y: round2((ty / MAP_HEIGHT) * 100), scale: round2(scale) }
}

/** The pan as the custom properties .map-pan reads (app/globals.css). */
export function panStyle(pan: MapPan): CSSProperties {
  return { '--pan-x': `${pan.x}%`, '--pan-y': `${pan.y}%`, '--pan-s': String(pan.scale) } as CSSProperties
}
```

- [ ] **Step 4: Add the plate and band names**

In `lib/view-transition.ts`, after `tierTransitionName`, add:

```ts
/** A /projects plate's name while a filter change re-lays the list out. */
export function plateTransitionName(slug: string): string {
  return `plate-${slug}`
}

/** A /projects band heading's name while a filter change re-lays the list out. */
export function bandTransitionName(heading: string): string {
  return `band-${heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}
```

(`cardTransitionName` and `tierTransitionName` stay until Task 6 deletes the rack.)

- [ ] **Step 5: Let `StatusBadge` take an id**

In `components/ui/status-badge.tsx`: add `/** Lets a link name itself by its status (aria-labelledby). */\n  id?: string` to `StatusBadgeProps`; destructure `id` (`export function StatusBadge({ status, compact = false, className, id }: StatusBadgeProps)`); and add `id={id}` as the last attribute of the outer `<span>` (after `className={…}`), so the markup reads `<span data-status="…" class="…" id="…">`.

- [ ] **Step 6: Write `ProjectPlate`**

Create `components/ui/project-plate.tsx`:

```tsx
import type { CSSProperties } from 'react'
import { NoPreviewTag } from '@/components/ui/no-preview-tag'
import { ProjectShot } from '@/components/ui/project-shot'
import { StatusBadge } from '@/components/ui/status-badge'
import { SurveyPlate } from '@/components/ui/survey-plate'
import { canLinkLive, fullShotFor, projectHref } from '@/lib/project-page'
import { extractDomain } from '@/lib/utils'
import { plateTransitionName } from '@/lib/view-transition'
import type { Project } from '@/types'

interface ProjectPlateProps {
  project: Project
  /** Its catalog number, e.g. "07 / 20 · Sites" (projectCode in lib/board.ts). */
  code: string
  /** Read before the name, e.g. "Next case study", when the plate stands for more than itself. */
  labelPrefix?: string
}

/**
 * A waypoint in the /projects list, and a case study's next stop: one survey
 * plate that is one link to the project page. On it, a still of the site's top
 * in the 3:4 frame every screenshot shares or, with no public screen, the
 * printed reason in the same 3:4 frame, so every plate stands at one scale on
 * one baseline. Under it the catalog number, name (h3), status, summary and
 * domain. The link is named by the name and the status, not by every line in
 * it. Hover lifts it like every catalog card (.lift-card). The li carries the
 * id a map pin jumps to and the name a filter change glides (.vt-filter).
 */
export function ProjectPlate({ project, code, labelPrefix }: ProjectPlateProps) {
  const shot = fullShotFor(project)
  const domain = canLinkLive(project) && project.links.live ? extractDomain(project.links.live) : undefined
  const id = `plate-${project.slug}`
  const named = [labelPrefix ? `${id}-prefix` : '', `${id}-title`, `${id}-status`].filter(Boolean).join(' ')

  return (
    <li
      id={id}
      className="project-plate min-w-0 scroll-mt-28"
      style={{ '--vt-plate': plateTransitionName(project.slug) } as CSSProperties}
    >
      <SurveyPlate href={projectHref(project)} aria-labelledby={named} className="lift-card flex h-full flex-col">
        {labelPrefix && (
          <span className="sr-only" id={`${id}-prefix`}>
            {`${labelPrefix}: `}
          </span>
        )}
        {shot ? (
          <ProjectShot
            src={shot}
            label={project.title}
            decorative
            slug={project.slug}
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, calc(100vw - 58px)"
            className="w-full"
          />
        ) : (
          <NoPreviewTag project={project} className="aspect-[3/4] w-full" />
        )}
        <div className="flex flex-1 flex-col gap-2 px-2 pb-2 pt-4">
          <span aria-hidden="true" className="map-label tabular text-muted">
            {code}
          </span>
          <h3 id={`${id}-title`} className="text-title text-ink">
            {project.title}
          </h3>
          <StatusBadge status={project.status} id={`${id}-status`} />
          <span className="text-sm leading-snug text-muted-strong">{project.summary}</span>
          {/* Visual only: the plate opens the project page, not this domain. */}
          <span aria-hidden="true" className="map-label mt-auto truncate pt-2 text-muted">
            {domain ?? 'no public URL'}
          </span>
        </div>
      </SurveyPlate>
    </li>
  )
}
```

- [ ] **Step 7: Write `LegendFilter`**

Create `components/ui/legend-filter.tsx`:

```tsx
import Link from 'next/link'
import { bandSlug } from '@/lib/board'
import { cn } from '@/lib/utils'
import { BAND_ORDER, type Project, type ProjectBand } from '@/types'

interface LegendFilterProps {
  active: ProjectBand | null
  /** The whole inventory: each key counts its band in it. */
  projects: readonly Project[]
}

/**
 * The /projects filter as a map legend's key (spec §3): one segmented row,
 * All then each band, each key with its count. Plain links over ?band=, not
 * client state: filtering needs no JavaScript and every view has a URL to
 * share. The current key is where you are, the one place trail red appears in
 * the row: a filled dot and a bar under ink text, and aria-current. On a
 * narrow screen the row scrolls sideways and the current key scrolls into it.
 */
export function LegendFilter({ active, projects }: LegendFilterProps) {
  const items = [
    { label: 'All', href: '/projects', count: projects.length, current: active === null },
    ...BAND_ORDER.map((band) => ({
      label: band,
      href: `/projects?band=${bandSlug(band)}`,
      count: projects.filter((p) => p.band === band).length,
      current: active === band,
    })),
  ]

  return (
    <nav aria-label="Filter projects by band">
      <ul className="flex overflow-x-auto rounded-sm border border-line-strong bg-panel [scrollbar-width:none]">
        {items.map((item) => (
          <li
            key={item.label}
            className={cn('shrink-0 border-r border-line last:border-r-0', item.current && '[scroll-initial-target:nearest]')}
          >
            <Link
              href={item.href}
              // /projects reads ?band=, so it renders per request: fetch each
              // filtered view ahead, or a key click waits on the server.
              prefetch
              // "true", not "page": every key is the same page, filtered.
              aria-current={item.current ? 'true' : undefined}
              className={cn(
                // The ring is drawn inward: the scrolling row would clip one drawn outside.
                'map-label relative inline-flex min-h-[48px] items-center gap-2 whitespace-nowrap px-4 transition-colors focus-visible:outline-offset-[-3px]',
                item.current ? 'text-ink' : 'text-muted-strong hover:text-ink',
              )}
            >
              <span
                aria-hidden="true"
                className={cn('h-2.5 w-2.5 shrink-0 rounded-full border-2', item.current ? 'border-trail bg-trail' : 'border-ink')}
              />
              {item.label}
              <span className="tabular text-muted">{item.count}</span>
              {item.current && <span aria-hidden="true" className="absolute inset-x-3 bottom-0 h-[3px] bg-trail" />}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npx vitest run tests/content/map-pan.test.ts tests/components/project-plate.test.tsx tests/components/legend-filter.test.tsx tests/components/status-badge.test.tsx`
Expected: PASS (4 files).

- [ ] **Step 9: Gates and commit**

Run the four gates. Then:

```bash
git add lib/map-pan.ts lib/view-transition.ts components/ui/project-plate.tsx components/ui/legend-filter.tsx components/ui/status-badge.tsx tests/content/map-pan.test.ts tests/components/project-plate.test.tsx tests/components/legend-filter.test.tsx
git commit -m "feat(projects): project plate, legend filter and map pan helpers" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: `/projects` as map and list

**Model:** Sonnet. Load `modern-web-guidance` before Step 5.

**Files:**
- Replace: `app/projects/page.tsx`
- Modify: `lib/data.ts` (`projectsPageContent.unpinned`), `app/globals.css` (map pan; plate and band transition names), `components/ui/view-transitions.tsx` (comments only)
- Replace: `tests/components/projects-page.test.tsx`, `tests/components/catalog-consistency.test.tsx`, `tests/design/view-transitions.test.tsx`

**Interfaces:**
- Consumes: `ProjectPlate`, `LegendFilter`, `panTo`, `panStyle`, `IDENTITY_PAN`, `bandTransitionName`, `plateTransitionName` (Task 4); `PlaceMap` (Task 2); `SurveyPlate`, `TrailLink`, `SECTION`, `ctaLabels`.
- Produces: `/projects` markup: `<section aria-labelledby="band-<slug>" class="plate-band …" style="--vt-band:band-<slug>">` per band with `<h2 id="band-<slug>">`; the map layer `<div class="map-pan" style="--pan-x:…;--pan-y:…;--pan-s:…">`; pins to `#plate-<slug>`. CSS `.map-pan`, `.vt-filter .project-plate`, `.vt-filter .plate-band > h2`.

- [ ] **Step 1: Write the failing tests**

Replace `tests/components/projects-page.test.tsx` with:

```tsx
import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import ProjectsPage from '@/app/projects/page'
import { noPreviewCopy } from '@/components/ui/no-preview-tag'
import { bandSlug } from '@/lib/board'
import { ctaLabels, projects, projectsPageContent, sectionContent } from '@/lib/data'
import { project as toMap } from '@/lib/geo'
import { panTo } from '@/lib/map-pan'
import { placeGroups, unplacedProjects } from '@/lib/places'
import { canLinkLive, fullShotFor } from '@/lib/project-page'
import { extractDomain } from '@/lib/utils'
import { BAND_ORDER, type Project } from '@/types'

// Spec §5: /projects is the whole inventory as a map and a list of the same
// data, filtered by band with ?band=. Server-rendered, plain links.
const render = (band?: string) => renderToStaticMarkup(ProjectsPage({ searchParams: band ? { band } : {} }))
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')
const platesOf = (html: string) => html.match(/<li id="plate-[\s\S]*?<\/li>/g) ?? []
const mapOf = (html: string) => html.slice(html.indexOf('<svg'), html.indexOf('</svg>'))

describe('/projects: the list', () => {
  const html = render()
  const plates = platesOf(html)
  const plateFor = (p: Project) => plates.find((c) => c.startsWith(`<li id="plate-${p.slug}"`)) ?? ''

  it('takes its heading from lib/data.ts, with one h1', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain(`>${projectsPageContent.title}</h1>`)
    expect(html).toContain(`>${projectsPageContent.eyebrow}</p>`)
  })

  it('shows every project once, as a plate that is one link to its page, in the same tab', () => {
    expect(plates).toHaveLength(projects.length)
    for (const p of projects) {
      const plate = plateFor(p)
      expect(plate, p.slug).toContain(`>${escape(p.title)}</h3>`)
      expect(plate.match(/<a /g), p.slug).toHaveLength(1)
      expect(plate, p.slug).toContain(`href="/projects/${p.slug}"`)
      expect(plate, p.slug).not.toContain('target="_blank"')
    }
    expect(html).not.toContain('href="#"')
  })

  it('names each band as an h2, in BAND_ORDER, with its count', () => {
    const at = BAND_ORDER.map((band) => html.search(new RegExp(`<h2 [^>]*>${band}<`)))
    for (const i of at) expect(i).toBeGreaterThan(-1)
    expect(at.slice().sort((a, b) => a - b)).toEqual(at)
    for (const band of BAND_ORDER) {
      expect(html).toContain(`>${band}<span class="tabular text-muted"> · ${projects.filter((p) => p.band === band).length}</span></h2>`)
    }
  })

  it('always states the status in words, through StatusBadge', () => {
    for (const p of projects) {
      expect(plateFor(p), p.slug).toContain('data-status=')
      expect(plateFor(p), p.slug).toMatch(/>(Live|Early access|Private|Internal|Staging)</)
    }
    for (const p of projects.filter((x) => x.status === 'staging')) expect(plateFor(p)).toContain('>Staging<')
  })

  it('shows the domain, or says plainly there is none, out of the link name', () => {
    for (const p of projects) {
      const label = canLinkLive(p) && p.links.live ? extractDomain(p.links.live) : 'no public URL'
      expect(plateFor(p), p.slug).toMatch(new RegExp(`<span aria-hidden="true" class="[^"]*">${label.replace(/\./g, '\\.')}</span>`))
    }
    expect(html).not.toContain('—')
  })

  it('stands every plate at one scale: a 3:4 still, or the printed reason in the same 3:4 frame', () => {
    for (const p of projects) {
      const plate = plateFor(p)
      expect(plate, p.slug).toContain('aspect-[3/4]')
      if (fullShotFor(p)) expect(plate, p.slug).toContain('project-shot__frame')
      else expect(plate, p.slug).toContain(escape(noPreviewCopy(p)))
    }
    expect(html).not.toMatch(/aspect-square|aspect-\[9\/16\]/)
  })

  it('numbers the plates as one strip over the whole inventory', () => {
    const codes = html.match(/\d{2} \/ \d{2} · /g) ?? []
    expect(codes).toHaveLength(projects.length)
    expect(new Set(codes).size).toBe(projects.length)
  })

  it('shows each project one-line summary on its plate', () => {
    for (const p of projects) expect(plateFor(p), p.slug).toContain(escape(p.summary))
  })

  it('offers one Start a project after the list, and the way home', () => {
    expect(html.match(/href="\/#contact"/g)).toHaveLength(1)
    expect(html.indexOf('href="/#contact"')).toBeGreaterThan(html.lastIndexOf('<li id="plate-'))
    expect(html).toContain(`<span class="link-draw">${ctaLabels.backHome}</span>`)
  })

  it('never defers a band: a lifted plate’s shadow would be clipped', () => {
    expect(html).not.toMatch(/defer-render/)
  })
})

describe('/projects: the map', () => {
  const html = render()
  const svg = mapOf(html)
  const groups = placeGroups(projects)

  it('pins every verified place, each pin jumping to its first project’s plate in the list', () => {
    for (const g of groups) {
      expect(svg, g.name).toContain(`<a href="#plate-${g.projects[0].slug}" tabindex="-1" aria-hidden="true" class="map-pin">`)
      expect(html, g.name).toContain(`<li id="plate-${g.projects[0].slug}"`)
    }
    expect(svg.match(/<a /g)).toHaveLength(groups.length)
  })

  it('never pins a project without a verified place, and says how many are list-only', () => {
    for (const p of unplacedProjects(projects)) expect(svg, p.slug).not.toContain(`#plate-${p.slug}"`)
    const note = projectsPageContent.unpinned.replace('{count}', String(unplacedProjects(projects).length))
    expect(html).toContain(escape(note))
    expect(html).toContain(escape(sectionContent.fieldMap.caption))
  })

  it('rests on the whole map when nothing is filtered', () => {
    expect(html).toContain('class="map-pan" style="--pan-x:0%;--pan-y:0%;--pan-s:1"')
  })

  it('sits on a survey plate before the list', () => {
    expect(html.indexOf('<figure class="survey-plate')).toBeGreaterThan(-1)
    expect(html.indexOf('<figure class="survey-plate')).toBeLessThan(html.indexOf('<li id="plate-'))
  })

  it('keeps trail red to the current legend key; the primary button carries its own', () => {
    const current = html.match(/<a [^>]*aria-current="true"[^>]*>[\s\S]*?<\/a>/)?.[0] ?? ''
    expect(current).toContain('bg-trail')
    expect(html.replace(current, '')).not.toMatch(/\b(?:bg|text|border|fill|stroke)-trail\b/)
  })
})

describe('/projects filter', () => {
  it('filters both views on the server, keeping each plate its unfiltered number', () => {
    const all = render()
    for (const band of BAND_ORDER) {
      const html = render(bandSlug(band))
      const inBand = projects.filter((p) => p.band === band)
      expect(platesOf(html), band).toHaveLength(inBand.length)
      for (const p of inBand) {
        const code = (s: string) => s.match(new RegExp(`(\\d{2} / \\d{2} · ${band})[\\s\\S]{0,600}?>${escape(p.title)}<`))?.[1]
        expect(code(all), p.slug).toBeDefined()
        expect(code(html), p.slug).toBe(code(all))
      }
      const groups = placeGroups(inBand)
      expect(mapOf(html).match(/<a /g)?.length ?? 0, band).toBe(groups.length)
    }
  })

  it('pans the map to the band’s pins', () => {
    for (const band of BAND_ORDER) {
      const pan = panTo(placeGroups(projects.filter((p) => p.band === band)).map((g) => toMap(g.lat, g.lng)))
      expect(render(bandSlug(band)), band).toContain(`class="map-pan" style="--pan-x:${pan.x}%;--pan-y:${pan.y}%;--pan-s:${pan.scale}"`)
    }
  })

  it('marks the current key with aria-current, as plain links', () => {
    const tag = (html: string, href: string) => html.match(new RegExp(`<a [^>]*href="${href.replace('?', '\\?')}"[^>]*>`))?.[0] ?? ''
    const sites = render('sites')
    expect(tag(sites, '/projects?band=sites')).toContain('aria-current="true"')
    expect(tag(sites, '/projects')).not.toContain('aria-current')
    expect(tag(render(), '/projects')).toContain('aria-current="true"')
  })

  it('ships no client code of its own', () => {
    expect(readFileSync('app/projects/page.tsx', 'utf8')).not.toContain("'use client'")
    expect(readFileSync('components/ui/legend-filter.tsx', 'utf8')).not.toContain("'use client'")
    expect(readFileSync('components/ui/project-plate.tsx', 'utf8')).not.toContain("'use client'")
  })
})
```

Replace `tests/components/catalog-consistency.test.tsx` with:

```tsx
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import ProjectsPage from '@/app/projects/page'
import ProjectPage from '@/app/projects/[slug]/page'
import { OwnProducts } from '@/components/sections/own-products'
import { heroContent, projects, projectsPageContent } from '@/lib/data'
import { splitProofPoint } from '@/lib/proof'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

// Refinement gate R5 (critique "Concrete UI bugs" 1-3), carried into the trail
// map: the same project carries the same catalog number everywhere, the counts
// agree, and a filtered /projects says which band it shows.

const CODE = /(\d+ \/ \d+ · [^<]+)</
// A plate on /projects. Until Task 6 a case study's next stop is still a rack card.
const PLATE = /<li (?:id="plate-|class="rack-slot)/

/** slug -> catalog number, for every chunk of markup (a plate or a product) that links one project and prints a number. */
function codes(html: string, splitter: RegExp): Map<string, string> {
  const out = new Map<string, string>()
  for (const chunk of html.split(splitter).slice(1)) {
    const slug = chunk.match(/href="\/projects\/([a-z0-9-]+)"/)?.[1]
    const code = chunk.match(CODE)?.[1]
    if (slug && code && !out.has(slug)) out.set(slug, code)
  }
  return out
}

const renderProjects = (band?: string) => renderToStaticMarkup(ProjectsPage({ searchParams: band ? { band } : {} }))

describe('catalog numbers', () => {
  const home = codes(renderToStaticMarkup(<OwnProducts />), /<article/)
  const index = codes(renderProjects(), PLATE)

  it('numbers every project once on /projects, and each own product once on /', () => {
    expect(home.size).toBe(projects.filter((p) => p.band === 'Products').length)
    expect(index.size).toBe(projects.length)
    expect(new Set(index.values()).size).toBe(projects.length)
  })

  it('gives an own product the same number on / and /projects', () => {
    for (const [slug, code] of Array.from(home)) expect(code, slug).toBe(index.get(slug))
  })

  it('keeps the number when a filter narrows /projects', () => {
    const sites = codes(renderProjects('sites'), PLATE)
    expect(sites.size).toBeGreaterThan(0)
    for (const [slug, code] of Array.from(sites)) expect(code, slug).toBe(index.get(slug))
  })

  it('numbers /projects in the order its plates appear', () => {
    const order = Array.from(index.values()).map((c) => Number(c.split(' ')[0]))
    expect(order).toEqual(order.map((_, i) => i + 1))
  })

  it('uses the same number on a case study’s next stop', () => {
    for (const slug of ['beachbus', 'el-nido-guide-ph', 'connecta-ph']) {
      if (!projects.some((p) => p.slug === slug)) continue
      const next = codes(renderToStaticMarkup(ProjectPage({ params: { slug } })), PLATE)
      for (const [s, code] of Array.from(next)) expect(code, `${slug} -> ${s}`).toBe(index.get(s))
    }
  })
})

describe('project counts', () => {
  const shipped = projects.filter((p) => p.status !== 'staging').length
  const staging = projects.length - shipped

  it('states the shipped count the hero claims, and the staging one, on /projects', () => {
    const claim = heroContent.proofPoints.find((p) => p.endsWith('projects shipped'))!
    expect(Number(splitProofPoint(claim).value)).toBe(shipped)
    expect(renderProjects()).toContain(`${projects.length} projects · ${shipped} shipped${staging ? `, ${staging} in staging` : ''}`)
  })

  it('counts a filtered view against the whole inventory', () => {
    const sites = projects.filter((p) => p.band === 'Sites')
    expect(renderProjects('sites')).toContain(`${sites.length} of ${projects.length} projects`)
  })
})

describe('/projects eyebrow', () => {
  it('says "All projects" unfiltered, and names the band when filtered', () => {
    expect(renderProjects()).toContain(`>${projectsPageContent.eyebrow}</p>`)
    const sites = renderProjects('sites')
    expect(sites).toContain(`>${projectsPageContent.bandEyebrow.replace('{band}', 'Sites')}</p>`)
    expect(sites).not.toContain(`>${projectsPageContent.eyebrow}</p>`)
  })
})
```

Replace `tests/design/view-transitions.test.tsx` with:

```tsx
import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { OwnProducts } from '@/components/sections/own-products'
import ProjectsPage from '@/app/projects/page'
import ProjectPage from '@/app/projects/[slug]/page'
import { projects } from '@/lib/data'
import { fullShotFor, screenshotsFor } from '@/lib/project-page'
import { bandTransitionName, planTransition, plateTransitionName, shotTransitionName, type ClickLike } from '@/lib/view-transition'
import { BAND_ORDER } from '@/types'
import { parseCssRules } from '@/tests/helpers/css-rules'

// Spec §4: the /projects filter re-lays its plates out (FLIP, through a view
// transition) while the map pans, and a project plate's screenshot morphs into
// the project page's header shot. One client island intercepts the clicks;
// the pages stay server-rendered and work as plain links without JavaScript.
const css = readFileSync('app/globals.css', 'utf8')
const rules = parseCssRules(css)
const island = readFileSync('components/ui/view-transitions.tsx', 'utf8')

const click: ClickLike = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false }
const at = (pathname: string, search = '') => ({ origin: 'https://example.com', pathname, search })
const link = (href: string, extra: Partial<{ target: string; download: boolean }> = {}) => ({
  href: new URL(href, 'https://example.com').href,
  target: extra.target ?? '',
  download: extra.download ?? false,
})

describe('planTransition', () => {
  it('morphs a click on a project link into its page', () => {
    expect(planTransition(click, link('/projects/latag'), at('/'))).toEqual({ kind: 'project', href: '/projects/latag', slug: 'latag' })
    expect(planTransition(click, link('/projects/giya'), at('/projects/latag'))).toEqual({ kind: 'project', href: '/projects/giya', slug: 'giya' })
  })

  it('re-lays out /projects when a legend key changes the band', () => {
    expect(planTransition(click, link('/projects?band=sites'), at('/projects'))).toEqual({ kind: 'filter', href: '/projects?band=sites' })
    expect(planTransition(click, link('/projects'), at('/projects', '?band=sites'))).toEqual({ kind: 'filter', href: '/projects' })
  })

  it('leaves a map pin’s jump to a plate on the same page to the browser', () => {
    expect(planTransition(click, link('/projects#plate-latag'), at('/projects'))).toBeNull()
    expect(planTransition(click, link('/projects?band=sites#plate-azalea-baguio'), at('/projects', '?band=sites'))).toBeNull()
  })

  it('leaves modified and non-primary clicks to the browser (new tab, new window, download)', () => {
    for (const key of ['metaKey', 'ctrlKey', 'shiftKey', 'altKey'] as const) {
      expect(planTransition({ ...click, [key]: true }, link('/projects/latag'), at('/')), key).toBeNull()
    }
    expect(planTransition({ ...click, button: 1 }, link('/projects/latag'), at('/'))).toBeNull()
    expect(planTransition({ ...click, button: 2 }, link('/projects/latag'), at('/'))).toBeNull()
    expect(planTransition({ ...click, defaultPrevented: true }, link('/projects/latag'), at('/'))).toBeNull()
    expect(planTransition(click, link('/projects/latag', { target: '_blank' }), at('/'))).toBeNull()
    expect(planTransition(click, link('/projects/latag', { download: true }), at('/'))).toBeNull()
  })

  it('leaves other origins, the same page, in-page anchors and every other route alone', () => {
    expect(planTransition(click, link('https://latag.ph/projects/latag'), at('/'))).toBeNull()
    expect(planTransition(click, link('/projects/latag'), at('/projects/latag'))).toBeNull()
    expect(planTransition(click, link('/projects?band=sites'), at('/projects', '?band=sites'))).toBeNull()
    expect(planTransition(click, link('/#contact'), at('/'))).toBeNull()
    expect(planTransition(click, link('/'), at('/projects'))).toBeNull()
    expect(planTransition(click, link('/projects'), at('/projects/latag'))).toBeNull()
    expect(planTransition(click, link('/projects'), at('/'))).toBeNull()
  })
})

describe('transition names', () => {
  it('are valid, unique custom idents per slug and per band', () => {
    const shots = projects.map((p) => shotTransitionName(p.slug))
    const plates = projects.map((p) => plateTransitionName(p.slug))
    const bands = BAND_ORDER.map((b) => bandTransitionName(b))
    for (const name of [...shots, ...plates, ...bands]) expect(name).toMatch(/^[a-z][a-z0-9-]*$/)
    expect(new Set([...shots, ...plates, ...bands]).size).toBe(projects.length * 2 + BAND_ORDER.length)
  })

  it('names exactly one element on a project page: its header screenshot', () => {
    for (const p of projects) {
      const html = renderToStaticMarkup(ProjectPage({ params: { slug: p.slug } }))
      const names = html.match(/view-transition-name:[^;"]+/g) ?? []
      const hasShot = Boolean(fullShotFor(p) || screenshotsFor(p).desktop)
      expect(names, p.slug).toEqual(hasShot ? [`view-transition-name:${shotTransitionName(p.slug)}`] : [])
    }
  })

  it('names nothing statically on the homepage’s products or /projects (the island names the clicked shot)', () => {
    for (const html of [renderToStaticMarkup(<OwnProducts />), renderToStaticMarkup(ProjectsPage({ searchParams: {} }))]) {
      expect(html).not.toMatch(/view-transition-name/)
      const marked = Array.from(html.matchAll(/data-vt-shot="([^"]+)"/g)).map((m) => m[1])
      expect(marked.length).toBeGreaterThan(0)
      for (const slug of marked) expect(projects.some((p) => p.slug === slug), slug).toBe(true)
    }
  })

  it('gives every /projects plate and band a unique name for the filter re-layout', () => {
    const html = renderToStaticMarkup(ProjectsPage({ searchParams: {} }))
    const plates = Array.from(html.matchAll(/--vt-plate:([a-z0-9-]+)/g)).map((m) => m[1])
    expect(plates).toHaveLength(projects.length)
    expect(new Set(plates).size).toBe(projects.length)
    const bands = Array.from(html.matchAll(/--vt-band:([a-z0-9-]+)/g)).map((m) => m[1])
    expect(bands).toEqual(BAND_ORDER.map((b) => bandTransitionName(b)))
  })
})

describe('the view-transition island', () => {
  it('is a client component, mounted once in the layout inside a Suspense boundary', () => {
    expect(island.trimStart()).toMatch(/^'use client'/)
    const layout = readFileSync('app/layout.tsx', 'utf8')
    expect(layout).toMatch(/<Suspense fallback=\{null\}>\s*<ViewTransitions \/>\s*<\/Suspense>/)
  })

  it('feature-detects startViewTransition before using it', () => {
    const detect = island.indexOf("'startViewTransition' in document")
    expect(detect).toBeGreaterThan(-1)
    expect(island.indexOf('document.startViewTransition(')).toBeGreaterThan(detect)
  })

  it('navigates instantly under reduced motion', () => {
    expect(island).toContain("matchMedia('(prefers-reduced-motion: reduce)')")
  })

  it('intercepts clicks before next/link, in the capture phase, through planTransition', () => {
    expect(island).toMatch(/addEventListener\('click', \w+, true\)/)
    expect(island).toContain('planTransition(')
    expect(island).toContain('event.preventDefault()')
  })

  it('waits for the route it navigated to (the commit tracker), and cleans up its names', () => {
    expect(island).toContain('usePathname()')
    expect(island).toContain('useSearchParams()')
    expect(island).toMatch(/tracker\.committed\(url\)/)
    expect(island).toMatch(/tracker\.wait\(token, routeKey\(plan\.href\), COMMIT_WAIT/)
    expect(island).toMatch(/removeProperty\('view-transition-name'\)/)
    expect(island).toMatch(/classList\.remove\('vt-filter'\)/)
  })
})

describe('the island, hardened', () => {
  it('falls back to a full navigation if the client push fails, and never leaves a rejection unhandled', () => {
    expect(island).toMatch(/window\.location\.assign\(/)
    expect(island).toMatch(/updateCallbackDone\.then\([\s\S]*?\}, fallback\)/)
  })

  it('lets only the latest transition navigate, clean up its names or move focus (rapid clicks)', () => {
    expect(island).toMatch(/const token = tracker\.begin\(\)/)
    expect(island).toMatch(/if \(!tracker\.isLatest\(token\)\) return/)
  })

  it('scrolls and focuses only on a committed route: in the frame, or after a late commit', () => {
    expect(island).toMatch(/if \(!landed \|\| plan\.kind !== 'project' \|\| !tracker\.isLatest\(token\)\) return/)
    expect(island).toMatch(/const late = plan\.kind === 'project' \? landOnCaseStudy : undefined/)
    expect(island).toMatch(/if \(!landed\) transition\.skipTransition/)
  })

  it('prefetches project pages on hover or focus, and the legend keys in full', () => {
    expect(island).toMatch(/router\.prefetch\(/)
    expect(island).toMatch(/addEventListener\('pointerover'/)
    expect(island).toMatch(/addEventListener\('focusin'/)
    expect(readFileSync('components/ui/legend-filter.tsx', 'utf8')).toMatch(/^\s*prefetch$/m)
  })

  it('morphs only to a header shot that is in the viewport, and lands at the top', () => {
    expect(island).toMatch(/function wellInViewport\(/)
    expect(island).toMatch(/if \(target && wellInViewport\(target\)\)/)
    expect(island).toMatch(/scrollTo\(\{ top: 0, left: 0, behavior: 'instant' \}\)/)
  })

  it('moves focus to the project page’s h1 after a plate navigation', () => {
    expect(island).toMatch(/focus\(\{ preventScroll: true \}\)/)
    expect(readFileSync('components/case-study/project-header.tsx', 'utf8')).toMatch(/<h1 tabIndex=\{-1\}/)
  })
})

describe('root cross-fade', () => {
  const live = rules.filter((r) => /::view-transition-(old|new)\(root\)/.test(r.selector) && !r.ancestors.join(' ').includes('reduce'))
  const old = live.find((r) => r.selector === ':root:not(.vt-filter)::view-transition-old(root)')
  const fresh = live.find((r) => r.selector === ':root:not(.vt-filter)::view-transition-new(root)')

  it('fades the old page out before the new one fades in on a project navigation, so the two never double-expose', () => {
    expect(old?.body).toMatch(/animation-name:\s*vt-fade-out/)
    expect(fresh?.body).toMatch(/animation-name:\s*vt-fade-in/)
    expect(fresh?.body).toMatch(/animation-delay:\s*calc\(var\(--dur-fast\)/)
    expect(fresh?.body).toMatch(/animation-fill-mode:\s*both/)
  })

  it('never dips the page on a filter change: its root swaps in place, so the live map pan shows through', () => {
    for (const r of live.filter((x) => /vt-fade/.test(x.body))) expect(r.selector, r.selector).toMatch(/^:root:not\(\.vt-filter\)::/)
    const filterOld = live.find((r) => r.selector === '.vt-filter::view-transition-old(root)')
    const filterNew = live.find((r) => r.selector === '.vt-filter::view-transition-new(root)')
    expect(filterOld?.body).toMatch(/animation:\s*none/)
    expect(filterOld?.body).toMatch(/opacity:\s*0/)
    expect(filterNew?.body).toMatch(/animation:\s*none/)
  })

  it('brings a header shot with no source in with the new page, not over the old one', () => {
    const lone = rules.find((r) => r.selector === '::view-transition-new(*.shot):only-child')
    expect(lone?.body).toMatch(/animation-name:\s*vt-fade-in/)
    expect(lone?.body).toMatch(/animation-delay:\s*calc\(var\(--dur-fast\) \* 0\.5\)/)
    expect(lone?.body).toMatch(/animation-fill-mode:\s*both/)
  })
})

describe('view-transition CSS', () => {
  const vt = rules.filter((r) => /::view-transition/.test(r.selector))

  it('times every group from the motion tokens', () => {
    const group = vt.find((r) => r.selector.includes('::view-transition-group(*)') && !r.ancestors.join(' ').includes('reduce'))
    expect(group).toBeDefined()
    expect(group!.body).toMatch(/animation-duration:\s*var\(--dur-normal\)/)
    expect(group!.body).toMatch(/animation-timing-function:\s*var\(--ease-smooth\)/)
    const root = vt.find((r) => /::view-transition-old\(root\)/.test(r.selector) && !r.ancestors.join(' ').includes('reduce'))
    expect(root?.body).toMatch(/animation-duration:\s*calc\(var\(--dur-fast\)/)
    for (const r of vt.filter((x) => !x.ancestors.join(' ').includes('reduce'))) {
      expect(r.body, r.selector).not.toMatch(/\d+(\.\d+)?m?s\b/)
    }
  })

  it('never blocks the pointer', () => {
    const overlay = vt.find((r) => /(^|,\s*)::view-transition(\s*,|$)/.test(r.selector))
    expect(overlay?.body).toMatch(/pointer-events:\s*none/)
  })

  it('zeroes every transition animation under reduced motion', () => {
    const off = vt.filter((r) => r.ancestors.includes('@media (prefers-reduced-motion: reduce)'))
    const selectors = off.map((r) => r.selector).join(' ')
    for (const part of ['::view-transition-group(*)', '::view-transition-old(*)', '::view-transition-new(*)']) {
      expect(selectors).toContain(part)
    }
    for (const r of off) expect(r.body).toMatch(/animation-duration:\s*0s/)
  })

  it('names plates and band headings only during a filter change', () => {
    const plate = rules.find((r) => r.selector === '.vt-filter .project-plate')
    expect(plate?.body).toMatch(/view-transition-name:\s*var\(--vt-plate\)/)
    const band = rules.find((r) => r.selector === '.vt-filter .plate-band > h2')
    expect(band?.body).toMatch(/view-transition-name:\s*var\(--vt-band\)/)
    expect(css).not.toMatch(/(^|\n)\s*\.project-plate \{[^}]*view-transition-name/)
  })
})

describe('the map pan', () => {
  it('moves the map layer by transform from the server’s custom properties, origin top left', () => {
    const pan = rules.find((r) => r.selector === '.map-pan' && /transform:/.test(r.body))
    expect(pan?.body).toMatch(/transform-origin:\s*0 0/)
    expect(pan?.body).toMatch(/transform:\s*translate\(var\(--pan-x, 0%\), var\(--pan-y, 0%\)\) scale\(var\(--pan-s, 1\)\)/)
  })

  it('glides only where motion is allowed, on tokens, never on scroll', () => {
    const glide = rules.filter((r) => /\.map-pan/.test(r.selector) && /transition/.test(r.body))
    expect(glide.length).toBeGreaterThan(0)
    for (const r of glide) {
      expect(r.ancestors).toContain('@media (prefers-reduced-motion: no-preference)')
      expect(r.body).toMatch(/transition:\s*transform var\(--dur-slow\) var\(--ease-smooth\)/)
    }
    for (const r of rules.filter((x) => /\.map-pan/.test(x.selector))) expect(r.body).not.toMatch(/animation-timeline|view-timeline/)
  })
})
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/components/projects-page.test.tsx tests/components/catalog-consistency.test.tsx tests/design/view-transitions.test.tsx`
Expected: FAIL: `projects-page` finds 0 `<li id="plate-` plates and no `map-pan`; `catalog-consistency` passes the rack-slot fallback for the next card but `/projects` index is empty; `view-transitions` finds no `--vt-plate`, no `.vt-filter .project-plate` and no `.map-pan` rule.

- [ ] **Step 3: Add the list-only note to the data**

In `lib/data.ts`, in `projectsPageContent`, after the `description` line, add:

```ts
  // Under the /projects map: how many of the projects shown have no pin.
  unpinned: 'Projects that name no single place are in the list only ({count} here).',
```

- [ ] **Step 4: Replace `app/projects/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { PlaceMap } from '@/components/map/place-map'
import { SECTION } from '@/components/ui/grid'
import { LegendFilter } from '@/components/ui/legend-filter'
import { ProjectPlate } from '@/components/ui/project-plate'
import { SurveyPlate } from '@/components/ui/survey-plate'
import { TrailLink } from '@/components/ui/trail-link'
import { catalogOrder, groupByBand, parseBandParam, projectCode, projectCount } from '@/lib/board'
import { ctaLabels, projects, projectsPageContent, sectionContent } from '@/lib/data'
import { project as toMap } from '@/lib/geo'
import { IDENTITY_PAN, panStyle, panTo } from '@/lib/map-pan'
import { placeGroups, unplacedProjects } from '@/lib/places'
import { hasFullShot } from '@/lib/project-page'
import { buildProjectsMetadata } from '@/lib/site-metadata'
import { cn } from '@/lib/utils'
import { bandTransitionName } from '@/lib/view-transition'

interface ProjectsPageProps {
  searchParams: { band?: string | string[] }
}

export function generateMetadata({ searchParams }: ProjectsPageProps): Metadata {
  // Every filtered view (?band=...) is the same page to a search engine, so
  // they all canonicalise to the unfiltered /projects.
  return buildProjectsMetadata(parseBandParam(searchParams.band))
}

// Filters on the server from ?band=, so this page ships no JavaScript of its
// own. Reading search params makes it render per request; for twenty plates of
// static data that costs nothing a visitor notices.
//
// The whole inventory as a map and a list of the same data (spec §5): the map
// pins every verified place of the projects shown, each pin jumping to its
// plate; the list stands every project as a plate, band by band in BAND_ORDER.
// Catalog numbers count in catalogOrder, so a plate keeps its number when a
// filter narrows the list, and matches the homepage. A filter frames the
// band's pins (lib/map-pan.ts); on a client navigation the layer glides there
// (.map-pan), inside the view-transition island's filter transition.
export default function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const band = parseBandParam(searchParams.band)
  const order = catalogOrder(projects, hasFullShot)
  const visible = band ? projects.filter((p) => p.band === band) : projects
  const count = projectCount(visible, projects, band !== null)
  const eyebrow = band ? projectsPageContent.bandEyebrow.replace('{band}', band) : projectsPageContent.eyebrow
  const places = placeGroups(visible)
  const pan = band ? panTo(places.map((g) => toMap(g.lat, g.lng))) : IDENTITY_PAN
  const unpinned = unplacedProjects(visible).length

  return (
    <div className={cn(SECTION, 'pb-16 pt-12 md:pb-24 md:pt-16')}>
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h1 className="text-page-h1 max-w-[14ch] text-ink">{projectsPageContent.title}</h1>
      <p className="text-lede mt-5 max-w-2xl text-muted-strong">{projectsPageContent.description}</p>

      <div className="mb-12 mt-12">
        <LegendFilter active={band} projects={projects} />
        <p className="map-label tabular mt-3 text-muted" aria-live="polite">
          {count}
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:items-start">
        <SurveyPlate as="figure" className="mx-auto w-full max-w-[20rem] sm:max-w-sm lg:sticky lg:top-24 lg:max-w-none">
          {/* The frame clips the pan layer; the layer is the whole map, moved and scaled. */}
          <div className="overflow-hidden">
            <div className="map-pan" style={panStyle(pan)}>
              <PlaceMap places={places} hrefFor={(g) => `#plate-${g.projects[0].slug}`} />
            </div>
          </div>
          <figcaption className="mt-3 px-1 text-sm text-muted-strong">
            {sectionContent.fieldMap.caption}
            {unpinned > 0 && ` ${projectsPageContent.unpinned.replace('{count}', String(unpinned))}`}
          </figcaption>
        </SurveyPlate>

        <div className="grid min-w-0 gap-16">
          {groupByBand(visible, hasFullShot).map((group) => {
            const id = bandTransitionName(group.heading)
            return (
              <section
                key={group.heading}
                aria-labelledby={id}
                className="plate-band min-w-0"
                // Names the band heading while a filter re-lays the list out (.vt-filter).
                style={{ '--vt-band': id } as CSSProperties}
              >
                <h2 id={id} className="map-label mb-5 text-ink">
                  {group.heading}
                  <span className="tabular text-muted"> · {group.projects.length}</span>
                </h2>
                <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2">
                  {group.projects.map((p) => (
                    <ProjectPlate key={p.id} project={p} code={projectCode(p, order)} />
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      </div>

      <div className="mt-20 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link href="/#contact" className="press button-primary">
          {ctaLabels.startProject}
          <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
        </Link>
        <TrailLink href="/" text={ctaLabels.backHome} />
      </div>
    </div>
  )
}
```

- [ ] **Step 5: The pan and the plate names in CSS**

In `app/globals.css`, after the line `/* /ProjectShot */`, add:

```css

/*
 * The /projects map pan (spec §4, "pan"): a filter frames the band's pins.
 * The layer is the whole map inside a clipping frame, moved and scaled by
 * transform from the --pan-* the server writes (lib/map-pan.ts). On a client
 * navigation the same element takes the new values and glides; on a full
 * load it is simply there. Transform only, and only where motion is allowed.
 */
.map-pan {
	transform-origin: 0 0;
	transform: translate(var(--pan-x, 0%), var(--pan-y, 0%)) scale(var(--pan-s, 1));
}
@media (prefers-reduced-motion: no-preference) {
	.map-pan { transition: transform var(--dur-slow) var(--ease-smooth); }
}
/* /Map pan */
```

In the "Catalog view transitions" block, replace

```css
.vt-filter .rack-slot { view-transition-name: var(--vt-card); }
.vt-filter .rack-shelf > :is(h2, h3) { view-transition-name: var(--vt-tier); }
```

with

```css
.vt-filter .project-plate { view-transition-name: var(--vt-plate); }
.vt-filter .plate-band > h2 { view-transition-name: var(--vt-band); }
```

In that block's opening comment, change "A /projects filter change names every card and tier heading" to "A /projects filter change names every plate and band heading", and add after "so they glide from old place to new;" the clause "the map pan, in the root, plays live under them;". Replace the comment `/* A 9:16 card shot and a 3:4 header shot both show the top of the page: keep\n * the top fixed and crop, never stretch, while the frame changes shape. */` with `/* A plate's shot and the header shot both show the top of the page at 3:4:\n * keep the top fixed and crop, never stretch, while the frame changes size. */`.

- [ ] **Step 6: The island's comments**

In `components/ui/view-transitions.tsx`, change only comments (the tests pin the code):
- `/** Remove every name this island set (a source shot, the filter's card names). */` → `/** Remove every name this island set (a source shot, the filter's plate names). */`
- In the `ViewTransitions` doc comment, replace "a /projects filter change re-lays the cards out (each card and tier is named for the length of the change, so the browser animates them from old to new place)" with "a /projects filter change re-lays the plates out (each plate and band heading is named for the length of the change, so the browser animates them from old to new place) while the map pans under them (a CSS transition in the live root, app/globals.css .map-pan)", and "a project link morphs the clicked screenshot into the case study's header shot" with "a project link morphs the clicked screenshot into the project page's header shot".

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npx vitest run tests/components/projects-page.test.tsx tests/components/catalog-consistency.test.tsx tests/design/view-transitions.test.tsx tests/design/client-boundary.test.ts`
Expected: PASS (4 files). Then `npm test`: `tests/design/catalog-motion.test.ts` still passes (the rack card still exists for the case study's next stop; Task 6 retires both).

- [ ] **Step 8: Gates, a look, and commit**

Run the four gates. Start the keyless server and check `http://127.0.0.1:3100/projects` at 1440 and 390, both themes: the legend row, the map plate (sticky at 1440), plates at one scale two to a row, a pin click glides to its plate, a key click pans the map (Chromium: the plates glide and the map moves; with reduced motion emulated, both jump). Then:

```bash
git add app/projects/page.tsx lib/data.ts app/globals.css components/ui/view-transitions.tsx tests/components/projects-page.test.tsx tests/components/catalog-consistency.test.tsx tests/design/view-transitions.test.tsx
git commit -m "feat(projects): map and list of the same data, legend filter and map pan" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Retire the rack

**Model:** Sonnet

**Files:**
- Delete: `components/ui/rack-card.tsx`, `components/ui/rack-tier.tsx`, `components/ui/board-filter.tsx`, `tests/design/catalog-motion.test.ts`
- Modify: `components/case-study/case-study-body.tsx` (next stop is a `ProjectPlate`), `lib/view-transition.ts` (drop the card and tier names), `app/globals.css` (rack CSS out), `components/ui/project-shot.tsx` (comments)
- Create: `tests/design/plate-motion.test.ts`, `tests/design/retired-classes.test.ts`
- Modify: `tests/design/performance.test.ts`, `tests/design/sticky-header.test.ts`, `tests/design/motion-tokens.test.ts`, `tests/components/catalog-consistency.test.tsx`, `tests/components/project-page.test.tsx`

**Interfaces:**
- Consumes: `ProjectPlate` (Task 4).
- Produces: `RETIRED` list in `tests/design/retired-classes.test.ts` that Tasks 7, 8 and 10 extend.

- [ ] **Step 1: Write the failing tests**

Create `tests/design/retired-classes.test.ts`:

```ts
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Spec §9: Portfolio 4.0's rack and its motion retire with S3. No class,
// component, token or test of theirs is left in the source or the stylesheet
// (S2 final review, carry-over 3).
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return files(full)
    return /\.tsx?$/.test(full) ? [full] : []
  })
}
const sources = ['app', 'components', 'lib'].flatMap(files).map((f) => ({ f, src: readFileSync(f, 'utf8') }))
const css = readFileSync('app/globals.css', 'utf8')

const RETIRED: [string, RegExp][] = [
  ['the rack', /\brack-(?:slot|shelf|card|tier|pocket)\b|\bRack(?:Card|Tier)\b/],
  ['the board filter', /\bBoardFilter\b|board-filter/],
  ['the lifted tier deferral', /defer-render-lift/],
  ['the rack stagger', /reveal-stagger|timeline-trigger|animation-trigger|--stagger-card|--c3\b|--c4\b/],
  ['the rack transition names', /--vt-card|--vt-tier|cardTransitionName|tierTransitionName/],
]

const GONE = [
  'components/ui/rack-card.tsx',
  'components/ui/rack-tier.tsx',
  'components/ui/board-filter.tsx',
  'tests/design/catalog-motion.test.ts',
]

describe('retired Portfolio 4.0 pieces', () => {
  it.each(RETIRED)('%s is gone from the source and the stylesheet', (_name, pattern) => {
    for (const { f, src } of sources) expect(src, f).not.toMatch(pattern)
    expect(css).not.toMatch(pattern)
  })

  it('leaves none of their files behind', () => {
    for (const f of GONE) expect(existsSync(f), f).toBe(false)
  })
})
```

Create `tests/design/plate-motion.test.ts` (it carries over what `catalog-motion` guarded that still holds):

```ts
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseCssRules } from '@/tests/helpers/css-rules'

// Screenshots are stills (CLAUDE.md, Animation): nothing about a screenshot,
// a plate or the map follows scroll; a plate answers attention with the
// catalog hover (.lift-card). Carried over from the retired catalog-motion test.
const css = readFileSync('app/globals.css', 'utf8')
const rules = parseCssRules(css)

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return files(full)
    return /\.tsx?$/.test(full) ? [full] : []
  })
}
const sources = ['app', 'components', 'lib'].flatMap(files).map((f) => ({ f, src: readFileSync(f, 'utf8') }))

describe('screenshots are stills', () => {
  it('has no ScrollPreview component, import or class left', () => {
    expect(existsSync('components/ui/scroll-preview.tsx')).toBe(false)
    for (const { f, src } of sources) expect(src, f).not.toMatch(/ScrollPreview|scroll-preview|fullShotHeight|shotHeight/)
    expect(css).not.toMatch(/scroll-preview|preview-scroll|preview-progress|--shot-h|--scroll-dur/)
  })

  it('drives nothing about a screenshot, a plate or the map from scroll', () => {
    for (const r of rules) {
      if (!/animation-timeline|view-timeline/.test(r.body)) continue
      expect(r.selector, r.selector).not.toMatch(/project-plate|project-shot|lift-card|survey-plate|map-pan|img/)
    }
  })

  it('follows no page scroll anywhere: no scroll(root), no object-position animation', () => {
    for (const r of rules) expect(r.body, r.selector).not.toMatch(/scroll\(root/)
    expect(css).not.toMatch(/transition[^;]*object-position/)
    expect(css).not.toMatch(/@keyframes[^{]*\{[^@]*?object-position/)
  })
})

describe('plate hover', () => {
  const hover = rules.filter((r) => /\.lift-card[^,]*:hover/.test(r.selector))

  it('lifts 2px, scales the shot 1.02 and turns the border accent', () => {
    const body = hover.map((r) => r.body).join(';')
    expect(body).toMatch(/transform:\s*translateY\(-2px\)/)
    expect(body).toMatch(/transform:\s*scale\(1\.02\)/)
    expect(body).toMatch(/border-color:\s*oklch\(var\(--accent\)\)/)
    expect(body).toMatch(/opacity:\s*1/)
  })

  it('sits inside the fine-pointer hover query and the no-preference query', () => {
    expect(hover.length).toBeGreaterThan(0)
    for (const r of hover) {
      const at = r.ancestors.join(' ')
      expect(at, r.selector).toContain('(hover: hover)')
      expect(at, r.selector).toContain('(pointer: fine)')
      expect(at, r.selector).toContain('(prefers-reduced-motion: no-preference)')
    }
  })

  it('transitions transform, border colour and opacity on tokens, never box-shadow', () => {
    const transitions = rules.filter((r) => /lift-card/.test(r.selector) && /transition/.test(r.body))
    expect(transitions.length).toBeGreaterThan(0)
    for (const r of transitions) {
      expect(r.body, r.selector).not.toMatch(/box-shadow/)
      expect(r.body, r.selector).toMatch(/var\(--dur-fast\)/)
      expect(r.body, r.selector).toMatch(/var\(--ease-smooth\)/)
      expect(r.body, r.selector).not.toMatch(/\d+(\.\d+)?m?s\b/)
    }
  })

  it('draws the shadow on a pseudo-element faded by opacity', () => {
    const shadow = rules.find((r) => /\.lift-card::after/.test(r.selector) && /box-shadow/.test(r.body))
    expect(shadow).toBeDefined()
    expect(shadow!.body).toMatch(/opacity:\s*0/)
    expect(shadow!.body).toMatch(/pointer-events:\s*none/)
  })

  it('gives keyboard focus the accent border without any travel', () => {
    const focus = rules.filter((r) => /\.lift-card:focus-visible/.test(r.selector))
    expect(focus.length).toBeGreaterThan(0)
    expect(focus.map((r) => r.body).join(';')).toMatch(/border-color:\s*oklch\(var\(--accent\)\)/)
    for (const r of focus) {
      expect(r.body).not.toMatch(/transform/)
      expect(r.ancestors.join(' ')).not.toContain('hover')
    }
  })

  it('is the same hover on plates, product screenshots and journal covers', () => {
    expect(readFileSync('components/ui/project-plate.tsx', 'utf8')).toContain('lift-card')
    expect(readFileSync('components/ui/project-shot.tsx', 'utf8')).toContain('lift-card')
    const covers = readFileSync('components/sections/trail-journals.tsx', 'utf8')
    expect(covers).toContain('lift-card')
    expect(covers).not.toMatch(/className="press /)
  })
})
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/design/retired-classes.test.ts tests/design/plate-motion.test.ts`
Expected: FAIL in `retired-classes`: every `RETIRED` row matches (`rack-card.tsx`, `rack-slot` in globals.css, `--stagger-card`, `cardTransitionName` …) and the four files exist. `plate-motion` passes already (it guards behaviour that holds), which is expected: it replaces `catalog-motion` before that file is deleted.

- [ ] **Step 3: The case study's next stop becomes a plate**

In `components/case-study/case-study-body.tsx`:
- replace `import { RackCard } from '@/components/ui/rack-card'` with `import { ProjectPlate } from '@/components/ui/project-plate'`;
- replace the whole `{next && ( … )}` block at the end with:

```tsx
      {next && (
        <nav aria-label={h.next} className={SECTION}>
          <p className="map-label mb-5 text-ink">{h.next}</p>
          {/* One plate, as on /projects: its link reads its label first, since the nav's name is not part of it. */}
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ProjectPlate project={next} code={projectCode(next, strip)} labelPrefix={h.next} />
          </ul>
        </nav>
      )}
```

- remove the `import { cn } from '@/lib/utils'` line if `cn` is no longer used in the file.

- [ ] **Step 4: Delete the rack**

Run: `git rm components/ui/rack-card.tsx components/ui/rack-tier.tsx components/ui/board-filter.tsx tests/design/catalog-motion.test.ts`

In `lib/view-transition.ts` delete `cardTransitionName` and `tierTransitionName` (both functions and their doc comments).

In `components/ui/project-shot.tsx`, in the `decorative` prop's doc comment replace "Inside a card that is already the link (the rack)" with "Inside a plate that is already the link (a /projects plate)" and "The card's hover (.lift-card) scales the shot inside it." with "The plate's hover (.lift-card) scales the shot inside it."; in `duplicateLink`'s comment leave the wording; in the component doc comment replace "As a link it takes the catalog's card hover" with "As a link it takes the catalog hover".

- [ ] **Step 5: The rack's CSS goes**

In `app/globals.css`:
- In `:root`, delete the two lines `/* A rack row's once-only entrance: each column starts this much later. */` and `--stagger-card: 60ms;`.
- Delete the whole `@supports (overflow-clip-margin: 1px) { .defer-render-lift { … } }` block and the three-line comment above it that starts `/* A rack tier: a hovered card's lift`.
- Replace `.render-all .defer-render,\n.render-all .defer-render-lift {` with `.render-all .defer-render {`.
- Inside `@supports (animation-timeline: view()) { @media (prefers-reduced-motion: no-preference) {` (the block holding `@keyframes reveal-cover`), delete the comment that starts `/*\n\t\t * The rack's grid: each card rises its last 16px once`, the `@keyframes reveal-stagger { … }` rule, and the whole `@supports (timeline-trigger: --card view()) { … }` block.
- In the comment above that block ("Scroll choreography. …"), delete the closing sentence "The stagger is the exception: a scroll trigger plays it once, in time (.reveal-stagger)."
- In the reduced-motion block, replace `:is(.reveal-stagger, .reveal-cover, .reveal-fold) {` with `:is(.reveal-cover, .reveal-fold) {`.
- In the `.lift-card` comment, replace "Catalog card hover (.lift-card): rack cards, a product's screenshot and the case-study covers." with "Catalog hover (.lift-card): /projects plates, a product's screenshot and the journal covers."

- [ ] **Step 6: Point the remaining tests at what is left**

`tests/design/performance.test.ts`, in `skips rendering of off-screen preview frames and far sections`, delete the two lines:

```ts
    // A hovered rack card's shadow paints past its tier: the tier defers only where it can let paint out.
    expect(css).toMatch(/@supports \(overflow-clip-margin: 1px\) \{\s*\.defer-render-lift \{[^}]*overflow-clip-margin/)
```

`tests/design/sticky-header.test.ts`: replace

```ts
    expect(css).toMatch(/\.render-all \.defer-render,\s*\.render-all \.defer-render-lift \{\s*content-visibility: visible;/)
```

with

```ts
    expect(css).toMatch(/\.render-all \.defer-render \{\s*content-visibility: visible;/)
```

`tests/design/motion-tokens.test.ts`, in `switches every reveal variant off under prefers-reduced-motion: reduce`, replace

```ts
    // S2 retires the Lobby Rack reveals; the rack's stagger, the case-study
    // fold and the cover rise (the trail journals) remain.
    expect(variants.size).toBeGreaterThanOrEqual(3)
```

with

```ts
    // S3 retires the rack's stagger; the case-study fold and the cover rise
    // (the trail journals) remain.
    expect(variants.size).toBeGreaterThanOrEqual(2)
```

`tests/components/catalog-consistency.test.tsx`: replace the two lines

```ts
// A plate on /projects. Until Task 6 a case study's next stop is still a rack card.
const PLATE = /<li (?:id="plate-|class="rack-slot)/
```

with

```ts
// A plate, on /projects and as a case study's next stop.
const PLATE = /<li id="plate-/
```

`tests/components/project-page.test.tsx`, in `names the next-case-study link on its own, out of its landmark`, replace

```ts
      expect(render(s.slug)).toContain(`<span class="sr-only">${h.next}: </span>`)
```

with

```ts
      expect(render(s.slug)).toMatch(new RegExp(`<span class="sr-only" id="plate-[a-z0-9-]+-prefix">${h.next}: </span>`))
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npx vitest run tests/design/retired-classes.test.ts tests/design/plate-motion.test.ts tests/design/performance.test.ts tests/design/sticky-header.test.ts tests/design/motion-tokens.test.ts tests/components/catalog-consistency.test.tsx tests/components/project-page.test.tsx tests/design/view-transitions.test.tsx`
Expected: PASS. If `retired-classes` still matches, the failure names the file: fix the leftover (a comment counts: reword it).

- [ ] **Step 8: Gates and commit**

Run the four gates (a stale `.next/types` entry for a deleted file means: delete `.next`, rerun). Then:

```bash
git add -A components/ui components/case-study/case-study-body.tsx lib/view-transition.ts app/globals.css tests
git commit -m "refactor(projects): retire the rack, its stagger and the catalog-motion test" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: The project header without the amber flap

**Model:** Sonnet

**Files:**
- Replace: `components/case-study/project-header.tsx`
- Modify: `app/globals.css` (delete `.on-plane` and `.crease-fold`)
- Modify: `tests/components/project-page.test.tsx`, `tests/design/retired-classes.test.ts`

**Interfaces:**
- Consumes: `SECTION`, `ctaLabels`, `TrailLink`, `StatusBadge`, `LivePreview`.
- Produces: `ProjectHeader({ project: Project, role?: string, isCaseStudy?: boolean })` (signature unchanged); `<h1 tabIndex={-1}>` kept for the island.

- [ ] **Step 1: Write the failing tests**

In `tests/design/retired-classes.test.ts`, add to `RETIRED`:

```ts
  ['the amber flap', /\bon-plane\b|crease-fold/],
```

In `tests/components/project-page.test.tsx`, replace the test `offers the live site as a secondary button, never an amber fill` with:

```ts
  it('offers the live site as the outlined secondary, beside the page’s trail-red primaries', () => {
    for (const slug of ['latag', 'el-nido-guide-ph']) {
      const html = render(slug)
      const cls = html.match(/<a [^>]*class="([^"]*)"[^>]*>Open live site/)?.[1] ?? ''
      expect(cls).toContain('button-secondary')
      expect(cls).not.toMatch(/bg-(?:trail|accent)/)
      // The header's Start a project and the page foot's.
      expect(html.match(/class="press button-primary/g)).toHaveLength(2)
    }
  })

  it('draws no amber flap: no plane, no fold', () => {
    // (The LivePreview trigger inside the header loses its accent hover in Task 9.)
    for (const p of projects) {
      const html = render(p.slug)
      const header = html.slice(html.indexOf('<header'), html.indexOf('</header>'))
      expect(header, p.slug).not.toMatch(/on-plane|accent-plane|on-accent|crease-/)
    }
  })

  it('lists the facts in map labels, the place only where the data names one', () => {
    for (const p of projects) {
      const html = render(p.slug)
      const header = html.slice(html.indexOf('<header'), html.indexOf('</header>'))
      if (p.place) expect(header, p.slug).toContain(`<li>Place: ${p.place.name}</li>`)
      else expect(header, p.slug).not.toContain('Place: ')
      expect(header, p.slug).toMatch(/<ul class="map-label /)
    }
  })
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/components/project-page.test.tsx tests/design/retired-classes.test.ts`
Expected: FAIL: the live link has `border-line-strong`, not `button-secondary`; the header holds `on-plane` and `bg-accent-plane`; no `Place: ` line; `retired-classes` finds `on-plane` and `crease-fold`.

- [ ] **Step 3: Replace `components/case-study/project-header.tsx`**

```tsx
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SECTION } from '@/components/ui/grid'
import { LivePreview } from '@/components/ui/live-preview'
import { StatusBadge } from '@/components/ui/status-badge'
import { TrailLink } from '@/components/ui/trail-link'
import { caseStudyContent, ctaLabels, paymentGateways, sectorNames } from '@/lib/data'
import { canLinkLive, liveLinkLabel, previewFor } from '@/lib/project-page'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'

interface ProjectHeaderProps {
  project: Project
  /** A flagship's role line. Short pages have none. */
  role?: string
  isCaseStudy?: boolean
}

/**
 * A project page's header, in the trail map's world: the way back to every
 * project, then on the left the eyebrow, the name, what it does and its
 * status; on the right a legend card with the role (a flagship's), the facts
 * in map labels (kind of work, the verified place, when it was built, how it
 * takes payment) and the ways in. "Start a project" is the page's trail-red
 * primary; the live site is the outlined secondary beside it.
 */
export function ProjectHeader({ project, role, isCaseStudy = false }: ProjectHeaderProps) {
  const gateways = project.technologies.filter((t) => paymentGateways.indexOf(t) !== -1)
  const facts = [
    project.sector !== 'product' ? `${project.band} · ${sectorNames[project.sector]}` : project.band,
    project.place ? `Place: ${project.place.name}` : undefined,
    project.dates ? `Built ${project.dates}` : undefined,
    gateways.length ? `Payments: ${gateways.join(', ')}` : undefined,
  ].filter((f): f is string => Boolean(f))
  const live = canLinkLive(project) ? project.links.live : undefined
  const preview = previewFor(project)

  return (
    <header className={cn(SECTION, 'pt-6 md:pt-8')}>
      <TrailLink href="/projects" text={ctaLabels.allProjects} kind="label" className="text-muted-strong" />

      <div className="mt-6 grid gap-8 md:grid-cols-[7fr_5fr] md:items-end md:gap-12">
        <div className="min-w-0">
          <p className="eyebrow">{isCaseStudy ? caseStudyContent.eyebrow.caseStudy : caseStudyContent.eyebrow.project}</p>
          {/* Focusable by script only: a plate navigation moves focus here (components/ui/view-transitions.tsx). */}
          <h1 tabIndex={-1} className="text-page-h1 mt-6 text-ink">
            {project.title}
          </h1>
          <p className="text-lede mt-5 max-w-[34rem] text-muted-strong">{project.summary}</p>
          <StatusBadge status={project.status} className="mt-6" />
        </div>

        <div className="flex flex-col rounded-sm border border-line bg-panel p-6 sm:p-8">
          {/* The role is the fact a hiring reader came for: its own line, in readable type. */}
          {role && <p className="max-w-[30rem] text-base text-ink">{role}</p>}
          <ul className={cn('map-label grid gap-1.5 text-muted-strong', role && 'mt-5')}>
            {facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/#contact" className="press button-primary">
              {ctaLabels.startProject}
              <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
            </Link>
            {preview && <LivePreview {...preview} />}
            {live && (
              <a href={live} target="_blank" rel="noopener noreferrer" className="press button-secondary">
                {liveLinkLabel(project)}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 4: Delete the flap's CSS**

In `app/globals.css` delete:
- the three-line comment starting `/* Focus on a filled plane draws in the plane's own ink.` and the rule `.on-plane :focus-visible { outline-color: oklch(var(--on-accent)); }` that follows it;
- the comment `/* A fold between two panels: across when they stack, upright from 768px. */`, the `.crease-fold { … }` rule and the `@media (min-width: 768px) { .crease-fold { … } }` block after it.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run tests/components/project-page.test.tsx tests/design/retired-classes.test.ts tests/design/primary-button.test.ts tests/design/view-transitions.test.tsx tests/design/contrast.test.ts`
Expected: PASS. `gives the role its own readable line` still matches `<p class="max-w-[30rem] text-base text-ink">`; `phrases the header dates` finds `<li>Built May – July 2025</li>`; `omits the sector …` finds `Sites · tours`.

- [ ] **Step 6: Gates, a look, and commit**

Run the four gates. Check `/projects/el-nido-guide-ph` and `/projects/latag` at 1440 and 390 in both themes (the header reads as one column on a phone; the legend card follows the status). Then:

```bash
git add components/case-study/project-header.tsx app/globals.css tests/components/project-page.test.tsx tests/design/retired-classes.test.ts
git commit -m "feat(project): header in the trail map world; the amber flap and on-plane retire" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Case studies as trail journals; short pages

**Model:** Sonnet

**Files:**
- Replace: `components/case-study/case-study-body.tsx`, `components/case-study/read-spread.tsx`, `components/case-study/project-screenshots.tsx`, `components/case-study/project-summary.tsx`, `app/projects/[slug]/page.tsx`
- Delete: `components/case-study/arrow-link-text.tsx`
- Modify: `app/globals.css` (creases, `.reveal-fold`, a stale comment)
- Modify: `tests/components/project-page.test.tsx`, `tests/design/retired-classes.test.ts`, `tests/design/motion-visibility.test.ts`, `tests/design/motion-tokens.test.ts`, `tests/components/trail-link.test.tsx`

**Interfaces:**
- Consumes: `SECTION`, `ctaLabels`, `TrailLink`, `SurveyPlate`, `ProjectPlate`, `ProjectShot` (`morphTarget`), `shotTransitionName`.
- Produces: journal entry markup `<section aria-labelledby="<id>" class="journal-entry …">` with a marker `<span aria-hidden="true" class="journal-step …">N</span>`; `CaseStudyBody`, `ReadSpread`, `ProjectScreenshots`, `ProjectSummary` keep their props.

- [ ] **Step 1: Write the failing tests**

In `tests/design/retired-classes.test.ts`, add to `RETIRED`:

```ts
  ['the folds', /crease-(?:v|h)\b|reveal-fold/],
  ['the arrow-link text', /ArrowLinkText|arrow-link-text/],
```

and add `'components/case-study/arrow-link-text.tsx'` to `GONE`.

In `tests/components/project-page.test.tsx`:

In `describe('related work', …)`, test `links a related short page back to the case study it is part of`, replace

```ts
        // A wrapped label keeps its arrow beside the last word, not alone on a line.
        expect(render(slug)).toContain(`<span class="whitespace-nowrap">${text.split(' ').pop()}<svg`)
```

with

```ts
        // A trail link: the text in one drawn underline, the arrow beside it in an inline-flex link.
        expect(render(slug)).toContain(`<span class="link-draw">${text}</span><svg`)
```

Append a new describe at the end of the file:

```ts
describe('the trail journal', () => {
  const h = caseStudyContent.headings
  const steps = (html: string) =>
    Array.from(html.matchAll(/<span aria-hidden="true" class="journal-step[^"]*">(\d+)<\/span>/g)).map((m) => Number(m[1]))

  it('walks a flagship as numbered waypoints: brief, build, decisions, stack, outcome, then the client', () => {
    for (const s of caseStudies) {
      const project = projects.find((p) => p.slug === s.slug)!
      const quoted = recommendations.some((r) => r.projectId === project.id)
      const html = render(s.slug)
      const n = quoted ? 6 : 5
      expect(steps(html), s.slug).toEqual(Array.from({ length: n }, (_, i) => i + 1))
      for (const [id, title] of [['brief', h.brief], ['built', h.built], ['decisions', h.decisions], ['stack', h.stack], ['outcome', h.outcome]]) {
        expect(html, `${s.slug} ${id}`).toMatch(new RegExp(`<section aria-labelledby="${id}" class="journal-entry[^"]*"><span aria-hidden="true" class="journal-step[^"]*">\\d+</span><h2 id="${id}"[^>]*>${title}</h2>`))
      }
    }
  })

  it('leaves short pages without waypoints', () => {
    expect(steps(render('latag'))).toEqual([])
  })

  it('sets the screenshot rail on a survey plate at the shared 3:4 scale', () => {
    for (const p of projects) {
      const html = render(p.slug)
      const rail = html.slice(html.indexOf('</header>'))
      expect(rail, p.slug).toContain('class="survey-plate')
      if (fullShotFor(p) || !p.image) expect(rail, p.slug).toContain('aspect-[3/4]')
    }
  })

  it('folds nothing and reads nothing in amber', () => {
    for (const p of projects) {
      const html = render(p.slug)
      // (StatusBadge still carries edge-code until S6; the guard here is the page's own classes.)
      expect(html, p.slug).not.toMatch(/reveal-fold|crease-|text-accent/)
    }
  })

  it('sets a short page’s stack as map-label chips', () => {
    const latag = projects.find((p) => p.slug === 'latag')!
    for (const t of latag.technologies) expect(render('latag')).toMatch(new RegExp(`<li class="map-label [^"]*">${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</li>`))
  })
})
```

In `tests/design/motion-visibility.test.ts`, replace `for (const cls of ['reveal-cover', 'reveal-fold']) {` with `for (const cls of ['reveal-cover']) {`.

In `tests/design/motion-tokens.test.ts`, replace

```ts
    // S3 retires the rack's stagger; the case-study fold and the cover rise
    // (the trail journals) remain.
    expect(variants.size).toBeGreaterThanOrEqual(2)
```

with

```ts
    // S3 retires the rack's stagger and the case-study fold; the cover rise
    // (the trail journals) remains.
    expect(variants.size).toBeGreaterThanOrEqual(1)
```

In `tests/components/trail-link.test.tsx`, in `describe('the homepage link idiom', …)`, add a second test:

```tsx
  it('goes through TrailLink on the project pages too', () => {
    for (const f of ['case-study-body', 'project-summary', 'project-header']) {
      const src = readFileSync(`components/case-study/${f}.tsx`, 'utf8')
      expect(src, f).not.toContain('className="link-draw"')
      expect(src, f).not.toContain('ArrowLinkText')
    }
    expect(readFileSync('app/projects/[slug]/page.tsx', 'utf8')).not.toContain('className="link-draw"')
  })
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/components/project-page.test.tsx tests/design/retired-classes.test.ts tests/components/trail-link.test.tsx`
Expected: FAIL: no `journal-step` markers; the rail's fallback has no `survey-plate`; `reveal-fold` and `crease-h` in the markup and CSS; `ArrowLinkText` in `case-study-body.tsx` and `project-summary.tsx`; the part-of link still uses `whitespace-nowrap`. (`motion-visibility` and `motion-tokens` still pass until the CSS goes; they are loosened ahead of it.)

- [ ] **Step 3: Replace `components/case-study/read-spread.tsx`**

```tsx
import type { ReactNode } from 'react'
import { SECTION } from '@/components/ui/grid'
import { cn } from '@/lib/utils'

interface ReadSpreadProps {
  /** Prose that comes before the rail when the page stacks (a flagship's brief). */
  lead?: ReactNode
  /** The screenshot rail. */
  rail?: ReactNode
  /** The rest of the prose. */
  children: ReactNode
}

/**
 * A project page's reading spread: the prose on the left, held to about 70
 * characters a line, and the screenshot rail on the right, sticky 96px from
 * the top, with open space between them, not a rule. Below 1024px it stacks:
 * lead, rail, then the rest, so a flagship shows the site after "The brief"
 * and a short page (no lead) shows it straight after the header.
 */
export function ReadSpread({ lead, rail, children }: ReadSpreadProps) {
  return (
    <div className={cn(SECTION, 'py-12 md:py-16')}>
      <div className="grid lg:grid-cols-[minmax(0,36rem)_minmax(0,1fr)] lg:gap-x-16">
        {lead && <div className="max-w-[36rem] lg:col-start-1 lg:row-start-1">{lead}</div>}
        {rail && (
          <div className={lead ? 'my-12 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:my-0' : 'mb-12 lg:col-start-2 lg:row-start-1 lg:mb-0'}>
            <div className="lg:sticky lg:top-24">{rail}</div>
          </div>
        )}
        <div className={lead ? 'max-w-[36rem] lg:col-start-1 lg:row-start-2 lg:mt-14' : 'max-w-[36rem] lg:col-start-1 lg:row-start-1'}>
          {children}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Replace `components/case-study/project-screenshots.tsx`**

```tsx
import Image from 'next/image'
import type { CSSProperties } from 'react'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { NoPreviewTag } from '@/components/ui/no-preview-tag'
import { ProjectShot } from '@/components/ui/project-shot'
import { SurveyPlate } from '@/components/ui/survey-plate'
import { fullShotFor, screenshotsFor } from '@/lib/project-page'
import { extractDomain } from '@/lib/utils'
import { shotTransitionName } from '@/lib/view-transition'
import type { Project } from '@/types'

// The plate is capped so the sticky rail (plate, gap, phone shot) fits a
// laptop viewport under the 96px offset.
const FRAME = 'w-full sm:max-w-[22rem] lg:max-w-[min(100%,calc((100vh_-_22rem)_*_0.75))]'

/**
 * The screenshot rail of a project page, on a survey plate: the top of the
 * site's full-page shot, still, at the 3:4 scale every screenshot shares (the
 * end of the plate-to-page morph), with the phone shot beside or below it in a
 * lightbox. A project with no full-page shot falls back to its desktop
 * screenshot; one with no public screen at all keeps the plate with the
 * printed reason in the same 3:4 frame.
 */
export function ProjectScreenshots({ project }: { project: Project }) {
  const full = fullShotFor(project)
  const shots = screenshotsFor(project)
  const name = project.links.live ? extractDomain(project.links.live) : project.title

  if (!full && !shots.desktop) {
    // A printed tag, not a picture-sized hole: it keeps the plate without pretending.
    return (
      <SurveyPlate className={FRAME}>
        <NoPreviewTag project={project} className="aspect-[3/4] w-full" />
      </SurveyPlate>
    )
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end lg:flex-col lg:items-start">
      {full ? (
        <SurveyPlate className={FRAME}>
          <ProjectShot
            src={full}
            label={`Screenshot of ${name}`}
            slug={project.slug}
            morphTarget
            sizes="(min-width: 1024px) 404px, (min-width: 640px) 336px, calc(100vw - 58px)"
            className="w-full"
          />
        </SurveyPlate>
      ) : (
        shots.desktop && (
          <SurveyPlate className={FRAME}>
            <ImageLightbox src={shots.desktop} alt={`Desktop screenshot of ${name}`} className="w-full">
              {/* The end of the plate-to-page morph, like ProjectShot's morphTarget. */}
              <span
                data-vt-shot={project.slug}
                style={{ viewTransitionName: shotTransitionName(project.slug) } as CSSProperties}
                className="block overflow-hidden"
              >
                {/* alt="" because the button around it carries the description. */}
                <Image
                  src={shots.desktop}
                  alt=""
                  width={1440}
                  height={900}
                  priority
                  sizes="(min-width: 1024px) 404px, (min-width: 640px) 336px, 100vw"
                  className="h-auto w-full"
                />
              </span>
            </ImageLightbox>
          </SurveyPlate>
        )
      )}
      {shots.mobile && (
        // Below sm the plate already fills the screen; the phone shot would only repeat it.
        <ImageLightbox src={shots.mobile} alt={`Mobile screenshot of ${name}`} className="hidden w-32 shrink-0 sm:block lg:w-24">
          <SurveyPlate as="span">
            <Image src={shots.mobile} alt="" width={390} height={844} sizes="128px" className="h-auto w-full" />
          </SurveyPlate>
        </ImageLightbox>
      )}
    </div>
  )
}
```

(`priority` stays on its own line: `tests/design/performance.test.ts` finds it there.)

- [ ] **Step 5: Replace `components/case-study/project-summary.tsx`**

```tsx
import { TrailLink } from '@/components/ui/trail-link'
import { caseStudyFor } from '@/lib/case-studies'
import { caseStudyContent, projects } from '@/lib/data'
import { projectHref } from '@/lib/project-page'
import type { Project } from '@/types'

const P = 'mt-3 text-base leading-relaxed text-muted-strong'

// A project without a case study says only what lib/data.ts already says.
export function ProjectSummary({ project }: { project: Project }) {
  const h = caseStudyContent.headings
  // A project told inside a flagship's story (BeachBus's NFC system) points to it.
  const parentStudy = caseStudyFor(project.slug)
  const parent = parentStudy ? projects.find((p) => p.slug === parentStudy.slug) : undefined
  return (
    // The prose of a short page; ReadSpread holds it to the measure.
    <>
      <h2 className="text-title text-ink">{h.about}</h2>
      <p className={P}>{project.description}</p>
      {project.contribution && <p className={P}>{project.contribution}</p>}
      {parent && (
        <TrailLink href={projectHref(parent)} text={caseStudyContent.partOf.replace('{title}', parent.title)} className="mt-3" />
      )}
      <h2 className="text-title mt-14 text-ink">{h.stack}</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.technologies.map((t) => (
          <li key={t} className="map-label rounded-sm border border-line-strong px-3 py-1.5 text-muted-strong">
            {t}
          </li>
        ))}
      </ul>
    </>
  )
}
```

- [ ] **Step 6: Replace `components/case-study/case-study-body.tsx`**

```tsx
import type { ReactNode } from 'react'
import { ReadSpread } from '@/components/case-study/read-spread'
import { SECTION } from '@/components/ui/grid'
import { ProjectPlate } from '@/components/ui/project-plate'
import { TrailLink } from '@/components/ui/trail-link'
import { catalogOrder, projectCode } from '@/lib/board'
import { FLAGSHIP_SLUGS, caseStudies } from '@/lib/case-studies'
import { caseStudyContent, projects } from '@/lib/data'
import { hasFullShot, nextInOrder, projectHref, recommendationFor } from '@/lib/project-page'
import type { CaseStudy, Project } from '@/types'

const P = 'mt-3 text-base leading-relaxed text-muted-strong'

interface EntryProps {
  id: string
  /** Its place on the route, in reading order. */
  step: number
  title: string
  children: ReactNode
}

/**
 * One entry of the trail journal: a waypoint on a dashed route line, numbered
 * in reading order (an ink ring), then its heading and prose. Nothing defers
 * or moves: the ring sits outside the entry's box, which containment would clip.
 */
function Entry({ id, step, title, children }: EntryProps) {
  return (
    <section aria-labelledby={id} className="journal-entry relative mt-14 border-l border-dashed border-line-strong pb-2 pl-8 first:mt-0">
      <span
        aria-hidden="true"
        className="journal-step map-label tabular absolute -left-[13px] top-0 flex h-[26px] w-[26px] items-center justify-center rounded-full border-2 border-ink bg-canvas text-ink"
      >
        {step}
      </span>
      <h2 id={id} className="text-title text-ink">
        {title}
      </h2>
      {children}
    </section>
  )
}

interface CaseStudyBodyProps {
  study: CaseStudy
  project: Project
  /** The screenshot rail: beside the prose from 1024px, after "The brief" below it. */
  screenshots?: ReactNode
}

/**
 * A flagship as a trail journal (spec §5): the brief, what was built, the
 * decisions (what was chosen, over what, and why), the stack, the outcome and
 * the client's own words, each a numbered waypoint on one route. Work told
 * inside this story that has its own page follows; the next case study is the
 * route's next stop, a plate as on /projects.
 */
export function CaseStudyBody({ study, project, screenshots }: CaseStudyBodyProps) {
  const h = caseStudyContent.headings
  const quote = recommendationFor(project)
  // Only flagships that already have a case study are in the reading order.
  const order = FLAGSHIP_SLUGS.filter((slug) => caseStudies.some((s) => s.slug === slug))
  const nextSlug = nextInOrder(order, study.slug)
  const next = nextSlug ? projects.find((p) => p.slug === nextSlug) : undefined
  const related = (study.related ?? [])
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p))
  const strip = catalogOrder(projects, hasFullShot)

  return (
    <>
      <ReadSpread
        lead={
          <Entry id="brief" step={1} title={h.brief}>
            {study.brief.map((p) => (
              <p key={p} className={P}>
                {p}
              </p>
            ))}
          </Entry>
        }
        rail={screenshots}
      >
        <Entry id="built" step={2} title={h.built}>
          {study.built.map((p) => (
            <p key={p} className={P}>
              {p}
            </p>
          ))}
        </Entry>

        <Entry id="decisions" step={3} title={h.decisions}>
          {/* Each decision: what was chosen, over what, and why. */}
          <ol className="mt-5 grid gap-4">
            {study.decisions.map((d, i) => (
              <li data-decision key={d.chose} className="grid grid-cols-[2.25rem_1fr] gap-x-3 rounded-sm border border-line bg-panel p-5">
                <span aria-hidden="true" className="map-label tabular pt-1 text-muted">
                  {i + 1}
                </span>
                <div>
                  <p className="text-base text-ink">
                    {d.chose} <span className="text-muted">over</span> {d.over}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-strong">{d.because}</p>
                </div>
              </li>
            ))}
          </ol>
        </Entry>

        <Entry id="stack" step={4} title={h.stack}>
          <dl className="mt-4 grid gap-3">
            {study.stack.map((s) => (
              <div key={s.name} className="grid gap-1 border-t border-line pt-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="map-label pt-0.5 text-ink">{s.name}</dt>
                <dd className="text-sm leading-relaxed text-muted-strong">{s.why}</dd>
              </div>
            ))}
          </dl>
        </Entry>

        <Entry id="outcome" step={5} title={h.outcome}>
          {study.outcome.map((p) => (
            <p key={p} className={P}>
              {p}
            </p>
          ))}
          {study.metrics && study.metrics.length > 0 && (
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {study.metrics.map((m) => (
                // dt before dd, as HTML requires; flex-col-reverse puts the number on top.
                <div key={m.label} className="flex flex-col-reverse rounded-sm border border-line bg-panel p-4">
                  <dt className="mt-1 text-sm text-muted-strong">{m.label}</dt>
                  <dd className="text-numeral break-words text-ink">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </Entry>

        {quote && (
          <Entry id="client" step={6} title={h.client}>
            <figure className="mt-4 rounded-sm border border-line bg-panel p-6">
              <blockquote className="text-lede text-ink">{quote.quote}</blockquote>
              <figcaption className="map-label mt-4 text-muted-strong">
                {quote.authorName}, {quote.authorTitle}
              </figcaption>
            </figure>
          </Entry>
        )}

        {/* Work told inside this story that also has its own page, e.g. the BeachBus NFC system. */}
        {related.length > 0 && (
          <div className="mt-14 pl-8">
            <p className="map-label text-muted-strong">{h.related}</p>
            <ul className="mt-2 flex flex-wrap gap-x-6">
              {related.map((p) => (
                <li key={p.slug}>
                  <TrailLink href={projectHref(p)} text={p.title} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </ReadSpread>

      {next && (
        <nav aria-label={h.next} className={SECTION}>
          <p className="map-label mb-5 text-ink">{h.next}</p>
          {/* One plate, as on /projects: its link reads its label first, since the nav's name is not part of it. */}
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ProjectPlate project={next} code={projectCode(next, strip)} labelPrefix={h.next} />
          </ul>
        </nav>
      )}
    </>
  )
}
```

- [ ] **Step 7: Replace `app/projects/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { CaseStudyBody } from '@/components/case-study/case-study-body'
import { ProjectHeader } from '@/components/case-study/project-header'
import { ProjectScreenshots } from '@/components/case-study/project-screenshots'
import { ProjectSummary } from '@/components/case-study/project-summary'
import { ReadSpread } from '@/components/case-study/read-spread'
import { JsonLd } from '@/components/json-ld'
import { SECTION } from '@/components/ui/grid'
import { TrailLink } from '@/components/ui/trail-link'
import { getCaseStudy } from '@/lib/case-studies'
import { ctaLabels, projects } from '@/lib/data'
import { projectHref } from '@/lib/project-page'
import { buildProjectPageMetadata } from '@/lib/site-metadata'
import { breadcrumbSchema, caseStudySchema, graph } from '@/lib/structured-data'
import { cn } from '@/lib/utils'

interface ProjectPageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

// Every project is known at build time; any other slug is a 404.
export const dynamicParams = false

export function generateMetadata({ params }: ProjectPageProps): Metadata {
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) return {}
  const study = getCaseStudy(project.slug)
  // The summary is a dot-separated fragment; the description reads as a sentence.
  const description = study ? study.brief[0] : project.description
  return buildProjectPageMetadata(project, description, projectHref(project))
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) notFound()
  const study = getCaseStudy(project.slug)

  return (
    <article>
      <JsonLd data={study ? graph(breadcrumbSchema(project), caseStudySchema(project, study)) : graph(breadcrumbSchema(project))} />
      <ProjectHeader project={project} role={study?.role} isCaseStudy={Boolean(study)} />
      {/* A flagship walks its journal from the brief; below 1024px its screenshot rail follows the brief. */}
      {study ? (
        <CaseStudyBody study={study} project={project} screenshots={<ProjectScreenshots project={project} />} />
      ) : (
        <ReadSpread rail={<ProjectScreenshots project={project} />}>
          <ProjectSummary project={project} />
        </ReadSpread>
      )}
      <div className={cn(SECTION, 'pb-16 pt-14 md:pb-24')}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/#contact" className="press button-primary">
            {ctaLabels.startProject}
            <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
          </Link>
          <TrailLink href="/projects" text={ctaLabels.allProjects} />
        </div>
      </div>
    </article>
  )
}
```

- [ ] **Step 8: Delete the arrow-link text and the folds**

Run: `git rm components/case-study/arrow-link-text.tsx`

In `app/globals.css` delete:
- the comments `/* Fold creases: 1px dashes, 6 on 5 off, in line-strong. */` and `/* An upright crease inside one sheet (a closed cover's flap edge). */`, the `.crease-v { … }` rule, the comment `/* A crease across one sheet, at every width (a decision panel's fold). */` and the `.crease-h { … }` rule;
- inside the scroll-reveal block, the `@keyframes reveal-fold { … }` rule, the comment `/* A case study's decisions: each fold panel opens down from its crease. */` and the `.reveal-fold { … }` rule;
- in the reduced-motion block, replace `:is(.reveal-cover, .reveal-fold) {` with `.reveal-cover {`.

In the comment that opens the homepage block (`/*\n * Homepage (Isarog Trail Map, …). Three\n * verbs: unfold, lift and slide.`), replace "Three verbs: unfold, lift and slide." with "Three verbs: draw, rise and pan."

- [ ] **Step 9: Run the tests to verify they pass**

Run: `npx vitest run tests/components/project-page.test.tsx tests/design/retired-classes.test.ts tests/components/trail-link.test.tsx tests/design/motion-visibility.test.ts tests/design/motion-tokens.test.ts tests/design/view-transitions.test.tsx tests/components/catalog-consistency.test.tsx tests/design/performance.test.ts tests/design/survey-plate.test.ts`
Expected: PASS. `reads brief, build, decisions, stack, outcome in that order` still finds each `>Title</h2>`; `numbers its decisions` still counts `<li data-decision`; `names exactly one element on a project page` still finds one `view-transition-name`.

- [ ] **Step 10: Gates, a look, and commit**

Run the four gates. Check `/projects/beachbus` (a flagship with a quote and related work), `/projects/el-nido-guide-ph`, `/projects/latag` and `/projects/ocs-wp-control-panel` (no screenshot) at 1440 and 390, both themes: the waypoint rings sit on the dashed line, the rail is sticky at 1440, the next stop is one plate. Click a `/projects` plate in Chromium and watch the shot morph into the rail's shot. Then:

```bash
git add -A components/case-study app/projects/[slug]/page.tsx app/globals.css tests
git commit -m "feat(project): case studies as trail journals; short pages on the trail map" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: LivePreview restyled; the S3 surfaces guard

**Model:** Sonnet

**Files:**
- Modify: `components/ui/live-preview.tsx` (classes only; logic unchanged)
- Modify: `tests/components/live-preview.test.tsx`
- Create: `tests/design/s3-surfaces.test.ts`

**Interfaces:**
- Consumes: `.button-primary`, `.button-secondary`, `.press`, `map-label`.
- Produces: nothing new; `LivePreview`'s props and behaviour are unchanged.

- [ ] **Step 1: Write the failing tests**

In `tests/components/live-preview.test.tsx`, inside `describe('LivePreview source', …)`, add:

```tsx
  it('wears the trail map: an outlined trigger, ink toggles, trail red only on the way out of a failed frame', () => {
    expect(source).toContain('className="press button-secondary"')
    expect(source).toContain("load === 'failed' ? 'button-primary' : 'button-secondary'")
    expect(source).toContain("active ? 'border-ink bg-ink text-canvas'")
    expect(source).not.toMatch(/\baccent\b|edge-code|rounded-xl/)
  })
```

Create `tests/design/s3-surfaces.test.ts`:

```ts
import { readFileSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// The surfaces S3 rebuilt wear the Isarog Trail Map only: no Portfolio 4.0
// amber (accent, accent-plane, on-accent), no edge-code labels, no creases,
// no rounded-xl paper. (The transitional tokens themselves go in S6.)
const S3 = [
  'app/projects/page.tsx',
  'app/projects/[slug]/page.tsx',
  ...readdirSync('components/case-study').map((f) => `components/case-study/${f}`),
  ...readdirSync('components/map').map((f) => `components/map/${f}`),
  'components/ui/project-plate.tsx',
  'components/ui/legend-filter.tsx',
  'components/ui/survey-plate.tsx',
  'components/ui/trail-link.tsx',
  'components/ui/live-preview.tsx',
  'components/ui/project-shot.tsx',
  'components/ui/no-preview-tag.tsx',
]
const FOREIGN = /\b(?:text|bg|border|outline|ring|fill|stroke)-(?:accent|accent-plane|on-accent)\b|\bon-plane\b|\bedge-code\b|crease-|rounded-xl/

describe('S3 surfaces', () => {
  it.each(S3)('%s uses only trail-map classes', (f) => {
    expect(readFileSync(f, 'utf8')).not.toMatch(FOREIGN)
  })
})
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/components/live-preview.test.tsx tests/design/s3-surfaces.test.ts`
Expected: FAIL: `live-preview.tsx` holds `border-accent`, `edge-code` and `rounded-xl`; every other S3 file passes.

- [ ] **Step 3: Restyle `LivePreview` (classes only)**

In `components/ui/live-preview.tsx` make exactly these replacements; change nothing else:

1. In `toggleClass`: `'inline-flex min-h-[44px] items-center gap-2 rounded border px-3 text-sm transition-colors',` → `'inline-flex min-h-[44px] items-center gap-2 rounded-sm border px-3 text-sm transition-colors',` and `active ? 'border-accent text-accent' : 'border-line-strong text-muted-strong hover:border-accent hover:text-accent',` → `active ? 'border-ink bg-ink text-canvas' : 'border-line-strong text-muted-strong hover:border-ink hover:text-ink',`
2. The dialog panel: `className="flex h-full max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-line-strong bg-panel shadow-overlay"` → `className="flex h-full max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[10px] border border-line-strong bg-panel shadow-overlay"`
3. Both badge spans (Capture, Staging site): `className="ml-3 rounded border border-line-strong px-2 py-0.5 edge-code text-xs font-normal text-muted-strong"` → `className="map-label ml-3 rounded-sm border border-line-strong px-2 py-0.5 text-muted-strong"`
4. The "Open site in a new tab" link: replace its whole `className={cn( … )}` (the two-line `cn` with `load === 'failed' ? 'border-accent-plane bg-accent-plane …'`) with `className={cn('press', load === 'failed' ? 'button-primary' : 'button-secondary')}`
5. The Close button: `className="inline-flex h-11 w-11 items-center justify-center rounded border border-line-strong text-ink transition-colors hover:border-accent hover:text-accent"` → `className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-line-strong text-ink transition-colors hover:border-ink"`
6. The capture note's link: `className="inline-flex min-h-[44px] items-center gap-1 font-medium text-accent hover:underline sm:min-h-0"` → `className="inline-flex min-h-[44px] items-center gap-1 font-medium text-ink underline underline-offset-4 sm:min-h-0"`
7. The capture failure line: `className="absolute inset-0 flex items-center justify-center px-6 text-center edge-code text-sm text-ink"` → `className="map-label absolute inset-0 flex items-center justify-center px-6 text-center text-ink"`
8. The live status line: `'absolute inset-0 flex items-center justify-center px-6 text-center edge-code text-sm',` → `'map-label absolute inset-0 flex items-center justify-center px-6 text-center',`
9. The trigger button: `className="inline-flex min-h-[44px] items-center gap-2 rounded border border-line-strong px-5 py-2.5 font-medium text-ink transition-colors hover:border-accent hover:text-accent"` → `className="press button-secondary"`

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run tests/components/live-preview.test.tsx tests/design/s3-surfaces.test.ts tests/design/primary-button.test.ts tests/design/green-means-live.test.ts tests/components/project-page.test.tsx`
Expected: PASS. Every source guard in `live-preview.test.tsx` (focus trap, inert, status region, sandbox, timeout) still holds: no logic changed.

- [ ] **Step 5: Gates, a look, and commit**

Run the four gates. Open a live preview on `/projects/latag` and a capture on `/projects/giya` at 1440 and 390: toggles invert when pressed, Escape closes, focus returns to the trigger. Then:

```bash
git add components/ui/live-preview.tsx tests/components/live-preview.test.tsx tests/design/s3-surfaces.test.ts
git commit -m "style(preview): live preview in the trail map world; guard the s3 surfaces" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Sprint verification and docs

**Model:** Sonnet. Load `modern-web-guidance` before Step 6.

**Files:**
- Modify: `CLAUDE.md` (Project Structure, Testing, Content Changes, Previews, Styling, Client/Server Boundary, Animation)
- Modify: `.impeccable/surfaces/app-page-tsx.md` ("Unresolved" and the pan line; keep LF line endings; `git add -f`)
- Modify: `tests/design/retired-classes.test.ts` (docs guard)
- Create (gitignored ledger, not committed): `.superpowers/sdd/s3-lighthouse.md`

**Interfaces:**
- Consumes: everything above.
- Produces: the finished S3 on the `v5` preview; `CLAUDE.md` matching the code.

- [ ] **Step 1: Write the failing docs test**

In `tests/design/retired-classes.test.ts`, append:

```ts
describe('the docs', () => {
  it('describe the trail map, not the retired rack', () => {
    const doc = readFileSync('CLAUDE.md', 'utf8')
    expect(doc).not.toMatch(/rack-card|rack-tier|board-filter|arrow-link-text|reveal-stagger|defer-render-lift|catalog-motion|\.on-plane|RackCard|RackTier/)
    for (const name of ['survey-plate', 'legend-filter', 'project-plate', 'trail-link', 'map-pan', 'plate-motion', 'retired-classes']) {
      expect(doc, name).toContain(name)
    }
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/design/retired-classes.test.ts -t docs`
Expected: FAIL: `CLAUDE.md` still names `rack-card`, `catalog-motion`, `.on-plane` and lacks `survey-plate`.

- [ ] **Step 3: Update `CLAUDE.md`**

Read `CLAUDE.md`, then make these edits (each names the line it replaces by its opening words):

**Testing**, the `contrast` bullet: drop "the `.on-plane` focus ring, " and "amber planes filled with `--accent-plane` and inked with `--on-accent`, " from its parenthesis.

**Testing**, replace the whole `catalog-motion` bullet with:

```markdown
- `plate-motion` (screenshots are stills: nothing about a screenshot, a plate or the map follows scroll, no `scroll(root)`; `.lift-card` hover is 2px, 1.02, accent border, inside the fine-pointer and no-preference queries, shadow on a pseudo-element, never an animated `box-shadow`), `retired-classes` (the rack, its stagger, the amber flap, the folds and `ArrowLinkText` stay gone, here and in this file)
- `grid` (the one `SECTION` constant, never spelled out), `survey-plate` (every plate through `SurveyPlate`, every screenshot 3:4), `s3-surfaces` (the S3 files use no 4.0 amber, `edge-code` or creases)
```

**Testing**, the `view-transitions` bullet: replace "(click planning, transition names, the island: …" with "(click planning, transition names `shot-`/`plate-`/`band-`, the map pan, the island: …" (rest unchanged).

**Testing**, the `tests/content/` sentence: after "the AI files," add "CTA labels, the map pan,". The `tests/components/` sentence: replace "catalog consistency: edge codes, counts, filter tabs" with "catalog consistency: catalog numbers and counts; project plate, legend filter, trail link, survey plate, map pin".

**Project Structure**, replace these lines:

```text
app/not-found.tsx … (the 404: an empty rack slot)   ->   (the 404, rebuilt in S4)
app/projects/        Full project list page (the whole rack, filtered by ?band=)
```

with

```text
app/projects/        The whole inventory as a map and a list of the same data, filtered by ?band= (legend key), the map panning to the band
```

and the `components/map/`, `components/ui/`, `components/case-study/` lines with:

```text
components/map/      contour-field, trail-path (mode load or view), trail-segment, philippines-outline, pin (Pin, PlaceGlyph, LABELS), place-map: the survey-map SVG primitives
components/ui/       Primitives: grid.ts (SECTION), status-badge, section-heading, survey-plate, trail-link, project-shot, project-plate, legend-filter, live-preview, no-preview-tag, view-transitions (client island), chat-widget, toaster, image-lightbox
components/case-study/ project-header, read-spread, project-screenshots, project-summary, case-study-body (the trail journal) — /projects/[slug]'s parts
```

and add after the `lib/board.ts` line (whose text becomes "Band grouping and ordering (groupByBand, previewFirst, catalogOrder), catalog numbers, the /projects ?band= parameter"):

```text
lib/map-pan.ts       The /projects map pan (panTo, panStyle): frames a band's pins, zoom 1-1.75, never past the map's edge
```

**Content Changes**: add `ctaLabels` to the list of typed arrays, and after the paragraph "What counts as content: …" add: "Call-to-action labels live once in `ctaLabels` (`tests/content/cta-labels.test.ts`); section copy that repeats one references it."

**Previews**, replace the ProjectShot bullet's first sentence with: "**ProjectShot** (`components/ui/project-shot.tsx`, server) shows the top of `public/assets/images/projects/<id>-full.webp` when `fullShotFor(project)` finds it, as a still in the 3:4 frame every screenshot shares, on a `SurveyPlate`. On `/projects` each project is a `ProjectPlate`: one plate, one link."; and in the "No shot" bullet add: "It keeps the same 3:4 frame, so every plate stands at one scale."

**Styling**, the world bullet: replace "(the current filter tab on `/projects`; the homepage keeps trail red to its primary buttons, trail strokes and the position marker)" with "(S3 surfaces no longer use it; trail red marks the primary buttons, trail strokes, the elevation marker and the current legend key on `/projects`)". Delete the bullet "**On an amber plane, text is `on-accent`** …" entirely, and in the "**One primary button:**" bullet delete ", a lagoon fill with amber text inside `.on-plane`". Replace "- One grid: every section uses `mx-auto max-w-6xl px-5 sm:px-8`." with "- One grid: every section and read-page block uses `SECTION` from `components/ui/grid.ts` (`mx-auto max-w-6xl px-5 sm:px-8`), never the literal (`tests/design/grid.test.ts`). Every plate is a `SurveyPlate`; every text link is a `TrailLink` (an action with an arrow, or a map label)." In "Off-screen work", delete "rack tiers use `.defer-render-lift` so a lifted card and its shadow are not clipped." and add "`/projects` bands are not deferred (a lifted plate's shadow would clip)."

**Client/Server Boundary**: replace "`ProjectShot`, `RackCard` and `RackTier` are server components; their motion is CSS." with "`ProjectShot`, `ProjectPlate`, `LegendFilter`, `SurveyPlate`, `TrailLink` and `PlaceMap` are server components; their motion is CSS."

**Animation**: in "Catalog hover (`.lift-card`)" replace "rack cards, a product's screenshot and case-study covers" with "`/projects` plates, a product's screenshot and the journal covers". Delete the whole "**Rack stagger (`.reveal-stagger`)**" bullet. In "**View transitions**" replace "glides cards and tier headings to their new places (FLIP, names `card-<slug>` / `tier-<heading>` while it runs)" with "glides plates and band headings to their new places (FLIP, names `plate-<slug>` / `band-<heading>` while it runs) while the map pans", and "a click on a project link morphs the clicked screenshot (`data-vt-shot`) into the case-study header shot" with "a click on a project link morphs the clicked screenshot (`data-vt-shot`) into the project page's rail shot". Add after it:

```markdown
- **Map pan (`.map-pan`)**: `/projects` writes `--pan-x/--pan-y/--pan-s` from `lib/map-pan.ts` on a map layer inside a clipping frame; a client navigation (a legend key) glides it (`--dur-slow`, `--ease-smooth`, transform only, no-preference only). A pin jumps to its plate (`#plate-<slug>`) on the page's smooth scroll.
```

In the "**Trail:**" bullet replace "(`catalog-motion`, `trail-motion`)" with "(`plate-motion`, `trail-motion`)". In "## Previews", replace "Every project gets a slot in the rack." with "Every project gets a plate on `/projects`.". Then search the file for any remaining `catalog-motion`, `RackCard`, `rack-card`, `board-filter`, `arrow-link-text`, `reveal-stagger`, `defer-render-lift` or `.on-plane` and reword it to the S3 truth.

In "**Reduced motion:**" delete "the stagger and " from "the gates switch off every reveal, the stagger and the trailhead sequence".

- [ ] **Step 4: Update the direction contract**

In `.impeccable/surfaces/app-page-tsx.md`, replace "Unresolved: the contour pointer shift and screenshot appear-once land in S6;\na pin opening its project's plate (map pan) lands in S3." with "Unresolved: the contour pointer shift and screenshot appear-once land in S6." and "pan (S3: the map and the page glide to a waypoint)" with "pan (/projects: a legend key glides the map to the band's pins; a pin glides the page to its plate)". Keep LF line endings (`tests/content/direction-contract.test.ts` reads the FINISH line exactly).

- [ ] **Step 5: Run the full suite**

Run: `npm test`
Expected: all files pass, including `retired-classes` (docs), `direction-contract`, `client-boundary` (8 client components).

- [ ] **Step 6: Gates and the browser check**

Run the four gates. Start the keyless server (`.claude/launch.json`, `portfolio-keyless`, `http://127.0.0.1:3100`). At 1440×900 and 390×844, light and dark:
- `/projects`: legend row fits or scrolls sideways with the current key in view; map plate sticky at 1440, above the list at 390 with no horizontal page scroll; each band key pans the map (Chromium) and keeps every pin in the frame; `?band=products` and `?band=applications` zoom to Naga City without the map's edge showing; a pin glides to its plate; plates at one scale, the no-screenshot plates the same height as the rest in their row.
- With `prefers-reduced-motion: reduce` emulated: a key click changes the map with no glide, plates do not glide.
- `/projects/beachbus`, `/projects/el-nido-guide-ph`, `/projects/latag`, `/projects/beachbus-nfc-card-system`: header, journal waypoints, rail, next plate; a `/projects` plate click morphs its shot into the rail (Chromium).
- `/`: the homepage unchanged except the four plates now through `SurveyPlate` and the journal covers' names.
- Tab through `/projects`: legend keys, then one stop per plate, then Start a project and the way home; no stop on map pins.

- [ ] **Step 7: Lighthouse**

Run Lighthouse (mobile) on `http://127.0.0.1:3100/projects` and `http://127.0.0.1:3100/projects/el-nido-guide-ph`. Record Performance, Accessibility, Best Practices, SEO, CLS and LCP for both in `.superpowers/sdd/s3-lighthouse.md` (gitignored). Accessibility 100 and CLS ≤ 0.1 are the bar; anything below goes to the controller as a finding, not a silent fix.

- [ ] **Step 8: Commit and push**

```bash
git add CLAUDE.md tests/design/retired-classes.test.ts
git add -f .impeccable/surfaces/app-page-tsx.md
git commit -m "docs(projects): claude.md and the direction contract for the s3 projects pages" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push origin v5
```

---

## Self-review against the brief and the spec

- **Scope (master plan S3):** map and list views of the same data (Task 5), `LegendFilter` over `?band=` (Tasks 4, 5), view-transition pan via the adapted island (Task 5: names, comments, the live-root pan; decision 2), `SurveyPlate` for every screenshot at one scale (Tasks 2, 3, 4, 8), `/projects/[slug]` with trail-journal case studies and short pages (Tasks 7, 8), `LivePreview` restyled with logic unchanged (Task 9), `catalog-motion` and the rack tests retired (Tasks 5, 6), `view-transitions` tests ported to the new names (Task 5).
- **S2 must-dos:** 1 Pin/PlaceGlyph/LABELS to `components/map/pin.tsx`, reused by `PlaceMap` on `/` and `/projects` (Tasks 2, 3, 5). 2 `SurveyPlate` on the trailhead, field map, own products and form (Task 3, guarded). 3 `.rack-slot`, `.rack-shelf`, `.defer-render-lift`, `.reveal-stagger` and `catalog-motion` retire in Task 6, `.on-plane` in Task 7, all under `retired-classes`. 4 `shot-<slug>` and `data-vt-shot` kept (Task 4 plate marks its shot; Task 8 rail is the target; `view-transitions` holds both). 5 RackCard invariants in `projects-page.test.tsx` and `project-plate.test.tsx`: one link target per plate; the flat no-preview card becomes the same 3:4 frame (decision 4). 6 Journal covers: `h3` plus `aria-labelledby` (Task 3). 7 `TrailLink` consolidates `ArrowLinkText` and the map-label `ProjectLink` (Tasks 2, 3, 8). 8 `SECTION` (Task 1). 9 `SectionHeading` in plan-the-route (Task 3). 10 `ctaLabels` (Task 1).
- **Fixed facts:** only `place` projects are pinned; the rest are listed and counted on `/projects` (Task 5 test). Client components stay 8 (no `'use client'` added). No `scroll(root)` (`plate-motion`). Pan is transform only, behind no-preference; no numeric motion literals in `.tsx`. Trail red: primary buttons and the current key only (Task 5 test). Green stays in `StatusBadge`. Metadata untouched (S5).
- **Placeholder scan:** every code step carries the code; edits to existing files name the exact old text. CSS deletions name each block by its opening line, because the file uses tabs.
- **Type consistency:** `TrailLink`/`TrailLinkText`/`trailLinkClass`, `SurveyPlate` props, `Pin({ group, href })`, `PlaceMap({ places, hrefFor })`, `MapPan`/`panTo`/`panStyle`/`IDENTITY_PAN`/`MAX_PAN_SCALE`, `ProjectPlate({ project, code, labelPrefix })`, `LegendFilter({ active, projects })`, `plateTransitionName`/`bandTransitionName`, `StatusBadge` `id` are used with the same names and shapes in every later task.

## Deferred to later sprints

- S4: the 404 ("Off the trail") replaces `app/not-found.tsx`'s rack-slot drawing; it already reads `SECTION` and `ctaLabels`.
- S5: `/projects` and `/projects/[slug]` titles per the spec's table, descriptions, JSON-LD.
- S6: screenshot appear-once on plates, the contour pointer shift, `ImageLightbox` and `StatusBadge` off `accent`/`edge-code`, the transitional token aliases, `DESIGN.md`.
