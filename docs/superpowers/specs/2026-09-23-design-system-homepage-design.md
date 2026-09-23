# Portfolio 4.0 — Phase 2: Design System & Homepage

**Date:** 2026-09-23
**Status:** Design — awaiting review
**Phase:** 2 of 5 (Content & IA ✓ → **Design system & homepage** → Case-study research → Case-study pages → SEO/AIEO)
**Builds on:** `docs/superpowers/specs/2026-09-10-content-ia-strategy-design.md` (Phase 1, shipped)

---

## Goal

Give the portfolio a design system and homepage that make Christian hireable in
2026 as a full-stack developer — for freelance clients first, employers second —
without abandoning the content architecture Phase 1 made true and tested.

Phase 1 fixed *what the site says*. This phase decides *how it looks and behaves*,
and rebuilds the homepage and the `/projects` index on that system.

## Decisions log

Settled during brainstorming, in order. Each is binding on this spec.

| # | Decision | Chosen | Rejected |
|---|---|---|---|
| D1 | Positioning | **Full-stack lead.** H1 "Full-stack developer." WordPress specialism is a proof line; software development is shown through products and custom systems. | WordPress-specialist lead; dual title; three equal titles |
| D2 | Design world | **Operator** — the live systems board. Projects are running systems with real status. | Ledger (editorial index); Field (warm studio) |
| D3 | Operator character | **B3 · Signal** — warm graphite, sodium amber brand, green means *live* only. Dark default. | B1 Terminal (dark/green, the common cliché); B2 Instrument (light/orange) |
| D4 | Homepage composition | **Products first.** Three product panels, then a 12-row board for everything else. | One board for all 15; board as the hero |
| D5 | Availability | **"Open to freelance and full-time roles."** Stored as data. | Freelance only; selective; no indicator |
| D6 | Build path | **`v4` redesign branch** with Vercel preview URLs; merge once. | Hidden preview route on `main`; replace in place |

Two constraints were settled by the design rather than asked:

- **Status never relies on colour alone.** Amber is both the brand colour and the
  early-access colour in B3, so every status carries a distinct glyph *and* a text
  label. This also satisfies WCAG 1.4.1.
- **Human proof lives inside the Operator world.** Phase 1 made freelance clients
  the primary audience; Operator is the direction that reads most strongly to
  engineers. The Field log (on-site photos and testimonials) and a plain-language
  lede carry the human side so a non-technical client does not bounce.

## Non-goals (YAGNI)

- **Case-study research** — its own spec, next; can run in parallel with this build.
- **`/projects/[slug]` case-study pages and live previews** — Phase 4, after both.
  Until then, board rows link to the live sites.
- **SEO/AIEO** — sitemap, JSON-LD, `llms.txt` stay Phase 5. The one exception is
  the `app/layout.tsx` metadata title and description, which currently say
  "Software Engineer" and contradict D1; they are corrected here (§8).
- **No CMS, no new content types, no blog.** Content stays in `lib/data.ts`.
- **No new animation library.** framer-motion stays; nothing is added.

## Current state

- 18 components carry `'use client'`, including sections that only render static data.
- Fonts: Plus Jakarta Sans and Fraunces. Theme: next-themes, `defaultTheme="system"`.
- The earlier impeccable audit scored the current site **Design 20/40** and
  **Audit 7/20** (`.impeccable/critique/2026-09-09T16-42-13Z__app-page-tsx.md`).
- Neither `PRODUCT.md` nor `DESIGN.md` exists.
- Hero CTA row: Résumé download · Email · View work. The earlier audit named it the
  strongest element on the site; it is kept, reordered so contact leads (see R2).
- The final Phase 1 review found that a project with no live URL (`beachbus-nfc`)
  renders as a focusable `<a href="#">`. Fixed here (§5).

## Design

### §1. Positioning in the data

`heroContent` in `lib/data.ts` changes and gains two fields. All of it stays data;
no copy is hardcoded in components.

