# Project Instructions

Personal portfolio site for Christian Raro: a homepage, a `/projects` index and
a page per project, two API routes, no database — all content is static data.

## Tech Stack

Next.js 14 (App Router) · React 18 · TypeScript 5 (strict) · Tailwind CSS 3 ·
`motion` (imported as `motion/react`; replaced framer-motion) · next-themes ·
lucide-react · Anybody + Figtree via `next/font/google` · Groq (chat) ·
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

`capture` and `resume` drive system Chrome/Edge via hardcoded Windows paths (`puppeteer-core`).

## Testing

Tests live in `tests/` and run under Vitest. `tests/content/` asserts the facts the
site claims (inventory, bands, proof band, positioning, testimonials, ordering,
structured data, the AI files, embeddability parsing, visible copy, removed
routes and tooling). `tests/design/` asserts design invariants:

- `contrast` (token contrast in both themes, field borders on `--field-border`, the `.on-plane` focus ring, amber planes filled with `--accent-plane` and inked with `--on-accent`, early-access violet at least 90 degrees of hue from amber)
- `legacy-tokens` (no pre-4.0 tokens, no B3 mono voice), `og-palette` (the social card's hex copies match `.dark`), `type-scale`
- `green-means-live`, `client-boundary`, `nav-anchors`, `sticky-header` (scroll padding, in-page jumps)
- `primary-button` (one `.button-primary`, used by every primary CTA)
- `catalog-motion` (screenshots are stills: nothing follows scroll, the old preview component and pockets stay gone; `.lift-card` hover is 2px, 1.02, accent border, inside the fine-pointer and no-preference queries, shadow on a pseudo-element, never an animated `box-shadow`; `.reveal-stagger` plays once on a scroll trigger, 30-80ms per column, off under reduced motion)
- `view-transitions` (click planning, transition names, the island: feature detection, reduced motion, capture-phase interception, commit timeout, fallback, cleanup; the root cross-fade and the zeroed reduced-motion block)
- `motion-tokens` (TS tokens mirrored as CSS vars; reveals and the hero behind their gates and off under reduce; hero under 2 s), `motion-visibility` (reveal ranges and distances, hero unfold direction, products settled)
- `no-framer-motion`, `no-inline-motion` (no numeric `duration`/`ease`/`delay` literals in `.tsx`)
- `performance` (image priority only on first-viewport images, shots at quality 50, `LazyMotion` + `m.*` with a lazy feature chunk, no `useAnimate`, plain Arial font fallbacks, `content-visibility` deferral, transform-only reveals)

`tests/components/` renders components with `react-dom/server` and checks their
markup (sections, project page, `/projects`, 404, status badge, project shot,
live preview, JSON-LD, client surfaces, OG image, catalog consistency: edge codes,
counts, filter tabs, the hero AI proof, the stack groups), plus source guards for
behaviour static markup cannot reach. `tests/helpers/` holds helpers shared
across those folders — `privacy.ts` is the phone-number guard the JSON-LD and
AI-file tests reuse. There are no E2E tests.

CI (`.github/workflows/ci.yml`) runs type-check, lint, test, and build on push and
PR to `main`. Run all four locally before committing; they must pass with no
environment variables set.

## Project Structure

```
app/                 App Router: layout.tsx (fonts, providers, chrome), page.tsx (homepage), not-found.tsx (the 404: an empty rack slot), robots.ts, sitemap.ts (lists the homepage, /projects and every project page)
app/globals.css      Every colour, motion and layout token, the reveal/hero/card-hover/view-transition CSS and the reduced-motion block
app/opengraph-image.tsx  Link-preview card rendered from heroContent (next/og, edge runtime); fonts in app/fonts/
app/llms.txt/, app/llms-full.txt/  AI-readable summaries (llmstxt.org), built by lib/llms.ts
app/api/chat/        Groq-backed chat endpoint
app/api/contact/     Resend-backed contact endpoint
app/projects/        Full project list page (the whole rack, filtered by ?band=)
app/projects/[slug]/ One page per project, statically generated (generateStaticParams over every slug)
components/          top-bar.tsx, footer.tsx, theme-provider.tsx, json-ld.tsx (renders a JSON-LD <script> from lib/structured-data.ts)
components/sections/ Homepage sections, in page order: hero, products, rack, case-studies, field-log, route-line, stack, contact-console
components/ui/       Primitives: status-badge, section-heading, proof-band, rack-tier, rack-card, project-shot, live-preview, no-preview-tag, board-filter, view-transitions (client island), chat-widget, toaster, image-lightbox
components/case-study/ project-header, read-spread, project-screenshots, project-summary, case-study-body, arrow-link-text — /projects/[slug]'s parts
lib/data.ts          Single source of truth for ALL portfolio content, including section copy
lib/case-studies.ts  Flagship case studies (lib/data.ts is the primary content source; this is the second)
lib/project-page.ts  Server-only helpers for /projects/[slug] and screenshots: fullShotFor, hasFullShot, isEmbeddable, … (reads the filesystem — never import from a client component)
lib/embeddable.json  Which live sites allow framing, written by `npm run check:embeds`; read by isEmbeddable()
lib/motion-tokens.ts Durations, easings, distances, springs (mirrored as --dur-* / --ease-* in globals.css)
lib/view-transition.ts Pure click rules and transition names for components/ui/view-transitions.tsx
lib/motion-features.ts, lib/motion-dom-animation.ts  Lazy-load motion's domAnimation features for <LazyMotion>
lib/og-palette.ts    The dark theme as hex for the social card (held to globals.css by a test)
lib/chat-context.ts  Builds the AI assistant's system prompt from lib/data.ts and lib/case-studies.ts
lib/structured-data.ts Builds JSON-LD (Person, ProfessionalService, WebSite, BreadcrumbList, CreativeWork) from lib/data.ts and lib/case-studies.ts
lib/llms.ts           Builds /llms.txt and /llms-full.txt from the same content modules
lib/site-metadata.ts Builds page metadata from heroContent (preview image comes from opengraph-image.tsx)
lib/board.ts         Rack grouping and ordering (groupByBand, groupForHomepage, homepageOrder, previewFirst), edge codes, the /projects ?band= parameter
lib/display-status.ts, lib/proof.ts, lib/field-log.ts, lib/dates.ts, lib/timeline.ts — pure helpers, all tested
lib/utils.ts         cn(), extractDomain
types/index.ts       Every shared interface — Project, Skill, ExperienceItem, …
tests/               content/, design/, components/ (Vitest); tests/helpers/ holds shared test helpers (privacy.ts)
scripts/             Puppeteer and network utilities: capture-screenshots, check-embeds, verify-urls, build-resume; scripts/lib/ (inventory reader, embeddability check)
public/assets/       images/{about,gallery,projects}, resume/
```

## Content Changes

Never hardcode portfolio content in components. Add or edit the typed arrays in
`lib/data.ts` (`projects`, `skills`, `experience`, `education`, `recommendations`,
`galleryImages`, `socialLinks`, `contactInfo`, `navigationItems`, `heroContent`,
`availability`, `resumeUrl`, `sectionContent`, `footerContent`,
`projectsPageContent`, `paymentGateways`, `galleryContent`, `caseStudyContent`,
`notFoundContent`, `sectorNames`, `services`) and add the matching interface in
`types/index.ts` if it's new.

`lib/structured-data.ts` (JSON-LD), `app/sitemap.ts` and `lib/llms.ts`
(`/llms.txt`, `/llms-full.txt`) are all built from `lib/data.ts` and
`lib/case-studies.ts`, the same as the page and the chat assistant. Adding a
project reaches all of them automatically; nothing there needs hand-editing.

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

`lib/chat-context.ts` derives the AI assistant's entire system prompt from
`lib/data.ts` and the approved case studies in `lib/case-studies.ts`. Adding a
project or a case study reaches the chatbot automatically. Do not
reintroduce hand-written portfolio prose into `app/api/chat/route.ts` — that
duplicate existed once and drifted out of date.

Projects carry a `band` from a closed four-value vocabulary — `Products`,
`Custom systems`, `Applications`, `Sites` — and a `status` that decides how they
preview (`live`, `ua-gated`, `early-access`, `auth-gated`, `internal`,
`staging`). The hero's proof band in `heroContent` makes factual claims that
`tests/content/proof-band.test.ts` checks against the data; if you change the
inventory, the band changes with it.

**Do not put private contact details in the chat prompt.** Public email and social
links only — no phone number, no home address. Rule 8 of the system prompt states
this; keep it that way.

The same rule applies to the JSON-LD (`lib/structured-data.ts`) and the AI files
(`lib/llms.ts`): public email and social links only, and the address is the
public locality (Naga City, Camarines Sur, Philippines), never a street. No
telephone field anywhere.

## Previews

Every project gets a slot in the rack. What fills it:

- **ProjectShot** (`components/ui/project-shot.tsx`, server) shows the top of
  `public/assets/images/projects/<id>-full.webp` when `fullShotFor(project)`
  finds it, as a still. Nothing inside it scrolls and nothing about it follows
  the page's scroll. Make the shots with `npm run capture -- --full [id ...]`
  (1440 wide, whole page clipped at 6000px, WebP quality 70). View every new
  shot; a broken one is deleted and its id added to `FULL_SKIP` in
  `scripts/capture-screenshots.mjs` with the reason, so a rerun does not bring
  it back.
- **No shot:** `NoPreviewTag` prints why (`caseStudyContent.noPreview`). Never
  fake a screenshot for an auth-gated or internal project; its interior needs
  the client's clearance.
- **LivePreview** (`components/ui/live-preview.tsx`, client) appears only when
  `isEmbeddable(project)` is true, which reads `lib/embeddable.json`. Refresh it
  with `npm run check:embeds` (a site is embeddable when it answers 2xx and sends
  neither `X-Frame-Options` DENY/SAMEORIGIN nor a CSP `frame-ancestors` that
  excludes other origins) and commit the JSON. A project missing from it is not
  embeddable.

## Code Style

- Named exports for components (`export function ProjectCard`) — no default exports.
- Files: kebab-case. Components: PascalCase. No semicolons. Single quotes.
- Imports use the `@/` alias (`@/lib/data`, `@/components/ui/rack-card`), never `../../`.
- Merge Tailwind classes with `cn()` from `@/lib/utils`.
- Don't prefix a non-hook with `use` — `useCallback`-wrapped helpers named `useX`
  trip `react-hooks/rules-of-hooks`. Name them `applyX` / `handleX`.
- Eyebrows come from `lib/data.ts`. A literal one is braced, `{'In the rack'}` —
  a bare `// text` JSX child parses as a comment and fails lint.

## Styling

- Visual authority is `DESIGN.md` (Lobby Rack, written from the built site), with
  the homepage's direction contract and motion choreography in
  `.impeccable/surfaces/app-page-tsx.md`. Read both before UI work.
- The world: a lagoon-night ground, paper panels, and signal amber laid down
  only as whole flat planes (hero front panel, product flaps, the contact reply
  card, the current filter tab). No gradients, glows, tints or outlines on
  planes. Paper is square-ish (`--radius` 6px; postcards 2px, dialog 10px).
- Colours are raw oklch `L C H` triplets in `app/globals.css` — `:root` is light,
  `.dark` is the default — one per line. `tests/design/contrast.test.ts` parses
  them and checks WCAG contrast in both themes; keep the format exact.
- Tailwind colour keys: `canvas` (page, CSS `--bg`), `panel`, `ink`, `muted`,
  `muted-strong`, `line`, `line-strong`, `field-border`, `accent`, `accent-plane`, `on-accent`,
  `live`, `status-early`, `status-private`, `status-internal`. Never raw hex,
  never `dark:` colour pairs. Text fields draw their border in `field-border`
  (3:1, WCAG 1.4.11), never a hairline token.
- **Two ambers.** `accent-plane` fills planes and the primary button, bright in
  both themes. `accent` is amber as ink and line (focus ring, hover border,
  links, small glyphs); in the light theme it is a deeper amber so it holds AA
  on paper. Never fill a plane with `accent` or set text on one in `ink`; the
  contrast test greps for it.
- **On an amber plane, text is `on-accent`** (dark ink in both themes). A plane
  that holds focusable controls carries `.on-plane`, which draws the focus ring
  in `on-accent` (the accent ring vanishes on amber) and inverts the primary
  button.
- **One primary button:** `.button-primary` (with `.press` for the hover lift),
  defined once in `globals.css`: an `accent-plane` fill on paper, a lagoon fill
  with amber text inside `.on-plane`. Never compose a primary from a fill and
  padding; `tests/design/primary-button.test.ts` enforces it.
- **Green (`live`) means a live system and nothing else.** Brand and availability
  use `accent`, and so does the chat assistant's status dot. `live` and
  `.live-pulse` appear only in `StatusBadge`; `tests/design/green-means-live.test.ts`
  enforces it.
- **Status is never colour alone.** Render it only through `StatusBadge`, which
  pairs a glyph shape with a text label: live dot, early-access ring (violet,
  `status-early`, kept well away from amber), private
  lock, internal filled square, staging outlined square.
- Type: two variable families via `next/font`, nothing else. **Anybody**
  (`font-display`, `--font-display`, loaded with its `wdth` axis) shouts:
  headings condensed at wdth 75, titles at 85, labels and buttons at 100.
  **Figtree** (`font-sans`, `--font-sans`) reads: body, ledes, forms, chat. Both
  fall back to plain Arial (`adjustFontFallback: false`). There is no mono
  family: dates, domains, counts and running indexes use `.edge-code`. Numerals
  use `tabular-nums` and are plain ("4", not "04"). Utilities: `.eyebrow`,
  `.edge-code`, `.button-label`, `.text-fluid-h1`, `.text-page-h1`,
  `.text-fluid-h2`, `.text-title`, `.text-numeral`, `.text-lede`.
- One grid: every section uses `mx-auto max-w-6xl px-5 sm:px-8`.
- Section headings: `SectionHeading` (`components/ui/section-heading.tsx`), an
  `.eyebrow` then an `<h2 className="text-fluid-h2">`, with copy from
  `sectionContent` in `lib/data.ts`.
- Shadows: none in flow at rest. `shadow-lift` only while a card or postcard is
  lifted (on a card, a pseudo-element faded in by opacity: never animate `box-shadow`); `shadow-overlay` for the dialog, chat and toasts.
- Off-screen work: far sections carry `.defer-render` (`content-visibility:
  auto`); rack tiers use `.defer-render-lift` so a lifted card and its shadow are not clipped.
  Never defer the hero, products, rack section or contact card. `ProjectShot`
  frames skip rendering until near the viewport (`.project-shot__frame`).

## Client/Server Boundary

Components are server components by default. Only these eight are client
components (`grep -rl "^'use client'" app components`):
`components/top-bar.tsx` (theme toggle, in-page jump fix),
`components/theme-provider.tsx`,
`components/sections/contact-console.tsx` (form),
`components/ui/chat-widget.tsx`,
`components/ui/image-lightbox.tsx`,
`components/ui/live-preview.tsx` (dialog),
`components/ui/toaster.tsx` and
`components/ui/view-transitions.tsx` (renders nothing: the catalog's view-transition
island, mounted once in `app/layout.tsx` inside `Suspense`). A server component
may render a client one as a child — `Hero`, `FieldLog` and `ProjectScreenshots`
render `ImageLightbox`, and `Products` and `ProjectHeader` render `LivePreview`.
`ProjectShot`, `RackCard` and `RackTier` are server components; their motion is
CSS. `tests/design/client-boundary.test.ts` keeps the count under 10 and the
homepage and `/projects` on the server; do not raise it.

## Animation

Paper that unfolds when you pay attention, and restrained: three verbs only —
*unfold* (reveal detail), *lift* (answer attention), *slide* (keep continuity).
Screenshots are stills; nothing about a screenshot or a card is driven by
scroll. The full choreography is in `DESIGN.md` (Components → Motion) and the
direction contract.

- **Tokens:** durations, easings, distances and springs live in
  `lib/motion-tokens.ts` and are mirrored as `--dur-fast|normal|slow|crawl` and
  `--ease-smooth|sharp` in `globals.css`; `tests/design/motion-tokens.test.ts`
  keeps the two in step. Never write a numeric `duration`, `ease` or `delay` in a
  `.tsx` file (`tests/design/no-inline-motion.test.ts`); a literal 0 is allowed.
- **CSS first.** Hero sequence, scroll reveals, the card hover, the stagger and
  the hover grammar are all CSS in `globals.css`. Animate transform and opacity
  only; a shadow is a pseudo-element whose opacity fades.
- **Scroll-driven reveals** (`.reveal`, `.reveal-cover|postcard|fold|reply|perf|route|stop`)
  use `animation-timeline: view()` and live inside both
  `@supports (animation-timeline: view())` and
  `@media (prefers-reduced-motion: no-preference)`. Outside the gates nothing is
  hidden or offset. Reveals move by transform only — never opacity — so the server
  HTML is the finished page and nothing is measured for contrast while faded.
  Proof (Products, the rack) must be visible in the server HTML;
  `tests/components/sections.test.tsx` forbids `opacity:0` there.
- **Hero sequence:** CSS keyframes on load, no JS, 1.9 s, once (H1 words rise,
  the inner panels unfold from behind the front one, creases draw, proof rises).
  It must stay under two seconds (`motion-tokens` test).
- **Catalog hover (`.lift-card`)**: rack cards, a product's screenshot and
  case-study covers. On a fine pointer with motion allowed: lift 2px, border to
  `accent`, screenshot scale 1.02 inside a clipping frame, fast/smooth, shadow
  faded in on a pseudo-element. Keyboard focus gets the accent border with no
  travel in every mode.
- **Rack stagger (`.reveal-stagger`)**: from 640px, each card rises its last
  16px once as it enters the viewport (a `timeline-trigger`, play-forwards,
  never reversed, never on a card already in view), each visible column
  `--stagger-card` (60ms) after the one before. Unsupported: cards at rest.
- **View transitions** (`components/ui/view-transitions.tsx`, rules in
  `lib/view-transition.ts`): a `/projects` filter change glides cards and tier
  headings to their new places (FLIP, names `card-<slug>` / `tier-<heading>`
  while it runs); a click on a project link morphs the clicked screenshot
  (`data-vt-shot`) into the case-study header shot (`morphTarget`,
  `shot-<slug>`) while the rest cross-fades. Feature-detected
  (`startViewTransition`), off under reduced motion, modified clicks and other
  routes left to next/link, 2.5s commit timeout, full-navigation fallback,
  `::view-transition { pointer-events: none }`. Without JS, plain links.
- **`motion/react` only in client components** (LivePreview, ImageLightbox, chat,
  toasts; the view-transition island uses the browser API, not motion), and only as `m.*` from `motion/react-m` inside
  `<LazyMotion features={loadMotionFeatures} strict>`, so the engine loads in its
  own chunk. Never import `framer-motion`, render `<motion.*>`, or use
  `useAnimate` (`no-framer-motion` and `performance` tests). Dialogs use
  `AnimatePresence`; LivePreview's width toggle is a WAAPI `scaleX` with token
  timing.
- **Nothing moves for more than five seconds** (WCAG 2.2.2). The live pulse
  (`.live-pulse`, only in `StatusBadge`) fades twice (2.4 s each) and stops. The
  chat typing dots (`.typing-dot`) and the "Sending" spinner run only while a
  request is pending. No count-ups, parallax or continuous animation.
- **Reduced motion:** the gates switch off every reveal, the stagger and the hero
  sequence, and the `reduce` block resets them explicitly; hover transforms go
  (colour, the accent border and underlines still change, instantly); the
  island navigates without a transition and any view-transition animation is
  zeroed; the pulse is removed; every animation and transition
  collapses to one near-instant iteration. In JS, `useReducedMotion` drops
  offsets (dialogs only fade).
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
  `app/opengraph-image.tsx` runs on the edge runtime for that reason; keep it there.
  It also needs static font files, so the card still renders in Recursive
  (`app/fonts/`), not Anybody/Figtree.

## Git

Commits use `type(scope): summary` with lowercase types — `feat`, `fix`, `refactor`,
`style`, `chore`, `perf`, `docs`, plus project-specific `content:`, `data:`,
`assets:`, `resume:`. Work happens directly on `main`; every push to `main`
deploys to production on Vercel. For a large redesign, build on a branch (as
the Portfolio 4.0 redesign was built on `v4`, merged on 2026-10-05, and its
amber refinement on `v4.1`) so each
push gets a Vercel preview URL, and merge it only with Christian's sign-off on
the preview.
