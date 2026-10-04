import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// The pre-4.0 palette used shadcn-style names. Some collide with the new
// system (`muted`, `accent`) and mean something different there, so a leftover
// legacy class would render in the wrong colour rather than fail loudly.
const LEGACY = new RegExp(
  '(?<![\\w-])(?:bg|text|border|ring|divide|outline|placeholder|from|via|to|fill|stroke)-' +
    '(?:background|foreground|primary|primary-foreground|secondary|secondary-foreground|' +
    'card|card-foreground|popover|popover-foreground|muted-foreground|accent-foreground|border|input)' +
    '(?![\\w-])',
)
// --font-display came back in Lobby Rack as the Anybody display face, so it is
// no longer legacy; --font-mono stays retired.
const LEGACY_VAR = /var\(--(?:background|foreground|primary|primary-rgb|secondary|card|popover|border|input|font-mono)\b/

// B3 Signal (retired by Lobby Rack) set labels in Recursive's MONO axis. The new
// world has no mono family: edge codes use .edge-code. Tailwind no longer
// defines a mono key, so a stray `font-mono` would silently fall back to the
// system monospace, a second typeface.
const B3_TYPE = /(?<![\w-])font-mono(?![\w-])|['"]MONO['"]|Recursive\(/

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return /\.(tsx?|css)$/.test(full) ? [full] : []
  })
}

describe('legacy colour tokens', () => {
  const files = ['app', 'components'].flatMap(sourceFiles)

  it('no component uses a legacy colour utility', () => {
    const offenders = files.filter((f) => LEGACY.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })

  it('no file uses the retired B3 mono voice', () => {
    const offenders = files.filter((f) => B3_TYPE.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })

  it('no file reads a legacy CSS variable', () => {
    const offenders = files.filter((f) => LEGACY_VAR.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })
})
