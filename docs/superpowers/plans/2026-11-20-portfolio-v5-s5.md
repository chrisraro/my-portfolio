# Portfolio 5.0 Sprint 5 (SEO, GEO, AIEO) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every route of the Isarog Trail Map its spec §6 title, description, canonical URL and its own trail-map link-preview card; publish one JSON-LD entity graph per page around a single `Person` `@id`; name the four search crawlers in `robots.ts`; list every route in the sitemap, `/llms.txt`, `/llms-full.txt` and the chat prompt; and hold every one of those surfaces to the privacy rules by test.

**Architecture:** One new pure module, `lib/site-routes.ts`, lists every page once (path, title, description, keywords, card words, breadcrumbs, sitemap priority). Metadata (`lib/site-metadata.ts`), the cards (one edge route, `app/og/[[...path]]/route.tsx`), the JSON-LD (`lib/structured-data.ts`, one graph per page), the sitemap, the AI files (`lib/llms.ts`) and the chat prompt (`lib/chat-context.ts`) all read it, so a page added there reaches all of them. Privacy and graph-shape guards live in `tests/helpers/` and run over every surface.

**Tech Stack:** Next.js 14 App Router (metadata API, route handlers, `next/og` on the edge runtime), React 18, TypeScript 5 (strict), Vitest. No new dependencies.

## Decisions taken by the planner

1. **`heroContent.proofPoints` and `heroContent.lede` are deleted.** The proof counts already live, derived, in the elevation strip's `elevationFigures()` (`lib/elevation.ts`); the chat prompt reads those. The homepage description becomes `heroContent.subheadline` (spec §6 hero copy); the `Person` description becomes `aboutPageContent.answer` (third person, citable). `splitProofPoint` loses its last caller and goes; `numberWord` stays. `proof-band`, `proof`, `catalog-consistency`, `positioning`, `visible-copy` follow.
2. **One route registry**, `lib/site-routes.ts`, pure (no filesystem), so the edge card route can import it. `projectHref` moves there; `lib/project-page.ts` re-exports it so existing importers keep working.
3. **Cards: one shared layout, per-route words, one edge route.** `app/og/[[...path]]/route.tsx` serves `/og` (homepage) and `/og<path>` for every route in the registry; any other path is a 404 before a font loads, so nobody can mint a card with their own words. Each page names its card explicitly in its metadata (the pattern the S4 fix set), so `app/opengraph-image.tsx` and the unused `app/fonts/recursive-mono-500.ttf` are deleted. Not per-route `opengraph-image.tsx` files: seven copies of the same file, and a page that sets `openGraph` would still need to name its image.
4. **The card is in the day theme**, the site's default (`ThemeProvider defaultTheme="light"`): lagoon-night was the 4.0 card. `lib/og-palette.ts` holds six day tokens (`bg`, `ink`, `muted`, `line`, `contour`, `trail`) and `tests/design/og-palette.test.ts`, re-enabled, holds them to `:root` in `app/globals.css`. Trail red on the card only on the trail and its "you are here" dot. Recursive Sans 600 stays the card's one face (ImageResponse cannot read the variable Archivo file).
5. **JSON-LD is one graph per page; the layout renders none.** Each graph carries the `Person` and the `WebSite` that every reference points at, so every `@id` reference resolves inside the page's own graph. `ProfessionalService` is retired (not in the spec's list; its offer catalogue duplicated the service pages). Nodes: `Person`, `WebSite` (every page), `BreadcrumbList` (every page but the homepage: a one-item trail says nothing), `ProfilePage` (`/about`), `Service` (each service page; all three on `/services`), a project node (each project page).
6. **Project node rule:** a project in the `Products` or `Applications` band (software a visitor opens and uses) is a `SoftwareApplication`; a `Sites` or `Custom systems` project (a client's site, an internal system) is a `CreativeWork`. No `offers`, `aggregateRating` or `review` is invented, so Google will not show a software rich result for those nodes; they are there to name the work and its maker. Expect the Rich Results Test to say so; it is not a finding.
7. **`Service.areaServed`** is Naga City (`City`), Bicol (`AdministrativeArea`) and the Philippines (`Country`); "remote" is not a place, so it is an `availableChannel` (`ServiceChannel`, name `Remote`). The words live in a new `serviceArea` in `lib/data.ts`.
8. **`worksFor` and `alumniOf` come from the data:** current roles are the `experience` entries whose dates end in "Present" (Online Creative Solutions); `alumniOf` is each `education` school as written ("Bicol University Polangui Campus"). `sameAs` is the `https://` entries of `socialLinks` (the mailto entry is the `email`).
9. **Titles follow the spec's table exactly**, including `{Project} · {summary} · Christian Raro` for project pages, even where that runs past 60 characters (open question 2). `/projects` and `/services` keep their S4 titles (the table has no row for them).
10. **robots:** one group each for Googlebot, OAI-SearchBot, Claude-SearchBot and PerplexityBot (allow `/`, disallow `/api/`), then `*` with the same rules. A crawler obeys only the most specific group naming it, so every group repeats the `/api/` disallow. AI training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot) are not named and fall under `*`: allowed, a decision on record. Following Google's position that optimising for AI search is still SEO, nothing here targets AI features beyond crawl access, server-rendered content and the llms files (which Google ignores).
11. **`NEXT_PUBLIC_SITE_URL`** may be absent: `SITE_URL` already falls back to `https://christian-digital-portfolio.vercel.app` (`lib/site-metadata.ts`); every absolute URL goes through the new `absoluteUrl(path)`.
12. **Privacy guard:** `tests/helpers/privacy.ts` gains `hasStreet` and `privacyIssues(text)` (phone, street, a `telephone` field, any email but the public one). `hasPhone` now ignores ISO dates (`2026-11-20` matched its mobile pattern, and `ProfilePage.dateModified` carries one). Today's file has no control bytes (checked); a test now reads it to keep it so, and each guard has an assertion proving it can fail.
13. **llms files:** `/llms.txt` opens with the `/about` answer as its summary line, lists the three service pages under `## Services` and the homepage, `/services`, `/hire`, `/about` and `/projects` under `## Pages`, then case studies and projects as today. The plain `services` string list leaves the AI files (the service pages replace it); the chat prompt keeps it.

## Open questions (defaults are written into the tasks)

1. The card in the day theme (default) or the night theme? Swapping is the six hex values plus the test's block selector (`:root {` to `.dark {`).
2. Project titles run long (`El Nido Guide PH · Tour operators · booking marketplace · PayPal, Maya · Christian Raro`). Default: the spec's format; the alternative is `{Project} · Christian Raro` with the summary left to the description.
3. No `BreadcrumbList` on the homepage (default). Say if the spec's "on every page" should include a one-item trail.

## Hand-off for Christian (off-site, not code)

- Align the LinkedIn headline and the GitHub bio with the homepage title, "Christian Raro · Full-Stack Developer in the Philippines".
- In Google Search Console: verify the property (set `GOOGLE_SITE_VERIFICATION` in Vercel; the meta tag code exists), submit `/sitemap.xml` after the merge, and enable the "Search generative AI" setting the spec names, if your account shows it.
- Set `NEXT_PUBLIC_SITE_URL` in Vercel if the site moves to its own domain; otherwise the fallback stands.

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

S5 adds:

- Every task is implemented by a Sonnet subagent, test first. Before structured-data work (Task 6) the implementer may load the `claude-seo:seo-schema` skill; before Task 7 `claude-seo:seo-geo`. No network calls to the live site, no servers: tests and the four gates only. The controller does the browser, Lighthouse and fetch checks (Task 10).
- Gates before every commit, from the repo root, in order: `npm run type-check` (prints nothing, exits 0), `npm run lint` (`✔ No ESLint warnings or errors`), `npm test` (ends `Test Files  N passed (N)`), `RESEND_API_KEY= GROQ_API_KEY= npm run build` (from Task 4 on, the route table lists `ƒ /og/[[...path]]`). If type-check points at a file under `.next/types` that no longer exists (it will after Task 4 deletes `app/opengraph-image.tsx`), delete `.next` and rerun.
- Client components stay at 8. The card route is a route handler, not a component; no `'use client'` anywhere new.
- No phone number, no street, no `telephone` field, no email but `contactInfo.email`, no `FAQPage`, `AggregateRating` or `Review` node, on any surface: metadata, JSON-LD, cards, llms files, chat prompt.
- Regex literals in tests and helpers: `\b` is a backslash followed by `b`, never a control byte. After writing a test or helper file, run `grep -P '\x08' <file>`; it must print nothing.
- Copy facts only from `lib/data.ts`, `lib/case-studies.ts` or the spec; this sprint writes almost no new copy (the `serviceArea` words and the breadcrumb names "Home" and "Projects", which are interface chrome).

## File Structure

Create:
- `lib/site-routes.ts`: `siteRoutes()`, `findRoute`, `routeFor`, `projectHref`, `buildProjectsTitle`, `buildProjectPageTitle`; types `RouteKind`, `Crumb`, `OgCard`, `SiteRoute`.
- `app/og/[[...path]]/route.tsx`: the link-preview card for every route (edge).
- `app/robots.ts` is rewritten, not created.
- `tests/helpers/json-ld.ts`: `danglingRefs`, `missingFields`.
- Tests: `tests/content/privacy-guard.test.ts`, `tests/content/site-routes.test.ts`, `tests/components/og-card.test.tsx`, `tests/content/robots.test.ts`, `tests/content/s5-surfaces.test.ts`.

Rewrite: `lib/structured-data.ts`, `lib/llms.ts`, `app/robots.ts`, `app/sitemap.ts`, `lib/og-palette.ts`, `tests/helpers/privacy.ts`, `tests/content/structured-data.test.ts`, `tests/content/page-metadata.test.ts`, `tests/content/proof.test.ts`.

Modify: `lib/data.ts`, `types/index.ts`, `lib/site-metadata.ts`, `lib/project-page.ts`, `lib/chat-context.ts`, `lib/proof.ts`, `app/layout.tsx`, `app/page.tsx`, `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`, `app/services/page.tsx`, `app/services/[slug]/page.tsx`, `app/about/page.tsx`, `app/hire/page.tsx`, `components/sections/trailhead.tsx`, `CLAUDE.md`, and the tests named in each task (`proof-band`, `catalog-consistency`, `positioning`, `visible-copy`, `hero-copy`, `project-page` (content and component), `sitemap`, `og-palette`, `llms`, `chat-context`).

Delete: `app/opengraph-image.tsx`, `app/fonts/recursive-mono-500.ttf`, `tests/components/opengraph-image.test.tsx`.

## Task list

| # | Task | Model |
|---|---|---|
| 1 | Privacy guards that can fail | Sonnet |
| 2 | Retire the hero's S2 leftovers (`proofPoints`, `lede`) | Sonnet |
| 3 | The route registry and the sitemap | Sonnet |
| 4 | The trail-map card for every route | Sonnet |
| 5 | Per-route metadata | Sonnet |
| 6 | The JSON-LD entity graph, one per page | Sonnet |
| 7 | robots.txt names the search crawlers | Sonnet |
| 8 | llms files and the chat prompt cover the new pages | Sonnet |
| 9 | S5 surface guards | Sonnet |
| 10 | Docs and sprint verification | Sonnet, then the controller |

---

### Task 1: Privacy guards that can fail

**Model:** Sonnet

**Files:**
- Rewrite: `tests/helpers/privacy.ts`
- Create: `tests/content/privacy-guard.test.ts`

**Interfaces:**
- Consumes: `contactInfo` (`@/lib/data`).
- Produces (from `@/tests/helpers/privacy`): `hasPhone(text: string): boolean` (unchanged callers: `case-studies`, `llms`, `new-pages`, `structured-data` tests), `hasStreet(text: string): boolean`, `type PrivacyIssue = 'phone' | 'street' | 'telephone' | 'email'`, `privacyIssues(text: string): PrivacyIssue[]` (`[]` means safe).

- [ ] **Step 1: Write the failing test**

Create `tests/content/privacy-guard.test.ts`:

```ts
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { contactInfo } from '@/lib/data'
import { hasPhone, hasStreet, privacyIssues } from '@/tests/helpers/privacy'

// Every public surface runs these guards (S5). A guard that cannot fail
// proves nothing, so each one is shown failing here first.
describe('privacy guards can fail', () => {
  it('catch a mobile number, a bracketed landline and a dashed local number', () => {
    expect(hasPhone('Call +63 917 123 4567')).toBe(true)
    expect(hasPhone('Office (054) 472 1234')).toBe(true)
    expect(hasPhone('Desk 472-1234')).toBe(true)
  })

  it('let years, ranges and ISO dates through', () => {
    expect(hasPhone('August 2020 – July 2024')).toBe(false)
    expect(hasPhone('Updated 2026-11-20')).toBe(false)
    expect(hasPhone('{"dateModified":"2026-11-20"}')).toBe(false)
  })

  it('catch a street, a barangay and a streetAddress field', () => {
    expect(hasStreet('12 Magsaysay Avenue, Naga City')).toBe(true)
    expect(hasStreet('45 Elias Angeles St. Naga')).toBe(true)
    expect(hasStreet('Brgy. San Felipe')).toBe(true)
    expect(hasStreet('{"streetAddress":"x"}')).toBe(true)
  })

  it('let the public locality and a road in a caption through', () => {
    expect(hasStreet(contactInfo.location)).toBe(false)
    expect(hasStreet('Two people on a highland road in the Cordilleras')).toBe(false)
  })

  it('name each guard a text trips, and nothing for the public email', () => {
    expect(privacyIssues('Call +63 917 123 4567')).toEqual(['phone'])
    expect(privacyIssues('12 Magsaysay Avenue')).toEqual(['street'])
    expect(privacyIssues('{"telephone":"x"}')).toEqual(['telephone'])
    expect(privacyIssues('Write to someone@example.com')).toEqual(['email'])
    expect(privacyIssues(`Write to ${contactInfo.email}.`)).toEqual([])
  })

  it('write their word boundaries as backslash-b, never a control byte', () => {
    const source = readFileSync('tests/helpers/privacy.ts', 'utf8')
    expect(source).not.toMatch(/[\x00-\x08\x0B\x0C\x0E-\x1F]/)
    expect(source).toContain('\\b')
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/content/privacy-guard.test.ts`
Expected: FAIL: `hasStreet` and `privacyIssues` are not exported, and `hasPhone('Updated 2026-11-20')` is `true`.

- [ ] **Step 3: Rewrite the helper**

Replace the whole of `tests/helpers/privacy.ts` with:

