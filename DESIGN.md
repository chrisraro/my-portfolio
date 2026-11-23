---
name: Christian Raro, Portfolio 6.0 First Light
description: "Mount Isarog over the Naga plain, a pixel land fixed behind every page, with first light rising behind the summit as you scroll. The site is one reading column beside a floating panel of liquid glass, in plain compact rows. It spends its one warm colour, ember, on the primary action and on where you are."
colors:
  bg: "oklch(0.9600 0.0080 220)"
  panel: "oklch(0.9900 0.0040 220)"
  ink: "oklch(0.2200 0.0200 245)"
  muted: "oklch(0.4700 0.0200 240)"
  muted-strong: "oklch(0.3700 0.0200 240)"
  line: "oklch(0.8800 0.0120 230)"
  line-strong: "oklch(0.7900 0.0180 230)"
  contour: "oklch(0.6600 0.0350 215)"
  trail: "oklch(0.5000 0.1500 38)"
  on-trail: "oklch(0.9900 0.0040 80)"
  field-border: "oklch(0.5800 0.0200 235)"
  live: "oklch(0.5200 0.1400 152)"
  status-early: "oklch(0.5200 0.1600 285)"
  status-private: "oklch(0.5400 0.0200 240)"
  status-internal: "oklch(0.5400 0.0200 240)"
  land-far: "oklch(0.8900 0.0220 225)"
  land-near: "oklch(0.8300 0.0280 215)"
  land-lit: "oklch(0.9500 0.0150 90)"
  dawn: "oklch(0.8400 0.0950 62)"
  firefly: "oklch(0.7200 0.1300 75)"
  bg-night: "oklch(0.1650 0.0160 245)"
  panel-night: "oklch(0.2150 0.0180 245)"
  ink-night: "oklch(0.9550 0.0080 90)"
  muted-night: "oklch(0.7000 0.0150 240)"
  muted-strong-night: "oklch(0.8200 0.0120 235)"
  line-night: "oklch(0.2850 0.0180 245)"
  line-strong-night: "oklch(0.3700 0.0200 245)"
  contour-night: "oklch(0.5000 0.0300 230)"
  trail-night: "oklch(0.7800 0.1350 52)"
  on-trail-night: "oklch(0.1800 0.0300 50)"
  field-border-night: "oklch(0.5600 0.0200 240)"
  live-night: "oklch(0.8000 0.1500 152)"
  status-early-night: "oklch(0.7600 0.1200 285)"
  status-private-night: "oklch(0.6400 0.0200 240)"
  status-internal-night: "oklch(0.6400 0.0200 240)"
  land-far-night: "oklch(0.1350 0.0180 245)"
  land-near-night: "oklch(0.1050 0.0140 245)"
  land-lit-night: "oklch(0.3000 0.0300 235)"
  dawn-night: "oklch(0.5800 0.1400 45)"
  firefly-night: "oklch(0.8600 0.1500 98)"
typography:
  name:
    fontFamily: "Instrument Sans, Arial, sans-serif"
    fontSize: "clamp(2rem, 1.7rem + 1.2vw, 2.5rem)"
    fontWeight: 650
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  page-h1:
    fontFamily: "Instrument Sans, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 1.8rem + 2vw, 3.25rem)"
    fontWeight: 650
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  section:
    fontFamily: "Instrument Sans, Arial, sans-serif"
    fontSize: "clamp(1.625rem, 1.5rem + 0.6vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Instrument Sans, Arial, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  list:
    fontFamily: "Instrument Sans, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  row:
    fontFamily: "Instrument Sans, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.008em"
  figure:
    fontFamily: "Instrument Sans, Arial, sans-serif"
    fontSize: "2rem"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  lede:
    fontFamily: "Instrument Sans, Arial, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Instrument Sans, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  button:
    fontFamily: "Instrument Sans, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.5
  button-label:
    fontFamily: "Instrument Sans, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1
  map-label:
    fontFamily: "Instrument Sans, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.3
  small:
    fontFamily: "Instrument Sans, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  caption:
    fontFamily: "Instrument Sans, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
