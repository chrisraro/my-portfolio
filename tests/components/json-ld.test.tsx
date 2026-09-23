import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { JsonLd } from '@/components/json-ld'

const inner = (html: string) => html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? ''

describe('JsonLd', () => {
  it('renders parseable JSON-LD', () => {
    const data = { '@context': 'https://schema.org', '@type': 'Thing', name: 'x' }
    expect(JSON.parse(inner(renderToStaticMarkup(<JsonLd data={data} />)))).toEqual(data)
  })

  it('cannot be closed early by a value containing a script tag', () => {
    const data = { name: '</script><script>alert(1)</script>' }
    const html = renderToStaticMarkup(<JsonLd data={data} />)
    expect(html.match(/<\/script>/g)).toHaveLength(1)
    expect(JSON.parse(inner(html))).toEqual(data)
  })
})
