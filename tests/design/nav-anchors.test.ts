import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { navigationItems } from '@/lib/data'

// A nav link whose target no longer exists fails silently in a browser.
describe('navigation anchors', () => {
  const sections = readdirSync('components/sections')
    .map((f) => readFileSync(join('components/sections', f), 'utf8'))
    .join('\n')

  const anchors = navigationItems.filter((n) => n.href.startsWith('#'))
  const routes = navigationItems.filter((n) => !n.href.startsWith('#'))

  it('every item is either a homepage anchor or a page route', () => {
    for (const item of routes) expect(item.href).toMatch(/^\/[a-z-]+$/)
  })

  it.each(anchors.map((n) => [n.label, n.href]))('%s (%s) has a matching section id', (_label, href) => {
    expect(sections).toContain(`id="${href.slice(1)}"`)
  })

  it.each(routes.map((n) => [n.label, n.href]))('%s (%s) has a matching page', (_label, href) => {
    expect(existsSync(join('app', href.slice(1), 'page.tsx'))).toBe(true)
  })

  it('the skip link has a target', () => {
    expect(readFileSync('app/layout.tsx', 'utf8')).toContain('id="main"')
  })
})
