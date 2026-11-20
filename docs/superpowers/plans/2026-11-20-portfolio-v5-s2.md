# Portfolio 5.0 Sprint 2 (Homepage) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Portfolio 4.0 homepage with the seven-section Isarog Trail Map page from spec §5 (Trailhead, ElevationStrip, Fork, FieldMap, OwnProducts, TrailJournals, PlanTheRoute) on branch `v5`, deleting each old section and its tests as its replacement lands, with the site building and `npm test` green after every task.

**Architecture:** Every new section is a server component in `components/sections/`, reading copy from `lib/data.ts` and facts from `lib/data.ts` / `lib/case-studies.ts`; `PlanTheRoute` (the renamed contact console) stays the only form client component. The map is server-rendered SVG: an outline generated once from Natural Earth into `lib/ph-outline.ts`, pins projected by `lib/geo.ts`, pins as real links. Motion is CSS: the trailhead's lines and trail run once on load, short trail segments between sections draw on their own view timelines, and only the elevation strip's "you are here" marker follows the page's scroll.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5 (strict), Tailwind CSS 3, `motion` (`motion/react`), next-themes, `next/font/google` (Archivo), Vitest; new devDependencies `world-atlas` and `topojson-client` (Task 3, one-off outline build).

## Questions for the controller

Each is written into the tasks as recommended; overrule here and the named task changes.

1. **`.on-plane` is still used outside the homepage.** `components/case-study/project-header.tsx:44` (S3's surface) puts a `bg-accent-plane` plane with `.on-plane` around its focusable controls. Deleting the `.on-plane :focus-visible` rule in S2 (brief decision 10) turns that header's focus ring trail-on-trail, an a11y regression on every project page until S3. No test asserts `.on-plane` today. **Recommendation:** S2 deletes every homepage use and all `.hero-*` CSS, keeps the one `.on-plane :focus-visible` rule with a comment that S3 removes it with the project header (Task 6).
2. **An anonymous `view()` on an SVG `<path>` is likely inactive.** SVG shapes have no CSS box, and a view progress timeline needs one; with `from { stroke-dashoffset: 1 }` an inactive timeline leaves the segment drawn, so it would silently never animate. **Recommendation:** the `<svg>` of a view-mode `TrailPath` carries `.trail-view { view-timeline: --trail-segment block }` and the path animates on `animation-timeline: --trail-segment` with the brief's `animation-range: entry 10% cover 45%`, inside both gates. Still one view timeline per segment (Task 4).
3. **The font-budget test cannot run in CI as ordered.** `.github/workflows/ci.yml` runs `npm test` before `npm run build`, so `.next/static/media` does not exist when tests run. **Recommendation:** the test uses `describe.skipIf` when the build output is absent, and Task 13 runs it after `npm run build`. CI stays unchanged (Task 5).
4. **Spec §5 says "own products marked at Naga City"; brief decision 4 pins only where a project's own words name the place.** Only Connecta PH ("Built for Naga first") names Naga; Iskotify, Giya and Latag name no place. **Recommendation:** follow the brief (the spec's own map data rule): those three appear under "No fixed point". Pinning them needs Christian to add the place to their descriptions first.
5. **`heroContent.headline` as one string cannot keep its line count across the font swap.** The R6 lesson (CLS 0.23 when the hero H1 re-wrapped as Arial swapped to the web font) needs fixed lines. **Recommendation:** `heroContent.headlineLines: ['Built in Bicol.', 'Running across', 'the Philippines.']` with `headline` as a getter joining them, so the brief's string is still `heroContent.headline` and a test holds both (Task 2).
6. **Map markers as links, and every project reachable.** One `<a>` per place to its first project leaves the other projects at that place (Lunad, Eastwind, BeachBus, Review Masters) unreachable from the homepage once the rack goes. **Recommendation:** each pin is a real `<a href>` in the SVG to the place's first project, taken out of the tab order and the accessibility tree (the duplicate-link pattern `ProjectShot` already uses); the place list beside the map names every place's projects as `.map-label` links. Crawlers see pins as links; keyboard and screen-reader users meet one link per project (Task 10).
7. **`#changelog` vs `#timeline`.** The S1 ledger and the KOS handoff say "keep #changelog/#contact anchors"; brief decision 1 moves Experience to `#timeline`. No file in the repo links `#changelog` except the nav item and its tests. **Recommendation:** follow the brief; `#changelog` disappears with the route line (Task 7).
8. **"White survey plate" has no token.** Adding raw white breaks the token rule. **Recommendation:** `.survey-plate` fills with `panel` (L 0.99 in the day survey, near white; the night panel at night) with a `line-strong` hairline. S3's `SurveyPlate` component wraps this utility (Task 6).
9. **`lib/geo.ts` imported by a `.mjs` script.** The script imports `../lib/geo.ts` directly, which needs Node's type stripping (Node 22.18+; this machine has 26.4). CI never runs the script. **Recommendation:** accept, and say so in the script header (Task 3).

## Global Constraints

The master plan's Global Constraints apply verbatim (`docs/superpowers/plans/2026-11-20-portfolio-v5-revamp.md`, "Global Constraints"). S2 adds:

- Before editing any UI file, read `C:\Users\raroc\.claude\skills\impeccable\reference\craft-floor.md`. Before writing a `view()` / `scroll()` timeline or a view transition, load the `modern-web-guidance` skill.
- Old sections keep rendering until their replacement lands; the task that replaces a section deletes it, its CSS and the tests that only assert it, in the same commit. `app/page.tsx` is given in full in every task that changes it.
- Tests for the new sections live in `tests/components/homepage.test.tsx`, one `describe` per section, plus the `SECTIONS` list every section joins (no `opacity:0` in its server HTML).
- No new client component: the count stays 8 (`PlanTheRoute` replaces `ContactConsole` in place). `app/page.tsx` stays a server component.
- Trail red (`trail`) on the homepage appears only on: `.button-primary`, `TrailPath` strokes, the elevation strip's "you are here" marker. Map pins and spot heights are ink.
- Photos, testimonials and the stack leave the homepage in this sprint; they move to `/about` and `/hire` in S4. Their data (`galleryImages`, `galleryContent`, `recommendations`, `skills`) and helpers (`lib/field-log.ts`) and their content tests stay untouched.
- `heroContent.title`, `lede`, `specialism`, `aiLine`, `aiProof`, `stack`, `proofPoints` stay in `lib/data.ts`: metadata, JSON-LD, the chat prompt, the llms files and the OG card read them until S5.
- No font change in S2 beyond the budget test (Task 5).
- Gates before every commit, from the repo root, in order: `npm run type-check`, `npm run lint`, `npm test`, `npm run build`. Expected: type-check prints nothing and exits 0; lint prints `✔ No ESLint warnings or errors`; test ends `Test Files  N passed (N)`; build ends with the route table listing `○ /`. If type-check points at a deleted file under `.next/types`, delete `.next` and rerun.
- Every commit ends with the trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` (passed as a second `-m`).

## Task list

| # | Task | Model |
|---|---|---|
| 1 | Direction contract | Sonnet |
| 2 | Trailhead copy and verified places | Sonnet |
| 3 | Map projection and Philippines outline | Sonnet |
| 4 | Trail topology: load, view and the elevation marker | Opus |
| 5 | Font budget guard | Sonnet |
| 6 | Trailhead replaces the hero | Opus |
| 7 | Elevation strip replaces the route line | Sonnet |
| 8 | The fork; field log and stack leave | Sonnet |
| 9 | Own products as survey plates | Sonnet |
| 10 | Field map replaces the rack | Opus |
| 11 | Trail journals replace the case-study covers | Sonnet |
| 12 | Plan the route replaces the contact console | Sonnet |
| 13 | Thread the trail, page contract, docs, verification | Opus |

---

### Task 1: Direction contract

**Model:** Sonnet

**Files:**
- Modify: `.impeccable/surfaces/app-page-tsx.md` (everything below the front matter)
- Create: `tests/content/direction-contract.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: the homepage direction contract every UI task and the S6 finish review read.

- [ ] **Step 1: Write the failing test**

Create `tests/content/direction-contract.test.ts`:

```ts
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// The homepage's direction contract (impeccable new-work §5) lives in the
// surface brief, never in source or anything the browser receives.
const brief = readFileSync('.impeccable/surfaces/app-page-tsx.md', 'utf8')
const contract = brief.slice(brief.indexOf('## Direction contract'))
const FINISH =
  'FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance'

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return /\.(tsx?|css)$/.test(full) ? [full] : []
  })
}

describe('homepage direction contract', () => {
  it('is the Isarog Trail Map, with all six blocks', () => {
    expect(brief).toContain('## Direction contract')
    for (const block of ['THESIS:', 'OWN-WORLD:', 'STORY:', 'FIRST VIEWPORT', 'FORM:']) expect(contract, block).toContain(block)
    expect(contract).toContain('Isarog Trail Map')
    expect(contract).toContain('seed:03c5f4d98ec3bdbf')
    expect(contract).toContain('IMPECCABLE\u2019S PICK over the rolled Abaca Weave')
  })

  it('closes on the FINISH line, verbatim', () => {
    expect(contract.trimEnd().split('\n').filter((l) => l.startsWith('FINISH:'))).toEqual([FINISH])
  })

  it('no longer carries the Lobby Rack contract', () => {
    expect(brief).not.toMatch(/Lobby Rack", candidate|Seed `f1d5d2c7`|THESIS: Every project is a brochure/)
  })

  it('never leaks into source', () => {
    for (const f of ['app', 'components', 'lib'].flatMap(sourceFiles)) {
      const src = readFileSync(f, 'utf8')
      expect(src, f).not.toContain('seed:03c5f4d98ec3bdbf')
      expect(src, f).not.toMatch(/\bTHESIS:|\bOWN-WORLD:/)
    }
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/content/direction-contract.test.ts`
Expected: FAIL in `is the Isarog Trail Map, with all six blocks` with `expected '## Direction contract…' to contain 'Isarog Trail Map'`, and in `no longer carries the Lobby Rack contract`.

- [ ] **Step 3: Read the current brief**

Run: `~/.claude/skills/impeccable/scripts/impeccable surface-brief read app/page.tsx`
Expected: the Lobby Rack brief (front matter with `primary_target: "app/page.tsx"`).

- [ ] **Step 4: Write the new brief body**

Write this body (everything below the front matter) to the scratchpad file `app-page-brief.md`:

```markdown
# Homepage surface brief

Scope: `/` (Persuade). `/projects`, `/projects/[slug]`, the S4 pages and the
404 inherit the world.
Audience and job: freelance clients (Philippine hotels, tour and shuttle
operators, restaurants, review centres) and engineering hiring managers,
equally; each decides within one screen whether this is their developer and
which path is theirs.
Action: Start a project (`#contact`). Second path: Hire me for a role
(`#contact` until `/hire` exists in S4).
Proof: 20 projects (four own products, six case studies), verified client
places on a real map of the Philippines, a dated route from 2020 to now. Every
claim derives from `lib/data.ts` / `lib/case-studies.ts`.
Constraints: WCAG 2.2 AA; status never by colour alone (`StatusBadge`); green
only for live; trail red only for the primary action and the current
position; nothing auto-moves longer than 5 s; CSS-first motion that is
progressive enhancement; fewer than 10 client components.
Replaces: Lobby Rack (Portfolio 4.0). Spec:
`docs/superpowers/specs/2026-11-20-portfolio-v5-revamp-design.md`.
Unresolved: the contour pointer shift and screenshot appear-once land in S6;
a pin opening its project's plate (map pan) lands in S3.

## Direction contract

THESIS: The work as a survey map you walk: one red trail from a trailhead in
Naga City, every project a waypoint at a place it really served. It refuses
the category default, a big claim over a grid of project cards, and keeps the
map honest: a pin only where a project's own words name the place.

OWN-WORLD: "Isarog Trail Map". Pale green-grey survey paper by day, dark field
paper by night, near-black ink, olive contour linework, and one trail red that
marks only the primary action and where you are. Survey plates: every photo
and screenshot sits in a pale frame at one scale on one baseline. Archivo only:
condensed uppercase for display and map labels, normal width for reading,
tabular numerals for dates and counts. Recognisable with the content removed:
contours, a solid red trail, ringed and dotted pins, spot heights, a frosted
legend card.

STORY: The visitor reads "Built in Bicol. Running across the Philippines.",
sees the portrait at the trailhead and two paths: a business starts a project,
a hiring manager hires for a role. The elevation strip proves the route
(products, projects shipped, case studies, places; 2020 to now). The field map
shows where the work runs; the own products and six trail journals show how.
They plan the route in the form, or ask Chunks.

FIRST VIEWPORT (1440×900): the floating legend card at the top. Left, over
contours: the eyebrow "Full-stack developer · Naga City, Philippines", then the
headline in condensed uppercase Archivo, three authored lines rising one at a
time, about 80-110px; the subheadline (19px) under it; "Start a project" (trail
red, primary) and "Hire me for a role" (ink outline) near y 640. Right: the
hiking portrait on a survey plate, about 350×440, its top near y 150; the red
trail draws out of the plate toward the bottom left on load. The elevation
strip's heading sits on the bottom edge, inviting the scroll.

FORM: Isarog Trail Map, seed:03c5f4d98ec3bdbf, IMPECCABLE’S PICK over the rolled Abaca Weave
(Christian chose it on the decision page; sketch:
`.impeccable/mocks/decision/model-pick.html`).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Motion choreography

Three verbs: draw (trails and routes stroke in), rise (lines lift into place,
one at a time), pan (S3: the map and the page glide to a waypoint).
- Trailhead, on load, once, under 2 s, no-preference only: headline lines rise
  `translateY(0.35em) → 0` (slow/smooth, `--stagger-line` apart); the
  subheadline and buttons rise 16px at 250ms; the trail draws out of the plate
  from 300ms over `--dur-draw`. Nothing fades.
- Between sections: short trail segments draw on their own view timeline
  (`entry 10% cover 45%`), inside both gates.
- Elevation strip: the "you are here" marker is the only thing on the page that
  follows the page's scroll (`scroll(root)`, both gates); at rest it sits at now.
- Outside the gates the trail is fully drawn and nothing is offset.
```

Then run:
`~/.claude/skills/impeccable/scripts/impeccable surface-brief write app/page.tsx <scratchpad>/app-page-brief.md app/projects/page.tsx "app/projects/[slug]/page.tsx" app/not-found.tsx`

If the command is unavailable or errors, edit `.impeccable/surfaces/app-page-tsx.md` by hand: keep the front matter (lines 1-6) exactly and replace everything below it with the body above.

- [ ] **Step 5: Read it back**

Run: `~/.claude/skills/impeccable/scripts/impeccable surface-brief read app/page.tsx`
Expected: the front matter, then the body above with all six blocks and `seed:03c5f4d98ec3bdbf`.

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run tests/content/direction-contract.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 7: Gates and commit**

Run the four gates (Global Constraints). Then:

```bash
git add .impeccable/surfaces/app-page-tsx.md tests/content/direction-contract.test.ts
git commit -m "docs(impeccable): isarog trail map direction contract for the homepage" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Trailhead copy and verified places

**Model:** Sonnet

**Files:**
- Modify: `types/index.ts` (add `PlacePrecision`, `ProjectPlace`; `Project.place?`)
- Modify: `lib/proof.ts` (add `numberWord`)
- Modify: `lib/data.ts` (imports; `heroContent`; place constants; `place` on eleven projects)
- Create: `lib/places.ts`
- Create: `tests/content/hero-copy.test.ts`, `tests/content/places.test.ts`
- Modify: `tests/content/proof.test.ts`

**Interfaces:**
- Consumes: `projects`, `NUMBER_WORDS` (private in `lib/proof.ts`).
- Produces:
  - `type PlacePrecision = 'city' | 'region'`; `interface ProjectPlace { name: string; region: string; lat: number; lng: number; precision: PlacePrecision; evidence: string }`; `Project.place?: ProjectPlace`.
  - `numberWord(n: number): string` in `lib/proof.ts` (`4` → `'four'`; throws outside 1-20).
  - `heroContent.eyebrow: string`, `heroContent.headlineLines: string[]`, `heroContent.headline: string` (getter), `heroContent.subheadline: string` (getter).
  - `lib/places.ts`: `interface PlaceGroup { name; region; lat; lng; precision; projects: Project[] }`, `placeGroups(list: Project[]): PlaceGroup[]` (north to south, projects in data order), `unplacedProjects(list: Project[]): Project[]`.

- [ ] **Step 1: Write the failing tests**

Create `tests/content/hero-copy.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { heroContent, projects } from '@/lib/data'
import { numberWord } from '@/lib/proof'

// Spec §6: the trailhead copy. The own-products count is derived from the
// Products band, never typed by hand.
describe('trailhead copy', () => {
  it('names the role and the base in the eyebrow', () => {
    expect(heroContent.eyebrow).toBe('Full-stack developer · Naga City, Philippines')
  })

  it('sets the headline as three authored lines that read as one sentence', () => {
    expect(heroContent.headlineLines).toEqual(['Built in Bicol.', 'Running across', 'the Philippines.'])
    expect(heroContent.headline).toBe('Built in Bicol. Running across the Philippines.')
  })

  it('derives the own-products count in the subheadline from the Products band', () => {
    const count = projects.filter((p) => p.band === 'Products').length
    expect(heroContent.subheadline).toContain(`and ${numberWord(count)} products of my own.`)
    expect(heroContent.subheadline).toBe(
      'Booking and payment sites for travel businesses, AI automation for teams, and four products of my own. Open to client projects and to full-time remote roles.',
    )
  })

  it('keeps the title that metadata and JSON-LD read until S5', () => {
    expect(heroContent.title).toBe('Mid-level full-stack developer')
  })

  it('uses no em-dash and claims no years of experience', () => {
    for (const text of [heroContent.eyebrow, heroContent.headline, heroContent.subheadline]) {
      expect(text).not.toContain('—')
      expect(text).not.toMatch(/\d+\+?\s*years?/i)
    }
  })
})
```

Create `tests/content/places.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { projects } from '@/lib/data'
import { placeGroups, unplacedProjects } from '@/lib/places'

// Spec §5, the map data rule: a pin needs a place the project's own data
// names. Projects without one are listed beside the map, never guessed.
const PINNED: Record<string, string> = {
  'connecta-ph': 'Naga City',
  'beachbus-nfc': 'Palawan',
  lunad: 'Naga City',
  graceland: 'Bicol',
  elnido: 'El Nido',
  beachbus: 'Palawan',
  'upcat-review-plus': 'Bicol',
  'azalea-baguio': 'Baguio City',
  'azalea-boracay': 'Boracay',
  'naga-city-guide': 'Naga City',
  'eastwind-beach-villas': 'El Nido',
}

describe('verified places', () => {
  it('pins exactly the projects whose own words name a place', () => {
    const pinned = Object.fromEntries(projects.filter((p) => p.place).map((p) => [p.id, p.place!.name]))
    expect(pinned).toEqual(PINNED)
  })

  it('quotes the place from the project’s own title or description', () => {
    for (const p of projects) {
      if (!p.place) continue
      expect(`${p.title} ${p.description}`, p.id).toContain(p.place.evidence)
    }
  })

  it('leaves the OCS control panel unplaced: its own words name no town', () => {
    const ocs = projects.find((p) => p.id === 'ocs-wp-control')!
    expect(`${ocs.title} ${ocs.description}`).not.toMatch(/Naga/)
    expect(ocs.place).toBeUndefined()
  })

  it('uses public centres, two decimals at most, inside the Philippines', () => {
    for (const p of projects) {
      if (!p.place) continue
      const { lat, lng } = p.place
      expect(lat, p.id).toBeGreaterThanOrEqual(4.5)
      expect(lat, p.id).toBeLessThanOrEqual(21.2)
      expect(lng, p.id).toBeGreaterThanOrEqual(116.9)
      expect(lng, p.id).toBeLessThanOrEqual(126.7)
      for (const v of [lat, lng]) expect(Math.round(v * 100) / 100, p.id).toBe(v)
    }
  })

  it('gives one place one set of coordinates and one precision', () => {
    for (const group of placeGroups(projects)) {
      for (const p of group.projects) {
        expect(p.place!.lat, p.id).toBe(group.lat)
        expect(p.place!.lng, p.id).toBe(group.lng)
        expect(p.place!.precision, p.id).toBe(group.precision)
      }
    }
  })

  it('draws Palawan and Bicol as regions, every other place as a city', () => {
    const precision = Object.fromEntries(placeGroups(projects).map((g) => [g.name, g.precision]))
    expect(precision).toEqual({
      'Baguio City': 'city',
      'Naga City': 'city',
      Bicol: 'region',
      Boracay: 'city',
      'El Nido': 'city',
      Palawan: 'region',
    })
  })
})

describe('placeGroups', () => {
  it('groups pinned projects by place, north to south', () => {
    expect(placeGroups(projects).map((g) => g.name)).toEqual(['Baguio City', 'Naga City', 'Bicol', 'Boracay', 'El Nido', 'Palawan'])
  })

  it('keeps each place’s projects in data order', () => {
    const naga = placeGroups(projects).find((g) => g.name === 'Naga City')!
    expect(naga.projects.map((p) => p.id)).toEqual(['connecta-ph', 'lunad', 'naga-city-guide'])
  })

  it('lists every other project as unplaced, in data order', () => {
    expect(unplacedProjects(projects).map((p) => p.id)).toEqual([
      'iskotify',
      'naga-perks-giya-app',
      'latag',
      'ocs-wp-control',
      'aman-webapp',
      'skimcare',
      'acad1',
      'downtown-district-hotel',
      'aralabroad',
    ])
  })
})
```

