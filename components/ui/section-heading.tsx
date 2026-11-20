import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  /** id for the h2, referenced by the section's aria-labelledby. */
  id: string
  eyebrow: string
  title: string
  className?: string
}

// The heading stack every homepage section shares: eyebrow, 12px, the h2 in the section-title style, 40px.
// Copy comes from lib/data.ts.
export function SectionHeading({ id, eyebrow, title, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-10', className)}>
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 id={id} className="text-section text-ink">
        {title}
      </h2>
    </div>
  )
}
