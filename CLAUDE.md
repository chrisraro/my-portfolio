# Project Instructions

Personal portfolio site for Christian Raro: a homepage, a `/projects` index and
a page per project, `/services` with three service pages, `/about`, `/hire`, two API routes, no database — all content is static data.

## Tech Stack

Next.js 14 (App Router) · React 18 · TypeScript 5 (strict) · Tailwind CSS 3 ·
`motion` (imported as `motion/react`; replaced framer-motion) · next-themes ·
lucide-react · Instrument Sans (one variable family) via `next/font/google` · Groq (chat) ·
Resend (email)

## Build & Run

- Dev: `npm run dev`
- Build: `npm run build`
- Types: `npm run type-check`
- Lint: `npm run lint`
- Tests: `npm test` (Vitest: content, design and component-markup tests; no E2E)
- URL liveness: `npm run verify:urls` (manual; hits the live internet, never in CI)
- Thumbnails: `npm run capture [id ...]`; full-page preview shots: `npm run capture -- --full [id ...]`
- Embeddability: `npm run check:embeds` (manual; hits the live internet, never in CI)
- Resume PDF: `npm run resume`
- The land: `node scripts/build-scene.mjs` (one-off; draws Mount Isarog over the Naga plain as four seeded one-bit masks in `public/assets/scene/`, which `app/globals.css` paints with theme tokens; a rerun writes the same bytes; commit the result)
- Map outline: `node scripts/build-ph-outline.mjs` (one-off; Node 22.18+; rewrites `lib/ph-outline.ts` from Natural Earth via the `world-atlas` and `topojson-client` devDependencies; commit the result)

`capture` and `resume` drive system Chrome/Edge via hardcoded Windows paths (`puppeteer-core`).

## Testing

Tests live in `tests/` and run under Vitest, in four folders:

- `tests/content/` asserts the facts the site claims: the inventory, bands and
  statuses, the proof counts (`proof-band`), positioning, testimonials,
  ordering, structured data, the AI files, the route registry (`site-routes`:
  every page once), robots, the privacy guards (`privacy-guard`: each guard
  shown failing), `s5-surfaces` (nothing private on any route's metadata,
  JSON-LD or card; every route in the sitemap and `llms.txt`), CTA labels, the
  map pan, embeddability parsing, visible copy, the new pages' copy (`new-pages`:
  40-60 word opening answers, every proving project held to its own data),
  `meta-descriptions` (every route 50-160 characters through `metaDescription`;
  the long answers stay for the AI files) and `direction-contract` (the
  homepage brief keeps its blocks and stays out of the source).
