import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return tsxFiles(full)
    return full.endsWith('.tsx') ? [full] : []
  })
}

// The display styles (.text-title, .text-numeral, the fluid headings) carry the
// contract's type scale. An arbitrary size on top of one of them is an
// off-scale size (the confirm critique found four).
const scaled = /className="[^"]*\btext-(?:title|numeral|fluid-h1|fluid-h2|page-h1)\b[^"]*"/g
const arbitrary = /\btext-\[\d*\.?\d+(?:rem|px)\]/

describe('type scale', () => {
  it('never overrides a display style with an arbitrary font size', () => {
    const offenders = ['app', 'components'].flatMap(tsxFiles).flatMap((f) =>
      Array.from(readFileSync(f, 'utf8').matchAll(scaled))
        .map(([cls]) => cls)
        .filter((cls) => arbitrary.test(cls))
        .map((cls) => `${f}: ${cls}`),
    )
    expect(offenders).toEqual([])
  })
})
