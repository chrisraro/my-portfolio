import { PlaceGlyph } from '@/components/map/pin'
import { sectionContent } from '@/lib/data'
import { cn } from '@/lib/utils'

/** The map's key (spec §3: ringed and dotted pins): a dot for a town or city, a ring for a region. */
export function MapKey({ className }: { className?: string }) {
  const { key } = sectionContent.fieldMap
  return (
    <ul className={cn('flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-strong', className)}>
      <li className="flex items-center gap-2">
        <PlaceGlyph precision="city" />
        {key.city}
      </li>
      <li className="flex items-center gap-2">
        <PlaceGlyph precision="region" />
        {key.region}
      </li>
    </ul>
  )
}
