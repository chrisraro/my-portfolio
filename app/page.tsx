import type { Metadata } from 'next'
import { CaseStudies } from '@/components/sections/case-studies'
import { ContactConsole } from '@/components/sections/contact-console'
import { FieldLog } from '@/components/sections/field-log'
import { Products } from '@/components/sections/products'
import { Rack } from '@/components/sections/rack'
import { RouteLine } from '@/components/sections/route-line'
import { Stack } from '@/components/sections/stack'
import { Trailhead } from '@/components/sections/trailhead'

// The layout's metadata has no canonical (it would leak to the 404 page), so
// the homepage sets its own.
export const metadata: Metadata = { alternates: { canonical: '/' } }

// Section order: the Isarog Trail Map contract (.impeccable/surfaces/app-page-tsx.md,
// spec §5). S2 replaces the Portfolio 4.0 sections one task at a time; until
// its replacement lands, an old section keeps its place.
export default function HomePage() {
  return (
    <>
      <Trailhead />
      <Products />
      <Rack />
      <CaseStudies />
      <FieldLog />
      <RouteLine />
      <Stack />
      <ContactConsole />
    </>
  )
}