```ts
import { contactInfo } from '@/lib/data'

// The privacy guards every public surface runs through (CLAUDE.md, Content
// Changes): no phone number, no street address, no telephone field, no email
// but the public one. tests/content/privacy-guard.test.ts shows each guard
// failing, and reads this file: word boundaries are a backslash and a b,
// never a control byte (the S3 lesson).

// ISO dates (a JSON-LD dateModified, 2026-11-20) are not phone numbers.
const ISO_DATE = /\b\d{4}-\d{2}-\d{2}\b/g

// Mobile runs, landlines with an area code in brackets, and dashed local
// numbers. Years and ranges pass.
const PHONE = [/\+?\d[\d\s-]{8,}\d/, /\(\d{2,4}\)\s*\d{3}[\s-]?\d{4}/, /\b\d{3}-\d{4}\b/]

// A house number before a street word, a Philippine sub-locality marker, or a
// schema.org street field. The site names a city at most.
const STREET = [
  /\b\d+[A-Za-z]?\s+(?:[A-Z][\w.'-]*\s+){1,4}(?:Street|St\.|Avenue|Ave\.|Road|Rd\.|Drive|Boulevard|Blvd\.?|Highway)(?!\w)/,
  /\b(?:Brgy\.?|Barangay|Purok|Sitio)\s+\S/i,
  /streetAddress/,
]

const TELEPHONE = /\btelephone\b/i
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.]+/g

export function hasPhone(text: string): boolean {
  const scrubbed = text.replace(ISO_DATE, '')
  return PHONE.some((re) => re.test(scrubbed))
}

export function hasStreet(text: string): boolean {
  return STREET.some((re) => re.test(text))
}

export type PrivacyIssue = 'phone' | 'street' | 'telephone' | 'email'

/** Every guard the text trips; [] means it is safe to publish. */
export function privacyIssues(text: string): PrivacyIssue[] {
  const issues: PrivacyIssue[] = []
  if (hasPhone(text)) issues.push('phone')
  if (hasStreet(text)) issues.push('street')
  if (TELEPHONE.test(text)) issues.push('telephone')
  // A sentence can end on the address; the full stop is not part of it.
  const emails = (text.match(EMAIL) ?? []).map((e) => e.replace(/\.+$/, ''))
  if (emails.some((e) => e !== contactInfo.email)) issues.push('email')
  return issues
}
```

- [ ] **Step 4: Run the test and the suites that use the helper**

Run: `npx vitest run tests/content/privacy-guard.test.ts tests/content/case-studies.test.ts tests/content/llms.test.ts tests/content/new-pages.test.ts tests/content/structured-data.test.ts`
Expected: PASS. Then `grep -P '\x08' tests/helpers/privacy.ts tests/content/privacy-guard.test.ts` prints nothing.

- [ ] **Step 5: Gates and commit**

Run the four gates.

```bash
git add tests/helpers/privacy.ts tests/content/privacy-guard.test.ts
git commit -m "test(privacy): street, telephone and email guards, each shown failing" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Retire the hero's S2 leftovers (`proofPoints`, `lede`)

**Model:** Sonnet

**Files:**
- Modify: `lib/data.ts` (`heroContent`)
- Modify: `components/sections/trailhead.tsx` (portrait path from data)
- Modify: `lib/site-metadata.ts`, `lib/structured-data.ts`, `lib/llms.ts`, `lib/chat-context.ts`, `lib/proof.ts`
- Modify tests: `tests/content/proof-band.test.ts`, `tests/content/proof.test.ts` (rewrite), `tests/components/catalog-consistency.test.tsx`, `tests/content/positioning.test.ts`, `tests/content/visible-copy.test.ts`, `tests/content/hero-copy.test.ts`

**Interfaces:**
- Consumes: `elevationFigures(): ElevationFigure[]` (`@/lib/elevation`, `{ value: number; label: string }`, order: products, shipped, case studies, places), `sectionContent.timeline.figures`, `aboutPageContent.answer`.
- Produces: `heroContent.pageTitle` (`'Christian Raro · Full-Stack Developer in the Philippines'`), `heroContent.portrait` (`'/assets/images/about/profile-hiking.jpg'`). `heroContent.proofPoints`, `heroContent.lede` and `splitProofPoint` no longer exist.

- [ ] **Step 1: Write the failing test**

In `tests/content/proof-band.test.ts`, replace the import block and the first `describe` (`'hero proof band'`, down to its closing `})`) with:

```ts
import { describe, expect, it } from 'vitest'
import { buildPortfolioContext } from '@/lib/chat-context'
import {
  galleryImages,
  heroContent,
  paymentGateways,
  projects,
} from '@/lib/data'
import { elevationFigures } from '@/lib/elevation'

// heroContent.proofPoints was retired in S5: the elevation strip's figures,
// counted from the data, are the proof, and the chat prompt reads them too.
describe('proof figures', () => {
  it('count the products and shipped projects the inventory holds', () => {
    const [products, shipped] = elevationFigures()
    expect(products.value).toBe(projects.filter((p) => p.band === 'Products').length)
    expect(products.value).toBe(4)
    expect(shipped.value).toBe(projects.filter((p) => p.status !== 'staging').length)
    expect(shipped.value).toBe(19)
  })

  it('reach the chat assistant as the same figures', () => {
    const context = buildPortfolioContext()
    for (const f of elevationFigures()) expect(context).toContain(`${f.value} ${f.label}`)
  })

  it('leave no hand-typed proof or lede on heroContent', () => {
    expect('proofPoints' in heroContent).toBe(false)
    expect('lede' in heroContent).toBe(false)
  })

  it('claim no years-of-experience figure', () => {
    expect(JSON.stringify(heroContent)).not.toMatch(/\d+\+?\s*years?/i)
  })
})
```

Keep the `'payment gateways'` and `'gallery'` describes below it unchanged.

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/content/proof-band.test.ts`
Expected: FAIL: the context has no `4 products of my own`, and `heroContent` still has `proofPoints` and `lede`.

- [ ] **Step 3: Change the data**

In `lib/data.ts`, replace

```ts
// The first viewport names the verticals a hospitality owner is looking for.
// Every claim is checkable against the data below. No years-of-experience
// figure is claimed; the dated timeline carries that. The lede says "with
// online booking and payments where they need them" rather than "booking and
// payment websites": Graceland has neither, and the lede must not overclaim.
```

with

```ts
// The first viewport's copy. Every claim is checkable against the data below.
// No years-of-experience figure is claimed; the dated timeline carries that.
```

Replace

```ts
  // lesson). `title` below stays: metadata and JSON-LD read it until S5.
```

with

```ts
  // lesson). `title` below is the Person's jobTitle in the JSON-LD.
```

Replace

```ts
  title: 'Mid-level full-stack developer',
  location: 'Naga City',
  // The hero photo, described for the portrait's labelled button.
  portraitAlt: 'Portrait of Christian Raro hiking',
  lede: 'I build websites for hotels, tour operators and restaurants, with online booking and payments where they need them, plus products of my own.',
```

with

```ts
  title: 'Mid-level full-stack developer',
  // The homepage's <title> (spec §6, titles table).
  pageTitle: 'Christian Raro · Full-Stack Developer in the Philippines',
  location: 'Naga City',
  // The hero photo: the trailhead's plate, and the Person's image in the JSON-LD.
  portrait: '/assets/images/about/profile-hiking.jpg',
  // The hero photo, described for the portrait's labelled button.
  portraitAlt: 'Portrait of Christian Raro hiking',
```

Delete

```ts
  proofPoints: [
    'Four products of my own',
    'Nineteen projects shipped',
  ],
```

In `components/sections/trailhead.tsx`, replace `const PORTRAIT = '/assets/images/about/profile-hiking.jpg'` with `const PORTRAIT = heroContent.portrait` (the file already imports `heroContent`).

- [ ] **Step 4: Move every reader off the deleted fields**

`lib/site-metadata.ts`, in `buildSiteMetadata`, replace

```ts
  const title = `${heroContent.name} · ${heroContent.title}`
  const description = heroContent.lede
```

with

```ts
  const title = heroContent.pageTitle
  const description = heroContent.subheadline
```

`lib/structured-data.ts`: change the first import line to `import { aboutPageContent, contactInfo, heroContent, services, skills } from '@/lib/data'` and, in `personSchema`, replace `description: heroContent.lede,` with `description: aboutPageContent.answer,`.

`lib/llms.ts`: change the data import to `import { aboutPageContent, availability, caseStudyContent, contactInfo, education, experience, heroContent, projects, services } from '@/lib/data'` and replace the body of `header()` with:

```ts
function header(): string {
  return [
    `# ${heroContent.name}`,
    '',
    `> ${aboutPageContent.answer}`,
    '',
    `${heroContent.subheadline} Based in ${contactInfo.location}. ${availability}.`,
  ].join('\n')
}
```

`lib/chat-context.ts`: add `import { elevationFigures } from '@/lib/elevation'` after the `@/lib/data` import, and replace

```ts
- Proof points: ${heroContent.proofPoints.join('. ')}.
```

with

```ts
- Proof points: ${elevationFigures().map((f) => `${f.value} ${f.label}`).join('; ')}.
```

`lib/proof.ts`: delete `splitProofPoint` and the doc comment above it (from `/**\n * "Fifteen projects shipped"` to the function's closing `}`). Keep `NUMBER_WORDS` and `numberWord`.

- [ ] **Step 5: Update the tests that read the deleted fields**

Replace the whole of `tests/content/proof.test.ts` with:

```ts
import { describe, expect, it } from 'vitest'
import { numberWord } from '@/lib/proof'

describe('numberWord', () => {
  it('writes a count as a word, the way copy reads', () => {
    expect(numberWord(4)).toBe('four')
    expect(numberWord(19)).toBe('nineteen')
  })

  it('refuses a count it has no word for', () => {
    expect(() => numberWord(0)).toThrow()
    expect(() => numberWord(21)).toThrow()
  })
})
```

`tests/components/catalog-consistency.test.tsx`: replace `import { heroContent, projects, projectsPageContent } from '@/lib/data'` with `import { projects, projectsPageContent, sectionContent } from '@/lib/data'`, and `import { splitProofPoint } from '@/lib/proof'` with `import { elevationFigures } from '@/lib/elevation'`. Replace

```ts
  it('states the shipped count the hero claims, and the staging one, on /projects', () => {
    const claim = heroContent.proofPoints.find((p) => p.endsWith('projects shipped'))!
    expect(Number(splitProofPoint(claim).value)).toBe(shipped)
```

with

```ts
  it('states the shipped count the elevation strip claims, and the staging one, on /projects', () => {
    const figure = elevationFigures().find((f) => f.label === sectionContent.timeline.figures.shipped)!
    expect(figure.value).toBe(shipped)
```

`tests/content/positioning.test.ts`: replace

```ts
  it('names the verticals in the lede and keeps the products, with no em-dash', () => {
    expect(heroContent.lede).toBe(
      'I build websites for hotels, tour operators and restaurants, with online booking and payments where they need them, plus products of my own.',
    )
    expect(heroContent.lede).not.toContain('—')
    expect(heroContent.specialism).not.toContain('—')
  })
```

with

```ts
  it('keeps the specialism free of em-dashes', () => {
    expect(heroContent.specialism).not.toContain('—')
  })
```

and replace

```ts
  it('titles the site with the current positioning', () => {
    expect(String(metadata.title)).toContain(heroContent.title)
    expect(metadata.description).toBe(heroContent.lede)
  })
```

with

```ts
  it('titles the site as the spec’s titles table says, described by the subheadline', () => {
    expect(metadata.title).toBe('Christian Raro · Full-Stack Developer in the Philippines')
    expect(metadata.title).toBe(heroContent.pageTitle)
    expect(metadata.description).toBe(heroContent.subheadline)
  })
```

`tests/content/visible-copy.test.ts`: replace `heroContent.lede,` with `heroContent.subheadline,`.

`tests/content/hero-copy.test.ts`: rename `'keeps the title that metadata and JSON-LD read until S5'` to `'keeps the title the JSON-LD reads as jobTitle'`.

- [ ] **Step 6: Run the tests**

Run: `npm test`
Expected: PASS. `grep -rn "proofPoints\|\.lede\|splitProofPoint" app lib components tests` prints nothing.

- [ ] **Step 7: Gates and commit**

Run the four gates.

```bash
git add lib/data.ts lib/site-metadata.ts lib/structured-data.ts lib/llms.ts lib/chat-context.ts lib/proof.ts components/sections/trailhead.tsx tests/content/proof-band.test.ts tests/content/proof.test.ts tests/components/catalog-consistency.test.tsx tests/content/positioning.test.ts tests/content/visible-copy.test.ts tests/content/hero-copy.test.ts
git commit -m "content(hero): retire proof points and the lede; the elevation figures are the proof" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: The route registry and the sitemap

**Model:** Sonnet

**Files:**
- Create: `lib/site-routes.ts`
- Modify: `lib/project-page.ts` (re-export `projectHref`)
- Modify: `lib/site-metadata.ts` (import the two title builders; add `absoluteUrl`)
- Rewrite: `app/sitemap.ts`
- Create: `tests/content/site-routes.test.ts`
- Modify tests: `tests/content/sitemap.test.ts`, `tests/content/visible-copy.test.ts`, `tests/content/project-page.test.ts` (imports)

**Interfaces:**
- Consumes: `heroContent.pageTitle`, `heroContent.subheadline`, `heroContent.eyebrow`, `heroContent.headline`, `servicePages`, `servicesPageContent`, `aboutPageContent`, `hirePageContent`, `projectsPageContent`, `availability`, `contactInfo`, `projects` (`@/lib/data`); `FLAGSHIP_SLUGS`, `getCaseStudy` (`@/lib/case-studies`).
- Produces (from `@/lib/site-routes`): `type RouteKind = 'home' | 'projects' | 'services' | 'service' | 'about' | 'hire' | 'project'`; `interface Crumb { name: string; path: string }`; `interface OgCard { eyebrow: string; title: string; detail: string }`; `interface SiteRoute { kind: RouteKind; path: string; slug?: string; title: string; description: string; keywords?: string[]; card: OgCard; crumbs: Crumb[]; priority: number }`; `siteRoutes(): SiteRoute[]`; `findRoute(path: string): SiteRoute | undefined`; `routeFor(path: string): SiteRoute` (throws on an unknown path); `projectHref(project: Project): string`; `buildProjectsTitle(band: ProjectBand | null): string`; `buildProjectPageTitle(project: Project): string`. From `@/lib/site-metadata`: `absoluteUrl(path: string): string` (`'/'` gives the bare `SITE_URL`).

- [ ] **Step 1: Write the failing test**

Create `tests/content/site-routes.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { projects, servicePages } from '@/lib/data'
import { buildProjectPageTitle, findRoute, routeFor, siteRoutes } from '@/lib/site-routes'

// Spec §6, the titles table, verbatim.
const TITLES: Record<string, string> = {
  '/': 'Christian Raro · Full-Stack Developer in the Philippines',
  '/services/full-stack-development': 'Full-Stack Web Developer (Next.js, React) · Philippines, remote',
  '/services/wordpress-woocommerce': 'WordPress & WooCommerce Developer · PayMongo, Maya, Xendit, PayPal',
  '/services/ai-automation': 'AI Automation Engineer · n8n, LLM workflows, MCP',
  '/about': 'About Christian Raro · Web Developer in Naga City, Bicol',
  '/hire': 'Hire a Mid-Level Full-Stack Developer · Remote, Philippines',
}

describe('site routes', () => {
  const routes = siteRoutes()
  const paths = routes.map((r) => r.path)

  it('list every page once: home, services and its pages, hire, about, projects, every project', () => {
    expect(paths).toEqual([
      '/',
      '/services',
      ...servicePages.map((s) => `/services/${s.slug}`),
      '/hire',
      '/about',
      '/projects',
      ...projects.map((p) => `/projects/${p.slug}`),
    ])
    expect(new Set(paths).size).toBe(paths.length)
  })

  it.each(Object.entries(TITLES))('title %s as the spec’s table says', (path, title) => {
    expect(routeFor(path).title).toBe(title)
  })

  it('title each project page {Project} · {summary} · Christian Raro', () => {
    for (const p of projects) {
      expect(routeFor(`/projects/${p.slug}`).title).toBe(`${p.title} · ${p.summary} · Christian Raro`)
      expect(buildProjectPageTitle(p)).toBe(`${p.title} · ${p.summary} · Christian Raro`)
    }
  })

  it('give every route a description, card words and a breadcrumb trail from Home to itself', () => {
    for (const r of routes) {
      expect(r.description.trim(), r.path).not.toBe('')
      for (const text of [r.card.eyebrow, r.card.title, r.card.detail]) expect(text.trim(), r.path).not.toBe('')
      expect(r.crumbs[0]).toEqual({ name: 'Home', path: '/' })
      expect(r.crumbs[r.crumbs.length - 1].path).toBe(r.path)
      expect(r.title).not.toContain('—')
    }
  })

  it('carry each service, /about and /hire’s keyword', () => {
    for (const s of servicePages) expect(routeFor(`/services/${s.slug}`).keywords).toEqual([s.keyword])
    expect(routeFor('/about').keywords).toHaveLength(1)
    expect(routeFor('/hire').keywords).toHaveLength(1)
    expect(routeFor('/').keywords).toBeUndefined()
  })

  it('find a known path and refuse an unknown one', () => {
    expect(findRoute('/about')?.kind).toBe('about')
    expect(findRoute('/nope')).toBeUndefined()
    expect(() => routeFor('/nope')).toThrow()
  })
})
```

In `tests/content/sitemap.test.ts`, add these imports and a test inside the `describe`:

```ts
import { absoluteUrl } from '@/lib/site-metadata'
import { siteRoutes } from '@/lib/site-routes'
```

```ts
  it('lists every route in lib/site-routes.ts once, in its order', () => {
    expect(urls).toEqual(siteRoutes().map((r) => absoluteUrl(r.path)))
  })
```

(Keep `SITE_URL` in the existing `@/lib/site-metadata` import: `import { SITE_URL, absoluteUrl } from '@/lib/site-metadata'`.)

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/content/site-routes.test.ts tests/content/sitemap.test.ts`
Expected: FAIL: `@/lib/site-routes` does not exist; `absoluteUrl` is not exported.

- [ ] **Step 3: Write the registry**

Create `lib/site-routes.ts`:

```ts
import { FLAGSHIP_SLUGS, getCaseStudy } from '@/lib/case-studies'
import {
  aboutPageContent,
  availability,
  contactInfo,
  heroContent,
  hirePageContent,
  projects,
  projectsPageContent,
  servicePages,
  servicesPageContent,
} from '@/lib/data'
import type { Project, ProjectBand } from '@/types'

// Every page a visitor or a crawler can reach, once. The metadata, the
// link-preview cards (app/og), the JSON-LD, the sitemap, the AI files and the
// chat prompt all read this list, so a page added here reaches all of them.
// Pure (no filesystem), so the edge card route can import it; that is why
// projectHref lives here and lib/project-page.ts only re-exports it.

export type RouteKind = 'home' | 'projects' | 'services' | 'service' | 'about' | 'hire' | 'project'

export interface Crumb {
  name: string
  path: string
}

/** What a route's link-preview card says (app/og/[[...path]]/route.tsx). */
export interface OgCard {
  eyebrow: string
  title: string
  detail: string
}

