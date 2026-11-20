import { describe, expect, it } from 'vitest'
import robots from '@/app/robots'
import { SITE_URL } from '@/lib/site-metadata'

// Spec §6, crawlers and rendering.
describe('robots.txt', () => {
  const { rules, sitemap } = robots()
  const groups = Array.isArray(rules) ? rules : [rules]
  const group = (ua: string) => groups.find((g) => g.userAgent === ua)

  it.each(['Googlebot', 'OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot'])('names %s, allows the site and keeps it off /api/', (ua) => {
    expect(group(ua)).toEqual({ userAgent: ua, allow: '/', disallow: '/api/' })
  })

  it('keeps every other crawler, AI training crawlers included, allowed outside /api/', () => {
    expect(group('*')).toEqual({ userAgent: '*', allow: '/', disallow: '/api/' })
    for (const g of groups) expect(g.disallow).toBe('/api/')
    for (const trainer of ['GPTBot', 'ClaudeBot', 'Google-Extended', 'CCBot']) expect(group(trainer)).toBeUndefined()
  })

  it('points at the sitemap', () => {
    expect(sitemap).toBe(`${SITE_URL}/sitemap.xml`)
  })
})
