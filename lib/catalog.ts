import { DISPLAY_STATUS_LABEL, displayStatus } from '@/lib/display-status'
import { caseStudyContent, sectorNames } from '@/lib/data'
import { getCaseStudy } from '@/lib/case-studies'
import { canLinkLive, projectHref, screenshotsFor } from '@/lib/project-page'
import { extractDomain } from '@/lib/utils'
import type { DisplayStatus, Project, ProjectBand } from '@/types'

/**
 * A project as a card shows it: plain, serialisable props, so the same card
 * renders on the server and inside the client-side catalogue. Built on the
 * server (screenshotsFor reads the filesystem).
 */
export interface CardItem {
  slug: string
  href: string
  title: string
  summary: string
  band: ProjectBand
  sector: string
  status: DisplayStatus
  statusLabel: string
  /** The site's first screen, 16:10; absent for systems with no public screen. */
  image?: string
  /** Why there is no picture, when there is none. */
  noImage?: string
  domain?: string
  isCaseStudy: boolean
}

export function toCardItem(project: Project): CardItem {
  const status = displayStatus(project.status)
  const image = screenshotsFor(project).desktop
  const reasons: Record<string, string> = caseStudyContent.noPreview
  return {
    slug: project.slug,
    href: projectHref(project),
    title: project.title,
    summary: project.summary,
    band: project.band,
    sector: sectorNames[project.sector],
    status,
    statusLabel: DISPLAY_STATUS_LABEL[status],
    image,
    noImage: image ? undefined : (reasons[project.status] ?? reasons.fallback),
    domain: canLinkLive(project) && project.links.live ? extractDomain(project.links.live) : undefined,
    isCaseStudy: Boolean(getCaseStudy(project.slug)),
  }
}