export interface SiteRoute {
  kind: RouteKind
  path: string
  /** The service or project slug, for the kinds that have one. */
  slug?: string
  /** The <title>: spec §6's table where it has a row. */
  title: string
  /** The meta description: the page's own opening answer or description. */
  description: string
  keywords?: string[]
  card: OgCard
  /** Home first, the page itself last. */
  crumbs: Crumb[]
  /** Sitemap priority: the fork's paths above the inventory, case studies above short pages. */
  priority: number
}

export function projectHref(project: Project): string {
  return `/projects/${project.slug}`
}

/** /projects's title, naming the band when a filter is applied. */
export function buildProjectsTitle(band: ProjectBand | null): string {
  return band ? `${band} · Projects · ${heroContent.name}` : `Projects · ${heroContent.name}`
}

/** Spec §6: {Project} · {summary} · Christian Raro. */
export function buildProjectPageTitle(project: Project): string {
  return `${project.title} · ${project.summary} · ${heroContent.name}`
}

// Breadcrumb names for the two pages with no eyebrow of their own: interface chrome.
const HOME: Crumb = { name: 'Home', path: '/' }
const PROJECTS: Crumb = { name: 'Projects', path: '/projects' }

export function siteRoutes(): SiteRoute[] {
  const services: Crumb = { name: servicesPageContent.eyebrow, path: '/services' }

  const projectRoutes = projects.map((p): SiteRoute => {
    const study = getCaseStudy(p.slug)
    return {
      kind: 'project',
      path: projectHref(p),
      slug: p.slug,
      title: buildProjectPageTitle(p),
      // The summary is a dot-separated fragment; the description reads as a sentence.
      description: study ? study.brief[0] : p.description,
      card: { eyebrow: p.band, title: p.title, detail: p.summary },
      crumbs: [HOME, PROJECTS, { name: p.title, path: projectHref(p) }],
      priority: FLAGSHIP_SLUGS.indexOf(p.slug) === -1 ? 0.5 : 0.7,
    }
  })

  return [
    {
      kind: 'home',
      path: '/',
      title: heroContent.pageTitle,
      description: heroContent.subheadline,
      card: { eyebrow: heroContent.eyebrow, title: heroContent.headline, detail: availability },
      crumbs: [HOME],
      priority: 1,
    },
    {
      kind: 'services',
      path: '/services',
      title: servicesPageContent.title,
      description: servicesPageContent.answer,
      card: {
        eyebrow: servicesPageContent.eyebrow,
        title: servicesPageContent.heading,
        detail: servicePages.map((s) => s.name).join(' · '),
      },
      crumbs: [HOME, services],
      priority: 0.9,
    },
    ...servicePages.map(
      (s): SiteRoute => ({
        kind: 'service',
        path: `/services/${s.slug}`,
        slug: s.slug,
        title: s.title,
        description: s.answer,
        keywords: [s.keyword],
        card: { eyebrow: servicesPageContent.eyebrow, title: s.name, detail: s.summary },
        crumbs: [HOME, services, { name: s.name, path: `/services/${s.slug}` }],
        priority: 0.9,
      }),
    ),
    {
      kind: 'hire',
      path: '/hire',
      title: hirePageContent.title,
      description: hirePageContent.answer,
      keywords: [hirePageContent.keyword],
      card: { eyebrow: hirePageContent.eyebrow, title: hirePageContent.heading, detail: availability },
      crumbs: [HOME, { name: hirePageContent.eyebrow, path: '/hire' }],
      priority: 0.9,
    },
    {
      kind: 'about',
      path: '/about',
      title: aboutPageContent.title,
      description: aboutPageContent.answer,
      keywords: [aboutPageContent.keyword],
      card: { eyebrow: aboutPageContent.eyebrow, title: aboutPageContent.heading, detail: contactInfo.location },
      crumbs: [HOME, { name: aboutPageContent.eyebrow, path: '/about' }],
      priority: 0.8,
    },
    {
      kind: 'projects',
      path: '/projects',
      title: buildProjectsTitle(null),
      description: projectsPageContent.description,
      card: {
        eyebrow: projectsPageContent.eyebrow,
        title: projectsPageContent.title,
        detail: projectsPageContent.description,
      },
      crumbs: [HOME, PROJECTS],
      priority: 0.8,
    },
    ...projectRoutes,
  ]
}

export function findRoute(path: string): SiteRoute | undefined {
  return siteRoutes().find((r) => r.path === path)
}

export function routeFor(path: string): SiteRoute {
  const route = findRoute(path)
  if (!route) throw new Error(`No route at ${path}`)
  return route
}
```

- [ ] **Step 4: Point the old homes at it**

`lib/project-page.ts`: delete the `projectHref` function and add, below the other imports:

```ts
import { projectHref } from '@/lib/site-routes'
```

and, directly under the module comment ("Server-only helpers …"):

```ts
// projectHref lives in lib/site-routes.ts (pure, so the edge card route can use
// it); re-exported here for the pages and modules that import it from here.
export { projectHref }
```

`lib/site-metadata.ts`: delete `buildProjectsTitle` and `buildProjectPageTitle` (each with its doc comment); change the type import to `import type { Project, ProjectBand } from '@/types'` (unchanged if already so) and add `import { buildProjectPageTitle, buildProjectsTitle } from '@/lib/site-routes'`. After `SITE_URL` add:

```ts
/** A site path as an absolute URL; the homepage is the bare origin. */
export function absoluteUrl(path: string): string {
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`
}
```

Replace the whole of `app/sitemap.ts` with:

```ts
import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/site-metadata'
import { siteRoutes } from '@/lib/site-routes'

// Every route in lib/site-routes.ts, in its order and at its priority: the
// paths from the fork rank above the inventory, case studies above short pages.
export default function sitemap(): MetadataRoute.Sitemap {
  return siteRoutes().map((r) => ({
    url: absoluteUrl(r.path),
    changeFrequency: 'monthly' as const,
    priority: r.priority,
  }))
}
```

Test imports: in `tests/content/visible-copy.test.ts` replace `import { buildProjectsTitle, buildSiteMetadata } from '@/lib/site-metadata'` with `import { buildSiteMetadata } from '@/lib/site-metadata'` and `import { buildProjectsTitle } from '@/lib/site-routes'`. In `tests/content/project-page.test.ts` replace `import { buildProjectPageTitle } from '@/lib/site-metadata'` with `import { buildProjectPageTitle } from '@/lib/site-routes'`.

- [ ] **Step 5: Run the tests**

Run: `npm test`
Expected: PASS (project titles now carry the summary; `project-page` tests only check the `{title} · ` prefix).

- [ ] **Step 6: Gates and commit**

Run the four gates.

```bash
git add lib/site-routes.ts lib/project-page.ts lib/site-metadata.ts app/sitemap.ts tests/content/site-routes.test.ts tests/content/sitemap.test.ts tests/content/visible-copy.test.ts tests/content/project-page.test.ts
git commit -m "feat(seo): one route registry; the sitemap and titles read it" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: The trail-map card for every route

**Model:** Sonnet

**Files:**
- Create: `app/og/[[...path]]/route.tsx`
- Rewrite: `lib/og-palette.ts`
- Modify: `lib/site-metadata.ts` (`OG_SIZE`, `OgImage`, `ogImage`; `OG_IMAGE` points at `/og`; the layout names the home card)
- Modify: `tests/design/og-palette.test.ts` (day theme, re-enabled)
- Create: `tests/components/og-card.test.tsx`
- Modify tests: `tests/content/positioning.test.ts`, `tests/components/project-page.test.tsx`
- Delete: `app/opengraph-image.tsx`, `app/fonts/recursive-mono-500.ttf`, `tests/components/opengraph-image.test.tsx`

**Interfaces:**
- Consumes: `findRoute`, `routeFor`, `SiteRoute.card` (`@/lib/site-routes`); `SITE_URL`; `heroContent.name`.
- Produces: `GET(request: Request, ctx: { params: { path?: string[] } }): Promise<Response>` and `runtime = 'edge'` (`@/app/og/[[...path]]/route`); from `@/lib/site-metadata`: `OG_SIZE = { width: 1200, height: 630 }`, `interface OgImage { url: string; width: number; height: number; alt: string }`, `ogImage(path: string): OgImage` (url `/og` for `/`, else `/og<path>`; alt = the route's title). `OG_IMAGE` (`= ogImage('/')`) survives this task only; Task 5 deletes it. `ogPalette` keys: `bg`, `ink`, `muted`, `line`, `contour`, `trail`.

- [ ] **Step 1: Write the failing tests**

In `tests/design/og-palette.test.ts`, replace the comment and `darkTriplet` function and the `describe.skip` block (keep `oklchToHex` as it is):

```ts
// The cards cannot read CSS variables, so they carry hex copies of the day
// theme, the site's default. Convert each `:root` oklch triplet in
// globals.css to sRGB hex and hold the copies to it, so a palette change
// cannot leave the cards behind.
function dayTriplet(token: OgToken): [number, number, number] {
  const css = readFileSync('app/globals.css', 'utf8')
  const start = css.indexOf(':root {')
  const day = css.slice(start, css.indexOf('}', start))
  const line = day.split('\n').find((l) => l.trim().startsWith(`--${token}:`))
  const match = line?.match(/:\s*([\d.]+)\s+([\d.]+)\s+([\d.]+);/)
  if (!match) throw new Error(`--${token} not found in :root`)
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}
```

```ts
describe('link-preview card palette', () => {
  it.each(Object.keys(ogPalette) as OgToken[])('%s matches the day theme token', (token) => {
    expect(ogPalette[token]).toBe(oklchToHex(dayTriplet(token)))
  })
})
```

Create `tests/components/og-card.test.tsx`:

```tsx
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GET, runtime } from '@/app/og/[[...path]]/route'
import { OG_SIZE, ogImage } from '@/lib/site-metadata'
import { siteRoutes } from '@/lib/site-routes'

const SOURCE = 'app/og/[[...path]]/route.tsx'
const call = (path: string[] | undefined) => GET(new Request('https://example.test/og'), { params: { path } })

