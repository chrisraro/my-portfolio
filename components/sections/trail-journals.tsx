import Link from 'next/link'
import type { CSSProperties } from 'react'
import { SECTION } from '@/components/ui/grid'
import { SectionHeading } from '@/components/ui/section-heading'
import { TrailLinkText, trailLinkClass } from '@/components/ui/trail-link'
import { edgeCode } from '@/lib/board'
import { FLAGSHIP_SLUGS, briefLead, getCaseStudy } from '@/lib/case-studies'
import { caseStudyContent, ctaLabels, projects, sectionContent, sectorNames } from '@/lib/data'
import { projectHref } from '@/lib/project-page'
import { cn } from '@/lib/utils'
import type { CaseStudy, Project } from '@/types'

interface Journal {
  project: Project
  study: CaseStudy
}

/** A journal's place line: where it runs, when its own words name the place. */
function placeLine(project: Project): string {
  return project.place ? `${project.place.name} · ${sectorNames[project.sector]}` : sectorNames[project.sector]
}

/**
 * The trail journals (spec §5): the six case studies in reading order. The
 * first lies open on the panel (its number, title, place, the brief's first
 * sentence, Christian's role) and lifts on hover like a plate; the other five
 * are on the shelf, one ruled row each, their cue underlining on hover. Each
 * opens its flagship page and is named by its title and cue. Rows rise into
 * place as they scroll in, transform only (.reveal-cover).
 */
export function TrailJournals() {
  const journals = FLAGSHIP_SLUGS.flatMap((slug): Journal[] => {
    const project = projects.find((p) => p.slug === slug)
    const study = getCaseStudy(slug)
    return project && study ? [{ project, study }] : []
  })
  const code = (i: number) => edgeCode(i + 1, journals.length, caseStudyContent.eyebrow.caseStudy)
  const [lead, ...shelf] = journals

  return (
    <section id="journals" aria-labelledby="journals-title" className={cn(SECTION, 'pb-[72px] md:pb-[112px]')}>
      <SectionHeading id="journals-title" title={sectionContent.journals.title} />
      <ol className="grid gap-x-12 lg:grid-cols-[7fr_5fr]">
        {lead && (
          <li className="reveal-cover mb-10 lg:row-span-5 lg:mb-0">
            <Link
              href={projectHref(lead.project)}
              className="lift-card group relative flex h-full min-h-[22rem] flex-col rounded border border-line bg-panel p-6 sm:p-8"
            >
              <span aria-hidden="true" className="map-label tabular text-muted">{code(0)}</span>
              <h3 className="text-title mt-8 text-ink">{lead.project.title}</h3>
              <span className="map-label mt-2 text-muted">{placeLine(lead.project)}</span>
              <span className="text-lede mt-6 max-w-[40ch] text-muted-strong">{briefLead(lead.study)}</span>
              <span className="mt-auto pt-8 text-sm text-ink">{lead.study.role}</span>
              <span className={cn(trailLinkClass('action'), 'mt-4 min-h-0')}>
                <TrailLinkText text={ctaLabels.readCaseStudy} />
              </span>
            </Link>
          </li>
        )}
        {shelf.map(({ project, study }, i) => (
          <li key={project.slug} className="reveal-cover border-t border-line" style={{ '--i': i % 3 } as CSSProperties}>
            <Link href={projectHref(project)} className="group flex flex-col py-5">
              <span aria-hidden="true" className="map-label tabular text-muted">{code(i + 1)}</span>
              <h3 className="text-title mt-2 text-ink">{project.title}</h3>
              <span className="map-label mt-1 text-muted">{placeLine(project)}</span>
              <span className="mt-3 text-sm leading-relaxed text-muted-strong">{briefLead(study)}</span>
              <span className="mt-3 text-sm text-ink">{study.role}</span>
              <span className={cn(trailLinkClass('action'), 'mt-2 min-h-[44px]')}>
                <TrailLinkText text={ctaLabels.readCaseStudy} />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
