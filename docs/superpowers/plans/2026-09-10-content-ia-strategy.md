# Portfolio 4.0 — Phase 1: Content & IA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `lib/data.ts` the true, single, band-organised source of every content claim the portfolio makes — 15 projects, corrected experience, trimmed skills, attached testimonials — and put automated tests behind every factual claim so it cannot silently drift again.

**Architecture:** All content lives in typed arrays in `lib/data.ts`, described by interfaces in `types/index.ts`. Anything that restates content — the AI chat system prompt, the résumé generator, the screenshot capture script — derives from `lib/data.ts` instead of keeping its own copy. A new Vitest suite under `tests/content/` encodes the spec's verification criteria as executable invariants and runs in CI.

**Tech Stack:** TypeScript 5 (strict) · Next.js 14 App Router · Vitest (new) · Node scripts (`.mjs`) · GitHub Actions

**Spec:** `docs/superpowers/specs/2026-09-10-content-ia-strategy-design.md`

---

## Global Constraints

Every task's requirements implicitly include this section.

- **Band vocabulary is exact and closed.** The only four values are `Products`, `Custom systems`, `Applications`, `Sites` — that capitalisation, those spellings. Bands name a kind of thing built, never a technology.
- **No years-of-experience claim** appears anywhere in content, copy, or the chat prompt. (Spec Q1.)
- **The proof band's numbers must be derivable from the data.** "Three products of my own. Fifteen projects shipped. Four payment gateways. One NFC card system." Tests enforce each one. If the inventory changes, the band changes with it. (Spec R3.)
- **No occurrence of `bubble`, `Bubble.io`, `muramart` or `Muramart`** in `lib/`, `app/`, `components/` or `scripts/`. Currently 14 occurrences across 3 files: `lib/data.ts` (8), `app/api/chat/route.ts` (5), `scripts/build-resume.mjs` (1).
- **No private contact details in the chat system prompt** — public email and social links only. No phone number, no home address, no birthday, no third party's name or job. Rule 8 of the prompt states this; keep it.
- **Both API routes must work with no environment variables set.** CI builds on a bare checkout with no secrets.
- **Code style:** named exports, no semicolons, single quotes, kebab-case filenames, `@/` import alias, `cn()` for class merging. Eyebrow labels are braced: `{'// label'}`.
- **Commits:** `type(scope): summary`, lowercase type. This phase uses `content:`, `data:`, `feat:`, `fix:`, `chore:`, `test:`. Work happens directly on `main`.
- **Never invent a fact.** Where a project's dates, contribution scope, or stack are not verifiable, omit the optional field rather than filling it. A thin entry is acceptable; a fabricated one is not. (Spec R2.)

---

## File Structure

| File | Responsibility | Task |
|------|----------------|------|
| `types/index.ts` | Every shared interface. Gains `ProjectBand`, `ProjectStatus`; `Project` gains `slug`/`band`/`status`/`dates`/`contribution`; `ExperienceItem` gains `concurrent`; `EducationItem` renames `graduationDate` → `dates`; `Recommendation` gains `projectId`; `GalleryImage` gains `caption` | 2, 4, 6, 7 |
| `lib/data.ts` | Single source of truth for all content | 1–7 |
| `lib/dates.ts` | **New.** Parses human date ranges into sortable timestamps. Pure, no imports from data | 4 |
| `lib/chat-context.ts` | **New.** Builds the AI assistant's portfolio context string from `lib/data.ts`. Extracted from the route so it is importable and testable | 8 |
| `app/api/chat/route.ts` | HTTP handling and Groq call only. Imports its prompt context | 8 |
| `app/projects/page.tsx` | Full project index, filtered by band | 2 |
| `components/sections/experience-section.tsx` | Renders the timeline using real parsed dates | 4 |
| `components/sections/skills-section.tsx` | Drops the dead `/tech-stack` link | 9 |
| `app/page.tsx` | Home composition; loses the credentials sidebar | 9 |
| `components/sections/credentials-sidebar.tsx` | **Deleted** | 9 |
| `app/tech-stack/page.tsx` | **Deleted** | 9 |
| `scripts/lib/read-projects.mjs` | **New.** Reads id/slug/title/live/status out of `lib/data.ts` for the `.mjs` scripts, so no script keeps its own copy of the inventory | 10 |
| `scripts/capture-screenshots.mjs` | Derives its targets from `read-projects.mjs` | 10 |
| `scripts/verify-urls.mjs` | **New.** Checks every live URL with a browser user-agent. Manual, never in CI | 10 |
| `scripts/build-resume.mjs` | Résumé PDF; abandoned-tooling references removed | 1 |
| `vitest.config.ts` | **New.** Test runner config with the `@/` alias | 1 |
| `tests/content/*.test.ts` | **New.** The spec's verification criteria as executable invariants | 1–10 |
| `CLAUDE.md` | Project instructions updated for the new commands and structure | 11 |

**Why `tests/` at the top level and not beside the source:** Next.js scans `app/` for routes and compiles what it reaches. Keeping test files out of `app/`, `lib/` and `components/` means `next build` never sees them and `next lint` never has to be reconfigured.

---

## Task 1: Content-invariant test harness and abandoned-tooling purge

Bubble.io and Muramart Holdings are removed as a content decision (spec §6), not a cleanup. This task removes them and installs the test harness that keeps them gone.

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/content/abandoned-tooling.test.ts`
- Modify: `package.json` (scripts + devDependency)
- Modify: `.github/workflows/ci.yml`
- Modify: `lib/data.ts` (delete two experience entries and one skill)
- Modify: `app/api/chat/route.ts` (5 lines)
- Modify: `scripts/build-resume.mjs` (1 line)

**Interfaces:**
- Consumes: nothing
- Produces: `npm test` runs Vitest against `tests/**/*.test.ts` with the `@/` alias resolving to the repo root. Every later task adds tests to `tests/content/`.

- [ ] **Step 1: Install Vitest**

```bash
npm install --save-dev vitest
```

- [ ] **Step 2: Create the test runner config**

Create `vitest.config.ts`:

```ts
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
})
```

- [ ] **Step 3: Add the test scripts**

In `package.json`, add to `"scripts"` after `"type-check"`:

```json
    "test": "vitest run",
    "test:watch": "vitest",
```

- [ ] **Step 4: Write the failing test**

Create `tests/content/abandoned-tooling.test.ts`:

```ts
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Bubble.io and Muramart Holdings were removed from the portfolio as a content
// decision (spec 2026-09-10 §6), not a cleanup. These three files are the ones
// that carried them; this test keeps them from creeping back.
const SOURCES = [
  'lib/data.ts',
  'app/api/chat/route.ts',
  'scripts/build-resume.mjs',
]

describe('abandoned tooling', () => {
  it.each(SOURCES)('%s mentions neither Bubble.io nor Muramart', (file) => {
    const contents = readFileSync(file, 'utf8')
    expect(contents).not.toMatch(/bubble/i)
    expect(contents).not.toMatch(/muramart/i)
  })
})
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — all three cases fail, reporting matches in `lib/data.ts`, `app/api/chat/route.ts` and `scripts/build-resume.mjs`.

- [ ] **Step 6: Remove the two Muramart experience entries from `lib/data.ts`**

Delete both objects from the `experience` array in their entirety — the one with `id: 'muramart-bubble'` and the one with `id: 'muramart-ojt'`. The array is left with exactly two entries, `ocs-webdev` and `enjoy-it`, in that order.

- [ ] **Step 7: Remove the Bubble.io skill from `lib/data.ts`**

Delete this single line from the `skills` array:

```ts
  { id: 'bubble', name: 'Bubble.io', icon: 'bubble', category: 'Tools & DevOps' },
```

- [ ] **Step 8: Remove the Bubble.io and Muramart lines from `app/api/chat/route.ts`**

Delete these three lines outright:

```
- Bubble.io development
- Junior Bubble.io Developer at Muramart Holdings Inc., Naga City (Aug 2023 – Sep 2024): Full stack web & mobile apps via Bubble.io, UI/UX design, backend workflows
- OJT (240 hrs) at Muramart Holdings Inc. (July–Aug 2023): Bubble.io workshops, hands-on development
```

Delete this line from `DETAILED PROJECT HISTORY`:

```
- Muramart App (July 2023–Sep 2024): Bubble.io full stack web & mobile — muramartv2.com + Google Play
```

And change the frameworks line from:

```
- Frameworks: Flutter, WordPress, Material-UI, Bubble.io, Next.js, Laravel
```

to:

```
- Frameworks: Flutter, WordPress, Material-UI, Next.js, Laravel
```

- [ ] **Step 9: Remove Bubble.io from `scripts/build-resume.mjs`**

Change:

```html
    <li><b>CMS &amp; E-commerce:</b> WordPress (GeneratePress, GenerateBlocks Pro), WooCommerce, Bubble.io</li>
```

to:

```html
    <li><b>CMS &amp; E-commerce:</b> WordPress (GeneratePress, GenerateBlocks Pro), WooCommerce</li>
```

- [ ] **Step 10: Run the test to verify it passes**

Run: `npm test`
Expected: PASS — 3 passed.

- [ ] **Step 11: Add the test step to CI**

In `.github/workflows/ci.yml`, insert between the `Lint` and `Build` steps:

```yaml
      - name: Test
        run: npm test
```

- [ ] **Step 12: Verify the whole gate still passes**

Run: `npm run type-check && npm run lint && npm test && npm run build`
Expected: all four succeed.

- [ ] **Step 13: Commit**

