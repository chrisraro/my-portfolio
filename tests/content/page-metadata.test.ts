import { describe, expect, it } from 'vitest'
import { metadata as servicesMetadata } from '@/app/services/page'
import { generateMetadata as serviceMetadata } from '@/app/services/[slug]/page'
import { metadata as aboutMetadata } from '@/app/about/page'
import { metadata as hireMetadata } from '@/app/hire/page'
import { servicePages } from '@/lib/data'
import { buildPageMetadata, OG_IMAGE } from '@/lib/site-metadata'
import type { Metadata } from 'next'

const routes: Array<[string, Metadata, string]> = [
  ['/services', servicesMetadata, '/services'],
  ['/about', aboutMetadata, '/about'],
  ['/hire', hireMetadata, '/hire'],
  ...servicePages.map((s): [string, Metadata, string] => [
    `/services/${s.slug}`,
    serviceMetadata({ params: { slug: s.slug } }),
    `/services/${s.slug}`,
  ]),
]

describe('each new page carries its own link preview', () => {
  it.each(routes)('%s: og:url, og:title and twitter match the page', (_name, m, path) => {
    expect(m.alternates?.canonical).toBe(path)
    expect(m.openGraph?.url).toBe(path)
    expect(m.openGraph?.title).toBe(m.title)
    expect(m.openGraph?.description).toBe(m.description)
    expect(m.twitter?.title).toBe(m.title)
    expect(m.openGraph?.images).toEqual([OG_IMAGE])
  })

  it('buildPageMetadata names the shared card and keeps keywords optional', () => {
    const m = buildPageMetadata('T', 'D', '/x', ['k'])
    expect(m.keywords).toEqual(['k'])
    expect(buildPageMetadata('T', 'D', '/x').keywords).toBeUndefined()
  })
})
