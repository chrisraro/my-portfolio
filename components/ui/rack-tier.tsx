import { RackCard } from '@/components/ui/rack-card'
import { edgeCode } from '@/lib/board'
import { hasFullShot } from '@/lib/project-page'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'

interface RackTierProps {
  heading: string
  projects: Project[]
  /** The strip the edge codes count over: a card's number is its place in it. */
  order: Project[]
  /** h3 on the homepage, where the section title is the h2; h2 on /projects. */
  headingLevel: 'h2' | 'h3'
  /** Cards sunk in pockets (the default), or standing whole on the shelf. */
  sunk?: boolean
}

/**
 * One tier of the lobby rack: an edge-code label with its count, then a row of
 * pockets on a lip (4 per row at 1024px, 3 at 640px, a scroll-snap strip of
 * unsunk cards below). The shelf leaves room above and between rows for a
 * lifted card (.rack-shelf / .rack-row). An open tier (/projects' Products)
 * stands its cards whole, and a tier of flat cards never lifts, so neither
 * reserves the lift (.rack-row--open). Shared by the homepage rack
 * and /projects.
 */
export function RackTier({ heading, projects, order, headingLevel: Heading, sunk = true }: RackTierProps) {
  const id = `rack-${heading.toLowerCase().replace(/\s+/g, '-')}`
  // Only a sunk card with a preview lifts; a row with none reserves no lift.
  const lifts = sunk && projects.some(hasFullShot)
  return (
    <section aria-labelledby={id} className="rack-shelf defer-render-lift min-w-0">
      <Heading id={id} className="edge-code mb-5 text-sm text-ink sm:mb-8">
        {heading}
        <span className="text-muted"> · {projects.length}</span>
      </Heading>
      <ul className={cn('rack-row', !lifts && 'rack-row--open', '-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 pt-2 [scroll-padding-inline:1.25rem] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-3 sm:gap-x-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4')}>
        {projects.map((project, i) => (
          <RackCard
            key={project.id}
            project={project}
            code={edgeCode(order.indexOf(project) + 1, order.length, project.band)}
            column={i % 4}
            sunk={sunk}
          />
        ))}
      </ul>
    </section>
  )
}
