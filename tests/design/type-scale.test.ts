import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return tsxFiles(full)
    return full.endsWith('.tsx') ? [full] : []
  })
}

// The display styles (.text-title, .text-numeral, the fluid headings) carry the
// contract's type scale. An arbitrary size on top of one of them is an
// off-scale size (the confirm critique found four).
const scaled = /className="[^"]*\btext-(?:title|numeral|fluid-h1|fluid-h2|page-h1)\b[^"]*"/g
const arbitrary = /\btext-\[\d*\.?\d+(?:rem|px)\]/

describe('type scale', () => {
  it('never overrides a display style with an arbitrary font size', () => {
    const offenders = ['app', 'components'].flatMap(tsxFiles).flatMap((f) =>
      Array.from(readFileSync(f, 'utf8').matchAll(scaled))
        .map(([cls]) => cls)
        .filter((cls) => arbitrary.test(cls))
        .map((cls) => `${f}: ${cls}`),
    )
    expect(offenders).toEqual([])
  })
})

describe('trail map type utilities', () => {
  const css = readFileSync('app/globals.css', 'utf8')

  it('keeps UI labels on the body stack, not the condensed display face', () => {
    // Before Archivo loads the display fallback renders at 70%: a 12px badge at ~8.4px.
    for (const cls of ['button-label', 'edge-code']) {
      const body = css.match(new RegExp(String.raw`\.${cls} \{([^}]*)\}`))?.[1]
      expect(body, cls).toBeDefined()
      expect(body, cls).not.toContain('var(--font-display)')
      expect(body, cls).toContain('var(--font-sans)')
    }
  })

  it('sets display and map labels condensed and uppercase', () => {
    for (const cls of ['text-display', 'text-section', 'map-label']) {
      const body = css.match(new RegExp(String.raw`\.${cls} \{([^}]*)\}`))?.[1]
      expect(body, cls).toBeDefined()
      expect(body, cls).toMatch(/font-stretch:\s*(?:6\d|7\d)%/)
      expect(body, cls).toMatch(/text-transform:\s*uppercase/)
    }
  })

  it('resets the old width-axis settings so font-stretch wins', () => {
    for (const cls of ['text-display', 'text-section', 'map-label', 'eyebrow']) {
      const body = css.match(new RegExp(String.raw`\.${cls} \{([^}]*)\}`))?.[1]
      expect(body, cls).toBeDefined()
      expect(body, cls).toMatch(/font-variation-settings:\s*normal/)
    }
  })

  it('gives numerals tabular figures', () => {
    expect(css).toMatch(/\.tabular \{[^}]*font-variant-numeric:\s*tabular-nums/)
  })

  it('sizes a fallback face for display type so the condensed headline fits before Archivo loads', () => {
    const css = readFileSync('app/globals.css', 'utf8')
    const face = css.match(/@font-face\s*\{[^}]*'Archivo Display Fallback'[^}]*\}/)?.[0] ?? ''
    expect(face).toMatch(/size-adjust:\s*70%/)
    const rule = css.match(/\.text-display\s*\{[^}]*\}/)?.[0] ?? ''
    expect(rule).toMatch(/font-family:\s*var\(--font-display\)/)
  })
})
