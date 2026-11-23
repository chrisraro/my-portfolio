'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { useTheme } from 'next-themes'
import { Briefcase, FileText, Github, Layers, Linkedin, Mail, MapPin, Menu, Moon, BookOpen, Sun, User, UserCheck, Wrench, X, type LucideIcon } from 'lucide-react'
import { contactInfo, ctaLabels, exploreItems, footerContent, heroContent, navigationItems, projects, resumeUrl, servicePages, socialLinks } from '@/lib/data'
import { BrandMark } from '@/components/brand-mark'
import { cn } from '@/lib/utils'

// A link in the phone menu: ink and an underline when current (more than colour).
const LINK =
  'inline-flex min-h-[44px] items-center whitespace-nowrap px-3 text-muted-strong transition-colors duration-[var(--dur-fast)] ease-[var(--ease-sharp)] hover:text-ink focus-visible:outline-offset-[-2px] [&[aria-current]]:text-ink [&[aria-current]]:underline [&[aria-current]]:decoration-trail [&[aria-current]]:decoration-2 [&[aria-current]]:underline-offset-[6px]'

const ICONS: Record<string, LucideIcon> = {
  '/projects': Briefcase,
  '/services': Layers,
  '/about': User,
  '/hire': UserCheck,
  '/#journals': BookOpen,
  '/#places': MapPin,
  '/#stack': Wrench,
}
const COUNTS: Record<string, number> = { '/projects': projects.length, '/services': servicePages.length }
const SOCIAL: Record<string, LucideIcon> = { github: Github, linkedin: Linkedin, mail: Mail }

/** The specular highlight follows the pointer over a pane of glass (--gx, --gy in globals.css). */
function followPointer(e: ReactPointerEvent<HTMLElement>) {
  const box = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--gx', `${Math.round(e.clientX - box.left)}px`)
  e.currentTarget.style.setProperty('--gy', `${Math.round(e.clientY - box.top)}px`)
}

interface PanelLink {
  label: string
  href: string
  current: boolean
}

/**
 * The panel's list. One lozenge of glass sits behind the current link and
 * glides to whichever link the pointer or the keyboard is on, then back.
 */
