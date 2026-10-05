'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { startTransition, useEffect, useRef } from 'react'
import { planTransition, shotTransitionName } from '@/lib/view-transition'

// Longest the old page stays frozen waiting for the route to commit. The
// browser gives up on its own at about 4s; a slow fetch should not get there.
const COMMIT_TIMEOUT = 2500
// Longest the new page waits for its header shot to decode, so the morph lands
// on the picture rather than an empty frame.
const IMAGE_WAIT = 300

// Each click takes a token; only the latest transition may clear names or move
// focus, so a rapid second click is not undone by the first one finishing.
let active = 0

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
  const url = `${pathname}?${search.toString()}`
  const commit = useRef<(() => void) | null>(null)

  // The route has committed (path or query changed): release the frozen frame.
  useEffect(() => {
    commit.current?.()
    commit.current = null
  }, [url])

  useEffect(() => {
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

      const token = ++active
      // A transition still waiting on its route is superseded: let it finish,
      // and drop the names it set.
      commit.current?.()
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

      const transition = document.startViewTransition(async () => {
        await Promise.race([
          new Promise<void>((resolve) => {
            commit.current = resolve
            try {
              startTransition(() => router.push(plan.href, { scroll: false }))
            } catch {
              resolve()
              fallback()
            }
          }),
          sleep(COMMIT_TIMEOUT),
        ])
        if (plan.kind !== 'project' || token !== active) return
        // Land at the very top (the root's smooth scrolling would stop short).
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        // Morph only into a header shot the visitor can see; on a phone it sits
        // below the cover, so the page simply cross-fades.
        const target = targetShot(slug)
        if (target && wellInViewport(target)) await shotReady(target)
        else target?.style.removeProperty('view-transition-name')
        // Focus follows the navigation to the new page's heading.
        document.querySelector<HTMLElement>('main h1[tabindex="-1"]')?.focus({ preventScroll: true })
      })

      transition.updateCallbackDone.catch(fallback)
      transition.ready.catch(() => undefined)
      transition.finished
        .catch(() => undefined)
        .finally(() => {
          if (token !== active) return
          clearNames()
        })
    }

    window.addEventListener('click', onClick, true)
    return () => window.removeEventListener('click', onClick, true)
  }, [router])

  return null
}
