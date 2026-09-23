# Phase 3 — Case Studies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give all 15 projects a `/projects/[slug]` page, with full researched case studies for five flagships, on the B3 Signal design system.

**Architecture:** A statically generated server route reads `lib/data.ts` (projects, page copy) and a new typed `lib/case-studies.ts`. Pure helpers in `lib/project-page.ts` decide links, screenshots and ordering. Research subagents write gitignored dossiers; Christian answers their questions; answers are encoded as typed data. No new client components.

**Tech Stack:** Next.js 14 App Router · React 18 · TypeScript 5 strict (ES5 target: no `Set`/`Map` spread) · Tailwind 3 · Vitest + `react-dom/server` · puppeteer-core.

**Spec:** `docs/superpowers/specs/2026-09-23-case-studies-design.md`

## Global Constraints

- Branch `v4`. Never merge `v4` into `main`. Never push `main`.
- Never POST to `/api/contact` (the shell has a live `RESEND_API_KEY`). Local servers run as `RESEND_API_KEY= GROQ_API_KEY= npx next start -p 3100`.
- Code style: named exports (Next route files keep their default export); kebab-case files; no semicolons; single quotes; `@/` imports; `cn()` for class merging. Imports go at the top of a file, never appended mid-file.
- Colours only through Tailwind keys: `canvas panel ink muted muted-strong line line-strong accent on-accent live status-*`. No raw hex, no `dark:` colour pairs. `live` and `.live-pulse` only inside `StatusBadge`.
- Status only through `StatusBadge`. One grid: `mx-auto max-w-6xl px-5 sm:px-8`. One typeface (Recursive): `font-sans` / `font-mono`.
- Copy a visitor reads contains no em-dash (`—`). Headings and eyebrows live in `lib/data.ts`; control labels ("All projects", "Open live site", "Start a project") are UI chrome and may live in components.
- Client components stay at six. No new animation.
- Case-study text: first person, plain English, every sentence traceable to a dossier source or to Christian's answer. **Client numbers appear only in `metrics`, each with `clientApproved: true`.** No phone numbers, no email except `contactInfo.email`.
- Novamira MCP calls are read-only. No crawl submits any form, including add-to-cart, search and newsletter forms.
- Every task ends with `npm run type-check && npm run lint && npm test` passing. UI tasks also run `npm run build`.
- Commit trailer: `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`
- UI tasks (5, 6, 9): read `DESIGN.md`, `PRODUCT.md` and impeccable's `reference/craft-floor.md` before editing.

## Spec corrections (made in this plan's commit)

