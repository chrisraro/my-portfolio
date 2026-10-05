import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// The top bar is sticky: about 101px tall below md (two rows), 65px from md.
// Without scroll padding, a focused element or an anchor target scrolled into
// view lands under it (WCAG 2.4.11, the a11y gate's P1-1).
const css = readFileSync('app/globals.css', 'utf8')
const rem = (v: string) => Number(v.replace('rem', '')) * 16

describe('sticky header never hides focus or an anchor target', () => {
  it('pads the root scroller by more than the header at both breakpoints', () => {
    const base = css.match(/html \{[^}]*scroll-padding-top:\s*([\d.]+rem)/)?.[1]
    expect(base).toBeDefined()
    expect(rem(base!)).toBeGreaterThanOrEqual(101 + 8)
    const md = css.match(/@media \(min-width: 768px\) \{\s*html \{\s*scroll-padding-top:\s*([\d.]+rem)/)?.[1]
    expect(md).toBeDefined()
    expect(rem(md!)).toBeGreaterThanOrEqual(65 + 8)
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
    expect(css).toMatch(/\.render-all \.defer-render,\s*\.render-all \.defer-render-lift \{\s*content-visibility: visible;/)
  })

  it('does so before a same-page hash link scrolls, on a hash load and after a route change', () => {
    const bar = readFileSync('components/top-bar.tsx', 'utf8')
    expect(bar).toContain("classList.add('render-all')")
    expect(bar).toContain("document.addEventListener('click', onClick, true)")
    expect(bar).toMatch(/location\.hash/)
    expect(bar).toContain('scrollIntoView')
  })
})
