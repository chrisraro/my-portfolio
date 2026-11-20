# Portfolio 5.0 revamp: Isarog Trail Map

Date: 2026-11-20 · Branch: `v5` (cut from `main` at `07321f7`) · Status: approved in brainstorming, awaiting spec review

## 1. Goal

A full revamp of the portfolio: a new visual world, new pages, new copy, and a
rewritten SEO, GEO and AI-engine (AIEO) layer. Editorial minimalist, with real
motion design and modern animated components. The hero reuses the v4.1 portrait,
`public/assets/images/about/profile-hiking.jpg`.

Success:

- A first-time visitor understands within one screen what Christian builds and
  which of two paths is theirs: hire him for a project, or hire him for a role.
- Every factual claim on every page is backed by `lib/data.ts` or
  `lib/case-studies.ts` and held true by a test.
- Each target keyword has one page that answers it, server-rendered and
  citable by search and AI engines.
- Type-check, lint, test and build pass with no environment variables set.

## 2. Decisions taken in brainstorming

| Question | Decision |
|---|---|
| Starting point | Fresh design from `main`. The Nov 14 editorial attempt (`claude/tender-turing-j538f0`) is rejected: too cold and monochrome, too much like a store, too little motion. Nothing is borrowed from it. |
| Audience | Freelance clients and hiring managers, equally. |
| Keywords | Full-stack developer Philippines (remote-ready); web developer Naga City / Bicol; AI automation engineer (n8n, LLM, MCP); WordPress / WooCommerce developer with PH payment gateways. |
| Features kept | Chunks AI chat, live site previews, the six case studies. Photos and testimonials move to `/about`. |
| New pages | `/services` with three service pages, `/about`, `/hire`. |
| Visual direction | Isarog Trail Map (impeccable direction round, `seed:03c5f4d98ec3bdbf`, chosen as IMPECCABLE’S PICK over the rolled Abaca Weave). |
| Headline | "Built in Bicol. Running across the Philippines." |
| AI training crawlers | Left allowed, as today. |

## 3. Visual world

**Thesis.** The work as a survey map you walk: one trail, every project a
waypoint. It refuses the category default (big claim over a grid of project
cards). Client work is literally geographic (Palawan, El Nido, Baguio,
Boracay, Naga), so the map carries facts, not decoration.

**Palette, two themes, one map.**

- Day survey (default; clients read on phones in daylight): pale green-grey
  survey paper ground, near-black ink, olive contour lines, one trail red.
- Night survey: dark field paper, light contour lines, the same trail red.
- Trail red is reserved for the primary action and the current position (the
  trail head, the active waypoint, the active filter). It never fills large
  areas.
- Status keeps its own glyph-plus-label badges (live, early access, private,
  internal, staging); green still means a live system only.
- Colours live as oklch tokens in `app/globals.css`, one per line, checked for
  WCAG AA contrast in both themes by a test.

**Type.** One variable family, Archivo, through `next/font` with its `wdth`
axis: condensed uppercase for display and map labels, normal width for body,
forms and chat. Tabular numerals for dates, coordinates and counts. No serif,
no mono family.

**Material and components.**

- Survey plates: the portrait and every project screenshot sit in a white
  plate frame; every screenshot at one scale on one baseline.
- Contour linework as SVG, drawn from a small set of authored paths.
- Navigation: a floating map-legend card with a frosted surface over the
  contours (the one Liquid Glass reference), holding Work, Services, About,
  Hire, Contact, the theme switch and the résumé link.
- Filters: a segmented control styled as a legend key.
- Contact: a "plan the route" form.
- Section breaks: generous open space, not hairlines.

**First viewport (homepage).** Matches the chosen sketch
(`.impeccable/mocks/decision/model-pick.html`): eyebrow and condensed
headline top left over contours; subheadline; two buttons, "Start a project"
(trail red, primary) and "Hire me for a role" (outline); the portrait on its
plate at the trailhead, right; the red trail leaving it toward the first
project waypoints; the elevation strip along the bottom edge.

## 4. Motion

Three verbs only:

- **Draw:** trails, contours and map routes stroke in.
- **Rise:** labels and text lines lift into place, one line at a time.
- **Pan:** the map and the page glide to a waypoint.

Signature interaction: one red trail draws as the visitor scrolls (CSS
scroll-driven animation, `animation-timeline`), threading every homepage
section. The elevation strip doubles as the 2020-to-now timeline with a
"you are here" marker.

Rules:

- CSS first; scroll-driven effects behind `@supports (animation-timeline: …)`
  and `prefers-reduced-motion: no-preference`. Outside the gates the trail is
  shown fully drawn and nothing is offset.
