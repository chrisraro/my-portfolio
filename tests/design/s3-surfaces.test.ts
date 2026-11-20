import { readFileSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// The surfaces S3 rebuilt wear the Isarog Trail Map only: no Portfolio 4.0
// amber plane (on-plane), no edge-code labels, no creases, no rounded-xl paper.
// (The accent aliases are held out of every source by s6-finish.test.ts.)
const S3 = [
  'app/projects/page.tsx',
  'app/projects/[slug]/page.tsx',
  ...readdirSync('components/case-study').map((f) => `components/case-study/${f}`),
  ...readdirSync('components/map').map((f) => `components/map/${f}`),
  'components/ui/project-plate.tsx',
  'components/ui/legend-filter.tsx',
  'components/ui/survey-plate.tsx',
  'components/ui/trail-link.tsx',
  'components/ui/live-preview.tsx',
  'components/ui/project-shot.tsx',
  'components/ui/no-preview-tag.tsx',
]
const FOREIGN = /\bon-plane\b|\bedge-code\b|crease-|rounded-xl/

describe('S3 surfaces', () => {
  it.each(S3)('%s uses only trail-map classes', (f) => {
    expect(readFileSync(f, 'utf8')).not.toMatch(FOREIGN)
  })
})