rounded:
  sm: "10px"
  md: "12px"
  DEFAULT: "16px"
  xl: "20px"
  panel: "26px"
  full: "9999px"
spacing:
  gutter: "20px"
  gutter-sm: "32px"
  section-gap: "96px"
  column: "49rem"
  column-wide: "66rem"
  panel-width: "16rem"
  panel-inset: "12px"
  content-offset: "17.5rem"
  bar-height: "56px"
components:
  button-primary:
    backgroundColor: "{colors.trail}"
    textColor: "{colors.on-trail}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "10px 24px"
    height: "46px"
  button-secondary:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "10px 24px"
    height: "46px"
  glass:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.DEFAULT}"
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "16px"
    width: "16rem"
  glass-control:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.muted-strong}"
    rounded: "{rounded.full}"
    height: "44px"
    width: "44px"
  lozenge:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "44px"
  row:
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "16px 0"
  survey-plate:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.DEFAULT}"
    padding: "6px"
  text-field:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
---

# Design System: Christian Raro, Portfolio 6.0 First Light

## Overview

**Creative North Star: "First Light"**

The land is Mount Isarog over the Naga plain, drawn in 4px squares and fixed
behind every page. The page is one reading column of compact rows beside a
floating panel of glass. As you scroll, first light rises behind the summit; at
the foot of a page the dawn stands full. It is the one thing on the page that
follows the scroll, and it is the whole of the site's atmosphere.

The structure is borrowed from marwieang.com: a floating side panel, one
reading column, compact rows, a fixed dithered land. Everything that fills it
is Christian's own: Isarog and the Naga plain, a dawn the colour of a Bicol
morning, fireflies (alitaptap) over the near ground, and a glass made for this
palette.

**Night is the default.** The site opens in the hour before dawn: blue-black
sky, a dark land, ember on the summit's edge. The morning theme (`:root`) is the
same sheet after sunrise: pale cool paper, a peach dawn, a lit ridge. Both are
first-class; `ThemeProvider` starts at night and ignores the system setting, and
the panel's switch toggles them.

**Liquid glass, translated for the web.** Apple's liquid glass is a material
that bends light. On the web it is four things, kept honest: a blur with
saturation of what lies behind it, a specular edge (a 1px light line along the
top), a highlight that follows the pointer across the panel, and a lozenge of
glass that glides between links. Glass floats over the land and never over
other glass. It goes opaque for anyone who asks for less transparency or more
contrast, and where the browser has no `backdrop-filter`.

Motion is CSS plus the installed `motion` library, with no animation framework
beyond that. Three verbs: **rise** (copy and rows lift into place), **pan** (the
`/projects` map and the page glide to a waypoint) and **light** (the dawn climbs
as the page scrolls). Outside their gates nothing is offset and the server HTML
is the finished page.

**Key Characteristics:**
- A pixel land behind everything, the only element that follows the scroll.
- One column (49rem) beside a 16rem glass panel; compact rows, not cards.
- Glass as the one material for what floats, and a flat paper for what is read.
- Ember (`--trail`) for the primary action and the current position, and nothing else.
- One typeface, Instrument Sans, in weights only.
- Night by default; morning one switch away.

## Colors

Cool blue-black ground by night, cool pale paper by day, with one warm ember and
three small status hues that never decorate. Every colour is a raw
`L C H` triplet in `app/globals.css`, one per line; `:root` is the morning and
`.dark` the night. `tests/design/contrast.test.ts` parses them and checks the
pairings in both themes.

### Primary
- **Ember** (`--trail`, `{colors.trail}` by morning, `{colors.trail-night}` by night): the primary button, the chat's send button, the current page in the panel and the menu (a dot, an underline), the current key on `/projects`, the focus ring and the text caret. Text on it is **On-Ember** (`--on-trail`).

