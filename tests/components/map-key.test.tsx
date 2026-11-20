import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { MapKey } from '@/components/map/map-key'
import { PLACE_MARK, Pin } from '@/components/map/pin'
import { FieldMap } from '@/components/sections/field-map'
import { projects, sectionContent } from '@/lib/data'
import { project as toMap } from '@/lib/geo'
import { placeGroups } from '@/lib/places'
import { parseCssRules } from '@/tests/helpers/css-rules'

const css = readFileSync('app/globals.css', 'utf8')

describe('map pins hold their size while the map pans', () => {
  it('scales each pin’s mark and label about its own point', () => {
    const g = placeGroups(projects)[0]
    const { x, y } = toMap(g.lat, g.lng)
    const html = renderToStaticMarkup(
      <svg>
        <Pin group={g} href="#x" />
      </svg>,
    )
    expect(html).toContain(`<g class="map-pin__mark" style="transform-origin:${x}px ${y}px">`)
  })

  it('by the inverse of the pan scale, gliding only where motion is allowed', () => {
    const rules = parseCssRules(css).filter((r) => r.selector === '.map-pin__mark')
    expect(rules.map((r) => r.body).join(';')).toMatch(/transform:\s*scale\(calc\(1 \/ var\(--pan-s, 1\)\)\)/)
    const glide = rules.find((r) => /transition/.test(r.body))
    expect(glide?.ancestors).toContain('@media (prefers-reduced-motion: no-preference)')
    expect(glide?.body).toMatch(/var\(--dur-slow\) var\(--ease-smooth\)/)
  })
})

describe('the map key', () => {
  it('names the dot and the ring from data', () => {
    const html = renderToStaticMarkup(<MapKey />)
    expect(html).toContain(`>${sectionContent.fieldMap.key.city}</li>`)
    expect(html).toContain(`>${sectionContent.fieldMap.key.region}</li>`)
    expect(html.match(/<svg aria-hidden="true"/g)).toHaveLength(2)
  })

  it('draws the dot beside the city entry and the ring beside the region entry', () => {
    const html = renderToStaticMarkup(<MapKey />)
    const entries = html.match(/<li\b[\s\S]*?<\/li>/g) ?? []
    const city = entries.find((e) => e.includes(`>${sectionContent.fieldMap.key.city}</li>`))
    const region = entries.find((e) => e.includes(`>${sectionContent.fieldMap.key.region}</li>`))
    expect(city, 'city entry').toContain('class="map-dot')
    expect(city, 'city entry').not.toContain('map-ring')
    expect(region, 'region entry').toContain('class="map-ring')
    expect(region, 'region entry').not.toContain('map-dot')
  })

  it('uses the pins’ glyphs: a dot for a city-precision place, a ring for a region', () => {
    const groups = placeGroups(projects)
    for (const precision of ['city', 'region'] as const) {
      const g = groups.find((x) => x.precision === precision)
      expect(g, `a ${precision}-precision place exists`).toBeDefined()
      const pin = renderToStaticMarkup(
        <svg>
          <Pin group={g!} href="#x" />
        </svg>,
      )
      const mark = PLACE_MARK[precision]
      expect(mark).toBe(precision === 'city' ? 'map-dot' : 'map-ring')
      expect(pin).toContain(`class="${mark} `)
      expect(pin).not.toContain(precision === 'city' ? 'map-ring' : 'map-dot')
    }
  })

  it('sits in the homepage map’s caption and in /projects’ map caption', () => {
    const home = renderToStaticMarkup(<FieldMap />)
    expect(home.slice(home.indexOf('<figcaption'), home.indexOf('</figcaption>'))).toContain(sectionContent.fieldMap.key.city)
    expect(readFileSync('app/projects/page.tsx', 'utf8')).toMatch(/<MapKey className="mt-2" \/>\s*<\/figcaption>/)
  })
})
