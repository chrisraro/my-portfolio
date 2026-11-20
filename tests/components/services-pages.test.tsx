import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import ServicesPage, { metadata } from '@/app/services/page'
import ServicePage, { dynamicParams, generateMetadata, generateStaticParams } from '@/app/services/[slug]/page'
import { ToastProvider } from '@/components/ui/toaster'
import { ctaLabels, projects, servicePages, servicesPageContent } from '@/lib/data'

// PlanTheRoute (the form every service page ends in) needs the toast provider.
const render = (node: ReactElement) => renderToStaticMarkup(<ToastProvider>{node}</ToastProvider>)
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')

describe('/services', () => {
  const html = render(<ServicesPage />)

  it('opens with its answer under the one h1', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain(`>${escape(servicesPageContent.heading)}</h1>`)
    const answer = html.indexOf(`>${escape(servicesPageContent.answer)}</p>`)
    expect(answer).toBeGreaterThan(html.indexOf('</h1>'))
    expect(answer).toBeLessThan(html.indexOf('<h2'))
  })

  it('lists each service once, by name, with one way in', () => {
    for (const s of servicePages) {
      expect(html).toContain(`>${escape(s.name)}</h2>`)
      expect(html).toContain(escape(s.summary))
      expect(html.match(new RegExp(`href="/services/${s.slug}"`, 'g'))).toHaveLength(1)
      expect(html).toContain(`<span class="sr-only"> about ${escape(s.name)}</span>`)
    }
  })

  it('jumps its primary action to the form it ends in', () => {
    expect(html).toContain('<a href="#contact" class="press button-primary">')
    expect(html.indexOf('<section id="contact"')).toBeGreaterThan(html.lastIndexOf('href="/services/'))
  })

  it('is titled and canonical', () => {
    expect(metadata.title).toBe(servicesPageContent.title)
    expect(metadata.description).toBe(servicesPageContent.metaDescription)
    expect(metadata.alternates?.canonical).toBe('/services')
  })
})

describe('/services/[slug]', () => {
  it('builds a page for each service and no other', () => {
    expect(generateStaticParams()).toEqual(servicePages.map((s) => ({ slug: s.slug })))
    expect(dynamicParams).toBe(false)
  })

  it.each(servicePages)('$slug carries the spec title, its short line as description, and its canonical', (s) => {
    const m = generateMetadata({ params: { slug: s.slug } })
    expect(m.title).toBe(s.title)
    expect(m.description).toBe(s.metaDescription)
    expect(m.alternates?.canonical).toBe(`/services/${s.slug}`)
  })

  it.each(servicePages)('$slug opens with its answer, then asks its questions as h2s', (s) => {
    const html = render(ServicePage({ params: { slug: s.slug } }))
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain(`>${escape(s.name)}</h1>`)
    const answer = html.indexOf(`>${escape(s.answer)}</p>`)
    expect(answer).toBeGreaterThan(html.indexOf('</h1>'))
    expect(answer).toBeLessThan(html.indexOf('<h2'))
    s.sections.forEach((q, i) => {
      expect(html).toContain(`<h2 id="question-${i + 1}" class="text-title text-ink">${escape(q.question)}</h2>`)
      for (const p of q.answer) expect(html).toContain(`>${escape(p)}</p>`)
    })
  })

  it.each(servicePages)('$slug stands each proving project as a plate, in order, and no other', (s) => {
    const html = render(ServicePage({ params: { slug: s.slug } }))
    const plates = Array.from(html.matchAll(/<li id="plate-([^"]+)"/g)).map((m) => m[1])
    expect(plates).toEqual(s.projectIds.map((id) => projects.find((p) => p.id === id)!.slug))
  })

  it.each(servicePages)('$slug loads the first row of proof plates at once and the rest lazily', (s) => {
    const html = render(ServicePage({ params: { slug: s.slug } }))
    const plates = html.match(/<li id="plate-[\s\S]*?<\/li>/g) ?? []
    plates.forEach((plate, i) => {
      if (plate.includes('<img')) expect(plate).toContain(i < 3 ? 'loading="eager"' : 'loading="lazy"')
    })
    expect(plates.slice(0, 3).some((plate) => plate.includes('loading="eager"'))).toBe(true)
  })

  it.each(servicePages)('$slug jumps to the form it ends in, and leads back to every service', (s) => {
    const html = render(ServicePage({ params: { slug: s.slug } }))
    expect(html).toContain('<a href="#contact" class="press button-primary">')
    expect(html).toContain(`>${ctaLabels.allServices}</span>`)
    expect(html).toContain('href="/services"')
    expect(html.indexOf('<section id="contact"')).toBeGreaterThan(html.lastIndexOf('<li id="plate-'))
  })

  // F12 (finish review): a caption inside the 36rem scroller was cut mid-word at
  // 390, so the title is a heading above it that names the region and the table.
  it('sets each comparison as a real table: a heading above it, column and row headers, a focusable scroll region', () => {
    for (const s of servicePages.filter((x) => x.comparison)) {
      const html = render(ServicePage({ params: { slug: s.slug } }))
      const c = s.comparison!
      const heading = `<h2 id="comparison-title" class="text-title text-ink">${escape(c.caption)}</h2>`
      const region = '<div role="region" aria-labelledby="comparison-title" tabindex="0" class="mt-5 overflow-x-auto">'
      expect(html).toContain(heading)
      expect(html).toContain(region)
      expect(html.indexOf(heading)).toBeLessThan(html.indexOf(region))
      expect(html).toContain('<table aria-labelledby="comparison-title"')
      expect(html).not.toContain('<caption')
      expect(html.match(/<th scope="col"/g)).toHaveLength(3)
      expect(html.match(/<th scope="row"/g)).toHaveLength(c.rows.length)
      // Read inside the table, row by row: the project titles also appear as proof plates elsewhere on the page.
      const table = html.match(/<table[\s\S]*?<\/table>/)![0]
      const tbody = table.slice(table.indexOf('<tbody'))
      const trs = tbody.match(/<tr[\s>][\s\S]*?<\/tr>/g)!
      expect(trs).toHaveLength(c.rows.length)
      c.rows.forEach((row, i) => {
        expect(trs[i]).toContain(escape(row.need))
        expect(trs[i]).toContain(escape(row.choice))
        for (const id of row.projectIds) expect(trs[i]).toContain(escape(projects.find((p) => p.id === id)!.title))
      })
    }
  })
})
