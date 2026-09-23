import type { JsonLdNode } from '@/lib/structured-data'

// Structured data for crawlers. `<` is escaped so a value can never close the
// script element early; JSON.parse reads < back as `<`.
export function JsonLd({ data }: { data: JsonLdNode }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
