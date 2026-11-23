import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Lock } from 'lucide-react'
import { StatusBadge } from '@/components/ui/status-badge'
import { sectorNames } from '@/lib/data'
import { fullShotFor, projectHref, screenshotsFor } from '@/lib/project-page'
import { plateTransitionName } from '@/lib/view-transition'
import type { Project } from '@/types'

interface ProjectRowProps {
  project: Project
  /** The line under the name; the project's summary when omitted. */
  text?: string
  /** Read before the name, e.g. "Next case study", when the row stands for more than itself. */
  labelPrefix?: string
  /** The row is on screen at load: its thumbnail loads now, not lazily. */
  eager?: boolean
}

/**
 * One project as a row, everywhere the site lists work: a thumbnail of the top
 * of its real site (a lock where there is no screen to show), the name
 * with its status, one line, and what kind of client it is. The row is one
 * link, named by its own visible text. Hover slides a pane of glass under the
 * row and zooms the thumbnail inside its frame (.row in app/globals.css). The
 * li carries the id a map pin jumps to and the name a filter change glides.
 */
export function ProjectRow({ project, text, labelPrefix, eager = false }: ProjectRowProps) {
  const shot = fullShotFor(project) ?? screenshotsFor(project).desktop

  return (
    <li
      id={`plate-${project.slug}`}
      className="project-plate rise-in min-w-0 scroll-mt-28"
      style={{ '--vt-plate': plateTransitionName(project.slug) } as CSSProperties}
    >
      <Link href={projectHref(project)} className="row group grid grid-cols-[6.5rem_1fr] items-center gap-4 sm:grid-cols-[8rem_1fr_auto] sm:gap-5">
        {labelPrefix && <span className="sr-only">{`${labelPrefix}: `}</span>}
        <span aria-hidden="true" data-vt-shot={shot ? project.slug : undefined} className="thumb relative block aspect-[8/5] overflow-hidden">
          {shot ? (
            <Image
              src={shot}
              alt=""
              fill
              sizes="128px"
              quality={50}
              loading={eager ? 'eager' : undefined}
              className="row__shot object-cover object-top"
            />
          ) : (
            <span className="flex h-full items-center justify-center text-muted">
              <Lock className="h-5 w-5" />
            </span>
          )}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
            <h3 className="text-row text-ink">{project.title}</h3>
            <StatusBadge status={project.status} />
          </div>
          <span className="mt-1 block leading-snug text-muted-strong">{text ?? project.summary}</span>
        </div>
        <span className="hidden text-right text-sm text-muted sm:block">{sectorNames[project.sector]}</span>
      </Link>
    </li>
  )
}
