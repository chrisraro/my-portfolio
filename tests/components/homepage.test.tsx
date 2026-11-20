import { existsSync, readFileSync } from 'node:fs'
import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import HomePage from '@/app/page'
import { ElevationStrip } from '@/components/sections/elevation-strip'
import { FieldMap } from '@/components/sections/field-map'
import { Fork } from '@/components/sections/fork'
import { OwnProducts } from '@/components/sections/own-products'
import { PlanTheRoute } from '@/components/sections/plan-the-route'
import { TrailJournals } from '@/components/sections/trail-journals'
import { Trailhead } from '@/components/sections/trailhead'
import { ToastProvider } from '@/components/ui/toaster'
import { noPreviewCopy } from '@/components/ui/no-preview-tag'
import { catalogOrder, projectCode } from '@/lib/board'
import { FLAGSHIP_SLUGS, briefLead, getCaseStudy } from '@/lib/case-studies'
import { heroContent, navigationItems, paymentGateways, projects, resumeUrl, sectionContent } from '@/lib/data'
import { buildElevationStrip, elevationFigures } from '@/lib/elevation'
import { MAP_VIEWBOX, project as toMap } from '@/lib/geo'
import { phOutline } from '@/lib/ph-outline'
import { placeGroups, unplacedProjects } from '@/lib/places'
import { canLinkLive, fullShotFor, hasFullShot, isEmbeddable } from '@/lib/project-page'
import { parseCssRules } from '@/tests/helpers/css-rules'

// The Isarog Trail Map homepage (spec §5): one describe per section, in page
// order. Each S2 task adds its section here and to SECTIONS.
const css = readFileSync('app/globals.css', 'utf8')
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')

// Every new section, for the checks that hold for all of them.
const SECTIONS: [string, ReactElement][] = [
  ['Trailhead', <Trailhead key="trailhead" />],
  ['ElevationStrip', <ElevationStrip key="elevation" />],
  ['Fork', <Fork key="fork" />],
  ['FieldMap', <FieldMap key="field-map" />],
  ['OwnProducts', <OwnProducts key="own-products" />],
  ['TrailJournals', <TrailJournals key="journals" />],
  ['PlanTheRoute', <ToastProvider key="plan"><PlanTheRoute /></ToastProvider>],
]

describe('Trailhead', () => {
  const html = renderToStaticMarkup(<Trailhead />)
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? ''

  it('is the #top section, the eyebrow above the headline', () => {
    expect(html).toMatch(/^<section id="top" aria-labelledby="trailhead-title"/)
    expect(html).toContain(`>${heroContent.eyebrow}</p>`)
    expect(html.indexOf(heroContent.eyebrow)).toBeLessThan(html.indexOf('<h1'))
  })

  it('gives the portrait plate wrapper its own width, so the plate cannot collapse in the grid', () => {
    const wrapper = html.match(/<div class="([^"]*\bmd:justify-self-end\b[^"]*)"/)?.[1] ?? ''
    expect(wrapper).toMatch(/\bw-full\b/)
    expect(wrapper).toContain('max-w-[22rem]')
  })

  it('sets the headline one authored line per span, read as one sentence', () => {
    expect(h1.match(/class="trailhead-line"/g)).toHaveLength(heroContent.headlineLines.length)
    expect(h1.replace(/<[^>]+>/g, '')).toBe(heroContent.headline)
  })

  it('says what he builds and for whom, from data', () => {
    expect(html).toContain(`>${escape(heroContent.subheadline)}</p>`)
  })

  it('offers both paths: Start a project, then Hire me for a role, both to #contact until S4', () => {
    const primary = html.search(/<a href="#contact" class="press button-primary">Start a project/)
    const secondary = html.search(/<a href="#contact" class="press button-secondary">Hire me for a role/)
    expect(primary).toBeGreaterThan(-1)
    expect(secondary).toBeGreaterThan(primary)
  })

  it('sets the portrait on a survey plate around the lightbox, named once', () => {
    expect(html).toMatch(new RegExp(`<div class="survey-plate"><button type="button" aria-label="View larger image: ${heroContent.portraitAlt}" class="[^"]*w-full`))
    expect(html).not.toMatch(/<img[^>]*alt="(Christian Raro|Portrait of)/)
  })

  it('draws the trail out of the plate on load, over the contours', () => {
    expect(html).toContain('class="trail-draw trail-draw--load"')
    expect(html).toMatch(/<svg aria-hidden="true"[^>]*class="[^"]*text-contour/)
  })
})

