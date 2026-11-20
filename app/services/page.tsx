import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { PlanTheRoute } from '@/components/sections/plan-the-route'
import { SECTION } from '@/components/ui/grid'
import { PageIntro } from '@/components/ui/page-intro'
import { TrailLink } from '@/components/ui/trail-link'
import { ctaLabels, pagesUpdated, servicePages, servicesPageContent } from '@/lib/data'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: servicesPageContent.title,
  description: servicesPageContent.answer,
  alternates: { canonical: '/services' },
}

// The business path from the fork (spec §5): the three services, each a card
// with its name, one line and how many shipped projects prove it, then the
// form. Persuade: the answer, the services, the way to start.
export default function ServicesPage() {
  const c = servicesPageContent

  return (
    <>
      <PageIntro eyebrow={c.eyebrow} title={c.heading} answer={c.answer} updated={pagesUpdated}>
        <a href="#contact" className="press button-primary">
          {ctaLabels.startProject}
          <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
        </a>
      </PageIntro>

      <ul className={cn(SECTION, 'grid gap-6 pb-[72px] md:grid-cols-3 md:pb-[112px]')}>
        {servicePages.map((s) => (
          <li key={s.slug} className="flex flex-col rounded border border-line bg-panel p-6 sm:p-8">
            <h2 className="text-title text-ink">{s.name}</h2>
            <p className="mt-4 leading-relaxed text-muted-strong">{s.summary}</p>
            <p className="map-label tabular mt-4 text-muted">{`${s.projectIds.length} projects`}</p>
            <div className="mt-auto pt-6">
              <TrailLink href={`/services/${s.slug}`} text={ctaLabels.readMore} srText={` about ${s.name}`} />
            </div>
          </li>
        ))}
      </ul>

      <PlanTheRoute />
    </>
  )
}
