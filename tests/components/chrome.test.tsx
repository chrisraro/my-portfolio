import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { Footer } from '@/components/footer'
import { SiteLegend } from '@/components/site-legend'
import { contactInfo, ctaLabels, exploreItems, footerContent, navigationItems, resumeUrl } from '@/lib/data'

// The legend reads the route; outside the App Router there is none.
vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

const css = readFileSync('app/globals.css', 'utf8')

describe('legend navigation', () => {
  const src = readFileSync('components/site-legend.tsx', 'utf8')
  const html = renderToStaticMarkup(<SiteLegend />)

  it('is a fixed panel of glass from 1024px and a bar of the same glass below it', () => {
    expect(html).toContain('lg:fixed')
    expect(html).toContain('class="glass panel pointer-events-auto hidden h-full flex-col p-4 lg:flex"')
    expect(html).toMatch(/class="glass glass--dense pointer-events-auto relative [^"]*lg:hidden"/)
    expect(css).toMatch(/\.glass \{[^}]*backdrop-filter:\s*blur\(/)
  })

  it('marks the current page by more than colour', () => {
    expect(src).toContain('[&[aria-current]]:underline')
    expect(src).toContain('[&[aria-current]]:decoration-trail')
    expect(src).not.toContain('[&[aria-current]]:text-trail')
    // In the panel the current page also carries the lozenge and an ember dot.
    expect(src).toContain('bg-trail')
    expect(src).toContain('className="lozenge"')
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

  it('adds the homepage’s own places as a second group: case studies, places, stack', () => {
    expect(exploreItems.map((i) => i.href)).toEqual(['/#journals', '/#places', '/#stack'])
    const panel = html.slice(0, html.indexOf('lg:hidden'))
    expect(panel).toContain('<nav aria-label="On the homepage"')
    for (const item of exploreItems) expect(panel, item.label).toContain(`href="${item.href}"`)
  })

  it('offers the résumé from the panel and from the menu', () => {
    expect(src).toContain('resumeUrl')
    const panel = html.slice(0, html.indexOf('lg:hidden'))
    expect(panel).toContain(`href="${resumeUrl}"`)
    expect(panel).toContain(`${ctaLabels.downloadResume} (PDF, opens in a new tab)`)
  })

  it('shows the panel from 1024px and folds the links into a menu below; the bar keeps the name', () => {
    const navs = html.match(/<nav aria-label="[^"]*"[^>]*>/g) ?? []
    expect(navs).toHaveLength(3)
    expect(html).toContain('<details>')
    expect(html).toMatch(/<summary[^>]*>[\s\S]*?Menu<\/summary>/)
    expect(html.indexOf('<details>')).toBeGreaterThan(html.indexOf('lg:hidden'))
  })

  it('puts every page, the homepage’s places and the résumé in the menu', () => {
    const menu = html.slice(html.indexOf('<details'), html.indexOf('</details>'))
    for (const item of [...navigationItems, ...exploreItems]) {
      expect(menu, item.label).toContain(`href="${item.href.startsWith('#') ? `/${item.href}` : item.href}"`)
    }
    expect(menu).toContain(`href="${resumeUrl}"`)
    expect(menu).toContain(`mailto:${contactInfo.email}`)
  })

  it('opens the menu on opaque paper, not glass on glass', () => {
    const menu = html.slice(html.indexOf('<nav aria-label="Primary" class="absolute'), html.indexOf('</details>'))
    expect(menu).toContain('bg-panel')
    expect(menu).not.toContain('glass')
  })

  it('closes the menu on a route change, on Escape (focus back on Menu), on a press outside and when a link is followed', () => {
    expect(src).toContain('useEffect(() => setMenuOpen(false), [pathname])')
    expect(src).toContain("e.key !== 'Escape'")
    expect(src).toContain('summaryRef.current?.focus()')
    expect(src).toContain("document.addEventListener('pointerdown', onPointer)")
    expect(src).toMatch(/onClick=\{\(\) => setMenuOpen\(false\)\}/)
    expect(src).toMatch(/onToggle=\{\(e\) => setMenuOpen\(e\.currentTarget\.open\)\}/)
  })

  it('closes the menu when keyboard focus moves outside it, and leaves presses to the pointer handler', () => {
    expect(src).toContain("details?.addEventListener('focusout', onFocusOut)")
    expect(src).toContain("details?.removeEventListener('focusout', onFocusOut)")
    expect(src).toMatch(/e\.relatedTarget instanceof Node && !details\.contains\(e\.relatedTarget\)/)
  })

  it('gives every panel link a 44px row, and every icon control a 44px target', () => {
    expect(html.match(/flex h-11 items-center gap-3/g)?.length).toBe(navigationItems.length - 1 + exploreItems.length)
    expect(html.match(/press glass-control h-11 w-11/g)?.length).toBeGreaterThanOrEqual(5)
    expect(html.match(/min-h-\[44px\]/g)?.length).toBeGreaterThan(0)
  })

  it('scrolls the panel’s links when the window is short, not the panel', () => {
    expect(html).toContain('overflow-y-auto')
  })
})

describe('Site legend', () => {
  it('names the theme toggle neutrally until mount, so hydration cannot leave a wrong label', () => {
    const source = readFileSync('components/site-legend.tsx', 'utf8')
    // The label is gated on mount, like the icon: the server cannot know the theme.
    expect(source).toMatch(/aria-label=\{themeLabel\}/)
    expect(source).toMatch(/const themeLabel = !mounted \? 'Toggle theme'/)
    // The server render (mounted false) is the neutral name.
    const html = renderToStaticMarkup(<SiteLegend />)
    expect(html).toContain('aria-label="Toggle theme"')
  })

  it('holds the layout out of transitions for the frames a theme switch takes', () => {
    const source = readFileSync('components/site-legend.tsx', 'utf8')
    expect(source).toContain("root.classList.add('theme-switching')")
    expect(css).toMatch(/\.theme-switching \*[\s\S]*?transition: none !important/)
  })
})

describe('Footer', () => {
  const html = renderToStaticMarkup(<Footer />)

  it('marks Naga City as the base', () => {
    expect(footerContent.base.place).toBe('Naga City, Camarines Sur')
    expect(html).toContain(footerContent.base.place)
  })

  it('carries no phone number or street address', () => {
    expect(html).not.toMatch(/\+?63[\s-]?9\d{2}|09\d{9}/)
    expect(html).not.toMatch(/\bStreet\b|\bSt\.\s|\bBarangay\b/i)
  })

  it('offers the résumé on every width', () => {
    expect(html).toContain(`href="${resumeUrl}"`)
  })

  it('tells screen readers each social link opens a new tab', () => {
    const links = contactInfo.socialLinks.filter((l) => l.icon !== 'mail')
    expect(html.match(/\(opens in a new tab\)/g)).toHaveLength(links.length)
  })

  it('keeps its last row above the fixed chat launcher', () => {
    expect(html).toContain('pb-24')
  })
})
