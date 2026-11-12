import type { CSSProperties } from 'react'
import { heroContent } from '@/lib/data'
import { splitProofPoint } from '@/lib/proof'
import { cn } from '@/lib/utils'

// The hero's proof strip: each proof point owns one cell, a plain numeral
// beside its label, the two side by side at every width. Screen readers hear the original sentence ("Four products of my
// own"), not a bare "4"; the numeral and label are visual only.
export function ProofBand({ className }: { className?: string }) {
  return (
    <ul className={cn('grid grid-cols-2 gap-x-6 gap-y-6', className)}>
      {heroContent.proofPoints.map((point, i) => {
        const { value, label } = splitProofPoint(point)
        return (
          <li
            key={point}
            className="hero-proof-item flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4"
            style={{ '--i': i } as CSSProperties}
          >
            <span className="sr-only">{point}</span>
            <span aria-hidden="true" className="text-numeral text-ink">
              {value}
            </span>
            <span aria-hidden="true" className="text-base leading-snug text-muted-strong sm:pb-1">
              {label}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
