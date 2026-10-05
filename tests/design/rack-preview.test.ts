import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Desktop rack previews were hover-only, with no cue at rest (confirm critique,
// P1). A pocket now shows a sliver of the shot with the cue in it, and where
// scroll timelines exist the shot follows its card through the viewport.
const css = readFileSync('app/globals.css', 'utf8')

/** The body of every rule whose selector matches `selector`, wherever it sits. */
function rules(selector: RegExp): string[] {
  return Array.from(css.matchAll(/([^{}]+)\{([^{}]*)\}/g))
    .filter(([, sel]) => selector.test(sel))
    .map(([, , body]) => body)
}

describe('rack previews at rest', () => {
  it('shows more than the 44% text block above the lip, so a sliver of the shot is visible', () => {
    const pocket = rules(/^\s*\.rack-pocket\s*$/).join('')
    const [w, h] = (pocket.match(/aspect-ratio:\s*([\d.]+)\s*\/\s*([\d.]+)/) ?? []).slice(1).map(Number)
    // Visible fraction of a 9:16 card: (9/16) x (w/h)^-1 ... = 9 h / (16 w).
    const visible = (9 * h) / (16 * w)
    expect(visible).toBeGreaterThan(0.5)
    expect(visible).toBeLessThan(0.62)
  })

  it('drives the desktop rack shot from a view timeline, gated on support and motion preference', () => {
    const block = css.slice(css.indexOf('@supports (animation-timeline: view())', css.indexOf('/* ScrollPreview')))
    expect(block).toMatch(/@media \(min-width: 640px\)\s*\{[\s\S]*?\.rack-slot\s*\{\s*view-timeline:\s*--slot block/)
    expect(block).toMatch(/\.rack-card \.scroll-preview__shot\s*\{[^}]*animation-timeline:\s*--slot/)
    expect(block).toMatch(/\.rack-card \.scroll-preview__progress\s*\{[^}]*animation-timeline:\s*--slot/)
  })

  it('prints the cue in the visible sliver, and keeps it under reduced motion', () => {
    expect(rules(/\.rack-card \.scroll-preview__cue/).some((b) => /top:\s*0\.5rem/.test(b))).toBe(true)
    const reduce = css.slice(css.lastIndexOf('@media (prefers-reduced-motion: reduce)'))
    expect(reduce).toMatch(/\.rack-card \.scroll-preview__cue\s*\{\s*display:\s*inline-flex/)
  })

  it('never lifts a flat card (no preview to show)', () => {
    const lifts = Array.from(css.matchAll(/([^{}]+)\{[^{}]*translateY\(-\d+%\)/g)).map(([, sel]) => sel)
    expect(lifts.length).toBeGreaterThan(0)
    for (const sel of lifts) expect(sel, sel).toContain(':not(.rack-card--flat)')
  })
})
