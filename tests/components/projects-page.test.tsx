import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import ProjectsPage from '@/app/projects/page'
import { noPreviewCopy } from '@/components/ui/no-preview-tag'
import { bandSlug } from '@/lib/board'
import { ctaLabels, projects, projectsPageContent, sectionContent } from '@/lib/data'
import { project as toMap } from '@/lib/geo'
import { panTo } from '@/lib/map-pan'
import { placeGroups, unplacedProjects } from '@/lib/places'
import { canLinkLive, fullShotFor } from '@/lib/project-page'
import { extractDomain } from '@/lib/utils'
import { BAND_ORDER, type Project } from '@/types'

// Spec §5: /projects is the whole inventory as a map and a list of the same
// data, filtered by band with ?band=. Server-rendered, plain links.
const render = (band?: string) => renderToStaticMarkup(ProjectsPage({ searchParams: band ? { band } : {} }))
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')
const platesOf = (html: string) => html.match(/<li id="plate-[\s\S]*?<\/li>/g) ?? []
const mapOf = (html: string) => html.slice(html.indexOf('<svg'), html.indexOf('</svg>'))

describe('/projects: the list', () => {
  const html = render()
  const plates = platesOf(html)
  const plateFor = (p: Project) => plates.find((c) => c.startsWith(`<li id="plate-${p.slug}"`)) ?? ''

  it('loads the first row of the first band at once and the rest lazily', () => {
    const first = plates.slice(0, 2)
    for (const plate of first) {
      expect(plate).toContain('loading="eager"')
      expect(plate).not.toContain('loading="lazy"')
    }
    const withShot = plates.slice(2).filter((c) => c.includes('<img'))
    expect(withShot.length).toBeGreaterThan(0)
    for (const plate of withShot) expect(plate).toContain('loading="lazy"')
  })

  it('takes its heading from lib/data.ts, with one h1', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain(`>${projectsPageContent.title}</h1>`)
    expect(html).toContain(`>${projectsPageContent.eyebrow}</p>`)
  })

  it('shows every project once, as a plate that is one link to its page, in the same tab', () => {
    expect(plates).toHaveLength(projects.length)
    for (const p of projects) {
      const plate = plateFor(p)
      expect(plate, p.slug).toContain(`>${escape(p.title)}</h3>`)
      expect(plate.match(/<a /g), p.slug).toHaveLength(1)
      expect(plate, p.slug).toContain(`href="/projects/${p.slug}"`)
      expect(plate, p.slug).not.toContain('target="_blank"')
    }
    expect(html).not.toContain('href="#"')
  })

  it('names each band as an h2, in BAND_ORDER, with its count', () => {
    const at = BAND_ORDER.map((band) => html.search(new RegExp(`<h2 [^>]*>${band}<`)))
    for (const i of at) expect(i).toBeGreaterThan(-1)
    expect(at.slice().sort((a, b) => a - b)).toEqual(at)
    for (const band of BAND_ORDER) {
      expect(html).toContain(`>${band}<span class="tabular text-muted"> · ${projects.filter((p) => p.band === band).length}</span></h2>`)
    }
  })

  // F7 (finish review): 13px band names under an 80px h1 jumped from display to caption.
  it('sets each band name at the title step, not as a caption', () => {
    for (const band of BAND_ORDER) {
      expect(html).toMatch(new RegExp(`<h2 [^>]*class="text-title mb-5 text-ink">${band}<`))
    }
    expect(html).not.toMatch(/<h2 [^>]*class="map-label/)
  })

  it('always states the status in words, through StatusBadge', () => {
    for (const p of projects) {
      expect(plateFor(p), p.slug).toContain('data-status=')
      expect(plateFor(p), p.slug).toMatch(/>(Live|Early access|Private|Internal|Staging)</)
    }
    for (const p of projects.filter((x) => x.status === 'staging')) expect(plateFor(p)).toContain('>Staging<')
  })

  it('shows the domain, or says plainly there is none, out of the link name', () => {
    for (const p of projects) {
      const label = canLinkLive(p) && p.links.live ? extractDomain(p.links.live) : 'no public URL'
      expect(plateFor(p), p.slug).toMatch(new RegExp(`<span aria-hidden="true" class="[^"]*">${label.replace(/\./g, '\\.')}</span>`))
    }
    expect(html).not.toContain('—')
  })

  it('stands every plate at one scale: a 3:4 still, or the printed reason in the same 3:4 frame', () => {
    for (const p of projects) {
      const plate = plateFor(p)
      expect(plate, p.slug).toContain('aspect-[3/4]')
      if (fullShotFor(p)) expect(plate, p.slug).toContain('project-shot__frame')
      else expect(plate, p.slug).toContain(escape(noPreviewCopy(p)))
    }
    expect(html).not.toMatch(/aspect-square|aspect-\[9\/16\]/)
  })

  it('numbers the plates as one strip over the whole inventory', () => {
    const codes = html.match(/\d{2} \/ \d{2} · /g) ?? []
    expect(codes).toHaveLength(projects.length)
    expect(new Set(codes).size).toBe(projects.length)
  })

  it('shows each project one-line summary on its plate', () => {
    for (const p of projects) expect(plateFor(p), p.slug).toContain(escape(p.summary))
  })

  it('offers one Start a project after the list, and the way home', () => {
    expect(html.match(/href="\/#contact"/g)).toHaveLength(1)
    expect(html.indexOf('href="/#contact"')).toBeGreaterThan(html.lastIndexOf('<li id="plate-'))
    expect(html).toContain(`<span class="link-draw">${ctaLabels.backHome}</span>`)
  })

  it('never defers a band: a lifted plate’s shadow would be clipped', () => {
    expect(html).not.toMatch(/defer-render/)
  })
})

describe('/projects: the map', () => {
  const html = render()
  const svg = mapOf(html)
  const groups = placeGroups(projects)

  it('pins every verified place, each pin jumping to its first project’s plate in the list', () => {
    for (const g of groups) {
      expect(svg, g.name).toContain(`<a href="#plate-${g.projects[0].slug}" tabindex="-1" aria-hidden="true" class="map-pin">`)
      expect(html, g.name).toContain(`<li id="plate-${g.projects[0].slug}"`)
    }
    expect(svg.match(/<a /g)).toHaveLength(groups.length)
  })

  it('never pins a project without a verified place, and says how many are list-only', () => {
    for (const p of unplacedProjects(projects)) expect(svg, p.slug).not.toContain(`#plate-${p.slug}"`)
    const note = projectsPageContent.unpinned.replace('{count}', String(unplacedProjects(projects).length))
    expect(html).toContain(escape(note))
    expect(html).toContain(escape(sectionContent.fieldMap.caption))
  })

  it('rests on the whole map when nothing is filtered', () => {
    expect(html).toContain('class="map-pan" style="--pan-x:0%;--pan-y:0%;--pan-s:1"')
  })

  it('sits on a survey plate before the list', () => {
    expect(html.indexOf('<figure class="survey-plate')).toBeGreaterThan(-1)
    expect(html.indexOf('<figure class="survey-plate')).toBeLessThan(html.indexOf('<li id="plate-'))
  })

  it('keeps trail red to the current legend key; the primary button carries its own', () => {
    const current = html.match(/<a [^>]*aria-current="true"[^>]*>[\s\S]*?<\/a>/)?.[0] ?? ''
    expect(current).toContain('bg-trail')
    expect(html.replace(current, '')).not.toMatch(/\b(?:bg|text|border|fill|stroke)-trail\b/)
  })
})

describe('/projects filter', () => {
  it('filters both views on the server, keeping each plate its unfiltered number', () => {
    const all = render()
    for (const band of BAND_ORDER) {
      const html = render(bandSlug(band))
      const inBand = projects.filter((p) => p.band === band)
      expect(platesOf(html), band).toHaveLength(inBand.length)
      for (const p of inBand) {
        const code = (s: string) => s.match(new RegExp(`(\\d{2} / \\d{2} · ${band})[\\s\\S]{0,600}?>${escape(p.title)}<`))?.[1]
        expect(code(all), p.slug).toBeDefined()
        expect(code(html), p.slug).toBe(code(all))
      }
      const groups = placeGroups(inBand)
      expect(mapOf(html).match(/<a /g)?.length ?? 0, band).toBe(groups.length)
    }
  })

  it('pans the map to the band’s pins', () => {
    for (const band of BAND_ORDER) {
      const pan = panTo(placeGroups(projects.filter((p) => p.band === band)).map((g) => toMap(g.lat, g.lng)))
      expect(render(bandSlug(band)), band).toContain(`class="map-pan" style="--pan-x:${pan.x}%;--pan-y:${pan.y}%;--pan-s:${pan.scale}"`)
    }
  })

  it('marks the current key with aria-current, as plain links', () => {
    const tag = (html: string, href: string) => html.match(new RegExp(`<a [^>]*href="${href.replace('?', '\\?')}"[^>]*>`))?.[0] ?? ''
    const sites = render('sites')
    expect(tag(sites, '/projects?band=sites')).toContain('aria-current="true"')
    expect(tag(sites, '/projects')).not.toContain('aria-current')
    expect(tag(render(), '/projects')).toContain('aria-current="true"')
  })

  it('ships no client code of its own', () => {
    expect(readFileSync('app/projects/page.tsx', 'utf8')).not.toContain("'use client'")
    expect(readFileSync('components/ui/legend-filter.tsx', 'utf8')).not.toContain("'use client'")
    expect(readFileSync('components/ui/project-plate.tsx', 'utf8')).not.toContain("'use client'")
  })
})
