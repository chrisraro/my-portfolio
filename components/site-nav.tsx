import Link from 'next/link'
import { availability, heroContent, navigationItems } from '@/lib/data'

/** A section link works from any page: "#work" becomes "/#work". */
export function navHref(href: string): string {
  return href.startsWith('#') ? `/${href}` : href
}

/**
 * The bar: frosted, sticky, a wordmark set in the serif and the way in on the
 * right. Its hairline appears once the page has scrolled. Below 768px the
 * section links move to the tab bar at the bottom of the screen.
 */
export function SiteNav() {
  return (
    <header className="material bar-line sticky top-0 z-40 border-b border-gray-line">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="font-display text-[1.5rem] leading-none tracking-[-0.02em]">
          {heroContent.name}
        </Link>
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={navHref(item.href)}
                  className="inline-flex min-h-[44px] items-center rounded-full px-3.5 text-sm font-medium text-gray-text transition-colors hover:bg-gray-fill hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <p className="hidden items-center gap-2 text-[0.8125rem] text-gray-text lg:flex">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ink" />
            {availability}
          </p>
          <Link href="/#contact" className="btn btn-primary min-h-[40px] px-4 text-sm">
            Start a project
          </Link>
        </div>
      </div>
    </header>
  )
}
