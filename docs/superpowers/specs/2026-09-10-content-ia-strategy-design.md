# Portfolio 4.0 — Phase 1: Content & IA Strategy

**Date:** 2026-09-10
**Status:** Design — awaiting review
**Phase:** 1 of 4 (Content & IA → Design system → Case studies → SEO/AIEO)

---

## Goal

Decide what this portfolio says, to whom, and in what order — before any visual or
technical work begins. This phase produces content and information-architecture
decisions only. No components, no tokens, no code.

The preceding `$impeccable critique` scored the current site **20/40 design health**
and **7/20 audit health**, and its central finding was not that the site looks
generic. It was that **the information architecture is inverted**: the most
generic content (35 skill pills, four interchangeable testimonial quotes) occupies
prime position, while the most specific and credible content — an internal NFC card
system built for a client, client-sponsored travel, presenting to a brokers meeting —
is buried in `alt` attributes and hover-only overlays that do not work on touch.

A new visual system applied to the same inverted IA produces a prettier version of
the same problem. Content ordering is therefore Phase 1, and everything else waits.

## Non-Goals (YAGNI)

- No visual design, tokens, typography, colour or motion decisions (Phase 2)
- No case-study page implementation or live-preview mechanism (Phase 3)
- No sitemap, robots, JSON-LD, `llms.txt` or metadata work (Phase 4)
- No writing of the case-study copy itself (Phase 3) — this phase decides only
  what content exists, how it is grouped, and what order it appears in
- No CMS. Content stays in `lib/data.ts` as typed TypeScript
- No blog, no newsletter, no analytics dashboard

## Current State (as explored)

Verified against the live site at `christian-digital-portfolio.vercel.app` and the
repository at commit `8baca60`.

**Inventory:** 11 projects (5 featured), 4 experience entries, 2 education entries,
35 skills, 4 testimonials, 6 gallery images.

**Structural problems found:**

- Home page is 8 stacked sections in a `max-w-4xl` column; navigation is hidden
  entirely on `/`, so keyboard traversal is the only structural wayfinding
- The credentials sidebar restates the hero's two facts in two dark boxes
- The tech-stack section's "View All" leads to `/tech-stack`, which renders the
  identical 35 pills — a promise of more that delivers the same content
- The `/projects` filter taxonomy mixes four technology categories with one industry
  category, and "WordPress Development" overlaps "WordPress + WooCommerce", so no
  visitor can predict which bucket a site lands in
- Experience sorts on the first four-digit number in a date string, producing the
  order 2024, 2025, 2024, 2023, 2023, 2020, 2018, and includes two TVL-ICT
  junior-high-school strands rendered at the same weight as professional employment
- `app/api/chat/route.ts` duplicates `lib/data.ts` by hand and **has already
  drifted**: it advertises four projects absent from the site and omits seven that
  are present

**URL verification (2026-09-10, HTTP status with browser user-agent):**

All 14 live URLs return 200. Two — `downtowndistricthotel.ph` and `aralabroad.com` —
return 406 to a default `curl` user-agent and 200 to a browser one. `giya.ph`
redirects to `www.giya.ph`. `ocs-wp-control.vercel.app` redirects to `/login` and
serves "OCS Wordpress Control Panel" behind authentication.

## Design

### 1. Audience and positioning

**Primary audience:** prospective freelance clients.
**Secondary audience:** engineering hiring managers.

**Title:** Full-stack web developer.

Positioning stays deliberately broad. Narrowing to a niche (for example tourism and
hospitality, which is genuinely the strongest cluster) was considered and rejected:
in a regional market, a narrow niche risks starving the pipeline. That decision moves
the entire differentiation burden onto the proof layer. A broad tagline is acceptable
only if the band directly beneath it is unmistakably specific.

**Working hero shape:**

> **Full-stack web developer, Naga City.**
> Three products of my own. Fifteen projects shipped. Four payment gateways.
> One NFC card system.

The gateway count is four, verified against `scripts/build-resume.mjs:103` —
PayPal, PayMongo, Maya, Xendit. An initial draft of this spec claimed five; the
self-review caught it. Every number in this band is a public claim and must be
re-verified before it ships (see R3).

