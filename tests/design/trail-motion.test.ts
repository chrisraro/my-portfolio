import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parseCssRules } from '../helpers/css-rules'

// Spec §4 and the S2 trail topology: the trailhead's trail draws once on
// load; each short segment between sections draws on its own view timeline;
// only the elevation strip's marker follows the page's scroll. Outside the
// gates the trail is fully drawn and the marker sits at now.
const css = readFileSync('app/globals.css', 'utf8')
const rules = parseCssRules(css)
const trail = rules.filter((r) => r.selector.includes('.trail-draw'))
const NO_PREF = '@media (prefers-reduced-motion: no-preference)'

describe('trail draw', () => {
  it('draws the trailhead once on load, only when motion is allowed', () => {
    const load = trail.filter((r) => r.selector === '.trail-draw--load')
    expect(load).toHaveLength(1)
    expect(load[0].ancestors).toEqual([NO_PREF])
    expect(load[0].body).toMatch(/animation:\s*trail-draw var\(--dur-draw\) var\(--ease-smooth\) var\(--t-trail, 0ms\) both/)
    expect(load[0].body).not.toMatch(/animation-timeline/)
  })

  it('draws each segment on its own view timeline, inside both gates', () => {
    const view = trail.filter((r) => r.selector === '.trail-draw--view')
    expect(view).toHaveLength(1)
    expect(view[0].ancestors).toEqual(['@supports (animation-timeline: view())', NO_PREF])
    expect(view[0].body).toMatch(/animation-timeline:\s*--trail-segment;/)
    expect(view[0].body).toMatch(/animation-range:\s*entry 10% cover 45%/)
    // The timeline is named on the <svg> (a CSS box), not on the path.
    const scope = rules.filter((r) => r.selector === '.trail-view')
    expect(scope).toHaveLength(1)
    expect(scope[0].ancestors).toEqual([])
    expect(scope[0].body).toMatch(/view-timeline:\s*--trail-segment block/)
  })

  it('never follows the page scroll', () => {
    for (const r of trail) expect(r.body, r.selector).not.toMatch(/scroll\(/)
  })

  it('is fully drawn outside the gates', () => {
    const base = trail.filter((r) => r.ancestors.every((a) => a.startsWith('@layer')))
    expect(base.length).toBeGreaterThan(0)
    for (const r of base) expect(r.body).not.toMatch(/stroke-dashoffset:\s*1\b/)
  })

  it('never hides the trail outside its keyframes', () => {
    for (const r of trail) expect(r.body, r.selector).not.toMatch(/stroke-dashoffset:\s*1\b/)
    const keyframes = css.match(/@keyframes trail-draw \{([\s\S]*?)\n\}/)?.[1]
    expect(keyframes).toBeDefined()
    expect(keyframes).toMatch(/from\s*\{[^}]*stroke-dashoffset:\s*1\b/)
  })

  it('never loops', () => {
    for (const r of trail) expect(r.body).not.toMatch(/infinite/)
  })
})

describe('elevation marker', () => {
  const marker = rules.filter((r) => r.selector === '.elevation-marker')

  it('travels to now on the strip\'s own view timeline, inside both gates', () => {
    expect(marker).toHaveLength(1)
    expect(marker[0].ancestors).toEqual(['@supports (animation-timeline: view())', NO_PREF])
    expect(marker[0].body).toMatch(/animation-timeline:\s*--elevation;/)
    expect(marker[0].body).not.toMatch(/scroll\(/)
    expect(rules.some((r) => /view-timeline:\s*--elevation block/.test(r.body))).toBe(true)
  })

  it('moves by transform only and rests at now', () => {
    const frames = rules.filter((r) => r.ancestors.includes('@keyframes elevation-marker'))
    expect(frames.map((r) => r.selector)).toEqual(['from', 'to'])
    for (const r of frames) {
      expect(r.body).toMatch(/transform:/)
      expect(r.body).not.toMatch(/opacity/)
    }
    expect(frames[1].body).toMatch(/transform:\s*none/)
  })
})
