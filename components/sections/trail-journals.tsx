import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'
import { edgeCode } from '@/lib/board'
import { FLAGSHIP_SLUGS, briefLead, getCaseStudy } from '@/lib/case-studies'
import { caseStudyContent, projects, sectionContent, sectorNames } from '@/lib/data'
import { projectHref } from '@/lib/project-page'
import type { CaseStudy, Project } from '@/types'

interface Journal {
  project: Project
  study: CaseStudy
}

/**
 * The trail journals (spec §5): a cover for each of the six case studies, in
 * reading order: the journal's number, the project, where it runs (when its
 * own words name the place), the brief's first sentence and Christian's role.
 * Each opens its flagship page. Covers rise into place as the row scrolls in,
 * transform only (.reveal-cover), and lift on hover like every catalog card.
 */
export function TrailJournals() {
  const journals = FLAGSHIP_SLUGS.flatMap((slug): Journal[] => {
    const project = projects.find((p) => p.slug === slug)
    const study = getCaseStudy(slug)
    return project && study ? [{ project, study }] : []
  })

  return (
    <section id="journals" aria-labelledby="journals-title" className="defer-render mx-auto max-w-6xl px-5 pb-16 sm:px-8 md:pb-24">
      <SectionHeading id="journals-title" eyebrow={sectionContent.journals.eyebrow} title={sectionContent.journals.title} />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {journals.map(({ project, study }, i) => (
          <li key={project.slug} className="reveal-cover" style={{ '--i': i % 3 } as CSSProperties}>
            <Link
              href={projectHref(project)}
              className="lift-card group relative flex h-full min-h-[20rem] flex-col rounded border border-line bg-panel p-6"
            >
              <span aria-hidden="true" className="map-label tabular text-muted">
                {edgeCode(i + 1, journals.length, caseStudyContent.eyebrow.caseStudy)}
              </span>
              <span className="text-title mt-8 text-ink">{project.title}</span>
              <span className="map-label mt-2 text-muted">
                {project.place ? `${project.place.name} · ${sectorNames[project.sector]}` : sectorNames[project.sector]}
              </span>
              <span className="mt-5 leading-relaxed text-muted-strong">{briefLead(study)}</span>
              <span className="mt-auto pt-6 text-sm text-ink">{study.role}</span>
              <span className="button-label mt-4 inline-flex items-center gap-2 text-ink">
                <span className="link-draw">Read the case study</span>
                <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
