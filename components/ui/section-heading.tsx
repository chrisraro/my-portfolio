import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  /** id for the h2, referenced by the section's aria-labelledby. */
  id: string
  eyebrow: string
  title: string
  /** Visual-only detail after the title (a count, an index), kept out of the heading's name. */
  aside?: ReactNode
  className?: string
}

// The heading stack every homepage section shares: eyebrow, 12px, h2, 40px.
// Copy comes from lib/data.ts.
export function SectionHeading({ id, eyebrow, title, aside, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-10', className)}>
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 id={id} className="text-fluid-h2 text-ink">
        {title}
        {aside && (
          <span aria-hidden="true" className="edge-code ml-4 align-middle text-sm font-medium text-muted [font-variation-settings:'wdth'_100]">
            {aside}
          </span>
        )}
      </h2>
    </div>
  )
}
