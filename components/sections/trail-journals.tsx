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

/**
 * The trail journals (spec §5): a cover for each of the six case studies, in
 * reading order: the journal's number, the project (its h3), where it runs
 * (when its own words name the place), the brief's first sentence and
 * Christian's role. Each opens its flagship page; the link is named by the
 * title and its cue, not by every line on the cover. Covers rise into place as
 * the row scrolls in, transform only (.reveal-cover), and lift on hover like
 * every catalog card.
 */
export function TrailJournals() {
  const journals = FLAGSHIP_SLUGS.flatMap((slug): Journal[] => {
    const project = projects.find((p) => p.slug === slug)
    const study = getCaseStudy(slug)
    return project && study ? [{ project, study }] : []
  })

  return (
    <section id="journals" aria-labelledby="journals-title" className={cn(SECTION, 'pb-[72px] md:pb-[112px]')}>
      <SectionHeading id="journals-title" eyebrow={sectionContent.journals.eyebrow} title={sectionContent.journals.title} />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {journals.map(({ project, study }, i) => {
          const titleId = `journal-${project.slug}`
          return (
            <li key={project.slug} className="reveal-cover" style={{ '--i': i % 3 } as CSSProperties}>
              <Link
                href={projectHref(project)}
                aria-labelledby={`${titleId} ${titleId}-cue`}
                className="lift-card group relative flex h-full min-h-[20rem] flex-col rounded border border-line bg-panel p-6"
              >
                <span aria-hidden="true" className="map-label tabular text-muted">
                  {edgeCode(i + 1, journals.length, caseStudyContent.eyebrow.caseStudy)}
                </span>
                <h3 id={titleId} className="text-title mt-8 text-ink">
                  {project.title}
                </h3>
                <span className="map-label mt-2 text-muted">
                  {project.place ? `${project.place.name} · ${sectorNames[project.sector]}` : sectorNames[project.sector]}
                </span>
                <span className="mt-5 leading-relaxed text-muted-strong">{briefLead(study)}</span>
                <span className="mt-auto pt-6 text-sm text-ink">{study.role}</span>
                <span id={`${titleId}-cue`} className={cn(trailLinkClass('action'), 'mt-4 min-h-0')}>
                  <TrailLinkText text={ctaLabels.readCaseStudy} />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
