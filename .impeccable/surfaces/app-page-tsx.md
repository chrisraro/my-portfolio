---
version: 2
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
(`/hire`); "Work with me" opens `/services`.
Proof: 17 projects (15 shipped, 4 case studies), verified client places on a
real map of the Philippines, a dated route from 2020 to now. No products of his
own are claimed; Iskotify is an Online Creative Solutions project, shown as in
development with its website live. Every claim derives from `lib/data.ts` /
`lib/case-studies.ts`.
Constraints: WCAG 2.2 AA; status never by colour alone (`StatusBadge`); green
only for live; ember only for the primary action and the current position;
glass never on glass and opaque under reduced transparency, more contrast and
no `backdrop-filter`; nothing moves longer than 5 s; CSS-first motion that is
progressive enhancement; fewer than 10 client components.
Replaces: the Isarog Trail Map (Portfolio 5.0). Inspiration for the structure:
marwieang.com (a floating side panel, one reading column, compact rows, a fixed
dithered land), made his own: Mount Isarog over the Naga plain, first light,
fireflies, liquid glass. The decisions were scored with JEV: Lunad and SkimCare
stay in the inventory, night is the default theme, the Iskotify label is "In
development".

## Direction contract

THESIS: A quiet page for a person you are about to hire: one reading column of
plain rows beside a floating panel, over the one place he is from. Mount Isarog
stands behind it in pixels and first light climbs behind the summit as you
read, so a long page has somewhere to arrive. It refuses the category default,
a big claim over a grid of project cards, and keeps the work honest: counts
taken from the data, a pin only where a project's own words name the place.

OWN-WORLD: "First Light". A fixed pixel land, Isarog over the Naga plain, four
dithered layers painted with theme tokens (a dawn, a far ridge, a near plain,
a lit edge) and a few fireflies. By night, the default, a blue-black sky and a
deep ember glow; by morning, cool pale paper and a peach dawn. One material,
liquid glass (blur and saturate, a specular edge, a highlight that follows the
pointer across the panel, a lozenge that glides between links), for what floats
over the land and never for what sits on glass. One warm accent, ember, for the
primary action and where you are. Instrument Sans alone. Recognisable with the
content removed: the pixel summit, the glass panel with its lozenge, the
hairline rows.

STORY: The visitor reads the name and "Built in Bicol. Running across the
Philippines." beside the portrait, sees the two ways in (a business starts a
project, a hiring manager hires for a role) and three counts that link to what
they count. Then the page walks the proof in one column: what is in development
now, where he has worked, the case studies, more work, where the work runs, the
two ways to work together, the stack, and the form. Or they ask Chunks.

FIRST VIEWPORT (1440×900): the glass panel at the left (16rem, full height, its
links and the Contact button inside) and the column centred on what it leaves.
In the column, 96px down: the portrait on a square plate (15rem, 32px corners)
with the name in the h1, the eyebrow "Full-stack developer · Naga City,
Philippines", the headline sentence and the subheadline rising one after the
other; then "Start a project" (ember, primary) and "Hire me for a role" (clear
glass) with the availability line; then three counts (projects shipped, case
studies, places on the map). The land shows through on both sides of the
column, with the summit's dawn low at the bottom.

FORM: First Light, replacing the Isarog Trail Map (Portfolio 5.0), whose form
was chosen by Christian on the decision page (sketch:
`.impeccable/mocks/decision/model-pick.html`):
seed:03c5f4d98ec3bdbf, IMPECCABLE’S PICK over the rolled Abaca Weave.
Nine sections, in order: intro, in development, where I've worked, case
studies, more work, where the work runs, work with me, stack, plan the route.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Motion choreography

Three verbs: rise (copy and rows lift into place), pan (/projects: a legend key
glides the map to the band's pins; a pin glides the page to its row), light
(the dawn climbs behind the summit as the page scrolls).
- Intro, on load, once, under 2 s, no-preference only: the three lines of copy
  (name and eyebrow, headline, subheadline) rise 16px (`--dur-slow`, smooth,
  `--stagger-line` apart). Transform only; nothing fades.
- Rows (a role, a case study, a place's row, a stack row) rise 24px into place
  on a view timeline (`.rise-in`, `entry 0% entry 100%`), inside both gates.
  Every section is visible in the server HTML.
- First light: `.scene-dawn` rises from 96px below its place at 45% opacity to
  full on the root scroll timeline (`scroll(root block)`), inside both gates. It
  is the one scroll-linked element and decoration only.
- Fireflies: eight 4px squares at the window's edges, shown from 1280px; four of
  them twinkle twice (2.2 s each) and stop.
- Glass: the panel's highlight follows the pointer; the lozenge glides to the
  link the pointer or the keyboard is on and rests on the current page; a row's
  pane fades in under it and its thumbnail zooms to 1.12 inside its frame. Fine
  pointer and no-preference only; keyboard focus gets the pane with no travel.
- A role's full list opens to its height where `interpolate-size` is supported.
- Plates and screenshots are stills: nothing about a screenshot rises or follows
  scroll; a linked screenshot lifts 2px on a fine pointer (`.lift-card`).
- Outside the gates, and under reduced motion, nothing is offset, the dawn is
  fully risen and every animation collapses to one near-instant iteration.
