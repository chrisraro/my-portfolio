import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { trailheadContours } from '@/lib/contours'
import { parseCssRules } from '@/tests/helpers/css-rules'

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

const OLD_WORDS = /\b(?:Anybody|Figtree|Lobby Rack|lagoon|amber|postcards?|rack)\b/i

describe('the Portfolio 4.0 utilities and words are gone', () => {
  it('catches the old words, so the guard can fail', () => {
    for (const s of ['Anybody does the shouting', 'a rack strip', 'the amber plane', 'postcards 2px', 'Lobby Rack mark']) {
      expect(s).toMatch(OLD_WORDS)
    }
    expect('a contour track').not.toMatch(OLD_WORDS)
  })

  it('has no .edge-code, .reveal or reveal-rise rule, and no component uses edge-code', () => {
    expect(css).not.toMatch(/\.edge-code\b/)
    expect(css).not.toMatch(/\.reveal(?![\w-])/)
    expect(css).not.toMatch(/reveal-rise/)
    for (const { f, src } of sources) expect(src, f).not.toMatch(/\bedge-code\b/)
  })

  it('sets every width through font-stretch, never the old width-axis setting', () => {
    expect(css).not.toMatch(/font-variation-settings:\s*'wdth'/)
  })

  it('describes the trail map, not the retired worlds', () => {
    for (const { f, src } of sources) expect(src, f).not.toMatch(OLD_WORDS)
    expect(tailwind).not.toMatch(OLD_WORDS)
  })
})

describe('the chat launcher never covers a target', () => {
  // The launcher reaches 80px up from the bottom from 640px (24 + 56). From
  // 1024px to about 1215px the footer's last link sat under it (S2 Lighthouse).
  it('keeps the footer’s last row 96px above the bottom at every width', () => {
    const footer = readFileSync('components/footer.tsx', 'utf8')
    expect(footer).toMatch(/\bpb-24\b/)
    expect(footer).not.toMatch(/\b(?:sm|md|lg|xl):pb-/)
  })
})

describe('phone pacing', () => {
  // /projects was 15,094px tall at 390 wide: twenty 3:4 shots in one column.
  it('frames every screenshot 4:3 below 640px and 3:4 from it: one scale per width', () => {
    const shot = readFileSync('components/ui/project-shot.tsx', 'utf8')
    expect(shot).toContain("export const SHOT_ASPECT = 'aspect-[4/3] sm:aspect-[3/4]'")
    for (const f of [
      'components/ui/project-plate.tsx',
      'components/sections/own-products.tsx',
      'components/case-study/project-screenshots.tsx',
    ]) {
      const src = readFileSync(f, 'utf8')
      expect(src, f).not.toContain('aspect-[3/4]')
      expect(src, f).toContain('SHOT_ASPECT')
    }
  })

  // The field map section was 2,253px tall at 390 wide.
  it('sets the field map’s places two to a row on a phone, under a narrower map', () => {
    const src = readFileSync('components/sections/field-map.tsx', 'utf8')
    expect(src).toContain('grid grid-cols-2 gap-x-6 gap-y-6 sm:gap-x-8')
    expect(src).toContain('max-w-[18rem] sm:max-w-md')
  })
})

describe('section headings carry their own weight', () => {
  it('SectionHeading takes no eyebrow, and no page passes one', () => {
    expect(readFileSync('components/ui/section-heading.tsx', 'utf8')).not.toMatch(/eyebrow/)
    for (const { f, src } of sources) expect(src, f).not.toMatch(/<SectionHeading[^>]*\beyebrow=/)
  })
})

// The finish review's visual findings (.superpowers/sdd/s6-finish-findings.md),
// held where CSS or source can hold them.
const rules = parseCssRules(css)
const rule = (selector: string) => rules.find((r) => r.selector === selector)?.body ?? ''

describe('the first viewport reads at the contract’s scale (F1, F2, F21)', () => {
  const trailhead = readFileSync('components/sections/trailhead.tsx', 'utf8')

  // At 1440 the grid is 1088px wide (max-w-6xl less px-8). The headline is
  // 13cqi of the copy column; a 7fr/5fr split gave about 79px (contract 80-110px).
  it('sets the headline near 88px at 1440: the copy column takes all but the 22rem plate from 1024px', () => {
    expect(trailhead).toContain('lg:grid-cols-[minmax(0,1fr)_22rem]')
    const cqi = Number(rule('.trailhead-title').match(/clamp\([^,]+,\s*([\d.]+)cqi/)?.[1])
    const column = 1088 - 48 - 352
    const size = (cqi / 100) * column
    expect(size).toBeGreaterThanOrEqual(84)
    expect(size).toBeLessThanOrEqual(96)
  })

  // The sticky legend takes about 65px; the plate's top sat at about 217.
  it('lifts the portrait plate to about y 150 and keeps the copy where it was', () => {
    expect(trailhead).toMatch(/md:gap-12 md:pb-20 md:pt-20 /)
    expect(trailhead).toMatch(/className="trailhead-copy min-w-0 md:pt-16"/)
    expect(trailhead).not.toContain('md:pt-36')
  })

  it('draws contours under the left column too, not only around the plate', () => {
    const minX = (d: string) => {
      const n = (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)
      return Math.min(...n.filter((_, i) => i % 2 === 0))
    }
    expect(trailheadContours.filter((d) => minX(d) < 480).length).toBeGreaterThanOrEqual(4)
  })

  it('balances the eyebrow, so no word is left alone on a line', () => {
    expect(rule('.eyebrow')).toMatch(/text-wrap:\s*balance/)
  })
})

describe('one display voice (F5)', () => {
  it('sets the inner-page h1 condensed and uppercase, like the homepage h1 and the section titles', () => {
    expect(rule('.text-page-h1')).toMatch(/text-transform:\s*uppercase/)
    expect(rule('.text-page-h1')).toMatch(/font-stretch:\s*75%/)
  })
})

describe('every route sits on the same grid and fills the window (F10)', () => {
  it('reserves the scrollbar gutter, so a short page does not shift sideways', () => {
    expect(rule('html')).toMatch(/scrollbar-gutter:\s*stable/)
  })

  it('lets main grow, so the footer meets the window’s bottom', () => {
    const layout = readFileSync('app/layout.tsx', 'utf8')
    expect(layout).toContain('<div className="flex min-h-screen flex-col bg-canvas text-ink">')
    expect(layout).toContain('<main id="main" className="flex-1">')
  })
})
