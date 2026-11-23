import { describe, expect, it } from 'vitest'
import { caseStudies } from '@/lib/case-studies'
import { projects } from '@/lib/data'
import { elevationFigures } from '@/lib/elevation'
import { placeGroups } from '@/lib/places'
import { isShipped } from '@/lib/proof'

// The homepage's figures: three counts taken from the data, each linking to
// where the thing it counts is listed. The strip itself is gone.
describe('elevation figures', () => {
  it('counts each figure from the data', () => {
    const [shipped, studies, places] = elevationFigures()
    expect(shipped.value).toBe(projects.filter(isShipped).length)
    expect(studies.value).toBe(caseStudies.length)
    expect(places.value).toBe(placeGroups(projects).length)
  })

  it('gives exactly three figures, none of them a count of products of his own', () => {
    const figures = elevationFigures()
    expect(figures).toHaveLength(3)
    for (const f of figures) expect(f.label).not.toMatch(/products/i)
  })

  it('links each figure to the page or section that lists what it counts', () => {
    expect(elevationFigures().map((f) => f.href)).toEqual(['/projects', '#journals', '#places'])
  })

  it('states today’s figures', () => {
    expect(elevationFigures().map((f) => f.value)).toEqual([15, 4, 6])
  })

  it('leaves the 2020-to-now strip builder retired', async () => {
    const mod = (await import('@/lib/elevation')) as Record<string, unknown>
    expect(mod.buildElevationStrip).toBeUndefined()
  })
})
