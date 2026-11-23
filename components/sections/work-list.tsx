import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ListHeading } from '@/components/ui/section-heading'
import { SECTION } from '@/components/ui/grid'
import { ProjectRow } from '@/components/ui/project-row'
import { catalogOrder } from '@/lib/board'
import { FLAGSHIP_SLUGS, briefLead, getCaseStudy } from '@/lib/case-studies'
import { projects, sectionContent } from '@/lib/data'
import { hasFullShot } from '@/lib/project-page'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'

/** How many rows of other work the homepage shows before "All projects". */
export const MORE_ROWS = 6

/** Case studies, in reading order: what each client needed, in their brief's first sentence. */
export function CaseStudyList() {
  const rows = FLAGSHIP_SLUGS.flatMap((slug): { project: Project; lead: string }[] => {
    const project = projects.find((p) => p.slug === slug)
    const study = getCaseStudy(slug)
    return project && study ? [{ project, lead: briefLead(study) }] : []
  })

  return (
    <section id="journals" aria-labelledby="journals-title" className={cn(SECTION, 'pt-24')}>
      <ListHeading id="journals-title" title={sectionContent.journals.title} count={rows.length} />
      <ul className="rows">
        {rows.map(({ project, lead }) => (
          <ProjectRow key={project.id} project={project} text={lead} />
        ))}
      </ul>
    </section>
  )
}

/** The rest of the work that has a screen to show, then the way to all of it. */
export function WorkList() {
  const rest = catalogOrder(projects, hasFullShot)
    .filter((p) => FLAGSHIP_SLUGS.indexOf(p.slug) === -1 && p.status !== 'in-development' && p.band !== 'Custom systems')
  const rows = [...rest.filter((p) => p.band === 'Sites'), ...rest.filter((p) => p.band !== 'Sites')].slice(0, MORE_ROWS)

  return (
    <section id="work" aria-labelledby="work-title" className={cn(SECTION, 'pt-24')}>
      <ListHeading id="work-title" title={sectionContent.work.title} />
      <ul className="rows">
        {rows.map((p) => (
          <ProjectRow key={p.id} project={p} />
        ))}
      </ul>
      <p className="mt-6 flex justify-center">
        <Link href="/projects" className="press button-secondary">
          {sectionContent.work.cta}
          <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
        </Link>
      </p>
    </section>
  )
}
