import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Performance invariants from the SP2 fix A trace work
// (.superpowers/sdd/sp2-fixA-report.md). Each guards a measured root cause.

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return tsxFiles(full)
    return full.endsWith('.tsx') ? [full] : []
  })
}

const sources = ['app', 'components'].flatMap(tsxFiles).map((f) => ({ f, src: readFileSync(f, 'utf8') }))
const css = readFileSync('app/globals.css', 'utf8')

describe('image priority', () => {
  it('is set only on the first-viewport images: the hero portrait and a project page’s fallback screenshot', () => {
    const withPriority = sources
      .filter(({ src }) => /^\s*priority\b/m.test(src) || /fetchPriority=/.test(src))
      .map(({ f }) => f.replace(/\\/g, '/'))
    expect(withPriority.sort()).toEqual(['components/case-study/project-screenshots.tsx', 'components/sections/intro.tsx'])
  })

  it('never prioritises a full-page project shot', () => {
    const preview = readFileSync('components/ui/project-shot.tsx', 'utf8')
    expect(preview).not.toMatch(/\bpriority\b/)
    expect(preview).toContain('quality={50}')
  })
})

describe('motion stays off the first load', () => {
  const motionFiles = sources.filter(({ src }) => src.includes("from 'motion/react'"))

  it('renders m.* inside a strict LazyMotion, never the full motion.* components', () => {
    expect(motionFiles.length).toBeGreaterThan(0)
    for (const { f, src } of motionFiles) {
      expect(src, f).not.toMatch(/<motion\./)
      expect(src, f).not.toMatch(/import \{[^}]*\bmotion\b[^}]*\} from 'motion\/react'/)
      expect(src, f).toContain("import * as m from 'motion/react-m'")
      expect(src, f).toContain('<LazyMotion features={loadMotionFeatures} strict>')
    }
  })

  it('loads the animation features through a dynamic import', () => {
    expect(readFileSync('lib/motion-features.ts', 'utf8')).toMatch(/import\('@\/lib\/motion-dom-animation'\)/)
  })

  it('does not use useAnimate, which pulls the whole engine into the page chunk', () => {
    for (const { f, src } of sources) expect(src, f).not.toContain('useAnimate')
  })
})

describe('first layout', () => {
  // The body re-wrapped when the web font swapped in (CLS 0.094 on /). Next
  // sizes Arial to the family's metrics, so the swap moves nothing.
  it('falls back to Arial size-adjusted to Instrument Sans, so the font swap re-wraps nothing', () => {
    const layout = readFileSync('app/layout.tsx', 'utf8')
    expect(layout.match(/adjustFontFallback: true/g)).toHaveLength(1)
    expect(layout).not.toContain('adjustFontFallback: false')
  })

  it('loads the intro portrait, the first viewport’s largest paint, at quality 70', () => {
    const intro = readFileSync('components/sections/intro.tsx', 'utf8')
    expect(intro).toMatch(/priority\s+sizes="[^"]*"\s+quality=\{70\}/)
    expect(intro).not.toContain('quality={85}')
  })

  it('does not run next-themes’ transition suppression on every load', () => {
    expect(readFileSync('app/layout.tsx', 'utf8')).not.toContain('disableTransitionOnChange')
    expect(css).toMatch(/\.theme-switching \*[^{]*\{[^}]*transition:\s*none !important/)
  })

  it('skips rendering of off-screen preview frames and far sections', () => {
    // On the frame, not the link: containment would clip the hover shadow.
    expect(css).toMatch(/\.project-shot__frame \{[^}]*content-visibility:\s*auto/)
    expect(css).toMatch(/\.defer-render \{[^}]*content-visibility:\s*auto;[^}]*contain-intrinsic-size:\s*auto/)
  })

  it('never defers the first viewport, the work lists, the places or the contact form', () => {
    for (const f of ['intro', 'now-building', 'experience', 'work-list', 'work-with-me', 'plan-the-route']) {
      const src = readFileSync(`components/sections/${f}.tsx`, 'utf8')
      expect(src, f).not.toMatch(/<section[^>]*defer-render/)
    }
  })
})

describe('type family', () => {
  // One variable family, no width axis, no second face: Instrument Sans.
  it('loads Instrument Sans and nothing else', () => {
    const layout = readFileSync('app/layout.tsx', 'utf8')
    expect(layout).toMatch(/import \{ Instrument_Sans \} from 'next\/font\/google'/)
    expect(layout.match(/from 'next\/font\//g)).toHaveLength(1)
    expect(layout).not.toMatch(/Archivo|Figtree|localFont|anybody|axes:/i)
    expect(layout).toContain("variable: '--font-sans'")
    expect(existsSync('app/fonts/anybody-latin-wght400-800-wdth75-100.woff2')).toBe(false)
  })

  it('sets no display stack: no --font-display, no narrow fallback face', () => {
    const layout = readFileSync('app/layout.tsx', 'utf8')
    expect(layout).not.toContain('--font-display')
    expect(layout).not.toMatch(/Display Fallback/)
    expect(css).not.toMatch(/--font-display|Display Fallback|font-stretch|'wdth'/)
  })
})

describe('reveals', () => {
  it('move by transform only, so text is never painted or measured faded', () => {
    for (const name of ['rise', 'rise-in']) {
      const body = css.match(new RegExp(String.raw`@keyframes ${name} \{([\s\S]*?)
	+\}`))?.[1]
      expect(body, name).toBeDefined()
      expect(body, name).not.toContain('opacity')
      expect(body, name).toContain('transform')
    }
  })
})
