import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// One primary button across every page: .button-primary in globals.css. On
// paper it is a magenta fill; on a magenta plane (.on-plane) it inverts to a
// lagoon fill with magenta text. Nothing composes its own primary.
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
  it('is defined once, with the plane inversion', () => {
    expect(css).toMatch(/\.button-primary \{[^}]*bg-accent[^}]*text-on-accent/)
    expect(css).toMatch(/\.on-plane \.button-primary \{[^}]*bg-canvas[^}]*text-accent/)
  })

  it('is used by every primary call to action', () => {
    const uses = (file: string, label: string) => {
      const src = readFileSync(file, 'utf8')
      // The label as JSX text (after a tag's ">"), not a mention in a comment.
      const i = src.search(new RegExp(String.raw`>\s*${label}`))
      expect(i, `${file}: ${label}`).toBeGreaterThan(-1)
      // From the opening tag of the control that holds the label.
      const tag = Math.max(...['<Link', '<a\n', '<a\r', '<a ', '<button'].map((t) => src.lastIndexOf(t, i)))
      return src.slice(Math.max(0, tag), i)
    }
    expect(uses('components/sections/hero.tsx', 'Start a project')).toContain('button-primary')
    expect(uses('components/case-study/project-header.tsx', 'Start a project')).toContain('button-primary')
    expect(uses('app/projects/page.tsx', 'Start a project')).toContain('button-primary')
    expect(uses('app/projects/[slug]/page.tsx', 'Start a project')).toContain('button-primary')
    expect(uses('app/not-found.tsx', 'All projects')).toContain('button-primary')
    expect(uses('components/sections/contact-console.tsx', 'Send message')).toContain('button-primary')
  })

  it('is never composed by hand from a fill and padding', () => {
    for (const { f, src } of sources) {
      expect(src, f).not.toMatch(/rounded bg-accent px-\d/)
      expect(src, f).not.toMatch(/rounded bg-canvas px-\d/)
    }
  })
})
