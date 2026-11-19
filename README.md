# Christian Raro: portfolio

The source for Christian Raro's personal portfolio site.

The site presents his work as an editorial storefront: projects are products,
set in monochrome (ghost white, grays, black) with two typefaces and iOS-style
components.

- **Content:** every project, case study, testimonial, role and photo, in
  `lib/data.ts`, `lib/case-studies.ts` and `public/assets/`.
- **Pages:** the homepage, the `/projects` catalogue and a page per project.
- **SEO plumbing:** sitemap, robots.txt, JSON-LD, `/llms.txt` and page metadata,
  all generated from the content.
- **Back end:** a Groq-backed chat endpoint (`/api/chat`), a Resend-backed
  contact endpoint (`/api/contact`) and a GitHub activity fetcher
  (`lib/github.ts`). Each works, in a degraded but honest way, with no
  environment variables set.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Before committing, all four must pass:

```bash
npm run type-check
```

```bash
npm run lint
```

```bash
npm test
```

```bash
npm run build
```

Environment variables are optional; see `.env.example`.

## Where things are

`CLAUDE.md` lists every module, the design system and the rules for changing content. `PRODUCT.md`
describes the audience and positioning.
