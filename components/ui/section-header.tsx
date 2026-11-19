import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  id: string
  label: string
  title: string
  /** A count or a link, set on the heading's baseline at the right. */
  aside?: ReactNode
  className?: string
}

// Every section opens the same way: a small label, then the serif title.
export function SectionHeader({ id, label, title, aside, className }: SectionHeaderProps) {
  return (
    <div className={cn('reveal mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 md:mb-12', className)}>
      <div>
        <p className="label mb-3">{label}</p>
        <h2 id={id} className="display-lg">
          {title}
        </h2>
      </div>
      {aside}
    </div>
  )
}
