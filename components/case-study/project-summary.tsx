import Link from 'next/link'
import { ArrowLinkText } from '@/components/case-study/arrow-link-text'
import { caseStudyFor } from '@/lib/case-studies'
import { caseStudyContent, projects } from '@/lib/data'
import { projectHref } from '@/lib/project-page'
import type { Project } from '@/types'

// A project without a case study says only what lib/data.ts already says.
export function ProjectSummary({ project }: { project: Project }) {
  const h = caseStudyContent.headings
  // A project told inside a flagship's story (BeachBus's NFC system) points to it.
  const parentStudy = caseStudyFor(project.slug)
  const parent = parentStudy ? projects.find((p) => p.slug === parentStudy.slug) : undefined
  return (
    // The prose leaf of a short page; ReadSpread holds it to the measure.
    <>
      <h2 className="text-title text-ink">{h.about}</h2>
      <p className="mt-3 text-base leading-relaxed text-muted-strong">{project.description}</p>
      {project.contribution && (
        <p className="mt-3 text-base leading-relaxed text-muted-strong">{project.contribution}</p>
      )}
      {parent && (
        <Link
          href={projectHref(parent)}
          className="mt-3 inline-block min-h-[44px] py-2.5 text-base font-medium text-ink transition-colors hover:text-accent"
        >
          <ArrowLinkText text={caseStudyContent.partOf.replace('{title}', parent.title)} />
        </Link>
      )}
      <h2 className="text-title mt-14 text-ink">{h.stack}</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.technologies.map((t) => (
          <li key={t} className="edge-code rounded-full border border-line-strong px-3 py-1 text-xs text-muted-strong">
            {t}
          </li>
        ))}
      </ul>
    </>
  )
}
