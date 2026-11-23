import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GET, runtime } from '@/app/og/[[...path]]/route'
import { DAWN, PAD_X, RIDGE, TEXT_WIDTH } from '@/lib/og-linework'
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
    for (const path of [undefined, ['services', 'ai-automation'], ['projects', 'iskotify']]) {
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
  // The land is Isarog's ridge along the foot of the card, with first light as
  // a dither behind the summit. The dither stays right of the words' column;
  // the ridge may run under the name and the URL but never up into the title.
  const points = (d: string) => (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)
  const pairs = (d: string) => {
    const n = points(d)
    return Array.from({ length: Math.floor(n.length / 2) }, (_, i) => [n[2 * i], n[2 * i + 1]] as const)
  }

  it('keeps first light right of the words’ column', () => {
    const right = PAD_X + TEXT_WIDTH
    const squares = DAWN.split(' ').filter((t) => t.startsWith('M')).map((t) => Number(t.slice(1).match(/^-?\d+/)![0]))
    expect(squares.length).toBeGreaterThan(50)
    expect(Math.min(...squares)).toBeGreaterThan(right)
  })

  it('keeps the ridge in the foot of the card where the words are: low under the column', () => {
    const right = PAD_X + TEXT_WIDTH
    const under = pairs(RIDGE).filter(([x, y]) => x <= right && y < 630)
    expect(under.length).toBeGreaterThan(10)
    expect(Math.min(...under.map(([, y]) => y))).toBeGreaterThan(440)
  })

  it('draws no trail, contours or you-are-here ring any more', async () => {
    const mod = (await import('@/lib/og-linework')) as Record<string, unknown>
    for (const gone of ['CONTOURS', 'TRAIL', 'HERE']) expect(mod[gone], gone).toBeUndefined()
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
