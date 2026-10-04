import type { Metadata } from 'next'
import { CaseStudies } from '@/components/sections/case-studies'
import { ContactConsole } from '@/components/sections/contact-console'
import { FieldLog } from '@/components/sections/field-log'
import { Hero } from '@/components/sections/hero'
import { Products } from '@/components/sections/products'
import { Rack } from '@/components/sections/rack'
import { RouteLine } from '@/components/sections/route-line'
import { Stack } from '@/components/sections/stack'

// The layout's metadata has no canonical (it would leak to the 404 page), so
// the homepage sets its own.
export const metadata: Metadata = { alternates: { canonical: '/' } }

// Section order: the Lobby Rack contract (.impeccable/surfaces/app-page-tsx.md).
// The brochure opens (hero), his own products lead the work, then the rack of
// client work, the case studies, people and places, the route, the stack, and
// the reply card.
export default function HomePage() {
  return (
    <>
      <Hero />
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
