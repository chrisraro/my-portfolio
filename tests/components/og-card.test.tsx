import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GET, runtime } from '@/app/og/[[...path]]/route'
import { CONTOURS, HERE, PAD_X, TEXT_WIDTH, TRAIL } from '@/lib/og-linework'
import { OG_SIZE, ogImage } from '@/lib/site-metadata'
import { siteRoutes } from '@/lib/site-routes'

const SOURCE = 'app/og/[[...path]]/route.tsx'
const call = (path: string[] | undefined) => GET(new Request('https://example.test/og'), { params: { path } })

describe('link-preview cards', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('run on the edge runtime, where next/og builds on Windows', () => {
    expect(runtime).toBe('edge')
  })

  it('answer 404 for a path that is not a page, before loading the font', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    expect((await call(['nope'])).status).toBe(404)
    expect((await call(['projects', 'nope'])).status).toBe(404)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('name one card per route at the route’s own path under /og, described by its title', () => {
    for (const r of siteRoutes()) {
      expect(ogImage(r.path)).toEqual({ url: r.path === '/' ? '/og' : `/og${r.path}`, width: 1200, height: 630, alt: r.title })
    }
    expect(OG_SIZE).toEqual({ width: 1200, height: 630 })
  })

  it('read one static font from app/fonts and write no colour of their own', () => {
    const source = readFileSync(SOURCE, 'utf8')
    expect(source).toContain("new URL('../../fonts/recursive-sans-600.ttf', import.meta.url)")
    expect(existsSync('app/fonts/recursive-sans-600.ttf')).toBe(true)
    expect(source).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)
    expect(existsSync('app/opengraph-image.tsx')).toBe(false)
  })

  // Outside Next, next/og runs its Node build, which throws "Invalid URL" on
  // Windows; CI renders on Linux. Node's fetch cannot read file: URLs, so the
  // font is served from disk.
  it.skipIf(process.platform === 'win32')('render a 1200×630 PNG for the homepage, a service and a project', async () => {
    vi.stubGlobal('fetch', async (url: URL) => new Response(readFileSync(fileURLToPath(url))))
    for (const path of [undefined, ['services', 'ai-automation'], ['projects', 'giya']]) {
      const response = await call(path)
      expect(response.status).toBe(200)
      const png = Buffer.from(await response.arrayBuffer())
      expect(png.subarray(0, 8)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
      expect(png.readUInt32BE(16)).toBe(1200)
      expect(png.readUInt32BE(20)).toBe(630)
    }
  }, 60000)
})

describe('the card’s layout', () => {
  // S5 controller look: the trail and contours ran behind the site URL at the
  // bottom right, and the headline's word gap read wide.
  const xs = (d: string) => (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number).filter((_, i) => i % 2 === 0)

  it('keeps every line of the linework right of the words’ column', () => {
    const right = PAD_X + TEXT_WIDTH
    for (const d of [...CONTOURS, TRAIL]) expect(Math.min(...xs(d)), d).toBeGreaterThan(right)
    expect(HERE.cx - HERE.r).toBeGreaterThan(right)
  })

  it('sets the name and the URL inside that column, and the title word by word', () => {
    const source = readFileSync(SOURCE, 'utf8')
    expect(source.match(/maxWidth: TEXT_WIDTH/g)).toHaveLength(3)
    expect(source).toContain('{card.title}')
    expect(source).not.toMatch(/card\.title\.split/)
    expect(source).not.toContain('TITLE_WORD_GAP')
    expect(source).not.toContain('columnGap')
  })
})
