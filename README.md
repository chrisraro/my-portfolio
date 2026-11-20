# Christian Raro — Portfolio

The portfolio of Christian Raro, a full-stack developer in Naga City,
Philippines. A homepage, a `/projects` map and list of 20 projects with a page
per project, `/services` with three service pages, `/about`, `/hire`, two API
routes, and no database: every fact on the site is static data in
[`lib/data.ts`](lib/data.ts) and [`lib/case-studies.ts`](lib/case-studies.ts),
and tests check the claims against it.

The design is the **Isarog Trail Map**: the work as a survey map you walk, one
red trail from a trailhead in Naga City, every project a waypoint at a place it
really served, on pale green-grey survey paper by day and dark field paper by
night. [`DESIGN.md`](DESIGN.md) documents the system as built.
[`CLAUDE.md`](CLAUDE.md) holds the working rules for editing the codebase.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 (`strict`) |
| UI | React 18, server components by default |
| Styling | Tailwind CSS 3 over oklch colour tokens |
| Typeface | Archivo (one variable family, `wdth` axis, via `next/font`) |
| Theming | next-themes (the day survey by default, plus a night theme) |
| Motion | CSS first; `motion` (`motion/react`, `LazyMotion`) for the dialogs, chat and toasts only |
| Icons | lucide-react |
| Chat | Groq via `groq-sdk` (model from `GROQ_MODEL`, default `openai/gpt-oss-120b`) |
| Email | Resend (REST API, no SDK) |
| Tests | Vitest |
| Scripts | puppeteer-core |

## Getting Started

Requires Node.js 20+.

```bash
npm install
cp .env.example .env.local   # optional; see Environment below
npm run dev
```

Open <http://localhost:3000>.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run type-check` | `tsc --noEmit` |
| `npm run lint` | ESLint (`next/core-web-vitals`) |
| `npm test` | Run the Vitest suite |
| `npm run test:watch` | Run the Vitest suite in watch mode |
| `npm run verify:urls` | Check every project's live URL still resolves. It hits the live internet, so it is manual-only and never runs in CI |
| `npm run capture [id...]` | Recapture project screenshots from the live sites |
| `npm run resume` | Rebuild the résumé PDF |

`capture` and `resume` drive a local Chrome/Edge install through
`puppeteer-core`, and resolve the browser from hardcoded Windows paths (see the
top of each script in [`scripts/`](scripts/)).

## Environment

Every variable is optional. The site builds and runs on a bare checkout, and
each feature degrades honestly instead of erroring. See
[`.env.example`](.env.example).

| Variable | Effect when unset |
|----------|-------------------|
| `GROQ_API_KEY` | The chat assistant replies with a canned offline message, and says it is offline |
| `GROQ_MODEL` | Defaults to `openai/gpt-oss-120b` |
| `RESEND_API_KEY` | The contact form opens the visitor's mail app (`mailto:`) instead |
| `CONTACT_FROM_EMAIL` | Defaults to Resend's shared test sender |
| `NEXT_PUBLIC_SITE_URL` | Defaults to `https://christian-digital-portfolio.vercel.app` for metadata |
| `GOOGLE_SITE_VERIFICATION` | Google Search Console verification meta tag is omitted |

## Project Structure

