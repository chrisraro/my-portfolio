import type { ReactNode } from 'react'
import { SECTION } from '@/components/ui/grid'
import { formatIsoDate } from '@/lib/dates'
import { cn } from '@/lib/utils'

interface PageIntroProps {
  eyebrow: string
  /** The page's one h1. */
  title: string
  /** The 40-60 word answer that opens the page (spec §6, citability). */
  answer: string
  /** ISO date the copy was last checked, e.g. '2026-11-20'. */
  updated: string
  /** The page's actions, set under the answer. */
  children?: ReactNode
}

/**
 * How /services, a service page, /about and /hire open (spec §6): the eyebrow,
 * the h1, then a self-contained answer a search or AI engine can quote whole,
 * and the date it was last checked. The answer is ink, not muted: it is the
 * page's first claim, not a lede under it.
 */
export function PageIntro({ eyebrow, title, answer, updated, children }: PageIntroProps) {
  return (
    <header className={cn(SECTION, 'pb-12 pt-12 md:pb-16 md:pt-16')}>
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h1 className="text-page-h1 max-w-[18ch] text-ink">{title}</h1>
      <p className="text-lede mt-6 max-w-[40rem] text-ink">{answer}</p>
      <p className="map-label tabular mt-4 text-muted">
        Updated <time dateTime={updated}>{formatIsoDate(updated)}</time>
      </p>
      {children && <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">{children}</div>}
    </header>
  )
}
