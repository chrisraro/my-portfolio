import type { Metadata } from 'next'
import { ClientWork } from '@/components/sections/client-work'
import { Contact } from '@/components/sections/contact'
import { Editorials } from '@/components/sections/editorials'
import { Experience } from '@/components/sections/experience'
import { Featured } from '@/components/sections/featured'
import { FieldNotes } from '@/components/sections/field-notes'
import { GithubActivity } from '@/components/sections/github-activity'
import { Hero } from '@/components/sections/hero'
import { Stack } from '@/components/sections/stack'

// The layout's metadata has no canonical (it would leak to the 404 page), so
// the homepage sets its own.
export const metadata: Metadata = { alternates: { canonical: '/' } }

// The storefront, top to bottom: the cover, his own products, the client
// catalogue, the case studies, people and places, where he has worked, a year
// of GitHub (only with GITHUB_TOKEN), the stack, and the way in.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Featured />
      <ClientWork />
      <Editorials />
      <FieldNotes />
      <Experience />
      <GithubActivity />
      <Stack />
      <Contact />
    </>
  )
}
