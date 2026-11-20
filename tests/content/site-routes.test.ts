import { describe, expect, it } from 'vitest'
import { projects, servicePages } from '@/lib/data'
import { buildProjectPageTitle, findRoute, routeFor, siteRoutes } from '@/lib/site-routes'

// Spec §6, the titles table, verbatim.
const TITLES: Record<string, string> = {
  '/': 'Christian Raro · Full-Stack Developer in the Philippines',
  '/services/full-stack-development': 'Full-Stack Web Developer (Next.js, React) · Philippines, remote',
  '/services/wordpress-woocommerce': 'WordPress & WooCommerce Developer · PayMongo, Maya, Xendit, PayPal',
  '/services/ai-automation': 'AI Automation Engineer · n8n, LLM workflows, MCP',
  '/about': 'About Christian Raro · Web Developer in Naga City, Bicol',
  '/hire': 'Hire a Mid-Level Full-Stack Developer · Remote, Philippines',
}

describe('site routes', () => {
  const routes = siteRoutes()
  const paths = routes.map((r) => r.path)

  it('list every page once: home, services and its pages, hire, about, projects, every project', () => {
    expect(paths).toEqual([
      '/',
      '/services',
      ...servicePages.map((s) => `/services/${s.slug}`),
      '/hire',
      '/about',
      '/projects',
      ...projects.map((p) => `/projects/${p.slug}`),
    ])
    expect(new Set(paths).size).toBe(paths.length)
  })

  it.each(Object.entries(TITLES))('title %s as the spec’s table says', (path, title) => {
    expect(routeFor(path).title).toBe(title)
  })

  it('title each project page {Project} · {summary} · Christian Raro', () => {
    for (const p of projects) {
      expect(routeFor(`/projects/${p.slug}`).title).toBe(`${p.title} · ${p.summary} · Christian Raro`)
      expect(buildProjectPageTitle(p)).toBe(`${p.title} · ${p.summary} · Christian Raro`)
    }
  })

  it('give every route a description, card words and a breadcrumb trail from Home to itself', () => {
    for (const r of routes) {
      expect(r.description.trim(), r.path).not.toBe('')
      for (const text of [r.card.eyebrow, r.card.title, r.card.detail]) expect(text.trim(), r.path).not.toBe('')
      expect(r.crumbs[0]).toEqual({ name: 'Home', path: '/' })
      expect(r.crumbs[r.crumbs.length - 1].path).toBe(r.path)
      expect(r.title).not.toContain('—')
    }
  })

  it('carry each service, /about and /hire’s keyword', () => {
    for (const s of servicePages) expect(routeFor(`/services/${s.slug}`).keywords).toEqual([s.keyword])
    expect(routeFor('/about').keywords).toHaveLength(1)
    expect(routeFor('/hire').keywords).toHaveLength(1)
    expect(routeFor('/').keywords).toBeUndefined()
  })

  it('find a known path and refuse an unknown one', () => {
    expect(findRoute('/about')?.kind).toBe('about')
    expect(findRoute('/nope')).toBeUndefined()
    expect(() => routeFor('/nope')).toThrow()
  })
})
