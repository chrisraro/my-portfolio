import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Footer } from '@/components/footer'
import { FieldLog } from '@/components/sections/field-log'
import { Hero } from '@/components/sections/hero'
import { Products } from '@/components/sections/products'
import { Stack } from '@/components/sections/stack'
import { Systems } from '@/components/sections/systems'
import { Changelog } from '@/components/sections/changelog'
import { availability, contactInfo, galleryImages, projects, recommendations } from '@/lib/data'
import { buildFieldLog } from '@/lib/field-log'

describe('Hero', () => {
  const html = renderToStaticMarkup(<Hero />)

  it('states availability in the first mobile viewport, where the top bar hides it', () => {
    const line = html.match(/<p class="([^"]*)">(?:(?!<\/p>).)*Open to freelance/)
    expect(html).toContain(availability)
    expect(line?.[1]).toContain('sm:hidden')
  })

  it('does not repeat the portrait’s name inside its labelled button', () => {
    expect(html).toContain('aria-label="View larger image: Christian Raro"')
    expect(html).not.toMatch(/<img[^>]*alt="Christian Raro"/)
  })

  it('keeps amber off the stack chips: an amber outline means "selected filter"', () => {
    const chips = html.match(/<ul aria-label="Core stack"[\s\S]*?<\/ul>/)?.[0] ?? ''
    expect(chips).not.toContain('accent')
  })
})

describe('Field log', () => {
  const html = renderToStaticMarkup(<FieldLog />)

  it('ties every photo button to its visible caption', () => {
    for (const image of galleryImages) {
      const id = `field-log-caption-${image.id}`
      expect(html).toContain(`aria-describedby="${id}"`)
      expect(html).toContain(`id="${id}"`)
    }
  })

  it('marks thumbnails decorative, since their buttons carry the description', () => {
    for (const image of galleryImages) {
      expect(html).not.toMatch(new RegExp(`<img[^>]*alt="${image.alt}"`))
    }
  })

  it('never leaves a single card alone on the last three-column row', () => {
    const entries = buildFieldLog(galleryImages, recommendations, projects)
    if (entries.length % 3 === 1) expect(html).toContain('lg:col-span-3')
  })
})

describe('primary proof renders visible without JavaScript', () => {
  it.each([
    ['Products', <Products key="p" />],
    ['Systems', <Systems key="s" />],
  ])('%s ships no opacity:0 entrance', (_name, node) => {
    expect(renderToStaticMarkup(node)).not.toMatch(/opacity:\s*0/)
  })
})

describe('Products heading', () => {
  it('keeps the count out of the heading’s accessible name', () => {
    const html = renderToStaticMarkup(<Products />)
    const count = projects.filter((p) => p.band === 'Products').length
    expect(html).toContain(`<span aria-hidden="true" class="ml-3 font-mono text-sm font-normal text-muted">products · ${count}</span>`)
  })
})

describe('closing sections', () => {
  it('give Changelog and Stack the page’s 8px panel', () => {
    expect(renderToStaticMarkup(<Changelog />)).toContain('rounded-lg border border-line bg-panel')
    expect(renderToStaticMarkup(<Stack />)).toContain('rounded-lg border border-line bg-line')
  })
})

describe('Footer', () => {
  it('tells screen readers each social link opens a new tab', () => {
    const html = renderToStaticMarkup(<Footer />)
    const links = contactInfo.socialLinks.filter((l) => l.icon !== 'mail')
    expect(html.match(/\(opens in a new tab\)/g)).toHaveLength(links.length)
  })
})
