// View transitions between catalog pages (components/ui/view-transitions.tsx).
// Pure, so the click rules are tested without a browser.

/** The shared name of a project's screenshot: the clicked card's shot and the case-study header shot. */
export function shotTransitionName(slug: string): string {
  return `shot-${slug}`
}

/** A /projects card's name while a filter change re-lays the rack out. */
export function cardTransitionName(slug: string): string {
  return `card-${slug}`
}

/** A /projects tier heading's name while a filter change re-lays the rack out. */
export function tierTransitionName(heading: string): string {
  return `tier-${heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

/** The parts of a click that decide whether the browser should handle it. */
export interface ClickLike {
  button: number
  metaKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
  defaultPrevented: boolean
}

export interface AnchorLike {
  /** The resolved, absolute href (HTMLAnchorElement.href). */
  href: string
  target: string
  download: boolean
}

export interface LocationLike {
  origin: string
  pathname: string
  search: string
}

export type TransitionPlan =
  | { kind: 'project'; href: string; slug: string }
  | { kind: 'filter'; href: string }

const PROJECT_PATH = /^\/projects\/([a-z0-9-]+)\/?$/

/**
 * Which transition a click on a link should run, or null to leave it to
 * next/link and the browser: a modified or non-primary click (new tab, new
 * window, download), a link to another origin, the page already shown, or any
 * route but a project page or a /projects filter change.
 */
export function planTransition(click: ClickLike, anchor: AnchorLike, current: LocationLike): TransitionPlan | null {
  if (click.defaultPrevented || click.button !== 0) return null
  if (click.metaKey || click.ctrlKey || click.shiftKey || click.altKey) return null
  if ((anchor.target && anchor.target !== '_self') || anchor.download) return null

  let url: URL
  try {
    url = new URL(anchor.href, current.origin)
  } catch {
    return null
  }
  if (url.origin !== current.origin) return null
  if (url.pathname === current.pathname && url.search === current.search) return null

  const href = `${url.pathname}${url.search}${url.hash}`
  const project = url.pathname.match(PROJECT_PATH)
  if (project) return { kind: 'project', href, slug: project[1] }
  if (url.pathname === '/projects' && current.pathname === '/projects') return { kind: 'filter', href }
  return null
}