```
app/
  layout.tsx          Archivo, theme and toast providers, page chrome
  page.tsx            Homepage: trailhead, elevation strip, fork, field map,
                      own products, trail journals, plan the route
  projects/           /projects: every project as a map and a list, filtered
                      by band (?band=), the map panning to the band
  projects/[slug]/    One page per project: a trail journal for the six case
                      studies, a short page for the rest
  services/, about/, hire/  /services and its three pages, /about, /hire
  not-found.tsx       The 404, "Off the trail"
  api/chat/           Groq-backed chat endpoint
  api/contact/        Resend-backed contact endpoint
  globals.css         Colour, motion and layout tokens (oklch) and shared utilities
  og/[[...path]]/     One link-preview card per page (next/og, edge runtime)
  fonts/              Recursive Sans, the one static font the cards use
  robots.ts, sitemap.ts  sitemap.ts lists every route in lib/site-routes.ts
  llms.txt/, llms-full.txt/  AI-readable summaries (llmstxt.org), built by lib/llms.ts
components/
  site-legend.tsx, footer.tsx, theme-provider.tsx, json-ld.tsx
  sections/           One file per homepage section
  map/                Survey-map SVG: contour-field, trail-path, trail-segment,
                      philippines-outline, pin, map-key (MapKey), spot-height,
                      place-map
  ui/                 Primitives: grid (SECTION), survey-plate, project-shot
                      (SHOT_ASPECT), project-plate, status-badge, trail-link,
                      section-heading, page-intro, legend-filter, live-preview,
                      chat-widget, toaster, image-lightbox, view-transitions
  case-study/         The project page's parts (the trail journal)
lib/
  data.ts             Single source of truth for all content, including headings
  case-studies.ts     The six case studies
  site-routes.ts      Every page once: title, description, metaDescription,
                      card words; metadata, cards, JSON-LD, sitemap and AI files
                      read it
  chat-context.ts     Builds the chat assistant's system prompt from the content
  structured-data.ts  Builds each page's JSON-LD graph
  llms.ts             Builds /llms.txt and /llms-full.txt from the same content
  site-metadata.ts    Builds every page's metadata from its route
  og-linework.ts      The link-preview card's contours, trail and text column
  og-palette.ts       The day theme as hex for the cards
  contours.ts, geo.ts, map-pan.ts  Authored linework, the map projection, the /projects pan
  board.ts, display-status.ts, proof.ts, dates.ts, timeline.ts, places.ts, elevation.ts
                      Pure helpers, all tested
  utils.ts            cn() (tailwind-merge, extended with the type utilities), extractDomain
types/index.ts        Shared interfaces
tests/                content/, design/, components/, helpers/ (shared test helpers)
scripts/              Screenshot capture, résumé PDF, URL check, embeddability check
public/assets/        images/{about,gallery,projects}, resume/
```

## Editing Content

All content lives in [`lib/data.ts`](lib/data.ts): `heroContent`,
`availability`, `resumeUrl`, `projects`, `paymentGateways`, `skills`,
`experience`, `education`, `recommendations`, `galleryContent`, `galleryImages`,
`sectionContent`, `projectsPageContent`, `socialLinks`, `contactInfo`,
`navigationItems`, `services`, `servicePages`, `aboutPageContent`,
`hirePageContent` and the rest listed in `CLAUDE.md`. Components never hardcode
facts, headings or eyebrows. New shapes get an interface in [`types/index.ts`](types/index.ts).

The JSON-LD ([`lib/structured-data.ts`](lib/structured-data.ts)), the sitemap
and the AI files ([`lib/llms.ts`](lib/llms.ts), served at `/llms.txt` and
`/llms-full.txt`) are all built from `lib/data.ts` and `lib/case-studies.ts`,
so a new project reaches them the same way it reaches the chat assistant: no
hand-editing needed. A page whose description runs past a search snippet sets
`metaDescription` (at most 160 characters); only the metadata reads it, and
the AI files keep the long answer. Only public email and social links appear in any of
them, and the address is the public locality, never a street or a phone
number.

Each project carries a `band` (`Products`, `Custom systems`, `Applications` or
`Sites`) and a `status`. Several lines on the page are derived from the data
rather than typed: the elevation strip's counts (`elevationFigures()` in
`lib/elevation.ts`) and the field map's places are counted from the inventory. Change
the inventory and those lines change with it, or a test fails.

The chat assistant builds its whole system prompt from `lib/data.ts` through
[`lib/chat-context.ts`](lib/chat-context.ts), so a new project reaches it
automatically. Don't reintroduce hand-written portfolio prose in
`app/api/chat/route.ts`.

## Styling

Read [`DESIGN.md`](DESIGN.md) before UI work. The essentials:

