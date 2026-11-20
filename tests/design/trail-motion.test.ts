import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parseCssRules } from '../helpers/css-rules'

// Spec §4: the trail draws with scroll, only where the browser supports
// scroll timelines and the visitor allows motion. Elsewhere it is fully drawn.
const rules = parseCssRules(readFileSync('app/globals.css', 'utf8'))
const trail = rules.filter((r) => r.selector.includes('.trail-draw'))

describe('trail draw', () => {
  it('animates only inside both gates', () => {
    const animated = trail.filter((r) => /animation(-timeline)?\s*:/.test(r.body) && !/animation\s*:\s*none/.test(r.body))
    expect(animated.length).toBeGreaterThan(0)
    for (const r of animated) {
      expect(r.ancestors.some((a) => a.startsWith('@supports (animation-timeline:')), r.selector).toBe(true)
      expect(r.ancestors).toContain('@media (prefers-reduced-motion: no-preference)')
    }
  })

  it('is fully drawn outside the gates', () => {
    const base = trail.filter((r) => r.ancestors.every((a) => a.startsWith('@layer')))
    expect(base.length).toBeGreaterThan(0)
    for (const r of base) expect(r.body).not.toMatch(/stroke-dashoffset:\s*1\b/)
  })

  it('never hides the trail outside its keyframes', () => {
    for (const r of trail) expect(r.body, r.selector).not.toMatch(/stroke-dashoffset:\s*1\b/)
    const css = readFileSync('app/globals.css', 'utf8')
    const keyframes = css.match(/@keyframes trail-draw \{([\s\S]*?)\n\}/)?.[1]
    expect(keyframes).toBeDefined()
    expect(keyframes).toMatch(/from\s*\{[^}]*stroke-dashoffset:\s*1\b/)
  })

  it('never loops', () => {
    for (const r of trail) expect(r.body).not.toMatch(/infinite/)
  })
})
