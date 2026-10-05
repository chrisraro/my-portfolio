import { readFileSync, readdirSync, statSync } from 'node:fs'
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
    expect(withPriority.sort()).toEqual(['components/case-study/project-screenshots.tsx', 'components/sections/hero.tsx'])
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
  it('falls back to plain Arial, not a metric-adjusted local() face per weight and size', () => {
    const layout = readFileSync('app/layout.tsx', 'utf8')
    expect(layout.match(/adjustFontFallback: false/g)).toHaveLength(2)
  })

  it('does not run next-themes’ transition suppression on every load', () => {
    expect(readFileSync('app/layout.tsx', 'utf8')).not.toContain('disableTransitionOnChange')
    expect(css).toMatch(/\.theme-switching \*[^{]*\{[^}]*transition:\s*none !important/)
  })

  it('skips rendering of off-screen preview frames and far sections', () => {
    // On the frame, not the link: containment would clip the hover shadow.
    expect(css).toMatch(/\.project-shot__frame \{[^}]*content-visibility:\s*auto/)
    expect(css).toMatch(/\.defer-render \{[^}]*content-visibility:\s*auto;[^}]*contain-intrinsic-size:\s*auto/)
    // A hovered rack card's shadow paints past its tier: the tier defers only where it can let paint out.
    expect(css).toMatch(/@supports \(overflow-clip-margin: 1px\) \{\s*\.defer-render-lift \{[^}]*overflow-clip-margin/)
  })

  it('never defers the hero, the work or the contact card (first viewport, or next to the footer)', () => {
    for (const f of ['hero', 'products', 'rack', 'contact-console']) {
      const src = readFileSync(`components/sections/${f}.tsx`, 'utf8')
      expect(src, f).not.toMatch(/<section[^>]*defer-render/)
    }
  })
})

describe('display font', () => {
  // R6: Anybody, instanced to the axis ranges in use, is a third smaller than
  // Google's full variable file, and it sits on every page's critical path.
  it('is the self-hosted instance, preloaded, no larger than 40 KB', () => {
    const layout = readFileSync('app/layout.tsx', 'utf8')
    expect(layout).toMatch(/localFont\(\{\s*src: '\.\/fonts\/anybody-latin-wght400-800-wdth75-100\.woff2'/)
    expect(layout).not.toMatch(/import \{[^}]*Anybody[^}]*\} from 'next\/font\/google'/)
    expect(statSync('app/fonts/anybody-latin-wght400-800-wdth75-100.woff2').size).toBeLessThanOrEqual(40 * 1024)
  })
})

describe('font swap', () => {
  // R6: with the lede no longer faded in, the hero's font swap showed as CLS
  // 0.23 on mobile: in Arial, "Full-stack" broke at its hyphen into a third
  // line that collapsed when Anybody arrived.
  it('never breaks a hero word, so the H1 keeps its line count across the swap', () => {
    expect(css).toMatch(/\.hero-word \{[^}]*white-space:\s*nowrap/)
  })
})

describe('reveals', () => {
  it('move by transform only, so text is never painted or measured faded', () => {
    for (const name of ['reveal-rise', 'reveal-cover']) {
      const body = css.match(new RegExp(String.raw`@keyframes ${name} \{([\s\S]*?)\n\t\t\}`))?.[1]
      expect(body, name).toBeDefined()
      expect(body, name).not.toContain('opacity')
    }
  })
})
