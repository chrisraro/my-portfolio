import { describe, expect, it } from 'vitest'
import { buildPortfolioContext } from '@/lib/chat-context'
import {
  availability,
  heroContent,
  navigationItems,
  projects,
  resumeUrl,
  sectionContent,
} from '@/lib/data'
import { displayStatus } from '@/lib/display-status'
import { buildSiteMetadata, ogImage } from '@/lib/site-metadata'
import { existsSync } from 'node:fs'

const sites = projects.filter((p) => p.band === 'Sites')
const liveSites = sites.filter((p) => p.status !== 'staging')

describe('positioning', () => {
  it('leads with the mid-level full-stack title', () => {
    expect(heroContent.title).toBe('Mid-level full-stack developer')
  })

  it('keeps the specialism free of em-dashes', () => {
    expect(heroContent.specialism).not.toContain('—')
  })

  it('states the same number of live sites as the Sites band holds that are not staging', () => {
    const claimed = Number(heroContent.specialism.match(/^(\d+) live sites · /)?.[1])
    expect(claimed).toBe(liveSites.length)
  })

  it('calls the sites live only because every non-staging one displays as live', () => {
    for (const site of liveSites) expect(displayStatus(site.status), site.slug).toBe('live')
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
      'naga-city-guide: directory',
      'eastwind-beach-villas: hotel',
    ])
    expect(heroContent.specialism).toBe(`${liveSites.length} live sites · hotels, tours, restaurants, review centres`)
    expect(heroContent.specialism).toBe('11 live sites · hotels, tours, restaurants, review centres')
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
      expect(section.eyebrow.trim()).not.toBe('')
      expect(section.eyebrow).not.toMatch(/^\/\//)
      expect(section.title.trim()).not.toBe('')
    }
  })

  it('navigates to the work, the services, about, hire and contact', () => {
    expect(navigationItems.map((n) => n.href)).toEqual(['/projects', '/services', '/about', '/hire', '#contact'])
  })
})

describe('site metadata', () => {
  const metadata = buildSiteMetadata('https://example.test')
  const serialized = JSON.stringify(metadata)

  it('titles the site as the spec’s titles table says, described by the subheadline', () => {
    expect(metadata.title).toBe('Christian Raro · Full-Stack Developer in the Philippines')
    expect(metadata.title).toBe(heroContent.pageTitle)
    expect(metadata.description).toBe(heroContent.subheadline)
  })

  it('no longer calls Christian a software engineer or frontend developer', () => {
    expect(serialized).not.toMatch(/software engineer/i)
    expect(serialized).not.toMatch(/frontend developer/i)
  })

  it('names the homepage card from app/og, not the retired PNG or file-convention card', () => {
    expect(serialized).not.toContain('og-image.png')
    expect(metadata.openGraph?.images).toEqual([ogImage('/')])
    expect(metadata.twitter?.images).toEqual([ogImage('/')])
    expect(existsSync('app/og/[[...path]]/route.tsx')).toBe(true)
    expect(existsSync('app/opengraph-image.tsx')).toBe(false)
  })
})
