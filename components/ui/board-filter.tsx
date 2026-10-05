import Link from 'next/link'
import { bandSlug } from '@/lib/board'
import { cn } from '@/lib/utils'
import { BAND_ORDER, type ProjectBand } from '@/types'

// Plain links, not client state: filtering needs no JavaScript and every
// filtered view has a URL you can share.
export function BoardFilter({ active }: { active: ProjectBand | null }) {
  const items = [
    { label: 'All', href: '/projects', current: active === null },
    ...BAND_ORDER.map((band) => ({
      label: band,
      href: `/projects?band=${bandSlug(band)}`,
      current: active === band,
    })),
  ]

  return (
    <nav aria-label="Filter projects by band">
      {/* Index tabs on the rack's lip: the current tier is an amber plane, the
       * rest paper. One row that scrolls sideways on a narrow screen, so every
       * tab stands on the lip (a wrapped second row floated above it). */}
      <ul className="flex gap-x-1.5 overflow-x-auto border-b-2 border-line-strong [scrollbar-width:none]">
        {items.map((item) => (
          // The current tab scrolls itself into the row on load (where supported).
          <li key={item.label} className={cn('shrink-0', item.current && '[scroll-initial-target:nearest]')}>
            <Link
              href={item.href}
              // /projects reads ?band=, so it is dynamic: fetch each filtered
              // view in full ahead, or a tab click waits on the server.
              prefetch
              // "true", not "page": every tab is the same page, filtered.
              aria-current={item.current ? 'true' : undefined}
              className={cn(
                // The ring is drawn inward: the scrolling row would clip one drawn outside.
                'button-label inline-flex min-h-[44px] items-center whitespace-nowrap rounded-b-none rounded-t px-4 text-sm transition-colors focus-visible:outline-offset-[-3px]',
                item.current
                  ? 'border border-b-0 border-transparent bg-accent-plane text-on-accent focus-visible:outline-on-accent'
                  : 'border border-b-0 border-line bg-panel text-muted-strong hover:text-ink',
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
