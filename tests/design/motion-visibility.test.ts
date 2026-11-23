import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parseCssRules } from '@/tests/helpers/css-rules'

// The motion a visitor is meant to see must stay inside its bounds and still
// sit behind the reduced-motion and support gates. First Light has two scroll
// animations: rows rising into place (a view timeline) and the dawn rising
// behind the land (the root scroll timeline). Neither touches a screenshot.
const rules = parseCssRules(readFileSync('app/globals.css', 'utf8'))

describe('scroll reveals', () => {
  const rise = rules.find((r) => r.selector === '.rise-in')

  it('rise in while the row crosses the viewport’s edge: the entry range, once', () => {
    expect(rise?.body).toMatch(/animation-range:\s*entry 0% entry 100%/)
    expect(rise?.body).toMatch(/animation-timeline:\s*view\(\)/)
  })

  it('end at the finished page: the rise settles, never fades', () => {
    expect(rise?.body).toMatch(/animation:\s*rise-in linear both/)
    const keyframes = rules.filter((r) => r.ancestors.some((a) => a === '@keyframes rise-in'))
    expect(keyframes.length).toBe(2)
    for (const k of keyframes) expect(k.body).not.toMatch(/opacity/)
  })

  it('sit inside both gates', () => {
    expect(rise?.ancestors.join(' | ')).toContain('animation-timeline: view()')
    expect(rise?.ancestors).toContain('@media (prefers-reduced-motion: no-preference)')
  })
})
