import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { noPreviewCopy } from '@/components/ui/no-preview-tag'
import { ProjectPlate } from '@/components/ui/project-plate'
import { projects } from '@/lib/data'
import { fullShotFor } from '@/lib/project-page'
import { bandTransitionName, plateTransitionName } from '@/lib/view-transition'
import type { Project } from '@/types'

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')
const render = (project: Project, labelPrefix?: string) =>
  renderToStaticMarkup(
    <ul>
      <ProjectPlate project={project} code="01 / 20 · Products" labelPrefix={labelPrefix} />
    </ul>,
  )
const withShot = projects.find((p) => fullShotFor(p))!
const withoutShot = projects.find((p) => !fullShotFor(p))!

describe('ProjectPlate', () => {
  it('is a list item the map pins and the filter transition can find', () => {
    const html = render(withShot)
    expect(html).toContain(
      `<li id="plate-${withShot.slug}" class="project-plate plate-rise min-w-0 scroll-mt-28" style="--vt-plate:${plateTransitionName(withShot.slug)}">`,
    )
  })

  it('is one link target: one link, to the project page, in the same tab, nothing else focusable', () => {
    for (const p of projects) {
      const html = render(p)
      expect(html.match(/<a /g), p.slug).toHaveLength(1)
      expect(html, p.slug).toContain(`href="/projects/${p.slug}"`)
      expect(html, p.slug).not.toContain('target=')
      expect(html, p.slug).not.toMatch(/<button|tabindex="0"/)
    }
  })

  it('names the link by its visible text (WCAG 2.5.3): no aria-labelledby, title and summary inside it', () => {
    for (const p of projects) {
      const html = render(p)
      const link = html.slice(html.indexOf('<a '), html.indexOf('</a>'))
      expect(link, p.slug).not.toMatch(/aria-labelledby|aria-label=/)
      expect(link, p.slug).toMatch(new RegExp(`<h3 class="[^"]*">${escape(p.title)}</h3>`))
      expect(link, p.slug).toContain(escape(p.summary))
      expect(link, p.slug).toMatch(/data-status=/)
    }
  })

  it('reads a prefix first when the plate stands for more than itself', () => {
    const html = render(withShot, 'Next case study')
    const id = `plate-${withShot.slug}`
    expect(html).toContain('<span class="sr-only">Next case study: </span>')
    expect(html).not.toContain('aria-labelledby')
    // The prefix is the link's first child, so the name starts with it and then the visible title.
    expect(html).toMatch(/<a [^>]*><span class="sr-only">Next case study: <\/span>/)
    expect(html.indexOf('Next case study: ')).toBeLessThan(html.indexOf('<h3'))
  })

  it('shows a still of the site at 3:4 on its survey plate, marked as a morph source', () => {
    const html = render(withShot)
    expect(html).toContain('class="survey-plate lift-card')
    expect(html).toContain('project-shot__frame')
    expect(html).toContain('aspect-[3/4]')
    expect(html).toContain(`data-vt-shot="${withShot.slug}"`)
  })

  it('keeps the same 3:4 frame when there is no screenshot, with the printed reason', () => {
    const html = render(withoutShot)
    expect(html).toContain('aspect-[3/4]')
    expect(html).toContain(escape(noPreviewCopy(withoutShot)))
    expect(html).not.toContain('project-shot__frame')
    expect(html).not.toMatch(/aspect-square|aspect-\[9\/16\]/)
  })

  it('hides the catalog number and the domain from the link name', () => {
    const html = render(withShot)
    expect(html).toContain('<span aria-hidden="true" class="map-label tabular text-muted">01 / 20 · Products</span>')
    expect(html).toMatch(/<span aria-hidden="true" class="map-label mt-auto [^"]*">[^<]+<\/span>/)
  })
})

describe('plate and band names', () => {
  it('are valid custom idents', () => {
    for (const p of projects) expect(plateTransitionName(p.slug)).toMatch(/^plate-[a-z0-9-]+$/)
    expect(bandTransitionName('Custom systems')).toBe('band-custom-systems')
  })
})
