import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { CaseStudies } from '@/components/sections/case-studies'
import { FieldLog } from '@/components/sections/field-log'
import { Products } from '@/components/sections/products'
import { Rack } from '@/components/sections/rack'
import { RouteLine } from '@/components/sections/route-line'
import { Stack } from '@/components/sections/stack'
import { noPreviewCopy } from '@/components/ui/no-preview-tag'
import { groupForHomepage } from '@/lib/board'
import { FLAGSHIP_SLUGS, briefLead, getCaseStudy } from '@/lib/case-studies'
import {
  education,
  experience,
  galleryContent,
  galleryImages,
  projects,
  recommendations,
  sectionContent,
  skills,
} from '@/lib/data'
import { buildFieldLog } from '@/lib/field-log'
import { canLinkLive, fullShotFor, isEmbeddable } from '@/lib/project-page'
import type { Project } from '@/types'

// The Portfolio 4.0 homepage sections, retired one per task in S2
// (docs/superpowers/plans/2026-11-20-portfolio-v5-s2.md). The new sections are
// tested in tests/components/homepage.test.tsx.

const products = projects.filter((p) => p.band === 'Products')
const racked = projects.filter((p) => p.band !== 'Products')
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')

describe('Products', () => {
  const html = renderToStaticMarkup(<Products />)
  const spreads = html.match(/<article[\s\S]*?<\/article>/g) ?? []

  it('takes its heading from lib/data.ts', () => {
    expect(html).toContain(`>${sectionContent.work.eyebrow}<`)
    expect(html).toMatch(new RegExp(`<h2 id="work-title"[^>]*>${sectionContent.work.title}<`))
  })

  it('opens one spread per product, in order', () => {
    expect(spreads).toHaveLength(products.length)
    products.forEach((p, i) => expect(spreads[i]).toContain(`>${p.title}<`))
  })

  it('leads each spread with name, summary and status, before the detail and the preview', () => {
    products.forEach((project, i) => {
      const spread = spreads[i]
      const at = (needle: string) => spread.indexOf(needle)
      const title = at(`>${project.title}<`)
      expect(title).toBeGreaterThan(-1)
      expect(at(`>${escape(project.summary)}<`)).toBeGreaterThan(title)
      expect(at('data-status=')).toBeGreaterThan(at(`>${escape(project.summary)}<`))
      expect(at(escape(project.description.slice(0, 40)))).toBeGreaterThan(at('data-status='))
    })
  })

  it('links each product to its page, and to the live site a visitor can open', () => {
    products.forEach((project, i) => {
      expect(spreads[i]).toContain(`href="/projects/${project.slug}"`)
      if (canLinkLive(project) && project.links.live) expect(spreads[i]).toContain(`href="${project.links.live}"`)
    })
  })

  it('shows the real site in a still screenshot, or says honestly why there is no picture', () => {
    products.forEach((project, i) => {
      if (fullShotFor(project)) {
        expect(spreads[i]).toContain('project-shot__frame')
        expect(spreads[i]).not.toMatch(/scroll-preview|animation-timeline/)
        // "Read more" is the named link to the same page: the screenshot is not a second tab stop.
        expect(spreads[i]).toMatch(/<a [^>]*tabindex="-1"[^>]*aria-hidden="true"[^>]*class="project-shot lift-card /)
      } else {
        expect(spreads[i]).not.toContain('project-shot__frame')
        expect(spreads[i]).toContain(escape(noPreviewCopy(project)))
      }
    })
  })

  it('offers a live preview on every product a visitor can open: live where it frames, a capture elsewhere', () => {
    products.forEach((project, i) => {
      expect(spreads[i].includes('aria-haspopup="dialog"'), project.slug).toBe(canLinkLive(project))
      if (!canLinkLive(project)) return
      expect(spreads[i], project.slug).toContain(`data-preview="${isEmbeddable(project) ? 'live' : 'capture'}"`)
    })
  })
})

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
  it('links each project page from Products or the rack', () => {
    const html = renderToStaticMarkup(<Products />) + renderToStaticMarkup(<Rack />)
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

describe('Field log', () => {
  const html = renderToStaticMarkup(<FieldLog />)

  it('takes its heading from lib/data.ts', () => {
    expect(html).toMatch(new RegExp(`<h2 id="field-log-title"[^>]*>${galleryContent.title}<`))
  })

  it('ties every photo button to its visible caption', () => {
    for (const image of galleryImages) {
      const id = `field-log-caption-${image.id}`
      expect(html).toContain(`aria-describedby="${id}"`)
      expect(html).toContain(`id="${id}"`)
    }
  })

  it('marks thumbnails decorative, since their buttons carry the description', () => {
    for (const image of galleryImages) {
      expect(html).not.toMatch(new RegExp(`<img[^>]*alt="${image.alt}"`))
    }
  })

  it('attributes every testimonial and links it to the project it is about', () => {
    for (const r of recommendations) {
      expect(html).toContain(escape(r.authorName))
      const project = projects.find((p) => p.id === r.projectId)
      if (project) expect(html).toContain(`href="/projects/${project.slug}"`)
    }
  })

  it('never leaves a single card alone on the last three-column row', () => {
    const entries = buildFieldLog(galleryImages, recommendations, projects)
    if (entries.length % 3 === 1) expect(html).toContain('lg:col-span-3')
  })
})

describe('Route line', () => {
  const html = renderToStaticMarkup(<RouteLine />)

  it('keeps the #changelog anchor and its heading from lib/data.ts', () => {
    expect(html).toContain('id="changelog"')
    expect(html).toMatch(new RegExp(`<h2 id="changelog-title"[^>]*>${escape(sectionContent.changelog.title)}<`))
  })

  it('stops at every role and every degree, in two lanes', () => {
    for (const e of experience) expect(html).toContain(escape(e.title))
    for (const e of education) expect(html).toContain(escape(e.degree))
    expect(html).toContain('>Work<')
    expect(html).toContain('>Education<')
  })
})

describe('Stack', () => {
  const html = renderToStaticMarkup(<Stack />)

  it('lists every skill under its category', () => {
    for (const s of skills) expect(html).toContain(`>${s.name}<`)
  })

  it('renders the AI & automation group', () => {
    expect(html).toContain('>AI &amp; automation<')
    for (const name of ['Claude Code', 'Codex', 'Qwen Code', 'n8n', 'Groq / LLM APIs']) expect(html).toContain(`>${name}<`)
  })
})
