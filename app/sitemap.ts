import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/site-metadata'
import { siteRoutes } from '@/lib/site-routes'

// Every route in lib/site-routes.ts, in its order and at its priority: the
// paths from the fork rank above the inventory, case studies above short pages.
export default function sitemap(): MetadataRoute.Sitemap {
  return siteRoutes().map((r) => ({
    url: absoluteUrl(r.path),
    changeFrequency: 'monthly' as const,
    priority: r.priority,
  }))
}
