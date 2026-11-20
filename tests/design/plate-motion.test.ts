import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseCssRules } from '@/tests/helpers/css-rules'

// Screenshots are stills (CLAUDE.md, Animation): nothing about a screenshot,
// a plate or the map follows scroll; a plate answers attention with the
// catalog hover (.lift-card). Carried over from the retired catalog-motion test.
const css = readFileSync('app/globals.css', 'utf8')
const rules = parseCssRules(css)

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return files(full)
    return /\.tsx?$/.test(full) ? [full] : []
  })
}
const sources = ['app', 'components', 'lib'].flatMap(files).map((f) => ({ f, src: readFileSync(f, 'utf8') }))

describe('screenshots are stills', () => {
  it('has no ScrollPreview component, import or class left', () => {
    expect(existsSync('components/ui/scroll-preview.tsx')).toBe(false)
    for (const { f, src } of sources) expect(src, f).not.toMatch(/ScrollPreview|scroll-preview|fullShotHeight|shotHeight/)
    expect(css).not.toMatch(/scroll-preview|preview-scroll|preview-progress|--shot-h|--scroll-dur/)
  })

  it('drives nothing about a screenshot, a plate or the map from scroll', () => {
    for (const r of rules) {
      if (!/animation-timeline|view-timeline/.test(r.body)) continue
      expect(r.selector, r.selector).not.toMatch(/project-plate|project-shot|lift-card|survey-plate|map-pan|img/)
    }
  })

  it('follows no page scroll anywhere: no scroll(root), no object-position animation', () => {
    for (const r of rules) expect(r.body, r.selector).not.toMatch(/scroll\(root/)
    expect(css).not.toMatch(/transition[^;]*object-position/)
    expect(css).not.toMatch(/@keyframes[^{]*\{[^@]*?object-position/)
  })
})

describe('plate hover', () => {
  const hover = rules.filter((r) => /\.lift-card[^,]*:hover/.test(r.selector))

  it('lifts 2px, scales the shot 1.02 and turns the border ink', () => {
    const body = hover.map((r) => r.body).join(';')
    expect(body).toMatch(/transform:\s*translateY\(-2px\)/)
    expect(body).toMatch(/transform:\s*scale\(1\.02\)/)
    expect(body).toMatch(/border-color:\s*oklch\(var\(--ink\)\)/)
    expect(body).toMatch(/opacity:\s*1/)
  })

  it('sits inside the fine-pointer hover query and the no-preference query', () => {
    expect(hover.length).toBeGreaterThan(0)
    for (const r of hover) {
      const at = r.ancestors.join(' ')
      expect(at, r.selector).toContain('(hover: hover)')
      expect(at, r.selector).toContain('(pointer: fine)')
      expect(at, r.selector).toContain('(prefers-reduced-motion: no-preference)')
    }
  })

  it('transitions transform, border colour and opacity on tokens, never box-shadow', () => {
    const transitions = rules.filter((r) => /lift-card/.test(r.selector) && /transition/.test(r.body))
    expect(transitions.length).toBeGreaterThan(0)
    for (const r of transitions) {
      expect(r.body, r.selector).not.toMatch(/box-shadow/)
      expect(r.body, r.selector).toMatch(/var\(--dur-fast\)/)
      expect(r.body, r.selector).toMatch(/var\(--ease-smooth\)/)
      expect(r.body, r.selector).not.toMatch(/\d+(\.\d+)?m?s\b/)
    }
  })

  it('draws the shadow on a pseudo-element faded by opacity', () => {
    const shadow = rules.find((r) => /\.lift-card::after/.test(r.selector) && /box-shadow/.test(r.body))
    expect(shadow).toBeDefined()
    expect(shadow!.body).toMatch(/opacity:\s*0/)
    expect(shadow!.body).toMatch(/pointer-events:\s*none/)
  })

  it('gives keyboard focus the ink border without any travel', () => {
    const focus = rules.filter((r) => /\.lift-card:focus-visible/.test(r.selector))
    expect(focus.length).toBeGreaterThan(0)
    expect(focus.map((r) => r.body).join(';')).toMatch(/border-color:\s*oklch\(var\(--ink\)\)/)
    for (const r of focus) {
      expect(r.body).not.toMatch(/transform/)
      expect(r.ancestors.join(' ')).not.toContain('hover')
    }
  })

  it('is the same hover on plates, product screenshots and journal covers', () => {
    expect(readFileSync('components/ui/project-plate.tsx', 'utf8')).toContain('lift-card')
    expect(readFileSync('components/ui/project-shot.tsx', 'utf8')).toContain('lift-card')
    const covers = readFileSync('components/sections/trail-journals.tsx', 'utf8')
    expect(covers).toContain('lift-card')
    expect(covers).not.toMatch(/className="press /)
  })
})