Append to `tests/content/proof.test.ts` (and change its import line to `import { numberWord, splitProofPoint } from '@/lib/proof'`):

```ts
describe('numberWord', () => {
  it('writes a count as a word, the way copy reads', () => {
    expect(numberWord(4)).toBe('four')
    expect(numberWord(19)).toBe('nineteen')
  })

  it('round-trips with splitProofPoint', () => {
    for (const n of [1, 6, 11, 20]) expect(splitProofPoint(`${numberWord(n)} things`).value).toBe(String(n))
  })

  it('refuses a count it has no word for', () => {
    expect(() => numberWord(0)).toThrow()
    expect(() => numberWord(21)).toThrow()
  })
})
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/content/hero-copy.test.ts tests/content/places.test.ts tests/content/proof.test.ts`
Expected: FAIL. `hero-copy` and `proof` with `SyntaxError: The requested module '/lib/proof.ts' does not provide an export named 'numberWord'` (or `numberWord is not a function`); `places` with `Failed to resolve import "@/lib/places" from "tests/content/places.test.ts". Does the file exist?`

- [ ] **Step 3: Add the place types**

In `types/index.ts`, after the `DisplayStatus` type, add:

```ts
/** How exact a pin is: a city's centre (a dot) or a whole region's (a ring). */
export type PlacePrecision = 'city' | 'region'

/**
 * A project's verified place on the field map (spec §5, the map data rule).
 * `evidence` quotes the words in the project's own title or description that
 * name the place; tests/content/places.test.ts checks it.
 */
export interface ProjectPlace {
  name: string
  region: string
  /** Public city or region centre, two decimals. */
  lat: number
  lng: number
  precision: PlacePrecision
  evidence: string
}
```

In the `Project` interface, after `featured?: boolean;`, add:

```ts
  /** Where the project runs, only where its own words name the place. */
  place?: ProjectPlace;
```

- [ ] **Step 4: Add `numberWord`**

Append to `lib/proof.ts`:

```ts
/** 4 → 'four': a count as the copy writes it. Throws rather than guessing outside 1-20. */
export function numberWord(n: number): string {
  const word = Object.keys(NUMBER_WORDS).find((w) => NUMBER_WORDS[w] === n)
  if (word === undefined) throw new Error(`No number word for ${n}`)
  return word
}
```

- [ ] **Step 5: Add the trailhead copy**

In `lib/data.ts`, change line 1 to:

```ts
import { Project, ProjectPlace, ProjectSector, Skill, SocialLink, ContactInfo, ExperienceItem, EducationItem, Recommendation, GalleryImage, NavigationItem, SECTOR_ORDER } from '@/types'
import { numberWord } from '@/lib/proof'
```

In `heroContent`, directly after `name: 'Christian Raro',`, add:

```ts
  // The trailhead (spec §6). The headline is three authored lines: each stays
  // one line in every font, so the font swap never re-wraps it (the R6 CLS
  // lesson). `title` below stays: metadata and JSON-LD read it until S5.
  eyebrow: 'Full-stack developer · Naga City, Philippines',
  headlineLines: ['Built in Bicol.', 'Running across', 'the Philippines.'],
  get headline(): string {
    return this.headlineLines.join(' ')
  },
  // A getter for the same reason as `specialism`: `projects` is declared below.
  // The count is the Products band, written as a word.
  get subheadline(): string {
    const own = projects.filter((p) => p.band === 'Products').length
    return `Booking and payment sites for travel businesses, AI automation for teams, and ${numberWord(own)} products of my own. Open to client projects and to full-time remote roles.`
  },
```

- [ ] **Step 6: Add the places**

In `lib/data.ts`, directly above `export const projects: Project[] = [`, add:

```ts
// Public city and region centres, two decimals (spec §5, the map data rule). A
// project is pinned only where its own title or description names the place;
// its `evidence` quotes those words and tests/content/places.test.ts checks
// them. Every other project is listed beside the map, never at a guessed point.
const NAGA_CITY: Omit<ProjectPlace, 'evidence'> = { name: 'Naga City', region: 'Camarines Sur', lat: 13.62, lng: 123.19, precision: 'city' }
const EL_NIDO: Omit<ProjectPlace, 'evidence'> = { name: 'El Nido', region: 'Palawan', lat: 11.2, lng: 119.42, precision: 'city' }
const PALAWAN: Omit<ProjectPlace, 'evidence'> = { name: 'Palawan', region: 'Philippines', lat: 9.84, lng: 118.74, precision: 'region' }
const BAGUIO_CITY: Omit<ProjectPlace, 'evidence'> = { name: 'Baguio City', region: 'Benguet', lat: 16.41, lng: 120.6, precision: 'city' }
const BORACAY: Omit<ProjectPlace, 'evidence'> = { name: 'Boracay', region: 'Aklan', lat: 11.97, lng: 121.92, precision: 'city' }
const BICOL: Omit<ProjectPlace, 'evidence'> = { name: 'Bicol', region: 'Philippines', lat: 13.4, lng: 123.4, precision: 'region' }
```

Then add one line directly after the `status:` line of each of these eleven entries (keep each on one line: `scripts/lib/read-projects.mjs` parses this file line by line):

| `id` | line to add after its `status:` line |
|---|---|
| `connecta-ph` | `    place: { ...NAGA_CITY, evidence: 'Built for Naga first' },` |
| `beachbus-nfc` | `    place: { ...PALAWAN, evidence: 'BeachBus Palawan' },` |
| `lunad` | `    place: { ...NAGA_CITY, evidence: 'Naga City' },` |
| `graceland` | `    place: { ...BICOL, evidence: 'Bicolano' },` |
| `elnido` | `    place: { ...EL_NIDO, evidence: 'El Nido' },` |
| `beachbus` | `    place: { ...PALAWAN, evidence: 'Palawan' },` |
| `upcat-review-plus` | `    place: { ...BICOL, evidence: 'Bicol' },` |
| `azalea-baguio` | `    place: { ...BAGUIO_CITY, evidence: 'Baguio' },` |
| `azalea-boracay` | `    place: { ...BORACAY, evidence: 'Boracay' },` |
| `naga-city-guide` | `    place: { ...NAGA_CITY, evidence: 'Naga City' },` |
| `eastwind-beach-villas` | `    place: { ...EL_NIDO, evidence: 'San Fernando, El Nido, Palawan' },` |

`ocs-wp-control` gets no place: its description does not name Naga.

- [ ] **Step 7: Write the place helpers**

Create `lib/places.ts`:

```ts
import type { Project, ProjectPlace } from '@/types'

/** One pin on the field map: a verified place and the projects that run there. */
export interface PlaceGroup extends Omit<ProjectPlace, 'evidence'> {
  projects: Project[]
}

/**
 * Pinned projects grouped by place name, north to south (the map's reading
 * order). Within a place, projects keep their order in lib/data.ts, so the
 * first one is the pin's link.
 */
export function placeGroups(list: Project[]): PlaceGroup[] {
  const groups: PlaceGroup[] = []
  for (const project of list) {
    const place = project.place
    if (!place) continue
    const group = groups.find((g) => g.name === place.name)
    if (group) {
      group.projects.push(project)
    } else {
      groups.push({ name: place.name, region: place.region, lat: place.lat, lng: place.lng, precision: place.precision, projects: [project] })
    }
  }
  return groups.sort((a, b) => b.lat - a.lat)
}

/** Projects whose own data names no place: listed beside the map, never pinned. */
export function unplacedProjects(list: Project[]): Project[] {
  return list.filter((p) => !p.place)
}
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npx vitest run tests/content/hero-copy.test.ts tests/content/places.test.ts tests/content/proof.test.ts tests/content/script-inventory.test.ts`
Expected: PASS. `script-inventory` confirms the parser still reads every entry with the `place` lines in.

- [ ] **Step 9: Gates and commit**

Run the four gates. Then:

