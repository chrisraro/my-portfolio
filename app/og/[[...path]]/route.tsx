import { ImageResponse } from 'next/og'
import { heroContent } from '@/lib/data'
import { DAWN, PAD_X, RIDGE, TEXT_WIDTH } from '@/lib/og-linework'
import { ogPalette as c } from '@/lib/og-palette'
import { OG_SIZE, SITE_URL } from '@/lib/site-metadata'
import { findRoute } from '@/lib/site-routes'

// One link-preview card per page (spec §6), at the page's own path under /og:
// /og is the homepage's, /og/about the about page's, /og/projects/iskotify Iskotify's.
// One layout in the night palette; the words come from the page's route in
// lib/site-routes.ts, so a path that is not a page gets a 404, never a card
// with words a stranger chose.
//
// Edge runtime, not Node: next/og's Node build locates its wasm with
// path.join(import.meta.url, ...), which throws "Invalid URL" on Windows and
// failed `next build` there. The edge build imports its wasm instead. Edge
// routes render per request, so the font is fetched as a bundled asset.
// Recursive Sans is a static instance from Google Fonts (SIL Open Font
// License) in app/fonts: ImageResponse cannot read a variable font, and the
// site's Instrument Sans ships as one.
export const runtime = 'edge'

const SANS = 'Recursive'

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
          <path d={DAWN} fill={c.dawn} />
          <path d={RIDGE} fill={c['land-far']} stroke={c['land-lit']} strokeWidth={3} />
        </svg>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: `64px ${PAD_X}px 56px`,
          }}
        >
          <div
            style={{
              display: 'flex',
              maxWidth: TEXT_WIDTH,
              fontSize: 24,
              color: c.muted,
            }}
          >
            {card.eyebrow}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: TEXT_WIDTH }}>
            <div
              style={{
                display: 'flex',
                fontSize: 68,
                fontWeight: 600,
                lineHeight: 1.04,
                letterSpacing: -2,
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
              maxWidth: TEXT_WIDTH,
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
