import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// The homepage's direction contract (impeccable new-work §5) lives in the
// surface brief, never in source or anything the browser receives.
const brief = readFileSync('.impeccable/surfaces/app-page-tsx.md', 'utf8')
const contract = brief.slice(brief.indexOf('## Direction contract'))
const FINISH =
  'FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance'

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return /\.(tsx?|css)$/.test(full) ? [full] : []
  })
}

describe('homepage direction contract', () => {
  it('is the Isarog Trail Map, with its five blocks (FINISH is checked below)', () => {
    expect(brief).toContain('## Direction contract')
    for (const block of ['THESIS:', 'OWN-WORLD:', 'STORY:', 'FIRST VIEWPORT', 'FORM:']) expect(contract, block).toContain(block)
    expect(contract).toContain('Isarog Trail Map')
    expect(contract).toContain('seed:03c5f4d98ec3bdbf')
    expect(contract).toContain('IMPECCABLE\u2019S PICK over the rolled Abaca Weave')
  })

  it('closes on the FINISH line, verbatim', () => {
    expect(contract.trimEnd().split('\n').filter((l) => l.startsWith('FINISH:'))).toEqual([FINISH])
  })

  it('no longer carries the Lobby Rack contract', () => {
    expect(brief).not.toMatch(/Lobby Rack", candidate|Seed `f1d5d2c7`|THESIS: Every project is a brochure/)
  })

  it('never leaks into source', () => {
    for (const f of ['app', 'components', 'lib'].flatMap(sourceFiles)) {
      const src = readFileSync(f, 'utf8')
      expect(src, f).not.toContain('seed:03c5f4d98ec3bdbf')
      expect(src, f).not.toMatch(/\bTHESIS:|\bOWN-WORLD:/)
    }
  })
})
