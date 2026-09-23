# Project Instructions

Personal portfolio site for Christian Raro: a homepage and a `/projects` index,
two API routes, no database — all content is static data.

## Tech Stack

Next.js 14 (App Router) · React 18 · TypeScript 5 (strict) · Tailwind CSS 3 ·
framer-motion 10 · next-themes · lucide-react · Groq (chat) · Resend (email)

## Build & Run

- Dev: `npm run dev`
- Build: `npm run build`
- Types: `npm run type-check`
- Lint: `npm run lint`
- Tests: `npm test` (Vitest: content, design and component-markup tests; no E2E)
- URL liveness: `npm run verify:urls` (manual; hits the live internet, never in CI)
- Thumbnails: `npm run capture [id ...]`
- Resume PDF: `npm run resume`

`capture` and `resume` drive system Chrome/Edge via hardcoded Windows paths (`puppeteer-core`).

## Testing

Tests live in `tests/` and run under Vitest. `tests/content/` asserts the facts the
site claims (inventory, bands, proof band, positioning, testimonials, ordering).
`tests/design/` asserts design invariants (token contrast, no legacy tokens, green
only on the live status, the social card's palette, client boundary, nav anchors). `tests/components/`
renders components with `react-dom/server` and checks their markup, plus source
guards for behaviour static markup cannot reach. There are no E2E tests.

CI (`.github/workflows/ci.yml`) runs type-check, lint, test, and build on push and
PR to `main`. Run all four locally before committing; they must pass with no
environment variables set.

## Project Structure

```
app/                 App Router: layout.tsx (font, providers, chrome), page.tsx (homepage), robots.ts, sitemap.ts
app/opengraph-image.tsx  Link-preview card rendered from heroContent (next/og); fonts in app/fonts/
app/api/chat/        Groq-backed chat endpoint
app/api/contact/     Resend-backed contact endpoint
app/projects/        Full project list page
components/          top-bar.tsx, footer.tsx, theme-provider.tsx
components/sections/ Homepage sections, in page order: hero, products, systems, field-log, changelog, stack, contact-console
components/ui/       Primitives: status-badge, board-row, systems-board, board-filter, product-panel, proof-band, chat-widget, toaster, image-lightbox
lib/data.ts          Single source of truth for ALL portfolio content, including section copy
lib/chat-context.ts  Builds the AI assistant's system prompt from lib/data.ts
lib/site-metadata.ts Builds page metadata from heroContent (preview image comes from opengraph-image.tsx)
lib/board.ts         Board grouping and the /projects ?band= parameter
lib/display-status.ts, lib/proof.ts, lib/field-log.ts, lib/dates.ts, lib/timeline.ts — pure helpers, all tested
lib/utils.ts         cn(), extractDomain
types/index.ts       Every shared interface — Project, Skill, ExperienceItem, …
tests/               content/, design/, components/ (Vitest)
scripts/             Puppeteer utilities (screenshots, resume PDF)
public/assets/       images/{about,gallery,projects}, resume/
```

## Content Changes

Never hardcode portfolio content in components. Add or edit the typed arrays in
`lib/data.ts` (`projects`, `skills`, `experience`, `education`, `recommendations`,
`galleryImages`, `socialLinks`, `contactInfo`, `navigationItems`, `heroContent`,
`availability`, `resumeUrl`, `sectionContent`, `projectsPageContent`,
`paymentGateways`, `galleryContent`) and add the matching interface in
`types/index.ts` if it's new.

What counts as content: facts about Christian and his work, and every section
heading and eyebrow — those live in `lib/data.ts`. Control and group labels
that belong to the interface itself ("Start a project", "View work", "All",
"Work" / "Education", form field labels) are UI chrome and may live in the
component.

`lib/chat-context.ts` derives the AI assistant's entire system prompt from
`lib/data.ts`. Adding a project reaches the chatbot automatically. Do not
reintroduce hand-written portfolio prose into `app/api/chat/route.ts` — that
duplicate existed once and drifted out of date.

Projects carry a `band` from a closed four-value vocabulary — `Products`,
`Custom systems`, `Applications`, `Sites` — and a `status` that tells Phase 3
whether a live preview is possible. The hero's proof band in `heroContent` makes
factual claims that `tests/content/proof-band.test.ts` checks against the data;
if you change the inventory, the band changes with it.

**Do not put private contact details in the chat prompt.** Public email and social
links only — no phone number, no home address. Rule 8 of the system prompt states
this; keep it that way.

## Code Style

- Named exports for components (`export function ProjectCard`) — no default exports.
- Files: kebab-case. Components: PascalCase. No semicolons. Single quotes.
- Imports use the `@/` alias (`@/lib/data`, `@/components/ui/reveal`), never `../../`.
- Merge Tailwind classes with `cn()` from `@/lib/utils`.
- Don't prefix a non-hook with `use` — `useCallback`-wrapped helpers named `useX`
  trip `react-hooks/rules-of-hooks`. Name them `applyX` / `handleX`.
- Eyebrows come from `lib/data.ts`. A literal one is braced, `{'// products'}` —
  a bare `// text` JSX child parses as a comment and fails lint.

## Styling

- Visual authority is `DESIGN.md` (B3 Signal, written from the built site), with
  the homepage's direction contract in `.impeccable/surfaces/app-page-tsx.md`.
  Read both before UI work.
- Colours are raw oklch `L C H` triplets in `app/globals.css` — `:root` is light,
  `.dark` is the default — one per line. `tests/design/contrast.test.ts` parses
  them and checks WCAG contrast in both themes; keep the format exact.
- Tailwind colour keys: `canvas` (page), `panel`, `ink`, `muted`, `muted-strong`,
  `line`, `line-strong`, `accent`, `on-accent`, `live`, `status-early`,
  `status-private`, `status-internal`. Never raw hex, never `dark:` colour pairs.
- **Green (`live`) means a live system and nothing else.** Brand and availability
  use `accent`, and so do the chat assistant's dots. `live` and `.live-pulse`
  appear only in `StatusBadge`; `tests/design/green-means-live.test.ts` enforces it.
- **Status is never colour alone.** Render it only through `StatusBadge`, which
  pairs a glyph shape with a text label.
- Type: one variable family, Recursive, via `next/font`. `font-sans` is its
  linear sans; `font-mono` is the same family with its MONO axis on. Never add a
  second typeface. Numerals use `tabular-nums`. Utilities: `.eyebrow`,
  `.text-fluid-h1`, `.text-fluid-h2`.
- One grid: every section uses `mx-auto max-w-6xl px-5 sm:px-8`.
- Section headings: `<p className="eyebrow">{sectionContent.x.eyebrow}</p>` then an
  `<h2 className="text-fluid-h2">`. Copy lives in `lib/data.ts`.
- The live pulse (`.live-pulse`) runs twice and stops, and is removed under
  reduced motion. No continuous animation anywhere (WCAG 2.2.2).

## Client/Server Boundary

Components are server components by default. Only these six are client
components: `components/top-bar.tsx` (theme toggle),
`components/sections/contact-console.tsx` (form), `components/ui/chat-widget.tsx`,
`components/ui/image-lightbox.tsx`, `components/ui/toaster.tsx` and
`components/theme-provider.tsx`. A server component may render a client one as a
child — `Hero` and `FieldLog` render `ImageLightbox` this way.
`tests/design/client-boundary.test.ts` keeps the count under 10; do not raise it.

## Animation

Almost nothing moves, and nothing moves for more than five seconds (WCAG 2.2.2).

- **Live pulse** (`.live-pulse` in `globals.css`): a ring around the live status
  dot that fades twice (2.4s each), then stops. Only `StatusBadge` uses it.
- **Chat typing dots** (`.typing-dot`): three dots fading in turn, mounted only
  while a reply loads.
- **Fades:** the chat, lightbox and toaster enter and exit with short
  framer-motion fades, each gated by `useReducedMotion`.
- **Reduced motion:** `globals.css` removes the pulse and collapses every
  animation and transition to one near-instant iteration; `useReducedMotion`
  drops the offsets in JS.

Server-rendered proof (Products, Systems) has no entrance animation and must be
visible in the server HTML; `tests/components/sections.test.tsx` forbids
`opacity:0` there. Two hydration lessons if you add motion: never use
`whileInView` for above-the-fold content, and never branch the element type on
reduced motion. No count-ups, parallax or scroll-linked motion.

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
`GROQ_API_KEY`, `GROQ_MODEL`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL`.

Five things that have already bitten:

- `RESEND_API_KEY` may also be set in the developer's shell environment, which
  overrides nothing but means a stray `/api/contact` POST sends a real email.
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

## Git

Commits use `type(scope): summary` with lowercase types — `feat`, `fix`, `refactor`,
`style`, `chore`, plus project-specific `content:`, `data:`, `assets:`, `resume:`.
Work normally happens directly on `main`. **Exception, until the Portfolio 4.0
redesign merges:** the redesign is built on a `v4` branch, where each push gets a
Vercel preview URL. Content fixes still land on `main` and are merged into `v4`.
Never merge `v4` into `main` without Christian's sign-off on the preview.