describe('link-preview cards', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('run on the edge runtime, where next/og builds on Windows', () => {
    expect(runtime).toBe('edge')
  })

  it('answer 404 for a path that is not a page, before loading the font', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    expect((await call(['nope'])).status).toBe(404)
    expect((await call(['projects', 'nope'])).status).toBe(404)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('name one card per route at the route’s own path under /og, described by its title', () => {
    for (const r of siteRoutes()) {
      expect(ogImage(r.path)).toEqual({ url: r.path === '/' ? '/og' : `/og${r.path}`, width: 1200, height: 630, alt: r.title })
    }
    expect(OG_SIZE).toEqual({ width: 1200, height: 630 })
  })

  it('read one static font from app/fonts and write no colour of their own', () => {
    const source = readFileSync(SOURCE, 'utf8')
    expect(source).toContain("new URL('../../fonts/recursive-sans-600.ttf', import.meta.url)")
    expect(existsSync('app/fonts/recursive-sans-600.ttf')).toBe(true)
    expect(source).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)
    expect(existsSync('app/opengraph-image.tsx')).toBe(false)
  })

  // Outside Next, next/og runs its Node build, which throws "Invalid URL" on
  // Windows; CI renders on Linux. Node's fetch cannot read file: URLs, so the
  // font is served from disk.
  it.skipIf(process.platform === 'win32')('render a 1200×630 PNG for the homepage, a service and a project', async () => {
    vi.stubGlobal('fetch', async (url: URL) => new Response(readFileSync(fileURLToPath(url))))
    for (const path of [undefined, ['services', 'ai-automation'], ['projects', 'giya']]) {
      const response = await call(path)
      expect(response.status).toBe(200)
      const png = Buffer.from(await response.arrayBuffer())
      expect(png.subarray(0, 8)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
      expect(png.readUInt32BE(16)).toBe(1200)
      expect(png.readUInt32BE(20)).toBe(630)
    }
  }, 60000)
})
```

In `tests/content/positioning.test.ts`, add `ogImage` to the `@/lib/site-metadata` import (`import { buildSiteMetadata, ogImage } from '@/lib/site-metadata'`) and replace

```ts
  it('leaves the preview image to app/opengraph-image.tsx, not the retired PNG', () => {
    expect(serialized).not.toContain('og-image.png')
    expect(existsSync('app/opengraph-image.tsx')).toBe(true)
  })
```

with

```ts
  it('names the homepage card from app/og, not the retired PNG or file-convention card', () => {
    expect(serialized).not.toContain('og-image.png')
    expect(metadata.openGraph?.images).toEqual([ogImage('/')])
    expect(metadata.twitter?.images).toEqual([ogImage('/')])
    expect(existsSync('app/og/[[...path]]/route.tsx')).toBe(true)
    expect(existsSync('app/opengraph-image.tsx')).toBe(false)
  })
```

In `tests/components/project-page.test.tsx`, replace `import { alt, size } from '@/app/opengraph-image'` with `import { OG_IMAGE } from '@/lib/site-metadata'`, and replace

```ts
  // A page that sets its own openGraph loses the layout's file-convention image,
  // so it names the same card, app/opengraph-image.tsx, itself.
  it('keeps the site social card as the preview image', () => {
    const md = generateMetadata({ params: { slug: 'latag' } })
    const card = { url: '/opengraph-image', width: size.width, height: size.height, alt }
    expect(md.openGraph).toMatchObject({ images: [card] })
    expect(md.twitter).toMatchObject({ images: [card] })
  })
```

with

```ts
  it('names a link-preview card from app/og', () => {
    const md = generateMetadata({ params: { slug: 'latag' } })
    expect(md.openGraph).toMatchObject({ images: [OG_IMAGE] })
    expect(md.twitter).toMatchObject({ images: [OG_IMAGE] })
  })
```

Delete `tests/components/opengraph-image.test.tsx` (`git rm`).

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/design/og-palette.test.ts tests/components/og-card.test.tsx tests/content/positioning.test.ts`
Expected: FAIL: `--accent not found in :root` (its value is `var(--trail)`), the card route does not exist, `ogImage` is not exported.

- [ ] **Step 3: The day palette**

Replace the whole of `lib/og-palette.ts` with:

```ts
// The day theme's tokens as hex, for the link-preview cards (app/og). The site
// opens in the day theme (ThemeProvider defaultTheme="light"), so the cards do
// too. ImageResponse renders outside the page and cannot read CSS variables;
// tests/design/og-palette.test.ts converts each `:root` oklch triplet in
// app/globals.css to sRGB and fails if these drift from it.
export const ogPalette = {
  bg: '#EAEFE4',
  ink: '#1A1F15',
  muted: '#575E4F',
  line: '#D1D7C9',
  contour: '#91976D',
  trail: '#B71C0E',
} as const

export type OgToken = keyof typeof ogPalette
```

- [ ] **Step 4: Name the cards in the metadata module**

In `lib/site-metadata.ts`, change the site-routes import to `import { buildProjectPageTitle, buildProjectsTitle, routeFor } from '@/lib/site-routes'` and replace

```ts
/** The social card app/opengraph-image.tsx renders, and the route it serves at. */
export const OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: `${heroContent.name} · ${heroContent.title}. ${heroContent.specialism}.`,
}
```

with

```ts
export const OG_SIZE = { width: 1200, height: 630 } as const

export interface OgImage {
  url: string
  width: number
  height: number
  alt: string
}

/** A route's link-preview card (app/og/[[...path]]/route.tsx), at the route's own path under /og. */
export function ogImage(path: string): OgImage {
  return { url: path === '/' ? '/og' : `/og${path}`, ...OG_SIZE, alt: routeFor(path).title }
}

/** The homepage's card. Every page names it until Task 5 gives each its own. */
export const OG_IMAGE = ogImage('/')
```

In `buildSiteMetadata`, add `images: [OG_IMAGE],` to both the `openGraph` and the `twitter` objects (the deleted file convention used to fill them). Update the comment above `buildSiteMetadata` that mentions `app/opengraph-image.tsx` to: `// The link-preview card is app/og's homepage card, named here because there is no file-convention image any more.`

- [ ] **Step 5: Write the card route**

Create `app/og/[[...path]]/route.tsx`:

```tsx
import { ImageResponse } from 'next/og'
import { heroContent } from '@/lib/data'
import { ogPalette as c } from '@/lib/og-palette'
import { OG_SIZE, SITE_URL } from '@/lib/site-metadata'
import { findRoute } from '@/lib/site-routes'

// One link-preview card per page (spec §6), at the page's own path under /og:
// /og is the homepage's, /og/about the about page's, /og/projects/giya Giya's.
// One layout in the trail palette; the words come from the page's route in
// lib/site-routes.ts, so a path that is not a page gets a 404, never a card
// with words a stranger chose.
//
// Edge runtime, not Node: next/og's Node build locates its wasm with
// path.join(import.meta.url, ...), which throws "Invalid URL" on Windows and
// failed `next build` there. The edge build imports its wasm instead. Edge
// routes render per request, so the font is fetched as a bundled asset.
// Recursive Sans is a static instance from Google Fonts (SIL Open Font
// License) in app/fonts: ImageResponse cannot read a variable font, and the
// site's Archivo ships as one.
export const runtime = 'edge'

const SANS = 'Recursive'

// The card's survey linework, authored for 1200×630 and kept to the right
// third so it never runs under the words: contours, and the trail ending at
// the "you are here" dot (trail red's one use on the card).
const CONTOURS = [
  'M 860 0 C 900 80 980 120 1060 140 S 1170 190 1200 200',
  'M 960 0 C 990 50 1050 80 1110 92 S 1180 110 1200 112',
  'M 880 630 C 900 540 960 470 1040 430 S 1170 330 1200 300',
  'M 960 630 C 980 560 1030 510 1100 480 S 1180 410 1200 395',
  'M 1040 630 C 1060 590 1100 560 1150 545 S 1190 530 1200 528',
]
const TRAIL = 'M 900 630 C 930 560 980 500 1030 440 S 1100 330 1120 300'
const HERE = { cx: 1120, cy: 300 }

const host = new URL(SITE_URL).host

export async function GET(_request: Request, { params }: { params: { path?: string[] } }) {
  const route = findRoute(`/${(params.path ?? []).join('/')}`)
  if (!route) return new Response('Not found', { status: 404 })
  const { card } = route

  const sans = await fetch(new URL('../../fonts/recursive-sans-600.ttf', import.meta.url)).then((res) =>
    res.arrayBuffer(),
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: c.bg,
          color: c.ink,
          fontFamily: SANS,
        }}
      >
        <svg
          width={OG_SIZE.width}
          height={OG_SIZE.height}
          viewBox={`0 0 ${OG_SIZE.width} ${OG_SIZE.height}`}
          style={{ position: 'absolute', left: 0, top: 0 }}
        >
          {CONTOURS.map((d) => (
            <path key={d} d={d} fill="none" stroke={c.contour} strokeWidth={2} />
          ))}
          <path d={TRAIL} fill="none" stroke={c.trail} strokeWidth={5} strokeLinecap="round" />
          <circle cx={HERE.cx} cy={HERE.cy} r={11} fill={c.trail} />
        </svg>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '64px 80px 56px',
          }}
        >
          <div style={{ display: 'flex', fontSize: 24, letterSpacing: 3, textTransform: 'uppercase', color: c.muted }}>
            {card.eyebrow}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 760 }}>
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
            <div style={{ display: 'flex', marginTop: 24, fontSize: 28, lineHeight: 1.3, color: c.muted }}>
              {card.detail}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 24,
              borderTop: `2px solid ${c.line}`,
              fontSize: 24,
            }}
          >
            <span style={{ color: c.ink }}>{heroContent.name}</span>
            <span style={{ color: c.muted }}>{host}</span>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: SANS, data: sans, weight: 600, style: 'normal' }] },
  )
}
```

Delete the old card and its unused font:

```bash
git rm app/opengraph-image.tsx app/fonts/recursive-mono-500.ttf tests/components/opengraph-image.test.tsx
```

- [ ] **Step 6: Run the tests**

Run: `npm test`
Expected: PASS (on Windows the render test is skipped; the 404, naming, source and palette tests run).

- [ ] **Step 7: Gates and commit**

Delete `.next` first (the deleted route leaves a stale type file), then run the four gates. The build lists `ƒ /og/[[...path]]` and no `/opengraph-image`.

```bash
git add app/og lib/og-palette.ts lib/site-metadata.ts tests/design/og-palette.test.ts tests/components/og-card.test.tsx tests/content/positioning.test.ts tests/components/project-page.test.tsx
git commit -m "feat(seo): a trail-map card for every route, in the day palette" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Per-route metadata

**Model:** Sonnet

**Files:**
- Modify: `lib/site-metadata.ts` (`buildRouteMetadata`, `buildProjectsMetadata` on the registry; delete `buildPageMetadata`, `buildProjectPageMetadata`, `OG_IMAGE`)
- Modify: `lib/structured-data.ts` (the Person's and service's `image` off `OG_IMAGE`)
- Modify: `app/page.tsx`, `app/services/page.tsx`, `app/services/[slug]/page.tsx`, `app/about/page.tsx`, `app/hire/page.tsx`, `app/projects/[slug]/page.tsx`
- Rewrite: `tests/content/page-metadata.test.ts`
- Modify: `tests/components/project-page.test.tsx`

**Interfaces:**
- Consumes: `routeFor`, `SiteRoute`, `buildProjectsTitle` (`@/lib/site-routes`); `ogImage`, `absoluteUrl` (Tasks 3-4).
- Produces (from `@/lib/site-metadata`): `buildRouteMetadata(path: string): Metadata` (title, description, keywords when the route has them, canonical, `openGraph` (`article` for a project, else `website`) and `twitter`, both naming `ogImage(path)`); `buildProjectsMetadata(band: ProjectBand | null): Metadata` (the `/projects` route with the band's title). `buildSiteMetadata` keeps its signature.

- [ ] **Step 1: Write the failing test**

Replace the whole of `tests/content/page-metadata.test.ts` with:

```ts
import { readFileSync } from 'node:fs'
import type { Metadata } from 'next'
import { describe, expect, it } from 'vitest'
import { metadata as aboutMetadata } from '@/app/about/page'
import { metadata as hireMetadata } from '@/app/hire/page'
import { metadata as homeMetadata } from '@/app/page'
import { generateMetadata as projectsMetadata } from '@/app/projects/page'
import { generateMetadata as projectMetadata } from '@/app/projects/[slug]/page'
import { metadata as servicesMetadata } from '@/app/services/page'
import { generateMetadata as serviceMetadata } from '@/app/services/[slug]/page'
import { ogImage } from '@/lib/site-metadata'
import { siteRoutes, type SiteRoute } from '@/lib/site-routes'

// Each route's metadata as the page itself exports it.
function metadataOf(route: SiteRoute): Metadata {
  switch (route.kind) {
    case 'home':
      return homeMetadata
    case 'projects':
      return projectsMetadata({ searchParams: {} })
    case 'services':
      return servicesMetadata
    case 'service':
      return serviceMetadata({ params: { slug: route.slug! } })
    case 'about':
      return aboutMetadata
    case 'hire':
      return hireMetadata
    case 'project':
      return projectMetadata({ params: { slug: route.slug! } })
  }
}