No years-of-experience figure is claimed. The dated experience timeline carries that
implicitly, and the concrete counts above are verifiable and stronger.

The load-bearing claim is **"three products of my own."** Iskotify, Giya and Latag are
self-initiated products with their own positioning, target markets and business
models. A generalist who ships their own products is not interchangeable with a
generalist who only takes briefs. This is the differentiator the whole page rests on.

### 2. Home page information architecture

| # | Section | Job it does | Change |
|---|---------|-------------|--------|
| 1 | Hero | Name, title, offer, proof band, three CTAs | Rewritten. Retains the existing CTA row, which the audit identified as the single strongest element on the site |
| 2 | Products | Iskotify · Giya · Latag | **New.** The differentiator, placed above client work |
| 3 | Client work | 10 live projects, grouped by band | Rebuilt. Live previews replace static mockups |
| 4 | Custom systems | BeachBus NFC · OCS WP Control Panel | **New.** Evidence of "systems, not just websites" |
| 5 | Experience | Work history, chronological | Sort fixed; education separated; TVL-ICT removed |
| 6 | Skills | 12–15 items | Trimmed from 35 |
| 7 | Testimonials | Four real named quotes | Retained; each attached to its project (see §5) |
| 8 | Working with clients | Photographs with permanent captions | Gallery reframed as proof, not decoration |
| 9 | Contact | Form and direct email | Retained. Current implementation is sound |

**Removed entirely:** the credentials sidebar (pure duplication of the hero), the
`/tech-stack` route and its duplicate "View All" link, and the Twitter-blue
verification badge in the hero.

**Navigation:** the home page gains real navigation. Hiding it left keyboard
traversal as the only structural wayfinding, and it made the visitor's mental model
of the site change on every page transition.

### 3. Project taxonomy

Four bands replace the incoherent five-filter taxonomy. Every band names **a kind of
thing built**, never a technology, so a visitor can predict which bucket anything
lands in.

- **Products** — self-initiated, owned end to end
- **Custom systems** — internal tools and hardware-integrated work
- **Applications** — bespoke client applications
- **Sites** — client websites and storefronts

**How bands map to home-page sections (§2):** the Products band is section 2; the
Custom systems band is section 4; the Applications and Sites bands together form
section 3, "Client work". The bands are the canonical taxonomy used on `/projects`
and in `lib/data.ts`; the home page groups two of them under one heading because
"Client work" is the distinction a visiting client cares about, while the
Applications/Sites split matters when browsing the full index.

### 4. Project inventory (15)

| # | Project | Band | URL | Stack | Status |
|---|---------|------|-----|-------|--------|
| 1 | Iskotify | Products | iskotify.ph | Next.js | Live · Early Access |
| 2 | Giya | Products | giya.ph | Next.js | Live |
| 3 | Latag | Products | latag.vercel.app | Next.js | Live |
| 4 | BeachBus NFC card system | Custom systems | — | — | **New write-up** |
| 5 | OCS WP Control Panel | Custom systems | ocs-wp-control.vercel.app | Next.js | Live · auth-gated |
| 6 | Aman Group Web App | Applications | amangroup-webapp.enjoyrealty.com | Next.js | Live |
| 7 | Graceland Bicolano Dining | Sites | graceland.ph | WP + Woo | Live |
| 8 | El Nido Guide PH | Sites | elnidoguide.ph | WP + Woo | Live |
| 9 | BeachBus Palawan | Sites | beachbus.ph | WP + Woo | Live |
| 10 | Review Masters Bicol | Sites | upcatreviewplus.com | WP + Woo | Live · **renamed** |
| 11 | ACAD1 Review Center | Sites | acad1.ph | WP + Woo | Live · **new** |
| 12 | Downtown District Hotel | Sites | downtowndistricthotel.ph | WordPress | Live · UA-gated |
| 13 | Azalea Baguio | Sites | azaleabaguio.com | WordPress | Live · **new** |
| 14 | Azalea Boracay | Sites | azaleaboracay.com | WordPress | Live · **new** |
| 15 | AralAbroad | Sites | aralabroad.com | WordPress | Live · **new** · UA-gated |

