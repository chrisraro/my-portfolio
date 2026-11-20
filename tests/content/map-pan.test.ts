import { describe, expect, it } from 'vitest'
import { projects } from '@/lib/data'
import { MAP_HEIGHT, MAP_WIDTH, project as toMap } from '@/lib/geo'
import { IDENTITY_PAN, MAX_PAN_SCALE, panStyle, panTo, type MapPan } from '@/lib/map-pan'
import { placeGroups } from '@/lib/places'
import { BAND_ORDER } from '@/types'

// Spec §4, "pan": a /projects filter change glides the map to the band's pins.
/** Where a map point lands in the frame, in map units, under a pan. */
const land = (pan: MapPan, p: { x: number; y: number }) => ({
  x: (pan.x / 100) * MAP_WIDTH + pan.scale * p.x,
  y: (pan.y / 100) * MAP_HEIGHT + pan.scale * p.y,
})
const pointsOf = (band?: string) =>
  placeGroups(band ? projects.filter((p) => p.band === band) : projects).map((g) => toMap(g.lat, g.lng))

describe('panTo', () => {
  it('rests on the whole map when there is nothing to frame', () => {
    expect(panTo([])).toEqual(IDENTITY_PAN)
    expect(IDENTITY_PAN).toEqual({ x: 0, y: 0, scale: 1 })
  })

  it('zooms a lone pin to the cap and centres it, where the map edge allows', () => {
    const naga = toMap(13.62, 123.19)
    const pan = panTo([naga])
    expect(pan.scale).toBe(MAX_PAN_SCALE)
    const at = land(pan, naga)
    expect(Math.abs(at.x - MAP_WIDTH / 2)).toBeLessThan(1)
    expect(Math.abs(at.y - MAP_HEIGHT / 2)).toBeLessThan(1)
  })

  it('never zooms out past the whole map, nor in past the cap', () => {
    for (const band of [undefined, ...BAND_ORDER]) {
      const { scale } = panTo(pointsOf(band))
      expect(scale, band).toBeGreaterThanOrEqual(1)
      expect(scale, band).toBeLessThanOrEqual(MAX_PAN_SCALE)
    }
  })

  it('keeps every pin of every band in the frame, and no edge of the map in view', () => {
    for (const band of BAND_ORDER) {
      const points = pointsOf(band)
      const pan = panTo(points)
      for (const p of points) {
        const at = land(pan, p)
        expect(at.x, band).toBeGreaterThanOrEqual(0)
        expect(at.x, band).toBeLessThanOrEqual(MAP_WIDTH)
        expect(at.y, band).toBeGreaterThanOrEqual(0)
        expect(at.y, band).toBeLessThanOrEqual(MAP_HEIGHT)
      }
      expect(pan.x, band).toBeLessThanOrEqual(0)
      expect(pan.y, band).toBeLessThanOrEqual(0)
      expect(pan.x, band).toBeGreaterThanOrEqual((1 - pan.scale) * 100 - 0.01)
      expect(pan.y, band).toBeGreaterThanOrEqual((1 - pan.scale) * 100 - 0.01)
    }
  })

  it('writes the pan as the custom properties .map-pan reads', () => {
    expect(panStyle({ x: -10, y: -5.5, scale: 1.5 })).toEqual({ '--pan-x': '-10%', '--pan-y': '-5.5%', '--pan-s': '1.5' })
    expect(panStyle(IDENTITY_PAN)).toEqual({ '--pan-x': '0%', '--pan-y': '0%', '--pan-s': '1' })
  })
})
