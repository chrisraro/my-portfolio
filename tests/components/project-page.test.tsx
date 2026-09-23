import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { alt, size } from '@/app/opengraph-image'
import ProjectPage, { generateMetadata, generateStaticParams } from '@/app/projects/[slug]/page'
import { ProductPanel } from '@/components/ui/product-panel'
import { FLAGSHIP_SLUGS, caseStudies, getCaseStudy } from '@/lib/case-studies'
import { caseStudyContent, projects, recommendations } from '@/lib/data'

const render = (slug: string) => renderToStaticMarkup(ProjectPage({ params: { slug } }))

describe('/projects/[slug]', () => {
  it('pre-renders one page per project slug', () => {
    expect(generateStaticParams().map((p) => p.slug)).toEqual(projects.map((p) => p.slug))
  })

  // notFound() throws an Error whose message and digest are both NEXT_NOT_FOUND;
  // a render crash from a data bug would throw something else.
  it('404s an unknown slug through the Next not-found error', () => {
    let error: unknown
    try {
      render('no-such-project')
    } catch (e) {
      error = e
    }
    expect(error).toBeInstanceOf(Error)
    expect((error as Error).message).toBe('NEXT_NOT_FOUND')
    expect((error as { digest?: string }).digest).toBe('NEXT_NOT_FOUND')
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

  it('gives a flagship its own link preview and canonical URL, described by its brief', () => {
    const md = generateMetadata({ params: { slug: 'el-nido-guide-ph' } })
    const description = getCaseStudy('el-nido-guide-ph')!.brief[0]
    expect(md.description).toBe(description)
    expect(md.alternates?.canonical).toBe('/projects/el-nido-guide-ph')
    expect(md.openGraph).toMatchObject({ type: 'article', title: md.title, description, url: '/projects/el-nido-guide-ph' })
    expect(md.twitter).toMatchObject({ card: 'summary_large_image', title: md.title, description })
  })

  // A page that sets its own openGraph loses the layout's file-convention image,
  // so it names the same card, app/opengraph-image.tsx, itself.
  it('keeps the site social card as the preview image', () => {
    const md = generateMetadata({ params: { slug: 'latag' } })
    const card = { url: '/opengraph-image', width: size.width, height: size.height, alt }
    expect(md.openGraph).toMatchObject({ images: [card] })
    expect(md.twitter).toMatchObject({ images: [card] })
  })

  it('describes a short page by its description, not the summary fragment', () => {
    const latag = projects.find((p) => p.slug === 'latag')!
    const md = generateMetadata({ params: { slug: 'latag' } })
    expect(md.description).toBe(latag.description)
    expect(md.alternates?.canonical).toBe('/projects/latag')
    expect(md.openGraph).toMatchObject({ type: 'article', description: latag.description, url: '/projects/latag' })
    expect(md.twitter).toMatchObject({ card: 'summary_large_image', description: latag.description })
  })

  it('omits the sector from the header meta when it just repeats the band', () => {
    expect(render('latag')).not.toContain('Products · product')
    expect(render('el-nido-guide-ph')).toContain('Sites · tours')
  })

  it('phrases the header dates as what was built, not the whole engagement', () => {
    expect(render('el-nido-guide-ph')).toContain('Built May – July 2025')
  })

  // "Start a project" is the page's one amber primary; the exit is secondary.
  it('offers the live site as a secondary button, never an amber fill', () => {
    for (const slug of ['latag', 'el-nido-guide-ph']) {
      const cls = render(slug).match(/<a [^>]*class="([^"]*)"[^>]*>Open live site/)?.[1] ?? ''
      expect(cls).toContain('border-line-strong')
      expect(cls).toContain('hover:border-accent')
      expect(cls).not.toContain('bg-accent')
      expect(cls).toContain('py-2.5')
    }
  })

  it('pads the footer "Start a project" button, not only its min-height', () => {
    const cls = render('latag').match(/<a [^>]*class="([^"]*)"[^>]*>Start a project/)?.[1] ?? ''
    expect(cls).toContain('bg-accent')
    expect(cls).toContain('py-2.5')
  })

  it('shows the mobile screenshot only from the sm breakpoint up', () => {
    const cls = render('latag').match(/aria-label="View larger image: Mobile screenshot[^"]*" class="([^"]*)"/)?.[1]
    expect(cls).toBeDefined()
    expect(cls!.split(' ')).toContain('hidden')
    expect(cls!.split(' ')).toContain('sm:block')
  })

  it('holds read-mode prose to a measure of about 70 characters', () => {
    for (const slug of ['latag', 'el-nido-guide-ph']) {
      const html = render(slug)
      expect(html).toContain('max-w-[36rem]')
      expect(html).not.toContain('max-w-[68ch]')
    }
  })

  it('lets the heading label the short page stack list', () => {
    expect(render('latag')).not.toContain('aria-label="Stack"')
  })

  it('keeps screenshots above the body on a short page', () => {
    const html = render('latag')
    expect(html.indexOf('Desktop screenshot of')).toBeLessThan(html.indexOf(`>${caseStudyContent.headings.about}</h2>`))
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

  it('leads with the brief, then the screenshots, then what was built', () => {
    for (const s of caseStudies) {
      const html = render(s.slug)
      const brief = html.indexOf(`>${h.brief}</h2>`)
      const shot = html.indexOf('Desktop screenshot of')
      const built = html.indexOf(`>${h.built}</h2>`)
      expect(shot).toBeGreaterThan(brief)
      expect(shot).toBeLessThan(built)
    }
  })

  it('gives the role its own readable line, outside the mono meta list', () => {
    const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/'/g, '&#x27;')
    for (const s of caseStudies) {
      const html = render(s.slug)
      expect(html).toMatch(new RegExp(`<p class="[^"]*text-base text-ink[^"]*">${esc(s.role)}</p>`))
      expect(html).not.toContain(`<li>${esc(s.role)}</li>`)
    }
  })

  it('names the next-case-study link on its own, out of its landmark', () => {
    for (const s of caseStudies) {
      expect(render(s.slug)).toContain(`<span class="sr-only">${h.next}: </span>`)
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

describe('related work', () => {
  const h = caseStudyContent.headings
  const title = (slug: string) => projects.find((p) => p.slug === slug)!.title
  const withRelated = caseStudies.filter((s) => (s.related ?? []).length > 0)
  // The visible text of the first link to `href`, tags stripped. Project titles
  // here have nothing renderToStaticMarkup would escape.
  const linkText = (html: string, href: string) =>
    html.match(new RegExp(`<a [^>]*href="${href}"[^>]*>([\\s\\S]*?)</a>`))?.[1].replace(/<[^>]*>/g, '')

  it('has at least one case study that names related work', () => {
    expect(withRelated.length).toBeGreaterThan(0)
  })

  it('links a flagship to each related project page by its title, after the outcome', () => {
    for (const s of withRelated) {
      const html = render(s.slug)
      expect(html).toContain(`>${h.related}<`)
      expect(html.indexOf(`>${h.related}<`)).toBeGreaterThan(html.indexOf(`>${h.outcome}</h2>`))
      for (const slug of s.related!) {
        expect(linkText(html, `/projects/${slug}`)).toBe(title(slug))
      }
    }
  })

  it('links a related short page back to the case study it is part of', () => {
    for (const s of withRelated) {
      const text = caseStudyContent.partOf.replace('{title}', title(s.slug))
      for (const slug of s.related!) {
        expect(linkText(render(slug), `/projects/${s.slug}`)).toBe(text)
        // A wrapped label keeps its arrow beside the last word, not alone on a line.
        expect(render(slug)).toContain(`<span class="whitespace-nowrap">${text.split(' ').pop()}<svg`)
      }
    }
  })

  it('gives other pages no related line and no part-of link', () => {
    expect(render('el-nido-guide-ph')).not.toContain(`>${h.related}<`)
    expect(render('latag')).not.toContain(caseStudyContent.partOf.split('{title}')[0])
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