**Removed:** `fish2go`, `azalea-main` and `online-creative-solutions` — all three
hosted on the employer's own domain and read as employer marketing rather than
portfolio work. `azalea-main` is superseded by the two real production properties.

**Corrected:** Graceland now points at `graceland.ph` (the previous entry shipped a
cPanel staging URL, `res326.servconfig.com/~graceland/staging/`, which rendered
verbatim as the card label on the flagship project). Giya moves from `giya.vercel.app`
to `giya.ph`. UPCAT Review Plus is renamed **Review Masters Bicol** to match the live
brand.

### 5. Testimonials

All four existing quotes are real and attributed to named people at named companies:
Alec Santos (Project Manager, BeachBus Palawan), Brian Labilles (Business Development
Assistant, Enjoy Realty), Bryden Elizan (CEO/Founder, Online Creative Solutions) and
Joseph Cua (CEO/Founder, Palawan Pick and Drop).

Their weakness is content, not authenticity: none names a project, an outcome or a
number. Three of the four, however, come from organisations whose projects appear on
this site.

**Decision:** each testimonial is attached to the case study it refers to, rather than
floating in a rotating carousel. Alec Santos's quote appears on the BeachBus case
study; Bryden Elizan's on the Online Creative Solutions work; Brian Labilles's on the
Aman Group Web App. This converts general praise into project-specific proof with no
new asks. A home-page summary band may still surface one or two.

Optionally, and not blocking: ask the same four people for one specific sentence each
naming what was delivered.

### 6. Experience

Two entries are removed entirely: `muramart-bubble` (Junior/Assistant Bubble.io
Developer, Aug 2023 – Sep 2024) and `muramart-ojt` (OJT, July – Aug 2023). Bubble.io
is removed from skills and from every prose reference. This is a deliberate content
decision, not a data cleanup.

Removing them opens a stretch between Aug 2023 and Nov 2024 with no employment entry.
This is covered by the education entry — B.S. Computer Science, Bicol University
Polangui, Aug 2020 – July 2024 — which reads as "student", not as a gap. Education is
retained for exactly this reason.

The two remaining roles are genuinely concurrent and are labelled as such rather than
hidden:

- **Online Creative Solutions** — Web Developer, Nov 2024 – present
- **Enjoy Realty & Development Corp.** — IT Staff / Web Developer, Mar – Aug 2025
  *(full-time, concurrent with Online Creative Solutions)*

Holding a full-time corporate role while shipping client work for an agency is
capacity evidence. For a freelance-primary audience it answers "can he deliver
alongside everything else?", so it is stated explicitly.

Sorting must use real parsed dates with `Present` resolving to today, not the first
four-digit number found in a string. Work and education render as two labelled
groups, replacing the filled-versus-hollow 12px dot that currently encodes the
distinction with no legend.

### 7. Skills

Reduced from 35 to 12–15 items, limited to what is actually shipped with.

**Removed:** Bubble.io; the four AI chat clients (Claude Code, Gemini CLI,
Qoder/Qwen, Google AI Studio); design and editor tools that are not delivery skills
(Figma, VS Code); and the payment gateways, which move to the projects that used them
where they are stronger evidence.

The rationale for cutting the AI clients is signal inversion: to a technical reader,
listing AI chat tools as peer skills alongside Git and Docker reads as "I use
chatbots", not "I engineer". If AI-assisted workflow matters to the pitch, it is
stated once in prose, not as tool pills.

### 8. Gallery

Retained and reframed. The six photographs carry the most specific and credible
content on the site, currently rendered at `text-xs` inside `opacity-0
group-hover:opacity-100` overlays on a strip that scrolls forever, unreachable on
touch.

**Decisions:** captions become permanently visible text beneath each image; the
auto-scroll is removed; thumbnails become real buttons; and the section is retitled to
state what it is (working with clients / on-site delivery) rather than "Gallery".

The two pieces of content that deserve promotion out of the gallery entirely — the
BeachBus NFC card system and the ERDC brokers-meeting presentation — become a project
entry and case-study evidence respectively.

### 9. Single source of truth

