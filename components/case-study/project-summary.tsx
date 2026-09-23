import { caseStudyContent } from '@/lib/data'
import type { Project } from '@/types'

// A project without a case study says only what lib/data.ts already says.
export function ProjectSummary({ project }: { project: Project }) {
  const h = caseStudyContent.headings
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 md:py-16">
      <div className="max-w-[68ch]">
        <h2 className="text-xl font-semibold text-ink">{h.about}</h2>
        <p className="mt-3 text-base leading-relaxed text-muted-strong">{project.description}</p>
        {project.contribution && (
          <p className="mt-3 text-base leading-relaxed text-muted-strong">{project.contribution}</p>
        )}
        <h2 className="mt-10 text-xl font-semibold text-ink">{h.stack}</h2>
        <ul aria-label="Stack" className="mt-3 flex flex-wrap gap-2">
          {project.technologies.map((t) => (
            <li key={t} className="rounded border border-line-strong px-2.5 py-1 font-mono text-xs text-muted-strong">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
