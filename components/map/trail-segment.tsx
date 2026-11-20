import { TrailPath } from '@/components/map/trail-path'
import { trailSegments } from '@/lib/contours'

interface TrailSegmentProps {
  /** 0 runs right to left, 1 left to right. */
  variant: 0 | 1
}

// A short stretch of the red trail between two homepage sections (spec §4):
// it draws as it scrolls into view. Decorative.
export function TrailSegment({ variant }: TrailSegmentProps) {
  const segment = trailSegments[variant]
  return (
    <div aria-hidden="true" className="relative mx-auto h-20 max-w-6xl md:h-28">
      <TrailPath mode="view" d={segment.d} viewBox={segment.viewBox} />
    </div>
  )
}
