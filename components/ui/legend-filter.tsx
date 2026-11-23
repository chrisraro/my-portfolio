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
      <ul className="glass flex w-fit max-w-full overflow-x-auto rounded-full p-1 [scrollbar-width:none]">
        {items.map((item) => (
          <li
            key={item.label}
            className={cn('shrink-0', item.current && '[scroll-initial-target:nearest]')}
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
                'relative inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-offset-[-3px]',
                item.current ? 'bg-ink/10 text-ink' : 'text-muted-strong hover:text-ink',
              )}
            >
              <span
                aria-hidden="true"
                className={cn('h-1.5 w-1.5 shrink-0 rounded-full', item.current ? 'bg-trail' : 'bg-line-strong')}
              />
              {item.label}
              <span className="tabular text-muted">{item.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
