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

// Motion numbers live in lib/motion-tokens.ts. A literal 0 (instant) is allowed.
const inline = /(?<![-\w])(duration|ease|delay)\s*:\s*(\[|0?\.\d|[1-9]\d*)/

// Offsets and scales in a motion prop (initial / animate / exit / while*) come
// from motionTokens.distance and motionTokens.scale too. Only the at-rest
// values are literal: 0 for x / y, 1 for scale.
const motionProp = /\b(?:initial|animate|exit|while\w+)=\{\{([^}]*)\}\}/g
const offset = /(?<![-\w])(x|y|scale)\s*:\s*([^,]+)/g
const literal = /(?<![\w.])(\d*\.\d+|\d+)(?![\w.])/g

function motionOffsetLiterals(source: string): string[] {
  const found: string[] = []
  for (const [, body] of Array.from(source.matchAll(motionProp))) {
    for (const [, key, value] of Array.from(body.matchAll(offset))) {
      const rest = key === 'scale' ? '1' : '0'
      for (const [n] of Array.from(value.matchAll(literal))) {
        if (n !== rest) found.push(`${key}: ${value.trim()}`)
      }
    }
  }
  return found
}

describe('no inline motion numbers', () => {
  it('passes tokens, not numeric literals, as duration/ease/delay', () => {
    const offenders = ['app', 'components'].flatMap(tsxFiles).filter((f) => inline.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })

  it('catches a literal offset or scale in a motion prop, and allows the at-rest values', () => {
    expect(motionOffsetLiterals('initial={{ opacity: 0, y: reduce ? 0 : 8 }}')).toHaveLength(1)
    expect(motionOffsetLiterals('initial={{ x: -12 }}')).toHaveLength(1)
    expect(motionOffsetLiterals('exit={{ scale: reduce ? 1 : 0.98 }}')).toHaveLength(1)
    expect(motionOffsetLiterals('animate={{ opacity: 1, y: 0, scale: 1 }}')).toEqual([])
    expect(motionOffsetLiterals('initial={{ y: reduce ? 0 : motionTokens.distance.sm }}')).toEqual([])
  })

  it('passes tokens, not numeric literals, as x / y / scale in motion props', () => {
    const offenders = ['app', 'components']
      .flatMap(tsxFiles)
      .flatMap((f) => motionOffsetLiterals(readFileSync(f, 'utf8')).map((hit) => `${f}: ${hit}`))
    expect(offenders).toEqual([])
  })
})