- `tests/design/` asserts design invariants: `contrast` (every token pairing in
  both themes, field borders on `--field-border`, in-development violet well
  away from ember), `og-palette` (the link-preview cards' hex copies match the
  night theme's `.dark` tokens), `type-scale`, `green-means-live`,
  `client-boundary` (the client-component count and which routes stay on the
  server), `nav-anchors`, `sticky-header`, `primary-button` (one
  `.button-primary`, used by every primary CTA), `grid` (the one `SECTION`
  constant, never spelled out), `survey-plate` (every plate through
  `SurveyPlate`), `view-transitions` (click planning, transition names,
  feature detection, reduced motion, fallback, cleanup),
  `motion-tokens` (TS tokens mirrored as CSS vars), `no-framer-motion`,
  `no-inline-motion` (no numeric `duration`/`ease`/`delay` literals in `.tsx`),
  `font-budget` (after a build: one preloaded font file under its budget),
  `cn-type-utilities` (`cn` keeps a type utility beside a text colour) and
  `performance` (image priority only on first-viewport images, shots at quality
  50, `LazyMotion` + `m.*` with a lazy feature chunk, no `useAnimate`, the
  size-adjusted Arial body fallback, `content-visibility` deferral, transform-only
  reveals). A rule that changed with a redesign changes its test in the same
  commit; the docs are read by some of them (`s6-finish`, `retired-classes`,
  `s4-surfaces`, `s5-surfaces`).
- `tests/components/` renders components with `react-dom/server` and checks
  their markup: each homepage section and the page order (`homepage`), the
  project page, `/projects`, the services pages, `/about`, `/hire`, page intro
  and work history, the 404, status badge, project shot, live preview, JSON-LD,
  client surfaces, the link-preview cards (`og-card`), catalog consistency,
  legend filter, trail link, survey plate and map pin, plus source guards for
  behaviour static markup cannot reach.
- `tests/helpers/` holds helpers shared across those folders: `privacy.ts`
  (`hasPhone`, `hasStreet`, `privacyIssues`: phone, street, a telephone field,
  any email but the public one), which every public surface's test runs, and
  `json-ld.ts` (`danglingRefs`, `missingFields`), the graph-shape checks.

There are no E2E tests.

CI (`.github/workflows/ci.yml`) runs type-check, lint, test, and build on push and
PR to `main`. Run all four locally before committing; they must pass with no
environment variables set.

## Project Structure

```
app/                 App Router: layout.tsx (font, providers, the land, the panel, chrome), page.tsx (homepage: nine sections in one column), not-found.tsx (the 404, "No page here"), robots.ts (names Googlebot, OAI-SearchBot, Claude-SearchBot and PerplexityBot; every crawler, AI training crawlers included, allowed outside /api/), sitemap.ts (every route in lib/site-routes.ts)
app/services/        /services (the three services, then the form) and services/[slug]/ (one page per service, statically generated: the answer, question-style sections, a comparison where the data holds one, the proving projects as rows, the form)
app/about/           /about (a Read page): story, the dated route, the six field photos, the four attributed quotes, résumé
app/hire/            /hire: résumé, email, stack by depth, at a glance, how I work, the full work history, the form
app/globals.css     Every colour, motion and layout token, the glass, the land, the rise/row/view-transition CSS and the reduced-motion block
app/og/[[...path]]/  One link-preview card per page at the page's path under /og (/og is the homepage's): next/og on the edge runtime, night palette, Recursive Sans from app/fonts/; a path that is not a route is a 404
lib/og-linework.ts  The link-preview card's ridge, dithered dawn and text column (kept right of the words)
app/llms.txt/, app/llms-full.txt/  AI-readable summaries (llmstxt.org), built by lib/llms.ts
app/api/chat/        Groq-backed chat endpoint
app/api/contact/     Resend-backed contact endpoint
app/projects/        The whole inventory as rows by band and a map of the same data, filtered by ?band= (legend key), the map panning to the band
app/projects/[slug]/ One page per project, statically generated (generateStaticParams over every slug)
components/          site-legend.tsx (the glass panel; a bar below 1024px), scene.tsx (the land behind every page), footer.tsx, brand-mark.tsx, theme-provider.tsx, json-ld.tsx (renders a JSON-LD <script> from lib/structured-data.ts)
components/sections/ Homepage sections, in page order: intro, now-building (projects in development), experience (where I've worked), work-list (CaseStudyList, then WorkList), work-with-me (Places, then WorkWithMe: both exports), stack-table, plan-the-route
components/map/      philippines-outline, pin (Pin, PlaceGlyph, PLACE_MARK, LABELS), map-key.tsx (MapKey: the dot and the ring), spot-height (SpotHeight), place-map: the map SVG primitives
components/ui/       Primitives: grid.ts (SECTION, SECTION_WIDE), page-intro, work-history, status-badge, section-heading (SectionHeading, ListHeading), survey-plate, trail-link, project-row, project-shot, legend-filter, live-preview, no-preview-tag, view-transitions (client island), chat-widget, toaster, image-lightbox
components/case-study/ project-header, read-spread, project-screenshots, project-summary, case-study-body (the trail journal) — /projects/[slug]'s parts
lib/data.ts          Single source of truth for ALL portfolio content, including section copy
lib/case-studies.ts  Flagship case studies (lib/data.ts is the primary content source; this is the second)
lib/project-page.ts  Server-only helpers for /projects/[slug] and screenshots: fullShotFor, hasFullShot, isEmbeddable, … (reads the filesystem — never import from a client component)
lib/embeddable.json  Which live sites allow framing, written by `npm run check:embeds`; read by isEmbeddable()
lib/motion-tokens.ts Durations, easings, distances, springs (mirrored as --dur-* / --ease-* in globals.css)
lib/view-transition.ts Pure click rules and transition names for components/ui/view-transitions.tsx
lib/motion-features.ts, lib/motion-dom-animation.ts  Lazy-load motion's domAnimation features for <LazyMotion>
lib/og-palette.ts    The night theme as hex for the link-preview cards (held to globals.css's `.dark` by a test)
lib/chat-context.ts  Builds the AI assistant's system prompt from lib/data.ts and lib/case-studies.ts
lib/structured-data.ts Builds each page's JSON-LD graph (`routeGraph`, `graphFor`): one Person `@id`, WebSite, BreadcrumbList (not on the homepage), ProfilePage on /about, Service per service page, CreativeWork or SoftwareApplication per project (the Applications band is software). The layout renders no graph
lib/llms.ts           Builds /llms.txt and /llms-full.txt from the same content modules
lib/site-metadata.ts Builds every page's metadata from its route (`buildRouteMetadata`, `buildProjectsMetadata`, `ogImage`, `absoluteUrl`); SITE_URL falls back to https://christian-digital-portfolio.vercel.app
lib/site-routes.ts   Every page once (`siteRoutes`, `routeFor`, `findRoute`): path, title, description, keywords, card words, breadcrumbs, sitemap priority; also projectHref. Pure, so the edge card route can read it. Metadata, cards, JSON-LD, sitemap, llms files and the chat prompt all read it
lib/board.ts         Band grouping and ordering (groupByBand, previewFirst, catalogOrder), the /projects count line, the ?band= parameter
lib/map-pan.ts       The /projects map pan (panTo, panStyle): frames a band's pins, zoom 1-1.75, never past the map's edge
lib/display-status.ts, lib/proof.ts (isShipped, numberWord), lib/dates.ts, lib/timeline.ts, lib/places.ts, lib/elevation.ts — pure helpers, all tested
lib/geo.ts           The map's projection (project(lat, lng)), shared with scripts/build-ph-outline.mjs
lib/ph-outline.ts    The Philippines outline, generated by scripts/build-ph-outline.mjs (do not edit)
lib/utils.ts         cn(), extractDomain
types/index.ts       Every shared interface — Project, Skill, ExperienceItem, …
tests/               content/, design/, components/ (Vitest); tests/helpers/ holds shared test helpers (privacy.ts, json-ld.ts, css-rules.ts)
scripts/             Puppeteer and network utilities: capture-screenshots, check-embeds, verify-urls, build-resume; build-scene (the land) and build-ph-outline (the map), both one-off; scripts/lib/ (inventory reader, embeddability check)
public/assets/       images/{about,gallery,projects}, resume/, scene/ (the land's four masks, written by scripts/build-scene.mjs)
```

## Content Changes

Never hardcode portfolio content in components. Add or edit the typed arrays in
`lib/data.ts` (`projects`, `skills`, `experience`, `education`, `recommendations`,
`galleryImages`, `socialLinks`, `contactInfo`, `navigationItems`, `heroContent`,
`availability`, `resumeUrl`, `sectionContent`, `footerContent`,
`projectsPageContent`, `paymentGateways`, `galleryContent`, `caseStudyContent`,
`notFoundContent`, `sectorNames`, `services`, `ctaLabels`, `servicePages`, `servicesPageContent`, `aboutPageContent`, `hirePageContent`, `pagesUpdated`, `serviceArea`) and add the matching interface in
`types/index.ts` if it's new.

`lib/site-routes.ts` lists every page once, from `lib/data.ts` and
`lib/case-studies.ts`. The metadata, the link-preview cards, the JSON-LD
(`lib/structured-data.ts`), `app/sitemap.ts`, `lib/llms.ts` (`/llms.txt`,
`/llms-full.txt`) and the chat assistant all read it. Adding a project or a
service page reaches all of them automatically; nothing there needs
hand-editing. A new kind of page is one entry in `siteRoutes()`.

A page whose answer or description runs past a search snippet sets
`metaDescription` (≤ 155 characters; `tests/content/meta-descriptions.test.ts`
caps every route at 160). Only the metadata reads it; the AI files, the chat
prompt and the JSON-LD keep the long answer.

`lib/case-studies.ts` is the second content source: it holds the flagship
case studies, keyed by project slug. A number from a client's business goes in
`metrics` with `clientApproved: true`, and only after Christian confirms the
client agreed. Research dossiers live in `docs/case-studies/research/` and are
gitignored.

What counts as content: facts about Christian and his work, and every section
heading and eyebrow — those live in `lib/data.ts`. Control and group labels
that belong to the interface itself ("Start a project", "View work", "All",
"Work" / "Education", "Live preview", form field labels) are UI chrome and may
live in the component.

The S4 pages open with a self-contained 40-60 word answer in the third person
("Christian Raro is a …"), then first-person copy; `PageIntro` prints it with
the `pagesUpdated` date. Each service's `projectIds` are its proof: a project
named in its copy must be in the list, and its own data must support the
service (`tests/content/new-pages.test.ts`). Change a fact there only when the
data behind it changes.

Call-to-action labels live once in `ctaLabels` (`tests/content/cta-labels.test.ts`); section copy that repeats one references it.

`lib/chat-context.ts` derives the AI assistant's entire system prompt from
`lib/data.ts` and the approved case studies in `lib/case-studies.ts`. Adding a
project or a case study reaches the chatbot automatically. Do not
reintroduce hand-written portfolio prose into `app/api/chat/route.ts` — that
duplicate existed once and drifted out of date.

Projects carry a `band` from a closed three-value vocabulary — `Custom systems`,
`Applications`, `Sites` — and a `status`: `live`, `ua-gated`, `auth-gated`,
`internal`, `staging` or `in-development`. The status decides how a project
previews and whether it counts as shipped (`isShipped()` in `lib/proof.ts`:
neither `staging` nor `in-development`). A project in development gets the
banner under the homepage intro (`NowBuilding`) and is not counted as shipped.
The proof counts (shipped projects, case studies, places) are
`elevationFigures()` in `lib/elevation.ts`, counted from the data; the homepage's
three counts and the chat prompt read them, and
`tests/content/proof-band.test.ts` holds them to the inventory.

**The portfolio claims no products of Christian's own.** Do not add a band, a
count, a section or a line of copy that does. Whose a project is is stated
plainly: client work is the client's; Iskotify is an Online Creative Solutions
project, in development, with its website live. Three personal products were
taken off at his request: their old project addresses redirect to `/projects`
(`next.config.js`), and they stay out of the data, the case studies and the
screenshots.

**Do not put private contact details in the chat prompt.** Public email and social
links only — no phone number, no home address. Rule 8 of the system prompt states
this; keep it that way.

The same rule applies to the metadata, the link-preview cards, the JSON-LD (`lib/structured-data.ts`) and the AI files
(`lib/llms.ts`): public email and social links only, and the address is the
public locality (Naga City, Camarines Sur, Philippines), never a street. No
telephone field anywhere. No FAQPage, AggregateRating or Review markup. `tests/content/s5-surfaces.test.ts` runs `privacyIssues` over every route's metadata, graph and card, both AI files and the chat prompt.

## Previews

Every project is a row on `/projects` and, where the homepage lists it, there too
(`ProjectRow`: a thumbnail, the name with its status, one line, the kind of
client; one link). What fills the thumbnail and the project page's frame:

- **A shot:** the top of `public/assets/images/projects/<id>-full.webp` when
  `fullShotFor(project)` finds it. A row crops it (`object-top`) into its
  thumbnail; the project page shows it as a still in the frame every screenshot
  shares (`ProjectShot`, `components/ui/project-shot.tsx`, server;
  `SHOT_ASPECT`), on a `SurveyPlate`. Nothing inside a row or plate scrolls, and
  nothing about it follows the page's scroll. Make the shots with
  `npm run capture -- --full [id ...]` (1440 wide, whole page clipped at 6000px,
  WebP quality 70). View every new shot; a broken one is deleted and its id
  added to `FULL_SKIP` in `scripts/capture-screenshots.mjs` with the reason, so a
  rerun does not bring it back.
- **No shot:** a row shows a lock, and the project page's `NoPreviewTag` prints
  why (`caseStudyContent.noPreview`) in the same `SHOT_ASPECT` frame. Never fake
  a screenshot for an auth-gated or internal project; its interior needs the
  client's clearance.
- **LivePreview** (`components/ui/live-preview.tsx`, client) appears only when
  `isEmbeddable(project)` is true, which reads `lib/embeddable.json`. Refresh it
  with `npm run check:embeds` (a site is embeddable when it answers 2xx and its
  CSP `frame-ancestors` names this portfolio's origin or `*`, or, with no
  `frame-ancestors`, it sends no `X-Frame-Options` DENY/SAMEORIGIN) and commit
  the JSON. A project missing from it is not embeddable.

## Code Style

- Named exports for components (`export function ProjectCard`) — no default exports.
- Files: kebab-case. Components: PascalCase. No semicolons. Single quotes.
- Imports use the `@/` alias (`@/lib/data`, `@/components/ui/project-row`), never `../../`.
- Merge Tailwind classes with `cn()` from `@/lib/utils`.
- Don't prefix a non-hook with `use` — `useCallback`-wrapped helpers named `useX`
  trip `react-hooks/rules-of-hooks`. Name them `applyX` / `handleX`.
- Eyebrows come from `lib/data.ts`. A literal one is braced, `{'Naga City'}` —
  a bare `// text` JSX child parses as a comment and fails lint.

## Styling

- Visual authority is `DESIGN.md` (First Light, written from the built site),
  with the homepage's direction contract and motion choreography in
  `.impeccable/surfaces/app-page-tsx.md`. Read both before UI work.
- The world: Mount Isarog over the Naga plain as a fixed pixel land
  (`components/scene.tsx`, `.scene-*`), one reading column of compact rows beside
  a floating panel of liquid glass, and one warm accent, ember. **Night is the
  default theme** (`ThemeProvider defaultTheme="dark"`, no system following);
  morning is the other. Corners are round (`--radius` 16px; the panel 26px;
  buttons, chips and controls are pills).
- Colours are raw oklch `L C H` triplets in `app/globals.css`: `:root` is the
  morning theme, `.dark` the night theme (the default), one per line.
  `tests/design/contrast.test.ts` parses them and checks WCAG contrast in both
  themes; keep the format exact. The land has its own tokens (`--land-far`,
  `--land-near`, `--land-lit`, `--dawn`, `--firefly`) and `--shine` /
  `--shine-a` for the glass's light.
- Tailwind colour keys: `canvas` (page, CSS `--bg`), `panel`, `ink`, `muted`,
  `muted-strong`, `line`, `line-strong`, `contour`, `trail`, `on-trail`,
  `field-border`, `live`, `status-early`, `status-private`, `status-internal`.
  Never raw hex, never `dark:` colour pairs. Text fields draw their border in
  `field-border` (3:1, WCAG 1.4.11), never a hairline token. There is no
  `accent` key.
- **Ember (`trail`) marks the primary action and the current position only:**
  `.button-primary`, the chat's send button, the panel's and the filter's
  current-page dot, the focus ring and the caret (where the keyboard is). Hover
  and focus borders are `ink`; selection is `ink` with `bg` text; the brand mark
  is an ink plane. The land's `--dawn` is a different token and stays behind the
  page.
- **One primary button:** `.button-primary` (with `.press` for the hover lift),
  defined once in `globals.css`: an ember pill with `on-trail` text, beside the
  clear-glass `.button-secondary`. Never compose a primary from a fill and
  padding; `tests/design/primary-button.test.ts` enforces it.
- **Glass (`.glass`) is the one material for what floats over the land:** the
  panel and the bar, the filter, the banner, the chat and the chat launcher. It blurs and saturates, catches light on its top edge and, on
  the panel, carries a highlight that follows the pointer (`--gx`, `--gy`).
  **Never glass on glass:** on glass use `.glass-control`, `.chip`, `.lozenge`
  (no blur of their own), or opaque paper (the phone menu). It is opaque under
  `prefers-reduced-transparency`, `prefers-contrast: more` and without
  `backdrop-filter`.
- **Green (`live`) means a live system and nothing else.** The chat
  assistant's status dot is `ink`. `live` and `.live-pulse` appear only in
  `StatusBadge`; `tests/design/green-means-live.test.ts` enforces it.
- **Status is never colour alone.** Render it only through `StatusBadge`, which
  pairs a glyph shape with a text label: live dot, in-development ring (violet,
  `status-early`, kept well away from ember), private lock, internal filled
  square, staging outlined square.
- Type: one variable family via `next/font`, nothing else: **Instrument Sans**,
  loaded as `--font-sans` (`font-sans`; `font-display` is the same family).
  Body text falls back to Arial sized to its metrics (`adjustFontFallback:
  true`), so the swap re-wraps nothing. There is no uppercase display face and no
  `font-stretch`; hierarchy is size, weight and tracking in the type utilities in
  `globals.css`: `.text-name`, `.text-page-h1`, `.text-section`, `.text-title`,
  `.text-list`, `.text-row`, `.text-figure`, `.text-lede`, `.map-label`,
  `.tabular`. No serif, no mono. Numerals use `tabular-nums` and are plain ("4",
  not "04").
- One grid: every section and read-page block uses `SECTION` from `components/ui/grid.ts` (`mx-auto w-full max-w-[49rem] px-5 sm:px-8`, one reading column), never the literal (`tests/design/grid.test.ts`); `SECTION_WIDE` (66rem) is for `/projects` and a project page. From 1024px the page sits beside the fixed panel (`lg:pl-[17.5rem]` in `app/layout.tsx`). Every screenshot frame and no-preview frame uses `SHOT_ASPECT` (`components/ui/project-shot.tsx`). Every plate is a `SurveyPlate`; every text link is a `TrailLink` (an action with an arrow, or a map label).
- Section headings: a list's heading is `ListHeading` (a `.text-list` h2 with its count at the far end); a page section's is `SectionHeading` (one `<h2 className="text-section">`). Copy from `lib/data.ts`. No eyebrow over a section heading (the craft floor bans it); the intro keeps its eyebrow, and page eyebrows above an h1 name where you are.
- Read pages (`/services`, a service page, `/about`, `/hire`) open with `PageIntro` (the h1, the answer in ink, the updated date, the actions) and end in `PlanTheRoute`, except `/about`, which ends in links.
- Shadows: none in the column at rest. `shadow-lift` only while a linked screenshot is lifted (a pseudo-element faded in by opacity: never animate `box-shadow`); `shadow-overlay`, ink-hued in both themes, for glass, the dialog, chat and toasts.
- The land is behind everything and under a scrim (`.scene-scrim`): no word sits on the bare land. The masks in `public/assets/scene/` are colourless; `globals.css` paints them with the land tokens. Redraw them with `node scripts/build-scene.mjs`, never by hand.
- Off-screen work: `.defer-render` (`content-visibility: auto`) exists, but no homepage section carries it now; never put it on a section whose content paints outside its box (a lifted shadow would clip). `ProjectShot` frames skip rendering until near the viewport (`.project-shot__frame`).

## Client/Server Boundary

Components are server components by default. Only these eight are client
components (`grep -rl "^'use client'" app components`):
`components/site-legend.tsx` (the glass panel and the phone bar: theme toggle, the lozenge that follows the pointer and focus, the pointer highlight, the phone menu below 1024px (a `<details>` disclosure it closes on a route change, Escape, a press outside or a followed link), in-page jump fix),
`components/theme-provider.tsx`,
`components/sections/plan-the-route.tsx` (form; its "Ask Chunks" opens the chat through `CHAT_OPEN_EVENT`),
`components/ui/chat-widget.tsx`,
`components/ui/image-lightbox.tsx`,
`components/ui/live-preview.tsx` (dialog),
`components/ui/toaster.tsx` and
`components/ui/view-transitions.tsx` (renders nothing: the catalog's view-transition
island, mounted once in `app/layout.tsx` inside `Suspense`). A server component
may render a client one as a child — `Intro` and `ProjectScreenshots`
render `ImageLightbox`, as does `/about` for its photos, and `ProjectHeader` renders `LivePreview`; the homepage, the service pages and `/hire` render `PlanTheRoute`.
`Scene`, `ProjectShot`, `ProjectRow`, `LegendFilter`, `SurveyPlate`, `TrailLink`, `PlaceMap`, `PageIntro`, `WorkHistory` and every S4 page are server components; their motion is
CSS. `tests/design/client-boundary.test.ts` keeps the count under 10 and the
homepage and `/projects` on the server; do not raise it.

## Animation

Three verbs: *rise* (copy and rows lift into place), *pan* (the map and the page
glide to a waypoint) and *light* (the dawn climbs behind the summit as the page
scrolls). Screenshots are stills: nothing about a screenshot is scrubbed by
scroll. The choreography is in `DESIGN.md` (Motion) and the direction contract.
Motion is CSS plus the installed `motion` library; no other animation library.

- **Tokens:** durations, easings, distances and springs live in
  `lib/motion-tokens.ts` and are mirrored as `--dur-fast|normal|slow|crawl|draw`
  and `--ease-smooth|sharp` in `globals.css`; `tests/design/motion-tokens.test.ts`
  keeps the two in step. Never write a numeric `duration`, `ease` or `delay` in a
  `.tsx` file (`tests/design/no-inline-motion.test.ts`); a literal 0 is allowed.
- **CSS first.** The rises, the dawn, the glass, the row hover and the hover
  grammar are all CSS in `globals.css`. Animate transform (and, for the
  decorative dawn and fireflies, opacity); a shadow is a pseudo-element whose
  opacity fades.
- **Rise (`.rise`):** the intro's three lines of copy, on load, once, 16px,
  `--dur-slow`, `--stagger-line` apart (`--i` on each line), no-preference only.
  Transform only, painted from frame one.
- **Row rises (`.rise-in`):** a role, a case-study or project row, a way to work together
  and a stack row rise 24px on a view timeline (`animation-timeline: view()`), inside
  both `@supports (animation-timeline: view())` and
  `@media (prefers-reduced-motion: no-preference)`. Outside the gates nothing is
  hidden or offset. They move by transform only — never opacity — so the server
  HTML is the finished page and nothing is measured for contrast while faded.
  Every homepage section must be visible in the server HTML;
  `tests/components/homepage.test.tsx` forbids `opacity:0` there.
- **First light (`.scene-dawn`):** the dawn layer rises from 96px below and 45%
  opacity to full on `scroll(root block)`, inside `@supports (animation-timeline:
  scroll())` and no-preference. It is the one scroll-linked element, a
  background decoration; do not add another.
- **Fireflies (`.firefly`):** eight 4px squares in `components/scene.tsx`, shown
  from 1280px; the four marked `twinkle` fade twice (2.2 s each) and stop.
- **Glass in motion:** the panel's highlight follows the pointer (`followPointer`
  in `components/site-legend.tsx`); `.lozenge` glides on `--dur-normal` to the link
  the pointer or the keyboard is on; `.row::before` is the pane that fades in
  under a hovered row and its thumbnail zooms to 1.12. Fine pointer and
  no-preference only; keyboard focus gets the pane with no travel.