describe('every page carries its own title, description, canonical and card', () => {
  it.each(siteRoutes().map((r) => [r.path, r] as const))('%s', (_path, route) => {
    const m = metadataOf(route)
    expect(m.title).toBe(route.title)
    expect(m.description).toBe(route.description)
    expect(m.alternates?.canonical).toBe(route.path)
    expect(m.openGraph).toMatchObject({
      title: route.title,
      description: route.description,
      url: route.path,
      images: [ogImage(route.path)],
    })
    expect(m.twitter).toMatchObject({
      card: 'summary_large_image',
      title: route.title,
      description: route.description,
      images: [ogImage(route.path)],
    })
  })

  it('marks a project page as an article and every other page as a website', () => {
    for (const r of siteRoutes()) {
      expect(metadataOf(r).openGraph, r.path).toMatchObject({ type: r.kind === 'project' ? 'article' : 'website' })
    }
  })

  it('titles a filtered /projects view by its band, on the unfiltered page’s canonical and card', () => {
    const m = projectsMetadata({ searchParams: { band: 'sites' } })
    expect(m.title).toBe('Sites · Projects · Christian Raro')
    expect(m.alternates?.canonical).toBe('/projects')
    expect(m.openGraph).toMatchObject({ title: m.title, url: '/projects', images: [ogImage('/projects')] })
  })

  it('names no retired card anywhere', () => {
    for (const file of ['lib/site-metadata.ts', 'lib/structured-data.ts', 'app/layout.tsx']) {
      expect(readFileSync(file, 'utf8'), file).not.toMatch(/opengraph-image|OG_IMAGE/)
    }
  })
})
```

In `tests/components/project-page.test.tsx`, replace `import { OG_IMAGE } from '@/lib/site-metadata'` with `import { ogImage } from '@/lib/site-metadata'`, and replace the body of `'names a link-preview card from app/og'` with:

```ts
    const md = generateMetadata({ params: { slug: 'latag' } })
    expect(md.openGraph).toMatchObject({ images: [ogImage('/projects/latag')] })
    expect(md.twitter).toMatchObject({ images: [ogImage('/projects/latag')] })
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/content/page-metadata.test.ts tests/components/project-page.test.tsx`
Expected: FAIL: the homepage has no title of its own, every card is `/og`, and `OG_IMAGE` is still in `lib/site-metadata.ts`.

- [ ] **Step 3: Rewrite the builders**

In `lib/site-metadata.ts`:

- Change the site-routes import to `import { buildProjectsTitle, routeFor, type SiteRoute } from '@/lib/site-routes'` and the types import to `import type { ProjectBand } from '@/types'`.
- Delete `OG_IMAGE` (and its comment), `buildProjectsMetadata`, `buildProjectPageMetadata`, `buildPageMetadata` (each with its doc comment).
- Replace the body of `buildSiteMetadata` from `const title = …` through `twitter: { … },` with:

```ts
  const home = routeFor('/')
  const image = ogImage('/')

  return {
    metadataBase: new URL(siteUrl),
    ...(googleVerification ? { verification: { google: googleVerification } } : {}),
    title: home.title,
    description: home.description,
    keywords: [
      heroContent.name,
      heroContent.title,
      'full-stack developer Philippines',
      'Next.js',
      'WordPress',
      'WooCommerce',
      'AI automation',
      'Naga City',
      'Philippines',
    ],
    authors: [{ name: heroContent.name }],
    creator: heroContent.name,
    openGraph: {
      ...OPEN_GRAPH_BASE,
      type: 'website',
      url: siteUrl,
      title: home.title,
      description: home.description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: home.title,
      description: home.description,
      images: [image],
    },
```

(the `robots` block and the closing lines stay as they are). Then append:

```ts
// A page's own link preview: its title and description, its canonical URL and
// og:url (relative; the layout's metadataBase resolves them), and its own card.
// Without this a page inherits the layout's openGraph, whose url is the homepage.
function routeMetadata(route: SiteRoute, title: string): Metadata {
  const image = ogImage(route.path)
  const { description, path } = route
  return {
    title,
    description,
    ...(route.keywords ? { keywords: route.keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      ...OPEN_GRAPH_BASE,
      type: route.kind === 'project' ? 'article' : 'website',
      title,
      description,
      url: path,
      images: [image],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

/** Every page's metadata, from its route in lib/site-routes.ts. */
export function buildRouteMetadata(path: string): Metadata {
  const route = routeFor(path)
  return routeMetadata(route, route.title)
}

/**
 * /projects's metadata: every ?band= filter canonicalises to the unfiltered
 * page and shares its card; the title names the band.
 */
export function buildProjectsMetadata(band: ProjectBand | null): Metadata {
  return routeMetadata(routeFor('/projects'), buildProjectsTitle(band))
}
```

In `lib/structured-data.ts`, change `import { OG_IMAGE, SITE_URL } from '@/lib/site-metadata'` to `import { SITE_URL, absoluteUrl } from '@/lib/site-metadata'` and replace both `image: absolute(OG_IMAGE.url),` lines with `image: absoluteUrl(heroContent.portrait),` (Task 6 rewrites this file; this keeps it compiling).

- [ ] **Step 4: Wire every page**

- `app/page.tsx`: add `import { buildRouteMetadata } from '@/lib/site-metadata'`; replace the two comment lines above the metadata and the export with:

```ts
// The layout's metadata has no canonical (it would leak to the 404 page), so
// the homepage sets its own, with its title, description and card.
export const metadata: Metadata = buildRouteMetadata('/')
```

- `app/services/page.tsx`: import `buildRouteMetadata` instead of `buildPageMetadata`; `export const metadata: Metadata = buildRouteMetadata('/services')`.
- `app/services/[slug]/page.tsx`: same import; in `generateMetadata`, `return buildRouteMetadata(\`/services/${service.slug}\`)`.
- `app/about/page.tsx`: same import; `export const metadata: Metadata = buildRouteMetadata('/about')`.
- `app/hire/page.tsx`: same import; `export const metadata: Metadata = buildRouteMetadata('/hire')`.
- `app/projects/[slug]/page.tsx`: import `buildRouteMetadata` instead of `buildProjectPageMetadata`; replace the body of `generateMetadata` with:

```ts
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) return {}
  return buildRouteMetadata(projectHref(project))
```

(`app/projects/page.tsx` keeps calling `buildProjectsMetadata`.)

- [ ] **Step 5: Run the tests**

Run: `npm test`
Expected: PASS. `grep -rn "buildPageMetadata\|buildProjectPageMetadata\|OG_IMAGE" app lib tests` prints nothing.

- [ ] **Step 6: Gates and commit**

Run the four gates.

```bash
git add lib/site-metadata.ts lib/structured-data.ts app/page.tsx app/services/page.tsx "app/services/[slug]/page.tsx" app/about/page.tsx app/hire/page.tsx "app/projects/[slug]/page.tsx" tests/content/page-metadata.test.ts tests/components/project-page.test.tsx
git commit -m "feat(seo): every route its own title, description, canonical and card" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: The JSON-LD entity graph, one per page

**Model:** Sonnet (may load `claude-seo:seo-schema` first)

**Files:**
- Modify: `types/index.ts` (append `ServiceArea`), `lib/data.ts` (`serviceArea`)
- Rewrite: `lib/structured-data.ts`
- Modify: `app/layout.tsx` (no graph), and the seven page files (each renders its graph)
- Create: `tests/helpers/json-ld.ts`
- Rewrite: `tests/content/structured-data.test.ts`
- Modify: `tests/components/project-page.test.tsx` (`project page JSON-LD`)

**Interfaces:**
- Consumes: `siteRoutes`, `routeFor`, `projectHref`, `Crumb`, `SiteRoute` (`@/lib/site-routes`); `SITE_URL`, `absoluteUrl`; `canLinkLive` (`@/lib/project-page`); `getCaseStudy`; data: `aboutPageContent`, `contactInfo`, `education`, `experience`, `heroContent`, `pagesUpdated`, `projects`, `serviceArea`, `servicePages`, `skills`, `socialLinks`.
- Produces (from `@/lib/structured-data`): `type JsonLdNode = Record<string, unknown>`; `PERSON_ID`, `WEBSITE_ID`; `NODE_TYPES` (`['Person', 'WebSite', 'BreadcrumbList', 'ProfilePage', 'Service', 'CreativeWork', 'SoftwareApplication']`); `personSchema()`, `websiteSchema()`, `breadcrumbSchema(crumbs: Crumb[])`, `profilePageSchema()`, `serviceSchema(service: ServicePage)`, `projectSchemaType(project: Project): 'SoftwareApplication' | 'CreativeWork'`, `projectSchema(project: Project)`, `graph(...nodes)`, `routeGraph(route: SiteRoute)`, `graphFor(path: string)`. `SERVICE_ID`, `caseStudySchema` and the `ProfessionalService` node are gone. From `@/tests/helpers/json-ld`: `danglingRefs(graph: JsonLdNode): string[]`, `missingFields(node: JsonLdNode, required: readonly string[]): string[]`. From `@/lib/data`: `serviceArea: ServiceArea` (`{ city: 'Naga City', region: 'Bicol', country: 'Philippines', remote: 'Remote' }`).

- [ ] **Step 1: Write the helpers and the failing test**

Create `tests/helpers/json-ld.ts`:

```ts
import type { JsonLdNode } from '@/lib/structured-data'

// Graph-shape checks for the JSON-LD tests. Each is shown failing in
// tests/content/structured-data.test.ts before it is trusted.

/** Every { '@id': … } reference in the graph whose id is not one of its nodes. */
export function danglingRefs(graph: JsonLdNode): string[] {
  const nodes = graph['@graph'] as JsonLdNode[]
  const ids = new Set(nodes.map((n) => n['@id']).filter((id): id is string => typeof id === 'string'))
  const refs: string[] = []
  const walk = (value: unknown, isNode: boolean): void => {
    if (Array.isArray(value)) {
      value.forEach((v) => walk(v, false))
      return
    }
    if (value === null || typeof value !== 'object') return
    const entries = Object.entries(value)
    if (!isNode && entries.length === 1 && entries[0][0] === '@id') refs.push(String(entries[0][1]))
    for (const [, v] of entries) walk(v, false)
  }
  nodes.forEach((n) => walk(n, true))
  return refs.filter((id) => !ids.has(id))
}

/** The required fields a node lacks: missing, null, an empty string or an empty list. */
export function missingFields(node: JsonLdNode, required: readonly string[]): string[] {
  return required.filter((key) => {
    const v = node[key]
    return v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)
  })
}
```

Replace the whole of `tests/content/structured-data.test.ts` with:

```ts
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { getCaseStudy } from '@/lib/case-studies'
import { contactInfo, education, projects, servicePages, socialLinks } from '@/lib/data'
import { SITE_URL } from '@/lib/site-metadata'
import { siteRoutes } from '@/lib/site-routes'
import {
  NODE_TYPES,
  PERSON_ID,
  WEBSITE_ID,
  graph,
  graphFor,
  personSchema,
  projectSchema,
  projectSchemaType,
  routeGraph,
  websiteSchema,
  type JsonLdNode,
} from '@/lib/structured-data'
import { danglingRefs, missingFields } from '@/tests/helpers/json-ld'
import { privacyIssues } from '@/tests/helpers/privacy'

type NodeType = (typeof NODE_TYPES)[number]

// What each node needs to say anything useful (spec §6, entity graph).
const REQUIRED: Record<NodeType, readonly string[]> = {
  Person: ['@id', 'name', 'jobTitle', 'url', 'address', 'knowsAbout', 'sameAs'],
  WebSite: ['@id', 'url', 'name', 'publisher'],
  BreadcrumbList: ['itemListElement'],
  ProfilePage: ['@id', 'url', 'name', 'dateModified', 'mainEntity'],
  Service: ['@id', 'name', 'description', 'url', 'provider', 'areaServed'],
  CreativeWork: ['@id', 'name', 'description', 'url', 'creator'],
  SoftwareApplication: ['@id', 'name', 'description', 'url', 'creator'],
}

const nodesOf = (g: JsonLdNode) => g['@graph'] as JsonLdNode[]
const typed = (g: JsonLdNode, type: NodeType) => nodesOf(g).filter((n) => n['@type'] === type)
const routes = siteRoutes()

describe('the graph validators can fail', () => {
  it('find a reference to a node the graph does not hold', () => {
    const broken = graph({ '@type': 'WebSite', '@id': 'a', publisher: { '@id': 'missing' } })
    expect(danglingRefs(broken)).toEqual(['missing'])
  })

  it('find a missing or empty required field', () => {
    expect(missingFields({ '@type': 'Person', name: '', sameAs: [] }, ['name', 'sameAs', 'url'])).toEqual(['name', 'sameAs', 'url'])
  })
})

describe('every page’s graph', () => {
  it.each(routes.map((r) => [r.path, r] as const))('%s: known types, required fields, references that resolve', (_path, route) => {
    const g = routeGraph(route)
    expect(g['@context']).toBe('https://schema.org')
    for (const node of nodesOf(g)) {
      const type = node['@type'] as NodeType
      expect(NODE_TYPES).toContain(type)
      expect(missingFields(node, REQUIRED[type]), `${route.path} ${type}`).toEqual([])
    }
    expect(danglingRefs(g)).toEqual([])
    const ids = nodesOf(g).map((n) => n['@id']).filter(Boolean)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('carries one Person with the one @id, and the WebSite', () => {
    for (const r of routes) {
      const g = routeGraph(r)
      expect(typed(g, 'Person'), r.path).toHaveLength(1)
      expect(typed(g, 'Person')[0]['@id']).toBe(PERSON_ID)
      expect(typed(g, 'WebSite')[0]['@id']).toBe(WEBSITE_ID)
    }
  })

  it('breadcrumbs every page but the homepage, Home first and the page last', () => {
    for (const r of routes) {
      const crumbs = typed(routeGraph(r), 'BreadcrumbList')
      if (r.kind === 'home') {
        expect(crumbs).toHaveLength(0)
        continue
      }
      const items = crumbs[0].itemListElement as { position: number; name: string; item: string }[]
      expect(items.map((i) => i.position)).toEqual(r.crumbs.map((_c, i) => i + 1))
      expect(items[0]).toMatchObject({ name: 'Home', item: SITE_URL })
      expect(items[items.length - 1].item).toBe(`${SITE_URL}${r.path}`)
    }
  })

  it('publishes no FAQPage, rating or review, and nothing private', () => {
    for (const r of routes) {
      const text = JSON.stringify(routeGraph(r))
      expect(text).not.toMatch(/"@type":"(?:FAQPage|AggregateRating|Review)"/)
      expect(privacyIssues(text), r.path).toEqual([])
      expect(text).not.toContain('—')
    }
  })
})

describe('the Person', () => {
  const person = personSchema()

  it('is located by locality only', () => {
    expect(person.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Naga City',
      addressRegion: 'Camarines Sur',
      addressCountry: 'PH',
    })
  })

  it('links only the profiles socialLinks holds, and the public email', () => {
    expect(person.sameAs).toEqual(socialLinks.filter((l) => l.url.startsWith('https://')).map((l) => l.url))
    expect(person.email).toBe(contactInfo.email)
  })

  it('works for Online Creative Solutions and studied at Bicol University, as the data says', () => {
    expect(person.worksFor).toEqual([{ '@type': 'Organization', name: 'Online Creative Solutions' }])
    expect(person.alumniOf).toEqual(education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school })))
    expect(education[0].school).toMatch(/^Bicol University/)
  })

  it('lists the AI and automation tools in knowsAbout', () => {
    const known = person.knowsAbout as string[]
    for (const tool of ['Claude Code', 'Codex', 'Qwen Code', 'n8n', 'Groq / LLM APIs', 'Render']) expect(known).toContain(tool)
  })
})

describe('page nodes', () => {
  it('sets a ProfilePage on /about only, its main entity the Person', () => {
    const [page] = typed(graphFor('/about'), 'ProfilePage')
    expect(page).toMatchObject({ url: `${SITE_URL}/about`, mainEntity: { '@id': PERSON_ID }, isPartOf: { '@id': WEBSITE_ID } })
    for (const r of routes.filter((x) => x.kind !== 'about')) expect(typed(routeGraph(r), 'ProfilePage'), r.path).toHaveLength(0)
  })

  it('sets a Service on each service page, provided by the Person, serving Naga City, Bicol, the Philippines and remote', () => {
    for (const s of servicePages) {
      const [service] = typed(graphFor(`/services/${s.slug}`), 'Service')
      expect(service).toMatchObject({
        '@id': `${SITE_URL}/services/${s.slug}#service`,
        name: s.name,
        description: s.answer,
        provider: { '@id': PERSON_ID },
        availableChannel: { '@type': 'ServiceChannel', name: 'Remote' },
      })
      expect((service.areaServed as { name: string }[]).map((a) => a.name)).toEqual(['Naga City', 'Bicol', 'Philippines'])
    }
    expect(typed(graphFor('/services'), 'Service')).toHaveLength(servicePages.length)
  })

  it('types software a visitor runs as SoftwareApplication, and sites and custom systems as CreativeWork', () => {
    for (const p of projects) {
      const expected = p.band === 'Products' || p.band === 'Applications' ? 'SoftwareApplication' : 'CreativeWork'
      expect(projectSchemaType(p), p.slug).toBe(expected)
      const [node] = typed(graphFor(`/projects/${p.slug}`), expected)
      expect(node).toMatchObject({ '@id': `${SITE_URL}/projects/${p.slug}#work`, name: p.title, creator: { '@id': PERSON_ID } })
      expect(node.description).toBe(getCaseStudy(p.slug)?.brief[0] ?? p.description)
    }
  })

  it('links a project live only when it can (canLinkLive)', () => {
    const giya = projects.find((p) => p.slug === 'giya')!
    expect(projectSchema(giya).sameAs).toBe(giya.links.live)
    expect(projectSchema({ ...giya, status: 'internal', links: {} }).sameAs).toBeUndefined()
  })

  it('names the site, published by the Person', () => {
    expect(websiteSchema()).toMatchObject({ '@type': 'WebSite', '@id': WEBSITE_ID, url: SITE_URL, publisher: { '@id': PERSON_ID } })
  })
})

describe('wiring', () => {
  const PAGES: Record<string, string> = {
    'app/page.tsx': "graphFor('/')",
    'app/projects/page.tsx': "graphFor('/projects')",
    'app/projects/[slug]/page.tsx': 'graphFor(projectHref(project))',
    'app/services/page.tsx': "graphFor('/services')",
    'app/services/[slug]/page.tsx': 'graphFor(`/services/${service.slug}`)',
    'app/about/page.tsx': "graphFor('/about')",
    'app/hire/page.tsx': "graphFor('/hire')",
  }

  it.each(Object.entries(PAGES))('%s renders its own graph', (file, call) => {
    expect(readFileSync(file, 'utf8')).toContain(`<JsonLd data={${call}} />`)
  })

  it('leaves the layout without a graph, so no page carries two', () => {
    expect(readFileSync('app/layout.tsx', 'utf8')).not.toMatch(/JsonLd|structured-data/)
  })
})
```

In `tests/components/project-page.test.tsx`, replace the two tests in `describe('project page JSON-LD', …)` with:

```ts
  it('gives a flagship site the Person, the WebSite, a breadcrumb and its CreativeWork', () => {
    expect(ldTypes('el-nido-guide-ph')).toEqual(['Person', 'WebSite', 'BreadcrumbList', 'CreativeWork'])
  })

  it('gives a product a SoftwareApplication, case study or not', () => {
    expect(ldTypes('latag')).toEqual(['Person', 'WebSite', 'BreadcrumbList', 'SoftwareApplication'])
  })
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/content/structured-data.test.ts tests/components/project-page.test.tsx`
Expected: FAIL: `routeGraph`, `graphFor`, `NODE_TYPES`, `projectSchema` are not exported; the pages render no graph of their own.

- [ ] **Step 3: The service area**

Append to `types/index.ts`:

```ts
/** Where the services are offered (spec §6): the Service nodes' areaServed and channel. */
export interface ServiceArea {
  city: string
  region: string
  country: string
  /** How work beyond the region is done. */
  remote: string
}
```

In `lib/data.ts`, change `import type { AboutPageContent, HirePageContent, ServicePage, ServicesPageContent } from '@/types'` to `import type { AboutPageContent, HirePageContent, ServiceArea, ServicePage, ServicesPageContent } from '@/types'`, and after the closing `]` of `export const services` add:

```ts

// Spec §6: the services serve Naga City, Bicol and the Philippines, and
// remote clients. Read by the Service nodes in lib/structured-data.ts.
export const serviceArea: ServiceArea = {
  city: 'Naga City',
  region: 'Bicol',
  country: 'Philippines',
  remote: 'Remote',
}
```

- [ ] **Step 4: Rewrite the graph builder**

Replace the whole of `lib/structured-data.ts` with:

```ts
import { getCaseStudy } from '@/lib/case-studies'
import {
  aboutPageContent,
  contactInfo,
  education,
  experience,
  heroContent,
  pagesUpdated,
  projects,
  serviceArea,
  servicePages,
  skills,
  socialLinks,
} from '@/lib/data'
import { canLinkLive } from '@/lib/project-page'
import { SITE_URL, absoluteUrl } from '@/lib/site-metadata'
import { projectHref, routeFor, type Crumb, type SiteRoute } from '@/lib/site-routes'
import type { Project, ServicePage } from '@/types'

// JSON-LD for search engines and AI tools (spec §6, entity graph), built from
// the content modules so it cannot drift from the page. Each page renders one
// graph: the Person and the WebSite every reference points at, its
// breadcrumbs (not on the homepage) and its own node, so every @id reference
// resolves inside the page's own graph. One Person @id site-wide.
// Privacy: public email and social links only; the address is the public
// locality, never a street; no telephone. No FAQPage, ratings or reviews.

export type JsonLdNode = Record<string, unknown>

export const PERSON_ID = `${SITE_URL}/#person`
export const WEBSITE_ID = `${SITE_URL}/#website`

/** The node types this site publishes; tests/content/structured-data.test.ts holds every graph to them. */
export const NODE_TYPES = [
  'Person',
  'WebSite',
  'BreadcrumbList',
  'ProfilePage',
  'Service',
  'CreativeWork',
  'SoftwareApplication',
] as const

const ref = (id: string) => ({ '@id': id })

// contactInfo.location reads "Naga City, Camarines Sur, Philippines".
const [locality, region] = contactInfo.location.split(', ')

export function personSchema(): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: heroContent.name,
    jobTitle: heroContent.title,
    description: aboutPageContent.answer,
    url: SITE_URL,
    email: contactInfo.email,
    image: absoluteUrl(heroContent.portrait),
    // Locality only, never a street: privacy constraint.
    address: { '@type': 'PostalAddress', addressLocality: locality, addressRegion: region, addressCountry: 'PH' },
    knowsAbout: skills.map((s) => s.name),
    // Current roles: those whose dates run to "Present".
    worksFor: experience.filter((e) => /Present$/.test(e.dates)).map((e) => ({ '@type': 'Organization', name: e.company })),
    alumniOf: education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school })),
    // The profiles socialLinks holds; its mailto entry is the email above.
    sameAs: socialLinks.filter((l) => l.url.startsWith('https://')).map((l) => l.url),
  }
}

