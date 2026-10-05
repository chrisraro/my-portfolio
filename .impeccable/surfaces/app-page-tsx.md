---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/projects/page.tsx", "app/projects/[slug]/page.tsx", "app/not-found.tsx"]
---

# Homepage surface brief

Scope: `/` (Persuade). `/projects` inherits the world (Operate-leaning index),
`/projects/[slug]` is Read, the 404 inherits.
Audience and job: freelance clients first (Philippine hotels, tour and shuttle
operators, restaurants, review centres), deciding whether to hire; engineering
hiring managers second.
Action: Start a project (`#contact`); secondary: Résumé, View work, Live preview.
Proof: four products of his own, 18 projects each with a scroll-through preview,
four payment gateways, six case studies, six on-site photos, four attributed
testimonials. Every claim derives from `lib/data.ts` / `lib/case-studies.ts`.
Constraints: WCAG 2.2 AA; status never by colour alone (`StatusBadge`); green
only for live; nothing auto-moves longer than 5 s; CSS-first motion that is
progressive enhancement (content visible without it); client components ≤ 9.
Replaces: B3 Signal (graphite, sodium amber, Recursive, ops board). Anti-reference.
Unresolved: OCS control-panel interior needs the client's clearance; the
decision round ran unattended (Christian asleep), so this direction awaits his
review on the v4 preview.

## Direction contract

Seed `f1d5d2c7` (persuade). Grounded list, by resonance: 1 terminal departure
board, 2 jeepney route signage and livery, 3 ferry tickets and boarding stubs,
**4 the resort lobby brochure rack (assigned, built)**, 5 Bicol abaca and banig
weave, 6 island-hopping tour map, 7 sari-sari store signboards. The roll
assigned 4; it was not my top pick (1 was, and it sits too close to the B3
board being replaced). Unattended run: no decision page could be answered, so
the assigned direction is built and the alternates below stay adoptable.

THESIS: Every project is a brochure in a lobby rack. You see its top over the
pocket lip; give it attention and it lifts out and shows you the actual site,
scrolling. The page's job is the job his clients' brochures did before he
built their websites. It refuses the dev-portfolio default (dark hero, gradient
blobs, a grid of screenshot cards) and its predictable opposite (the mono
terminal board B3 already was).

OWN-WORLD: "Lobby Rack". Printed matter in a resort lobby at night: a deep
lagoon ground, paper-white ink, and signal amber laid down as flat,
confident printed planes (never glows, gradients or outlines). Ube violet
exists only as the early-access ring. Surfaces are paper: panels, cards, folds
and creases, a rack lip with pockets, perforated reply cards, postcards. A
condensed, variable display face (Anybody) does the shouting; Figtree reads.
Recognisable with the content removed: amber planes, dashed fold creases,
tall portrait cards half-sunk in pocketed tiers.

STORY: The visitor opens a brochure (the hero unfolds) and understands: a
full-stack developer in Naga City who builds hotel, tour and restaurant sites
with booking and payments, and products of his own. They believe it because
every card lifts out to show the real site scrolling, and the embeddable ones
open live. They read one case study, see the people and places, and fill in the
reply card: Start a project.

