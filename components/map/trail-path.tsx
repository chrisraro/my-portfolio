import { cn } from '@/lib/utils'

interface TrailPathProps {
  d: string
  viewBox: string
  className?: string
}

// The red trail (spec §4, "draw"). pathLength="1" lets the CSS draw it with a
// unit dash; outside the motion gates it is simply fully drawn.
export function TrailPath({ d, viewBox, className }: TrailPathProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={cn('pointer-events-none absolute inset-0 h-full w-full text-trail', className)}
      fill="none"
    >
      {/* No vector-effect here: non-scaling-stroke makes Chromium ignore the pathLength-based dash offset, so the trail would never draw. */}
      <path
        d={d}
        pathLength={1}
        className="trail-draw"
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="round"
      />
    </svg>
  )
}
