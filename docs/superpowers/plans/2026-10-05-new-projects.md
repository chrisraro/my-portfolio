# Sub-project 1 — New Projects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Connecta PH, Naga City Guide and Eastwind Beach Villas to the portfolio (main, then v4), with a `staging` status, a `directory` sector, and a Connecta PH case study.

**Architecture:** Content lives in `lib/data.ts` (and `lib/case-studies.ts` for the case study); everything downstream (pages, sitemap, JSON-LD, llms files, chat, proof band) derives from it. A research pass supplies sourced facts first; Christian answers Connecta questions before its case study is encoded.

**Tech Stack:** Next.js 14 · TypeScript strict · Vitest · puppeteer-core (screenshots).

**Spec:** `docs/superpowers/specs/2026-10-05-new-projects-design.md`

## Global Constraints

- Content facts come only from the research dossiers or Christian's answers. Never invent a feature, date or number; never edit existing content to make a test pass (report NEEDS_CONTEXT instead).
- When the inventory changes, tests that hard-code inventory counts are updated to the new true counts, and the matching `heroContent.proofPoints` sentence changes with them (CLAUDE.md: "if you change the inventory, the band changes with it").
- `summary` is at most 56 characters, "Who it's for · what it does · gateways"; a gateway is named only if it is in `technologies`.
- No em-dash in visitor-facing copy. No phone, street address or private email anywhere.
- Status is never colour alone; `live` colour and `.live-pulse` stay inside StatusBadge's live glyph only.
- Client components stay at six. No new dependency.
- Research is read-only: no form submissions, read-only Novamira abilities only, never POST to `/api/contact`.
- Local servers: `RESEND_API_KEY= GROQ_API_KEY= npx next start -p 3100`.
- `main` may be pushed only after the controller confirms with Christian; `v4` pushes are preview-only; never merge `v4` into `main`.
- Each task ends with `npm run type-check && npm run lint && npm test` (and `npm run build` when routes or pages change).
- Commits: `git commit -m "<subject>" -m "Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"`.

## Spec corrections

1. `directory` goes in `SECTOR_ORDER` after `review-centre`, not after `tours`, so the hero's four-sector line ("hotels, tours, restaurants, review centres") is unchanged.
2. The hero's "N live sites" count must exclude `staging` projects (Eastwind is a Site but not live).
3. Connecta PH is an NFC product, so the "One NFC card system" proof point becomes "Two NFC card systems" (and its test counts both NFC projects).

---

### Task 1: Research (controller-run, read-only)

**Files:** create (gitignored) `docs/case-studies/research/connecta-ph.md`, `naga-city-guide.md`, `eastwind-beach-villas.md`.

- [ ] Dispatch three parallel research subagents using the Phase 3 brief (`.superpowers/sdd/task-4-brief.md`, hard rules and dossier template verbatim), one per project:
  - Connecta PH: https://connectaph.vercel.app; code via public GitHub pages under `chrisraro` (WebFetch; `gh` is not installed); full dossier with Draft and Questions (it becomes a case study).
  - Naga City Guide: https://nagacityguide.com; WordPress via the Novamira `novamira-staging-nagacity` server (read-only; the live server needs sign-in); Evidence section plus a proposed `description`, `summary`, `technologies`; Questions only if a fact is ambiguous.
  - Eastwind: https://onlinecreativesolutions.com/eastwind/ (staging; crawl only, nothing submitted); same short form as Naga City Guide.
- [ ] Spot-check three evidence lines per dossier against their sources; confirm no personal data.

### Task 2: Connecta PH and Naga City Guide on `main`

**Files:** modify `lib/data.ts` (main); create `public/assets/images/projects/connecta-ph.png`, `naga-city-guide.png`; tests on main as needed.

- [ ] `git checkout main`. Add two entries in main's format (fields: `id`, `slug`, `title`, `description`, `band`, `image`, `technologies`, `links.live`, `status`), Connecta PH in the Products group, Naga City Guide in the Sites group, using the dossier's proposed description and technologies. `id` = `slug` = `connecta-ph` / `naga-city-guide`; `status: 'live'`; `image: '/assets/images/projects/<id>.png'`.
- [ ] `npm run capture -- connecta-ph naga-city-guide`; view each PNG with Read; delete any banner-covered or blank capture and report it.
- [ ] Run main's gate (`npm run type-check && npm run lint && npm test && npm run build`; clear `.next/types` first if it references v4-only routes). If a main test hard-codes the project count, update the count to the new truth; never edit other content.
- [ ] Commit on main: `content: add Connecta PH and Naga City Guide`. Do NOT push (controller asks Christian). `git checkout v4`.

### Task 3: v4 — merge, staging status, directory sector, Eastwind

**Files:** modify `types/index.ts`, `lib/display-status.ts`, `components/ui/status-badge.tsx`, `lib/project-page.ts`, `components/case-study/project-header.tsx`, `lib/data.ts`, `scripts/capture-screenshots.mjs` (confirm only); tests `tests/components/status-badge.test.tsx`, `tests/content/display-status.test.ts`, `tests/content/proof-band.test.ts`, `tests/content/positioning.test.ts`, `tests/content/project-page.test.ts`, `tests/components/project-page.test.tsx`; create `public/assets/images/projects/eastwind-beach-villas.png` (+ `-mobile.png`), `connecta-ph-mobile.png`, `naga-city-guide-mobile.png`.

