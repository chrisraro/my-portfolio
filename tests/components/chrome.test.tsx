import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ContourField } from '@/components/map/contour-field'
import { TrailPath } from '@/components/map/trail-path'
import { navigationItems } from '@/lib/data'
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

describe('legend navigation', () => {
  const src = readFileSync('components/site-legend.tsx', 'utf8')

  it('is a frosted legend card, not a full-width bar', () => {
    expect(src).toContain('legend-glass')
    const css = readFileSync('app/globals.css', 'utf8')
    expect(css).toMatch(/\.legend-glass \{[^}]*backdrop-filter:\s*blur\(/)
  })

  it('lists Work first and keeps Contact', () => {
    expect(navigationItems[0]).toEqual({ label: 'Work', href: '/projects' })
    expect(navigationItems.map((n) => n.label)).toContain('Contact')
  })

  it('offers the résumé from the legend', () => {
    expect(src).toContain('resumeUrl')
  })
})
