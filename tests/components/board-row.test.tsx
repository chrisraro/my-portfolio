import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { BoardRow } from '@/components/ui/board-row'
import { projects } from '@/lib/data'

describe('BoardRow', () => {
  it('links a project with a live URL, opening in a new tab safely', () => {
    const giya = projects.find((p) => p.slug === 'giya')!
    const html = renderToStaticMarkup(<BoardRow project={giya} />)
    expect(html).toContain('href="https://giya.ph"')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  it('renders a project with no URL as a plain row, not a dead link', () => {
    const nfc = projects.find((p) => p.slug === 'beachbus-nfc-card-system')!
    const html = renderToStaticMarkup(<BoardRow project={nfc} />)
    expect(html).not.toContain('<a')
  })

  it('never renders href="#" for any project', () => {
    for (const project of projects) {
      expect(renderToStaticMarkup(<BoardRow project={project} />)).not.toContain('href="#"')
    }
  })

  it('always states the status in words', () => {
    for (const project of projects) {
      expect(renderToStaticMarkup(<BoardRow project={project} />)).toMatch(/>(Live|Early access|Private|Internal)</)
    }
  })
})
