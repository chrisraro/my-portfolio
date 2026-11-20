import type { Metadata } from 'next'
import { ContactConsole } from '@/components/sections/contact-console'
import { ElevationStrip } from '@/components/sections/elevation-strip'
import { FieldMap } from '@/components/sections/field-map'
import { Fork } from '@/components/sections/fork'
import { OwnProducts } from '@/components/sections/own-products'
import { TrailJournals } from '@/components/sections/trail-journals'
import { Trailhead } from '@/components/sections/trailhead'

// The layout's metadata has no canonical (it would leak to the 404 page), so
// the homepage sets its own.
export const metadata: Metadata = { alternates: { canonical: '/' } }

// Section order: the Isarog Trail Map contract (.impeccable/surfaces/app-page-tsx.md,
// spec §5). The contact console holds the form's place until Task 12.
export default function HomePage() {
  return (
    <>
      <Trailhead />
      <ElevationStrip />
      <Fork />
      <FieldMap />
      <OwnProducts />
      <TrailJournals />
      <ContactConsole />
    </>
  )
}
