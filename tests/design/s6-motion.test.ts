import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseCssRules } from '@/tests/helpers/css-rules'

// Spec §4: "The hero contours shift slightly under a fine pointer; nothing on
// touch. Headlines rise line by line; screenshots appear once as they enter view."
const css = readFileSync('app/globals.css', 'utf8')
const rules = parseCssRules(css)

describe('the headline rises line by line (shipped in S2)', () => {
  it('staggers each authored line on --stagger-line, behind no-preference', () => {
    const line = rules.find((r) => r.selector === '.trailhead-line' && /animation:/.test(r.body))
    expect(line?.body).toMatch(/calc\(var\(--i, 0\) \* var\(--stagger-line\)\)/)
    expect(line?.ancestors).toContain('@media (prefers-reduced-motion: no-preference)')
  })
})

describe('the hero contours shift under a fine pointer', () => {
  const shift = rules.filter((r) => /\.trailhead-contours/.test(r.selector) && /transform|transition/.test(r.body))

  it('only on a fine pointer with motion allowed', () => {
    expect(shift.length).toBeGreaterThanOrEqual(3)
    for (const r of shift) {
      const at = r.ancestors.join(' ')
      expect(at, r.selector).toContain('(hover: hover)')
      expect(at, r.selector).toContain('(pointer: fine)')
      expect(at, r.selector).toContain('(prefers-reduced-motion: no-preference)')
    }
  })

  it('toward the half the pointer rests on, 8px by transform, on a token', () => {
    const sel = shift.map((r) => r.selector).join(' ')
    expect(sel).toMatch(/\.trailhead:has\(\.trailhead-copy:hover\) \.trailhead-contours/)
    expect(sel).toMatch(/\.trailhead:has\(\.trailhead-plate:hover\) \.trailhead-contours/)
    const body = shift.map((r) => r.body).join(';')
    expect(body).toMatch(/translate\(-8px, -4px\)/)
    expect(body).toMatch(/translate\(8px, 4px\)/)
    expect(body).toMatch(/transition: transform var\(--dur-crawl\) var\(--ease-smooth\)/)
    expect(body).not.toMatch(/animation/)
  })

  it('names both halves and the contours in the trailhead', () => {
    const src = readFileSync('components/sections/trailhead.tsx', 'utf8')
    for (const cls of ['trailhead-contours', 'trailhead-plate', 'trailhead-copy']) expect(src, cls).toContain(cls)
  })
})

describe('screenshots are stills: no appear-once rise', () => {
  // Tried in S6 and removed: a trigger-held animation sits paused at its first
  // keyframe (so plates rested offset) and the minifier collapses the trigger range.
  it('plate-rise and timeline-trigger appear nowhere in app/, components/ or globals.css', () => {
    const dirs = ['app', 'components']
    const walk = (d: string): string[] =>
      readdirSync(d).flatMap((e) => {
        const p = join(d, e)
        return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|css)$/.test(p) ? [p] : []
      })
    for (const f of [...dirs.flatMap(walk), 'app/globals.css']) {
      const src = readFileSync(f, 'utf8')
      expect(src, f).not.toMatch(/plate-rise|timeline-trigger|animation-trigger/)
    }
  })
})
