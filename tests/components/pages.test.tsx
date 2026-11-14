import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ClientWork } from '@/components/sections/client-work'
import { Editorials } from '@/components/sections/editorials'
import { Experience } from '@/components/sections/experience'
import { Featured } from '@/components/sections/featured'
import { FieldNotes } from '@/components/sections/field-notes'
import { GithubActivityPanel } from '@/components/sections/github-activity'
import { Hero } from '@/components/sections/hero'
import { Stack } from '@/components/sections/stack'
import { SiteNav } from '@/components/site-nav'
import { TabBar } from '@/components/tab-bar'
import { FLAGSHIP_SLUGS } from '@/lib/case-studies'
import { availability, education, experience, galleryImages, heroContent, heroPortraits, navigationItems, projects, recommendations, skills } from '@/lib/data'
import { shapeActivity } from '@/lib/github'
import { githubPayload } from '../helpers/github-fixture'

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')

describe('Hero', () => {
  const html = renderToStaticMarkup(<Hero />)

  it('sets the title as the H1, with the lede, specialism and availability', () => {
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? ''
    expect(h1.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).toBe(heroContent.title)
    expect(html).toContain(escape(heroContent.lede))
    expect(html).toContain(heroContent.specialism)
    expect(html).toContain(availability)
  })

  it('shows the chosen portrait, described', () => {
    const portrait = heroPortraits[heroContent.portrait]
    expect(html).toContain(encodeURIComponent(portrait.cutout))
    expect(html).toContain(`alt="${portrait.alt}"`)
  })

  it('reads each proof point as its sentence', () => {
    for (const point of heroContent.proofPoints) expect(html).toContain(`<span class="sr-only">${point}</span>`)
  })

  it('leads with Start a project', () => {
    expect(html).toMatch(/<a href="#contact" class="btn btn-primary">Start a project/)
  })
})

describe('the homepage catalogue', () => {
  const html = renderToStaticMarkup(
    <>
      <Featured />
      <ClientWork />
    </>,
  )

  it('links every product, and the client work that leads the grid, to its page', () => {
    for (const p of projects.filter((p) => p.band === 'Products')) expect(html).toContain(`href="/projects/${p.slug}"`)
    expect(html).toContain('href="/projects"')
  })

  it('shows status as a glyph and a word, never colour alone', () => {
    expect(html.match(/data-status="/g)?.length).toBeGreaterThanOrEqual(4)
    expect(html).toContain('>Live<')
  })

  it('offers the filter as pressed buttons with counts', () => {
    expect(html).toMatch(/<button type="button" aria-pressed="true"[^>]*>(?:(?!<\/button>)[\s\S])*All/)
    expect(html).toContain('aria-label="Filter client work by type"')
  })
})

describe('sections', () => {
  it('opens every flagship case study from the shelf', () => {
    const html = renderToStaticMarkup(<Editorials />)
    for (const slug of FLAGSHIP_SLUGS) expect(html).toContain(`href="/projects/${slug}"`)
  })

  it('attributes every testimonial and captions every photo', () => {
    const html = renderToStaticMarkup(<FieldNotes />)
    for (const rec of recommendations) expect(html).toContain(escape(rec.authorName))
    for (const image of galleryImages) expect(html).toContain(escape(image.caption))
  })

  it('lists every role, degree and skill', () => {
    const html = renderToStaticMarkup(
      <>
        <Experience />
        <Stack />
      </>,
    )
    for (const role of experience) expect(html).toContain(escape(role.company))
    for (const degree of education) expect(html).toContain(escape(degree.school))
    for (const skill of skills) expect(html).toContain(`>${escape(skill.name)}<`)
  })

  it('draws the GitHub calendar in monochrome, named in words', () => {
    const activity = shapeActivity(githubPayload(), 'chrisraro', 'https://github.com/chrisraro')!
    const html = renderToStaticMarkup(<GithubActivityPanel activity={activity} />)
    expect(html).toMatch(/role="img" aria-label="[\d,]+ contributions in the last year, on [\d,]+ active days"/)
    expect(html).toContain('href="https://github.com/chrisraro"')
  })
})

describe('navigation', () => {
  it('reaches every destination from the bar, and from the tab bar on a phone', () => {
    const bar = renderToStaticMarkup(<SiteNav />)
    for (const item of navigationItems) expect(bar).toContain(`>${item.label}<`)
    expect(bar).toContain('href="/#contact"')
    const tabs = renderToStaticMarkup(<TabBar />)
    expect(tabs).toContain('href="/projects"')
    expect(tabs).toContain('href="/#contact"')
  })
})
