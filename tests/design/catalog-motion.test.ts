import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseCssRules } from '@/tests/helpers/css-rules'

// Lobby Rack refinement D2: restrained catalog motion. Christian rejected the
// scroll-linked previews and the sunk-pocket rack; cards now sit whole with a
// still screenshot, lift 2px on a fine pointer's hover, and the rack's grid
// staggers in once.
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

describe('no scroll-linked previews', () => {
  it('has no ScrollPreview component, import or class left', () => {
    expect(existsSync('components/ui/scroll-preview.tsx')).toBe(false)
    for (const { f, src } of sources) {
      expect(src, f).not.toMatch(/ScrollPreview|scroll-preview|fullShotHeight|shotHeight/)
    }
    expect(css).not.toMatch(/scroll-preview|preview-scroll|preview-progress|--shot-h|--scroll-dur/)
  })

  it('drives nothing about a screenshot or a card from scroll', () => {
    for (const r of rules) {
      if (!/animation-timeline|view-timeline/.test(r.body)) continue
      expect(r.selector, r.selector).not.toMatch(/rack-|project-shot|lift-card|img/)
    }
    // No page-scroll timeline anywhere, and no object-position animation.
    expect(css).not.toMatch(/scroll\(root/)
    expect(css).not.toMatch(/transition[^;]*object-position/)
    expect(css).not.toMatch(/@keyframes[^{]*\{[^@]*?object-position/)
  })

  it('has no sunk pocket: no pocket clip, no lift out of it, no reserved lift space', () => {
    expect(css).not.toMatch(/rack-pocket|--lift\b|rack-row--open|rack-card__sunk/)
    expect(css).not.toMatch(/translateY\(-\d+%\)/)
    for (const { f, src } of sources) expect(src, f).not.toMatch(/rack-pocket|rack-row--open|\bsunk\b/)
  })
})

describe('card hover', () => {
  const hover = rules.filter((r) => /\.lift-card[^,]*:hover/.test(r.selector))

  it('lifts 2px, scales the shot 1.02 and turns the border accent', () => {
    const body = hover.map((r) => r.body).join(';')
    expect(body).toMatch(/transform:\s*translateY\(-2px\)/)
    expect(body).toMatch(/transform:\s*scale\(1\.02\)/)
    expect(body).toMatch(/border-color:\s*oklch\(var\(--accent\)\)/)
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
    // Nothing in the catalog animates a shadow any more.
    expect(css).not.toMatch(/\.rack-card \{[^}]*box-shadow/)
  })

  it('draws the shadow on a pseudo-element faded by opacity', () => {
    const shadow = rules.find((r) => /\.lift-card::after/.test(r.selector) && /box-shadow/.test(r.body))
    expect(shadow).toBeDefined()
    expect(shadow!.body).toMatch(/opacity:\s*0/)
    expect(shadow!.body).toMatch(/pointer-events:\s*none/)
  })

  it('gives keyboard focus the accent border without any travel', () => {
    const focus = rules.filter((r) => /\.lift-card:focus-visible/.test(r.selector))
    expect(focus.length).toBeGreaterThan(0)
    expect(focus.map((r) => r.body).join(';')).toMatch(/border-color:\s*oklch\(var\(--accent\)\)/)
    for (const r of focus) {
      expect(r.body).not.toMatch(/transform/)
      expect(r.ancestors.join(' ')).not.toContain('hover')
    }
  })

  it('is the same hover on rack cards, product screenshots and case-study covers', () => {
    expect(readFileSync('components/ui/rack-card.tsx', 'utf8')).toMatch(/'rack-card lift-card/)
    expect(readFileSync('components/ui/project-shot.tsx', 'utf8')).toContain('lift-card')
    const covers = readFileSync('components/sections/case-studies.tsx', 'utf8')
    expect(covers).toContain('lift-card')
    expect(covers).not.toMatch(/className="press /)
  })
})

describe('rack stagger', () => {
  const stagger = rules.filter((r) => /\.reveal-stagger/.test(r.selector) && /animation/.test(r.body) && !/animation:\s*none/.test(r.body))

  it('plays once, on a scroll trigger, with a 30-80ms stagger per column', () => {
    expect(stagger.length).toBeGreaterThan(0)
    const body = stagger.map((r) => r.body).join(';')
    expect(body).toMatch(/timeline-trigger:\s*--card view\(\)/)
    expect(body).toMatch(/animation-trigger:\s*--card play-forwards/)
    const ms = Number(css.match(/--stagger-card:\s*(\d+)ms/)?.[1])
    expect(ms).toBeGreaterThanOrEqual(30)
    expect(ms).toBeLessThanOrEqual(80)
    // A trigger plays a time-based animation; it is not scrubbed by scroll.
    expect(body).not.toMatch(/animation-timeline/)
  })

  it('is gated: trigger support, no-preference, and the grid (not the touch strip, a sideways scroller)', () => {
    for (const r of stagger) {
      const at = r.ancestors.join(' ')
      expect(at, r.selector).toContain('@supports (animation-timeline: view())')
      expect(at, r.selector).toContain('@supports (timeline-trigger: --card view())')
      expect(at, r.selector).toContain('(prefers-reduced-motion: no-preference)')
      expect(at, r.selector).toContain('(min-width: 640px)')
    }
  })

  it('moves by transform only, so the server HTML is the finished rack', () => {
    const frames = css.match(/@keyframes reveal-stagger \{[\s\S]*?\n\t+\}/)?.[0]
    expect(frames).toBeDefined()
    expect(frames).toMatch(/translateY\(16px\)/)
    expect(frames).not.toContain('opacity')
  })

  it('is switched off under reduced motion', () => {
    const off = rules.filter((r) => r.ancestors.includes('@media (prefers-reduced-motion: reduce)') && /animation:\s*none/.test(r.body))
    expect(off.map((r) => r.selector).join(' ')).toMatch(/\.reveal-stagger(?![\w-])/)
  })

  // Task 3 left the delay on i % 4, which is wrong at three columns.
  it('staggers by the visible column: three columns from 640px, four from 1024px', () => {
    const at = (query: string) => stagger.filter((r) => r.ancestors.join(' ').includes(query) && /animation-delay/.test(r.body))
    const three = at('(min-width: 640px)').filter((r) => !r.ancestors.join(' ').includes('(min-width: 1024px)'))
    const four = at('(min-width: 1024px)')
    expect(three.map((r) => r.body).join(';')).toMatch(/animation-delay:\s*calc\(var\(--c3, 0\) \* var\(--stagger-card\)\)/)
    expect(four.map((r) => r.body).join(';')).toMatch(/animation-delay:\s*calc\(var\(--c4, 0\) \* var\(--stagger-card\)\)/)
    expect(css).not.toMatch(/var\(--i, 0\) \* var\(--stagger-card\)/)
  })

  // Task 3 also let cards already on screen at load rise. The trigger fires
  // only while a card is entering the viewport, so a card in view at load (or
  // after a filter) sits at rest. Once triggered, a delayed column holds its
  // start (backwards fill) instead of showing at rest, then jumping down 16px
  // when its delay ends (a11y gate R5, P2-5). An untriggered animation is idle,
  // so the fill never applies to a card that was not triggered (checked in
  // Chrome: cards in view at load have no transform).
  it('never plays on a card already in view: entry-only trigger; a delayed column holds its start', () => {
    const body = stagger.map((r) => r.body).join(';')
    expect(body).toMatch(/timeline-trigger:\s*--card view\(\) entry 0% entry 100%/)
    const shorthand = body.match(/animation:\s*reveal-stagger[^;]*/)?.[0] ?? ''
    expect(shorthand).toContain('reveal-stagger')
    expect(shorthand).not.toMatch(/\bboth\b/)
    expect(body).toMatch(/animation-fill-mode:\s*backwards/)
  })

  it('is on every rack card, with both column indexes', () => {
    expect(readFileSync('components/ui/rack-card.tsx', 'utf8')).toMatch(
      /className="reveal-stagger" style=\{\{ '--c3': index % 3, '--c4': index % 4 \} as CSSProperties\}/,
    )
    expect(readFileSync('components/ui/rack-tier.tsx', 'utf8')).toMatch(/index=\{i\}/)
  })
})
