import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { SystemsBoard } from '@/components/ui/systems-board'
import { groupByBand, groupForHomepage } from '@/lib/board'
import { projects } from '@/lib/data'

const rest = projects.filter((p) => p.band !== 'Products')

describe('SystemsBoard', () => {
  it('labels every column it shows, on the rows’ own grid', () => {
    const html = renderToStaticMarkup(<SystemsBoard groups={groupForHomepage(rest)} groupHeading="h3" />)
    for (const label of ['domain', 'stack', 'status']) expect(html).toContain(`>${label}<`)
    expect(html).toContain(`projects · ${rest.length}`)
    expect(html).toContain('md:grid-cols-[1.2fr_1fr_1.3fr_7.5rem]')
  })

  it('shows each row’s band only in a group that mixes bands', () => {
    const html = renderToStaticMarkup(<SystemsBoard groups={groupForHomepage(rest)} groupHeading="h3" />)
    // "Client work" mixes Applications and Sites, so rows name their band.
    expect(html).toContain('>Applications<')
    // "Custom systems" is one band, already named by its heading.
    const custom = rest.filter((p) => p.band === 'Custom systems')
    const customOnly = renderToStaticMarkup(
      <SystemsBoard groups={[{ heading: 'Custom systems', projects: custom }]} groupHeading="h3" />,
    )
    expect(customOnly.match(/>Custom systems</g)).toHaveLength(1)
  })

  it('states a filtered count against the whole inventory, not the band name again', () => {
    const sites = projects.filter((p) => p.band === 'Sites')
    const html = renderToStaticMarkup(
      <SystemsBoard groups={groupByBand(sites)} groupHeading="h2" outOf={projects.length} />,
    )
    expect(html).toContain(`projects · ${sites.length} of ${projects.length}`)
  })
})
