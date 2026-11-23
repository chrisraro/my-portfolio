import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// The surfaces S4 built wear First Light only: no Portfolio 4.0 amber, edge
// codes, creases or rounded-xl paper; the ember (trail) only where the design
// allows it (the primary button through its class, the current position).
const PAGES = ['app/services/page.tsx', 'app/services/[slug]/page.tsx', 'app/about/page.tsx', 'app/hire/page.tsx']
const S4 = [...PAGES, 'app/not-found.tsx', 'components/ui/page-intro.tsx', 'components/ui/work-history.tsx', 'components/site-legend.tsx']
const FOREIGN = /\bon-plane\b|\bedge-code\b|crease-|rounded-xl/
const TRAIL = /\b(?:bg|text|border|fill|stroke|ring|decoration)-trail\b/

describe('S4 surfaces', () => {
  it.each(S4)('%s uses only first-light classes', (f) => {
    expect(readFileSync(f, 'utf8')).not.toMatch(FOREIGN)
  })

  it.each([...PAGES, 'components/ui/page-intro.tsx', 'components/ui/work-history.tsx'])('%s writes no ember of its own', (f) => {
    expect(readFileSync(f, 'utf8')).not.toMatch(TRAIL)
  })

  it('keeps the legend’s ember to the current page: its underline and its dot', () => {
    const src = readFileSync('components/site-legend.tsx', 'utf8')
      .split('aria-[current=page]:decoration-trail').join('')
      .replace(/\{l\.current && <span aria-hidden="true" className="h-1\.5 w-1\.5 rounded-full bg-trail" \/>\}/, '')
    expect(src).not.toMatch(TRAIL)
  })
})

describe('the docs', () => {
  it('describe the S4 pages, their content and the legend menu', () => {
    const doc = readFileSync('CLAUDE.md', 'utf8')
    for (const name of [
      'app/services/',
      'app/about/',
      'app/hire/',
      'page-intro',
      'work-history',
      'servicePages',
      'servicesPageContent',
      'aboutPageContent',
      'hirePageContent',
      'pagesUpdated',
      'new-pages',
      's4-surfaces',
      'phone menu',
    ]) {
      expect(doc, name).toContain(name)
    }
    expect(doc).not.toContain('rebuilt in S4')
    expect(doc).not.toContain('lib/field-log.ts')
  })
})
