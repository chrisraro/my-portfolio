import { readFileSync } from 'node:fs'
import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ElevationStrip } from '@/components/sections/elevation-strip'
import { Fork } from '@/components/sections/fork'
import { Trailhead } from '@/components/sections/trailhead'
import { heroContent, navigationItems, paymentGateways, resumeUrl, sectionContent } from '@/lib/data'
import { buildElevationStrip, elevationFigures } from '@/lib/elevation'
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

  it('sets the portrait on a survey plate inside the lightbox, named once', () => {
    expect(html).toMatch(new RegExp(`<button type="button" aria-label="View larger image: ${heroContent.portraitAlt}" class="[^"]*survey-plate`))
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
