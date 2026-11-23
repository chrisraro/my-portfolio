import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import NotFound, { metadata } from '@/app/not-found'
import { ctaLabels, heroContent, notFoundContent } from '@/lib/data'

// The 404 is plain: a figure, one h1, the way home, the way to every project.
// The old "Off the trail" map square is gone with the rest of the trail map.
describe('404', () => {
  const html = renderToStaticMarkup(<NotFound />)

  it('sits on the one grid with a single h1', () => {
    const outer = (html.match(/^<div class="([^"]*)"/)?.[1] ?? '').split(' ')
    for (const c of ['mx-auto', 'max-w-[49rem]', 'px-5', 'sm:px-8']) expect(outer).toContain(c)
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain(`>${notFoundContent.title}</h1>`)
    expect(html).toContain(notFoundContent.description)
    expect(html).toContain(`>${notFoundContent.eyebrow}</p>`)
  })

  it('routes home first: the primary goes to /, then every project', () => {
    const home = html.match(/<a [^>]*href="\/"[^>]*>/)?.[0] ?? ''
    expect(home).toContain('class="press button-primary"')
    expect(html).toContain(ctaLabels.backHome)
    expect(html.indexOf('href="/"')).toBeLessThan(html.indexOf('href="/projects"'))
    expect(html).toContain(ctaLabels.allProjects)
  })

  it('draws no map, no contours and no trail, and uses no trail red of its own', () => {
    expect(html).not.toContain('survey-plate')
    expect(html).not.toMatch(/viewBox="0 0 (?!24 24)/)
    const src = readFileSync('app/not-found.tsx', 'utf8')
    expect(src).not.toMatch(/\b(?:bg|text|border|fill|stroke|ring|decoration)-trail\b/)
    expect(src).not.toContain('offTrail')
  })

  it('keeps its copy free of em-dashes and the retired "Off the trail"', () => {
    for (const t of Object.values(notFoundContent)) {
      expect(t).not.toContain('—')
      expect(t).not.toMatch(/off the trail/i)
    }
  })
})

describe('404: the tab title', () => {
  it('says it is the 404, built from the page heading and the site name', () => {
    expect(metadata.title).toBe(`${notFoundContent.title} · ${heroContent.name}`)
  })
})
