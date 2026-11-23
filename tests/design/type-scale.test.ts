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

// The type styles (.text-name, .text-page-h1, .text-section, .text-title, ...)
// carry the type scale. An arbitrary size on top of one of them is an
// off-scale size (the confirm critique found four).
const scaled = /className="[^"]*\btext-(?:name|page-h1|section|title|list|row|figure|lede)\b[^"]*"/g
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

describe('first light type utilities', () => {
  const css = readFileSync('app/globals.css', 'utf8')
  const body = (cls: string) => css.match(new RegExp(String.raw`\.${cls} \{([^}]*)\}`))?.[1]
  const STYLES = ['text-name', 'text-page-h1', 'text-section', 'text-title', 'text-list', 'text-row', 'text-figure', 'text-lede', 'map-label']

  it('sets every style in rem or a rem clamp, so the browser’s text size is honoured', () => {
    for (const cls of STYLES) {
      const b = body(cls)
      expect(b, cls).toBeDefined()
      expect(b, cls).toMatch(/font-size:\s*(?:clamp\([^)]*rem[^)]*\)|[\d.]+rem)/)
      expect(b, cls).not.toMatch(/font-size:[^;]*\bpx\b/)
    }
  })

  it('sets headings with weight and tracking, never condensed or uppercase', () => {
    for (const cls of STYLES) {
      const b = body(cls)!
      expect(b, cls).not.toMatch(/text-transform|font-stretch|font-variation-settings|font-family/)
    }
    for (const cls of ['text-name', 'text-page-h1', 'text-section', 'text-title', 'text-list', 'text-row', 'text-figure']) {
      expect(body(cls), cls).toMatch(/font-weight:\s*\d{3}/)
      expect(body(cls), cls).toMatch(/letter-spacing:\s*-/)
    }
  })

  it('keeps the smallest label at 14px (0.875rem), the floor for text', () => {
    expect(body('map-label')).toMatch(/font-size:\s*0\.875rem/)
    const sizes = STYLES.map((c) => Number(body(c)!.match(/font-size:\s*([\d.]+)rem/)?.[1] ?? 1.5))
    expect(Math.min(...sizes)).toBeGreaterThanOrEqual(0.875)
  })

  it('has no condensed face, display stack or width-axis setting anywhere', () => {
    expect(css).not.toMatch(/font-stretch|font-variation-settings|--font-display|Display Fallback|text-transform:\s*uppercase/)
    expect(css).not.toMatch(/\.(text-display|eyebrow)\b/)
  })

  it('uses the one family for sans and display in Tailwind', () => {
    const tw = readFileSync('tailwind.config.js', 'utf8')
    expect(tw).not.toMatch(/\bmono\b|[^-]serif\b/)
    expect(tw.match(/var\(--font-sans\)/g)?.length).toBeGreaterThanOrEqual(1)
    expect(tw).not.toContain('--font-display')
  })

  it('gives numerals tabular figures', () => {
    expect(css).toMatch(/\.tabular \{[^}]*font-variant-numeric:\s*tabular-nums/)
  })
})
