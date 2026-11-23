import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { WorkList } from '@/components/sections/work-list'
import ProjectsPage from '@/app/projects/page'
import ProjectPage from '@/app/projects/[slug]/page'
import { projects } from '@/lib/data'
import { fullShotFor, screenshotsFor } from '@/lib/project-page'
import { bandTransitionName, planTransition, plateTransitionName, shotTransitionName, type ClickLike } from '@/lib/view-transition'
import { BAND_ORDER } from '@/types'
import { parseCssRules } from '@/tests/helpers/css-rules'

// Spec §4: the /projects filter re-lays its plates out (FLIP, through a view
// transition) while the map pans, and a project plate's screenshot morphs into
// the project page's header shot. One client island intercepts the clicks;
// the pages stay server-rendered and work as plain links without JavaScript.
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
    expect(planTransition(click, link('/projects/graceland-bicolano-dining'), at('/'))).toEqual({ kind: 'project', href: '/projects/graceland-bicolano-dining', slug: 'graceland-bicolano-dining' })
    expect(planTransition(click, link('/projects/iskotify'), at('/projects/graceland-bicolano-dining'))).toEqual({ kind: 'project', href: '/projects/iskotify', slug: 'iskotify' })
  })

  it('re-lays out /projects when a legend key changes the band', () => {
    expect(planTransition(click, link('/projects?band=sites'), at('/projects'))).toEqual({ kind: 'filter', href: '/projects?band=sites' })
    expect(planTransition(click, link('/projects'), at('/projects', '?band=sites'))).toEqual({ kind: 'filter', href: '/projects' })
  })

  it('leaves a map pin’s jump to a plate on the same page to the browser', () => {
    expect(planTransition(click, link('/projects#plate-graceland-bicolano-dining'), at('/projects'))).toBeNull()
    expect(planTransition(click, link('/projects?band=sites#plate-azalea-baguio'), at('/projects', '?band=sites'))).toBeNull()
  })

  it('leaves modified and non-primary clicks to the browser (new tab, new window, download)', () => {
    for (const key of ['metaKey', 'ctrlKey', 'shiftKey', 'altKey'] as const) {
      expect(planTransition({ ...click, [key]: true }, link('/projects/graceland-bicolano-dining'), at('/')), key).toBeNull()
    }
    expect(planTransition({ ...click, button: 1 }, link('/projects/graceland-bicolano-dining'), at('/'))).toBeNull()
    expect(planTransition({ ...click, button: 2 }, link('/projects/graceland-bicolano-dining'), at('/'))).toBeNull()
    expect(planTransition({ ...click, defaultPrevented: true }, link('/projects/graceland-bicolano-dining'), at('/'))).toBeNull()
    expect(planTransition(click, link('/projects/graceland-bicolano-dining', { target: '_blank' }), at('/'))).toBeNull()
    expect(planTransition(click, link('/projects/graceland-bicolano-dining', { download: true }), at('/'))).toBeNull()
  })

  it('leaves other origins, the same page, in-page anchors and every other route alone', () => {
    expect(planTransition(click, link('https://graceland.ph/projects/graceland-bicolano-dining'), at('/'))).toBeNull()
    expect(planTransition(click, link('/projects/graceland-bicolano-dining'), at('/projects/graceland-bicolano-dining'))).toBeNull()
    expect(planTransition(click, link('/projects?band=sites'), at('/projects', '?band=sites'))).toBeNull()
    expect(planTransition(click, link('/#contact'), at('/'))).toBeNull()
    expect(planTransition(click, link('/'), at('/projects'))).toBeNull()
    expect(planTransition(click, link('/projects'), at('/projects/graceland-bicolano-dining'))).toBeNull()
    expect(planTransition(click, link('/projects'), at('/'))).toBeNull()
  })
})

describe('transition names', () => {
  it('are valid, unique custom idents per slug and per band', () => {
    const shots = projects.map((p) => shotTransitionName(p.slug))
    const plates = projects.map((p) => plateTransitionName(p.slug))
    const bands = BAND_ORDER.map((b) => bandTransitionName(b))
    for (const name of [...shots, ...plates, ...bands]) expect(name).toMatch(/^[a-z][a-z0-9-]*$/)
    expect(new Set([...shots, ...plates, ...bands]).size).toBe(projects.length * 2 + BAND_ORDER.length)
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
    for (const html of [renderToStaticMarkup(<WorkList />), renderToStaticMarkup(ProjectsPage({ searchParams: {} }))]) {
      expect(html).not.toMatch(/view-transition-name/)
      const marked = Array.from(html.matchAll(/data-vt-shot="([^"]+)"/g)).map((m) => m[1])
      expect(marked.length).toBeGreaterThan(0)
      for (const slug of marked) expect(projects.some((p) => p.slug === slug), slug).toBe(true)
    }
  })

  it('gives every /projects plate and band a unique name for the filter re-layout', () => {
    const html = renderToStaticMarkup(ProjectsPage({ searchParams: {} }))
    const plates = Array.from(html.matchAll(/--vt-plate:([a-z0-9-]+)/g)).map((m) => m[1])
    expect(plates).toHaveLength(projects.length)
    expect(new Set(plates).size).toBe(projects.length)
    const bands = Array.from(html.matchAll(/--vt-band:([a-z0-9-]+)/g)).map((m) => m[1])
    expect(bands).toEqual(BAND_ORDER.map((b) => bandTransitionName(b)))
  })
})

