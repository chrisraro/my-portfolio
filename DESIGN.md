---
name: Christian Raro, Portfolio 4.0
description: Lobby Rack. Every project is a brochure in a resort lobby rack, printed on paper over a lagoon-night ground, with signal amber laid down as flat planes. Restrained motion: still screenshots, a gated card hover, a once-only stagger, view transitions.
colors:
  canvas: "oklch(0.2350 0.0420 232)"
  panel: "oklch(0.2750 0.0460 232)"
  ink: "oklch(0.9640 0.0110 100)"
  muted: "oklch(0.6900 0.0320 226)"
  muted-strong: "oklch(0.8500 0.0220 220)"
  line: "oklch(0.3450 0.0420 232)"
  line-strong: "oklch(0.4300 0.0420 232)"
  field-border: "oklch(0.6000 0.0350 228)"
  accent: "oklch(0.8200 0.1500 85)"
  accent-plane: "oklch(0.8200 0.1500 85)"
  on-accent: "oklch(0.2350 0.0420 232)"
  live: "oklch(0.8200 0.1500 152)"
  status-early: "oklch(0.7600 0.1200 285)"
  status-private: "oklch(0.6400 0.0300 226)"
  status-internal: "oklch(0.6400 0.0300 226)"
  canvas-light: "oklch(0.9780 0.0060 220)"
  panel-light: "oklch(1.0000 0.0000 0)"
  ink-light: "oklch(0.2500 0.0450 240)"
  muted-light: "oklch(0.4900 0.0350 235)"
  muted-strong-light: "oklch(0.3700 0.0400 238)"
  line-light: "oklch(0.9000 0.0120 225)"
  line-strong-light: "oklch(0.8200 0.0180 228)"
  field-border-light: "oklch(0.6000 0.0350 232)"
  accent-light: "oklch(0.5300 0.1150 68)"
  accent-plane-light: "oklch(0.8000 0.1500 80)"
  on-accent-light: "oklch(0.2500 0.0450 240)"
  live-light: "oklch(0.5500 0.1400 152)"
  status-early-light: "oklch(0.5200 0.1600 285)"
  status-private-light: "oklch(0.5600 0.0300 235)"
  status-internal-light: "oklch(0.5600 0.0300 235)"
typography:
  display:
    fontFamily: "Anybody, Arial, sans-serif"
    fontSize: "clamp(3.5rem, 2.2rem + 5.6vw, 7rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 75"
  display-page:
    fontFamily: "Anybody, Arial, sans-serif"
    fontSize: "clamp(2.75rem, 2rem + 3.5vw, 5rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 75"
  headline:
    fontFamily: "Anybody, Arial, sans-serif"
    fontSize: "clamp(2rem, 1.5rem + 2.2vw, 3.5rem)"
    fontWeight: 750
    lineHeight: 0.95
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 75"
  title:
    fontFamily: "Anybody, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.05
    fontVariation: "'wdth' 85"
  numeral:
    fontFamily: "Anybody, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 2rem + 2vw, 4rem)"
    fontWeight: 800
    lineHeight: 0.9
    fontFeature: "'tnum'"
    fontVariation: "'wdth' 75"
  lede:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Anybody, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.04em"
    fontFeature: "'tnum'"
    fontVariation: "'wdth' 100"
  edge-code:
    fontFamily: "Anybody, Arial, sans-serif"
    fontWeight: 500
    letterSpacing: "0.04em"
    fontFeature: "'tnum'"
    fontVariation: "'wdth' 100"
  button:
    fontFamily: "Anybody, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 650
    lineHeight: 1
    fontVariation: "'wdth' 100"
rounded:
  sm: "2px"
  md: "4px"
  DEFAULT: "6px"
  xl: "10px"
  full: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
  section: "72px"
  section-md: "112px"
components:
  button-primary:
    backgroundColor: "{colors.accent-plane}"
    textColor: "{colors.on-accent}"
    typography: "{typography.button}"
    rounded: "{rounded.DEFAULT}"
    padding: "10px 20px"
    height: "44px"
  button-primary-on-plane:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.accent}"
    typography: "{typography.button}"
    rounded: "{rounded.DEFAULT}"
    padding: "10px 20px"
    height: "44px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.DEFAULT}"
    padding: "10px 20px"
    height: "44px"
  amber-plane:
    backgroundColor: "{colors.accent-plane}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.DEFAULT}"
    padding: "32px"
  paper-panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.DEFAULT}"
    padding: "32px"
  rack-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.DEFAULT}"
    padding: "16px"
  postcard:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.sm}"
    padding: "12px"
  input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.DEFAULT}"
    padding: "10px 12px"
  filter-tab-current:
    backgroundColor: "{colors.accent-plane}"
    textColor: "{colors.on-accent}"
    typography: "{typography.button}"
    height: "44px"
    padding: "0 16px"
  filter-tab:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.muted-strong}"
    typography: "{typography.button}"
    height: "44px"
    padding: "0 16px"
  status-chip:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.muted}"
    typography: "{typography.edge-code}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  dialog:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
