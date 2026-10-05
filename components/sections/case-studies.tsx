import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'
import { edgeCode } from '@/lib/board'
import { FLAGSHIP_SLUGS, briefLead, getCaseStudy } from '@/lib/case-studies'
import { caseStudyContent, projects, sectionContent, sectorNames } from '@/lib/data'
import { projectHref } from '@/lib/project-page'
import type { CaseStudy, Project } from '@/types'

interface Cover {
  project: Project
  study: CaseStudy
}

/**
 * Six closed tri-folds, front covers out: the project, Christian's role and
 * the brief's first sentence. Each opens its flagship page. They rise into
 * place as the row scrolls in, staggered.
 */
export function CaseStudies() {
  const covers = FLAGSHIP_SLUGS.flatMap((slug): Cover[] => {
    const project = projects.find((p) => p.slug === slug)
    const study = getCaseStudy(slug)
    return project && study ? [{ project, study }] : []
  })

  return (
    <section id="case-studies" aria-labelledby="case-studies-title" className="defer-render mx-auto max-w-6xl px-5 pb-[72px] sm:px-8 md:pb-[112px]">
      <SectionHeading
        id="case-studies-title"
        eyebrow={sectionContent.caseStudies.eyebrow}
        title={sectionContent.caseStudies.title}
      />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {covers.map(({ project, study }, i) => (
          <li key={project.slug} className="reveal-cover" style={{ '--i': i % 3 } as CSSProperties}>
            <Link
              href={projectHref(project)}
              className="press group relative flex h-full min-h-[22rem] flex-col rounded border border-line bg-panel p-6 pr-10"
            >
              {/* The closed tri-fold's edge: the inner flap's crease, just inside the right side. */}
              <span aria-hidden="true" className="crease-v absolute bottom-0 right-5 top-0" />
              <span aria-hidden="true" className="edge-code text-xs text-muted">
                {edgeCode(i + 1, covers.length, caseStudyContent.eyebrow.caseStudy)}
              </span>
              <span className="text-title mt-8 text-ink">{project.title}</span>
              <span className="edge-code mt-2 text-xs text-muted">{sectorNames[project.sector]}</span>
              <span className="mt-5 leading-relaxed text-muted-strong">{briefLead(study)}</span>
              <span className="mt-auto pt-6 text-sm text-ink">{study.role}</span>
              <span className="button-label mt-4 inline-flex items-center gap-2 text-accent">
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
