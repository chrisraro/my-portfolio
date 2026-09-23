# Christian Raro — Portfolio

The portfolio of Christian Raro, a full-stack developer in Naga City,
Philippines. A homepage and a `/projects` index of 15 projects, two API routes,
and no database: every fact on the site is static data in
[`lib/data.ts`](lib/data.ts), and tests check the claims against it.

The design is **B3 Signal**: the work shown as an operations board of running
systems, each with an honest status, on warm graphite with sodium amber as the
only brand colour. [`DESIGN.md`](DESIGN.md) documents the system as built.
[`CLAUDE.md`](CLAUDE.md) holds the working rules for editing the codebase.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 (`strict`) |
| UI | React 18, server components by default |
| Styling | Tailwind CSS 3 over oklch colour tokens |
| Typeface | Recursive (one variable family, via `next/font`; its MONO axis is the monospace voice) |
| Theming | next-themes (dark by default, plus a light theme) |
| Motion | framer-motion 10 (chat, lightbox and toast fades only) |
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

## Project Structure

```
app/
  layout.tsx          Recursive, theme and toast providers, page chrome
  page.tsx            Homepage: hero, products, systems board, field log,
                      changelog, stack, contact
  projects/           /projects: every project, filterable by band (?band=)
  api/chat/           Groq-backed chat endpoint
  api/contact/        Resend-backed contact endpoint
  globals.css         Colour tokens (oklch) and shared utilities
  robots.ts, sitemap.ts
components/
  top-bar.tsx, footer.tsx, theme-provider.tsx
  sections/           One file per homepage section
  ui/                 Primitives: status-badge, board-row, systems-board,
                      board-filter, product-panel, proof-band, chat-widget,
                      toaster, image-lightbox
lib/
  data.ts             Single source of truth for all content, including headings
  chat-context.ts     Builds the chat assistant's system prompt from data.ts
  site-metadata.ts    Builds page metadata from heroContent
  board.ts, display-status.ts, proof.ts, field-log.ts, dates.ts, timeline.ts
                      Pure helpers, all tested
  utils.ts            cn(), extractDomain
types/index.ts        Shared interfaces
tests/                content/, design/, components/
scripts/              Screenshot capture, résumé PDF, URL check
public/assets/        images/{about,gallery,projects}, resume/
```

## Editing Content

All content lives in [`lib/data.ts`](lib/data.ts): `heroContent`,
`availability`, `resumeUrl`, `projects`, `paymentGateways`, `skills`,
`experience`, `education`, `recommendations`, `galleryContent`, `galleryImages`,
`sectionContent`, `projectsPageContent`, `socialLinks`, `contactInfo` and
`navigationItems`. Components never hardcode facts, headings or eyebrows. New
shapes get an interface in [`types/index.ts`](types/index.ts).

Each project carries a `band` (`Products`, `Custom systems`, `Applications` or
`Sites`) and a `status`. Several lines on the page are derived from the data
rather than typed: the hero's specialism line counts the Sites band and names
its sectors, and the proof band's claims are checked against the inventory. Change
the inventory and those lines change with it, or a test fails.

The chat assistant builds its whole system prompt from `lib/data.ts` through
[`lib/chat-context.ts`](lib/chat-context.ts), so a new project reaches it
automatically. Don't reintroduce hand-written portfolio prose in
`app/api/chat/route.ts`.

## Styling

Read [`DESIGN.md`](DESIGN.md) before UI work. The essentials:

- Colours are oklch tokens in [`app/globals.css`](app/globals.css) (`.dark` is
  the default theme, `:root` the light one), exposed as Tailwind keys in
  [`tailwind.config.js`](tailwind.config.js): `canvas`, `panel`, `ink`, `muted`,
  `muted-strong`, `line`, `line-strong`, `accent`, `on-accent`, `live`,
  `status-early`, `status-private`, `status-internal`. No raw hex, no `dark:`
  colour pairs.
- Amber (`accent`) is the only brand colour. Green (`live`) means a live system
  and nothing else.
- Status always renders through `StatusBadge`: a glyph shape plus a text label,
  never colour alone.
- One typeface, Recursive. `font-mono` is the same family with its MONO axis on,
  and every numeral is tabular.
- One grid: every section uses `mx-auto max-w-6xl px-5 sm:px-8`.

## Motion

Almost nothing moves. The live status dot pulses twice and stops, the chat's
typing dots run only while a reply loads, and the chat, lightbox and toasts fade
in and out. Reduced motion removes the pulse and the offsets. Content renders
visible from the server, with no entrance animation.

## Testing

`npm test` runs Vitest over three folders:

- [`tests/content/`](tests/content/) checks the facts the site claims against
  `lib/data.ts`: inventory, bands, the proof band, positioning, testimonials,
  dates and ordering.
- [`tests/design/`](tests/design/) checks design invariants: WCAG contrast of
  the tokens in both themes, no legacy tokens, green only on the live status,
  the client-component count and nav anchors.
- [`tests/components/`](tests/components/) renders components with
  `react-dom/server` and checks their markup.

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