---

# Design System: Christian Raro, Portfolio 4.0

This file describes the system as built on the `v4.1` branch (the Lobby Rack, refined). Tokens live in
`app/globals.css` (raw oklch `L C H` triplets, `:root` light, `.dark` the
default) and are mapped to Tailwind keys in `tailwind.config.js`; motion tokens
live in `lib/motion-tokens.ts`, mirrored as `--dur-*` / `--ease-*`. The
homepage's direction contract, with the choreography it was built from, is
`.impeccable/surfaces/app-page-tsx.md`. Where this file and the code disagree,
the code and its tests win, and this file is stale.

## Overview

**Creative North Star: "Lobby Rack"**

Every project is a brochure standing in a resort lobby rack at night. You see
its top, a still screenshot of the real site; give it attention and it lifts a
hair. The page does the job his clients' brochures did before he built their
websites. The ground is a deep lagoon, the surfaces are paper (panels, cards,
folds, a rack lip, a perforated reply card, postcards), and colour arrives only
as whole flat signal-amber planes locked to the grid. A condensed variable
display face (Anybody) shouts; Figtree reads.

Motion is restrained, and has one meaning: **paper that unfolds when you pay
attention.** Three verbs only. *Unfold* reveals detail (the hero tri-fold,
case-study decisions). *Lift* answers attention (a card rising 2px, a postcard
straightening). *Slide* keeps continuity (cards glide to their new place when a
filter changes, a screenshot morphs into the case study it opens). Nothing about
a screenshot or a card is driven by scroll: screenshots are stills, and the product
spreads sit settled. Motion is CSS-first, transform-led, progressive
enhancement: outside its gates every piece sits at rest and fully visible, and
the server HTML is the finished page.

It replaced B3 Signal (graphite, sodium amber, Recursive, an ops board) and
refuses both the dev-portfolio default (dark hero, gradient blobs, a grid of
screenshot cards) and the mono terminal board B3 already was.

**Key Characteristics:**
- Lagoon-night ground, paper panels, signal amber as flat printed planes; no gradients, glows or tints.
- Two variable families: Anybody (display, condensed on its width axis) and Figtree (reading).
- Edge codes: every card, cover and product carries a printed running index ("07 / 18 · Sites").
- Fold creases (dashed 6 on 5 off), a rack lip with a paper ledge, a perforation with notched ends.
- Honest claims: the hero's AI line carries its proof (what is in use, linked where there is a page).
- Still previews: 9:16 rack cards and 3:4 frames showing the top of a full-page screenshot of the real site. Nothing scrolls inside them.
- Honest absence: a project with no public screen keeps its slot with a printed tag saying why.
- One in-flow shadow, applied only while a card is lifted.

## Colors

A committed two-tone print: lagoon and paper, with amber as the one ink that
covers whole planes. Dark is the default theme; the light theme is cool paper
with lagoon ink.

### Primary
- **Signal Amber** (two tokens, one hue): `accent-plane` fills whole planes, bright in both themes (the hero's front panel, each product's flap, the contact reply card, the current filter tab, the primary button on paper, text selection, the brand tile in the top bar); `accent` is amber used as ink and line (the focus ring, the card hover border, links such as "View all projects" and "Read the case study", small glyphs, the availability dot). In the dark theme the two are the same value; in the light theme `accent` is a deeper amber (`oklch(0.53 0.115 68)`) so it holds AA as text on paper, while `accent-plane` stays bright (`oklch(0.80 0.15 80)`). Planes are 30 to 40% of the first viewport.
- **Plane Ink** (`on-accent`): the only text colour on an amber plane. Lagoon ink in the dark theme, deep ink in the light theme (the light plane is bright, so ink, not white).

### Tertiary
- **Live Green** (`live`): the live status glyph and its pulse, nothing else.
- **Ube Violet** (`status-early`): the early-access ring glyph, nothing else. Violet sits well away from amber, so the ring is never mistaken for brand.
- **Slate Glyph** (`status-private`, `status-internal`): the lock, the filled square (internal) and the outlined square (staging).

