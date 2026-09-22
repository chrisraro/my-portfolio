# Project Instructions

Personal portfolio site for Christian Raro. Single-page bento layout plus two
sub-pages, two API routes, no database — all content is static data.

## Tech Stack

Next.js 14 (App Router) · React 18 · TypeScript 5 (strict) · Tailwind CSS 3 ·
framer-motion 10 · next-themes · lucide-react + react-icons · Groq (chat) · Resend (email)

## Build & Run

- Dev: `npm run dev`
- Build: `npm run build`
- Types: `npm run type-check`
- Lint: `npm run lint`
- Tests: `npm test` (Vitest, content invariants only — no component or E2E tests)
- URL liveness: `npm run verify:urls` (manual; hits the live internet, never in CI)
- Thumbnails: `npm run capture [id ...]`
- Resume PDF: `npm run resume`

Both scripts drive system Chrome/Edge via hardcoded Windows paths (`puppeteer-core`).

## Testing

Content-invariant tests live in `tests/content/` and run under Vitest. They assert
the facts the site claims: the project inventory and its bands, the hero proof
band's counts, testimonial attachment, experience ordering, and that removed
content stays removed. There are no component or E2E tests.

CI (`.github/workflows/ci.yml`) runs type-check, lint, test, and build on push and
PR to `main`. Run all four locally before committing; they must pass with no
environment variables set.

## Project Structure

```
app/                 App Router: layout.tsx (fonts, providers, chrome), page.tsx (bento home)
app/api/chat/        Groq-backed chat endpoint
app/api/contact/     Resend-backed contact endpoint
app/projects/        Full project list page
components/sections/ Home page sections (hero, about, works, gallery, contact, …)
components/ui/       Reusable primitives (project-card, reveal, chat-widget, toaster, …)
lib/data.ts          Single source of truth for ALL portfolio content
lib/chat-context.ts  Builds the AI assistant's system prompt from lib/data.ts
lib/dates.ts         Parses human date ranges into sortable timestamps
lib/timeline.ts      Pure buildTimeline() the experience section renders
lib/utils.ts         cn(), formatDate, debounce, throttle, extractDomain
types/index.ts       Every shared interface — Project, Skill, ExperienceItem, …
tests/content/       Vitest content invariants
scripts/             Puppeteer utilities (screenshots, resume PDF)
public/assets/       images/{about,gallery,projects}, resume/
```

## Content Changes

Never hardcode portfolio content in components. Add or edit the typed arrays in
`lib/data.ts` (`projects`, `skills`, `experience`, `education`, `recommendations`,
`galleryImages`, `achievements`, `socialLinks`, `contactInfo`, `navigationItems`)
and add the matching interface in `types/index.ts` if it's new.

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
- Eyebrow labels read `{'// about'}`, braced — a bare `// text` JSX child parses
  as a comment and fails lint.

## Styling

- Colors are oklch CSS variables in `app/globals.css` (`:root` + `.dark`), exposed
  as Tailwind tokens in `tailwind.config.js`. Use `bg-background`, `text-muted-foreground`,
  `border-border` — never raw hex or `dark:` color pairs.
- Dark mode is class-based via next-themes; both themes must be defined as variables.
- Shared utilities: `.eyebrow`, `.text-fluid-h1`, `.text-fluid-h2`, `.font-display` (Fraunces).
- Section headings follow: `<p className="eyebrow">{'// label'}</p>` + `font-display` `<h2>`.

## Client/Server Boundary

Almost everything is `'use client'` because of framer-motion and hooks. Only
`app/layout.tsx` and `components/footer.tsx` are server components —
`app/projects/page.tsx` is a client component; it filters by band with `useState`.
Add `'use client'` to any component using motion, state, or `next-themes`.

## Animation

Use the `Reveal` primitive and `staggerContainer`/`staggerItem` variants from
`@/components/ui/reveal` rather than new one-off motion setups. `Reveal` animates on
mount deliberately — read its doc comment before changing it; `whileInView` and
branching the element type on reduced motion both caused real hydration bugs.
Respect `prefers-reduced-motion` (globals.css handles CSS; use `useReducedMotion` in JS).

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

Four things that have already bitten:

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

## Git

Commits use `type(scope): summary` with lowercase types — `feat`, `fix`, `refactor`,
`style`, `chore`, plus project-specific `content:`, `data:`, `assets:`, `resume:`.
Work normally happens directly on `main`. **Exception, until the Portfolio 4.0
redesign merges:** the redesign is built on a `v4` branch, where each push gets a
Vercel preview URL. Content fixes still land on `main` and are merged into `v4`.
Never merge `v4` into `main` without Christian's sign-off on the preview.
