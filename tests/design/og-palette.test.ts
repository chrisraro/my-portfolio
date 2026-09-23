import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { ogPalette, type OgToken } from '@/lib/og-palette'

// The social card cannot read CSS variables, so it carries hex copies of the
// dark theme. Convert each `.dark` oklch triplet in globals.css to sRGB hex and
// hold the copies to it, so a palette change cannot leave the card behind.
function darkTriplet(token: OgToken): [number, number, number] {
  const css = readFileSync('app/globals.css', 'utf8')
  const start = css.indexOf('.dark {')
  const dark = css.slice(start, css.indexOf('}', start))
  const line = dark.split('\n').find((l) => l.trim().startsWith(`--${token}:`))
  const match = line?.match(/:\s*([\d.]+)\s+([\d.]+)\s+([\d.]+);/)
  if (!match) throw new Error(`--${token} not found in .dark`)
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

function oklchToHex([L, C, H]: [number, number, number]): string {
  const a = C * Math.cos((H * Math.PI) / 180)
  const b = C * Math.sin((H * Math.PI) / 180)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
  const hex = linear
    .map((x) => Math.min(1, Math.max(0, x)))
    .map((x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055))
    .map((x) => Math.round(x * 255).toString(16).padStart(2, '0'))
    .join('')
  return `#${hex.toUpperCase()}`
}

describe('social card palette', () => {
  it.each(Object.keys(ogPalette) as OgToken[])('%s matches the dark theme token', (token) => {
    expect(ogPalette[token]).toBe(oklchToHex(darkTriplet(token)))
  })
})
