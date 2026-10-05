import { closeSync, existsSync, openSync, readSync } from 'node:fs'
import { join } from 'node:path'
import { recommendations } from '@/lib/data'
import embeddable from '@/lib/embeddable.json'
import type { Project, ProjectStatus, Recommendation } from '@/types'

// Server-only helpers for /projects/[slug]. They read the filesystem, so never
// import this module from a client component.

export function projectHref(project: Project): string {
  return `/projects/${project.slug}`
}

// ua-gated sites refuse automated clients but open in any browser, so a
// visitor can follow the link. Login-walled and internal systems cannot.
const LINKABLE: readonly ProjectStatus[] = ['live', 'early-access', 'ua-gated', 'staging']

export function canLinkLive(project: Project): boolean {
  return Boolean(project.links.live) && LINKABLE.indexOf(project.status) !== -1
}

export function liveLinkLabel(project: Project): string {
  return project.status === 'staging' ? 'Open staging site' : 'Open live site'
}

// scripts/capture-screenshots.mjs writes <id>.png and <id>-mobile.png side by
// side. The mobile shot is optional: a site that refuses the capture has none.
export function screenshotsFor(project: Project): { desktop?: string; mobile?: string } {
  if (!project.image) return {}
  const mobile = project.image.replace(/\.png$/, '-mobile.png')
  const hasMobile = mobile !== project.image && existsSync(join(process.cwd(), 'public', mobile))
  return hasMobile ? { desktop: project.image, mobile } : { desktop: project.image }
}

// `npm run capture -- --full` writes <id>-full.webp: the whole page, capped at
// 6000px. Optional, like the mobile shot.
export function fullShotFor(project: Project): string | undefined {
  const path = `/assets/images/projects/${project.id}-full.webp`
  return existsSync(join(process.cwd(), 'public', path)) ? path : undefined
}

/** For lib/board.ts: a card with a full shot lifts out to show the site; lead with those. */
export function hasFullShot(project: Project): boolean {
  return fullShotFor(project) !== undefined
}

// The full shot's pixel height, read from its WebP header, so ScrollPreview can
// scale its scroll duration to the page's length. Handles the extended (VP8X)
// header the capture script writes; anything else returns undefined and the
// preview falls back to its default duration.
export function fullShotHeight(src: string | undefined): number | undefined {
  if (!src) return undefined
  let fd: number | undefined
  try {
    // Only the 30-byte header is needed; the shot itself can run to 600 KB.
    fd = openSync(join(process.cwd(), 'public', src), 'r')
    const head = Buffer.alloc(30)
    if (readSync(fd, head, 0, 30, 0) < 30) return undefined
    if (head.toString('ascii', 0, 4) !== 'RIFF' || head.toString('ascii', 12, 16) !== 'VP8X') return undefined
    return head.readUIntLE(27, 3) + 1
  } catch {
    return undefined
  } finally {
    if (fd !== undefined) closeSync(fd)
  }
}

// lib/embeddable.json is written by `npm run check:embeds`. Only a site that
// permits cross-origin framing, and that a visitor may open, can be previewed live.
export function isEmbeddable(project: Project): boolean {
  const flags: Record<string, boolean> = embeddable.projects
  return flags[project.slug] === true && canLinkLive(project)
}

export function nextInOrder(order: readonly string[], current: string): string | undefined {
  const i = order.indexOf(current)
  if (i === -1 || order.length < 2) return undefined
  return order[(i + 1) % order.length]
}

export function recommendationFor(project: Project): Recommendation | undefined {
  return recommendations.find((r) => r.projectId === project.id)
}