### Neutral
- **Lagoon Night** (`canvas`, CSS `--bg`): the page ground; also form-field fill and the inverted primary on a plane.
- **Paper** (`panel`): cards, leaves, panels, the rack ledge, the dialog, toasts, chat.
- **Paper Ink** (`ink`): text, headings, the route line's stops.
- **Margin Note** (`muted`): metadata, edge codes, eyebrows, placeholders.
- **Lede Ink** (`muted-strong`): ledes, summaries, descriptions, inactive nav and tabs.
- **Hairline** (`line`): card borders, dividers, the header and footer rules.
- **Crease** (`line-strong`): fold creases, the rack lip, perforation dots, control borders, the preview track.
- **Field Border** (`field-border`): text-field borders only, 3:1 against canvas and panel (WCAG 1.4.11).

### Named Rules
**The Flat Plane Rule.** Colour arrives as whole planes locked to the grid: no outlines on planes, no tints, no gradients. Removing a plane must break the composition.

**The Plane Ink Rule.** On an amber plane, text is `on-accent` and focus is drawn in `on-accent` (`.on-plane :focus-visible`). Planes and the primary button fill with `accent-plane`, never `accent`; ink on a plane is forbidden, and an accent ring on a plane disappears (`tests/design/contrast.test.ts` holds all three).

**The Green Means Live Rule.** `live` and `.live-pulse` appear only inside `StatusBadge` (`tests/design/green-means-live.test.ts`). Brand and availability use `accent`.

**The Contrast Ledger Rule.** Every token is a raw oklch triplet, one per line; `tests/design/contrast.test.ts` parses them and checks WCAG AA in both themes (text 4.5:1, glyphs and focus 3:1, field borders 3:1, `on-accent` on `accent-plane`, `accent` as text on paper, early-access violet apart from amber). No raw hex in components, no `dark:` colour pairs. The one hex copy is `lib/og-palette.ts`, held to `.dark` by `tests/design/og-palette.test.ts`.

## Typography

**Display Font:** Anybody (variable `wght` and `wdth`, loaded with `axes: ['wdth']`), `--font-display`, fallback plain Arial
**Body Font:** Figtree (variable `wght`), `--font-sans`, fallback plain Arial
**Label/Mono Font:** none. Edge codes, dates, domains and counts are Anybody at normal width with tabular numerals.

**Character:** a brochure's condensed headline voice over a friendly, plain reading face. Anybody carries everything that is printed on the object (headings, numerals, labels, buttons); Figtree carries everything you read.

Both load through `next/font/google` with `display: 'swap'` and
`adjustFontFallback: false`: the fallback is plain Arial, not a metric-adjusted
`local()` face per weight and size, which cost about 200ms of main thread on the
first layout (`tests/design/performance.test.ts`).

### Hierarchy
- **Display** (800, wdth 75, `clamp(3.5rem, 2.2rem + 5.6vw, 7rem)`, 0.9): `.text-fluid-h1`. The hero H1 is additionally sized to its panel (`.hero-title`, `clamp(2.75rem, 21cqi, 7rem)` in a container) so it never breaks out of the plane.
- **Display, read pages** (800, wdth 75, `clamp(2.75rem, 2rem + 3.5vw, 5rem)`, 0.92): `.text-page-h1` on `/projects`, project pages and the 404.
- **Headline** (750, wdth 75, `clamp(2rem, 1.5rem + 2.2vw, 3.5rem)`, 0.95): `.text-fluid-h2`, section titles and product names on their flaps.
- **Title** (700, wdth 85, 1.5rem, 1.05): `.text-title`, card names, h3s, case-study section headings.
- **Numeral** (800, wdth 75, `clamp(2.5rem, 2rem + 2vw, 4rem)`, tabular): `.text-numeral`, the hero's proof band. Plain numerals ("4"), never zero-padded, never counted up.
- **Lede** (Figtree 400, 1.1875rem, 1.55): `.text-lede`.
- **Body** (Figtree 400, 1rem, 1.6): prose held to about 60 to 70ch.
- **Label** (600, wdth 100, 0.8125rem, 0.04em, tabular, sentence case): `.eyebrow`, in `muted` (in `on-accent` on a plane).
- **Edge code** (500, wdth 100, 0.04em, tabular): `.edge-code`, sized per use (`text-xs` on cards, `text-sm` for tier headings).
- **Button** (650, wdth 100, 1rem, 1): `.button-label`.

h1/h2 default to wdth 75 and h3/h4 to wdth 85 in the base layer, all with `text-wrap: balance`.

### Named Rules
**The Two Families Rule.** Anybody and Figtree, nothing else. There is no `font-mono` key; `tests/design/legacy-tokens.test.ts` fails a stray one.

**The Printed Label Rule.** Eyebrows are edge-code labels from `lib/data.ts`, without the old `// ` prefix.

## Layout

One container everywhere: `mx-auto max-w-6xl px-5 sm:px-8`. Sections pad
72px below, 112px from 768px. The heading stack (`SectionHeading`) is eyebrow,
12px, h2, 40px, content. Spacing steps in use: 4, 8, 12, 16, 24, 32, 48, 72, 112.

