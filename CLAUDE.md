# Project Instructions

Personal portfolio site for Christian Raro: a homepage, a `/projects` catalogue
and a page per project, two API routes, no database. All content is static data.

The design (since 2026-11-14) is an **editorial storefront in monochrome with
iOS-style parts**: projects are presented as products. Earlier designs (Lobby
Rack and others) were removed; do not bring anything back from them.

## Tech Stack

Next.js 14 (App Router) · React 18 · TypeScript 5 (strict) · Tailwind CSS 3 ·
`motion` (`motion/react`, client components only) · lucide-react ·
Instrument Serif + Inter via `next/font/google` · Groq (chat) · Resend (email) ·
GitHub GraphQL (activity section)

`next-themes` is still in `package.json` and unused: there is one light theme.

## Build & Run

- Dev: `npm run dev`
- Build: `npm run build`
- Types: `npm run type-check`
- Lint: `npm run lint`
- Tests: `npm test` (Vitest: content tests, `tests/design/system.test.ts`, and markup tests in `tests/components/`)
- URL liveness: `npm run verify:urls` (manual; hits the live internet, never in CI)
- Thumbnails: `npm run capture [id ...]`; full-page shots: `npm run capture -- --full [id ...]`
- Embeddability: `npm run check:embeds` (manual; hits the live internet, never in CI)
- Resume PDF: `npm run resume`

`capture` and `resume` drive system Chrome/Edge via hardcoded Windows paths (`puppeteer-core`).

CI (`.github/workflows/ci.yml`) runs type-check, lint, test, and build on push and
PR to `main`. Run all four locally before committing; they must pass with no
environment variables set.

## Project Structure

```
app/layout.tsx       Fonts, metadata, JSON-LD, the bar, the footer and the phone tab bar
app/page.tsx         Homepage: hero, featured, client-work, editorials, field-notes, experience, github-activity, stack, contact
app/projects/        /projects (the whole catalogue; ?band= opens a segment) and /projects/[slug] (a product page; flagships continue into their case study)
app/not-found.tsx    The 404
app/globals.css      Tokens, type scale, component classes (.btn, .card, .capsule, .group-list, .shelf, .product) and all CSS motion
app/robots.ts, app/sitemap.ts, app/llms.txt/, app/llms-full.txt/   SEO and AI-readable files, built from the content
app/api/chat/        Groq-backed chat endpoint (no widget calls it yet)
app/api/contact/     Resend-backed contact endpoint, called by components/sections/contact.tsx
components/site-nav.tsx, tab-bar.tsx, site-footer.tsx, json-ld.tsx
components/sections/ The homepage sections named above
components/ui/       product-card, catalogue (client: segmented filter over a grid), status-pill, section-header
lib/data.ts          Single source of truth for ALL portfolio content, including section copy
lib/case-studies.ts  Flagship case studies, keyed by project slug
lib/catalog.ts       toCardItem(): a project as the plain props a card needs (server only)
lib/project-page.ts  Server-only helpers: projectHref, canLinkLive, screenshotsFor, fullShotFor, … (reads the filesystem; never import from a client component)
lib/chat-context.ts, lib/structured-data.ts, lib/llms.ts, lib/site-metadata.ts   Built from the content
lib/github.ts        Contribution calendar and recent public repos from GitHub's GraphQL API (server only, hourly revalidate); null without GITHUB_TOKEN
lib/board.ts, lib/display-status.ts, lib/proof.ts, lib/field-log.ts, lib/dates.ts, lib/timeline.ts   Pure content helpers, all tested
tests/               content/, design/system.test.ts, components/, helpers/
scripts/             capture-screenshots, check-embeds, verify-urls, build-resume
public/assets/       images/{about,gallery,projects}, resume/
PRODUCT.md           Audience, positioning and evidence. Read it before design work.
```

There is no logo (the wordmark is the name set in the serif), no favicon and no
designed social card yet. The chat endpoint has no widget yet.

## Design system

`tests/design/system.test.ts` enforces the palette, the font count and the
motion gates.

- **Palette: ghost white, snow, grays, black. Nothing else**, including for
  status. Tokens are CSS variables in `app/globals.css`, exposed to Tailwind as
  `ghost` (page), `snow` (cards), `ink` (text, primary buttons, the dark panels),
  `gray-text` (secondary text, AA on every ground), `gray-mid` (glyphs, large
  numerals, secondary text on `ink`), `gray-line` (hairlines), `gray-fill` (fills,
  image wells). Never write a hex in a component.
- **Two typefaces only.** Instrument Serif (`font-display`) for headings, card
  names, quotes and numerals; it has one weight, so size and tracking do the
  work, and italic is the only emphasis. Inter (`font-sans`) for everything
  else. Use the scale classes: `.display-xl`, `.display-lg`, `.display-md`,
  `.display-num`, `.label`, `.lede`. Labels are sentence case, never tracked caps.
- **iOS-style parts:** pill buttons that sink when pressed (`.btn` with
  `.btn-primary`, `.btn-secondary` or `.btn-quiet`), capsules (`.capsule`),
  large-radius cards (`.card`), grouped lists with inset hairlines
  (`.group-list`), a segmented control (`components/ui/catalogue.tsx`), a frosted
  sticky bar (`.material`), a floating tab bar on phones, and shelves that page
  sideways (`.shelf`).
- **Status is never colour:** render it with `StatusPill`, a glyph shape beside
  its label.
