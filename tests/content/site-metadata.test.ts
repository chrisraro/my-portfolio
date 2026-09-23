import { afterEach, describe, expect, it, vi } from 'vitest'
import { metadata as homepageMetadata } from '@/app/page'
import { generateMetadata } from '@/app/projects/page'
import { buildSiteMetadata, normaliseSiteUrl } from '@/lib/site-metadata'

describe('site metadata', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('canonicalises the homepage to /, unlike the layout default', () => {
    expect(homepageMetadata.alternates?.canonical).toBe('/')
  })

  it('adds Google verification only when it is configured', () => {
    expect(buildSiteMetadata('https://example.test', 'abc').verification).toEqual({ google: 'abc' })
    // An explicit '' (not the ambient shell env, which a default parameter
    // would otherwise read) proves an empty value counts as unset.
    vi.stubEnv('GOOGLE_SITE_VERIFICATION', '')
    expect(buildSiteMetadata('https://example.test', undefined).verification).toBeUndefined()
  })

  it('points every /projects filter at /projects, with a matching og:url', () => {
    for (const band of [undefined, 'sites', 'products', 'nonsense']) {
      const metadata = generateMetadata({ searchParams: { band } })
      expect(metadata.alternates?.canonical).toBe('/projects')
      expect(metadata.openGraph?.url).toBe('/projects')
    }
  })

  it('strips a trailing slash from the site URL', () => {
    expect(normaliseSiteUrl('https://example.test/')).toBe('https://example.test')
    expect(normaliseSiteUrl('https://example.test///')).toBe('https://example.test')
    expect(normaliseSiteUrl('https://example.test')).toBe('https://example.test')
  })
})
