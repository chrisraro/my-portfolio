import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import ProjectsPage from '@/app/projects/page'
import ProjectPage from '@/app/projects/[slug]/page'
import { OwnProducts } from '@/components/sections/own-products'
import { Rack } from '@/components/sections/rack'
import { BoardFilter } from '@/components/ui/board-filter'
import { heroContent, projects, projectsPageContent } from '@/lib/data'
import { splitProofPoint } from '@/lib/proof'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

// Refinement gate R5 (critique "Concrete UI bugs" 1-3): the same project
// carries the same edge code everywhere, the counts agree, and a filtered
// /projects says which band it shows.

const CODE = /(\d+ \/ \d+ · [^<]+)</

/** slug -> edge code, for every chunk of markup (a card or a spread) that links one project and prints a code. */
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

describe('edge codes', () => {
  const home = new Map(
    Array.from(codes(renderToStaticMarkup(<OwnProducts />), /<article/)).concat(
      Array.from(codes(renderToStaticMarkup(<Rack />), /<li class="rack-slot/)),
    ),
  )
  const index = codes(renderProjects(), /<li class="rack-slot/)

  it('numbers every project once on each page', () => {
    expect(home.size).toBe(projects.length)
    expect(index.size).toBe(projects.length)
    expect(new Set(index.values()).size).toBe(projects.length)
  })

  it('gives a project the same code on / and /projects', () => {
    for (const p of projects) expect(home.get(p.slug), p.slug).toBe(index.get(p.slug))
  })

  it('keeps the code when a filter narrows /projects', () => {
    const sites = codes(renderProjects('sites'), /<li class="rack-slot/)
    expect(sites.size).toBeGreaterThan(0)
    for (const [slug, code] of Array.from(sites)) expect(code, slug).toBe(index.get(slug))
  })

  it('numbers /projects in the order its cards appear', () => {
    const order = Array.from(index.values()).map((c) => Number(c.split(' ')[0]))
    expect(order).toEqual(order.map((_, i) => i + 1))
  })

  it('uses the same code on a case study’s next card', () => {
    for (const slug of ['beachbus', 'el-nido-guide-ph', 'connecta-ph']) {
      if (!projects.some((p) => p.slug === slug)) continue
      const next = codes(renderToStaticMarkup(ProjectPage({ params: { slug } })), /<li class="rack-slot/)
      for (const [s, code] of Array.from(next)) expect(code, `${slug} -> ${s}`).toBe(index.get(s))
    }
  })
})

describe('project counts', () => {
  const shipped = projects.filter((p) => p.status !== 'staging').length
  const staging = projects.length - shipped

  it('states the shipped count the hero claims, and the staging one, on /projects', () => {
    const claim = heroContent.proofPoints.find((p) => p.endsWith('projects shipped'))!
    expect(Number(splitProofPoint(claim).value)).toBe(shipped)
    const html = renderProjects()
    expect(html).toContain(`${projects.length} projects · ${shipped} shipped${staging ? `, ${staging} in staging` : ''}`)
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

describe('filter tabs', () => {
  it('sit in one row that scrolls sideways, never wrapping off the lip', () => {
    const html = renderToStaticMarkup(<BoardFilter active={null} />)
    const row = html.match(/<ul class="([^"]*)"/)?.[1] ?? ''
    expect(row).toContain('overflow-x-auto')
    expect(row).not.toContain('flex-wrap')
    // A focus ring inside a scroller is drawn inward, so the scroller cannot clip it.
    expect(html).toContain('focus-visible:outline-offset-[-3px]')
  })

  it('scroll the current tab into the row on load', () => {
    const html = renderToStaticMarkup(<BoardFilter active="Sites" />)
    const current = html.match(/<li class="([^"]*)"><a [^>]*aria-current="true"/)?.[1] ?? ''
    expect(current).toContain('[scroll-initial-target:nearest]')
  })
})
