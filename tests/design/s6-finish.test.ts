import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Sprint 6 retires what Portfolio 4.0 left behind (master plan, S6): the
// transitional amber aliases, the 4.0 utilities and the words that described
// them. One describe per finished removal; each shows its pattern can fail.
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return files(full)
    return /\.(tsx?|css|svg)$/.test(full) ? [full] : []
  })
}
const sources = ['app', 'components', 'lib'].flatMap(files).map((f) => ({ f, src: readFileSync(f, 'utf8') }))
const css = readFileSync('app/globals.css', 'utf8')
const tailwind = readFileSync('tailwind.config.js', 'utf8')

const ACCENT_CLASS =
  /(?:bg|text|border|outline|ring|fill|stroke|decoration|divide|caret|from|via|to|shadow)-(?:accent|accent-plane|on-accent)(?![\w-])/
const ACCENT_VAR = /--(?:accent|accent-plane|on-accent)(?![\w-])/

describe('the transitional accent aliases are gone', () => {
  it('catches every old form, so the guard can fail', () => {
    for (const s of ['hover:border-accent', 'bg-accent-plane', 'text-on-accent', 'focus:bg-accent-plane', 'bg-accent-plane/90']) {
      expect(s).toMatch(ACCENT_CLASS)
    }
    expect('oklch(var(--accent))').toMatch(ACCENT_VAR)
    expect('border-accented').not.toMatch(ACCENT_CLASS)
  })

  it('defines no accent token and no accent Tailwind key', () => {
    expect(css).not.toMatch(ACCENT_VAR)
    expect(tailwind).not.toMatch(/\baccent\b/)
  })

  it('leaves no accent utility or variable in any source file', () => {
    for (const { f, src } of sources) {
      expect(src, f).not.toMatch(ACCENT_CLASS)
      expect(src, f).not.toMatch(ACCENT_VAR)
    }
  })

  it('retunes the shadows from the 4.0 lagoon hue to the ink hue, in both themes', () => {
    const shadows = css.match(/--shadow-(?:lift|overlay):[^;]*/g) ?? []
    expect(shadows).toHaveLength(4)
    for (const s of shadows) expect(s).not.toMatch(/\b232\b/)
  })
})

describe('the browser surfaces wear the trail map', () => {
  it('rings focus and draws the caret in trail red (where you are), selects in ink', () => {
    expect(css).toMatch(/:focus-visible \{[^}]*outline: 2px solid oklch\(var\(--trail\)\)/)
    expect(css).toMatch(/caret-color: oklch\(var\(--trail\)\)/)
    expect(css).toMatch(/::selection \{[^}]*background: oklch\(var\(--ink\)\);[^}]*color: oklch\(var\(--bg\)\)/)
    expect(css).toMatch(/accent-color: oklch\(var\(--ink\)\)/)
  })
})