### Neutral
- **Ground** (`--bg`): the page, and the land's sky.
- **Panel Paper** (`--panel`): glass tints, plates, dialogs and the opaque fall-back for glass. One step lighter than the ground in both themes.
- **Ink** (`--ink`): text, the brand mark's plane, map dots and rings, hover and field-focus borders, the glass controls' tint, selection.
- **Muted** (`--muted`) and **Muted Strong** (`--muted-strong`): secondary text, dates, counts, captions, place lines, panel links at rest.
- **Line** (`--line`) and **Line Strong** (`--line-strong`): the rules between rows; the hairline inside every glass edge and plate.
- **Contour** (`--contour`): linework on the maps only. Never text.
- **Field Border** (`--field-border`): the border of every text field, at 3:1 against the ground (WCAG 1.4.11), never a hairline.

### The land (`components/scene.tsx`)
- **Land Far** (`--land-far`): the summit and the far ridge.
- **Land Near** (`--land-near`): the plain in front of it.
- **Land Lit** (`--land-lit`): the edge the light catches on the summit and the ridge.
- **Dawn** (`--dawn`): the glow behind the summit. By night a deep ember, by morning a peach.
- **Firefly** (`--firefly`): the 4px fireflies.
- **Shine** (`--shine`, `--shine-a`): white at 0.9 alpha by morning, 0.1 by night; the specular edge and the pointer highlight.

### Status (never decoration)
- **Live Green** (`--live`): a live system, and nothing else, only inside `StatusBadge`.
- **In-Development Violet** (`--status-early`): the ring on a project in development, kept well away from ember (at least 90 degrees of hue).
- **Private / Internal Grey** (`--status-private`, `--status-internal`): the lock, the filled square, the outlined square.

### Named Rules
**The One Ember Rule.** Ember marks the primary action and the current position only. It never fills a large area, colours a heading, a hover or a link, or decorates. If it is not "do this" or "you are here", it is ink. (The dawn on the land is a different token, `--dawn`, and sits behind the page, never in it.)

**The Green Means Live Rule.** Green is a live system's status dot and nothing else; the chat assistant's dot is ink.

**The Ink States Rule.** Hover borders, field focus borders, `accent-color` and `::selection` are ink (selection: ink ground, page-colour text). The keyboard's focus ring and the caret are ember, because that is where you are.

**The Scrim Rule.** No word sits on the bare land. Under the reading column a scrim (the ground at 60%, 74% on a phone) keeps every word on near-flat colour while the land keeps its shape beside it.

Shadows are ink-hued in both themes (`--shadow-lift`, `--shadow-overlay`), so a shadow reads as depth, not as a smudge.

## Typography

**Family:** Instrument Sans, loaded once through `next/font` as `--font-sans`, with Arial sized to its metrics as the fallback (`adjustFontFallback: true`), so the swap re-wraps nothing. There is no display face and no second family. Hierarchy is made with size, weight and tracking alone.

**Character:** A friendly grotesque, set tight and plain. Headings are a little heavier and tighter than body; there is no uppercase and no condensed width.

### Hierarchy
- **Name** (`.text-name`; 650, `{typography.name}`, tracking -0.025em): the h1 on the homepage, the name beside the portrait.
- **Page H1** (`.text-page-h1`; 650, `{typography.page-h1}`, -0.03em): the h1 of `/projects`, a project, a service, `/about`, `/hire` and the 404.
- **Section** (`.text-section`; 600, `{typography.section}`): a section heading through `SectionHeading` (`/about`, `/hire`, the contact form).
- **Title** (`.text-title`; 600, 1.375rem): a banner's name, case-study figures.
- **List** (`.text-list`; 600, 1.125rem): the heading of a homepage list and of a band on `/projects`, with its count at the far end.
- **Row** (`.text-row`; 600, 1.0625rem, `text-wrap: pretty`): a row's name, a role, a place.
- **Figure** (`.text-figure`; 500, 2rem): the three proof counts on the homepage.
- **Lede** (`.text-lede`; 400, 1.1875rem): the homepage headline sentence, and the answer under a page's h1.
- **Body** (400, 1rem, 1.6): prose, held to the column.
- **Button** (`.button-primary`, `.button-secondary`: 600, 0.9375rem; `.button-label`: 600, 1rem, line-height 1, for text actions).
- **Map Label** (`.map-label`; 500, 0.875rem): place names on the maps, small labels on `/hire`, chat and dialog headings.
- **Small** (0.875rem) and **Caption** (0.75rem, 500): dates, counts, captions; the status label.

