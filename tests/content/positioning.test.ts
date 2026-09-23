import { describe, expect, it } from 'vitest'
import { buildPortfolioContext } from '@/lib/chat-context'
import {
  availability,
  heroContent,
  navigationItems,
  projects,
  resumeUrl,
  sectionContent,
  skills,
} from '@/lib/data'
import { displayStatus } from '@/lib/display-status'
import { buildSiteMetadata } from '@/lib/site-metadata'
import { existsSync } from 'node:fs'

const sites = projects.filter((p) => p.band === 'Sites')

describe('positioning', () => {
  it('leads with the full-stack title', () => {
    expect(heroContent.title).toBe('Full-stack developer')
  })

  it('names the verticals in the lede and keeps the products, with no em-dash', () => {
    expect(heroContent.lede).toBe(
      'I build websites for hotels, tour operators and restaurants, with online booking and payments where they need them, plus products of my own.',
    )
    expect(heroContent.lede).not.toContain('—')
    expect(heroContent.specialism).not.toContain('—')
  })

  it('states the same number of live sites as the Sites band holds', () => {
    const claimed = Number(heroContent.specialism.match(/^(\d+) live sites · /)?.[1])
    expect(claimed).toBe(sites.length)
  })

  it('calls the sites live only because every one of them displays as live', () => {
    for (const site of sites) expect(displayStatus(site.status), site.slug).toBe('live')
  })

  // Pinned, so the line cannot drift silently: re-sectoring any site fails
  // here even when the four-sector list would happen to read the same.
  it('derives the sector list from the sectors the Sites band actually holds', () => {
    expect(sites.map((p) => `${p.id}: ${p.sector}`)).toEqual([
      'graceland: restaurant',
      'elnido: tours',
      'beachbus: tours',
      'upcat-review-plus: review-centre',
      'acad1: review-centre',
      'downtown-district-hotel: hotel',
      'azalea-baguio: hotel',
      'azalea-boracay: hotel',
      'aralabroad: education',
    ])
    expect(heroContent.specialism).toBe(`${sites.length} live sites · hotels, tours, restaurants, review centres`)
    expect(heroContent.specialism).toBe('9 live sites · hotels, tours, restaurants, review centres')
  })

  it('only names stack chips that exist in the skills list', () => {
    const ids = skills.map((s) => s.id)
    for (const id of heroContent.stack) expect(ids).toContain(id)
  })

  it('states availability and gives it to the assistant', () => {
    expect(availability.trim()).not.toBe('')
    const context = buildPortfolioContext()
    expect(context).toContain(availability)
    expect(context).toContain(heroContent.specialism)
  })

  it('points the résumé link at a file that exists', () => {
    expect(existsSync(`public${resumeUrl}`)).toBe(true)
  })

  it('gives every section a heading', () => {
    for (const section of Object.values(sectionContent)) {
      expect(section.eyebrow.startsWith('// ')).toBe(true)
      expect(section.title.trim()).not.toBe('')
    }
  })

  it('navigates to the work, the full project list, experience and contact', () => {
    expect(navigationItems.map((n) => n.href)).toEqual(['#work', '/projects', '#changelog', '#contact'])
  })
})

describe('site metadata', () => {
  const metadata = buildSiteMetadata('https://example.test')
  const serialized = JSON.stringify(metadata)

  it('titles the site with the current positioning', () => {
    expect(String(metadata.title)).toContain(heroContent.title)
    expect(metadata.description).toBe(heroContent.lede)
  })

  it('no longer calls Christian a software engineer or frontend developer', () => {
    expect(serialized).not.toMatch(/software engineer/i)
    expect(serialized).not.toMatch(/frontend developer/i)
  })

  it('leaves the preview image to app/opengraph-image.tsx, not the retired PNG', () => {
    expect(serialized).not.toContain('og-image.png')
    expect(existsSync('app/opengraph-image.tsx')).toBe(true)
  })
})
