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
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 md:py-16">
      {/* About 70 characters a line; see the measure note in case-study-body.tsx. */}
      <div className="max-w-[36rem]">
        <h2 className="text-xl font-semibold text-ink">{h.about}</h2>
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
        <h2 className="mt-10 text-xl font-semibold text-ink">{h.stack}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
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
