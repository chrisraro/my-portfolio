import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { LABELS, Pin, PlaceGlyph } from '@/components/map/pin'
import { PlaceMap } from '@/components/map/place-map'
import { projects } from '@/lib/data'
import { MAP_VIEWBOX, project as toMap } from '@/lib/geo'
import { placeGroups } from '@/lib/places'

// S2 final review, carry-over 1: one pin, shared by the homepage field map and /projects.
const groups = placeGroups(projects)

describe('Pin', () => {
  it('is a real link where the caller says, out of the tab order and the tree, a ring for a region and a dot for a city', () => {
    for (const g of groups) {
      const html = renderToStaticMarkup(
        <svg>
          <Pin group={g} href={`#plate-${g.projects[0].slug}`} />
        </svg>,
      )
      expect(html, g.name).toContain(`<a href="#plate-${g.projects[0].slug}" tabindex="-1" aria-hidden="true" class="map-pin">`)
      const { x, y } = toMap(g.lat, g.lng)
      expect(html, g.name).toContain(`cx="${x}" cy="${y}"`)
      expect(html, g.name).toContain(`class="${g.precision === 'region' ? 'map-ring' : 'map-dot'} `)
      expect(html, g.name).toContain(`>${g.name}</text>`)
    }
  })

  it('sets Naga City and Bicol labels on opposite sides, since their centres nearly touch', () => {
    expect(LABELS['Naga City'].anchor).toBe('end')
    expect(LABELS.Bicol.anchor).toBe('start')
  })
})

describe('PlaceGlyph', () => {
  it('repeats the pin as a key: a dashed ring for a region, a dot for a city', () => {
    expect(renderToStaticMarkup(<PlaceGlyph precision="region" />)).toContain('stroke-dasharray="3 2"')
    expect(renderToStaticMarkup(<PlaceGlyph precision="city" />)).toContain('fill="currentColor"')
  })
})

describe('PlaceMap', () => {
  const html = renderToStaticMarkup(<PlaceMap places={groups} hrefFor={(g) => `/projects/${g.projects[0].slug}`} />)

  it('draws the outline in the projection the pins use, hidden from the tree', () => {
    expect(html).toMatch(/^<svg viewBox="[^"]+" aria-hidden="true" focusable="false"/)
    expect(html).toContain(`viewBox="${MAP_VIEWBOX}"`)
  })

  it('pins each place once, linking where hrefFor says', () => {
    expect(html.match(/<a /g)).toHaveLength(groups.length)
    for (const g of groups) expect(html).toContain(`href="/projects/${g.projects[0].slug}"`)
  })
})
