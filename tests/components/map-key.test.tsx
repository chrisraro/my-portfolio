import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { MapKey } from '@/components/map/map-key'
import { Pin } from '@/components/map/pin'
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

  it('sits in the homepage map’s caption and in /projects’ map caption', () => {
    const home = renderToStaticMarkup(<FieldMap />)
    expect(home.slice(home.indexOf('<figcaption'), home.indexOf('</figcaption>'))).toContain(sectionContent.fieldMap.key.city)
    expect(readFileSync('app/projects/page.tsx', 'utf8')).toMatch(/<MapKey className="mt-2" \/>\s*<\/figcaption>/)
  })
})
