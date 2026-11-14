# Project Instructions

Personal portfolio site for Christian Raro. **The front end is a clean slate
(since 2026-11-14):** every page, component, style, the logo and the design
system were removed so the site can be redesigned from scratch. What remains is
the content, the SEO plumbing, the back end and a bare, unstyled skeleton of
pages that keeps the site building.

## Tech Stack

Next.js 14 (App Router) · React 18 · TypeScript 5 (strict) · Tailwind CSS 3
(defaults only, no tokens yet) · Groq (chat) · Resend (email) · GitHub GraphQL
(activity data)

`motion`, `next-themes`, `lucide-react`, `clsx` and `tailwind-merge` are still in
`package.json` from the old front end. Nothing imports the first three now; keep
or drop them when the new design is chosen.

## Build & Run

- Dev: `npm run dev`
- Build: `npm run build`
- Types: `npm run type-check`
- Lint: `npm run lint`
- Tests: `npm test` (Vitest: content tests and the JSON-LD component test)
- URL liveness: `npm run verify:urls` (manual; hits the live internet, never in CI)
- Thumbnails: `npm run capture [id ...]`; full-page shots: `npm run capture -- --full [id ...]`
- Embeddability: `npm run check:embeds` (manual; hits the live internet, never in CI)
- Resume PDF: `npm run resume`

`capture` and `resume` drive system Chrome/Edge via hardcoded Windows paths (`puppeteer-core`).

CI (`.github/workflows/ci.yml`) runs type-check, lint, test, and build on push and
PR to `main`. Run all four locally before committing; they must pass with no
environment variables set.

## What exists

```
app/layout.tsx       Bare layout: site metadata and JSON-LD only. No fonts, theme, header, footer or chat widget.
app/page.tsx         Bare homepage: name, title, lede and a plain list of every project
app/projects/        Bare /projects (plain lists per band, ?band= filters) and /projects/[slug] (plain project and case-study text, JSON-LD)
app/globals.css      Tailwind directives only
app/robots.ts, app/sitemap.ts, app/llms.txt/, app/llms-full.txt/   SEO and AI-readable files, built from the content
app/api/chat/        Groq-backed chat endpoint (no widget calls it yet)
app/api/contact/     Resend-backed contact endpoint (no form calls it yet)
components/json-ld.tsx  Renders a JSON-LD <script> from lib/structured-data.ts
lib/data.ts          Single source of truth for ALL portfolio content, including section copy
lib/case-studies.ts  Flagship case studies, keyed by project slug
lib/project-page.ts  Server-only helpers: projectHref, canLinkLive, fullShotFor, isEmbeddable, … (reads the filesystem; never import from a client component)
lib/embeddable.json  Which live sites allow framing, written by `npm run check:embeds`
lib/chat-context.ts  Builds the AI assistant's system prompt from the content
lib/structured-data.ts, lib/llms.ts, lib/site-metadata.ts   JSON-LD, llms files and page metadata, built from the content
lib/github.ts        Reads the contribution calendar and recent public repos from GitHub's GraphQL API (server only, hourly revalidate); null without GITHUB_TOKEN. Nothing renders it yet.
lib/board.ts, lib/display-status.ts, lib/proof.ts, lib/field-log.ts, lib/dates.ts, lib/timeline.ts   Pure content helpers, all tested
lib/utils.ts         cn(), extractDomain
types/index.ts       Every shared interface
tests/content/       Facts the content claims; tests/components/json-ld.test.tsx; tests/helpers/ (privacy guard, GitHub fixture)
scripts/             capture-screenshots, check-embeds, verify-urls, build-resume
public/assets/       images/{about,gallery,projects}, resume/
PRODUCT.md           Audience, positioning and evidence. Read it before design work.
```

There is no design system, no `DESIGN.md`, no logo, no icons, no fonts and no
social card. Do not reintroduce anything from the old designs (Lobby Rack, the
editorial hero) unless Christian asks for it.

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
