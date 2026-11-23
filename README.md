# Christian Raro — Portfolio

The portfolio of Christian Raro, a full-stack developer in Naga City,
Philippines. A homepage, a `/projects` map and list of 15 projects with a page
per project, `/services` with three service pages, `/about`, `/hire`, two API
routes, and no database: every fact on the site is static data in
[`lib/data.ts`](lib/data.ts) and [`lib/case-studies.ts`](lib/case-studies.ts),
and tests check the claims against it.

The design is **First Light** (Portfolio 6.0): Mount Isarog over the Naga plain
as a fixed pixel land behind every page, with first light rising behind the
summit as you scroll, fireflies, and a floating panel of liquid glass beside one
reading column of compact rows. The site opens at night; the morning theme is one
switch away. [`DESIGN.md`](DESIGN.md) documents the system as built.
[`CLAUDE.md`](CLAUDE.md) holds the working rules for editing the codebase.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 (`strict`) |
| UI | React 18, server components by default |
| Styling | Tailwind CSS 3 over oklch colour tokens |
| Typeface | Instrument Sans (one variable family, via `next/font`) |
| Theming | next-themes (night by default, plus a morning theme) |
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
| `npm run check:embeds` | Refresh which live sites allow framing (`lib/embeddable.json`). It hits the live internet, so it is manual-only |
| `npm run resume` | Rebuild the résumé PDF |
| `node scripts/build-scene.mjs` | Redraw the pixel land behind the site (`public/assets/scene/`); one-off, seeded, commit the result |
| `node scripts/build-ph-outline.mjs` | Rebuild the Philippines outline (`lib/ph-outline.ts`); one-off, Node 22.18+ |

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
  layout.tsx          Instrument Sans, theme and toast providers, the land,
                      the panel, page chrome
  page.tsx            Homepage, one column: intro, in development, where I've
                      worked, case studies, more work, where the work runs,
                      work with me, stack, plan the route
  projects/           /projects: every project as a map and rows, filtered
                      by band (?band=), the map panning to the band
  projects/[slug]/    One page per project: a trail journal for the four case
                      studies, a short page for the rest
  services/, about/, hire/  /services and its three pages, /about, /hire
  not-found.tsx       The 404, "No page here"
  api/chat/           Groq-backed chat endpoint
  api/contact/        Resend-backed contact endpoint
  globals.css         Colour, motion and layout tokens (oklch) and shared utilities
  og/[[...path]]/     One link-preview card per page (next/og, edge runtime)
  fonts/              Recursive Sans, the one static font the cards use
  robots.ts, sitemap.ts  sitemap.ts lists every route in lib/site-routes.ts
  llms.txt/, llms-full.txt/  AI-readable summaries (llmstxt.org), built by lib/llms.ts
components/
  site-legend.tsx     The floating glass panel (a bar below 1024px)
  scene.tsx           The land behind every page: Isarog, first light, fireflies
  footer.tsx, theme-provider.tsx, json-ld.tsx, brand-mark.tsx
  sections/           One file per homepage section: intro, now-building,
                      experience, work-list, work-with-me, stack-table,
                      plan-the-route
  map/                Map SVG: philippines-outline, pin, map-key (MapKey),
                      spot-height, place-map
  ui/                 Primitives: grid (SECTION), survey-plate, project-shot
                      (SHOT_ASPECT), project-row, status-badge, trail-link,
                      section-heading, page-intro, legend-filter, live-preview,
                      chat-widget, toaster, image-lightbox, view-transitions
  case-study/         The project page's parts (the trail journal)
lib/
  data.ts             Single source of truth for all content, including headings
  case-studies.ts     The four case studies
  site-routes.ts      Every page once: title, description, metaDescription,
                      card words; metadata, cards, JSON-LD, sitemap and AI files
                      read it
  chat-context.ts     Builds the chat assistant's system prompt from the content
  structured-data.ts  Builds each page's JSON-LD graph
  llms.ts             Builds /llms.txt and /llms-full.txt from the same content
  site-metadata.ts    Builds every page's metadata from its route
  og-linework.ts      The link-preview card's ridge, dawn and text column
  og-palette.ts       The night theme as hex for the cards
  geo.ts, map-pan.ts  The map projection, the /projects pan
  board.ts, display-status.ts, proof.ts, dates.ts, timeline.ts, places.ts, elevation.ts
                      Pure helpers, all tested
  utils.ts            cn() (tailwind-merge, extended with the type utilities), extractDomain
