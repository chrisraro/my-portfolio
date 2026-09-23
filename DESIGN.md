---
name: Christian Raro — Portfolio 4.0
description: B3 Signal "Operator". A live board of running systems on warm graphite, with sodium amber as the only brand colour.
colors:
  canvas: "oklch(0.1838 0.0052 67.50)"
  panel: "oklch(0.2114 0.0075 67.40)"
  ink: "oklch(0.9448 0.0120 79.78)"
  muted: "oklch(0.6480 0.0193 72.97)"
  muted-strong: "oklch(0.8055 0.0195 75.29)"
  line: "oklch(0.2724 0.0117 67.30)"
  line-strong: "oklch(0.3262 0.0157 67.23)"
  accent: "oklch(0.7743 0.1479 68.78)"
  on-accent: "oklch(0.1838 0.0052 67.50)"
  live: "oklch(0.7972 0.1171 153.88)"
  status-early: "oklch(0.7743 0.1479 68.78)"
  status-private: "oklch(0.5886 0.0205 70.06)"
  status-internal: "oklch(0.5886 0.0205 70.06)"
  canvas-light: "oklch(0.9620 0.0115 84.58)"
  panel-light: "oklch(0.9798 0.0086 84.57)"
  ink-light: "oklch(0.2070 0.0075 67.39)"
  muted-light: "oklch(0.5018 0.0181 67.40)"
  muted-strong-light: "oklch(0.3491 0.0120 62.25)"
  line-light: "oklch(0.8967 0.0179 81.33)"
  line-strong-light: "oklch(0.8300 0.0217 79.08)"
  accent-light: "oklch(0.5099 0.1227 54.58)"
  on-accent-light: "oklch(0.9798 0.0086 84.57)"
  live-light: "oklch(0.5599 0.1335 152.55)"
  status-early-light: "oklch(0.5099 0.1227 54.58)"
  status-private-light: "oklch(0.5644 0.0176 67.46)"
  status-internal-light: "oklch(0.5644 0.0176 67.46)"
typography:
  display:
    fontFamily: "Recursive, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1.913rem + 2.609vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Recursive, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.2rem + 1.25vw, 2.125rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Recursive, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  lede:
    fontFamily: "Recursive, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Recursive, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "Recursive, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.375
  label:
    fontFamily: "Recursive, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
    letterSpacing: "0.1em"
    fontVariation: "'MONO' 1"
  mono:
    fontFamily: "Recursive, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
    fontFeature: "tnum"
    fontVariation: "'MONO' 1"
  numeral:
    fontFamily: "Recursive, ui-monospace, monospace"
    fontSize: "1.875rem"
    fontWeight: 500
    lineHeight: 1.2
    fontFeature: "tnum"
    fontVariation: "'MONO' 1"
rounded:
  glyph: "1px"
  sm: "4px"
  lg: "8px"
  full: "9999px"
spacing:
  hairline: "1px"
  cell: "16px"
  panel: "20px"
  panel-md: "24px"
  gutter: "20px"
  gutter-sm: "32px"
  stack: "32px"
  section: "64px"
  section-md: "80px"
  container: "72rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "oklch(0.7743 0.1479 68.78 / 0.9)"
    textColor: "{colors.on-accent}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-secondary-hover:
    textColor: "{colors.accent}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.muted-strong}"
    typography: "{typography.mono}"
    rounded: "{rounded.sm}"
    padding: "4px 10px"
  chip-specialism:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    typography: "{typography.mono}"
    rounded: "{rounded.sm}"
    padding: "4px 10px"
  filter-chip:
    backgroundColor: "transparent"
    textColor: "{colors.muted-strong}"
    typography: "{typography.mono}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "32px"
  filter-chip-current:
    textColor: "{colors.accent}"
  panel:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.lg}"
    padding: "{spacing.panel}"
  proof-cell:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.numeral}"
    padding: "{spacing.cell}"
  board-row:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "12px 16px"
  board-row-hover:
    backgroundColor: "oklch(0.1838 0.0052 67.50 / 0.6)"
  status-badge:
    textColor: "{colors.muted}"
    typography: "{typography.mono}"
  input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
  top-bar:
    backgroundColor: "oklch(0.1838 0.0052 67.50 / 0.9)"
    textColor: "{colors.ink}"
    typography: "{typography.mono}"
  eyebrow:
    textColor: "{colors.accent}"
    typography: "{typography.label}"
