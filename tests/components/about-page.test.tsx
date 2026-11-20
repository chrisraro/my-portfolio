import { existsSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import AboutPage, { metadata } from '@/app/about/page'
import { aboutPageContent, galleryContent, galleryImages, projects, recommendations, resumeUrl } from '@/lib/data'
import { buildTimeline } from '@/lib/timeline'

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')
const tag = (html: string, href: string) => html.match(new RegExp(`<a [^>]*href="${href}"[^>]*>`))?.[0] ?? ''

describe('/about', () => {
  const html = renderToStaticMarkup(<AboutPage />)

  it('opens with its answer under the one h1', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain(`>${escape(aboutPageContent.heading)}</h1>`)
    const answer = html.indexOf(`>${escape(aboutPageContent.answer)}</p>`)
    expect(answer).toBeGreaterThan(html.indexOf('</h1>'))
    expect(answer).toBeLessThan(html.indexOf('<h2'))
  })

  it('offers a project first, then the résumé as a PDF in a new tab', () => {
    expect(tag(html, '/#contact')).toContain('class="press button-primary"')
    const resume = tag(html, resumeUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    expect(resume).toContain('class="press button-secondary"')
    expect(resume).toContain('target="_blank"')
    expect(html).toContain('(PDF, opens in a new tab)')
  })

  it('tells the story, then the dated route, then the photos, then the quotes', () => {
    const at = ['story', 'route', 'field-log', 'testimonials'].map((id) => html.indexOf(`<section id="${id}"`))
    for (const i of at) expect(i).toBeGreaterThan(-1)
    expect([...at].sort((a, b) => a - b)).toEqual(at)
    for (const p of aboutPageContent.story.paragraphs) expect(html).toContain(`<p>${escape(p)}</p>`)
    for (const e of buildTimeline()) expect(html).toContain(`>${escape(e.title)}</h3>`)
  })

  it('frames all six photos on survey plates, each opening larger and described by its caption', () => {
    expect(html).toContain(`>${escape(galleryContent.title)}</h2>`)
    expect(galleryImages).toHaveLength(6)
    for (const img of galleryImages) {
      expect(html).toContain(`aria-describedby="photo-${img.id}"`)
      expect(html).toContain(`<figcaption id="photo-${img.id}"`)
      expect(html).toContain(escape(img.caption))
      expect(html).toContain(`aria-label="View larger image: ${escape(img.alt)}"`)
    }
    expect(html.match(/<figure class="survey-plate/g)).toHaveLength(galleryImages.length)
  })

  it('attributes all four quotes, linking each to its project where one exists', () => {
    expect(recommendations).toHaveLength(4)
    for (const r of recommendations) {
      expect(html).toContain(escape(r.quote))
      expect(html).toContain(`>${escape(r.authorName)}</span>`)
      expect(html).toContain(`>${escape(r.authorTitle)}</span>`)
      const project = projects.find((p) => p.id === r.projectId)
      if (project) expect(html).toContain(`href="/projects/${project.slug}"`)
    }
  })

  it('leads on to /hire and /services', () => {
    expect(html).toContain('href="/hire"')
    expect(html).toContain('href="/services"')
  })

  it('is titled and canonical', () => {
    expect(metadata.title).toBe(aboutPageContent.title)
    expect(metadata.description).toBe(aboutPageContent.answer)
    expect(metadata.alternates?.canonical).toBe('/about')
  })

  it('retires the 4.0 field log builder: photos and quotes are two sections now', () => {
    expect(existsSync('lib/field-log.ts')).toBe(false)
  })
})