- One grid: `mx-auto max-w-6xl px-5 sm:px-8`. Sections open with `SectionHeader`.
- Projects are shown with `ProductCard` from a `CardItem` (`toCardItem`). Never
  fake a screenshot for an auth-gated or internal project; the card prints why
  there is none.

## Motion

- **CSS first, and progressive.** Load entrances (`.mask`, `.enter`,
  `.enter-figure`, `.enter-pop`, staggered by `--i`) and scroll reveals
  (`.reveal`, `animation-timeline: view()`) live inside
  `prefers-reduced-motion: no-preference` (and `@supports` for the scroll
  ones). Outside the gates nothing is hidden, so the server HTML is the
  finished page. Timing comes from `--dur-*`, `--ease` and `--stagger`.
- **Hover and press:** `.product` lifts and its image breathes in, a round cue
  appears; `.nudge` arrows lean; `.underline-draw` draws; buttons sink.
- **`motion/react` only in client components**, for what CSS cannot do: the
  segmented control's sliding thumb and the catalogue's re-layout
  (`catalogue.tsx`), and the contact form's status (`contact.tsx`). Always pass
  `initial={false}` to `AnimatePresence` or guard with `useReducedMotion`, so
  nothing renders hidden on the server.
- Nothing loops or runs for more than a moment. No marquees, count-ups or
  autoplay.
- Client components today: `components/ui/catalogue.tsx` and
  `components/sections/contact.tsx`. Keep everything else on the server.

## Hero portrait

`heroPortraits` in `lib/data.ts` lists four portraits, each with the original
(`full`) and a background-removed `cutout` in
`public/assets/images/about/cutouts/`. `heroContent.portrait` is `'stairs'`: the
leather-jacket photo, Christian's choice. Its source is small (the cut-out is
338 by 897 pixels), so it needs a larger original or real upscaling before it is
used large. The cut-outs were made with rembg (`isnet-general-use`). Until a new
social card exists, `OG_IMAGE` in `lib/site-metadata.ts` is this portrait.

## Content Changes

Never hardcode portfolio content in components. Add or edit the typed arrays in
`lib/data.ts` and add the matching interface in `types/index.ts` if it's new.

`lib/structured-data.ts` (JSON-LD), `app/sitemap.ts`, `lib/llms.ts` and
`lib/chat-context.ts` are all built from `lib/data.ts` and `lib/case-studies.ts`.
Adding a project reaches all of them automatically; nothing there needs
hand-editing. Do not reintroduce hand-written portfolio prose into
`app/api/chat/route.ts`.

In `lib/case-studies.ts`, a number from a client's business goes in `metrics`
with `clientApproved: true`, and only after Christian confirms the client agreed.

Projects carry a `band` (`Products`, `Custom systems`, `Applications`, `Sites`)
and a `status` (`live`, `ua-gated`, `early-access`, `auth-gated`, `internal`,
`staging`). The proof points in `heroContent` make factual claims that
`tests/content/proof-band.test.ts` checks against the data.

Never fake a screenshot for an auth-gated or internal project; its interior
needs the client's clearance.

**No private contact details** in the chat prompt, the JSON-LD or the llms
files: public email and social links only, the address is the public locality
(Naga City, Camarines Sur, Philippines), never a street, and no telephone field
anywhere.

## Code Style

- Named exports for components; no default exports (Next's page and layout files excepted).
- Files: kebab-case. Components: PascalCase. No semicolons. Single quotes.
- Imports use the `@/` alias, never `../../`.
- Merge Tailwind classes with `cn()` from `@/lib/utils`.

## API Routes

Everything must keep working with no environment variables set. Check for the
key and return a degraded-but-honest response when it's missing.

- `/api/chat`: no `GROQ_API_KEY` → canned offline reply.
- `/api/contact`: no `RESEND_API_KEY` → `{ delivered: false, fallback: 'mailto' }`.
- `lib/github.ts`: no `GITHUB_TOKEN` → nothing is fetched, returns null.

## Environment

All optional; see `.env.example`. Real keys live in `.env.local` (gitignored).
`GROQ_API_KEY`, `GROQ_MODEL`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`,
`NEXT_PUBLIC_SITE_URL`, `GOOGLE_SITE_VERIFICATION`, `GITHUB_TOKEN` (server-only).

Things that have already bitten:

- `RESEND_API_KEY` may be set in the developer's shell, so a stray
  `/api/contact` POST sends a real email. Run local servers keyless:
  `RESEND_API_KEY= GROQ_API_KEY= npx next start -p 3100`.
- `CONTACT_FROM_EMAIL` needs a domain verified in Resend; a gmail.com address
  fails with 403.
- Groq retires model ids; a retired one 404s at request time. Set `GROQ_MODEL`
  rather than editing the route.
- Deleting a route leaves a stale `.next/types/app/<route>/page.ts` behind and
  `npm run type-check` fails on it. Clear `.next` and re-run.
- `next/og`'s Node build throws "Invalid URL" on Windows; a future social card
  should run on the edge runtime.

## Git

Commits use `type(scope): summary` with lowercase types (`feat`, `fix`,
`refactor`, `style`, `chore`, `perf`, `docs`, `content`, `data`, `assets`,
`resume`). Every push to `main` deploys to production on Vercel. The redesign
is built on a branch so each push gets a Vercel preview, and is merged only
with Christian's sign-off on the preview.
