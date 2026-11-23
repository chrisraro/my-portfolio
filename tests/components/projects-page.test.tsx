import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import ProjectsPage from '@/app/projects/page'
import { bandSlug, groupByBand } from '@/lib/board'
import { ctaLabels, projects, projectsPageContent, sectionContent } from '@/lib/data'
import { project as toMap } from '@/lib/geo'
import { panTo } from '@/lib/map-pan'
import { placeGroups, unplacedProjects } from '@/lib/places'
import { fullShotFor, hasFullShot } from '@/lib/project-page'
import { BAND_ORDER, type Project } from '@/types'

// /projects is the whole inventory as a list of rows and a map of the same
// data, filtered by band with ?band=. Server-rendered, plain links.
const render = (band?: string) => renderToStaticMarkup(ProjectsPage({ searchParams: band ? { band } : {} }))
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')
const rowsOf = (html: string) => html.match(/<li id="plate-[\s\S]*?<\/li>/g) ?? []
const mapOf = (html: string) => html.slice(html.indexOf('<figure'), html.indexOf('</figure>'))

describe('/projects: the list', () => {
  const html = render()
  const rows = rowsOf(html)
  const rowFor = (p: Project) => rows.find((c) => c.startsWith(`<li id="plate-${p.slug}"`)) ?? ''

  it('loads the first four rows of the first band at once and every other thumbnail lazily', () => {
    const first = groupByBand(projects, hasFullShot)[0].projects.slice(0, 4)
    for (const p of projects) {
      const row = rowFor(p)
      if (!row.includes('<img')) continue
      if (first.includes(p)) expect(row, p.slug).toContain('loading="eager"')
      else {
        expect(row, p.slug).toContain('loading="lazy"')
        expect(row, p.slug).not.toContain('loading="eager"')
      }
    }
    expect(rows.filter((c) => c.includes('<img')).length).toBeGreaterThan(0)
  })

  it('takes its heading from lib/data.ts, with one h1 and no eyebrow over it', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain(`>${projectsPageContent.title}</h1>`)
    expect(html).toContain(`>${projectsPageContent.description}</p>`)
    expect(html).not.toContain('class="eyebrow')
  })

  it('names the band in the h1 when filtered', () => {
    expect(render('sites')).toContain('>Sites</h1>')
    expect(render('sites')).not.toContain(`>${projectsPageContent.title}</h1>`)
  })

  it('shows every project once, as a row that is one link to its page, in the same tab', () => {
    expect(rows).toHaveLength(projects.length)
    for (const p of projects) {
      const row = rowFor(p)
      expect(row, p.slug).toContain(`>${escape(p.title)}</h3>`)
      expect(row.match(/<a /g), p.slug).toHaveLength(1)
      expect(row, p.slug).toContain(`href="/projects/${p.slug}"`)
      expect(row, p.slug).not.toContain('target="_blank"')
    }
    expect(html).not.toContain('href="#"')
  })

  it('names each band as an h2, in BAND_ORDER (three bands), with its count', () => {
    expect([...BAND_ORDER]).toEqual(['Custom systems', 'Applications', 'Sites'])
    const at = BAND_ORDER.map((band) => html.search(new RegExp(`<h2 [^>]*>${band}<`)))
    for (const i of at) expect(i).toBeGreaterThan(-1)
    expect(at.slice().sort((a, b) => a - b)).toEqual(at)
    for (const band of BAND_ORDER) {
      expect(html).toContain(`>${band}<span class="tabular text-sm font-normal text-muted">${projects.filter((p) => p.band === band).length}</span></h2>`)
    }
    expect(html).not.toMatch(/<h2 [^>]*>Products</)
  })

  it('sets each band name at the list step under the page’s h1', () => {
    for (const band of BAND_ORDER) {
      expect(html).toMatch(new RegExp(`<h2 id="band-[a-z-]+" class="text-list [^"]*">${band}<`))
    }
    expect(html).not.toMatch(/<h2 [^>]*class="map-label/)
  })

  it('always states the status in words, through StatusBadge', () => {
    for (const p of projects) {
      expect(rowFor(p), p.slug).toContain('data-status=')
      expect(rowFor(p), p.slug).toMatch(/>(Live|In development|Private|Internal|Staging)</)
    }
    for (const p of projects.filter((x) => x.status === 'staging')) expect(rowFor(p)).toContain('>Staging<')
    for (const p of projects.filter((x) => x.status === 'in-development')) {
      expect(rowFor(p)).toContain('>In development<')
      expect(rowFor(p)).not.toContain('bg-live')
    }
  })

  it('stands every row at one scale: a thumbnail of the top of the site, or a lock in the same frame', () => {
    for (const p of projects) {
      const row = rowFor(p)
      expect(row, p.slug).toContain('thumb relative block aspect-[8/5]')
      if (fullShotFor(p) || p.image) expect(row, p.slug).toContain('<img')
      else expect(row, p.slug).not.toContain('<img')
    }
    expect(html).not.toMatch(/aspect-square|aspect-\[9\/16\]|aspect-\[3\/4\]/)
    expect(html).not.toContain('—')
  })

  it('numbers nothing: the catalog codes are gone from the screen', () => {
    expect(html).not.toMatch(/\d{1,2} \/ \d{1,2} · /)
  })

  it('shows each project’s one-line summary on its row', () => {
    for (const p of projects) expect(rowFor(p), p.slug).toContain(escape(p.summary))
  })

  it('offers one Start a project after the list, and the way home', () => {
    expect(html.match(/href="\/#contact"/g)).toHaveLength(1)
    expect(html.indexOf('href="/#contact"')).toBeGreaterThan(html.lastIndexOf('<li id="plate-'))
    expect(html).toContain(`<span class="link-draw">${ctaLabels.backHome}</span>`)
  })

  it('never defers a band', () => {
    expect(html).not.toMatch(/defer-render/)
  })

  it('counts what is shipped against what is in progress', () => {
    expect(html).toContain('15 projects · 14 shipped, 1 in progress')
    expect(html).not.toMatch(/in staging/)
  })
})

describe('/projects: the map', () => {
  const html = render()
  const figure = mapOf(html)
  const groups = placeGroups(projects)

  it('pins every verified place, each pin jumping to its first project’s row in the list', () => {
    for (const g of groups) {
      expect(figure, g.name).toContain(`<a href="#plate-${g.projects[0].slug}" tabindex="-1" aria-hidden="true" class="map-pin">`)
      expect(html, g.name).toContain(`<li id="plate-${g.projects[0].slug}"`)
    }
    expect(figure.match(/<a /g)).toHaveLength(groups.length)
  })

  it('never pins a project without a verified place, and says how many are list-only', () => {
    for (const p of unplacedProjects(projects)) expect(figure, p.slug).not.toContain(`#plate-${p.slug}"`)
    const note = projectsPageContent.unpinned.replace('{count}', String(unplacedProjects(projects).length))
    expect(html).toContain(escape(note))
    expect(html).toContain(escape(sectionContent.fieldMap.caption))
  })

  it('rests on the whole map when nothing is filtered', () => {
    expect(html).toContain('class="map-pan" style="--pan-x:0%;--pan-y:0%;--pan-s:1"')
  })

  it('stands beside the list from 1280px, stuck under the page’s top, in a clipping frame', () => {
    expect(html).toContain('xl:grid-cols-[1fr_15rem]')
    expect(figure).toContain('xl:sticky')
    expect(figure).toContain('<div class="overflow-hidden rounded">')
    expect(html.indexOf('<figure')).toBeGreaterThan(html.lastIndexOf('<li id="plate-') - 1)
    expect(html).not.toContain('survey-plate')
  })

  it('keeps trail red to the current legend key; the primary button carries its own', () => {
    const current = html.match(/<a [^>]*aria-current="true"[^>]*>[\s\S]*?<\/a>/)?.[0] ?? ''
    expect(current).toContain('bg-trail')
    expect(html.replace(current, '')).not.toMatch(/\b(?:bg|text|border|fill|stroke)-trail\b/)
  })
})

describe('/projects filter', () => {
  it('filters both views on the server', () => {
    for (const band of BAND_ORDER) {
      const html = render(bandSlug(band))
      const inBand = projects.filter((p) => p.band === band)
      expect(rowsOf(html), band).toHaveLength(inBand.length)
      for (const p of inBand) expect(html, p.slug).toContain(`<li id="plate-${p.slug}"`)
      const groups = placeGroups(inBand)
      expect(mapOf(html).match(/<a /g)?.length ?? 0, band).toBe(groups.length)
    }
  })

  it('counts a filtered view against the whole inventory', () => {
    for (const band of BAND_ORDER) {
      const inBand = projects.filter((p) => p.band === band)
      expect(render(bandSlug(band))).toContain(`${inBand.length} of ${projects.length} projects`)
    }
  })

  it('pans the map to the band’s pins', () => {
    for (const band of BAND_ORDER) {
      const pan = panTo(placeGroups(projects.filter((p) => p.band === band)).map((g) => toMap(g.lat, g.lng)))
      expect(render(bandSlug(band)), band).toContain(`class="map-pan" style="--pan-x:${pan.x}%;--pan-y:${pan.y}%;--pan-s:${pan.scale}"`)
    }
  })

  it('marks the current key with aria-current, as plain links, one key per band and one for all', () => {
    const tag = (html: string, href: string) => html.match(new RegExp(`<a [^>]*href="${href.replace('?', '\\?')}"[^>]*>`))?.[0] ?? ''
    const sites = render('sites')
    expect(tag(sites, '/projects?band=sites')).toContain('aria-current="true"')
    expect(tag(sites, '/projects')).not.toContain('aria-current')
    expect(tag(render(), '/projects')).toContain('aria-current="true"')
    for (const band of BAND_ORDER) expect(tag(render(), `/projects?band=${bandSlug(band)}`), band).not.toBe('')
    expect(render()).not.toContain('band=products')
  })

  it('sets the keys in one pane of glass, 44px tall', () => {
    const nav = render().match(/<nav aria-label="Filter projects by band">[\s\S]*?<\/nav>/)?.[0] ?? ''
    expect(nav).toContain('class="glass ')
    expect(nav.match(/min-h-\[44px\]/g)).toHaveLength(BAND_ORDER.length + 1)
  })

  it('ships no client code of its own', () => {
    expect(readFileSync('app/projects/page.tsx', 'utf8')).not.toContain("'use client'")
    expect(readFileSync('components/ui/legend-filter.tsx', 'utf8')).not.toContain("'use client'")
    expect(readFileSync('components/ui/project-row.tsx', 'utf8')).not.toContain("'use client'")
  })
})
