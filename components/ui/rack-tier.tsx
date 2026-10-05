import { RackCard } from '@/components/ui/rack-card'
import type { CSSProperties } from 'react'
import { edgeCode } from '@/lib/board'
import { tierTransitionName } from '@/lib/view-transition'
import type { Project } from '@/types'

interface RackTierProps {
  heading: string
  projects: Project[]
  /** The strip the edge codes count over: a card's number is its place in it. */
  order: Project[]
  /** h3 on the homepage, where the section title is the h2; h2 on /projects. */
  headingLevel: 'h2' | 'h3'
}

/**
 * One tier of the lobby rack: an edge-code label with its count, then a row of
 * cards standing on a lip (4 per row at 1024px, 3 at 640px, a scroll-snap
 * strip below). From 640px the row staggers in once as it scrolls into view
 * (.reveal-stagger). Shared by the homepage rack and /projects.
 */
export function RackTier({ heading, projects, order, headingLevel: Heading }: RackTierProps) {
  const id = `rack-${heading.toLowerCase().replace(/\s+/g, '-')}`
  return (
    <section
      aria-labelledby={id}
      className="rack-shelf defer-render-lift min-w-0"
      // Names the tier heading while a /projects filter re-lays the rack out (.vt-filter).
      style={{ '--vt-tier': tierTransitionName(heading) } as CSSProperties}
    >
      <Heading id={id} className="edge-code mb-5 text-sm text-ink sm:mb-8">
        {heading}
        <span className="text-muted"> · {projects.length}</span>
      </Heading>
      <ul className="rack-row -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 pt-2 [scroll-padding-inline:1.25rem] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-3 sm:gap-x-6 sm:gap-y-14 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
        {projects.map((project, i) => (
          <RackCard
            key={project.id}
            project={project}
            code={edgeCode(order.indexOf(project) + 1, order.length, project.band)}
            index={i}
          />
        ))}
      </ul>
    </section>
  )
}
