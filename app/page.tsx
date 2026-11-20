import type { Metadata } from 'next'
import { CaseStudies } from '@/components/sections/case-studies'
import { ContactConsole } from '@/components/sections/contact-console'
import { ElevationStrip } from '@/components/sections/elevation-strip'
import { Fork } from '@/components/sections/fork'
import { OwnProducts } from '@/components/sections/own-products'
import { Rack } from '@/components/sections/rack'
import { Trailhead } from '@/components/sections/trailhead'

// The layout's metadata has no canonical (it would leak to the 404 page), so
// the homepage sets its own.
export const metadata: Metadata = { alternates: { canonical: '/' } }

// Section order: the Isarog Trail Map contract (.impeccable/surfaces/app-page-tsx.md,
// spec §5). S2 replaces the Portfolio 4.0 sections one task at a time; the rack
// holds the field map's place until Task 10.
export default function HomePage() {
  return (
    <>
      <Trailhead />
      <ElevationStrip />
      <Fork />
      <Rack />
      <OwnProducts />
      <CaseStudies />
      <ContactConsole />
    </>
  )
}
