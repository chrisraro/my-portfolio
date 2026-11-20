import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { CaseStudies } from '@/components/sections/case-studies'
import { OwnProducts } from '@/components/sections/own-products'
import { Rack } from '@/components/sections/rack'
import { noPreviewCopy } from '@/components/ui/no-preview-tag'
import { groupForHomepage } from '@/lib/board'
import { FLAGSHIP_SLUGS, briefLead, getCaseStudy } from '@/lib/case-studies'
import {
  projects,
  sectionContent,
} from '@/lib/data'
import { fullShotFor } from '@/lib/project-page'
import type { Project } from '@/types'

// The Portfolio 4.0 homepage sections, retired one per task in S2
// (docs/superpowers/plans/2026-11-20-portfolio-v5-s2.md). The new sections are
// tested in tests/components/homepage.test.tsx.

const racked = projects.filter((p) => p.band !== 'Products')
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')

describe('Rack', () => {
  const html = renderToStaticMarkup(<Rack />)
  const cards = html.match(/<a [^>]*class="rack-card[\s\S]*?<\/a>/g) ?? []
  const cardFor = (p: Project) => cards.find((c) => c.includes(`href="/projects/${p.slug}"`)) ?? ''

  it('takes its heading from lib/data.ts and names each tier', () => {
    expect(html).toMatch(new RegExp(`<h2 id="systems-title"[^>]*>${sectionContent.systems.title}<`))
    for (const group of groupForHomepage(racked)) expect(html).toMatch(new RegExp(`<h3 [^>]*>${group.heading}`))
  })

  it('puts every project that is not a product in the rack, once, linking to its page', () => {
    expect(cards).toHaveLength(racked.length)
    for (const p of racked) expect(cardFor(p), p.slug).toContain(`>${p.title}<`)
  })

  it('shows each card’s status through StatusBadge', () => {
    for (const p of racked) expect(cardFor(p), p.slug).toContain('data-status=')
  })

  it('numbers the cards as one strip across the whole rack', () => {
    const codes = html.match(/\d{2} \/ \d{2} · /g) ?? []
    expect(codes).toHaveLength(racked.length)
    expect(new Set(codes).size).toBe(racked.length)
    expect(codes.every((c) => c.includes(` / ${projects.length} · `))).toBe(true)
  })

  it('keeps one interactive target per card: nothing focusable inside it', () => {
    for (const card of cards) {
      expect(card.slice(3)).not.toContain('<a ')
      expect(card).not.toContain('<button')
      expect(card).not.toMatch(/tabindex/i)
    }
  })

  it('stands every card whole on the shelf: no pocket, no reserved lift', () => {
    expect(html).not.toMatch(/rack-pocket|rack-row--open|rack-card__sunk/)
  })

  it('keeps a card with no preview flat, its reason printed in the visible top', () => {
    for (const p of racked.filter((p) => !fullShotFor(p))) {
      const card = cards.find((c) => c.includes(`href="/projects/${p.slug}"`)) ?? ''
      expect(card, p.slug).toMatch(/class="rack-card lift-card sm:aspect-square/)
      // The reason sits in the text block, not only in the (wide-screen hidden) picture half.
      const top = card.match(/<span class="flex h-\[44%\][^"]*">([\s\S]*?)<\/span><span class="block min-h-0/)?.[1] ?? ''
      expect(top, p.slug).toContain(escape(noPreviewCopy(p)))
    }
    for (const p of racked.filter((p) => fullShotFor(p))) {
      const card = cards.find((c) => c.includes(`href="/projects/${p.slug}"`)) ?? ''
      expect(card, p.slug).not.toContain('sm:aspect-square')
    }
  })

  it('shows a still screenshot on each card, or a printed tag where there is none', () => {
    for (const p of racked) {
      const card = cardFor(p)
      if (fullShotFor(p)) expect(card, p.slug).toContain('project-shot__frame')
      else expect(card, p.slug).toContain(escape(noPreviewCopy(p)))
    }
  })

  it('marks a staging site on its card', () => {
    for (const p of racked.filter((x) => x.status === 'staging')) expect(cardFor(p)).toContain('>Staging<')
  })

  it('leads on to every project', () => {
    expect(html).toContain('href="/projects"')
  })
})

describe('every project is reachable from the homepage', () => {
  it('links each project page from the own products or the rack', () => {
    const html = renderToStaticMarkup(<OwnProducts />) + renderToStaticMarkup(<Rack />)
    for (const p of projects) expect(html, p.slug).toContain(`href="/projects/${p.slug}"`)
  })
})

describe('Case studies', () => {
  const html = renderToStaticMarkup(<CaseStudies />)

  it('takes its heading from lib/data.ts', () => {
    expect(html).toContain(`>${sectionContent.caseStudies.eyebrow}<`)
    expect(html).toMatch(new RegExp(`<h2 id="case-studies-title"[^>]*>${sectionContent.caseStudies.title}<`))
  })

  it('shows a cover for every flagship, in reading order, with role and brief', () => {
    let last = -1
    for (const slug of FLAGSHIP_SLUGS) {
      const study = getCaseStudy(slug)!
      const at = html.indexOf(`href="/projects/${slug}"`)
      expect(at, slug).toBeGreaterThan(last)
      last = at
      expect(html).toContain(escape(study.role))
      expect(html).toContain(escape(briefLead(study)))
    }
  })
})
