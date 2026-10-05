import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import ProjectsPage from '@/app/projects/page'
import ProjectPage from '@/app/projects/[slug]/page'
import { Hero } from '@/components/sections/hero'
import { Products } from '@/components/sections/products'
import { Rack } from '@/components/sections/rack'
import { Stack } from '@/components/sections/stack'
import { BoardFilter } from '@/components/ui/board-filter'
import { getCaseStudy } from '@/lib/case-studies'
import { heroContent, projects, projectsPageContent, skills } from '@/lib/data'
import { splitProofPoint } from '@/lib/proof'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

// Refinement gate R5 (critique "Concrete UI bugs" 1-3, P1 proof): the same
// project carries the same edge code everywhere, the counts agree, a filtered
// /projects says which band it shows, and the hero's AI line points at proof.

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
    Array.from(codes(renderToStaticMarkup(<Products />), /<article/)).concat(
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
    expect(html).toContain(`${projects.length} projects · ${shipped} shipped, ${staging} in staging`)
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

describe('hero AI proof', () => {
  const html = renderToStaticMarkup(<Hero />)

  it('points at things in use, from lib/data.ts, under the AI line', () => {
    const { lead, items } = heroContent.aiProof
    expect(html).toContain(lead)
    for (const item of items) expect(html).toContain(item.label.replace(/'/g, '&#x27;'))
    expect(html.indexOf(heroContent.aiLine)).toBeLessThan(html.indexOf(lead))
  })

  it('links each proof that has a page to that page', () => {
    for (const item of heroContent.aiProof.items.filter((i) => i.href)) {
      expect(html).toContain(`href="${item.href}"`)
      const slug = item.href!.replace('/projects/', '')
      expect(projects.some((p) => p.slug === slug), slug).toBe(true)
    }
  })

  it('claims only facts the site already holds', () => {
    // Connecta PH: the case study says it was built with AI coding help.
    expect(getCaseStudy('connecta-ph')?.role).toContain('AI coding help')
    // Chunks: the chat widget's name, and the chat route runs on Groq.
    expect(readFileSync('components/ui/chat-widget.tsx', 'utf8')).toContain("I'm Chunks")
    expect(readFileSync('app/api/chat/route.ts', 'utf8').toLowerCase()).toContain('groq')
    expect(skills.some((s) => s.name.includes('Groq'))).toBe(true)
  })

  it('describes the portrait, from data', () => {
    expect(heroContent.portraitAlt).toMatch(/^Portrait of Christian Raro/)
    expect(html).toContain(`aria-label="View larger image: ${heroContent.portraitAlt}"`)
  })
})

describe('stack', () => {
  it('shows WordPress & e-commerce as its own group, first, without a chip', () => {
    const html = renderToStaticMarkup(<Stack />)
    const groups = Array.from(html.matchAll(/<dt[^>]*>([^<]+)<\/dt>/g)).map((m) => m[1])
    expect(groups[0]).toBe('WordPress &amp; e-commerce')
    expect(html).not.toMatch(/rounded-full bg-panel[^"]*">WordPress</)
  })
})