Homepage order (`app/page.tsx`): Hero tri-fold, Products (`#work`), the Rack
(`#systems`), Case studies, Field log, Route line (`#changelog`), Stack, Contact
(`#contact`).

- **Hero:** `1.3fr | crease | 0.85fr | crease | 0.85fr` from 768px, at least 640px tall. Below 768px the panels stack (amber front, portrait as a 4:3 band, proof panel) and the creases turn horizontal.
- **Product spreads:** `4fr | crease | 8fr`, flap side alternating per product; the leaf holds the text and a 3:4 preview (15 to 17rem).
- **Rack tiers:** 4 cards per row from 1024px, 3 from 640px; below 640px a horizontal scroll-snap strip with cards at 78% width.
- **Case-study covers:** 3 columns at 1024px, 2 at 640px, 1 below.
- **Route line:** horizontal lanes (Work, Education) from 768px, vertical below.
- **Contact reply card:** `5fr | perforation | 7fr`.
- **Project page:** an amber front-cover header (`7fr | crease | 5fr`), then a read spread: prose leaf on the left, a fold crease, and a sticky preview rail on the right (96px from the top) from 1024px. Below 1024px the rail drops in after "The brief" on flagships, straight after the header on short pages.

The sticky top bar is about 101px below md (two rows) and 64px from md, so
`html` carries `scroll-padding-top` of 7rem / 4.75rem and anchor sections a
0.5rem scroll margin (`tests/design/sticky-header.test.ts`).

Far sections (case studies, field log, route, stack, case-study sections) carry
`.defer-render` (`content-visibility: auto`, intrinsic size `auto 600px`); rack
tiers use `.defer-render-lift`, which lets paint run 3rem out so a lifted card
and its shadow are not clipped. Screenshot frames (`.project-shot__frame`) skip
rendering until they near the viewport. The hero, products, rack section and contact card are never
deferred. Before an in-page jump the top bar adds `.render-all` for 1.5s so the
jump is measured against real heights.

## Elevation & Depth

Flat paper by default. Depth is conveyed by surface (canvas under panel, amber
planes over both), by creases and the rack lip, and by 3D folds in perspective
(`perspective: 1600px` on the hero and each spread). Shadows exist only as a
response to state or for floating layers.

### Shadow Vocabulary
- **Lift** (`--shadow-lift`: `0 18px 30px -18px oklch(0.12 0.03 232 / 0.55)`): the one in-flow shadow, only while a catalog card (`.lift-card`) or postcard is lifted.
- **Overlay** (`--shadow-overlay`: `0 24px 48px -12px oklch(0.12 0.03 232 / 0.5)`): the LivePreview dialog, chat, toasts.

### Named Rules
**The Lifted-Only Rule.** Nothing in the page flow casts a shadow at rest.

## Shapes