- **Plates are stills.** No plate or screenshot rises or follows scroll. An
  appear-once rise was tried for plates and removed: a trigger-held animation
  sits paused at its first keyframe, so plates rested offset, and the production
  minifier collapses the trigger's range to zero length.
- **Catalog hover (`.lift-card`)**: a linked `ProjectShot` on a project page. On
  a fine pointer with motion allowed: lift 2px, border to `ink`, screenshot scale
  1.02 inside a clipping frame, fast/smooth, shadow faded in on a pseudo-element.
  Keyboard focus gets the ink border with no travel in every mode.
- **View transitions** (`components/ui/view-transitions.tsx`, rules in
  `lib/view-transition.ts`): a `/projects` filter change glides rows and band
  headings to their new places (FLIP, names `plate-<slug>` / `band-<heading>`
  while it runs) while the map pans; a click on a project link morphs the clicked thumbnail
  (`data-vt-shot`) into the project page's rail shot (`morphTarget`,
  `shot-<slug>`) while the rest cross-fades. Feature-detected
  (`startViewTransition`), off under reduced motion, modified clicks and other
  routes left to next/link, 2.5s commit timeout, full-navigation fallback,
  `::view-transition { pointer-events: none }`. Without JS, plain links.
- **Map pan (`.map-pan`)**: `/projects` writes `--pan-x/--pan-y/--pan-s` from `lib/map-pan.ts` on a map layer inside a clipping frame; a client navigation (a legend key) glides it (`--dur-slow`, `--ease-smooth`, transform only, no-preference only). A pin jumps to its row (`#plate-<slug>`) on the page's smooth scroll. Pins counter-scale (`.map-pin__mark`, `scale(calc(1 / var(--pan-s, 1)))` about each pin's point), so a pan zooms the map, not the labels; `MapKey` names the dot (town or city) and the ring (region) in both map captions.
- **`motion/react` only in client components** (LivePreview, ImageLightbox, chat,
  toasts; the view-transition island uses the browser API, not motion), and only as `m.*` from `motion/react-m` inside
  `<LazyMotion features={loadMotionFeatures} strict>`, so the engine loads in its
  own chunk. Never import `framer-motion`, render `<motion.*>`, or use
  `useAnimate` (`no-framer-motion` and `performance` tests). Dialogs use
  `AnimatePresence`; LivePreview's width toggle is a WAAPI `scaleX` with token
  timing.
