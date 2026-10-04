// Pure framing rules: can a page with these response headers be shown in an <iframe>?
// No side effects, so it can be imported by tests.

export function allowsFraming(headers) {
  const xfo = (headers.get('x-frame-options') || '').toLowerCase()
  if (xfo.includes('deny') || xfo.includes('sameorigin') || xfo.includes('allow-from')) return false

  const csp = headers.get('content-security-policy') || ''
  for (const policy of csp.split(',')) {
    const directive = policy
      .split(';')
      .map((d) => d.trim())
      .find((d) => d.toLowerCase().startsWith('frame-ancestors'))
    if (!directive) continue
    const sources = directive.split(/\s+/).slice(1).map((s) => s.toLowerCase())
    // Only a bare wildcard allows arbitrary origins.
    if (!sources.includes('*')) return false
  }
  return true
}