```bash
git add vitest.config.ts tests package.json package-lock.json .github/workflows/ci.yml lib/data.ts app/api/chat/route.ts scripts/build-resume.mjs
git commit -m "content: remove Bubble.io and Muramart; add content-invariant tests

Bubble.io and the two Muramart Holdings roles are removed as a positioning
decision, not a cleanup (spec 2026-09-10 §6). Adds Vitest and a test that
keeps the references from returning, wired into CI.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Band taxonomy — types, surviving inventory, and the projects filter

Replaces the incoherent five-`category` filter with the four-band taxonomy, removes the three employer-domain projects, and corrects two URLs and one title. Removing `Project.category` breaks `app/projects/page.tsx`, so the filter changes in this same task — that is the task boundary.

**Files:**
- Modify: `types/index.ts`
- Modify: `lib/data.ts` (`projects` array)
- Modify: `app/projects/page.tsx`
- Create: `tests/content/projects.test.ts`

**Interfaces:**
- Consumes: the Vitest harness from Task 1
- Produces:
  - `export type ProjectBand = 'Products' | 'Custom systems' | 'Applications' | 'Sites'`
  - `export type ProjectStatus = 'live' | 'early-access' | 'auth-gated' | 'ua-gated' | 'internal'`
  - `Project` with required `slug: string`, `band: ProjectBand`, `status: ProjectStatus`; optional `dates?: string`, `contribution?: string`; **no** `category`
  - `export const BAND_ORDER: readonly ProjectBand[]` in `types/index.ts`, the canonical display order

- [ ] **Step 1: Write the failing test**

Create `tests/content/projects.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { projects } from '@/lib/data'
import { BAND_ORDER } from '@/types'

const REMOVED_IDS = ['azalea-main', 'fish2go', 'online-creative-solutions']

