import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parseCssRules } from '@/tests/helpers/css-rules'

// First Light tokens: raw oklch "L C H" triplets, one per line, in
// app/globals.css. .dark is the night before first light and the default
// theme; :root is the morning.
const CSS = readFileSync('app/globals.css', 'utf8')

const TOKENS = [
  'bg', 'panel', 'ink', 'muted', 'muted-strong', 'line', 'line-strong', 'contour',
  'trail', 'on-trail', 'field-border', 'live', 'status-early', 'status-private', 'status-internal',
] as const
// The land the page is fixed over (components/scene.tsx).
const SCENE = ['land-far', 'land-near', 'land-lit', 'dawn'] as const
type Token = (typeof TOKENS)[number] | (typeof SCENE)[number]
type Triplet = [number, number, number]

function block(selector: string): string {
  const start = CSS.indexOf(`${selector} {`)
  if (start === -1) throw new Error(`No "${selector} {" block in app/globals.css`)
  return CSS.slice(start, CSS.indexOf('}', start))
}

function readTheme(selector: string): Record<Token, Triplet> {
  const body = block(selector)
  const theme = {} as Record<Token, Triplet>
  for (const token of [...TOKENS, ...SCENE]) {
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

function contrastOfLum(x: number, y: number): number {
  const [hi, lo] = [x, y].sort((p, q) => q - p)
  return (hi + 0.05) / (lo + 0.05)
}

function contrast(x: Triplet, y: Triplet): number {
  return contrastOfLum(luminance(x), luminance(y))
}

// Browsers composite in gamma-encoded sRGB, not in linear light.
const encode = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)
const decode = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)

/** `top` at `alpha` over `under`, as the page paints it; the result as linear RGB. */
function over(top: Rgb, alpha: number, under: Rgb): Rgb {
  return top.map((c, i) => decode(alpha * encode(c) + (1 - alpha) * encode(under[i]))) as Rgb
}

// WCAG 1.4.3: text 4.5:1. Trail is text too (links, the active label).
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
  ['night (default)', '.dark'],
  ['morning', ':root'],
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

  it('keeps the in-development violet at least 90 degrees of hue from the ember', () => {
    const d = Math.abs(theme['status-early'][2] - theme.trail[2]) % 360
    expect(Math.min(d, 360 - d)).toBeGreaterThanOrEqual(90)
  })
})

