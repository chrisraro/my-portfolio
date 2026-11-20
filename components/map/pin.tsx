import { project as toMap } from '@/lib/geo'
import type { PlaceGroup } from '@/lib/places'
import type { PlacePrecision } from '@/types'

// Where a place's label sits beside its pin, in map units (layout, not
// content). Naga City's and Bicol's centres are about 19 units apart, so their
// labels go opposite ways; a region's ring is wider than a city's dot.
export const LABELS: Record<string, { dx: number; dy: number; anchor: 'start' | 'end' }> = {
  'Naga City': { dx: -14, dy: -10, anchor: 'end' },
  Bicol: { dx: 26, dy: 20, anchor: 'start' },
  Palawan: { dx: 26, dy: 8, anchor: 'start' },
}
const DEFAULT_LABEL = { dx: 14, dy: 7, anchor: 'start' as const }

/**
 * One pin: a ring for a region, a dot for a city, and the place's name. A real
 * link, for crawlers and pointers: on the homepage to the place's first
 * project page, on /projects to its plate in the list. It is out of the tab
 * order and the accessibility tree because the list beside the map links the
 * same projects (one link per project for keyboard and screen readers).
 */
export function Pin({ group, href }: { group: PlaceGroup; href: string }) {
  const { x, y } = toMap(group.lat, group.lng)
  const label = LABELS[group.name] ?? DEFAULT_LABEL
  return (
    <a href={href} tabIndex={-1} aria-hidden="true" className="map-pin">
      {group.precision === 'region' ? (
        <circle cx={x} cy={y} r={18} className="map-ring fill-none stroke-ink" strokeWidth={2} strokeDasharray="4 3" />
      ) : (
        <circle cx={x} cy={y} r={6} className="map-dot fill-ink" />
      )}
      <text x={Math.round(x + label.dx)} y={Math.round(y + label.dy)} textAnchor={label.anchor} className="map-label fill-ink text-[22px]">
        {group.name}
      </text>
    </a>
  )
}

/** The pin's glyph again, as the key beside a place in a list. */
export function PlaceGlyph({ precision }: { precision: PlacePrecision }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-ink">
      {precision === 'region' ? (
        <circle cx={8} cy={8} r={6} fill="none" stroke="currentColor" strokeWidth={1.5} strokeDasharray="3 2" />
      ) : (
        <circle cx={8} cy={8} r={3.5} fill="currentColor" />
      )}
    </svg>
  )
}
