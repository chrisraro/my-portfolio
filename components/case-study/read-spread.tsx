import type { ReactNode } from 'react'

interface ReadSpreadProps {
  /** Prose that comes before the rail when the page stacks (a flagship's brief). */
  lead?: ReactNode
  /** The preview rail. */
  rail?: ReactNode
  /** The rest of the prose leaf. */
  children: ReactNode
}

/**
 * A project page's open spread: the prose leaf on the left, held to about 70
 * characters a line, a fold crease, and the preview rail on the right, sticky
 * 96px from the top. Below 1024px it stacks: lead, rail, then the rest, so a
 * flagship shows the site after "The brief" and a short page (no lead) shows
 * it straight after the header.
 */
export function ReadSpread({ lead, rail, children }: ReadSpreadProps) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 md:py-16">
      <div className="grid lg:grid-cols-[minmax(0,36rem)_1px_minmax(0,1fr)] lg:gap-x-12">
        {lead && <div className="max-w-[36rem] lg:col-start-1 lg:row-start-1">{lead}</div>}
        {rail && (
          <div className={lead ? 'my-12 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:my-0' : 'mb-12 lg:col-start-3 lg:row-start-1 lg:mb-0'}>
            <div className="lg:sticky lg:top-24">{rail}</div>
          </div>
        )}
        {rail && <span aria-hidden="true" className="crease-v hidden lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:block" />}
        <div className={lead ? 'max-w-[36rem] lg:col-start-1 lg:row-start-2 lg:mt-14' : 'max-w-[36rem] lg:col-start-1 lg:row-start-1'}>
          {children}
        </div>
      </div>
    </div>
  )
}
