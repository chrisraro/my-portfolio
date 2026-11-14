# Christian Raro: portfolio

The source for Christian Raro's personal portfolio site.

**The front end is a clean slate.** The previous designs were removed so the
site can be redesigned from scratch. The repository currently holds:

- **Content:** every project, case study, testimonial, role and photo, in
  `lib/data.ts`, `lib/case-studies.ts` and `public/assets/`.
- **SEO plumbing:** sitemap, robots.txt, JSON-LD, `/llms.txt` and page metadata,
  all generated from the content.
- **Back end:** a Groq-backed chat endpoint (`/api/chat`), a Resend-backed
  contact endpoint (`/api/contact`) and a GitHub activity fetcher
  (`lib/github.ts`). Each works, in a degraded but honest way, with no
  environment variables set.
- **A bare skeleton:** unstyled pages that list the content, so the site builds
  and every project page stays reachable while the new design is made.

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

`CLAUDE.md` lists every module and the rules for changing content. `PRODUCT.md`
describes the audience and positioning.
