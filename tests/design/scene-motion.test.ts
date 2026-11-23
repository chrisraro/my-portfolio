import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parseCssRules } from '@/tests/helpers/css-rules'

// The scene (components/scene.tsx) is the land fixed behind every page. Its
// one scroll-follow is first light: .scene-dawn rises with the page on the root
// scroll timeline. The fireflies twinkle twice and stop (WCAG 2.2.2).
const css = readFileSync('app/globals.css', 'utf8')
const rules = parseCssRules(css)
const NO_PREF = '@media (prefers-reduced-motion: no-preference)'

describe('first light', () => {
  const dawn = rules.filter((r) => r.selector === '.scene-dawn' && /animation/.test(r.body))

  it('follows the root scroll once, linearly, in one rule', () => {
    expect(dawn).toHaveLength(1)
    expect(dawn[0].body).toMatch(/animation:\s*first-light linear both/)
    expect(dawn[0].body).toMatch(/animation-timeline:\s*scroll\(root block\)/)
  })

  it('sits inside both gates: scroll-timeline support and no-preference', () => {
    const at = dawn[0].ancestors.join(' | ')
    expect(at).toContain('animation-timeline: scroll()')
    expect(dawn[0].ancestors).toContain(NO_PREF)
  })

  it('rises from below the summit by transform; its opacity swell is on the decorative layer only', () => {
    const keys = rules.filter((r) => r.ancestors.some((a) => a === '@keyframes first-light'))
    expect(keys.map((k) => k.selector)).toEqual(['from', 'to'])
    expect(keys[0].body).toMatch(/transform:\s*translateY\(\d+px\)/)
    expect(keys[1].body).toMatch(/transform:\s*none/)
    // The layer is aria-hidden paint; no text sits on it unscrimmed.
    const scene = readFileSync('components/scene.tsx', 'utf8')
    expect(scene).toContain('aria-hidden')
  })

  it('is at rest, up, under reduced motion', () => {
    const reduce = rules.find((r) => r.ancestors.includes('@media (prefers-reduced-motion: reduce)') && r.selector.includes('.scene-dawn'))
    expect(reduce?.body).toMatch(/animation:\s*none/)
    expect(reduce?.body).toMatch(/opacity:\s*1/)
  })

  it('is the only thing in the stylesheet that follows the page scroll', () => {
    const users = rules.filter((r) => /animation-timeline:\s*scroll\(/.test(r.body))
    expect(users.map((r) => r.selector)).toEqual(['.scene-dawn'])
  })
})

describe('the fireflies', () => {
  it('twinkle twice then stop, only under no-preference (WCAG 2.2.2)', () => {
    const twinkle = rules.find((r) => r.selector === '.firefly--twinkle')
    expect(twinkle?.body).toMatch(/animation:\s*firefly [\d.]+s ease-in-out 2;/)
    expect(twinkle?.ancestors).toContain(NO_PREF)
  })

  it('are off below 1280px, where the column and the land share the screen', () => {
    const off = rules.find((r) => r.selector === '.firefly' && r.ancestors.includes('@media (max-width: 1279px)'))
    expect(off?.body).toMatch(/display:\s*none/)
  })
})
