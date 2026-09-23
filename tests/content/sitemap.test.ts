import { describe, expect, it } from 'vitest'
import sitemap from '@/app/sitemap'
import { FLAGSHIP_SLUGS } from '@/lib/case-studies'
import { projects } from '@/lib/data'
import { SITE_URL } from '@/lib/site-metadata'

describe('sitemap', () => {
  const entries = sitemap()
  const urls = entries.map((e) => e.url)

  it('lists the homepage, /projects and every project page once', () => {
    expect(urls).toHaveLength(2 + projects.length)
    expect(urls).toContain(SITE_URL)
    expect(urls).toContain(`${SITE_URL}/projects`)
    for (const p of projects) expect(urls.filter((u) => u === `${SITE_URL}/projects/${p.slug}`)).toHaveLength(1)
  })

  it('ranks case studies above short pages', () => {
    const priority = (slug: string) => entries.find((e) => e.url === `${SITE_URL}/projects/${slug}`)!.priority
    expect(priority(FLAGSHIP_SLUGS[0])).toBe(0.7)
    expect(priority('latag')).toBe(0.5)
  })
})