- Text and proof are present in the server HTML at full opacity; motion uses
  transform and stroke only, never hides content.
- Project links use view transitions: the clicked screenshot carries into the
  project page header; `/projects` filter changes pan the map and reflow the
  list. Feature-detected, off under reduced motion, plain links without JS.
- The hero contours shift slightly under a fine pointer; nothing on touch.
- Headlines rise line by line; screenshots appear once as they enter view.
- Nothing loops longer than five seconds; the live pulse stays bounded.
- Durations and easings are tokens in `lib/motion-tokens.ts`, mirrored as CSS
  variables; no numeric motion literals in `.tsx`.
- `motion/react` only in client components, via `LazyMotion` and `m.*`.

## 5. Pages and structure

**Homepage (`/`)**, in order:

1. Trailhead: hero as in §3.
2. Elevation strip: proof figures as markers (counts derived from the data).
3. The fork: two paths, "For your business" (→ `/services`) and "For your
   team" (→ `/hire`).
4. Field map: an SVG map of the Philippines with pins at client locations;
   own products marked at Naga City. A pin opens that project's plate.
5. Own products as larger plates.
6. Trail journals: case-study covers.
7. Plan the route: the contact form, with Chunks a click away.

**`/projects`**: the full inventory as map view and list view of the same
data, filtered by band (Products, Custom systems, Applications, Sites) with
the `?band=` parameter kept.

**`/projects/[slug]`**: a page per project. The six flagships in `lib/case-studies.ts` keep full case
studies laid out as trail journals; the rest are short pages from existing
data. Live preview wherever `lib/embeddable.json` allows framing.

**`/services`** plus three pages, each with its own keyword:
`/services/full-stack-development`, `/services/wordpress-woocommerce`,
`/services/ai-automation`. Each lists the projects that prove it and ends in
the contact form.

**`/about`**: story, dated work timeline, the six field photos with captions,
the four attributed testimonials, résumé.

**`/hire`**: for hiring managers: stack grouped by depth, work history, résumé
download, how he works (tests, CI, AI tooling), availability, GitHub and
email.

**404**: "Off the trail", an empty map square with a route home.

**Global**: legend navigation, footer with public contacts and Naga City
marked as the base, Chunks on every page.

**Map data rule.** A pin needs a verified location: the place named in the
project's own data or its live site. Projects without one (for example
remote or nationwide clients) appear in a list beside the map, never at a
guessed point. Coordinates are stored per project in `lib/data.ts`.

**Not built:** city-name doorway pages, a blog, FAQ schema.

## 6. Copy, SEO, GEO and AIEO

**Hero copy.**

- Eyebrow: "Full-stack developer · Naga City, Philippines"
- Headline: "Built in Bicol. Running across the Philippines."
- Subheadline: "Booking and payment sites for travel businesses, AI automation
  for teams, and four products of my own. Open to client projects and to
  full-time remote roles." The product count is derived from the `Products`
  band in `lib/data.ts` (four today: Iskotify, Giya, Latag, Connecta PH) and
  held by a test, never typed by hand.

Voice stays first person, plain and specific. No years-of-experience figure,
no outcome metrics, no client logos.

**Titles.**

| Route | Title |
|---|---|
| `/` | Christian Raro · Full-Stack Developer in the Philippines |
| `/services/full-stack-development` | Full-Stack Web Developer (Next.js, React) · Philippines, remote |
| `/services/wordpress-woocommerce` | WordPress & WooCommerce Developer · PayMongo, Maya, Xendit, PayPal |
| `/services/ai-automation` | AI Automation Engineer · n8n, LLM workflows, MCP |
| `/about` | About Christian Raro · Web Developer in Naga City, Bicol |
| `/hire` | Hire a Mid-Level Full-Stack Developer · Remote, Philippines |
| `/projects/[slug]` | {Project} · {summary} · Christian Raro |

Each route gets its own meta description, canonical URL and a trail-map Open
Graph image (edge runtime, as today).