`lib/data.ts` becomes the sole content origin. The hand-written duplicate inside
`app/api/chat/route.ts` is deleted and the system prompt derived from the data,
extending the `Project` and `ExperienceItem` types with the fields the prose block
currently carries (dates, detailed responsibilities, contribution scope).

This is a correctness fix, not a refactor: the two copies have already diverged, and a
visitor asking the assistant "what has he built?" receives a stale answer today.

## Component / File Impact

Phase 1 produces decisions. The file changes below are the ones this phase authorises;
implementation sequencing belongs to the plan.

| File | Change |
|------|--------|
| `types/index.ts` | `Project` gains `slug`, `band`, `contribution`, `dates`, `status`; `ExperienceItem` gains `concurrent`; `Recommendation` gains optional `projectId` |
| `lib/data.ts` | Projects 11 → 15 with three removals and four additions; two experience entries removed; skills 35 → 12–15; testimonials gain a project reference |
| `app/api/chat/route.ts` | Hand-written duplicate deleted; prompt derived from `lib/data.ts` |
| `scripts/build-resume.mjs` | Bubble.io and Muramart references removed |
| `components/sections/credentials-sidebar.tsx` | Deleted |
| `app/tech-stack/page.tsx` | Deleted |
| `components/sections/experience-section.tsx` | Date parsing and grouping (implementation in Phase 2) |

## Testing / Verification

Phase 1 is a content phase, so verification is factual rather than behavioural:

1. Every URL in the §4 inventory returns 200 with a browser user-agent (re-verify at
   implementation time; two are UA-gated and one is auth-gated)
2. No occurrence of `bubble`, `Bubble.io`, `muramart` or `Muramart` remains in
   `lib/`, `app/`, `components/` or `scripts/` — currently 11 occurrences across 4 files
3. Every project in `lib/data.ts` has exactly one band from the §3 taxonomy
4. Every testimonial references a project that exists in `projects[]`, or is
   explicitly marked as unattached
5. The chat assistant's answer to "what has Christian built?" matches `projects[]`
   exactly — no project named that is absent, none omitted that is present
6. Experience renders in strictly descending date order
7. `npm run type-check`, `npm run lint` and `npm run build` pass

## Content Dependencies

These are supplied by Christian and gate Phase 3. If they do not arrive, the broad
positioning has nothing carrying it and the affected sections should be cut rather
than filled with generic copy.

| Item | Needed for | Blocking |
|------|-----------|----------|
| "What I built" scope per project | Every case study | Phase 3 |
| Outcome numbers where obtainable | Case studies, hero proof band | Phase 3 — degrade gracefully if unavailable |
| BeachBus NFC system write-up | Custom systems band | Phase 3 |
| Screenshots of OCS WP Control Panel | Auth-gated; cannot be live-previewed | Phase 3 |
| Optional: one specific line per testimonial | Strengthening §5 | Not blocking |

## Risks / Open Questions

**R1 — Live previews cannot cover the whole inventory.** Two sites reject non-browser
user-agents and may also reject datacenter IPs; one is behind authentication. Phase 3
must design a fallback path and must not assume every project can be previewed. This
is a design constraint, not an edge case: it affects 3 of 15 projects.

**R2 — Fifteen case studies is a large writing commitment.** Phase 3 should rank the
inventory and write depth-first, accepting that lower-ranked entries may carry only a
title, band, stack and link. A thin case study is acceptable; a fabricated one is not.

**R3 — The proof band's counts must stay true.** "Five payment gateways" and "one NFC
system" are verifiable claims. If the inventory changes, the band changes with it.

**R4 — Broad positioning remains the main strategic risk.** It was chosen knowingly
over a tourism/hospitality niche. It works only if the proof layer lands. If the
Phase 3 content dependencies come back thin, revisiting the niche question is the
correct response, not padding the copy.

**Q1 — Years of experience.** Deliberately omitted from the hero. Revisit if a
figure is wanted later; the timeline supports roughly two years from Nov 2024.

**Q2 — Does the OCS WP Control Panel raise an employer-disclosure question?** It is
an internal tool built for the current employer. Confirm before publishing that
showing it, even as screenshots, is acceptable to Online Creative Solutions.
