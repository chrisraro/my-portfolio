import type { ReactNode } from 'react'
import { SECTION } from '@/components/ui/grid'
import { formatIsoDate } from '@/lib/dates'
import { cn } from '@/lib/utils'

interface PageIntroProps {
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
 * How /services, a service page, /about and /hire open (spec §6): 
 * the h1, then a self-contained answer a search or AI engine can quote whole,
 * and the date it was last checked. The answer is ink, not muted: it is the
 * page's first claim, not a lede under it.
 */
export function PageIntro({ title, answer, updated, children }: PageIntroProps) {
  return (
    <header className={cn(SECTION, 'pb-16 pt-12 lg:pt-24')}>
      <h1 className="text-page-h1 text-ink">{title}</h1>
      <p className="text-lede mt-4 text-ink">{answer}</p>
      <p className="tabular mt-4 text-sm text-muted">
        Updated <time dateTime={updated}>{formatIsoDate(updated)}</time>
      </p>
      {children && <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">{children}</div>}
    </header>
  )
}
