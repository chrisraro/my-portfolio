# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Freelance clients and engineering hiring managers, equally** (spec §2):

- **Freelance clients.** Often non-technical small-business owners in the
  Philippines, strongest in tourism and hospitality — hotels, tour and shuttle
  operators, restaurants, review centres. They arrive deciding whether
  Christian can build and run their website or system, and how to reach him.
- **Engineering hiring managers** evaluating him for full-time remote
  full-stack roles: what he has shipped, how deep his stack goes, and how he
  works.

## Product Purpose

The personal portfolio of Christian Raro, a full-stack developer in Naga City,
Camarines Sur, Philippines. It exists to turn a visit into an enquiry or an
interview.

Success: within one screen, a visitor understands what he builds and how to hire
him — and every claim on the page is backed by the project inventory.

## Positioning

"Full-stack developer." Broad by choice: a tourism and hospitality niche was
considered and rejected, because a narrow niche risks starving the pipeline in a
regional market. That puts the whole differentiation burden on proof.

The claim a neighbouring developer cannot truthfully copy: **4 own products**
(Iskotify, Giya, Latag, Connecta PH) alongside client work, plus **custom systems**
(an NFC card system for BeachBus Palawan, and an internal WordPress control panel
for Online Creative Solutions). WordPress specialism is shown as proof — nine
production sites — not stated as a title.

## Operating Context

- Open to freelance and full-time roles.
- Currently a web developer at Online Creative Solutions (November 2024 –
  present). Previously full-time at Enjoy Realty and Development Corporation
  (March – August 2025), concurrently.
- Visitors reach him through the contact form (`/api/contact`, with a mailto
  fallback when no mail provider is configured), email, the résumé PDF, and an
  AI assistant named Chunks that answers only from the portfolio data.
- Deployed on Vercel from `main`. Portfolio 5.0 (Isarog Trail Map) is built on
  the `v5` branch, with a Vercel preview for every push; it merges after
  Christian signs off a preview.

## Capabilities and Constraints

- Next.js 14 App Router, TypeScript, Tailwind CSS. All content lives in
  `lib/data.ts`; Vitest content tests assert every factual claim the site makes.
- Surfaces: the homepage; `/projects`, map and list views of 20 projects in
  four bands (Products, Custom systems, Applications, Sites) with the `?band=`
  filter; a page per project at `/projects/[slug]`, the 6 case studies as
  trail journals and the rest as short pages built only from data they already
  have; `/services` with three service pages (full-stack development,
  WordPress and WooCommerce, AI automation); `/about`; `/hire`; the "Off the
  trail" 404; `/llms.txt` and `/llms-full.txt`.
- Both API routes must work with no environment variables set.
- Payment gateways, confirmed by Christian on 2026-09-23 and corroborated by the
  live sites: **PayPal, PayMongo and Maya on BeachBus Palawan; Xendit on ACAD1
  Review Center; PayPal and Maya on El Nido Guide PH**, a multi-operator
  booking marketplace built on Dokan. Four distinct gateways in all.

## Brand Commitments

- Name: Christian Raro.
- Voice: first person, plain and specific. No years-of-experience figure is
  claimed; the dated work history carries that.
- The chat assistant is named Chunks.

## Evidence on Hand

- 20 projects, 19 with live URLs, with full-page screenshots in
  `public/assets/images/projects/`.
- 6 case studies in `lib/case-studies.ts`.
- Four real, attributed testimonials in `lib/data.ts` (Alec Santos, Brian
  Labilles, Bryden Elizan, Joseph Cua). Three are attached to the project they
  refer to.
- Six on-site photographs with captions in `public/assets/images/gallery/`.
- Résumé PDFs in `public/assets/resume/`.

**Absent — never fabricate:** outcome metrics; per-project "what I built"
write-ups; the BeachBus NFC system write-up; screenshots of the auth-gated OCS
control panel (showing its interior needs Online Creative Solutions' clearance);
client logos.

## Product Principles

1. Every claim is backed by the inventory, and a test holds it true.
2. Proof over titles: show the products and systems rather than stacking job
   titles.
3. Human proof sits beside technical proof. Freelance clients need to see a
   person and the people he has worked with, not only a console.
4. A thin true entry beats a padded one.

## Accessibility & Inclusion

WCAG 2.2 AA. Status is never conveyed by colour alone. Motion respects
`prefers-reduced-motion`, and nothing animates continuously for more than five
seconds.
