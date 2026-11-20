import { TrailLink } from '@/components/ui/trail-link'
import { caseStudyFor } from '@/lib/case-studies'
import { caseStudyContent, projects } from '@/lib/data'
import { projectHref } from '@/lib/project-page'
import type { Project } from '@/types'

const P = 'mt-3 text-base leading-relaxed text-muted-strong'

// A project without a case study says only what lib/data.ts already says.
export function ProjectSummary({ project }: { project: Project }) {
  const h = caseStudyContent.headings
  // A project told inside a flagship's story (BeachBus's NFC system) points to it.
  const parentStudy = caseStudyFor(project.slug)
  const parent = parentStudy ? projects.find((p) => p.slug === parentStudy.slug) : undefined
  return (
    // The prose of a short page; ReadSpread holds it to the measure.
    <>
      <h2 className="text-title text-ink">{h.about}</h2>
      <p className={P}>{project.description}</p>
      {project.contribution && <p className={P}>{project.contribution}</p>}
      {parent && (
        <TrailLink href={projectHref(parent)} text={caseStudyContent.partOf.replace('{title}', parent.title)} className="mt-3" />
      )}
      <h2 className="text-title mt-14 text-ink">{h.stack}</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.technologies.map((t) => (
          <li key={t} className="map-label rounded-sm border border-line-strong px-3 py-1.5 text-muted-strong">
            {t}
          </li>
        ))}
      </ul>
    </>
  )
}
