import type { CSSProperties } from 'react'
import { heroContent } from '@/lib/data'
import { splitProofPoint } from '@/lib/proof'

// The hero's back panel: each proof point owns one cell, a large plain numeral
// over its label. Screen readers hear the original sentence ("Four payment
// gateways"), not a bare "4"; the numeral and label are visual only.
export function ProofBand() {
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-6">
      {heroContent.proofPoints.map((point, i) => {
        const { value, label } = splitProofPoint(point)
        return (
          <li
            key={point}
            className="hero-proof-item flex flex-col border-t border-line pt-3"
            style={{ '--i': i } as CSSProperties}
          >
            <span className="sr-only">{point}</span>
            <span aria-hidden="true" className="text-numeral text-ink">
              {value}
            </span>
            <span aria-hidden="true" className="mt-1.5 text-sm leading-snug text-muted-strong">
              {label}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
