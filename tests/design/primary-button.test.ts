import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// One primary button across every page: .button-primary in globals.css, a
// ember fill with on-trail text, a pill, beside a clear-glass .button-secondary.
// Nothing composes its own primary.
function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return tsxFiles(full)
    return full.endsWith('.tsx') ? [full] : []
  })
}
const css = readFileSync('app/globals.css', 'utf8')
const sources = ['app', 'components'].flatMap(tsxFiles).map((f) => ({ f, src: readFileSync(f, 'utf8') }))

describe('primary button', () => {
  it('is defined once: trail fill with on-trail text, plus a clear-glass secondary', () => {
    expect(css.match(/\.button-primary \{/g)).toHaveLength(1)
    expect(css).toMatch(/\.button-primary \{[^}]*rounded-full[^}]*bg-trail[^}]*text-on-trail/)
    expect(css.match(/\.button-secondary \{/g)).toHaveLength(1)
    expect(css).toMatch(/\.button-secondary \{[^}]*rounded-full[^}]*text-ink[^}]*background: oklch\(var\(--panel\)/)
    // Both are 44px or more, the pointer target size.
    expect(css).toMatch(/\.button-primary \{[^}]*min-h-\[46px\]/)
    expect(css).toMatch(/\.button-secondary \{[^}]*min-h-\[46px\]/)
  })

  it('is used by every primary call to action', () => {
    const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const uses = (file: string, label: string) => {
      const src = readFileSync(file, 'utf8')
      // The label as JSX (after a tag's ">"), not a mention in a comment.
      const i = src.search(new RegExp(String.raw`>\s*` + esc(label)))
      expect(i, `${file}: ${label}`).toBeGreaterThan(-1)
      // From the opening tag of the control that holds the label.
      const tag = Math.max(...['<Link', '<a\n', '<a\r', '<a ', '<button'].map((t) => src.lastIndexOf(t, i)))
      return src.slice(Math.max(0, tag), i)
    }
    expect(uses('components/sections/intro.tsx', '{ctaLabels.startProject}')).toContain('button-primary')
    expect(uses('components/sections/intro.tsx', '{ctaLabels.hireForRole}')).toContain('button-secondary')
    expect(uses('components/case-study/project-header.tsx', '{ctaLabels.startProject}')).toContain('button-primary')
    expect(uses('app/projects/page.tsx', '{ctaLabels.startProject}')).toContain('button-primary')
    expect(uses('app/projects/[slug]/page.tsx', '{ctaLabels.startProject}')).toContain('button-primary')
    expect(uses('app/not-found.tsx', '{ctaLabels.backHome}')).toContain('button-primary')
    expect(uses('app/services/page.tsx', '{ctaLabels.startProject}')).toContain('button-primary')
    expect(uses('app/services/[slug]/page.tsx', '{ctaLabels.startProject}')).toContain('button-primary')
    expect(uses('app/about/page.tsx', '{ctaLabels.startProject}')).toContain('button-primary')
    expect(uses('app/hire/page.tsx', '{ctaLabels.downloadResume}')).toContain('button-primary')
    expect(uses('components/sections/plan-the-route.tsx', 'Send message')).toContain('button-primary')
  })

  it('is never composed by hand from a fill and padding', () => {
    for (const { f, src } of sources) {
      // Each quoted class string on its own, whichever order its classes come in.
      for (const str of src.match(/"[^"]*"|`[^`]*`/g) ?? []) {
        // Unprefixed utilities only: a focus: or hover: fill is not a resting button.
        const composed = /(?<![:\w-])bg-trail(?![\w-])/.test(str) && /(?<![:\w-])px-\d/.test(str)
        expect(composed, `${f}: ${str}`).toBe(false)
      }
    }
  })
})