| Field | Value |
|---|---|
| `title` | `'Full-stack developer'` (was `'Full-stack web developer'`) |
| `lede` | `'I build products, WordPress platforms, and the systems between them — from Naga City, for clients anywhere.'` |
| `specialism` | Derived, not typed: `WordPress specialist · ${n} production sites · WooCommerce`, where `n` is the count of `Sites`-band projects (currently 9). |
| `proofPoints` | Unchanged. Still enforced by `tests/content/proof-band.test.ts`. |
| `stack` | Skill **ids** for the hero chips: `['nextjs', 'typescript', 'supabase', 'wordpress', 'woocommerce']`. The component looks each up in `skills`; the `wordpress` chip renders in `--accent`. |

A new top-level export:

```ts
export const availability = 'Open to freelance and full-time roles'
```

`lib/chat-context.ts` adds both `specialism` and `availability` to the assistant's
OWNER INFORMATION block, so the chat and the page cannot disagree.

`navigationItems` is rewritten to the new anchors: Work → `#work`, Changelog →
`#changelog`, Stack → `#stack`, Contact → `#contact`.

### §2. Colour

All tokens are declared in `app/globals.css` as `oklch(L C H)` literals, one per
line, and exposed through `tailwind.config.js`. The hex values below are the
design intent; the implementation converts them.

**Dark theme — the default.**

| Token | Role | Value |
|---|---|---|
| `--bg` | Page | `#141210` |
| `--panel` | Raised surfaces, board, cards | `#1B1815` |
| `--ink` | Body text, headings | `#F1ECE4` |
| `--muted` | Secondary text | `#968D82` |
| `--muted-strong` | Lede, chip text | `#C7BEB2` |
| `--line` | Hairline rules, panel borders | `#2B2621` |
| `--line-strong` | Chip borders, dividers that must read | `#3A332C` |
| `--accent` | Brand: accent text, focus ring, WordPress chip, interactive state | `#F2A23A` |
| `--live` | Live status only | `#7DD39A` |
| `--status-early` | Early-access ring | `#F2A23A` |
| `--status-private` | Lock glyph | `#857B70` |
| `--status-internal` | Square glyph | `#857B70` |

**Light theme — derived.** Same token names, re-valued for a warm paper ground.
Bright amber and the dark-theme green both fail contrast on paper, so light mode
uses deeper values: `--accent` around `#9A4F0A` for text, and `--live` around
`#1F8A4C`. **The final light values are whatever passes the contrast test (see
Testing); these are starting points, not commitments.**

Green appears nowhere except the live status. Amber appears on interactive and
brand elements only — never as body text colour on large areas.

### §3. Typography

**Amended 2026-09-23 (Christian's decision during Task 1):** the face is
**Recursive**, not IBM Plex. impeccable flags Plex as a training-data default for
persuasion surfaces; Recursive earns its place with a reason no other face
satisfies here — one variable family whose MONO axis slides the same letterforms
from a human sans to a monospace, so the Operator world's two voices (the person,
the systems) come from one face.

- **Recursive, linear sans** — reading text and headlines.
- **Recursive with `MONO 1`** — labels, numbers, domains, stack names, status text,
  metadata. Every numeral is tabular.

Loaded through `next/font/google` with only the MONO axis, replacing Plus Jakarta
Sans and Fraunces.

Sizes are fluid `clamp()` values. The H1 scales from 40px on a 360px viewport to
64px at 1280px and above, weight 600, tracking −0.025em. Body is 16px minimum.
The existing `.text-fluid-h1`/`.text-fluid-h2` utilities are rewritten to this
scale; `.font-display` (Fraunces) is removed.

### §4. Status language

One pure function owns the mapping from data to display:

```ts
// types/index.ts — every shared type lives here, per CLAUDE.md
export type DisplayStatus = 'live' | 'early-access' | 'private' | 'internal'

// lib/display-status.ts
export function displayStatus(status: ProjectStatus): DisplayStatus
```

| `ProjectStatus` (data) | `DisplayStatus` | Glyph | Label |
|---|---|---|---|
| `live` | `live` | Solid dot, `--live` | Live |
| `ua-gated` | `live` | Solid dot, `--live` | Live |
| `early-access` | `early-access` | Hollow ring, `--status-early` | Early access |
| `auth-gated` | `private` | Lock, `--status-private` | Private |
| `internal` | `internal` | Square, `--status-internal` | Internal |

