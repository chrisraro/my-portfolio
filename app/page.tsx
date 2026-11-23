import type { Metadata } from 'next'
import { JsonLd } from '@/components/json-ld'
import { Experience } from '@/components/sections/experience'
import { Intro } from '@/components/sections/intro'
import { NowBuilding } from '@/components/sections/now-building'
import { PlanTheRoute } from '@/components/sections/plan-the-route'
import { StackTable } from '@/components/sections/stack-table'
import { CaseStudyList, WorkList } from '@/components/sections/work-list'
import { Places, WorkWithMe } from '@/components/sections/work-with-me'
import { buildRouteMetadata } from '@/lib/site-metadata'
import { graphFor } from '@/lib/structured-data'

// The layout's metadata has no canonical (it would leak to the 404 page), so
// the homepage sets its own, with its title, description and card.
export const metadata: Metadata = buildRouteMetadata('/')

// One reading column, from who he is to how to reach him. Section order: the
// direction contract (.impeccable/surfaces/app-page-tsx.md).
export default function HomePage() {
  return (
    <>
      <JsonLd data={graphFor('/')} />
      <Intro />
      <NowBuilding />
      <Experience />
      <CaseStudyList />
      <WorkList />
      <Places />
      <WorkWithMe />
      <StackTable />
      <PlanTheRoute />
    </>
  )
}
