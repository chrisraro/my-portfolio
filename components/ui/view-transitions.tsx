'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { startTransition, useEffect, useState } from 'react'
import { COMMIT_WAIT, createCommitTracker, planTransition, routeKey, shotTransitionName } from '@/lib/view-transition'

// Longest the new page waits for its header shot to decode, so the morph lands
// on the picture rather than an empty frame.
const IMAGE_WAIT = 300

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

/** On screen at all (a source shot may be partly scrolled out). */
function inViewport(el: Element): boolean {
  const r = el.getBoundingClientRect()
  return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight
}

/** Mostly on screen: at least half of it (or of the viewport) is visible, so a morph lands where it can be seen. */
function wellInViewport(el: Element): boolean {
  if (!inViewport(el)) return false
  const r = el.getBoundingClientRect()
  const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0)
  return visible >= 0.5 * Math.min(r.height, window.innerHeight)
}

/** The clicked project's screenshot: inside the link if it has one, else the first one on screen. */
function sourceShot(anchor: Element, slug: string): HTMLElement | null {
  const selector = `[data-vt-shot="${CSS.escape(slug)}"]`
  const inside = anchor.querySelector<HTMLElement>(selector)
  if (inside) return inside
  return Array.from(document.querySelectorAll<HTMLElement>(selector)).find(inViewport) ?? null
}

/** The new page's named header shot. */
function targetShot(slug: string): HTMLElement | null {
  return (
    Array.from(document.querySelectorAll<HTMLElement>(`[data-vt-shot="${CSS.escape(slug)}"]`)).find(
      (el) => el.style.viewTransitionName !== '' && !el.hasAttribute('data-vt-source'),
    ) ?? null
  )
}

/** Wait (briefly) for the header shot to be ready to paint. */
async function shotReady(target: HTMLElement) {
  const img = target.querySelector('img')
  if (!img || (img.complete && img.naturalWidth > 0)) return
  await Promise.race([img.decode().catch(() => undefined), sleep(IMAGE_WAIT)])
}

/** On the new case study: land at the very top (the root's smooth scrolling would stop short) and move focus to its heading. */
function landOnCaseStudy() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  document.querySelector<HTMLElement>('main h1[tabindex="-1"]')?.focus({ preventScroll: true })
}

/** Remove every name this island set (a source shot, the filter's card names). */
function clearNames() {
  document.documentElement.classList.remove('vt-filter')
  for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-vt-source]'))) {
    el.style.removeProperty('view-transition-name')
    el.removeAttribute('data-vt-source')
  }
}

/**
 * Runs catalog navigations as view transitions: a /projects filter change
 * re-lays the cards out (each card and tier is named for the length of the
 * change, so the browser animates them from old to new place), and a project
 * link morphs the clicked screenshot into the case study's header shot while
 * the rest cross-fades. Renders nothing.
 *
 * Clicks are read in the capture phase, before next/link's handler; a planned
 * click is taken over, everything else (modified clicks, middle clicks, other
 * routes, no browser support, reduced motion) is left to next/link and the
 * browser, so prefetching, new tabs and back/forward are untouched. Without
 * JavaScript every link is a plain link and the server renders the result.
 */
export function ViewTransitions() {
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams()
  const url = routeKey(`${pathname}?${search.toString()}`)
  // Each click takes a token; only the route that click navigated to releases
  // its frozen frame, and only the latest transition clears names or moves focus.
  const [tracker] = useState(createCommitTracker)

  // A route has committed (path or query changed).
  useEffect(() => tracker.committed(url), [tracker, url])

  useEffect(() => {
    const fetched = new Set<string>()
    /** Hover or focus on a project link fetches its page ahead, so the morph has it in hand. */
    function onIntent(event: Event) {
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === '_blank') return
      const target = new URL(anchor.href, window.location.href)
      if (target.origin !== window.location.origin || !/^\/projects\/[a-z0-9-]+\/?$/.test(target.pathname)) return
      if (fetched.has(target.pathname)) return
      fetched.add(target.pathname)
      router.prefetch(target.pathname)
    }

    function onClick(event: MouseEvent) {
      if (!('startViewTransition' in document)) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!(anchor instanceof HTMLAnchorElement)) return

      const plan = planTransition(
        event,
        { href: anchor.href, target: anchor.target, download: anchor.hasAttribute('download') },
        window.location,
      )
      if (!plan) return
      event.preventDefault()

      // A transition still waiting on its route is superseded: it is released
      // at once, and the names it set are dropped.
      const token = tracker.begin()
      clearNames()

      const named = plan.kind === 'project' ? sourceShot(anchor, plan.slug) : null
      const slug = plan.kind === 'project' ? plan.slug : ''
      if (plan.kind === 'filter') document.documentElement.classList.add('vt-filter')
      if (named) {
        named.style.viewTransitionName = shotTransitionName(slug)
        named.setAttribute('data-vt-source', '')
      }

      // If the client navigation fails, the link still goes where it says.
      const fallback = () => window.location.assign(plan.href)
      let landed = false

      const transition = document.startViewTransition(async () => {
        // A newer click has taken over: do not navigate here after all.
        if (!tracker.isLatest(token)) return
        // Past COMMIT_WAIT the frozen frame lets go and the route lands on its
        // own; a case study then gets its scroll and focus once it is there.
        const late = plan.kind === 'project' ? landOnCaseStudy : undefined
        const committed = tracker.wait(token, routeKey(plan.href), COMMIT_WAIT, late)
        try {
          startTransition(() => router.push(plan.href, { scroll: false }))
        } catch {
          fallback()
          return
        }
        landed = await committed
        if (!landed || plan.kind !== 'project' || !tracker.isLatest(token)) return
        // Morph only into a header shot the visitor can see; on a phone it sits
        // below the cover, so the page simply cross-fades.
        const target = targetShot(slug)
        if (target && wellInViewport(target)) await shotReady(target)
        else target?.style.removeProperty('view-transition-name')
        landOnCaseStudy()
      })

      // No commit in time: the frame would only fade the old page into itself.
      transition.updateCallbackDone.then(() => {
        if (!landed) transition.skipTransition?.()
      }, fallback)
      transition.ready.catch(() => undefined)
      transition.finished
        .catch(() => undefined)
        .finally(() => {
          if (!tracker.isLatest(token)) return
          clearNames()
        })
    }

    window.addEventListener('click', onClick, true)
    window.addEventListener('pointerover', onIntent, { passive: true })
    window.addEventListener('focusin', onIntent)
    return () => {
      window.removeEventListener('click', onClick, true)
      window.removeEventListener('pointerover', onIntent)
      window.removeEventListener('focusin', onIntent)
    }
  }, [router, tracker])

  return null
}
