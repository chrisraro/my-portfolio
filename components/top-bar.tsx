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
          {/* A small magenta plane: the brochure's colour, as a printed tab. */}
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
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
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