---

# Design System: Christian Raro — Portfolio 4.0

This file describes the system as it was built on the `v4` branch. Where it
disagrees with the code, the code wins; fix this file. The normative sources are
`app/globals.css` (tokens and utilities), `tailwind.config.js` (colour keys and
radii), `app/layout.tsx` (the typeface), `components/ui/status-badge.tsx` with
`lib/display-status.ts` (status), and the direction contract in
`.impeccable/surfaces/app-page-tsx.md` (seed `2f5d7c31`, run and acknowledged;
the user's pin of B3 Signal beat the roll).

## Overview

**Creative North Star: "The Operator's Board"**

B3 Signal treats a portfolio as an operations board, not a gallery. Projects are
running systems, so they appear as rows with an honest status beside a domain,
never as a hero over a grid of screenshot cards. The ground is warm graphite,
panels sit one step lighter, and ink is cream. Sodium amber, the colour of a
street lamp at night, is the only brand colour. Green appears only where a
system is live.

The system is dense and exact rather than expressive. Structure comes from
hairline rules and a single column system that panels, board columns and proof
cells all measure against. It uses one typeface in two voices: Recursive's
linear sans for people (headlines, ledes, summaries, testimonials) and its MONO
axis for systems (labels, domains, dates, counts, status). Every numeral is
tabular. Motion is almost absent. Content is visible in the server HTML, the live
dot pulses twice and rests, and nothing moves for more than five seconds.

The rejected default is the one the thesis names: the developer portfolio made
of a hero followed by a grid of screenshot cards. Screenshots appear only as
small supporting insets inside product panels.

**Key Characteristics:**
- Warm graphite ground (dark is the default theme) with a cream-paper light theme built from the same hues.
- One brand colour, sodium amber. Green is reserved for live status.
- Status is always a glyph shape plus a text label: dot, ring, lock, square.
- Hairline rules, 8px panels, 4px chips. The ground is flat, and shadows appear only on floating layers.
- One grid, `mx-auto max-w-6xl px-5 sm:px-8`, and tabular mono numerals.
- One variable family, Recursive, whose MONO axis gives the system voice.
- Motion is limited to two pulses and short fades, and reduced motion removes the pulse.

## Colors

The palette is a narrow warm-neutral ramp (hue 62–85) with one high-chroma amber
and one reserved green. Every colour is a raw oklch `L C H` triplet in
`app/globals.css`, one per line. `:root` holds the light theme and `.dark`
holds the default. Tailwind wraps each triplet as
`oklch(var(--x) / <alpha-value>)`, so opacity modifiers (`bg-canvas/90`,
`bg-accent/90`) keep working. `tests/design/contrast.test.ts` parses those lines
and checks WCAG contrast in both themes, so the one-per-line format is load-bearing.

### Primary
- **Sodium Amber** (`accent`): the only brand colour. It is used for the primary CTA fill ("Start a project", "Send message"), eyebrows and group headings, the availability line and its 6px dot, the hero H1's closing period, the specialism line, link text in panels, hover states (border and text shift to amber), the board row's hover rule, and the focus ring. In light mode it deepens to a burnt amber (`accent-light`) to hold contrast on cream.
- **On Amber** (`on-accent`): text on an amber fill. It is the canvas colour, so the CTA reads as a cut-out of the ground.

### Secondary
- **Signal Green** (`live`): a live system and nothing else. It appears as the live status dot and its pulse ring. Brand, success and availability never use it.

### Tertiary
- **Early-access Amber** (`status-early`): the same value as `accent`, used only as the 1.5px ring of the early-access glyph. The shape, a hollow ring rather than a filled dot, separates it from brand amber.
- **Gated Grey** (`status-private`, `status-internal`): a mid warm grey for the lock (private) and square (internal) glyphs. It is deliberately quiet, because neither state can be visited.

### Neutral
- **Warm Graphite** (`canvas`): the page ground. It also fills proof-band cells and form fields, so those read as wells cut into a panel.
- **Graphite Panel** (`panel`): one step lighter than canvas. It is used for panels, the board, product panels, the contact form, the chat dialog and toasts. The field log section tints its band with `panel/40`.
- **Cream Ink** (`ink`): headings, body copy, project names and error text.
- **Strong Muted** (`muted-strong`): ledes, summaries, captions, nav links, form labels and secondary chips.
- **Muted** (`muted`): mono metadata such as column headers, domains, dates, band labels, status labels and the footer.
- **Hairline** (`line`): every rule and panel border, and the 1px gaps between hairline cells.
- **Strong Hairline** (`line-strong`): borders on interactive controls (secondary buttons, chips, inputs, the theme toggle) and the portrait frame.

### Named Rules
**The Green Means Live Rule.** Green (`live`) marks a live system and nothing else. Success toasts use an amber check, availability uses amber, and brand uses amber.

**The One Amber Rule.** Amber is the only brand hue. Never introduce a second accent, and never use raw hex or `dark:` colour pairs. Change the token, and both themes follow.

**The No-Red Rule.** Errors are ink, not red. An invalid field's border turns `ink`, the inline error and urgent toasts carry an octagon glyph in `ink`, and urgent toasts get an `ink` border. The glyph and the words carry the meaning.

## Typography

**Display Font:** Recursive (variable, via `next/font/google`, exposed as `--font-sans`, with `system-ui, sans-serif` as fallback)
**Body Font:** Recursive, the same family
**Label/Mono Font:** Recursive with `font-variation-settings: 'MONO' 1` (fallback `ui-monospace, monospace`)

**Character:** A single family carries both voices. Its linear sans speaks for people, and its MONO axis, set through `.font-mono` and `.eyebrow`, speaks for systems. Loading only the MONO axis, plus the default weight axis, keeps the font file small.

### Hierarchy
- **Display** (600, `clamp(2.5rem, 1.913rem + 2.609vw, 4rem)` meaning 40px at a 360px viewport and 64px at 1280px, line-height 1.02, tracking -0.025em): `.text-fluid-h1`. The hero H1 ("Full-stack developer" followed by an amber period) and the `/projects` H1.
- **Headline** (600, `clamp(1.5rem, 1.2rem + 1.25vw, 2.125rem)`, 1.1, -0.02em): `.text-fluid-h2`. Every section H2. It may carry a trailing mono count in `muted` ("products · 3").
- **Title** (600, 1.25rem): product panel names.
- **Lede** (400, 1.125rem, 1.625): the hero lede, capped at `34rem`, and the `/projects` description. Set in `muted-strong`.
- **Body** (400, 1rem, 1.6): the page default. Long descriptions cap at `65ch`.
- **Body small** (400, 0.875rem): summaries, captions and timeline subtitles.
- **Label** (500, 0.75rem, tracking 0.1em, uppercase, MONO, amber): `.eyebrow`, board group headings, timeline group labels and stack category terms.
- **Mono** (400, 0.75–0.875rem, MONO, tabular): the top-bar mark `~/christian-raro`, nav, chips, domains, dates, status labels, form labels and the footer.
- **Numeral** (500, 1.875rem, MONO, tabular): proof-band values, zero-padded to two digits ("03", "15").

### Named Rules
**The One Family Rule.** Recursive is the only typeface. Never add a second one. For a second voice, turn the MONO axis on instead.

**The Tabular Rule.** Every numeral, including proof values, counts, dates and "9 of 15", is set in mono, and `.font-mono` applies `tabular-nums`. That puts every number on the one grid automatically.

**The Braced Eyebrow Rule.** Eyebrow copy reads `// section` and lives in `lib/data.ts`. In JSX it is rendered from data or as a braced string (`{'// about'}`), because a bare `// text` child parses as a comment.

## Layout

**One grid.** Every section's content box is `mx-auto max-w-6xl px-5 sm:px-8`: a 72rem (1152px) container with 20px gutters, widening to 32px at 640px. The top bar, the footer and `/projects` share it, so every left edge on the site aligns.

**Section rhythm.** Sections stack vertically and are separated by full-bleed hairline rules (`border-t` or `border-b` in `line`) rather than by background bands. The one exception is the field log's faint `panel/40` band. Padding is 64px vertical, rising to 80px at 768px. Every section heading follows the same stack: an eyebrow, 12px of space, the H2, then 32px before the content.

**Homepage order.** Hero (with the proof band), Products, Systems board, Field log, Changelog, Stack, Contact. Changelog and Stack use a tighter gap between them, so the descent to Contact reads as one closing run.

**Hero.** Two columns at 768px and above (`1fr auto`, bottom-aligned): the text column and a framed 220×260 portrait. Below 768px the portrait becomes a 40px avatar beside the eyebrow, so the proof band stays near the fold. Below 640px, where the top bar hides availability, the hero states it instead.

**Board columns.** One column template is shared by the header and every row (`BOARD_COLUMNS`). It is `1fr 7.5rem` on phones, `1.2fr 1fr 7.5rem` at 640px (adding a domain column) and `1.1fr 1fr 1.7fr 7.5rem` at 768px (adding "what it does"). The status track is fixed at 7.5rem, so the domain column starts at the same x on every row.

**Hairline cells.** The proof band (2 columns, then 4 at 768px) and the stack grid (3 columns at 640px) are built the same way. The container is `rounded-lg`, clips its overflow, has a `line` border and a `line` background, and separates its cells with a 1px gap. The rules come from the gap.

**Other grids.** Product panels stack full width with 16px between them. The field log runs one, two, then three columns (640 and 1024px). Contact splits `1fr 1.2fr` at 768px.

**Touch targets.** Interactive text is at least 44px tall below the breakpoint where it tightens (640 or 768px), and 32–36px above it.

## Elevation & Depth

The ground is flat. Depth comes from tonal layering, where canvas sits beneath panel, and from hairline borders, not from shadows. Inset wells reverse the step: proof cells, inputs and the chat log sit on `canvas` inside a `panel`. Shadows exist only on layers that float above the page, and they use Tailwind's stock values.

### Shadow Vocabulary
- **Float** (`shadow-lg`: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): the chat launcher, its hover label, and toasts.
- **Overlay** (`shadow-2xl`: `0 25px 50px -12px rgb(0 0 0 / 0.25)`): the open chat dialog and the lightbox image.

The sticky top bar is the one translucent surface: `canvas` at 90% with a backdrop blur and a hairline bottom rule. The lightbox scrim is `canvas` at 95%.

### Named Rules
**The Flat Ground Rule.** Nothing that sits in the page flow casts a shadow. A panel is separated from the ground by one tonal step and a hairline. Only floating layers (chat, toasts, the lightbox) are lifted.

## Shapes

- **Panels: 8px** (`rounded-lg`, from `--radius: 0.5rem`). This covers the board, product panels, the proof band, the stack grid, the field log cards, the changelog panel, the contact form, the chat dialog and bubbles, toasts, and the portrait frame.
- **Controls and chips: 4px** (`rounded`). Buttons, chips, filter links, inputs, the theme toggle, the portrait image inside its frame, and screenshot insets.
- **Glyphs:** the live dot and early-access ring are circles, the internal square has a 1px corner, and the private glyph is a 12px outlined padlock.
- **Rules:** all borders are 1px. The one heavier stroke is the 2px amber left rule a board row draws on hover.

**The Hairline Rule.** Structure is drawn with 1px lines in `line`, and interactive controls step up to `line-strong`. No border is decorative. Each one either separates content or outlines something you can press.

## Components

### Buttons
Buttons are confident and plain, with no gradients and no icons beyond a trailing arrow.
- **Shape:** 4px corners (`rounded`) and a 44px minimum height, with 20px horizontal padding and a medium (500) sans label.
- **Primary:** an amber fill with `on-accent` text and a trailing `ArrowRight`. It is used for "Start a project" in the hero and on `/projects`, and for "Send message". Each section has at most one primary.
- **Hover / Focus:** the fill drops to 90% amber. Focus is a 2px solid amber outline offset by 2px, applied globally through `:focus-visible`.
- **Secondary:** transparent, with a `line-strong` border and `ink` text. On hover the border and text turn amber. Used for "Résumé" and "View work".
- **Icon buttons:** 36–44px squares (the theme toggle, lightbox close, chat close) with a `line-strong` border or none, and `muted-strong` or `muted` icons that turn amber on hover.
- **Disabled:** 60% opacity. While sending, the label changes to "Sending" with a spinning loader.

### Chips
- **Stack chip:** transparent, `line-strong` border, 4px corners, mono xs, `muted-strong` text.
- **Specialism chip (WordPress):** marked by a `panel` fill and `ink` text, never by amber, because an amber outline already means "selected" on the board filter.
- **Filter chip (`/projects`):** plain links (`?band=`), so filtering works without JavaScript. The current chip has an amber border and amber text plus `aria-current="page"`, and the others take amber on hover.
- **Chat suggestion chip:** the stack chip's shape at 32px tall, turning amber on hover.

### Cards / Containers
- **Corner Style:** 8px.
- **Background:** `panel` on the `canvas` ground, with `canvas` wells inside.
- **Shadow Strategy:** none, following the Flat Ground Rule.
- **Border:** 1px `line`.
- **Internal Padding:** 20px, rising to 24px at 640 or 768px. Proof cells use 16px.

### Inputs / Fields
- **Style:** a `canvas` well inside the `panel` form, with a 1px `line-strong` border, 4px corners, 10px×12px padding, `ink` text and a `muted` placeholder. Labels sit above in mono xs `muted-strong`.
- **Focus:** the border turns amber, and the global amber outline also applies.
- **Error:** following the No-Red Rule, the border turns `ink` (`aria-invalid`). An inline message with an octagon glyph is tied to the field through `aria-describedby`, and it persists after the error toast is dismissed.

### Navigation
- **Top bar:** sticky, translucent `canvas/90` with a backdrop blur and a hairline bottom rule. The mono mark `~/christian-raro` sits left, then amber availability (6px dot and text, hidden below 640px) and the theme toggle. Nav links are mono xs in `muted-strong` and turn amber on hover. DOM order matches visual order at every width. Below 768px the nav wraps to its own row, with 44px targets.
- **Footer:** a hairline top rule, the year and name, and social links, all in mono xs `muted`, turning amber on hover.

### Status Badge (signature)
Status is never colour alone. It renders only through `StatusBadge`, which pairs a glyph with a mono xs `muted` label. `lib/display-status.ts` maps the data's five `ProjectStatus` values to four display states:

| Display | Data status | Glyph | Colour |
|---|---|---|---|
| Live | `live`, `ua-gated` | 8px filled dot, pulses twice | `live` |
| Early access | `early-access` | 8px ring, 1.5px stroke | `status-early` (amber) |
| Private | `auth-gated` | 12px outlined padlock | `status-private` |
| Internal | `internal` | 8px square, 1px corner | `status-internal` |

Amber is both the brand colour and the early-access colour, so the shape is what tells them apart. `compact` hides the label visually but keeps it in the accessibility tree.

### Systems Board (signature)
A single `panel` frame with 8px corners and clipped overflow. A mono header row (`projects · 15`, `domain`, `what it does`, `status`, or `9 of 15` when filtered) sits on the rows' own grid, so each label names the column below it. Group headings use the amber label style. Each row is one hairline-topped grid line: the name in medium sans with a trailing `ArrowUpRight`, the band in mono `muted` only when the group mixes bands, the domain in mono `muted`, the summary in `muted-strong`, and the status badge at the right. On hover a linked row gets a faint `canvas/60` wash, a 2px amber rule on its left edge, and an amber arrow. The focus outline is drawn inside the row (offset -2px) because the frame clips overflow. A row with no public URL renders as a plain row with "no public URL", never as `href="#"`.

### Product Panel (signature)
A product is a running system first and a picture second. The panel leads with the name (Title), the status badge, the one-line summary in `ink`, the description in `muted-strong` (capped at 65ch) and an amber mono domain link. The screenshot is a supporting inset of 12–15rem at a 16:10 ratio, with 4px corners, a hairline border and top-anchored crop, placed to the right from 640px. It is never the panel's headline.

### Proof Band (signature)
Four hairline cells: a zero-padded mono numeral in `ink` above a sans label in `muted`. Screen readers hear the source sentence ("Fifteen projects shipped"). The numeral and label are `aria-hidden`.

### Field Log
Photo cards (a 4:3 image that opens the lightbox, with an always-visible caption in `muted-strong`, never shown only on hover) interleave with testimonial cards (the quote in `ink`, attribution in mono `muted`, and a project reference `re: <project>` in amber). When the final entry is a lone quote at three columns, it spans the full width.

### Changelog
One panel with two labelled groups, "Work" and "Education", split `2fr 1fr`. Each group is an ordered list on a hairline left rule with 6px `line-strong` node dots. Dates are mono `muted`.

### Chat (Chunks)
A non-modal dialog, 380×520 at most, in `panel` with an Overlay shadow. The header shows the live dot and a mono title `~/ask chunks`. The log is a `canvas` well: the visitor's bubbles are `line` fill with a `line-strong` border, and the bot's are `panel` with a `line` border. Mono meta lines read `you · 3:04 PM`. The launcher is a 44–56px `panel` square with an amber icon and a small live dot.

### Toasts
`panel` cards with 8px corners and the Float shadow, top right. Success and info use an amber check or info glyph with a `line-strong` border and dismiss after 5s. Warning and error use an `ink` triangle or octagon with an `ink` border and stay until dismissed. There is no green.

### Motion
- **Live pulse** (`.live-pulse`): an opacity-only 1px `live` ring (inset -3px) that fades from 0.7 to 0 over 2.4s ease-out, **twice**, then stops (4.8s in all). Reduced motion removes it.
- **Hover:** colour and opacity transitions only, at Tailwind's default 150ms.
- **Enter/exit:** 200ms fades with `cubic-bezier(0.22, 1, 0.36, 1)` for the chat, toasts and lightbox, with a small 8px or 0.98-scale offset. Under reduced motion they switch instantly with no offset.
- **Reveal:** `Reveal` fades and slides in on mount (0.5s, `cubic-bezier(0.21, 0.47, 0.32, 0.98)`, 20px). It is deliberately not triggered on scroll. Primary proof (Products, Systems) does not use it and renders visible from the server.
- **Typing dots** (`.typing-dot`): three dots fading in turn (1.2s) that exist only while a reply loads.
- **Reduced motion:** `globals.css` collapses every animation and transition to about 0ms and one iteration. `useReducedMotion` removes movement in framer-motion.

**The Two Pulses Rule.** Nothing moves continuously for more than five seconds (WCAG 2.2.2). The live pulse runs twice and stops. There are no count-ups, no parallax and no scroll-linked motion.

## Do's and Don'ts

### Do:
- **Do** wrap every section in `mx-auto max-w-6xl px-5 sm:px-8`, and put new columns on an existing template (`BOARD_COLUMNS`, or hairline cells with a 1px gap).
- **Do** open every section with `<p className="eyebrow">` then `<h2 className="text-fluid-h2">`, with both strings in `lib/data.ts` (`sectionContent`, `galleryContent`, `projectsPageContent`).
- **Do** keep control labels in the component. "Start a project", "View work", "All", "Work" / "Education" and form labels are chrome. Headings, eyebrows and facts are content.
- **Do** render status only through `StatusBadge`, with a glyph shape and a text label.
- **Do** set numerals, domains, dates and metadata in mono. `.font-mono` makes them tabular.
- **Do** use amber for the one primary action per section, for hover, for focus and for availability.
- **Do** add new colours as oklch `L C H` triplets in both `:root` and `.dark`, one per line, so the contrast test can parse them.
- **Do** give every interactive element a 44px minimum target on touch widths.

### Don't:
- **Don't** use green for anything but a live system: not success, not availability, not brand.
- **Don't** convey status, error or selection by colour alone.
- **Don't** add a second typeface. Use Recursive's MONO axis for the second voice.
- **Don't** use raw hex, `dark:` colour pairs or a second accent hue.
- **Don't** use red for errors. Use `ink` with an octagon glyph.
- **Don't** put shadows on in-flow panels. Use a tonal step and a hairline.
- **Don't** build a hero over a grid of screenshot cards. Screenshots are insets inside panels that lead with name, summary and status.
- **Don't** animate continuously, count up numbers, use parallax or trigger motion from scroll position. Don't wrap primary proof in `Reveal`.
- **Don't** mark a selected-looking state with an amber outline unless it is actually selected. That treatment belongs to the board filter.
- **Don't** hardcode portfolio content (headings, eyebrows, facts) in components.

## Raster Provenance

Every raster the site ships, and where it came from.

| Raster | Source | Provenance |
|---|---|---|
| `public/assets/images/projects/*.png` (13: `iskotify`, `naga-perks-giya-app`, `latag`, `aman-webapp`, `graceland`, `elnido`, `beachbus`, `upcat-review-plus`, `acad1`, `downtown-district-hotel`, `azalea-baguio`, `azalea-boracay`, `aralabroad`) | Captured from each project's live site | `npm run capture` (`scripts/capture-screenshots.mjs`) drives system Chrome/Edge through `puppeteer-core` at a 1440×900 viewport. It reads the inventory from `lib/data.ts`, captures only projects with a public URL that are not `auth-gated` or `internal`, and writes `<id>.png`. Re-run it when a site changes. |
| `public/assets/images/gallery/*.jpg` (6 field-log photos) | Christian's own photographs | Resized to at most 2400px on the long edge (commit `be97fe4`). Captions and alt text live in `galleryImages` in `lib/data.ts`. |
| `public/assets/images/about/profile-hiking.jpg` (hero portrait) | Christian's own photograph | Shown as the framed hero portrait and the mobile avatar. |
| `public/assets/images/og-image.png` (1200×630 social card) | Generated 2026-06-16 (commit `bde1e1e`) | It predates B3 Signal. See Open Points. |

Auth-gated and internal projects (the OCS control panel, the BeachBus NFC system) have no screenshot. Their interiors need client clearance, and any screenshot must be supplied by hand.

## Open Points

These are recorded rather than resolved. The owner has approved the direction, and these points are left for follow-up.

1. **The OG image is off-system.** `og-image.png` is in the Portfolio 3.0 look: a crimson top rule and eyebrow, a serif display face, and the title "Software Engineer". That breaks the One Amber Rule and the One Family Rule and contradicts the H1 "Full-stack developer." Regenerate it in B3 Signal (graphite, amber, Recursive) from `heroContent`.
2. **Legacy rasters still ship.** `public/assets/images/projects/` holds `.webp` files and `ARway Screenshot.jpg`, and `about/` holds five portraits, none of which the code references. They deploy with `public/` and have no recorded provenance. Remove them or record their provenance.
3. **The chat's live dot stretches the Green Means Live Rule.** The chat launcher and header use the pulsing live dot to mean that the assistant is available, and it stays green when `/api/chat` answers in offline mode. Decide whether Chunks counts as a live system or should take the amber availability dot.
4. **Motion that is bounded by a request, not a timer.** The typing dots loop, and the "Sending" loader spins, for as long as a request takes. A slow Groq reply could hold them past five seconds. Reduced motion stops both.
5. **Zero-padded numerals.** The proof band's "03" and "01" keep the column tidy, but the latest critique found that they read as code to a non-technical first-time visitor.
6. **There is no status legend.** Glyph and label always travel together, but the board has no key explaining what Early access, Private and Internal mean to a client.
