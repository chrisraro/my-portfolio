import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { TrailLink, TrailLinkText, trailLinkClass } from '@/components/ui/trail-link'

// S2 final review, carry-over 7: the arrow link and the map-label link are one
// idiom with two weights.
describe('TrailLink', () => {
  it('is an action: button-label type, the drawn underline, an arrow that slides', () => {
    const html = renderToStaticMarkup(<TrailLink href="/projects" text="Browse every project" />)
    expect(html).toMatch(/^<a [^>]*href="\/projects"/)
    expect(html).toMatch(/class="button-label inline-flex min-h-\[44px\] items-center gap-2 text-ink"/)
    expect(html).toContain('<span class="link-draw">Browse every project</span><svg')
    expect(html).toContain('arrow-nudge')
    expect(html).not.toContain('target=')
  })

  it('keeps a wrapped label beside its arrow: the link is inline-flex, not nowrap', () => {
    const html = renderToStaticMarkup(<TrailLink href="/x" text="Part of the BeachBus Palawan case study" />)
    expect(html).toContain('inline-flex')
    expect(html).not.toContain('whitespace-nowrap')
  })

  it('is a label: map-label type, no arrow, a 32px hit area from 640px', () => {
    const html = renderToStaticMarkup(<TrailLink href="/projects/graceland-bicolano-dining" text="Graceland Bicolano Dining" kind="label" />)
    expect(html).toMatch(/class="map-label inline-flex min-h-\[44px\] items-center gap-1\.5 text-ink sm:min-h-\[32px\]"/)
    expect(html).toContain('<span class="link-draw">Graceland Bicolano Dining</span></a>')
  })

  it('opens an external link in a new tab, says so, and points up and out', () => {
    const html = renderToStaticMarkup(<TrailLink href="https://graceland.ph" text="graceland.ph" kind="label" external />)
    expect(html).toMatch(/^<a href="https:\/\/graceland.ph" target="_blank" rel="noopener noreferrer"/)
    expect(html).toContain('<span class="sr-only">(opens in a new tab)</span>')
    expect(html).toContain('<svg')
    expect(html).not.toContain('arrow-nudge')
  })

  it('reads extra words to screen readers only, after the text', () => {
    const html = renderToStaticMarkup(<TrailLink href="/projects/graceland-bicolano-dining" text="Read more" srText=" about Graceland Bicolano Dining" />)
    expect(html).toContain('<span class="link-draw">Read more</span><span class="sr-only"> about Graceland Bicolano Dining</span>')
  })

  it('merges a caller class over its own', () => {
    const html = renderToStaticMarkup(<TrailLink href="/" text="Home" kind="label" className="text-muted-strong" />)
    expect(html).toContain('text-muted-strong')
    expect(html).not.toMatch(/class="[^"]*\btext-ink\b/)
  })

  it('lends its inside and its classes to a cue inside a link that is already open', () => {
    const cue = renderToStaticMarkup(
      <span className={trailLinkClass('action')}>
        <TrailLinkText text="Read the case study" />
      </span>,
    )
    expect(cue).toMatch(/^<span class="button-label inline-flex/)
    expect(cue).toContain('<span class="link-draw">Read the case study</span><svg')
    expect(cue).not.toContain('<a ')
  })
})

describe('the homepage link idiom', () => {
  it('goes through TrailLink: no hand-rolled ProjectLink, Pin, PlaceGlyph or LABELS in a section', () => {
    for (const f of ['intro', 'now-building', 'experience', 'work-list', 'work-with-me', 'stack-table']) {
      const src = readFileSync(`components/sections/${f}.tsx`, 'utf8')
      expect(src, f).not.toMatch(/function (ProjectLink|Pin|PlaceGlyph)\b|const LABELS\b/)
    }
  })

  it('draws the places’ links, the one list of bare text links, with TrailLink and no link-draw span of its own', () => {
    const src = readFileSync('components/sections/work-with-me.tsx', 'utf8')
    expect(src).toContain('<TrailLink')
    expect(src).not.toContain('className="link-draw"')
  })

  it('goes through TrailLink on the project pages too', () => {
    for (const f of ['case-study-body', 'project-summary', 'project-header']) {
      const src = readFileSync(`components/case-study/${f}.tsx`, 'utf8')
      expect(src, f).not.toContain('className="link-draw"')
      expect(src, f).not.toContain('ArrowLinkText')
    }
    expect(readFileSync('app/projects/[slug]/page.tsx', 'utf8')).not.toContain('className="link-draw"')
  })
})