export function websiteSchema(): JsonLdNode {
  return { '@type': 'WebSite', '@id': WEBSITE_ID, url: SITE_URL, name: heroContent.name, inLanguage: 'en', publisher: ref(PERSON_ID) }
}

export function breadcrumbSchema(crumbs: Crumb[]): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: absoluteUrl(c.path) })),
  }
}

export function profilePageSchema(): JsonLdNode {
  const about = routeFor('/about')
  const url = absoluteUrl(about.path)
  return {
    '@type': 'ProfilePage',
    '@id': `${url}#page`,
    url,
    name: about.title,
    description: about.description,
    dateModified: pagesUpdated,
    isPartOf: ref(WEBSITE_ID),
    mainEntity: ref(PERSON_ID),
  }
}

export function serviceSchema(service: ServicePage): JsonLdNode {
  const url = absoluteUrl(`/services/${service.slug}`)
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: service.name,
    serviceType: service.keyword,
    description: service.answer,
    url,
    provider: ref(PERSON_ID),
    // Spec §6: Naga City, Bicol and the Philippines; remote is a channel, not a place.
    areaServed: [
      { '@type': 'City', name: serviceArea.city },
      { '@type': 'AdministrativeArea', name: serviceArea.region },
      { '@type': 'Country', name: serviceArea.country },
    ],
    availableChannel: { '@type': 'ServiceChannel', name: serviceArea.remote, serviceUrl: url },
  }
}

/**
 * The rule: software a visitor opens and uses (the Products and Applications
 * bands) is a SoftwareApplication; a client's site or a custom system is a
 * CreativeWork. No offers, ratings or reviews are claimed, so Google shows no
 * software rich result for these; the nodes name the work and its maker.
 */
export function projectSchemaType(project: Project): 'SoftwareApplication' | 'CreativeWork' {
  return project.band === 'Products' || project.band === 'Applications' ? 'SoftwareApplication' : 'CreativeWork'
}

export function projectSchema(project: Project): JsonLdNode {
  const url = absoluteUrl(projectHref(project))
  const study = getCaseStudy(project.slug)
  const node: JsonLdNode = {
    '@type': projectSchemaType(project),
    '@id': `${url}#work`,
    name: project.title,
    description: study ? study.brief[0] : project.description,
    url,
    creator: ref(PERSON_ID),
    keywords: (study ? study.stack.map((s) => s.name) : project.technologies).join(', '),
  }
  if (study) node.abstract = study.outcome.join(' ')
  if (canLinkLive(project)) node.sameAs = project.links.live
  return node
}

export function graph(...nodes: JsonLdNode[]): JsonLdNode {
  return { '@context': 'https://schema.org', '@graph': nodes }
}

/** One page's whole graph. */
export function routeGraph(route: SiteRoute): JsonLdNode {
  const nodes: JsonLdNode[] = [personSchema(), websiteSchema()]
  if (route.crumbs.length > 1) nodes.push(breadcrumbSchema(route.crumbs))
  if (route.kind === 'about') nodes.push(profilePageSchema())
  if (route.kind === 'services') nodes.push(...servicePages.map((s) => serviceSchema(s)))
  if (route.kind === 'service') nodes.push(serviceSchema(servicePages.find((s) => s.slug === route.slug)!))
  if (route.kind === 'project') nodes.push(projectSchema(projects.find((p) => p.slug === route.slug)!))
  return graph(...nodes)
}

/** The graph for the page at `path`; throws for a path that is not a page. */
export function graphFor(path: string): JsonLdNode {
  return routeGraph(routeFor(path))
}
```

- [ ] **Step 5: Move the graph from the layout to the pages**

`app/layout.tsx`: delete `import { JsonLd } from '@/components/json-ld'`, `import { graph, personSchema, serviceSchema, websiteSchema } from '@/lib/structured-data'` and the line `<JsonLd data={graph(personSchema(), serviceSchema(), websiteSchema())} />`.

In each page below add `import { JsonLd } from '@/components/json-ld'` and `import { graphFor } from '@/lib/structured-data'` (keeping imports alphabetical by path as the files do), and render the graph:

- `app/page.tsx`: first child of the fragment, before `<Trailhead />`: `<JsonLd data={graphFor('/')} />`.
- `app/projects/page.tsx`: first child of the outer `<div className={cn(SECTION, …)}>`, before the eyebrow `<p>`: `<JsonLd data={graphFor('/projects')} />`.
- `app/projects/[slug]/page.tsx`: replace the line `<JsonLd data={study ? graph(breadcrumbSchema(project), caseStudySchema(project, study)) : graph(breadcrumbSchema(project))} />` with `<JsonLd data={graphFor(projectHref(project))} />`, and change `import { breadcrumbSchema, caseStudySchema, graph } from '@/lib/structured-data'` to `import { graphFor } from '@/lib/structured-data'`.
- `app/services/page.tsx`: first child of the fragment, before `<PageIntro`: `<JsonLd data={graphFor('/services')} />`.
- `app/services/[slug]/page.tsx`: same place: ``<JsonLd data={graphFor(`/services/${service.slug}`)} />``.
- `app/about/page.tsx`: same place: `<JsonLd data={graphFor('/about')} />`.
- `app/hire/page.tsx`: same place: `<JsonLd data={graphFor('/hire')} />`.

- [ ] **Step 6: Run the tests**

Run: `npm test`
Expected: PASS. If a page's markup test now fails because it counts text the graph repeats (an answer, a title), strip the graph in that test's render helper, not in the page: `const html = renderToStaticMarkup(…).replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')`, and say so in the report.

- [ ] **Step 7: Gates and commit**

Run the four gates.

```bash
git add types/index.ts lib/data.ts lib/structured-data.ts app/layout.tsx app/page.tsx app/projects/page.tsx "app/projects/[slug]/page.tsx" app/services/page.tsx "app/services/[slug]/page.tsx" app/about/page.tsx app/hire/page.tsx tests/helpers/json-ld.ts tests/content/structured-data.test.ts tests/components/project-page.test.tsx
git commit -m "feat(seo): one entity graph per page around a single person" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

(Add any page test you had to adjust in Step 6.)

---

### Task 7: robots.txt names the search crawlers

**Model:** Sonnet (may load `claude-seo:seo-geo` first)

**Files:**
- Rewrite: `app/robots.ts`
- Create: `tests/content/robots.test.ts`

**Interfaces:**
- Consumes: `SITE_URL`.
- Produces: `robots(): MetadataRoute.Robots` with five groups (four named crawlers, then `*`), each `{ userAgent, allow: '/', disallow: '/api/' }`, and `sitemap: ${SITE_URL}/sitemap.xml`.

- [ ] **Step 1: Write the failing test**

Create `tests/content/robots.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import robots from '@/app/robots'
import { SITE_URL } from '@/lib/site-metadata'

