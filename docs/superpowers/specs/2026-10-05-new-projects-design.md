# Sub-project 1 — Three new projects

Date: 2026-10-05 · Branches: `main` then `v4` · Status: approved in brainstorming, awaiting spec review

First of three sub-projects (then: motion redesign with live previews). Adds
Connecta PH, Naga City Guide and Eastwind Beach Villas, and a Connecta PH case
study.

## 1. Decisions

| # | Decision | Choice |
|---|---|---|
| D1 | Order | New projects first; the motion redesign and live previews follow as their own spec. |
| D2 | Eastwind | New data status `staging`, displayed as "Staging" with its own glyph and label. Live link points at the staging URL until the domain lands. |
| D3 | Naga City Guide | New sector `directory`. |
| D4 | Role | Christian is sole developer on all three; Connecta PH is his own product. |
| D5 | Case study | Connecta PH gets a full case study (sixth flagship); the other two get short pages. |

## 2. The projects

| id / slug | Title | Band | Sector | Status | Live URL |
|---|---|---|---|---|---|
| `connecta-ph` | Connecta PH | Products | product | live | https://connectaph.vercel.app |
| `naga-city-guide` | Naga City Guide | Sites | directory | live | https://nagacityguide.com |
| `eastwind-beach-villas` | Eastwind Beach Villas | Sites | hotel | staging | https://onlinecreativesolutions.com/eastwind/ |

Descriptions, summaries (≤56 chars, the existing rule) and technologies are
written from each site's public facts and a read-only research pass (crawl;
repo for Connecta; read-only Novamira for Naga City Guide where connected).
`dates` only where Christian confirms them.

## 3. Where changes land

- **`main`:** Connecta PH and Naga City Guide, in main's model (no sector or
  summary). Content fixes land on main first (CLAUDE.md).
- **`v4`:** merge main, then add v4 fields (sector, summary), Eastwind, the
  `staging` status and the `directory` sector. No fifth status on main's
  outgoing design.

## 4. Changes on v4

- `types/index.ts`: `ProjectStatus` gains `'staging'`; `DisplayStatus` gains
  `'staging'`; `ProjectSector` gains `'directory'`; `SECTOR_ORDER` places it
  after `tours`.
- `lib/display-status.ts`: `staging → staging`, label "Staging".
- `components/ui/status-badge.tsx`: a distinct glyph for staging (shape, not
  colour alone; an existing non-`live` token, contrast-tested).
- `lib/project-page.ts`: `canLinkLive` allows `staging`; the header link reads
  "Open staging site" for staging projects.
- `lib/data.ts`: `sectorLabels` / `sectorNames` gain `directory`
  ("directories" / "directory").
- `scripts/capture-screenshots.mjs`: captures staging projects too.
- Screenshots: `<id>.png` and `<id>-mobile.png` for the three.
- Derived automatically: short pages, sitemap (20 URLs), JSON-LD, llms files,
  chat prompt, proof band (live-site count and sector line).

## 5. Connecta PH case study

Same pipeline as Phase 3: one read-only research agent (live site, repo),
gitignored dossier, multiple-choice questions to Christian, encoding with no
unsourced sentence and no unapproved number. `FLAGSHIP_SLUGS` gains
`connecta-ph`; the completeness test follows.

## 6. Testing

- Display status: `staging` maps and labels; StatusBadge renders its own glyph
  and the word "Staging".
- Green-means-live guard still holds (staging never uses `live`).
- Sector names cover `directory`; proof band recounts from data.
- Project page: Eastwind shows "Open staging site"; the new pages render.
- Sitemap: 20 URLs. Existing content, privacy and design tests unchanged.

## 7. Out of scope

The motion redesign and live previews (sub-project 2); case studies for Naga
City Guide or Eastwind.
