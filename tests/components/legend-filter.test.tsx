import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { LegendFilter } from '@/components/ui/legend-filter'
import { bandSlug } from '@/lib/board'
import { projects } from '@/lib/data'
import { BAND_ORDER } from '@/types'

// Spec §3: filters are a segmented control styled as a legend key.
const keys = (html: string) => html.match(/<a [\s\S]*?<\/a>/g) ?? []

describe('LegendFilter', () => {
  const all = renderToStaticMarkup(<LegendFilter active={null} projects={projects} />)

  it('offers All, then each band, as plain links over ?band=', () => {
    const hrefs = keys(all).map((k) => k.match(/href="([^"]+)"/)?.[1])
    expect(hrefs).toEqual(['/projects', ...BAND_ORDER.map((b) => `/projects?band=${bandSlug(b)}`)])
    expect(all).toMatch(/^<nav aria-label="Filter projects by band">/)
  })

  it('counts each key from the data', () => {
    const [first, ...bands] = keys(all)
    expect(first).toContain(`<span class="tabular text-muted">${projects.length}</span>`)
    BAND_ORDER.forEach((band, i) => {
      expect(bands[i]).toContain(`>${band}<`)
      expect(bands[i]).toContain(`<span class="tabular text-muted">${projects.filter((p) => p.band === band).length}</span>`)
    })
  })

  it('marks where you are: aria-current, and the only trail red in the row', () => {
    const sites = renderToStaticMarkup(<LegendFilter active="Sites" projects={projects} />)
    const current = keys(sites).filter((k) => k.includes('aria-current="true"'))
    expect(current).toHaveLength(1)
    expect(current[0]).toContain('href="/projects?band=sites"')
    expect(current[0]).toContain('bg-trail')
    for (const k of keys(sites).filter((x) => !x.includes('aria-current'))) expect(k).not.toMatch(/-trail\b/)
    expect(keys(all)[0]).toContain('aria-current="true"')
  })

  it('sits in one row that scrolls sideways, with the focus ring drawn inward', () => {
    const row = all.match(/<ul class="([^"]*)"/)?.[1] ?? ''
    expect(row).toContain('overflow-x-auto')
    expect(row).not.toContain('flex-wrap')
    expect(all).toContain('focus-visible:outline-offset-[-3px]')
  })

  it('scrolls the current key into the row on load', () => {
    const sites = renderToStaticMarkup(<LegendFilter active="Sites" projects={projects} />)
    const li = sites.match(/<li class="([^"]*)"><a [^>]*aria-current="true"/)?.[1] ?? ''
    expect(li).toContain('[scroll-initial-target:nearest]')
  })

  it('is a server component that prefetches every filtered view', () => {
    const src = readFileSync('components/ui/legend-filter.tsx', 'utf8')
    expect(src).not.toContain("'use client'")
    expect(src).toMatch(/^\s*prefetch$/m)
  })
})
