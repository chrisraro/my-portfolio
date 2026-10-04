import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import ProjectsPage from '@/app/projects/page'
import { noPreviewCopy } from '@/components/ui/no-preview-tag'
import { bandSlug } from '@/lib/board'
import { projects, projectsPageContent } from '@/lib/data'
import { canLinkLive, fullShotFor } from '@/lib/project-page'
import { extractDomain } from '@/lib/utils'
import { BAND_ORDER, type Project } from '@/types'

const render = (band?: string) => renderToStaticMarkup(ProjectsPage({ searchParams: band ? { band } : {} }))
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')

describe('/projects as the rack', () => {
  const html = render()
  const cards = html.match(/<a [^>]*class="rack-card[\s\S]*?<\/a>/g) ?? []
  const cardFor = (p: Project) => cards.find((c) => c.includes(`href="/projects/${p.slug}"`)) ?? ''

  it('takes its heading from lib/data.ts, with one h1', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain(`>${projectsPageContent.title}</h1>`)
    expect(html).toContain(`>${projectsPageContent.eyebrow}</p>`)
  })

  it('shows every project once, as a card linking to its page in the same tab', () => {
    expect(cards).toHaveLength(projects.length)
    for (const p of projects) {
      expect(cardFor(p), p.slug).toContain(`>${p.title}<`)
      expect(cardFor(p)).not.toContain('target="_blank"')
    }
    expect(html).not.toContain('href="#"')
  })

  it('names each band as an h2 tier, in BAND_ORDER', () => {
    const at = BAND_ORDER.map((band) => html.search(new RegExp(`<h2 [^>]*>${band}<`)))
    for (const i of at) expect(i).toBeGreaterThan(-1)
    expect(at.slice().sort((a, b) => a - b)).toEqual(at)
  })

  it('always states the status in words, through StatusBadge', () => {
    for (const p of projects) {
      expect(cardFor(p), p.slug).toContain('data-status=')
      expect(cardFor(p), p.slug).toMatch(/>(Live|Early access|Private|Internal|Staging)</)
    }
  })

  it('marks a staging site on its card', () => {
    for (const p of projects.filter((x) => x.status === 'staging')) expect(cardFor(p)).toContain('>Staging<')
  })

  // The card opens the project page, not the live site, so the domain it shows
  // stays out of the link's accessible name.
  it('shows the domain, or says plainly there is none, out of the link name', () => {
    for (const p of projects) {
      const label = canLinkLive(p) && p.links.live ? extractDomain(p.links.live) : 'no public URL'
      expect(cardFor(p), p.slug).toMatch(new RegExp(`<span aria-hidden="true" class="[^"]*">${label.replace(/\./g, '\\.')}</span>`))
    }
    expect(html).not.toContain('—')
  })

  it('sinks a scroll preview in each pocket, or a printed tag where there is none', () => {
    for (const p of projects) {
      if (fullShotFor(p)) expect(cardFor(p), p.slug).toContain('scroll-preview__shot')
      else expect(cardFor(p), p.slug).toContain(escape(noPreviewCopy(p)))
    }
  })

  it('numbers the cards as one strip over the whole inventory', () => {
    const codes = html.match(/\d{2} \/ \d{2} · /g) ?? []
    expect(codes).toHaveLength(projects.length)
    expect(new Set(codes).size).toBe(projects.length)
  })

  it('shows each project one-line summary on its card', () => {
    for (const p of projects) expect(cardFor(p), p.slug).toContain(escape(p.summary))
  })

  it('offers one Start a project, after the rack', () => {
    expect(html.match(/href="\/#contact"/g)).toHaveLength(1)
    expect(html.indexOf('href="/#contact"')).toBeGreaterThan(html.lastIndexOf('class="rack-card'))
  })
})

describe('/projects filter', () => {
  it('filters on the server, keeping each card its unfiltered number', () => {
    const all = render()
    for (const band of BAND_ORDER) {
      const html = render(bandSlug(band))
      const cards = html.match(/<a [^>]*class="rack-card[\s\S]*?<\/a>/g) ?? []
      const inBand = projects.filter((p) => p.band === band)
      expect(cards, band).toHaveLength(inBand.length)
      for (const p of inBand) {
        const code = (s: string) => s.match(new RegExp(`(\\d{2} / \\d{2} · ${band})[\\s\\S]{0,400}?>${p.title}<`))?.[1]
        expect(code(all), p.slug).toBeDefined()
        expect(code(html), p.slug).toBe(code(all))
      }
    }
  })

  it('marks the current tab with aria-current, as plain links', () => {
    const tag = (html: string, href: string) => html.match(new RegExp(`<a [^>]*href="${href.replace('?', '\\?')}"[^>]*>`))?.[0] ?? ''
    const sites = render('sites')
    expect(tag(sites, '/projects?band=sites')).toContain('aria-current="page"')
    expect(tag(sites, '/projects')).not.toContain('aria-current')
    expect(tag(render(), '/projects')).toContain('aria-current="page"')
  })

  it('ships no client code of its own', () => {
    expect(readFileSync('app/projects/page.tsx', 'utf8')).not.toContain("'use client'")
    expect(readFileSync('components/ui/board-filter.tsx', 'utf8')).not.toContain("'use client'")
  })
})

describe('rack card focus', () => {
  // Lifted 38%, a card's lower edge still sat under the pocket's clip-path, so
  // the bottom of its focus ring was cut off. Focus takes the card out whole.
  it('lifts the pocket clip while a card inside it has keyboard focus', () => {
    const css = readFileSync('app/globals.css', 'utf8')
    expect(css).toMatch(/\.rack-pocket:has\(:focus-visible\) \{ clip-path: none; \}/)
    expect(css).not.toContain('.rack-pocket:focus-within')
  })
})