`ua-gated` displays as Live because, to a visitor in a browser, it is. The
distinction only matters to Phase 4's preview mechanism, which reads the raw
`status`, not the display value.

`StatusBadge` is the only component that renders a status. It always renders the
glyph and the label together; the label may be visually hidden in the densest
board layout on mobile, but it is never absent from the accessibility tree.

### §5. Components

New components, each with one job. Server components unless marked *client*.

| Component | Job | Reads |
|---|---|---|
| `TopBar` *(client — theme toggle)* | Sticky bar: `~/christian-raro` mark, nav, availability, theme toggle | `availability`, `navigationItems` |
| `Hero` | H1, lede, specialism, stack chips, proof band, CTA row, framed portrait | `heroContent`, `skills` |
| `ProofBand` | The four proof points as mono counters | `heroContent.proofPoints` |
| `ProductPanel` | One product: screenshot, one-liner, status, domain, stack, visit link | a `Project` |
| `SystemsBoard` | Grouped rows with a group heading per band. **Shared** by the homepage and `/projects`. | `Project[]` |
| `BoardRow` | One row: status, name, band, domain, stack. A link when `links.live` exists; a plain row when it does not. | a `Project` |
| `BoardFilter` | Band filter tabs above `SystemsBoard` on `/projects`. Plain links to `?band=…`, so filtering needs no JavaScript and every filtered view has a shareable URL. | `BAND_ORDER` |
| `StatusBadge` | Glyph + label for one status | `displayStatus()` |
| `FieldLog` *(client — lightbox)* | On-site photos with permanent captions, interleaved with testimonials | `galleryImages`, `galleryContent`, `recommendations` |
| `Changelog` | Work and education, two labelled groups, strict date order, concurrency note | `buildTimeline()` |
| `StackList` | 13 tools grouped by category, mono list | `skills` |
| `ContactConsole` *(client — form)* | Form, email, availability, résumé link | `contactInfo`, `availability` |

**Kept:** `Reveal`, `toaster`, `image-lightbox`, both API routes, `chat-widget`
(restyled as a console; behaviour unchanged).

**Deleted:** `project-card.tsx` (replaced by `ProductPanel` and `BoardRow`),
`link-preview.tsx` (hover previews from a third-party screenshot service — Phase 4
designs the real preview), and every section in `components/sections/` as its
replacement lands. `about-section.tsx` is deleted without a direct replacement; its
content is carried by the hero lede and the Changelog.

**The dead link is fixed.** `BoardRow` renders a link only when `links.live`
exists. `beachbus-nfc` becomes a non-interactive row instead of an `<a href="#">`.

**Less client JavaScript.** Only `TopBar`, `FieldLog`, `ContactConsole`, the chat
console, the lightbox, `Reveal`, the toaster and the theme provider need to be
client components — eight in all. Everything else renders static data and becomes
a server component. Target: fewer than 10 `'use client'` files, down from 18.
**Amended 2026-09-23 (final review):** six at the finish. `FieldLog` stayed a
server component that renders the client `ImageLightbox`, and `Reveal` was
deleted as unused.

### §6. Homepage composition

Top to bottom. Section IDs are the nav anchors.

| # | Section | `id` | Content |
|---|---|---|---|
| — | `TopBar` | — | Mark, nav (Work · Changelog · Stack · Contact), availability, theme toggle |
| 1 | `Hero` | `top` | H1, lede, specialism, stack chips, `ProofBand`, CTA row (**Start a project** → `#contact` · Résumé · View work), portrait with lightbox |
| 2 | Products | `work` | Heading "Products · 3 of my own", three `ProductPanel`s |
| 3 | Systems board | `systems` | `SystemsBoard` of the other 12, grouped *Custom systems* (2) then *Client work* (10) |
| 4 | Field log | `field-log` | `FieldLog` |
| 5 | Changelog | `changelog` | `Changelog` |
| 6 | Stack | `stack` | `StackList` |
| 7 | Contact | `contact` | `ContactConsole` |
| — | Footer | — | Social links, copyright |

