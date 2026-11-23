import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ProjectRow } from '@/components/ui/project-row'
import { projects, sectorNames } from '@/lib/data'
import { fullShotFor } from '@/lib/project-page'
import { plateTransitionName } from '@/lib/view-transition'
import type { Project } from '@/types'

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')
const render = (project: Project, props: { labelPrefix?: string; text?: string; eager?: boolean } = {}) =>
  renderToStaticMarkup(
    <ul>
      <ProjectRow project={project} {...props} />
    </ul>,
  )
const withShot = projects.find((p) => fullShotFor(p))!

describe('ProjectRow', () => {
  it('is a list item the map pins and the filter transition can find, still named a plate', () => {
    const html = render(withShot)
    expect(html).toContain(
      `<li id="plate-${withShot.slug}" class="project-plate rise-in min-w-0 scroll-mt-28" style="--vt-plate:${plateTransitionName(withShot.slug)}">`,
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

  it('says one line of its own when given one, else the project’s summary', () => {
    const html = render(withShot, { text: 'A line written for this list.' })
    expect(html).toContain('>A line written for this list.</span>')
    expect(html).not.toContain(escape(withShot.summary))
  })

  it('reads a prefix first when the row stands for more than itself', () => {
    const html = render(withShot, { labelPrefix: 'Next case study' })
    expect(html).toContain('<span class="sr-only">Next case study: </span>')
    expect(html).not.toContain('aria-labelledby')
    expect(html).toMatch(/<a [^>]*><span class="sr-only">Next case study: <\/span>/)
    expect(html.indexOf('Next case study: ')).toBeLessThan(html.indexOf('<h3'))
  })

  it('shows a still of the site as a small decorative thumbnail, marked as a morph source', () => {
    const html = render(withShot)
    expect(html).toContain(`data-vt-shot="${withShot.slug}"`)
    expect(html).toContain('class="thumb relative block aspect-[8/5]')
    expect(html).toMatch(/<span aria-hidden="true" data-vt-shot/)
    expect(html).toContain('alt=""')
    expect(html).toContain('sizes="128px"')
    expect(html).not.toContain('survey-plate')
    expect(html).not.toContain('lift-card')
  })

  it('keeps the same thumbnail frame with a lock where there is no public screen', () => {
    const html = render({ ...withShot, id: 'no-shot', image: '' })
    expect(html).toContain('class="thumb relative block aspect-[8/5]')
    expect(html).not.toContain('<img')
    expect(html).not.toContain('data-vt-shot')
    expect(html).toContain('<svg')
  })

  it('loads the thumbnail at once only when told the row is on screen', () => {
    expect(render(withShot, { eager: true })).toContain('loading="eager"')
    expect(render(withShot)).not.toContain('loading="eager"')
    expect(render(withShot)).toContain('loading="lazy"')
  })

  it('names the kind of client at the end of the row, and carries no catalog number', () => {
    const html = render(withShot)
    expect(html).toContain(`>${sectorNames[withShot.sector]}</span>`)
    expect(html).not.toMatch(/\d{1,2} \/ \d{1,2} · /)
  })

  it('states the status in words, through the badge, for every project', () => {
    for (const p of projects) expect(render(p), p.slug).toMatch(/data-status="[a-z-]+"/)
    const iskotify = projects.find((p) => p.slug === 'iskotify')!
    expect(render(iskotify)).toContain('<span>In development</span>')
  })
})