function PanelNav({ label, links, pathname }: { label: string; links: PanelLink[]; pathname: string }) {
  const [at, setAt] = useState<number | null>(null)
  const home = links.findIndex((l) => l.current)
  const active = at ?? (home === -1 ? null : home)

  return (
    <nav aria-label={label} className="relative" onPointerLeave={() => setAt(null)}>
      <span
        aria-hidden="true"
        className="lozenge"
        data-on={active !== null}
        // Rows are 44px tall with a 2px gap.
        style={{ transform: `translateY(${(active ?? 0) * 46}px)` }}
      />
      <ul className="relative grid gap-0.5" onBlur={() => setAt(null)}>
        {links.map((l, i) => {
          const Icon = ICONS[l.href]
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={l.current ? (pathname === l.href ? 'page' : 'true') : undefined}
                onPointerEnter={() => setAt(i)}
                onFocus={() => setAt(i)}
                className="flex h-11 items-center gap-3 rounded-sm px-3 font-medium text-muted-strong transition-colors duration-[var(--dur-fast)] hover:text-ink focus-visible:outline-offset-[-2px] [&[aria-current]]:text-ink"
              >
                {Icon && <Icon aria-hidden="true" className="h-[1.125rem] w-[1.125rem] text-muted" />}
                {l.label}
                {l.current && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-trail" />}
                {COUNTS[l.href] !== undefined && <span className="ml-auto text-sm font-normal text-muted">{COUNTS[l.href]}</span>}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

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
  // Escape (focus back on its summary), on a press outside, when focus leaves
  // it, and when one of its links is followed (a same-page #contact jump changes no route).
  const [menuOpen, setMenuOpen] = useState(false)
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const summaryRef = useRef<HTMLElement>(null)
  useEffect(() => setMenuOpen(false), [pathname])
  useEffect(() => {
    if (!menuOpen) return
    const onPointer = (e: PointerEvent) => {
      if (detailsRef.current && e.target instanceof Node && !detailsRef.current.contains(e.target)) setMenuOpen(false)
    }
    // Tabbing past the last link would leave the panel open over the page.
    const details = detailsRef.current
    const onFocusOut = (e: FocusEvent) => {
      // No relatedTarget: a press on something unfocusable (Safari links); onPointer judges those.
      if (details && e.relatedTarget instanceof Node && !details.contains(e.relatedTarget)) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    details?.addEventListener('focusout', onFocusOut)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      details?.removeEventListener('focusout', onFocusOut)
    }
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

  const themeButton = (className: string) => (
    <button
      type="button"
      onClick={() => switchTheme(isDark ? 'light' : 'dark')}
      aria-label={themeLabel}
      className={cn('theme-toggle press glass-control h-11 w-11', className)}
    >
      {mounted ? isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" /> : <span className="h-4 w-4" />}
    </button>
  )
  const contact = links.find((l) => l.href === '/#contact')
  const pages = links.filter((l) => l !== contact)
  const explore = exploreItems.map((item) => ({ ...item, current: false }))

  return (
    <header className="pointer-events-none sticky top-3 z-40 px-3 sm:px-5 lg:fixed lg:bottom-3 lg:left-3 lg:w-64 lg:px-0">
      {/* From 1024px: the panel, a pane of glass the height of the window. */}
      <div onPointerMove={followPointer} className="glass panel pointer-events-auto hidden h-full flex-col p-4 lg:flex">
        <Link href="/" className="flex min-h-[44px] items-center gap-3 px-2 text-lg font-semibold text-ink">
          <BrandMark className="h-7 w-7" />
          {heroContent.name}
        </Link>
        {contact && (
          <Link href={contact.href} className="press button-secondary mt-5 w-full">
            <Mail aria-hidden="true" className="h-4 w-4" />
            {contact.label}
          </Link>
        )}
        <div className="panel__nav mt-5 min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <PanelNav label="Primary" links={pages} pathname={pathname} />
          <div className="mt-5">
            <PanelNav label="On the homepage" links={explore} pathname={pathname} />
          </div>
        </div>
        <div className="mt-4 border-t border-line pt-4">
          <p className="panel__place px-2 text-sm leading-snug text-muted">{footerContent.base.place}</p>
          <ul className="mt-3 flex items-center gap-2">
            <li>{themeButton('')}</li>
            <li>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="press glass-control h-11 w-11">
                <FileText aria-hidden="true" className="h-4 w-4" />
                <span className="sr-only">{`${ctaLabels.downloadResume} (PDF, opens in a new tab)`}</span>
              </a>
            </li>
            {socialLinks
              .filter((l) => l.icon === 'github' || l.icon === 'linkedin')
              .map((l) => {
                const Icon = SOCIAL[l.icon]
                return (
                  <li key={l.name}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="press glass-control h-11 w-11">
                      <Icon aria-hidden="true" className="h-4 w-4" />
                      <span className="sr-only">{`${l.name} (opens in a new tab)`}</span>
                    </a>
                  </li>
                )
              })}
          </ul>
        </div>
      </div>

      {/* Below 1024px: a bar of the same glass, its links in a disclosure. */}
      <div className="glass glass--dense pointer-events-auto relative mx-auto flex h-14 max-w-[45rem] items-center gap-3 rounded-full pl-4 pr-1.5 lg:hidden">
        <Link href="/" className="mr-auto inline-flex min-h-[44px] items-center gap-2.5 font-semibold text-ink">
          <BrandMark className="h-7 w-7" />
          {heroContent.name}
        </Link>
        {themeButton('')}
        <details ref={detailsRef} open={menuOpen} onToggle={(e) => setMenuOpen(e.currentTarget.open)} onKeyDown={onMenuKey}>
          <summary
            ref={summaryRef}
            className="press glass-control h-11 cursor-pointer list-none gap-2 px-4 text-ink [&::-webkit-details-marker]:hidden"
          >
            {menuOpen ? <X aria-hidden="true" className="h-4 w-4" /> : <Menu aria-hidden="true" className="h-4 w-4" />}
            Menu
          </summary>
          {/* Opaque, not glass on glass. */}
          <nav aria-label="Primary" className="absolute inset-x-0 top-full mt-2 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain rounded border border-line bg-panel p-2 shadow-overlay">
            <ul className="grid">
              {[...links, ...explore].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={l.current ? (pathname === l.href ? 'page' : 'true') : undefined}
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
              <li>
                <a href={`mailto:${contactInfo.email}`} onClick={() => setMenuOpen(false)} className={cn(LINK, 'w-full')}>
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </nav>
        </details>
      </div>
    </header>
  )
}