*Client work* is the `Applications` and `Sites` bands together, in `BAND_ORDER`, as
Phase 1 §3 specified. The group order follows `BAND_ORDER`, which puts Custom
systems before Client work; Phase 1's §2 table listed them the other way round,
and `BAND_ORDER` — the tested canonical order — wins.

Eight sections, where Phase 1 listed nine: the gallery and testimonials merge into
Field log. Both survive in rebuilt form, as Phase 1 required.

The `featured` flag no longer drives the homepage — products are shown by band.
`featured` stays in the data for Phase 4 to use or remove.

### §7. `/projects`

The full inventory: `BoardFilter` over a `SystemsBoard` of all 15, grouped by band
in `BAND_ORDER`. This replaces the current card grid and its `useState` filter.

The page reads the `band` search parameter and filters on the server. An unknown or
missing `band` shows all 15. Because it reads search parameters, the page renders
dynamically rather than being prerendered; for 15 rows of static data on Vercel
this costs nothing a visitor would notice. The page's heading and description
move into `lib/data.ts` alongside the other copy.

### §8. Chrome, theme and metadata

- **Theme:** `defaultTheme="dark"` in `app/layout.tsx`. The toggle switches
  between dark and light and persists the choice. `enableSystem` is removed, so a
  first-time visitor sees the committed dark identity.
- **Metadata:** `app/layout.tsx`'s title, description, Open Graph and Twitter
  fields currently say "Software Engineer" and "Frontend Developer". They are
  rewritten from `heroContent` so the page, the chat and the link previews agree.
- **Focus:** a 2px amber focus ring with a 2px offset on every interactive element.
- **Skip link:** first focusable element, jumps to `#main` — the `<main>` element
  that opens with the hero. It skips the top bar, never the H1.

### §9. Motion

- The live status dot has a slow pulse ring (2.4s, opacity only).
- Board rows and panels reveal on mount through the existing `Reveal` primitive.
  **Amended 2026-09-23 (final review):** dropped. Products and Systems are primary
  proof and must be visible in the server HTML, so they have no entrance
  animation, and `Reveal` was deleted once nothing rendered it. See `DESIGN.md`
  → Motion.
- Row hover: an amber left rule and an arrow, 150ms.
- **Under `prefers-reduced-motion`, all three are removed**, not merely shortened.
- Not used: count-up numbers, scroll-linked animation, parallax, page transitions.

## Design workflow

Each tool has one job and one point in the process.

