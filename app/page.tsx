import type { ReactNode } from 'react'
import { Hero } from '@/components/sections/hero'
import { Products } from '@/components/sections/products'
import { Systems } from '@/components/sections/systems'
import { FieldLog } from '@/components/sections/field-log'
import { Changelog } from '@/components/sections/changelog'
import { Stack } from '@/components/sections/stack'
import { ContactSection } from '@/components/sections/contact-section'

// Pre-4.0 sections relied on the old page's max-w-4xl wrapper. Each keeps it
// until the task that replaces it; new sections manage their own width.
function LegacySlot({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-4xl px-4 sm:px-6">{children}</div>
}

// Section order is final (spec §6). Tasks 7–11 each swap one slot.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Products />
      <Systems />
      <FieldLog />
      <Changelog />
      <Stack />
      <LegacySlot>
        <ContactSection />
      </LegacySlot>
    </>
  )
}
