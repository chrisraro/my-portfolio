import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync('app/globals.css', 'utf8')
const layout = readFileSync('app/layout.tsx', 'utf8')

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() ? files(full) : /\.(tsx|ts|css)$/.test(full) ? [full] : []
  })
}

/** #rrggbb to [r, g, b]. */
const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
const luminance = (hex: string) => {
  const [r, g, b] = rgb(hex).map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const token = (name: string) => css.match(new RegExp(`--${name}: (#[0-9a-f]{6});`))?.[1] ?? ''

describe('palette', () => {
  it('is ghost white, snow, grays and black, and nothing else', () => {
    expect(token('ghost')).toBe('#f8f8ff')
    expect(token('snow')).toBe('#fffafa')
    for (const name of ['ink', 'ink-soft', 'gray-text', 'gray-mid', 'gray-line', 'gray-fill']) {
      const [r, g, b] = rgb(token(name))
      // A gray: its channels sit within a few steps of each other.
      expect(Math.max(r, g, b) - Math.min(r, g, b), name).toBeLessThanOrEqual(10)
    }
  })

  it('keeps every colour in the tokens: no other hex in the styles or components', () => {
    const allowed = new Set(['ghost', 'snow', 'ink', 'ink-soft', 'gray-text', 'gray-mid', 'gray-line', 'gray-fill'].map(token))
    const offenders = ['app', 'components'].flatMap(files).flatMap((file) =>
      (readFileSync(file, 'utf8').match(/#[0-9a-fA-F]{6}\b/g) ?? [])
        .filter((hex) => !allowed.has(hex.toLowerCase()))
        .map((hex) => `${file}: ${hex}`),
    )
    expect(offenders).toEqual([])
  })

  it('reads at AA: ink and secondary text on both grounds, light text on ink', () => {
    for (const ground of ['ghost', 'snow', 'gray-fill']) {
      expect(contrast(token('ink'), token(ground)), ground).toBeGreaterThanOrEqual(7)
      expect(contrast(token('gray-text'), token(ground)), ground).toBeGreaterThanOrEqual(4.5)
    }
    expect(contrast(token('ghost'), token('ink'))).toBeGreaterThanOrEqual(7)
    // Secondary text on the black panels is the mid gray.
    expect(contrast(token('gray-mid'), token('ink'))).toBeGreaterThanOrEqual(4.5)
  })
})

describe('type', () => {
  it('loads exactly two typefaces', () => {
    const imported = layout.match(/import \{([^}]*)\} from 'next\/font\/google'/)?.[1].split(',').map((s) => s.trim()) ?? []
    expect(imported.sort()).toEqual(['Instrument_Serif', 'Inter'])
    expect(layout).not.toContain('next/font/local')
  })

  it('names no other family anywhere', () => {
    const families = ['app', 'components'].flatMap(files).flatMap((file) =>
      Array.from(readFileSync(file, 'utf8').matchAll(/font-family:\s*([^;]+);/g)).map((m) => m[1]),
    )
    for (const family of families) expect(family).toMatch(/var\(--font-(sans|display)\)/)
  })
})

describe('motion', () => {
  it('hides nothing outside its gates: entrances live inside prefers-reduced-motion: no-preference', () => {
    const gated = css.slice(css.indexOf('@media (prefers-reduced-motion: no-preference)'))
    for (const name of ['.mask > span', '.enter {', '.enter-figure', '.enter-pop', '.reveal {']) {
      expect(gated, name).toContain(name)
      expect(css.slice(0, css.indexOf('@media (prefers-reduced-motion: no-preference)')), name).not.toContain(name)
    }
  })

  it('reveals on scroll only where the browser supports it, and switches off under reduced motion', () => {
    expect(css).toMatch(/@supports \(animation-timeline: view\(\)\)/)
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*animation-duration: 0\.01ms !important/)
  })

  it('never leaves server HTML invisible: no inline opacity 0 in components', () => {
    const offenders = ['app', 'components'].flatMap(files).filter((file) => /initial=\{\{\s*opacity:\s*0/.test(readFileSync(file, 'utf8')))
    expect(offenders).toEqual([])
  })
})
