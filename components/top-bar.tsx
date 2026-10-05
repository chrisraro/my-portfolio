'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { availability, heroContent, navigationItems } from '@/lib/data'

// The mark's tile carries the initials, derived rather than retyped.
const initials = heroContent.name
  .split(/\s+/)
  .map((part) => part[0])
  .join('')

export function TopBar() {
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

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas">
      {/*
        DOM order is visual order at every width (WCAG 2.4.3): mark, nav, then
        availability and the theme toggle.
        Below md: the mark has the first row; the nav and the toggle share the
        second, toggle at its end. 44px targets for touch.
        md and up: one 64px row, nav after the mark, controls pushed right.
        Availability shows from lg, where the row has room for it.
      */}
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-x-4 px-5 pb-1 pt-2 sm:px-8 md:flex md:h-16 md:gap-x-10 md:py-0">
        <Link
          href="/"
          className="col-span-2 inline-flex min-h-[44px] items-center gap-3 justify-self-start text-ink"
        >
          {/* A small amber plane: the brochure's colour, as a printed tab. */}
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-sm bg-accent font-display text-sm font-bold text-on-accent [font-variation-settings:'wdth'_75]"
          >
            {initials}
          </span>
          <span className="font-display text-xl font-bold leading-none tracking-[-0.01em] [font-variation-settings:'wdth'_75]">
            {heroContent.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="min-w-0">
          {/*
            Below md the row scrolls sideways. A scroll container clips on both
            axes, so it is padded by 6px all round (the 2px ring at a 3px
            offset needs 5px), and pulled back by the same so the text still
            lines up. From md there is room: no scroll container, no clipping.
          */}
          <ul className="flex max-md:-mx-3 max-md:-my-1.5 max-md:overflow-x-auto max-md:p-1.5 md:gap-2">
            {navigationItems.map((item) => {
              const href = item.href.startsWith('#') ? `/${item.href}` : item.href
              const current = !item.href.startsWith('#') && pathname.startsWith(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={href}
                    aria-current={current ? 'page' : undefined}
                    className="inline-flex min-h-[44px] items-center whitespace-nowrap px-1.5 font-display text-sm font-semibold text-muted-strong transition-colors duration-[var(--dur-fast)] ease-[var(--ease-sharp)] [font-variation-settings:'wdth'_85] md:px-2 md:text-[0.9375rem] md:[font-variation-settings:'wdth'_100] hover:text-ink aria-[current=page]:text-ink"
                  >
                    <span className="link-draw">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-5 md:ml-auto">
          <p className="edge-code hidden items-center gap-2 text-[0.8125rem] text-muted-strong lg:inline-flex">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
            {availability}
          </p>
          <button
            type="button"
            onClick={() => switchTheme(isDark ? 'light' : 'dark')}
            aria-label={themeLabel}
            className="press inline-flex h-11 w-11 items-center justify-center rounded border border-line-strong text-muted-strong hover:border-accent hover:text-accent"
          >
            {mounted ? (
              isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
            ) : (
              <span className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