describe('the view-transition island', () => {
  it('is a client component, mounted once in the layout inside a Suspense boundary', () => {
    expect(island.trimStart()).toMatch(/^'use client'/)
    const layout = readFileSync('app/layout.tsx', 'utf8')
    expect(layout).toMatch(/<Suspense fallback=\{null\}>\s*<ViewTransitions \/>\s*<\/Suspense>/)
  })

  it('feature-detects startViewTransition before using it', () => {
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

describe('the island, hardened', () => {
  it('falls back to a full navigation if the client push fails, and never leaves a rejection unhandled', () => {
    expect(island).toMatch(/window\.location\.assign\(/)
    expect(island).toMatch(/updateCallbackDone\.then\([\s\S]*?\}, fallback\)/)
  })

  it('lets only the latest transition navigate, clean up its names or move focus (rapid clicks)', () => {
    expect(island).toMatch(/const token = tracker\.begin\(\)/)
    expect(island).toMatch(/if \(!tracker\.isLatest\(token\)\) return/)
  })

  it('scrolls and focuses only on a committed route: in the frame, or after a late commit', () => {
    expect(island).toMatch(/if \(!landed \|\| plan\.kind !== 'project' \|\| !tracker\.isLatest\(token\)\) return/)
    expect(island).toMatch(/const late = plan\.kind === 'project' \? landOnCaseStudy : undefined/)
    expect(island).toMatch(/if \(!landed\) transition\.skipTransition/)
  })

  it('prefetches project pages on hover or focus, and the legend keys in full', () => {
    expect(island).toMatch(/router\.prefetch\(/)
    expect(island).toMatch(/addEventListener\('pointerover'/)
    expect(island).toMatch(/addEventListener\('focusin'/)
    expect(readFileSync('components/ui/legend-filter.tsx', 'utf8')).toMatch(/^\s*prefetch$/m)
  })

  it('morphs only to a header shot that is in the viewport, and lands at the top', () => {
    expect(island).toMatch(/function wellInViewport\(/)
    expect(island).toMatch(/if \(target && wellInViewport\(target\)\)/)
    expect(island).toMatch(/scrollTo\(\{ top: 0, left: 0, behavior: 'instant' \}\)/)
  })

  it('moves focus to the project page’s h1 after a plate navigation', () => {
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

  it('never dips the page on a filter change: its root swaps in place, so the live map pan shows through', () => {
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

  it('names plates and band headings only during a filter change', () => {
    const plate = rules.find((r) => r.selector === '.vt-filter .project-plate')
    expect(plate?.body).toMatch(/view-transition-name:\s*var\(--vt-plate\)/)
    const band = rules.find((r) => r.selector === '.vt-filter .plate-band > h2')
    expect(band?.body).toMatch(/view-transition-name:\s*var\(--vt-band\)/)
    expect(css).not.toMatch(/(^|\n)\s*\.project-plate \{[^}]*view-transition-name/)
  })
})

describe('the map pan', () => {
  it('moves the map layer by transform from the server’s custom properties, origin top left', () => {
    const pan = rules.find((r) => r.selector === '.map-pan' && /transform:/.test(r.body))
    expect(pan?.body).toMatch(/transform-origin:\s*0 0/)
    expect(pan?.body).toMatch(/transform:\s*translate\(var\(--pan-x, 0%\), var\(--pan-y, 0%\)\) scale\(var\(--pan-s, 1\)\)/)
  })

  it('glides only where motion is allowed, on tokens, never on scroll', () => {
    const glide = rules.filter((r) => /\.map-pan/.test(r.selector) && /transition/.test(r.body))
    expect(glide.length).toBeGreaterThan(0)
    for (const r of glide) {
      expect(r.ancestors).toContain('@media (prefers-reduced-motion: no-preference)')
      expect(r.body).toMatch(/transition:\s*transform var\(--dur-slow\) var\(--ease-smooth\)/)
    }
    for (const r of rules.filter((x) => /\.map-pan/.test(x.selector))) expect(r.body).not.toMatch(/animation-timeline|view-timeline/)
  })
})