1. `ua-gated` sites (Downtown District Hotel, Aralabroad) are live in any browser: they **do** show "Open live site" and keep their existing screenshots. Only `auth-gated` and `internal` hide the link and may lack a preview.
2. Product panels keep their external domain link (a product's point is to be tried); their title links to the project page.
3. Flagship pages show the client's recommendation when `recommendations[].projectId` matches (BeachBus, Aman). Existing data, no new claims.

## File Structure

| File | Responsibility |
|---|---|
| `types/index.ts` (modify) | `CaseStudy`, `CaseStudyDecision`, `CaseStudyMetric`, `CaseStudyStackItem` |
| `lib/case-studies.ts` (create) | `FLAGSHIP_SLUGS`, `caseStudies`, `getCaseStudy()`, `caseStudyText()` |
| `lib/data.ts` (modify) | `caseStudyContent` (eyebrows, headings, no-preview copy), `sectorNames` |
| `lib/project-page.ts` (create) | `projectHref`, `canLinkLive`, `screenshotsFor`, `nextInOrder`, `recommendationFor` |
| `lib/site-metadata.ts` (modify) | `buildProjectPageTitle()` |
| `lib/chat-context.ts` (modify) | `buildCaseStudyContext()` appended to the prompt |
| `scripts/capture-screenshots.mjs` (modify) | adds `<id>-mobile.png` |
| `components/case-study/project-header.tsx` (create) | header for every project page |
| `components/case-study/project-screenshots.tsx` (create) | desktop + mobile shots, or the no-preview panel |
| `components/case-study/project-summary.tsx` (create) | short-page body |
| `components/case-study/case-study-body.tsx` (create) | flagship body |
| `app/projects/[slug]/page.tsx` (create) | the route |
| `components/ui/board-row.tsx`, `components/ui/product-panel.tsx` (modify) | link to project pages |
| `tests/content/case-studies.test.ts`, `tests/content/project-page.test.ts`, `tests/components/project-page.test.tsx` (create) | tests |
| `tests/components/board-row.test.tsx`, `tests/content/chat-context.test.ts` (modify) | rows link internally; case-study context |
| `.gitignore`, `CLAUDE.md`, `DESIGN.md` (modify) | ignore dossiers; document the new content source and page |

---

### Task 1: Case-study data model

**Files:**
- Modify: `types/index.ts` (append after `Recommendation`)
- Create: `lib/case-studies.ts`
- Modify: `lib/chat-context.ts`
- Modify: `.gitignore`
- Test: `tests/content/case-studies.test.ts` (create), `tests/content/chat-context.test.ts` (modify)

**Interfaces:**
- Produces: types `CaseStudy`, `CaseStudyMetric`, `CaseStudyDecision`, `CaseStudyStackItem`; `FLAGSHIP_SLUGS: readonly string[]`, `caseStudies: CaseStudy[]`, `getCaseStudy(slug: string): CaseStudy | undefined`, `caseStudyText(study: CaseStudy): string[]`; `buildCaseStudyContext(studies: CaseStudy[]): string`.

- [ ] **Step 1: Write the failing tests**

`tests/content/case-studies.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { FLAGSHIP_SLUGS, caseStudies, caseStudyText, getCaseStudy } from '@/lib/case-studies'
import { contactInfo, projects } from '@/lib/data'
import type { CaseStudyMetric } from '@/types'

const slugs = projects.map((p) => p.slug)

// Compile-time guard, checked by `npm run type-check`: a metric the client has
// not approved cannot be written down at all.
// @ts-expect-error clientApproved must be the literal `true`
const unapproved: CaseStudyMetric = { value: '1', label: 'x', clientApproved: false }
void unapproved

describe('case studies', () => {
  it('names five flagships, each a real project', () => {
    expect(FLAGSHIP_SLUGS).toHaveLength(5)
    for (const slug of FLAGSHIP_SLUGS) expect(slugs).toContain(slug)
  })

  it('exist only for flagships, once each', () => {
    const seen: string[] = []
    for (const study of caseStudies) {
      expect(FLAGSHIP_SLUGS).toContain(study.slug)
      expect(seen).not.toContain(study.slug)
      seen.push(study.slug)
    }
  })

  it('fill every body section', () => {
    for (const s of caseStudies) {
      expect(s.role.trim()).not.toBe('')
      for (const section of [s.brief, s.built, s.outcome]) {
        expect(section.length).toBeGreaterThan(0)
        for (const p of section) expect(p.trim()).not.toBe('')
      }
      expect(s.stack.length).toBeGreaterThan(0)
    }
  })

  it('record two to four decisions, each with its alternative and reason', () => {
    for (const s of caseStudies) {
      expect(s.decisions.length).toBeGreaterThanOrEqual(2)
      expect(s.decisions.length).toBeLessThanOrEqual(4)
      for (const d of s.decisions) for (const v of [d.chose, d.over, d.because]) expect(v.trim()).not.toBe('')
    }
  })

  it('publish only client-approved numbers', () => {
    for (const s of caseStudies) for (const m of s.metrics ?? []) expect(m.clientApproved).toBe(true)
  })

  it('link related work only to real projects', () => {
    for (const s of caseStudies) for (const r of s.related ?? []) expect(slugs).toContain(r)
  })

  it('contain no phone number, no private email and no em-dash', () => {
    for (const s of caseStudies) {
      for (const text of caseStudyText(s)) {
        expect(text).not.toMatch(/\+?\d[\d\s-]{8,}\d/)
        for (const email of text.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) ?? []) expect(email).toBe(contactInfo.email)
        expect(text).not.toContain('—')
      }
    }
  })

  it('looks a case study up by slug', () => {
    expect(getCaseStudy('no-such-project')).toBeUndefined()
    for (const s of caseStudies) expect(getCaseStudy(s.slug)).toBe(s)
  })
})
```

In `tests/content/chat-context.test.ts`, add to the imports at the top of the file:

```ts
import { buildCaseStudyContext } from '@/lib/chat-context'
import type { CaseStudy } from '@/types'
```

(merge `buildCaseStudyContext` into the existing `@/lib/chat-context` import if there is one), and append at the end of the file:

```ts
describe('case study context', () => {
  const study: CaseStudy = {
    slug: 'giya',
    role: 'Sole developer',
    brief: ['The brief paragraph.'],
    built: ['What was built.'],
    decisions: [
      { chose: 'A', over: 'B', because: 'reason one' },
      { chose: 'C', over: 'D', because: 'reason two' },
    ],
    stack: [{ name: 'Next.js', why: 'server rendering' }],
    outcome: ['It shipped.'],
    metrics: [{ value: '10+', label: 'partners', clientApproved: true }],
  }

  it('states every section of a case study under its project title', () => {
    const text = buildCaseStudyContext([study])
    for (const s of ['Giya', 'Sole developer', 'The brief paragraph.', 'What was built.', 'Chose A over B because reason one', 'Next.js: server rendering', 'It shipped.', '10+ partners']) {
      expect(text).toContain(s)
    }
  })

  it('says nothing when there are no case studies', () => {
    expect(buildCaseStudyContext([])).toBe('')
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run tests/content/case-studies.test.ts tests/content/chat-context.test.ts`
Expected: FAIL — `Cannot find module '@/lib/case-studies'` / `buildCaseStudyContext` is not exported.

- [ ] **Step 3: Implement**

Append to `types/index.ts`:

```ts
/** A published number. The literal `true` makes an unapproved number a compile error. */
export interface CaseStudyMetric {
  value: string
  label: string
  /** Christian confirmed the client agreed to publish this number. */
  clientApproved: true
}

export interface CaseStudyDecision {
  chose: string
  over: string
  because: string
}

export interface CaseStudyStackItem {
  name: string
  why: string
}

/** A flagship's researched case study. Every sentence traces to a dossier source or to Christian. */
export interface CaseStudy {
  /** Equals a Project.slug. */
  slug: string
  /** What Christian did, e.g. "Sole developer: design, build and payments". */
  role: string
  brief: string[]
  built: string[]
  /** Two to four. */
  decisions: CaseStudyDecision[]
  stack: CaseStudyStackItem[]
  /** Qualitative. Numbers go in `metrics`. */
  outcome: string[]
  metrics?: CaseStudyMetric[]
  /** Other project slugs told as part of this story, e.g. the BeachBus NFC system. */
  related?: string[]
}
```

Create `lib/case-studies.ts`:

```ts
import type { CaseStudy } from '@/types'

// The five projects with a full case study, in reading order: the "next case
// study" link follows it. Every other project gets a short page built from
// lib/data.ts alone. Spec: docs/superpowers/specs/2026-09-23-case-studies-design.md
export const FLAGSHIP_SLUGS: readonly string[] = [
  'el-nido-guide-ph',
  'beachbus-palawan',
  'acad1-review-center',
  'aman-group-web-app',
  'giya',
]

// Entries are added as Christian answers each research dossier's questions.
// Nothing here is drafted from memory: see the dossiers in
// docs/case-studies/research/ (gitignored, may hold client numbers).
export const caseStudies: CaseStudy[] = []

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((s) => s.slug === slug)
}

/** Every string a visitor can read on the case study, for copy checks. */
export function caseStudyText(s: CaseStudy): string[] {
  return [
    s.role,
    ...s.brief,
    ...s.built,
    ...s.decisions.map((d) => `${d.chose} ${d.over} ${d.because}`),
    ...s.stack.map((i) => `${i.name} ${i.why}`),
    ...s.outcome,
    ...(s.metrics ?? []).map((m) => `${m.value} ${m.label}`),
  ]
}
```

In `lib/chat-context.ts`, add `import { caseStudies } from '@/lib/case-studies'` and extend the existing `@/types` import to `import { BAND_ORDER, type CaseStudy } from '@/types'`. Add above `buildPortfolioContext`:

```ts
// Case studies are approved text only (see lib/case-studies.ts), so the
// assistant can explain how a flagship was built without inventing detail.
export function buildCaseStudyContext(studies: CaseStudy[]): string {
  if (studies.length === 0) return ''
  const blocks = studies.map((s) => {
    const title = projects.find((p) => p.slug === s.slug)?.title ?? s.slug
    const lines = [
      `## ${title}`,
      `Role: ${s.role}`,
      `Brief: ${s.brief.join(' ')}`,
      `Built: ${s.built.join(' ')}`,
      ...s.decisions.map((d) => `Decision: Chose ${d.chose} over ${d.over} because ${d.because}`),
      `Stack: ${s.stack.map((i) => `${i.name}: ${i.why}`).join('; ')}`,
      `Outcome: ${s.outcome.join(' ')}`,
    ]
    if (s.metrics?.length) lines.push(`Figures: ${s.metrics.map((m) => `${m.value} ${m.label}`).join('; ')}`)
    return lines.join('\n')
  })
  return `\nCASE STUDIES:\n${blocks.join('\n\n')}\n`
}
```

In the template string returned by `buildPortfolioContext`, insert `${buildCaseStudyContext(caseStudies)}` on its own line directly after the `${projectsList}` line.

Append to `.gitignore`:

```
# Case-study research dossiers may hold client numbers; never commit them.
docs/case-studies/research/
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run tests/content/case-studies.test.ts tests/content/chat-context.test.ts && npm run type-check`
Expected: PASS. The per-study loops are vacuous until Task 8. The `@ts-expect-error` line type-checks only because `false` is rejected; if it reports "Unused '@ts-expect-error' directive", the literal type is wrong.

- [ ] **Step 5: Full gate and commit**

```bash
npm run type-check && npm run lint && npm test
git add types/index.ts lib/case-studies.ts lib/chat-context.ts .gitignore tests/content/case-studies.test.ts tests/content/chat-context.test.ts
git commit -m "feat(case-studies): add the typed case-study model and feed it to the assistant"
```

---

### Task 2: Project-page helpers and copy

**Files:**
- Create: `lib/project-page.ts`
- Modify: `lib/data.ts` (append `sectorNames`, `caseStudyContent`)
- Modify: `lib/site-metadata.ts` (append `buildProjectPageTitle`)
- Test: `tests/content/project-page.test.ts`

**Interfaces:**
- Consumes: `Project`, `ProjectStatus`, `ProjectSector`, `Recommendation` from `@/types`; `recommendations` from `@/lib/data`.
- Produces:
  - `projectHref(project: Project): string` → `/projects/<slug>`
  - `canLinkLive(project: Project): boolean`
  - `screenshotsFor(project: Project): { desktop?: string; mobile?: string }`
  - `nextInOrder(order: readonly string[], current: string): string | undefined`
  - `recommendationFor(project: Project): Recommendation | undefined`
  - `caseStudyContent: { eyebrow: { caseStudy: string; project: string }; headings: { brief: string; built: string; decisions: string; stack: string; outcome: string; client: string; about: string; next: string }; noPreview: { 'auth-gated': string; internal: string; fallback: string } }`
  - `sectorNames: Record<ProjectSector, string>` (singular, for display)
  - `buildProjectPageTitle(project: Project): string`

- [ ] **Step 1: Write the failing test**

`tests/content/project-page.test.ts`:

```ts
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { caseStudyContent, projects, sectorNames } from '@/lib/data'
import { canLinkLive, nextInOrder, projectHref, recommendationFor, screenshotsFor } from '@/lib/project-page'
import { buildProjectPageTitle } from '@/lib/site-metadata'
import type { Project, ProjectStatus } from '@/types'

