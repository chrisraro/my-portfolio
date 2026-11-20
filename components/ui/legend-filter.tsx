import Link from 'next/link'
import { bandSlug } from '@/lib/board'
import { cn } from '@/lib/utils'
import { BAND_ORDER, type Project, type ProjectBand } from '@/types'

interface LegendFilterProps {
  active: ProjectBand | null
  /** The whole inventory: each key counts its band in it. */
  projects: readonly Project[]
}

/**
 * The /projects filter as a map legend's key (spec §3): one segmented row,
 * All then each band, each key with its count. Plain links over ?band=, not
 * client state: filtering needs no JavaScript and every view has a URL to
 * share. The current key is where you are, the one place trail red appears in
 * the row: a filled dot and a bar under ink text, and aria-current. On a
 * narrow screen the row scrolls sideways and the current key scrolls into it.
 */
export function LegendFilter({ active, projects }: LegendFilterProps) {
  const items = [
    { label: 'All', href: '/projects', count: projects.length, current: active === null },
    ...BAND_ORDER.map((band) => ({
      label: band,
      href: `/projects?band=${bandSlug(band)}`,
      count: projects.filter((p) => p.band === band).length,
      current: active === band,
    })),
  ]

  return (
    <nav aria-label="Filter projects by band">
      <ul className="flex overflow-x-auto rounded-sm border border-line-strong bg-panel [scrollbar-width:none]">
        {items.map((item) => (
          <li
            key={item.label}
            className={cn('shrink-0 border-r border-line last:border-r-0', item.current && '[scroll-initial-target:nearest]')}
          >
            <Link
              href={item.href}
              // /projects reads ?band=, so it renders per request: fetch each
              // filtered view ahead, or a key click waits on the server.
              prefetch
              // "true", not "page": every key is the same page, filtered.
              aria-current={item.current ? 'true' : undefined}
              className={cn(
                // The ring is drawn inward: the scrolling row would clip one drawn outside.
                'map-label relative inline-flex min-h-[48px] items-center gap-2 whitespace-nowrap px-4 transition-colors focus-visible:outline-offset-[-3px]',
                item.current ? 'text-ink' : 'text-muted-strong hover:text-ink',
              )}
            >
              <span
                aria-hidden="true"
                className={cn('h-2.5 w-2.5 shrink-0 rounded-full border-2', item.current ? 'border-trail bg-trail' : 'border-ink')}
              />
              {item.label}
              <span className="tabular text-muted">{item.count}</span>
              {item.current && <span aria-hidden="true" className="absolute inset-x-3 bottom-0 h-[3px] bg-trail" />}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
