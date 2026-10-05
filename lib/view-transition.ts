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

/**
 * Longest a frozen frame waits for its route to commit. Filter URLs and card
 * links are prefetched, so they commit well inside it; past it the transition
 * is dropped and the route simply lands when it arrives.
 */
export const COMMIT_WAIT = 300

/** The route a URL lands on: path and query, no hash, no trailing slash. */
export function routeKey(href: string): string {
  const url = new URL(href, 'http://route.invalid')
  const path = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : url.pathname
  return `${path}${url.search}`
}

export interface CommitTracker {
  /** Start a navigation and take its token; any earlier wait is released (false) and its late action dropped. */
  begin(): number
  isLatest(token: number): boolean
  /**
   * Wait up to `ms` for the route `key` to commit: true if it did, false on
   * timeout or when superseded. After a timeout, `late` runs if that route
   * still lands next and this is still the latest navigation.
   */
  wait(token: number, key: string, ms: number, late?: () => void): Promise<boolean>
  /** Report a committed route (pathname and query changed). */
  committed(key: string): void
}

/** Ties each frozen frame to the route it navigated to, so only that route's commit releases it. */
export function createCommitTracker(): CommitTracker {
  let latest = 0
  let waiter: { token: number; key: string; settle: (ok: boolean) => void } | null = null
  let pending: { token: number; key: string; run: () => void } | null = null

  return {
    begin() {
      latest += 1
      waiter?.settle(false)
      pending = null
      return latest
    },
    isLatest: (token) => token === latest,
    wait(token, key, ms, late) {
      return new Promise<boolean>((resolve) => {
        if (token !== latest) return resolve(false)
        const timer = setTimeout(() => {
          if (waiter?.token !== token) return
          waiter = null
          if (late) pending = { token, key, run: late }
          resolve(false)
        }, ms)
        waiter = {
          token,
          key,
          settle(ok) {
            clearTimeout(timer)
            if (waiter?.token === token) waiter = null
            resolve(ok)
          },
        }
      })
    },
    committed(key) {
      if (waiter) {
        if (waiter.key === key) waiter.settle(true)
        return
      }
      const late = pending
      pending = null
      if (late && late.key === key && late.token === latest) late.run()
    },
  }
}
