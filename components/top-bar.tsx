'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { availability, navigationItems } from '@/lib/data'

export function TopBar() {
  const { resolvedTheme, setTheme } = useTheme()
  // The theme is unknown until mount; render a same-sized placeholder icon
  // before then so the server and client markup match.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = resolvedTheme !== 'light'

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur">
      {/*
        DOM order is visual order at every width — mark, status, then nav — so
        keyboard focus never jumps against what is on screen (WCAG 2.4.3).
        Mobile: the controls sit right of the mark and the nav wraps below.
        Desktop: the controls stay beside the mark and the nav moves right.
      */}
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 px-5 py-3 sm:px-8">
        <Link href="/" className="font-mono text-sm text-ink">
          ~/christian-raro
        </Link>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <span className="hidden items-center gap-2 font-mono text-xs text-accent sm:inline-flex">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            {availability}
          </span>
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="inline-flex h-9 w-9 items-center justify-center rounded border border-line-strong text-muted-strong transition-colors hover:border-accent hover:text-accent"
          >
            {mounted ? (
              isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
            ) : (
              <span className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav aria-label="Primary" className="w-full md:ml-auto md:w-auto">
          <ul className="flex gap-6 overflow-x-auto font-mono text-xs text-muted-strong">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={`/${item.href}`}
                  className="inline-flex min-h-[32px] items-center transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
