'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useTheme } from 'next-themes'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { heroContent, navigationItems, resumeUrl } from '@/lib/data'
import { BrandMark } from '@/components/brand-mark'
import { cn } from '@/lib/utils'

// A nav link at rest, on hover and as the current page (ink, a trail-red
// underline: more than colour), in the row and in the menu alike.
const LINK =
  'map-label inline-flex min-h-[44px] items-center whitespace-nowrap px-2 text-muted-strong transition-colors duration-[var(--dur-fast)] ease-[var(--ease-sharp)] hover:text-ink aria-[current=page]:text-ink aria-[current=page]:decoration-trail aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-[6px]'

export function SiteLegend() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  // The theme is unknown until mount; render a same-sized placeholder icon
  // before then so the server and client markup match.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = resolvedTheme !== 'light'
  // The label is gated on mount like the icon. React does not patch attribute
  // mismatches on hydration, so a theme-specific server label would stick.
  const themeLabel = !mounted ? 'Toggle theme' : isDark ? 'Switch to light theme' : 'Switch to dark theme'

  // Below 1024px the links fold into a menu: a <details> disclosure, so it
  // opens without JavaScript too. Script closes it on a route change, on
  // Escape (focus back on its summary), on a press outside, and when one of
  // its links is followed (a same-page #contact jump changes no route).
  const [menuOpen, setMenuOpen] = useState(false)
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const summaryRef = useRef<HTMLElement>(null)
  useEffect(() => setMenuOpen(false), [pathname])
  useEffect(() => {
    if (!menuOpen) return
    const onPointer = (e: PointerEvent) => {
      if (detailsRef.current && e.target instanceof Node && !detailsRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [menuOpen])
  const onMenuKey = (e: KeyboardEvent<HTMLDetailsElement>) => {
    if (e.key !== 'Escape' || !menuOpen) return
    setMenuOpen(false)
    summaryRef.current?.focus()
  }

  // Colours swap at once on a theme switch: transitions are held off for the
  // two frames the swap takes. This replaces next-themes'
  // disableTransitionOnChange, which also ran on every page load and cost two
  // full-page style recalculations and a forced one.
  // Far sections skip rendering (content-visibility: auto, .defer-render) and
  // stand in at an estimated height, so a jump to #contact measured against
  // the estimates lands far short of it. Before an in-page jump, render them
  // for real (.render-all) and lay out once; a jump that arrives with the URL
  // (a hash load, or "/#contact" from another page) is re-aimed the same way.
  useEffect(() => {
    const root = document.documentElement
    let timer: number | undefined
    const renderAll = () => {
      root.classList.add('render-all')
      void root.offsetHeight
      window.clearTimeout(timer)
      timer = window.setTimeout(() => root.classList.remove('render-all'), 1500)
    }
    const onClick = (e: MouseEvent) => {
      const link = e.target instanceof Element ? e.target.closest('a') : null
      if (link && link.hash && link.pathname === window.location.pathname) renderAll()
    }
    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.clearTimeout(timer)
      root.classList.remove('render-all')
    }
  }, [])

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    const target = id ? document.getElementById(id) : null
    if (!target) return
    const root = document.documentElement
    root.classList.add('render-all')
    let timer: number | undefined
    const frame = requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'auto' })
      timer = window.setTimeout(() => root.classList.remove('render-all'), 1500)
    })
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      root.classList.remove('render-all')
    }
  }, [pathname])

  const switchTheme = (next: 'light' | 'dark') => {
    const root = document.documentElement
    root.classList.add('theme-switching')
    setTheme(next)
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')))
  }

  const links = navigationItems.map((item) => ({
    label: item.label,
    href: item.href.startsWith('#') ? `/${item.href}` : item.href,
    current: !item.href.startsWith('#') && pathname.startsWith(item.href),
  }))

  return (
    <header className="pointer-events-none sticky top-3 z-40 px-3 sm:px-5">
      <div className="legend-glass pointer-events-auto relative mx-auto flex h-14 max-w-6xl items-center gap-3 rounded border border-line px-3 sm:gap-6 sm:px-5">
        <Link href="/" className="inline-flex min-h-[44px] shrink-0 items-center gap-2 text-ink">
          <BrandMark />
          <span className="map-label text-[0.9375rem] text-ink max-sm:sr-only">{heroContent.name}</span>
        </Link>

        {/* From 1024px: the row, as the legend has always looked. */}
        <nav aria-label="Primary" className="min-w-0 flex-1 max-lg:hidden">
          <ul className="flex gap-1 overflow-x-auto p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={l.current ? 'page' : undefined} className={LINK}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <a href={resumeUrl} className="map-label hidden min-h-[44px] items-center px-2 text-muted-strong hover:text-ink lg:inline-flex">
            Résumé
          </a>
          <details
            ref={detailsRef}
            open={menuOpen}
            onToggle={(e) => setMenuOpen(e.currentTarget.open)}
            onKeyDown={onMenuKey}
            className="lg:hidden"
          >
            <summary
              ref={summaryRef}
              className="map-label press inline-flex min-h-[44px] cursor-pointer list-none items-center gap-2 rounded-sm border border-line-strong px-3 text-ink [&::-webkit-details-marker]:hidden"
            >
              {menuOpen ? <X aria-hidden="true" className="h-4 w-4" /> : <Menu aria-hidden="true" className="h-4 w-4" />}
              Menu
            </summary>
            {/* Below the card, the card's full width. Opaque panel paper: one frosted surface only. */}
            <nav aria-label="Primary" className="absolute inset-x-0 top-full mt-2 rounded border border-line bg-panel p-2 shadow-overlay">
              <ul className="grid">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={l.current ? 'page' : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={cn(LINK, 'w-full')}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a href={resumeUrl} onClick={() => setMenuOpen(false)} className={cn(LINK, 'w-full')}>
                    Résumé
                  </a>
                </li>
              </ul>
            </nav>
          </details>
          <button
            type="button"
            onClick={() => switchTheme(isDark ? 'light' : 'dark')}
            aria-label={themeLabel}
            className="press inline-flex h-11 w-11 items-center justify-center rounded-sm border border-line-strong text-muted-strong hover:border-ink hover:text-ink"
          >
            {mounted ? isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" /> : <span className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}