describe('theme default', () => {
  it('opens on the night, the site’s default', () => {
    expect(readFileSync('app/layout.tsx', 'utf8')).toContain('defaultTheme="dark"')
    expect(readFileSync('app/layout.tsx', 'utf8')).toContain('enableSystem={false}')
  })

  it('names the morning :root and the night .dark, each with the scene’s tokens', () => {
    for (const selector of [':root', '.dark']) {
      const theme = readTheme(selector)
      for (const token of SCENE) expect(theme[token], `${selector} ${token}`).toHaveLength(3)
    }
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

const rules = parseCssRules(CSS)
const alphaOf = (selector: string, ancestor?: string): number => {
  const rule = rules.find(
    (r) =>
      r.selector === selector &&
      /background:\s*oklch\(var\(--(?:panel|bg)\)\s*\/\s*[\d.]+\)/.test(r.body) &&
      (ancestor ? r.ancestors.includes(ancestor) : r.ancestors.every((a) => a.startsWith('@layer'))),
  )
  const alpha = Number(rule?.body.match(/background:\s*oklch\(var\(--(?:panel|bg)\)\s*\/\s*([\d.]+)\)/)?.[1])
  if (!Number.isFinite(alpha)) throw new Error(`No translucent background on ${selector}`)
  return alpha
}

// Glass is the panel at --glass alpha over whatever the page is fixed over:
// the scene, unscrimmed (the panel and the filter float outside the reading
// column's scrim). Hold text over every backdrop the scene can show, in both
// themes, composited the way a browser does (backdrop blur does not change a
// flat colour).
describe('glass over the scene', () => {
  const alpha = alphaOf('.glass')

  it('reads its alpha from the stylesheet', () => {
    expect(alpha).toBeGreaterThan(0.5)
    expect(alpha).toBeLessThanOrEqual(0.96)
  })

  describe.each([
    ['night (default)', '.dark'],
    ['morning', ':root'],
  ])('%s', (_name, selector) => {
    const theme = readTheme(selector)
    const backdrops = (['bg', ...SCENE] as const).map((token) => {
      const glass = over(linearRgb(theme.panel), alpha, linearRgb(theme[token]))
      return [token, luminanceOf(glass)] as const
    })

    it.each(backdrops)('ink text holds 4.5:1 over glass on %s', (token, glass) => {
      expect(contrastOfLum(luminance(theme.ink), glass), `${token}`).toBeGreaterThanOrEqual(4.5)
    })

    it.each(backdrops)('muted-strong text holds 4.5:1 over glass on %s', (token, glass) => {
      expect(contrastOfLum(luminance(theme['muted-strong']), glass), `${token}`).toBeGreaterThanOrEqual(4.5)
    })

    // WCAG 1.4.11: ember is a graphic here (the current-page dot, the focus ring).
    it.each(backdrops)('trail graphic holds 3:1 over glass on %s', (token, glass) => {
      expect(contrastOfLum(luminance(theme.trail), glass), `${token}`).toBeGreaterThanOrEqual(3)
    })
  })

  // The secondary button is clear glass at its own alpha: with its blur gone
  // (no backdrop-filter, reduced transparency) its text must still read.
  describe.each([
    ['night (default)', '.dark'],
    ['morning', ':root'],
  ])('the secondary button, %s', (_name, selector) => {
    const theme = readTheme(selector)
    const buttonAlpha = alphaOf('.button-secondary')
    for (const token of ['bg', ...SCENE] as const) {
      it(`holds ink 4.5:1 on ${token}`, () => {
        const lum = luminanceOf(over(linearRgb(theme.panel), buttonAlpha, linearRgb(theme[token])))
        expect(contrastOfLum(luminance(theme.ink), lum)).toBeGreaterThanOrEqual(4.5)
      })
    }
  })
})

// Under the reading column the land keeps its shape but loses its light: the
// page's bg at --scene-scrim alpha over the lit ridge or the dawn, which are
// what the column's text is set over.
describe('text over the scene scrim', () => {
  const desktop = alphaOf('.scene-scrim')
  const phone = alphaOf('.scene-scrim', '@media (max-width: 1023px)')

  it('reads both alphas from the stylesheet, the phone’s the heavier', () => {
    expect(desktop).toBeGreaterThan(0.4)
    expect(phone).toBeGreaterThan(desktop)
  })

  describe.each([
    ['night (default)', '.dark'],
    ['morning', ':root'],
  ])('%s', (_name, selector) => {
    const theme = readTheme(selector)
    const cases = [
      ...(['land-lit', 'dawn'] as const).flatMap((under) =>
        (['ink', 'muted-strong', 'muted'] as const).flatMap((text) =>
          [
            ['column', desktop],
            ['phone', phone],
          ].map(([where, a]) => [text, under, where as string, a as number] as const),
        ),
      ),
    ]

    it.each(cases)('%s holds 4.5:1 over the scrim on %s (%s)', (text, under, _where, a) => {
      const composite = over(linearRgb(theme.bg), a, linearRgb(theme[under]))
      expect(contrastOfLum(luminance(theme[text]), luminanceOf(composite))).toBeGreaterThanOrEqual(4.5)
    })
  })
})

// Glass without its backdrop is opaque paper, so text on it never depends on
// a blur that is not there (WCAG 1.4.3, and the visitor's own settings).
describe('glass fallbacks', () => {
  const blurred = rules.filter((r) => /backdrop-filter:\s*blur/.test(r.body) && r.ancestors.every((a) => a.startsWith('@layer')))

  it('blurs only through .glass and the secondary button', () => {
    expect(blurred.map((r) => r.selector).sort()).toEqual(['.button-secondary', '.glass'])
  })

  it('sets .glass opaque where the browser has no backdrop-filter', () => {
    const fallback = rules.find((r) => r.selector === '.glass' && r.ancestors.some((a) => /^@supports not/.test(a)))
    expect(fallback?.ancestors.join(' ')).toMatch(/backdrop-filter: blur\(1px\)/)
    expect(fallback?.body).toMatch(/background:\s*oklch\(var\(--panel\)\)\s*;?\s*$/)
  })

  it('sets .glass opaque, with no blur, under reduced transparency and more contrast', () => {
    const fallback = rules.find(
      (r) => r.selector === '.glass' && r.ancestors.some((a) => a.includes('prefers-reduced-transparency: reduce') && a.includes('prefers-contrast: more')),
    )
    expect(fallback).toBeDefined()
    expect(fallback!.body).toMatch(/background:\s*oklch\(var\(--panel\)\)/)
    expect(fallback!.body).toMatch(/backdrop-filter:\s*none/)
    expect(fallback!.body).toMatch(/-webkit-backdrop-filter:\s*none/)
  })

  it('gives the dense variant a heavier fill, not a lighter one', () => {
    expect(alphaOf('.glass--dense')).toBeGreaterThan(alphaOf('.glass'))
  })

  it('prefixes every blur for Safari and holds the glass to one saturation', () => {
    for (const r of blurred) {
      expect(r.body, r.selector).toContain('-webkit-backdrop-filter')
      expect(r.body, r.selector).toMatch(/blur\(\d+px\) saturate\([\d.]+\)/)
    }
  })

  it('opens the phone menu on opaque paper, never glass on glass', () => {
    const src = readFileSync('components/site-legend.tsx', 'utf8')
    expect(src).toMatch(/aria-label="Primary" className="absolute [^"]*\bbg-panel\b/)
  })
})
