import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ScrollPreview } from '@/components/ui/scroll-preview'

const src = '/assets/images/projects/latag-full.webp'
const label = 'Scroll preview of latag.ph'

describe('ScrollPreview', () => {
  it('frames the full shot, named but not a tab stop, when there is no link', () => {
    const html = renderToStaticMarkup(<ScrollPreview src={src} label={label} />)
    expect(html).toContain('scroll-preview')
    expect(html).toContain('scroll-preview__shot')
    expect(html).toContain('scroll-preview__progress')
    expect(html).toContain(encodeURIComponent(src))
    expect(html).toMatch(/^<div role="img"/)
    expect(html).not.toMatch(/tabindex/i)
    expect(html).toContain(`aria-label="${label}"`)
    expect(html).not.toContain('<a ')
  })

  it('drops out of the tab order and the tree when a visible link already goes there', () => {
    const html = renderToStaticMarkup(<ScrollPreview src={src} label={label} href="/projects/latag" duplicateLink />)
    expect(html).toMatch(/<a [^>]*href="\/projects\/latag"/)
    expect(html).toMatch(/<a [^>]*tabindex="-1"/i)
    expect(html).toMatch(/<a [^>]*aria-hidden="true"/)
    expect(html).not.toContain('aria-label')
  })

  it('scrolls with the page when asked: its own view timeline, or the page’s', () => {
    expect(renderToStaticMarkup(<ScrollPreview src={src} label={label} scroll="view" />)).toContain('scroll-preview--view')
    expect(renderToStaticMarkup(<ScrollPreview src={src} label={label} scroll="page" />)).toContain('scroll-preview--page')
    expect(renderToStaticMarkup(<ScrollPreview src={src} label={label} />)).not.toMatch(/scroll-preview--(view|page)/)
  })

  it('shows a progress track and a printed "scroll" cue, both decorative', () => {
    const html = renderToStaticMarkup(<ScrollPreview src={src} label={label} />)
    expect(html).toMatch(/<span class="scroll-preview__track" aria-hidden="true">/)
    expect(html).toMatch(/<span class="scroll-preview__cue[^"]*" aria-hidden="true">/)
    expect(html).toContain('scroll')
  })

  it('becomes the link when an href is given, named by the label', () => {
    const html = renderToStaticMarkup(<ScrollPreview src={src} label={label} href="/projects/latag" />)
    expect(html).toMatch(/<a [^>]*href="\/projects\/latag"/)
    expect(html).toMatch(/<a [^>]*aria-label="Scroll preview of latag\.ph, opens project page"/)
    expect(html).not.toMatch(/tabindex="0"/i)
  })

  it('stays silent inside a card link: no link, no focus stop, no name', () => {
    const html = renderToStaticMarkup(<ScrollPreview src={src} label={label} decorative />)
    expect(html).toMatch(/^<span aria-hidden="true"/)
    expect(html).not.toContain('<a ')
    expect(html).not.toMatch(/tabindex/i)
    expect(html).not.toContain('aria-label')
  })

  it('sets the scroll duration from the shot height when given', () => {
    const html = renderToStaticMarkup(<ScrollPreview src={src} label={label} shotHeight={6000} />)
    expect(html).toContain('--shot-h:6000')
  })

  it('keeps the progress rule decorative and the image unannounced', () => {
    const html = renderToStaticMarkup(<ScrollPreview src={src} label={label} />)
    expect(html).toMatch(/class="scroll-preview__progress"[^>]*aria-hidden="true"|aria-hidden="true"[^>]*class="scroll-preview__progress"/)
    expect(html).toMatch(/alt=""/)
  })
})

describe('ScrollPreview CSS', () => {
  const css = readFileSync('app/globals.css', 'utf8')

  it('scrolls object-position and grows the rule with tokens only', () => {
    expect(css).toMatch(/\.scroll-preview__shot[^{]*\{[^}]*object-position:\s*50% 0%/)
    expect(css).toMatch(/object-position:\s*50% 100%/)
    expect(css).toMatch(/--scroll-dur:[^;]*var\(--dur-crawl\)/)
    const block = css.slice(css.indexOf('/* ScrollPreview'), css.indexOf('/* /ScrollPreview'))
    expect(block.length).toBeGreaterThan(0)
    // No raw seconds in transitions: durations come from --dur-* / --scroll-dur.
    expect(block).not.toMatch(/transition[^;]*\d+(\.\d+)?m?s\b/)
  })

  it('only scrolls under no-preference, and pins the shot to the top under reduce', () => {
    const reduce = css.slice(css.lastIndexOf('@media (prefers-reduced-motion: reduce)'))
    expect(reduce).toMatch(/\.scroll-preview__shot[^{]*\{[^}]*object-position:\s*50% 0%\s*!important/)
    expect(reduce).toMatch(/\.scroll-preview__progress[^{]*\{[^}]*display:\s*none/)
    const scrollRule = css.match(/@media \(prefers-reduced-motion: no-preference\)[^@]*?object-position:\s*50% 100%/)
    expect(scrollRule).not.toBeNull()
  })
})
