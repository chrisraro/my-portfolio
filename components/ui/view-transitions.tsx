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

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

/** The clicked project's screenshot: inside the link if it has one, else the first one on screen. */
function sourceShot(anchor: Element, slug: string): HTMLElement | null {
  const selector = `[data-vt-shot="${CSS.escape(slug)}"]`
  const inside = anchor.querySelector<HTMLElement>(selector)
  if (inside) return inside
  const all = Array.from(document.querySelectorAll<HTMLElement>(selector))
  return (
    all.find((el) => {
      const r = el.getBoundingClientRect()
      return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight
    }) ?? null
  )
}

/** Wait (briefly) for the new page's named header shot to be ready to paint. */
async function targetShotReady(slug: string) {
  const target = Array.from(document.querySelectorAll<HTMLElement>(`[data-vt-shot="${CSS.escape(slug)}"]`)).find(
    (el) => el.style.viewTransitionName !== '',
  )
  const img = target?.querySelector('img')
  if (!img || (img.complete && img.naturalWidth > 0)) return
  await Promise.race([img.decode().catch(() => undefined), sleep(IMAGE_WAIT)])
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

      const root = document.documentElement
      const named = plan.kind === 'project' ? sourceShot(anchor, plan.slug) : null
      if (plan.kind === 'filter') root.classList.add('vt-filter')
      if (plan.kind === 'project' && named) named.style.viewTransitionName = shotTransitionName(plan.slug)

      // A transition still waiting on its route is superseded: let it finish.
      commit.current?.()

      const transition = document.startViewTransition(async () => {
        await Promise.race([
          new Promise<void>((resolve) => {
            commit.current = resolve
            startTransition(() => router.push(plan.href, { scroll: plan.kind === 'project' }))
          }),
          sleep(COMMIT_TIMEOUT),
        ])
        if (plan.kind === 'project') await targetShotReady(plan.slug)
      })

      transition.ready.catch(() => undefined)
      transition.finished
        .catch(() => undefined)
        .finally(() => {
          root.classList.remove('vt-filter')
          named?.style.removeProperty('view-transition-name')
        })
    }

    window.addEventListener('click', onClick, true)
    return () => window.removeEventListener('click', onClick, true)
  }, [router])

  return null
}
