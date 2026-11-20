import { readFileSync } from 'node:fs'
import type { Metadata } from 'next'
import { describe, expect, it } from 'vitest'
import { metadata as aboutMetadata } from '@/app/about/page'
import { metadata as hireMetadata } from '@/app/hire/page'
import { metadata as homeMetadata } from '@/app/page'
import { generateMetadata as projectsMetadata } from '@/app/projects/page'
import { generateMetadata as projectMetadata } from '@/app/projects/[slug]/page'
import { metadata as servicesMetadata } from '@/app/services/page'
import { generateMetadata as serviceMetadata } from '@/app/services/[slug]/page'
import { ogImage } from '@/lib/site-metadata'
import { siteRoutes, type SiteRoute } from '@/lib/site-routes'

// Each route's metadata as the page itself exports it.
function metadataOf(route: SiteRoute): Metadata {
  switch (route.kind) {
    case 'home':
      return homeMetadata
    case 'projects':
      return projectsMetadata({ searchParams: {} })
    case 'services':
      return servicesMetadata
    case 'service':
      return serviceMetadata({ params: { slug: route.slug! } })
    case 'about':
      return aboutMetadata
    case 'hire':
      return hireMetadata
    case 'project':
      return projectMetadata({ params: { slug: route.slug! } })
  }
}

describe('every page carries its own title, description, canonical and card', () => {
  it.each(siteRoutes().map((r) => [r.path, r] as const))('%s', (_path, route) => {
    const m = metadataOf(route)
    expect(m.title).toBe(route.title)
    expect(m.description).toBe(route.metaDescription)
    expect(m.alternates?.canonical).toBe(route.path)
    expect(m.openGraph).toMatchObject({
      title: route.title,
      description: route.metaDescription,
      url: route.path,
      images: [ogImage(route.path)],
    })
    expect(m.twitter).toMatchObject({
      card: 'summary_large_image',
      title: route.title,
      description: route.metaDescription,
      images: [ogImage(route.path)],
    })
  })

  it('marks a project page as an article and every other page as a website', () => {
    for (const r of siteRoutes()) {
      expect(metadataOf(r).openGraph, r.path).toMatchObject({ type: r.kind === 'project' ? 'article' : 'website' })
    }
  })

  it('titles a filtered /projects view by its band, on the unfiltered page’s canonical and card', () => {
    const m = projectsMetadata({ searchParams: { band: 'sites' } })
    expect(m.title).toBe('Sites · Projects · Christian Raro')
    expect(m.alternates?.canonical).toBe('/projects')
    expect(m.openGraph).toMatchObject({ title: m.title, url: '/projects', images: [ogImage('/projects')] })
  })

  it('names no retired card anywhere', () => {
    for (const file of ['lib/site-metadata.ts', 'lib/structured-data.ts', 'app/layout.tsx']) {
      expect(readFileSync(file, 'utf8'), file).not.toMatch(/opengraph-image|OG_IMAGE/)
    }
  })
})
