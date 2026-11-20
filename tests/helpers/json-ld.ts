import type { JsonLdNode } from '@/lib/structured-data'

// Graph-shape checks for the JSON-LD tests. Each is shown failing in
// tests/content/structured-data.test.ts before it is trusted.

/** Every { '@id': … } reference in the graph whose id is not one of its nodes. */
export function danglingRefs(graph: JsonLdNode): string[] {
  const nodes = graph['@graph'] as JsonLdNode[]
  const ids = new Set(nodes.map((n) => n['@id']).filter((id): id is string => typeof id === 'string'))
  const refs: string[] = []
  const walk = (value: unknown, isNode: boolean): void => {
    if (Array.isArray(value)) {
      value.forEach((v) => walk(v, false))
      return
    }
    if (value === null || typeof value !== 'object') return
    const entries = Object.entries(value)
    if (!isNode && entries.length === 1 && entries[0][0] === '@id') refs.push(String(entries[0][1]))
    for (const [, v] of entries) walk(v, false)
  }
  nodes.forEach((n) => walk(n, true))
  return refs.filter((id) => !ids.has(id))
}

/** The required fields a node lacks: missing, null, an empty string or an empty list. */
export function missingFields(node: JsonLdNode, required: readonly string[]): string[] {
  return required.filter((key) => {
    const v = node[key]
    return v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)
  })
}
