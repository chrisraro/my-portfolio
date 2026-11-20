import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { SECTION } from '@/components/ui/grid'

// CLAUDE.md, Styling: one grid. Every section and read-page block centres on
// the same class string, stated once (S2 final review, carry-over 8).
function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return tsxFiles(full)
    return full.endsWith('.tsx') ? [full] : []
  })
}

describe('the one grid', () => {
  it('is one constant: centred, 6xl wide, 20px gutters, 32px from 640px', () => {
    expect(SECTION).toBe('mx-auto max-w-6xl px-5 sm:px-8')
  })

  it('lives where Tailwind looks for classes', () => {
    expect(readFileSync('tailwind.config.js', 'utf8')).toContain("'./components/**/*.{js,ts,jsx,tsx,mdx}'")
  })

  it('is never spelled out by hand in a page or component', () => {
    const offenders = ['app', 'components'].flatMap(tsxFiles).flatMap((f) =>
      Array.from(readFileSync(f, 'utf8').matchAll(/(['"`])([^'"`\n]*)\1/g))
        .map((m) => m[2])
        .filter((s) => /\bmax-w-6xl\b/.test(s) && /(^|\s)px-5(\s|$)/.test(s))
        .map((s) => `${f}: ${s}`),
    )
    expect(offenders).toEqual([])
  })

  it('is used by every homepage section, the footer and the read pages', () => {
    const users = [
      ...['trailhead', 'elevation-strip', 'field-map', 'fork', 'own-products', 'plan-the-route', 'trail-journals'].map(
        (s) => `components/sections/${s}.tsx`,
      ),
      'components/footer.tsx',
      'app/not-found.tsx',
      'app/projects/page.tsx',
      'app/projects/[slug]/page.tsx',
      'app/services/page.tsx',
      'app/services/[slug]/page.tsx',
      'app/about/page.tsx',
      'app/hire/page.tsx',
      'components/ui/page-intro.tsx',
    ]
    for (const f of users) expect(readFileSync(f, 'utf8'), f).toContain("from '@/components/ui/grid'")
  })
})
