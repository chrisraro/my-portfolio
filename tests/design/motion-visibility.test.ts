import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// SP2 gate fix B: the motion a visitor is meant to see must stay inside its
// bounds and still sit behind the reduced-motion and support gates. (The
// scroll-linked previews it once covered were removed in the Lobby Rack
// refinement; tests/design/catalog-motion.test.ts guards that.)
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

describe('scroll reveals', () => {
  const block = gatedBlock('reveal-cover')

  it('play while the element is in view (the contract’s range), not as it crosses the edge', () => {
    for (const cls of ['reveal-cover', 'reveal-fold']) {
      const rule = block.match(new RegExp(String.raw`\.${cls}[^{]*\{[^}]*\}`))?.[0] ?? ''
      expect(rule, cls).toMatch(/animation-range:\s*entry (?:calc\()?10%[^;]*cover 30%/)
    }
  })
})
