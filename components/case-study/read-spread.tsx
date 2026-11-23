import type { ReactNode } from 'react'
import { SECTION_WIDE as SECTION } from '@/components/ui/grid'
import { cn } from '@/lib/utils'

interface ReadSpreadProps {
  /** Prose that comes before the rail when the page stacks (a flagship's brief). */
  lead?: ReactNode
  /** The screenshot rail. */
  rail?: ReactNode
  /** The rest of the prose. */
  children: ReactNode
}

/**
 * A project page's reading spread: the prose on the left, held to about 70
 * characters a line, and the screenshot rail on the right, sticky 96px from
 * the top, with open space between them, not a rule. Below 1024px it stacks:
 * lead, rail, then the rest, so a flagship shows the site after "The brief"
 * and a short page (no lead) shows it straight after the header.
 */
export function ReadSpread({ lead, rail, children }: ReadSpreadProps) {
  return (
    <div className={cn(SECTION, 'py-12 md:py-16')}>
      <div className="grid xl:grid-cols-[minmax(0,36rem)_minmax(0,1fr)] xl:gap-x-16">
        {lead && <div className="max-w-[36rem] xl:col-start-1 xl:row-start-1">{lead}</div>}
        {rail && (
          <div className={lead ? 'my-12 xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:my-0' : 'mb-12 xl:col-start-2 xl:row-start-1 xl:mb-0'}>
            <div className="xl:sticky xl:top-24">{rail}</div>
          </div>
        )}
        <div className={lead ? 'max-w-[36rem] xl:col-start-1 xl:row-start-2 xl:mt-14' : 'max-w-[36rem] xl:col-start-1 xl:row-start-1'}>
          {children}
        </div>
      </div>
    </div>
  )
}
