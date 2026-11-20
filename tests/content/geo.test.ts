import { statSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { MAP_HEIGHT, MAP_VIEWBOX, MAP_WIDTH, project } from '@/lib/geo'
import { phOutline, phOutlineViewBox } from '@/lib/ph-outline'

// Spec §5: the field map. One equirectangular projection over the
// Philippines' bounding box, shared by the generated outline and the pins.
describe('map projection', () => {
  it('maps the bounding box onto a 600-wide viewBox, one scale on both axes', () => {
    expect(MAP_WIDTH).toBe(600)
    expect(MAP_HEIGHT).toBe(1022)
    expect(MAP_VIEWBOX).toBe('0 0 600 1022')
  })

  it('puts the north-west corner at the origin and the south-east at the far corner', () => {
    expect(project(21.2, 116.9)).toEqual({ x: 0, y: 0 })
    const se = project(4.5, 126.7)
    expect(se.x).toBe(600)
    expect(se.y).toBeCloseTo(MAP_HEIGHT, 0)
  })

  it('places Naga City where the pin and the outline both expect it', () => {
    expect(project(13.62, 123.19)).toEqual({ x: 385.1, y: 464.1 })
  })
})

describe('Philippines outline', () => {
  it('shares the projection’s viewBox', () => {
    expect(phOutlineViewBox).toBe(MAP_VIEWBOX)
  })

  it('is closed rings of points inside the viewBox', () => {
    expect(phOutline).toMatch(/^M/)
    expect(phOutline).toMatch(/Z$/)
    const numbers = phOutline.replace(/[MZ]/g, ' ').trim().split(/\s+/).map(Number)
    expect(numbers.length % 2).toBe(0)
    numbers.forEach((n, i) => {
      expect(Number.isFinite(n)).toBe(true)
      expect(n).toBeGreaterThanOrEqual(-1)
      expect(n).toBeLessThanOrEqual(i % 2 === 0 ? MAP_WIDTH + 1 : MAP_HEIGHT + 1)
    })
  })

  it('keeps the main islands', () => {
    expect(phOutline.match(/M/g)!.length).toBeGreaterThanOrEqual(10)
  })

  it('weighs at most 16 KB', () => {
    expect(statSync('lib/ph-outline.ts').size).toBeLessThanOrEqual(16 * 1024)
  })
})
