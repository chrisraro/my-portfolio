# Portfolio 5.0 Sprint 4 (New pages) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/services` with its three service pages, `/about`, `/hire` and the "Off the trail" 404 to the Isarog Trail Map, each content page opening with a 40-60 word citable answer, every fact drawn from `lib/data.ts` / `lib/case-studies.ts`; put Services, About and Hire in the legend (a menu below 1024px, so 320px no longer overflows); point the homepage's two paths at `/services` and `/hire`; list the new routes in the sitemap; keep `npm test` green after every task.

**Architecture:** Everything new is a server component. Two new primitives: `PageIntro` (eyebrow, the one h1, the opening answer, a visible updated date) and `WorkHistory` (the dated route, optionally with responsibilities). Pages reuse what S2 and S3 built: `SECTION`, `SectionHeading`, `SurveyPlate`, `ProjectPlate`, `TrailLink`, `ContourField`, `ImageLightbox`, `PlanTheRoute`. The phone menu is a `<details>` disclosure inside the existing `SiteLegend` client component, so the client count stays 8. New copy lives in `lib/data.ts` (`servicePages`, `servicesPageContent`, `aboutPageContent`, `hirePageContent`) with interfaces in `types/index.ts`, held by `tests/content/new-pages.test.ts`.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5 (strict), Tailwind CSS 3, next-themes, `next/font/google` (Archivo), lucide-react, Vitest. No new dependencies.

## Decisions taken by the planner

