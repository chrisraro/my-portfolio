import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import ProjectPage, { generateMetadata, generateStaticParams } from '@/app/projects/[slug]/page'
import { ProductPanel } from '@/components/ui/product-panel'
import { caseStudyContent, projects } from '@/lib/data'

const render = (slug: string) => renderToStaticMarkup(ProjectPage({ params: { slug } }))

describe('/projects/[slug]', () => {
  it('pre-renders one page per project slug', () => {
    expect(generateStaticParams().map((p) => p.slug)).toEqual(projects.map((p) => p.slug))
  })

  it('404s an unknown slug', () => {
    expect(() => render('no-such-project')).toThrow()
  })

  it('gives every page exactly one h1, its project title', () => {
    for (const p of projects) {
      const html = render(p.slug)
      expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
      expect(html).toContain(`>${p.title}</h1>`)
    }
  })

  it('states status in words and links back to all projects', () => {
    for (const p of projects) {
      const html = render(p.slug)
      expect(html).toMatch(/>(Live|Early access|Private|Internal)</)
      expect(html).toContain('href="/projects"')
    }
  })

  it('offers the live site only where a visitor can open it', () => {
    expect(render('latag')).toContain('Open live site')
    expect(render('downtown-district-hotel')).toContain('Open live site')
    expect(render('ocs-wp-control-panel')).not.toContain('Open live site')
    expect(render('beachbus-nfc-card-system')).not.toContain('Open live site')
  })

  it('explains a missing preview instead of showing an empty frame', () => {
    expect(render('ocs-wp-control-panel')).toContain(caseStudyContent.noPreview['auth-gated'])
    expect(render('beachbus-nfc-card-system')).toContain(caseStudyContent.noPreview.internal)
  })

  it('labels screenshots for what they show', () => {
    expect(render('latag')).toContain('aria-label="View larger image: Desktop screenshot of latag.vercel.app"')
  })

  it('shows a short page its description and stack, with no invented sections', () => {
    const latag = projects.find((p) => p.slug === 'latag')!
    const html = render('latag')
    expect(html).toContain(latag.description)
    for (const t of latag.technologies) expect(html).toContain(`>${t}<`)
    expect(html).not.toContain(`>${caseStudyContent.headings.decisions}</h2>`)
  })

  it('titles each page for its project', () => {
    const md = generateMetadata({ params: { slug: 'latag' } })
    expect(String(md.title)).toMatch(/^Latag · /)
  })
})

describe('ProductPanel', () => {
  it('links each product title to its page and keeps the external link to try it', () => {
    for (const p of projects.filter((x) => x.band === 'Products')) {
      const html = renderToStaticMarkup(<ProductPanel project={p} />)
      expect(html).toContain(`href="/projects/${p.slug}"`)
      if (p.links.live) expect(html).toContain(`href="${p.links.live}"`)
    }
  })
})
