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
    const html = renderToStaticMarkup(<TrailLink href="/projects/latag" text="Latag" kind="label" />)
    expect(html).toMatch(/class="map-label inline-flex min-h-\[44px\] items-center gap-1\.5 text-ink sm:min-h-\[32px\]"/)
    expect(html).toContain('<span class="link-draw">Latag</span></a>')
  })

  it('opens an external link in a new tab, says so, and points up and out', () => {
    const html = renderToStaticMarkup(<TrailLink href="https://latag.ph" text="latag.ph" kind="label" external />)
    expect(html).toMatch(/^<a href="https:\/\/latag\.ph" target="_blank" rel="noopener noreferrer"/)
    expect(html).toContain('<span class="sr-only">(opens in a new tab)</span>')
    expect(html).toContain('<svg')
    expect(html).not.toContain('arrow-nudge')
  })

  it('reads extra words to screen readers only, after the text', () => {
    const html = renderToStaticMarkup(<TrailLink href="/projects/latag" text="Read more" srText=" about Latag" />)
    expect(html).toContain('<span class="link-draw">Read more</span><span class="sr-only"> about Latag</span>')
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
