import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import ProjectsPage from '@/app/projects/page'
import ProjectPage from '@/app/projects/[slug]/page'
import { OwnProducts } from '@/components/sections/own-products'
import { projects, projectsPageContent, sectionContent } from '@/lib/data'
import { elevationFigures } from '@/lib/elevation'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

// Refinement gate R5 (critique "Concrete UI bugs" 1-3), carried into the trail
// map: the same project carries the same catalog number everywhere, the counts
// agree, and a filtered /projects says which band it shows.

const CODE = /(\d+ \/ \d+ · [^<]+)</
// A plate, on /projects and as a case study's next stop.
const PLATE = /<li id="plate-/

/** slug -> catalog number, for every chunk of markup (a plate or a product) that links one project and prints a number. */
function codes(html: string, splitter: RegExp): Map<string, string> {
  const out = new Map<string, string>()
  for (const chunk of html.split(splitter).slice(1)) {
    const slug = chunk.match(/href="\/projects\/([a-z0-9-]+)"/)?.[1]
    const code = chunk.match(CODE)?.[1]
    if (slug && code && !out.has(slug)) out.set(slug, code)
  }
  return out
}

const renderProjects = (band?: string) => renderToStaticMarkup(ProjectsPage({ searchParams: band ? { band } : {} }))

describe('catalog numbers', () => {
  const home = codes(renderToStaticMarkup(<OwnProducts />), /<article/)
  const index = codes(renderProjects(), PLATE)

  it('numbers every project once on /projects, and each own product once on /', () => {
    expect(home.size).toBe(projects.filter((p) => p.band === 'Products').length)
    expect(index.size).toBe(projects.length)
    expect(new Set(index.values()).size).toBe(projects.length)
  })

  it('gives an own product the same number on / and /projects', () => {
    for (const [slug, code] of Array.from(home)) expect(code, slug).toBe(index.get(slug))
  })

  it('keeps the number when a filter narrows /projects', () => {
    const sites = codes(renderProjects('sites'), PLATE)
    expect(sites.size).toBeGreaterThan(0)
    for (const [slug, code] of Array.from(sites)) expect(code, slug).toBe(index.get(slug))
  })

  it('numbers /projects in the order its plates appear', () => {
    const order = Array.from(index.values()).map((c) => Number(c.split(' ')[0]))
    expect(order).toEqual(order.map((_, i) => i + 1))
  })

  it('uses the same number on a case study’s next stop', () => {
    for (const slug of ['beachbus', 'el-nido-guide-ph', 'connecta-ph']) {
      if (!projects.some((p) => p.slug === slug)) continue
      const next = codes(renderToStaticMarkup(ProjectPage({ params: { slug } })), PLATE)
      for (const [s, code] of Array.from(next)) expect(code, `${slug} -> ${s}`).toBe(index.get(s))
    }
  })
})

describe('project counts', () => {
  const shipped = projects.filter((p) => p.status !== 'staging').length
  const staging = projects.length - shipped

  it('states the shipped count the elevation strip claims, and the staging one, on /projects', () => {
    const figure = elevationFigures().find((f) => f.label === sectionContent.timeline.figures.shipped)!
    expect(figure.value).toBe(shipped)
    expect(renderProjects()).toContain(`${projects.length} projects · ${shipped} shipped${staging ? `, ${staging} in staging` : ''}`)
  })

  it('counts a filtered view against the whole inventory', () => {
    const sites = projects.filter((p) => p.band === 'Sites')
    expect(renderProjects('sites')).toContain(`${sites.length} of ${projects.length} projects`)
  })
})

describe('/projects eyebrow', () => {
  it('says "All projects" unfiltered, and names the band when filtered', () => {
    expect(renderProjects()).toContain(`>${projectsPageContent.eyebrow}</p>`)
    const sites = renderProjects('sites')
    expect(sites).toContain(`>${projectsPageContent.bandEyebrow.replace('{band}', 'Sites')}</p>`)
    expect(sites).not.toContain(`>${projectsPageContent.eyebrow}</p>`)
  })
})