**Interfaces:**
- Produces: `ProjectStatus` includes `'staging'`; `DisplayStatus` includes `'staging'`; `DISPLAY_STATUS_LABEL.staging = 'Staging'`; `ProjectSector` includes `'directory'`; `canLinkLive` true for `staging`; `liveLinkLabel(project: Project): string` exported from `lib/project-page.ts` returning `'Open staging site'` or `'Open live site'`.

- [ ] **Merge:** `git merge main` on v4; resolve `lib/data.ts` conflicts by keeping v4's entries and adding the two new ones with v4 fields: Connecta PH `sector: 'product'`, Naga City Guide `sector: 'directory'`, each a `summary` (≤56 chars) from the dossier.
- [ ] **Failing tests first:**
  - `tests/components/status-badge.test.tsx`: add `['staging', 'Staging']` to `CASES`; add `it('draws staging as its own shape, never the live glyph', …)` asserting the staging markup contains `data-status="staging"`, does not contain `live-pulse` or `bg-live`, and that its glyph class differs from the internal glyph's.
  - `tests/content/display-status.test.ts`: `displayStatus('staging')` is `'staging'`.
  - `tests/content/project-page.test.ts`: `canLinkLive` is true for a staging project with a URL; `liveLinkLabel` returns `'Open staging site'` for staging and `'Open live site'` for live.
  - `tests/components/project-page.test.tsx`: `/projects/eastwind-beach-villas` contains `Open staging site` and `>Staging<`.
  - `tests/content/positioning.test.ts`: the "live sites" claim equals the number of Sites whose status is not `staging`; the specialism line is still `… live sites · hotels, tours, restaurants, review centres`.
  - `tests/content/proof-band.test.ts`: products 4 → `'Four products of my own'`; shipped = projects whose status is not `staging` (17) → `'Seventeen projects shipped'`; NFC projects 2 → `'Two NFC card systems'`.
- [ ] **Implement:**
  - `types/index.ts`: add `'staging'` to `ProjectStatus` and `DisplayStatus`; add `'directory'` to `ProjectSector` and to `SECTOR_ORDER` directly after `'review-centre'`.
  - `lib/display-status.ts`: `staging: 'staging'` in the map; `staging: 'Staging'` in the labels.
  - `components/ui/status-badge.tsx`: in `shape`, `staging: 'h-2 w-2 rounded-[1px] border-[1.5px] border-status-internal'` (a hollow square; internal is the filled square).
  - `lib/project-page.ts`: add `'staging'` to `LINKABLE`; export `liveLinkLabel(project: Project): string { return project.status === 'staging' ? 'Open staging site' : 'Open live site' }`.
  - `components/case-study/project-header.tsx`: render `{liveLinkLabel(project)}` instead of the literal "Open live site".
  - `lib/data.ts`: `sectorLabels.directory = 'directories'`, `sectorNames.directory = 'directory'`; `heroContent.specialism` counts `sites.filter((p) => p.status !== 'staging')`; proof points: `'Four products of my own'`, `'Seventeen projects shipped'`, `'Four payment gateways'`, `'Two NFC card systems'`.
  - Add Eastwind (`id`/`slug` `eastwind-beach-villas`, band Sites, sector `hotel`, `status: 'staging'`, `links.live: 'https://onlinecreativesolutions.com/eastwind/'`, image, description, summary, technologies from its dossier).
  - `scripts/capture-screenshots.mjs`: its filter already captures every status except auth-gated and internal, so staging is included; confirm and leave it.
- [ ] `npm run capture -- connecta-ph naga-city-guide eastwind-beach-villas`; view every PNG; drop bad ones.
- [ ] Full gate incl. build; keyless server: `/projects/eastwind-beach-villas` shows Staging and "Open staging site"; `/sitemap.xml` has 20 URLs; `/llms.txt` lists all three. Stop the server.
- [ ] Commit: `feat(projects): add Connecta PH, Naga City Guide and Eastwind, with a staging status`.

### Task 4: Connecta PH case study (human step + encoding)

- [ ] Controller: ask Christian the dossier's questions as multiple choice; record answers verbatim in the dossier.
- [ ] Encode one `CaseStudy` for `connecta-ph` in `lib/case-studies.ts` (rules of `.superpowers/sdd/task-8-brief.md`); add `'connecta-ph'` to `FLAGSHIP_SLUGS` after `giya`. The completeness test then requires it.
- [ ] Controller traces every sentence to Evidence or Answers. Gate; commit `content: add the Connecta PH case study`.

### Task 5: Docs and preview

- [ ] `CLAUDE.md`: mention the `staging` status (Staging glyph, "Open staging site") and the `directory` sector where statuses and sectors are described; `DESIGN.md`: add the staging glyph to the status section.
- [ ] Gate; commit `docs: document the staging status and directory sector`; push `v4` (preview).
