import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseCssRules } from '@/tests/helpers/css-rules'

// First Light's motion: the intro's lines rise on load, rows rise as they
// enter, first light follows the page. No contour shift, no trail, no plate rise.
const css = readFileSync('app/globals.css', 'utf8')
const rules = parseCssRules(css)

describe('the intro rises line by line', () => {
  it('staggers each line on --stagger-line, behind no-preference', () => {
    const line = rules.find((r) => r.selector === '.rise' && /animation:/.test(r.body))
    expect(line?.body).toMatch(/calc\(var\(--i, 0\) \* var\(--stagger-line\)\)/)
    expect(line?.ancestors).toContain('@media (prefers-reduced-motion: no-preference)')
  })

  it('numbers the intro’s lines on --i, and only the intro’s', () => {
    const intro = readFileSync('components/sections/intro.tsx', 'utf8')
    expect(intro).toContain("'--i': i")
    expect(intro.match(/style=\{line\(\d\)\}/g)?.length).toBeGreaterThanOrEqual(3)
  })
})

describe('the contour shift is gone', () => {
  it('no rule moves a contour under the pointer', () => {
    expect(css).not.toMatch(/contours|:has\(\.trailhead/)
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
