import { ImageResponse } from 'next/og'
import { availability, heroContent } from '@/lib/data'
import { ogPalette as c } from '@/lib/og-palette'

// The link-preview card, rendered from heroContent so it can never drift from
// the page again: the old static og-image.png still said "Software Engineer" in
// the retired crimson-and-serif look long after the page changed.
//
// It mirrors the hero: the amber name line, the H1 with its amber period, and
// the specialism line. Recursive is the only face: two static instances from
// Google Fonts (SIL Open Font License) live in app/fonts, because
// ImageResponse cannot read the variable font's MONO axis.
//
// Edge runtime, not Node: next/og's Node build locates its wasm with
// path.join(import.meta.url, ...), which throws "Invalid URL" on Windows and
// failed `next build` there. The edge build imports its wasm instead. Edge
// routes render per request, so the fonts are fetched as bundled assets.
export const runtime = 'edge'

export const alt = `${heroContent.name} · ${heroContent.title}. ${heroContent.specialism}.`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const SANS = 'Recursive'
const MONO = 'Recursive Mono'

// The top bar's mark, derived rather than retyped.
const mark = `~/${heroContent.name.toLowerCase().replace(/\s+/g, '-')}`

export default async function Image() {
  const [sans, mono] = await Promise.all([
    fetch(new URL('./fonts/recursive-sans-600.ttf', import.meta.url)).then((res) => res.arrayBuffer()),
    fetch(new URL('./fonts/recursive-mono-500.ttf', import.meta.url)).then((res) => res.arrayBuffer()),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px 64px',
          backgroundColor: c.bg,
          color: c.ink,
          fontFamily: SANS,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontFamily: MONO,
            fontSize: 26,
            letterSpacing: 2.6,
            textTransform: 'uppercase',
            color: c.accent,
          }}
        >
          {`${heroContent.name} · ${heroContent.location}`}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 100, fontWeight: 600, lineHeight: 1.02, letterSpacing: -2.5 }}>
            {heroContent.title}
            <span style={{ color: c.accent }}>.</span>
          </div>
          <div style={{ display: 'flex', marginTop: 32, fontFamily: MONO, fontSize: 28, color: c.accent }}>
            {heroContent.specialism}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 28,
            borderTop: `1px solid ${c.line}`,
            fontFamily: MONO,
            fontSize: 24,
          }}
        >
          <span style={{ color: c.muted }}>{mark}</span>
          <span style={{ display: 'flex', alignItems: 'center', color: c.accent }}>
            <span
              style={{ width: 10, height: 10, marginRight: 14, borderRadius: 9999, backgroundColor: c.accent }}
            />
            {availability}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: SANS, data: sans, weight: 600, style: 'normal' },
        { name: MONO, data: mono, weight: 500, style: 'normal' },
      ],
    },
  )
}
