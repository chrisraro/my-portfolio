import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Isarog Trail Map tokens: raw oklch "L C H" triplets, one per line, in
// app/globals.css. :root is the day survey (default), .dark the night survey.
const CSS = readFileSync('app/globals.css', 'utf8')

const TOKENS = [
  'bg', 'panel', 'ink', 'muted', 'muted-strong', 'line', 'line-strong', 'contour',
  'trail', 'on-trail', 'field-border', 'live', 'status-early', 'status-private', 'status-internal',
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
    const match = body.match(new RegExp(`(?<![\\w-])--${token}:\\s*([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+)\\s*;`))
    if (!match) throw new Error(`--${token} is missing or not an "L C H" triplet in ${selector}`)
    theme[token] = [Number(match[1]), Number(match[2]), Number(match[3])]
  }
  return theme
}

type Rgb = [number, number, number]

function linearRgb([L, C, H]: Triplet): Rgb {
  const a = C * Math.cos((H * Math.PI) / 180)
  const b = C * Math.sin((H * Math.PI) / 180)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  const clamp = (v: number) => Math.min(1, Math.max(0, v))
  return [
    clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ]
}

function luminanceOf([R, G, B]: Rgb): number {
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

function luminance(color: Triplet): number {
  return luminanceOf(linearRgb(color))
}

function contrast(x: Triplet, y: Triplet): number {
  const [hi, lo] = [luminance(x), luminance(y)].sort((p, q) => q - p)
  return (hi + 0.05) / (lo + 0.05)
}

// WCAG 1.4.3: text 4.5:1. Trail red is text too (links, the active label).
const TEXT_PAIRS: [Token, Token][] = [
  ['ink', 'bg'], ['ink', 'panel'],
  ['muted', 'bg'], ['muted', 'panel'],
  ['muted-strong', 'bg'], ['muted-strong', 'panel'],
  ['trail', 'bg'], ['trail', 'panel'],
  ['on-trail', 'trail'],
]

// WCAG 1.4.11: status glyphs, field borders and the focus ring 3:1.
const UI_PAIRS: [Token, Token][] = [
  ['live', 'bg'], ['live', 'panel'],
  ['status-early', 'bg'], ['status-early', 'panel'],
  ['status-private', 'bg'], ['status-private', 'panel'],
  ['status-internal', 'bg'], ['status-internal', 'panel'],
  ['field-border', 'bg'], ['field-border', 'panel'],
  ['trail', 'bg'],
]

describe.each([
  ['day survey', ':root'],
  ['night survey', '.dark'],
])('%s palette', (_name, selector) => {
  const theme = readTheme(selector)

  it.each(TEXT_PAIRS)('%s on %s holds 4.5:1', (fg, bg) => {
    expect(contrast(theme[fg], theme[bg])).toBeGreaterThanOrEqual(4.5)
  })

  it.each(UI_PAIRS)('%s against %s holds 3:1', (fg, bg) => {
    expect(contrast(theme[fg], theme[bg])).toBeGreaterThanOrEqual(3)
  })

  it('draws contours visibly but quieter than text', () => {
    const c = contrast(theme.contour, theme.bg)
    expect(c).toBeGreaterThanOrEqual(1.5)
    expect(c).toBeLessThan(contrast(theme.muted, theme.bg))
  })

  it('keeps the early-access violet at least 90 degrees of hue from trail red', () => {
    const d = Math.abs(theme['status-early'][2] - theme.trail[2]) % 360
    expect(Math.min(d, 360 - d)).toBeGreaterThanOrEqual(90)
  })
})

describe('theme default', () => {
  it('opens on the day survey', () => {
    expect(readFileSync('app/layout.tsx', 'utf8')).toContain('defaultTheme="light"')
  })
})

// WCAG 1.4.11: a text field's border is its only boundary, so it draws in
// --field-border (3:1), never a hairline token.
describe('field borders', () => {
  it('every text field draws its border in --field-border, not a hairline token', () => {
    const contact = readFileSync('components/sections/plan-the-route.tsx', 'utf8')
    const field = contact.match(/const FIELD =\s*'([^']*)'/)?.[1] ?? ''
    expect(field).toContain('border-field-border')
    expect(field).not.toMatch(/border-line(-strong)?\b/)
    const chat = readFileSync('components/ui/chat-widget.tsx', 'utf8')
    const input = chat.match(/id="chat-input"[\s\S]*?className="([^"]*)"/)?.[1] ?? ''
    expect(input).toContain('border-field-border')
    expect(input).not.toMatch(/border-line(-strong)?\b/)
  })
})

// The legend card is frosted: panel at --legend-glass alpha over whatever
// scrolls beneath. Hold text contrast over the worst backdrops (the theme's
// ink, and a pure white screenshot).
describe('legend glass', () => {
  const alpha = Number(CSS.match(/\.legend-glass \{[^}]*?background:\s*oklch\(var\(--panel\)\s*\/\s*([\d.]+)\)/)?.[1])

  it('reads its alpha from the stylesheet', () => {
    expect(alpha).toBeGreaterThan(0.5)
    expect(alpha).toBeLessThanOrEqual(0.96)
  })

  describe.each([
    ['day survey', ':root'],
    ['night survey', '.dark'],
  ])('%s', (_name, selector) => {
    const theme = readTheme(selector)
    const white: Triplet = [1, 0, 0]
    const glasses = [
      ['ink', theme.ink],
      ['white', white],
    ].map(([label, backdrop]) => {
      const p = linearRgb(theme.panel)
      const k = linearRgb(backdrop as Triplet)
      const mixed = p.map((c, i) => alpha * c + (1 - alpha) * k[i]) as Rgb
      return [label as string, luminanceOf(mixed)] as const
    })

    it.each(glasses)('ink text holds 4.5:1 over glass on %s', (_label, glassLum) => {
      const [hi, lo] = [luminance(theme.ink), glassLum].sort((x, y) => y - x)
      expect((hi + 0.05) / (lo + 0.05)).toBeGreaterThanOrEqual(4.5)
    })

    it.each(glasses)('muted-strong text holds 4.5:1 over glass on %s', (_label, glassLum) => {
      const [hi, lo] = [luminance(theme['muted-strong']), glassLum].sort((x, y) => y - x)
      expect((hi + 0.05) / (lo + 0.05)).toBeGreaterThanOrEqual(4.5)
    })

    // WCAG 1.4.11: trail red is a graphic here (the current-page underline).
    it.each(glasses)('trail graphic holds 3:1 over glass on %s', (_label, glassLum) => {
      const [hi, lo] = [luminance(theme.trail), glassLum].sort((x, y) => y - x)
      expect((hi + 0.05) / (lo + 0.05)).toBeGreaterThanOrEqual(3)
    })
  })
})
