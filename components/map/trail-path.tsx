import { cn } from '@/lib/utils'

interface TrailPathProps {
  d: string
  viewBox: string
  /**
   * load: draws once as the page loads (the trailhead). view: draws as its
   * own box scrolls into view (a segment between sections). Outside the
   * motion gates both are simply fully drawn.
   */
  mode: 'load' | 'view'
  className?: string
}

// The red trail (spec §4, "draw"). pathLength="1" lets the CSS draw it with a
// unit dash (app/globals.css, .trail-draw).
export function TrailPath({ d, viewBox, mode, className }: TrailPathProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={cn('pointer-events-none absolute inset-0 h-full w-full text-trail', mode === 'view' && 'trail-view', className)}
      fill="none"
    >
      {/* No vector-effect here: non-scaling-stroke makes Chromium ignore the pathLength-based dash offset, so the trail would never draw. */}
      <path
        d={d}
        pathLength={1}
        className={cn('trail-draw', mode === 'load' ? 'trail-draw--load' : 'trail-draw--view')}
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="round"
      />
    </svg>
  )
}
