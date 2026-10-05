import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// A lifted rack card must not cover its tier's heading or the printed top of
// the row above (critique P1-3, a11y P2): the lift is smaller, and every row of
// the shelf leaves room for it.
const css = readFileSync('app/globals.css', 'utf8')

describe('rack lift', () => {
  it('lifts a card at most 30% of its height', () => {
    const lifts = (css.match(/\.rack-card[^{]*\{[^}]*translateY\(-\d+%\)/g) ?? []).map((m) => Number(m.match(/translateY\(-(\d+)%\)/)![1]))
    expect(lifts.length).toBeGreaterThan(0)
    for (const l of lifts) expect(l).toBeLessThanOrEqual(30)
  })

  it('reserves the lift above the first row and between rows', () => {
    expect(css).toMatch(/\.rack-shelf \{[^}]*container-type:\s*inline-size/)
    expect(css).toMatch(/--lift:\s*calc\(/)
    expect(css).toMatch(/\.rack-row \{[^}]*padding-top:[^;]*var\(--lift\)/)
    expect(css).toMatch(/\.rack-row \{[^}]*row-gap:[^;]*var\(--lift\)/)
  })

  it('is used by every rack row', () => {
    expect(readFileSync('components/ui/rack-tier.tsx', 'utf8')).toMatch(/rack-shelf[\s\S]*rack-row/)
    expect(readFileSync('components/case-study/case-study-body.tsx', 'utf8')).toMatch(/rack-shelf[\s\S]*rack-row/)
  })
})