types/index.ts        Shared interfaces
tests/                content/, design/, components/, helpers/ (shared test helpers)
scripts/              Screenshot capture, résumé PDF, URL check, embeddability check,
                      the land (build-scene), the map outline (build-ph-outline)
public/assets/        images/{about,gallery,projects}, resume/, scene/ (the land's masks)
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

Each project carries a `band` (`Custom systems`, `Applications` or `Sites`) and
a `status`. Several lines on the page are derived from the data rather than
typed: the three counts under the intro (`elevationFigures()` in
`lib/elevation.ts`; shipped means neither staging nor in development) and the
map's places are counted from the inventory. Change the inventory and those
lines change with it, or a test fails. A project in development
(`status: 'in-development'`) gets the banner under the intro and does not count
as shipped.

The chat assistant builds its whole system prompt from `lib/data.ts` through
[`lib/chat-context.ts`](lib/chat-context.ts), so a new project reaches it
automatically. Don't reintroduce hand-written portfolio prose in
`app/api/chat/route.ts`.

## Styling

Read [`DESIGN.md`](DESIGN.md) before UI work. The essentials:

- Colours are oklch tokens in [`app/globals.css`](app/globals.css) (`:root` is
  the morning theme, `.dark` the night theme, which is the default), exposed as
  Tailwind keys in [`tailwind.config.js`](tailwind.config.js): `canvas`,
  `panel`, `ink`, `muted`, `muted-strong`, `line`, `line-strong`, `contour`,
  `trail`, `on-trail`, `field-border`, `live`, `status-early`,
  `status-private`, `status-internal`. There is no `accent` key. No raw hex, no
  `dark:` colour pairs. The land has its own tokens (`--land-far`,
  `--land-near`, `--land-lit`, `--dawn`, `--firefly`).
- Ember (`trail`) marks the primary action and the current position only: the
  primary button, the send button, the current page, the focus ring and the
  caret. Hover borders and selection are ink. Green (`live`) means a live
  system and nothing else.
- Glass (`.glass`) is the one material for what floats over the land, and it
  never sits on glass. It goes opaque under reduced transparency, more contrast
  and without `backdrop-filter`.
- Status always renders through `StatusBadge`: a glyph shape plus a text label,
  never colour alone.
- One typeface, Instrument Sans, in weights alone. Numerals are tabular. No
  serif, no mono.
- One grid: every section uses `SECTION` (`mx-auto w-full max-w-[49rem] px-5
  sm:px-8`); `/projects` and a project page use `SECTION_WIDE` (66rem). Every
  photo and screenshot sits on a `SurveyPlate` or in a row's thumbnail, and every
  screenshot frame uses `SHOT_ASPECT`.
- Section headings carry no eyebrow; the map's `MapKey` names its dot (town or
  city) and ring (region).

## Motion

Three verbs, CSS first: **rise** (the intro's three lines lift into place on
load; rows lift as they scroll in), **pan** (a `/projects` legend key glides the
map to the band, pins counter-scaling so the labels keep their size) and
**light** (the dawn behind the summit climbs as the page scrolls). The glass
panel's highlight follows the pointer and a lozenge glides between its links.
Project links morph the clicked thumbnail into the project page through view
transitions. The dawn is the one thing that follows the page's scroll, nothing
moves for more than five seconds, and reduced motion turns all of it off. Content
renders visible from the server: the rises are transform only.

## Testing

`npm test` runs Vitest over three folders:

- [`tests/content/`](tests/content/) checks the facts the site claims against
  `lib/data.ts`: inventory, bands, the proof counts, positioning, testimonials,
  dates and ordering, the route registry, the privacy guards, and
  `meta-descriptions` (every route's description 50-160 characters).
- [`tests/design/`](tests/design/) checks design invariants: WCAG contrast of
  the tokens in both themes, green only on the live status, ember's places, the
  link-preview cards' palette, the client-component count, the motion gates and
  tokens, and the one grid.
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
