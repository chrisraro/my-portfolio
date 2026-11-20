import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  /** id for the h2, referenced by the section's aria-labelledby. */
  id: string
  title: string
  className?: string
}

// The heading every section shares: the h2 in the section-title style, 40px
// above the content. Nothing sits over it: the heading carries its own weight
// (impeccable craft floor). Copy comes from lib/data.ts. text-section stays out
// of cn(): tailwind-merge reads it as a text colour and drops it next to text-ink.
export function SectionHeading({ id, title, className }: SectionHeadingProps) {
  return (
    <h2 id={id} className={`text-section text-ink ${cn('mb-10', className)}`}>
      {title}
    </h2>
  )
}
