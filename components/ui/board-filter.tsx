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
      {/* Index tabs on the rack's lip: the current tier is a magenta plane, the rest paper. */}
      <ul className="flex flex-wrap gap-x-1.5 gap-y-2 border-b-2 border-line-strong">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={cn(
                'button-label inline-flex min-h-[44px] items-center rounded-b-none rounded-t px-4 text-sm transition-colors',
                item.current
                  ? 'border border-b-0 border-transparent bg-accent text-on-accent'
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
