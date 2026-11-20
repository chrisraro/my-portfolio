import { describe, expect, it } from 'vitest'
import { bandSlug, bySector, edgeCode, groupByBand, parseBandParam } from '@/lib/board'
import { projects } from '@/lib/data'
import { BAND_ORDER, SECTOR_ORDER } from '@/types'

const rank = (sector: (typeof SECTOR_ORDER)[number]) => SECTOR_ORDER.indexOf(sector)

describe('groupByBand', () => {
  it('groups every project exactly once, in BAND_ORDER', () => {
    const groups = groupByBand(projects)
    expect(groups.map((g) => g.heading)).toEqual([...BAND_ORDER])
    expect(groups.flatMap((g) => g.projects)).toHaveLength(projects.length)
  })

  it('orders each band hospitality first, stable for ties', () => {
    for (const group of groupByBand(projects)) {
      const ranks = group.projects.map((p) => rank(p.sector))
      expect(ranks).toEqual([...ranks].sort((a, b) => a - b))
      for (const sector of SECTOR_ORDER) {
        const inGroup = group.projects.filter((p) => p.sector === sector).map((p) => p.id)
        const inData = projects.filter((p) => p.band === group.heading && p.sector === sector).map((p) => p.id)
        expect(inGroup).toEqual(inData)
      }
    }
    const sites = groupByBand(projects).find((g) => g.heading === 'Sites')!
    expect(sites.projects.map((p) => p.id)).toEqual([
      'downtown-district-hotel',
      'azalea-baguio',
      'azalea-boracay',
      'eastwind-beach-villas',
      'elnido',
      'beachbus',
      'graceland',
      'upcat-review-plus',
      'acad1',
      'naga-city-guide',
      'aralabroad',
    ])
  })

  it('drops empty groups', () => {
    const products = projects.filter((p) => p.band === 'Products')
    expect(groupByBand(products).map((g) => g.heading)).toEqual(['Products'])
  })
})

describe('groupByBand immutability', () => {
  it('does not reorder the data itself', () => {
    const before = projects.map((p) => p.id)
    groupByBand(projects)
    expect(projects.map((p) => p.id)).toEqual(before)
  })
})

describe('bySector', () => {
  it('sorts by SECTOR_ORDER and keeps data order within a sector', () => {
    const shuffled = [...projects].reverse()
    const sorted = bySector(shuffled)
    expect(sorted).toHaveLength(projects.length)
    expect(sorted.map((p) => rank(p.sector))).toEqual(sorted.map((p) => rank(p.sector)).sort((a, b) => a - b))
    const hotels = sorted.filter((p) => p.sector === 'hotel').map((p) => p.id)
    expect(hotels).toEqual(shuffled.filter((p) => p.sector === 'hotel').map((p) => p.id))
  })
})

describe('band parameter', () => {
  it('round-trips every band through its slug', () => {
    for (const band of BAND_ORDER) expect(parseBandParam(bandSlug(band))).toBe(band)
  })

  it('uses URL-safe slugs', () => {
    expect(bandSlug('Custom systems')).toBe('custom-systems')
  })

  it('treats a missing or unknown band as "all"', () => {
    expect(parseBandParam(undefined)).toBeNull()
    expect(parseBandParam('nonsense')).toBeNull()
    expect(parseBandParam(['sites', 'products'])).toBe('Sites')
  })

  it('matches a band regardless of case', () => {
    expect(parseBandParam('Sites')).toBe('Sites')
    expect(parseBandParam('CUSTOM-SYSTEMS')).toBe('Custom systems')
  })
})

describe('edgeCode', () => {
  it('pads the running index to the width of the total', () => {
    expect(edgeCode(4, 18, 'Products')).toBe('04 / 18 · Products')
    expect(edgeCode(12, 18, 'Sites')).toBe('12 / 18 · Sites')
    expect(edgeCode(3, 6, 'Case study')).toBe('3 / 6 · Case study')
  })
})

// Critique P1-3: /projects must not open a band on cards with nothing to show.
// With a preview test, cards that have a preview lead each band (stable otherwise).
describe('preview first', () => {
  const shown = new Set(['azalea-boracay', 'elnido', 'graceland', 'aman-webapp', 'latag'])
  const hasPreview = (p: { id: string }) => shown.has(p.id)

  it('puts cards with a preview first within each band, keeping BAND_ORDER', () => {
    const groups = groupByBand(projects, hasPreview)
    expect(groups.map((g) => g.heading)).toEqual([...BAND_ORDER])
    expect(groups.find((g) => g.heading === 'Products')!.projects[0].id).toBe('latag')
    const sites = groups.find((g) => g.heading === 'Sites')!.projects
    const firstWithout = sites.findIndex((p) => !hasPreview(p))
    expect(sites.slice(firstWithout).some((p) => hasPreview(p))).toBe(false)
  })
})
