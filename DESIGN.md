---
name: Christian Raro, Portfolio 4.0
description: Lobby Rack. Every project is a brochure in a resort lobby rack, printed on paper over a lagoon-night ground, with bougainvillea magenta laid down as flat planes.
colors:
  canvas: "oklch(0.2350 0.0420 232)"
  panel: "oklch(0.2750 0.0460 232)"
  ink: "oklch(0.9640 0.0110 100)"
  muted: "oklch(0.6900 0.0320 226)"
  muted-strong: "oklch(0.8500 0.0220 220)"
  line: "oklch(0.3450 0.0420 232)"
  line-strong: "oklch(0.4300 0.0420 232)"
  field-border: "oklch(0.6000 0.0350 228)"
  accent: "oklch(0.7600 0.1600 352)"
  on-accent: "oklch(0.2350 0.0420 232)"
  live: "oklch(0.8200 0.1500 152)"
  status-early: "oklch(0.8600 0.1300 95)"
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
  accent-light: "oklch(0.5100 0.2000 352)"
  on-accent-light: "oklch(1.0000 0.0000 0)"
  live-light: "oklch(0.5500 0.1400 152)"
  status-early-light: "oklch(0.6000 0.1300 75)"
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
    backgroundColor: "{colors.accent}"
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
  magenta-plane:
    backgroundColor: "{colors.accent}"
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
    backgroundColor: "{colors.accent}"
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

This file describes the system as built on the `v4` branch. Tokens live in
`app/globals.css` (raw oklch `L C H` triplets, `:root` light, `.dark` the
default) and are mapped to Tailwind keys in `tailwind.config.js`; motion tokens
live in `lib/motion-tokens.ts`, mirrored as `--dur-*` / `--ease-*`. The
homepage's direction contract, with the choreography it was built from, is
`.impeccable/surfaces/app-page-tsx.md`. Where this file and the code disagree,
the code and its tests win, and this file is stale.

## Overview

**Creative North Star: "Lobby Rack"**

Every project is a brochure standing in a resort lobby rack at night. You see
its top over the pocket lip; give it attention and it lifts out and shows the
real site scrolling. The page does the job his clients' brochures did before
he built their websites. The ground is a deep lagoon, the surfaces are paper
(panels, cards, folds, a rack lip with pockets, a perforated reply card,
postcards), and colour arrives only as whole flat magenta planes locked to the
grid. A condensed variable display face (Anybody) shouts; Figtree reads.

Motion has one meaning: **paper that unfolds when you pay attention.** Three
verbs only. *Unfold* reveals detail (the hero tri-fold, product spreads,
case-study decisions). *Lift* answers attention (a card rising out of its
pocket, a postcard straightening). *Slide* keeps continuity (things move aside,
never vanish). Motion is CSS-first, transform-led, progressive enhancement:
outside its gates every piece sits at rest and fully visible, and the server
HTML is the finished page.

It replaced B3 Signal (graphite, sodium amber, Recursive, an ops board) and
refuses both the dev-portfolio default (dark hero, gradient blobs, a grid of
screenshot cards) and the mono terminal board B3 already was.

**Key Characteristics:**
- Lagoon-night ground, paper panels, bougainvillea magenta as flat printed planes; no gradients, glows or tints.
- Two variable families: Anybody (display, condensed on its width axis) and Figtree (reading).
- Edge codes: every card, cover and product carries a printed running index ("07 / 18 · Sites").
- Fold creases (dashed 6 on 5 off), a rack lip with a paper ledge, a perforation with notched ends.
- Portrait previews: 9:16 rack cards and 3:4 frames that scroll the full page of the real site.
- Honest absence: a project with no public screen keeps its slot with a printed tag saying why.
- One in-flow shadow, applied only while a card is lifted.

## Colors

A committed two-tone print: lagoon and paper, with magenta as the one ink that
covers whole planes. Dark is the default theme; the light theme is cool paper
with lagoon ink.

