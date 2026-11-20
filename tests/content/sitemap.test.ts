import { describe, expect, it } from 'vitest'
import sitemap from '@/app/sitemap'
import { FLAGSHIP_SLUGS } from '@/lib/case-studies'
import { projects, servicePages } from '@/lib/data'
import { SITE_URL } from '@/lib/site-metadata'

describe('sitemap', () => {
  const entries = sitemap()
  const urls = entries.map((e) => e.url)
  const pages = ['', '/services', ...servicePages.map((s) => `/services/${s.slug}`), '/hire', '/about', '/projects']

  it('lists the homepage, the services, hire, about, /projects and every project page once', () => {
    expect(urls).toHaveLength(pages.length + projects.length)
    for (const path of pages) expect(urls.filter((u) => u === `${SITE_URL}${path}`), path || '/').toHaveLength(1)
    for (const p of projects) expect(urls.filter((u) => u === `${SITE_URL}/projects/${p.slug}`)).toHaveLength(1)
  })

  it('ranks the paths from the fork above the inventory, and case studies above short pages', () => {
    const priority = (path: string) => entries.find((e) => e.url === `${SITE_URL}${path}`)!.priority!
    expect(priority('/services')).toBeGreaterThan(priority('/projects'))
    expect(priority('/hire')).toBeGreaterThan(priority('/projects'))
    expect(priority(`/projects/${FLAGSHIP_SLUGS[0]}`)).toBe(0.7)
    expect(priority('/projects/latag')).toBe(0.5)
  })
})
