import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Every colour token is a raw oklch "L C H" triplet so Tailwind can wrap it as
// oklch(var(--x) / <alpha-value>). This test reads those triplets straight out
// of the stylesheet, converts them to sRGB luminance, and checks WCAG contrast
// in both themes — so a colour tweak cannot quietly break accessibility.

const CSS = readFileSync('app/globals.css', 'utf8')

const TOKENS = [
  'bg', 'panel', 'ink', 'muted', 'muted-strong', 'line', 'line-strong',
  'accent', 'on-accent', 'live', 'status-early', 'status-private', 'status-internal',
  'field-border',
] as const
type Token = (typeof TOKENS)[number]
type Triplet = [number, number, number]

function block(selector: string): string {
  const start = CSS.indexOf(`${selector} {`)
  if (start === -1) throw new Error(`No "${selector} {" block in app/globals.css`)
  return CSS.slice(start, CSS.indexOf('}', start))
}

function readTheme(selector: string): Record<Token, Triplet> {
  const body = block(selector)
  const theme = {} as Record<Token, Triplet>
  for (const token of TOKENS) {
    const match = body.match(
      new RegExp(`(?<![\\w-])--${token}:\\s*([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+)\\s*;`),
    )
    if (!match) throw new Error(`--${token} is missing or not an "L C H" triplet in ${selector}`)
    theme[token] = [Number(match[1]), Number(match[2]), Number(match[3])]
  }
  return theme
}

// OKLCH → linear sRGB → WCAG relative luminance. Channels are clamped to the
// sRGB gamut, which is what a browser displays.
function luminance([L, C, H]: Triplet): number {
  const a = C * Math.cos((H * Math.PI) / 180)
  const b = C * Math.sin((H * Math.PI) / 180)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  const clamp = (v: number) => Math.min(1, Math.max(0, v))
  const R = clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)
  const G = clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)
  const B = clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

function contrast(x: Triplet, y: Triplet): number {
  const [hi, lo] = [luminance(x), luminance(y)].sort((p, q) => q - p)
  return (hi + 0.05) / (lo + 0.05)
}

// WCAG 1.4.3: text needs 4.5:1.
const TEXT_PAIRS: [Token, Token][] = [
  ['ink', 'bg'], ['ink', 'panel'],
  ['muted', 'bg'], ['muted', 'panel'],
  ['muted-strong', 'bg'], ['muted-strong', 'panel'],
  ['accent', 'bg'], ['accent', 'panel'],
  ['on-accent', 'accent'],
]

// WCAG 1.4.11: status glyphs and the focus ring need 3:1.
const UI_PAIRS: [Token, Token][] = [
  ['live', 'bg'], ['live', 'panel'],
  ['status-early', 'bg'], ['status-early', 'panel'],
  ['status-private', 'bg'], ['status-private', 'panel'],
  ['status-internal', 'bg'], ['status-internal', 'panel'],
  ['accent', 'bg'], ['accent', 'panel'],
  // Form fields and the chat input sit on canvas inside a panel leaf: their
  // border must be found against both (WCAG 1.4.11, the a11y gate's P1-2).
  ['field-border', 'bg'], ['field-border', 'panel'],
]

describe('form field borders', () => {
  it('every text field draws its border in --field-border, not a hairline token', () => {
    const contact = readFileSync('components/sections/contact-console.tsx', 'utf8')
    const field = contact.match(/const FIELD =\s*'([^']*)'/)?.[1] ?? ''
    expect(field).toContain('border-field-border')
    expect(field).not.toMatch(/border-line(-strong)?/)
    const chat = readFileSync('components/ui/chat-widget.tsx', 'utf8')
    const input = chat.match(/id="chat-input"[\s\S]*?className="([^"]*)"/)?.[1] ?? ''
    expect(input).toContain('border-field-border')
    expect(input).not.toMatch(/border-line(-strong)?/)
  })
})

describe('focus on amber planes', () => {
  it('draws the ring in --on-accent inside an .on-plane container', () => {
    expect(CSS).toMatch(/\.on-plane :focus-visible \{\s*outline-color: oklch\(var\(--on-accent\)\);\s*\}/)
  })

  it.each([
    ['light', ':root'],
    ['dark', '.dark'],
  ])('%s: --on-accent against --accent reaches 3:1', (_name, selector) => {
    const theme = readTheme(selector)
    expect(contrast(theme['on-accent'], theme.accent)).toBeGreaterThanOrEqual(3)
  })
})

// The early-access ring must never read as the accent: the availability dot is
// a filled accent circle, the early-access glyph a hollow ring beside it. Their
// hues stay at least 90 degrees apart in both themes.
describe('early access stays distinct from the accent', () => {
  it.each([
    ['light', ':root'],
    ['dark', '.dark'],
  ])('%s: --status-early and --accent hues are 90 degrees or more apart', (_name, selector) => {
    const theme = readTheme(selector)
    const gap = Math.abs(theme['status-early'][2] - theme.accent[2]) % 360
    expect(Math.min(gap, 360 - gap)).toBeGreaterThanOrEqual(90)
  })
})

describe.each([
  ['light', ':root'],
  ['dark', '.dark'],
])('%s theme', (_name, selector) => {
  const theme = readTheme(selector)

  it.each(TEXT_PAIRS)('text --%s on --%s reaches 4.5:1', (fg, bg) => {
    expect(contrast(theme[fg], theme[bg])).toBeGreaterThanOrEqual(4.5)
  })

  it.each(UI_PAIRS)('glyph --%s on --%s reaches 3:1', (fg, bg) => {
    expect(contrast(theme[fg], theme[bg])).toBeGreaterThanOrEqual(3)
  })
})
