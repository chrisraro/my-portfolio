import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Green (`live`) means a live system and nothing else, and it reaches the page
// only through StatusBadge's live glyph. The chat widget once wore a pulsing
// green dot while answering in offline mode; this is the guard that would have
// caught it.
const LIVE_UTILITY = /(?<![\w-])(?:bg|text|border|ring|outline|fill|stroke|from|via|to|shadow|decoration|divide|caret)-live(?![\w-])/
const ALLOWED = [join('components', 'ui', 'status-badge.tsx')]

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return /\.tsx?$/.test(full) ? [full] : []
  })
}

describe('green means live', () => {
  const files = ['app', 'components'].flatMap(sourceFiles).filter((f) => !ALLOWED.includes(f))

  it('uses the live colour only in the status badge', () => {
    const offenders = files.filter((f) => LIVE_UTILITY.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })

  it('uses the live pulse only in the status badge', () => {
    const offenders = files.filter((f) => readFileSync(f, 'utf8').includes('live-pulse'))
    expect(offenders).toEqual([])
  })

  it('still finds the live glyph where it belongs', () => {
    const badge = readFileSync(ALLOWED[0], 'utf8')
    expect(badge).toMatch(LIVE_UTILITY)
    expect(badge).toContain('live-pulse')
  })
})
