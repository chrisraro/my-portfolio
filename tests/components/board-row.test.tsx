import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { BoardRow } from '@/components/ui/board-row'
import { projects } from '@/lib/data'

describe('BoardRow', () => {
  it('links every row to its project page, in the same tab', () => {
    for (const project of projects) {
      const html = renderToStaticMarkup(<BoardRow project={project} />)
      expect(html).toContain(`href="/projects/${project.slug}"`)
      expect(html).not.toContain('target="_blank"')
    }
  })

  it('never renders href="#" for any project', () => {
    for (const project of projects) {
      expect(renderToStaticMarkup(<BoardRow project={project} />)).not.toContain('href="#"')
    }
  })

  it('says plainly when a project has no public URL, with no dash placeholder', () => {
    const nfc = projects.find((p) => p.slug === 'beachbus-nfc-card-system')!
    const html = renderToStaticMarkup(<BoardRow project={nfc} />)
    expect(html).toContain('no public URL')
    expect(html).not.toContain('—')
  })

  it('shows the band under the title unless told the group already names it', () => {
    const giya = projects.find((p) => p.slug === 'giya')!
    expect(renderToStaticMarkup(<BoardRow project={giya} />)).toContain(`>${giya.band}<`)
    expect(renderToStaticMarkup(<BoardRow project={giya} showBand={false} />)).not.toContain(`>${giya.band}<`)
  })

  it('shares one fixed-width status column with every other row', () => {
    for (const project of projects) {
      const html = renderToStaticMarkup(<BoardRow project={project} />)
      expect(html).toContain('md:grid-cols-[1.1fr_1fr_1.7fr_7.5rem]')
      expect(html).not.toContain('_auto]')
    }
  })

  it('says what each project does in place of its tech stack', () => {
    for (const project of projects) {
      const html = renderToStaticMarkup(<BoardRow project={project} />)
      expect(html).toContain(`>${project.summary}<`)
      // A one-entry stack ("NFC") can legitimately appear inside the summary.
      if (project.technologies.length > 1) {
        expect(html).not.toContain(project.technologies.slice(0, 3).join(' · '))
      }
    }
  })

  it('draws the focus ring inside the row, where the board cannot clip it', () => {
    const giya = projects.find((p) => p.slug === 'giya')!
    expect(renderToStaticMarkup(<BoardRow project={giya} />)).toContain('focus-visible:outline-offset-[-2px]')
  })

  it('always states the status in words', () => {
    for (const project of projects) {
      expect(renderToStaticMarkup(<BoardRow project={project} />)).toMatch(/>(Live|Early access|Private|Internal)</)
    }
  })
})
