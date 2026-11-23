// Draws the landscape behind the site: Mount Isarog over the Naga plain, as
// four one-bit PNG masks in public/assets/scene/. Colour is never baked in:
// app/globals.css paints each mask with a theme token, so day and night share
// the files. One-off; run `node scripts/build-scene.mjs` and commit the result.
//
// The grid is CELLS_X x CELLS_Y cells of BLOCK px. Everything is periodic over
// CELLS_X, so the masks repeat seamlessly on a wide screen, and seeded, so a
// rerun writes the same bytes.
import { mkdirSync, writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const CELLS_X = 640
const CELLS_Y = 112
const BLOCK = 4
const OUT = 'public/assets/scene'

// 8x8 Bayer matrix, thresholds in 0..1.
const bayer = (n) => {
  if (n === 1) return [[0]]
  const half = bayer(n / 2)
  return Array.from({ length: n }, (_, y) =>
    Array.from({ length: n }, (_, x) => {
      const v = half[y % (n / 2)][x % (n / 2)] * 4
      const q = [[0, 2], [3, 1]][y < n / 2 ? 0 : 1][x < n / 2 ? 0 : 1]
      return v + q
    }),
  )
}
const B = bayer(8)
const threshold = (x, y) => (B[y & 7][x & 7] + 0.5) / 64

const hash = (i, seed) => {
  let h = Math.imul(i ^ (seed * 374761393), 668265263)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}
// 1-D value noise, periodic over `period` lattice points across CELLS_X.
const noise = (x, period, seed) => {
  const t = (x / CELLS_X) * period
  const i = Math.floor(t)
  const f = t - i
  const s = f * f * (3 - 2 * f)
  const a = hash(((i % period) + period) % period, seed)
  const b = hash((((i + 1) % period) + period) % period, seed)
  return a + (b - a) * s
}
const fbm = (x, base, seed) => noise(x, base, seed) * 0.55 + noise(x, base * 3, seed + 1) * 0.3 + noise(x, base * 8, seed + 2) * 0.15

// Isarog: a broad, isolated cone whose summit is a worn crater rim, lower on
// its eastern side. Heights are cells from the bottom edge.
const PEAK = CELLS_X * 0.5
const isarog = (x) => {
  const d = x - PEAK
  const w = d < 0 ? 92 : 108
  const cone = 66 / (1 + Math.pow(Math.abs(d) / w, 1.75))
  const notch = d > 3 && d < 22 ? -5.5 * Math.sin(((d - 3) / 19) * Math.PI) : 0
  const gullies = (fbm(x, 40, 11) - 0.5) * 7 * Math.min(1, Math.abs(d) / 30)
  return 24 + cone + notch + gullies
}
const hills = (x) => 15 + fbm(x, 10, 31) * 26
const trees = (x) => 4 + fbm(x, 16, 51) * 12 + Math.floor(noise(x, 160, 71) * 5)

const grid = (fn) => Array.from({ length: CELLS_Y }, (_, y) => Array.from({ length: CELLS_X }, (_, x) => fn(x, CELLS_Y - 1 - y, y)))

// Light comes from behind the summit, on the eastern side: each slope's lit
// texture thins toward its foot.
const lit = (x, h, y, top, seed, strength) => {
  if (h >= top - 1) return false
  const depth = (top - h) / top
  const grain = fbm(x + h * 3, 60, seed)
  return Math.max(0, strength * (1 - depth * 1.35)) * (0.45 + grain) > threshold(x, y)
}

// Coconut palms along the near ridge: a leaning trunk and a small crown.
const palms = new Set()
for (let i = 0; i < 22; i++) {
  const x0 = Math.floor(((i + hash(i, 91) * 0.8) / 22) * CELLS_X)
  const base = Math.floor(trees(x0))
  const tall = 8 + Math.floor(hash(i, 92) * 9)
  const lean = hash(i, 93) < 0.5 ? -1 : 1
  let x = x0
  for (let k = 0; k <= tall; k++) {
    if (k > 0 && k % 5 === 0) x += lean
    palms.add(`${(x + CELLS_X) % CELLS_X},${base + k}`)
  }
  for (const [dx, dy] of [[-4, -2], [-3, -1], [-2, 0], [-1, 1], [0, 1], [1, 1], [2, 0], [3, -1], [4, -2], [-3, 1], [-2, 2], [2, 2], [3, 1], [-1, 2], [1, 2], [-2, -2], [2, -2]])
    palms.add(`${(x + dx + CELLS_X) % CELLS_X},${base + tall + dy}`)
}

const layers = {
  // First light behind the summit: a dithered half disc.
  dawn: grid((x, h, y) => {
    const r = Math.hypot((x - PEAK - 6) / 1.9, (h - 58) * 1.7)
    return h > 18 && Math.pow(Math.max(0, 1 - r / 88), 1.5) * 1.05 > threshold(x, y)
  }),
  far: grid((x, h) => h < isarog(x)),
  near: grid((x, h) => h < trees(x) || h < hills(x) * 0.72 || palms.has(`${x},${h}`)),
  lit: grid((x, h, y) => {
    const front = Math.max(trees(x), hills(x) * 0.72)
    if (h < front || palms.has(`${x},${h}`)) return lit(x, h, y, front, 41, 0.2)
    const top = isarog(x)
    const east = x > PEAK ? 0.62 : 0.34
    return h < top && lit(x, h, y, top, 21, east)
  }),
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc = (buf) => {
  let c = 0xffffffff
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
const chunk = (type, data) => {
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const out = Buffer.alloc(body.length + 8)
  out.writeUInt32BE(data.length, 0)
  body.copy(out, 4)
  out.writeUInt32BE(crc(body), body.length + 4)
  return out
}
// One bit per pixel, indexed: 0 is transparent, 1 is opaque.
const png = (cells) => {
  const width = CELLS_X * BLOCK
  const height = CELLS_Y * BLOCK
  const stride = width / 8
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    const row = cells[Math.floor(y / BLOCK)]
    for (let x = 0; x < width; x++) {
      if (row[Math.floor(x / BLOCK)]) raw[y * (stride + 1) + 1 + (x >> 3)] |= 0x80 >> (x & 7)
    }
  }
  const head = Buffer.alloc(13)
  head.writeUInt32BE(width, 0)
  head.writeUInt32BE(height, 4)
  head[8] = 1
  head[9] = 3
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', head),
    chunk('PLTE', Buffer.from([0, 0, 0, 0, 0, 0])),
    chunk('tRNS', Buffer.from([0, 255])),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

mkdirSync(OUT, { recursive: true })
for (const [name, cells] of Object.entries(layers)) {
  const file = png(cells)
  writeFileSync(`${OUT}/${name}.png`, file)
  console.log(`${name}.png ${(file.length / 1024).toFixed(1)} KB`)
}
