import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import ProjectPage, { generateMetadata, generateStaticParams } from '@/app/projects/[slug]/page'
import { ProductPanel } from '@/components/ui/product-panel'
import { FLAGSHIP_SLUGS, caseStudies } from '@/lib/case-studies'
import { caseStudyContent, projects, recommendations } from '@/lib/data'

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

describe('flagship case studies', () => {
  const h = caseStudyContent.headings

  it('has at least one case study to render', () => {
    expect(caseStudies.length).toBeGreaterThan(0)
  })

  it('reads brief, build, decisions, stack, outcome in that order', () => {
    for (const s of caseStudies) {
      const html = render(s.slug)
      const at = [h.brief, h.built, h.decisions, h.stack, h.outcome].map((t) => html.indexOf(`>${t}</h2>`))
      for (const i of at) expect(i).toBeGreaterThan(-1)
      expect(at.slice().sort((a, b) => a - b)).toEqual(at)
      expect(html).toContain(caseStudyContent.eyebrow.caseStudy)
      expect(html).toContain(s.role)
    }
  })

  it('numbers its decisions and states each alternative', () => {
    for (const s of caseStudies) {
      const html = render(s.slug)
      expect(html.match(/<li data-decision/g)).toHaveLength(s.decisions.length)
      for (const d of s.decisions) expect(html).toContain(d.over)
    }
  })

  it('shows the client’s own words where a quote names the project', () => {
    for (const s of caseStudies) {
      const project = projects.find((p) => p.slug === s.slug)!
      const quote = recommendations.find((r) => r.projectId === project.id)
      const html = render(s.slug)
      if (quote) expect(html).toContain(quote.authorName)
      else expect(html).not.toContain(`>${h.client}</h2>`)
    }
  })

  it('links to the next case study only when there is another', () => {
    for (const s of caseStudies) {
      const html = render(s.slug)
      if (caseStudies.length > 1) expect(html).toContain(`>${h.next}<`)
      else expect(html).not.toContain(`>${h.next}<`)
    }
  })

  it('leaves short pages short', () => {
    const shortSlugs = projects.map((p) => p.slug).filter((slug) => FLAGSHIP_SLUGS.indexOf(slug) === -1)
    for (const slug of shortSlugs) expect(render(slug)).not.toContain(`>${h.decisions}</h2>`)
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
