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

The claim a neighbouring developer cannot truthfully copy: **work that runs in
the places it names**, backed by 4 case studies and 14 shipped projects, and
the range behind it — booking and payment sites for travel businesses in
Palawan, Baguio and Boracay, **custom systems** (an NFC card system for
BeachBus Palawan, an internal WordPress control panel for Online Creative
Solutions), and web apps. WordPress specialism is shown as proof, in the 11
sites, not stated as a title.

The portfolio claims **no products of Christian's own**. His personal products
were taken off at his request. Iskotify, the student platform, is an Online
Creative Solutions project: it is shown as *In development*, with its website
live, and the copy says whose it is.

## Operating Context

- Open to freelance and full-time roles.
- Currently a web developer at Online Creative Solutions (November 2024 –
  present). Previously full-time at Enjoy Realty and Development Corporation
  (March – August 2025), concurrently.
- Visitors reach him through the contact form (`/api/contact`, with a mailto
  fallback when no mail provider is configured), email, the résumé PDF, and an
  AI assistant named Chunks that answers only from the portfolio data.
- Deployed on Vercel from `main`. Portfolio 6.0 (First Light) is built on the
  `v6` branch, with a Vercel preview for every push; it merges after
  Christian signs off a preview.

## Capabilities and Constraints

- Next.js 14 App Router, TypeScript, Tailwind CSS. All content lives in
  `lib/data.ts`; Vitest content tests assert every factual claim the site makes.
- Surfaces: the homepage, one reading column from who he is to the contact form;
  `/projects`, a map and a list of 15 projects in three bands (Custom systems,
  Applications, Sites) with the `?band=` filter; a page per project at
  `/projects/[slug]`, the 4 case studies as trail journals and the rest as short
  pages built only from data they already have; `/services` with three service
  pages (full-stack development, WordPress and WooCommerce, AI automation);
  `/about`; `/hire`; the 404; `/llms.txt` and `/llms-full.txt`.
- The look: a fixed pixel land of Mount Isarog under every page, first light
  rising behind it as you scroll, and a floating panel of glass. Night is the
  default theme. `DESIGN.md` documents it.
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
- Who owns the work is said plainly: client work is the client's, Online
  Creative Solutions projects are Online Creative Solutions'.

## Evidence on Hand

- 15 projects, 14 with live URLs, with full-page screenshots in
  `public/assets/images/projects/` where a public screen exists.
- 4 case studies in `lib/case-studies.ts` (El Nido Guide PH, BeachBus Palawan,
  ACAD1 Review Center, the Aman Group Web App).
- Four real, attributed testimonials in `lib/data.ts` (Alec Santos, Brian
  Labilles, Bryden Elizan, Joseph Cua). Three are attached to the project they
  refer to.
- Six on-site photographs with captions in `public/assets/images/gallery/`.
- Résumé PDFs in `public/assets/resume/`.

**Absent — never fabricate:** outcome metrics; per-project "what I built"
write-ups; the BeachBus NFC system write-up; screenshots of the auth-gated OCS
control panel (showing its interior needs Online Creative Solutions' clearance);
client logos; products of Christian's own.

## Product Principles

1. Every claim is backed by the inventory, and a test holds it true.
2. Proof over titles: show the work and the systems rather than stacking job
   titles.
3. Human proof sits beside technical proof. Freelance clients need to see a
   person and the people he has worked with, not only a console.
4. A thin true entry beats a padded one. A project that is not finished says so
   (*In development*), and does not count as shipped.
5. The atmosphere is his: Isarog, the Naga plain, a Bicol dawn. The structure may
   borrow from sites he admires; the place, light and words do not.

## Accessibility & Inclusion

WCAG 2.2 AA. Status is never conveyed by colour alone. Glass goes opaque under
reduced transparency and more contrast. Motion respects
`prefers-reduced-motion`, and nothing animates for more than five seconds.
