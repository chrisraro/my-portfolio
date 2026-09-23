# Phase 5 — SEO and AIEO

Date: 2026-09-23 · Branch: `v4` · Status: implemented on v4

Make the site legible to search engines and AI tools, derived entirely from
`lib/data.ts` and `lib/case-studies.ts`, with no hand-copied portfolio prose.

## 1. Decisions

| # | Decision | Choice |
|---|---|---|
| D1 | Home address | `SITE_URL` stays `NEXT_PUBLIC_SITE_URL` with the fallback `https://christian-digital-portfolio.vercel.app`. Every absolute URL in this phase comes from `SITE_URL`. |
| D2 | Identity | **Person + ProfessionalService**, linked by `@id`. No street address, no phone (Rule 8 of the chat prompt and CLAUDE.md). `areaServed`: Naga City and the Philippines. |
| D3 | AI files | **`/llms.txt` + `/llms-full.txt`**, generated at build time. AI crawlers stay allowed. |
| D4 | Structured-data approach | **Pure builder functions** in `lib/structured-data.ts`, rendered by one server component. No new dependency. |

## 2. Content source change

The chat prompt's hand-written SERVICES OFFERED block moves to `lib/data.ts`
as `services: string[]` (the same five lines). `lib/chat-context.ts`, the
ProfessionalService builder and `llms.txt` all read it. The CLAUDE.md note that
SERVICES is deliberately hand-written in chat-context is updated.

## 3. Pieces

**Sitemap** (`app/sitemap.ts`): `/` (priority 1), `/projects` (0.8), every
`/projects/<slug>` (flagships 0.7, short pages 0.5), `changeFrequency`
monthly. 17 URLs, absolute, from `SITE_URL`.

**Canonical for filters** (`app/projects/page.tsx`): `generateMetadata` adds
`alternates: { canonical: '/projects' }` for every `?band=` value.

**Structured data** (`lib/structured-data.ts`, pure, tested):
- `personSchema()` → `Person` with `@id: SITE_URL/#person`, `name`, `jobTitle`
  (heroContent.title), `description` (heroContent.lede), `url`, `email`
  (contactInfo.email, the public one), `address` as `PostalAddress {
  addressLocality: 'Naga City', addressRegion: 'Camarines Sur', addressCountry:
  'PH' }` (locality only, never a street), `knowsAbout` (skill names), `sameAs`
  (public social links, excluding mailto), `image` (the site's OG image URL).
- `serviceSchema()` → `ProfessionalService` with `@id: SITE_URL/#service`,
  `name` built from heroContent (name + title), `url`, `email`, `areaServed`
  [Naga City, Philippines], `founder: { @id person }`, `hasOfferCatalog`
  listing `services` as `Offer` → `Service` names. No `telephone`, no
  `streetAddress`.
- `websiteSchema()` → `WebSite` with `@id: SITE_URL/#website`, `url`, `name`,
  `publisher: { @id person }`.
- `breadcrumbSchema(project)` → `BreadcrumbList`: Home › Projects › title.
- `caseStudySchema(project, study)` → `CreativeWork` with `@id:
  SITE_URL/projects/<slug>#work`, `name`, `description` (study.brief[0]),
  `abstract` (study.outcome joined), `keywords` (stack names), `creator: { @id
  person }`, `url` (the project page), `sameAs` (links.live when
  `canLinkLive`). No `dateCreated` (dates are human ranges).

`components/json-ld.tsx`: a server component rendering `<script
type="application/ld+json">` with `JSON.stringify(data)` escaped so `</script>`
cannot break out (replace `<` with the `\u003c` escape). The layout renders person +
service + website; each project page renders the breadcrumb, plus the
case-study schema for flagships. Not a client component.

**AI files** (`lib/llms.ts`, pure, tested; route handlers
`app/llms.txt/route.ts` and `app/llms-full.txt/route.ts` with `export const
dynamic = 'force-static'` and `Content-Type: text/plain; charset=utf-8`):
- `llms.txt` (llmstxt.org format): `# Christian Raro`, a `>` summary line
  (title + specialism), a short paragraph (lede, location, availability),
  `## Services` (the `services` list), `## Case studies` (each flagship as
  `- [Title](url): summary`), `## Projects` (every other project the same way),
  `## Contact` (public email, social links), and `## Optional` linking
  `/llms-full.txt`.
- `llms-full.txt`: the same header, then every project (title, band, status,
  summary, description, stack, live URL where `canLinkLive`) and, for
  flagships, the full case study (role, brief, built, decisions, stack,
  outcome, approved metrics), plus experience and education.

**Search Console** (`lib/site-metadata.ts`): when `GOOGLE_SITE_VERIFICATION`
is set, `buildSiteMetadata` adds `verification: { google: value }`. Unset →
nothing. Added to `.env.example`.

**robots.ts**: unchanged (it already allows everything but `/api/` and names
the sitemap).

## 4. Testing

- `tests/content/structured-data.test.ts`: each builder's `@type`, `@id`s and
  cross-references; `sameAs` has no mailto; no builder output contains a phone
  number, a `streetAddress`/`telephone` field, or an email other than
  `contactInfo.email`.
- `tests/content/llms.test.ts`: llms.txt starts with `# `, has a `>` line,
  links every project page URL exactly once, links `/llms-full.txt`;
  llms-full.txt contains every case study's role and every decision's `over`;
  neither contains a phone number or a private email; no em-dash in either.
- `tests/content/sitemap.test.ts`: exactly 17 URLs, all absolute on
  `SITE_URL`, every project slug present once.
- `tests/components/json-ld.test.tsx`: rendered JSON-LD parses with
  `JSON.parse`, and a value containing `</script>` is escaped.
- Project page test: a flagship renders BreadcrumbList and CreativeWork
  JSON-LD; a short page renders only BreadcrumbList.
- `/projects?band=Sites` metadata has canonical `/projects`.
- Existing guards hold (client boundary, contrast, green-means-live).
- Manual after deploy: Google Rich Results Test and validator.schema.org on `/`
  and one flagship; fetch `/llms.txt` and `/sitemap.xml` on the preview.

## 5. Out of scope

A custom domain; a blog or new content types; paid SEO tools; `hreflang`;
per-page OG images (the site card stays); FAQ schema (no FAQ content exists).
