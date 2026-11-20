import { ImageResponse } from 'next/og'
import { heroContent } from '@/lib/data'
import { ogPalette as c } from '@/lib/og-palette'
import { OG_SIZE, SITE_URL } from '@/lib/site-metadata'
import { findRoute } from '@/lib/site-routes'

// One link-preview card per page (spec §6), at the page's own path under /og:
// /og is the homepage's, /og/about the about page's, /og/projects/giya Giya's.
// One layout in the trail palette; the words come from the page's route in
// lib/site-routes.ts, so a path that is not a page gets a 404, never a card
// with words a stranger chose.
//
// Edge runtime, not Node: next/og's Node build locates its wasm with
// path.join(import.meta.url, ...), which throws "Invalid URL" on Windows and
// failed `next build` there. The edge build imports its wasm instead. Edge
// routes render per request, so the font is fetched as a bundled asset.
// Recursive Sans is a static instance from Google Fonts (SIL Open Font
// License) in app/fonts: ImageResponse cannot read a variable font, and the
// site's Archivo ships as one.
export const runtime = 'edge'

const SANS = 'Recursive'

// The card's survey linework, authored for 1200×630 and kept to the right
// third so it never runs under the words: contours, and the trail ending at
// the "you are here" dot (trail red's one use on the card).
const CONTOURS = [
  'M 860 0 C 900 80 980 120 1060 140 S 1170 190 1200 200',
  'M 960 0 C 990 50 1050 80 1110 92 S 1180 110 1200 112',
  'M 880 630 C 900 540 960 470 1040 430 S 1170 330 1200 300',
  'M 960 630 C 980 560 1030 510 1100 480 S 1180 410 1200 395',
  'M 1040 630 C 1060 590 1100 560 1150 545 S 1190 530 1200 528',
]
const TRAIL = 'M 900 630 C 930 560 980 500 1030 440 S 1100 330 1120 300'
const HERE = { cx: 1120, cy: 300 }

const host = new URL(SITE_URL).host

export async function GET(_request: Request, { params }: { params: { path?: string[] } }) {
  const route = findRoute(`/${(params.path ?? []).join('/')}`)
  if (!route) return new Response('Not found', { status: 404 })
  const { card } = route

  const sans = await fetch(new URL('../../fonts/recursive-sans-600.ttf', import.meta.url)).then((res) =>
    res.arrayBuffer(),
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: c.bg,
          color: c.ink,
          fontFamily: SANS,
        }}
      >
        <svg
          width={OG_SIZE.width}
          height={OG_SIZE.height}
          viewBox={`0 0 ${OG_SIZE.width} ${OG_SIZE.height}`}
          style={{ position: 'absolute', left: 0, top: 0 }}
        >
          {CONTOURS.map((d) => (
            <path key={d} d={d} fill="none" stroke={c.contour} strokeWidth={2} />
          ))}
          <path d={TRAIL} fill="none" stroke={c.trail} strokeWidth={5} strokeLinecap="round" />
          <circle cx={HERE.cx} cy={HERE.cy} r={11} fill={c.trail} />
        </svg>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '64px 80px 56px',
          }}
        >
          <div style={{ display: 'flex', fontSize: 24, letterSpacing: 3, textTransform: 'uppercase', color: c.muted }}>
            {card.eyebrow}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 760 }}>
            <div
              style={{
                display: 'flex',
                fontSize: 68,
                fontWeight: 600,
                lineHeight: 1.04,
                letterSpacing: -1,
                textTransform: 'uppercase',
              }}
            >
              {card.title}
            </div>
            <div style={{ display: 'flex', marginTop: 24, fontSize: 28, lineHeight: 1.3, color: c.muted }}>
              {card.detail}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 24,
              borderTop: `2px solid ${c.line}`,
              fontSize: 24,
            }}
          >
            <span style={{ color: c.ink }}>{heroContent.name}</span>
            <span style={{ color: c.muted }}>{host}</span>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: SANS, data: sans, weight: 600, style: 'normal' }] },
  )
}
