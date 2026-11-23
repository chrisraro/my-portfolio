import { PhilippinesOutline } from '@/components/map/philippines-outline'
import { Pin } from '@/components/map/pin'
import { MAP_VIEWBOX } from '@/lib/geo'
import type { PlaceGroup } from '@/lib/places'

interface PlaceMapProps {
  places: PlaceGroup[]
  /** Where a place's pin leads: a project page on the homepage, a plate on /projects. */
  hrefFor: (group: PlaceGroup) => string
}

/**
 * The Philippines on survey paper with a pin at each verified place (spec §5),
 * in the projection lib/geo.ts shares with the outline. Decorative to the
 * accessibility tree: the list beside it names and links every project.
 */
export function PlaceMap({ places, hrefFor }: PlaceMapProps) {
  return (
    <svg viewBox={MAP_VIEWBOX} aria-hidden="true" focusable="false" className="block h-auto w-full">
      <PhilippinesOutline />
      {places.map((group) => (
        <Pin key={group.name} group={group} href={hrefFor(group)} />
      ))}
    </svg>
  )
}
