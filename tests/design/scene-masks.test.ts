import { existsSync, readFileSync, statSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { describe, expect, it } from 'vitest'
import { Scene } from '@/components/scene'

// The land fixed behind every page is four one-bit PNG masks that theme
// tokens colour (scripts/build-scene.mjs writes them, components/scene.tsx
// stacks them, app/globals.css paints them). Colour is never baked in, so the
// whole scene costs a few KB for both themes.
const LAYERS = ['dawn', 'far', 'near', 'lit'] as const
const css = readFileSync('app/globals.css', 'utf8')
const maskPath = (name: string) => `public/assets/scene/${name}.png`
const BUDGET = 20 * 1024

function pngHeader(path: string) {
  const bytes = readFileSync(path)
  return {
    signature: bytes.subarray(0, 8).toString('hex'),
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    bitDepth: bytes[24],
  }
}

describe('the scene masks', () => {
  it.each(LAYERS)('%s.png exists, is a PNG, 2560 by 448 and one bit deep', (name) => {
    expect(existsSync(maskPath(name))).toBe(true)
    const h = pngHeader(maskPath(name))
    expect(h.signature).toBe('89504e470d0a1a0a')
    expect([h.width, h.height]).toEqual([2560, 448])
    expect(h.bitDepth).toBe(1)
  })

  it('weigh under 20 KB in all', () => {
    const total = LAYERS.reduce((sum, name) => sum + statSync(maskPath(name)).size, 0)
    expect(total).toBeGreaterThan(0)
    expect(total).toBeLessThan(BUDGET)
  })

  it('are written by scripts/build-scene.mjs, into public/assets/scene', () => {
    const folder = readFileSync('scripts/build-scene.mjs', 'utf8')
    expect(folder).toContain("const OUT = 'public/assets/scene'")
    for (const name of LAYERS) expect(folder, name).toContain(name)
  })
})

describe('the scene', () => {
  it('paints each mask once, in a token colour, at the mask’s own size', () => {
    for (const name of LAYERS) {
      const rule = css.match(new RegExp(String.raw`\.scene-${name} \{([^}]*)\}`))?.[1] ?? ''
      expect(rule, name).toContain(`url('/assets/scene/${name}.png')`)
      expect(rule, name).toMatch(/background:\s*oklch\(var\(--(?:dawn|land-far|land-near|land-lit)\)\)/)
    }
    expect(css).toMatch(/\.scene-layer \{[^}]*height:\s*448px[^}]*mask:[^;]*2560px 448px repeat-x/)
  })

  it('stacks the four layers, a scrim and the fireflies, hidden from assistive technology', () => {
    const html = renderToStaticMarkup(createElement(Scene))
    expect(html).toMatch(/^<div aria-hidden="true" class="scene">/)
    const order = LAYERS.map((n) => html.indexOf(`scene-layer scene-${n}`))
    expect(order.every((i) => i > -1)).toBe(true)
    expect(order).toEqual([...order].sort((a, b) => a - b))
    expect(html.indexOf('scene-scrim')).toBeGreaterThan(order[3])
    expect(html).toContain('class="firefly')
  })

  it('sits behind the page and never takes a click', () => {
    expect(css).toMatch(/\.scene \{[^}]*position:\s*fixed/)
    const scene = css.match(/^\.scene \{([^}]*)\}/gm)?.join('') ?? ''
    expect(scene).toMatch(/z-index:\s*-1/)
    expect(scene).toMatch(/pointer-events:\s*none/)
  })

  it('is mounted once, in the root layout', () => {
    const layout = readFileSync('app/layout.tsx', 'utf8')
    expect(layout.match(/<Scene \/>/g)).toHaveLength(1)
  })
})
