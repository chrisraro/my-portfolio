import { heroContent } from '@/lib/data'
import { splitProofPoint } from '@/lib/proof'

// Screen readers hear the original sentence ("Fifteen projects shipped"), not
// "zero one five"; the numeral and label are visual only.
export function ProofBand() {
  return (
    <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-4">
      {heroContent.proofPoints.map((point) => {
        const { value, label } = splitProofPoint(point)
        return (
          <li key={point} className="flex flex-col bg-canvas px-4 py-4">
            <span className="sr-only">{point}</span>
            <span aria-hidden="true" className="font-mono text-3xl font-medium text-ink">
              {value}
            </span>
            <span aria-hidden="true" className="mt-1 text-sm text-muted">
              {label}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
