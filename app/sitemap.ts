import type { MetadataRoute } from 'next'
import { FLAGSHIP_SLUGS } from '@/lib/case-studies'
import { projects } from '@/lib/data'
import { projectHref } from '@/lib/project-page'
import { SITE_URL } from '@/lib/site-metadata'

// Every page a visitor can reach: the homepage, the index and one page per
// project. Case studies rank above the short pages.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/projects`, changeFrequency: 'monthly', priority: 0.8 },
    ...projects.map((p) => ({
      url: `${SITE_URL}${projectHref(p)}`,
      changeFrequency: 'monthly' as const,
      priority: FLAGSHIP_SLUGS.indexOf(p.slug) === -1 ? 0.5 : 0.7,
    })),
  ]
}