| Step | Tool | Output |
|---|---|---|
| 1 | `impeccable init` | `PRODUCT.md` — audience, positioning, and design mode per surface: homepage **Persuade**, `/projects` **Operate**, case studies (later) **Read**. |
| 2 | `impeccable` new-work: direction contract | Recorded before code in `.impeccable/surfaces/app-page-tsx.md` (seed `2f5d7c31`; the user's pinned direction beats the roll). **`DESIGN.md` is written at the finish, from the built site** — impeccable's rule, adopted by Christian's decision during Task 1. |
| 3 | `writing-plans` → `subagent-driven-development` | The build, with impeccable's craft-floor loaded for every UI task. |
| 4 | `impeccable critique` + `impeccable audit` | Gate after the design system lands, and again after the homepage is assembled. |
| 5 | `design-taste-frontend` | Independent second opinion on the assembled homepage. |
| 6 | `ecc:a11y-architect` agent | WCAG 2.2 AA review of the components before merge. |
| 7 | `impeccable polish` | One final pass before merge. |

Verification runs in bounded passes: inspect desktop and mobile together, fix
everything found in one batch, confirm once, stop.

## Branch

Work happens on a `v4` branch cut from `main`. Every push produces a Vercel preview
URL. `CLAUDE.md` currently says "there are no other branches"; it is amended for
the life of the branch, and restored on merge.

**Content changes keep landing on `main`** — the Phase 1 content-owed items
(below) are content fixes, not redesign work. `main` is merged into `v4` whenever
it changes, so the branch never drifts from the live data. The only `lib/data.ts`
changes made on `v4` are the §1 additions, `navigationItems`, and the §7
`/projects` copy.

## File impact

| File | Change |
|---|---|
| `PRODUCT.md`, `DESIGN.md` | New (impeccable) |
| `app/globals.css` | Token layer rewritten (§2); type utilities rewritten (§3) |
| `tailwind.config.js` | Token mapping and font families |
| `app/layout.tsx` | Recursive (via `next/font`), `defaultTheme="dark"`, metadata from `heroContent` |
| `app/page.tsx` | Recomposed (§6) |
| `app/projects/page.tsx` | Full board with filter (§7) |
| `components/navigation.tsx` | Replaced by `TopBar` |
| `components/footer.tsx` | Restyled |
| `components/sections/*` | Replaced per §5; `about-section.tsx` deleted |
| `components/ui/*` | New components per §5; `project-card.tsx` and `link-preview.tsx` deleted; `chat-widget.tsx` restyled |
| `lib/data.ts` | `heroContent` fields (§1), `availability`, `navigationItems` (§1), `/projects` copy (§7) |
| `lib/display-status.ts` | New (§4) |
| `lib/chat-context.ts` | Adds `specialism` and `availability` |
| `types/index.ts` | `DisplayStatus` |
| `tests/content/*`, `tests/design/*` | New tests (below) |
| `CLAUDE.md` | Styling section, fonts, client/server boundary, branch note |
| `.gitignore` | Adds `.superpowers/` so brainstorm mockups are never committed |

## Testing and quality gates

**Content tests.** The existing 84 stay green. New:

1. `displayStatus()` maps **every** `ProjectStatus`. Adding a status fails the suite
   until it has a display value.
2. `heroContent.specialism` states the same count as the `Sites` band.
3. `availability` is a non-empty string, and `lib/chat-context.ts` includes it.
4. Every id in `heroContent.stack` exists in `skills`, so a trimmed skill cannot
   leave a dangling chip.

**Design tests** (`tests/design/`).

5. **Token contrast.** Parses `app/globals.css`, converts each token to sRGB, and
   asserts WCAG contrast for every declared pair **in both themes**: 4.5:1 for text
   pairs (`--ink`, `--muted`, `--muted-strong`, `--accent` against `--bg` and
   `--panel`), 3:1 for non-text pairs (status glyphs and the focus ring against
   `--panel` and `--bg`). The test fails on any token it cannot parse, which keeps
   the one-token-per-line `oklch()` format honest.

**Accessibility.** Full keyboard traversal; visible focus ring; skip link; 24px
minimum targets (WCAG 2.5.8); status never by colour alone; motion verified
removed under reduced motion.

**Lighthouse, on the `v4` preview URL, mobile:** Accessibility 100 ·
Performance ≥ 90 · Best Practices ≥ 95.

**CI:** type-check, lint, test, build — unchanged.

**Merge criteria, `v4` → `main`:**

- every gate above passes;
- impeccable critique **≥ 32/40** and audit **≥ 16/20** (baseline 20/40 and 7/20);
- **Christian signs off on the preview URL.** Nothing merges on the reviewer's
  judgment alone.

## Risks and open items

**R1 — Operator is a crowded genre.** Dark developer portfolios are common in 2026.
The mitigations are the warm graphite and amber palette instead of green-on-black,
the status language, the Field log, and the second-opinion gate in step 5. If the
critique still reads it as a template, that is a finding to act on, not to argue.

**R2 — The primary audience is non-technical.** Operator reads most strongly to
engineers. The lede is written for clients, the Field log carries people, and the
CTA row leads with contact. The critique in step 4 is asked to evaluate the page
specifically as a hospitality business owner would.

**R3 — The proof band still has an unbacked claim.** Phase 1 left "Four payment
gateways" asserted by a test that compares two hand-typed values, because Maya and
Xendit appear on no project. This design makes the proof band more prominent than
before. It should be resolved on `main` before `v4` merges.

**R4 — Branch drift.** Mitigated by merging `main` into `v4` on every change to
`main` (see Branch).

**Carried from Phase 1, still open, owner's decision:**

- Which projects used Maya and Xendit (R3).
- "2+ years" in `scripts/build-resume.mjs`.
- Confirmation from Online Creative Solutions about the published control-panel
  entry.
