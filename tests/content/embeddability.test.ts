import { describe, expect, it } from 'vitest'
import { allowsFraming } from '../../scripts/lib/embeddability.mjs'

const h = (init: Record<string, string>) => new Headers(init)

describe('allowsFraming', () => {
  it('allows a site that sends no framing headers', () => {
    expect(allowsFraming(h({}))).toBe(true)
  })

  it.each(['DENY', 'SAMEORIGIN', 'ALLOW-FROM https://example.com'])('blocks X-Frame-Options %s', (v) => {
    expect(allowsFraming(h({ 'x-frame-options': v }))).toBe(false)
  })

  it.each([
    "frame-ancestors 'self'",
    "frame-ancestors 'none'",
    'frame-ancestors https://a.example https://b.example',
    'frame-ancestors https:',
  ])('blocks CSP %s', (v) => {
    expect(allowsFraming(h({ 'content-security-policy': v }))).toBe(false)
  })

  it('allows frame-ancestors *', () => {
    expect(allowsFraming(h({ 'content-security-policy': 'frame-ancestors *' }))).toBe(true)
  })

  it('blocks when one of two policies restricts', () => {
    expect(
      allowsFraming(h({ 'content-security-policy': "frame-ancestors *, frame-ancestors 'self'" })),
    ).toBe(false)
  })

  const portfolio = 'https://christian-digital-portfolio.vercel.app'

  it('allows a frame-ancestors list that names the portfolio origin', () => {
    const csp = `frame-ancestors 'self' ${portfolio}/; object-src 'none'`
    expect(allowsFraming(h({ 'content-security-policy': csp }), portfolio)).toBe(true)
  })

  it('still blocks a list that names only other origins', () => {
    const csp = "frame-ancestors 'self' https://ocs-wp-control.vercel.app"
    expect(allowsFraming(h({ 'content-security-policy': csp }), portfolio)).toBe(false)
  })

  it('lets a frame-ancestors that names the portfolio override X-Frame-Options', () => {
    const headers = h({ 'content-security-policy': `frame-ancestors ${portfolio}`, 'x-frame-options': 'SAMEORIGIN' })
    expect(allowsFraming(headers, portfolio)).toBe(true)
  })

  it('blocks X-Frame-Options alongside a CSP with no frame-ancestors', () => {
    const headers = h({ 'content-security-policy': "default-src 'self'", 'x-frame-options': 'SAMEORIGIN' })
    expect(allowsFraming(headers, portfolio)).toBe(false)
  })

  it('allows a CSP without frame-ancestors', () => {
    expect(allowsFraming(h({ 'content-security-policy': "default-src 'self'; img-src *" }))).toBe(true)
  })

  it('ignores Content-Security-Policy-Report-Only', () => {
    expect(
      allowsFraming(h({ 'content-security-policy-report-only': "frame-ancestors 'none'" })),
    ).toBe(true)
  })
})
