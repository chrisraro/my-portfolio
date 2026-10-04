import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { RackCard } from '@/components/ui/rack-card'
import { SectionHeading } from '@/components/ui/section-heading'
import { edgeCode, groupForHomepage, homepageOrder } from '@/lib/board'
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
        {groups.map((group) => {
          const id = `rack-${group.heading.toLowerCase().replace(/\s+/g, '-')}`
          return (
            <section key={group.heading} aria-labelledby={id} className="min-w-0">
              <h3 id={id} className="edge-code mb-5 text-sm text-ink sm:mb-8">
                {group.heading}
                <span className="text-muted"> · {group.projects.length}</span>
              </h3>
              <ul className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 pt-2 [scroll-padding-inline:1.25rem] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-3 sm:gap-x-6 sm:gap-y-14 sm:overflow-visible sm:p-0 lg:grid-cols-4">
                {group.projects.map((project, i) => (
                  <RackCard
                    key={project.id}
                    project={project}
                    code={edgeCode(order.indexOf(project) + 1, order.length, project.band)}
                    column={i % 4}
                  />
                ))}
              </ul>
            </section>
          )
        })}
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
