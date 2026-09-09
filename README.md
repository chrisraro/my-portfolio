# Christian Raro — Portfolio

A personal portfolio site built with Next.js 14 (App Router), TypeScript, and
Tailwind CSS. Single bento-grid home page, two sub-pages, and two API routes.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 (`strict`) |
| UI | React 18 |
| Styling | Tailwind CSS 3 + oklch CSS variables |
| Animation | Framer Motion 10 |
| Theming | next-themes (class-based dark mode) |
| Fonts | Plus Jakarta Sans (body) + Fraunces (display), via `next/font` |
| Icons | lucide-react, react-icons |
| Chat | Groq (`llama-3.3-70b-versatile`) |
| Email | Resend (REST API, no SDK) |
| Scripts | puppeteer-core |

## Getting Started

Requires Node.js 20+.

```bash
npm install
cp .env.example .env.local   # optional — see Environment below
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
| `npm test` | Run the content test suite (Vitest) |
| `npm run test:watch` | Run the content test suite in watch mode |
| `npm run capture [id...]` | Recapture project thumbnails from live sites |
| `npm run resume` | Rebuild the ATS resume PDF |
| `npm run verify:urls` | Check every project's live URL still resolves — hits the live internet, manual-only, not run in CI |

`capture` and `resume` drive a local Chrome/Edge install through
`puppeteer-core` and currently resolve the browser from hardcoded Windows paths
(see the top of each script in [`scripts/`](scripts/)).

## Environment

Every variable is optional — the site builds and runs on a bare checkout, and
each feature degrades instead of erroring. See [`.env.example`](.env.example).

| Variable | Effect when unset |
|----------|-------------------|
| `GROQ_API_KEY` | Chat widget replies with a canned offline message |
| `GROQ_MODEL` | Defaults to `openai/gpt-oss-120b` |
| `RESEND_API_KEY` | Contact form falls back to a `mailto:` link |
| `CONTACT_FROM_EMAIL` | Defaults to Resend's shared test sender |
| `NEXT_PUBLIC_SITE_URL` | Defaults to `https://christian-digital-portfolio.vercel.app` for OG metadata |

## Project Structure

```
app/
  layout.tsx          Fonts, theme + toast providers, page chrome
  page.tsx            Bento-grid home page composition
  api/chat/           Groq-backed chat endpoint
  api/contact/        Resend-backed contact endpoint
  projects/           Full project list
  globals.css         Design tokens (oklch) + shared utilities
components/
  sections/           One file per home page section
  ui/                 Reusable primitives (Reveal, ProjectCard, ChatWidget, ...)
lib/
  data.ts             Single source of truth for all portfolio content
  utils.ts            cn(), formatDate, debounce, throttle, extractDomain
types/index.ts        Shared interfaces
scripts/              Screenshot capture + resume PDF generation
public/assets/        images/{about,gallery,projects}, resume/
```

## Editing Content

All content lives in [`lib/data.ts`](lib/data.ts) — `projects`, `skills`,
`experience`, `education`, `recommendations`, `galleryImages`, `achievements`,
`socialLinks`, `contactInfo`, `navigationItems`. Components never hardcode copy.
New shapes get an interface in [`types/index.ts`](types/index.ts).

The chat assistant builds its system prompt from `lib/data.ts` at module load,
via [`lib/chat-context.ts`](lib/chat-context.ts), so new projects reach it
automatically. There is no second, hand-written copy of portfolio facts to keep
in sync — don't reintroduce one in `app/api/chat/route.ts`.

### Styling

Colors are oklch CSS variables defined for both themes in
[`app/globals.css`](app/globals.css) and exposed as Tailwind tokens in
[`tailwind.config.js`](tailwind.config.js). Use `bg-background`,
`text-muted-foreground`, `border-border` — not raw hex or `dark:` color pairs.

### Animation

Use the `Reveal` primitive and `staggerContainer` / `staggerItem` variants from
[`components/ui/reveal.tsx`](components/ui/reveal.tsx) rather than new one-off
motion setups. Its doc comment records two hydration bugs worth not repeating.

## Testing

There is no unit/E2E test suite, but [`tests/content/`](tests/content/) holds
84 content-integrity tests across 11 files (Vitest) that guard the data in
`lib/data.ts` against drift — taxonomy, dates, dead routes, and the like. CI
([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs type-check, lint,
tests, and build on every push and pull request to `main`.

## Deployment

Deployed on Vercel: <https://christian-digital-portfolio.vercel.app>

Pushes to `main` deploy automatically. The two API routes need a Node runtime, so
a fully static export would disable the chat widget and the contact form.

Environment variables are set in the Vercel project settings, not in the repo. At
minimum set `NEXT_PUBLIC_SITE_URL` to the production origin so Open Graph tags
resolve against the right host, plus `GROQ_API_KEY` and `RESEND_API_KEY` to enable
the chat widget and contact form in production.

Two gotchas worth knowing before the first deploy:

- `CONTACT_FROM_EMAIL` is the **sender** and must sit on a domain verified at
  <https://resend.com/domains>. A gmail.com address is rejected with a 403. Until a
  domain is verified, Resend's shared `onboarding@resend.dev` sender only delivers
  to the address that owns the Resend account — so messages from real visitors will
  not arrive.
- Groq retires models periodically, and a retired id fails at request time with a
  404 (the chat widget then shows its generic error). `GROQ_MODEL` overrides the
  default without a code change.

## License

MIT
