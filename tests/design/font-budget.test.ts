import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// S1 final review, Important 6: Archivo (latin, wdth axis) is the one font the
// first viewport waits for. next/font preloads it and names it *.p.woff2. The
// guard needs a build, and CI runs the tests before the build, so it skips
// where there is no build output; each sprint's final gate runs it after
// `npm run build`.
const MEDIA = join('.next', 'static', 'media')
const built = existsSync(MEDIA)
const BUDGET = 95 * 1024

describe.skipIf(!built)('font budget (after npm run build)', () => {
  const preloaded = built ? readdirSync(MEDIA).filter((f) => f.endsWith('.p.woff2')) : []

  it('preloads exactly one font file', () => {
    expect(preloaded).toHaveLength(1)
  })

  it('keeps it at or under 95 KB', () => {
    for (const f of preloaded) expect(statSync(join(MEDIA, f)).size, f).toBeLessThanOrEqual(BUDGET)
  })
})
