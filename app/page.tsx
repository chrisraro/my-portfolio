import type { Metadata } from 'next'
import { Changelog } from '@/components/sections/changelog'
import { ContactConsole } from '@/components/sections/contact-console'
import { FieldLog } from '@/components/sections/field-log'
import { Hero } from '@/components/sections/hero'
import { Products } from '@/components/sections/products'
import { Stack } from '@/components/sections/stack'
import { Systems } from '@/components/sections/systems'

// The layout's metadata has no canonical (it would leak to the 404 page), so
// the homepage sets its own.
export const metadata: Metadata = { alternates: { canonical: '/' } }

// Section order: spec §6. Products lead the work because three products of
// Christian's own are the differentiator the broad positioning rests on.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Products />
      <Systems />
      <FieldLog />
      <Changelog />
      <Stack />
      <ContactConsole />
    </>
  )
}