// Spec §6, crawlers and rendering.
describe('robots.txt', () => {
  const { rules, sitemap } = robots()
  const groups = Array.isArray(rules) ? rules : [rules]
  const group = (ua: string) => groups.find((g) => g.userAgent === ua)

  it.each(['Googlebot', 'OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot'])('names %s, allows the site and keeps it off /api/', (ua) => {
    expect(group(ua)).toEqual({ userAgent: ua, allow: '/', disallow: '/api/' })
  })

  it('keeps every other crawler, AI training crawlers included, allowed outside /api/', () => {
    expect(group('*')).toEqual({ userAgent: '*', allow: '/', disallow: '/api/' })
    for (const g of groups) expect(g.disallow).toBe('/api/')
    for (const trainer of ['GPTBot', 'ClaudeBot', 'Google-Extended', 'CCBot']) expect(group(trainer)).toBeUndefined()
  })

  it('points at the sitemap', () => {
    expect(sitemap).toBe(`${SITE_URL}/sitemap.xml`)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/content/robots.test.ts`
Expected: FAIL: no group names Googlebot.

- [ ] **Step 3: Rewrite robots**

Replace the whole of `app/robots.ts` with:

```ts
import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-metadata'

// Spec §6. The four search crawlers that put pages in answers are named, so
// the welcome is explicit. Every other crawler, AI training crawlers included
// (GPTBot, ClaudeBot, Google-Extended, CCBot), falls under `*` and stays
// allowed: a decision on record (S5 plan). A crawler obeys only the most
// specific group that names it, so each group repeats the /api/ disallow.
const SEARCH_CRAWLERS = ['Googlebot', 'OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...SEARCH_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/', disallow: '/api/' })),
      { userAgent: '*', allow: '/', disallow: '/api/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
```

- [ ] **Step 4: Run the test**

Run: `npx vitest run tests/content/robots.test.ts`
Expected: PASS.

- [ ] **Step 5: Gates and commit**

Run the four gates.

```bash
git add app/robots.ts tests/content/robots.test.ts
git commit -m "feat(seo): robots names the four search crawlers; training crawlers stay allowed" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: llms files and the chat prompt cover the new pages

**Model:** Sonnet

**Files:**
- Rewrite: `lib/llms.ts`
- Modify: `lib/chat-context.ts`
- Modify tests: `tests/content/llms.test.ts`, `tests/content/chat-context.test.ts`

**Interfaces:**
- Consumes: `siteRoutes`, `projectHref` (`@/lib/site-routes`); `absoluteUrl`, `SITE_URL`; `servicePages`, `aboutPageContent`, `hirePageContent` and the existing data.
- Produces: `buildLlmsTxt()` and `buildLlmsFullTxt()` (same names, new sections); `buildPortfolioContext()` gains `SERVICE PAGES:` and `PAGES ON THIS SITE:` blocks after `SERVICES OFFERED:`.

- [ ] **Step 1: Write the failing tests**

In `tests/content/llms.test.ts`:

- Change the data import to `import { aboutPageContent, contactInfo, experience, hirePageContent, projects, servicePages } from '@/lib/data'`, the metadata import to `import { SITE_URL, absoluteUrl } from '@/lib/site-metadata'`, add `import { siteRoutes } from '@/lib/site-routes'`, and replace `import { hasPhone } from '@/tests/helpers/privacy'` with `import { privacyIssues } from '@/tests/helpers/privacy'`.
- In `describe('llms.txt')`, replace the tests `'links every project page exactly once, and the full text'` and `'lists every service'` with:

```ts
  it('opens with the citable answer about Christian as its summary', () => {
    expect(text.split('\n')[2]).toBe(`> ${aboutPageContent.answer}`)
  })

  it('links every page on the site exactly once, and the full text', () => {
    for (const r of siteRoutes()) expect(count(text, `(${absoluteUrl(r.path)})`), r.path).toBe(1)
    expect(text).toContain(`(${SITE_URL}/llms-full.txt)`)
  })

  it('lists every service page with its summary', () => {
    for (const s of servicePages) expect(text).toContain(`- [${s.name}](${SITE_URL}/services/${s.slug}): ${s.summary}`)
  })
```

- In `describe('llms-full.txt')` add:

```ts
  it('carries every service page in full: answer, questions, proof', () => {
    for (const s of servicePages) {
      expect(text).toContain(`Page: ${SITE_URL}/services/${s.slug}`)
      expect(text).toContain(s.answer)
      for (const q of s.sections) {
        expect(text).toContain(`#### ${q.question}`)
        for (const a of q.answer) expect(text).toContain(a)
      }
      for (const id of s.projectIds) expect(text).toContain(projects.find((p) => p.id === id)!.title)
    }
  })

  it('carries /about and /hire', () => {
    expect(text).toContain(`Page: ${SITE_URL}/about`)
    expect(text).toContain(aboutPageContent.answer)
    for (const p of aboutPageContent.story.paragraphs) expect(text).toContain(p)
    expect(text).toContain(`Page: ${SITE_URL}/hire`)
    expect(text).toContain(hirePageContent.answer)
    for (const n of hirePageContent.howIWork.notes) expect(text).toContain(`- ${n.title}: ${n.body}`)
  })
```

- Replace the body of `describe('both AI files')`'s test with:

```ts
    for (const text of [buildLlmsTxt(), buildLlmsFullTxt()]) {
      expect(privacyIssues(text)).toEqual([])
      expect(text).not.toContain('—')
    }
```

and rename it `'carry nothing private and no em-dash'`.

In `tests/content/chat-context.test.ts`, change the data import to `import { experience, projects, servicePages, services, skills } from '@/lib/data'`, add `import { SITE_URL } from '@/lib/site-metadata'`, and add inside `describe('chat portfolio context')`:

```ts
  it('sends visitors to the service pages and the site’s other pages', () => {
    for (const s of servicePages) {
      expect(context).toContain(`${SITE_URL}/services/${s.slug}`)
      expect(context).toContain(s.answer)
    }
    for (const path of ['/services', '/hire', '/about', '/projects']) expect(context).toContain(`${SITE_URL}${path}`)
  })
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/content/llms.test.ts tests/content/chat-context.test.ts`
Expected: FAIL: no service page, `/about` or `/hire` link in either file; the prompt names no page URL.

- [ ] **Step 3: Rewrite the AI files**

Replace the whole of `lib/llms.ts` with:

```ts
import { FLAGSHIP_SLUGS, getCaseStudy } from '@/lib/case-studies'
import {
  aboutPageContent,
  availability,
  caseStudyContent,
  contactInfo,
  education,
  experience,
  heroContent,
  hirePageContent,
  projects,
  servicePages,
} from '@/lib/data'
import { DISPLAY_STATUS_LABEL, displayStatus } from '@/lib/display-status'
import { canLinkLive } from '@/lib/project-page'
import { SITE_URL, absoluteUrl } from '@/lib/site-metadata'
import { projectHref, siteRoutes } from '@/lib/site-routes'
import type { Project, ServicePage } from '@/types'

// /llms.txt and /llms-full.txt (llmstxt.org), built from the same content as
// the pages and the chat assistant, and listing every route in
// lib/site-routes.ts. Useful to non-Google tools; Google ignores them.
// Public email and social links only.

const url = (p: Project) => absoluteUrl(projectHref(p))
const serviceUrl = (s: ServicePage) => absoluteUrl(`/services/${s.slug}`)
const isFlagship = (p: Project) => FLAGSHIP_SLUGS.indexOf(p.slug) !== -1
const flagships = (): Project[] =>
  FLAGSHIP_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter((p): p is Project => Boolean(p))

function header(): string {
  return [
    `# ${heroContent.name}`,
    '',
    `> ${aboutPageContent.answer}`,
    '',
    `${heroContent.subheadline} Based in ${contactInfo.location}. ${availability}.`,
  ].join('\n')
}

function servicesSection(): string {
  return ['## Services', '', ...servicePages.map((s) => `- [${s.name}](${serviceUrl(s)}): ${s.summary}`)].join('\n')
}

// The pages that are neither a service nor a project: the homepage, /services,
// /hire, /about and /projects, each with its meta description.
function pagesSection(): string {
  const pages = siteRoutes().filter((r) => r.kind !== 'service' && r.kind !== 'project')
  return ['## Pages', '', ...pages.map((r) => `- [${r.title}](${absoluteUrl(r.path)}): ${r.description}`)].join('\n')
}

function contact(): string {
  const links = contactInfo.socialLinks.filter((l) => l.url.startsWith('https://'))
  return ['## Contact', '', `- Email: ${contactInfo.email}`, ...links.map((l) => `- [${l.name}](${l.url})`)].join('\n')
}

export function buildLlmsTxt(): string {
  const others = projects.filter((p) => !isFlagship(p))
  return (
    [
      header(),
      servicesSection(),
      pagesSection(),
      ['## Case studies', '', ...flagships().map((p) => `- [${p.title}](${url(p)}): ${p.summary}`)].join('\n'),
      ['## Projects', '', ...others.map((p) => `- [${p.title}](${url(p)}): ${p.summary}`)].join('\n'),
      contact(),
      ['## Optional', '', `- [Full text of every page, project and case study](${SITE_URL}/llms-full.txt)`].join('\n'),
    ].join('\n\n') + '\n'
  )
}

function serviceBlock(s: ServicePage): string {
  const proof = s.projectIds
    .map((id) => projects.find((p) => p.id === id)?.title)
    .filter((t): t is string => Boolean(t))
  return [
    `### ${s.name}`,
    '',
    `Page: ${serviceUrl(s)}`,
    '',
    s.answer,
    ...s.sections.flatMap((q) => ['', `#### ${q.question}`, '', ...q.answer]),
    '',
    `Projects that prove it: ${proof.join(', ')}`,
  ].join('\n')
}

function aboutSection(): string {
  return [
    '## About',
    '',
    `Page: ${absoluteUrl('/about')}`,
    '',
    aboutPageContent.answer,
    '',
    aboutPageContent.story.paragraphs.join('\n\n'),
  ].join('\n')
}

function hireSection(): string {
  return [
    '## Hire',
    '',
    `Page: ${absoluteUrl('/hire')}`,
    '',
    hirePageContent.answer,
    '',
    ...hirePageContent.howIWork.notes.map((n) => `- ${n.title}: ${n.body}`),
  ].join('\n')
}

function projectBlock(p: Project): string {
  const lines = [`### ${p.title}`, '', `${p.band} · ${DISPLAY_STATUS_LABEL[displayStatus(p.status)]} · ${p.summary}`, `Page: ${url(p)}`]
  if (canLinkLive(p)) lines.push(`Live site: ${p.links.live}`)
  lines.push('', p.description, '', `Stack: ${p.technologies.join(', ')}`)

  const study = getCaseStudy(p.slug)
  if (study) {
    const h = caseStudyContent.headings
    lines.push(
      '', `Role: ${study.role}`,
      '', `#### ${h.brief}`, '', ...study.brief,
      '', `#### ${h.built}`, '', ...study.built,
      '', `#### ${h.decisions}`, '', ...study.decisions.map((d) => `- ${d.chose} over ${d.over}: ${d.because}`),
      '', `#### ${h.stack}`, '', ...study.stack.map((s) => `- ${s.name}: ${s.why}`),
      '', `#### ${h.outcome}`, '', ...study.outcome,
    )
    if (study.metrics && study.metrics.length > 0) lines.push('', ...study.metrics.map((m) => `- ${m.value} ${m.label}`))
  }
  return lines.join('\n')
}

export function buildLlmsFullTxt(): string {
  const ordered = flagships().concat(projects.filter((p) => !isFlagship(p)))
  return (
    [
      header(),
      ['## Services', '', servicePages.map(serviceBlock).join('\n\n')].join('\n'),
      aboutSection(),
      hireSection(),
      ['## Projects', '', ordered.map(projectBlock).join('\n\n')].join('\n'),
      ['## Experience', '', ...experience.map((e) => `- ${e.title}, ${e.company}, ${e.location} (${e.dates}): ${e.responsibilities.join('; ')}`)].join('\n'),
      ['## Education', '', ...education.map((e) => `- ${e.degree}, ${e.school} (${e.dates})${e.honors ? `, ${e.honors}` : ''}`)].join('\n'),
      contact(),
    ].join('\n\n') + '\n'
  )
}
```

- [ ] **Step 4: Give the chat prompt the pages**

In `lib/chat-context.ts`: add `servicePages` to the `@/lib/data` import list (alphabetically, after `services`), and add

```ts
import { absoluteUrl } from '@/lib/site-metadata'
import { siteRoutes } from '@/lib/site-routes'
```

In `buildPortfolioContext`, before the `return`, add:

```ts
  // The service pages and the site's other pages, from lib/data.ts and
  // lib/site-routes.ts, so Chunks can send a visitor to the right page.
  const servicePagesList = servicePages
    .map(
      (s) =>
        `- ${s.name} (${absoluteUrl(`/services/${s.slug}`)}): ${s.answer}\n    Questions it answers: ${s.sections.map((q) => q.question).join(' ')}`,
    )
    .join('\n')

  const pagesList = siteRoutes()
    .filter((r) => r.kind !== 'service' && r.kind !== 'project')
    .map((r) => `- ${r.title} (${absoluteUrl(r.path)}): ${r.description}`)
    .join('\n')
```

and in the template, replace

```
SERVICES OFFERED:
${services.map((s) => `- ${s}`).join('\n')}

CONTACT:
```

with

```
SERVICES OFFERED:
${services.map((s) => `- ${s}`).join('\n')}

SERVICE PAGES:
${servicePagesList}

PAGES ON THIS SITE:
${pagesList}

CONTACT:
```

(The new blocks use no uppercase `PROJECTS`, which the context tests split on.)

- [ ] **Step 5: Run the tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Gates and commit**

Run the four gates. The build still lists `○ /llms.txt` and `○ /llms-full.txt` (force-static).

```bash
git add lib/llms.ts lib/chat-context.ts tests/content/llms.test.ts tests/content/chat-context.test.ts
git commit -m "feat(aieo): the llms files and chunks cover the service, about and hire pages" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: S5 surface guards

**Model:** Sonnet

**Files:**
- Create: `tests/content/s5-surfaces.test.ts`

**Interfaces:**
- Consumes: everything above: `siteRoutes`, `buildRouteMetadata`, `buildSiteMetadata`, `absoluteUrl`, `routeGraph`, `buildLlmsTxt`, `buildLlmsFullTxt`, `SYSTEM_PROMPT`, `OFFLINE_REPLY`, `sitemap`, `privacyIssues`.
- Produces: one test file the docs (Task 10) name, `s5-surfaces`.

- [ ] **Step 1: Write the guard test**

Create `tests/content/s5-surfaces.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import sitemap from '@/app/sitemap'
import { OFFLINE_REPLY, SYSTEM_PROMPT } from '@/lib/chat-context'
import { buildLlmsFullTxt, buildLlmsTxt } from '@/lib/llms'
import { absoluteUrl, buildRouteMetadata, buildSiteMetadata } from '@/lib/site-metadata'
import { siteRoutes } from '@/lib/site-routes'
import { routeGraph } from '@/lib/structured-data'
import { privacyIssues } from '@/tests/helpers/privacy'

// The S5 brief's tests: no telephone or street anywhere, every route in the
// sitemap and llms.txt. The guards themselves are shown failing in
// tests/content/privacy-guard.test.ts.
const routes = siteRoutes()

describe('S5: nothing private on any public surface', () => {
  it.each(routes.map((r) => [r.path, r] as const))('%s: metadata, JSON-LD and card words', (_path, r) => {
    for (const text of [JSON.stringify(buildRouteMetadata(r.path)), JSON.stringify(routeGraph(r)), JSON.stringify(r.card)]) {
      expect(privacyIssues(text)).toEqual([])
    }
  })

  it('the site metadata, both AI files and the chat assistant’s texts', () => {
    const texts = [
      JSON.stringify(buildSiteMetadata('https://example.test')),
      buildLlmsTxt(),
      buildLlmsFullTxt(),
      SYSTEM_PROMPT,
      OFFLINE_REPLY,
    ]
    for (const text of texts) expect(privacyIssues(text)).toEqual([])
  })
})

describe('S5: every route reaches every index', () => {
  const llms = buildLlmsTxt()
  const mapped = sitemap().map((e) => e.url)

  it.each(routes.map((r) => r.path))('%s is in the sitemap and in llms.txt', (path) => {
    expect(mapped).toContain(absoluteUrl(path))
    expect(llms).toContain(`(${absoluteUrl(path)})`)
  })

  it('maps nothing that is not a route', () => {
    expect(mapped).toHaveLength(routes.length)
  })
})
```

