import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { BRAND_C, BRAND_FLAP, BRAND_FRONT, BRAND_R, BrandMark } from '@/components/brand-mark'
import { SiteLegend } from '@/components/site-legend'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

describe('BrandMark', () => {
  const html = renderToStaticMarkup(<BrandMark />)

  it('is a decorative inline svg', () => {
    expect(html).toMatch(/^<svg[^>]*aria-hidden="true"/)
    expect(html).toContain('focusable="false"')
  })

  it('fills from the theme tokens, never literal colours', () => {
    expect(html).toContain('oklch(var(--ink))')
    expect(html).toContain('oklch(var(--bg))')
    expect(html).not.toMatch(/--trail\b/)
    expect(html).not.toMatch(/#[0-9a-f]{3,8}\b/i)
    expect(html).not.toMatch(/--live\b/)
  })

  it('draws its letters as paths, not text', () => {
    expect(html).not.toContain('<text')
  })

  it('shares its geometry with the favicon', () => {
    const icon = readFileSync('app/icon.svg', 'utf8')
    for (const d of [BRAND_FRONT, BRAND_FLAP, BRAND_C, BRAND_R]) expect(icon).toContain(`d="${d}"`)
  })

  it('keeps the favicon valid XML: no double hyphen inside a comment', () => {
    const icon = readFileSync('app/icon.svg', 'utf8')
    const comments = icon.match(/<!--[\s\S]*?-->/g) ?? []
    for (const c of comments) expect(c.slice(4, -3)).not.toContain('--')
  })
})

describe('Legend mark', () => {
  it('renders the brand mark inside the home link, named by the visible name', () => {
    const bar = renderToStaticMarkup(<SiteLegend />)
    const link = bar.match(/<a[^>]*href="\/"[^>]*>([\s\S]*?)<\/a>/)?.[1] ?? ''
    expect(link).toContain('<svg')
    expect(link).toContain('aria-hidden="true"')
    expect(link).toContain('>Christian Raro<')
  })
})
