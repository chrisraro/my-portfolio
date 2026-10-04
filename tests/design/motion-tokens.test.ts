import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { motionTokens, springs } from '@/lib/motion-tokens'

const css = readFileSync('app/globals.css', 'utf8')

function cssVar(name: string): string {
  const m = css.match(new RegExp(String.raw`${name}:\s*([^;]+);`))
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

  it('keeps every .reveal animation inside both gates', () => {
    const rules = parseRules(css)
    const reveals = rules.filter((r) => r.selector.includes('.reveal'))
    expect(reveals.length).toBeGreaterThan(0)
    const animated = reveals.filter((r) => /animation(-timeline|-range)?\s*:/.test(r.body) && !/animation\s*:\s*none/.test(r.body))
    expect(animated.length).toBeGreaterThan(0)
    for (const r of animated) {
      expect(r.ancestors, `${r.selector} needs @supports`).toContain('@supports (animation-timeline: view())')
      expect(r.ancestors, `${r.selector} needs no-preference`).toContain('@media (prefers-reduced-motion: no-preference)')
    }
  })

  it('switches every reveal variant off under prefers-reduced-motion: reduce', () => {
    const rules = parseRules(css)
    const animated = rules.filter(
      (r) => /\.reveal-[\w-]+/.test(r.selector) && /animation\s*:/.test(r.body) && !/animation\s*:\s*none/.test(r.body),
    )
    const variants = new Set(animated.flatMap((r) => r.selector.match(/\.reveal-[\w-]+/g) ?? []))
    // The contract's choreography: flap, leaf, drop, lip, cover, postcard, route, stop, reply, perforation.
    expect(variants.size).toBeGreaterThanOrEqual(10)
    const off = rules
      .filter((r) => r.ancestors.includes('@media (prefers-reduced-motion: reduce)') && /animation\s*:\s*none/.test(r.body))
      .map((r) => r.selector)
      .join(' ')
    for (const v of Array.from(variants)) expect(off, `${v} is not switched off under reduce`).toMatch(new RegExp(`${v.replace('.', '\\.')}(?![\\w-])`))
  })

  it('runs the hero load sequence only under no-preference, and switches it off under reduce', () => {
    const rules = parseRules(css)
    const animated = rules.filter(
      (r) => /\.hero-[\w-]+/.test(r.selector) && /animation(-name)?\s*:/.test(r.body) && !/animation\s*:\s*none/.test(r.body),
    )
    expect(animated.length).toBeGreaterThan(0)
    for (const r of animated) {
      expect(r.ancestors, `${r.selector} needs no-preference`).toContain('@media (prefers-reduced-motion: no-preference)')
    }
    const off = rules.find(
      (r) => r.selector.includes('.hero-word') && r.ancestors.includes('@media (prefers-reduced-motion: reduce)') && /animation\s*:\s*none/.test(r.body),
    )
    expect(off).toBeDefined()
  })

  it('keeps the hero sequence under two seconds', () => {
    const ms = (name: string) => {
      const m = css.match(new RegExp(String.raw`${name}:\s*(\d+)ms;`))
      if (!m) throw new Error(`missing ${name}`)
      return Number(m[1])
    }
    // The last crease starts latest and draws over the crawl duration.
    const end = ms('--t-crease-2') + motionTokens.duration.crawl * 1000
    expect(end).toBeLessThan(2000)
  })

  it('switches .reveal off under prefers-reduced-motion: reduce', () => {
    const off = parseRules(css).find(
      (r) =>
        r.selector.includes('.reveal') &&
        r.ancestors.includes('@media (prefers-reduced-motion: reduce)') &&
        /animation\s*:\s*none/.test(r.body),
    )
    expect(off).toBeDefined()
  })
})

interface Rule {
  selector: string
  body: string
  ancestors: string[]
}

// Leaf rules (blocks with no nested block) with the at-rule preludes enclosing them.
function parseRules(source: string): Rule[] {
  const text = source.replace(/\/\*[\s\S]*?\*\//g, '')
  const rules: Rule[] = []
  const stack: { prelude: string; start: number }[] = []
  let last = 0
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '{') {
      stack.push({ prelude: text.slice(last, i).replace(/\s+/g, ' ').trim(), start: i + 1 })
      last = i + 1
    } else if (ch === '}') {
      const top = stack.pop()
      if (top) {
        const body = text.slice(top.start, i)
        if (!body.includes('{')) {
          rules.push({ selector: top.prelude, body, ancestors: stack.map((s) => s.prelude) })
        }
      }
      last = i + 1
    } else if (ch === ';') {
      last = i + 1
    }
  }
  return rules
}
