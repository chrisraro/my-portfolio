import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { recommendations } from '@/lib/data'
import type { Project, ProjectStatus, Recommendation } from '@/types'

// Server-only helpers for /projects/[slug]. They read the filesystem, so never
// import this module from a client component.

export function projectHref(project: Project): string {
  return `/projects/${project.slug}`
}

// ua-gated sites refuse automated clients but open in any browser, so a
// visitor can follow the link. Login-walled and internal systems cannot.
const LINKABLE: readonly ProjectStatus[] = ['live', 'early-access', 'ua-gated']

export function canLinkLive(project: Project): boolean {
  return Boolean(project.links.live) && LINKABLE.indexOf(project.status) !== -1
}

// scripts/capture-screenshots.mjs writes <id>.png and <id>-mobile.png side by
// side. The mobile shot is optional: a site that refuses the capture has none.
export function screenshotsFor(project: Project): { desktop?: string; mobile?: string } {
  if (!project.image) return {}
  const mobile = project.image.replace(/\.png$/, '-mobile.png')
  const hasMobile = mobile !== project.image && existsSync(join(process.cwd(), 'public', mobile))
  return hasMobile ? { desktop: project.image, mobile } : { desktop: project.image }
}

export function nextInOrder(order: readonly string[], current: string): string | undefined {
  const i = order.indexOf(current)
  if (i === -1 || order.length < 2) return undefined
  return order[(i + 1) % order.length]
}

export function recommendationFor(project: Project): Recommendation | undefined {
  return recommendations.find((r) => r.projectId === project.id)
}
