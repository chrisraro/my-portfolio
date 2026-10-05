import { cn } from '@/lib/utils'

// The mark: a two-panel brochure. C sits on the amber front panel; R on a flap
// hinged at the crease, its free edge receding as it unfolds (the hero's
// unfold, held still). Letterforms are drawn paths, not type, on a 32 grid.
// The crease is a real gap, so the canvas shows through in either theme.
// Fills are theme tokens: the amber plane with on-accent ink, the one fold
// shade an on-accent wash over the flap. app/icon.svg is the same geometry in
// fixed dark-theme hex, for renderers that cannot read the page's tokens.
export const BRAND_FRONT = 'M5 3.5 H16 V28.5 H5 A1.5 1.5 0 0 1 3.5 27 V5 A1.5 1.5 0 0 1 5 3.5 Z'
export const BRAND_FLAP = 'M17.25 3.5 L28.5 5 V27 L17.25 28.5 Z'
export const BRAND_C = 'M13.75 11 H8.75 A3 3 0 0 0 5.75 14 V22 A3 3 0 0 0 8.75 25 H13.75 V22 H9 V14 H13.75 Z'
export const BRAND_R =
  'M18.5 11 H23 A4 4 0 0 1 24.6 18.67 L27.75 25 H24.5 L21.75 19 H21.5 V25 H18.5 Z M21.5 13.75 V16.75 H23 A1.5 1.5 0 0 0 23 13.75 Z'

const plane = { fill: 'oklch(var(--accent-plane))' }
const ink = { fill: 'oklch(var(--on-accent))' }

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="2.5 2.5 27 27"
      className={cn('h-8 w-8 shrink-0', className)}
    >
      <path d={BRAND_FRONT} style={plane} />
      <path d={BRAND_FLAP} style={plane} />
      <path d={BRAND_FLAP} style={ink} fillOpacity={0.14} />
      <path d={BRAND_C} style={ink} />
      <path d={BRAND_R} style={ink} fillRule="evenodd" />
    </svg>
  )
}
