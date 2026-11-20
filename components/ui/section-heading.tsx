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
    <h2 id={id} className={cn('text-section mb-10 text-ink', className)}>
      {title}
    </h2>
  )
}