- **Nothing moves for more than five seconds** (WCAG 2.2.2). The live pulse
  (`.live-pulse`, only in `StatusBadge`) fades twice (2.4 s each) and stops; the
  fireflies twinkle for 4.4 s and stop. The chat typing dots (`.typing-dot`) and
  the "Sending" spinner run only while a request is pending. No count-ups,
  parallax or continuous animation.
- **Reduced motion:** the gates switch off every rise; the `reduce` block resets
  `.rise`, `.rise-in` and the dawn explicitly (in place, fully risen); the row
  pane, the lozenge's glide and the pins' glide go; hover transforms go (colour,
  the ink border and underlines still change, instantly); the island navigates
  without a transition and any view-transition animation is zeroed; the pulse is
  removed; every animation and transition collapses to one near-instant
  iteration. In JS, `useReducedMotion` drops offsets (dialogs only fade).
- Two hydration lessons: never use `whileInView` for above-the-fold content, and
  never branch the element type on reduced motion.

## Toasts

`ToastProvider` wraps the tree in `app/layout.tsx`. Call `useToast()` from any client
component for user feedback — never `alert()`. It throws outside the provider, so a
new provider must not be introduced elsewhere.

## API Routes

Both routes must keep working with no environment variables set — CI builds and runs
without secrets. Follow the existing pattern: check for the key, and return a
degraded-but-honest response when it's missing rather than throwing or pretending
the action succeeded.

