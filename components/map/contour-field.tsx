import { cn } from '@/lib/utils'

interface ContourFieldProps {
  paths: string[]
  viewBox: string
  className?: string
}

// Survey contours behind a section. Decorative: hidden from assistive tech.
export function ContourField({ paths, viewBox, className }: ContourFieldProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={cn('pointer-events-none absolute inset-0 h-full w-full text-contour', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
    >
      {paths.map((d) => (
        <path key={d} d={d} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  )
}
