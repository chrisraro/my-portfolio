import { readFileSync } from 'node:fs'
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

describe('screenshots appear once as they enter view', () => {
  const rise = rules.filter((r) => /\.plate-rise/.test(r.selector) && /animation/.test(r.body) && !/animation:\s*none/.test(r.body))

  it('rise on a scroll trigger, played forwards once, never scrubbed', () => {
    expect(rise.length).toBeGreaterThan(0)
    const body = rise.map((r) => r.body).join(';')
    expect(body).toMatch(/timeline-trigger:\s*--plate view\(\) entry 0% entry 100%/)
    expect(body).toMatch(/animation-trigger:\s*--plate play-forwards/)
    expect(body).not.toMatch(/animation-timeline/)
    for (const r of rise) {
      const at = r.ancestors.join(' ')
      expect(at).toContain('@supports (timeline-trigger: --plate view())')
      expect(at).toContain('(prefers-reduced-motion: no-preference)')
    }
  })

  // A plate that mounts already in view (after a filter change) never crosses
  // its entry range, so its trigger may never fire. A backwards fill would hold
  // it 16px low forever; with no fill an un-fired plate rests where it belongs.
  it('never rest offset: no backwards fill, the at-rest state is the finished one', () => {
    const body = rise.map((r) => r.body).join(';')
    expect(body).not.toMatch(/animation-fill-mode:\s*(backwards|both)/)
    expect(body).not.toMatch(/animation:[^;]*\b(backwards|both)\b/)
    const frames = css.match(/@keyframes plate-rise \{([\s\S]*?)\n\t\t\}/)?.[1]
    expect(frames).toMatch(/to \{ transform: none; \}/)
  })

  it('keep both gates on every rise rule', () => {
    for (const r of rise) {
      const at = r.ancestors.join(' ')
      expect(at).toContain('@supports (timeline-trigger: --plate view())')
      expect(at).toContain('(prefers-reduced-motion: no-preference)')
    }
  })

  it('move their last 16px by transform only', () => {
    const frames = css.match(/@keyframes plate-rise \{([\s\S]*?)\n\t\t\}/)?.[1]
    expect(frames).toBeDefined()
    expect(frames).toContain('translateY(16px)')
    expect(frames).not.toContain('opacity')
  })

  it('switch off under reduce', () => {
    const off = rules.find((r) => /\.plate-rise/.test(r.selector) && r.ancestors.includes('@media (prefers-reduced-motion: reduce)'))
    expect(off?.body).toMatch(/animation:\s*none/)
  })

  it('sit on every project plate, own-product plate and case-study shot', () => {
    for (const f of ['components/ui/project-plate.tsx', 'components/sections/own-products.tsx', 'components/case-study/project-screenshots.tsx']) {
      expect(readFileSync(f, 'utf8'), f).toContain('plate-rise')
    }
  })
})
