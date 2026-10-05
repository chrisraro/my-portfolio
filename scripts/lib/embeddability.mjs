// Pure framing rules: can a page with these response headers be shown in an <iframe>?
// No side effects, so it can be imported by tests.

// `origin` is the portfolio's own origin: a frame-ancestors list that names it
// lets the portfolio frame the site even though other origins stay blocked.
export function allowsFraming(headers, origin) {
  const self = origin ? origin.replace(/\/+$/, '').toLowerCase() : undefined

  const csp = headers.get('content-security-policy') || ''
  const directives = csp
    .split(',')
    .map((policy) =>
      policy
        .split(';')
        .map((d) => d.trim())
        .find((d) => d.toLowerCase().startsWith('frame-ancestors')),
    )
    .filter(Boolean)

  // CSP frame-ancestors supersedes X-Frame-Options in browsers that support it.
  if (directives.length > 0) {
    return directives.every((directive) => {
      const sources = directive
        .split(/\s+/)
        .slice(1)
        .map((s) => s.toLowerCase().replace(/\/+$/, ''))
      // A bare wildcard allows arbitrary origins; otherwise the list must name ours.
      return sources.includes('*') || (self !== undefined && sources.includes(self))
    })
  }

  const xfo = (headers.get('x-frame-options') || '').toLowerCase()
  return !(xfo.includes('deny') || xfo.includes('sameorigin') || xfo.includes('allow-from'))
}
