import { describe, expect, it } from 'vitest'
import { bandSlug, groupByBand, groupForHomepage, parseBandParam } from '@/lib/board'
import { projects } from '@/lib/data'
import { BAND_ORDER } from '@/types'

describe('groupByBand', () => {
  it('groups every project exactly once, in BAND_ORDER', () => {
    const groups = groupByBand(projects)
    expect(groups.map((g) => g.heading)).toEqual([...BAND_ORDER])
    expect(groups.flatMap((g) => g.projects)).toHaveLength(projects.length)
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
