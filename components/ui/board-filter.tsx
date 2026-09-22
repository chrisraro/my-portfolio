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
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={cn(
                'inline-flex min-h-[32px] items-center rounded border px-3 font-mono text-xs transition-colors',
                item.current
                  ? 'border-accent text-accent'
                  : 'border-line-strong text-muted-strong hover:border-accent hover:text-accent',
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