FIRST VIEWPORT (1440×900): a 64px top bar, then a tri-fold brochure spanning
the grid, about 640px tall. Front panel (1.3fr): a full amber plane; eyebrow
"Christian Raro · Naga City" in on-accent; H1 "Full-stack developer" in Anybody
800 at wdth 75, 56–112px, two lines, on-accent; lede (Figtree 19px, on-accent);
specialism line; CTA row: primary "Start a project" (lagoon fill, amber text,
arrow) plus "Résumé" as an on-accent outline button. Middle panel (0.85fr): the
portrait, full bleed, hairline crease on each side. Right panel (0.85fr): `panel`
paper, four proof points as large numerals over labels, then the stack chips,
stacked from the top (no void between them).
Dashed fold creases (1px gradient-dashed spans) separate the panels. The hero closes on 72px (not the
section's 112px), so the Products eyebrow and heading sit whole above the
fold at 1440×900, inviting the scroll. Primary action
sits in the front panel at roughly y 520.

FORM: Lobby Rack, candidate 4 of 7, seed `f1d5d2c7`, assigned and acknowledged.
Colour strategy: Committed (amber owns the hero front panel, the contact reply
card and each product's flap: 30–40% of the first viewport).

Challenger verdicts (fused, judged on audience identification and product clarity):
- Hand-processed 16mm film (competitive: product clarity, since a frame strip
  maps onto the scroll-through preview; loses audience identification).
  Alternate. **RAISE (from 16mm film):** every card carries an edge code along
  its margin, a running index `04 / 18` plus band, so the rack reads as one
  numbered strip and position is always known.
- Ikko Tanaka plane portrait (declined: both axes). **RAISE (from Tanaka):**
  total palette commitment. Colour arrives only as whole flat planes locked to
  the grid; no outlines on planes, no tints, no gradients; removing a plane must
  break the composition.
- Darkroom exposure record (declined). **RAISE (from the exposure record):**
  sheets carry mass. Panels and cards slide aside or lift, with a slight settle,
  rather than being replaced; nothing teleports.
- Night-flight six-pack (declined). **RAISE (from the six-pack):** each proof
  point owns one truth and one panel cell; motion is damped, never snapped.
- VHS rental wall (declined). **RAISE (from the rental wall):** honest absence.
  A project with no public preview keeps its slot with a printed tag ("Behind a
  login", "Internal system") instead of a fake picture.
- Luminescent understory (declined). **RAISE (from the understory):** the
  brightest value on the page is reserved for what has focus.

### Tokens

Raw oklch `L C H` triplets, one per line, `:root` light, `.dark` default. The
Tailwind key `canvas` is the CSS variable `--bg` (the contrast test reads `--bg`).

| Token | Dark (`.dark`, default) | Light (`:root`) | Role |
|---|---|---|---|
| canvas (`--bg`) | `0.2350 0.0420 232` | `0.9780 0.0060 220` | lagoon night / cool paper |
| panel | `0.2750 0.0460 232` | `1.0000 0.0000 0` | card and fold paper |
| ink | `0.9640 0.0110 100` | `0.2500 0.0450 240` | text |
| muted | `0.6900 0.0320 226` | `0.4900 0.0350 235` | metadata, edge codes |
| muted-strong | `0.8500 0.0220 220` | `0.3700 0.0400 238` | ledes, summaries |
| line | `0.3450 0.0420 232` | `0.9000 0.0120 225` | hairlines, creases |
| line-strong | `0.4300 0.0420 232` | `0.8200 0.0180 228` | control borders, rack lip |
| accent | `0.8200 0.1500 85` | `0.5300 0.1150 68` | signal amber planes (amber-brown in light), primary, focus |
| on-accent | `0.2350 0.0420 232` | `1.0000 0.0000 0` | text on an amber plane |
| live | `0.8200 0.1500 152` | `0.5500 0.1400 152` | live status only |
| status-early | `0.7600 0.1200 285` | `0.5200 0.1600 285` | early-access ring (ube violet, 200° from amber) |
| status-private | `0.6400 0.0300 226` | `0.5600 0.0300 235` | lock glyph |
| status-internal | `0.6400 0.0300 226` | `0.5600 0.0300 235` | square glyphs |

Contrast, computed with the contrast test's own OKLCH→sRGB formula (dark / light):

| Pair | Dark | Light | Need |
|---|---|---|---|
| ink on canvas / panel | 14.95 / 13.27 | 14.97 / 15.93 | 4.5 |
| muted on canvas / panel | 6.03 / 5.35 | 5.84 / 6.21 | 4.5 |
| muted-strong on canvas / panel | 10.55 / 9.36 | 9.73 / 10.35 | 4.5 |
| accent on canvas / panel | 9.41 / 8.35 | 5.10 / 5.43 | 4.5 |
| on-accent on accent | 9.41 | 5.43 | 4.5 |
| live on canvas / panel | 10.04 / 8.91 | 4.28 / 4.55 | 3 |
| status-early on canvas / panel | 7.51 / 6.67 | 5.49 / 5.84 | 3 |
| status-private, -internal on canvas / panel | 4.97 / 4.41 | 4.34 / 4.62 | 3 |

Rules: on an amber plane, text is `on-accent` only (ink on accent is 1.6–2.9,
forbidden). Amber is never a text colour on an amber-adjacent plane. Green
stays inside `StatusBadge`. No raw hex, no `dark:` colour pairs, no gradients.
Shadows: none in flow. A lifted card gets `0 18px 30px -18px oklch(0.12 0.03 232 / 0.55)`
in both themes (the one in-flow shadow, applied only while lifted); floating
layers (chat, dialog, toasts) keep an overlay shadow of the same hue.

### Type

Two families via `next/font/google`, `display: 'swap'`:
- **Anybody** (variable: `wght` 100–900, `wdth` 50–150; load `axes: ['wdth']`),
  `--font-display`. Display, headings, edge codes, numerals, buttons. Headings at
  wdth 75 (condensed brochure caps feel without caps), labels at wdth 100.
- **Figtree** (variable `wght` 300–900), `--font-sans`. Body, ledes, form, chat.

No mono family: edge codes, dates and domains use Anybody wdth 100 weight 500
with `tabular-nums` and 0.04em tracking. No count-ups; numerals are plain
("4", "17"), not zero-padded.

| Style | Family | Size | Weight / wdth | LH / tracking |
|---|---|---|---|---|
| `.text-fluid-h1` | Anybody | `clamp(3.5rem, 2.2rem + 5.6vw, 7rem)` | 800 / 75 | 0.9 / -0.02em |
| `.text-fluid-h2` | Anybody | `clamp(2rem, 1.5rem + 2.2vw, 3.5rem)` | 750 / 75 | 0.95 / -0.015em |
| Title (h3, card name) | Anybody | 1.5rem | 700 / 85 | 1.05 |
| Proof numeral | Anybody | `clamp(2.5rem, 2rem + 2vw, 4rem)` | 800 / 75, tnum | 0.9 |
| `.eyebrow` / edge code | Anybody | 0.8125rem | 600 / 100, tnum | 1.2 / 0.04em, sentence case |
| Lede | Figtree | 1.1875rem | 400 | 1.55 |
| Body | Figtree | 1rem | 400 | 1.6 |
| Small / caption | Figtree | 0.875rem | 400–500 | 1.45 |
| Button | Anybody | 1rem | 650 / 100 | 1 |

Eyebrows stay in `lib/data.ts` but lose the `// ` prefix: they become edge-code
labels (e.g. "Products of my own" sits under the eyebrow "In the rack · 01").
New section copy (case-study strip heading, rack tier labels) goes to
`sectionContent` in `lib/data.ts`.

### Layout, spacing, shape

- Grid: unchanged container `mx-auto max-w-6xl px-5 sm:px-8`; inside it a
  12-column grid, 24px gaps (16px below 640px).
- Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 72, 112. Section padding
  72 → 112 at 768px; heading stack: eyebrow, 12, h2, 40, content.
- Radius: paper is square-ish. Cards and panels 6px, buttons 6px, chips 999px
  (rack tags), dialog 10px. Postcards 2px.
- Borders: 1px `line` hairlines; folds are 1px dashed `line-strong` creases
  (6 on, 5 off, a repeating gradient on a 1px span). The rack lip is a 2px `line-strong` rule with a
  12px `panel` ledge under it. Perforation: 2px dotted `line-strong` with 10px
  half-circle notches at each end (radial mask).
- Surfaces: canvas ground; `panel` paper; amber planes; nothing else.

### Pages

**Homepage, in order** (anchors kept: `#work`, `#changelog`, `#contact`):
1. **Hero tri-fold** (`heroContent`, `availability`, `resumeUrl`, portrait
   `profile-hiking.jpg`). As the first viewport above. Below 768px the panels
   stack: amber front panel, then the portrait as a 4:3 band, then the proof
   panel; the creases turn horizontal.
2. **Products** `#work` (`sectionContent.work`; `projects` band `Products`, 4).
   Each product is an open fold-out spread at full grid width: an amber flap
   (4 cols: edge code, name, `StatusBadge`, summary) joined at a crease to a
   `panel` leaf (8 cols: description, domain link, "Live preview" when
   embeddable, "Read more" to `/projects/<slug>`) holding a **ScrollPreview**
   (portrait 3:4 frame, right side). Flap alternates left/right per product.
3. **The rack** (`sectionContent.systems`; `groupForHomepage`: "Custom systems"
   then "Client work"). Each group is a tier: tier label as an edge code, a
   rack lip, and pocketed cards (4 per row at 1024px, 3 at 768px, a
   horizontal scroll-snap strip with 78% card width below 640px). Card: 9:16
   portrait; the pocket shows its top 9/16 (a square): the 44% text block
   (edge code, name, `StatusBadge`, domain) and a sliver of the **ScrollPreview**
   with its "scroll" cue, so a preview is seen at rest; the rest is sunk. Whole
   card links to `/projects/<slug>`; no LivePreview in the rack (one interactive
   target per card). Auth-gated / internal: a flat card that fits its pocket
   whole, never lifts, and prints its `caseStudyContent.noPreview` tag in the
   visible top. Staging: a diagonal "Staging" tag on the
   top. On touch widths cards are not sunk (full card visible).
4. **Case studies** (new `sectionContent.caseStudies`; the six in
   `lib/case-studies.ts` joined to their projects). A row of six closed
   tri-folds (front covers): title, `role`, first sentence of `brief`, edge
   code. Each links to its flagship page. 3 columns at 1024px, 2 at 640px,
   1 below.
5. **Field log** (`galleryContent`, `galleryImages`, `recommendations`).
   Postcards (photo, caption always visible, opens `ImageLightbox`), rotated
   −1.5° / +1° alternately, interleaved with testimonial cards on `panel`
   (quote in ink, attribution in muted, "re: <project>" link in accent).
6. **Where I've worked** `#changelog` (`sectionContent.changelog`,
   `experience`, `education`). A route line: horizontal on desktop with stops
   (dates in edge-code type, role, place), vertical below 768px. Work and
   Education as two lanes.
7. **What I ship with** (`sectionContent.stack`, `skills`). The brochure's back
   panel "amenities": category headings with skill names in columns, dotted
   leaders, WordPress marked by a `panel` chip (never amber outline).
8. **Contact** `#contact` (`sectionContent.contact`, `contactInfo`,
   `socialLinks`). A business reply card: an amber plane (left, 5 cols:
   heading, availability, email, socials, all on-accent) perforated to a
   `panel` form leaf (7 cols). "Send message" is the one primary button
   (`.button-primary`): an amber fill on paper; only on an amber plane does
   it invert to a lagoon fill with amber text (the hero's "Start a project").
Footer: hairline, name, year, socials, small edge code "Printed in Naga City".

**`/projects`**: `projectsPageContent` heading, filter chips as rack-tier tabs
(`?band=`, links, `aria-current`), then every band as a tier of the same pocket
cards, in `BAND_ORDER`. Products appear as cards here too (with ScrollPreview),
standing whole on the shelf rather than sunk: an open tier that reserves no lift.
A "Start a project" primary under the heading.

**`/projects/[slug]`** (Read): front cover header full grid: "← All projects",
eyebrow (`caseStudyContent.eyebrow`), H1 (`.text-fluid-h1` at the smaller end:
`clamp(2.75rem, 2rem + 3.5vw, 5rem)`), `StatusBadge`, summary (lede), role on
its own line (flagship), `band · sector` edge code, meta strip (dates, payment
gateways), actions: "Open live site" (secondary), **LivePreview** button when
embeddable, "Start a project" (primary). Below, a two-column spread at 1024px:
prose leaf left (`max-w-[36rem]`, section headings at Title tier), and a sticky
preview rail right (top: 96px): **ScrollPreview** (3:4, desktop shot), the mobile
shot below it in `ImageLightbox`, crease between leaf and rail. Under 1024px the
rail becomes a block: after the header on short pages, after "The brief" on
flagships. Flagship sections: The brief, What I built, Decisions (numbered
fold panels: chose / over / because), Stack, Outcome (+ metric cells), From the
client, Related. Footer: the next case study as one pocket card ("Next in the
rack"), then the CTA pair. Short page: About the project, Part of…, Stack.

**404**: the grid; an empty rack pocket (lip + empty slot with a tag reading the
`notFoundContent.eyebrow`), H1 `notFoundContent.title`, one sentence, "All
projects" primary, "Back to the homepage" secondary.

### MOTION

Brand idea: **paper that unfolds when you pay attention.** Three verbs only:
*unfold* (reveals detail: hero, products, case studies), *lift* (attention and
selection: a card rising out of its pocket), *slide* (continuity: things move
aside, never vanish). Motion always answers "what did my attention just open?"

Tokens (`lib/motion-tokens.ts` ↔ `--dur-*`, `--ease-*`): fast 0.18s, normal
0.35s, slow 0.6s, crawl 1.2s; smooth `cubic-bezier(0.22,1,0.36,1)`, sharp
`cubic-bezier(0.4,0,0.2,1)`; distances sm 8, md 16, lg 24, xl 40px. Settle =
smooth easing (its overshoot-free tail is the "mass"); no spring on CSS motion.

**Hero sequence** (CSS keyframes on load, no JS, total 1.9s, runs once):
- 0ms: H1 words rise `translateY(0.35em) → 0`, slow/smooth, 90ms stagger.
  Words are painted from frame one (no opacity, no clip), so LCP is unaffected.
- 0ms: the amber front plane is static (it is the LCP surface).
- 250ms: lede, specialism and CTA row rise md → 0 with opacity 0.01 → 1, normal/smooth.
- 400ms: middle panel unfolds `rotateY(-88deg) → 0`, hinge at its left edge,
  `perspective: 1600px` on the tri-fold, slow/smooth (ends 1000ms).
- 650ms: right panel unfolds the same way (ends 1250ms).
- 450ms and 700ms: each crease span draws top→bottom (`scaleY(0 → 1)`; `scaleX` across when stacked), crawl/smooth (ends 1.9s).
- 1100ms: proof items rise sm → 0, 60ms stagger, normal/smooth (ends ~1.63s).
- Live dots on any visible badge: the existing twice-then-rest pulse.
Below 768px: panels unfold `rotateX(88deg) → 0` from their top edge instead.

**Scroll choreography** (`.reveal-*` utilities, `animation-timeline: view()`,
`animation-range: entry 10% cover 30%`, inside
`@supports (animation-timeline: view())` and
`@media (prefers-reduced-motion: no-preference)`; outside both, nothing is
hidden or offset). Proof sections (Products, rack) animate transform only, never
opacity, so server HTML stays visible:
- Products: each flap unfolds against its leaf, `rotateY(±22deg) → 0` (hinge at
  the crease), leaf slides xl → 0 toward the crease.
- Rack: the lip draws `scaleX(0 → 1)` from the left; cards drop into pockets
  `translateY(-xl) → 0`, staggered by `--i` × 40ms via `animation-delay`.
- Case studies: covers rise md → 0, transform only (never faded: a case study is read at full contrast), staggered.
- Field log: postcards slide in from xl at their resting rotation; quotes rise md.
- Route line: the SVG path draws with `animation-timeline: view()` across the
  section (`entry 0% exit 40%`), stops pop `scale(0.6 → 1)` as the line passes.
- Amenities: no scroll motion (a quiet passage after a dense one).
- Contact: the reply card slides up lg and the perforation draws left→right.

**Hover / press grammar** (transform and opacity only; colour transitions fast/sharp):
- Text links: an underline pseudo `scaleX(0 → 1)` from left, fast/smooth; leaves right.
- Buttons: hover lifts `translateY(-2px)`, press `translateY(1px) scale(0.98)`,
  fast/sharp; primary's arrow slides sm right on hover.
- Rack card: hover / `:focus-visible` / `:focus-within` lifts it out of the
  pocket `translateY(-26%)` (more of the sunk preview rises above the lip), normal/smooth,
  lifted shadow; the ScrollPreview inside starts scrolling after the lift
  (delay = normal). Press: `translateY(-22%)`, fast. Leave: back down, normal.
  Each shelf reserves the lift (`.rack-shelf` / `.rack-row`): the first row is
  padded and rows sit apart by it, so a lifted card never covers the tier
  heading or the printed top of the row above. Within a tier, cards with a
  preview lead; on the homepage a tier with previews leads one without.
- Product flap: hover tilts the flap `rotateY(-4deg)`, normal/smooth, inviting the open.
- Postcard: straightens to 0° and lifts sm, normal/smooth.
- Focus is the brightest thing on the page: 2px accent outline, 3px offset,
  plus the hover transform.

**Preview scroll** (`ScrollPreview`): the full shot in a fixed 3:4 (product,
project page) or 9:16 (rack) frame, `object-fit: cover`, `object-position: 50% 0`.
On hover / `:focus-visible` of the frame (or its card): to `50% 100%` over
`--scroll-dur = clamp(1.2s, shotHeight / 1500 × 1s, 4.5s)` (set inline as a CSS
variable from the image's height), sharp easing; a 3px accent progress rule on
the frame's right edge grows `scaleY(0 → 1)` with the same duration and easing,
showing how far through the page you are, over a `line-strong` track that is
visible at rest, with a printed "scroll" cue in the frame's corner. On leave:
back to top over slow/smooth, rule shrinks. It stops at the bottom; it never
loops. Where scroll timelines exist, the previews a visitor is meant to see
also move without hover, scroll-bound (not auto-playing): a product frame
scrolls the site as it crosses the viewport (`view()`, cover 15%–85%), a
project page's sticky rail follows the page's scroll (`scroll(root)`), and the
rack's unsunk cards below 640px follow their tier, and from 640px each rack
card follows its own slot (`view()`, cover 15%–85%), so the sliver over the lip
moves at rest; hover / focus lift the card to show more. Under reduced motion
the rack's sliver and cue stay visible, the shot pinned at the top.
LivePreview dialog: scrim fades normal; dialog rises md with opacity, normal/smooth;
the desktop↔mobile toggle resizes the iframe frame via `transform: scaleX` of a
wrapper plus width swap at the end (layout once, not animated per frame);
exit reverses at fast.

**Reduced motion** (`prefers-reduced-motion: reduce`):
- Hero: everything in its final state at first paint; creases drawn.
- Scroll reveals: not applied (the `@media` gate); all content at rest.
- Hover/press: transforms removed; colour and underline appear instantly; the
  rack card is shown already lifted on focus (state change without travel).
- ScrollPreview: stays at the top; no progress rule; the dialog fades only (fast).
- Live pulse removed. `useReducedMotion` gates every `motion/react` piece.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