Paper is square-ish. `--radius` is 6px: cards, panels, buttons and fields at
6px (`rounded`), postcards and staging tags at 2px (`rounded-sm`), the dialog
at 10px (`rounded-xl`), chips and the status pill at full round. Joined panels
round only their outer corners (a flap's inner edge meets the crease square).

Recurring geometry:
- **Creases** (`.crease-v`, `.crease-h`, `.crease-fold`): 1px dashes, 6 on 5 off, in `line-strong`; `.crease-fold` runs across when panels stack and upright from 768px.
- **Rack lip:** a 2px `line-strong` rule over a 14px `panel` ledge each card stands on.
- **Perforation:** 2px dotted `line-strong` with a 20px half-circle notch (canvas-coloured) at each end; across when stacked, upright from 768px.
- **Printed tag:** a dashed `line-strong` box on canvas for honest absence (`NoPreviewTag`, the 404's empty slot).
- **Staging tag:** an edge-code label on canvas, 2px radius, rotated 8deg in a rack card's corner.

## Components

### Buttons
- **Shape:** gently squared (6px), at least 44px tall, Anybody 650 at normal width.
- **Primary** (`.button-primary`, defined once in `globals.css`): amber fill, `on-accent` text, 10px 20px. On an amber plane (`.on-plane`) it inverts to a lagoon fill with amber text. "Start a project" and "Send message" are the primaries; `tests/design/primary-button.test.ts` requires every primary CTA to use the class and forbids composing one from a fill and padding.
- **Hover / Press** (`.press`): lifts 2px, sinks 1px and scales to 0.98 on press, fast/sharp; colour changes fast/sharp. The trailing arrow (`.arrow-nudge`) slides 8px right on hover of its link or button.
- **Secondary:** a `line-strong` outline with ink text that turns accent on hover ("Live preview", "Open live site"). On a plane the outline and text are `on-accent` ("Résumé").
- **Text links:** `.link-draw`, an underline drawn from the left on hover or focus and leaving to the right; `[aria-current='page']` keeps it drawn.

### Chips
- **Stack chips:** edge-code, full round, `line` border with `muted-strong` text; WordPress, the specialism, sits on a canvas chip with a `line-strong` border (never an amber outline). The hero shows `heroContent.stack` as chips.
- **Status pill:** on an amber flap or header the `StatusBadge` sits in a full-round `panel` pill.

### Cards / Containers
- **Corner Style:** 6px; postcards 2px.
- **Background:** `panel` on `canvas`; amber planes for flaps and the reply card.
- **Shadow Strategy:** none at rest; Lift (a pseudo-element faded in by opacity) while hovered.
- **Border:** 1px `line`.
- **Internal Padding:** 16px (rack card top), 24px (covers), 24 to 40px (planes and leaves).

### Inputs / Fields
- **Style:** canvas fill, 1px `field-border`, 6px radius, 10px 12px padding, Figtree; labels above in edge-code `muted-strong`.
- **Focus:** the global ring (2px accent, 3px offset) plus the border turns accent.
- **Error:** `aria-invalid` turns the border ink; the message sits below with an octagon glyph in ink.

### Navigation
- **Top bar:** sticky, canvas, a `line` rule below. An amber initials tile and the name in Anybody bold at wdth 75. Nav links in Anybody 600 (wdth 85 below md, 100 from md), `muted-strong` turning ink, with `.link-draw`; the current route keeps its underline. Availability (accent dot plus edge code) from lg; a 44px theme toggle with `.press`. Below md the bar is two rows and the nav scrolls sideways inside a padded strip so focus rings are not clipped.
- **Filter tabs** (`/projects`, `?band=` links): index tabs on a 2px `line-strong` lip; the current tier is an amber plane with `on-accent` text (`aria-current="true"`), the rest paper with `muted-strong` text.
- **Footer:** a hairline, the name in Anybody, an edge-code colophon ("Printed in Naga City"), social links with `.link-draw`.

### Status Badge (signature)
`StatusBadge` is the only way status reaches the page: a glyph shape plus a text
label, edge-code `text-xs`, `muted`. Live: a filled green dot with the
twice-then-stop pulse. Early access: an ube-violet ring. Private: a lock. Internal:
a filled square. Staging: an outlined square. `compact` hides the label visually
but keeps it in the accessibility tree.

### Rack Card and Rack Tier (signature)
`RackTier` (`components/ui/rack-tier.tsx`): an edge-code heading with its count,
then a row of cards on a lip, shared by the homepage rack and `/projects`.
Within a tier, cards with a screenshot lead. The tier is named (`--vt-tier`) so
it glides when a `/projects` filter changes.

`RackCard` (`components/ui/rack-card.tsx`): a 9:16 paper card standing whole on
the shelf, one link to the project page. Its top 44% shows the edge code, name,
`StatusBadge`, a two-line summary and the domain; the rest is a decorative
`ProjectShot` (the top of the site) or a `NoPreviewTag`. Nothing is sunk, clipped
or reserved for a lift. A card with no public screen is flat from 640px: square,
the reason printed in its text block. Below 640px the cards sit in a
scroll-snap strip. Each card's slot is named (`--vt-card`) for the filter
re-layout, and its shot is marked (`data-vt-shot`) as the start of the
card-to-case-study morph.

**Hover (`.lift-card`)**, shared by rack cards, product screenshots and
case-study covers: on a fine pointer, with motion allowed, the card lifts 2px,
its border turns `accent` and its screenshot scales to 1.02 inside a clipping
frame, fast/smooth. The Lift shadow is a pseudo-element faded in by opacity, so
`box-shadow` is never animated. Keyboard focus turns the border `accent` beside
the global ring, with no travel, in every mode.

**Entrance (`.reveal-stagger`)**: from 640px, where timeline triggers exist, a
card rises its last 16px once as it enters the viewport, each visible column
`--stagger-card` (60ms) after the one before (3 columns from 640px, 4 from
1024px). It is a trigger, not a scrub: it plays forward once and never reverses,
never plays on a card already in view at load or after a filter change, and
moves by transform only, so the server HTML is the finished rack.

### Product Spread (signature)
Each product is an open fold-out spread: an amber flap (edge code, name in
headline type, summary, status pill) joined at a crease to a paper leaf
(description, "Live preview" when embeddable, "Read more", the domain, and a 3:4
`ProjectShot`). Flaps alternate sides. The spread sits settled: nothing about it
moves with scroll (a scrubbed flap and leaf left the crease seam out of line).
On a fine pointer, hovering the spread tilts the flap 4deg on its hinge,
inviting the open.

### ProjectShot (signature)
`components/ui/project-shot.tsx` (server). A still, fixed-aspect (3:4 or 9:16)
frame over a full-page screenshot (`<id>-full.webp`, 1440 wide, at most 6000px
tall), `object-fit: cover` from the top, `quality={50}`, never `priority`. There
is no scroll inside it, no cue and no progress rule; nothing about it follows
the page's scroll (`tests/design/catalog-motion.test.ts` holds this).
- **Hover:** as a link it is a `.lift-card` (see Rack Card).
- **Accessibility:** a named `role="img"` with no link; a named link with an href ("..., opens project page"); out of the tab order and the tree when it duplicates a visible link (`duplicateLink`); silent inside a rack card (`decorative`).
- **Morph ends:** `slug` marks the shot as the morph's start (`data-vt-shot`); `morphTarget` gives the case-study header shot its shared `view-transition-name`. Only one per page.
- **Rendering:** the frame carries `content-visibility: auto`, so an off-screen shot is not requested until it nears the viewport.

### LivePreview (signature)
`components/ui/live-preview.tsx` (client). A secondary "Live preview" button,
shown only where `isEmbeddable(project)` is true (from `lib/embeddable.json`),
opens a dialog portalled to `<body>`: canvas scrim at 90%, a 10px paper dialog
with the Overlay shadow, a title (with a "Staging site" tag for staging), a
Desktop / Mobile toggle (`aria-pressed`), an "Open site in a new tab" link, and
Close. Every other child of `<body>` is made inert; focus moves to Close, Tab
cycles inside, Escape and the scrim dismiss, focus returns to the trigger. The
iframe is sandboxed (`allow-scripts allow-same-origin allow-popups`, no forms),
hidden and out of the tab order until it loads; after 7.2s (crawl × 6) it is
called failed and the new-tab link becomes the amber fill. A polite status
region announces loading, loaded and failed. Motion: `AnimatePresence
mode="wait"`; the scrim fades and the dialog rises 16px at normal/smooth, and
exits at fast. The width toggle squeezes the frame with a WAAPI `scaleX` (token
duration and easing) and swaps the width once at the end. Under reduced motion
the dialog only fades (fast) and the width swaps at once.

### Hero Tri-fold (signature)
Front panel: the amber plane (`.on-plane`, the LCP surface, static from the
first frame) with the eyebrow, H1, the AI line ("AI-enabled engineer and
automations: Claude Code, Codex, Qwen Code, n8n") and its proof ("In use:", one
item per line, linked where a page exists: the site's own assistant on Groq,
Connecta PH's case study; all from `heroContent`), the lede, specialism and the
CTA row. Middle: the
portrait, full bleed, opening `ImageLightbox`. Back: the proof band (numerals
over labels; screen readers hear the original sentence) and the core-stack chips
on paper.

### Other surfaces
- **Case-study covers:** closed tri-folds, paper with an upright crease just inside the right edge, edge code, title, sector, the brief's first sentence, role, "Read the case study". The whole cover is a `.lift-card` link.
- **Field log:** postcards (2px radius, 12px paper border, captions always visible) resting at -1.5deg and +1deg alternately, interleaved with testimonial cards; photos open `ImageLightbox`.
- **Route line:** a 2px `line-strong` line with ink-ringed stops, dates in edge code.
- **Stack:** the brochure's "amenities" back panel, categories in columns on dotted leaders, in the order `lib/data.ts` gives them: WordPress & e-commerce (the specialism, first and widest), Frontend, Backend, AI & automation (Claude Code, Codex, Qwen Code, n8n, Groq / LLM APIs), Tools & DevOps. No scroll motion.
- **Contact reply card:** an amber plane (heading, availability, email, résumé, Facebook, location) perforated to a paper form leaf; "Send message" is the primary.
- **404:** an empty rack slot, the lip and ledge with a dashed slot and a printed tag.
- **Chat (Chunks) and toasts:** paper panels with the Overlay shadow; typing dots in `muted`; enter and exit with short fades gated by `useReducedMotion`.

### Motion
Tokens (`lib/motion-tokens.ts`, mirrored in `:root`; `tests/design/motion-tokens.test.ts` keeps them in step):

| Token | Value | CSS |
|---|---|---|
| duration fast / normal / slow / crawl | 0.18s / 0.35s / 0.6s / 1.2s | `--dur-fast` … `--dur-crawl` |
| easing smooth | `cubic-bezier(0.22, 1, 0.36, 1)` | `--ease-smooth` |
| easing sharp | `cubic-bezier(0.4, 0, 0.2, 1)` | `--ease-sharp` |
| distance sm / md / lg / xl | 8 / 16 / 24 / 40px | (JS only) |
| springs snappy / gentle | 400/32, 180/26 | (JS only) |

**Hero sequence** (CSS keyframes on load, no JS, 1.9s, once; timeline variables on `.hero-fold`):
- 0ms: H1 words rise 0.35em → 0, slow/smooth, 90ms stagger. Transform only, painted from frame one, so LCP is unaffected.
- 250ms: lede, specialism and CTAs rise 16px with opacity 0.01 → 1, normal/smooth.
- 400ms / 650ms: middle and right panels unfold `rotateY(88deg) → 0` from their left hinge, slow/smooth; the free edge recedes, so a panel opens from behind the front one and never swings past the hero.
- 450ms / 700ms: the two creases draw `scaleY(0 → 1)` from the top, crawl/smooth.
- 1100ms: proof items rise 8px, 60ms stagger, normal/smooth.
- Below 768px panels unfold `rotateX(-88deg) → 0` from their top edge and creases draw across.
- Reduced motion: every piece in its final state at first paint, creases drawn.

**Scroll reveals** (`animation-timeline: view()`, range `entry 10% cover 30%`, all inside `@supports (animation-timeline: view())` and `@media (prefers-reduced-motion: no-preference)`; transform only, so nothing is painted or measured faded). They are entrances for text and furniture; no screenshot and no card is scroll-driven:

| Class | Where | Motion |
|---|---|---|
| `.reveal` | generic | rise 24px |
| `.reveal-stagger` | rack card | rise 16px once on a scroll trigger, columns 60ms apart (from 640px; see Rack Card) |
| `.reveal-cover` | case-study cover | rise 24px, staggered by `--i` x 10% |
| `.reveal-postcard` | postcard | slide 40px at its resting tilt |
| `.reveal-fold` | case-study decision | fold down `rotateX(-22deg)` from its crease |
| `.reveal-reply` | contact card | rise 40px |
| `.reveal-perf` | perforation | draw down (across below 768px) |
| `.reveal-route` / `.reveal-stop` | route line | the line draws across its section's named timeline; stops pop from `scale(0.6)` as it passes |

**Hover / press:** `.press` (2px lift, press sink), `.link-draw`, `.arrow-nudge`, `.lift-card` (2px lift, accent border, shot 1.02; fine pointer and no-preference only), the product flap tilt, the postcard straighten-and-lift (8px with Lift). Colour transitions fast/sharp.

**View transitions** (`components/ui/view-transitions.tsx`, a client island mounted once in `app/layout.tsx` inside `Suspense`; click rules in `lib/view-transition.ts`, tested without a browser):
- *Filter FLIP:* a `/projects` filter tab change names every card (`card-<slug>`) and tier heading (`tier-<heading>`) for the length of the change (`.vt-filter` on `<html>`), so they glide from old place to new, normal/smooth.
- *Card to case study:* a click on a project link names the clicked screenshot `shot-<slug>` and morphs it into the case study's header shot (the static `morphTarget`), cropping from the top and never stretching; the rest cross-fades, the old page out fast before the new one fades in. The morph runs only if the header shot is mostly in the viewport (on a phone it sits below the cover, so the page just cross-fades), waits up to 300ms for it to decode, lands at the top and moves focus to the h1.
- *Safety:* feature-detected (`startViewTransition`); skipped under reduced motion; modified or non-primary clicks, other origins and other routes are left to next/link; a 2.5s commit timeout; a failed push falls back to a full navigation; only the latest of rapid clicks cleans up its names. `::view-transition` never takes the pointer. Without JavaScript every link is a plain link.

**Bounded loops:** the live pulse runs twice (2.4s each) and stops. The chat typing dots and the "Sending" spinner run only while a request is pending.

**Reduced motion:** reveals and the hero are switched off by their gates and explicitly reset in the `reduce` block; hover transforms are removed (colour and underline still change, instantly); the stagger and view transitions are off (the island navigates without one, and the view-transition animations are zeroed); the live pulse is removed; then every animation and transition collapses to one 0.001ms iteration. `useReducedMotion` drops offsets in the `motion/react` pieces.

## Do's and Don'ts

### Do:
- **Do** take every colour from the Tailwind keys (`canvas`, `panel`, `ink`, `muted`, `muted-strong`, `line`, `line-strong`, `field-border`, `accent`, `on-accent`, `live`, `status-*`) and keep `globals.css` triplets one per line.
- **Do** put text and focus on an amber plane in `on-accent`, and mark the plane `.on-plane` when it holds focusable controls.
- **Do** use `.button-primary` with `.press` for every primary call to action.
- **Do** render status only through `StatusBadge`.
- **Do** give every project a slot: a still `ProjectShot` when a full shot exists, a printed `NoPreviewTag` when it does not.
- **Do** take durations and easings from `lib/motion-tokens.ts` or `--dur-*` / `--ease-*`, and gate every scroll-driven animation behind `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`.
- **Do** keep proof (products, the rack) visible in the server HTML: transform-only motion, no opacity entrance.
- **Do** fill planes with `accent-plane` and use `accent` for text, rings and lines; keep violet for early access only.
- **Do** keep catalog hover on `.lift-card`, behind the fine-pointer and no-preference queries.
- **Do** keep the hero sequence under two seconds and everything bounded under five.

### Don't:
- **Don't** use gradients, glows, tints or outlines on planes; colour is a whole flat plane or nothing.
- **Don't** set ink text on amber, or use amber as a text colour on an amber-adjacent plane.
- **Don't** use green anywhere outside `StatusBadge`'s live glyph.
- **Don't** add a third typeface or a mono family.
- **Don't** cast a shadow from anything at rest in the page flow.
- **Don't** fade proof in, count numbers up, add parallax, drive a screenshot or card from scroll, or loop anything past five seconds.
- **Don't** animate `box-shadow`; fade a pseudo-element's opacity instead.
- **Don't** import `framer-motion`, render `motion.*`, or use `useAnimate`; client motion is `m.*` inside a strict `LazyMotion`.
- **Don't** mark a preview image `priority` or fake a screenshot for a gated or internal project.
- **Don't** hardcode portfolio content (headings, eyebrows, facts) in components.

## Raster Provenance

| Raster | Source | Provenance |
|---|---|---|
| `public/assets/images/projects/<id>.png`, `<id>-mobile.png` | Each project's live site | `npm run capture` (`scripts/capture-screenshots.mjs`, system Chrome/Edge via `puppeteer-core`), 1440×900 and a phone viewport. |
| `public/assets/images/projects/<id>-full.webp` | Each project's live site | `npm run capture -- --full`: 1440 wide, whole page clipped at 6000px, WebP quality 70, overlays dismissed. Dropped shots are listed in `FULL_SKIP` so a rerun does not bring them back. |
| `public/assets/images/gallery/*.jpg` | Christian's own photographs | Field-log postcards; captions in `galleryImages`. |
| `public/assets/images/about/profile-hiking.jpg` | Christian's own photograph | The hero portrait. |
| `/opengraph-image` | `app/opengraph-image.tsx` | `next/og` on the edge runtime from `heroContent`, in the dark palette (`lib/og-palette.ts`) and Recursive (static instances in `app/fonts/`). |

Auth-gated and internal projects (the OCS control panel, the BeachBus NFC
system) have no screenshot; their interiors need client clearance.

## Open Points

Recorded, not resolved.

1. **Homepage performance is 92, not 95.** Lighthouse mobile after the SP2 fixes: `/` 92 (LCP about 3.3s, the hero lede, network-bound), `/projects` 96, a flagship 91 to 97 (machine noise); accessibility 100 on all three. The remaining gap on `/` is bytes before first paint: about 470KB (roughly 140KB of JS, 75KB of fonts, the 92KB portrait and one product shot). `tests/design/performance.test.ts` pins the fixes already made (priority only on first-viewport images, preview shots at quality 50 and never prioritised, motion's engine in a lazy chunk via `LazyMotion` + `m.*`, no `useAnimate`, plain Arial fallbacks, no next-themes transition suppression on load, `content-visibility` on off-screen frames and far sections, the hero, work and contact never deferred, transform-only reveals).
2. **The social card still renders in Recursive.** `next/og` needs static font files and cannot use `next/font`'s variable Anybody and Figtree, so the OG image keeps B3's Recursive instances in `app/fonts/` (its colours follow the Lobby Rack dark palette, amber included). Replacing it needs static Anybody/Figtree TTFs committed under `app/fonts/`.
3. **The rack scrolls sideways below 640px.** Each tier is a horizontal scroll-snap strip on phones; the a11y gate accepted it as P2 given the "View all projects" link, but a vertical stack would remove the hidden overflow.
4. **View transitions are Chromium-first.** `startViewTransition` is feature-detected; without it (and under reduced motion) navigation is instant and nothing else changes. The card morph is skipped when the case-study header shot is not in view (phones).
5. **The stagger needs scroll triggers.** `timeline-trigger` is new; where unsupported, cards simply sit at rest.
6. **The refinement awaits review.** The Lobby Rack world was chosen in an unattended run (direction contract, "Unresolved") and refined on `v4.1` (amber, still shots, restrained motion); it stands until Christian signs off on the v4.1 preview.