- Colours are oklch tokens in [`app/globals.css`](app/globals.css) (`:root` is
  the day survey and the default, `.dark` the night survey), exposed as
  Tailwind keys in [`tailwind.config.js`](tailwind.config.js): `canvas`,
  `panel`, `ink`, `muted`, `muted-strong`, `line`, `line-strong`, `contour`,
  `trail`, `on-trail`, `field-border`, `live`, `status-early`,
  `status-private`, `status-internal`. There is no `accent` key. No raw hex, no
  `dark:` colour pairs.
- Trail red (`trail`) marks the primary action and the current position only:
  the primary button, the trail, the "you are here" marker, the current page,
  the focus ring and the caret. Hover borders and selection are ink. Green
  (`live`) means a live system and nothing else.
- Status always renders through `StatusBadge`: a glyph shape plus a text label,
  never colour alone.
- One typeface, Archivo, on its width axis through `font-stretch`: condensed
  uppercase for display and map labels, normal width for reading. Numerals are
  tabular. No serif, no mono.
- One grid: every section uses `SECTION` (`mx-auto max-w-6xl px-5 sm:px-8`).
  Every photo and screenshot sits on a `SurveyPlate`, and every screenshot
  frame uses `SHOT_ASPECT` (4:3 on a phone, 3:4 from 640px, 4:3 from 1024px).
- Section headings carry no eyebrow; the field map's `MapKey` names its dot
  (town or city) and ring (region).

## Motion

Three verbs, CSS first: **draw** (the trail draws out of the portrait on load,
and short segments draw between sections), **rise** (the headline rises line by
line on load in under two seconds; each plate rises its last 16px once as it
enters, `.plate-rise`), **pan** (a `/projects` legend key glides the map to the
band, pins counter-scaling so the labels keep their size). The hero contours
drift 8px toward the half a fine pointer rests on (`.trailhead-contours`).
Project links morph the clicked screenshot into the project page through view
transitions. Nothing follows the page's scroll, nothing moves for more than
five seconds, and reduced motion turns all of it off. Content renders visible
from the server: motion is transform and stroke only, never opacity.

## Testing

`npm test` runs Vitest over three folders:

- [`tests/content/`](tests/content/) checks the facts the site claims against
  `lib/data.ts`: inventory, bands, the proof counts, positioning, testimonials,
  dates and ordering, the route registry, the privacy guards, and
  `meta-descriptions` (every route's description 50-160 characters).
- [`tests/design/`](tests/design/) checks design invariants: WCAG contrast of
  the tokens in both themes, green only on the live status, trail red's
  places, the link-preview cards' palette, the client-component count, the
  motion gates, `s6-finish` (no retired tokens, classes or words; one display
  voice; these docs) and `s6-motion` (the line-by-line rise, the contour
  shift, plates that appear once).
- [`tests/components/`](tests/components/) renders components with
  `react-dom/server` and checks their markup.

[`tests/helpers/`](tests/helpers/) holds helpers shared across those folders,
such as the privacy guards every public surface's test runs.

There are no end-to-end tests. CI
([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs type-check, lint,
tests and build on every push and pull request to `main`, with no environment
variables set.

## Deployment

Deployed on Vercel: <https://christian-digital-portfolio.vercel.app>

Pushes to `main` deploy automatically. The two API routes need a Node runtime, so
a fully static export would disable the chat and the contact form.

Environment variables are set in the Vercel project settings, not in the repo. At
minimum set `NEXT_PUBLIC_SITE_URL` to the production origin so link previews
resolve against the right host, plus `GROQ_API_KEY` and `RESEND_API_KEY` to enable
the chat and the contact form.

Two things to know before the first deploy:

- `CONTACT_FROM_EMAIL` is the **sender** and must sit on a domain verified at
  <https://resend.com/domains>. A gmail.com address is rejected with a 403. Until a
  domain is verified, Resend's shared `onboarding@resend.dev` sender only delivers
  to the address that owns the Resend account, so messages from real visitors will
  not arrive.
- Groq retires models periodically, and a retired id fails at request time with a
  404. `GROQ_MODEL` overrides the default without a code change.

## License

MIT
