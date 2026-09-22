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
import { buildSiteMetadata } from '@/lib/site-metadata'
import { existsSync } from 'node:fs'

describe('positioning', () => {
  it('leads with the full-stack title', () => {
    expect(heroContent.title).toBe('Full-stack developer')
  })

  it('states the same number of production sites as the Sites band holds', () => {
    const sites = projects.filter((p) => p.band === 'Sites').length
    const claimed = Number(heroContent.specialism.match(/(\d+) production sites/)?.[1])
    expect(claimed).toBe(sites)
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

  it('navigates to the four homepage sections', () => {
    expect(navigationItems.map((n) => n.href)).toEqual(['#work', '#changelog', '#stack', '#contact'])
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
})