### Named Rules
**The One Family Rule.** Instrument Sans only. No serif, no mono, no second sans. The link-preview cards cannot read a variable font, so they use a static Recursive Sans file; that is the one exception and it lives off-page (`app/og/`).

**The Plain Numeral Rule.** Numerals are `tabular-nums` (`.tabular`) and plain: "4", not "04".

## Layout

**The column.** Every section and read-page block centres on `SECTION` (`components/ui/grid.ts`: `mx-auto w-full max-w-[49rem] px-5 sm:px-8`), 20px gutters, 32px from 640px. A project page and `/projects` use `SECTION_WIDE` (66rem) for a second column. Sections are separated by open space: each homepage section starts 96px below the last (`pt-24`).

**The panel.** From 1024px the header is a fixed pane of glass, 16rem wide, 12px in from the left and the top and bottom of the window (`.glass .panel`). The page takes `padding-left: 17.5rem`, so the column centres on what the panel leaves. Inside it: the brand mark and name, the Contact button, two groups of links (the pages, then the places on the homepage), and a foot with the locality, the theme switch, the résumé and the social links. Its link list scrolls inside it on a short window.

**The bar.** Below 1024px the panel becomes a 56px pill of the same glass, sticky 12px from the top and no wider than 45rem: the name, the theme switch, and a Menu disclosure (`<details>`, so it opens without JavaScript). The menu panel is opaque paper, never glass on glass. Scroll padding is 5rem at the top and 6rem at the bottom, so the bar and the chat launcher never cover a target.

**The land.** `.scene` is fixed to the window behind everything: four 1-bit masks, 448px tall, repeating across (`.scene-dawn`, `.scene-far`, `.scene-near`, `.scene-lit`), each painted with a land token so the same files serve both themes. From 1024px the land centres on the column, not the window, by an offset of half the panel.

**Rows.** Work is a list of rows, not a grid of cards: a thumbnail (8rem wide, 8:5, the top of the real site; a lock where there is no public screen), the name with its status, one line, and the kind of client. Rows are separated by a hairline and one link each.

**Screenshots** are stills in a frame of one ratio (`SHOT_ASPECT`, `components/ui/project-shot.tsx`), whatever their width, and are never faked: an auth-gated or internal project prints the reason in the frame.

## Elevation & Depth

Depth is two things: glass over the land, and paper in the column.

