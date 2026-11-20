import { describe, expect, it } from 'vitest'
import { caseStudies } from '@/lib/case-studies'
import { projects } from '@/lib/data'
import { buildElevationStrip, elevationFigures } from '@/lib/elevation'
import { placeGroups } from '@/lib/places'

// Spec §5: the elevation strip is the 2020-to-now timeline, with the proof
// figures as spot heights, every number counted from the data.
const NOW = new Date(Date.UTC(2026, 10, 20))
const strip = buildElevationStrip(NOW)

describe('elevation strip', () => {
  it('runs from January of the earliest start year to now, a tick per year', () => {
    expect(strip.years[0]).toEqual({ year: 2020, at: 0 })
    expect(strip.years.map((y) => y.year)).toEqual([2020, 2021, 2022, 2023, 2024, 2025, 2026])
    for (const y of strip.years) expect(y.at).toBeLessThan(1)
  })

  it('places every role and degree inside the strip, starting before it ends', () => {
    expect(strip.entries).toHaveLength(3)
    for (const e of strip.entries) {
      expect(e.start, e.title).toBeGreaterThanOrEqual(0)
      expect(e.end, e.title).toBeLessThanOrEqual(1)
      expect(e.start, e.title).toBeLessThan(e.end)
    }
  })

  it('runs the current role to now, and starts the degree in 2020', () => {
    expect(strip.entries.find((e) => e.subtitle === 'Online Creative Solutions')?.end).toBe(1)
    const degree = strip.entries.find((e) => e.type === 'education')!
    expect(degree.start).toBeGreaterThan(0)
    expect(degree.start).toBeLessThan(strip.years[1].at)
  })
})

describe('elevation figures', () => {
  it('counts each figure from the data', () => {
    const [own, shipped, studies, places] = elevationFigures()
    expect(own.value).toBe(projects.filter((p) => p.band === 'Products').length)
    expect(shipped.value).toBe(projects.filter((p) => p.status !== 'staging').length)
    expect(studies.value).toBe(caseStudies.length)
    expect(places.value).toBe(placeGroups(projects).length)
  })

  it('states today’s figures', () => {
    expect(elevationFigures().map((f) => f.value)).toEqual([4, 19, 6, 6])
  })
})
