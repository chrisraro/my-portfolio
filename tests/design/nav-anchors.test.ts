import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { navigationItems } from '@/lib/data'

// A nav link whose target id no longer exists fails silently in a browser.
describe('navigation anchors', () => {
  const sections = readdirSync('components/sections')
    .map((f) => readFileSync(join('components/sections', f), 'utf8'))
    .join('\n')

  it.each(navigationItems.map((n) => [n.label, n.href]))('%s (%s) has a matching section id', (_label, href) => {
    expect(sections).toContain(`id="${href.slice(1)}"`)
  })

  it('the skip link has a target', () => {
    expect(readFileSync('app/layout.tsx', 'utf8')).toContain('id="main"')
  })
})