### Glass (`.glass`)
`panel` paper at 62% over a `blur(22px) saturate(1.7)` backdrop, a 1px `--line-strong` edge at 55%, a 1px specular line along the top (`--shine`), and `--shadow-overlay`. `.glass--dense` raises the tint to 90% for surfaces that carry reading (the chat panel). The panel adds `.panel` (26px corners) and a radial highlight that follows the pointer (`--gx`, `--gy`, set from the panel's `pointermove`). `.glass-control` is a small control on glass: ink at 5%, a line and a top highlight, with no blur of its own, so glass never sits on glass.

### Shadows
- **Lift** (`--shadow-lift`): only while a linked screenshot is lifted, on a pseudo-element whose opacity fades in.
- **Overlay** (`--shadow-overlay`): the panel and the bar, the dialog, the chat, toasts and the lightbox.

### Named Rules
**The Never-Glass-On-Glass Rule.** A surface on glass is a control (`.glass-control`, `.chip`, `.lozenge`) with no blur, or opaque paper (the phone menu). Two blurs never stack.

**The Opaque Fall-Back Rule.** Under `prefers-reduced-transparency: reduce`, `prefers-contrast: more`, or without `backdrop-filter`, `.glass` becomes solid panel paper with no blur. The land stays behind it; nothing changes meaning.

**The Flat-In-Flow Rule.** Nothing in the column's flow carries a shadow at rest. The glass floats; the rows lie flat.

## Shapes

Round, because glass is round. `--radius` is 16px: glass, plates and the survey-plate frame take it; fields and rows take 10px (`rounded-sm`); the lozenge 12px; the panel 26px; the portrait 32px; a banner 20px; the dialog and chat 20px. Buttons, chips, glass controls, the filter and the bar are full pills. Status glyphs are small: a dot, a ring, a lock, a filled or outlined square. The maps keep a 6px ink dot for a town or city, an 18px dashed ink ring for a region, and nothing else.

## Components

### Buttons
- **Primary** (`.button-primary`): an ember pill with on-ember text and a 1px light edge, 46px tall, defined once in `globals.css`; one per view where it matters ("Start a project", "Send").
- **Secondary** (`.button-secondary`): a clear glass pill (panel at 70%, `blur(10px) saturate(1.5)`, a line edge and top highlight) beside it ("Hire me for a role", "All projects").
- **Hover / press** (`.press`): lift 2px on hover, sink 1px and scale 0.98 on press, fast and sharp; the arrow inside slides 8px right (`.arrow-nudge`). Under reduced motion only the colours change.

### The panel (`SiteLegend`)
A pane of glass, 16rem wide. Two lists share one lozenge each (`.lozenge`): a 44px pill of ink at 7% that rests behind the current page and glides, on `--dur-normal`, to whichever link the pointer or the keyboard is on, then back. The current page also takes an ember dot. Counts (15 projects, 3 services) sit at the far end of their rows.

### Rows (`ProjectRow`, `.row`)
One project, one link. Hover slides a pane of glass under the row (wider than the text, 6% ink with a top highlight) and zooms the thumbnail inside its frame; focus gets the same pane with no travel. The name carries `StatusBadge`; the kind of client sits at the right from 640px.

### In development (`NowBuilding`, `.banner`)
A project in development is one wide banner of glass: its status, name and a line on the left, its real site cropped into the right side behind a mask that fades it into the glass, and the live address beside the link to its page. Nothing renders when nothing is in development.

### Text links (`TrailLink`, `.link-draw`)
One idiom in two weights: an action in button-label type with an arrow, or a label in map-label type. The underline draws from the left on hover or focus and leaves to the right. Hit areas stay 44px (32px for a label from 640px). External links point up and out and say they open a new tab.

### Chips and the filter
`.chip` is a 36px pill of ink at 5% (the service links). The `/projects` filter is a glass pill of keys, one per band with its count, as plain links over `?band=`; the current key is ink on a lighter pill with an ember dot.

### Status (`StatusBadge`)
Status is never colour alone: a glyph and a label. Live: a green dot with a bounded pulse. In development: a violet ring. Private: a lock. Internal: a filled square. Staging: an outlined square.

### The map
The Philippines outline on a survey plate, a pin per verified place: a dot for a town or city, a dashed ring for a region, each name in map-label type. `MapKey` names both marks under the homepage and `/projects` captions. Pins counter-scale (`.map-pin__mark`) so a pan zooms the map, not the labels. Beside it, the places as a ruled list.

### Survey plates (`SurveyPlate`)
The frame for a photo, a map or a screenshot on a project page: panel paper, a line-strong hairline and a 6px margin, 16px corners.

### Plan the route (`PlanTheRoute`)
The contact form. Fields are 10px-cornered, ground at 70% with a Field Border edge; focus and invalid borders turn ink; labels sit above in small medium type. The submit is the primary button; beside it, the ways to reach Christian and "Ask Chunks", which opens the chat.

### Overlays
The live-preview dialog, the chat panel (dense glass, an ember send button, an ink status dot), toasts and the lightbox all float on the overlay shadow. The chat launcher is a glass circle.

### The link-preview card (`app/og/`)
One card per page at the page's path under `/og`, 1200 × 630, in the night palette (`lib/og-palette.ts`): the page's words in a 740px column from an 80px margin, and the land, Isarog's ridge with a dithered dawn behind its summit (`lib/og-linework.ts`), kept right of that column so nothing runs behind a word.

## Motion

Tokens live in `lib/motion-tokens.ts` and are mirrored as CSS variables: `--dur-fast` 0.18s, `--dur-normal` 0.35s, `--dur-slow` 0.6s, `--dur-crawl` 1.2s, `--dur-draw` 1.6s; `--ease-smooth` `cubic-bezier(0.22, 1, 0.36, 1)`, `--ease-sharp` `cubic-bezier(0.4, 0, 0.2, 1)`; `--stagger-line` 70ms. Motion is CSS first; the `motion` library only drives dialogs, the chat and toasts.

- **Rise.** On load, once, the homepage's three lines of copy (the name, the headline, the subheadline) lift 16px into place, 70ms apart on `--dur-slow` (`.rise`). Rows lift 24px into place as they scroll in, on a view timeline (`.rise-in`, `entry 0%` to `entry 100%`). Transform only; the server HTML is the finished page.
- **Light.** `.scene-dawn` climbs from 96px below its place, at 45% opacity, to full, on the root scroll timeline: the dawn follows the page to its end. It is a background decoration and the single scroll-linked element; it needs `animation-timeline: scroll()` and is static (fully risen) elsewhere.
- **Fireflies.** Eight 4px squares sit at the page's edges; from 1280px they show, and four of them twinkle twice (2.2s each) and stop. Below 1280px they are hidden.
- **Glass.** The pointer highlight follows the pointer across the panel; the lozenge glides on `--dur-normal`; a row's pane fades and settles on `--dur-fast` and `--dur-normal`, its thumbnail zooming 1.12 on `--dur-slow`. Fine pointer and no-preference only.
- **Disclosures.** A role's full list opens to its height (`interpolate-size`) where supported.
- **Pan.** On `/projects` a legend key glides the map to the band's pins (`.map-pan`, `--pan-x/--pan-y/--pan-s` from `lib/map-pan.ts`, `--dur-slow`); a pin glides the page to its row.
- **View transitions.** A filter change glides rows and band headings to their new places while the map pans; a project link morphs the clicked thumbnail into the project page's screenshot while the rest cross-fades. Feature-detected, off under reduced motion, plain links without JavaScript.
- **Hover.** `.lift-card` (a linked screenshot on a project page): lift 2px, border to ink, screenshot to 1.02 inside its clipping frame, the lift shadow faded in. Keyboard focus gets the ink border with no travel.
- **Bounds.** Nothing moves for more than five seconds: the live pulse fades twice (2.4s each) and stops; the fireflies twinkle for 4.4s and stop; the typing dots and the sending spinner run only while a request is pending. No count-ups, no parallax, no loops.
- **Reduced motion.** `.rise`, `.rise-in` and the dawn are off and in place at first paint; hover transforms go while colours, borders and underlines still change instantly; view transitions are zeroed; the pulse is removed; every other animation and transition collapses to one near-instant iteration.

## Do's and Don'ts

### Do:
- **Do** spend ember only on the primary action and the current position: the primary button, the send button, the current page or key, the focus ring and the caret.
- **Do** put glass only on what floats over the land, and give it a fall-back: opaque under reduced transparency, more contrast and no `backdrop-filter`.
- **Do** keep a scrim between the land and every word.
- **Do** draw each list as rows on one hairline rhythm, with one link per row.
- **Do** keep status to `StatusBadge`: a glyph and a label, never colour alone.
- **Do** keep every width, weight and tracking in the type utilities in `globals.css`, and one family.
- **Do** keep screenshots as stills in one frame ratio, and print the reason where there is none to show.
- **Do** make a motion's gates explicit (`prefers-reduced-motion: no-preference`, `@supports` for scroll timelines, a fine pointer for hover) so the server HTML is the finished page.

### Don't:
- **Don't** put glass on glass, or a blur on a control that sits on glass.
- **Don't** use ember for a hover, a heading, a link, a decoration or a large fill.
- **Don't** use gradients as decoration. The two that exist do work: the panel's pointer highlight and the mask that fades a banner's screenshot into its glass.
- **Don't** put a shadow on anything at rest in the column, or animate a `box-shadow`.
- **Don't** put an eyebrow over a section heading.
- **Don't** build a hero-metric template or a grid of identical cards.
- **Don't** fake a screenshot for an auth-gated or internal project.
- **Don't** pin a place a project's own words do not name.
- **Don't** claim products of Christian's own: the work is client work and Online Creative Solutions projects, and the copy says whose.
- **Don't** let anything but the dawn follow the page's scroll, or any motion run for more than five seconds.