1. **Page modes.** `/services` and the three service pages are Persuade (answer, proof plates, the form). `/about` is Read (story, route, photos, quotes; it ends in links, not the form). `/hire` is Persuade for a hiring manager, with Read sections (stack, practice, history), ending in the form.
2. **The phone menu is a `<details>` disclosure inside `SiteLegend`.** It opens without JavaScript; script (already present: the legend is a client component) closes it on a route change, on Escape (focus back on its summary), on a press outside and when a menu link is followed. From 1024px the legend keeps today's row. Not the `popover` attribute: React 18's types do not carry it. Client components stay 8.
3. **Navigation: Work, Services, About, Hire, Contact** (spec §3's list). "Experience" (`#timeline`) leaves the legend: the dated route now has its own page section on `/about`; the homepage elevation strip keeps its dated list as proof.
4. **The résumé on phones is in the menu** (and stays in the footer). From 1024px it is in the row, as today.
5. **`heroContent.stack` and `heroContent.aiProof` move to `/hire`** as `hirePageContent.stack.coreIds` and `hirePageContent.howIWork.aiInUse`; `heroContent.aiLine` is deleted (no reader since S2; its tools are named in the "AI coding tools" note). The positioning test's stack-chip check moves to the new-pages test.
6. **"Stack, by depth" is two tiers from data, no invented levels:** Core (the five ids, each one tested to appear in a project's technologies) and "Also in use" (every other skill, grouped by its existing category).
7. **Opening answers are third person** ("Christian Raro is a …", spec §6's example, so they quote cleanly); everything else stays first person.
8. **Comparison tables, only where the data makes them honest:** full-stack gets "WordPress or a custom app" from the El Nido, Aman, Giya and Connecta PH case-study decisions; WordPress gets the gateway table, its projects derived from `technologies`; AI automation gets none.
9. **The fork's business button reads "See the services" (new `ctaLabels.viewServices`) and opens `/services`.** "Start a project" on a link that does not reach the form would mislead. The team button keeps "Hire me for a role" and opens `/hire`; the trailhead's secondary opens `/hire` too.
10. **Metadata now, the rest in S5:** each new page exports `title` (spec table), `description` (its answer) and `alternates.canonical`. Open Graph, JSON-LD, llms files, the OG card and the chat prompt gain the new pages in S5.
11. **The 404 is still:** an empty survey square (contours, a faint dashed route, a trail-red "You are here" dot, the page's only trail red); the primary is "Back to the homepage", "All projects" a trail link. No draw animation (S6 may add one).
12. **`lib/field-log.ts` and its test are deleted.** Its consumer, the 4.0 field log, went in S2; `/about` sets the six photos and the four quotes as two sections, as the spec lists them.
13. **One visible "Updated" date**, `pagesUpdated = '2026-11-20'`, shown by `PageIntro` as `<time>`; formatted by a new pure `formatIsoDate` in `lib/dates.ts` (no locale dependence).
14. **`/services` is titled "Services · Christian Raro"** (the spec's table has no row for the index).

## Open questions (defaults are written into the tasks)

1. The service, about and hire copy is a draft for Christian's review, all of it in Task 1. Default: ship it as written on `v5`; Christian edits in `lib/data.ts` before the merge to `main`.
2. Drop "Experience" from the legend (default yes; the route is on `/about`)?
3. `/hire`'s primary action: "Download résumé" (default) or the email address?

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

S4 adds:

- Every task is implemented by a Sonnet subagent, test first. Before editing any UI file read `C:\Users\raroc\.claude\skills\impeccable\reference\craft-floor.md`; before Task 7 (the menu) load the `modern-web-guidance` skill.
- Gates before every commit, from the repo root, in order: `npm run type-check` (prints nothing, exits 0), `npm run lint` (`✔ No ESLint warnings or errors`), `npm test` (ends `Test Files  N passed (N)`), `RESEND_API_KEY= GROQ_API_KEY= npm run build` (from Task 3 on, the route table lists `○ /services` and `● /services/[slug]`; from Task 4 `○ /about`; from Task 5 `○ /hire`). If type-check points at a file under `.next/types` that no longer exists, delete `.next` and rerun.
- Client components stay at 8. `PageIntro`, `WorkHistory` and every new page are server components (no `'use client'`).
- New copy facts come only from `lib/data.ts`, `lib/case-studies.ts` or the spec. No invented clients, numbers, years, tools or outcomes. New copy uses the typographic apostrophe `’`, never `'` inside a string (so server markup needs no escaping in tests).
- New S4 surfaces use no `accent`, `accent-plane`, `on-accent`, `edge-code` or `crease-*` class (Task 8 guards it). Trail red on them: `.button-primary` (via its class) and the 404's "You are here" dot only.
- Regex literals in tests: `\b` is a backslash followed by `b`, never a control byte. After writing a test file, run `grep -P '\x08' <file>`; it must print nothing.
- Every JSX text that holds `'` or `"` is written as an expression (`{'…'}` or a template), never as bare JSX text (`react/no-unescaped-entities`).
- Commit with two `-m` flags: the summary, then `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## File Structure

Create:
- `components/ui/page-intro.tsx`: `PageIntro` (eyebrow, h1, the opening answer, the updated date, the page's actions).
- `components/ui/work-history.tsx`: `WorkHistory` (roles and degrees, newest first; responsibilities when `detailed`).
- `app/services/page.tsx`: `/services` (the three services, then the form).
- `app/services/[slug]/page.tsx`: one page per service (`generateStaticParams`, `dynamicParams = false`).
- `app/about/page.tsx`: `/about` (story, route, six photos, four quotes, résumé).
- `app/hire/page.tsx`: `/hire` (résumé, email, stack by depth, at a glance, how I work, work history, the form).
- Tests: `tests/content/new-pages.test.ts`, `tests/components/page-intro.test.tsx`, `tests/components/services-pages.test.tsx`, `tests/components/about-page.test.tsx`, `tests/components/hire-page.test.tsx`, `tests/design/s4-surfaces.test.ts`.

Rewrite: `app/not-found.tsx`, `components/site-legend.tsx`, `tests/components/not-found.test.tsx`.

Modify: `types/index.ts`, `lib/data.ts`, `lib/dates.ts`, `lib/contours.ts`, `app/sitemap.ts`, `components/sections/{fork,trailhead}.tsx`, `CLAUDE.md`, `.impeccable/surfaces/app-page-tsx.md`, and the tests named in each task (`positioning`, `dates`, `chrome`, `homepage`, `cta-labels`, `sitemap`, `primary-button`, `grid`, `client-boundary`).

Delete: `lib/field-log.ts`, `tests/content/field-log.test.ts`.

## Task list

| # | Task | Model |
|---|---|---|
| 1 | The new pages' copy and its checks | Sonnet |
| 2 | Page intro and work history primitives | Sonnet |
| 3 | `/services` and the three service pages | Sonnet |
| 4 | `/about` | Sonnet |
| 5 | `/hire` | Sonnet |
| 6 | 404: Off the trail | Sonnet |
| 7 | The legend: new pages and the phone menu | Sonnet |
| 8 | Homepage paths, the sitemap and the S4 guards | Sonnet |
| 9 | Sprint verification and docs | Sonnet |

---

### Task 1: The new pages' copy and its checks

**Model:** Sonnet

**Files:**
- Modify: `types/index.ts` (append the S4 interfaces)
- Modify: `lib/data.ts` (imports; delete `heroContent.aiLine`, `aiProof`, `stack`; two `ctaLabels`; append the S4 block)
- Create: `tests/content/new-pages.test.ts`
- Modify: `tests/content/positioning.test.ts` (the stack-chip check moves)

**Interfaces:**
- Consumes: `projects`, `experience`, `skills`, `paymentGateways`, `gatewaySentence` (module-private in `lib/data.ts`), `numberWord` (`@/lib/proof`), `caseStudies` (`@/lib/case-studies`).
- Produces (all from `@/lib/data`): `pagesUpdated: string` (`'2026-11-20'`); `servicePages: ServicePage[]` (three, in the order full-stack, WordPress, AI); `servicesPageContent: ServicesPageContent`; `aboutPageContent: AboutPageContent`; `hirePageContent: HirePageContent`; `ctaLabels.viewServices` (`'See the services'`) and `ctaLabels.allServices` (`'All services'`). Types from `@/types`: `SectionCopy`, `ServiceSection`, `ServiceComparisonRow`, `ServiceComparison`, `ServiceSlug`, `ServicePage`, `ServicesPageContent`, `AboutPageContent`, `HireNote`, `HireLink`, `HirePageContent`.

- [ ] **Step 1: Write the failing test**

Create `tests/content/new-pages.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { caseStudies, caseStudyText, getCaseStudy } from '@/lib/case-studies'
import {
  aboutPageContent,
  ctaLabels,
  experience,
  hirePageContent,
  paymentGateways,
  projects,
  servicePages,
  servicesPageContent,
  skills,
} from '@/lib/data'
import { numberWord } from '@/lib/proof'
import { hasPhone } from '@/tests/helpers/privacy'
import type { ServicePage } from '@/types'

// S4: the copy of /services, its three pages, /about and /hire. Draft copy for
// Christian's review; these checks hold it to the spec and to the data.
const words = (text: string) => text.trim().split(/\s+/).length
const tokens = (text: string) => text.toLowerCase().split(/[^a-z0-9-]+/).filter((w) => w !== '')
const ids = projects.map((p) => p.id)

// Spec §6, citability: each page opens with a self-contained 40-60 word answer.
const ANSWERS: { route: string; answer: string }[] = [
  { route: '/services', answer: servicesPageContent.answer },
  ...servicePages.map((s) => ({ route: `/services/${s.slug}`, answer: s.answer })),
  { route: '/about', answer: aboutPageContent.answer },
  { route: '/hire', answer: hirePageContent.answer },
]

describe('the opening answers', () => {
  it.each(ANSWERS)('$route opens with a 40-60 word answer about Christian in Naga City', ({ answer }) => {
    expect(words(answer)).toBeGreaterThanOrEqual(40)
    expect(words(answer)).toBeLessThanOrEqual(60)
    expect(answer).toMatch(/^Christian Raro is an? /)
    expect(answer).toContain('Naga City')
  })
})

// A keyword's words all appear in the answer, none more than three times.
function answersKeyword(keyword: string, answer: string) {
  const said = tokens(answer)
  for (const word of tokens(keyword).filter((w) => w !== 'and')) {
    const n = said.filter((w) => w === word).length
    expect(n, word).toBeGreaterThanOrEqual(1)
    expect(n, word).toBeLessThanOrEqual(3)
  }
}

// What the site says about a project: its entry, its case study, and the
// work-history lines that name it.
function projectText(id: string): string {
  const p = projects.find((x) => x.id === id)!
  const study = getCaseStudy(p.slug)
  const history = experience.flatMap((e) => e.responsibilities).filter((r) => r.indexOf(p.title) !== -1)
  return [p.title, p.description, ...p.technologies, ...(study ? caseStudyText(study) : []), ...history].join(' ')
}

const SUPPORT: Record<string, RegExp> = {
  'full-stack-development': /Next\.js|React|Node\.js|Supabase/,
  'wordpress-woocommerce': /WordPress|WooCommerce/,
  'ai-automation': /\bAI\b|language model|\bLLM\b|\bMCP\b|n8n/,
}

const prose = (s: ServicePage) => [s.answer, ...s.sections.flatMap((x) => [x.question, ...x.answer])].join(' ')

describe('service pages', () => {
  it('are the three the spec names, titled as its titles table says', () => {
    expect(servicePages.map((s) => [s.slug, s.title])).toEqual([
      ['full-stack-development', 'Full-Stack Web Developer (Next.js, React) · Philippines, remote'],
      ['wordpress-woocommerce', 'WordPress & WooCommerce Developer · PayMongo, Maya, Xendit, PayPal'],
      ['ai-automation', 'AI Automation Engineer · n8n, LLM workflows, MCP'],
    ])
  })

  it('count themselves in the /services answer', () => {
    expect(servicesPageContent.answer).toContain(`offering ${numberWord(servicePages.length)} services`)
  })

  it.each(servicePages)('$slug answers its keyword without stuffing it', (s) => {
    answersKeyword(s.keyword, s.answer)
  })

  it.each(servicePages)('$slug asks at least three questions, each answered', (s) => {
    expect(s.sections.length).toBeGreaterThanOrEqual(3)
    for (const q of s.sections) {
      expect(q.question).toMatch(/\?$/)
      expect(q.answer.length).toBeGreaterThan(0)
    }
  })

  it.each(servicePages)('$slug lists only real projects whose own data supports it', (s) => {
    expect(s.projectIds.length).toBeGreaterThanOrEqual(3)
    expect(new Set(s.projectIds).size).toBe(s.projectIds.length)
    for (const id of s.projectIds) {
      expect(ids, id).toContain(id)
      expect(projectText(id), `${s.slug}: ${id}`).toMatch(SUPPORT[s.slug])
    }
  })

  it.each(servicePages)('$slug proves every project its copy names', (s) => {
    const text = prose(s)
    for (const p of projects) {
      if (text.indexOf(p.title) !== -1) expect(s.projectIds, `${s.slug} names ${p.title}`).toContain(p.id)
    }
  })

  it.each(servicePages)('$slug compares only real projects', (s) => {
    for (const row of s.comparison?.rows ?? []) {
      expect(row.projectIds.length, row.need).toBeGreaterThan(0)
      for (const id of row.projectIds) expect(ids, `${row.need}: ${id}`).toContain(id)
    }
  })

  it('sets every gateway beside the projects that take it', () => {
    const table = servicePages.find((s) => s.slug === 'wordpress-woocommerce')!.comparison!
    expect(table.rows.map((r) => r.need)).toEqual([...paymentGateways])
    for (const row of table.rows) {
      expect(row.choice.trim(), row.need).not.toBe('')
      for (const id of row.projectIds) expect(projects.find((p) => p.id === id)!.technologies).toContain(row.need)
    }
  })
})

describe('/about copy', () => {
  it('is titled as the spec says and answers its keyword', () => {
    expect(aboutPageContent.title).toBe('About Christian Raro · Web Developer in Naga City, Bicol')
    answersKeyword(aboutPageContent.keyword, aboutPageContent.answer)
  })

  it('counts the products of my own from the data', () => {
    const own = projects.filter((p) => p.band === 'Products')
    expect(aboutPageContent.answer).toContain(`${numberWord(own.length)} products of his own`)
    const story = aboutPageContent.story.paragraphs.join(' ')
    for (const p of own) expect(story, p.title).toContain(p.title)
  })
})

describe('/hire copy', () => {
  it('is titled as the spec says, its h1 the hire label', () => {
    expect(hirePageContent.title).toBe('Hire a Mid-Level Full-Stack Developer · Remote, Philippines')
    expect(hirePageContent.heading).toBe(ctaLabels.hireForRole)
    answersKeyword(hirePageContent.keyword, hirePageContent.answer)
  })

  it('counts what has shipped from the data', () => {
    const shipped = projects.filter((p) => p.status !== 'staging').length
    const own = projects.filter((p) => p.band === 'Products').length
    expect(hirePageContent.answer).toContain(`shipped ${numberWord(shipped)} projects`)
    expect(hirePageContent.answer).toContain(`${numberWord(own)} of them his own products`)
    expect(hirePageContent.answer).toContain(`${numberWord(caseStudies.length)} written up as case studies`)
  })

  it('calls core only the skills that run in projects on this site', () => {
    for (const id of hirePageContent.stack.coreIds) {
      const skill = skills.find((s) => s.id === id)
      expect(skill, id).toBeDefined()
      expect(projects.some((p) => p.technologies.indexOf(skill!.name) !== -1), skill!.name).toBe(true)
    }
  })

  it('claims sole development only where every case study says so', () => {
    for (const s of caseStudies) expect(s.role, s.slug).toMatch(/^Sole developer/)
    const note = hirePageContent.howIWork.notes.find((n) => n.body.indexOf('sole developer') !== -1)
    expect(note?.body).toContain(`all ${numberWord(caseStudies.length)} case studies`)
  })

  it('links each AI tool in use to a real project page', () => {
    for (const item of hirePageContent.howIWork.aiInUse) {
      if (item.href) expect(projects.map((p) => `/projects/${p.slug}`), item.label).toContain(item.href)
    }
  })
})

describe('the new copy', () => {
  const copy = [
    servicesPageContent.answer,
    ...servicePages.flatMap((s) => [
      s.title,
      s.name,
      s.summary,
      s.answer,
      ...s.sections.flatMap((x) => [x.question, ...x.answer]),
      ...(s.comparison ? [s.comparison.caption, ...s.comparison.columns, ...s.comparison.rows.flatMap((r) => [r.need, r.choice])] : []),
    ]),
    aboutPageContent.answer,
    ...aboutPageContent.story.paragraphs,
    hirePageContent.answer,
    ...hirePageContent.howIWork.notes.flatMap((n) => [n.title, n.body]),
  ]

  it('carries no phone number, street, em-dash or years-of-experience claim', () => {
    for (const text of copy) {
      expect(hasPhone(text), text).toBe(false)
      expect(text).not.toMatch(/\bStreet\b|\bSt\.\s|\bBarangay\b|\bPurok\b/i)
      expect(text).not.toContain('—')
      expect(text).not.toMatch(/\d+\+?\s*years?/i)
    }
  })

  it('writes apostrophes typographically, so the markup needs no escaping', () => {
    for (const text of copy) expect(text, text).not.toContain("'")
  })
})
```

Run `grep -P '\x08' tests/content/new-pages.test.ts`; it must print nothing.

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/content/new-pages.test.ts`
Expected: FAIL at import: `servicePages` (and the other S4 exports) are not exported by `@/lib/data`.

- [ ] **Step 3: Add the interfaces**

Append to `types/index.ts`:

```ts
/** An eyebrow and an h2: the heading stack every section shares. */
export interface SectionCopy {
  eyebrow: string
  title: string
}

/** A question-style section on a service page (spec §6, citability). */
export interface ServiceSection {
  question: string
  /** Short paragraphs, first person. */
  answer: string[]
}

/** One row of a service page's comparison table. */
export interface ServiceComparisonRow {
  /** The row's header cell: what the job needs, or a gateway's name. */
  need: string
  choice: string
  /** The projects that show it, as `Project.id`s; the page prints their titles. */
  projectIds: string[]
}

export interface ServiceComparison {
  caption: string
  columns: [string, string, string]
  rows: ServiceComparisonRow[]
}

export type ServiceSlug = 'full-stack-development' | 'wordpress-woocommerce' | 'ai-automation'

/** A page under /services (spec §5), its copy drawn only from the data. */
export interface ServicePage {
  slug: ServiceSlug
  /** The page's <title>, from the spec's titles table. */
  title: string
  /** The h1, and the service's name on /services. */
  name: string
  /** One line for the /services list. */
  summary: string
  /** The search phrase the page answers (tests/content/new-pages.test.ts). */
  keyword: string
  /** The 40-60 word answer that opens the page, third person. */
  answer: string
  sections: ServiceSection[]
  comparison?: ServiceComparison
  /** The projects that prove the service, as `Project.id`s, strongest first. */
  projectIds: string[]
}

export interface ServicesPageContent {
  /** The page's <title>. */
  title: string
  eyebrow: string
  /** The h1. */
  heading: string
  readonly answer: string
  /** The heading over each service page's proving projects. */
  proof: SectionCopy
}

export interface AboutPageContent {
  title: string
  eyebrow: string
  heading: string
  keyword: string
  readonly answer: string
  story: SectionCopy & { readonly paragraphs: string[] }
  timeline: SectionCopy
  testimonials: SectionCopy
}

export interface HireNote {
  title: string
  body: string
}

export interface HireLink {
  label: string
  href?: string
}

export interface HirePageContent {
  title: string
  eyebrow: string
  heading: string
  keyword: string
  readonly answer: string
  facts: { title: string; labels: { availability: string; base: string; code: string } }
  /** Core: skill ids that run in projects on this site; the rest of `skills` follows by category. */
  stack: SectionCopy & { coreLabel: string; coreNote: string; coreIds: string[]; moreLabel: string }
  howIWork: SectionCopy & { readonly notes: HireNote[]; aiLead: string; aiInUse: HireLink[] }
  history: SectionCopy
}
```

- [ ] **Step 4: Update the imports and retire the hero's dead fields**

In `lib/data.ts`, replace the first two lines:

```ts
import { Project, ProjectPlace, ProjectSector, Skill, SocialLink, ContactInfo, ExperienceItem, EducationItem, Recommendation, GalleryImage, NavigationItem, SECTOR_ORDER } from '@/types'
import { numberWord } from '@/lib/proof'
```

with:

```ts
import { Project, ProjectPlace, ProjectSector, Skill, SocialLink, ContactInfo, ExperienceItem, EducationItem, Recommendation, GalleryImage, NavigationItem, SECTOR_ORDER } from '@/types'
import type { AboutPageContent, HirePageContent, ServicePage, ServicesPageContent } from '@/types'
import { caseStudies } from '@/lib/case-studies'
import { numberWord } from '@/lib/proof'
```

(`lib/case-studies.ts` imports only types, so there is no cycle.)

In `heroContent`, delete this block entirely (its facts move to `/hire`):

```ts
  // Plain text under the title; the tools match the AI & automation skills.
  aiLine: 'AI-enabled engineer and automations: Claude Code, Codex, Qwen Code, n8n',
  // Proof for the AI line, from facts the site already holds: the chat
  // assistant (components/ui/chat-widget.tsx) runs on Groq (app/api/chat), and
  // the Connecta PH case study says it was built with AI coding help.
  aiProof: {
    lead: 'In use:',
    items: [
      { label: "Chunks, this site's assistant (Groq)" },
      { label: 'Connecta PH, built with AI coding help', href: '/projects/connecta-ph' },
    ] as { label: string; href?: string }[],
  },
```

and this one:

```ts
  // Skill ids for the hero chips; tests/content/positioning.test.ts checks each exists.
  stack: ['nextjs', 'typescript', 'supabase', 'wordpress', 'woocommerce'],
```

In `ctaLabels`, replace

```ts
  downloadResume: 'Download résumé',
} as const
```

with

```ts
  downloadResume: 'Download résumé',
  viewServices: 'See the services',
  allServices: 'All services',
} as const
```

In the comment above `sectionContent`, replace "`galleryContent` waits for /about (S4)." with "`galleryContent` heads the photos on /about."

- [ ] **Step 5: Append the S4 copy**

Append to the end of `lib/data.ts` (after `services`). This is the **draft copy for Christian's review**: every sentence traces to the source named in its comment.

```ts
// --- S4 pages: /services, /about, /hire ---------------------------------------
// DRAFT COPY FOR CHRISTIAN'S REVIEW (S4 plan, Task 1). Every fact traces to
// this file, lib/case-studies.ts or the spec. The opening answers are third
// person and 40-60 words (spec §6, citability); the rest is first person.
// tests/content/new-pages.test.ts holds the counts, the keywords and every
// proving project to its own data.

/** When the copy on /services, /about and /hire was last checked; each page shows it. */
export const pagesUpdated = '2026-11-20'

const ownProductTitles = () => projects.filter((p) => p.band === 'Products').map((p) => p.title)
const listSentence = (items: string[]) => `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
const idsUsing = (technology: string) => projects.filter((p) => p.technologies.indexOf(technology) !== -1).map((p) => p.id)

// Who each gateway was chosen for, from the case studies' decisions (El Nido
// Guide PH and BeachBus Palawan for PayPal, PayMongo and Maya; ACAD1 for Xendit).
const gatewayUse: Record<string, string> = {
  PayPal: 'International travellers and tourists',
  PayMongo: 'Filipino riders paying by card or e-wallet',
  Maya: 'Filipino travellers paying by card or e-wallet',
  Xendit: 'The client’s existing merchant account',
}

export const servicePages: ServicePage[] = [
  {
    slug: 'full-stack-development',
    title: 'Full-Stack Web Developer (Next.js, React) · Philippines, remote',
    name: 'Full-stack development',
    summary: 'Web apps in Next.js, React, TypeScript and Supabase, from the first screen to the database.',
    keyword: 'full-stack developer Philippines',
    // Aman Group Web App (loan calculator), Giya (receipt rewards), Connecta PH (NFC cards, no app).
    answer:
      'Christian Raro is a full-stack developer in Naga City, Philippines, who builds web apps in Next.js, React, TypeScript and Supabase. He has shipped a real estate showcase with a loan calculator, a receipt-scanning rewards app and NFC business cards with no app to install, and is open to client projects and full-time remote roles.',
    sections: [
      {
        question: 'What do I build with Next.js and React?',
        answer: [
          // Project descriptions: aman-webapp, naga-perks-giya-app, lunad.
          'Web apps with screens a template cannot give. The Aman Group Web App compares Pag-IBIG, bank and in-house financing in a loan calculator. Giya turns scanned receipts into points at partner businesses. Lunad plans jeepney trips around Naga City, and is in pre-launch while reviewers check its route data.',
          // connecta-ph description.
          'Connecta PH opens a professional profile from an NFC or QR card on any phone, with no app to install, and sends every enquiry back to the card owner.',
        ],
      },
      {
        question: 'Which backend do I choose?',
        answer: [
          // Giya and Connecta PH decisions (Supabase); Aman decision (Upstash Redis, Vercel KV).
          'Supabase when an app needs Postgres, sign-in and file storage in one service, as Giya and Connecta PH do; its row-level security keeps Giya’s customer, business and admin data apart. Upstash Redis through Vercel KV when an app only stores small key-value data, as the Aman Group Web App does.',
          // lunad technologies.
          'Lunad runs on Neon Postgres with PostGIS.',
        ],
      },
      {
        question: 'How do I ship it?',
        answer: [
          // lunad technologies (Playwright); this repo's CI (.github/workflows/ci.yml).
          'In TypeScript, with tests and a pipeline. Lunad is tested with Playwright, and this portfolio runs type checks, lint, its tests and a production build on every push and pull request to main.',
        ],
      },
      {
        question: 'Do I build mobile apps too?',
        answer: [
          // skimcare description.
          'Yes. SkimCare, my team’s entry to the AppBuildersPH Hackathon 2026, built with Glenn Viola, is an Android and web app in React Native and Expo. It reads an agreement on the device and explains its key terms in plain English or Filipino.',
        ],
      },
    ],
    // The case studies' decisions: El Nido (WordPress over a custom app), Aman
    // (Next.js over WordPress; Upstash over Supabase), Giya and Connecta PH (Supabase).
    comparison: {
      caption: 'WordPress or a custom app: what I reach for',
      columns: ['When the job needs', 'I reach for', 'As on'],
      rows: [
        { need: 'Owners and staff editing pages, listings and bookings without a developer', choice: 'WordPress and WooCommerce', projectIds: ['elnido'] },
        { need: 'Custom interactive screens, such as a loan calculator', choice: 'A Next.js app', projectIds: ['aman-webapp'] },
        { need: 'Sign-in, a database and file storage, shipped fast by one developer', choice: 'Next.js with Supabase', projectIds: ['naga-perks-giya-app', 'connecta-ph'] },
        { need: 'Small key-value data such as listings, settings and leads', choice: 'Upstash Redis through Vercel KV', projectIds: ['aman-webapp'] },
      ],
    },
    projectIds: ['aman-webapp', 'naga-perks-giya-app', 'connecta-ph', 'lunad', 'skimcare'],
  },
  {
    slug: 'wordpress-woocommerce',
    title: 'WordPress & WooCommerce Developer · PayMongo, Maya, Xendit, PayPal',
    name: 'WordPress and WooCommerce',
    summary: `WordPress sites for hotels, tours and review centres, with WooCommerce checkout through ${gatewaySentence}.`,
    keyword: 'WordPress and WooCommerce developer',
    // Sites band sectors; paymentGateways; El Nido and BeachBus outcomes ("I still maintain").
    answer: `Christian Raro is a WordPress and WooCommerce developer in Naga City, Philippines. He builds sites for hotels, tour operators, review centres and restaurants, and WooCommerce booking and checkout with ${gatewaySentence}, the gateways Filipino buyers and international travellers pay with. He built and still maintains El Nido Guide PH and BeachBus Palawan.`,
    sections: [
      {
        question: 'What kinds of WordPress sites do I build?',
        answer: [
          // Sites band entries and their technologies.
          'Sites for hotels, tour operators, review centres, restaurants and directories, among them Azalea Baguio, Azalea Boracay, Graceland Bicolano Dining, Review Masters Bicol and Naga City Guide. Most run on GeneratePress and GenerateBlocks; Naga City Guide runs on a custom theme and plug-in.',
        ],
      },
      {
        question: 'Which Philippine payment gateways have I integrated?',
        answer: [
          // El Nido, BeachBus and ACAD1 decisions.
          `${gatewaySentence}, each through WooCommerce. PayPal serves international travellers, PayMongo and Maya serve Filipino buyers who pay by card or e-wallet, and Xendit went in where the client already had a merchant account.`,
        ],
      },
      {
        question: 'Can a WooCommerce site take bookings and deposits?',
        answer: [
          // El Nido and ACAD1 case studies.
          'Yes. El Nido Guide PH is a booking marketplace on WooCommerce and Dokan where each tour operator runs its own store and every booking pays the operator directly. ACAD1 Review Center reserves a slot with a 50% downpayment through Xendit, and the student settles the balance before the first session.',
          // BeachBus case study (online pass sales are paused, so nothing here says they sell online).
          'BeachBus Palawan’s storefront lists 1, 3 and 5 day passes and monthly passes, and local Partner Hubs sell or redeem them for a commission.',
        ],
      },
      {
        question: 'Who runs the site after launch?',
        answer: [
          // El Nido decision; El Nido and BeachBus outcomes.
          'The client does: WordPress and WooCommerce let owners, staff and operators edit pages, listings and prices without a developer. I still maintain El Nido Guide PH and BeachBus Palawan.',
        ],
      },
    ],
    comparison: {
      caption: 'The Philippine payment gateways I have integrated',
      columns: ['Gateway', 'Chosen for', 'Used on'],
      rows: paymentGateways.map((g) => ({ need: g, choice: gatewayUse[g], projectIds: idsUsing(g) })),
    },
    projectIds: ['elnido', 'beachbus', 'acad1', 'upcat-review-plus', 'azalea-baguio', 'azalea-boracay', 'graceland', 'naga-city-guide'],
  },
  {
    slug: 'ai-automation',
    title: 'AI Automation Engineer · n8n, LLM workflows, MCP',
    name: 'AI automation',
    summary: 'n8n workflows, LLM features inside products, and tooling over MCP.',
    keyword: 'AI automation engineer',
    // experience: ocs-webdev (title, n8n stack, the control panel over MCP).
    answer:
      'Christian Raro is an AI automation engineer in Naga City, Philippines, working as Web Developer and AI Automation Specialist at Online Creative Solutions. He set up and runs the team’s self-hosted n8n stack for Google Workspace and LLM workflows, built a dashboard that manages client WordPress sites over MCP, and ships AI features in his own products.',
    sections: [
      {
        question: 'What do I automate?',
        answer: [
          // experience: ocs-webdev responsibilities.
          'At Online Creative Solutions I set up and run the team’s self-hosted n8n automation stack for Google Workspace and LLM workflows. I also built the OCS WP Control Panel, a Next.js and Supabase dashboard that manages client WordPress sites over MCP.',
        ],
      },
      {
        question: 'Where do I put LLMs in a product?',
        answer: [
          // iskotify description; Giya case study (AI reads the receipt, then the fraud review); Chunks on Groq.
          'Iskotify generates exam-prep flashcards with AI and has an AI study companion, Kuya Baw. Giya uses AI to read a scanned receipt before a fraud review checks it. Chunks, this site’s assistant, answers questions about my work through Groq.',
        ],
      },
      {
        question: 'Can AI run without the cloud?',
        answer: [
          // skimcare description.
          'Yes. SkimCare runs text recognition and a small language model on the phone, so the agreement a person is about to sign is never uploaded.',
        ],
      },
      {
        question: 'Which AI tools do I build with?',
        answer: [
          // skills: AI & automation.
          'Claude Code, Codex and Qwen Code for writing code, n8n for workflows, and Groq and other LLM APIs inside products.',
        ],
      },
    ],
    projectIds: ['ocs-wp-control', 'iskotify', 'naga-perks-giya-app', 'skimcare'],
  },
]

export const servicesPageContent: ServicesPageContent = {
  title: 'Services · Christian Raro',
  eyebrow: 'Services',
  heading: 'What I build',
  get answer(): string {
    return `Christian Raro is a full-stack developer in Naga City, Philippines, offering ${numberWord(servicePages.length)} services: full-stack web apps in Next.js and React, WordPress and WooCommerce sites with Philippine payment gateways, and AI automation with n8n, LLM APIs and MCP. Each service lists the shipped projects that prove it, and each page ends in a contact form.`
  },
  proof: { eyebrow: 'Proof', title: 'Projects that prove it' },
}

export const aboutPageContent: AboutPageContent = {
  title: 'About Christian Raro · Web Developer in Naga City, Bicol',
  eyebrow: 'About',
  heading: 'Based in Naga City',
  keyword: 'web developer Naga City Bicol',
  // education, experience (ocs-webdev start), the hero subheadline's claims.
  get answer(): string {
    return `Christian Raro is a web developer in Naga City, Camarines Sur, in the Bicol region of the Philippines. He studied computer science at Bicol University, has worked at Online Creative Solutions since November 2024, and builds booking and payment sites for travel businesses, AI automation for teams and ${numberWord(ownProductTitles().length)} products of his own.`
  },
  story: {
    eyebrow: 'Story',
    title: 'Built in Bicol',
    get paragraphs(): string[] {
      return [
        // education; experience: ocs-webdev.
        'I studied computer science at Bicol University Polangui Campus from 2020 to 2024. That November I joined Online Creative Solutions in Naga City as a web developer, and I still build and maintain WordPress and WooCommerce sites for its clients and run the team’s n8n automation there.',
        // experience: enjoy-it; Aman case study outcome.
        'From March to August 2025 I also worked full-time as IT staff and web developer at Enjoy Realty and Development Corporation. There I built the Aman Group Web App and presented it at the company’s brokers’ meeting.',
        // places on the field map; the Products band; Connecta PH description.
        `Much of the client work runs far from Naga: tour bookings in El Nido, a beach shuttle in El Nido, hotels in Baguio and Boracay. Closer to home I build products of my own: ${listSentence(ownProductTitles())}. Connecta PH launches in Naga first.`,
      ]
    },
  },
  timeline: { eyebrow: 'Route', title: sectionContent.timeline.title },
  testimonials: { eyebrow: 'From the field', title: 'What clients and colleagues say' },
}

export const hirePageContent: HirePageContent = {
  title: 'Hire a Mid-Level Full-Stack Developer · Remote, Philippines',
  eyebrow: 'Hire',
  heading: ctaLabels.hireForRole,
  keyword: 'mid-level full-stack developer remote',
  // heroContent.title, the fork's team body, the elevation strip's counts.
  get answer(): string {
    const shipped = projects.filter((p) => p.status !== 'staging').length
    return `Christian Raro is a mid-level full-stack developer in Naga City, Philippines, open to full-time remote roles. He works in Next.js, TypeScript, Supabase and WordPress, with tests, CI and AI coding tools in daily use, and has shipped ${numberWord(shipped)} projects, ${numberWord(ownProductTitles().length)} of them his own products, with ${numberWord(caseStudies.length)} written up as case studies.`
  },
  facts: { title: 'At a glance', labels: { availability: 'Availability', base: 'Base', code: 'Code' } },
  stack: {
    eyebrow: 'Stack',
    title: 'Stack, by depth',
    coreLabel: 'Core',
    coreNote: 'Each one runs in projects on this site.',
    // Moved from heroContent.stack (S4).
    coreIds: ['nextjs', 'typescript', 'supabase', 'wordpress', 'woocommerce'],
    moreLabel: 'Also in use',
  },
  howIWork: {
    eyebrow: 'Practice',
    title: 'How I work',
    get notes() {
      return [
        // this repo's CI; lunad technologies.
        { title: 'Tests and CI', body: 'This portfolio runs type checks, lint, its tests and a production build on every push and pull request to main. Lunad is tested with Playwright.' },
        // skills: AI & automation; the fork's team body ("in daily use"); experience: n8n.
        { title: 'AI coding tools', body: 'Claude Code, Codex and Qwen Code are in daily use. At Online Creative Solutions I also run the team’s n8n automation stack.' },
        // every case study's role; El Nido and BeachBus outcomes.
        { title: 'Brief to launch', body: `I was the sole developer on all ${numberWord(caseStudies.length)} case studies, from the brief to launch, and I still maintain El Nido Guide PH and BeachBus Palawan.` },
      ]
    },
    aiLead: 'In use:',
    // Moved from heroContent.aiProof (S4): Chunks runs on Groq (app/api/chat);
    // the Connecta PH case study says it was built with AI coding help.
    aiInUse: [
      { label: 'Chunks, this site’s assistant (Groq)' },
      { label: 'Connecta PH, built with AI coding help', href: '/projects/connecta-ph' },
    ],
  },
  history: { eyebrow: 'Route', title: 'Work history' },
}
```

- [ ] **Step 6: Move the stack-chip check**

In `tests/content/positioning.test.ts`, delete this block (the new-pages test now checks the core stack against `skills` and the projects):

```ts
  it('only names stack chips that exist in the skills list', () => {
    const ids = skills.map((s) => s.id)
    for (const id of heroContent.stack) expect(ids).toContain(id)
  })

```

If `skills` is then unused in that file's imports, remove it from the import list (lint will say so).

- [ ] **Step 7: Run the tests**

Run: `npx vitest run tests/content/new-pages.test.ts tests/content/positioning.test.ts tests/content/cta-labels.test.ts`
Expected: PASS. If an answer's word count fails, the copy changed in transcription: compare with Step 5 character by character; do not rewrite the copy.

- [ ] **Step 8: Gates and commit**

Run the four gates. Then:

```bash
git add types/index.ts lib/data.ts tests/content/new-pages.test.ts tests/content/positioning.test.ts
git commit -m "content(pages): draft copy for /services, its three pages, /about and /hire" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Page intro and work history primitives

**Model:** Sonnet

**Files:**
- Modify: `lib/dates.ts` (add `formatIsoDate`), `tests/content/dates.test.ts`
- Create: `components/ui/page-intro.tsx`, `components/ui/work-history.tsx`
- Create: `tests/components/page-intro.test.tsx`

**Interfaces:**
- Consumes: `SECTION` (`@/components/ui/grid`), `experience` (`@/lib/data`), `buildTimeline` (`@/lib/timeline`).
- Produces: `formatIsoDate(iso: string): string` (`'2026-11-20'` → `'20 November 2026'`); `<PageIntro eyebrow title answer updated>{actions?}</PageIntro>` (server; renders a `<header>` on `SECTION` with one `h1`, the answer in a `<p class="text-lede …">` right after it, `Updated <time datetime>` and, when given, the actions in a flex row); `<WorkHistory detailed? />` (server; an `<ol>` newest first, each role or degree an `h3`; `detailed` adds each role's responsibilities).

- [ ] **Step 1: Write the failing tests**

Append to `tests/content/dates.test.ts` (and add `formatIsoDate` to its import from `@/lib/dates`):

```ts
describe('formatIsoDate', () => {
  it('writes an ISO date the way the pages print it', () => {
    expect(formatIsoDate('2026-11-20')).toBe('20 November 2026')
    expect(formatIsoDate('2024-01-05')).toBe('5 January 2024')
  })
})
```

Create `tests/components/page-intro.test.tsx`:

```tsx
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { PageIntro } from '@/components/ui/page-intro'
import { WorkHistory } from '@/components/ui/work-history'
import { experience } from '@/lib/data'
import { buildTimeline } from '@/lib/timeline'

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')

describe('PageIntro', () => {
  const html = renderToStaticMarkup(
    <PageIntro eyebrow="Services" title="What I build" answer="The answer." updated="2026-11-20">
      <a href="#contact">Go</a>
    </PageIntro>,
  )

  it('opens on the one grid: the eyebrow, one h1, then the answer', () => {
    expect(html).toMatch(/^<header class="mx-auto max-w-6xl px-5 sm:px-8 /)
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toMatch(/<p class="eyebrow[^"]*">Services<\/p>/)
    expect(html.indexOf('>Services</p>')).toBeLessThan(html.indexOf('<h1'))
    expect(html).toMatch(/<\/h1><p class="text-lede[^"]*">The answer\.<\/p>/)
  })

  it('shows when the copy was last updated, machine-readable', () => {
    expect(html).toMatch(/Updated <time datetime="2026-11-20">20 November 2026<\/time>/i)
  })

  it('sets the page’s actions under the answer', () => {
    expect(html.indexOf('href="#contact"')).toBeGreaterThan(html.indexOf('The answer.'))
  })

  it('renders no empty action row when there are none', () => {
    const bare = renderToStaticMarkup(<PageIntro eyebrow="E" title="T" answer="A." updated="2026-11-20" />)
    expect(bare).not.toContain('flex-wrap')
  })
})

describe('WorkHistory', () => {
  it('lists every role and degree with its dates, newest first, each an h3', () => {
    const html = renderToStaticMarkup(<WorkHistory />)
    let last = -1
    for (const e of buildTimeline()) {
      const at = html.indexOf(`>${escape(e.title)}</h3>`)
      expect(at, e.title).toBeGreaterThan(last)
      last = at
      expect(html).toContain(e.date)
      expect(html).toContain(escape(e.subtitle))
    }
  })

  it('keeps responsibilities to the detailed history', () => {
    const plain = renderToStaticMarkup(<WorkHistory />)
    const detailed = renderToStaticMarkup(<WorkHistory detailed />)
    for (const role of experience) {
      for (const r of role.responsibilities) {
        expect(plain).not.toContain(escape(r))
        expect(detailed).toContain(escape(r))
      }
    }
  })

  it('names the overlap between two roles', () => {
    const html = renderToStaticMarkup(<WorkHistory />)
    for (const role of experience.filter((x) => x.concurrent)) expect(html).toContain(escape(role.concurrent!))
  })
})
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/content/dates.test.ts tests/components/page-intro.test.tsx`
Expected: FAIL: `formatIsoDate` is not exported; `@/components/ui/page-intro` does not exist.

- [ ] **Step 3: Add `formatIsoDate`**

Append to `lib/dates.ts`:

```ts
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** '2026-11-20' → '20 November 2026': the "Updated" date the read pages print. No locale data needed. */
export function formatIsoDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return `${day} ${MONTH_NAMES[month - 1]} ${year}`
}
```

- [ ] **Step 4: Write `PageIntro`**

Create `components/ui/page-intro.tsx`:

```tsx
import type { ReactNode } from 'react'
import { SECTION } from '@/components/ui/grid'
import { formatIsoDate } from '@/lib/dates'
import { cn } from '@/lib/utils'

interface PageIntroProps {
  eyebrow: string
  /** The page's one h1. */
  title: string
  /** The 40-60 word answer that opens the page (spec §6, citability). */
  answer: string
  /** ISO date the copy was last checked, e.g. '2026-11-20'. */
  updated: string
  /** The page's actions, set under the answer. */
  children?: ReactNode
}

/**
 * How /services, a service page, /about and /hire open (spec §6): the eyebrow,
 * the h1, then a self-contained answer a search or AI engine can quote whole,
 * and the date it was last checked. The answer is ink, not muted: it is the
 * page's first claim, not a lede under it.
 */
export function PageIntro({ eyebrow, title, answer, updated, children }: PageIntroProps) {
  return (
    <header className={cn(SECTION, 'pb-12 pt-12 md:pb-16 md:pt-16')}>
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h1 className="text-page-h1 max-w-[18ch] text-ink">{title}</h1>
      <p className="text-lede mt-6 max-w-[40rem] text-ink">{answer}</p>
      <p className="map-label tabular mt-4 text-muted">
        Updated <time dateTime={updated}>{formatIsoDate(updated)}</time>
      </p>
      {children && <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">{children}</div>}
    </header>
  )
}
```

- [ ] **Step 5: Write `WorkHistory`**

Create `components/ui/work-history.tsx`:

```tsx
import { experience } from '@/lib/data'
import { buildTimeline } from '@/lib/timeline'

interface WorkHistoryProps {
  /** Add each role's responsibilities (/hire). /about shows the dated route only. */
  detailed?: boolean
}

/**
 * The dated route (spec §5): every role and degree, newest first, from
 * buildTimeline(). Each is an h3 under its section's h2: dates in a map label,
 * the title, the employer or school with the role's locality, and the note on
 * a role that overlapped another.
 */
export function WorkHistory({ detailed = false }: WorkHistoryProps) {
  return (
    <ol className="grid gap-8">
      {buildTimeline().map((e) => {
        const role = e.type === 'work' ? experience.find((x) => x.title === e.title && x.company === e.subtitle) : undefined
        return (
          <li key={`${e.title}-${e.sortKey}`} className="grid gap-2 border-t border-line pt-4 md:grid-cols-[12rem_1fr] md:gap-8">
            <p className="map-label tabular text-muted">{e.date}</p>
            <div className="min-w-0">
              <h3 className="text-title text-ink">{e.title}</h3>
              <p className="mt-1 text-muted-strong">{role ? `${e.subtitle} · ${role.location}` : e.subtitle}</p>
              {e.note && <p className="mt-2 max-w-[40ch] text-sm text-muted">{e.note}</p>}
              {detailed && role && (
                <ul className="mt-4 grid max-w-[62ch] list-disc gap-2 pl-5 leading-relaxed text-muted-strong">
                  {role.responsibilities.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
```

- [ ] **Step 6: Run the tests**

Run: `npx vitest run tests/content/dates.test.ts tests/components/page-intro.test.tsx`
Expected: PASS.

- [ ] **Step 7: Gates and commit**

```bash
git add lib/dates.ts tests/content/dates.test.ts components/ui/page-intro.tsx components/ui/work-history.tsx tests/components/page-intro.test.tsx
git commit -m "feat(ui): page intro with the opening answer, and the work history" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: `/services` and the three service pages

**Model:** Sonnet

**Files:**
- Create: `app/services/page.tsx`, `app/services/[slug]/page.tsx`
- Create: `tests/components/services-pages.test.tsx`

**Interfaces:**
- Consumes: `PageIntro` (Task 2); `servicePages`, `servicesPageContent`, `pagesUpdated`, `ctaLabels.startProject`, `ctaLabels.allServices`, `ctaLabels.readMore`, `projects` (`@/lib/data`); `ProjectPlate({ project, code })`, `SectionHeading`, `TrailLink`, `SECTION`, `PlanTheRoute`; `catalogOrder`, `projectCode` (`@/lib/board`); `hasFullShot` (`@/lib/project-page`).
- Produces: `app/services/page.tsx` default `ServicesPage`, `metadata`; `app/services/[slug]/page.tsx` default `ServicePage({ params: { slug } })`, `generateStaticParams()`, `dynamicParams = false`, `generateMetadata({ params })`. The service page's question h2s carry ids `question-1` …; the proof section is `aria-labelledby="proof-title"`.

- [ ] **Step 1: Write the failing test**

Create `tests/components/services-pages.test.tsx`:

```tsx
import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import ServicesPage, { metadata } from '@/app/services/page'
import ServicePage, { dynamicParams, generateMetadata, generateStaticParams } from '@/app/services/[slug]/page'
import { ToastProvider } from '@/components/ui/toaster'
import { ctaLabels, projects, servicePages, servicesPageContent } from '@/lib/data'

// PlanTheRoute (the form every service page ends in) needs the toast provider.
const render = (node: ReactElement) => renderToStaticMarkup(<ToastProvider>{node}</ToastProvider>)
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')

describe('/services', () => {
  const html = render(<ServicesPage />)

  it('opens with its answer under the one h1', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain(`>${escape(servicesPageContent.heading)}</h1>`)
    const answer = html.indexOf(`>${escape(servicesPageContent.answer)}</p>`)
    expect(answer).toBeGreaterThan(html.indexOf('</h1>'))
    expect(answer).toBeLessThan(html.indexOf('<h2'))
  })

  it('lists each service once, by name, with one way in', () => {
    for (const s of servicePages) {
      expect(html).toContain(`>${escape(s.name)}</h2>`)
      expect(html).toContain(escape(s.summary))
      expect(html.match(new RegExp(`href="/services/${s.slug}"`, 'g'))).toHaveLength(1)
      expect(html).toContain(`<span class="sr-only"> about ${escape(s.name)}</span>`)
    }
  })

  it('jumps its primary action to the form it ends in', () => {
    expect(html).toContain('<a href="#contact" class="press button-primary">')
    expect(html.indexOf('<section id="contact"')).toBeGreaterThan(html.lastIndexOf('href="/services/'))
  })

  it('is titled and canonical', () => {
    expect(metadata.title).toBe(servicesPageContent.title)
    expect(metadata.description).toBe(servicesPageContent.answer)
    expect(metadata.alternates?.canonical).toBe('/services')
  })
})

describe('/services/[slug]', () => {
  it('builds a page for each service and no other', () => {
    expect(generateStaticParams()).toEqual(servicePages.map((s) => ({ slug: s.slug })))
    expect(dynamicParams).toBe(false)
  })

  it.each(servicePages)('$slug carries the spec title, its answer as description, and its canonical', (s) => {
    const m = generateMetadata({ params: { slug: s.slug } })
    expect(m.title).toBe(s.title)
    expect(m.description).toBe(s.answer)
    expect(m.alternates?.canonical).toBe(`/services/${s.slug}`)
  })

  it.each(servicePages)('$slug opens with its answer, then asks its questions as h2s', (s) => {
    const html = render(ServicePage({ params: { slug: s.slug } }))
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain(`>${escape(s.name)}</h1>`)
    const answer = html.indexOf(`>${escape(s.answer)}</p>`)
    expect(answer).toBeGreaterThan(html.indexOf('</h1>'))
    expect(answer).toBeLessThan(html.indexOf('<h2'))
    s.sections.forEach((q, i) => {
      expect(html).toContain(`<h2 id="question-${i + 1}" class="text-title text-ink">${escape(q.question)}</h2>`)
      for (const p of q.answer) expect(html).toContain(`>${escape(p)}</p>`)
    })
  })

  it.each(servicePages)('$slug stands each proving project as a plate, in order, and no other', (s) => {
    const html = render(ServicePage({ params: { slug: s.slug } }))
    const plates = Array.from(html.matchAll(/<li id="plate-([^"]+)"/g)).map((m) => m[1])
    expect(plates).toEqual(s.projectIds.map((id) => projects.find((p) => p.id === id)!.slug))
  })

  it.each(servicePages)('$slug jumps to the form it ends in, and leads back to every service', (s) => {
    const html = render(ServicePage({ params: { slug: s.slug } }))
    expect(html).toContain('<a href="#contact" class="press button-primary">')
    expect(html).toContain(`>${ctaLabels.allServices}</span>`)
    expect(html).toContain('href="/services"')
    expect(html.indexOf('<section id="contact"')).toBeGreaterThan(html.lastIndexOf('<li id="plate-'))
  })

  it('sets each comparison as a real table: a caption, column and row headers, a focusable scroll region', () => {
    for (const s of servicePages.filter((x) => x.comparison)) {
      const html = render(ServicePage({ params: { slug: s.slug } }))
      const c = s.comparison!
      expect(html).toContain(`<div role="region" aria-label="${escape(c.caption)}" tabindex="0"`)
      expect(html).toContain(`>${escape(c.caption)}</caption>`)
      expect(html.match(/<th scope="col"/g)).toHaveLength(3)
      expect(html.match(/<th scope="row"/g)).toHaveLength(c.rows.length)
      for (const row of c.rows) {
        for (const id of row.projectIds) expect(html).toContain(escape(projects.find((p) => p.id === id)!.title))
      }
    }
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/components/services-pages.test.tsx`
Expected: FAIL: `@/app/services/page` does not exist.

- [ ] **Step 3: Write `/services`**

Create `app/services/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { PlanTheRoute } from '@/components/sections/plan-the-route'
import { SECTION } from '@/components/ui/grid'
import { PageIntro } from '@/components/ui/page-intro'
import { TrailLink } from '@/components/ui/trail-link'
import { ctaLabels, pagesUpdated, servicePages, servicesPageContent } from '@/lib/data'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: servicesPageContent.title,
  description: servicesPageContent.answer,
  alternates: { canonical: '/services' },
}

// The business path from the fork (spec §5): the three services, each a card
// with its name, one line and how many shipped projects prove it, then the
// form. Persuade: the answer, the services, the way to start.
export default function ServicesPage() {
  const c = servicesPageContent

  return (
    <>
      <PageIntro eyebrow={c.eyebrow} title={c.heading} answer={c.answer} updated={pagesUpdated}>
        <a href="#contact" className="press button-primary">
          {ctaLabels.startProject}
          <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
        </a>
      </PageIntro>

      <ul className={cn(SECTION, 'grid gap-6 pb-[72px] md:grid-cols-3 md:pb-[112px]')}>
        {servicePages.map((s) => (
          <li key={s.slug} className="flex flex-col rounded border border-line bg-panel p-6 sm:p-8">
            <h2 className="text-title text-ink">{s.name}</h2>
            <p className="mt-4 leading-relaxed text-muted-strong">{s.summary}</p>
            <p className="map-label tabular mt-4 text-muted">{`${s.projectIds.length} projects`}</p>
            <div className="mt-auto pt-6">
              <TrailLink href={`/services/${s.slug}`} text={ctaLabels.readMore} srText={` about ${s.name}`} />
            </div>
          </li>
        ))}
      </ul>

      <PlanTheRoute />
    </>
  )
}
```

- [ ] **Step 4: Write the service page**

Create `app/services/[slug]/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { PlanTheRoute } from '@/components/sections/plan-the-route'
import { SECTION } from '@/components/ui/grid'
import { PageIntro } from '@/components/ui/page-intro'
import { ProjectPlate } from '@/components/ui/project-plate'
import { SectionHeading } from '@/components/ui/section-heading'
import { TrailLink } from '@/components/ui/trail-link'
import { catalogOrder, projectCode } from '@/lib/board'
import { ctaLabels, pagesUpdated, projects, servicePages, servicesPageContent } from '@/lib/data'
import { hasFullShot } from '@/lib/project-page'
import { cn } from '@/lib/utils'
import type { Project, ServiceComparison } from '@/types'

interface ServicePageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }))
}

// Three services, known at build time; any other slug is a 404.
export const dynamicParams = false

export function generateMetadata({ params }: ServicePageProps): Metadata {
  const service = servicePages.find((s) => s.slug === params.slug)
  if (!service) return {}
  return {
    title: service.title,
    description: service.answer,
    keywords: [service.keyword],
    alternates: { canonical: `/services/${service.slug}` },
  }
}

// tests/content/new-pages.test.ts holds every id to a real project.
function byId(id: string): Project {
  const project = projects.find((p) => p.id === id)
  if (!project) throw new Error(`Unknown project id: ${id}`)
  return project
}

/**
 * A comparison as a real table. On a phone it is wider than the screen, so it
 * scrolls sideways inside a labelled region that takes focus (keyboard users
 * can scroll it), never the page.
 */
function Comparison({ comparison }: { comparison: ServiceComparison }) {
  return (
    <div role="region" aria-label={comparison.caption} tabIndex={0} className="overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-left">
        <caption className="text-title mb-5 text-left text-ink">{comparison.caption}</caption>
        <thead>
          <tr>
            {comparison.columns.map((column) => (
              <th key={column} scope="col" className="map-label border-b border-line-strong pb-2 pr-6 text-muted-strong">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparison.rows.map((row) => (
            <tr key={row.need} className="border-b border-line align-top">
              <th scope="row" className="py-4 pr-6 font-semibold text-ink">
                {row.need}
              </th>
              <td className="py-4 pr-6 text-muted-strong">{row.choice}</td>
              <td className="py-4 text-muted-strong">{row.projectIds.map((id) => byId(id).title).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * A service (spec §5, §6): the answer that opens it, question-style h2s with
 * short answers, an honest comparison where the data holds one, the projects
 * that prove it as plates (catalog numbers as on /projects), then the form.
 */
export default function ServicePage({ params }: ServicePageProps) {
  const service = servicePages.find((s) => s.slug === params.slug)
  if (!service) notFound()
  const order = catalogOrder(projects, hasFullShot)
  const { proof } = servicesPageContent

  return (
    <>
      <PageIntro eyebrow={servicesPageContent.eyebrow} title={service.name} answer={service.answer} updated={pagesUpdated}>
        <a href="#contact" className="press button-primary">
          {ctaLabels.startProject}
          <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
        </a>
        <TrailLink href="/services" text={ctaLabels.allServices} />
      </PageIntro>

      <div className={cn(SECTION, 'grid gap-12 pb-[72px] md:pb-[112px]')}>
        {service.sections.map((s, i) => (
          <section key={s.question} aria-labelledby={`question-${i + 1}`} className="max-w-3xl border-t border-line pt-8">
            <h2 id={`question-${i + 1}`} className="text-title text-ink">
              {s.question}
            </h2>
            {s.answer.map((p) => (
              <p key={p} className="mt-4 max-w-[62ch] leading-relaxed text-muted-strong">
                {p}
              </p>
            ))}
          </section>
        ))}
        {service.comparison && <Comparison comparison={service.comparison} />}
      </div>

      <section aria-labelledby="proof-title" className={cn(SECTION, 'pb-[72px] md:pb-[112px]')}>
        <SectionHeading id="proof-title" eyebrow={proof.eyebrow} title={proof.title} />
        <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {service.projectIds.map(byId).map((p) => (
            <ProjectPlate key={p.id} project={p} code={projectCode(p, order)} />
          ))}
        </ul>
      </section>

      <PlanTheRoute />
    </>
  )
}
```

- [ ] **Step 5: Run the tests**

Run: `npx vitest run tests/components/services-pages.test.tsx tests/design`
Expected: PASS (the design suite includes `grid`, `survey-plate`, `primary-button`, `no-inline-motion`, `client-boundary` and `green-means-live`, which the new files must already satisfy).

- [ ] **Step 6: Gates and commit**

The build's route table lists `○ /services` and `● /services/[slug]` with three paths.

```bash
git add app/services tests/components/services-pages.test.tsx
git commit -m "feat(services): /services and the three service pages" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: `/about`

**Model:** Sonnet

**Files:**
- Create: `app/about/page.tsx`, `tests/components/about-page.test.tsx`
- Delete: `lib/field-log.ts`, `tests/content/field-log.test.ts`

**Interfaces:**
- Consumes: `PageIntro`, `WorkHistory` (Task 2); `aboutPageContent`, `galleryContent`, `galleryImages`, `recommendations`, `projects`, `resumeUrl`, `pagesUpdated`, `ctaLabels.{startProject, downloadResume, hireForRole, viewServices}`; `ImageLightbox({ src, alt, describedBy, className })`, `SurveyPlate`, `SectionHeading`, `TrailLink`, `SECTION`; `projectHref` (`@/lib/project-page`).
- Produces: `app/about/page.tsx` default `AboutPage`, `metadata`. Section ids `story`, `route`, `field-log`, `testimonials`; photo captions `photo-<id>`.

- [ ] **Step 1: Write the failing test**

Create `tests/components/about-page.test.tsx`:

```tsx
import { existsSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import AboutPage, { metadata } from '@/app/about/page'
import { aboutPageContent, galleryContent, galleryImages, projects, recommendations, resumeUrl } from '@/lib/data'
import { buildTimeline } from '@/lib/timeline'

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')
const tag = (html: string, href: string) => html.match(new RegExp(`<a [^>]*href="${href}"[^>]*>`))?.[0] ?? ''

describe('/about', () => {
  const html = renderToStaticMarkup(<AboutPage />)

  it('opens with its answer under the one h1', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain(`>${escape(aboutPageContent.heading)}</h1>`)
    const answer = html.indexOf(`>${escape(aboutPageContent.answer)}</p>`)
    expect(answer).toBeGreaterThan(html.indexOf('</h1>'))
    expect(answer).toBeLessThan(html.indexOf('<h2'))
  })

  it('offers a project first, then the résumé as a PDF in a new tab', () => {
    expect(tag(html, '/#contact')).toContain('class="press button-primary"')
    const resume = tag(html, resumeUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    expect(resume).toContain('class="press button-secondary"')
    expect(resume).toContain('target="_blank"')
    expect(html).toContain('(PDF, opens in a new tab)')
  })

  it('tells the story, then the dated route, then the photos, then the quotes', () => {
    const at = ['story', 'route', 'field-log', 'testimonials'].map((id) => html.indexOf(`<section id="${id}"`))
    for (const i of at) expect(i).toBeGreaterThan(-1)
    expect([...at].sort((a, b) => a - b)).toEqual(at)
    for (const p of aboutPageContent.story.paragraphs) expect(html).toContain(`<p>${escape(p)}</p>`)
    for (const e of buildTimeline()) expect(html).toContain(`>${escape(e.title)}</h3>`)
  })

  it('frames all six photos on survey plates, each opening larger and described by its caption', () => {
    expect(html).toContain(`>${escape(galleryContent.title)}</h2>`)
    expect(galleryImages).toHaveLength(6)
    for (const img of galleryImages) {
      expect(html).toContain(`aria-describedby="photo-${img.id}"`)
      expect(html).toContain(`<figcaption id="photo-${img.id}"`)
      expect(html).toContain(escape(img.caption))
      expect(html).toContain(`aria-label="View larger image: ${escape(img.alt)}"`)
    }
    expect(html.match(/<figure class="survey-plate/g)).toHaveLength(galleryImages.length)
  })

  it('attributes all four quotes, linking each to its project where one exists', () => {
    expect(recommendations).toHaveLength(4)
    for (const r of recommendations) {
      expect(html).toContain(escape(r.quote))
      expect(html).toContain(`>${escape(r.authorName)}</span>`)
      expect(html).toContain(`>${escape(r.authorTitle)}</span>`)
      const project = projects.find((p) => p.id === r.projectId)
      if (project) expect(html).toContain(`href="/projects/${project.slug}"`)
    }
  })

  it('leads on to /hire and /services', () => {
    expect(html).toContain('href="/hire"')
    expect(html).toContain('href="/services"')
  })

  it('is titled and canonical', () => {
    expect(metadata.title).toBe(aboutPageContent.title)
    expect(metadata.description).toBe(aboutPageContent.answer)
    expect(metadata.alternates?.canonical).toBe('/about')
  })

  it('retires the 4.0 field log builder: photos and quotes are two sections now', () => {
    expect(existsSync('lib/field-log.ts')).toBe(false)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/components/about-page.test.tsx`
Expected: FAIL: `@/app/about/page` does not exist.

- [ ] **Step 3: Write `/about`**

Create `app/about/page.tsx`:

```tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SECTION } from '@/components/ui/grid'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { PageIntro } from '@/components/ui/page-intro'
import { SectionHeading } from '@/components/ui/section-heading'
import { SurveyPlate } from '@/components/ui/survey-plate'
import { TrailLink } from '@/components/ui/trail-link'
import { WorkHistory } from '@/components/ui/work-history'
import {
  aboutPageContent,
  ctaLabels,
  galleryContent,
  galleryImages,
  pagesUpdated,
  projects,
  recommendations,
  resumeUrl,
} from '@/lib/data'
import { projectHref } from '@/lib/project-page'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: aboutPageContent.title,
  description: aboutPageContent.answer,
  alternates: { canonical: '/about' },
}

const BLOCK = 'pb-[72px] md:pb-[112px]'

/**
 * About (spec §5), a Read page: the answer, the story, the dated route, the
 * six field photos on survey plates (each opens larger; its caption is the
 * proof, so it is always visible), the four attributed quotes, then the two
 * ways on. Nothing here is new fact: it all comes from lib/data.ts.
 */
export default function AboutPage() {
  const c = aboutPageContent

  return (
    <>
      <PageIntro eyebrow={c.eyebrow} title={c.heading} answer={c.answer} updated={pagesUpdated}>
        <Link href="/#contact" className="press button-primary">
          {ctaLabels.startProject}
          <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
        </Link>
        <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="press button-secondary">
          {ctaLabels.downloadResume}
          <span className="sr-only">(PDF, opens in a new tab)</span>
        </a>
      </PageIntro>

      <section id="story" aria-labelledby="story-title" className={cn(SECTION, BLOCK)}>
        <SectionHeading id="story-title" eyebrow={c.story.eyebrow} title={c.story.title} />
        <div className="grid max-w-[62ch] gap-5 text-lg leading-relaxed text-muted-strong">
          {c.story.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <section id="route" aria-labelledby="route-title" className={cn(SECTION, BLOCK)}>
        <SectionHeading id="route-title" eyebrow={c.timeline.eyebrow} title={c.timeline.title} />
        <WorkHistory />
      </section>

      <section id="field-log" aria-labelledby="field-log-title" className={cn(SECTION, BLOCK)}>
        <SectionHeading id="field-log-title" eyebrow={galleryContent.eyebrow} title={galleryContent.title} />
        <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {galleryImages.map((img) => (
            <li key={img.id}>
              <SurveyPlate as="figure">
                {/* alt="" on the image: the lightbox button carries the name, the caption describes it. */}
                <ImageLightbox src={img.src} alt={img.alt} describedBy={`photo-${img.id}`} className="w-full">
                  <span className="relative block aspect-[4/3] overflow-hidden">
                    <Image
                      src={img.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 352px, (min-width: 640px) 45vw, calc(100vw - 58px)"
                      className="object-cover"
                    />
                  </span>
                </ImageLightbox>
                <figcaption id={`photo-${img.id}`} className="mt-3 px-1 text-sm leading-snug text-muted-strong">
                  {img.caption}
                </figcaption>
              </SurveyPlate>
            </li>
          ))}
        </ul>
      </section>

      <section id="testimonials" aria-labelledby="testimonials-title" className={cn(SECTION, BLOCK)}>
        <SectionHeading id="testimonials-title" eyebrow={c.testimonials.eyebrow} title={c.testimonials.title} />
        <ul className="grid gap-6 md:grid-cols-2">
          {recommendations.map((r) => {
            const project = projects.find((p) => p.id === r.projectId)
            return (
              <li key={r.id}>
                <figure className="flex h-full flex-col rounded border border-line bg-panel p-6 sm:p-8">
                  <blockquote className="text-lg leading-relaxed text-ink">
                    <p>{`“${r.quote}”`}</p>
                  </blockquote>
                  <figcaption className="mt-auto pt-6">
                    <span className="block font-semibold text-ink">{r.authorName}</span>
                    <span className="block text-sm text-muted-strong">{r.authorTitle}</span>
                    {project && <TrailLink href={projectHref(project)} text={project.title} kind="label" className="mt-2" />}
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>
      </section>

      <div className={cn(SECTION, 'flex flex-wrap items-center gap-x-6 gap-y-3 pb-16 md:pb-24')}>
        <TrailLink href="/hire" text={ctaLabels.hireForRole} />
        <TrailLink href="/services" text={ctaLabels.viewServices} />
      </div>
    </>
  )
}
```

Note the quote test: `escape(r.quote)` is found inside `“…”`, so the test needs no quote marks.

- [ ] **Step 4: Retire the field log builder**

Run: `git rm lib/field-log.ts tests/content/field-log.test.ts`
Then run `grep -rn "field-log'" app components lib tests`; it must print nothing (the `field-log` section id and `galleryContent` stay).

- [ ] **Step 5: Run the tests**

Run: `npx vitest run tests/components/about-page.test.tsx tests/design`
Expected: PASS.

- [ ] **Step 6: Gates and commit**

The build's route table lists `○ /about`.

```bash
git add app/about tests/components/about-page.test.tsx
git commit -m "feat(about): story, route, field photos and attributed quotes on /about" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: `/hire`

**Model:** Sonnet

**Files:**
- Create: `app/hire/page.tsx`, `tests/components/hire-page.test.tsx`

**Interfaces:**
- Consumes: `PageIntro`, `WorkHistory` (Task 2); `hirePageContent`, `skills`, `availability`, `contactInfo`, `socialLinks`, `resumeUrl`, `pagesUpdated`, `ctaLabels.downloadResume`; `SectionHeading`, `TrailLink`, `SECTION`, `PlanTheRoute`.
- Produces: `app/hire/page.tsx` default `HirePage`, `metadata`. Chips share one class string, `CHIP`.

- [ ] **Step 1: Write the failing test**

Create `tests/components/hire-page.test.tsx`:

```tsx
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import HirePage, { metadata } from '@/app/hire/page'
import { ToastProvider } from '@/components/ui/toaster'
import { availability, contactInfo, experience, hirePageContent, resumeUrl, skills, socialLinks } from '@/lib/data'

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')
const re = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const tag = (html: string, href: string) => html.match(new RegExp(`<a [^>]*href="${re(href)}"[^>]*>`))?.[0] ?? ''
const CHIP = 'class="map-label rounded-sm border border-line-strong px-3 py-2 text-ink"'

describe('/hire', () => {
  const html = renderToStaticMarkup(
    <ToastProvider>
      <HirePage />
    </ToastProvider>,
  )
  const c = hirePageContent

  it('opens with its answer under the one h1', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain(`>${escape(c.heading)}</h1>`)
    const answer = html.indexOf(`>${escape(c.answer)}</p>`)
    expect(answer).toBeGreaterThan(html.indexOf('</h1>'))
    expect(answer).toBeLessThan(html.indexOf('<h2'))
  })

  it('makes the résumé the primary action, the email beside it', () => {
    const resume = tag(html, resumeUrl)
    expect(resume).toContain('class="press button-primary"')
    expect(resume).toContain('target="_blank"')
    expect(tag(html, `mailto:${contactInfo.email}`)).toContain('class="press button-secondary"')
  })

  it('sets the stack by depth: the core first, then every other skill once, under its category', () => {
    const core = html.indexOf(`>${c.stack.coreLabel}</h3>`)
    const more = html.indexOf(`>${c.stack.moreLabel}</h3>`)
    expect(core).toBeGreaterThan(-1)
    expect(more).toBeGreaterThan(core)
    for (const id of c.stack.coreIds) {
      const name = skills.find((s) => s.id === id)!.name
      const at = html.indexOf(`<li ${CHIP}>${escape(name)}</li>`)
      expect(at, name).toBeGreaterThan(core)
      expect(at, name).toBeLessThan(more)
    }
    expect(html.split(CHIP).length - 1).toBe(skills.length)
    for (const s of skills.filter((x) => c.stack.coreIds.indexOf(x.id) === -1)) {
      expect(html.indexOf(`<li ${CHIP}>${escape(s.name)}</li>`), s.name).toBeGreaterThan(more)
      expect(html).toContain(`<dt class="text-sm text-muted-strong">${escape(s.category)}</dt>`)
    }
  })

  it('states availability, the public base and the code, never a phone', () => {
    expect(html).toContain(`>${escape(availability)}</dd>`)
    expect(html).toContain(`>${escape(contactInfo.location)}</dd>`)
    expect(html).toContain(`href="${socialLinks.find((l) => l.icon === 'github')!.url}"`)
    expect(html).not.toMatch(/href="tel:/)
  })

  it('says how I work, with the AI tools in use', () => {
    for (const n of c.howIWork.notes) {
      expect(html).toContain(`>${escape(n.title)}</h3>`)
      expect(html).toContain(`>${escape(n.body)}</p>`)
    }
    for (const item of c.howIWork.aiInUse) {
      expect(html).toContain(escape(item.label))
      if (item.href) expect(html).toContain(`href="${item.href}"`)
    }
  })

  it('gives the full work history, responsibilities and all, then ends in the form', () => {
    for (const r of experience[0].responsibilities) expect(html).toContain(escape(r))
    expect(html.indexOf('<section id="contact"')).toBeGreaterThan(html.indexOf(escape(experience[0].responsibilities[0])))
  })

  it('is titled and canonical', () => {
    expect(metadata.title).toBe(c.title)
    expect(metadata.description).toBe(c.answer)
    expect(metadata.alternates?.canonical).toBe('/hire')
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/components/hire-page.test.tsx`
Expected: FAIL: `@/app/hire/page` does not exist.

- [ ] **Step 3: Write `/hire`**

Create `app/hire/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { Download } from 'lucide-react'
import { PlanTheRoute } from '@/components/sections/plan-the-route'
import { SECTION } from '@/components/ui/grid'
import { PageIntro } from '@/components/ui/page-intro'
import { SectionHeading } from '@/components/ui/section-heading'
import { TrailLink } from '@/components/ui/trail-link'
import { WorkHistory } from '@/components/ui/work-history'
import { availability, contactInfo, ctaLabels, hirePageContent, pagesUpdated, resumeUrl, skills, socialLinks } from '@/lib/data'
import { cn } from '@/lib/utils'
import type { Skill } from '@/types'

export const metadata: Metadata = {
  title: hirePageContent.title,
  description: hirePageContent.answer,
  alternates: { canonical: '/hire' },
}

const BLOCK = 'pb-[72px] md:pb-[112px]'
const CHIP = 'map-label rounded-sm border border-line-strong px-3 py-2 text-ink'

/**
 * Hire (spec §5), the team path from the fork: the answer, the résumé
 * (primary) and the email; the stack by depth beside the facts at a glance;
 * how I work, with the AI tools in use; the full work history; then the form,
 * whose copy already invites a hiring note.
 */
export default function HirePage() {
  const c = hirePageContent
  const github = socialLinks.find((l) => l.icon === 'github')
  const core = c.stack.coreIds
    .map((id) => skills.find((s) => s.id === id))
    .filter((s): s is Skill => Boolean(s))
  const rest = skills.filter((s) => c.stack.coreIds.indexOf(s.id) === -1)
  const categories = rest.map((s) => s.category).filter((cat, i, all) => all.indexOf(cat) === i)

  return (
    <>
      <PageIntro eyebrow={c.eyebrow} title={c.heading} answer={c.answer} updated={pagesUpdated}>
        <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="press button-primary">
          {ctaLabels.downloadResume}
          <Download aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only">(PDF, opens in a new tab)</span>
        </a>
        <a href={`mailto:${contactInfo.email}`} className="press button-secondary">
          {contactInfo.email}
        </a>
      </PageIntro>

      <div className={cn(SECTION, BLOCK, 'grid gap-12 lg:grid-cols-[7fr_5fr] lg:items-start')}>
        <section aria-labelledby="stack-title" className="min-w-0">
          <SectionHeading id="stack-title" eyebrow={c.stack.eyebrow} title={c.stack.title} />
          <h3 className="map-label text-ink">{c.stack.coreLabel}</h3>
          <p className="mt-1 text-sm text-muted">{c.stack.coreNote}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {core.map((s) => (
              <li key={s.id} className={CHIP}>
                {s.name}
              </li>
            ))}
          </ul>
          <h3 className="map-label mt-10 text-ink">{c.stack.moreLabel}</h3>
          <dl className="mt-4 grid gap-4">
            {categories.map((cat) => (
              <div key={cat} className="grid gap-2 sm:grid-cols-[11rem_1fr]">
                <dt className="text-sm text-muted-strong">{cat}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-2">
                    {rest
                      .filter((s) => s.category === cat)
                      .map((s) => (
                        <li key={s.id} className={CHIP}>
                          {s.name}
                        </li>
                      ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <aside aria-labelledby="facts-title" className="rounded-sm border border-line bg-panel p-6 sm:p-8">
          <h2 id="facts-title" className="map-label text-ink">
            {c.facts.title}
          </h2>
          <dl className="mt-5 grid gap-4">
            <div>
              <dt className="map-label text-muted">{c.facts.labels.availability}</dt>
              <dd className="mt-1 text-ink">{availability}</dd>
            </div>
            <div>
              <dt className="map-label text-muted">{c.facts.labels.base}</dt>
              <dd className="mt-1 text-ink">{contactInfo.location}</dd>
            </div>
            {github && (
              <div>
                <dt className="map-label text-muted">{c.facts.labels.code}</dt>
                <dd className="mt-1">
                  <TrailLink href={github.url} text={github.name} kind="label" external />
                </dd>
              </div>
            )}
          </dl>
        </aside>
      </div>

      <section aria-labelledby="practice-title" className={cn(SECTION, BLOCK)}>
        <SectionHeading id="practice-title" eyebrow={c.howIWork.eyebrow} title={c.howIWork.title} />
        <ul className="grid gap-6 md:grid-cols-3">
          {c.howIWork.notes.map((n) => (
            <li key={n.title} className="border-t border-line pt-4">
              <h3 className="text-title text-ink">{n.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-strong">{n.body}</p>
            </li>
          ))}
        </ul>
        <p className="map-label mt-10 text-muted-strong">{c.howIWork.aiLead}</p>
        <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
          {c.howIWork.aiInUse.map((item) => (
            <li key={item.label}>
              {item.href ? (
                <TrailLink href={item.href} text={item.label} kind="label" />
              ) : (
                <span className="map-label inline-flex min-h-[44px] items-center text-ink sm:min-h-[32px]">{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="history-title" className={cn(SECTION, BLOCK)}>
        <SectionHeading id="history-title" eyebrow={c.history.eyebrow} title={c.history.title} />
        <WorkHistory detailed />
      </section>

      <PlanTheRoute />
    </>
  )
}
```

- [ ] **Step 4: Run the tests**

Run: `npx vitest run tests/components/hire-page.test.tsx tests/design`
Expected: PASS.

- [ ] **Step 5: Gates and commit**

The build's route table lists `○ /hire`.

```bash
git add app/hire tests/components/hire-page.test.tsx
git commit -m "feat(hire): /hire with the résumé, stack by depth, practice and work history" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: 404: Off the trail

**Model:** Sonnet

**Files:**
- Modify: `lib/contours.ts` (add `offTrail`), `lib/data.ts` (`notFoundContent`)
- Rewrite: `app/not-found.tsx`, `tests/components/not-found.test.tsx`
- Modify: `tests/design/primary-button.test.ts`

**Interfaces:**
- Consumes: `ContourField({ paths, viewBox })`, `SurveyPlate`, `TrailLink`, `SECTION`; `ctaLabels.{backHome, allProjects}`, `sectionContent.timeline.here`.
- Produces: `offTrail: { contours: string[]; route: string; viewBox: string }` from `@/lib/contours` (a 400×400 field, "you are here" at its centre); `notFoundContent: { eyebrow, title, description, here }`.

- [ ] **Step 1: Write the failing tests**

Replace the whole of `tests/components/not-found.test.tsx` with:

```tsx
import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import NotFound from '@/app/not-found'
import { offTrail } from '@/lib/contours'
import { notFoundContent } from '@/lib/data'

// Spec §5: "Off the trail", an empty map square with a route home.
describe('404: off the trail', () => {
  const html = renderToStaticMarkup(<NotFound />)
  const plate = html.slice(html.indexOf('class="survey-plate'), html.indexOf('<h1'))

  it('sits on the one grid with an eyebrow and a single h1', () => {
    const outer = (html.match(/^<div class="([^"]*)"/)?.[1] ?? '').split(' ')
    for (const c of ['mx-auto', 'max-w-6xl', 'px-5', 'sm:px-8']) expect(outer).toContain(c)
    expect(html).toMatch(new RegExp(`<p class="eyebrow[^"]*">${notFoundContent.eyebrow}</p>`))
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain(`>${notFoundContent.title}</h1>`)
    expect(html).toContain(notFoundContent.description)
  })

  it('draws an empty map square on a survey plate: contours, a route, no pins', () => {
    expect(plate).toContain('aspect-square')
    expect(plate).toMatch(/<svg aria-hidden="true"[^>]*class="[^"]*text-contour/)
    expect(plate.match(/<path /g)?.length).toBe(offTrail.contours.length + 1)
    expect(plate).toContain(`d="${offTrail.route}"`)
    expect(plate).not.toContain('<a ')
    expect(plate).toContain(`>${notFoundContent.here}</span>`)
  })

  it('routes home first: the primary goes to /, then every project', () => {
    const home = html.match(/<a [^>]*href="\/"[^>]*>/)?.[0] ?? ''
    expect(home).toContain('class="press button-primary"')
    expect(html.indexOf('href="/"')).toBeLessThan(html.indexOf('href="/projects"'))
  })

  it('keeps trail red to the "you are here" dot', () => {
    const src = readFileSync('app/not-found.tsx', 'utf8')
    expect(src.match(/\b(?:bg|text|border|fill|stroke|ring|decoration)-trail\b/g)).toEqual(['bg-trail'])
  })

  it('keeps its copy free of em-dashes', () => {
    for (const t of Object.values(notFoundContent)) expect(t).not.toContain('—')
  })
})
```

In `tests/design/primary-button.test.ts`, replace

```ts
    expect(uses('app/not-found.tsx', '{ctaLabels.allProjects}')).toContain('button-primary')
```

with

```ts
    expect(uses('app/not-found.tsx', '{ctaLabels.backHome}')).toContain('button-primary')
```

Run `grep -P '\x08' tests/components/not-found.test.tsx`; it must print nothing.

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/components/not-found.test.tsx tests/design/primary-button.test.ts`
Expected: FAIL: `offTrail` is not exported; the old 404 has no `aspect-square` and its primary is "All projects".

- [ ] **Step 3: Add the square's linework and the copy**

Append to `lib/contours.ts`:

```ts
// The 404's empty map square (app/not-found.tsx): contours on a 400 x 400
// field, clear of its centre, where "you are here" sits; and a faint route
// from there to the edge. Decorative only.
export const offTrail = {
  contours: [
    'M0 330 C80 310 140 262 200 262 S330 312 400 292',
    'M0 300 C70 280 130 240 200 240 S320 280 400 262',
    'M0 160 C50 140 110 82 200 82 S290 110 400 110',
    'M0 120 C45 100 100 40 200 40 S280 62 400 66',
    'M260 400 C270 350 330 330 400 340',
    'M300 400 C305 370 350 360 400 366',
  ],
  route: 'M200 200 C176 250 120 292 40 372',
  viewBox: '0 0 400 400',
}
```

In `lib/data.ts`, replace the whole `notFoundContent` block

```ts
// app/not-found.tsx: any unknown address, including an unknown /projects/<slug>.
export const notFoundContent = {
  eyebrow: '404',
  title: 'Nothing lives at this address',
  description: 'The link may be old or mistyped. Every project I have shipped is on the projects page.',
}
```

with

```ts
// app/not-found.tsx: any unknown address, including an unknown /projects/<slug>
// or /services/<slug>. Spec §5: "Off the trail".
export const notFoundContent = {
  eyebrow: '404 · Off the trail',
  title: 'Off the trail',
  description: 'Nothing lives at this address: the link may be old or mistyped. The way home starts here, and every project I have shipped is on the projects page.',
  here: sectionContent.timeline.here,
}
```

- [ ] **Step 4: Rewrite the 404**

Replace the whole of `app/not-found.tsx` with:

```tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ContourField } from '@/components/map/contour-field'
import { SECTION } from '@/components/ui/grid'
import { SurveyPlate } from '@/components/ui/survey-plate'
import { TrailLink } from '@/components/ui/trail-link'
import { offTrail } from '@/lib/contours'
import { ctaLabels, notFoundContent } from '@/lib/data'
import { cn } from '@/lib/utils'

// Every unknown address lands here, including an unknown /projects/<slug> or
// /services/<slug> (both routes set dynamicParams = false).
//
// Off the trail (spec §5): an empty square of survey map on a plate, contours
// and no pins, a trail-red dot where you are (the page's only trail red: the
// current position) and a faint dashed route from it to the edge. The route
// home is the primary button.
export default function NotFound() {
  return (
    <div className={cn(SECTION, 'pb-16 pt-12 md:pb-24 md:pt-16')}>
      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-16">
        <SurveyPlate className="w-full max-w-[18rem] md:max-w-none">
          <div className="relative aspect-square overflow-hidden border border-dashed border-line-strong">
            <ContourField paths={offTrail.contours} viewBox={offTrail.viewBox} />
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox={offTrail.viewBox}
              className="pointer-events-none absolute inset-0 h-full w-full text-muted-strong"
              fill="none"
            >
              <path d={offTrail.route} stroke="currentColor" strokeWidth={2} strokeDasharray="6 8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
            <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-trail" />
            <span className="map-label absolute left-1/2 top-1/2 ml-4 -translate-y-1/2 bg-panel px-1 text-ink">{notFoundContent.here}</span>
          </div>
        </SurveyPlate>
        <div>
          <p className="eyebrow mb-3">{notFoundContent.eyebrow}</p>
          <h1 className="text-page-h1 max-w-[16ch] text-ink">{notFoundContent.title}</h1>
          <p className="text-lede mt-5 max-w-2xl text-muted-strong">{notFoundContent.description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/" className="press button-primary">
              {ctaLabels.backHome}
              <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
            </Link>
            <TrailLink href="/projects" text={ctaLabels.allProjects} />
          </div>
        </div>
      </div>
    </div>
  )
}
```

The `<path` count in the test is the contours plus the route; `ContourField` renders one `<path ` per contour.

- [ ] **Step 5: Run the tests**

Run: `npx vitest run tests/components/not-found.test.tsx tests/design tests/content/cta-labels.test.ts`
Expected: PASS.

- [ ] **Step 6: Gates and commit**

```bash
git add lib/contours.ts lib/data.ts app/not-found.tsx tests/components/not-found.test.tsx tests/design/primary-button.test.ts
git commit -m "feat(404): off the trail, an empty map square with the route home" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: The legend: new pages and the phone menu

**Model:** Sonnet. Load `modern-web-guidance` (disclosure / `<details>` pattern) before Step 3.

**Files:**
- Modify: `lib/data.ts` (`navigationItems`)
- Rewrite: `components/site-legend.tsx`
- Modify: `tests/components/chrome.test.tsx`, `tests/content/positioning.test.ts`, `tests/components/homepage.test.tsx`

**Interfaces:**
- Consumes: the pages from Tasks 3-5 (`tests/design/nav-anchors.test.ts` checks each route has an `app/<route>/page.tsx`); `navigationItems`, `resumeUrl`, `heroContent.name`.
- Produces: `navigationItems` = Work `/projects`, Services `/services`, About `/about`, Hire `/hire`, Contact `#contact`. `SiteLegend` renders two `nav aria-label="Primary"`: the row (`max-lg:hidden`) and, inside `<details class="lg:hidden">`, the menu (every item plus the résumé). Still the same one client component.

- [ ] **Step 1: Write the failing tests**

In `tests/components/chrome.test.tsx`, inside `describe('legend navigation', …)`, replace

```ts
  it('lists Work first and keeps Contact', () => {
    expect(navigationItems[0]).toEqual({ label: 'Work', href: '/projects' })
    expect(navigationItems.map((n) => n.label)).toContain('Contact')
  })
```

with

```ts
  it('lists the pages in the spec’s order: Work, Services, About, Hire, then Contact', () => {
    expect(navigationItems).toEqual([
      { label: 'Work', href: '/projects' },
      { label: 'Services', href: '/services' },
      { label: 'About', href: '/about' },
      { label: 'Hire', href: '/hire' },
      { label: 'Contact', href: '#contact' },
    ])
  })
```

and replace

```ts
  it('fits the three links on a phone: the name hides visually and the row shows no scrollbar', () => {
    expect(src).toMatch(/className="[^"]*max-sm:sr-only[^"]*"[^>]*>\{heroContent\.name\}/)
    expect(src).toContain('[scrollbar-width:none]')
  })
```

with

```ts
  it('keeps the row from 1024px and folds it into a menu below; the name hides visually on a phone', () => {
    expect(src).toMatch(/className="[^"]*max-sm:sr-only[^"]*"[^>]*>\{heroContent\.name\}/)
    expect(src).toContain('[scrollbar-width:none]')
    const html = renderToStaticMarkup(<SiteLegend />)
    const navs = html.match(/<nav aria-label="Primary"[^>]*>/g) ?? []
    expect(navs).toHaveLength(2)
    expect(navs[0]).toContain('max-lg:hidden')
    expect(html).toContain('<details class="lg:hidden">')
    expect(html).toMatch(/<summary[^>]*>[\s\S]*?Menu<\/summary>/)
  })

  it('puts every page and the résumé in the menu', () => {
    const html = renderToStaticMarkup(<SiteLegend />)
    const menu = html.slice(html.indexOf('<details'), html.indexOf('</details>'))
    for (const item of navigationItems) {
      expect(menu, item.label).toContain(`href="${item.href.startsWith('#') ? `/${item.href}` : item.href}"`)
    }
    expect(menu).toContain(`href="${resumeUrl}"`)
  })

  it('shows the row’s résumé link only from 1024px, where the menu is gone', () => {
    const html = renderToStaticMarkup(<SiteLegend />)
    const row = html.slice(0, html.indexOf('<details'))
    expect(row).toMatch(new RegExp(`<a href="${resumeUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" class="[^"]*\\bhidden\\b[^"]*\\blg:inline-flex\\b`))
  })

  it('closes the menu on a route change, on Escape (focus back on Menu), on a press outside and when a link is followed', () => {
    expect(src).toContain('useEffect(() => setMenuOpen(false), [pathname])')
    expect(src).toContain("e.key !== 'Escape'")
    expect(src).toContain('summaryRef.current?.focus()')
    expect(src).toContain("document.addEventListener('pointerdown', onPointer)")
    expect(src).toMatch(/onClick=\{\(\) => setMenuOpen\(false\)\}/)
    expect(src).toMatch(/onToggle=\{\(e\) => setMenuOpen\(e\.currentTarget\.open\)\}/)
  })
```

In `tests/content/positioning.test.ts`, replace

```ts
  it('navigates to the work, experience and contact', () => {
    expect(navigationItems.map((n) => n.href)).toEqual(['/projects', '#timeline', '#contact'])
  })
```

with

```ts
  it('navigates to the work, the services, about, hire and contact', () => {
    expect(navigationItems.map((n) => n.href)).toEqual(['/projects', '/services', '/about', '/hire', '#contact'])
  })
```

In `tests/components/homepage.test.tsx`, replace

```ts
  it('is the #timeline section the legend’s Experience link lands on, its heading from data', () => {
    expect(html).toMatch(/^<section id="timeline" aria-labelledby="timeline-title"/)
    expect(navigationItems.find((n) => n.label === 'Experience')?.href).toBe('#timeline')
```

with

```ts
  it('is the #timeline section, its heading from data', () => {
    expect(html).toMatch(/^<section id="timeline" aria-labelledby="timeline-title"/)
```

and, if `navigationItems` is then unused in that file, drop it from the `@/lib/data` import.

Run `grep -P '\x08' tests/components/chrome.test.tsx`; it must print nothing.

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/components/chrome.test.tsx tests/content/positioning.test.ts tests/components/homepage.test.tsx tests/design/nav-anchors.test.ts`
Expected: FAIL in `chrome` (three items, one nav, no `<details>`) and `positioning` (the old hrefs).

- [ ] **Step 3: Add the pages to the navigation**

In `lib/data.ts`, replace

```ts
// Labels a client understands. `#` targets are homepage sections; `/` targets
// are pages. tests/design/nav-anchors.test.ts checks both kinds resolve.
// Services, About and Hire join in S4, when their pages exist
// (tests/design/nav-anchors.test.ts checks every route has a page).
export const navigationItems: NavigationItem[] = [
  { label: 'Work', href: '/projects' },
  { label: 'Experience', href: '#timeline' },
  { label: 'Contact', href: '#contact' },
]
```

with

```ts
// Labels a client understands, in the spec's order (§3). `/` targets are
// pages; `#contact` is the homepage's form. tests/design/nav-anchors.test.ts
// checks both kinds resolve. The dated route lives on /about, so the legend no
// longer jumps to #timeline.
export const navigationItems: NavigationItem[] = [
  { label: 'Work', href: '/projects' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Hire', href: '/hire' },
  { label: 'Contact', href: '#contact' },
]
```

- [ ] **Step 4: Rewrite the legend**

Replace the whole of `components/site-legend.tsx` with:

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useTheme } from 'next-themes'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { heroContent, navigationItems, resumeUrl } from '@/lib/data'
import { BrandMark } from '@/components/brand-mark'
import { cn } from '@/lib/utils'

// A nav link at rest, on hover and as the current page (ink, a trail-red
// underline: more than colour), in the row and in the menu alike.
const LINK =
  'map-label inline-flex min-h-[44px] items-center whitespace-nowrap px-2 text-muted-strong transition-colors duration-[var(--dur-fast)] ease-[var(--ease-sharp)] hover:text-ink aria-[current=page]:text-ink aria-[current=page]:decoration-trail aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-[6px]'

export function SiteLegend() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  // The theme is unknown until mount; render a same-sized placeholder icon
  // before then so the server and client markup match.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = resolvedTheme !== 'light'
  // The label is gated on mount like the icon. React does not patch attribute
  // mismatches on hydration, so a theme-specific server label would stick.
  const themeLabel = !mounted ? 'Toggle theme' : isDark ? 'Switch to light theme' : 'Switch to dark theme'

  // Below 1024px the links fold into a menu: a <details> disclosure, so it
  // opens without JavaScript too. Script closes it on a route change, on
  // Escape (focus back on its summary), on a press outside, and when one of
  // its links is followed (a same-page #contact jump changes no route).
  const [menuOpen, setMenuOpen] = useState(false)
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const summaryRef = useRef<HTMLElement>(null)
  useEffect(() => setMenuOpen(false), [pathname])
  useEffect(() => {
    if (!menuOpen) return
    const onPointer = (e: PointerEvent) => {
      if (detailsRef.current && e.target instanceof Node && !detailsRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [menuOpen])
  const onMenuKey = (e: KeyboardEvent<HTMLDetailsElement>) => {
    if (e.key !== 'Escape' || !menuOpen) return
    setMenuOpen(false)
    summaryRef.current?.focus()
  }

  // Colours swap at once on a theme switch: transitions are held off for the
  // two frames the swap takes. This replaces next-themes'
  // disableTransitionOnChange, which also ran on every page load and cost two
  // full-page style recalculations and a forced one.
  // Far sections skip rendering (content-visibility: auto, .defer-render) and
  // stand in at an estimated height, so a jump to #contact measured against
  // the estimates lands far short of it. Before an in-page jump, render them
  // for real (.render-all) and lay out once; a jump that arrives with the URL
  // (a hash load, or "/#contact" from another page) is re-aimed the same way.
  useEffect(() => {
    const root = document.documentElement
    let timer: number | undefined
    const renderAll = () => {
      root.classList.add('render-all')
      void root.offsetHeight
      window.clearTimeout(timer)
      timer = window.setTimeout(() => root.classList.remove('render-all'), 1500)
    }
    const onClick = (e: MouseEvent) => {
      const link = e.target instanceof Element ? e.target.closest('a') : null
      if (link && link.hash && link.pathname === window.location.pathname) renderAll()
    }
    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.clearTimeout(timer)
      root.classList.remove('render-all')
    }
  }, [])

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    const target = id ? document.getElementById(id) : null
    if (!target) return
    const root = document.documentElement
    root.classList.add('render-all')
    let timer: number | undefined
    const frame = requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'auto' })
      timer = window.setTimeout(() => root.classList.remove('render-all'), 1500)
    })
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      root.classList.remove('render-all')
    }
  }, [pathname])

  const switchTheme = (next: 'light' | 'dark') => {
    const root = document.documentElement
    root.classList.add('theme-switching')
    setTheme(next)
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')))
  }

  const links = navigationItems.map((item) => ({
    label: item.label,
    href: item.href.startsWith('#') ? `/${item.href}` : item.href,
    current: !item.href.startsWith('#') && pathname.startsWith(item.href),
  }))

  return (
    <header className="pointer-events-none sticky top-3 z-40 px-3 sm:px-5">
      <div className="legend-glass pointer-events-auto relative mx-auto flex h-14 max-w-6xl items-center gap-3 rounded border border-line px-3 sm:gap-6 sm:px-5">
        <Link href="/" className="inline-flex min-h-[44px] shrink-0 items-center gap-2 text-ink">
          <BrandMark />
          <span className="map-label text-[0.9375rem] text-ink max-sm:sr-only">{heroContent.name}</span>
        </Link>

        {/* From 1024px: the row, as the legend has always looked. */}
        <nav aria-label="Primary" className="min-w-0 flex-1 max-lg:hidden">
          <ul className="flex gap-1 overflow-x-auto p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={l.current ? 'page' : undefined} className={LINK}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <a href={resumeUrl} className="map-label hidden min-h-[44px] items-center px-2 text-muted-strong hover:text-ink lg:inline-flex">
            Résumé
          </a>
          <details
            ref={detailsRef}
            open={menuOpen}
            onToggle={(e) => setMenuOpen(e.currentTarget.open)}
            onKeyDown={onMenuKey}
            className="lg:hidden"
          >
            <summary
              ref={summaryRef}
              className="map-label press inline-flex min-h-[44px] cursor-pointer list-none items-center gap-2 rounded-sm border border-line-strong px-3 text-ink [&::-webkit-details-marker]:hidden"
            >
              {menuOpen ? <X aria-hidden="true" className="h-4 w-4" /> : <Menu aria-hidden="true" className="h-4 w-4" />}
              Menu
            </summary>
            {/* Below the card, the card's full width. Opaque panel paper: one frosted surface only. */}
            <nav aria-label="Primary" className="absolute inset-x-0 top-full mt-2 rounded border border-line bg-panel p-2 shadow-overlay">
              <ul className="grid">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={l.current ? 'page' : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={cn(LINK, 'w-full')}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a href={resumeUrl} onClick={() => setMenuOpen(false)} className={cn(LINK, 'w-full')}>
                    Résumé
                  </a>
                </li>
              </ul>
            </nav>
          </details>
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
}
```

The two navs are never both in the accessibility tree: each is `display: none` at the other's widths.

- [ ] **Step 5: Run the tests**

Run: `npx vitest run tests/components/chrome.test.tsx tests/content/positioning.test.ts tests/components/homepage.test.tsx tests/design`
Expected: PASS, including `nav-anchors` (each route has its page), `sticky-header` (the jump fix is unchanged), `client-boundary` (still 8).

- [ ] **Step 6: Gates and commit**

```bash
git add lib/data.ts components/site-legend.tsx tests/components/chrome.test.tsx tests/content/positioning.test.ts tests/components/homepage.test.tsx
git commit -m "feat(legend): services, about and hire in the legend; a menu below 1024px with the résumé" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Homepage paths, the sitemap and the S4 guards

**Model:** Sonnet

**Files:**
- Modify: `components/sections/fork.tsx`, `components/sections/trailhead.tsx`, `lib/data.ts` (`sectionContent.fork`), `app/sitemap.ts`
- Modify: `tests/components/homepage.test.tsx`, `tests/content/cta-labels.test.ts`, `tests/content/sitemap.test.ts`, `tests/design/primary-button.test.ts`, `tests/design/grid.test.ts`, `tests/design/client-boundary.test.ts`
- Create: `tests/design/s4-surfaces.test.ts`

**Interfaces:**
- Consumes: `ctaLabels.viewServices` (Task 1); `servicePages`; the four pages.
- Produces: the fork's business link → `/services` ("See the services"), team link → `/hire`; the trailhead's secondary → `/hire`; the sitemap lists `/services`, the three service pages, `/hire` and `/about`.

- [ ] **Step 1: Write the failing tests**

In `tests/components/homepage.test.tsx`, inside `describe('Trailhead', …)`, replace

```ts
  it('offers both paths: Start a project, then Hire me for a role, both to #contact until S4', () => {
    const primary = html.search(/<a href="#contact" class="press button-primary">Start a project/)
    const secondary = html.search(/<a href="#contact" class="press button-secondary">Hire me for a role/)
    expect(primary).toBeGreaterThan(-1)
    expect(secondary).toBeGreaterThan(primary)
  })
```

with

```ts
  it('offers both paths: Start a project to the form, then Hire me for a role to /hire', () => {
    const primary = html.search(/<a href="#contact" class="press button-primary">Start a project/)
    const secondary = html.search(/<a [^>]*href="\/hire"[^>]*>Hire me for a role/)
    expect(primary).toBeGreaterThan(-1)
    expect(secondary).toBeGreaterThan(primary)
    expect(html.match(/<a [^>]*href="\/hire"[^>]*>/)?.[0]).toContain('class="press button-secondary"')
  })
```

Inside `describe('Fork', …)`, replace

```ts
  it('sends the business path to the contact form until S4 builds /services', () => {
    expect(cards[0]).toMatch(new RegExp(`<a href="#contact" class="press button-secondary">${fork.business.cta}`))
  })

  it('sends the team path to the contact form and the résumé until S4 builds /hire', () => {
    expect(cards[1]).toMatch(new RegExp(`<a href="#contact" class="press button-secondary">${fork.team.cta}`))
    expect(cards[1]).toContain(`href="${resumeUrl}"`)
    expect(cards[1]).toContain('(PDF, opens in a new tab)')
  })
```

with

```ts
  it('sends the business path to /services', () => {
    expect(cards[0].match(/<a [^>]*href="\/services"[^>]*>/)?.[0]).toContain('class="press button-secondary"')
    expect(cards[0]).toContain(`>${fork.business.cta}`)
    expect(cards[0]).not.toContain('href="#contact"')
  })

  it('sends the team path to /hire, the résumé beside it', () => {
    expect(cards[1].match(/<a [^>]*href="\/hire"[^>]*>/)?.[0]).toContain('class="press button-secondary"')
    expect(cards[1]).toContain(`>${fork.team.cta}`)
    expect(cards[1]).toContain(`href="${resumeUrl}"`)
    expect(cards[1]).toContain('(PDF, opens in a new tab)')
  })
```

In `tests/content/cta-labels.test.ts`, replace

```ts
    expect(sectionContent.fork.business.cta).toBe(ctaLabels.startProject)
```

with

```ts
    expect(sectionContent.fork.business.cta).toBe(ctaLabels.viewServices)
```

Replace the whole of `tests/content/sitemap.test.ts` with:

```ts
import { describe, expect, it } from 'vitest'
import sitemap from '@/app/sitemap'
import { FLAGSHIP_SLUGS } from '@/lib/case-studies'
import { projects, servicePages } from '@/lib/data'
import { SITE_URL } from '@/lib/site-metadata'

describe('sitemap', () => {
  const entries = sitemap()
  const urls = entries.map((e) => e.url)
  const pages = ['', '/services', ...servicePages.map((s) => `/services/${s.slug}`), '/hire', '/about', '/projects']

  it('lists the homepage, the services, hire, about, /projects and every project page once', () => {
    expect(urls).toHaveLength(pages.length + projects.length)
    for (const path of pages) expect(urls.filter((u) => u === `${SITE_URL}${path}`), path || '/').toHaveLength(1)
    for (const p of projects) expect(urls.filter((u) => u === `${SITE_URL}/projects/${p.slug}`)).toHaveLength(1)
  })

  it('ranks the paths from the fork above the inventory, and case studies above short pages', () => {
    const priority = (path: string) => entries.find((e) => e.url === `${SITE_URL}${path}`)!.priority!
    expect(priority('/services')).toBeGreaterThan(priority('/projects'))
    expect(priority('/hire')).toBeGreaterThan(priority('/projects'))
    expect(priority(`/projects/${FLAGSHIP_SLUGS[0]}`)).toBe(0.7)
    expect(priority('/projects/latag')).toBe(0.5)
  })
})
```

In `tests/design/primary-button.test.ts`, after the `app/not-found.tsx` line, add:

```ts
    expect(uses('app/services/page.tsx', '{ctaLabels.startProject}')).toContain('button-primary')
    expect(uses('app/services/[slug]/page.tsx', '{ctaLabels.startProject}')).toContain('button-primary')
    expect(uses('app/about/page.tsx', '{ctaLabels.startProject}')).toContain('button-primary')
    expect(uses('app/hire/page.tsx', '{ctaLabels.downloadResume}')).toContain('button-primary')
```

In `tests/design/grid.test.ts`, in the `users` array of "is used by every homepage section, the footer and the read pages", after `'app/projects/[slug]/page.tsx',` add:

```ts
      'app/services/page.tsx',
      'app/services/[slug]/page.tsx',
      'app/about/page.tsx',
      'app/hire/page.tsx',
      'components/ui/page-intro.tsx',
```

In `tests/design/client-boundary.test.ts`, after the "renders the homepage and /projects on the server" test, add:

```ts
  it('renders the S4 pages on the server and adds no client component', () => {
    for (const f of [
      join('app', 'services', 'page.tsx'),
      join('app', 'services', '[slug]', 'page.tsx'),
      join('app', 'about', 'page.tsx'),
      join('app', 'hire', 'page.tsx'),
      join('app', 'not-found.tsx'),
    ]) {
      expect(clientFiles).not.toContain(f)
    }
    expect(clientFiles, clientFiles.join('\n')).toHaveLength(8)
  })
```

Create `tests/design/s4-surfaces.test.ts`:

```ts
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// The surfaces S4 built wear the Isarog Trail Map only: no Portfolio 4.0 amber,
// edge codes, creases or rounded-xl paper; trail red only where the spec
// allows it (the primary button through its class, the current position).
const PAGES = ['app/services/page.tsx', 'app/services/[slug]/page.tsx', 'app/about/page.tsx', 'app/hire/page.tsx']
const S4 = [...PAGES, 'app/not-found.tsx', 'components/ui/page-intro.tsx', 'components/ui/work-history.tsx', 'components/site-legend.tsx']
const FOREIGN = /\b(?:text|bg|border|outline|ring|fill|stroke)-(?:accent|accent-plane|on-accent)\b|\bon-plane\b|\bedge-code\b|crease-|rounded-xl/
const TRAIL = /\b(?:bg|text|border|fill|stroke|ring|decoration)-trail\b/

describe('S4 surfaces', () => {
  it.each(S4)('%s uses only trail-map classes', (f) => {
    expect(readFileSync(f, 'utf8')).not.toMatch(FOREIGN)
  })

  it.each([...PAGES, 'components/ui/page-intro.tsx', 'components/ui/work-history.tsx'])('%s writes no trail red of its own', (f) => {
    expect(readFileSync(f, 'utf8')).not.toMatch(TRAIL)
  })

  it('keeps the legend’s trail red to the current page’s underline', () => {
    const src = readFileSync('components/site-legend.tsx', 'utf8').split('aria-[current=page]:decoration-trail').join('')
    expect(src).not.toMatch(TRAIL)
  })
})
```

Run `grep -P '\x08' tests/design/s4-surfaces.test.ts tests/content/sitemap.test.ts`; it must print nothing.

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/components/homepage.test.tsx tests/content/cta-labels.test.ts tests/content/sitemap.test.ts tests/design`
Expected: FAIL in `homepage` (both paths still `#contact`), `cta-labels` (business cta is "Start a project"), `sitemap` (no new routes). `s4-surfaces`, `primary-button`, `grid` and `client-boundary` may already pass: the pages were built to them.

- [ ] **Step 3: Repoint the fork's copy**

In `lib/data.ts`, inside `sectionContent`, replace

```ts
  // The two paths up from the trailhead (spec §5). Until S4 builds /services
  // and /hire, both lead to the contact form.
  fork: {
    eyebrow: 'The fork',
    title: 'Two ways up',
    business: {
      title: 'For your business',
      body: `Booking and payment sites for hotels, tours and restaurants, WooCommerce stores with ${gatewaySentence}, and AI automation for the work your team repeats.`,
      cta: ctaLabels.startProject,
    },
```

with

```ts
  // The two paths up from the trailhead (spec §5): a business to /services, a
  // hiring team to /hire.
  fork: {
    eyebrow: 'The fork',
    title: 'Two ways up',
    business: {
      title: 'For your business',
      body: `Booking and payment sites for hotels, tours and restaurants, WooCommerce stores with ${gatewaySentence}, and AI automation for the work your team repeats.`,
      cta: ctaLabels.viewServices,
    },
```

- [ ] **Step 4: Repoint the fork and the trailhead**

In `components/sections/fork.tsx`, add `import Link from 'next/link'` as the first import; replace the doc comment's second and third sentences ("Until S4 builds /services and /hire, both lead to the contact form (and the team path to the résumé); S4 repoints them to those pages.") with "The business path opens /services; the team path opens /hire, the résumé beside it."; then replace

```tsx
            {/* S4: /services. */}
            <a href="#contact" className="press button-secondary">
              {fork.business.cta}
              <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
            </a>
```

with

```tsx
            <Link href="/services" className="press button-secondary">
              {fork.business.cta}
              <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
            </Link>
```

and

```tsx
            {/* S4: /hire. */}
            <a href="#contact" className="press button-secondary">
              {fork.team.cta}
              <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
            </a>
```

with

```tsx
            <Link href="/hire" className="press button-secondary">
              {fork.team.cta}
              <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
            </Link>
```

In `components/sections/trailhead.tsx`, add `import Link from 'next/link'` after `import Image from 'next/image'`, then replace

```tsx
              {/* S4 points this at /hire. */}
              <a href="#contact" className="press button-secondary">
                {ctaLabels.hireForRole}
              </a>
```

with

```tsx
              <Link href="/hire" className="press button-secondary">
                {ctaLabels.hireForRole}
              </Link>
```

- [ ] **Step 5: List the new routes in the sitemap**

Replace the whole of `app/sitemap.ts` with:

```ts
import type { MetadataRoute } from 'next'
import { FLAGSHIP_SLUGS } from '@/lib/case-studies'
import { projects, servicePages } from '@/lib/data'
import { projectHref } from '@/lib/project-page'
import { SITE_URL } from '@/lib/site-metadata'

// Every page a visitor can reach: the homepage, the two paths from the fork
// (the services and /hire), /about, the index and one page per project. The
// paths rank above the inventory; case studies above the short pages.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/services`, changeFrequency: 'monthly', priority: 0.9 },
    ...servicePages.map((s) => ({
      url: `${SITE_URL}/services/${s.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    { url: `${SITE_URL}/hire`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/projects`, changeFrequency: 'monthly', priority: 0.8 },
    ...projects.map((p) => ({
      url: `${SITE_URL}${projectHref(p)}`,
      changeFrequency: 'monthly' as const,
      priority: FLAGSHIP_SLUGS.indexOf(p.slug) === -1 ? 0.5 : 0.7,
    })),
  ]
}
```

- [ ] **Step 6: Run the full suite**

Run: `npm test`
Expected: every file passes, including `primary-button` (the trailhead's `{ctaLabels.hireForRole}` now sits in a `<Link` tag, which `uses` finds), `cta-labels`, `s4-surfaces`, `client-boundary` (8).

- [ ] **Step 7: Gates and commit**

```bash
git add lib/data.ts components/sections/fork.tsx components/sections/trailhead.tsx app/sitemap.ts tests/components/homepage.test.tsx tests/content/cta-labels.test.ts tests/content/sitemap.test.ts tests/design/primary-button.test.ts tests/design/grid.test.ts tests/design/client-boundary.test.ts tests/design/s4-surfaces.test.ts
git commit -m "feat(home): the fork and the trailhead open /services and /hire; sitemap lists the new pages" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Sprint verification and docs

**Model:** Sonnet

**Files:**
- Modify: `CLAUDE.md`
- Modify: `.impeccable/surfaces/app-page-tsx.md` (keep LF line endings; `git add -f`)
- Modify: `tests/design/s4-surfaces.test.ts` (docs guard)

**Interfaces:**
- Consumes: everything above.
- Produces: `CLAUDE.md` matching the S4 code; the branch ready for the controller's browser and Lighthouse pass.

- [ ] **Step 1: Write the failing docs test**

Append to `tests/design/s4-surfaces.test.ts`:

```ts
describe('the docs', () => {
  it('describe the S4 pages, their content and the legend menu', () => {
    const doc = readFileSync('CLAUDE.md', 'utf8')
    for (const name of [
      'app/services/',
      'app/about/',
      'app/hire/',
      'page-intro',
      'work-history',
      'servicePages',
      'servicesPageContent',
      'aboutPageContent',
      'hirePageContent',
      'pagesUpdated',
      'Off the trail',
      'new-pages',
      's4-surfaces',
      'phone menu',
    ]) {
      expect(doc, name).toContain(name)
    }
    expect(doc).not.toContain('rebuilt in S4')
    expect(doc).not.toContain('lib/field-log.ts')
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/design/s4-surfaces.test.ts -t docs`
Expected: FAIL: `CLAUDE.md` has no `app/services/` and still says "rebuilt in S4".

- [ ] **Step 3: Update `CLAUDE.md`**

Read `CLAUDE.md`, then make these edits (each names the text it replaces):

Opening paragraph: replace "a homepage, a `/projects` index and\na page per project, two API routes" with "a homepage, a `/projects` index and\na page per project, `/services` with three service pages, `/about`, `/hire`, two API routes".

**Testing**, the `tests/content/` sentence: after "visible copy, " add "the new pages' copy (`new-pages`: 40-60 word opening answers, keywords, every proving project held to its own data), ".

**Testing**, the `grid` bullet: replace "`s3-surfaces` (the S3 files use no 4.0 amber, `edge-code` or creases)" with "`s3-surfaces` / `s4-surfaces` (the S3 and S4 files use no 4.0 amber, `edge-code` or creases; S4 pages write no trail red of their own)".

**Testing**, the `tests/components/` sentence: replace "(sections, project page, `/projects`, 404, status badge," with "(sections, project page, `/projects`, the services pages, `/about`, `/hire`, page intro and work history, the 404, status badge,".

**Project Structure**, replace

```text
app/                 App Router: layout.tsx (fonts, providers, chrome), page.tsx (homepage), not-found.tsx (the 404, rebuilt in S4), robots.ts, sitemap.ts (lists the homepage, /projects and every project page)
```

with

```text
app/                 App Router: layout.tsx (fonts, providers, chrome), page.tsx (homepage), not-found.tsx (the 404, "Off the trail": an empty map square and the route home), robots.ts, sitemap.ts (the homepage, /services and its pages, /hire, /about, /projects and every project page)
app/services/        /services (the three services, then the form) and services/[slug]/ (one page per service, statically generated: the answer, question-style sections, a comparison where the data holds one, the proving projects as plates, the form)
app/about/           /about (a Read page): story, the dated route, the six field photos, the four attributed quotes, résumé
app/hire/            /hire: résumé, email, stack by depth, at a glance, how I work, the full work history, the form
```

and add `page-intro` and `work-history` to the `components/ui/` line ("Primitives: grid.ts (SECTION), page-intro, work-history, status-badge, …").

In the `lib/display-status.ts, …` helpers line, delete "lib/field-log.ts, ". The block has no `lib/contours.ts` line today; after the `lib/geo.ts` line add:

```text
lib/contours.ts      Authored linework: the trailhead contours and trail, the segments between sections, the elevation ridge, the 404's square (offTrail)
```

**Content Changes**: add `servicePages`, `servicesPageContent`, `aboutPageContent`, `hirePageContent` and `pagesUpdated` to the list of typed arrays. After the paragraph "What counts as content: …" add:

```markdown
The S4 pages open with a self-contained 40-60 word answer in the third person
("Christian Raro is a …"), then first-person copy; `PageIntro` prints it with
the `pagesUpdated` date. Each service's `projectIds` are its proof: a project
named in its copy must be in the list, and its own data must support the
service (`tests/content/new-pages.test.ts`). Change a fact there only when the
data behind it changes.
```

**Styling**: after the "Section headings" bullet add:

```markdown
- Read pages (`/services`, a service page, `/about`, `/hire`) open with `PageIntro` (eyebrow, the h1, the answer in ink, the updated date, the actions) and end in `PlanTheRoute`, except `/about`, which ends in links. The 404's "You are here" dot is its only trail red.
```

**Client/Server Boundary**: replace "`components/site-legend.tsx` (theme toggle, in-page jump fix)," with "`components/site-legend.tsx` (theme toggle, the phone menu below 1024px (a `<details>` disclosure it closes on a route change, Escape, a press outside or a followed link), in-page jump fix),". Replace "`ProjectShot`, `ProjectPlate`, `LegendFilter`, `SurveyPlate`, `TrailLink` and `PlaceMap` are server components" with "`ProjectShot`, `ProjectPlate`, `LegendFilter`, `SurveyPlate`, `TrailLink`, `PlaceMap`, `PageIntro`, `WorkHistory` and every S4 page are server components". After "render `ImageLightbox`" add ", as does `/about` for its photos". After "`OwnProducts` and `ProjectHeader` render `LivePreview`" add "; the service pages and `/hire` render `PlanTheRoute`".

The file names no nav items today, so nothing else changes for the legend.

- [ ] **Step 4: Update the direction contract**

In `.impeccable/surfaces/app-page-tsx.md`:

Replace `related_targets: ["app/projects/page.tsx", "app/projects/[slug]/page.tsx", "app/not-found.tsx"]` with `related_targets: ["app/projects/page.tsx", "app/projects/[slug]/page.tsx", "app/services/page.tsx", "app/services/[slug]/page.tsx", "app/about/page.tsx", "app/hire/page.tsx", "app/not-found.tsx"]`.

Replace

```text
Scope: `/` (Persuade). `/projects`, `/projects/[slug]`, the S4 pages and the
404 inherit the world.
```

with

```text
Scope: `/` (Persuade). `/projects`, `/projects/[slug]` and the 404 inherit the
world; `/services` and its three pages are Persuade, `/about` is Read, `/hire`
is Persuade with Read sections, all in the same world.
```

Replace

```text
Action: Start a project (`#contact`). Second path: Hire me for a role
(`#contact` until `/hire` exists in S4).
```

with

```text
Action: Start a project (`#contact`). Second path: Hire me for a role
(`/hire`); the fork's business path opens `/services`.
```

Keep LF line endings (`tests/content/direction-contract.test.ts` reads the FINISH line exactly).

- [ ] **Step 5: Run the full suite and the gates**

Run: `npm test`, then the four gates.
Expected: all pass; `client-boundary` reports 8 client components; the build lists `○ /services`, `● /services/[slug]` (3 paths), `○ /about`, `○ /hire`.

- [ ] **Step 6: Commit and push**

```bash
git add CLAUDE.md tests/design/s4-surfaces.test.ts
git add -f .impeccable/surfaces/app-page-tsx.md
git commit -m "docs(pages): claude.md and the direction contract for the s4 pages" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push origin v5
```

- [ ] **Step 7: Hand off to the controller (the implementer stops here)**

Report the commit range and gate output. The controller, not the subagent, then runs:
- **Browser** on the keyless server (`.claude/launch.json`, `portfolio-keyless`, `http://127.0.0.1:3100`) at 1440×900 and 390×844, light and dark, plus 320 and 1024 wide for the legend: `/services`, the three service pages, `/about`, `/hire`, `/nope` (404), `/` (the fork and the trailhead). Check: the legend fits at 320 with no horizontal page scroll and the menu opens, lists five pages and the résumé, closes on Escape (focus on Menu), on a press outside and on a link; at 1024 the row shows with no menu; each comparison table scrolls inside its region at 390, never the page; photos open in the lightbox; plates on the service pages at one scale; the 404 square shows contours, the dashed route and the dot with its label clear of the lines.
- **Lighthouse mobile** on `/services`, `/services/full-stack-development`, `/services/wordpress-woocommerce`, `/services/ai-automation`, `/about`, `/hire` and the 404, including `label-in-name`, `target-size` and `scrollable-region-focusable`; recorded in `.superpowers/sdd/s4-lighthouse.md` (gitignored). Accessibility 100 and CLS ≤ 0.1 are the bar; anything below is a finding for the final review, not a silent fix.

---

## Self-review against the brief and the spec

- **Scope (master plan S4):** `servicePages` (slug, title, keyword, answer, sections, proving ids), `aboutPageContent`, `hirePageContent` with interfaces (Task 1); `/services`, `/services/[slug]` with `generateStaticParams` (Task 3); `/about` with story, timeline, six photos, four testimonials, résumé (Task 4); `/hire` (Task 5); 404 "Off the trail" (Task 6); Services, About, Hire in `navigationItems` (Task 7); trailhead secondary → `/hire` (Task 8). Tests: each service lists only real, supporting projects (Task 1); each page opens with a 40-60 word answer (Task 1 counts, Tasks 3-5 check it is the first paragraph after the h1); nav routes resolve (`nav-anchors`, Task 7; `generateStaticParams`, Task 3).
- **Carries:** 1 legend menu below 1024px, 320px fits, desktop row unchanged, client count 8 (Task 7, decision 2; Task 8 asserts 8). 2 résumé on phones in the menu (Task 7). 3 fork → `/services` and `/hire`, trailhead → `/hire`, labels through `ctaLabels` (Task 8, decision 9). 4 `aiProof` and `stack` used on `/hire`, `aiLine` deleted (Tasks 1, 5, decision 5). 5 photos, testimonials and timeline on `/about` from existing data, `ImageLightbox` for photos (Task 4). 6 404 on `SECTION`, `ctaLabels`, `ContourField` (Task 6). 7 sitemap lists the new routes; per-page `metadata` titles from the spec table; JSON-LD, llms, OG stay S5 (Tasks 3-5, 8, decision 10).
- **Spec §5/§6:** service pages list the proving projects and end in the form; `/hire` has stack by depth, work history, résumé, how he works (tests, CI, AI tooling), availability, GitHub and email; question-style h2s, short paragraphs, one honest comparison table where it fits, a visible last-updated date (Tasks 2, 3, 5). Four keywords covered: full-stack developer Philippines, web developer Naga City / Bicol (`/about`), AI automation engineer, WordPress / WooCommerce with PH gateways; stuffing capped at three uses per answer.
- **Copy risk:** every sentence in Task 1 carries a comment naming its source; tests forbid phones, streets, em-dashes and years claims, and tie counts to data (`numberWord`). Two places were written to avoid overclaiming: no "booking and payment" for restaurants (Graceland has neither), and BeachBus passes are "listed", not sold online (sales are paused).
- **Fixed constraints:** no new client component; no motion added (no numeric literals); trail red only on `.button-primary`, the legend's current underline and the 404 dot (`s4-surfaces`, `not-found` test); green untouched; content at full opacity.
- **Placeholder scan:** every code step carries the full code; edits to existing files quote the exact old text.
- **Type consistency:** `ServicePage`, `ServiceComparison`, `ServicesPageContent`, `AboutPageContent`, `HirePageContent`, `pagesUpdated`, `ctaLabels.viewServices`/`allServices`, `PageIntro({ eyebrow, title, answer, updated, children })`, `WorkHistory({ detailed })`, `formatIsoDate`, `offTrail`, `notFoundContent.here` are spelled the same in every task that uses them.

## Deferred to later sprints

- S5: Open Graph per page (today the layout's homepage OG rides along), `Service` and `ProfilePage` JSON-LD, the new pages in `/llms.txt`, `/llms-full.txt` and the chat prompt, OG cards, titles for `/projects` routes per the table.
- S6: a draw or rise on the 404 square and on the read pages' intros; trail segments between read-page sections; the legend menu's open motion; section-eyebrow audit (every `SectionHeading` carries one, a craft-floor note from S2); `ImageLightbox` off `accent`.
