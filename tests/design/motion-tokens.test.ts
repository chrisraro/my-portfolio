import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { motionTokens, springs } from '@/lib/motion-tokens'

const css = readFileSync('app/globals.css', 'utf8')

function cssVar(name: string): string {
  const m = css.match(new RegExp(`${name}:\s*([^;]+);`))
  if (!m) throw new Error(`missing ${name}`)
  return m[1].trim()
}

describe('motion tokens', () => {
  it('has the spec durations, distances and easings', () => {
    expect(motionTokens.duration).toEqual({ fast: 0.18, normal: 0.35, slow: 0.6, crawl: 1.2 })
    expect(motionTokens.distance).toEqual({ sm: 8, md: 16, lg: 24, xl: 40 })
    expect(motionTokens.easing.smooth).toEqual([0.22, 1, 0.36, 1])
    expect(motionTokens.easing.sharp).toEqual([0.4, 0, 0.2, 1])
  })

  it('has two springs with stiffness and damping', () => {
    for (const s of [springs.snappy, springs.gentle]) {
      expect(s.type).toBe('spring')
      expect(s.stiffness).toBeGreaterThan(0)
      expect(s.damping).toBeGreaterThan(0)
    }
  })

  it('mirrors durations as CSS custom properties', () => {
    for (const [k, v] of Object.entries(motionTokens.duration)) {
      expect(cssVar(`--dur-${k}`)).toBe(`${v}s`)
    }
  })

  it('mirrors easings as CSS custom properties', () => {
    for (const [k, v] of Object.entries(motionTokens.easing)) {
      expect(cssVar(`--ease-${k}`).replace(/\s+/g, '')).toBe(`cubic-bezier(${v.join(',')})`)
    }
  })

  it('gates .reveal behind @supports and no-preference', () => {
    const i = css.indexOf('.reveal')
    expect(i).toBeGreaterThan(-1)
    expect(css).toMatch(/@supports \(animation-timeline: view\(\)\)/)
    expect(css).toMatch(/@media \(prefers-reduced-motion: no-preference\)/)
  })
})
