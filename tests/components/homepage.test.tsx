import { existsSync, readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import HomePage from '@/app/page'
import { Experience } from '@/components/sections/experience'
import { Intro } from '@/components/sections/intro'
import { NowBuilding } from '@/components/sections/now-building'
import { PlanTheRoute } from '@/components/sections/plan-the-route'
import { StackTable } from '@/components/sections/stack-table'
import { CaseStudyList, MORE_ROWS, WorkList } from '@/components/sections/work-list'
import { Places, WorkWithMe } from '@/components/sections/work-with-me'
import { ToastProvider } from '@/components/ui/toaster'
import { FLAGSHIP_SLUGS, briefLead, getCaseStudy } from '@/lib/case-studies'
import {
  availability,
  contactInfo,
  ctaLabels,
  experience,
  heroContent,
  paymentGateways,
  projects,
  resumeUrl,
  sectionContent,
  servicePages,
} from '@/lib/data'
import { elevationFigures } from '@/lib/elevation'
import { placeGroups } from '@/lib/places'
import { canLinkLive } from '@/lib/project-page'

// The First Light homepage: one reading column of nine sections, in this order
// (the direction contract). One describe per section, then the page.
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')

// Every section, for the checks that hold for all of them.
const SECTIONS = [
  ['Intro', <Intro key="intro" />],
  ['NowBuilding', <NowBuilding key="building" />],
  ['Experience', <Experience key="experience" />],
  ['CaseStudyList', <CaseStudyList key="journals" />],
  ['WorkList', <WorkList key="work" />],
  ['Places', <Places key="places" />],
  ['WorkWithMe', <WorkWithMe key="fork" />],
  ['StackTable', <StackTable key="stack" />],
  [
    'PlanTheRoute',
    <ToastProvider key="plan">
      <PlanTheRoute />
    </ToastProvider>,
  ],
] as const

describe('Intro', () => {
  const html = renderToStaticMarkup(<Intro />)

  it('is the #top section, named by its one h1: his name', () => {
    expect(html).toMatch(/^<section id="top" aria-labelledby="intro-title"/)
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain(`<h1 id="intro-title" class="text-name text-ink">${heroContent.name}</h1>`)
    expect(html).toContain(`>${heroContent.eyebrow}</p>`)
  })

  it('says what he builds and for whom, from data, and claims no products of his own', () => {
    expect(html).toContain(`>${heroContent.headline}</p>`)
    expect(html).toContain(`>${heroContent.subheadline}</p>`)
    expect(html).not.toMatch(/products? of my own/i)
  })

  it('offers both paths: Start a project to the form, then Hire me for a role to /hire', () => {
    expect(html).toContain('href="#contact"')
    expect(html).toContain(ctaLabels.startProject)
    expect(html).toContain(`<a class="press button-secondary" href="/hire">${ctaLabels.hireForRole}</a>`)
    expect(html).toContain(`>${availability}</p>`)
    expect(html.match(/class="press button-primary/g)).toHaveLength(1)
  })

  it('carries the portrait in the lightbox, loaded at once, and the résumé as a named icon link', () => {
    expect(html).toContain(`aria-label="View larger image: ${escape(heroContent.portraitAlt)}"`)
    expect(html).toContain('fetchpriority="high"')
    expect(html).toContain(`href="${resumeUrl}"`)
    expect(html).toContain(`${ctaLabels.downloadResume} (PDF, opens in a new tab)`)
  })

  it('rises its three lines of copy in turn, by --i, on load', () => {
    expect(html.match(/class="rise[ "]/g)).toHaveLength(3)
    for (const i of [0, 1, 2]) expect(html).toContain(`style="--i:${i}"`)
  })

  it('shows the three figures counted from the data, each a link to what it counts', () => {
    const figures = elevationFigures()
    expect(figures).toHaveLength(3)
    for (const f of figures) {
      expect(html).toContain(`<a class="group block min-h-[44px]" href="${f.href}">`)
      expect(html).toContain(`<span class="text-figure block text-ink">${f.value}</span>`)
      expect(html).toContain(`>${f.label}</span>`)
    }
  })
})

describe('NowBuilding', () => {
  const html = renderToStaticMarkup(<NowBuilding />)
  const building = projects.filter((p) => p.status === 'in-development')

  it('shows every project in development, and only those', () => {
    expect(building.map((p) => p.id)).toEqual(['iskotify'])
    expect(html.match(/<article /g)).toHaveLength(building.length)
    for (const p of building) {
      expect(html).toContain(`>${escape(p.title)}</h2>`)
      expect(html).toContain(escape(sectionContent.building.lines[p.id]))
    }
    for (const p of projects.filter((x) => x.status !== 'in-development')) expect(html, p.slug).not.toContain(`>${escape(p.title)}</h2>`)
  })

  it('is the #building section, labelled from data', () => {
    expect(html).toMatch(/^<section id="building" aria-label="In development"/)
    expect(html).toContain(`aria-label="${sectionContent.building.title}"`)
  })

  it('badges it In development in words, never as live', () => {
    expect(html).toContain('data-status="in-development"')
    expect(html).toContain('<span>In development</span>')
    expect(html).not.toContain('bg-live')
    expect(html).not.toContain('live-pulse')
  })

  it('links the project’s page and its live site, which opens in a new tab', () => {
    expect(html).toContain('href="/projects/iskotify"')
    expect(html).toContain(sectionContent.building.more)
    const iskotify = projects.find((p) => p.id === 'iskotify')!
    expect(canLinkLive(iskotify)).toBe(true)
    expect(html).toContain(`<a href="${iskotify.links.live}" target="_blank" rel="noopener noreferrer"`)
  })

  it('sets the banner on glass with its screenshot as decoration', () => {
    expect(html).toContain('class="banner glass')
    expect(html).toMatch(/<div aria-hidden="true" class="banner__shot/)
  })

  it('renders nothing when nothing is in development', () => {
    expect(readFileSync('components/sections/now-building.tsx', 'utf8')).toContain('if (building.length === 0) return null')
  })
})

describe('Experience', () => {
  const html = renderToStaticMarkup(<Experience />)

  it('is the #timeline section, its heading from data, no eyebrow', () => {
    expect(html).toMatch(/^<section id="timeline" aria-labelledby="timeline-title"/)
    expect(html).not.toContain('class="eyebrow')
    expect(html).toMatch(new RegExp(`<h2 id="timeline-title" class="text-list text-ink">${escape(sectionContent.timeline.title)}</h2>`))
  })

  it('lists every role and degree with its dates, the degree last', () => {
    const titles = [...experience.map((e) => e.title), 'B.S. in Computer Science']
    for (const t of titles) expect(html, t).toContain(escape(t))
    expect(html.match(/<li class="rise-in border-b/g)).toHaveLength(titles.length)
    expect(html.indexOf('Online Creative Solutions')).toBeLessThan(html.indexOf('Bicol University'))
    expect(html).toContain('November 2024 – Present')
  })

  it('keeps every responsibility in the server HTML: the first shown, the rest in a native disclosure', () => {
    for (const e of experience) for (const r of e.responsibilities) expect(html, r).toContain(escape(r))
    expect(html).toContain('<details class="more">')
    expect(html).toContain(sectionContent.timeline.less)
    expect(html).not.toContain('<details open')
  })
})

describe('CaseStudyList', () => {
  const html = renderToStaticMarkup(<CaseStudyList />)

  it('is the #journals section with its heading from data and the count of studies', () => {
    expect(html).toMatch(/^<section id="journals" aria-labelledby="journals-title"/)
    expect(html).toMatch(new RegExp(`<h2 id="journals-title" class="text-list text-ink">${escape(sectionContent.journals.title)}</h2>`))
    expect(html).toContain(`<span class="tabular text-sm text-muted">${FLAGSHIP_SLUGS.length}</span>`)
  })

  it('lists a row for every case study, in reading order, with the brief’s first sentence', () => {
    expect(FLAGSHIP_SLUGS).toHaveLength(4)
    let last = -1
    for (const slug of FLAGSHIP_SLUGS) {
      const at = html.indexOf(`href="/projects/${slug}"`)
      expect(at, slug).toBeGreaterThan(last)
      last = at
      expect(html).toContain(escape(briefLead(getCaseStudy(slug)!)))
    }
    expect(html.match(/<li id="plate-/g)).toHaveLength(FLAGSHIP_SLUGS.length)
  })

  it('names each row by its visible text (WCAG 2.5.3): the h3 inside one link, no aria-label', () => {
    for (const slug of FLAGSHIP_SLUGS) {
      const project = projects.find((p) => p.slug === slug)!
      const start = html.indexOf(`href="/projects/${slug}"`)
      const link = html.slice(html.lastIndexOf('<a ', start), html.indexOf('</a>', start))
      expect(link, slug).not.toMatch(/aria-labelledby|aria-label=/)
      expect(link, slug).toMatch(new RegExp(`<h3 class="[^"]*">${escape(project.title)}</h3>`))
    }
  })
})

describe('WorkList', () => {
  const html = renderToStaticMarkup(<WorkList />)
  const rowSlugs = Array.from(html.matchAll(/<li id="plate-([a-z0-9-]+)"/g)).map((m) => m[1])

  it('is the #work section with its heading from data', () => {
    expect(html).toMatch(/^<section id="work" aria-labelledby="work-title"/)
    expect(html).toMatch(new RegExp(`<h2 id="work-title" class="text-list text-ink">${escape(sectionContent.work.title)}</h2>`))
  })

  it('shows at most six rows, none a case study, an in-development project or a custom system', () => {
    expect(MORE_ROWS).toBe(6)
    expect(rowSlugs).toHaveLength(MORE_ROWS)
    for (const slug of rowSlugs) {
      const p = projects.find((x) => x.slug === slug)!
      expect(FLAGSHIP_SLUGS, slug).not.toContain(slug)
      expect(p.status, slug).not.toBe('in-development')
      expect(p.band, slug).not.toBe('Custom systems')
    }
  })

  it('leads on to every project: a secondary button to /projects', () => {
    expect(html).toContain(`<a class="press button-secondary" href="/projects">${sectionContent.work.cta}`)
  })
})

describe('Places', () => {
  const html = renderToStaticMarkup(<Places />)
  const groups = placeGroups(projects)

  it('is the #places section with its heading from data and the count of places', () => {
    expect(html).toMatch(/^<section id="places" aria-labelledby="places-title"/)
    expect(html).toMatch(new RegExp(`<h2 id="places-title" class="text-list text-ink">${escape(sectionContent.fieldMap.title)}</h2>`))
    expect(html).toContain(`<span class="tabular text-sm text-muted">${groups.length}</span>`)
  })

  it('pins every place as a link to its first project’s page, hidden from the keyboard and screen readers', () => {
    expect(html.match(/<a href="\/projects\/[^"]+" tabindex="-1" aria-hidden="true" class="map-pin">/g)).toHaveLength(groups.length)
    for (const g of groups) expect(html, g.name).toContain(`<a href="/projects/${g.projects[0].slug}" tabindex="-1" aria-hidden="true" class="map-pin">`)
  })

  it('lists each place with its projects as links, the way in for keyboard and screen readers', () => {
    for (const g of groups) {
      expect(html, g.name).toContain(`<span class="text-row">${escape(g.name)}</span>`)
      for (const p of g.projects) expect(html, p.slug).toContain(`href="/projects/${p.slug}"`)
    }
  })

  it('names the map’s rule and its key, and pins nothing for a project without a place', () => {
    expect(html).toContain(escape(sectionContent.fieldMap.caption))
    expect(html).toContain(sectionContent.fieldMap.key.city)
    expect(html).toContain(sectionContent.fieldMap.key.region)
    for (const p of projects.filter((x) => !x.place)) {
      expect(html, p.slug).not.toContain(`<a href="/projects/${p.slug}" tabindex="-1"`)
    }
  })
})

describe('WorkWithMe', () => {
  const html = renderToStaticMarkup(<WorkWithMe />)
  const { fork } = sectionContent

  it('is the #fork section with its heading from data, no eyebrow', () => {
    expect(html).toMatch(/^<section id="fork" aria-labelledby="fork-title"/)
    expect(html).not.toContain('class="eyebrow')
    expect(html).toMatch(new RegExp(`<h2 id="fork-title" class="text-list text-ink">${escape(fork.title)}</h2>`))
  })

  it('offers two rows, business first: /services, then /hire', () => {
    expect(html.indexOf('href="/services"')).toBeGreaterThan(-1)
    expect(html.indexOf('href="/services"')).toBeLessThan(html.indexOf('href="/hire"'))
    expect(html).toContain(`>${fork.business.title}</h3>`)
    expect(html).toContain(`>${fork.team.title}</h3>`)
    expect(html).toContain(escape(fork.business.body))
    expect(html).toContain(escape(fork.team.body))
  })

  it('names every payment gateway on the business path, from the data', () => {
    for (const g of paymentGateways) expect(fork.business.body).toContain(g)
  })

  it('links each of the three services as a chip', () => {
    expect(servicePages).toHaveLength(3)
    for (const s of servicePages) expect(html).toContain(`<a class="press chip" href="/services/${s.slug}">${escape(s.name)}</a>`)
  })
})

describe('StackTable', () => {
  const html = renderToStaticMarkup(<StackTable />)

  it('is the #stack section, a definition list with a row per category and one for the gateways', () => {
    expect(html).toMatch(/^<section id="stack" aria-labelledby="stack-title"/)
    expect(html).toContain('<dl>')
    expect(html).toContain(`>${sectionContent.stack.gateways}</dt>`)
    for (const g of paymentGateways) expect(html).toContain(g)
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

  it('takes its heading and copy from data, no eyebrow', () => {
    expect(html).not.toContain('class="eyebrow')
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

  // F8 (finish review): ink, unadorned links read as the text around them (WCAG 1.4.1).
  it('underlines the email, résumé and Facebook links, the rule turning ink on hover and focus', () => {
    const links = Array.from(html.matchAll(/<a href="([^"]*)"[^>]*class="([^"]*)"/g)).filter(([, href]) =>
      /^mailto:|\.pdf$|facebook\.com/.test(href),
    )
    expect(links).toHaveLength(3)
    for (const [, href, cls] of links) {
      for (const c of ['underline', 'decoration-line-strong', 'hover:decoration-ink', 'focus-visible:decoration-ink']) {
        expect(cls.split(' '), href).toContain(c)
      }
    }
    expect(html).not.toMatch(/<a href="mailto:[^>]*><span class="link-draw"/)
  })

  // One column now: the form sits on a pane of glass of its own, under the copy.
  it('sets the form on a glass plate, not boxed in a panel colour', () => {
    expect(html).toMatch(/<div class="survey-plate glass [^"]*"><form/)
    expect(html).not.toContain('bg-panel')
  })
})

describe('proof renders visible without JavaScript', () => {
  it.each(SECTIONS)('%s ships no opacity:0 entrance', (_name, node) => {
    expect(renderToStaticMarkup(node)).not.toMatch(/opacity:\s*0/)
  })
})

describe('HomePage', () => {
  const html = renderToStaticMarkup(
    <ToastProvider>
      <HomePage />
    </ToastProvider>,
  )

  it('runs the nine sections in the direction contract’s order', () => {
    const ids = Array.from(html.matchAll(/<section id="([^"]+)"/g)).map((m) => m[1])
    expect(ids).toEqual(['top', 'building', 'timeline', 'journals', 'work', 'places', 'fork', 'stack', 'contact'])
  })

  it('has one h1', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
  })

  it('points every labelled section at a heading that exists', () => {
    const labelled = Array.from(html.matchAll(/<section id="([^"]+)" aria-labelledby="([^"]+)"/g))
    expect(labelled.length).toBeGreaterThanOrEqual(8)
    for (const [, id, heading] of labelled) expect(html, id).toContain(`id="${heading}"`)
  })

  it('shows all the work in the server HTML: the experience, the case studies, the places and the stack', () => {
    for (const e of experience) expect(html).toContain(escape(e.title))
    for (const slug of FLAGSHIP_SLUGS) expect(html, slug).toContain(`href="/projects/${slug}"`)
    for (const g of placeGroups(projects)) expect(html, g.name).toContain(escape(g.name))
    for (const g of paymentGateways) expect(html).toContain(g)
  })

  it('links the in-development project, every pinned project and the services', () => {
    expect(html).toContain('href="/projects/iskotify"')
    for (const p of placeGroups(projects).flatMap((g) => g.projects)) expect(html, p.slug).toContain(`href="/projects/${p.slug}"`)
    for (const s of servicePages) expect(html).toContain(`href="/services/${s.slug}"`)
  })

  it('keeps two primary buttons: the intro’s and the form’s', () => {
    expect(html.match(/class="press button-primary/g)).toHaveLength(2)
  })

  it('draws nothing of the retired world: no trail, contours, plates, catalog codes or strip', () => {
    for (const gone of ['trail-draw', 'contour-field', 'trailhead-contours', 'survey-plate lift-card', 'elevation', 'reveal-cover', 'trailhead', 'lift-card']) {
      expect(html, gone).not.toContain(gone)
    }
    expect(html).not.toMatch(/\d{1,2} \/ \d{1,2} · /)
    expect(existsSync('components/sections/own-products.tsx')).toBe(false)
  })

  it('ships no opacity:0 entrance', () => {
    expect(html).not.toMatch(/opacity:\s*0/)
  })

  it('shows the public email and no phone', () => {
    expect(html).toContain(`mailto:${contactInfo.email}`)
    expect(html).not.toMatch(/tel:|\+63|\b09\d{9}\b/)
  })
})