const bySlug = (slug: string) => projects.find((p) => p.slug === slug)!
const withStatus = (status: ProjectStatus, live?: string): Project => ({
  ...bySlug('giya'),
  status,
  links: live ? { live } : {},
})

describe('project page helpers', () => {
  it('addresses each project by slug, not id', () => {
    expect(projectHref(bySlug('giya'))).toBe('/projects/giya')
    expect(projectHref(bySlug('el-nido-guide-ph'))).toBe('/projects/el-nido-guide-ph')
  })

  it('links live only for systems a visitor can open', () => {
    expect(canLinkLive(withStatus('live', 'https://x.test'))).toBe(true)
    expect(canLinkLive(withStatus('early-access', 'https://x.test'))).toBe(true)
    expect(canLinkLive(withStatus('ua-gated', 'https://x.test'))).toBe(true)
    expect(canLinkLive(withStatus('auth-gated', 'https://x.test'))).toBe(false)
    expect(canLinkLive(withStatus('internal', 'https://x.test'))).toBe(false)
    expect(canLinkLive(withStatus('live'))).toBe(false)
  })

  it('finds the desktop shot, and a mobile shot only where the file exists', () => {
    for (const p of projects) {
      const shots = screenshotsFor(p)
      expect(shots.desktop).toBe(p.image || undefined)
      if (shots.mobile) expect(existsSync(join('public', shots.mobile))).toBe(true)
      if (!p.image) expect(shots.mobile).toBeUndefined()
    }
  })

  it('walks the reading order and wraps', () => {
    expect(nextInOrder(['a', 'b', 'c'], 'a')).toBe('b')
    expect(nextInOrder(['a', 'b', 'c'], 'c')).toBe('a')
    expect(nextInOrder(['a'], 'a')).toBeUndefined()
    expect(nextInOrder(['a', 'b'], 'z')).toBeUndefined()
  })

  it('attaches a client quote to the project it names', () => {
    expect(recommendationFor(bySlug('beachbus-palawan'))?.authorName).toBe('Alec Santos')
    expect(recommendationFor(bySlug('latag'))).toBeUndefined()
  })

  it('names every sector and explains every missing preview', () => {
    for (const p of projects) expect(sectorNames[p.sector]).toBeTruthy()
    expect(caseStudyContent.noPreview['auth-gated']).toBeTruthy()
    expect(caseStudyContent.noPreview.internal).toBeTruthy()
  })

  it('titles each page for its project, without an em-dash', () => {
    for (const p of projects) {
      const title = buildProjectPageTitle(p)
      expect(title.startsWith(`${p.title} · `)).toBe(true)
      expect(title).not.toContain('—')
    }
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run tests/content/project-page.test.ts`
Expected: FAIL — `Cannot find module '@/lib/project-page'`.

- [ ] **Step 3: Implement**

Append to `lib/data.ts`:

```ts
// Singular sector names for a project's own page ("Sites · tours").
export const sectorNames: Record<ProjectSector, string> = {
  hotel: 'hotel',
  tours: 'tours',
  restaurant: 'restaurant',
  'review-centre': 'review centre',
  education: 'education',
  'real-estate': 'real estate',
  product: 'product',
  'internal-tool': 'internal tool',
}

// Copy for /projects/[slug]. Flagships read as case studies; every other
// project gets a short page built only from its entry in `projects`.
export const caseStudyContent = {
  eyebrow: { caseStudy: '// case study', project: '// project' },
  headings: {
    brief: 'The brief',
    built: 'What I built',
    decisions: 'Decisions',
    stack: 'Stack',
    outcome: 'Outcome',
    client: 'From the client',
    about: 'About the project',
    next: 'Next case study',
  },
  noPreview: {
    'auth-gated': 'This system sits behind a login, so there is no public preview.',
    internal: 'This is an internal system with no public screen to show.',
    fallback: 'No screenshot of this project yet.',
  },
}
```

Create `lib/project-page.ts`:

```ts
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { recommendations } from '@/lib/data'
import type { Project, ProjectStatus, Recommendation } from '@/types'

// Server-only helpers for /projects/[slug]. They read the filesystem, so never
// import this module from a client component.

export function projectHref(project: Project): string {
  return `/projects/${project.slug}`
}

// ua-gated sites refuse automated clients but open in any browser, so a
// visitor can follow the link. Login-walled and internal systems cannot.
const LINKABLE: readonly ProjectStatus[] = ['live', 'early-access', 'ua-gated']

export function canLinkLive(project: Project): boolean {
  return Boolean(project.links.live) && LINKABLE.indexOf(project.status) !== -1
}

// scripts/capture-screenshots.mjs writes <id>.png and <id>-mobile.png side by
// side. The mobile shot is optional: a site that refuses the capture has none.
export function screenshotsFor(project: Project): { desktop?: string; mobile?: string } {
  if (!project.image) return {}
  const mobile = project.image.replace(/\.png$/, '-mobile.png')
  const hasMobile = mobile !== project.image && existsSync(join(process.cwd(), 'public', mobile))
  return hasMobile ? { desktop: project.image, mobile } : { desktop: project.image }
}

export function nextInOrder(order: readonly string[], current: string): string | undefined {
  const i = order.indexOf(current)
  if (i === -1 || order.length < 2) return undefined
  return order[(i + 1) % order.length]
}

export function recommendationFor(project: Project): Recommendation | undefined {
  return recommendations.find((r) => r.projectId === project.id)
}
```

Append to `lib/site-metadata.ts`, extending its `@/types` import to `import type { Project, ProjectBand } from '@/types'`:

```ts
/** Each project page is titled for its project. */
export function buildProjectPageTitle(project: Project): string {
  return `${project.title} · ${heroContent.name}`
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run tests/content/project-page.test.ts`
Expected: PASS.

- [ ] **Step 5: Full gate and commit**

```bash
npm run type-check && npm run lint && npm test
git add lib/project-page.ts lib/data.ts lib/site-metadata.ts tests/content/project-page.test.ts
git commit -m "feat(projects): add project-page helpers, page copy and titles"
```

---

### Task 3: Mobile screenshots

**Files:**
- Modify: `scripts/capture-screenshots.mjs`
- Create (by running): `public/assets/images/projects/<id>-mobile.png`

**Interfaces:**
- Produces: `<id>-mobile.png` beside each `<id>.png`, which `screenshotsFor` (Task 2) picks up.

- [ ] **Step 1: Capture each target at two viewports**

Replace the `const viewport = …` line with:

```js
// Desktop keeps writing <id>.png, the file lib/data.ts already points at.
// Mobile writes <id>-mobile.png; lib/project-page.ts shows it when it exists.
const VIEWPORTS = [
  { suffix: '', viewport: { width: 1440, height: 900, deviceScaleFactor: 1 } },
  { suffix: '-mobile', viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
]
```

Replace the whole `for (const t of queue) { … }` loop with:

```js
  for (const t of queue) {
    for (const { suffix, viewport } of VIEWPORTS) {
      const label = `${t.id}${suffix}`
      const page = await browser.newPage()
      await page.setViewport(viewport)
      await page.setDefaultNavigationTimeout(60000)
      try {
        console.log('Capturing', label, '→', t.url)
        await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 60000 })
        await new Promise((r) => setTimeout(r, 2000))
        await dismissOverlays(page)
        await autoScroll(page)
        // Late-firing exit-intent and timed popups reappear after the scroll.
        await dismissOverlays(page)
        const filePath = path.join(outDir, `${label}.png`)
        await page.screenshot({ path: filePath, type: 'png', fullPage: false })
        console.log('  saved:', filePath)
        results.ok.push(label)
      } catch (e) {
        console.error('  FAILED:', label, e?.message)
        results.failed.push(label)
      } finally {
        await page.close()
      }
    }
  }
```

Change the header comment's output line to `Output: public/assets/images/projects/<id>.png and <id>-mobile.png`.

- [ ] **Step 2: Capture the flagships first**

Run: `npm run capture -- elnido beachbus acad1 aman-webapp naga-perks-giya-app`
Expected: the summary lists 10 OK (desktop and mobile each). Open every new `-mobile.png` with the Read tool. It must show the site's own page, not a consent banner or a blank frame. Delete a blank or broken capture rather than commit it, and note it in the report.

- [ ] **Step 3: Capture the rest**

Run: `npm run capture -- iskotify latag graceland upcat-review-plus downtown-district-hotel azalea-baguio azalea-boracay aralabroad`
Expected: OK or FAILED per shot. `ua-gated` sites may fail, which is acceptable: they keep their existing desktop shot. Inspect every image as in Step 2. If a re-captured desktop shot looks worse than the committed one, restore it with `git checkout -- <file>`.

- [ ] **Step 4: Gate and commit**

```bash
npm run type-check && npm run lint && npm test
git add scripts/capture-screenshots.mjs public/assets/images/projects
git commit -m "assets: capture mobile screenshots beside each desktop shot"
```

---

### Task 4: Research dossiers (controller-run, in parallel with Tasks 5–6)

**Files:**
- Create (gitignored): `docs/case-studies/research/<slug>.md` for each of the five `FLAGSHIP_SLUGS`

**Interfaces:**
- Produces: five dossiers in the template below. Task 7 reads their questions; Task 8 encodes their drafts.

The controller dispatches **five parallel `general-purpose` subagents**, one per flagship, each given the brief below with its row of this table. The task writes no code and makes no commit.

| Slug | Title | Live site | WordPress (Novamira, read-only) | Code |
|---|---|---|---|---|
| `el-nido-guide-ph` | El Nido Guide | https://elnidoguide.ph | `mcp__novamira-live-elnidogu__*` | none |
| `beachbus-palawan` | BeachBus, with `beachbus-nfc-card-system` | https://beachbus.ph | `mcp__novamira-beachbus-ph__*` | none |
| `acad1-review-center` | ACAD1 | https://acad1.ph | none (its server needs sign-in) | none |
| `aman-group-web-app` | Aman Group web app | https://amangroup-webapp.enjoyrealty.com | none | find with `gh repo list chrisraro --limit 100`; read only |
| `giya` | Giya | https://giya.ph | none | find with `gh repo list chrisraro --limit 100`; read only |

**Brief for each research subagent (verbatim, with its row filled in):**

> You are researching one project for Christian Raro's portfolio case study. Produce a dossier at `docs/case-studies/research/<slug>.md`. You write no code and commit nothing.
>
> **Hard rules. Breaking any of these is a failure:**
> 1. Read-only everywhere. Do not submit any form on any site: no booking, add-to-cart, checkout, search, login, contact or newsletter form. Browsing pages and reading visible prices is fine.
> 2. Novamira MCP: first call `mcp-adapter-discover-abilities`, then `mcp-adapter-get-ability-info` on an ability before using it. Execute only abilities that read (names like get/list/read/query/info). Never execute an ability that creates, updates, deletes, sends, installs, activates, runs PHP, runs SQL or evaluates code. If unsure whether an ability writes, do not call it.
> 3. No personal data. Never record a customer's or guest's name, email, phone, address or booking detail. Order and booking data only as aggregate counts with a date range ("412 completed orders, 2024-03 to 2026-09").
> 4. Never send any request to `/api/contact` on any host.
> 5. Every fact in the dossier carries its source: a URL, an MCP ability name, a commit hash, or `lib/data.ts`. A sentence with no source does not go in the draft.
>
> **Sources:** the live site, with WebFetch, page by page: home, key service or product pages, the booking or enrolment flow up to (never through) the payment step, about, footer. The WordPress side through the Novamira server in your row: theme, active plugins and versions, custom post types, WooCommerce settings (enabled payment gateways, product types), booking plugin configuration, aggregate order counts. The repository in your row: README, commit history dates, main dependencies. The project's entry in `lib/data.ts`.
>
> **Dossier template:**
>
> ```md
> # <Title>: research dossier
> Researched: <date> · Sources consulted: <list>
>
> ## Evidence
> - <fact> (source: <url | ability | commit | lib/data.ts>)
> Group under: What the site does · Booking and payment flow · Technical build · Timeline · Anything custom-built
>
> ## Draft (every sentence traceable to Evidence)
> Role: <one line, or "UNKNOWN: ask">
> ### The brief
> ### What I built
> ### Decisions (2 to 4, as "Chose X over Y because Z"; write UNKNOWN for a reason only Christian knows)
> ### Stack (each: name, then why, from evidence)
> ### Outcome (qualitative only)
>
> ## Candidate numbers (NOT for publication without the client's OK)
> - <number> <label> (source) · proposed question: "May I say <wording>?"
>
> ## Questions for Christian (at most 8, most important first)
> 1. ...
> ```
>
> Write the Draft in first person as Christian ("I built"), in plain English, with no em-dashes and no marketing adjectives. Report back: the dossier path, how many facts you sourced, and any rule you could not follow and why.

- [ ] **Step 1:** Create `docs/case-studies/research/` and confirm `git check-ignore docs/case-studies/research/x.md` prints the path (Task 1 added the rule).
- [ ] **Step 2:** Dispatch the five subagents in one message.
- [ ] **Step 3:** For each returned dossier, spot-check three evidence lines against their sources and confirm no personal data appears anywhere. Re-dispatch a dossier that breaks a hard rule.

---

### Task 5: Project page route with short pages

**Files:**
- Create: `components/case-study/project-header.tsx`, `components/case-study/project-screenshots.tsx`, `components/case-study/project-summary.tsx`, `app/projects/[slug]/page.tsx`
- Test: `tests/components/project-page.test.tsx`

**Interfaces:**
- Consumes: Task 2 helpers and copy; `StatusBadge`, `ImageLightbox`, `extractDomain`.
- Produces: `ProjectHeader({ project, role?, isCaseStudy? })`, `ProjectScreenshots({ project })`, `ProjectSummary({ project })`; the route's `generateStaticParams`, `dynamicParams = false`, `generateMetadata`, and default `ProjectPage({ params })`. Task 9 adds the flagship branch.

- [ ] **Step 1: Write the failing test**

`tests/components/project-page.test.tsx`:

```tsx
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import ProjectPage, { generateMetadata, generateStaticParams } from '@/app/projects/[slug]/page'
import { caseStudyContent, projects } from '@/lib/data'

const render = (slug: string) => renderToStaticMarkup(ProjectPage({ params: { slug } }))

describe('/projects/[slug]', () => {
  it('pre-renders one page per project slug', () => {
    expect(generateStaticParams().map((p) => p.slug)).toEqual(projects.map((p) => p.slug))
  })

  it('404s an unknown slug', () => {
    expect(() => render('no-such-project')).toThrow()
  })

  it('gives every page exactly one h1, its project title', () => {
    for (const p of projects) {
      const html = render(p.slug)
      expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
      expect(html).toContain(`>${p.title}</h1>`)
    }
  })

  it('states status in words and links back to all projects', () => {
    for (const p of projects) {
      const html = render(p.slug)
      expect(html).toMatch(/>(Live|Early access|Private|Internal)</)
      expect(html).toContain('href="/projects"')
    }
  })

  it('offers the live site only where a visitor can open it', () => {
    expect(render('latag')).toContain('Open live site')
    expect(render('downtown-district-hotel')).toContain('Open live site')
    expect(render('ocs-wp-control-panel')).not.toContain('Open live site')
    expect(render('beachbus-nfc-card-system')).not.toContain('Open live site')
  })

  it('explains a missing preview instead of showing an empty frame', () => {
    expect(render('ocs-wp-control-panel')).toContain(caseStudyContent.noPreview['auth-gated'])
    expect(render('beachbus-nfc-card-system')).toContain(caseStudyContent.noPreview.internal)
  })

  it('labels screenshots for what they show', () => {
    expect(render('latag')).toContain('aria-label="View larger image: Desktop screenshot of latag.vercel.app"')
  })

  it('shows a short page its description and stack, with no invented sections', () => {
    const latag = projects.find((p) => p.slug === 'latag')!
    const html = render('latag')
    expect(html).toContain(latag.description)
    for (const t of latag.technologies) expect(html).toContain(`>${t}<`)
    expect(html).not.toContain(`>${caseStudyContent.headings.decisions}</h2>`)
  })

  it('titles each page for its project', () => {
    const md = generateMetadata({ params: { slug: 'latag' } })
    expect(String(md.title)).toMatch(/^Latag · /)
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run tests/components/project-page.test.tsx`
Expected: FAIL — cannot resolve `@/app/projects/[slug]/page`.

- [ ] **Step 3: Implement the components**

`components/case-study/project-header.tsx`:

```tsx
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { StatusBadge } from '@/components/ui/status-badge'
import { caseStudyContent, paymentGateways, sectorNames } from '@/lib/data'
import { canLinkLive } from '@/lib/project-page'
import type { Project } from '@/types'

interface ProjectHeaderProps {
  project: Project
  /** A flagship's role line. Short pages have none. */
  role?: string
  isCaseStudy?: boolean
}

export function ProjectHeader({ project, role, isCaseStudy = false }: ProjectHeaderProps) {
  const gateways = project.technologies.filter((t) => paymentGateways.indexOf(t) !== -1)
  const meta = [role, project.dates, gateways.length ? `Payments: ${gateways.join(', ')}` : undefined].filter(
    (m): m is string => Boolean(m),
  )

  return (
    <header className="mx-auto max-w-6xl px-5 pt-10 sm:px-8 md:pt-14">
      <Link
        href="/projects"
        className="inline-flex min-h-[44px] items-center gap-2 font-mono text-sm text-muted-strong transition-colors hover:text-accent"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        All projects
      </Link>
      <p className="eyebrow mb-3 mt-6">
        {isCaseStudy ? caseStudyContent.eyebrow.caseStudy : caseStudyContent.eyebrow.project}
      </p>
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <h1 className="text-fluid-h1 text-ink">{project.title}</h1>
        <StatusBadge status={project.status} />
      </div>
      <p className="mt-4 max-w-2xl text-lg text-muted-strong">{project.summary}</p>
      <p className="mt-3 font-mono text-xs text-muted">
        {project.band} · {sectorNames[project.sector]}
      </p>
      {meta.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted-strong">
          {meta.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      )}
      {canLinkLive(project) && (
        <a
          href={project.links.live}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded bg-accent px-5 font-medium text-on-accent transition-colors hover:bg-accent/90"
        >
          Open live site
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      )}
    </header>
  )
}
```

`components/case-study/project-screenshots.tsx`:

```tsx
import Image from 'next/image'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { caseStudyContent } from '@/lib/data'
import { screenshotsFor } from '@/lib/project-page'
import { extractDomain } from '@/lib/utils'
import type { Project } from '@/types'

function noPreviewText(project: Project): string {
  if (project.status === 'auth-gated') return caseStudyContent.noPreview['auth-gated']
  if (project.status === 'internal') return caseStudyContent.noPreview.internal
  return caseStudyContent.noPreview.fallback
}

export function ProjectScreenshots({ project }: { project: Project }) {
  const shots = screenshotsFor(project)
  const name = project.links.live ? extractDomain(project.links.live) : project.title

  if (!shots.desktop) {
    return (
      <div className="mx-auto max-w-6xl px-5 pt-10 sm:px-8">
        <p className="rounded-lg border border-line bg-panel p-6 text-sm text-muted-strong">{noPreviewText(project)}</p>
      </div>
    )
  }

  return (
    <div
      className={
        shots.mobile
          ? 'mx-auto grid max-w-6xl items-start gap-4 px-5 pt-10 sm:grid-cols-[1fr_11rem] sm:px-8'
          : 'mx-auto max-w-6xl px-5 pt-10 sm:px-8'
      }
    >
      <ImageLightbox src={shots.desktop} alt={`Desktop screenshot of ${name}`} className="w-full">
        <span className="block overflow-hidden rounded-lg border border-line bg-panel">
          {/* alt="" because the button around it carries the description. */}
          <Image
            src={shots.desktop}
            alt=""
            width={1440}
            height={900}
            priority
            sizes="(min-width: 1152px) 900px, 100vw"
            className="h-auto w-full"
          />
        </span>
      </ImageLightbox>
      {shots.mobile && (
        <ImageLightbox src={shots.mobile} alt={`Mobile screenshot of ${name}`} className="mx-auto w-40 sm:w-full">
          <span className="block overflow-hidden rounded-lg border border-line bg-panel">
            <Image src={shots.mobile} alt="" width={390} height={844} sizes="176px" className="h-auto w-full" />
          </span>
        </ImageLightbox>
      )}
    </div>
  )
}
```

`components/case-study/project-summary.tsx`:

```tsx
import { caseStudyContent } from '@/lib/data'
import type { Project } from '@/types'

// A project without a case study says only what lib/data.ts already says.
export function ProjectSummary({ project }: { project: Project }) {
  const h = caseStudyContent.headings
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 md:py-16">
      <div className="max-w-[68ch]">
        <h2 className="text-xl font-semibold text-ink">{h.about}</h2>
        <p className="mt-3 text-base leading-relaxed text-muted-strong">{project.description}</p>
        {project.contribution && (
          <p className="mt-3 text-base leading-relaxed text-muted-strong">{project.contribution}</p>
        )}
        <h2 className="mt-10 text-xl font-semibold text-ink">{h.stack}</h2>
        <ul aria-label="Stack" className="mt-3 flex flex-wrap gap-2">
          {project.technologies.map((t) => (
            <li key={t} className="rounded border border-line-strong px-2.5 py-1 font-mono text-xs text-muted-strong">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Implement the route**

`app/projects/[slug]/page.tsx`:

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { ProjectHeader } from '@/components/case-study/project-header'
import { ProjectScreenshots } from '@/components/case-study/project-screenshots'
import { ProjectSummary } from '@/components/case-study/project-summary'
import { projects } from '@/lib/data'
import { buildProjectPageTitle } from '@/lib/site-metadata'

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
  return { title: buildProjectPageTitle(project), description: project.summary }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) notFound()

  return (
    <article>
      <ProjectHeader project={project} />
      <ProjectScreenshots project={project} />
      <ProjectSummary project={project} />
      <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 md:pb-24">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-8">
          <Link
            href="/#contact"
            className="inline-flex min-h-[44px] items-center gap-2 rounded bg-accent px-5 font-medium text-on-accent transition-colors hover:bg-accent/90"
          >
            Start a project
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link href="/projects" className="inline-flex min-h-[44px] items-center font-mono text-sm text-muted-strong hover:text-accent">
            All projects
          </Link>
        </div>
      </div>
    </article>
  )
}
```

`notFound()` returns `never`, so `project` narrows to `Project` after the guard.

- [ ] **Step 5: Run to verify pass**

Run: `npx vitest run tests/components/project-page.test.tsx`
Expected: PASS.

- [ ] **Step 6: Build and look at it**

```bash
npm run type-check && npm run lint && npm test && npm run build
```
Expected: the build lists `● /projects/[slug]` with 15 paths. Start the keyless server and screenshot `/projects/latag` and `/projects/ocs-wp-control-panel` at 1440 and 390 wide, in both themes. Fix what the screenshots show in one batch.

- [ ] **Step 7: Commit**

```bash
git add components/case-study "app/projects/[slug]" tests/components/project-page.test.tsx
git commit -m "feat(projects): give every project its own page"
```

---

### Task 6: Link the board and product panels to project pages

**Files:**
- Modify: `components/ui/board-row.tsx`, `components/ui/product-panel.tsx`
- Modify: `tests/components/board-row.test.tsx`, `tests/components/project-page.test.tsx`

**Interfaces:**
- Consumes: `projectHref` (Task 2).

- [ ] **Step 1: Update the tests first**

In `tests/components/board-row.test.tsx`, replace the first two tests ("links a project with a live URL…" and "renders a project with no URL as a plain row…") with this one, and keep every other test unchanged:

```tsx
  it('links every row to its project page, in the same tab', () => {
    for (const project of projects) {
      const html = renderToStaticMarkup(<BoardRow project={project} />)
      expect(html).toContain(`href="/projects/${project.slug}"`)
      expect(html).not.toContain('target="_blank"')
    }
  })
```

In `tests/components/project-page.test.tsx`, add `import { ProductPanel } from '@/components/ui/product-panel'` to the imports at the top, and append:

```tsx
describe('ProductPanel', () => {
  it('links each product title to its page and keeps the external link to try it', () => {
    for (const p of projects.filter((x) => x.band === 'Products')) {
      const html = renderToStaticMarkup(<ProductPanel project={p} />)
      expect(html).toContain(`href="/projects/${p.slug}"`)
      if (p.links.live) expect(html).toContain(`href="${p.links.live}"`)
    }
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run tests/components/board-row.test.tsx tests/components/project-page.test.tsx`
Expected: FAIL — rows link to live URLs; panels have no `/projects/` link.

- [ ] **Step 3: Implement**

`components/ui/board-row.tsx`: import `Link` from `next/link`, `ArrowRight` instead of `ArrowUpRight`, and `projectHref` from `@/lib/project-page`. Keep `const href = project.links.live`, now used only by the domain column. In `cells`, render the arrow unconditionally:

```tsx
          <ArrowRight
            aria-hidden="true"
            className="h-3.5 w-3.5 text-muted transition-colors group-hover:text-accent"
          />
```

Delete the `if (!href) return <li className={GRID}>{cells}</li>` line, and replace the returned `<a …>` element with:

```tsx
  return (
    <li>
      <Link
        href={projectHref(project)}
        className={cn(
          GRID,
          'group relative transition-colors hover:bg-canvas/60',
          // The board clips its overflow for the rounded frame, so the focus
          // ring is drawn inside the row rather than around it.
          'focus-visible:outline-offset-[-2px]',
          'before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-accent',
          'before:opacity-0 before:transition-opacity hover:before:opacity-100',
        )}
      >
        {cells}
      </Link>
    </li>
  )
```

Replace the comment above `BoardRow` ("A row links only when there is somewhere to go…") with `// Every row opens its project's page; the live site is linked from there.`

`components/ui/product-panel.tsx`: import `Link` from `next/link` and `projectHref` from `@/lib/project-page`, and replace the `<h3>`:

```tsx
          <h3 className="text-xl font-semibold text-ink">
            <Link href={projectHref(project)} className="transition-colors hover:text-accent">
              {project.title}
            </Link>
          </h3>
```

Leave the external domain link unchanged.

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run tests/components`
Expected: PASS, including the unchanged board-row tests ("no public URL", no `href="#"`, status in words, focus ring).

- [ ] **Step 5: Gate, check, commit**

```bash
npm run type-check && npm run lint && npm test && npm run build
```
On the keyless server, tab through the homepage board: every row takes focus, shows the inset ring, and Enter opens `/projects/<slug>`.

```bash
git add components/ui/board-row.tsx components/ui/product-panel.tsx tests/components/board-row.test.tsx tests/components/project-page.test.tsx
git commit -m "feat(board): open each project's page from the board and product panels"
```

---

### Task 7: Christian answers a dossier (human step, controller-run)

**Files:** the dossier being answered (gitignored).

- [ ] **Step 1:** When a dossier passes Task 4 Step 3, show Christian its **Questions for Christian** and **Candidate numbers** in chat, one project at a time, starting with whichever flagship is ready first.
- [ ] **Step 2:** Record his answers verbatim under `## Answers (Christian, <date>)` in the dossier. A candidate number becomes publishable only if he says the client agreed; record that sentence verbatim.
- [ ] **Step 3:** Strike from the draft anything he cannot confirm.

---

### Task 8: Encode the first case study

**Files:**
- Modify: `lib/case-studies.ts`

**Interfaces:**
- Produces: the first `CaseStudy` entry, which Task 9 builds the template against.

- [ ] **Step 1: Write the entry**

From the answered dossier's Draft and Answers, add one object to `caseStudies`. Rules: first person; no em-dash; the role line uses a colon ("Sole developer: design, build and payments"); client numbers only in `metrics` with `clientApproved: true`, and only where the Answers record the client's agreement; `related` lists slugs told in this story (BeachBus: `['beachbus-nfc-card-system']`); two to four decisions.

- [ ] **Step 2: Run the content tests**

Run: `npx vitest run tests/content/case-studies.test.ts tests/content/chat-context.test.ts && npm run type-check`
Expected: PASS.

- [ ] **Step 3: Controller review**

Compare every sentence against the dossier's Evidence and Answers. Remove any sentence with neither.

- [ ] **Step 4: Commit**

```bash
git add lib/case-studies.ts
git commit -m "content: add the <Title> case study"
```

---

### Task 9: Flagship case-study template

**Files:**
- Create: `components/case-study/case-study-body.tsx`
- Modify: `app/projects/[slug]/page.tsx`
- Modify: `tests/components/project-page.test.tsx`

**Interfaces:**
- Consumes: `getCaseStudy`, `FLAGSHIP_SLUGS`, `caseStudies` (Task 1); `nextInOrder`, `recommendationFor`, `projectHref` (Task 2).
- Produces: `CaseStudyBody({ study, project })`.

- [ ] **Step 1: Write the failing test**

In `tests/components/project-page.test.tsx`, add to the imports at the top:

```tsx
import { FLAGSHIP_SLUGS, caseStudies } from '@/lib/case-studies'
```

and extend the `@/lib/data` import to `import { caseStudyContent, projects, recommendations } from '@/lib/data'`. Append:

```tsx
describe('flagship case studies', () => {
  const h = caseStudyContent.headings

  it('has at least one case study to render', () => {
    expect(caseStudies.length).toBeGreaterThan(0)
  })

  it('reads brief, build, decisions, stack, outcome in that order', () => {
    for (const s of caseStudies) {
      const html = render(s.slug)
      const at = [h.brief, h.built, h.decisions, h.stack, h.outcome].map((t) => html.indexOf(`>${t}</h2>`))
      for (const i of at) expect(i).toBeGreaterThan(-1)
      expect(at.slice().sort((a, b) => a - b)).toEqual(at)
      expect(html).toContain(caseStudyContent.eyebrow.caseStudy)
      expect(html).toContain(s.role)
    }
  })

  it('numbers its decisions and states each alternative', () => {
    for (const s of caseStudies) {
      const html = render(s.slug)
      expect(html.match(/<li data-decision/g)).toHaveLength(s.decisions.length)
      for (const d of s.decisions) expect(html).toContain(d.over)
    }
  })

  it('shows the client’s own words where a quote names the project', () => {
    for (const s of caseStudies) {
      const project = projects.find((p) => p.slug === s.slug)!
      const quote = recommendations.find((r) => r.projectId === project.id)
      const html = render(s.slug)
      if (quote) expect(html).toContain(quote.authorName)
      else expect(html).not.toContain(`>${h.client}</h2>`)
    }
  })

  it('links to the next case study only when there is another', () => {
    for (const s of caseStudies) {
      const html = render(s.slug)
      if (caseStudies.length > 1) expect(html).toContain(`>${h.next}<`)
      else expect(html).not.toContain(`>${h.next}<`)
    }
  })

  it('leaves short pages short', () => {
    const shortSlugs = projects.map((p) => p.slug).filter((slug) => FLAGSHIP_SLUGS.indexOf(slug) === -1)
    for (const slug of shortSlugs) expect(render(slug)).not.toContain(`>${h.decisions}</h2>`)
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run tests/components/project-page.test.tsx`
Expected: FAIL — the flagship page has no case-study headings yet.

- [ ] **Step 3: Implement `CaseStudyBody`**

`components/case-study/case-study-body.tsx`:

```tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FLAGSHIP_SLUGS, caseStudies } from '@/lib/case-studies'
import { caseStudyContent, projects } from '@/lib/data'
import { nextInOrder, projectHref, recommendationFor } from '@/lib/project-page'
import type { CaseStudy, Project } from '@/types'

const H2 = 'text-xl font-semibold text-ink'
const P = 'mt-3 text-base leading-relaxed text-muted-strong'

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-12 first:mt-0">
      <h2 id={id} className={H2}>
        {title}
      </h2>
      {children}
    </section>
  )
}

export function CaseStudyBody({ study, project }: { study: CaseStudy; project: Project }) {
  const h = caseStudyContent.headings
  const quote = recommendationFor(project)
  // Only flagships that already have a case study are in the reading order.
  const order = FLAGSHIP_SLUGS.filter((slug) => caseStudies.some((s) => s.slug === slug))
  const nextSlug = nextInOrder(order, study.slug)
  const next = nextSlug ? projects.find((p) => p.slug === nextSlug) : undefined

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 md:py-16">
      <div className="max-w-[68ch]">
        <Section id="brief" title={h.brief}>
          {study.brief.map((p) => (
            <p key={p} className={P}>{p}</p>
          ))}
        </Section>

        <Section id="built" title={h.built}>
          {study.built.map((p) => (
            <p key={p} className={P}>{p}</p>
          ))}
        </Section>

        <Section id="decisions" title={h.decisions}>
          <ol className="mt-4 grid gap-4">
            {study.decisions.map((d, i) => (
              <li data-decision key={d.chose} className="grid grid-cols-[2rem_1fr] gap-x-3 border-t border-line pt-4">
                <span aria-hidden="true" className="font-mono text-sm text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-base text-ink">
                    {d.chose} <span className="text-muted">over</span> {d.over}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-strong">{d.because}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="stack" title={h.stack}>
          <dl className="mt-4 grid gap-3">
            {study.stack.map((s) => (
              <div key={s.name} className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="font-mono text-sm text-ink">{s.name}</dt>
                <dd className="text-sm leading-relaxed text-muted-strong">{s.why}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="outcome" title={h.outcome}>
          {study.outcome.map((p) => (
            <p key={p} className={P}>{p}</p>
          ))}
          {study.metrics && study.metrics.length > 0 && (
            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {study.metrics.map((m) => (
                // dt before dd, as HTML requires; flex-col-reverse puts the number on top.
                <div key={m.label} className="flex flex-col-reverse rounded-lg border border-line bg-panel p-4">
                  <dt className="mt-1 text-sm text-muted-strong">{m.label}</dt>
                  <dd className="font-mono text-2xl text-ink">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </Section>

        {quote && (
          <Section id="client" title={h.client}>
            <figure className="mt-4 border-l-2 border-accent pl-5">
              <blockquote className="text-base leading-relaxed text-ink">{quote.quote}</blockquote>
              <figcaption className="mt-3 font-mono text-xs text-muted-strong">
                {quote.authorName}, {quote.authorTitle}
              </figcaption>
            </figure>
          </Section>
        )}
      </div>

      {next && (
        <nav aria-label={h.next} className="mt-16 border-t border-line pt-8">
          <p className="font-mono text-xs text-muted">{h.next}</p>
          <Link
            href={projectHref(next)}
            className="mt-2 inline-flex min-h-[44px] items-center gap-2 text-xl font-semibold text-ink transition-colors hover:text-accent"
          >
            {next.title}
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </Link>
        </nav>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Branch the route**

In `app/projects/[slug]/page.tsx`, add `import { CaseStudyBody } from '@/components/case-study/case-study-body'` and `import { getCaseStudy } from '@/lib/case-studies'`. In `ProjectPage`, after the `notFound()` guard, add `const study = getCaseStudy(project.slug)` and replace the three section lines with:

```tsx
      <ProjectHeader project={project} role={study?.role} isCaseStudy={Boolean(study)} />
      <ProjectScreenshots project={project} />
      {study ? <CaseStudyBody study={study} project={project} /> : <ProjectSummary project={project} />}
```

In `generateMetadata`, after the guard, add `const study = getCaseStudy(project.slug)` and return `{ title: buildProjectPageTitle(project), description: study ? study.brief[0] : project.summary }`.

- [ ] **Step 5: Run to verify pass**

Run: `npx vitest run tests/components/project-page.test.tsx`
Expected: PASS.

- [ ] **Step 6: Gate, look, commit**

```bash
npm run type-check && npm run lint && npm test && npm run build
```
Screenshot the flagship page at 1440 and 390 wide in both themes; fix what the screenshots show in one batch.

```bash
git add components/case-study/case-study-body.tsx "app/projects/[slug]/page.tsx" tests/components/project-page.test.tsx
git commit -m "feat(case-studies): render flagship case studies"
```

---

### Task 10: Remaining flagships

Repeat Task 7 then Task 8 for each remaining dossier, one commit per case study (`content: add the <Title> case study`). After the fifth, add to `tests/content/case-studies.test.ts`:

```ts
  it('has a case study for every flagship', () => {
    expect(caseStudies.map((s) => s.slug).sort()).toEqual(FLAGSHIP_SLUGS.slice().sort())
  })
```

Run `npm run type-check && npm run lint && npm test && npm run build`, then commit: `test(case-studies): require every flagship to have its case study`.

---

### Task 11: Documentation

**Files:**
- Modify: `CLAUDE.md`, `DESIGN.md`, `docs/superpowers/specs/2026-09-23-case-studies-design.md` (status line only)

- [ ] **Step 1: CLAUDE.md**
  - Intro: "a homepage, a `/projects` index and a page per project".
  - Project Structure: add `app/projects/[slug]/` (per-project pages, statically generated), `components/case-study/` (project-header, project-screenshots, project-summary, case-study-body), `lib/case-studies.ts` (flagship case studies), `lib/project-page.ts` (server-only page helpers).
  - Content Changes: name `lib/case-studies.ts` as the second content source; add `caseStudyContent` and `sectorNames` to the `lib/data.ts` list; add: "A number from a client's business goes in `metrics` with `clientApproved: true`, and only after Christian confirms the client agreed. Research dossiers live in `docs/case-studies/research/` and are gitignored."
- [ ] **Step 2: DESIGN.md** — add a "Project pages" component section describing the header, screenshots, short page and flagship body as built, and the Read-mode measure (68ch).
- [ ] **Step 3:** Spec status line → `Status: implemented on v4`.
- [ ] **Step 4:** Gate, then commit `docs: document project pages and case studies`.

---

### Task 12: Quality gates (controller-run)

Bounded: inspect once, one fix batch, one confirm, stop.

- [ ] **Step 1:** Keyless server on :3100. Run impeccable `critique` and `audit` with `--target app/projects/[slug]/page.tsx`, against the first flagship and `/projects/latag`. Targets: critique ≥32/40, audit ≥16/20.
- [ ] **Step 2:** Lighthouse mobile on the same two URLs. Targets: performance ≥95, accessibility 100.
- [ ] **Step 3:** Dispatch `ecc:a11y-architect` on `components/case-study/*` and the route (WCAG 2.2 AA).
- [ ] **Step 4:** One fix batch for all P0/P1 findings; one confirm round; record scores in `.superpowers/sdd/progress.md`.
- [ ] **Step 5:** Full gate, push `v4` (preview only), hand off to Christian. Do not merge.
