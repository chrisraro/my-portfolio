import Link from 'next/link'
import type { CSSProperties } from 'react'
import { NoPreviewTag } from '@/components/ui/no-preview-tag'
import { ScrollPreview } from '@/components/ui/scroll-preview'
import { StatusBadge } from '@/components/ui/status-badge'
import { canLinkLive, fullShotFor, fullShotHeight, projectHref } from '@/lib/project-page'
import { extractDomain } from '@/lib/utils'
import type { Project } from '@/types'

interface RackCardProps {
  project: Project
  /** The card's edge code, e.g. "07 / 18 · Sites". */
  code: string
  /** Position in its row, for the drop-in stagger. */
  column: number
  /** Read before the card's name, e.g. "Next case study", when the card stands for more than itself. */
  labelPrefix?: string
}

/**
 * A brochure in the rack: a 9:16 card sunk in a pocket so only its top 44%
 * (edge code, name, status, domain) shows over the lip. Hover or focus lifts it
 * out, and the sunk ScrollPreview starts scrolling the real site once it has
 * risen. The whole card is one link to the project page; nothing inside it is
 * separately focusable. A project with no public screen keeps its slot with a
 * printed tag. Below 640px the cards are not sunk: they sit whole in a strip.
 */
export function RackCard({ project, code, column, labelPrefix }: RackCardProps) {
  const shot = fullShotFor(project)
  const domain = canLinkLive(project) && project.links.live ? extractDomain(project.links.live) : undefined

  return (
    <li className="rack-slot relative min-w-0 shrink-0 snap-start max-sm:w-[78%]">
      <div className="rack-pocket">
        <div className="reveal-drop" style={{ '--i': column } as CSSProperties}>
          <Link
            href={projectHref(project)}
            className="rack-card scroll-preview-host relative flex aspect-[9/16] flex-col overflow-hidden rounded border border-line bg-panel"
          >
            {labelPrefix && <span className="sr-only">{`${labelPrefix}: `}</span>}
            <span className="flex h-[44%] flex-col gap-2 p-4">
              <span aria-hidden="true" className="edge-code text-xs text-muted">
                {code}
              </span>
              <span className="text-title text-[1.3125rem] text-ink">{project.title}</span>
              <StatusBadge status={project.status} />
              <span className="line-clamp-2 text-sm leading-snug text-muted-strong">{project.summary}</span>
              {/* Visual only: the card opens the project page, not this domain. */}
              <span aria-hidden="true" className="edge-code mt-auto truncate text-xs text-muted">
                {domain ?? 'no public URL'}
              </span>
            </span>
            {project.status === 'staging' && (
              <span
                aria-hidden="true"
                className="edge-code absolute right-3 top-3 rotate-[8deg] rounded-sm border border-line-strong bg-canvas px-2 py-0.5 text-xs text-ink"
              >
                Staging
              </span>
            )}
            <span className="block min-h-0 flex-1 px-2 pb-2">
              {shot ? (
                <ScrollPreview
                  src={shot}
                  label={project.title}
                  decorative
                  shotHeight={fullShotHeight(shot)}
                  sizes="(min-width: 1024px) 260px, (min-width: 640px) 33vw, 78vw"
                  className="aspect-auto h-full"
                />
              ) : (
                <NoPreviewTag project={project} className="h-full" />
              )}
            </span>
          </Link>
        </div>
      </div>
      {/* The rack lip: a 2px rule with a paper ledge, bridging the gap to the next pocket. */}
      <span
        aria-hidden="true"
        className="reveal-lip relative block h-[14px] border-t-2 border-line-strong bg-panel sm:-mx-3"
        style={{ '--i': column } as CSSProperties}
      />
    </li>
  )
}
