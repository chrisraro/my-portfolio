import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// SP2 gate fix B: the motion a visitor is meant to see must be visible without
// hovering, stay inside its bounds, and still sit behind the reduced-motion and
// support gates.
const css = readFileSync('app/globals.css', 'utf8')

/** The body of the first `@supports (animation-timeline: view())` block holding `needle`. */
function gatedBlock(needle: string): string {
  let from = 0
  for (;;) {
    const start = css.indexOf('@supports (animation-timeline: view())', from)
    if (start === -1) return ''
    let depth = 0
    let i = css.indexOf('{', start)
    const open = i
    for (; i < css.length; i++) {
      if (css[i] === '{') depth++
      else if (css[i] === '}' && --depth === 0) break
    }
    const body = css.slice(open, i)
    if (body.includes(needle)) return body
    from = i
  }
}

describe('previews scroll with the page', () => {
  const block = gatedBlock('preview-scroll')

  it('animate object-position on a scroll timeline, behind both gates', () => {
    expect(block).toContain('@media (prefers-reduced-motion: no-preference)')
    expect(block).toMatch(/@keyframes preview-scroll \{\s*from \{ object-position: 50% 0%; \}\s*to \{ object-position: 50% 100%; \}/)
    expect(block).toMatch(/\.scroll-preview--view \{[^}]*view-timeline:\s*--preview block/)
    expect(block).toMatch(/\.scroll-preview--view \.scroll-preview__shot \{[^}]*animation-timeline:\s*--preview/)
    // A sticky rail never moves through the viewport: the project page follows the page itself.
    expect(block).toMatch(/\.scroll-preview--page \.scroll-preview__shot \{[^}]*animation-timeline:\s*scroll\(root block\)/)
  })

  it('scroll the rack’s unsunk cards on touch widths, on the tier’s timeline', () => {
    expect(block).toMatch(/@media \(max-width: 639px\)[\s\S]*\.rack-shelf \{[^}]*view-timeline:\s*--rack block/)
    expect(block).toMatch(/\.rack-card \.scroll-preview__shot \{[^}]*animation-timeline:\s*--rack/)
  })

  it('keep the progress rule on the same timeline', () => {
    expect(block).toMatch(/@keyframes preview-progress/)
    expect(block).toMatch(/\.scroll-preview--view \.scroll-preview__progress \{[^}]*animation-timeline:\s*--preview/)
  })

  it('show a cue and the progress track at rest, and hide both under reduced motion', () => {
    expect(css).toMatch(/\.scroll-preview__track \{/)
    expect(css).toMatch(/\.scroll-preview__cue \{/)
    const reduce = css.slice(css.lastIndexOf('@media (prefers-reduced-motion: reduce)'))
    expect(reduce).toMatch(/\.scroll-preview__track[^{]*\{[^}]*display:\s*none/)
    expect(reduce).toMatch(/\.scroll-preview__cue[^{]*\{[^}]*display:\s*none/)
  })
})

describe('hero unfold', () => {
  it('opens from behind the front panel, so no panel swings past the hero', () => {
    expect(css).toMatch(/@keyframes hero-unfold-y \{\s*from \{ transform: rotateY\(88deg\); \}/)
    expect(css).toMatch(/@keyframes hero-unfold-x \{\s*from \{ transform: rotateX\(-88deg\); \}/)
  })
})

describe('scroll reveals', () => {
  const block = gatedBlock('reveal-flap')

  it('play while the element is in view (the contract’s range), not as it crosses the edge', () => {
    for (const cls of ['reveal-flap', 'reveal-leaf', 'reveal-drop', 'reveal-cover', 'reveal-reply', 'reveal-fold']) {
      const rule = block.match(new RegExp(String.raw`\.${cls}[^{]*\{[^}]*\}`))?.[0] ?? ''
      expect(rule, cls).toMatch(/animation-range:\s*entry (?:calc\()?10%[^;]*cover 30%/)
    }
  })

  it('travel far enough to be seen: flaps 22deg, leaves 40px (the xl distance)', () => {
    expect(block).toMatch(/rotateY\(var\(--flap-from, 22deg\)\)/)
    expect(block).toMatch(/translateX\(var\(--slide-from, 40px\)\)/)
    expect(readFileSync('components/sections/products.tsx', 'utf8')).toMatch(/'--flap-from': flapRight \? '-22deg' : '22deg'/)
  })
})
