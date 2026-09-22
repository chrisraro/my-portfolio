import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { StatusBadge } from '@/components/ui/status-badge'
import type { ProjectStatus } from '@/types'

const CASES: [ProjectStatus, string][] = [
  ['live', 'Live'],
  ['ua-gated', 'Live'],
  ['early-access', 'Early access'],
  ['auth-gated', 'Private'],
  ['internal', 'Internal'],
]

describe('StatusBadge', () => {
  it.each(CASES)('renders %s with the text label "%s"', (status, label) => {
    const html = renderToStaticMarkup(<StatusBadge status={status} />)
    expect(html).toContain(`>${label}<`)
  })

  it('keeps the label in the accessibility tree when compact', () => {
    const html = renderToStaticMarkup(<StatusBadge status="live" compact />)
    expect(html).toContain('sr-only')
    expect(html).toContain('>Live<')
  })

  it('hides the glyph from assistive technology', () => {
    const html = renderToStaticMarkup(<StatusBadge status="auth-gated" />)
    expect(html).toContain('aria-hidden="true"')
  })

  it('pulses only the live glyph', () => {
    expect(renderToStaticMarkup(<StatusBadge status="live" />)).toContain('live-pulse')
    expect(renderToStaticMarkup(<StatusBadge status="early-access" />)).not.toContain('live-pulse')
  })
})
