import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'
import { edgeCode } from '@/lib/board'
import { FLAGSHIP_SLUGS, getCaseStudy, outcomeLead } from '@/lib/case-studies'
import { caseStudyContent, projects, sectionContent, sectorNames } from '@/lib/data'
import { ProjectShot } from '@/components/ui/project-shot'
import { fullShotFor, projectHref } from '@/lib/project-page'
import type { CaseStudy, Project } from '@/types'

const shot = (project: Project) => fullShotFor(project)

interface Cover {
  project: Project
  study: CaseStudy
}

/**
 * Six covers: a still of the site, the project, what changed (the outcome's
 * first sentence) and Christian's role. Each opens its flagship page. They rise into
 * place as the row scrolls in, staggered; hover lifts a cover like a rack card.
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
              className="lift-card group relative flex h-full flex-col rounded border border-line bg-panel"
            >
              {shot(project) && (
                <span className="block p-2 pb-0">
                  <ProjectShot
                    src={shot(project)!}
                    label={project.title}
                    decorative
                    slug={project.slug}
                    sizes="(min-width: 1024px) 350px, (min-width: 640px) 46vw, calc(100vw - 56px)"
                    className="aspect-[16/10] w-full"
                  />
                </span>
              )}
              <span className="flex flex-1 flex-col p-6">
                <span aria-hidden="true" className="edge-code text-xs text-muted">
                  {edgeCode(i + 1, covers.length, caseStudyContent.eyebrow.caseStudy)} · {sectorNames[project.sector]}
                </span>
                <span className="text-title mt-3 text-ink">{project.title}</span>
                <span className="mt-3 leading-relaxed text-muted-strong">{outcomeLead(study)}</span>
                <span className="mt-auto pt-6 text-sm text-ink">{study.role}</span>
                <span className="button-label mt-4 inline-flex items-center gap-2 text-accent">
                  <span className="link-draw">Read the case study</span>
                  <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
