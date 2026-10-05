import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { caseStudyContent, projects, sectorNames } from '@/lib/data'
import { canLinkLive, fullShotFor, isEmbeddable, liveLinkLabel, nextInOrder, projectHref, recommendationFor, screenshotsFor } from '@/lib/project-page'
import { buildProjectPageTitle } from '@/lib/site-metadata'
import type { Project, ProjectStatus } from '@/types'

const bySlug = (slug: string) => projects.find((p) => p.slug === slug)!
const withStatus = (status: ProjectStatus, live?: string): Project => ({
  ...bySlug('giya'),
  status,
  links: live ? { live } : {},
})

describe('project page helpers', () => {
  it('addresses each project by slug, not id', () => {
    expect(projectHref(bySlug('giya'))).toBe('/projects/giya')
    expect(projectHref(bySlug('el-nido-guide-ph'))).toBe('/projects/el-nido-guide-ph')
  })

  it('links live only for systems a visitor can open', () => {
    expect(canLinkLive(withStatus('live', 'https://x.test'))).toBe(true)
    expect(canLinkLive(withStatus('early-access', 'https://x.test'))).toBe(true)
    expect(canLinkLive(withStatus('ua-gated', 'https://x.test'))).toBe(true)
    expect(canLinkLive(withStatus('staging', 'https://x.test'))).toBe(true)
    expect(canLinkLive(withStatus('auth-gated', 'https://x.test'))).toBe(false)
    expect(canLinkLive(withStatus('internal', 'https://x.test'))).toBe(false)
    expect(canLinkLive(withStatus('live'))).toBe(false)
  })

  it('labels the outbound link for staging or live', () => {
    expect(liveLinkLabel(withStatus('staging', 'https://x.test'))).toBe('Open staging site')
    expect(liveLinkLabel(withStatus('live', 'https://x.test'))).toBe('Open live site')
  })

  it('finds the desktop shot, and a mobile shot only where the file exists', () => {
    for (const p of projects) {
      const shots = screenshotsFor(p)
      expect(shots.desktop).toBe(p.image || undefined)
      if (shots.mobile) expect(existsSync(join('public', shots.mobile))).toBe(true)
      if (!p.image) expect(shots.mobile).toBeUndefined()
    }
  })

  it('walks the reading order and wraps', () => {
    expect(nextInOrder(['a', 'b', 'c'], 'a')).toBe('b')
    expect(nextInOrder(['a', 'b', 'c'], 'c')).toBe('a')
    expect(nextInOrder(['a'], 'a')).toBeUndefined()
    expect(nextInOrder(['a', 'b'], 'z')).toBeUndefined()
  })

  it('attaches a client quote to the project it names', () => {
    expect(recommendationFor(bySlug('beachbus-palawan'))?.authorName).toBe('Alec Santos')
    expect(recommendationFor(bySlug('latag'))).toBeUndefined()
  })

  it('names every sector and explains every missing preview', () => {
    for (const p of projects) expect(sectorNames[p.sector]).toBeTruthy()
    expect(caseStudyContent.noPreview['auth-gated']).toBeTruthy()
    expect(caseStudyContent.noPreview.internal).toBeTruthy()
  })

  it('titles each page for its project, without an em-dash', () => {
    for (const p of projects) {
      const title = buildProjectPageTitle(p)
      expect(title.startsWith(`${p.title} · `)).toBe(true)
      expect(title).not.toContain('—')
    }
  })
})

describe('preview assets and embeddability', () => {
  const embeds = JSON.parse(readFileSync(join(process.cwd(), 'lib/embeddable.json'), 'utf8'))

  it('records an embeddability flag for every project with a live URL', () => {
    expect(Number.isNaN(Date.parse(embeds.checkedAt))).toBe(false)
    for (const p of projects.filter((p) => p.links.live)) {
      expect(typeof embeds.projects[p.slug], p.slug).toBe('boolean')
    }
  })

  it('returns a full-page shot path only when the file exists', () => {
    for (const p of projects) {
      const path = `/assets/images/projects/${p.id}-full.webp`
      const exists = existsSync(join(process.cwd(), 'public', path))
      expect(fullShotFor(p)).toBe(exists ? path : undefined)
    }
    expect(fullShotFor({ ...bySlug('giya'), id: 'no-such-project' })).toBeUndefined()
  })

  it('never calls an auth-gated, internal or unknown project embeddable', () => {
    expect(isEmbeddable(withStatus('auth-gated', 'https://x.test'))).toBe(false)
    expect(isEmbeddable(withStatus('internal', 'https://x.test'))).toBe(false)
    expect(isEmbeddable({ ...withStatus('live', 'https://x.test'), slug: 'unknown-slug' })).toBe(false)
    expect(isEmbeddable(withStatus('live'))).toBe(false)
  })

  it('reads the recorded flag for a linkable project', () => {
    for (const p of projects.filter((p) => canLinkLive(p))) {
      expect(isEmbeddable(p), p.slug).toBe(embeds.projects[p.slug] === true)
    }
  })
})
