import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Bubble.io and Muramart Holdings were removed from the portfolio as a content
// decision (spec 2026-09-10 §6), not a cleanup. These three files are the ones
// that carried them; this test keeps them from creeping back.
const SOURCES = [
  'lib/data.ts',
  'app/api/chat/route.ts',
  'scripts/build-resume.mjs',
]

describe('abandoned tooling', () => {
  it.each(SOURCES)('%s mentions neither Bubble.io nor Muramart', (file) => {
    const contents = readFileSync(file, 'utf8')
    expect(contents).not.toMatch(/bubble/i)
    expect(contents).not.toMatch(/muramart/i)
  })
})
