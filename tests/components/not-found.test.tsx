import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import NotFound from '@/app/not-found'
import { notFoundContent } from '@/lib/data'

describe('404 page', () => {
  const html = renderToStaticMarkup(<NotFound />)

  it('sits on the one grid with an eyebrow and a single h1', () => {
    const outer = (html.match(/^<div class="([^"]*)"/)?.[1] ?? '').split(' ')
    for (const c of ['mx-auto', 'max-w-6xl', 'px-5', 'sm:px-8']) expect(outer).toContain(c)
    expect(html).toMatch(new RegExp(`<p class="eyebrow[^"]*">${notFoundContent.eyebrow}</p>`))
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain(`>${notFoundContent.title}</h1>`)
    expect(html).toContain(notFoundContent.description)
  })

  it('offers a way back to the projects and the homepage', () => {
    expect(html).toContain('href="/projects"')
    expect(html).toContain('href="/"')
  })

  it('keeps its copy free of em-dashes', () => {
    for (const t of Object.values(notFoundContent)) expect(t).not.toContain('—')
  })
})
