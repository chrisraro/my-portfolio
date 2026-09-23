import { describe, expect, it } from 'vitest'
import { generateMetadata } from '@/app/projects/page'
import { buildSiteMetadata } from '@/lib/site-metadata'

describe('site metadata', () => {
  it('adds Google verification only when it is configured', () => {
    expect(buildSiteMetadata('https://example.test', 'abc').verification).toEqual({ google: 'abc' })
    expect(buildSiteMetadata('https://example.test', undefined).verification).toBeUndefined()
  })

  it('points every /projects filter at /projects', () => {
    for (const band of [undefined, 'sites', 'products', 'nonsense']) {
      expect(generateMetadata({ searchParams: { band } }).alternates?.canonical).toBe('/projects')
    }
  })
})