- `/api/chat` — no `GROQ_API_KEY` → canned offline reply.
- `/api/contact` — no `RESEND_API_KEY` → `{ delivered: false, fallback: 'mailto' }`,
  and the client opens the visitor's mail app instead.

## Environment

All optional; see `.env.example`. Real keys live in `.env.local` (gitignored).
`GROQ_API_KEY`, `GROQ_MODEL`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL`,
`GOOGLE_SITE_VERIFICATION` (optional; adds the Google Search Console verification meta tag).

Things that have already bitten:

- `RESEND_API_KEY` may also be set in the developer's shell environment, which
  overrides nothing but means a stray `/api/contact` POST sends a real email.
  Run local servers keyless: `RESEND_API_KEY= GROQ_API_KEY= npx next start -p 3100`.
- `CONTACT_FROM_EMAIL` is the sender and needs a domain verified in Resend. A
  gmail.com address fails with 403. `onboarding@resend.dev` only delivers to the
  Resend account owner.
- Groq retires model ids; a retired one 404s at request time, not build time. Check
  `curl https://api.groq.com/openai/v1/models -H "Authorization: Bearer $GROQ_API_KEY"`
  and set `GROQ_MODEL` rather than editing the route.
- Deleting a route leaves a stale `.next/types/app/<route>/page.ts` artifact behind.
  `npm run type-check` then fails pointing at a file no longer in the source tree.
  Clear `.next` and re-run.
- `next/og`'s Node build throws "Invalid URL" on Windows, which failed `next build`.
  `app/og/[[...path]]/route.tsx` runs on the edge runtime for that reason; keep it
  there. It also needs a static font file, so the cards render in Recursive Sans
  from `app/fonts/recursive-sans-600.ttf`, not Instrument Sans (a variable font the card cannot read).

## Git

Commits use `type(scope): summary` with lowercase types — `feat`, `fix`, `refactor`,
`style`, `chore`, `perf`, `docs`, plus project-specific `content:`, `data:`,
`assets:`, `resume:`. Work happens directly on `main`; every push to `main`
deploys to production on Vercel. For a large redesign, build on a branch (as
Portfolio 4.0 was built on `v4`, merged on 2026-10-05, and Portfolio 6.0 First
Light is being built on `v6`) so each
push gets a Vercel preview URL, and merge it only with Christian's sign-off on
the preview.
