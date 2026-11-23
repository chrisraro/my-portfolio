import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { FLAGSHIP_SLUGS } from '@/lib/case-studies'
import { projects } from '@/lib/data'
import { parseCssRules } from '@/tests/helpers/css-rules'

// Sprint 6 retired what Portfolio 4.0 left behind: the transitional amber
// aliases, the 4.0 utilities and the words that described them. First Light
// holds those removals and retires the Isarog Trail Map's own words. One
// describe per finished removal; each shows its pattern can fail.
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

describe('the browser surfaces wear first light', () => {
  it('rings focus and draws the caret in ember (where you are), selects in ink', () => {
    expect(css).toMatch(/:focus-visible \{[^}]*outline: 2px solid oklch\(var\(--trail\)\)/)
    expect(css).toMatch(/caret-color: oklch\(var\(--trail\)\)/)
    expect(css).toMatch(/::selection \{[^}]*background: oklch\(var\(--ink\)\);[^}]*color: oklch\(var\(--bg\)\)/)
    expect(css).toMatch(/accent-color: oklch\(var\(--ink\)\)/)
  })
})

const OLD_WORDS = /\b(?:Anybody|Figtree|Archivo|Lobby Rack|lagoon|amber|postcards?|rack)\b/i

describe('the retired worlds’ utilities and words are gone', () => {
  it('catches the old words, so the guard can fail', () => {
    for (const s of ['Anybody does the shouting', 'a rack strip', 'the amber plane', 'postcards 2px', 'Lobby Rack mark', 'Archivo wdth']) {
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

  it('sets no width axis at all: one family, one width', () => {
    expect(css).not.toMatch(/font-variation-settings:\s*'wdth'/)
    expect(css).not.toMatch(/font-stretch/)
  })

  it('describes first light, not the retired worlds', () => {
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
  // From 1024px the frame is a 4:3 crop of the top of the page again.
  it('frames every screenshot 4:3 on a phone, 3:4 from 640px and 4:3 again from 1024px: one scale per width', () => {
    const shot = readFileSync('components/ui/project-shot.tsx', 'utf8')
    expect(shot).toContain("export const SHOT_ASPECT = 'aspect-[4/3] sm:aspect-[3/4] lg:aspect-[4/3]'")
    const src = readFileSync('components/case-study/project-screenshots.tsx', 'utf8')
    expect(src).not.toContain('aspect-[3/4]')
    expect(src).toContain('SHOT_ASPECT')
  })

  it('keeps a list row a compact thumbnail beside its words, not a frame of its own', () => {
    const row = readFileSync('components/ui/project-row.tsx', 'utf8')
    expect(row).toContain('grid-cols-[6.5rem_1fr]')
    expect(row).toContain('aspect-[8/5]')
    expect(row).not.toContain('SHOT_ASPECT')
  })
})

describe('section headings carry their own weight', () => {
  it('SectionHeading takes no eyebrow, and no page passes one', () => {
    expect(readFileSync('components/ui/section-heading.tsx', 'utf8')).not.toMatch(/eyebrow/)
    for (const { f, src } of sources) expect(src, f).not.toMatch(/<SectionHeading[^>]*\beyebrow=/)
  })
})

// The finish review's findings, held where CSS or source can hold them.
const rules = parseCssRules(css)
const rule = (selector: string) => rules.find((r) => r.selector === selector)?.body ?? ''

describe('every route sits on the same grid and fills the window', () => {
  it('reserves the scrollbar gutter, so a short page does not shift sideways', () => {
    expect(rule('html')).toMatch(/scrollbar-gutter:\s*stable/)
  })

  it('lets main grow, so the footer meets the window’s bottom, beside the fixed panel from 1024px', () => {
    const layout = readFileSync('app/layout.tsx', 'utf8')
    expect(layout).toContain('<div className="relative flex min-h-screen flex-col text-ink lg:pl-[17.5rem]">')
    expect(layout).toContain('<main id="main" className="flex-1">')
  })
})

describe('the name fits at 320px', () => {
  it('floors the name at 2rem and tops it at 2.5rem, so it never overflows or shouts', () => {
    expect(rule('.text-name')).toMatch(/font-size:\s*clamp\(2rem,\s*[^,]+,\s*2\.5rem\)/)
  })
})

describe('the leftovers', () => {
  it('gives the chat labels their weight', () => {
    const chat = readFileSync('components/ui/chat-widget.tsx', 'utf8')
    expect(chat).toMatch(/\bfont-medium\b/)
    for (const line of chat.split('\n').filter((l) => /\btabular\b/.test(l))) expect(line).toMatch(/\bfont-medium\b/)
  })

  it('says body text falls back to the size-adjusted face, not plain Arial', () => {
    const layout = readFileSync('app/layout.tsx', 'utf8')
    expect(layout).not.toMatch(/Body text falls back to Arial/i)
    expect(layout).toMatch(/size-adjusted/)
  })

  it('keeps break-words on a case-study figure and no doubled parentheses in the shot doc', () => {
    expect(readFileSync('components/case-study/case-study-body.tsx', 'utf8')).toMatch(/break-words/)
    expect(readFileSync('components/ui/project-shot.tsx', 'utf8')).not.toMatch(/\)\s*\(/)
  })
})

// These read DESIGN.md, PRODUCT.md and CLAUDE.md, which are written from the
// built site; a stale doc fails here.
describe('the docs describe the first light that shipped', () => {
  it('DESIGN.md is First Light, written from the code', () => {
    const doc = readFileSync('DESIGN.md', 'utf8')
    for (const name of ['First Light', '--trail', '--contour', 'survey-plate', '.glass', 'Instrument Sans', '--land-far', 'SHOT_ASPECT', 'app/og/']) {
      expect(doc, name).toContain(name)
    }
    expect(doc).not.toMatch(/Lobby Rack|--accent|accent-plane|on-accent|edge-code|opengraph-image|on-plane|postcard|lagoon|amber|Archivo|legend-glass|trailhead-contours/i)
  })

  it('PRODUCT.md counts the inventory the data holds, and claims no products of Christian’s own', () => {
    const doc = readFileSync('PRODUCT.md', 'utf8')
    expect(projects.some((p) => (p.band as string) === 'Products')).toBe(false)
    expect(doc).toContain(`${projects.length} projects`)
    expect(doc).toContain(`${FLAGSHIP_SLUGS.length} case studies`)
    expect(doc).toContain('/services')
    expect(doc).toContain('/hire')
    expect(doc).not.toMatch(/\b15 projects\b|\b20 projects\b|four own products|three products|Portfolio 4\.0 redesign is built/)
  })

  it('CLAUDE.md drops the amber and the retired worlds and names the First Light pieces', () => {
    const doc = readFileSync('CLAUDE.md', 'utf8')
    expect(doc).not.toMatch(/accent-plane|on-accent|Two ambers|edge-code|removed in S6|Lobby Rack|\.reveal(?![\w-])|lagoon|plain Arial|adjustFontFallback: false|Archivo/)
    for (const name of ['metaDescription', 'SHOT_ASPECT', 'MapKey', 'scene']) {
      expect(doc, name).toContain(name)
    }
  })

  it('the direction contract no longer lists the retired contour shift as unresolved', () => {
    expect(readFileSync('.impeccable/surfaces/app-page-tsx.md', 'utf8')).not.toMatch(/Unresolved: the contour pointer shift/)
  })
})
