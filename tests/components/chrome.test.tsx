import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ContourField } from '@/components/map/contour-field'
import { TrailPath } from '@/components/map/trail-path'
import { trailheadContours, trailheadTrail } from '@/lib/contours'

describe('map primitives', () => {
  it('renders contours as decorative SVG', () => {
    const html = renderToStaticMarkup(<ContourField paths={trailheadContours} viewBox="0 0 1440 900" />)
    expect(html).toContain('aria-hidden="true"')
    expect(html.match(/<path /g)?.length).toBe(trailheadContours.length)
  })

  it('renders the trail with a unit path length and the draw class', () => {
    const html = renderToStaticMarkup(<TrailPath d={trailheadTrail.d} viewBox={trailheadTrail.viewBox} />)
    expect(html).toContain('pathLength="1"')
    expect(html).toContain('trail-draw')
    expect(html).toContain('aria-hidden="true"')
    expect(html).not.toContain('vector-effect')
  })
})
