import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Spec §9: Portfolio 4.0's rack and its motion retire with S3. No class,
// component, token or test of theirs is left in the source or the stylesheet
// (S2 final review, carry-over 3).
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
  ['the rack stagger', /reveal-stagger|timeline-trigger|animation-trigger|--stagger-card|--c3\b|--c4\b/],
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
