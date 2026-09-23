# Phase 3 — Case studies

Date: 2026-09-23 · Branch: `v4` · Status: approved in brainstorming, awaiting spec review

Phase 2 split case-study research (Phase 3) from the `/projects/[slug]` pages
(Phase 4). This spec merges them: researched content with nowhere to render is
as useless as pages with nothing to say. SEO/AIEO stays a later phase.

## 1. Decisions

| # | Decision | Choice |
|---|---|---|
| D1 | Scope | **Tiered.** All 15 projects get `/projects/[slug]`. Five flagships get a full researched case study; the other ten get a short page built only from data they already have. |
| D2 | Flagships | By slug (the URL segment; several differ from `id`): `el-nido-guide-ph`, `beachbus-palawan` (its story includes `beachbus-nfc-card-system`), `acad1-review-center`, `aman-group-web-app`, `giya`. |
| D3 | Client numbers | **Only with the client's OK.** A number is published only when Christian confirms the client agreed. Without an OK, the case study describes what was built, not results. |
| D4 | Previews | **Fresh screenshots**, desktop and mobile, plus an "Open live site" link. No iframes. |
| D5 | Content home | **`lib/case-studies.ts`**, a typed module keyed by project slug, beside `lib/data.ts`. CLAUDE.md is amended to name both as content sources. |

## 2. Research pipeline

1. **Evidence.** One research subagent per flagship, run in parallel. Sources:
   - the live site, crawled page by page, including the booking flow **up to but
     never through payment**;
   - the WordPress side through the connected Novamira MCP servers
     (`live-elnidogu`, `beachbus-ph`; ACAD1's server needs sign-in, so ACAD1
     leans on the crawl and on Christian), **read-only**: plugins, post types,
     the WooCommerce and booking configuration, and aggregate order counts;
   - repository history where one exists (Aman, Giya);
   - the existing entry in `lib/data.ts`.
2. **Dossier.** Each agent writes `docs/case-studies/research/<slug>.md`
   (gitignored — add `docs/case-studies/research/` to `.gitignore` before the
   first dossier — because it may hold client numbers). It has three parts:
   - *Evidence:* every fact with its source (URL, MCP ability, commit).
   - *Draft:* the five body sections (§3), written only from the evidence.
   - *Questions for Christian:* the brief, what was hard, what changed for the
     client, and each candidate number phrased as a yes/no ("May I say …?").
3. **Christian's pass.** He answers in chat, one project at a time, about five
   minutes each. Anything he cannot confirm is cut.
4. **Encoding.** Draft plus answers become the entry in `lib/case-studies.ts`.

**Guardrails.** Novamira calls are read-only: no writes, no orders, no emails,
no settings changes. No crawl submits a checkout or a form. No sentence reaches
a draft without a source. Never POST to `/api/contact`.

## 3. Data model

In `types/index.ts`:

```ts
export interface CaseStudyMetric {
  value: string          // "1,200+"
  label: string          // "bookings since launch"
  clientApproved: true   // the literal type: an unapproved number cannot compile
}

export interface CaseStudyDecision {
  chose: string
  over: string
  because: string
}

export interface CaseStudy {
  slug: string                        // must equal a Project.slug
  role: string                        // "Sole developer — design, build, payments"
  brief: string[]                     // paragraphs
  built: string[]                     // what I built
  decisions: CaseStudyDecision[]      // 2–4
  stack: { name: string; why: string }[]
  outcome: string[]                   // qualitative
  metrics?: CaseStudyMetric[]
  related?: string[]                  // other slugs, e.g. beachbus-palawan → beachbus-nfc-card-system
}
```

`lib/case-studies.ts` exports `caseStudies: CaseStudy[]` and
`getCaseStudy(slug)`. `lib/chat-context.ts` adds each case study to the system
prompt, so the assistant answers from approved text only.

## 4. Pages

Mode: **Read** (PRODUCT.md). Same B3 Signal system; prose held to about 68ch.

**Route.** `app/projects/[slug]/page.tsx`, a server component.
`generateStaticParams` returns all 15 `slug` values (not `id`); an unknown slug calls `notFound()`.
`generateMetadata` gives each page a title and description from its data. No
new client components: screenshots reuse `ImageLightbox`.

**Flagship page**, top to bottom:

1. Header — eyebrow (band · sector), H1 title, summary, `StatusBadge`, a mono
   meta strip (role · dates · stack · gateways), **Open live site** (only when
   the status allows it), "← All projects".
2. Screenshots — desktop and mobile pair.
3. Body — *The brief* · *What I built* · *Decisions* (numbered, each "chose X
   over Y because Z") · *Stack* (each with one line of why) · *Outcome*
   (qualitative, then any client-approved metrics).
4. Footer — next case study, then the contact call to action.

**Short page** (the other ten): the same header and screenshots, then the
existing `description`, the stack, and links. No invented prose. A
`contribution` line, if one is later written, renders automatically.

**Live link rule.** "Open live site" renders only for `live` and `early-access`
projects with `links.live`. `auth-gated`, `ua-gated` and `internal` never show it.

**No preview.** Projects without a capture (`auth-gated`, `ua-gated`,
`internal`: OCS WP Control, Downtown District Hotel, Aralabroad, BeachBus NFC)
show a screenshot Christian supplies and approves, or a plain panel saying why
there is no preview.

**Linking.** Board rows on the homepage and `/projects`, and the homepage
product panels, link to `/projects/<slug>` instead of the live site.

**Screenshots.** `scripts/capture-screenshots.mjs` keeps writing
`<id>.png` (desktop) and adds `<id>-mobile.png` at 390×844.

## 5. Testing

- **Content** (`tests/content/case-studies.test.ts`): every case study's slug
  matches a project; the five flagships each have one; every body section is
  non-empty; decisions number 2–4; every metric has `clientApproved: true`; no
  case study contains a phone number or an email that is not in `contactInfo`.
- **Components** (`tests/components/case-study-page.test.tsx`): a flagship and a
  short page render with the H1 and section order above; "Open live site" is
  absent for gated and internal projects; the no-preview panel appears when
  there is no screenshot; board rows link to `/projects/<slug>`.
- **Routes:** `generateStaticParams` covers all 15 slugs.
- **Existing guards hold:** client-component count unchanged, green means live,
  contrast, legacy tokens.

## 6. Quality gates

Run on one flagship and one short page after the build, in bounded passes
(inspect, one fix batch, one confirm):

- impeccable critique — target 32/40;
- impeccable audit — ≥16/20;
- Lighthouse mobile — performance ≥95, accessibility 100;
- `ecc:a11y-architect` — one WCAG 2.2 AA review.

## 7. Build order

1. Route, short pages, linking, capture script — no research dependency.
2. Research agents run in parallel with step 1.
3. The flagship template is built against the first case study Christian has
   answered. Real text from the start; no placeholder copy ships.
4. The remaining flagships are added as answers arrive.

All on `v4`. `v4` still merges to `main` only with Christian's sign-off.

## 8. Out of scope

Sitemap, JSON-LD and `llms.txt` (Phase 5); live iframes; MDX or a CMS; a case
study for OCS WP Control; new animation.
