import { describe, expect, it } from 'vitest'
import { projects } from '@/lib/data'
import { placeGroups, unplacedProjects } from '@/lib/places'

// Spec §5, the map data rule: a pin needs a place the project's own data
// names. Projects without one are listed beside the map, never guessed.
const PINNED: Record<string, string> = {
  'beachbus-nfc': 'Palawan',
  graceland: 'Bicol',
  elnido: 'El Nido',
  beachbus: 'Palawan',
  'upcat-review-plus': 'Bicol',
  'azalea-baguio': 'Baguio City',
  'azalea-boracay': 'Boracay',
  'naga-city-guide': 'Naga City',
  'eastwind-beach-villas': 'El Nido',
}

describe('verified places', () => {
  it('pins exactly the projects whose own words name a place', () => {
    const pinned = Object.fromEntries(projects.filter((p) => p.place).map((p) => [p.id, p.place!.name]))
    expect(pinned).toEqual(PINNED)
  })

  it('quotes the place from the project’s own title or description', () => {
    for (const p of projects) {
      if (!p.place) continue
      expect(`${p.title} ${p.description}`, p.id).toContain(p.place.evidence)
    }
  })

  it('leaves the OCS control panel unplaced: its own words name no town', () => {
    const ocs = projects.find((p) => p.id === 'ocs-wp-control')!
    expect(`${ocs.title} ${ocs.description}`).not.toMatch(/Naga/)
    expect(ocs.place).toBeUndefined()
  })

  it('uses public centres, two decimals at most, inside the Philippines', () => {
    for (const p of projects) {
      if (!p.place) continue
      const { lat, lng } = p.place
      expect(lat, p.id).toBeGreaterThanOrEqual(4.5)
      expect(lat, p.id).toBeLessThanOrEqual(21.2)
      expect(lng, p.id).toBeGreaterThanOrEqual(116.9)
      expect(lng, p.id).toBeLessThanOrEqual(126.7)
      for (const v of [lat, lng]) expect(Math.round(v * 100) / 100, p.id).toBe(v)
    }
  })

  it('gives one place one set of coordinates and one precision', () => {
    for (const group of placeGroups(projects)) {
      for (const p of group.projects) {
        expect(p.place!.lat, p.id).toBe(group.lat)
        expect(p.place!.lng, p.id).toBe(group.lng)
        expect(p.place!.precision, p.id).toBe(group.precision)
      }
    }
  })

  it('draws Palawan and Bicol as regions, every other place as a city', () => {
    const precision = Object.fromEntries(placeGroups(projects).map((g) => [g.name, g.precision]))
    expect(precision).toEqual({
      'Baguio City': 'city',
      'Naga City': 'city',
      Bicol: 'region',
      Boracay: 'city',
      'El Nido': 'city',
      Palawan: 'region',
    })
  })
})

describe('placeGroups', () => {
  it('groups pinned projects by place, north to south', () => {
    expect(placeGroups(projects).map((g) => g.name)).toEqual(['Baguio City', 'Naga City', 'Bicol', 'Boracay', 'El Nido', 'Palawan'])
  })

  it('keeps each place’s projects in data order', () => {
    const naga = placeGroups(projects).find((g) => g.name === 'Naga City')!
    expect(naga.projects.map((p) => p.id)).toEqual(['naga-city-guide'])
  })

  it('lists every other project as unplaced, in data order', () => {
    expect(unplacedProjects(projects).map((p) => p.id)).toEqual([
      'ocs-wp-control',
      'iskotify',
      'aman-webapp',
      'acad1',
      'downtown-district-hotel',
      'aralabroad',
    ])
  })
})
