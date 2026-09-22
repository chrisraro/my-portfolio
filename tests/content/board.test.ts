import { describe, expect, it } from 'vitest'
import { bandSlug, bySector, groupByBand, groupForHomepage, parseBandParam } from '@/lib/board'
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
      'elnido',
      'beachbus',
      'graceland',
      'upcat-review-plus',
      'acad1',
      'aralabroad',
    ])
  })

  it('drops empty groups', () => {
    const products = projects.filter((p) => p.band === 'Products')
    expect(groupByBand(products).map((g) => g.heading)).toEqual(['Products'])
  })
})

describe('groupForHomepage', () => {
  it('shows custom systems, then applications and sites together as client work', () => {
    const rest = projects.filter((p) => p.band !== 'Products')
    const groups = groupForHomepage(rest)
    expect(groups.map((g) => g.heading)).toEqual(['Custom systems', 'Client work'])
    expect(groups[1].projects.every((p) => p.band === 'Applications' || p.band === 'Sites')).toBe(true)
    expect(groups.flatMap((g) => g.projects)).toHaveLength(rest.length)
  })

  it('leads client work with the hospitality sites: hotels, then tours, then restaurants', () => {
    const rest = projects.filter((p) => p.band !== 'Products')
    const clientWork = groupForHomepage(rest).find((g) => g.heading === 'Client work')!
    expect(clientWork.projects.map((p) => p.id)).toEqual([
      'downtown-district-hotel',
      'azalea-baguio',
      'azalea-boracay',
      'elnido',
      'beachbus',
      'graceland',
      'upcat-review-plus',
      'acad1',
      'aralabroad',
      'aman-webapp',
    ])
  })

  it('does not reorder the data itself', () => {
    const before = projects.map((p) => p.id)
    groupForHomepage(projects)
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