### Primary
- **Bougainvillea Magenta** (`accent`): the hero's front panel, each product's flap, the contact reply card, the current filter tab, the primary button on paper, the focus ring, text selection, the brand tile in the top bar, the availability dot, the preview progress rule. It is 30 to 40% of the first viewport. On paper it is also the colour of a few accent links ("View all projects", a product's domain, "Read the case study").
- **Plane Ink** (`on-accent`): the only text colour on a magenta plane. Dark theme: lagoon; light theme: white.

### Tertiary
- **Live Green** (`live`): the live status glyph and its pulse, nothing else.
- **Calamansi** (`status-early`): the early-access ring glyph, nothing else.
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

**The Plane Ink Rule.** On a magenta plane, text is `on-accent` and focus is drawn in `on-accent` (`.on-plane :focus-visible`). Ink on accent is 2.1 to 2.5:1 and forbidden; an accent ring on a magenta plane disappears.

**The Green Means Live Rule.** `live` and `.live-pulse` appear only inside `StatusBadge` (`tests/design/green-means-live.test.ts`). Brand and availability use `accent`.

**The Contrast Ledger Rule.** Every token is a raw oklch triplet, one per line; `tests/design/contrast.test.ts` parses them and checks WCAG AA in both themes (text 4.5:1, glyphs and focus 3:1, field borders 3:1). No raw hex in components, no `dark:` colour pairs. The one hex copy is `lib/og-palette.ts`, held to `.dark` by `tests/design/og-palette.test.ts`.

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

- **Hero:** `1.3fr | crease | 0.85fr | crease | 0.85fr` from 768px, at least 640px tall. Below 768px the panels stack (magenta front, portrait as a 4:3 band, proof panel) and the creases turn horizontal.
- **Product spreads:** `4fr | crease | 8fr`, flap side alternating per product; the leaf holds the text and a 3:4 preview (15 to 17rem).
- **Rack tiers:** 4 cards per row from 1024px, 3 from 640px; below 640px a horizontal scroll-snap strip with cards at 78% width, unsunk.
- **Case-study covers:** 3 columns at 1024px, 2 at 640px, 1 below.
- **Route line:** horizontal lanes (Work, Education) from 768px, vertical below.
- **Contact reply card:** `5fr | perforation | 7fr`.
- **Project page:** a magenta front-cover header (`7fr | crease | 5fr`), then a read spread: prose leaf on the left, a fold crease, and a sticky preview rail on the right (96px from the top) from 1024px. Below 1024px the rail drops in after "The brief" on flagships, straight after the header on short pages.

The sticky top bar is about 101px below md (two rows) and 64px from md, so
`html` carries `scroll-padding-top` of 7rem / 4.75rem and anchor sections a
0.5rem scroll margin (`tests/design/sticky-header.test.ts`).

Far sections (case studies, field log, route, stack, case-study sections) carry
`.defer-render` (`content-visibility: auto`, intrinsic size `auto 600px`); rack
tiers use `.defer-render-lift`, which lets paint run 16rem out so a lifted card
is not clipped. The hero, products, rack section and contact card are never
deferred. Before an in-page jump the top bar adds `.render-all` for 1.5s so the
jump is measured against real heights.

## Elevation & Depth

Flat paper by default. Depth is conveyed by surface (canvas under panel, magenta
planes over both), by creases and the rack lip, and by 3D folds in perspective
(`perspective: 1600px` on the hero and each spread). Shadows exist only as a
response to state or for floating layers.

### Shadow Vocabulary
- **Lift** (`--shadow-lift`: `0 18px 30px -18px oklch(0.12 0.03 232 / 0.55)`): the one in-flow shadow, only while a rack card or postcard is lifted.
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
- **Rack lip:** a 2px `line-strong` rule over a 14px `panel` ledge, bridging the gap to the next pocket.
- **Perforation:** 2px dotted `line-strong` with a 20px half-circle notch (canvas-coloured) at each end; across when stacked, upright from 768px.
- **Printed tag:** a dashed `line-strong` box on canvas for honest absence (`NoPreviewTag`, the 404's empty pocket).
- **Staging tag:** an edge-code label on canvas, 2px radius, rotated 8deg in a rack card's corner.

## Components

### Buttons
- **Shape:** gently squared (6px), at least 44px tall, Anybody 650 at normal width.
- **Primary** (`.button-primary`, defined once in `globals.css`): magenta fill, `on-accent` text, 10px 20px. On a magenta plane (`.on-plane`) it inverts to a lagoon fill with magenta text. "Start a project" and "Send message" are the primaries; `tests/design/primary-button.test.ts` requires every primary CTA to use the class and forbids composing one from a fill and padding.
- **Hover / Press** (`.press`): lifts 2px, sinks 1px and scales to 0.98 on press, fast/sharp; colour changes fast/sharp. The trailing arrow (`.arrow-nudge`) slides 8px right on hover of its link or button.
- **Secondary:** a `line-strong` outline with ink text that turns accent on hover ("Live preview", "Open live site"). On a plane the outline and text are `on-accent` ("Résumé").
- **Text links:** `.link-draw`, an underline drawn from the left on hover or focus and leaving to the right; `[aria-current='page']` keeps it drawn.

### Chips
- **Stack chips:** edge-code, full round, `line` border with `muted-strong` text; WordPress, the specialism, sits on a canvas chip with a `line-strong` border (never a magenta outline).
- **Status pill:** on a magenta flap or header the `StatusBadge` sits in a full-round `panel` pill.

### Cards / Containers
- **Corner Style:** 6px; postcards 2px.
- **Background:** `panel` on `canvas`; magenta planes for flaps and the reply card.
- **Shadow Strategy:** none at rest; Lift while lifted.
- **Border:** 1px `line`.
- **Internal Padding:** 16px (rack card top), 24px (covers), 24 to 40px (planes and leaves).

### Inputs / Fields
- **Style:** canvas fill, 1px `field-border`, 6px radius, 10px 12px padding, Figtree; labels above in edge-code `muted-strong`.
- **Focus:** the global ring (2px accent, 3px offset) plus the border turns accent.
- **Error:** `aria-invalid` turns the border ink; the message sits below with an octagon glyph in ink.

### Navigation
- **Top bar:** sticky, canvas, a `line` rule below. A magenta initials tile and the name in Anybody bold at wdth 75. Nav links in Anybody 600 (wdth 85 below md, 100 from md), `muted-strong` turning ink, with `.link-draw`; the current route keeps its underline. Availability (accent dot plus edge code) from lg; a 44px theme toggle with `.press`. Below md the bar is two rows and the nav scrolls sideways inside a padded strip so focus rings are not clipped.
- **Filter tabs** (`/projects`, `?band=` links): index tabs on a 2px `line-strong` lip; the current tier is a magenta plane with `on-accent` text (`aria-current="true"`), the rest paper with `muted-strong` text.
- **Footer:** a hairline, the name in Anybody, an edge-code colophon ("Printed in Naga City"), social links with `.link-draw`.

### Status Badge (signature)
`StatusBadge` is the only way status reaches the page: a glyph shape plus a text
label, edge-code `text-xs`, `muted`. Live: a filled green dot with the
twice-then-stop pulse. Early access: a calamansi ring. Private: a lock. Internal:
a filled square. Staging: an outlined square. `compact` hides the label visually
but keeps it in the accessibility tree.

### Rack Card and Rack Tier (signature)
`RackTier` (`components/ui/rack-tier.tsx`): an edge-code heading with its count,
then a row of pockets on a lip, shared by the homepage rack and `/projects`.
`.rack-shelf` measures itself (container query) so `.rack-row` reserves the
lift (`--lift`, 26% of a 9:16 card): the first row is padded by it and rows sit
apart by it, so a lifted card never covers the tier heading or the printed top
of the row above (`tests/design/rack-lift.test.ts`). Within a tier, cards with a
preview lead.

`RackCard` (`components/ui/rack-card.tsx`): a 9:16 paper card, one link to the
project page. Its top 44% shows the edge code, name, `StatusBadge`, a two-line
summary and the domain; the rest is a decorative `ScrollPreview` or a
`NoPreviewTag`. From 640px it sinks into a pocket (`.rack-pocket`,
`aspect-ratio: 100 / 78`, clipped at the lip) and on hover lifts 26% with the
Lift shadow, normal/smooth; the preview starts scrolling once it has risen
(delay = normal). Press settles to 22%. Keyboard focus lifts it even under
reduced motion (a state change without travel) and removes the pocket clip so
the ring draws on all four sides. Below 640px the cards are unsunk in a
scroll-snap strip.

### Product Spread (signature)
Each product is an open fold-out spread: a magenta flap (edge code, name in
headline type, summary, status pill) joined at a crease to a paper leaf
(description, "Live preview" when embeddable, "Read more", the domain, and a 3:4
`ScrollPreview` that scrolls as it crosses the viewport). Flaps alternate sides;
hovering the spread tilts the flap 4deg on its hinge, inviting the open.

### ScrollPreview (signature)
`components/ui/scroll-preview.tsx` (server). A fixed 3:4 or 9:16 frame over a
full-page screenshot (`<id>-full.webp`, 1440 wide, at most 6000px tall),
`object-fit: cover` from the top, `quality={50}`, never `priority`.
- **Hover / focus** (frame, or a `.scroll-preview-host` card around it): the shot scrolls to the bottom over `--scroll-dur`, scaled from the shot height (`--shot-h`, set inline) and clamped to crawl..crawl × 3.75 (1.2 to 4.5s), sharp easing; a 3px accent rule grows down the right edge over a `line-strong` track that is visible at rest. A printed "scroll" cue (an edge code on a paper tab) sits in the corner where the frame can move. Leaving returns it to the top over slow/smooth. It stops at the bottom; it never loops.
- **Scroll with the page** (where `animation-timeline` exists): `scroll="view"` (products) scrubs the shot as the frame crosses the viewport (cover 15% to 85%); `scroll="page"` (a project page's sticky rail) follows the page's own scroll; below 640px the rack's unsunk cards follow their tier's view timeline. Scroll-bound, not auto-playing.
- **Accessibility:** a named `role="img"` with no link; a named link with an href; out of the tab order and the tree when it duplicates a visible link (`duplicateLink`); silent inside a rack card (`decorative`).
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
called failed and the new-tab link becomes the magenta fill. A polite status
region announces loading, loaded and failed. Motion: `AnimatePresence
mode="wait"`; the scrim fades and the dialog rises 16px at normal/smooth, and
exits at fast. The width toggle squeezes the frame with a WAAPI `scaleX` (token
duration and easing) and swaps the width once at the end. Under reduced motion
the dialog only fades (fast) and the width swaps at once.

### Hero Tri-fold (signature)
Front panel: the magenta plane (`.on-plane`, the LCP surface, static from the
first frame) with the eyebrow, H1, lede, specialism and the CTA row. Middle: the
portrait, full bleed, opening `ImageLightbox`. Back: the proof band (numerals
over labels; screen readers hear the original sentence) and the core-stack chips
on paper.

### Other surfaces
- **Case-study covers:** closed tri-folds, paper with an upright crease just inside the right edge, edge code, title, sector, the brief's first sentence, role, "Read the case study". The whole cover is a `.press` link.
- **Field log:** postcards (2px radius, 12px paper border, captions always visible) resting at -1.5deg and +1deg alternately, interleaved with testimonial cards; photos open `ImageLightbox`.
- **Route line:** a 2px `line-strong` line with ink-ringed stops, dates in edge code.
- **Stack:** the brochure's "amenities" back panel, categories in columns on dotted leaders. No scroll motion.
- **Contact reply card:** a magenta plane (heading, availability, email, résumé, Facebook, location) perforated to a paper form leaf; "Send message" is the primary.
- **404:** an empty rack pocket, the lip and ledge with a dashed slot and a printed tag.
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

**Scroll reveals** (`animation-timeline: view()`, range `entry 10% cover 30%`, all inside `@supports (animation-timeline: view())` and `@media (prefers-reduced-motion: no-preference)`; transform only, so nothing is painted or measured faded):

| Class | Where | Motion |
|---|---|---|
| `.reveal` | generic | rise 24px |
| `.reveal-flap` | product flap | unfold `rotateY(±22deg)` on its hinge |
| `.reveal-leaf` | product leaf | slide 40px toward the crease |
| `.reveal-drop` | rack card | drop 40px into its pocket, staggered by `--i` × 8% of range |
| `.reveal-lip` | rack lip | draw `scaleX` from the left, staggered |
| `.reveal-cover` | case-study cover | rise 24px, staggered by `--i` × 10% |
| `.reveal-postcard` | postcard | slide 40px at its resting tilt |
| `.reveal-fold` | case-study decision | fold down `rotateX(-22deg)` from its crease |
| `.reveal-reply` | contact card | rise 40px |
| `.reveal-perf` | perforation | draw down (across below 768px) |
| `.reveal-route` / `.reveal-stop` | route line | the line draws across its section's named timeline; stops pop from `scale(0.6)` as it passes |

**Hover / press:** `.press` (2px lift, press sink), `.link-draw`, `.arrow-nudge`, the rack lift, the flap tilt, the postcard straighten-and-lift (8px with Lift). Colour transitions fast/sharp.

**Bounded loops:** the live pulse runs twice (2.4s each) and stops. The chat typing dots and the "Sending" spinner run only while a request is pending.

**Reduced motion:** reveals and the hero are switched off by their gates and explicitly reset in the `reduce` block; hover transforms are removed (colour and underline still change, instantly); previews pin to the top with rule, track and cue hidden; the live pulse is removed; then every animation and transition collapses to one 0.001ms iteration. `useReducedMotion` drops offsets in the `motion/react` pieces.

## Do's and Don'ts

### Do:
- **Do** take every colour from the Tailwind keys (`canvas`, `panel`, `ink`, `muted`, `muted-strong`, `line`, `line-strong`, `field-border`, `accent`, `on-accent`, `live`, `status-*`) and keep `globals.css` triplets one per line.
- **Do** put text and focus on a magenta plane in `on-accent`, and mark the plane `.on-plane` when it holds focusable controls.
- **Do** use `.button-primary` with `.press` for every primary call to action.
- **Do** render status only through `StatusBadge`.
- **Do** give every project a slot: a `ScrollPreview` when a full shot exists, a printed `NoPreviewTag` when it does not.
- **Do** take durations and easings from `lib/motion-tokens.ts` or `--dur-*` / `--ease-*`, and gate every scroll-driven animation behind `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`.
- **Do** keep proof (products, the rack) visible in the server HTML: transform-only motion, no opacity entrance.
- **Do** keep the hero sequence under two seconds and everything bounded under five.

### Don't:
- **Don't** use gradients, glows, tints or outlines on planes; colour is a whole flat plane or nothing.
- **Don't** set ink text on magenta, or use magenta as a text colour on a magenta-adjacent plane.
- **Don't** use green anywhere outside `StatusBadge`'s live glyph.
- **Don't** add a third typeface or a mono family.
- **Don't** cast a shadow from anything at rest in the page flow.
- **Don't** fade proof in, count numbers up, add parallax, or loop anything past five seconds.
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
2. **The social card still renders in Recursive.** `next/og` needs static font files and cannot use `next/font`'s variable Anybody and Figtree, so the OG image keeps B3's Recursive instances in `app/fonts/` (its colours follow the Lobby Rack dark palette). Replacing it needs static Anybody/Figtree TTFs committed under `app/fonts/`.
3. **The rack scrolls sideways below 640px.** Each tier is a horizontal scroll-snap strip on phones; the a11y gate accepted it as P2 given the "View all projects" link, but a vertical stack would remove the hidden overflow.
4. **Preview scrolling repaints.** The hover scroll transitions `object-position`, not a transform, so it repaints per frame. It is pinned by the ScrollPreview tests; a `translateY` on an intrinsically sized image would be the fix.
5. **Sunk cards do not scroll on touch.** From 640px the rack's preview scroll is hover-gated (`hover: hover`) and the scroll timeline applies only to the unsunk cards below 640px, so a touch tablet sees sunk cards whose previews stay at the top.
6. **The direction awaits review.** The Lobby Rack world was chosen in an unattended run (direction contract, "Unresolved"); it stands until Christian signs off on the v4 preview.
