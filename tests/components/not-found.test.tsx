import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import NotFound, { metadata } from '@/app/not-found'
import { offTrail } from '@/lib/contours'
import { heroContent, notFoundContent } from '@/lib/data'

// Spec §5: "Off the trail", an empty map square with a route home.
describe('404: off the trail', () => {
  const html = renderToStaticMarkup(<NotFound />)
  const plate = html.slice(html.indexOf('class="survey-plate'), html.indexOf('<h1'))

  it('sits on the one grid with an eyebrow and a single h1', () => {
    const outer = (html.match(/^<div class="([^"]*)"/)?.[1] ?? '').split(' ')
    for (const c of ['mx-auto', 'max-w-6xl', 'px-5', 'sm:px-8']) expect(outer).toContain(c)
    expect(html).toMatch(new RegExp(`<p class="eyebrow[^"]*">${notFoundContent.eyebrow}</p>`))
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain(`>${notFoundContent.title}</h1>`)
    expect(html).toContain(notFoundContent.description)
  })

  it('draws an empty map square on a survey plate: contours, a route, no pins', () => {
    expect(plate).toContain('aspect-square')
    expect(plate).toMatch(/<svg aria-hidden="true"[^>]*class="[^"]*text-contour/)
    expect(plate.match(/<path /g)?.length).toBe(offTrail.contours.length + 1)
    expect(plate).toContain(`d="${offTrail.route}"`)
    expect(plate).not.toContain('<a ')
    expect(plate).toContain(`>${notFoundContent.here}</span>`)
  })

  it('routes home first: the primary goes to /, then every project', () => {
    const home = html.match(/<a [^>]*href="\/"[^>]*>/)?.[0] ?? ''
    expect(home).toContain('class="press button-primary"')
    expect(html.indexOf('href="/"')).toBeLessThan(html.indexOf('href="/projects"'))
  })

  it('keeps trail red to the "you are here" dot', () => {
    const src = readFileSync('app/not-found.tsx', 'utf8')
    expect(src.match(/\b(?:bg|text|border|fill|stroke|ring|decoration)-trail\b/g)).toEqual(['bg-trail'])
  })

  it('keeps its copy free of em-dashes', () => {
    for (const t of Object.values(notFoundContent)) expect(t).not.toContain('—')
  })
})

describe('404: the tab title', () => {
  it('says it is the 404, built from the page heading and the site name', () => {
    expect(metadata.title).toBe(`${notFoundContent.title} · ${heroContent.name}`)
  })
})
