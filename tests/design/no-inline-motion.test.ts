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

describe('no inline motion numbers', () => {
  it('passes tokens, not numeric literals, as duration/ease/delay', () => {
    const offenders = ['app', 'components'].flatMap(tsxFiles).filter((f) => inline.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })
})
