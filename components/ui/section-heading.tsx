import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  /** id for the h2, referenced by the section's aria-labelledby. */
  id: string
  title: string
  className?: string
}

// The heading every section shares: the h2 in the section-title style, 40px
// above the content. Nothing sits over it: the heading carries its own weight
// (impeccable craft floor). Copy comes from lib/data.ts.
export function SectionHeading({ id, title, className }: SectionHeadingProps) {
  return (
    <h2 id={id} className={cn('text-section mb-8 text-ink', className)}>
      {title}
    </h2>
  )
}

/**
 * The heading of a list on the homepage: a quiet line with its count at the
 * far end, over the list's first rule.
 */
export function ListHeading({ id, title, count }: { id: string; title: string; count?: number }) {
  return (
    <div className="flex items-baseline justify-between border-b border-line pb-3">
      <h2 id={id} className="text-list text-ink">
        {title}
      </h2>
      {count !== undefined && <span className="tabular text-sm text-muted">{count}</span>}
    </div>
  )
}
