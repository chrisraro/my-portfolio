import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Portfolio 4.0's rack retired with S3, and the Isarog Trail Map (5.0) retired
// with First Light (6.0). No class, component, token or test of either world is
// left in the source or the stylesheet.
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return files(full)
    return /\.tsx?$/.test(full) ? [full] : []
  })
}
const sources = ['app', 'components', 'lib'].flatMap(files).map((f) => ({ f, src: readFileSync(f, 'utf8') }))
const css = readFileSync('app/globals.css', 'utf8')

const RETIRED: [string, RegExp][] = [
  ['the rack', /\brack-(?:slot|shelf|card|tier|pocket)\b|\bRack(?:Card|Tier)\b/],
  ['the board filter', /\bBoardFilter\b|board-filter/],
  ['the lifted tier deferral', /defer-render-lift/],
  ['the rack stagger', /reveal-stagger|--stagger-card|--c3\b|--c4\b|--card view\(\)/],
  ['the plate rise and its trigger', /plate-rise|timeline-trigger|animation-trigger/],
  ['the folds', /crease-(?:v|h)\b|reveal-fold/],
  ['the arrow-link text', /ArrowLinkText|arrow-link-text/],
  ['the rack transition names', /--vt-card|--vt-tier|cardTransitionName|tierTransitionName/],
  ['the amber flap', /\bon-plane\b|crease-fold/],
]

const GONE = [
  'components/ui/rack-card.tsx',
  'components/ui/rack-tier.tsx',
  'components/ui/board-filter.tsx',
  'components/case-study/arrow-link-text.tsx',
  'tests/design/catalog-motion.test.ts',
  // The Isarog Trail Map's.
  'components/sections/trailhead.tsx',
  'components/sections/elevation-strip.tsx',
  'components/sections/fork.tsx',
  'components/sections/field-map.tsx',
  'components/sections/own-products.tsx',
  'components/sections/trail-journals.tsx',
  'components/map/contour-field.tsx',
  'components/map/trail-path.tsx',
  'components/map/trail-segment.tsx',
  'components/ui/project-plate.tsx',
  'lib/contours.ts',
  'app/fonts/archivo.woff2',
]

describe('retired Portfolio 4.0 pieces', () => {
  it.each(RETIRED)('%s is gone from the source and the stylesheet', (_name, pattern) => {
    for (const { f, src } of sources) expect(src, f).not.toMatch(pattern)
    expect(css).not.toMatch(pattern)
  })

  it('leaves none of their files behind', () => {
    for (const f of GONE) expect(existsSync(f), f).toBe(false)
  })
})

describe('the docs', () => {
  // These read CLAUDE.md, which is being rewritten for First Light; they stay
  // red until it names the built site.
  it('describe the built site, not the retired rack or trail map', () => {
    const doc = readFileSync('CLAUDE.md', 'utf8')
    expect(doc).not.toMatch(/rack-card|rack-tier|board-filter|arrow-link-text|reveal-stagger|defer-render-lift|catalog-motion|\.on-plane|RackCard|RackTier/)
    for (const name of ['survey-plate', 'legend-filter', 'project-row', 'trail-link', 'retired-classes', 'scene']) {
      expect(doc, name).toContain(name)
    }
  })
})
