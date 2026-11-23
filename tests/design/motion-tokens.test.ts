import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { heroContent } from '@/lib/data'
import { motionTokens, springs } from '@/lib/motion-tokens'

const css = readFileSync('app/globals.css', 'utf8')

function cssVar(name: string): string {
  const m = css.match(new RegExp(String.raw`${name}:\s*([^;]+);`))
  if (!m) throw new Error(`missing ${name}`)
  return m[1].trim()
}

describe('motion tokens', () => {
  it('has the spec durations, distances and easings', () => {
    expect(motionTokens.duration).toEqual({ fast: 0.18, normal: 0.35, slow: 0.6, crawl: 1.2, draw: 1.6 })
    expect(motionTokens.distance).toEqual({ sm: 8, md: 16, lg: 24, xl: 40 })
    expect(motionTokens.scale).toEqual({ settle: 0.98 })
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

  it('staggers rising lines with a CSS token', () => {
    expect(cssVar('--stagger-line')).toBe('70ms')
  })

  it('keeps .rise-in inside both gates', () => {
    const rules = parseRules(css)
    const reveals = rules.filter((r) => r.selector === '.rise-in')
    expect(reveals.length).toBeGreaterThan(0)
    for (const r of reveals) {
      expect(r.body, r.selector).toMatch(/animation-timeline:\s*view\(\)/)
      expect(r.ancestors.join(' | '), `${r.selector} needs @supports`).toContain('animation-timeline: view()')
      expect(r.ancestors, `${r.selector} needs no-preference`).toContain('@media (prefers-reduced-motion: no-preference)')
    }
  })

  it('runs the line rise (.rise) only under no-preference', () => {
    const rises = parseRules(css).filter((r) => r.selector === '.rise')
    expect(rises.length).toBeGreaterThan(0)
    for (const r of rises) {
      expect(r.body).toMatch(/animation:\s*rise var\(--dur-slow\) var\(--ease-smooth\) both/)
      expect(r.body).toContain('var(--stagger-line)')
      expect(r.ancestors, `${r.selector} needs no-preference`).toContain('@media (prefers-reduced-motion: no-preference)')
    }
  })

  it('switches every rise and the dawn off under prefers-reduced-motion: reduce', () => {
    const off = parseRules(css).find(
      (r) =>
        r.ancestors.includes('@media (prefers-reduced-motion: reduce)') &&
        /animation\s*:\s*none/.test(r.body) &&
        ['.rise', '.rise-in', '.scene-dawn'].every((s) => r.selector.includes(s)),
    )
    expect(off).toBeDefined()
    expect(off!.body).toMatch(/transform:\s*none/)
    expect(off!.body).toMatch(/opacity:\s*1/)
  })

  it('keeps the arrival under two seconds: the last line has risen by then', () => {
    const ms = (name: string) => {
      const m = css.match(new RegExp(String.raw`${name}:\s*(\d+)ms;`))
      if (!m) throw new Error(`missing ${name}`)
      return Number(m[1])
    }
    // The headline's lines stagger on --stagger-line, each over the slow duration.
    const lines = heroContent.headlineLines.length
    expect((lines - 1) * ms('--stagger-line') + motionTokens.duration.slow * 1000).toBeLessThan(2000)
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