**Citability.** Service pages, `/about` and `/hire` open with a self-contained
40–60 word answer ("Christian Raro is a full-stack developer in Naga City,
Philippines, who…"), then question-style H2s, short paragraphs, one honest
comparison table where it fits, and a visible last-updated date.

**Entity graph (JSON-LD).** One `Person` `@id` site-wide (job title,
`knowsAbout`, `worksFor` Online Creative Solutions, `alumniOf` Bicol
University, locality-only address, `sameAs` GitHub, LinkedIn, Facebook);
`ProfilePage` on `/about`; `Service` per service page with `areaServed` Naga
City, Bicol, Philippines and remote; `CreativeWork` or `SoftwareApplication`
per project; `BreadcrumbList` on every page; `WebSite`. No telephone, no
street address, no FAQPage.

**Crawlers and rendering.** Every page server-renders its content; the map
is SVG with pins as real links. `robots.ts` explicitly allows Googlebot,
OAI-SearchBot, Claude-SearchBot and PerplexityBot, keeps training crawlers
allowed, and disallows `/api/`. The sitemap lists every route.
`/llms.txt` and `/llms-full.txt` are rebuilt to cover the new pages (useful
to non-Google tools; Google ignores them).

**Chunks.** The system prompt keeps deriving from `lib/data.ts` and
`lib/case-studies.ts`, so new copy and services reach it automatically; the
no-phone, no-address rule stays.

**Off-site (owner actions, not code).** Align the LinkedIn and GitHub
headlines with the site title; enable Search Console's "Search generative
AI" setting.

## 7. Content model changes

- `lib/data.ts` gains: `servicePages` (slug, title, keyword, answer block,
  sections, proving project ids), `hirePageContent`, `aboutPageContent`,
  per-project `place` (name, region, coordinates) where verified, and the new
  hero copy.
- `types/index.ts` gains the matching interfaces.
- Section copy, eyebrows and headings stay in `lib/data.ts`; UI chrome may
  stay in components.
- `PRODUCT.md` is updated: 20 projects, four own products, six case studies,
  both audiences equal, new pages, Portfolio 5.0 on `v5`.

## 8. Architecture

- Next.js 14 App Router, server components by default. Client components
  stay under the existing cap (fewer than 10): theme provider, top
  navigation interactions, contact form, chat, lightbox, live preview,
  toaster, view-transitions island, and at most one for map pan.
- The trail, contours, elevation strip and map are server-rendered SVG;
  scroll motion is CSS.
- Reuse kept modules: `lib/data.ts`, `lib/case-studies.ts`,
  `lib/structured-data.ts`, `lib/llms.ts`, `lib/chat-context.ts`,
  `lib/project-page.ts`, `lib/embeddable.json`, `lib/board.ts` (band
  grouping), both API routes.
- Replace: `components/sections/*`, `components/ui/*` that belong to the old
  world, `app/globals.css` tokens, page layouts.
- Fonts: Archivo replaces Anybody and Figtree; the OG card keeps its static
  font files on the edge runtime.

## 9. Testing

- Content tests stay and extend to the new pages, hero copy, service claims,
  map pins (every pin has a verified place) and the entity graph.
- Retired with the old world: two-amber tests, rack stagger, lobby tokens,
  any test that asserts Portfolio 4.0 class names.
- New design tests: token contrast in both themes; trail red only on actions
  and current position; motion tokens mirrored; scroll-driven trail inside
  both gates; no loop past five seconds; map pins present in server HTML as
  links; client-component cap; no numeric motion literals in `.tsx`.
- Component tests render each new section and page with `react-dom/server`.
- Each sprint ends with type-check, lint, test and build green, and a
  browser check at 1440 and 390 wide.

## 10. Delivery

Branch `v5`; every push gets a Vercel preview; merge to `main` only with
Christian's sign-off on a preview.

| Sprint | Scope | Model (JEV routing) |
|---|---|---|
| S1 | Foundation: tokens, type, grid, legend nav, footer, theme, new design tests | Opus |
| S2 | Homepage | Opus (JEV split; tie to Opus) |
| S3 | `/projects`, project pages, case studies, live preview | Sonnet |
| S4 | `/services` + 3 pages, `/about`, `/hire`, 404 | Sonnet |
| S5 | SEO, GEO, AIEO: metadata, JSON-LD, robots, sitemap, llms files, tests | Sonnet |
| S6 | Motion polish, performance, accessibility, impeccable finish review, `DESIGN.md`, `CLAUDE.md` | Opus (JEV split; tie to Opus) |

Sonnet sprints run as subagents from this spec and the plan; each is reviewed
before commit. Skills per sprint: impeccable throughout; motion-foundations,
motion-patterns, motion-advanced, motion-ui and modern-web-guidance for
motion and web APIs; gpt-taste and motionsites for the homepage; claude-seo
schema, geo, sitemap and agentic for S5; liquid-glass-design for the legend
surface only. `swiftui-patterns` serves as feel reference only;
`cisco-ios-patterns` does not apply.

## 11. Risks

- **Familiar metaphor.** Trails and journeys are common in portfolios. The
  real client map and a strict editorial grid are what keep it specific.
- **Map accuracy.** A wrong pin is a false claim; the verified-place rule and
  its test guard it.
- **Scroll-driven support.** Browsers without `animation-timeline` get the
  static, fully drawn trail.
- **Scope.** Seven page types plus an SEO rewrite; sprints ship independently
  on `v5` so progress is reviewable at each preview.
