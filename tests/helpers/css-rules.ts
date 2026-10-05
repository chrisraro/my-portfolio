export interface CssRule {
  selector: string
  body: string
  /** The at-rule preludes enclosing the rule, outermost first. */
  ancestors: string[]
}

/** Leaf rules (blocks with no nested block) of a stylesheet, with the at-rules around them. */
export function parseCssRules(source: string): CssRule[] {
  const text = source.replace(/\/\*[\s\S]*?\*\//g, '')
  const rules: CssRule[] = []
  const stack: { prelude: string; start: number }[] = []
  let last = 0
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '{') {
      stack.push({ prelude: text.slice(last, i).replace(/\s+/g, ' ').trim(), start: i + 1 })
      last = i + 1
    } else if (ch === '}') {
      const top = stack.pop()
      if (top) {
        const body = text.slice(top.start, i)
        if (!body.includes('{')) rules.push({ selector: top.prelude, body, ancestors: stack.map((s) => s.prelude) })
      }
      last = i + 1
    } else if (ch === ';') {
      last = i + 1
    }
  }
  return rules
}
