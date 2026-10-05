import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Products } from '@/components/sections/products'
import { Rack } from '@/components/sections/rack'
import ProjectsPage from '@/app/projects/page'
import ProjectPage from '@/app/projects/[slug]/page'
import { projects } from '@/lib/data'
import { fullShotFor, screenshotsFor } from '@/lib/project-page'
import { cardTransitionName, planTransition, shotTransitionName, type ClickLike } from '@/lib/view-transition'
import { parseCssRules } from '@/tests/helpers/css-rules'

// Lobby Rack refinement D2, plan Task 4: the /projects filter re-lays its cards
// out (FLIP, through a view transition) and a project card morphs into its
// case study's screenshot. One client island intercepts the clicks; the pages
// stay server-rendered and work as plain links without JavaScript.
const css = readFileSync('app/globals.css', 'utf8')
const rules = parseCssRules(css)
const island = readFileSync('components/ui/view-transitions.tsx', 'utf8')

const click: ClickLike = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false }
const at = (pathname: string, search = '') => ({ origin: 'https://example.com', pathname, search })
const link = (href: string, extra: Partial<{ target: string; download: boolean }> = {}) => ({
  href: new URL(href, 'https://example.com').href,
  target: extra.target ?? '',
  download: extra.download ?? false,
})

describe('planTransition', () => {
  it('morphs a click on a project link into its page', () => {
    expect(planTransition(click, link('/projects/latag'), at('/'))).toEqual({ kind: 'project', href: '/projects/latag', slug: 'latag' })
    expect(planTransition(click, link('/projects/giya'), at('/projects/latag'))).toEqual({ kind: 'project', href: '/projects/giya', slug: 'giya' })
  })

  it('re-lays out /projects when a filter tab changes the band', () => {
    expect(planTransition(click, link('/projects?band=sites'), at('/projects'))).toEqual({ kind: 'filter', href: '/projects?band=sites' })
    expect(planTransition(click, link('/projects'), at('/projects', '?band=sites'))).toEqual({ kind: 'filter', href: '/projects' })
  })

  it('leaves modified and non-primary clicks to the browser (new tab, new window, download)', () => {
    for (const key of ['metaKey', 'ctrlKey', 'shiftKey', 'altKey'] as const) {
      expect(planTransition({ ...click, [key]: true }, link('/projects/latag'), at('/')), key).toBeNull()
    }
    expect(planTransition({ ...click, button: 1 }, link('/projects/latag'), at('/'))).toBeNull()
    expect(planTransition({ ...click, button: 2 }, link('/projects/latag'), at('/'))).toBeNull()
    expect(planTransition({ ...click, defaultPrevented: true }, link('/projects/latag'), at('/'))).toBeNull()
    expect(planTransition(click, link('/projects/latag', { target: '_blank' }), at('/'))).toBeNull()
    expect(planTransition(click, link('/projects/latag', { download: true }), at('/'))).toBeNull()
  })

  it('leaves other origins, the same page, in-page anchors and every other route alone', () => {
    expect(planTransition(click, link('https://latag.ph/projects/latag'), at('/'))).toBeNull()
    expect(planTransition(click, link('/projects/latag'), at('/projects/latag'))).toBeNull()
    expect(planTransition(click, link('/projects?band=sites'), at('/projects', '?band=sites'))).toBeNull()
    expect(planTransition(click, link('/#contact'), at('/'))).toBeNull()
    expect(planTransition(click, link('/'), at('/projects'))).toBeNull()
    expect(planTransition(click, link('/projects'), at('/projects/latag'))).toBeNull()
    expect(planTransition(click, link('/projects'), at('/'))).toBeNull()
  })
})

