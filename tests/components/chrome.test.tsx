import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { ContourField } from '@/components/map/contour-field'
import { TrailPath } from '@/components/map/trail-path'
import { TrailSegment } from '@/components/map/trail-segment'
import { Footer } from '@/components/footer'
import { SiteLegend } from '@/components/site-legend'
import { contactInfo, footerContent, navigationItems, resumeUrl } from '@/lib/data'
import { trailSegments, trailheadContours, trailheadTrail } from '@/lib/contours'

// The legend reads the route; outside the App Router there is none.
vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

describe('map primitives', () => {
  it('renders contours as decorative SVG', () => {
    const html = renderToStaticMarkup(<ContourField paths={trailheadContours} viewBox="0 0 1440 900" />)
    expect(html).toContain('aria-hidden="true"')
    expect(html.match(/<path /g)?.length).toBe(trailheadContours.length)
  })

  it('renders the trailhead trail with a unit path length, drawn once on load', () => {
    const html = renderToStaticMarkup(<TrailPath mode="load" d={trailheadTrail.d} viewBox={trailheadTrail.viewBox} />)
    expect(html).toContain('pathLength="1"')
    expect(html).toContain('class="trail-draw trail-draw--load"')
    expect(html).toContain('aria-hidden="true"')
    expect(html).not.toContain('vector-effect')
    expect(html).not.toContain('trail-view')
  })

  it('renders a segment between sections on its own view timeline', () => {
    const html = renderToStaticMarkup(<TrailSegment variant={0} />)
    expect(html).toMatch(/<svg[^>]*class="[^"]*\btrail-view\b/)
    expect(html).toContain('class="trail-draw trail-draw--view"')
    expect(html).toContain(`d="${trailSegments[0].d}"`)
    expect(html).toMatch(/^<div aria-hidden="true"/)
  })
})

describe('legend navigation', () => {
  const src = readFileSync('components/site-legend.tsx', 'utf8')

  it('is a frosted legend card, not a full-width bar', () => {
    expect(src).toContain('legend-glass')
    const css = readFileSync('app/globals.css', 'utf8')
    expect(css).toMatch(/\.legend-glass \{[^}]*backdrop-filter:\s*blur\(/)
  })

  it('marks the current page by more than colour', () => {
    expect(src).toContain('aria-[current=page]:underline')
    expect(src).toContain('aria-[current=page]:decoration-trail')
    expect(src).not.toContain('aria-[current=page]:text-trail')
  })

  it('lists the pages in the spec’s order: Work, Services, About, Hire, then Contact', () => {
    expect(navigationItems).toEqual([
      { label: 'Work', href: '/projects' },
      { label: 'Services', href: '/services' },
      { label: 'About', href: '/about' },
      { label: 'Hire', href: '/hire' },
      { label: 'Contact', href: '#contact' },
    ])
  })

  it('offers the résumé from the legend', () => {
    expect(src).toContain('resumeUrl')
  })

  it('keeps the row from 1024px and folds it into a menu below; the name hides visually on a phone', () => {
    expect(src).toMatch(/className="[^"]*max-sm:sr-only[^"]*"[^>]*>\{heroContent\.name\}/)
    expect(src).toContain('[scrollbar-width:none]')
    const html = renderToStaticMarkup(<SiteLegend />)
    const navs = html.match(/<nav aria-label="Primary"[^>]*>/g) ?? []
    expect(navs).toHaveLength(2)
    expect(navs[0]).toContain('max-lg:hidden')
    expect(html).toContain('<details class="lg:hidden">')
    expect(html).toMatch(/<summary[^>]*>[\s\S]*?Menu<\/summary>/)
  })

  it('puts every page and the résumé in the menu', () => {
    const html = renderToStaticMarkup(<SiteLegend />)
    const menu = html.slice(html.indexOf('<details'), html.indexOf('</details>'))
    for (const item of navigationItems) {
      expect(menu, item.label).toContain(`href="${item.href.startsWith('#') ? `/${item.href}` : item.href}"`)
    }
    expect(menu).toContain(`href="${resumeUrl}"`)
  })

  it('shows the row’s résumé link only from 1024px, where the menu is gone', () => {
    const html = renderToStaticMarkup(<SiteLegend />)
    const row = html.slice(0, html.indexOf('<details'))
    const escaped = resumeUrl.replace(/[.*+?^$()|[\]\\{}]/g, '\\$&')
    expect(row).toMatch(new RegExp(`<a href="${escaped}" class="[^"]*\\bhidden\\b[^"]*\\blg:inline-flex\\b`))
  })

  it('closes the menu on a route change, on Escape (focus back on Menu), on a press outside and when a link is followed', () => {
    expect(src).toContain('useEffect(() => setMenuOpen(false), [pathname])')
    expect(src).toContain("e.key !== 'Escape'")
    expect(src).toContain('summaryRef.current?.focus()')
    expect(src).toContain("document.addEventListener('pointerdown', onPointer)")
    expect(src).toMatch(/onClick=\{\(\) => setMenuOpen\(false\)\}/)
    expect(src).toMatch(/onToggle=\{\(e\) => setMenuOpen\(e\.currentTarget\.open\)\}/)
  })
})

describe('survey footer', () => {
  const html = renderToStaticMarkup(<Footer />)

  it('marks Naga City as the base with its coordinates', () => {
    expect(footerContent.base.place).toBe('Naga City, Camarines Sur')
    expect(html).toContain(footerContent.base.place)
    expect(html).toContain(footerContent.base.coordinates)
  })

  it('carries no phone number or street address', () => {
    expect(html).not.toMatch(/\+?63[\s-]?9\d{2}|09\d{9}/)
    expect(html).not.toMatch(/\bStreet\b|\bSt\.\s|\bBarangay\b/i)
  })

  it('offers the résumé on every width', () => {
    expect(html).toContain(`href="${resumeUrl}"`)
  })
})

describe('Site legend', () => {
  it('scrolls the nav sideways when it must, padded so the focus ring is not clipped', () => {
    const source = readFileSync('components/site-legend.tsx', 'utf8')
    const ul = source.match(/<ul className="([^"]*)"/)?.[1] ?? ''
    expect(ul).toContain('overflow-x-auto')
    expect(ul).toMatch(/(^|\s)p-1\.5/)
  })

  it('names the theme toggle neutrally until mount, so hydration cannot leave a wrong label', () => {
    const source = readFileSync('components/site-legend.tsx', 'utf8')
    // The label is gated on mount, like the icon: the server cannot know the theme.
    expect(source).toMatch(/aria-label=\{themeLabel\}/)
    expect(source).toMatch(/const themeLabel = !mounted \? 'Toggle theme'/)
    // The server render (mounted false) is the neutral name.
    const html = renderToStaticMarkup(<SiteLegend />)
    expect(html).toContain('aria-label="Toggle theme"')
  })
})

describe('Footer', () => {
  it('tells screen readers each social link opens a new tab', () => {
    const html = renderToStaticMarkup(<Footer />)
    const links = contactInfo.socialLinks.filter((l) => l.icon !== 'mail')
    expect(html.match(/\(opens in a new tab\)/g)).toHaveLength(links.length)
  })

  it('signs off with the colophon from lib/data.ts', () => {
    expect(renderToStaticMarkup(<Footer />)).toContain(footerContent.colophon)
  })
})