```bash
git add types/index.ts lib/proof.ts lib/data.ts lib/places.ts tests/content/hero-copy.test.ts tests/content/places.test.ts tests/content/proof.test.ts
git commit -m "data(home): trailhead copy and verified project places" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Map projection and Philippines outline

**Model:** Sonnet

**Files:**
- Create: `lib/geo.ts`
- Create: `scripts/build-ph-outline.mjs`
- Create (generated, committed): `lib/ph-outline.ts`
- Modify: `package.json`, `package-lock.json` (two devDependencies)
- Modify: `CLAUDE.md` (Build & Run list)
- Create: `tests/content/geo.test.ts`

**Interfaces:**
- Consumes: nothing from the app.
- Produces:
  - `lib/geo.ts`: `MAP_BOUNDS = { west: 116.9, east: 126.7, south: 4.5, north: 21.2 }`, `MAP_WIDTH = 600`, `MAP_HEIGHT = 1022`, `MAP_VIEWBOX = '0 0 600 1022'`, `project(lat: number, lng: number): { x: number; y: number }` (equirectangular, one decimal).
  - `lib/ph-outline.ts`: `phOutline: string` (SVG path data), `phOutlineViewBox: string` (equals `MAP_VIEWBOX`).

- [ ] **Step 1: Write the failing tests**

Create `tests/content/geo.test.ts`:

```ts
import { statSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { MAP_HEIGHT, MAP_VIEWBOX, MAP_WIDTH, project } from '@/lib/geo'
import { phOutline, phOutlineViewBox } from '@/lib/ph-outline'

// Spec §5: the field map. One equirectangular projection over the
// Philippines' bounding box, shared by the generated outline and the pins.
describe('map projection', () => {
  it('maps the bounding box onto a 600-wide viewBox, one scale on both axes', () => {
    expect(MAP_WIDTH).toBe(600)
    expect(MAP_HEIGHT).toBe(1022)
    expect(MAP_VIEWBOX).toBe('0 0 600 1022')
  })

  it('puts the north-west corner at the origin and the south-east at the far corner', () => {
    expect(project(21.2, 116.9)).toEqual({ x: 0, y: 0 })
    const se = project(4.5, 126.7)
    expect(se.x).toBe(600)
    expect(se.y).toBeCloseTo(MAP_HEIGHT, 0)
  })

  it('places Naga City where the pin and the outline both expect it', () => {
    expect(project(13.62, 123.19)).toEqual({ x: 385.1, y: 464.1 })
  })
})

describe('Philippines outline', () => {
  it('shares the projection’s viewBox', () => {
    expect(phOutlineViewBox).toBe(MAP_VIEWBOX)
  })

  it('is closed rings of points inside the viewBox', () => {
    expect(phOutline).toMatch(/^M/)
    expect(phOutline).toMatch(/Z$/)
    const numbers = phOutline.replace(/[MZ]/g, ' ').trim().split(/\s+/).map(Number)
    expect(numbers.length % 2).toBe(0)
    numbers.forEach((n, i) => {
      expect(Number.isFinite(n)).toBe(true)
      expect(n).toBeGreaterThanOrEqual(-1)
      expect(n).toBeLessThanOrEqual(i % 2 === 0 ? MAP_WIDTH + 1 : MAP_HEIGHT + 1)
    })
  })

  it('keeps the main islands', () => {
    expect(phOutline.match(/M/g)!.length).toBeGreaterThanOrEqual(10)
  })

  it('weighs at most 16 KB', () => {
    expect(statSync('lib/ph-outline.ts').size).toBeLessThanOrEqual(16 * 1024)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/content/geo.test.ts`
Expected: FAIL with `Failed to resolve import "@/lib/geo" from "tests/content/geo.test.ts". Does the file exist?`

- [ ] **Step 3: Write the projection**

Create `lib/geo.ts`:

```ts
// The field map's projection (spec §5): equirectangular over the Philippines'
// bounding box, one scale on both axes. Plain TypeScript with no imports, so
// scripts/build-ph-outline.mjs can import this file under Node's type
// stripping: the generated outline and the pins share these numbers.
export const MAP_BOUNDS = { west: 116.9, east: 126.7, south: 4.5, north: 21.2 } as const

export const MAP_WIDTH = 600
const SCALE = MAP_WIDTH / (MAP_BOUNDS.east - MAP_BOUNDS.west)
export const MAP_HEIGHT = Math.round((MAP_BOUNDS.north - MAP_BOUNDS.south) * SCALE)
export const MAP_VIEWBOX = `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`

const round = (v: number): number => Math.round(v * 10) / 10

/** A latitude and longitude as map units, x right and y down, one decimal. */
export function project(lat: number, lng: number): { x: number; y: number } {
  return { x: round((lng - MAP_BOUNDS.west) * SCALE), y: round((MAP_BOUNDS.north - lat) * SCALE) }
}
```

Run: `npx vitest run tests/content/geo.test.ts`
Expected: still FAIL, now with `Failed to resolve import "@/lib/ph-outline"` (the file imports both modules, so no test in it runs until Step 6 writes the outline).

- [ ] **Step 4: Install the outline sources**

**controller: ask Christian before running `npm i -D world-atlas topojson-client`**

Run: `npm i -D world-atlas topojson-client`
Expected: `added 2 packages` (or a few more for transitive deps); `package.json` gains both under `devDependencies`.

- [ ] **Step 5: Write the outline script**

Create `scripts/build-ph-outline.mjs`:

```js
// One-off: builds lib/ph-outline.ts, the field map's outline of the
// Philippines, from Natural Earth 1:50m (public domain) via world-atlas,
// projected with lib/geo.ts so the outline and the pins agree.
//
// Run: node scripts/build-ph-outline.mjs
// Needs Node 22.18 or later, which strips the types from lib/geo.ts on import.
// Never runs in CI or the build: commit the generated file.

import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { feature } from 'topojson-client'
import { MAP_HEIGHT, MAP_VIEWBOX, MAP_WIDTH, project } from '../lib/geo.ts'

const require = createRequire(import.meta.url)
const topology = JSON.parse(readFileSync(require.resolve('world-atlas/countries-50m.json'), 'utf8'))
const countries = feature(topology, topology.objects.countries)
const ph = countries.features.find((f) => f.id === '608' || f.properties?.name === 'Philippines')
if (!ph) throw new Error('The Philippines (ISO 3166 numeric 608) is not in world-atlas countries-50m')

// Islands smaller than this many square map units are dropped (one unit is
// about 1.8 km). A vertex nearer than MIN_STEP units to the last kept one is
// dropped. Raise either if the file comes out over budget.
const MIN_AREA = 2
const MIN_STEP = 1.2
const MAX_BYTES = 16 * 1024

const polygons = ph.geometry.type === 'Polygon' ? [ph.geometry.coordinates] : ph.geometry.coordinates

function area(points) {
  let sum = 0
  for (let i = 0; i < points.length; i++) {
    const a = points[i]
    const b = points[(i + 1) % points.length]
    sum += a.x * b.y - b.x * a.y
  }
  return Math.abs(sum) / 2
}

const inside = (p) => p.x >= 0 && p.x <= MAP_WIDTH && p.y >= 0 && p.y <= MAP_HEIGHT
// A coast a hair past the bounding box is held on its edge.
const clamp = (p) => ({ x: Math.min(MAP_WIDTH, Math.max(0, p.x)), y: Math.min(MAP_HEIGHT, Math.max(0, p.y)) })

const rings = []
for (const polygon of polygons) {
  // The outer ring only: Natural Earth's country polygons carry no lakes here.
  const projected = polygon[0].map(([lng, lat]) => project(lat, lng))
  if (!projected.some(inside)) continue
  const outer = projected.map(clamp)
  if (area(outer) < MIN_AREA) continue
  const kept = [outer[0]]
  for (const p of outer.slice(1)) {
    const last = kept[kept.length - 1]
    if (Math.hypot(p.x - last.x, p.y - last.y) >= MIN_STEP) kept.push(p)
  }
  if (kept.length >= 3) rings.push(kept)
}

// "M x y x y … Z" per island: after a moveto, further pairs are linetos.
const d = rings.map((ring) => `M${ring.map((p) => `${p.x} ${p.y}`).join(' ')}Z`).join('')

const out = `// Generated by scripts/build-ph-outline.mjs from Natural Earth 1:50m
// (public domain, via world-atlas), in the projection of lib/geo.ts. Do not
// edit by hand: rerun the script.
export const phOutlineViewBox = '${MAP_VIEWBOX}'

export const phOutline =
  '${d}'
`

const bytes = Buffer.byteLength(out)
if (bytes > MAX_BYTES) throw new Error(`lib/ph-outline.ts would be ${bytes} bytes (budget ${MAX_BYTES}): raise MIN_AREA or MIN_STEP`)
writeFileSync('lib/ph-outline.ts', out)
console.log(`lib/ph-outline.ts: ${rings.length} islands, ${bytes} bytes`)
```

- [ ] **Step 6: Generate the outline**

Run: `node scripts/build-ph-outline.mjs`
Expected: `lib/ph-outline.ts: <N> islands, <B> bytes` with N ≥ 10 and B ≤ 16384. If it throws over budget, raise `MIN_STEP` to `1.6`, then `MIN_AREA` to `4`, rerun, and keep the values that fit.

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npx vitest run tests/content/geo.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 8: List the script in CLAUDE.md**

In `CLAUDE.md`, after the line `- Resume PDF: \`npm run resume\``, add:

```markdown
- Map outline: `node scripts/build-ph-outline.mjs` (one-off; Node 22.18+; rewrites `lib/ph-outline.ts` from Natural Earth via the `world-atlas` and `topojson-client` devDependencies; commit the result)
```

- [ ] **Step 9: Gates and commit**

Run the four gates. Then:

```bash
git add lib/geo.ts lib/ph-outline.ts scripts/build-ph-outline.mjs package.json package-lock.json CLAUDE.md tests/content/geo.test.ts
git commit -m "feat(map): philippines outline and the field map projection" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Trail topology: load, view and the elevation marker

**Model:** Opus. Load the `modern-web-guidance` skill before Step 3.

**Files:**
- Modify: `components/map/trail-path.tsx`
- Create: `components/map/trail-segment.tsx`
- Modify: `lib/contours.ts` (add `trailSegments`, `elevationProfile`)
- Modify: `app/globals.css` (the trail block at the end of the file)
- Rewrite: `tests/design/trail-motion.test.ts`
- Modify: `tests/design/catalog-motion.test.ts`, `tests/components/chrome.test.tsx`

**Interfaces:**
- Consumes: `--dur-draw`, `--ease-smooth`, and `--t-trail` (set by `.trailhead` in Task 6; `0ms` until then).
- Produces:
  - `<TrailPath d={string} viewBox={string} mode={'load' | 'view'} className?={string} />`: path class `trail-draw trail-draw--load` or `trail-draw trail-draw--view`; a view-mode `<svg>` also carries `trail-view`.
  - `<TrailSegment variant={0 | 1} />` server component.
  - `trailSegments: readonly [{ d; viewBox }, { d; viewBox }]`, `elevationProfile: { d: string; viewBox: string }` in `lib/contours.ts`.
  - CSS: `.trail-view`, `.trail-draw--load`, `.trail-draw--view`, `.elevation-marker`, `@keyframes elevation-marker`.

- [ ] **Step 1: Write the failing tests**

Replace the whole of `tests/design/trail-motion.test.ts` with:

```ts
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parseCssRules } from '../helpers/css-rules'

// Spec §4 and the S2 trail topology: the trailhead's trail draws once on
// load; each short segment between sections draws on its own view timeline;
// only the elevation strip's marker follows the page's scroll. Outside the
// gates the trail is fully drawn and the marker sits at now.
const css = readFileSync('app/globals.css', 'utf8')
const rules = parseCssRules(css)
const trail = rules.filter((r) => r.selector.includes('.trail-draw'))
const NO_PREF = '@media (prefers-reduced-motion: no-preference)'

describe('trail draw', () => {
  it('draws the trailhead once on load, only when motion is allowed', () => {
    const load = trail.filter((r) => r.selector === '.trail-draw--load')
    expect(load).toHaveLength(1)
    expect(load[0].ancestors).toEqual([NO_PREF])
    expect(load[0].body).toMatch(/animation:\s*trail-draw var\(--dur-draw\) var\(--ease-smooth\) var\(--t-trail, 0ms\) both/)
    expect(load[0].body).not.toMatch(/animation-timeline/)
  })

  it('draws each segment on its own view timeline, inside both gates', () => {
    const view = trail.filter((r) => r.selector === '.trail-draw--view')
    expect(view).toHaveLength(1)
    expect(view[0].ancestors).toEqual(['@supports (animation-timeline: view())', NO_PREF])
    expect(view[0].body).toMatch(/animation-timeline:\s*--trail-segment;/)
    expect(view[0].body).toMatch(/animation-range:\s*entry 10% cover 45%/)
    // The timeline is named on the <svg> (a CSS box), not on the path.
    const scope = rules.filter((r) => r.selector === '.trail-view')
    expect(scope).toHaveLength(1)
    expect(scope[0].ancestors).toEqual([])
    expect(scope[0].body).toMatch(/view-timeline:\s*--trail-segment block/)
  })

  it('never follows the page scroll', () => {
    for (const r of trail) expect(r.body, r.selector).not.toMatch(/scroll\(/)
  })

  it('is fully drawn outside the gates', () => {
    const base = trail.filter((r) => r.ancestors.every((a) => a.startsWith('@layer')))
    expect(base.length).toBeGreaterThan(0)
    for (const r of base) expect(r.body).not.toMatch(/stroke-dashoffset:\s*1\b/)
  })

  it('never hides the trail outside its keyframes', () => {
    for (const r of trail) expect(r.body, r.selector).not.toMatch(/stroke-dashoffset:\s*1\b/)
    const keyframes = css.match(/@keyframes trail-draw \{([\s\S]*?)\n\}/)?.[1]
    expect(keyframes).toBeDefined()
    expect(keyframes).toMatch(/from\s*\{[^}]*stroke-dashoffset:\s*1\b/)
  })

  it('never loops', () => {
    for (const r of trail) expect(r.body).not.toMatch(/infinite/)
  })
})

describe('elevation marker', () => {
  const marker = rules.filter((r) => r.selector === '.elevation-marker')

  it('is the one element on the page scroll, inside both gates', () => {
    expect(marker).toHaveLength(1)
    expect(marker[0].ancestors).toEqual(['@supports (animation-timeline: scroll())', NO_PREF])
    expect(marker[0].body).toMatch(/animation-timeline:\s*scroll\(root\)/)
  })

  it('moves by transform only and rests at now', () => {
    const frames = rules.filter((r) => r.ancestors.includes('@keyframes elevation-marker'))
    expect(frames.map((r) => r.selector)).toEqual(['from', 'to'])
    for (const r of frames) {
      expect(r.body).toMatch(/transform:/)
      expect(r.body).not.toMatch(/opacity/)
    }
    expect(frames[1].body).toMatch(/transform:\s*none/)
  })
})
```

In `tests/design/catalog-motion.test.ts`, replace:

```ts
    // The trail (.trail-draw, spec §4) is the one page-scroll timeline; cards
    // and screenshots stay off every scroll timeline (checked above). No
    // object-position animation.
    for (const r of rules) {
      if (/scroll\(root/.test(r.body)) expect(r.selector, r.selector).toMatch(/^\.trail-draw$/)
    }
```

with:

```ts
    // The elevation strip's "you are here" marker (.elevation-marker, the S2
    // trail topology) is the one page-scroll timeline; cards and screenshots
    // stay off every scroll timeline (checked above). No object-position
    // animation.
    for (const r of rules) {
      if (/scroll\(root/.test(r.body)) expect(r.selector, r.selector).toMatch(/^\.elevation-marker$/)
    }
```

In `tests/components/chrome.test.tsx`, add the imports:

```tsx
import { TrailSegment } from '@/components/map/trail-segment'
```

and change `import { trailheadContours, trailheadTrail } from '@/lib/contours'` to `import { trailSegments, trailheadContours, trailheadTrail } from '@/lib/contours'`. Replace the test `renders the trail with a unit path length and the draw class` with:

```tsx
  it('renders the trailhead trail with a unit path length, drawn once on load', () => {
    const html = renderToStaticMarkup(<TrailPath mode="load" d={trailheadTrail.d} viewBox={trailheadTrail.viewBox} />)
    expect(html).toContain('pathLength="1"')
    expect(html).toContain('class="trail-draw trail-draw--load"')
    expect(html).toContain('aria-hidden="true"')
    expect(html).not.toContain('vector-effect')
    expect(html).not.toContain('trail-view')
  })

  it('renders a segment between sections on its own view timeline', () => {
    const html = renderToStaticMarkup(<TrailSegment variant={0} />)
    expect(html).toMatch(/<svg[^>]*class="[^"]*\btrail-view\b/)
    expect(html).toContain('class="trail-draw trail-draw--view"')
    expect(html).toContain(`d="${trailSegments[0].d}"`)
    expect(html).toMatch(/^<div aria-hidden="true"/)
  })
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/design/trail-motion.test.ts tests/design/catalog-motion.test.ts tests/components/chrome.test.tsx`
Expected: FAIL. `trail-motion`: `expected [] to have a length of 1` (no `.trail-draw--load`) and the scroll check on `.trail-draw`; `catalog-motion`: `expected '.trail-draw' to match /^\.elevation-marker$/`; `chrome`: `Failed to resolve import "@/components/map/trail-segment"`.

- [ ] **Step 3: Rewrite the trail CSS**

In `app/globals.css`, replace everything from the comment `/* The trail (spec §4): fully drawn by default; drawn with the page's scroll` to the end of the file with:

```css
/*
 * The trail (spec §4). Fully drawn by default. Where motion is allowed it
 * draws: the trailhead's once on load (.trail-draw--load), and each short
 * segment between homepage sections as it scrolls into view
 * (.trail-draw--view). A segment's view timeline is named on its <svg>
 * (.trail-view), a CSS box: an SVG <path> has none, so an anonymous view() on
 * the path would stay inactive. Never loops; never follows the page's scroll.
 */
.trail-draw {
	stroke-dasharray: 1;
	stroke-dashoffset: 0;
}
.trail-view {
	view-timeline: --trail-segment block;
}

@media (prefers-reduced-motion: no-preference) {
	.trail-draw--load {
		animation: trail-draw var(--dur-draw) var(--ease-smooth) var(--t-trail, 0ms) both;
	}
}

@supports (animation-timeline: view()) {
	@media (prefers-reduced-motion: no-preference) {
		.trail-draw--view {
			animation: trail-draw linear both;
			animation-timeline: --trail-segment;
			animation-range: entry 10% cover 45%;
		}
	}
}

/*
 * The elevation strip's "you are here" marker
 * (components/sections/elevation-strip.tsx) is the one element that follows
 * the page's scroll. At rest it sits at now; where scroll timelines exist and
 * motion is allowed it travels from the strip's start to now as the page is
 * read. Transform only.
 */
@supports (animation-timeline: scroll()) {
	@media (prefers-reduced-motion: no-preference) {
		.elevation-marker {
			animation: elevation-marker linear both;
			animation-timeline: scroll(root);
		}
	}
}

@keyframes elevation-marker {
	from {
		transform: translateX(-100%);
	}
	to {
		transform: none;
	}
}

@keyframes trail-draw {
	from {
		stroke-dashoffset: 1;
	}
	to {
		stroke-dashoffset: 0;
	}
}
```

- [ ] **Step 4: Give the trail its two modes**

Replace the whole of `components/map/trail-path.tsx` with:

```tsx
import { cn } from '@/lib/utils'

interface TrailPathProps {
  d: string
  viewBox: string
  /**
   * load: draws once as the page loads (the trailhead). view: draws as its
   * own box scrolls into view (a segment between sections). Outside the
   * motion gates both are simply fully drawn.
   */
  mode: 'load' | 'view'
  className?: string
}

// The red trail (spec §4, "draw"). pathLength="1" lets the CSS draw it with a
// unit dash (app/globals.css, .trail-draw).
export function TrailPath({ d, viewBox, mode, className }: TrailPathProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={cn('pointer-events-none absolute inset-0 h-full w-full text-trail', mode === 'view' && 'trail-view', className)}
      fill="none"
    >
      {/* No vector-effect here: non-scaling-stroke makes Chromium ignore the pathLength-based dash offset, so the trail would never draw. */}
      <path
        d={d}
        pathLength={1}
        className={cn('trail-draw', mode === 'load' ? 'trail-draw--load' : 'trail-draw--view')}
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="round"
      />
    </svg>
  )
}
```

- [ ] **Step 5: Add the segment paths and the elevation profile**

Append to `lib/contours.ts`:

```ts
// Short stretches of the trail between homepage sections, alternating
// direction so the trail zigzags down the page. 1440 x 120; the box crops the
// sides on a phone, so each curve crosses the middle.
export const trailSegments = [
  { d: 'M1040 0 C1040 60 400 60 400 120', viewBox: '0 0 1440 120' },
  { d: 'M400 0 C400 60 1040 60 1040 120', viewBox: '0 0 1440 120' },
] as const

// The elevation strip's ridge line, rising toward now. Stretched to the strip.
export const elevationProfile = {
  d: 'M0 50 C90 48 150 40 230 42 S380 30 470 34 S640 18 730 24 S900 8 1000 12 S1110 4 1152 2',
  viewBox: '0 0 1152 56',
}
```

- [ ] **Step 6: Write the segment component**

Create `components/map/trail-segment.tsx`:

```tsx
import { TrailPath } from '@/components/map/trail-path'
import { trailSegments } from '@/lib/contours'

interface TrailSegmentProps {
  /** 0 runs right to left, 1 left to right. */
  variant: 0 | 1
}

// A short stretch of the red trail between two homepage sections (spec §4):
// it draws as it scrolls into view. Decorative.
export function TrailSegment({ variant }: TrailSegmentProps) {
  const segment = trailSegments[variant]
  return (
    <div aria-hidden="true" className="relative mx-auto h-20 max-w-6xl md:h-28">
      <TrailPath mode="view" d={segment.d} viewBox={segment.viewBox} />
    </div>
  )
}
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npx vitest run tests/design/trail-motion.test.ts tests/design/catalog-motion.test.ts tests/components/chrome.test.tsx`
Expected: PASS.

- [ ] **Step 8: Gates and commit**

Run the four gates. Then:

```bash
git add components/map lib/contours.ts app/globals.css tests/design/trail-motion.test.ts tests/design/catalog-motion.test.ts tests/components/chrome.test.tsx
git commit -m "feat(motion): trail draws on load and per segment; the elevation marker owns the page scroll" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Font budget guard

**Model:** Sonnet

**Files:**
- Create: `tests/design/font-budget.test.ts`

**Interfaces:**
- Consumes: the build output `.next/static/media/*.p.woff2` (next/font marks the preloaded file with `.p`).
- Produces: a guard that the one preloaded Archivo file stays at or under 95 KB (S1 final review, Important 6).

- [ ] **Step 1: Make sure a build exists**

Run: `npm run build` (skip if `.next/static/media` already holds a `.p.woff2` from today).
Expected: build succeeds; `ls .next/static/media` lists exactly one file ending `.p.woff2` (about 90 KB today).

- [ ] **Step 2: Write the test**

Create `tests/design/font-budget.test.ts`:

```ts
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// S1 final review, Important 6: Archivo (latin, wdth axis) is the one font the
// first viewport waits for. next/font preloads it and names it *.p.woff2. The
// guard needs a build, and CI runs the tests before the build, so it skips
// where there is no build output; each sprint's final gate runs it after
// `npm run build`.
const MEDIA = join('.next', 'static', 'media')
const built = existsSync(MEDIA)
const BUDGET = 95 * 1024

describe.skipIf(!built)('font budget (after npm run build)', () => {
  const preloaded = built ? readdirSync(MEDIA).filter((f) => f.endsWith('.p.woff2')) : []

  it('preloads exactly one font file', () => {
    expect(preloaded).toHaveLength(1)
  })

  it('keeps it at or under 95 KB', () => {
    for (const f of preloaded) expect(statSync(join(MEDIA, f)).size, f).toBeLessThanOrEqual(BUDGET)
  })
})
```

- [ ] **Step 3: Run it**

Run: `npx vitest run tests/design/font-budget.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 4: Prove it bites**

Change `95 * 1024` to `80 * 1024`, run `npx vitest run tests/design/font-budget.test.ts`.
Expected: FAIL with `expected 90096 to be less than or equal to 81920` (the size may differ by a few bytes). Change it back to `95 * 1024` and rerun: PASS.

- [ ] **Step 5: Gates and commit**

Run the four gates. Then:

```bash
git add tests/design/font-budget.test.ts
git commit -m "test(perf): archivo font budget guard" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Trailhead replaces the hero

**Model:** Opus. Read `C:\Users\raroc\.claude\skills\impeccable\reference\craft-floor.md` and the direction contract (Task 1) before Step 3.

**Files:**
- Create: `components/sections/trailhead.tsx`
- Delete: `components/sections/hero.tsx`, `components/ui/proof-band.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css` (`.survey-plate`; trailhead rules; delete `.text-fluid-h1`, `.text-numeral-lg`, every `.hero-*` rule and keyframe; the reduced-motion block; the `.on-plane` comment)
- Create: `tests/components/homepage.test.tsx`
- Modify: `tests/components/sections.test.tsx`, `tests/components/chrome.test.tsx`, `tests/components/catalog-consistency.test.tsx`, `tests/design/motion-tokens.test.ts`, `tests/design/motion-visibility.test.ts`, `tests/design/performance.test.ts`, `tests/design/primary-button.test.ts`

**Interfaces:**
- Consumes: `heroContent.eyebrow`, `headlineLines`, `headline`, `subheadline`, `portraitAlt` (Task 2); `ContourField`, `TrailPath mode="load"`, `trailheadContours`, `trailheadTrail` (S1, Task 4); `ImageLightbox` (`src`, `alt`, `className`, children); `--stagger-line`, `--dur-slow`, `--dur-normal`, `--dur-draw`, `--ease-smooth`.
- Produces: `<Trailhead />` server component (`<section id="top">`); CSS `.survey-plate` (a `panel` frame, reused in Tasks 9, 10, 12 and by S3's `SurveyPlate`), `.trailhead` (`--t-lede: 250ms`, `--t-trail: 300ms`), `.trailhead-copy`, `.trailhead-title`, `.trailhead-line`, `.trailhead-rise`, keyframes `trailhead-line`, `trailhead-rise`.

- [ ] **Step 1: Write the failing tests**

Create `tests/components/homepage.test.tsx`:

```tsx
import { readFileSync } from 'node:fs'
import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Trailhead } from '@/components/sections/trailhead'
import { heroContent } from '@/lib/data'
import { parseCssRules } from '@/tests/helpers/css-rules'

// The Isarog Trail Map homepage (spec §5): one describe per section, in page
// order. Each S2 task adds its section here and to SECTIONS.
const css = readFileSync('app/globals.css', 'utf8')
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')

// Every new section, for the checks that hold for all of them.
const SECTIONS: [string, ReactElement][] = [
  ['Trailhead', <Trailhead key="trailhead" />],
]

describe('Trailhead', () => {
  const html = renderToStaticMarkup(<Trailhead />)
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? ''

  it('is the #top section, the eyebrow above the headline', () => {
    expect(html).toMatch(/^<section id="top" aria-labelledby="trailhead-title"/)
    expect(html).toContain(`>${heroContent.eyebrow}</p>`)
    expect(html.indexOf(heroContent.eyebrow)).toBeLessThan(html.indexOf('<h1'))
  })

  it('sets the headline one authored line per span, read as one sentence', () => {
    expect(h1.match(/class="trailhead-line"/g)).toHaveLength(heroContent.headlineLines.length)
    expect(h1.replace(/<[^>]+>/g, '')).toBe(heroContent.headline)
  })

  it('says what he builds and for whom, from data', () => {
    expect(html).toContain(`>${escape(heroContent.subheadline)}</p>`)
  })

  it('offers both paths: Start a project, then Hire me for a role, both to #contact until S4', () => {
    const primary = html.search(/<a href="#contact" class="press button-primary">Start a project/)
    const secondary = html.search(/<a href="#contact" class="press button-secondary">Hire me for a role/)
    expect(primary).toBeGreaterThan(-1)
    expect(secondary).toBeGreaterThan(primary)
  })

  it('sets the portrait on a survey plate inside the lightbox, named once', () => {
    expect(html).toMatch(new RegExp(`<button type="button" aria-label="View larger image: ${heroContent.portraitAlt}" class="[^"]*survey-plate`))
    expect(html).not.toMatch(/<img[^>]*alt="(Christian Raro|Portrait of)/)
  })

  it('draws the trail out of the plate on load, over the contours', () => {
    expect(html).toContain('class="trail-draw trail-draw--load"')
    expect(html).toMatch(/<svg aria-hidden="true"[^>]*class="[^"]*text-contour/)
  })
})

describe('proof renders visible without JavaScript', () => {
  it.each(SECTIONS)('%s ships no opacity:0 entrance', (_name, node) => {
    expect(renderToStaticMarkup(node)).not.toMatch(/opacity:\s*0/)
  })

  // Text is never painted (or measured for contrast) faded: every keyframe
  // moves by transform or stroke, except the overlays' fades and the live pulse.
  it('fades nothing on the page: keyframes move by transform or stroke only', () => {
    const FADES = new Set(['live-pulse', 'typing-fade', 'vt-fade-out', 'vt-fade-in'])
    const frames = parseCssRules(css).filter((r) => r.ancestors.some((a) => a.startsWith('@keyframes ')))
    expect(frames.length).toBeGreaterThan(0)
    for (const r of frames) {
      const name = r.ancestors.find((a) => a.startsWith('@keyframes '))!.slice('@keyframes '.length)
      if (FADES.has(name)) continue
      expect(r.body, name).not.toMatch(/opacity/)
    }
  })
})
```

In `tests/design/motion-tokens.test.ts`, replace the two tests `runs the hero load sequence only under no-preference, and switches it off under reduce` and `keeps the hero sequence under two seconds` with:

```ts
  it('runs the trailhead sequence only under no-preference, and switches it off under reduce', () => {
    const rules = parseRules(css)
    const animated = rules.filter(
      (r) => /\.trailhead-[\w-]+|\.trail-draw--load/.test(r.selector) && /animation(-name)?\s*:/.test(r.body) && !/animation\s*:\s*none/.test(r.body),
    )
    expect(animated.length).toBeGreaterThanOrEqual(3)
    for (const r of animated) {
      expect(r.ancestors, `${r.selector} needs no-preference`).toContain('@media (prefers-reduced-motion: no-preference)')
    }
    const off = rules.find(
      (r) =>
        r.ancestors.includes('@media (prefers-reduced-motion: reduce)') &&
        /animation\s*:\s*none/.test(r.body) &&
        ['.trailhead-line', '.trailhead-rise', '.trail-draw--load'].every((s) => r.selector.includes(s)),
    )
    expect(off).toBeDefined()
  })

  it('keeps the trailhead sequence under two seconds', () => {
    const ms = (name: string) => {
      const m = css.match(new RegExp(String.raw`${name}:\s*(\d+)ms;`))
      if (!m) throw new Error(`missing ${name}`)
      return Number(m[1])
    }
    const dur = motionTokens.duration
    const lines = heroContent.headlineLines.length
    // Every part of the sequence ends by 2 s, not just the latest-starting one.
    const ends = {
      // Headline lines: staggered, each over the slow duration.
      lines: (lines - 1) * ms('--stagger-line') + dur.slow * 1000,
      // Subheadline and buttons.
      rise: ms('--t-lede') + dur.normal * 1000,
      // The trail draws out of the plate.
      trail: ms('--t-trail') + dur.draw * 1000,
    }
    for (const [part, end] of Object.entries(ends)) {
      expect(end, part).toBeLessThan(2000)
    }
  })
```

In `tests/design/motion-visibility.test.ts`, delete the whole `describe('hero unfold', …)` block.

In `tests/design/performance.test.ts`:
- in `image priority`, change the expected list to `['components/case-study/project-screenshots.tsx', 'components/sections/trailhead.tsx']`;
- replace the test `never defers the hero, the work or the contact card (first viewport, or next to the footer)` with:

```ts
  it('never defers the first viewport, the work or the contact form', () => {
    for (const f of ['trailhead', 'products', 'rack', 'contact-console']) {
      const src = readFileSync(`components/sections/${f}.tsx`, 'utf8')
      expect(src, f).not.toMatch(/<section[^>]*defer-render/)
    }
  })
```

- replace the whole `describe('font swap', …)` block with:

```ts
describe('font swap', () => {
  // R6: in Arial the old hero's "Full-stack" broke at its hyphen into a third
  // line that collapsed when the web font arrived (CLS 0.23). The trailhead's
  // headline is authored lines, each held on one line in every font.
  it('never re-wraps a headline line, so the H1 keeps its line count across the swap', () => {
    expect(css).toMatch(/\.trailhead-line \{[^}]*white-space:\s*nowrap/)
  })
})
```

In `tests/design/primary-button.test.ts`, replace `expect(uses('components/sections/hero.tsx', 'Start a project')).toContain('button-primary')` with:

```ts
    expect(uses('components/sections/trailhead.tsx', 'Start a project')).toContain('button-primary')
    expect(uses('components/sections/trailhead.tsx', 'Hire me for a role')).toContain('button-secondary')
```

and replace the file's opening comment (the four lines from `// One primary button across every page` to `// lagoon fill with amber text. Nothing composes its own primary.`) with:

```ts
// One primary button across every page: .button-primary in globals.css, a
// trail-red fill with on-trail text, beside an ink-outline .button-secondary.
// Nothing composes its own primary.
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/components/homepage.test.tsx tests/design/motion-tokens.test.ts tests/design/performance.test.ts tests/design/primary-button.test.ts`
Expected: FAIL: `homepage` with `Failed to resolve import "@/components/sections/trailhead"`; `motion-tokens` with `expected 0 to be greater than or equal to 3` and `missing --t-trail`; `performance` with `ENOENT: no such file or directory, open 'components/sections/trailhead.tsx'` and the `.trailhead-line` match; `primary-button` with the same ENOENT.

- [ ] **Step 3: Replace the hero CSS**

In `app/globals.css`:

1. In `@layer base`, replace the comment above `.on-plane :focus-visible` (the two lines `/* The accent ring vanishes on an amber plane: inside one, focus is drawn in` and ` * the plane's own ink. */`) with:

```css
	/* Focus on a filled plane draws in the plane's own ink. Only the project
	 * header (components/case-study/project-header.tsx) still has one; S3
	 * removes this rule with it. */
```

2. In `@layer components`, delete the `.text-fluid-h1` rule with its comment (`/* H1: 56px at a 360px viewport rising to 112px. Anybody 800, condensed. */`) and the `.text-numeral-lg` rule with its comment (`/* The hero's two-point band: … */`). After the `.tabular` rule, add:

```css
	/* A survey plate (spec §3): the pale frame every photo and screenshot sits
	 * in. Panel paper, a line-strong hairline, an 8px margin. */
	.survey-plate {
		display: block;
		background: oklch(var(--panel));
		border: 1px solid oklch(var(--line-strong));
		padding: 0.5rem;
	}
```

3. Replace the block from `/* Hero tri-fold: the whole load timeline in one place (1.9s, runs once). */` through `.hero-title { font-size: clamp(2.75rem, 21cqi, 7rem); }` with:

```css
/* Trailhead (components/sections/trailhead.tsx): the first viewport's load
 * sequence in one place. The headline's lines rise in turn, the copy under
 * them rises, and the trail draws out of the portrait plate
 * (.trail-draw--load reads --t-trail), all once, ending by 1.9s. */
.trailhead {
	--t-lede: 250ms;
	--t-trail: 300ms;
}
/* The headline is sized to its column, never to the viewport. */
.trailhead-copy { container-type: inline-size; }
.trailhead-title { font-size: clamp(2.75rem, 13cqi, 7.5rem); }
/* Each authored line stays one line in every font (Arial, the fallback, is
 * wider than Archivo), so the font swap never re-wraps the headline: no layout
 * shift under the first viewport. */
.trailhead-line { display: block; white-space: nowrap; }
```

4. In the `@media (prefers-reduced-motion: no-preference) {` block that opens with `.postcard:is(:hover, :focus-within)`, delete everything from `	@keyframes hero-word {` down to and including the `	}` that closes `	@media (max-width: 767px) {` (the hero keyframes, the `.hero-*` rules and their stacked-layout overrides), leaving the block's own closing `}`. Before that closing `}`, add:

```css
	@keyframes trailhead-line {
		from { transform: translateY(0.35em); }
		to { transform: none; }
	}
	@keyframes trailhead-rise {
		from { transform: translateY(16px); }
		to { transform: none; }
	}
	/* Lines are painted from frame one (transform only), so LCP is unaffected. */
	.trailhead-line {
		animation: trailhead-line var(--dur-slow) var(--ease-smooth) both;
		animation-delay: calc(var(--i, 0) * var(--stagger-line));
	}
	.trailhead-rise {
		animation: trailhead-rise var(--dur-normal) var(--ease-smooth) var(--t-lede) both;
	}
```

5. In `@media (prefers-reduced-motion: reduce)`, replace the comment `/* Hero: every piece in its final state at first paint, creases drawn. */` and the `:is(.hero-word, .hero-rise, .hero-unfold-mid, .hero-unfold-right, .hero-crease-1, .hero-crease-2, .hero-proof-item) { … }` rule with:

```css
	/* Trailhead: every line in place and the trail drawn at first paint. */
	:is(.trailhead-line, .trailhead-rise, .trail-draw--load) {
		animation: none !important;
		transform: none;
	}
```

Then run `grep -n "hero-" app/globals.css`. Expected: no output.

- [ ] **Step 4: Write the trailhead**

Create `components/sections/trailhead.tsx`:

```tsx
import Image from 'next/image'
import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { ContourField } from '@/components/map/contour-field'
import { TrailPath } from '@/components/map/trail-path'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { trailheadContours, trailheadTrail } from '@/lib/contours'
import { heroContent } from '@/lib/data'

const PORTRAIT = '/assets/images/about/profile-hiking.jpg'

/**
 * The trailhead (spec §3, first viewport): the eyebrow and the condensed
 * headline over survey contours on the left, the two paths under them, and
 * the hiking portrait on a survey plate on the right, where the red trail
 * starts. On load the headline's lines rise in turn, the copy under them
 * rises and the trail draws out of the plate (CSS only, .trailhead-* and
 * .trail-draw--load in globals.css, 1.9s, once). Under reduced motion
 * everything is at rest from the first paint. Below 768px the plate stacks
 * under the buttons and the trail is not drawn: it would cross the text.
 */
export function Trailhead() {
  const lines = heroContent.headlineLines

  return (
    <section id="top" aria-labelledby="trailhead-title" className="trailhead relative overflow-x-clip">
      <ContourField paths={trailheadContours} viewBox={trailheadTrail.viewBox} />
      <TrailPath mode="load" d={trailheadTrail.d} viewBox={trailheadTrail.viewBox} className="hidden md:block" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-28 sm:px-8 md:min-h-[44rem] md:grid-cols-[7fr_5fr] md:items-start md:gap-12 md:pb-20 md:pt-36">
        <div className="trailhead-copy min-w-0">
          <p className="eyebrow">{heroContent.eyebrow}</p>
          <h1 id="trailhead-title" className="text-display trailhead-title mt-6 text-ink">
            {lines.map((line, i) => (
              <span key={line} className="trailhead-line" style={{ '--i': i } as CSSProperties}>
                {i < lines.length - 1 ? `${line} ` : line}
              </span>
            ))}
          </h1>
          <div className="trailhead-rise">
            <p className="text-lede mt-8 max-w-[34rem] text-muted-strong">{heroContent.subheadline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="press button-primary">
                Start a project
                <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
              </a>
              {/* S4 points this at /hire. */}
              <a href="#contact" className="press button-secondary">
                Hire me for a role
              </a>
            </div>
          </div>
        </div>

        <div className="md:justify-self-end md:pt-2">
          {/* alt="" on the image: the lightbox button around it carries the name. */}
          <ImageLightbox src={PORTRAIT} alt={heroContent.portraitAlt} className="survey-plate w-full max-w-[22rem]">
            <span className="relative block aspect-[4/5] overflow-hidden">
              {/* priority on its own line: tests/design/performance.test.ts finds it there. */}
              <Image
                src={PORTRAIT}
                alt=""
                fill
                priority
                sizes="336px"
                quality={85}
                className="object-cover"
              />
            </span>
          </ImageLightbox>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Put it on the page and delete the hero**

Replace the whole of `app/page.tsx` with:

```tsx
import type { Metadata } from 'next'
import { CaseStudies } from '@/components/sections/case-studies'
import { ContactConsole } from '@/components/sections/contact-console'
import { FieldLog } from '@/components/sections/field-log'
import { Products } from '@/components/sections/products'
import { Rack } from '@/components/sections/rack'
import { RouteLine } from '@/components/sections/route-line'
import { Stack } from '@/components/sections/stack'
import { Trailhead } from '@/components/sections/trailhead'

// The layout's metadata has no canonical (it would leak to the 404 page), so
// the homepage sets its own.
export const metadata: Metadata = { alternates: { canonical: '/' } }

// Section order: the Isarog Trail Map contract (.impeccable/surfaces/app-page-tsx.md,
// spec §5). S2 replaces the Portfolio 4.0 sections one task at a time; until
// its replacement lands, an old section keeps its place.
export default function HomePage() {
  return (
    <>
      <Trailhead />
      <Products />
      <Rack />
      <CaseStudies />
      <FieldLog />
      <RouteLine />
      <Stack />
      <ContactConsole />
    </>
  )
}
```

Run: `git rm components/sections/hero.tsx components/ui/proof-band.tsx`

- [ ] **Step 6: Retire the hero's tests**

In `tests/components/sections.test.tsx`:
- delete the `describe('Hero', …)`, `describe('primary proof renders visible without JavaScript', …)` and `describe('Lobby Rack type', …)` blocks (the uppercase ban is retired: the new world sets display and map labels in uppercase; the transform-only check now covers every keyframe in `homepage.test.tsx`);
- cut the `describe('Site legend', …)` and `describe('Footer', …)` blocks and paste them, unchanged, at the end of `tests/components/chrome.test.tsx`;
- replace everything above `describe('Products', () => {` (imports, the mock and the constants) with:

```tsx
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { CaseStudies } from '@/components/sections/case-studies'
import { FieldLog } from '@/components/sections/field-log'
import { Products } from '@/components/sections/products'
import { Rack } from '@/components/sections/rack'
import { RouteLine } from '@/components/sections/route-line'
import { Stack } from '@/components/sections/stack'
import { noPreviewCopy } from '@/components/ui/no-preview-tag'
import { groupForHomepage } from '@/lib/board'
import { FLAGSHIP_SLUGS, briefLead, getCaseStudy } from '@/lib/case-studies'
import {
  education,
  experience,
  galleryContent,
  galleryImages,
  projects,
  recommendations,
  sectionContent,
  skills,
} from '@/lib/data'
import { buildFieldLog } from '@/lib/field-log'
import { canLinkLive, fullShotFor, isEmbeddable } from '@/lib/project-page'
import type { Project } from '@/types'

// The Portfolio 4.0 homepage sections, retired one per task in S2
// (docs/superpowers/plans/2026-11-20-portfolio-v5-s2.md). The new sections are
// tested in tests/components/homepage.test.tsx.

const products = projects.filter((p) => p.band === 'Products')
const racked = projects.filter((p) => p.band !== 'Products')
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')
```

In `tests/components/chrome.test.tsx`, for the moved blocks: change `import { describe, expect, it } from 'vitest'` to `import { describe, expect, it, vi } from 'vitest'`; add `import { SiteLegend } from '@/components/site-legend'`; change the data import to `import { contactInfo, footerContent, navigationItems, resumeUrl } from '@/lib/data'`; and after the imports add:

```tsx
// The legend reads the route; outside the App Router there is none.
vi.mock('next/navigation', () => ({ usePathname: () => '/' }))
```

In `tests/components/catalog-consistency.test.tsx`, delete the `describe('hero AI proof', …)` block, and replace everything above `const CODE = ` (imports, mock and opening comment) with:

```tsx
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import ProjectsPage from '@/app/projects/page'
import ProjectPage from '@/app/projects/[slug]/page'
import { Products } from '@/components/sections/products'
import { Rack } from '@/components/sections/rack'
import { Stack } from '@/components/sections/stack'
import { BoardFilter } from '@/components/ui/board-filter'
import { heroContent, projects, projectsPageContent } from '@/lib/data'
import { splitProofPoint } from '@/lib/proof'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

// Refinement gate R5 (critique "Concrete UI bugs" 1-3): the same project
// carries the same edge code everywhere, the counts agree, and a filtered
// /projects says which band it shows.
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npx vitest run tests/components tests/design`
Expected: PASS.

- [ ] **Step 8: Gates and commit**

Run the four gates. Then:

```bash
git add components/sections components/ui app/page.tsx app/globals.css tests
git commit -m "feat(home): trailhead replaces the brochure hero" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Elevation strip replaces the route line

**Model:** Sonnet. Read `craft-floor.md` before Step 4.

**Files:**
- Create: `components/sections/elevation-strip.tsx`, `lib/elevation.ts`
- Delete: `components/sections/route-line.tsx`
- Modify: `lib/dates.ts` (add `startOfRange`)
- Modify: `lib/data.ts` (`navigationItems`; `sectionContent.timeline` replaces `sectionContent.changelog`)
- Modify: `components/ui/section-heading.tsx` (title class)
- Modify: `app/page.tsx`
- Modify: `app/globals.css` (`.text-section`; delete the route reveal rules)
- Create: `tests/content/elevation.test.ts`
- Modify: `tests/content/dates.test.ts`, `tests/content/positioning.test.ts`, `tests/components/homepage.test.tsx`, `tests/components/sections.test.tsx`, `tests/design/motion-tokens.test.ts`, `tests/design/performance.test.ts`, `tests/design/type-scale.test.ts`

**Interfaces:**
- Consumes: `buildTimeline()` and `TimelineEntry` (`lib/timeline.ts`), `endOfRange`, `parseDateToken` (`lib/dates.ts`), `caseStudies`, `placeGroups` (Task 2), `elevationProfile` and `.elevation-marker` (Task 4), `SectionHeading`.
- Produces:
  - `startOfRange(dates: string, now?: Date): number` in `lib/dates.ts`.
  - `lib/elevation.ts`: `interface StripEntry extends TimelineEntry { start: number; end: number }` (fractions 0-1 of the strip), `interface ElevationStripData { years: { year: number; at: number }[]; entries: StripEntry[] }`, `buildElevationStrip(now?: Date): ElevationStripData`, `interface ElevationFigure { value: number; label: string }`, `elevationFigures(): ElevationFigure[]`.
  - `sectionContent.timeline: { eyebrow; title; here; figures: { products; shipped; caseStudies; places } }`.
  - `<ElevationStrip />` server component (`<section id="timeline">`); CSS `.text-section` (the section-title display style), which `SectionHeading` uses from now on.

- [ ] **Step 1: Write the failing tests**

Create `tests/content/elevation.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { caseStudies } from '@/lib/case-studies'
import { projects } from '@/lib/data'
import { buildElevationStrip, elevationFigures } from '@/lib/elevation'
import { placeGroups } from '@/lib/places'

// Spec §5: the elevation strip is the 2020-to-now timeline, with the proof
// figures as spot heights, every number counted from the data.
const NOW = new Date(Date.UTC(2026, 10, 20))
const strip = buildElevationStrip(NOW)

describe('elevation strip', () => {
  it('runs from January of the earliest start year to now, a tick per year', () => {
    expect(strip.years[0]).toEqual({ year: 2020, at: 0 })
    expect(strip.years.map((y) => y.year)).toEqual([2020, 2021, 2022, 2023, 2024, 2025, 2026])
    for (const y of strip.years) expect(y.at).toBeLessThan(1)
  })

  it('places every role and degree inside the strip, starting before it ends', () => {
    expect(strip.entries).toHaveLength(3)
    for (const e of strip.entries) {
      expect(e.start, e.title).toBeGreaterThanOrEqual(0)
      expect(e.end, e.title).toBeLessThanOrEqual(1)
      expect(e.start, e.title).toBeLessThan(e.end)
    }
  })

  it('runs the current role to now, and starts the degree in 2020', () => {
    expect(strip.entries.find((e) => e.subtitle === 'Online Creative Solutions')?.end).toBe(1)
    const degree = strip.entries.find((e) => e.type === 'education')!
    expect(degree.start).toBeGreaterThan(0)
    expect(degree.start).toBeLessThan(strip.years[1].at)
  })
})

describe('elevation figures', () => {
  it('counts each figure from the data', () => {
    const [own, shipped, studies, places] = elevationFigures()
    expect(own.value).toBe(projects.filter((p) => p.band === 'Products').length)
    expect(shipped.value).toBe(projects.filter((p) => p.status !== 'staging').length)
    expect(studies.value).toBe(caseStudies.length)
    expect(places.value).toBe(placeGroups(projects).length)
  })

  it('states today’s figures', () => {
    expect(elevationFigures().map((f) => f.value)).toEqual([4, 19, 6, 6])
  })
})
```

Append to `tests/content/dates.test.ts` (and change its import to `import { endOfRange, parseDateToken, startOfRange } from '@/lib/dates'`):

```ts
describe('startOfRange', () => {
  it('takes the start of an en-dashed range', () => {
    expect(startOfRange('March 2025 – August 2025')).toBe(Date.UTC(2025, 2, 1))
  })

  it('takes the start of an open-ended range', () => {
    expect(startOfRange('November 2024 – Present', NOW)).toBe(Date.UTC(2024, 10, 1))
  })

  it('handles a single date with no range', () => {
    expect(startOfRange('June 2026')).toBe(Date.UTC(2026, 5, 1))
  })
})
```

In `tests/components/homepage.test.tsx`, add the imports:

```tsx
import { ElevationStrip } from '@/components/sections/elevation-strip'
import { buildElevationStrip, elevationFigures } from '@/lib/elevation'
```

change `import { heroContent } from '@/lib/data'` to `import { heroContent, navigationItems, sectionContent } from '@/lib/data'`, add `['ElevationStrip', <ElevationStrip key="elevation" />],` to `SECTIONS`, and add after the `Trailhead` describe:

```tsx
describe('ElevationStrip', () => {
  const html = renderToStaticMarkup(<ElevationStrip />)
  const strip = html.match(/<div aria-hidden="true" class="relative mt-12[\s\S]*?<\/div><ol/)?.[0] ?? ''

  it('is the #timeline section the legend’s Experience link lands on, its heading from data', () => {
    expect(html).toMatch(/^<section id="timeline" aria-labelledby="timeline-title"/)
    expect(navigationItems.find((n) => n.label === 'Experience')?.href).toBe('#timeline')
    expect(html).toContain(`>${sectionContent.timeline.eyebrow}</p>`)
    expect(html).toMatch(new RegExp(`<h2 id="timeline-title" class="text-section[^"]*">${escape(sectionContent.timeline.title)}</h2>`))
  })

  it('marks each proof figure as a spot height, counted from the data', () => {
    for (const f of elevationFigures()) {
      expect(html).toContain(`>${f.value}</span>`)
      expect(html).toContain(`>${f.label}</span>`)
    }
  })

  it('lists every role and degree with its dates, newest first', () => {
    let last = -1
    for (const e of buildElevationStrip().entries) {
      const at = html.indexOf(`>${escape(e.title)}</p>`)
      expect(at, e.title).toBeGreaterThan(last)
      last = at
      expect(html).toContain(`>${escape(e.subtitle)}</p>`)
      expect(html).toContain(`>${e.date}</p>`)
    }
  })

  it('draws the strip from the first year to now, the marker resting at now', () => {
    expect(strip).toContain('>2020</span>')
    expect(strip).toContain('class="elevation-marker')
    expect(strip).toContain(`>${sectionContent.timeline.here}</span>`)
  })
})
```

In `tests/content/positioning.test.ts`, change `expect(navigationItems.map((n) => n.href)).toEqual(['/projects', '#changelog', '#contact'])` to `expect(navigationItems.map((n) => n.href)).toEqual(['/projects', '#timeline', '#contact'])`.

In `tests/design/type-scale.test.ts`, in `trail map type utilities` change `['text-display', 'map-label']` to `['text-display', 'text-section', 'map-label']` and `['text-display', 'map-label', 'eyebrow']` to `['text-display', 'text-section', 'map-label', 'eyebrow']`.

In `tests/design/performance.test.ts`, change the never-defer list to `['trailhead', 'elevation-strip', 'products', 'rack', 'contact-console']`.

In `tests/design/motion-tokens.test.ts`, in `switches every reveal variant off under prefers-reduced-motion: reduce`, replace the two comment lines above `expect(variants.size).toBeGreaterThanOrEqual(8)` and that line with:

```ts
    // S2 retires the Lobby Rack reveals; the rack's stagger, the case-study
    // fold and the cover rise (the trail journals) remain.
    expect(variants.size).toBeGreaterThanOrEqual(3)
```

In `tests/components/sections.test.tsx`, delete the `describe('Route line', …)` block, the `import { RouteLine } …` line, and `education,` and `experience,` from the data import.

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/content/elevation.test.ts tests/content/dates.test.ts tests/content/positioning.test.ts tests/components/homepage.test.tsx tests/design/type-scale.test.ts`
Expected: FAIL: `elevation` and `homepage` with `Failed to resolve import "@/lib/elevation"` (or `"@/components/sections/elevation-strip"`); `dates` with `startOfRange is not a function`; `positioning` with the `#changelog` / `#timeline` diff; `type-scale` with `text-section: expected undefined to be defined`.

- [ ] **Step 3: Add the helpers and the copy**

Append to `lib/dates.ts`:

```ts
/** A human date range's START (its first non-empty part), for placing it on a strip. */
export function startOfRange(dates: string, now: Date = new Date()): number {
  const parts = dates.split(/\s*[–—‑-]\s*/).filter((part) => part !== '')
  return parseDateToken(parts[0] ?? '', now)
}
```

Create `lib/elevation.ts`:

```ts
import { caseStudies } from '@/lib/case-studies'
import { projects, sectionContent } from '@/lib/data'
import { endOfRange, startOfRange } from '@/lib/dates'
import { placeGroups } from '@/lib/places'
import { buildTimeline, type TimelineEntry } from '@/lib/timeline'

/** A role or degree on the strip: `start` and `end` are fractions of its width. */
export interface StripEntry extends TimelineEntry {
  start: number
  end: number
}

export interface ElevationStripData {
  /** One tick per January, from the earliest start year to now. */
  years: { year: number; at: number }[]
  /** Newest first, as buildTimeline() orders them. */
  entries: StripEntry[]
}

/**
 * The elevation strip (spec §5): the dated route from January of the earliest
 * start to now. `now` is the build time on the static homepage.
 */
export function buildElevationStrip(now: Date = new Date()): ElevationStripData {
  const timeline = buildTimeline()
  const starts = timeline.map((e) => startOfRange(e.date, now))
  const firstYear = new Date(Math.min(...starts)).getUTCFullYear()
  const origin = Date.UTC(firstYear, 0, 1)
  const span = now.getTime() - origin
  const at = (t: number) => Math.min(1, Math.max(0, (t - origin) / span))

  const entries = timeline.map((e, i) => ({ ...e, start: at(starts[i]), end: at(endOfRange(e.date, now)) }))
  const years: { year: number; at: number }[] = []
  for (let year = firstYear; year <= now.getUTCFullYear(); year++) years.push({ year, at: at(Date.UTC(year, 0, 1)) })
  return { years, entries }
}

export interface ElevationFigure {
  value: number
  label: string
}

/** The strip's spot heights: each a count taken from the data, never typed. */
export function elevationFigures(): ElevationFigure[] {
  const { figures } = sectionContent.timeline
  return [
    { value: projects.filter((p) => p.band === 'Products').length, label: figures.products },
    { value: projects.filter((p) => p.status !== 'staging').length, label: figures.shipped },
    { value: caseStudies.length, label: figures.caseStudies },
    { value: placeGroups(projects).length, label: figures.places },
  ]
}
```

In `lib/data.ts`:
- in `navigationItems`, change `{ label: 'Experience', href: '#changelog' },` to `{ label: 'Experience', href: '#timeline' },`;
- in `sectionContent`, replace `changelog: { eyebrow: 'Changelog', title: "Where I've worked" },` with:

```ts
  timeline: {
    eyebrow: 'Elevation · the route so far',
    title: "Where I've worked",
    // The marker at now on the strip.
    here: 'You are here',
    // Labels for the spot heights; the numbers come from lib/elevation.ts.
    figures: {
      products: 'products of my own',
      shipped: 'projects shipped',
      caseStudies: 'case studies',
      places: 'places on the field map',
    },
  },
```

- [ ] **Step 4: Add the section-title style**

In `app/globals.css`, in `@layer components`, after the `.text-display` rule, add:

```css
	/* Section titles: the display voice at section scale. */
	.text-section {
		font-family: var(--font-sans);
		font-stretch: 75%;
		font-variation-settings: normal;
		font-weight: 800;
		text-transform: uppercase;
		line-height: 0.95;
		letter-spacing: -0.005em;
		font-size: clamp(2.25rem, 1.5rem + 3vw, 4.25rem);
		text-wrap: balance;
	}
```

In `components/ui/section-heading.tsx`, change `<h2 id={id} className="text-fluid-h2 text-ink">` to `<h2 id={id} className="text-section text-ink">`, and the comment `// The heading stack every homepage section shares: eyebrow, 12px, h2, 40px.` to `// The heading stack every homepage section shares: eyebrow, 12px, the h2 in the section-title style, 40px.`

- [ ] **Step 5: Write the strip**

Create `components/sections/elevation-strip.tsx`:

```tsx
import { SectionHeading } from '@/components/ui/section-heading'
import { elevationProfile } from '@/lib/contours'
import { sectionContent } from '@/lib/data'
import { buildElevationStrip, elevationFigures, type StripEntry } from '@/lib/elevation'
import { cn } from '@/lib/utils'

const pct = (n: number) => `${(n * 100).toFixed(2)}%`

/** A survey spot height: the glyph a map uses for a measured point. */
function SpotHeight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 10 10" className="h-2.5 w-2.5 shrink-0 fill-current text-ink">
      <path d="M5 1 9 9H1Z" />
    </svg>
  )
}

function Lane({ entries, className }: { entries: StripEntry[]; className: string }) {
  return (
    <>
      {entries.map((e) => (
        <span
          key={`${e.title}-${e.sortKey}`}
          className={cn('absolute h-1.5 rounded-full', className)}
          style={{ left: pct(e.start), width: pct(Math.max(e.end - e.start, 0.01)) }}
        />
      ))}
    </>
  )
}

/**
 * The elevation strip (spec §5): the proof figures as spot heights, then the
 * route from 2020 to now as a ridge with each role (ink) and degree
 * (line-strong) as a span along it, and the "you are here" marker at now. The
 * drawn strip is decorative; the dated list under it carries the facts. The
 * marker is the one thing on the page that follows the page's scroll
 * (.elevation-marker in globals.css); at rest, and without support, it sits
 * at now.
 */
export function ElevationStrip() {
  const strip = buildElevationStrip()
  const figures = elevationFigures()
  const { timeline } = sectionContent

  return (
    <section id="timeline" aria-labelledby="timeline-title" className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 md:pb-24">
      <SectionHeading id="timeline-title" eyebrow={timeline.eyebrow} title={timeline.title} />
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
      <div aria-hidden="true" className="relative mt-12 h-28 overflow-x-clip">
        <svg
          viewBox={elevationProfile.viewBox}
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-0 h-14 w-full text-contour"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path d={elevationProfile.d} vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="absolute inset-x-0 top-16 h-1.5">
          <Lane entries={strip.entries.filter((e) => e.type === 'work')} className="bg-ink" />
        </div>
        <div className="absolute inset-x-0 top-[4.75rem] h-1.5">
          <Lane entries={strip.entries.filter((e) => e.type === 'education')} className="bg-line-strong" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-6 border-t border-line">
          {strip.years.map((y) => (
            <span key={y.year} className="absolute top-0 h-full border-l border-line-strong pl-1" style={{ left: pct(y.at) }}>
              <span className="map-label tabular text-muted">{y.year}</span>
            </span>
          ))}
        </div>
        <div className="elevation-marker pointer-events-none absolute inset-0">
          <span className="absolute right-0 top-0 h-full w-0.5 bg-trail" />
          <span className="map-label absolute right-2 top-0 text-trail">{timeline.here}</span>
        </div>
      </div>
      <ol className="mt-8 grid gap-6 md:grid-cols-3">
        {strip.entries.map((e) => (
          <li key={`${e.title}-${e.sortKey}`} className="border-t border-line pt-3">
            <p className="map-label tabular text-muted">{e.date}</p>
            <p className="text-title mt-2 text-ink">{e.title}</p>
            <p className="mt-1 text-muted-strong">{e.subtitle}</p>
            {e.note && <p className="mt-2 max-w-[32ch] text-sm text-muted">{e.note}</p>}
          </li>
        ))}
      </ol>
    </section>
  )
}
```

- [ ] **Step 6: Put it on the page and delete the route line**

Replace the whole of `app/page.tsx` with:

```tsx
import type { Metadata } from 'next'
import { CaseStudies } from '@/components/sections/case-studies'
import { ContactConsole } from '@/components/sections/contact-console'
import { ElevationStrip } from '@/components/sections/elevation-strip'
import { FieldLog } from '@/components/sections/field-log'
import { Products } from '@/components/sections/products'
import { Rack } from '@/components/sections/rack'
import { Stack } from '@/components/sections/stack'
import { Trailhead } from '@/components/sections/trailhead'

// The layout's metadata has no canonical (it would leak to the 404 page), so
// the homepage sets its own.
export const metadata: Metadata = { alternates: { canonical: '/' } }

// Section order: the Isarog Trail Map contract (.impeccable/surfaces/app-page-tsx.md,
// spec §5). S2 replaces the Portfolio 4.0 sections one task at a time; until
// its replacement lands, an old section keeps its place.
export default function HomePage() {
  return (
    <>
      <Trailhead />
      <ElevationStrip />
      <Products />
      <Rack />
      <CaseStudies />
      <FieldLog />
      <Stack />
      <ContactConsole />
    </>
  )
}
```

Run: `git rm components/sections/route-line.tsx`

In `app/globals.css`, inside the `@supports (animation-timeline: view())` block that holds the scroll choreography:
- delete `@keyframes reveal-pop { … }`;
- delete the comment `/* The route line draws across its own section; stops pop as it passes. */` and the `.route`, `.reveal-route` and `.reveal-stop` rules;
- in its `@media (max-width: 767px)` block, delete the `.reveal-route { … }` rule (keep `.reveal-perf`).

In `@media (prefers-reduced-motion: reduce)`, change `:is(.reveal-postcard, .reveal-stagger, .reveal-cover, .reveal-reply, .reveal-perf, .reveal-route, .reveal-stop, .reveal-fold)` to `:is(.reveal-postcard, .reveal-stagger, .reveal-cover, .reveal-reply, .reveal-perf, .reveal-fold)`.

Then run `grep -n "reveal-route\|reveal-stop\|reveal-pop\|\.route " app/globals.css`. Expected: no output.

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 8: Gates and commit**

Run the four gates. Then:

```bash
git add components lib app tests
git commit -m "feat(home): elevation strip replaces the route line" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: The fork; field log and stack leave the homepage

**Model:** Sonnet. Read `craft-floor.md` before Step 4.

**Files:**
- Create: `components/sections/fork.tsx`
- Delete: `components/sections/field-log.tsx`, `components/sections/stack.tsx`
- Modify: `lib/data.ts` (`sectionContent.fork`; delete `sectionContent.stack`; the comment above `sectionContent`)
- Modify: `app/page.tsx`
- Modify: `app/globals.css` (delete the postcard rules)
- Modify: `tests/components/homepage.test.tsx`, `tests/components/sections.test.tsx`, `tests/components/catalog-consistency.test.tsx`, `tests/design/motion-visibility.test.ts`

**Interfaces:**
- Consumes: `paymentGateways`, `resumeUrl`, `SectionHeading`, `.button-secondary`.
- Produces: `sectionContent.fork: { eyebrow; title; business: { title; body; cta }; team: { title; body; cta; resume } }`; `<Fork />` server component (`<section id="fork">`).

The photos, testimonials and the stack leave the homepage here; S4 puts them on `/about` and `/hire`. `galleryImages`, `galleryContent`, `recommendations`, `skills` and `lib/field-log.ts` stay, with their content tests.

- [ ] **Step 1: Write the failing test**

In `tests/components/homepage.test.tsx`, add `import { Fork } from '@/components/sections/fork'`, change the data import to `import { heroContent, navigationItems, paymentGateways, resumeUrl, sectionContent } from '@/lib/data'`, add `['Fork', <Fork key="fork" />],` to `SECTIONS`, and add after the `ElevationStrip` describe:

```tsx
describe('Fork', () => {
  const html = renderToStaticMarkup(<Fork />)
  const { fork } = sectionContent
  const cards = html.match(/<li[\s\S]*?<\/li>/g) ?? []

  it('is the #fork section with its heading from data', () => {
    expect(html).toMatch(/^<section id="fork" aria-labelledby="fork-title"/)
    expect(html).toContain(`>${fork.eyebrow}</p>`)
    expect(html).toMatch(new RegExp(`<h2 id="fork-title"[^>]*>${escape(fork.title)}</h2>`))
  })

  it('offers two paths, business first', () => {
    expect(cards).toHaveLength(2)
    expect(cards[0]).toContain(`>${fork.business.title}</h3>`)
    expect(cards[1]).toContain(`>${fork.team.title}</h3>`)
  })

  it('names every payment gateway on the business path, from the data', () => {
    for (const gateway of paymentGateways) expect(fork.business.body).toContain(gateway)
    expect(cards[0]).toContain(escape(fork.business.body))
  })

  it('sends the business path to the contact form until S4 builds /services', () => {
    expect(cards[0]).toMatch(new RegExp(`<a href="#contact" class="press button-secondary">${fork.business.cta}`))
  })

  it('sends the team path to the contact form and the résumé until S4 builds /hire', () => {
    expect(cards[1]).toMatch(new RegExp(`<a href="#contact" class="press button-secondary">${fork.team.cta}`))
    expect(cards[1]).toContain(`href="${resumeUrl}"`)
    expect(cards[1]).toContain('(PDF, opens in a new tab)')
  })
})
```

In `tests/components/sections.test.tsx`, delete the `describe('Field log', …)` and `describe('Stack', …)` blocks, the `FieldLog` and `Stack` import lines, the `buildFieldLog` import line, and `galleryContent,`, `galleryImages,`, `recommendations,` and `skills,` from the data import.

In `tests/components/catalog-consistency.test.tsx`, delete the `describe('stack', …)` block and the `import { Stack } …` line.

In `tests/design/motion-visibility.test.ts`, delete the test `travel far enough to be seen: postcards 40px (the xl distance)`.

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/components/homepage.test.tsx`
Expected: FAIL with `Failed to resolve import "@/components/sections/fork"`.

- [ ] **Step 3: Add the copy**

In `lib/data.ts`, replace the comment `// Headings for each homepage section. The Field log uses \`galleryContent\`.` with:

```ts
// The gateways as a sentence names them: "PayPal, PayMongo, Maya and Xendit".
const gatewaySentence = `${paymentGateways.slice(0, -1).join(', ')} and ${paymentGateways[paymentGateways.length - 1]}`

// Headings and copy for each homepage section. `galleryContent` waits for /about (S4).
```

In `sectionContent`, delete `stack: { eyebrow: 'Stack', title: 'What I ship with' },` and add:

```ts
  // The two paths up from the trailhead (spec §5). Until S4 builds /services
  // and /hire, both lead to the contact form.
  fork: {
    eyebrow: 'The fork',
    title: 'Two ways up',
    business: {
      title: 'For your business',
      body: `Booking and payment sites for hotels, tours and restaurants, WooCommerce stores with ${gatewaySentence}, and AI automation for the work your team repeats.`,
      cta: 'Start a project',
    },
    team: {
      title: 'For your team',
      body: 'A full-stack developer for a full-time remote role: Next.js, TypeScript, Supabase and WordPress, with tests, CI and AI coding tools in daily use.',
      cta: 'Hire me for a role',
      resume: 'Download résumé',
    },
  },
```

- [ ] **Step 4: Write the fork**

Create `components/sections/fork.tsx`:

```tsx
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'
import { resumeUrl, sectionContent } from '@/lib/data'

const CARD = 'flex flex-col rounded border border-line bg-panel p-6 sm:p-8'

/**
 * The fork (spec §5): two paths up from the trailhead, one for a business and
 * one for a hiring team. Until S4 builds /services and /hire, both lead to the
 * contact form (and the team path to the résumé); S4 repoints them to those
 * pages. Outline buttons: the trail-red primary stays the trailhead's.
 */
export function Fork() {
  const { fork } = sectionContent

  return (
    <section id="fork" aria-labelledby="fork-title" className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 md:pb-24">
      <SectionHeading id="fork-title" eyebrow={fork.eyebrow} title={fork.title} />
      <ul className="grid gap-6 md:grid-cols-2">
        <li className={CARD}>
          <h3 className="text-title text-ink">{fork.business.title}</h3>
          <p className="mt-4 max-w-[46ch] leading-relaxed text-muted-strong">{fork.business.body}</p>
          <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-8">
            {/* S4: /services. */}
            <a href="#contact" className="press button-secondary">
              {fork.business.cta}
              <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
            </a>
          </div>
        </li>
        <li className={CARD}>
          <h3 className="text-title text-ink">{fork.team.title}</h3>
          <p className="mt-4 max-w-[46ch] leading-relaxed text-muted-strong">{fork.team.body}</p>
          <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-8">
            {/* S4: /hire. */}
            <a href="#contact" className="press button-secondary">
              {fork.team.cta}
              <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
            </a>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="button-label inline-flex min-h-[48px] items-center text-ink">
              <span className="link-draw">{fork.team.resume}</span>
              <span className="sr-only">(PDF, opens in a new tab)</span>
            </a>
          </div>
        </li>
      </ul>
    </section>
  )
}
```

- [ ] **Step 5: Put it on the page; retire the field log and the stack**

Replace the whole of `app/page.tsx` with:

```tsx
import type { Metadata } from 'next'
import { CaseStudies } from '@/components/sections/case-studies'
import { ContactConsole } from '@/components/sections/contact-console'
import { ElevationStrip } from '@/components/sections/elevation-strip'
import { Fork } from '@/components/sections/fork'
import { Products } from '@/components/sections/products'
import { Rack } from '@/components/sections/rack'
import { Trailhead } from '@/components/sections/trailhead'

// The layout's metadata has no canonical (it would leak to the 404 page), so
// the homepage sets its own.
export const metadata: Metadata = { alternates: { canonical: '/' } }

// Section order: the Isarog Trail Map contract (.impeccable/surfaces/app-page-tsx.md,
// spec §5). S2 replaces the Portfolio 4.0 sections one task at a time; until
// its replacement lands, an old section keeps its place.
export default function HomePage() {
  return (
    <>
      <Trailhead />
      <ElevationStrip />
      <Fork />
      <Products />
      <Rack />
      <CaseStudies />
      <ContactConsole />
    </>
  )
}
```

Run: `git rm components/sections/field-log.tsx components/sections/stack.tsx`

In `app/globals.css`:
- delete the comment `/* Postcards rest at a slight tilt; attention straightens and lifts them. */` and the `.postcard { … }` rule;
- in the `@media (prefers-reduced-motion: no-preference)` block, delete `.postcard:is(:hover, :focus-within) { … }`;
- in the scroll-choreography `@supports (animation-timeline: view())` block, delete `@keyframes reveal-slide { … }`, the `.reveal-postcard { animation: … }` rule and `.reveal-postcard { --slide-from: 40px; }`;
- in `@media (prefers-reduced-motion: reduce)`, change the reveal list to `:is(.reveal-stagger, .reveal-cover, .reveal-reply, .reveal-perf, .reveal-fold)` and `.flap-tilt, .postcard, .arrow-nudge { transition: none; }` to `.flap-tilt, .arrow-nudge { transition: none; }`.

Then run `grep -n "\.postcard\|reveal-slide" app/globals.css`. Expected: no output.

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Gates and commit**

Run the four gates. Then:

```bash
git add components lib app tests
git commit -m "feat(home): the fork; field log and stack leave the homepage for /about and /hire" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Own products as survey plates

**Model:** Sonnet. Read `craft-floor.md` before Step 4.

**Files:**
- Create: `components/sections/own-products.tsx`
- Delete: `components/sections/products.tsx`
- Modify: `lib/data.ts` (`sectionContent.ownProducts` replaces `sectionContent.work`)
- Modify: `app/page.tsx`
- Modify: `app/globals.css` (delete the spread and flap rules)
- Modify: `tests/components/homepage.test.tsx`, `tests/components/sections.test.tsx`, `tests/components/catalog-consistency.test.tsx`, `tests/design/view-transitions.test.tsx`, `tests/design/motion-visibility.test.ts`, `tests/design/performance.test.ts`

**Interfaces:**
- Consumes: `catalogOrder`, `projectCode` (`lib/board.ts`); `fullShotFor`, `hasFullShot`, `canLinkLive`, `previewFor`, `projectHref` (`lib/project-page.ts`); `ProjectShot` (`src`, `label`, `href`, `duplicateLink`, `slug`, `sizes`, `className`); `NoPreviewTag` (`project`, `className`); `StatusBadge` (`status`, `className`); `LivePreview` (a `PreviewSource` spread); `.survey-plate` (Task 6).
- Produces: `sectionContent.ownProducts: { eyebrow; title }`; `<OwnProducts />` server component (`<section id="products">`, one `<article>` per Products-band project).

- [ ] **Step 1: Write the failing test**

In `tests/components/homepage.test.tsx`, add the imports:

```tsx
import { OwnProducts } from '@/components/sections/own-products'
import { noPreviewCopy } from '@/components/ui/no-preview-tag'
import { catalogOrder, projectCode } from '@/lib/board'
import { canLinkLive, fullShotFor, hasFullShot, isEmbeddable } from '@/lib/project-page'
```

add `projects` to the data import, add `['OwnProducts', <OwnProducts key="own-products" />],` to `SECTIONS` after `Fork`, and add after the `Fork` describe:

```tsx
describe('OwnProducts', () => {
  const html = renderToStaticMarkup(<OwnProducts />)
  const plates = html.match(/<article[\s\S]*?<\/article>/g) ?? []
  const order = catalogOrder(projects, hasFullShot)
  const own = order.filter((p) => p.band === 'Products')

  it('is the #products section with its heading from data', () => {
    expect(html).toMatch(/^<section id="products" aria-labelledby="products-title"/)
    expect(html).toContain(`>${sectionContent.ownProducts.eyebrow}</p>`)
    expect(html).toMatch(new RegExp(`<h2 id="products-title"[^>]*>${escape(sectionContent.ownProducts.title)}</h2>`))
  })

  it('sets one survey plate per own product, in catalog order', () => {
    expect(plates).toHaveLength(own.length)
    own.forEach((p, i) => {
      expect(plates[i], p.slug).toContain(`>${p.title}</h3>`)
      expect(plates[i], p.slug).toContain('class="survey-plate"')
    })
  })

  it('carries each product’s catalog number, the one /projects shows', () => {
    own.forEach((p, i) => expect(plates[i], p.slug).toContain(`>${projectCode(p, order)}</p>`))
  })

  it('names, summarises and badges each product before its detail', () => {
    own.forEach((p, i) => {
      const at = (needle: string) => plates[i].indexOf(needle)
      expect(at(`>${escape(p.summary)}</p>`)).toBeGreaterThan(at(`>${p.title}</h3>`))
      expect(at('data-status=')).toBeGreaterThan(at(`>${escape(p.summary)}</p>`))
      expect(at(escape(p.description.slice(0, 40)))).toBeGreaterThan(at('data-status='))
    })
  })

  it('links each product to its page, and to the live site a visitor can open', () => {
    own.forEach((p, i) => {
      expect(plates[i]).toContain(`href="/projects/${p.slug}"`)
      if (canLinkLive(p) && p.links.live) expect(plates[i]).toContain(`href="${p.links.live}"`)
    })
  })

  it('shows the real site as a still with one link to its page, or says why there is no picture', () => {
    own.forEach((p, i) => {
      if (fullShotFor(p)) {
        expect(plates[i]).toContain('project-shot__frame')
        expect(plates[i]).toMatch(/<a [^>]*tabindex="-1"[^>]*aria-hidden="true"[^>]*class="project-shot lift-card /)
      } else {
        expect(plates[i]).toContain(escape(noPreviewCopy(p)))
      }
    })
  })

  it('offers a live preview on every product a visitor can open: live where it frames, a capture elsewhere', () => {
    own.forEach((p, i) => {
      expect(plates[i].includes('aria-haspopup="dialog"'), p.slug).toBe(canLinkLive(p))
      if (canLinkLive(p)) expect(plates[i], p.slug).toContain(`data-preview="${isEmbeddable(p) ? 'live' : 'capture'}"`)
    })
  })
})
```

In `tests/components/sections.test.tsx`: delete the `describe('Products', …)` block; replace `import { Products } from '@/components/sections/products'` with `import { OwnProducts } from '@/components/sections/own-products'`; change the project-page import to `import { fullShotFor } from '@/lib/project-page'`; delete the line `const products = projects.filter((p) => p.band === 'Products')`; in `describe('every project is reachable from the homepage', …)` replace `renderToStaticMarkup(<Products />)` with `renderToStaticMarkup(<OwnProducts />)` and the test name `links each project page from Products or the rack` with `links each project page from the own products or the rack`.

In `tests/components/catalog-consistency.test.tsx`: replace `import { Products } from '@/components/sections/products'` with `import { OwnProducts } from '@/components/sections/own-products'`, and in `edge codes` replace `codes(renderToStaticMarkup(<Products />), /<article/)` with `codes(renderToStaticMarkup(<OwnProducts />), /<article/)`.

In `tests/design/view-transitions.test.tsx`: replace `import { Products } from '@/components/sections/products'` with `import { OwnProducts } from '@/components/sections/own-products'` and `renderToStaticMarkup(<><Products /><Rack /></>)` with `renderToStaticMarkup(<><OwnProducts /><Rack /></>)`.

In `tests/design/motion-visibility.test.ts`: delete the comment block above `describe('product spreads', …)` and that `describe` block.

In `tests/design/performance.test.ts`: change the never-defer list to `['trailhead', 'elevation-strip', 'own-products', 'rack', 'contact-console']`.

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/components/homepage.test.tsx`
Expected: FAIL with `Failed to resolve import "@/components/sections/own-products"`.

- [ ] **Step 3: Add the copy**

In `lib/data.ts` `sectionContent`, replace `work: { eyebrow: 'Products', title: 'Products of my own' },` with:

```ts
  ownProducts: { eyebrow: 'Own products', title: 'Products of my own' },
```

- [ ] **Step 4: Write the section**

Create `components/sections/own-products.tsx`:

```tsx
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { LivePreview } from '@/components/ui/live-preview'
import { NoPreviewTag } from '@/components/ui/no-preview-tag'
import { ProjectShot } from '@/components/ui/project-shot'
import { SectionHeading } from '@/components/ui/section-heading'
import { StatusBadge } from '@/components/ui/status-badge'
import { catalogOrder, projectCode } from '@/lib/board'
import { projects, sectionContent } from '@/lib/data'
import { canLinkLive, fullShotFor, hasFullShot, previewFor, projectHref } from '@/lib/project-page'
import { extractDomain } from '@/lib/utils'
import type { Project } from '@/types'

/**
 * One own product as a survey plate: a still of the real site (or the printed
 * reason there is none) in the plate frame, then its catalog number (the one
 * /projects shows), name, summary, status, the detail and the ways in. The
 * screenshot links to the page "Read more" names, so it stays out of the tab
 * order.
 */
function Plate({ project, code }: { project: Project; code: string }) {
  const shot = fullShotFor(project)
  const live = canLinkLive(project) ? project.links.live : undefined
  const domain = live ? extractDomain(live) : undefined
  const preview = previewFor(project)
  const titleId = `product-${project.slug}`

  return (
    <article aria-labelledby={titleId} className="flex flex-col">
      <div className="survey-plate">
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
      </div>
      <p aria-hidden="true" className="map-label tabular mt-4 text-muted">{code}</p>
      <h3 id={titleId} className="text-title mt-2 text-ink">{project.title}</h3>
      <p className="mt-2 text-muted-strong">{project.summary}</p>
      <StatusBadge status={project.status} className="mt-3" />
      <p className="mt-4 max-w-[60ch] leading-relaxed text-muted-strong">{project.description}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        {preview && <LivePreview {...preview} />}
        <Link href={projectHref(project)} className="button-label inline-flex min-h-[44px] items-center gap-2 text-ink">
          <span className="link-draw">Read more</span>
          <span className="sr-only">{` about ${project.title}`}</span>
          <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
        </Link>
        {live && domain && (
          <a href={live} target="_blank" rel="noopener noreferrer" className="map-label inline-flex min-h-[44px] items-center gap-1.5 text-muted-strong">
            <span className="link-draw">{domain}</span>
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
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
    <section id="products" aria-labelledby="products-title" className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 md:pb-24">
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

- [ ] **Step 5: Put it on the page; delete the product spreads**

Replace the whole of `app/page.tsx` with:

```tsx
import type { Metadata } from 'next'
import { CaseStudies } from '@/components/sections/case-studies'
import { ContactConsole } from '@/components/sections/contact-console'
import { ElevationStrip } from '@/components/sections/elevation-strip'
import { Fork } from '@/components/sections/fork'
import { OwnProducts } from '@/components/sections/own-products'
import { Rack } from '@/components/sections/rack'
import { Trailhead } from '@/components/sections/trailhead'

// The layout's metadata has no canonical (it would leak to the 404 page), so
// the homepage sets its own.
export const metadata: Metadata = { alternates: { canonical: '/' } }

// Section order: the Isarog Trail Map contract (.impeccable/surfaces/app-page-tsx.md,
// spec §5). S2 replaces the Portfolio 4.0 sections one task at a time; the rack
// holds the field map's place until Task 10.
export default function HomePage() {
  return (
    <>
      <Trailhead />
      <ElevationStrip />
      <Fork />
      <Rack />
      <OwnProducts />
      <CaseStudies />
      <ContactConsole />
    </>
  )
}
```

Run: `git rm components/sections/products.tsx`

In `app/globals.css`:
- delete the comment `/* Product spread: the flap tilts on hover, inviting the open. */` with the `.spread { … }` and `.flap-tilt { … }` rules;
- delete `@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) { .spread:hover .flap-tilt { … } }` (the block holding only that rule; the `.lift-card` hover block stays);
- in `@media (prefers-reduced-motion: reduce)`, change `.flap-tilt, .arrow-nudge { transition: none; }` to `.arrow-nudge { transition: none; }`.

Then run `grep -n "\.spread\|flap-tilt" app/globals.css`. Expected: no output.

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Gates and commit**

Run the four gates. Then:

```bash
git add components lib app tests
git commit -m "feat(home): own products as survey plates" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Field map replaces the rack

**Model:** Opus. Read `craft-floor.md` before Step 3.

**Files:**
- Create: `components/sections/field-map.tsx`, `components/map/philippines-outline.tsx`
- Delete: `components/sections/rack.tsx` (homepage only: `RackTier` and `RackCard` stay for `/projects`)
- Modify: `lib/data.ts` (`sectionContent.fieldMap` replaces `sectionContent.systems`)
- Modify: `app/page.tsx`
- Modify: `tests/components/homepage.test.tsx`, `tests/components/sections.test.tsx`, `tests/components/catalog-consistency.test.tsx`, `tests/design/view-transitions.test.tsx`, `tests/design/performance.test.ts`

**Interfaces:**
- Consumes: `phOutline` (Task 3), `MAP_VIEWBOX`, `MAP_WIDTH`, `MAP_HEIGHT`, `project` (Task 3), `placeGroups`, `unplacedProjects`, `PlaceGroup` (Task 2), `projectHref`, `SectionHeading`, `.survey-plate`.
- Produces: `<PhilippinesOutline className?={string} />` (an SVG `<path>`, drawn inside a caller's `<svg>`); `sectionContent.fieldMap: { eyebrow; title; caption; placesHeading; regionNote; unplacedHeading; unplacedNote; cta }`; `<FieldMap />` server component (`<section id="work">`).

The pins are real `<a href>` links in the SVG, kept out of the tab order and the accessibility tree; the place list beside the map is the accessible way to the same pages (Questions for the controller, 6).

- [ ] **Step 1: Write the failing test**

In `tests/components/homepage.test.tsx`, add the imports:

```tsx
import { FieldMap } from '@/components/sections/field-map'
import { MAP_VIEWBOX, project as toMap } from '@/lib/geo'
import { phOutline } from '@/lib/ph-outline'
import { placeGroups, unplacedProjects } from '@/lib/places'
```

add `['FieldMap', <FieldMap key="field-map" />],` to `SECTIONS` after `Fork`, and add after the `Fork` describe:

```tsx
describe('FieldMap', () => {
  const html = renderToStaticMarkup(<FieldMap />)
  const svg = html.slice(html.indexOf('<svg'), html.indexOf('</svg>'))
  const list = html.slice(html.indexOf('</svg>'))
  const groups = placeGroups(projects)
  const { fieldMap } = sectionContent

  it('is the #work section with its heading from data', () => {
    expect(html).toMatch(/^<section id="work" aria-labelledby="work-title"/)
    expect(html).toContain(`>${fieldMap.eyebrow}</p>`)
    expect(html).toMatch(new RegExp(`<h2 id="work-title"[^>]*>${escape(fieldMap.title)}</h2>`))
  })

  it('draws the Philippines outline in the projection the pins use', () => {
    expect(svg).toContain(`viewBox="${MAP_VIEWBOX}"`)
    expect(svg).toContain(`d="${phOutline.slice(0, 60)}`)
  })

  it('pins every place as a real link to its first project: a ring for a region, a dot for a city', () => {
    for (const g of groups) {
      const pin = svg.match(new RegExp(`<a href="/projects/${g.projects[0].slug}" tabindex="-1" aria-hidden="true" class="map-pin">([\\s\\S]*?)</a>`))?.[1]
      expect(pin, g.name).toBeDefined()
      const { x, y } = toMap(g.lat, g.lng)
      expect(pin, g.name).toContain(`cx="${x}" cy="${y}"`)
      expect(pin, g.name).toContain(`class="${g.precision === 'region' ? 'map-ring' : 'map-dot'} `)
      expect(pin, g.name).toContain(`>${g.name}</text>`)
    }
    expect(svg.match(/<a /g)).toHaveLength(groups.length)
  })

  it('lists each place with its projects as map-label links, the way in for keyboard and screen readers', () => {
    for (const g of groups) {
      expect(list).toContain(`>${g.name}</span>`)
      for (const p of g.projects) {
        expect(list, p.slug).toContain(`href="/projects/${p.slug}"`)
        expect(list, p.slug).toContain(`<span class="link-draw">${escape(p.title)}</span>`)
      }
    }
    expect(list.match(/class="map-label inline-flex/g)!.length).toBeGreaterThanOrEqual(projects.length)
  })

  it('never pins a project without a verified place: it is listed under No fixed point', () => {
    const unplaced = unplacedProjects(projects)
    expect(unplaced.length).toBeGreaterThan(0)
    expect(list).toContain(`>${fieldMap.unplacedHeading}</h3>`)
    for (const p of unplaced) {
      expect(svg, p.slug).not.toContain(`/projects/${p.slug}"`)
      expect(list, p.slug).toContain(`href="/projects/${p.slug}"`)
    }
  })

  it('links every project from the homepage, and leads on to /projects', () => {
    for (const p of projects) expect(html, p.slug).toContain(`href="/projects/${p.slug}"`)
    expect(html).toContain('href="/projects"')
  })
})
```

Replace the whole of `tests/components/sections.test.tsx` with:

```tsx
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { CaseStudies } from '@/components/sections/case-studies'
import { FLAGSHIP_SLUGS, briefLead, getCaseStudy } from '@/lib/case-studies'
import { sectionContent } from '@/lib/data'

// The last Portfolio 4.0 homepage section, retired in S2 Task 11
// (docs/superpowers/plans/2026-11-20-portfolio-v5-s2.md). The new sections are
// tested in tests/components/homepage.test.tsx.

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')

describe('Case studies', () => {
  const html = renderToStaticMarkup(<CaseStudies />)

  it('takes its heading from lib/data.ts', () => {
    expect(html).toContain(`>${sectionContent.caseStudies.eyebrow}<`)
    expect(html).toMatch(new RegExp(`<h2 id="case-studies-title"[^>]*>${sectionContent.caseStudies.title}<`))
  })

  it('shows a cover for every flagship, in reading order, with role and brief', () => {
    let last = -1
    for (const slug of FLAGSHIP_SLUGS) {
      const study = getCaseStudy(slug)!
      const at = html.indexOf(`href="/projects/${slug}"`)
      expect(at, slug).toBeGreaterThan(last)
      last = at
      expect(html).toContain(escape(study.role))
      expect(html).toContain(escape(briefLead(study)))
    }
  })
})
```

In `tests/components/catalog-consistency.test.tsx`, delete the `import { Rack } …` line, and replace the start of `describe('edge codes', …)`, from `describe('edge codes', () => {` through the end of the test `gives a project the same code on / and /projects`, with:

```tsx
describe('edge codes', () => {
  // On the homepage only the own products carry a catalog number (the field
  // map lists places, not numbers); each matches /projects.
  const home = codes(renderToStaticMarkup(<OwnProducts />), /<article/)
  const index = codes(renderProjects(), /<li class="rack-slot/)

  it('numbers every project once on /projects, and each own product once on /', () => {
    expect(home.size).toBe(projects.filter((p) => p.band === 'Products').length)
    expect(index.size).toBe(projects.length)
    expect(new Set(index.values()).size).toBe(projects.length)
  })

  it('gives an own product the same code on / and /projects', () => {
    for (const [slug, code] of Array.from(home)) expect(code, slug).toBe(index.get(slug))
  })
```

In `tests/design/view-transitions.test.tsx`, delete the `import { Rack } …` line and replace `renderToStaticMarkup(<><OwnProducts /><Rack /></>)` with `renderToStaticMarkup(<OwnProducts />)`.

In `tests/design/performance.test.ts`, change the never-defer list to `['trailhead', 'elevation-strip', 'field-map', 'own-products', 'contact-console']`.

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/components/homepage.test.tsx`
Expected: FAIL with `Failed to resolve import "@/components/sections/field-map"`.

- [ ] **Step 3: Add the copy**

In `lib/data.ts` `sectionContent`, replace the `systems: { … }` entry with:

```ts
  fieldMap: {
    eyebrow: 'Field map',
    title: 'Where the work runs',
    caption: 'A pin sits only where a project’s own page names the place.',
    placesHeading: 'Places',
    regionNote: 'Pinned at the region’s centre',
    unplacedHeading: 'No fixed point',
    unplacedNote: 'These projects name no single place, so they are listed here rather than pinned.',
    cta: 'Browse every project',
  },
```

- [ ] **Step 4: Write the outline and the map**

Create `components/map/philippines-outline.tsx`:

```tsx
import { phOutline } from '@/lib/ph-outline'
import { cn } from '@/lib/utils'

// The Philippines from Natural Earth 1:50m (lib/ph-outline.ts, generated by
// scripts/build-ph-outline.mjs), in the projection of lib/geo.ts. Drawn inside
// the caller's <svg>: land in panel paper, the coast in contour olive.
export function PhilippinesOutline({ className }: { className?: string }) {
  return (
    <path
      d={phOutline}
      className={cn('fill-panel stroke-contour', className)}
      strokeWidth={1}
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
  )
}
```

Create `components/sections/field-map.tsx`:

```tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PhilippinesOutline } from '@/components/map/philippines-outline'
import { SectionHeading } from '@/components/ui/section-heading'
import { projects, sectionContent } from '@/lib/data'
import { MAP_HEIGHT, MAP_VIEWBOX, MAP_WIDTH, project as toMap } from '@/lib/geo'
import { placeGroups, unplacedProjects, type PlaceGroup } from '@/lib/places'
import { projectHref } from '@/lib/project-page'
import type { PlacePrecision, Project } from '@/types'

// Where a place's label sits beside its pin, in map units (layout, not
// content). Naga City's and Bicol's centres are about 19 units apart, so their
// labels go opposite ways; a region's ring is wider than a city's dot.
const LABELS: Record<string, { dx: number; dy: number; anchor: 'start' | 'end' }> = {
  'Naga City': { dx: -14, dy: -10, anchor: 'end' },
  Bicol: { dx: 26, dy: 20, anchor: 'start' },
  Palawan: { dx: 26, dy: 8, anchor: 'start' },
}
const DEFAULT_LABEL = { dx: 14, dy: 7, anchor: 'start' as const }

/**
 * One pin: a ring for a region, a dot for a city, and the place's name. A real
 * link to the place's first project, for crawlers and pointers; it is out of
 * the tab order and the accessibility tree because the place list beside the
 * map links the same pages (one link per project for keyboard and screen
 * readers, as ProjectShot's duplicate link does).
 */
function Pin({ group }: { group: PlaceGroup }) {
  const { x, y } = toMap(group.lat, group.lng)
  const label = LABELS[group.name] ?? DEFAULT_LABEL
  return (
    <a href={projectHref(group.projects[0])} tabIndex={-1} aria-hidden="true" className="map-pin">
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

/** The pin's glyph again, as the key beside a place in the list. */
function PlaceGlyph({ precision }: { precision: PlacePrecision }) {
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

function ProjectLink({ project }: { project: Project }) {
  return (
    <Link href={projectHref(project)} className="map-label inline-flex min-h-[44px] items-center text-ink sm:min-h-[32px]">
      <span className="link-draw">{project.title}</span>
    </Link>
  )
}

/**
 * The field map (spec §5): the Philippines with a pin wherever a project's own
 * words name the place, the places listed beside it with their projects, and
 * every other project under "No fixed point", never at a guessed point. All in
 * the server HTML; nothing here runs on the client.
 */
export function FieldMap() {
  const places = placeGroups(projects)
  const unplaced = unplacedProjects(projects)
  const { fieldMap } = sectionContent

  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 md:pb-24">
      <SectionHeading id="work-title" eyebrow={fieldMap.eyebrow} title={fieldMap.title} />
      <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-12">
        <figure className="survey-plate mx-auto w-full max-w-md lg:max-w-none">
          <svg viewBox={MAP_VIEWBOX} aria-hidden="true" focusable="false" className="block h-auto w-full">
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} className="fill-canvas" />
            <PhilippinesOutline />
            {places.map((group) => (
              <Pin key={group.name} group={group} />
            ))}
          </svg>
          <figcaption className="mt-3 px-1 text-sm text-muted-strong">{fieldMap.caption}</figcaption>
        </figure>

        <div>
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
                      <ProjectLink project={p} />
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
                <ProjectLink project={p} />
              </li>
            ))}
          </ul>

          <Link href="/projects" className="button-label mt-8 inline-flex min-h-[44px] items-center gap-2 text-ink">
            <span className="link-draw">{fieldMap.cta}</span>
            <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Put it on the page; delete the homepage rack**

Replace the whole of `app/page.tsx` with:

```tsx
import type { Metadata } from 'next'
import { CaseStudies } from '@/components/sections/case-studies'
import { ContactConsole } from '@/components/sections/contact-console'
import { ElevationStrip } from '@/components/sections/elevation-strip'
import { FieldMap } from '@/components/sections/field-map'
import { Fork } from '@/components/sections/fork'
import { OwnProducts } from '@/components/sections/own-products'
import { Trailhead } from '@/components/sections/trailhead'

// The layout's metadata has no canonical (it would leak to the 404 page), so
// the homepage sets its own.
export const metadata: Metadata = { alternates: { canonical: '/' } }

// Section order: the Isarog Trail Map contract (.impeccable/surfaces/app-page-tsx.md,
// spec §5). S2 replaces the Portfolio 4.0 sections one task at a time; until
// its replacement lands, an old section keeps its place.
export default function HomePage() {
  return (
    <>
      <Trailhead />
      <ElevationStrip />
      <Fork />
      <FieldMap />
      <OwnProducts />
      <CaseStudies />
      <ContactConsole />
    </>
  )
}
```

Run: `git rm components/sections/rack.tsx`. (`groupForHomepage` in `lib/board.ts` now has no caller but `tests/content/board.test.ts`; S3 retires it with the rack tests.)

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Gates and commit**

Run the four gates. Then:

```bash
git add components lib app tests
git commit -m "feat(home): field map replaces the rack" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Trail journals replace the case-study covers

**Model:** Sonnet. Read `craft-floor.md` before Step 4.

**Files:**
- Create: `components/sections/trail-journals.tsx`
- Delete: `components/sections/case-studies.tsx`, `tests/components/sections.test.tsx`
- Modify: `lib/data.ts` (`sectionContent.journals` replaces `sectionContent.caseStudies`)
- Modify: `app/page.tsx`
- Modify: `tests/components/homepage.test.tsx`, `tests/design/catalog-motion.test.ts`

**Interfaces:**
- Consumes: `FLAGSHIP_SLUGS`, `getCaseStudy`, `briefLead` (`lib/case-studies.ts`), `edgeCode` (`lib/board.ts`), `caseStudyContent.eyebrow.caseStudy`, `sectorNames`, `Project.place` (Task 2), `.lift-card`, `.reveal-cover`.
- Produces: `sectionContent.journals: { eyebrow; title }`; `<TrailJournals />` server component (`<section id="journals">`).

- [ ] **Step 1: Write the failing test**

In `tests/components/homepage.test.tsx`, add the imports:

```tsx
import { TrailJournals } from '@/components/sections/trail-journals'
import { FLAGSHIP_SLUGS, briefLead, getCaseStudy } from '@/lib/case-studies'
```

add `['TrailJournals', <TrailJournals key="journals" />],` to `SECTIONS` after `OwnProducts`, and add after the `OwnProducts` describe:

```tsx
describe('TrailJournals', () => {
  const html = renderToStaticMarkup(<TrailJournals />)

  it('is the #journals section with its heading from data', () => {
    expect(html).toMatch(/^<section id="journals" aria-labelledby="journals-title"/)
    expect(html).toContain(`>${sectionContent.journals.eyebrow}</p>`)
    expect(html).toMatch(new RegExp(`<h2 id="journals-title"[^>]*>${escape(sectionContent.journals.title)}</h2>`))
  })

  it('opens a journal for every flagship, in reading order, with its role, brief and place', () => {
    let last = -1
    for (const slug of FLAGSHIP_SLUGS) {
      const study = getCaseStudy(slug)!
      const project = projects.find((p) => p.slug === slug)!
      const at = html.indexOf(`href="/projects/${slug}"`)
      expect(at, slug).toBeGreaterThan(last)
      last = at
      expect(html).toContain(escape(study.role))
      expect(html).toContain(escape(briefLead(study)))
      if (project.place) expect(html, slug).toContain(`>${project.place.name} · `)
    }
  })

  it('lifts like every catalog card and rises by transform only', () => {
    expect(html.match(/class="lift-card /g)).toHaveLength(FLAGSHIP_SLUGS.length)
    expect(html.match(/class="reveal-cover"/g)).toHaveLength(FLAGSHIP_SLUGS.length)
  })
})
```

In `tests/design/catalog-motion.test.ts`, in `is the same hover on rack cards, product screenshots and case-study covers`, change `readFileSync('components/sections/case-studies.tsx', 'utf8')` to `readFileSync('components/sections/trail-journals.tsx', 'utf8')`.

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/components/homepage.test.tsx tests/design/catalog-motion.test.ts`
Expected: FAIL: `Failed to resolve import "@/components/sections/trail-journals"` and `ENOENT: no such file or directory, open 'components/sections/trail-journals.tsx'`.

- [ ] **Step 3: Add the copy**

In `lib/data.ts` `sectionContent`, replace the `caseStudies: { … }` entry with:

```ts
  journals: { eyebrow: 'Trail journals', title: 'From the brief to launch' },
```

- [ ] **Step 4: Write the section**

Create `components/sections/trail-journals.tsx`:

```tsx
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'
import { edgeCode } from '@/lib/board'
import { FLAGSHIP_SLUGS, briefLead, getCaseStudy } from '@/lib/case-studies'
import { caseStudyContent, projects, sectionContent, sectorNames } from '@/lib/data'
import { projectHref } from '@/lib/project-page'
import type { CaseStudy, Project } from '@/types'

interface Journal {
  project: Project
  study: CaseStudy
}

/**
 * The trail journals (spec §5): a cover for each of the six case studies, in
 * reading order: the journal's number, the project, where it runs (when its
 * own words name the place), the brief's first sentence and Christian's role.
 * Each opens its flagship page. Covers rise into place as the row scrolls in,
 * transform only (.reveal-cover), and lift on hover like every catalog card.
 */
export function TrailJournals() {
  const journals = FLAGSHIP_SLUGS.flatMap((slug): Journal[] => {
    const project = projects.find((p) => p.slug === slug)
    const study = getCaseStudy(slug)
    return project && study ? [{ project, study }] : []
  })

  return (
    <section id="journals" aria-labelledby="journals-title" className="defer-render mx-auto max-w-6xl px-5 pb-16 sm:px-8 md:pb-24">
      <SectionHeading id="journals-title" eyebrow={sectionContent.journals.eyebrow} title={sectionContent.journals.title} />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {journals.map(({ project, study }, i) => (
          <li key={project.slug} className="reveal-cover" style={{ '--i': i % 3 } as CSSProperties}>
            <Link
              href={projectHref(project)}
              className="lift-card group relative flex h-full min-h-[20rem] flex-col rounded border border-line bg-panel p-6"
            >
              <span aria-hidden="true" className="map-label tabular text-muted">
                {edgeCode(i + 1, journals.length, caseStudyContent.eyebrow.caseStudy)}
              </span>
              <span className="text-title mt-8 text-ink">{project.title}</span>
              <span className="map-label mt-2 text-muted">
                {project.place ? `${project.place.name} · ${sectorNames[project.sector]}` : sectorNames[project.sector]}
              </span>
              <span className="mt-5 leading-relaxed text-muted-strong">{briefLead(study)}</span>
              <span className="mt-auto pt-6 text-sm text-ink">{study.role}</span>
              <span className="button-label mt-4 inline-flex items-center gap-2 text-ink">
                <span className="link-draw">Read the case study</span>
                <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 5: Put it on the page; delete the old covers and their test file**

Replace the whole of `app/page.tsx` with:

```tsx
import type { Metadata } from 'next'
import { ContactConsole } from '@/components/sections/contact-console'
import { ElevationStrip } from '@/components/sections/elevation-strip'
import { FieldMap } from '@/components/sections/field-map'
import { Fork } from '@/components/sections/fork'
import { OwnProducts } from '@/components/sections/own-products'
import { TrailJournals } from '@/components/sections/trail-journals'
import { Trailhead } from '@/components/sections/trailhead'

// The layout's metadata has no canonical (it would leak to the 404 page), so
// the homepage sets its own.
export const metadata: Metadata = { alternates: { canonical: '/' } }

// Section order: the Isarog Trail Map contract (.impeccable/surfaces/app-page-tsx.md,
// spec §5). The contact console holds the form's place until Task 12.
export default function HomePage() {
  return (
    <>
      <Trailhead />
      <ElevationStrip />
      <Fork />
      <FieldMap />
      <OwnProducts />
      <TrailJournals />
      <ContactConsole />
    </>
  )
}
```

Run: `git rm components/sections/case-studies.tsx tests/components/sections.test.tsx`

`.reveal-cover` and its keyframes stay in `app/globals.css`: the journals use them. `.crease-v` stays too: `components/case-study/read-spread.tsx` uses it.

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Gates and commit**

Run the four gates. Then:

```bash
git add components lib app tests
git commit -m "feat(home): trail journals replace the case-study covers" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Plan the route replaces the contact console

**Model:** Sonnet. Read `craft-floor.md` before Step 4.

**Files:**
- Move and rewrite: `components/sections/contact-console.tsx` → `components/sections/plan-the-route.tsx` (`git mv`)
- Create: `lib/chat-events.ts`
- Modify: `components/ui/chat-widget.tsx` (listen for the open event)
- Modify: `lib/data.ts` (`sectionContent.contact`)
- Modify: `app/page.tsx`
- Modify: `app/globals.css` (delete the perforation and reply-card reveal rules)
- Modify: `tests/components/homepage.test.tsx`, `tests/components/client-surfaces.test.tsx`, `tests/design/contrast.test.ts`, `tests/design/primary-button.test.ts`, `tests/design/performance.test.ts`, `tests/design/motion-visibility.test.ts`

**Interfaces:**
- Consumes: `useToast`, `contactInfo`, `availability`, `resumeUrl`, `sectionContent.contact`, `.survey-plate`, `.text-section`, `/api/contact` (unchanged: `{ name, email, message }` → `{ delivered }` or `{ delivered: false, fallback: 'mailto' }`).
- Produces: `CHAT_OPEN_EVENT = 'chunks:open'` (`lib/chat-events.ts`); `<PlanTheRoute />` client component (`<section id="contact">`, field ids `contact-name`, `contact-email`, `contact-message`, error id `contact-error`); `sectionContent.contact: { eyebrow; title; lede; chunks }`; `ChatWidget` opens on `window` event `CHAT_OPEN_EVENT`.

- [ ] **Step 1: Write the failing tests**

In `tests/components/homepage.test.tsx`, change `import { readFileSync } from 'node:fs'` to `import { existsSync, readFileSync } from 'node:fs'`, add the imports:

```tsx
import { PlanTheRoute } from '@/components/sections/plan-the-route'
import { ToastProvider } from '@/components/ui/toaster'
```

add `['PlanTheRoute', <ToastProvider key="plan"><PlanTheRoute /></ToastProvider>],` to the end of `SECTIONS`, and add after the `TrailJournals` describe:

```tsx
describe('PlanTheRoute', () => {
  const html = renderToStaticMarkup(
    <ToastProvider>
      <PlanTheRoute />
    </ToastProvider>,
  )
  const source = readFileSync('components/sections/plan-the-route.tsx', 'utf8')

  it('is the #contact section, still the one form client component', () => {
    expect(html).toContain('<section id="contact" aria-labelledby="contact-title"')
    expect(source.trimStart()).toMatch(/^'use client'/)
    expect(existsSync('components/sections/contact-console.tsx')).toBe(false)
  })

  it('takes its heading and copy from data', () => {
    expect(html).toContain(`>${sectionContent.contact.eyebrow}</p>`)
    expect(html).toMatch(new RegExp(`<h2 id="contact-title" class="text-section[^"]*">${escape(sectionContent.contact.title)}</h2>`))
    expect(html).toContain(`>${escape(sectionContent.contact.lede)}</p>`)
  })

  it('keeps the field ids and names the API and the labels expect', () => {
    for (const [id, name] of [
      ['contact-name', 'name'],
      ['contact-email', 'email'],
      ['contact-message', 'message'],
    ]) {
      expect(html).toContain(`for="${id}"`)
      expect(html).toContain(`id="${id}" name="${name}"`)
    }
  })

  it('sends with the one primary button', () => {
    expect(html).toMatch(/<button type="submit" class="press button-primary[^"]*">Send message/)
  })

  it('keeps the toast and the mailto fallback', () => {
    expect(source).toContain('useToast()')
    expect(source).toContain('window.location.href = `mailto:${contactInfo.email}')
  })

  it('puts Chunks a click away', () => {
    expect(html).toContain(`>${sectionContent.contact.chunks}</button>`)
    expect(source).toContain('window.dispatchEvent(new Event(CHAT_OPEN_EVENT))')
    expect(readFileSync('components/ui/chat-widget.tsx', 'utf8')).toContain('window.addEventListener(CHAT_OPEN_EVENT, open)')
  })
})
```

In `tests/components/client-surfaces.test.tsx`: replace `import { ContactConsole } from '@/components/sections/contact-console'` with `import { PlanTheRoute } from '@/components/sections/plan-the-route'`; in `describe('ContactConsole', …)` rename it `describe('PlanTheRoute', …)`, replace `<ContactConsole />` with `<PlanTheRoute />`, and replace `readFileSync('components/sections/contact-console.tsx', 'utf8')` with `readFileSync('components/sections/plan-the-route.tsx', 'utf8')`.

In `tests/design/contrast.test.ts`, in `field borders`, replace `readFileSync('components/sections/contact-console.tsx', 'utf8')` with `readFileSync('components/sections/plan-the-route.tsx', 'utf8')`.

In `tests/design/primary-button.test.ts`, replace `uses('components/sections/contact-console.tsx', 'Send message')` with `uses('components/sections/plan-the-route.tsx', 'Send message')`.

In `tests/design/performance.test.ts`, change the never-defer list to `['trailhead', 'elevation-strip', 'field-map', 'own-products', 'plan-the-route']`.

In `tests/design/motion-visibility.test.ts`, in `play while the element is in view …`, change `['reveal-cover', 'reveal-reply', 'reveal-fold']` to `['reveal-cover', 'reveal-fold']`.

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/components/homepage.test.tsx tests/components/client-surfaces.test.tsx tests/design/contrast.test.ts`
Expected: FAIL with `Failed to resolve import "@/components/sections/plan-the-route"` and `ENOENT … plan-the-route.tsx`.

- [ ] **Step 3: Add the event and the copy**

Create `lib/chat-events.ts`:

```ts
// The page opens Chunks (components/ui/chat-widget.tsx) by dispatching this
// event on window, so there is one chat and it owns its own state.
export const CHAT_OPEN_EVENT = 'chunks:open'
```

In `components/ui/chat-widget.tsx`, add `import { CHAT_OPEN_EVENT } from '@/lib/chat-events'` after its last `@/lib/` import, and directly after the `// Phone widths: below sm the open chat is modal.` effect add:

```tsx
  // The page opens the chat with one event (the contact section's "Ask
  // Chunks"), so there is one chat and it owns its own state.
  useEffect(() => {
    const open = () => setIsOpen(true)
    window.addEventListener(CHAT_OPEN_EVENT, open)
    return () => window.removeEventListener(CHAT_OPEN_EVENT, open)
  }, [])
```

In `lib/data.ts` `sectionContent`, replace `contact: { eyebrow: 'Contact', title: 'Start a project' },` with:

```ts
  contact: {
    eyebrow: 'Plan the route',
    title: 'Start a project',
    lede: 'Tell me what you are building and when you need it. Hiring for a full-time role? Say so here too.',
    // The button that opens Chunks, the site's assistant.
    chunks: 'Ask Chunks, my site assistant',
  },
```

- [ ] **Step 4: Move and restyle the form**

Run: `git mv components/sections/contact-console.tsx components/sections/plan-the-route.tsx`

Replace the whole of `components/sections/plan-the-route.tsx` with:

```tsx
'use client'

import { useState } from 'react'
import { AlertOctagon, ArrowRight, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/toaster'
import { CHAT_OPEN_EVENT } from '@/lib/chat-events'
import { availability, contactInfo, resumeUrl, sectionContent } from '@/lib/data'

const FIELD =
  'w-full rounded border border-field-border bg-canvas px-3 py-2.5 text-ink placeholder:text-muted focus-visible:border-accent aria-[invalid=true]:border-ink'

const LABEL = 'map-label mb-1.5 block text-muted-strong'

// On paper: ink text; the drawn underline marks hover.
const CONTACT_LINK = 'inline-flex min-h-[44px] items-center text-ink sm:min-h-[32px]'

type Field = 'name' | 'email' | 'message'

interface FormError {
  message: string
  /** The field the server named, when it named one. */
  field?: Field
}

const ERROR_ID = 'contact-error'

/** The API names the offending field in its message ("Please fill in your email."). */
function fieldFromMessage(message: string): Field | undefined {
  const match = message.match(/\b(name|email|message)\b/i)
  return match ? (match[1].toLowerCase() as Field) : undefined
}

/**
 * Plan the route (spec §5): the contact form, last on the homepage. The left
 * leg says how to reach Christian and puts Chunks, the site's assistant, a
 * click away; the right leg is the form on a survey plate. Behaviour is the
 * old contact console's: it posts to /api/contact, announces through a toast,
 * ties a server error to the field it names, and hands off to the visitor's
 * mail app when no mail provider is configured.
 */
export function PlanTheRoute() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<FormError | null>(null)
  const { showToast } = useToast()
  const facebook = contactInfo.socialLinks.find((link) => link.icon === 'facebook')

  // The toast announces an error; this inline copy stays beside the form and is
  // tied to the field it concerns, so it survives the toast being dismissed.
  const fail = (message: string, field?: Field) => {
    setError({ message, field })
    showToast({ type: 'error', message })
  }

  const fieldProps = (field: Field) => ({
    'aria-invalid': error?.field === field ? true : undefined,
    'aria-describedby': error?.field === field ? ERROR_ID : undefined,
  })

  /**
   * Hand the message off to the visitor's own mail client. Used when the server
   * has no mail provider configured, so the form still reaches a real inbox
   * instead of quietly dropping the message.
   */
  const openMailClient = () => {
    const subject = encodeURIComponent(`Portfolio message from ${formData.name}`)
    const body = encodeURIComponent(`${formData.message}\n\n- ${formData.name} (${formData.email})`)
    window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`
  }

  const openChat = () => window.dispatchEvent(new Event(CHAT_OPEN_EVENT))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await response.json()

      if (!response.ok) {
        const message = result.error || `Something went wrong. Email me at ${contactInfo.email}.`
        fail(message, response.status === 400 ? fieldFromMessage(message) : undefined)
        return
      }

      if (result.delivered) {
        setFormData({ name: '', email: '', message: '' })
        showToast({ type: 'success', message: "Message sent. I'll get back to you soon." })
        return
      }

      // No mail provider configured server-side: fall back to mailto:.
      showToast({ type: 'info', message: 'Opening your email app to send this message...' })
      openMailClient()
    } catch {
      fail(`Couldn't reach the server. Email me directly at ${contactInfo.email}.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error?.field === e.target.name) setError(null)
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-6xl px-5 pb-[72px] sm:px-8 md:pb-[112px]">
      <div className="grid gap-10 md:grid-cols-[5fr_7fr] md:gap-12">
        <div className="flex flex-col">
          <p className="eyebrow mb-3">{sectionContent.contact.eyebrow}</p>
          <h2 id="contact-title" className="text-section text-ink">
            {sectionContent.contact.title}
          </h2>
          <p className="text-lede mt-5 max-w-[30rem] text-muted-strong">{sectionContent.contact.lede}</p>
          <p className="map-label mt-6 text-muted-strong">{availability}</p>
          <ul className="mt-8 space-y-1">
            <li>
              <a href={`mailto:${contactInfo.email}`} className={CONTACT_LINK}>
                <span className="link-draw">{contactInfo.email}</span>
              </a>
            </li>
            <li>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className={CONTACT_LINK}>
                <span className="link-draw">Download résumé</span>
                <span className="sr-only">(PDF, opens in a new tab)</span>
              </a>
            </li>
            {facebook && (
              <li>
                <a href={facebook.url} target="_blank" rel="noopener noreferrer" className={CONTACT_LINK}>
                  <span className="link-draw">{facebook.name}</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            )}
            <li className="map-label pt-2 text-muted">{contactInfo.location}</li>
          </ul>
          <button type="button" aria-haspopup="dialog" onClick={openChat} className="press button-secondary mt-8 self-start">
            {sectionContent.contact.chunks}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="survey-plate space-y-5 p-6 sm:p-8 lg:p-10">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className={LABEL}>
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                maxLength={100}
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className={FIELD}
                {...fieldProps('name')}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className={LABEL}>
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={FIELD}
                {...fieldProps('email')}
              />
            </div>
          </div>
          <div>
            <label htmlFor="contact-message" className={LABEL}>
              What are you building?
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              maxLength={5000}
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className={FIELD}
              {...fieldProps('message')}
            />
          </div>
          {error && (
            <p id={ERROR_ID} className="flex items-start gap-2 text-sm text-ink">
              <AlertOctagon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              {error.message}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            aria-describedby={error && !error.field ? ERROR_ID : undefined}
            className="press button-primary disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                Sending
              </>
            ) : (
              <>
                Send message
                <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Put it on the page; delete the reply-card CSS**

Replace the whole of `app/page.tsx` with:

```tsx
import type { Metadata } from 'next'
import { ElevationStrip } from '@/components/sections/elevation-strip'
import { FieldMap } from '@/components/sections/field-map'
import { Fork } from '@/components/sections/fork'
import { OwnProducts } from '@/components/sections/own-products'
import { PlanTheRoute } from '@/components/sections/plan-the-route'
import { TrailJournals } from '@/components/sections/trail-journals'
import { Trailhead } from '@/components/sections/trailhead'

// The layout's metadata has no canonical (it would leak to the 404 page), so
// the homepage sets its own.
export const metadata: Metadata = { alternates: { canonical: '/' } }

// Section order: the Isarog Trail Map contract (.impeccable/surfaces/app-page-tsx.md, spec §5).
export default function HomePage() {
  return (
    <>
      <Trailhead />
      <ElevationStrip />
      <Fork />
      <FieldMap />
      <OwnProducts />
      <TrailJournals />
      <PlanTheRoute />
    </>
  )
}
```

In `app/globals.css`:
- delete the comment `/* The reply card's perforation: …` with every `.perforation` rule after it, including its `@media (min-width: 768px) { … }` block;
- in the scroll-choreography `@supports (animation-timeline: view())` block, delete `@keyframes reveal-draw-x { … }`, `@keyframes reveal-draw-y { … }`, `@keyframes reveal-lift { … }`, the `.reveal-reply` and `.reveal-perf` rules, and the `@media (max-width: 767px) { .reveal-perf { … } }` block;
- in `@media (prefers-reduced-motion: reduce)`, change the reveal list to `:is(.reveal-stagger, .reveal-cover, .reveal-fold)`.

Then run `grep -n "perforation\|reveal-perf\|reveal-reply\|reveal-lift\|reveal-draw" app/globals.css`. Expected: no output.

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, including `client-boundary` (still 8 client components: `plan-the-route.tsx` took `contact-console.tsx`'s place) and `nav-anchors` (`#contact` and `#timeline` resolve).

- [ ] **Step 7: Gates and commit**

Run the four gates. Then:

```bash
git add components lib app tests
git commit -m "feat(home): plan the route replaces the contact console; chunks a click away" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Thread the trail, page contract, docs, verification

**Model:** Opus. Load the `modern-web-guidance` skill before Step 6.

**Files:**
- Modify: `app/page.tsx` (trail segments between sections)
- Modify: `tests/components/homepage.test.tsx` (the page contract)
- Modify: `CLAUDE.md` (structure, client list, deferral, motion, testing lines)
- Modify (only if Lighthouse CLS > 0.1): `docs/superpowers/plans/2026-11-20-portfolio-v5-revamp.md` (S6 scope)
- Create (gitignored ledger, not committed): `.superpowers/sdd/s2-lighthouse.md`

**Interfaces:**
- Consumes: every section above, `TrailSegment` (Task 4), `ToastProvider`.
- Produces: the finished S2 homepage on the `v5` preview.

- [ ] **Step 1: Write the failing test**

In `tests/components/homepage.test.tsx`, add `import HomePage from '@/app/page'` and append:

```tsx
describe('HomePage', () => {
  const html = renderToStaticMarkup(
    <ToastProvider>
      <HomePage />
    </ToastProvider>,
  )

  it('runs the seven sections in the spec’s order', () => {
    const ids = Array.from(html.matchAll(/<section id="([^"]+)"/g)).map((m) => m[1])
    expect(ids).toEqual(['top', 'timeline', 'fork', 'work', 'products', 'journals', 'contact'])
  })

  it('threads the trail: drawn out of the plate on load, then a segment between each section below the strip', () => {
    expect(html.match(/class="trail-draw trail-draw--load"/g)).toHaveLength(1)
    expect(html.match(/class="trail-draw trail-draw--view"/g)).toHaveLength(5)
  })

  it('links every project page', () => {
    for (const p of projects) expect(html, p.slug).toContain(`href="/projects/${p.slug}"`)
  })

  it('keeps two primary buttons: the trailhead’s and the form’s', () => {
    expect(html.match(/class="press button-primary/g)).toHaveLength(2)
  })

  it('ships no opacity:0 entrance', () => {
    expect(html).not.toMatch(/opacity:\s*0/)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/components/homepage.test.tsx -t HomePage`
Expected: FAIL in `threads the trail`: the page has no `trail-draw--view` yet, so the match is `null` and the length assertion fails. The other four tests pass.

- [ ] **Step 3: Thread the trail through the page**

Replace the whole of `app/page.tsx` with:

```tsx
import type { Metadata } from 'next'
import { TrailSegment } from '@/components/map/trail-segment'
import { ElevationStrip } from '@/components/sections/elevation-strip'
import { FieldMap } from '@/components/sections/field-map'
import { Fork } from '@/components/sections/fork'
import { OwnProducts } from '@/components/sections/own-products'
import { PlanTheRoute } from '@/components/sections/plan-the-route'
import { TrailJournals } from '@/components/sections/trail-journals'
import { Trailhead } from '@/components/sections/trailhead'

// The layout's metadata has no canonical (it would leak to the 404 page), so
// the homepage sets its own.
export const metadata: Metadata = { alternates: { canonical: '/' } }

// Section order: the Isarog Trail Map contract (.impeccable/surfaces/app-page-tsx.md,
// spec §5). The trail leaves the trailhead's plate on load; below the
// elevation strip (the trailhead's bottom edge) a short segment draws between
// each pair of sections as it scrolls into view.
export default function HomePage() {
  return (
    <>
      <Trailhead />
      <ElevationStrip />
      <TrailSegment variant={0} />
      <Fork />
      <TrailSegment variant={1} />
      <FieldMap />
      <TrailSegment variant={0} />
      <OwnProducts />
      <TrailSegment variant={1} />
      <TrailJournals />
      <TrailSegment variant={0} />
      <PlanTheRoute />
    </>
  )
}
```

Run: `npx vitest run tests/components/homepage.test.tsx`
Expected: PASS.

- [ ] **Step 4: Bring CLAUDE.md up to date**

Make these replacements in `CLAUDE.md`. Each pair is literal text: find the first block, replace it with the second.

1. Testing list.

```text
- `motion-tokens` (TS tokens mirrored as CSS vars; reveals and the hero behind their gates and off under reduce; hero under 2 s), `motion-visibility` (reveal ranges and distances, hero unfold direction, products settled)
```

```text
- `motion-tokens` (TS tokens mirrored as CSS vars; reveals and the trailhead sequence behind their gates and off under reduce; trailhead under 2 s), `motion-visibility` (reveal ranges), `trail-motion` (the trail draws once on load and per segment on a named view timeline; only `.elevation-marker` follows the page scroll), `font-budget` (after a build: one preloaded Archivo file, at most 95 KB)
```

2. Component tests.

```text
counts, filter tabs, the hero AI proof, the stack groups), plus source guards for
```

```text
counts, filter tabs; `homepage`: the seven trail-map sections and the page order), plus source guards for
```

3. Sections and map primitives.

```text
components/sections/ Homepage sections, in page order: hero, products, rack, case-studies, field-log, route-line, stack, contact-console
```

```text
components/sections/ Homepage sections, in page order: trailhead, elevation-strip, fork, field-map, own-products, trail-journals, plan-the-route
components/map/      contour-field, trail-path (mode load or view), trail-segment, philippines-outline: the survey-map SVG primitives
```

4. UI primitives.

```text
components/ui/       Primitives: status-badge, section-heading, proof-band, rack-tier,
```

```text
components/ui/       Primitives: status-badge, section-heading, rack-tier,
```

5. Helpers.

```text
lib/display-status.ts, lib/proof.ts, lib/field-log.ts, lib/dates.ts, lib/timeline.ts — pure helpers, all tested
```

```text
lib/display-status.ts, lib/proof.ts, lib/field-log.ts, lib/dates.ts, lib/timeline.ts, lib/places.ts, lib/elevation.ts — pure helpers, all tested
lib/geo.ts           The field map's projection (project(lat, lng)), shared with scripts/build-ph-outline.mjs
lib/ph-outline.ts    The Philippines outline, generated by scripts/build-ph-outline.mjs (do not edit)
```

6. Deferral.

```text
  Never defer the hero, products, rack section or contact card. `ProjectShot`
```

```text
  Never defer the trailhead, elevation strip, field map, own products or contact form. `ProjectShot`
```

7. Client components.

```text
`components/sections/contact-console.tsx` (form),
```

```text
`components/sections/plan-the-route.tsx` (form; its "Ask Chunks" opens the chat through `CHAT_OPEN_EVENT`),
```

8. Server parents of client components (two lines).

```text
may render a client one as a child — `Hero`, `FieldLog` and `ProjectScreenshots`
render `ImageLightbox`, and `Products` and `ProjectHeader` render `LivePreview`.
```

```text
may render a client one as a child — `Trailhead` and `ProjectScreenshots`
render `ImageLightbox`, and `OwnProducts` and `ProjectHeader` render `LivePreview`.
```

9. Visible proof and the load sequence (five lines).

```text
  Proof (Products, the rack) must be visible in the server HTML;
  `tests/components/sections.test.tsx` forbids `opacity:0` there.
- **Hero sequence:** CSS keyframes on load, no JS, 1.9 s, once (H1 words rise,
  the inner panels unfold from behind the front one, creases draw, proof rises).
  It must stay under two seconds (`motion-tokens` test).
```

```text
  Every homepage section must be visible in the server HTML;
  `tests/components/homepage.test.tsx` forbids `opacity:0` there.
- **Trailhead sequence:** CSS keyframes on load, no JS, 1.9 s, once (the
  headline's authored lines rise in turn, the copy under them rises, the trail
  draws out of the portrait plate). It must stay under two seconds (`motion-tokens` test).
- **Trail:** `TrailPath mode="load"` draws once on load; `mode="view"` (the
  `TrailSegment`s between sections) draws on its own named view timeline.
  Only `.elevation-marker` uses `scroll(root)` (`catalog-motion`, `trail-motion`).
```

Then run `grep -n "contact-console\|route-line\|proof-band\|sections.test" CLAUDE.md`. Expected: no output.

- [ ] **Step 5: Full gate, and the font budget after the build**

Run, in order: `npm run type-check`, `npm run lint`, `npm test`, `npm run build`. Expected: all four pass.
Then run: `npx vitest run tests/design/font-budget.test.ts`
Expected: PASS (2 tests, not skipped: the build just wrote `.next/static/media`).

- [ ] **Step 6: Look at it**

Start `RESEND_API_KEY= GROQ_API_KEY= npx next start -p 3100` in the background and check `/` at 1440×900 and 390×844, in both themes, then once with reduced motion emulated:
- the trailhead matches the contract's FIRST VIEWPORT: eyebrow, three headline lines, no line overflowing its column at 390 (each line on one line), both buttons, the portrait plate on the right from 768px; the elevation strip's heading on the bottom edge at 1440×900;
- on load the lines rise once and the trail draws out of the plate's lower edge. If at 1440×900 the trail does not start at the plate, change only the first point (`M1290 570`) of `trailheadTrail.d` in `lib/contours.ts` to the plate's lower-left corner in the 1440×900 viewBox, rerun `npx vitest run tests/components/chrome.test.tsx`, and recheck;
- scrolling (Chrome): each trail segment draws as it enters; the "you are here" marker travels along the strip; under reduced motion the segments are drawn and the marker sits at now;
- the field map: the outline is visible in both themes, the six labels are legible and do not collide at 390 or 1440 (if two collide, adjust only their `LABELS` offsets in `components/sections/field-map.tsx`), Tab reaches the place list's links but no pin, clicking a pin opens its first project;
- own products and journals sit on one baseline per row; "Ask Chunks" opens the chat; with no keys, "Send message" ends in the mailto toast (cancel the mail app: send nothing);
- no horizontal scroll at 390: `document.documentElement.scrollWidth === window.innerWidth` in the console is `true`.

Commit any number-only adjustments from this step with the next commit.

- [ ] **Step 7: Commit and push for a preview**

```bash
git add app/page.tsx tests/components/homepage.test.tsx CLAUDE.md lib/contours.ts components/sections/field-map.tsx
git commit -m "feat(home): thread the trail through the homepage; docs for the s2 homepage" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push origin v5
```

Read the preview URL for the pushed commit:
`gh api "repos/{owner}/{repo}/deployments?sha=$(git rev-parse HEAD)" --jq '.[0].id'`, then `gh api "repos/{owner}/{repo}/deployments/<id>/statuses" --jq '.[0].environment_url'`.
Expected: an `https://…vercel.app` URL once the deployment finishes (rerun the second command until it prints one).

- [ ] **Step 8: Lighthouse on the preview (mobile)**

`npx lighthouse` fetches the lighthouse package on first use; the controller confirms that download with Christian first.

Run:

```bash
CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe" npx lighthouse <preview-url> --output=json --output=html --output-path=<scratchpad>/s2-lh --chrome-flags="--headless=new" --only-categories=performance,accessibility,best-practices,seo
```

(mobile is Lighthouse's default form factor.) Run it twice and report the second run (the first warms next/image). If the preview answers 401 (Vercel deployment protection), run the same command against `http://localhost:3100` from Step 6 and say so in the report.

Write `.superpowers/sdd/s2-lighthouse.md` with the four scores, LCP, TBT and CLS, and the report paths.

- [ ] **Step 9: Record the font decision**

If CLS > 0.1: in `docs/superpowers/plans/2026-11-20-portfolio-v5-revamp.md`, at the start of the `### S6 Finish (Opus)` paragraph, insert `First task: self-host an instanced Archivo (one weight and width range, latin, subset) and re-measure, because the S2 preview measured mobile CLS <value>.` Then:

```bash
git add docs/superpowers/plans/2026-11-20-portfolio-v5-revamp.md
git commit -m "docs(plan): s6 opens with a self-hosted instanced archivo" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push origin v5
```

If CLS ≤ 0.1, change nothing and record the value in `.superpowers/sdd/s2-lighthouse.md` only.

Report the preview URL, the Lighthouse scores and CLS to the controller. S2 is done when Christian has seen the preview.

---

## Self-review against the spec

- **§3 first viewport:** Task 6 builds the sketch's composition (eyebrow and condensed headline left over contours, subheadline, trail-red "Start a project", outline "Hire me for a role", the portrait on a plate at the right, the trail leaving it); the elevation strip follows as section 2 on the bottom edge (Task 7). Status keeps `StatusBadge`; green stays in it.
- **§3 palette and type:** no new colour tokens; trail red only on the primary buttons, the trail strokes and the current-position marker (Global Constraints). Archivo unchanged; new type utility `.text-section` is the same family, held by `type-scale`.
- **§4 motion:** draw (trailhead on load, segments on view timelines), rise (headline lines one at a time under 2 s, transform only). Pan is S3. The signature "one red trail threading every section" is met by the load trail plus five view segments (brief decision 3 retires the single page-scroll trail); the elevation strip is the 2020-to-now timeline with a "you are here" marker. Every keyframe is checked transform/stroke-only; the scroll and view rules sit inside both gates; nothing loops.
- **§5 homepage order:** the seven sections, in order, held by the `HomePage` test (Task 13). The fork links to `#contact` until S4. Pins only at verified places, as real links in the server HTML, every other project under "No fixed point" (Tasks 2, 10). Own products as larger plates (Task 9); six journals (Task 11); the form with Chunks a click away (Task 12).
- **§5 deviation, by the evidence rule:** only Connecta PH is pinned at Naga City among the own products (Questions, 4).
- **§6 copy:** eyebrow, headline and subheadline from `heroContent`, the product count derived and held (Task 2). No years figure, no metrics, no logos.
- **§8 architecture:** every new section is a server component; the client count stays 8.
- **§9 tests:** hero copy and the product count, every pin's verified place and its evidence, pins as links in server HTML, the rise behind its gate and under 2 s, the trail inside both gates, the client cap, no inline motion numbers; the retired world's tests go with their sections.

## Deferred to later sprints

- **S3:** the `.on-plane :focus-visible` rule and `project-header.tsx`'s plane (Questions, 1); `groupForHomepage` and its board tests (no homepage caller after Task 10); `RackTier`/`RackCard` restyled for `/projects`; a `SurveyPlate` component wrapping `.survey-plate`; a pin opening its project's plate and the map pan (spec §4, §5); `.lift-card`'s hover border still on the `accent` alias.
- **S4:** the fork's links and the trailhead's "Hire me for a role" repointed to `/services` and `/hire`; the field-log photos, testimonials and the stack placed on `/about` and `/hire` (their data and `lib/field-log.ts` are kept for it); Services, About and Hire in `navigationItems`; the phone legend menu.
- **S5:** `heroContent.title`, `lede`, `specialism`, `aiLine`, `aiProof`, `stack` and `proofPoints` still feed metadata, JSON-LD, the chat prompt, the llms files and the OG card; rewrite them there, and decide whether `Project.place` reaches the JSON-LD (`areaServed`, locality only).
- **S6:** the contour pointer shift and screenshot appear-once (spec §4); tuning the elevation marker's range (at `scroll(root)` over the whole page it reaches now only at the page's end, while the strip sits near the top); the self-hosted instanced Archivo if Task 13 measured CLS > 0.1; removing the `--accent*` aliases and the Portfolio 4.0 utilities still in `globals.css` (`.text-fluid-h2`, `.edge-code`, `.button-label`, `.crease-*`, `.reveal`, `.reveal-stagger`, `.reveal-fold`); the stale Anybody/Figtree comments; `DESIGN.md`, the full `CLAUDE.md` rewrite and `PRODUCT.md`; the impeccable finish review the contract's FINISH line requires.