describe('ElevationStrip', () => {
  const html = renderToStaticMarkup(<ElevationStrip />)
  const strip = html.match(/<div aria-hidden="true" class="elevation-track relative mt-12[\s\S]*?<\/div><ol/)?.[0] ?? ''

  it('is the #timeline section the legend’s Experience link lands on, its heading from data', () => {
    expect(html).toMatch(/^<section id="timeline" aria-labelledby="timeline-title"/)
    expect(navigationItems.find((n) => n.label === 'Experience')?.href).toBe('#timeline')
    expect(html).toContain(`>${sectionContent.timeline.eyebrow}</p>`)
    expect(html).toMatch(new RegExp(`<h2 id="timeline-title" class="text-section[^"]*">${escape(sectionContent.timeline.title)}</h2>`))
  })

  it('marks each proof figure as a spot height, counted from the data', () => {
    for (const f of elevationFigures()) {
      expect(html).toContain(`>${f.value}</span>`)
      expect(html).toContain(`>${f.label}</span>`)
    }
  })

  it('lists every role and degree with its dates, newest first', () => {
    let last = -1
    for (const e of buildElevationStrip().entries) {
      const at = html.indexOf(`>${escape(e.title)}</p>`)
      expect(at, e.title).toBeGreaterThan(last)
      last = at
      expect(html).toContain(`>${escape(e.subtitle)}</p>`)
      expect(html).toContain(`>${e.date}</p>`)
    }
  })

  it('draws the strip from the first year to now, the marker resting at now', () => {
    expect(strip).toContain('>2020</span>')
    expect(strip).toContain('class="elevation-marker')
    expect(strip).toContain(`>${sectionContent.timeline.here}</span>`)
  })
})

describe('Fork', () => {
  const html = renderToStaticMarkup(<Fork />)
  const { fork } = sectionContent
  const cards = html.match(/<li[\s\S]*?<\/li>/g) ?? []

  it('is the #fork section with its heading from data', () => {
    expect(html).toMatch(/^<section id="fork" aria-labelledby="fork-title"/)
    expect(html).toContain(`>${fork.eyebrow}</p>`)
    expect(html).toMatch(new RegExp(`<h2 id="fork-title"[^>]*>${escape(fork.title)}</h2>`))
  })

  it('offers two paths, business first', () => {
    expect(cards).toHaveLength(2)
    expect(cards[0]).toContain(`>${fork.business.title}</h3>`)
    expect(cards[1]).toContain(`>${fork.team.title}</h3>`)
  })

  it('names every payment gateway on the business path, from the data', () => {
    for (const gateway of paymentGateways) expect(fork.business.body).toContain(gateway)
    expect(cards[0]).toContain(escape(fork.business.body))
  })

  it('sends the business path to the contact form until S4 builds /services', () => {
    expect(cards[0]).toMatch(new RegExp(`<a href="#contact" class="press button-secondary">${fork.business.cta}`))
  })

  it('sends the team path to the contact form and the résumé until S4 builds /hire', () => {
    expect(cards[1]).toMatch(new RegExp(`<a href="#contact" class="press button-secondary">${fork.team.cta}`))
    expect(cards[1]).toContain(`href="${resumeUrl}"`)
    expect(cards[1]).toContain('(PDF, opens in a new tab)')
  })
})

describe('FieldMap', () => {
  const html = renderToStaticMarkup(<FieldMap />)
  const svg = html.slice(html.indexOf('<svg'), html.indexOf('</svg>'))
  const list = html.slice(html.indexOf('</svg>'))
  const groups = placeGroups(projects)
  const { fieldMap } = sectionContent

  it('is the #work section with its heading from data', () => {
    expect(html).toMatch(/^<section id="work" aria-labelledby="work-title"/)
    expect(html).toContain(`>${fieldMap.eyebrow}</p>`)
    expect(html).toMatch(new RegExp(`<h2 id="work-title"[^>]*>${escape(fieldMap.title)}</h2>`))
  })

  it('draws the Philippines outline in the projection the pins use', () => {
    expect(svg).toContain(`viewBox="${MAP_VIEWBOX}"`)
    expect(svg).toContain(`d="${phOutline.slice(0, 60)}`)
  })

  it('pins every place as a real link to its first project: a ring for a region, a dot for a city', () => {
    for (const g of groups) {
      const pin = svg.match(new RegExp(`<a href="/projects/${g.projects[0].slug}" tabindex="-1" aria-hidden="true" class="map-pin">([\\s\\S]*?)</a>`))?.[1]
      expect(pin, g.name).toBeDefined()
      const { x, y } = toMap(g.lat, g.lng)
      expect(pin, g.name).toContain(`cx="${x}" cy="${y}"`)
      expect(pin, g.name).toContain(`class="${g.precision === 'region' ? 'map-ring' : 'map-dot'} `)
      expect(pin, g.name).toContain(`>${g.name}</text>`)
    }
    expect(svg.match(/<a /g)).toHaveLength(groups.length)
  })

  it('lists each place with its projects as map-label links, the way in for keyboard and screen readers', () => {
    for (const g of groups) {
      expect(list).toContain(`>${g.name}</span>`)
      for (const p of g.projects) {
        expect(list, p.slug).toContain(`href="/projects/${p.slug}"`)
        expect(list, p.slug).toContain(`<span class="link-draw">${escape(p.title)}</span>`)
      }
    }
    expect(list.match(/class="map-label inline-flex/g)!.length).toBeGreaterThanOrEqual(projects.length)
  })

  it('never pins a project without a verified place: it is listed under No fixed point', () => {
    const unplaced = unplacedProjects(projects)
    expect(unplaced.length).toBeGreaterThan(0)
    expect(list).toContain(`>${fieldMap.unplacedHeading}</h3>`)
    for (const p of unplaced) {
      expect(svg, p.slug).not.toContain(`/projects/${p.slug}"`)
      expect(list, p.slug).toContain(`href="/projects/${p.slug}"`)
    }
  })

  it('links every project from the homepage, and leads on to /projects', () => {
    for (const p of projects) expect(html, p.slug).toContain(`href="/projects/${p.slug}"`)
    expect(html).toContain('href="/projects"')
  })
})

describe('OwnProducts', () => {
  const html = renderToStaticMarkup(<OwnProducts />)
  const plates = html.match(/<article[\s\S]*?<\/article>/g) ?? []
  const order = catalogOrder(projects, hasFullShot)
  const own = order.filter((p) => p.band === 'Products')

  it('is the #products section with its heading from data', () => {
    expect(html).toMatch(/^<section id="products" aria-labelledby="products-title"/)
    expect(html).toContain(`>${sectionContent.ownProducts.eyebrow}</p>`)
    expect(html).toMatch(new RegExp(`<h2 id="products-title"[^>]*>${escape(sectionContent.ownProducts.title)}</h2>`))
  })

  it('sets one survey plate per own product, in catalog order', () => {
    expect(plates).toHaveLength(own.length)
    own.forEach((p, i) => {
      expect(plates[i], p.slug).toContain(`>${p.title}</h3>`)
      expect(plates[i], p.slug).toContain('class="survey-plate"')
    })
  })

  it('carries each product’s catalog number, the one /projects shows', () => {
    own.forEach((p, i) => expect(plates[i], p.slug).toContain(`>${projectCode(p, order)}</p>`))
  })

  it('names, summarises and badges each product before its detail', () => {
    own.forEach((p, i) => {
      const at = (needle: string) => plates[i].indexOf(needle)
      expect(at(`>${escape(p.summary)}</p>`)).toBeGreaterThan(at(`>${p.title}</h3>`))
      expect(at('data-status=')).toBeGreaterThan(at(`>${escape(p.summary)}</p>`))
      expect(at(escape(p.description.slice(0, 40)))).toBeGreaterThan(at('data-status='))
    })
  })

  it('links each product to its page, and to the live site a visitor can open', () => {
    own.forEach((p, i) => {
      expect(plates[i]).toContain(`href="/projects/${p.slug}"`)
      if (canLinkLive(p) && p.links.live) expect(plates[i]).toContain(`href="${p.links.live}"`)
    })
  })

  it('shows the real site as a still with one link to its page, or says why there is no picture', () => {
    own.forEach((p, i) => {
      if (fullShotFor(p)) {
        expect(plates[i]).toContain('project-shot__frame')
        expect(plates[i]).toMatch(/<a [^>]*tabindex="-1"[^>]*aria-hidden="true"[^>]*class="project-shot lift-card /)
      } else {
        expect(plates[i]).toContain(escape(noPreviewCopy(p)))
      }
    })
  })

  it('offers a live preview on every product a visitor can open: live where it frames, a capture elsewhere', () => {
    own.forEach((p, i) => {
      expect(plates[i].includes('aria-haspopup="dialog"'), p.slug).toBe(canLinkLive(p))
      if (canLinkLive(p)) expect(plates[i], p.slug).toContain(`data-preview="${isEmbeddable(p) ? 'live' : 'capture'}"`)
    })
  })
})

describe('TrailJournals', () => {
  const html = renderToStaticMarkup(<TrailJournals />)

  it('is the #journals section with its heading from data', () => {
    expect(html).toMatch(/^<section id="journals" aria-labelledby="journals-title"/)
    expect(html).toContain(`>${sectionContent.journals.eyebrow}</p>`)
    expect(html).toMatch(new RegExp(`<h2 id="journals-title"[^>]*>${escape(sectionContent.journals.title)}</h2>`))
  })

  it('opens a journal for every flagship, in reading order, with its role, brief and place', () => {
    let last = -1
    for (const slug of FLAGSHIP_SLUGS) {
      const study = getCaseStudy(slug)!
      const project = projects.find((p) => p.slug === slug)!
      const at = html.indexOf(`href="/projects/${slug}"`)
      expect(at, slug).toBeGreaterThan(last)
      last = at
      expect(html).toContain(escape(study.role))
      expect(html).toContain(escape(briefLead(study)))
      if (project.place) expect(html, slug).toContain(`>${project.place.name} · `)
    }
  })

  it('opens one journal per flagship, so a missing study cannot silently drop a cover', () => {
    expect(html.match(/<li class="reveal-cover"/g)).toHaveLength(FLAGSHIP_SLUGS.length)
    expect(html.match(/href="\/projects\/[^"]+"/g)).toHaveLength(FLAGSHIP_SLUGS.length)
  })

  it('lifts like every catalog card and rises by transform only', () => {
    expect(html.match(/class="lift-card /g)).toHaveLength(FLAGSHIP_SLUGS.length)
    expect(html.match(/class="reveal-cover"/g)).toHaveLength(FLAGSHIP_SLUGS.length)
  })

  it('names each cover by its visible text (WCAG 2.5.3): the h3 sits inside a link with no aria-labelledby', () => {
    for (const slug of FLAGSHIP_SLUGS) {
      const project = projects.find((p) => p.slug === slug)!
      const start = html.indexOf(`href="/projects/${slug}"`)
      expect(start, slug).toBeGreaterThan(-1)
      const link = html.slice(html.lastIndexOf('<a ', start), html.indexOf('</a>', start))
      expect(link, slug).not.toMatch(/aria-labelledby|aria-label=/)
      expect(link, slug).toMatch(new RegExp(`<h3 class="[^"]*">${escape(project.title)}</h3>`))
    }
  })
})

describe('PlanTheRoute', () => {
  const html = renderToStaticMarkup(
    <ToastProvider>
      <PlanTheRoute />
    </ToastProvider>,
  )
  const source = readFileSync('components/sections/plan-the-route.tsx', 'utf8')

  it('is the #contact section, still the one form client component', () => {
    expect(html).toContain('<section id="contact" aria-labelledby="contact-title"')
    expect(source.trimStart()).toMatch(/^'use client'/)
    expect(existsSync('components/sections/contact-console.tsx')).toBe(false)
  })

  it('takes its heading and copy from data', () => {
    expect(html).toContain(`>${sectionContent.contact.eyebrow}</p>`)
    expect(html).toMatch(new RegExp(`<h2 id="contact-title" class="text-section[^"]*">${escape(sectionContent.contact.title)}</h2>`))
    expect(html).toContain(`>${escape(sectionContent.contact.lede)}</p>`)
  })

  it('keeps the field ids and names the API and the labels expect', () => {
    for (const [id, name] of [
      ['contact-name', 'name'],
      ['contact-email', 'email'],
      ['contact-message', 'message'],
    ]) {
      expect(html).toContain(`for="${id}"`)
      expect(html).toContain(`id="${id}" name="${name}"`)
    }
  })

  it('sends with the one primary button', () => {
    expect(html).toMatch(/<button type="submit" class="press button-primary[^"]*">Send message/)
  })

  it('keeps the toast and the mailto fallback', () => {
    expect(source).toContain('useToast()')
    expect(source).toContain('window.location.href = `mailto:${contactInfo.email}')
  })

  it('puts Chunks a click away', () => {
    expect(html).toContain(`>${sectionContent.contact.chunks}</button>`)
    expect(source).toContain('window.dispatchEvent(new Event(CHAT_OPEN_EVENT))')
    expect(readFileSync('components/ui/chat-widget.tsx', 'utf8')).toContain('window.addEventListener(CHAT_OPEN_EVENT, open)')
  })
})

describe('proof renders visible without JavaScript', () => {
  it.each(SECTIONS)('%s ships no opacity:0 entrance', (_name, node) => {
    expect(renderToStaticMarkup(node)).not.toMatch(/opacity:\s*0/)
  })

  // Text is never painted (or measured for contrast) faded: every keyframe
  // moves by transform or stroke, except the overlays' fades and the live pulse.
  it('fades nothing on the page: keyframes move by transform or stroke only', () => {
    const FADES = new Set(['live-pulse', 'typing-fade', 'vt-fade-out', 'vt-fade-in'])
    const frames = parseCssRules(css).filter((r) => r.ancestors.some((a) => a.startsWith('@keyframes ')))
    expect(frames.length).toBeGreaterThan(0)
    for (const r of frames) {
      const name = r.ancestors.find((a) => a.startsWith('@keyframes '))!.slice('@keyframes '.length)
      if (FADES.has(name)) continue
      expect(r.body, name).not.toMatch(/opacity/)
    }
  })
})

describe('HomePage', () => {
  const html = renderToStaticMarkup(
    <ToastProvider>
      <HomePage />
    </ToastProvider>,
  )

  it('runs the seven sections in the spec’s order', () => {
    const ids = Array.from(html.matchAll(/<section id="([^"]+)"/g)).map((m) => m[1])
    expect(ids).toEqual(['top', 'timeline', 'fork', 'work', 'products', 'journals', 'contact'])
  })

  it('sits every trail segment between two sections', () => {
    const marks = Array.from(
      html.matchAll(/<section id="|<div aria-hidden="true" class="relative mx-auto h-20 max-w-6xl md:h-28"/g),
    ).map((m) => (m[0].startsWith('<section') ? 'section' : 'segment'))
    expect(marks.filter((m) => m === 'segment').length).toBeGreaterThan(0)
    expect(marks[0]).toBe('section')
    expect(marks[marks.length - 1]).toBe('section')
    marks.forEach((m, i) => {
      if (m === 'segment') {
        expect(marks[i - 1]).toBe('section')
        expect(marks[i + 1]).toBe('section')
      }
    })
  })

  it('threads the trail: drawn out of the plate on load, then a segment between each section below the strip', () => {
    expect(html.match(/class="trail-draw trail-draw--load"/g)).toHaveLength(1)
    expect(html.match(/class="trail-draw trail-draw--view"/g)).toHaveLength(5)
  })

  it('links every project page', () => {
    for (const p of projects) expect(html, p.slug).toContain(`href="/projects/${p.slug}"`)
  })

  it('keeps two primary buttons: the trailhead’s and the form’s', () => {
    expect(html.match(/class="press button-primary/g)).toHaveLength(2)
  })

  it('ships no opacity:0 entrance', () => {
    expect(html).not.toMatch(/opacity:\s*0/)
  })
})
