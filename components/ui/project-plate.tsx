import type { CSSProperties } from 'react'
import { NoPreviewTag } from '@/components/ui/no-preview-tag'
import { ProjectShot } from '@/components/ui/project-shot'
import { StatusBadge } from '@/components/ui/status-badge'
import { SurveyPlate } from '@/components/ui/survey-plate'
import { canLinkLive, fullShotFor, projectHref } from '@/lib/project-page'
import { extractDomain } from '@/lib/utils'
import { plateTransitionName } from '@/lib/view-transition'
import type { Project } from '@/types'

interface ProjectPlateProps {
  project: Project
  /** Its catalog number, e.g. "07 / 20 · Sites" (projectCode in lib/board.ts). */
  code: string
  /** Read before the name, e.g. "Next case study", when the plate stands for more than itself. */
  labelPrefix?: string
}

/**
 * A waypoint in the /projects list, and a case study's next stop: one survey
 * plate that is one link to the project page. On it, a still of the site's top
 * in the 3:4 frame every screenshot shares or, with no public screen, the
 * printed reason in the same 3:4 frame, so every plate stands at one scale on
 * one baseline. Under it the catalog number, name (h3), status, summary and
 * domain. The link is named by its own visible text (WCAG 2.5.3): the sr-only
 * prefix, name, status and summary; code and domain are aria-hidden. Hover lifts it like every catalog card (.lift-card). The li carries the
 * id a map pin jumps to and the name a filter change glides (.vt-filter).
 */
export function ProjectPlate({ project, code, labelPrefix }: ProjectPlateProps) {
  const shot = fullShotFor(project)
  const domain = canLinkLive(project) && project.links.live ? extractDomain(project.links.live) : undefined
  const id = `plate-${project.slug}`

  return (
    <li
      id={id}
      className="project-plate min-w-0 scroll-mt-28"
      style={{ '--vt-plate': plateTransitionName(project.slug) } as CSSProperties}
    >
      <SurveyPlate href={projectHref(project)} className="lift-card flex h-full flex-col">
        {labelPrefix && (
          <span className="sr-only">
            {`${labelPrefix}: `}
          </span>
        )}
        {shot ? (
          <ProjectShot
            src={shot}
            label={project.title}
            decorative
            slug={project.slug}
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, calc(100vw - 58px)"
            className="w-full"
          />
        ) : (
          <NoPreviewTag project={project} className="aspect-[3/4] w-full" />
        )}
        <div className="flex flex-1 flex-col gap-2 px-2 pb-2 pt-4">
          <span aria-hidden="true" className="map-label tabular text-muted">
            {code}
          </span>
          <h3 className="text-title text-ink">
            {project.title}
          </h3>
          <StatusBadge status={project.status} />
          <span className="text-sm leading-snug text-muted-strong">{project.summary}</span>
          {/* Visual only: the plate opens the project page, not this domain. */}
          <span aria-hidden="true" className="map-label mt-auto truncate pt-2 text-muted">
            {domain ?? 'no public URL'}
          </span>
        </div>
      </SurveyPlate>
    </li>
  )
}
