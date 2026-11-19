import Link from 'next/link'
import { Briefcase, Home, LayoutGrid, Mail, type LucideIcon } from 'lucide-react'
import { navigationItems } from '@/lib/data'
import { navHref } from '@/components/site-nav'

// One glyph per destination; a destination without one falls back to the grid.
const ICONS: Record<string, LucideIcon> = {
  '#work': Briefcase,
  '/projects': LayoutGrid,
  '#changelog': Home,
  '#contact': Mail,
}

/**
 * The phone's way around: a floating, frosted tab bar, as on iOS. It carries
 * the same destinations as the top bar's links, which are hidden below 768px.
 */
export function TabBar() {
  const items = navigationItems.filter((item) => item.href !== '#changelog')
  return (
    <nav
      aria-label="Sections"
      className="material fixed inset-x-0 bottom-3 z-40 mx-auto w-[min(22rem,calc(100%-1.5rem))] rounded-full border border-gray-line p-1.5 shadow-float md:hidden"
    >
      <ul className="grid grid-cols-4">
        <li>
          <Link href="/" className="flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-full text-[0.6875rem] font-medium active:bg-gray-fill">
            <Home aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
            Home
          </Link>
        </li>
        {items.map((item) => {
          const Icon = ICONS[item.href] ?? LayoutGrid
          return (
            <li key={item.href}>
              <Link
                href={navHref(item.href)}
                className="flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-full text-[0.6875rem] font-medium active:bg-gray-fill"
              >
                <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