describe('transition names', () => {
  it('are valid, unique custom idents per slug', () => {
    const shots = projects.map((p) => shotTransitionName(p.slug))
    const cards = projects.map((p) => cardTransitionName(p.slug))
    for (const name of [...shots, ...cards]) expect(name).toMatch(/^[a-z][a-z0-9-]*$/)
    expect(new Set([...shots, ...cards]).size).toBe(projects.length * 2)
  })

  it('names exactly one element on a project page: its header screenshot', () => {
    for (const p of projects) {
      const html = renderToStaticMarkup(ProjectPage({ params: { slug: p.slug } }))
      const names = html.match(/view-transition-name:[^;"]+/g) ?? []
      const hasShot = Boolean(fullShotFor(p) || screenshotsFor(p).desktop)
      expect(names, p.slug).toEqual(hasShot ? [`view-transition-name:${shotTransitionName(p.slug)}`] : [])
    }
  })

  it('names nothing statically on the homepage’s work or /projects (the island names the clicked shot)', () => {
    for (const html of [renderToStaticMarkup(<><Products /><Rack /></>), renderToStaticMarkup(ProjectsPage({ searchParams: {} }))]) {
      expect(html).not.toMatch(/view-transition-name/)
      // Every screenshot that can be the source of a morph says which project it is.
      const marked = Array.from(html.matchAll(/data-vt-shot="([^"]+)"/g)).map((m) => m[1])
      expect(marked.length).toBeGreaterThan(0)
      for (const slug of marked) expect(projects.some((p) => p.slug === slug), slug).toBe(true)
    }
  })

  it('gives every /projects card a unique card name for the filter re-layout', () => {
    const html = renderToStaticMarkup(ProjectsPage({ searchParams: {} }))
    const cards = Array.from(html.matchAll(/--vt-card:([a-z0-9-]+)/g)).map((m) => m[1])
    expect(cards).toHaveLength(projects.length)
    expect(new Set(cards).size).toBe(projects.length)
  })
})

describe('the view-transition island', () => {
  it('is a client component, mounted once in the layout inside a Suspense boundary', () => {
    expect(island.trimStart()).toMatch(/^'use client'/)
    const layout = readFileSync('app/layout.tsx', 'utf8')
    expect(layout).toMatch(/<Suspense fallback=\{null\}>\s*<ViewTransitions \/>\s*<\/Suspense>/)
  })

  it('feature-detects startViewTransition before using it', () => {
    expect(island).toMatch(/'startViewTransition' in document/)
    const detect = island.indexOf("'startViewTransition' in document")
    expect(detect).toBeGreaterThan(-1)
    expect(island.indexOf('document.startViewTransition(')).toBeGreaterThan(detect)
  })

  it('navigates instantly under reduced motion', () => {
    expect(island).toContain("matchMedia('(prefers-reduced-motion: reduce)')")
  })

  it('intercepts clicks before next/link, in the capture phase, through planTransition', () => {
    expect(island).toMatch(/addEventListener\('click', \w+, true\)/)
    expect(island).toContain('planTransition(')
    expect(island).toContain('event.preventDefault()')
  })

  it('waits for the route it navigated to (the commit tracker), and cleans up its names', () => {
    expect(island).toContain('usePathname()')
    expect(island).toContain('useSearchParams()')
    expect(island).toMatch(/tracker\.committed\(url\)/)
    expect(island).toMatch(/tracker\.wait\(token, routeKey\(plan\.href\), COMMIT_WAIT/)
    expect(island).toMatch(/removeProperty\('view-transition-name'\)/)
    expect(island).toMatch(/classList\.remove\('vt-filter'\)/)
  })
})

// Refinement gate R5: a11y P2 1-3, critique bugs 4-5.
describe('the island, hardened', () => {
  it('falls back to a full navigation if the client push fails, and never leaves a rejection unhandled', () => {
    expect(island).toMatch(/window\.location\.assign\(/)
    expect(island).toMatch(/updateCallbackDone\.then\([\s\S]*?\}, fallback\)/)
  })

  it('lets only the latest transition navigate, clean up its names or move focus (rapid clicks)', () => {
    expect(island).toMatch(/const token = tracker\.begin\(\)/)
    expect(island).toMatch(/if \(!tracker\.isLatest\(token\)\) return/)
    // The token logic itself is unit-tested in view-transition-commit.test.ts.
  })

  it('scrolls and focuses only on a committed route: in the frame, or after a late commit', () => {
    expect(island).toMatch(/if \(!landed \|\| plan\.kind !== 'project' \|\| !tracker\.isLatest\(token\)\) return/)
    expect(island).toMatch(/const late = plan\.kind === 'project' \? landOnCaseStudy : undefined/)
    // A frame with nothing committed is dropped, not faded into itself.
    expect(island).toMatch(/if \(!landed\) transition\.skipTransition/)
  })

  it('prefetches project pages on hover or focus, and the filter tabs in full', () => {
    expect(island).toMatch(/router\.prefetch\(/)
    expect(island).toMatch(/addEventListener\('pointerover'/)
    expect(island).toMatch(/addEventListener\('focusin'/)
    const filter = readFileSync('components/ui/board-filter.tsx', 'utf8')
    expect(filter).toMatch(/^\s*prefetch$/m)
  })

  it('morphs only to a header shot that is in the viewport, and lands at the top', () => {
    expect(island).toMatch(/function wellInViewport\(/)
    expect(island).toMatch(/if \(target && wellInViewport\(target\)\)/)
    expect(island).toMatch(/scrollTo\(\{ top: 0, left: 0, behavior: 'instant' \}\)/)
  })

  it('moves focus to the case study’s h1 after a card navigation', () => {
    expect(island).toMatch(/focus\(\{ preventScroll: true \}\)/)
    expect(readFileSync('components/case-study/project-header.tsx', 'utf8')).toMatch(/<h1 tabIndex=\{-1\}/)
  })
})

describe('root cross-fade', () => {
  const live = rules.filter((r) => /::view-transition-(old|new)\(root\)/.test(r.selector) && !r.ancestors.join(' ').includes('reduce'))
  const old = live.find((r) => r.selector === ':root:not(.vt-filter)::view-transition-old(root)')
  const fresh = live.find((r) => r.selector === ':root:not(.vt-filter)::view-transition-new(root)')

  it('fades the old page out before the new one fades in on a project navigation, so the two never double-expose', () => {
    expect(old?.body).toMatch(/animation-name:\s*vt-fade-out/)
    expect(fresh?.body).toMatch(/animation-name:\s*vt-fade-in/)
    expect(fresh?.body).toMatch(/animation-delay:\s*calc\(var\(--dur-fast\)/)
    expect(fresh?.body).toMatch(/animation-fill-mode:\s*both/)
  })

  it('never dips the page on a filter change: the fades are scoped away from .vt-filter, whose root swaps in place', () => {
    for (const r of live.filter((x) => /vt-fade/.test(x.body))) expect(r.selector, r.selector).toMatch(/^:root:not\(\.vt-filter\)::/)
    const filterOld = live.find((r) => r.selector === '.vt-filter::view-transition-old(root)')
    const filterNew = live.find((r) => r.selector === '.vt-filter::view-transition-new(root)')
    expect(filterOld?.body).toMatch(/animation:\s*none/)
    expect(filterOld?.body).toMatch(/opacity:\s*0/)
    expect(filterNew?.body).toMatch(/animation:\s*none/)
  })

  it('brings a header shot with no source in with the new page, not over the old one', () => {
    const lone = rules.find((r) => r.selector === '::view-transition-new(*.shot):only-child')
    expect(lone?.body).toMatch(/animation-name:\s*vt-fade-in/)
    expect(lone?.body).toMatch(/animation-delay:\s*calc\(var\(--dur-fast\) \* 0\.5\)/)
    expect(lone?.body).toMatch(/animation-fill-mode:\s*both/)
  })
})

describe('view-transition CSS', () => {
  const vt = rules.filter((r) => /::view-transition/.test(r.selector))

  it('times every group from the motion tokens', () => {
    const group = vt.find((r) => r.selector.includes('::view-transition-group(*)') && !r.ancestors.join(' ').includes('reduce'))
    expect(group).toBeDefined()
    expect(group!.body).toMatch(/animation-duration:\s*var\(--dur-normal\)/)
    expect(group!.body).toMatch(/animation-timing-function:\s*var\(--ease-smooth\)/)
    const root = vt.find((r) => /::view-transition-old\(root\)/.test(r.selector) && !r.ancestors.join(' ').includes('reduce'))
    expect(root?.body).toMatch(/animation-duration:\s*calc\(var\(--dur-fast\)/)
    for (const r of vt.filter((x) => !x.ancestors.join(' ').includes('reduce'))) {
      expect(r.body, r.selector).not.toMatch(/\d+(\.\d+)?m?s\b/)
    }
  })

  it('never blocks the pointer', () => {
    const overlay = vt.find((r) => /(^|,\s*)::view-transition(\s*,|$)/.test(r.selector))
    expect(overlay?.body).toMatch(/pointer-events:\s*none/)
  })

  it('zeroes every transition animation under reduced motion', () => {
    const off = vt.filter((r) => r.ancestors.includes('@media (prefers-reduced-motion: reduce)'))
    const selectors = off.map((r) => r.selector).join(' ')
    for (const part of ['::view-transition-group(*)', '::view-transition-old(*)', '::view-transition-new(*)']) {
      expect(selectors).toContain(part)
    }
    for (const r of off) expect(r.body).toMatch(/animation-duration:\s*0s/)
  })

  it('names cards and tiers only during a filter change', () => {
    const card = rules.find((r) => r.selector === '.vt-filter .rack-slot')
    expect(card?.body).toMatch(/view-transition-name:\s*var\(--vt-card\)/)
    const tier = rules.find((r) => /\.vt-filter \.rack-shelf/.test(r.selector))
    expect(tier?.body).toMatch(/view-transition-name:\s*var\(--vt-tier\)/)
    expect(css).not.toMatch(/(^|\n)\s*\.rack-slot \{[^}]*view-transition-name/)
  })
})