- [ ] **Step 2: Run it**

Run: `npx vitest run tests/content/s5-surfaces.test.ts`
Expected: PASS: it guards finished work. If any surface trips a guard, that is a finding: fix the data or the builder that produced it and report it; never weaken a guard. Then `grep -P '\x08' tests/content/s5-surfaces.test.ts` prints nothing.

- [ ] **Step 3: Gates and commit**

Run the four gates.

```bash
git add tests/content/s5-surfaces.test.ts
git commit -m "test(seo): nothing private on any route's surfaces; every route indexed" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Docs and sprint verification

**Model:** Sonnet for Steps 1-5; the controller for Step 6.

**Files:**
- Modify: `CLAUDE.md`
- Modify: `tests/content/s5-surfaces.test.ts` (docs guard)

**Interfaces:**
- Consumes: everything above.
- Produces: `CLAUDE.md` matching the S5 code; the branch ready for the controller's checks.

- [ ] **Step 1: Write the failing docs test**

Append to `tests/content/s5-surfaces.test.ts` (add `import { readFileSync } from 'node:fs'` at the top):

```ts
describe('the docs', () => {
  it('describe the S5 routes, cards, graph and crawlers', () => {
    const doc = readFileSync('CLAUDE.md', 'utf8')
    for (const name of [
      'lib/site-routes.ts',
      'app/og/',
      'routeGraph',
      'ProfilePage',
      'SoftwareApplication',
      'OAI-SearchBot',
      'Claude-SearchBot',
      'PerplexityBot',
      'privacyIssues',
      's5-surfaces',
      'elevationFigures',
    ]) {
      expect(doc, name).toContain(name)
    }
    for (const gone of ['app/opengraph-image.tsx', 'proofPoints', 'ProfessionalService', 'until S5']) {
      expect(doc, gone).not.toContain(gone)
    }
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/content/s5-surfaces.test.ts -t docs`
Expected: FAIL: `CLAUDE.md` has no `lib/site-routes.ts` and still names `app/opengraph-image.tsx`.

- [ ] **Step 3: Update `CLAUDE.md`**

Read `CLAUDE.md`, then make these edits (each names the text it replaces):

**Testing**, the `tests/content/` sentence: after "structured data, the AI files, " add "the route registry (`site-routes`: every page once, titles from spec §6's table), robots, the privacy guards (`privacy-guard`: each guard shown failing), the S5 surfaces (`s5-surfaces`: nothing private on any route's metadata, JSON-LD or card; every route in the sitemap and llms.txt), ".

**Testing**, replace "`og-palette` (the social card's hex copies match `.dark`)" with "`og-palette` (the link-preview cards' hex copies match the day theme's `:root` tokens)".

**Testing**, the `tests/components/` paragraph: replace "live preview, JSON-LD, client surfaces, OG image," with "live preview, JSON-LD, client surfaces, the link-preview cards (`og-card`),". Replace

```text
behaviour static markup cannot reach. `tests/helpers/` holds helpers shared
across those folders — `privacy.ts` is the phone-number guard the JSON-LD and
AI-file tests reuse. There are no E2E tests.
```

with

```text
behaviour static markup cannot reach. `tests/helpers/` holds helpers shared
across those folders: `privacy.ts` (`hasPhone`, `hasStreet`, `privacyIssues`:
phone, street, a telephone field, any email but the public one), which every
public surface's test runs, and `json-ld.ts` (`danglingRefs`, `missingFields`),
the graph-shape checks. There are no E2E tests.
```

**Project Structure**: replace "robots.ts, sitemap.ts (the homepage, /services and its pages, /hire, /about, /projects and every project page)" with "robots.ts (names Googlebot, OAI-SearchBot, Claude-SearchBot and PerplexityBot; every crawler, AI training crawlers included, allowed outside /api/), sitemap.ts (every route in lib/site-routes.ts)". Replace

```text
app/opengraph-image.tsx  Link-preview card rendered from heroContent (next/og, edge runtime); fonts in app/fonts/
```

with

```text
app/og/[[...path]]/  One link-preview card per page at the page's path under /og (/og is the homepage's): next/og on the edge runtime, day palette, Recursive Sans from app/fonts/; a path that is not a route is a 404
```

Replace "lib/og-palette.ts    The dark theme as hex for the social card (held to globals.css by a test)" with "lib/og-palette.ts    The day theme as hex for the link-preview cards (held to globals.css's `:root` by a test)". Replace "lib/structured-data.ts Builds JSON-LD (Person, ProfessionalService, WebSite, BreadcrumbList, CreativeWork) from lib/data.ts and lib/case-studies.ts" with "lib/structured-data.ts Builds each page's JSON-LD graph (`routeGraph`, `graphFor`): one Person `@id`, WebSite, BreadcrumbList (not on the homepage), ProfilePage on /about, Service per service page, CreativeWork or SoftwareApplication per project (Products and Applications are software). The layout renders no graph". Replace "lib/site-metadata.ts Builds page metadata from heroContent (preview image comes from opengraph-image.tsx)" with

```text
lib/site-metadata.ts Builds every page's metadata from its route (`buildRouteMetadata`, `buildProjectsMetadata`, `ogImage`, `absoluteUrl`); SITE_URL falls back to https://christian-digital-portfolio.vercel.app
lib/site-routes.ts   Every page once (`siteRoutes`, `routeFor`, `findRoute`): path, title, description, keywords, card words, breadcrumbs, sitemap priority; also projectHref. Pure, so the edge card route can read it. Metadata, cards, JSON-LD, sitemap, llms files and the chat prompt all read it
```

and replace "tests/helpers/ holds shared test helpers (privacy.ts)" with "tests/helpers/ holds shared test helpers (privacy.ts, json-ld.ts, css-rules.ts)".

**Content Changes**: replace

```text
`lib/structured-data.ts` (JSON-LD), `app/sitemap.ts` and `lib/llms.ts`
(`/llms.txt`, `/llms-full.txt`) are all built from `lib/data.ts` and
`lib/case-studies.ts`, the same as the page and the chat assistant. Adding a
project reaches all of them automatically; nothing there needs hand-editing.
```

with

```text
`lib/site-routes.ts` lists every page once, from `lib/data.ts` and
`lib/case-studies.ts`. The metadata, the link-preview cards, the JSON-LD
(`lib/structured-data.ts`), `app/sitemap.ts`, `lib/llms.ts` (`/llms.txt`,
`/llms-full.txt`) and the chat assistant all read it. Adding a project or a
service page reaches all of them automatically; nothing there needs
hand-editing. A new kind of page is one entry in `siteRoutes()`.
```

Add `serviceArea` to the list of typed arrays (after `pagesUpdated`).

Replace

```text
`staging`). `heroContent.proofPoints` (no longer on the homepage; still read by
the metadata, JSON-LD, chat prompt and AI files until S5) makes factual claims that
`tests/content/proof-band.test.ts` checks against the data; if you change the
inventory, the points change with it.
```

with

```text
`staging`). The proof counts (products, shipped projects, case studies,
places) are `elevationFigures()` in `lib/elevation.ts`, counted from the data;
the elevation strip and the chat prompt read them, and
`tests/content/proof-band.test.ts` holds them to the inventory.
```

Replace "The same rule applies to the JSON-LD (`lib/structured-data.ts`) and the AI files" with "The same rule applies to the metadata, the link-preview cards, the JSON-LD (`lib/structured-data.ts`) and the AI files", and after "telephone field anywhere." add: " No FAQPage, AggregateRating or Review markup. `tests/content/s5-surfaces.test.ts` runs `privacyIssues` over every route's metadata, graph and card, both AI files and the chat prompt."

**Environment**, replace

```text
  `app/opengraph-image.tsx` runs on the edge runtime for that reason; keep it there.
  It also needs static font files, so the card renders in Recursive from the
  static files in `app/fonts/`, not Archivo.
```

with

```text
  `app/og/[[...path]]/route.tsx` runs on the edge runtime for that reason; keep it
  there. It also needs a static font file, so the cards render in Recursive Sans
  from `app/fonts/recursive-sans-600.ttf`, not Archivo.
```

- [ ] **Step 4: Run the full suite and the gates**

Run: `npm test`, then the four gates.
Expected: all pass; `client-boundary` reports 8 client components; the build lists `ƒ /og/[[...path]]`, `○ /robots.txt`, `○ /sitemap.xml`, `○ /llms.txt`, `○ /llms-full.txt`, and no `/opengraph-image`.

- [ ] **Step 5: Commit and push**

```bash
git add CLAUDE.md tests/content/s5-surfaces.test.ts
git commit -m "docs(seo): claude.md for the route registry, cards, graph and crawlers" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push origin v5
```

- [ ] **Step 6: Hand off to the controller (the implementer stops here)**

Report the commit range and the gate output. The controller, not the subagent, then runs, on the keyless server (`.claude/launch.json`, `portfolio-keyless`, `http://127.0.0.1:3100`, built with no environment variables):

- **Fetch** `/robots.txt` (five groups, each `Disallow: /api/`, the sitemap line), `/sitemap.xml` (one `<loc>` per route, 28 today: 8 pages and 20 projects), `/llms.txt` (summary line, Services, Pages, Case studies, Projects, Contact, Optional), `/llms-full.txt`, and `/og`, `/og/services/ai-automation`, `/og/about`, `/og/projects/giya` (200, `image/png`; look at each: words clear of the linework, nothing clipped, trail red only on the trail and its dot) and `/og/nope` (404).
- **Built HTML** of one route of each kind (`/`, `/projects`, `/services`, `/services/wordpress-woocommerce`, `/about`, `/hire`, `/projects/el-nido-guide-ph`, `/projects/latag`): one `<title>` matching the spec table, one meta description, `<link rel="canonical">`, `og:url`, `og:image` at the page's `/og…` path, `twitter:image`; exactly one `application/ld+json` script that parses, whose `@id` references all resolve in its own `@graph`, with one `Person`. Paste one graph into a schema.org shape check (validator.schema.org) and the Rich Results Test's code view: `BreadcrumbList` and `ProfilePage` eligible; the `SoftwareApplication` note about missing offers/rating is expected (decision 6), anything else is a finding.
- **Lighthouse SEO** (mobile) on the same eight routes and the 404; record in `.superpowers/sdd/s5-lighthouse.md` (gitignored). SEO 100 on every content route is the bar; anything below is a finding for the final review, not a silent fix.

---

## Self-review against the brief and the spec

- **Scope (master plan S5):** titles and descriptions per route from spec §6 (Tasks 2, 3, 5: the table's six rows verbatim in `site-routes.test`, the project pattern, every route's description); one `Person` `@id`, `ProfilePage`, `Service`, `CreativeWork`/`SoftwareApplication`, `BreadcrumbList`, `WebSite` (Task 6); robots naming the four crawlers with `/api/` disallowed (Task 7); sitemap with every route (Task 3, Task 9); llms files covering the new pages (Task 8); OG card in the trail palette with `og-palette` re-enabled (Task 4). Tests: titles (Tasks 3, 5), no telephone or street anywhere (Tasks 1, 6, 8, 9), every route in the sitemap and llms.txt (Tasks 3, 8, 9).
- **Must also land:** 1 `proofPoints` deleted, readers moved to `elevationFigures()` / `subheadline` / the about answer, `proof-band` rewritten (Task 2, decision 1). 2 one shared card, per-route words, edge runtime, static font in `app/fonts/`, build keyless, `og-palette` held to `:root` (Task 4, decisions 3-4). 3 one `@id`; locality-only address; `sameAs` from `socialLinks`; no telephone, street, FAQPage; `knowsAbout`, `worksFor`, `alumniOf` from the data; `Service` with `areaServed`; the project rule stated; shape validated with failing-first validators (Task 6, decisions 5-8). 4 training crawlers allowed, on record (Task 7, decision 10). 5 llms and chat prompt derived from data (Task 8). 6 privacy guard over metadata, JSON-LD, llms, cards and the prompt; `\b` written as backslash-b, one can-fail assertion per guard, a test that reads the helper for control bytes (Tasks 1, 9). 7 off-site actions listed for Christian, no code.
- **Fixed constraints:** no phone, street, ratings or reviews (guards); no new env var, `SITE_URL` fallback stated (decision 11); client components stay 8 (a route handler and pure modules only); every task TDD with the four gates; the last task runs the gates, the controller's Lighthouse, shape and fetch checks, and updates `CLAUDE.md`.
- **Placeholder scan:** every code step carries the full code or the exact old and new text; Task 9's test is expected to pass at once (it guards finished work), stated as such.
- **Type consistency:** `SiteRoute`, `RouteKind`, `Crumb`, `OgCard`, `siteRoutes`, `findRoute`, `routeFor`, `projectHref`, `buildProjectsTitle`, `buildProjectPageTitle` (Task 3); `absoluteUrl` (Task 3); `OG_SIZE`, `OgImage`, `ogImage` (Task 4); `buildRouteMetadata`, `buildProjectsMetadata` (Task 5); `JsonLdNode`, `PERSON_ID`, `WEBSITE_ID`, `NODE_TYPES`, `routeGraph`, `graphFor`, `projectSchema`, `projectSchemaType`, `serviceArea`, `ServiceArea` (Task 6); `privacyIssues`, `hasStreet`, `danglingRefs`, `missingFields` (Tasks 1, 6) are spelled the same in every task that uses them. `OG_IMAGE` exists only between Tasks 4 and 5, and Task 5's test checks it is gone.

## Deferred to S6

- A night-theme card variant if Christian prefers it (open question 1).
- `lastModified` in the sitemap from `pagesUpdated` once pages carry real edit dates.
- `heroContent.location` and `heroContent.specialism`: `location` loses its last reader with the old card; `specialism` stays for the chat prompt. S6's leftover sweep decides `location`.
