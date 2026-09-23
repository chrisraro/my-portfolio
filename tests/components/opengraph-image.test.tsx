import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Image, { alt, contentType, size } from '@/app/opengraph-image'
import { heroContent } from '@/lib/data'

// The social card renders from heroContent through next/og. This renders it
// for real and reads the PNG header, so a broken font path or layout fails here
// rather than as a blank preview on a shared link.
//
// Outside Next, next/og runs its Node build, which locates its wasm with
// path.join(import.meta.url, ...) and throws "Invalid URL" on Windows. So the
// render is skipped on Windows only; CI runs it on Linux. The route fetches its
// fonts as bundled assets, and Node's fetch cannot read file: URLs, so the test
// serves those from disk.
describe('opengraph-image', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('declares a 1200×630 PNG', () => {
    expect(size).toEqual({ width: 1200, height: 630 })
    expect(contentType).toBe('image/png')
  })

  it.skipIf(process.platform === 'win32')('renders a 1200×630 PNG', async () => {
    vi.stubGlobal('fetch', async (url: URL) => new Response(readFileSync(fileURLToPath(url))))

    const response = await Image()
    const png = Buffer.from(await response.arrayBuffer())
    expect(png.subarray(0, 8)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    expect(png.readUInt32BE(16)).toBe(1200)
    expect(png.readUInt32BE(20)).toBe(630)
  }, 30000)

  it('describes itself from the current positioning', () => {
    expect(alt).toContain(heroContent.name)
    expect(alt).toContain(heroContent.title)
    expect(alt).toContain(heroContent.specialism)
    expect(alt).not.toMatch(/software engineer/i)
  })
})