describe('project taxonomy', () => {
  it('gives every project exactly one band from the closed vocabulary', () => {
    for (const project of projects) {
      expect(BAND_ORDER).toContain(project.band)
    }
  })

  it('has unique, kebab-case slugs', () => {
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })

  it('has unique ids', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('lists projects grouped in band order', () => {
    const indexes = projects.map((p) => BAND_ORDER.indexOf(p.band))
    const sorted = [...indexes].sort((a, b) => a - b)
    expect(indexes).toEqual(sorted)
  })

  it('no longer carries the employer-domain projects', () => {
    const ids = projects.map((p) => p.id)
    for (const removed of REMOVED_IDS) {
      expect(ids).not.toContain(removed)
    }
  })

  it('points Graceland at its production domain, not the staging host', () => {
    const graceland = projects.find((p) => p.id === 'graceland')
    expect(graceland?.links.live).toBe('https://graceland.ph')
  })

  it('points Giya at giya.ph', () => {
    const giya = projects.find((p) => p.slug === 'giya')
    expect(giya?.links.live).toBe('https://giya.ph')
  })

  it('uses the live brand name Review Masters Bicol', () => {
    const renamed = projects.find((p) => p.slug === 'review-masters-bicol')
    expect(renamed?.title).toBe('Review Masters Bicol')
  })

  it('never carries an empty optional content field', () => {
    for (const project of projects) {
      if ('dates' in project) expect(project.dates).not.toBe('')
      if ('contribution' in project) expect(project.contribution).not.toBe('')
    }
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/content/projects.test.ts`
Expected: FAIL — `BAND_ORDER` is not exported from `@/types`.

- [ ] **Step 3: Add the taxonomy types**

In `types/index.ts`, replace the whole `Project` interface with:

```ts
export type ProjectBand = 'Products' | 'Custom systems' | 'Applications' | 'Sites'

// Canonical display order. `Applications` and `Sites` are shown together on the
// home page under "Client work"; they stay separate on /projects, where the
// distinction is what a visitor is browsing by.
export const BAND_ORDER: readonly ProjectBand[] = [
  'Products',
  'Custom systems',
  'Applications',
  'Sites',
]

// Drives how a project can be previewed. Three of fifteen cannot be embedded
// live: two reject non-browser user-agents and one sits behind a login.
export type ProjectStatus =
  | 'live'
  | 'early-access'
  | 'auth-gated'
  | 'ua-gated'
  | 'internal'

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  band: ProjectBand;
  image: string;
  technologies: string[];
  links: {
    live?: string;
    github?: string;
    appStore?: string;
    playStore?: string;
    download?: string;
  };
  status: ProjectStatus;
  /** Human date range, e.g. 'March – April 2025'. Omitted where unverified. */
  dates?: string;
  /** What Christian personally built. Written in Phase 3; omitted until then. */
  contribution?: string;
  featured?: boolean;
}
```

- [ ] **Step 4: Replace the projects array**

In `lib/data.ts`, replace the entire `projects` array with:

```ts
export const projects: Project[] = [
  // --- Products ------------------------------------------------------------
  {
    id: 'iskotify',
    slug: 'iskotify',
    title: 'Iskotify',
    description: 'Scholarship and exam-prep platform for Filipino students: scholarship tracking with deadline reminders, AI-generated flashcards with spaced repetition for UPCAT/ACET/DCAT, and an AI study companion, "Kuya Baw."',
    band: 'Products',
    image: '/assets/images/projects/iskotify.png',
    technologies: ['Next.js', 'React', 'Supabase', 'AI', 'PWA'],
    links: { live: 'https://iskotify.ph' },
    status: 'early-access',
    dates: 'June 2026',
    featured: true,
  },
  {
    id: 'naga-perks-giya-app',
    slug: 'giya',
    title: 'Giya',
    description: 'Receipt-scanning rewards app for Philippine food and retail: customers scan the receipts they already get, earn points at partner venues and redeem real rewards, with business and admin modules behind it.',
    band: 'Products',
    image: '/assets/images/projects/naga-perks-giya-app.png',
    technologies: ['Next.js', 'Node.js', 'Tailwind CSS', 'Supabase', 'PWA'],
    links: { live: 'https://giya.ph' },
    status: 'live',
    featured: true,
  },

  // --- Applications --------------------------------------------------------
  {
    id: 'aman-webapp',
    slug: 'aman-group-web-app',
    title: 'Aman Group Web App',
    description: 'Full-stack Next.js app for a real estate company: projects and properties showcase, visit scheduling, loan calculator, and broker referral links.',
    band: 'Applications',
    image: '/assets/images/projects/aman-webapp.png',
    technologies: ['Next.js', 'React', 'Vercel', 'Supabase', 'Upstash'],
    links: { live: 'https://amangroup-webapp.enjoyrealty.com' },
    status: 'live',
    dates: 'March – April 2025',
    featured: true,
  },

  // --- Sites ---------------------------------------------------------------
  {
    id: 'graceland',
    slug: 'graceland-bicolano-dining',
    title: 'Graceland Bicolano Dining',
    description: 'Website for a heritage Bicolano restaurant chain (est. 1976): menu showcase, branch locations, brand story, and promos.',
    band: 'Sites',
    image: '/assets/images/projects/graceland.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks', 'SEO'],
    links: { live: 'https://graceland.ph' },
    status: 'live',
    dates: 'May 2026',
    featured: true,
  },
  {
    id: 'elnido',
    slug: 'el-nido-guide-ph',
    title: 'El Nido Guide PH',
    description: 'WooCommerce storefront and booking site for an El Nido tour operator, with a custom child theme covering product add-ons, invoice printing and PayPal payments.',
    band: 'Sites',
    image: '/assets/images/projects/elnido.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks', 'WooCommerce', 'PayPal'],
    links: { live: 'https://elnidoguide.ph' },
    status: 'live',
    dates: 'May – July 2025',
    featured: false,
  },
  {
    id: 'beachbus',
    slug: 'beachbus-palawan',
    title: 'BeachBus Palawan',
    description: 'Website and WooCommerce storefront for a Palawan shuttle operator, selling digital products with integrated payments.',
    band: 'Sites',
    image: '/assets/images/projects/beachbus.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks', 'WooCommerce', 'Payments'],
    links: { live: 'https://beachbus.ph' },
    status: 'live',
    dates: 'June – August 2025',
    featured: true,
  },
  {
    id: 'upcat-review-plus',
    slug: 'review-masters-bicol',
    title: 'Review Masters Bicol',
    description: 'Review centre website with online reservation powered by WooCommerce and an event entry system using QR codes.',
    band: 'Sites',
    image: '/assets/images/projects/upcat-review-plus.png',
    technologies: ['WordPress', 'WooCommerce', 'QR Code', 'Online Reservation'],
    links: { live: 'https://upcatreviewplus.com' },
    status: 'live',
    featured: false,
  },
  {
    id: 'downtown-district-hotel',
    slug: 'downtown-district-hotel',
    title: 'Downtown District Hotel',
    description: 'Hotel website with room booking, amenities showcase, and contact management.',
    band: 'Sites',
    image: '/assets/images/projects/downtown-district-hotel.png',
    technologies: ['WordPress', 'Booking System'],
    links: { live: 'https://downtowndistricthotel.ph' },
    status: 'ua-gated',
    featured: false,
  },
]
```

Note the two content corrections carried here: Giya's description now matches what the product actually is today (receipt-scanning rewards), replacing the stale "Naga Perks / hyperlocal discovery" copy; and `El Nido Guide PH` loses its `featured` flag so the featured set lands on exactly six once Latag is added in Task 3.

- [ ] **Step 5: Switch the projects page filter to bands**

In `app/projects/page.tsx`, replace the imports and the two `useMemo` blocks. The full new file:

```tsx
"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { projects } from "@/lib/data"
import { BAND_ORDER } from "@/types"
import { ProjectCard } from "@/components/ui/project-card"
import { staggerContainer, staggerItem } from "@/components/ui/reveal"

export default function ProjectsPage() {
  const [selectedBand, setSelectedBand] = useState<string>("All")

  // Only offer a band that actually has something in it.
  const bands = useMemo(() => {
    const present = BAND_ORDER.filter((band) =>
      projects.some((p) => p.band === band)
    )
    return ["All", ...present]
  }, [])

  const filteredProjects = useMemo(() => {
    if (selectedBand === "All") return projects
    return projects.filter((p) => p.band === selectedBand)
  }, [selectedBand])

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
      <p className="eyebrow mb-2">{'// portfolio'}</p>
      <h1 className="font-display text-3xl font-semibold tracking-tight mb-2">All Projects</h1>
      <p className="text-muted-foreground mb-8">Products I own, custom systems, and client work</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {bands.map((band) => (
          <button
            key={band}
            onClick={() => setSelectedBand(band)}
            aria-pressed={selectedBand === band}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedBand === band
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground border border-border hover:bg-muted/80"
            }`}
          >
            {band}
          </button>
        ))}
      </div>

      <motion.div
        key={selectedBand}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {filteredProjects.map((project) => (
          <motion.div key={project.id} variants={staggerItem}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>

      {filteredProjects.length === 0 && (
        <p className="text-center text-muted-foreground py-10">
          No projects in this group.
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test -- tests/content/projects.test.ts`
Expected: PASS — 9 passed.

- [ ] **Step 7: Verify types and build**

Run: `npm run type-check && npm run lint && npm run build`
Expected: all three succeed. If `type-check` reports a residual `category` reference, fix that consumer — nothing else should be reading it.

- [ ] **Step 8: Commit**

```bash
git add types/index.ts lib/data.ts app/projects/page.tsx tests/content/projects.test.ts
git commit -m "data: replace category filter with the four-band project taxonomy

Bands name a kind of thing built, never a technology, so a visitor can predict
which group anything lands in. Drops the three employer-domain entries, moves
Graceland off its cPanel staging URL, moves Giya to giya.ph, and renames UPCAT
Review Plus to its live brand, Review Masters Bicol.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Add the seven new project entries

Takes the inventory from 8 to 15. Descriptions below are drawn from each site's own published metadata and headings, verified 2026-09-10 — not invented.

**On the OCS WP Control Panel and spec Q2:** the entry ships here with its public URL only. That URL serves a login screen, and the product name is already public on it, so listing it discloses nothing. Spec Q2 — clearance from Online Creative Solutions — gates **screenshots of the authenticated interior**, which are a Phase 3 deliverable. Do not capture or publish interior screenshots until Christian confirms.

**Files:**
- Modify: `lib/data.ts` (`projects` array)
- Modify: `tests/content/projects.test.ts`

**Interfaces:**
- Consumes: `Project`, `ProjectBand`, `ProjectStatus`, `BAND_ORDER` from Task 2
- Produces: `projects` of length 15 — Products 3, Custom systems 2, Applications 1, Sites 9

- [ ] **Step 1: Write the failing test**

Append to `tests/content/projects.test.ts`:

```ts
describe('project inventory', () => {
  it('holds exactly fifteen projects', () => {
    expect(projects).toHaveLength(15)
  })

  it('distributes them across the four bands as designed', () => {
    const count = (band: string) => projects.filter((p) => p.band === band).length
    expect(count('Products')).toBe(3)
    expect(count('Custom systems')).toBe(2)
    expect(count('Applications')).toBe(1)
    expect(count('Sites')).toBe(9)
  })

  it('carries the full inventory by slug', () => {
    expect(projects.map((p) => p.slug)).toEqual([
      'iskotify',
      'giya',
      'latag',
      'beachbus-nfc-card-system',
      'ocs-wp-control-panel',
      'aman-group-web-app',
      'graceland-bicolano-dining',
      'el-nido-guide-ph',
      'beachbus-palawan',
      'review-masters-bicol',
      'acad1-review-center',
      'downtown-district-hotel',
      'azalea-baguio',
      'azalea-boracay',
      'aralabroad',
    ])
  })

  it('features exactly six projects', () => {
    expect(projects.filter((p) => p.featured)).toHaveLength(6)
  })

  it('gives every project a live link unless it is internal', () => {
    for (const project of projects) {
      if (project.status === 'internal') {
        expect(project.links.live).toBeUndefined()
      } else {
        expect(project.links.live).toMatch(/^https:\/\//)
      }
    }
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/content/projects.test.ts`
Expected: FAIL — "holds exactly fifteen projects" reports 8.

- [ ] **Step 3: Add Latag to the Products group**

In `lib/data.ts`, insert immediately after the Giya entry, still inside the Products comment block:

```ts
  {
    id: 'latag',
    slug: 'latag',
    title: 'Latag',
    description: 'Offline-first inventory and storefront tool for Philippine ukay-ukay resellers: catalogue every piece once, then share a single link buyers can browse. Free tier with a paid Pro storefront.',
    band: 'Products',
    image: '/assets/images/projects/latag.png',
    technologies: ['Next.js', 'React', 'Tailwind CSS'],
    links: { live: 'https://latag.vercel.app' },
    status: 'live',
    featured: true,
  },
```

- [ ] **Step 4: Add the Custom systems group**

Insert after the Latag entry and before the `// --- Applications ---` comment:

```ts
  // --- Custom systems ------------------------------------------------------
  {
    id: 'beachbus-nfc',
    slug: 'beachbus-nfc-card-system',
    title: 'BeachBus NFC Card System',
    description: 'Internal NFC card system built for BeachBus Palawan, the Palawan shuttle operator whose website I also built.',
    band: 'Custom systems',
    image: '',
    technologies: ['NFC'],
    links: {},
    status: 'internal',
    featured: false,
  },
  {
    id: 'ocs-wp-control',
    slug: 'ocs-wp-control-panel',
    title: 'OCS WP Control Panel',
    description: 'Internal tool for Online Creative Solutions to manage, secure, and report on client WordPress sites from one dashboard.',
    band: 'Custom systems',
    image: '/assets/images/projects/ocs-wp-control.png',
    technologies: ['Next.js', 'WordPress'],
    links: { live: 'https://ocs-wp-control.vercel.app' },
    status: 'auth-gated',
    featured: false,
  },
```

`beachbus-nfc` deliberately carries one technology, no URL and an empty `image`. `ProjectCard` initialises its error state from `!project.image`, so an empty string renders the titled fallback tile rather than a broken image. The full write-up is a Phase 3 content dependency owed by Christian; do not pad it.

- [ ] **Step 5: Add the four new Sites**

Insert `acad1` immediately after the `upcat-review-plus` entry:

```ts
  {
    id: 'acad1',
    slug: 'acad1-review-center',
    title: 'ACAD1 Review Center',
    description: 'Entrance-test review centre with nine branches across Luzon: programme tiers and class schedules per branch, plus online reservation with a downpayment through WooCommerce and PayMongo.',
    band: 'Sites',
    image: '/assets/images/projects/acad1.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks', 'WooCommerce', 'PayMongo'],
    links: { live: 'https://acad1.ph' },
    status: 'live',
    dates: 'November – December 2024',
    featured: false,
  },
```

And add the remaining three after `downtown-district-hotel`, so the array ends:

```ts
  {
    id: 'azalea-baguio',
    slug: 'azalea-baguio',
    title: 'Azalea Baguio',
    description: 'Production website for Azalea Hotels & Residences Baguio: rooms and serviced residences, amenities, and seasonal packages for the City of Pines property.',
    band: 'Sites',
    image: '/assets/images/projects/azalea-baguio.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks'],
    links: { live: 'https://azaleabaguio.com' },
    status: 'live',
    featured: false,
  },
  {
    id: 'azalea-boracay',
    slug: 'azalea-boracay',
    title: 'Azalea Boracay',
    description: 'Production website for Azalea Hotels & Residences Boracay: hotel rooms and serviced holiday apartments a few steps from Station 2.',
    band: 'Sites',
    image: '/assets/images/projects/azalea-boracay.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks'],
    links: { live: 'https://azaleaboracay.com' },
    status: 'live',
    featured: false,
  },
  {
    id: 'aralabroad',
    slug: 'aralabroad',
    title: 'AralAbroad',
    description: 'Independent study-abroad guidance for Filipino students — visa steps, real costs in pesos, scholarships, and reviews of the agencies themselves — built for a site that deliberately is not an agency.',
    band: 'Sites',
    image: '/assets/images/projects/aralabroad.png',
    technologies: ['WordPress', 'GeneratePress', 'GenerateBlocks'],
    links: { live: 'https://aralabroad.com' },
    status: 'ua-gated',
    featured: false,
  },
]
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test -- tests/content/projects.test.ts`
Expected: PASS — 14 passed. The band-order test from Task 2 also confirms the new entries sit in the right groups.

- [ ] **Step 7: Verify the build**

Run: `npm run type-check && npm run lint && npm run build`
Expected: all three succeed. Six of the new image paths do not exist yet; `ProjectCard` falls back per project, and `next build` does not resolve `/public` paths at build time, so this is expected and non-blocking. Task 10 captures them.

- [ ] **Step 8: Commit**

```bash
git add lib/data.ts tests/content/projects.test.ts
git commit -m "content: add the seven new projects, taking the inventory to fifteen

Adds Latag, the BeachBus NFC card system, the OCS WP Control Panel, ACAD1
Review Center, both Azalea production properties, and AralAbroad. Descriptions
are drawn from each site's own published metadata, verified 2026-09-10.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Experience and education — real dates, concurrency, strict order

The timeline currently sorts on the first four-digit number it finds in a date string, producing 2024, 2025, 2024, 2023, 2023, 2020, 2018. It also renders two junior-high-school strands at the same visual weight as professional employment. Both are fixed here. The visual grouping and legend are Phase 2; correct ordering is a factual matter and belongs in this phase.

**Files:**
- Create: `lib/dates.ts`
- Create: `tests/content/dates.test.ts`
- Create: `tests/content/experience.test.ts`
- Modify: `types/index.ts` (`ExperienceItem`, `EducationItem`)
- Modify: `lib/data.ts` (`experience`, `education`)
- Modify: `components/sections/experience-section.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks
- Produces:
  - `export function parseDateToken(token: string, now?: Date): number` — one date token to epoch ms; `Present`/`current`/`now` resolve to `now`
  - `export function endOfRange(dates: string, now?: Date): number` — the **end** of a human range, which is the sort key for recency
  - `ExperienceItem.concurrent?: string` — a note rendered beside the role
  - `EducationItem.dates: string` — renamed from `graduationDate`, now holding a range

- [ ] **Step 1: Write the failing date-parsing test**

Create `tests/content/dates.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { endOfRange, parseDateToken } from '@/lib/dates'

const NOW = new Date('2026-09-10T00:00:00Z')

describe('parseDateToken', () => {
  it('parses a month and year', () => {
    expect(parseDateToken('August 2023')).toBe(Date.UTC(2023, 7, 1))
  })

  it('parses an abbreviated month', () => {
    expect(parseDateToken('Nov 2024')).toBe(Date.UTC(2024, 10, 1))
  })

  it('parses a bare year as January', () => {
    expect(parseDateToken('2024')).toBe(Date.UTC(2024, 0, 1))
  })

  it('resolves Present to now', () => {
    expect(parseDateToken('Present', NOW)).toBe(NOW.getTime())
  })
})

describe('endOfRange', () => {
  it('takes the end of an en-dashed range', () => {
    expect(endOfRange('March 2025 – August 2025')).toBe(Date.UTC(2025, 7, 1))
  })

  it('takes the end of a hyphenated range', () => {
    expect(endOfRange('July 2023 - August 2023')).toBe(Date.UTC(2023, 7, 1))
  })

  it('handles a single date with no range', () => {
    expect(endOfRange('June 2026')).toBe(Date.UTC(2026, 5, 1))
  })

  it('ranks an ongoing role above a finished later one', () => {
    expect(endOfRange('November 2024 – Present', NOW)).toBeGreaterThan(
      endOfRange('March 2025 – August 2025', NOW)
    )
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- tests/content/dates.test.ts`
Expected: FAIL — cannot resolve `@/lib/dates`.

- [ ] **Step 3: Write `lib/dates.ts`**

```ts
// Portfolio dates are written for humans ('November 2024 – Present'), so they
// need parsing before they can be sorted. The previous implementation took the
// first four-digit number in the string, which sorted an ongoing role by its
// start year and produced 2024, 2025, 2024, 2023 in the rendered timeline.

const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  jan: 0, feb: 1, mar: 2, apr: 3, jun: 5, jul: 6,
  aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11,
}

/**
 * Convert a single date token to epoch milliseconds.
 * 'Present', 'current' and 'now' resolve to `now`. An unparseable token
 * returns 0, which sorts last rather than throwing.
 */
export function parseDateToken(token: string, now: Date = new Date()): number {
  const cleaned = token.trim()
  if (/present|current|now/i.test(cleaned)) return now.getTime()

  const match = cleaned.match(/([A-Za-z]+)?\s*(\d{4})/)
  if (!match) return 0

  const monthName = match[1]
  const year = Number(match[2])
  const month = monthName ? MONTHS[monthName.toLowerCase()] ?? 0 : 0
  return Date.UTC(year, month, 1)
}

/**
 * The sort key for a human date range is its END — that is what "most recent"
 * means. Splits on en dash, em dash or hyphen.
 */
export function endOfRange(dates: string, now: Date = new Date()): number {
  const parts = dates.split(/\s*[–—-]\s*/)
  return parseDateToken(parts[parts.length - 1], now)
}
```

- [ ] **Step 4: Run the date tests to verify they pass**

Run: `npm test -- tests/content/dates.test.ts`
Expected: PASS — 8 passed.

- [ ] **Step 5: Write the failing experience test**

Create `tests/content/experience.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { education, experience } from '@/lib/data'
import { endOfRange } from '@/lib/dates'

describe('experience', () => {
  it('holds exactly the two professional roles', () => {
    expect(experience.map((e) => e.id)).toEqual(['ocs-webdev', 'enjoy-it'])
  })

  it('labels the concurrent role rather than hiding the overlap', () => {
    const enjoy = experience.find((e) => e.id === 'enjoy-it')
    expect(enjoy?.concurrent).toBeTruthy()
    expect(enjoy?.concurrent).toContain('Online Creative Solutions')
  })

  it('sorts strictly descending by the end of each range', () => {
    const keys = experience.map((e) => endOfRange(e.dates))
    const sorted = [...keys].sort((a, b) => b - a)
    expect(keys).toEqual(sorted)
  })

  it('claims no years-of-experience figure anywhere in the entries', () => {
    const blob = JSON.stringify(experience)
    expect(blob).not.toMatch(/\d+\+?\s*years? of experience/i)
  })
})

describe('education', () => {
  it('carries only the degree, not the high-school strands', () => {
    expect(education).toHaveLength(1)
    expect(education[0].degree).toBe('B.S. in Computer Science')
  })

  it('spans the employment gap between the Muramart roles and OCS', () => {
    expect(endOfRange(education[0].dates)).toBe(Date.UTC(2024, 6, 1))
  })
})
```

- [ ] **Step 6: Run it to verify it fails**

Run: `npm test -- tests/content/experience.test.ts`
Expected: FAIL — `concurrent` does not exist on `ExperienceItem`, and `education[0].dates` is undefined.

- [ ] **Step 7: Update the types**

In `types/index.ts`, replace `ExperienceItem` and `EducationItem`:

```ts
export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  dates: string;
  location: string;
  responsibilities: string[];
  /**
   * Note shown beside a role that overlapped another. Holding a full-time
   * corporate role while shipping agency client work is capacity evidence for
   * a freelance-primary audience, so it is stated rather than hidden.
   */
  concurrent?: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  /** Human date range, e.g. 'August 2020 – July 2024'. */
  dates: string;
  honors?: string;
}
```

- [ ] **Step 8: Update the data**

In `lib/data.ts`, add the `concurrent` note to the Enjoy Realty entry — its object becomes:

```ts
  {
    id: 'enjoy-it',
    title: 'IT Staff / Web Developer',
    company: 'Enjoy Realty and Development Corporation',
    dates: 'March 2025 – August 2025',
    location: 'Naga City, Camarines Sur',
    concurrent: 'Full-time, concurrent with Online Creative Solutions',
    responsibilities: [
      'Developed full‑stack web applications',
      'Built and maintained WordPress sites',
      'Managed backend workflows and API integrations',
      'Graphic design support',
      'Hardware, network, and software maintenance',
    ],
  },
```

And replace the whole `education` array:

```ts
export const education: EducationItem[] = [
  {
    school: 'Bicol University Polangui Campus',
    degree: 'B.S. in Computer Science',
    dates: 'August 2020 – July 2024',
  },
]
```

- [ ] **Step 9: Fix the timeline sort and render the concurrency note**

In `components/sections/experience-section.tsx`, replace the imports, the `TimelineEntry` type, `parseYear` and `buildTimeline` with:

```tsx
import { experience, education } from '@/lib/data'
import { endOfRange } from '@/lib/dates'
import { ExperienceItem, EducationItem } from '@/types'

type TimelineEntry = {
  type: 'work' | 'education'
  title: string
  subtitle: string
  note?: string
  date: string
  sortKey: number
}

function buildTimeline(): TimelineEntry[] {
  const entries: TimelineEntry[] = []

  experience.forEach((item: ExperienceItem) => {
    entries.push({
      type: 'work',
      title: item.title,
      subtitle: item.company,
      note: item.concurrent,
      date: item.dates.replace(/\s*–\s*/g, ' – '),
      sortKey: endOfRange(item.dates),
    })
  })

  education.forEach((item: EducationItem) => {
    entries.push({
      type: 'education',
      title: item.degree,
      subtitle: item.school,
      date: item.dates,
      sortKey: endOfRange(item.dates),
    })
  })

  return entries.sort((a, b) => b.sortKey - a.sortKey)
}
```

Then, inside the entry's `<div className="min-w-0">`, immediately after the `{entry.subtitle && (...)}` block, add:

```tsx
                {entry.note && (
                  <span className="text-muted-foreground text-xs block italic">
                    {entry.note}
                  </span>
                )}
```

The `'milestone'` member of the old union is dropped because nothing produced it.

- [ ] **Step 10: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — every suite green.

- [ ] **Step 11: Verify types and build**

Run: `npm run type-check && npm run lint && npm run build`
Expected: all three succeed. If `type-check` reports a `graduationDate` reference, it is in `app/api/chat/route.ts`; change that line to read `e.dates` — Task 8 replaces the whole block, but the tree must be green at every commit.

- [ ] **Step 12: Commit**

```bash
git add lib/dates.ts types/index.ts lib/data.ts components/sections/experience-section.tsx app/api/chat/route.ts tests/content/dates.test.ts tests/content/experience.test.ts
git commit -m "fix(experience): sort on real parsed dates and drop the school strands

Sorting on the first four-digit number in a date string ranked an ongoing role
by its start year, giving 2024, 2025, 2024, 2023. endOfRange parses the end of
each range instead, with Present resolving to today. Removes the two junior
high-school strands and labels the Enjoy Realty role as concurrent.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Trim skills from 35 to 13

Thirty-five pills across three categories is a list of everything ever touched. Spec §7 cuts it to what is actually shipped with. Payment gateways move to the projects that used them, where they are stronger evidence, and the AI chat clients go because listing them as peer skills alongside Git and Docker reads as "I use chatbots", not "I engineer".

**Decision made here, not in the spec:** the spec named the categories to cut (Bubble.io, four AI clients, Figma and VS Code, three gateways) but that only reaches 25. The remaining cuts are HTML5, CSS3 and JavaScript (subsumed by TypeScript and by every framework listed), Java, MySQL, Firebase, GitHub (redundant beside Git), Render, Clerk, Coolify, GeneratePress and GenerateBlocks. The last two are genuinely differentiating for the WordPress work, which is why they stay on the six project entries that use them — they are plugin-level detail, not a headline skill. The résumé PDF keeps its fuller list; that is the right place for breadth.

**Files:**
- Modify: `lib/data.ts` (`skills` array)
- Create: `tests/content/skills.test.ts`

**Interfaces:**
- Consumes: `Skill` from `@/types` (unchanged)
- Produces: `skills` of length 13 — Frontend 4, Backend 4, Tools & DevOps 5

- [ ] **Step 1: Write the failing test**

Create `tests/content/skills.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { skills } from '@/lib/data'

// Cut deliberately (spec §7). A skill returning to this list is a content
// regression, not an addition.
const CUT_IDS = [
  'bubble',
  'claude-code', 'gemini-cli', 'qoder', 'google-ai-studio',
  'figma', 'vscode',
  'paypal', 'maya', 'xendit',
  'html5', 'css3', 'javascript',
  'java', 'mysql', 'firebase', 'github',
  'render', 'clerk', 'coolify',
  'generatepress', 'generateblocks',
]

describe('skills', () => {
  it('stays within the 12 to 15 range the spec allows', () => {
    expect(skills.length).toBeGreaterThanOrEqual(12)
    expect(skills.length).toBeLessThanOrEqual(15)
  })

  it('carries none of the cut entries', () => {
    const ids = skills.map((s) => s.id)
    for (const cut of CUT_IDS) {
      expect(ids).not.toContain(cut)
    }
  })

  it('keeps every category populated', () => {
    for (const category of ['Frontend', 'Backend', 'Tools & DevOps']) {
      expect(skills.some((s) => s.category === category)).toBe(true)
    }
  })

  it('has unique ids', () => {
    const ids = skills.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- tests/content/skills.test.ts`
Expected: FAIL — length is 34 (Bubble.io already went in Task 1), and the cut-entry check reports many hits.

- [ ] **Step 3: Replace the skills array**

In `lib/data.ts`:

```ts
export const skills: Skill[] = [
  { id: 'typescript', name: 'TypeScript', icon: 'typescript', category: 'Frontend' },
  { id: 'react', name: 'React', icon: 'react', category: 'Frontend' },
  { id: 'nextjs', name: 'Next.js', icon: 'nextjs', category: 'Frontend' },
  { id: 'tailwindcss', name: 'Tailwind CSS', icon: 'tailwindcss', category: 'Frontend' },
  { id: 'nodejs', name: 'Node.js', icon: 'nodejs', category: 'Backend' },
  { id: 'php', name: 'PHP', icon: 'php', category: 'Backend' },
  { id: 'postgresql', name: 'PostgreSQL', icon: 'postgresql', category: 'Backend' },
  { id: 'supabase', name: 'Supabase', icon: 'supabase', category: 'Backend' },
  { id: 'wordpress', name: 'WordPress', icon: 'wordpress', category: 'Tools & DevOps' },
  { id: 'woocommerce', name: 'WooCommerce', icon: 'woocommerce', category: 'Tools & DevOps' },
  { id: 'docker', name: 'Docker', icon: 'docker', category: 'Tools & DevOps' },
  { id: 'vercel', name: 'Vercel', icon: 'vercel', category: 'Tools & DevOps' },
  { id: 'git', name: 'Git', icon: 'git', category: 'Tools & DevOps' },
]
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- tests/content/skills.test.ts`
Expected: PASS — 4 passed.

- [ ] **Step 5: Verify the build**

Run: `npm run type-check && npm run lint && npm run build`
Expected: all three succeed. `skills-section.tsx` renders whatever categories are present and needs no change.

- [ ] **Step 6: Commit**

```bash
git add lib/data.ts tests/content/skills.test.ts
git commit -m "content: cut skills from 35 to 13

Thirty-five pills is a list of everything ever touched. Keeps what is actually
shipped with. Payment gateways move to the project entries that used them,
where they are evidence rather than a claim; GeneratePress and GenerateBlocks
stay on the WordPress projects for the same reason.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Attach testimonials to the work they refer to

All four quotes are real and attributed. Their weakness is that none names a project or an outcome. Three of the four come from organisations whose work appears on this site, so attaching each quote to its case study converts general praise into project-specific proof with no new asks. Joseph Cua's is left unattached — Palawan Pick and Drop has no entry in the inventory, and inventing one would be worse than leaving the quote floating.

**Files:**
- Modify: `types/index.ts` (`Recommendation`)
- Modify: `lib/data.ts` (`recommendations`)
- Create: `tests/content/testimonials.test.ts`

**Interfaces:**
- Consumes: `projects` from Task 3
- Produces: `Recommendation.projectId?: string` — when present, always a valid `Project['id']`

- [ ] **Step 1: Write the failing test**

Create `tests/content/testimonials.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { projects, recommendations } from '@/lib/data'

function projectIdFor(name: string): string | undefined {
  return recommendations.find((r) => r.authorName === name)?.projectId
}

describe('testimonials', () => {
  it('keeps all four real, named, attributed quotes', () => {
    expect(recommendations).toHaveLength(4)
    for (const rec of recommendations) {
      expect(rec.authorName.trim()).not.toBe('')
      expect(rec.authorTitle.trim()).not.toBe('')
      expect(rec.quote.trim()).not.toBe('')
    }
  })

  it('resolves every attached projectId to a real project', () => {
    const ids = projects.map((p) => p.id)
    for (const rec of recommendations) {
      if (rec.projectId !== undefined) {
        expect(ids).toContain(rec.projectId)
      }
    }
  })

  it('attaches the three quotes whose organisations appear in the inventory', () => {
    expect(projectIdFor('Alec Santos')).toBe('beachbus')
    expect(projectIdFor('Brian Labilles')).toBe('aman-webapp')
    expect(projectIdFor('Bryden Elizan')).toBe('ocs-wp-control')
  })

  it('leaves the quote with no matching project unattached', () => {
    expect(projectIdFor('Joseph Cua')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- tests/content/testimonials.test.ts`
Expected: FAIL — `projectId` does not exist on `Recommendation`.

- [ ] **Step 3: Extend the type**

In `types/index.ts`:

```ts
export interface Recommendation {
  id: number;
  quote: string;
  authorName: string;
  authorTitle: string;
  /**
   * The project this quote refers to, when one exists in `projects`. Attaching
   * a quote to its case study turns general praise into project-specific
   * proof. Omitted where the author's organisation has no entry.
   */
  projectId?: string;
}
```

- [ ] **Step 4: Attach the three quotes**

In `lib/data.ts`, add `projectId` to the first three recommendation objects, each immediately after that object's `authorTitle` line:

- Alec Santos (id 1) → `projectId: 'beachbus',`
- Brian Labilles (id 2) → `projectId: 'aman-webapp',`
- Bryden Elizan (id 3) → `projectId: 'ocs-wp-control',`

Leave Joseph Cua (id 4) exactly as it is.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test -- tests/content/testimonials.test.ts`
Expected: PASS — 4 passed.

- [ ] **Step 6: Verify the build**

Run: `npm run type-check && npm run lint && npm run build`
Expected: all three succeed. `recommendations-section.tsx` ignores the new optional field; Phase 3 consumes it on the case-study pages.

- [ ] **Step 7: Commit**

```bash
git add types/index.ts lib/data.ts tests/content/testimonials.test.ts
git commit -m "content: attach testimonials to the projects they refer to

Three of the four quotes come from organisations whose work is in the
inventory. Attaching each to its case study turns general praise into
project-specific proof without asking anyone for a new quote.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Move the hero proof band and gallery captions into the data

Two pieces of load-bearing copy currently live nowhere or in the wrong place. The hero's proof band is the entire differentiation strategy compressed into four claims, and it must be verifiable against the data — spec R3 exists because an early draft of the spec itself inflated the gateway count. The gallery's captions are the most specific content on the site and currently sit inside `alt` attributes on hover-only overlays, unreachable on touch.

Phase 2 owns how these render. Phase 1 owns what they say.

**Files:**
- Modify: `types/index.ts` (`GalleryImage`)
- Modify: `lib/data.ts` (`heroContent`, `paymentGateways`, `galleryContent`, `galleryImages`)
- Create: `tests/content/proof-band.test.ts`

**Interfaces:**
- Consumes: `projects` from Task 3
- Produces:
  - `export const heroContent: { title: string; location: string; proofPoints: string[] }`
  - `export const paymentGateways: readonly string[]`
  - `export const galleryContent: { eyebrow: string; title: string }`
  - `GalleryImage.caption: string` — visible text; `alt` becomes a short image description

- [ ] **Step 1: Write the failing test**

Create `tests/content/proof-band.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  galleryImages,
  heroContent,
  paymentGateways,
  projects,
} from '@/lib/data'

describe('hero proof band', () => {
  it('states four proof points', () => {
    expect(heroContent.proofPoints).toHaveLength(4)
  })

  it('claims as many products as the inventory holds', () => {
    const products = projects.filter((p) => p.band === 'Products')
    expect(products).toHaveLength(3)
    expect(heroContent.proofPoints[0]).toBe('Three products of my own')
  })

  it('claims as many shipped projects as the inventory holds', () => {
    expect(projects).toHaveLength(15)
    expect(heroContent.proofPoints[1]).toBe('Fifteen projects shipped')
  })

  it('claims as many payment gateways as are actually integrated', () => {
    expect(paymentGateways).toHaveLength(4)
    expect(heroContent.proofPoints[2]).toBe('Four payment gateways')
  })

  it('claims one NFC card system and has the project to back it', () => {
    const nfc = projects.filter((p) => p.technologies.includes('NFC'))
    expect(nfc).toHaveLength(1)
    expect(heroContent.proofPoints[3]).toBe('One NFC card system')
  })

  it('claims no years-of-experience figure', () => {
    const blob = JSON.stringify(heroContent)
    expect(blob).not.toMatch(/\d+\+?\s*years?/i)
  })
})

describe('gallery', () => {
  it('gives every image a visible caption and a distinct alt', () => {
    for (const image of galleryImages) {
      expect(image.caption.trim()).not.toBe('')
      expect(image.alt.trim()).not.toBe('')
      expect(image.alt).not.toBe(image.caption)
    }
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- tests/content/proof-band.test.ts`
Expected: FAIL — `heroContent`, `paymentGateways` and `GalleryImage.caption` do not exist.

- [ ] **Step 3: Add the caption field to the type**

In `types/index.ts`:

```ts
export interface GalleryImage {
  id: number;
  src: string;
  /** Short description of the image itself, for screen readers. */
  alt: string;
  /** Visible caption. This is the proof; it must not hide behind a hover. */
  caption: string;
}
```

- [ ] **Step 4: Add the hero content and gateway list to `lib/data.ts`**

Insert immediately above the `projects` array so the file opens with the claims the rest of it has to support:

```ts
// The four gateways actually integrated across the WooCommerce projects. The
// hero proof band cites this count and a test enforces the match — an early
// draft of the design spec claimed five, and the review caught it.
export const paymentGateways: readonly string[] = [
  'PayPal',
  'PayMongo',
  'Maya',
  'Xendit',
]

// Positioning stays broad, so the entire differentiation burden sits on these
// four claims. Every one is checkable against the data below. No
// years-of-experience figure is claimed; the dated timeline carries that.
export const heroContent = {
  title: 'Full-stack web developer',
  location: 'Naga City',
  proofPoints: [
    'Three products of my own',
    'Fifteen projects shipped',
    'Four payment gateways',
    'One NFC card system',
  ],
}
```

- [ ] **Step 5: Rewrite the gallery content**

Replace `galleryImages` and add `galleryContent` above it:

```ts
// Retitled from "Gallery". These six photographs carry the most specific,
// least reproducible content on the site; naming the section for what it shows
// is the difference between decoration and proof.
export const galleryContent = {
  eyebrow: '// working with clients',
  title: 'On-site delivery',
}

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: '/assets/images/gallery/AmanWebAppPresentation.jpg',
    alt: 'Christian presenting to a seated audience at a brokers meeting',
    caption: "Presenting the Aman Group Web App at ERDC's brokers meeting",
  },
  {
    id: 2,
    src: '/assets/images/gallery/TeamBuildingWorkshopTagaytayEnjoyRealty.jpg',
    alt: 'Group photograph at an outdoor team workshop',
    caption: 'Team building workshop in Tagaytay with Enjoy Realty and Development Corporation',
  },
  {
    id: 3,
    src: '/assets/images/gallery/ElNidoSolo3.jpg',
    alt: 'Christian on a beach in El Nido',
    caption: 'El Nido, sponsored by the client I built the internal NFC card system for',
  },
  {
    id: 4,
    src: '/assets/images/gallery/BeachBusatPort.jpg',
    alt: 'A BeachBus vehicle arriving at a port',
    caption: 'BeachBus at El Nido Port — I built its website and its internal NFC card system',
  },
  {
    id: 5,
    src: '/assets/images/gallery/InsideBeachBuswithBosses.jpg',
    alt: 'Interior of the BeachBus with passengers seated',
    caption: 'Test ride aboard the BeachBus in El Nido',
  },
  {
    id: 6,
    src: '/assets/images/gallery/AtokwithJewel3.jpg',
    alt: 'Two people on a highland road in the Cordilleras',
    caption: 'Exploring the Cordillera highlands with my partner, Jewel',
  },
]
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test -- tests/content/proof-band.test.ts`
Expected: PASS — 7 passed.

- [ ] **Step 7: Verify the build**

Run: `npm run type-check && npm run lint && npm run build`
Expected: all three succeed. `gallery-section.tsx` still reads only `src` and `alt`; Phase 2 renders `caption` and removes the auto-scroll.

- [ ] **Step 8: Commit**

```bash
git add types/index.ts lib/data.ts tests/content/proof-band.test.ts
git commit -m "content: move the hero proof band and gallery captions into the data

Every claim in the proof band is now checked against the inventory by a test,
so an inflated count fails CI instead of shipping. Gallery captions become
first-class content rather than alt text on a hover-only overlay.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Derive the chat assistant's context entirely from `lib/data.ts`

This is the correctness fix the whole phase exists to justify. The route hand-maintains a second copy of the portfolio in prose, and the two have already diverged: the prose advertises projects that are not on the site and omits ones that are. A visitor asking the assistant "what has he built?" gets a stale answer today.

The builder moves to `lib/chat-context.ts` so it can be imported by a test — Next.js route files only support their HTTP-method exports, so a prompt builder cannot live there and be testable.

**Files:**
- Create: `lib/chat-context.ts`
- Create: `tests/content/chat-context.test.ts`
- Modify: `app/api/chat/route.ts`
- Modify: `tests/content/abandoned-tooling.test.ts`

**Interfaces:**
- Consumes: `projects`, `skills`, `experience`, `education`, `contactInfo`, `recommendations`, `heroContent`, `paymentGateways` from `@/lib/data`
- Produces:
  - `export function buildPortfolioContext(): string`
  - `export const SYSTEM_PROMPT: string`

- [ ] **Step 1: Write the failing test**

Create `tests/content/chat-context.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { SYSTEM_PROMPT, buildPortfolioContext } from '@/lib/chat-context'
import { experience, projects, skills } from '@/lib/data'

describe('chat portfolio context', () => {
  const context = buildPortfolioContext()

  it('names every project in the inventory', () => {
    for (const project of projects) {
      expect(context).toContain(project.title)
    }
  })

  it('names no project that is not in the inventory', () => {
    const block = context.split('PROJECTS')[1].split('TECHNICAL SKILLS')[0]
    const listed = block.split('\n').filter((line) => line.startsWith('- '))
    expect(listed).toHaveLength(projects.length)
  })

  it('names every skill in the trimmed list', () => {
    for (const skill of skills) {
      expect(context).toContain(skill.name)
    }
  })

  it('names every current role', () => {
    for (const role of experience) {
      expect(context).toContain(role.company)
    }
  })

  it('leaks no private contact details', () => {
    // Phone numbers, street addresses and birthdays were removed from this
    // prompt deliberately and must not return.
    expect(context).not.toMatch(/\+63|09\d{9}/)
    expect(context).not.toMatch(/birthday|date of birth/i)
    expect(context).not.toMatch(/\b(barangay|purok|zone \d)\b/i)
  })

  it('mentions no abandoned tooling', () => {
    expect(context).not.toMatch(/bubble/i)
    expect(context).not.toMatch(/muramart/i)
  })

  it('claims no years-of-experience figure', () => {
    expect(context).not.toMatch(/\d+\+?\s*years? of experience/i)
  })
})

describe('system prompt', () => {
  it('keeps the rule forbidding private contact details', () => {
    expect(SYSTEM_PROMPT).toMatch(/Never share personal contact details/)
  })

  it('embeds the derived context', () => {
    expect(SYSTEM_PROMPT).toContain('PORTFOLIO DATA:')
    expect(SYSTEM_PROMPT).toContain(projects[0].title)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- tests/content/chat-context.test.ts`
Expected: FAIL — cannot resolve `@/lib/chat-context`.

- [ ] **Step 3: Create `lib/chat-context.ts`**

```ts
import {
  contactInfo,
  education,
  experience,
  heroContent,
  paymentGateways,
  projects,
  recommendations,
  skills,
} from '@/lib/data'

// This file is the assistant's only source of portfolio facts. The route used
// to carry a hand-written prose copy alongside the generated one, and the two
// diverged: the prose advertised projects that were not on the site and omitted
// ones that were. Everything here derives from lib/data.ts so that cannot recur.
export function buildPortfolioContext(): string {
  const projectsList = projects
    .map((p) => {
      const link = p.links.live ? ` | URL: ${p.links.live}` : ''
      const when = p.dates ? ` | ${p.dates}` : ''
      const flag = p.featured ? ' [FEATURED]' : ''
      return `- ${p.title} (${p.band}): ${p.description} | Tech: ${p.technologies.join(', ')}${link}${when}${flag}`
    })
    .join('\n')

  const byCategory = (category: string) =>
    skills.filter((s) => s.category === category).map((s) => s.name).join(', ')

  const experienceList = experience
    .map((e) => {
      const note = e.concurrent ? ` (${e.concurrent})` : ''
      return `- ${e.title} at ${e.company}, ${e.location} (${e.dates})${note}\n    ${e.responsibilities.join('; ')}`
    })
    .join('\n')

  const educationList = education
    .map((e) => `- ${e.degree}, ${e.school} (${e.dates})${e.honors ? ` — ${e.honors}` : ''}`)
    .join('\n')

  const recommendationsList = recommendations
    .map((r) => `- "${r.quote}" — ${r.authorName}, ${r.authorTitle}`)
    .join('\n')

  return `
OWNER INFORMATION:
- Name: Christian Raro
- Title: ${heroContent.title}
- Location: ${contactInfo.location}
- Email: ${contactInfo.email}
- Proof points: ${heroContent.proofPoints.join('. ')}.

PROJECTS (${projects.length} total, grouped into Products, Custom systems, Applications and Sites):
${projectsList}

TECHNICAL SKILLS:
Frontend: ${byCategory('Frontend')}
Backend: ${byCategory('Backend')}
Tools & DevOps: ${byCategory('Tools & DevOps')}
Payment gateways integrated: ${paymentGateways.join(', ')}

WORK EXPERIENCE:
${experienceList}

EDUCATION:
${educationList}

RECOMMENDATIONS:
${recommendationsList}

SERVICES OFFERED:
- Full-stack web application development (Next.js, React, Node.js)
- WordPress website development and customisation
- E-commerce with WooCommerce and Philippine payment gateways
- Custom internal tools and hardware integrations
- API integrations

CONTACT:
- Email: ${contactInfo.email}
- Location: ${contactInfo.location}
- Social links: GitHub (github.com/chrisraro), LinkedIn (linkedin.com/in/christian-raro)
- For anything else, direct people to the contact form or email.
`
}

export const SYSTEM_PROMPT = `You are "Chunks", the AI assistant for Christian Raro's portfolio website. Christian is a full-stack web developer based in Naga City, Camarines Sur, Philippines.

RULES:
1. Keep responses SHORT — 1-2 sentences max unless the user asks for detail
2. Be direct, friendly, and conversational
3. Only answer questions about Christian's portfolio, projects, skills, experience, education, and services
4. For business inquiries, direct to the contact form or email (${contactInfo.email})
5. Politely decline off-topic questions in one sentence
6. Never generate harmful or inappropriate content
7. Don't make up information — say you don't know. In particular, never name a project that is not in the PORTFOLIO DATA below
8. Never share personal contact details beyond the public email and social links — no phone number, no home address. Point people at the contact form instead.

PORTFOLIO DATA:
${buildPortfolioContext()}

Be concise. No fluff.`
```

- [ ] **Step 4: Slim the route down to HTTP handling**

In `app/api/chat/route.ts`, delete `buildPortfolioContext`, the `SYSTEM_PROMPT` constant, and the now-unused `@/lib/data` import. Replace the top of the file with:

```ts
import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'
import { SYSTEM_PROMPT } from '@/lib/chat-context'
```

Leave `MODEL`, `POST` and the error handling exactly as they are. Also update the offline fallback string so it no longer describes Christian as a "Software Engineer specializing in React, Next.js, and WordPress development":

```ts
      return NextResponse.json({
        response: "I'm currently running in offline mode. I can still point you around: Christian is a full-stack web developer in Naga City — three products of his own, fifteen projects shipped. Explore the portfolio or use the contact form to reach him directly.",
        offline: true
      })
```

- [ ] **Step 5: Add the new file to the abandoned-tooling scan**

In `tests/content/abandoned-tooling.test.ts`, add `'lib/chat-context.ts'` to the `SOURCES` array so the new file is covered too.

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — every suite green, including the now four-file `abandoned-tooling` scan.

- [ ] **Step 7: Run the full gate**

Run: `npm run type-check && npm run lint && npm test && npm run build`
Expected: all four succeed.

- [ ] **Step 8: Verify the route still compiles with no key**

Run: `npm run build` in a shell with `GROQ_API_KEY` unset.
Expected: build succeeds. The route only reads `process.env.GROQ_API_KEY` at request time, so no key is needed to compile.

- [ ] **Step 9: Commit**

```bash
git add lib/chat-context.ts app/api/chat/route.ts tests/content/chat-context.test.ts tests/content/abandoned-tooling.test.ts
git commit -m "fix(chat): derive the assistant's context from lib/data.ts

The route kept a hand-written prose copy of the portfolio alongside the
generated one and the two had diverged — it advertised projects that were not
on the site and omitted ones that were. Moves the builder to lib/chat-context.ts
so a test can assert the prompt names every project and no others.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Delete the credentials sidebar and the `/tech-stack` route

The sidebar restates the hero's two facts in two dark boxes. The `/tech-stack` route renders the identical pill list the home page already shows, behind a "View All" link — a promise of more that delivers the same content. Both go.

**Files:**
- Delete: `components/sections/credentials-sidebar.tsx`
- Delete: `app/tech-stack/page.tsx` (and the now-empty `app/tech-stack/` directory)
- Modify: `app/page.tsx`
- Modify: `components/sections/skills-section.tsx`
- Create: `tests/content/dead-routes.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: no route at `/tech-stack`; `AboutSection` occupies the full width of its row

- [ ] **Step 1: Write the failing test**

Create `tests/content/dead-routes.test.ts`:

```ts
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOTS = ['app', 'components', 'lib']
const EXTENSIONS = ['.ts', '.tsx']

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return EXTENSIONS.some((ext) => full.endsWith(ext)) ? [full] : []
  })
}

const FILES = ROOTS.flatMap(sourceFiles)

describe('removed surfaces', () => {
  it('has no source file referencing the deleted /tech-stack route', () => {
    const offenders = FILES.filter((file) =>
      readFileSync(file, 'utf8').includes('/tech-stack')
    )
    expect(offenders).toEqual([])
  })

  it('has no source file referencing the deleted credentials sidebar', () => {
    const offenders = FILES.filter((file) =>
      readFileSync(file, 'utf8').includes('credentials-sidebar')
    )
    expect(offenders).toEqual([])
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- tests/content/dead-routes.test.ts`
Expected: FAIL — reports `components/sections/skills-section.tsx` for `/tech-stack` and `app/page.tsx` for `credentials-sidebar`.

- [ ] **Step 3: Delete the two files**

```bash
git rm components/sections/credentials-sidebar.tsx
git rm app/tech-stack/page.tsx
```

- [ ] **Step 4: Give About the full row in `app/page.tsx`**

Remove the `CredentialsSidebar` import, and replace the bento row that held it:

```tsx
      {/* Bento Row: About left + Credentials right */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 py-6">
        <div className="lg:col-span-3">
          <AboutSection />
        </div>
        <div className="lg:col-span-2">
          <CredentialsSidebar />
        </div>
      </div>
```

with:

```tsx
      {/* About, full width — the credentials sidebar restated the hero and went */}
      <div className="py-6">
        <AboutSection />
      </div>
```

- [ ] **Step 5: Remove the dead "View All" link from `components/sections/skills-section.tsx`**

Delete the `Link` element:

```tsx
        <Link
          href="/tech-stack"
          className="text-sm text-primary font-medium hover:underline"
        >
          View All →
        </Link>
```

and delete the now-unused import at the top of the file:

```tsx
import Link from 'next/link'
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test -- tests/content/dead-routes.test.ts`
Expected: PASS — 2 passed.

- [ ] **Step 7: Verify the build**

Run: `npm run type-check && npm run lint && npm run build`
Expected: all three succeed, and the build output no longer lists a `/tech-stack` route.

- [ ] **Step 8: Commit**

```bash
git add app/page.tsx components/sections/skills-section.tsx tests/content/dead-routes.test.ts
git commit -m "refactor: delete the credentials sidebar and the /tech-stack route

The sidebar restated the hero's two facts in two dark boxes. /tech-stack
rendered the identical pill list the home page already shows, reached by a
'View All' link that delivered nothing new.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Make the scripts read the inventory instead of copying it

`scripts/capture-screenshots.mjs` keeps its own list of eleven ids and URLs — three of which no longer exist and two of which point at the wrong domain. That is the same drift the chat route had. Both scripts read `lib/data.ts` instead. A new `verify-urls.mjs` implements the spec's first verification criterion.

The scripts are `.mjs` and the data is TypeScript, so the reader extracts the fields it needs by parsing the array text. That is deliberate: a build step to make the data importable from plain Node would be far more machinery than two scripts justify, and a guard test catches a shape change.

**Files:**
- Create: `scripts/lib/read-projects.mjs`
- Create: `scripts/verify-urls.mjs`
- Create: `tests/content/script-inventory.test.ts`
- Modify: `scripts/capture-screenshots.mjs`
- Modify: `package.json` (add `verify:urls`)

**Interfaces:**
- Consumes: `lib/data.ts` as text
- Produces: `readProjects(): { id, slug, title, live, status }[]` from `scripts/lib/read-projects.mjs`, in the same order as the exported array

- [ ] **Step 1: Write the failing test**

Create `tests/content/script-inventory.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { projects } from '@/lib/data'
// @ts-expect-error - plain JS helper shared with the .mjs scripts
import { readProjects } from '../../scripts/lib/read-projects.mjs'

type ParsedProject = {
  id: string
  slug: string
  title: string
  status: string
  live?: string
}

describe('script inventory reader', () => {
  const parsed = readProjects() as ParsedProject[]

  it('finds every project the module exports, in order', () => {
    expect(parsed.map((p) => p.id)).toEqual(projects.map((p) => p.id))
  })

  it('reads each live URL correctly', () => {
    for (const project of projects) {
      const match = parsed.find((p) => p.id === project.id)
      expect(match?.live).toBe(project.links.live)
    }
  })

  it('reads each status correctly', () => {
    for (const project of projects) {
      const match = parsed.find((p) => p.id === project.id)
      expect(match?.status).toBe(project.status)
    }
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- tests/content/script-inventory.test.ts`
Expected: FAIL — cannot resolve `../../scripts/lib/read-projects.mjs`.

- [ ] **Step 3: Write the reader**

Create `scripts/lib/read-projects.mjs`:

```js
// The Node scripts need the project inventory, but lib/data.ts is TypeScript
// and they run under bare node. Rather than let each script keep its own copy —
// which is exactly how the capture targets drifted three projects out of date —
// they read the array out of lib/data.ts. A vitest guard (tests/content/
// script-inventory.test.ts) fails if the parse stops matching the real export.

import fs from 'node:fs'
import path from 'node:path'

const DATA_FILE = path.resolve('lib/data.ts')

function field(chunk, name) {
  const match = chunk.match(new RegExp(`\\b${name}:\\s*'([^']*)'`))
  return match ? match[1] : undefined
}

export function readProjects() {
  const source = fs.readFileSync(DATA_FILE, 'utf8')
  const start = source.indexOf('export const projects: Project[] = [')
  if (start === -1) throw new Error('Could not find the projects array in lib/data.ts')

  const end = source.indexOf('\n]', start)
  const body = source.slice(start, end)

  return body
    .split(/\n  \{\n/)
    .slice(1)
    .map((chunk) => {
      const links = chunk.match(/links:\s*\{([^}]*)\}/)
      return {
        id: field(chunk, 'id'),
        slug: field(chunk, 'slug'),
        title: field(chunk, 'title'),
        status: field(chunk, 'status'),
        live: links ? field(links[1], 'live') : undefined,
      }
    })
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/content/script-inventory.test.ts`
Expected: PASS — 3 passed.

- [ ] **Step 5: Point the capture script at the reader**

In `scripts/capture-screenshots.mjs`, replace the whole hardcoded `targets` array (and its preceding `// id must match…` comment) with:

```js
import { readProjects } from './lib/read-projects.mjs'

// Anything with a public URL is capturable. Auth-gated and internal projects
// are not: their screenshots are supplied by hand (spec Phase 3, Q2).
const targets = readProjects()
  .filter((p) => p.live && p.status !== 'auth-gated' && p.status !== 'internal')
  .map((p) => ({ id: p.id, url: p.live }))
```

Leave the rest of the file — browser discovery, `autoScroll`, the capture loop — unchanged.

- [ ] **Step 6: Write the URL verifier**

Create `scripts/verify-urls.mjs`:

```js
// Spec verification criterion 1: every URL in the inventory returns 200 to a
// browser user-agent. Two sites reject a default curl UA with 406 and one sits
// behind a login, so the UA matters and a redirect is not automatically a fault.
//
// Manual only — this hits the live internet and must never run in CI.
// Usage: npm run verify:urls

import { readProjects } from './lib/read-projects.mjs'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

const targets = readProjects().filter((p) => p.live)

let failures = 0

for (const target of targets) {
  try {
    const response = await fetch(target.live, {
      headers: { 'user-agent': UA },
      redirect: 'follow',
      signal: AbortSignal.timeout(25_000),
    })
    const note = target.status === 'auth-gated' ? ' (auth-gated, redirect to login expected)' : ''
    if (!response.ok) failures += 1
    const flag = response.ok ? 'OK ' : 'BAD'
    console.log(`${flag} ${response.status}  ${target.id.padEnd(26)} ${response.url}${note}`)
  } catch (error) {
    failures += 1
    console.log(`ERR      ${target.id.padEnd(26)} ${target.live} — ${error.message}`)
  }
}

console.log(`\n${targets.length - failures}/${targets.length} reachable`)
process.exit(failures === 0 ? 0 : 1)
```

- [ ] **Step 7: Add the script to `package.json`**

```json
    "verify:urls": "node ./scripts/verify-urls.mjs",
```

- [ ] **Step 8: Run the verifier**

Run: `npm run verify:urls`
Expected: 14 of 14 reachable. `beachbus-nfc` has no URL and is skipped. If a site fails, do not silently drop it — report the failure to Christian and decide together whether the entry stays.

- [ ] **Step 9: Capture the five missing thumbnails**

Run: `npm run capture latag acad1 azalea-baguio azalea-boracay aralabroad`
Expected: five PNGs written to `public/assets/images/projects/`. `ocs-wp-control` is auth-gated and excluded by the filter — its screenshot is supplied by hand in Phase 3, once spec Q2 is answered. `beachbus-nfc` has no URL and renders the titled fallback tile.

This step drives system Chrome via `puppeteer-core` and only runs on Christian's Windows machine, where the hardcoded browser paths resolve. Skip it if the browser is not found and note which thumbnails are outstanding.

- [ ] **Step 10: Run the full gate**

Run: `npm run type-check && npm run lint && npm test && npm run build`
Expected: all four succeed.

- [ ] **Step 11: Commit**

```bash
git add scripts/lib/read-projects.mjs scripts/verify-urls.mjs scripts/capture-screenshots.mjs package.json tests/content/script-inventory.test.ts public/assets/images/projects
git commit -m "chore(scripts): read the project inventory from lib/data.ts

The capture script kept its own list of eleven ids, three of which no longer
exist and two of which pointed at the wrong domain — the same drift the chat
route had. Adds verify-urls for the spec's URL liveness check.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Full verification and documentation

Runs the spec's seven verification criteria end to end and brings `CLAUDE.md` in line with what the phase changed.

**Files:**
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: everything from Tasks 1–10
- Produces: a green tree and accurate project instructions

- [ ] **Step 1: Run every gate**

```bash
npm run type-check && npm run lint && npm test && npm run build && npm run verify:urls
```

Expected: all five succeed. This covers spec verification criteria 1, 2, 3, 4, 6 and 7.

- [ ] **Step 2: Verify criterion 5 by hand — the assistant's answer matches the inventory**

Start the dev server with a working key and ask the chat widget "What has Christian built?". Confirm the answer names only projects present in `lib/data.ts`. The automated test already asserts the prompt is correct; this confirms the model is using it.

```bash
npm run dev
```

If `GROQ_API_KEY` is unset the widget returns the offline reply, which is the correct degraded behaviour and not a failure — note it and move on.

- [ ] **Step 3: Confirm no stray content regressions**

```bash
grep -rniE "bubble|muramart|tech-stack|servconfig|giya\.vercel|azaleamain|fish2go" app components lib scripts types
```

Expected: no output. `latag.vercel.app` is a legitimate URL and will not match these patterns.

- [ ] **Step 4: Update `CLAUDE.md`**

Make these five edits:

Under **Build & Run**, add after the `Lint` line:

```markdown
- Tests: `npm test` (Vitest, content invariants only — no component or E2E tests)
- URL liveness: `npm run verify:urls` (manual; hits the live internet, never in CI)
```

Replace the **Testing** section body with:

```markdown
Content-invariant tests live in `tests/content/` and run under Vitest. They assert
the facts the site claims: the project inventory and its bands, the hero proof
band's counts, testimonial attachment, experience ordering, and that removed
content stays removed. There are no component or E2E tests.

CI (`.github/workflows/ci.yml`) runs type-check, lint, test, and build on push and
PR to `main`. Run all four locally before committing; they must pass with no
environment variables set.
```

Under **Project Structure**, update these lines and delete the `app/tech-stack/` line:

```
lib/data.ts          Single source of truth for ALL portfolio content
lib/chat-context.ts  Builds the AI assistant's system prompt from lib/data.ts
lib/dates.ts         Parses human date ranges into sortable timestamps
tests/content/       Vitest content invariants
```

Replace the second paragraph of **Content Changes** with:

```markdown
`lib/chat-context.ts` derives the AI assistant's entire system prompt from
`lib/data.ts`. Adding a project reaches the chatbot automatically. Do not
reintroduce hand-written portfolio prose into `app/api/chat/route.ts` — that
duplicate existed once and drifted out of date.

Projects carry a `band` from a closed four-value vocabulary — `Products`,
`Custom systems`, `Applications`, `Sites` — and a `status` that tells Phase 3
whether a live preview is possible. The hero's proof band in `heroContent` makes
factual claims that `tests/content/proof-band.test.ts` checks against the data;
if you change the inventory, the band changes with it.
```

In **Client/Server Boundary**, remove `app/tech-stack/page.tsx` from the list of server components.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update project instructions for the Phase 1 content rebuild

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 6: Push**

```bash
git push origin main
```

Expected: CI runs type-check, lint, test and build, and all four pass. Vercel deploys from `main`.

---

## What Phase 1 deliberately does not do

Named here so the next phase's author does not go looking for them:

- **Home page section order.** Spec §2 reorders the home page into Products → Client work → Custom systems and gives it real navigation. That is a layout change and belongs to Phase 2, which rebuilds the composition anyway. Phase 1 leaves `app/page.tsx` structurally as it is, minus the deleted sidebar.
- **Hero and gallery rendering.** `heroContent`, `galleryContent` and `GalleryImage.caption` are written here but not yet read by any component. Phase 2 consumes them, removes the gallery auto-scroll, makes the thumbnails real buttons, and renders the captions as permanent text.
- **The experience group headings and legend.** The sort is fixed here because it is a factual error. The filled-versus-hollow dot that encodes work-versus-education with no legend is a visual problem and stays for Phase 2.
- **`Project.contribution`.** The field exists and is populated on nothing. "What I built" per project is a content dependency owed by Christian and gates Phase 3.
- **`Project.slug`.** Used by nothing yet. Phase 3 routes `/projects/[slug]` on it, which is why the slugs are asserted unique and kebab-case now.
- **The résumé PDF's education section.** It keeps the high-school entries. Removing them from the site's timeline is a portfolio positioning decision; a Philippine résumé conventionally lists them, and the spec's file-impact table scopes `build-resume.mjs` to the abandoned-tooling removal only.

---

## Self-Review

**Spec coverage.** Every section of the design maps to a task: §1 positioning → Task 7 (`heroContent`, and the proof-band tests that make R3 enforceable); §2 IA → Tasks 9 and the deferral note above; §3 taxonomy → Task 2; §4 inventory → Tasks 2 and 3; §5 testimonials → Task 6; §6 experience → Tasks 1 and 4; §7 skills → Task 5; §8 gallery → Task 7; §9 single source of truth → Tasks 8 and 10. All seven verification criteria are covered: 1 by Task 10's `verify:urls`, 2 by Task 1, 3 by Task 2, 4 by Task 6, 5 by Task 8 plus a manual check in Task 11, 6 by Task 4, 7 by every task's gate.

**Two gaps the review found and this plan closes.** The spec's file-impact table omits the hero and the gallery even though §1 and §8 make decisions about both; Task 7 carries them, scoped to content only. And the spec's own occurrence count for the abandoned-tooling purge was wrong — it said 11 across 4 files, where the verified figure is 14 across 3. The spec has been corrected and Global Constraints states the verified number.

**Three decisions this plan makes that the spec left open.** The exact 13 skills — the spec's named cuts reached only 25 of 35, so the rest are chosen and justified in Task 5. The `featured` set of six, provisional because Phase 2 replaces the section that reads it. And that spec Q2 gates Phase 3 screenshots rather than the Phase 1 data entry, because the OCS panel's public URL discloses only a login screen. Each is flagged where it is made, so any of the three can be overturned in one place.

**Placeholder scan.** No TBDs. Two fields are intentionally unpopulated — `Project.contribution` on all fifteen, and `dates` on the nine projects whose dates are not verifiable — and a test enforces that both are either absent or non-empty, never an empty string standing in for content.

**Type consistency.** `ProjectBand`, `ProjectStatus`, `BAND_ORDER`, `endOfRange`, `parseDateToken`, `buildPortfolioContext`, `SYSTEM_PROMPT` and `readProjects` are each defined in one task and used with the same name and signature in every later one. `EducationItem.graduationDate` is renamed to `dates` in Task 4, and Task 4 Step 11 names the one consumer that breaks.
