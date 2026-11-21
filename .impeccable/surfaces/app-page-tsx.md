---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/projects/page.tsx", "app/projects/[slug]/page.tsx", "app/services/page.tsx", "app/services/[slug]/page.tsx", "app/about/page.tsx", "app/hire/page.tsx", "app/not-found.tsx"]
---

# Homepage surface brief

Scope: `/` (Persuade). `/projects`, `/projects/[slug]` and the 404 inherit the
world; `/services` and its three pages are Persuade, `/about` is Read, `/hire`
is Persuade with Read sections, all in the same world.
Audience and job: freelance clients (Philippine hotels, tour and shuttle
operators, restaurants, review centres) and engineering hiring managers,
equally; each decides within one screen whether this is their developer and
which path is theirs.
Action: Start a project (`#contact`). Second path: Hire me for a role
(`/hire`); the fork's business path opens `/services`.
Proof: 20 projects (four own products, six case studies), verified client
places on a real map of the Philippines, a dated route from 2020 to now. Every
claim derives from `lib/data.ts` / `lib/case-studies.ts`.
Constraints: WCAG 2.2 AA; status never by colour alone (`StatusBadge`); green
only for live; trail red only for the primary action and the current
position; nothing auto-moves longer than 5 s; CSS-first motion that is
progressive enhancement; fewer than 10 client components.
Replaces: Lobby Rack (Portfolio 4.0). Spec:
`docs/superpowers/specs/2026-11-20-portfolio-v5-revamp-design.md`.
Resolved in S6: the contour pointer shift (.trailhead-contours). The screenshot appear-once rise was tried in S6 and removed: a trigger-held animation rests offset and the minifier collapses the trigger range; screenshots are stills.

## Direction contract

THESIS: The work as a survey map you walk: one red trail from a trailhead in
Naga City, every project a waypoint at a place it really served. It refuses
the category default, a big claim over a grid of project cards, and keeps the
map honest: a pin only where a project's own words name the place.

OWN-WORLD: "Isarog Trail Map". Pale green-grey survey paper by day, dark field
paper by night, near-black ink, olive contour linework, and one trail red that
marks only the primary action and where you are. Survey plates: every photo
and screenshot sits in a plate at one scale on one baseline: pale paper by day, and at night dark paper one step up from the ground. Archivo only:
condensed uppercase for display and map labels, normal width for reading,
tabular numerals for dates and counts. Recognisable with the content removed:
contours, a solid red trail, ringed and dotted pins, spot heights, a frosted
legend card.

STORY: The visitor reads "Built in Bicol. Running across the Philippines.",
sees the portrait at the trailhead and two paths: a business starts a project,
a hiring manager hires for a role. The elevation strip proves the route
(products, projects shipped, case studies, places; 2020 to now). The field map
shows where the work runs; the own products and six trail journals show how.
They plan the route in the form, or ask Chunks.

FIRST VIEWPORT (1440×900): the floating legend card at the top. Left, over
contours: the eyebrow "Full-stack developer · Naga City, Philippines", then the
headline in condensed uppercase Archivo, three authored lines rising one at a
time, about 80-110px; the subheadline (19px) under it; "Start a project" (trail
red, primary) and "Hire me for a role" (ink outline) near y 640. Right: the
hiking portrait on a survey plate, about 350×440, its top near y 150; the red
trail draws out of the plate toward the bottom left on load. The elevation
strip's heading sits on the bottom edge, inviting the scroll.

FORM: Isarog Trail Map, seed:03c5f4d98ec3bdbf, IMPECCABLE’S PICK over the rolled Abaca Weave
(Christian chose it on the decision page; sketch:
`.impeccable/mocks/decision/model-pick.html`).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Motion choreography

Three verbs: draw (trails and routes stroke in), rise (lines lift into place,
one at a time), pan (/projects: a legend key glides the map to the band's pins; a pin glides the page to its plate).
- Trailhead, on load, once, under 2 s, no-preference only: headline lines rise
  `translateY(0.35em) → 0` (slow/smooth, `--stagger-line` apart); the
  subheadline and buttons rise 16px at 250ms; the trail draws out of the plate
  from 300ms over `--dur-draw`. Nothing fades.
- Between sections: short trail segments draw on their own view timeline
  (`entry 10% cover 45%`), inside both gates.
- Elevation strip: the "you are here" marker travels on its own `--elevation`
  view timeline (both gates) and rests at now; nothing follows the page's scroll.
- Contour shift (`.trailhead-contours`): under `(hover: hover) and (pointer: fine)`
  and no-preference only, the hero contours drift 8px toward the half the
  pointer rests on (`.trailhead:has(.trailhead-copy:hover)` /
  `:has(.trailhead-plate:hover)`), on `--dur-crawl`. CSS only; nothing on touch;
  the trail does not move.
- Plates are stills: nothing about a plate or screenshot rises or follows scroll.
  The appear-once rise was tried in S6 and removed (a trigger-held animation
  rests offset; the minifier collapses the trigger range).
- Outside the gates the trail is fully drawn and nothing is offset.
