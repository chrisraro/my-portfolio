import { describe, expect, it } from 'vitest'
import { aboutPageContent, hirePageContent, servicePages, servicesPageContent } from '@/lib/data'
import { buildRouteMetadata } from '@/lib/site-metadata'
import { routeFor, siteRoutes } from '@/lib/site-routes'

// S5 final review: /services*, /about, /hire and 11 of 20 project pages (15 now) sent
// 160-371 character descriptions; Google cuts snippets near 155.
describe('meta descriptions', () => {
  const routes = siteRoutes()

  it('fit a snippet: 50 to 160 characters on every route', () => {
    expect(routes.length).toBeGreaterThanOrEqual(23)
    for (const r of routes) {
      expect(r.metaDescription.length, r.path).toBeGreaterThanOrEqual(50)
      expect(r.metaDescription.length, r.path).toBeLessThanOrEqual(160)
    }
  })

  it('are what the page’s metadata, Open Graph and Twitter tags send', () => {
    for (const r of routes) {
      const m = buildRouteMetadata(r.path)
      expect(m.description, r.path).toBe(r.metaDescription)
      expect((m.openGraph as { description?: string }).description, r.path).toBe(r.metaDescription)
    }
  })

  it('leave the long answers to the AI files, the chat prompt and the JSON-LD', () => {
    expect(routeFor('/about').description).toBe(aboutPageContent.answer)
    expect(routeFor('/hire').description).toBe(hirePageContent.answer)
    expect(routeFor('/services').description).toBe(servicesPageContent.answer)
    for (const s of servicePages) expect(routeFor(`/services/${s.slug}`).description).toBe(s.answer)
  })
})
