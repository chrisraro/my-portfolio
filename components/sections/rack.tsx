import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { RackTier } from '@/components/ui/rack-tier'
import { SectionHeading } from '@/components/ui/section-heading'
import { groupForHomepage, homepageOrder } from '@/lib/board'
import { projects, sectionContent } from '@/lib/data'

/**
 * The lobby rack: every project that is not a product, in tiers ("Custom
 * systems", then "Client work", hospitality first). Each tier is a row of
 * pockets on a lip. Proof: no entrance hides it; the cards only drop the last
 * few pixels into their pockets as they scroll in (transform only).
 */
export function Rack() {
  const order = homepageOrder(projects)
  const groups = groupForHomepage(projects.filter((p) => p.band !== 'Products'))

  return (
    <section id="systems" aria-labelledby="systems-title" className="mx-auto max-w-6xl px-5 pb-[72px] sm:px-8 md:pb-[112px]">
      <SectionHeading id="systems-title" eyebrow={sectionContent.systems.eyebrow} title={sectionContent.systems.title} />
      <div className="grid gap-14 sm:gap-20">
        {groups.map((group) => (
          <RackTier key={group.heading} heading={group.heading} projects={group.projects} order={order} headingLevel="h3" />
        ))}
      </div>
      <p className="mt-10">
        <Link
          href="/projects"
          className="button-label inline-flex min-h-[44px] items-center gap-2 text-accent"
        >
          <span className="link-draw">{sectionContent.systems.cta}</span>
          <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
        </Link>
      </p>
    </section>
  )
}
