import type { Metadata } from 'next'
import { TrailSegment } from '@/components/map/trail-segment'
import { ElevationStrip } from '@/components/sections/elevation-strip'
import { FieldMap } from '@/components/sections/field-map'
import { Fork } from '@/components/sections/fork'
import { OwnProducts } from '@/components/sections/own-products'
import { PlanTheRoute } from '@/components/sections/plan-the-route'
import { TrailJournals } from '@/components/sections/trail-journals'
import { Trailhead } from '@/components/sections/trailhead'
import { buildRouteMetadata } from '@/lib/site-metadata'

// The layout's metadata has no canonical (it would leak to the 404 page), so
// the homepage sets its own, with its title, description and card.
export const metadata: Metadata = buildRouteMetadata('/')

// Section order: the Isarog Trail Map contract (.impeccable/surfaces/app-page-tsx.md,
// spec §5). The trail leaves the trailhead's plate on load; below the
// elevation strip (the trailhead's bottom edge) a short segment draws between
// each pair of sections as it scrolls into view.
export default function HomePage() {
  return (
    <>
      <Trailhead />
      <ElevationStrip />
      <TrailSegment variant={0} />
      <Fork />
      <TrailSegment variant={1} />
      <FieldMap />
      <TrailSegment variant={0} />
      <OwnProducts />
      <TrailSegment variant={1} />
      <TrailJournals />
      <TrailSegment variant={0} />
      <PlanTheRoute />
    </>
  )
}
