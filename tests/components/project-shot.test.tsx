import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ProjectShot } from '@/components/ui/project-shot'

const src = '/assets/images/projects/latag-full.webp'
const label = 'Screenshot of latag.ph'

describe('ProjectShot', () => {
  it('frames the shot, named but not a tab stop, when there is no link', () => {
    const html = renderToStaticMarkup(<ProjectShot src={src} label={label} />)
    expect(html).toContain('project-shot')
    expect(html).toContain('project-shot__frame')
    expect(html).toContain(encodeURIComponent(src))
    expect(html).toMatch(/^<div role="img"/)
    expect(html).not.toMatch(/tabindex/i)
    expect(html).toContain(`aria-label="${label}"`)
    expect(html).not.toContain('<a ')
  })

  it('is a still picture: the top of the shot, no scroll cue, no progress rule', () => {
    const html = renderToStaticMarkup(<ProjectShot src={src} label={label} />)
    expect(html).toMatch(/<img [^>]*class="[^"]*object-top/)
    expect(html).not.toMatch(/scroll-preview|__cue|__progress|__track|--shot-h/)
    expect(html).not.toMatch(/>\s*scroll\s*</)
  })

  it('does not take hover motion when it is not a link (nothing to invite)', () => {
    expect(renderToStaticMarkup(<ProjectShot src={src} label={label} />)).not.toContain('lift-card ')
  })

  it('drops out of the tab order and the tree when a visible link already goes there', () => {
    const html = renderToStaticMarkup(<ProjectShot src={src} label={label} href="/projects/latag" duplicateLink />)
    expect(html).toMatch(/<a [^>]*href="\/projects\/latag"/)
    expect(html).toMatch(/<a [^>]*tabindex="-1"/i)
    expect(html).toMatch(/<a [^>]*aria-hidden="true"/)
    expect(html).not.toContain('aria-label')
    // Still a pointer target: it takes the card hover.
    expect(html).toMatch(/<a [^>]*class="project-shot lift-card /)
  })

  it('becomes the link when an href is given, named by the label', () => {
    const html = renderToStaticMarkup(<ProjectShot src={src} label={label} href="/projects/latag" />)
    expect(html).toMatch(/<a [^>]*href="\/projects\/latag"/)
    expect(html).toMatch(/<a [^>]*aria-label="Screenshot of latag\.ph, opens project page"/)
    expect(html).not.toMatch(/tabindex="0"/i)
    expect(html).toContain('lift-card')
  })

  it('stays silent inside a card link: no link, no focus stop, no name, no hover of its own', () => {
    const html = renderToStaticMarkup(<ProjectShot src={src} label={label} decorative />)
    expect(html).toMatch(/^<span aria-hidden="true"/)
    expect(html).not.toContain('<a ')
    expect(html).not.toMatch(/tabindex/i)
    expect(html).not.toContain('aria-label')
    expect(html).not.toContain('lift-card ')
  })

  it('scales the image inside a clipping frame, and leaves the image unannounced', () => {
    const html = renderToStaticMarkup(<ProjectShot src={src} label={label} />)
    expect(html).toMatch(/<span class="project-shot__frame[^"]*overflow-hidden[^"]*">\s*<img /)
    expect(html).toMatch(/<img [^>]*class="[^"]*lift-card__shot/)
    expect(html).toMatch(/alt=""/)
  })
})
