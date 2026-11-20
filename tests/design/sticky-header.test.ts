import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// The legend is sticky, floating 12px below the top, 56px tall at every width.
// Without scroll padding, a focused element or an anchor target scrolled into
// view lands under it (WCAG 2.4.11, the a11y gate's P1-1).
const css = readFileSync('app/globals.css', 'utf8')
const rem = (v: string) => Number(v.replace('rem', '')) * 16

describe('sticky header never hides focus or an anchor target', () => {
  it('pads the root scroller by more than the header at both breakpoints', () => {
    // The legend floats 12px below the top and is 56px tall at every width.
    const base = css.match(/html \{[^}]*scroll-padding-top:\s*([\d.]+rem)/)?.[1]
    expect(base).toBeDefined()
    expect(rem(base!)).toBeGreaterThanOrEqual(12 + 56 + 8)
  })

  it('keeps focus clear of the fixed chat launcher below sm', () => {
    expect(css).toMatch(/@media \(max-width: 639px\) \{\s*html \{\s*scroll-padding-bottom:\s*4\.5rem;/)
  })

  it('gives anchor sections a scroll margin of their own', () => {
    expect(css).toMatch(/section\[id\][^{]*\{[^}]*scroll-margin-top:/)
  })
})

// Far sections skip rendering (content-visibility: auto, the perf fix) and
// stand in at an estimated height, so a jump to #contact computed against the
// estimates landed thousands of pixels short on a phone. Before an in-page
// jump, the top bar renders them for real.
describe('in-page jumps land on their target', () => {
  it('can switch deferred rendering off for the length of a jump', () => {
    expect(css).toMatch(/\.render-all \.defer-render \{\s*content-visibility: visible;/)
  })

  it('does so before a same-page hash link scrolls, on a hash load and after a route change', () => {
    const bar = readFileSync('components/site-legend.tsx', 'utf8')
    expect(bar).toContain("classList.add('render-all')")
    expect(bar).toContain("document.addEventListener('click', onClick, true)")
    expect(bar).toMatch(/location\.hash/)
    expect(bar).toContain('scrollIntoView')
  })
})
