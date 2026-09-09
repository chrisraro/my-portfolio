// The Node scripts need the project inventory, but lib/data.ts is TypeScript
// and they run under bare node. Rather than let each script keep its own copy —
// which is exactly how the capture targets drifted three projects out of date —
// they read the array out of lib/data.ts. A vitest guard (tests/content/
// script-inventory.test.ts) fails if the parse stops matching the real export.

import fs from 'node:fs'
import path from 'node:path'

const DATA_FILE = path.resolve('lib/data.ts')

// field() finds `name: '...'` and returns the quoted value, scanning only as
// far as the end of that line. A value containing an apostrophe (e.g. a title
// like "Bob's Site") would make the old `[^']*'` regex stop at the first `'`
// it hits and silently return a truncated string. Here we instead grab
// everything up to the closing quote on the same line and validate what comes
// right after it, so a value we can't parse cleanly throws instead of
// truncating.
function field(chunk, name) {
  const open = chunk.match(new RegExp(`\\b${name}:\\s*'`))
  if (!open) return undefined

  const afterOpen = chunk.slice(open.index + open[0].length)
  const lineBreak = afterOpen.search(/\r?\n/)
  const line = lineBreak === -1 ? afterOpen : afterOpen.slice(0, lineBreak)

  const closeIdx = line.indexOf("'")
  if (closeIdx === -1) {
    throw new Error(
      `Could not find a closing quote for '${name}' — value ran to the end of its line: ${JSON.stringify(line.slice(0, 80))}`
    )
  }

  const value = line.slice(0, closeIdx)
  // Allow (and ignore) plain spaces/tabs right after the closing quote — e.g.
  // the ` }` in `links: { live: 'https://example.com' }` — before requiring
  // a ',' or end of line. Anything else (like a stray letter from a value
  // that was actually still open) means the "closing" quote we found wasn't
  // the real one.
  const after = line.slice(closeIdx + 1).replace(/^[ \t]+/, '')
  if (after !== '' && after[0] !== ',') {
    throw new Error(
      `Value for '${name}' looks truncated — expected ',' or end of line right after the closing quote, found ${JSON.stringify(after.slice(0, 20))}`
    )
  }

  return value
}

// parseProjects() is the actual parser, split out from readProjects() so
// tests can feed it small synthetic source strings instead of only ever
// exercising it against the real lib/data.ts.
export function parseProjects(source) {
  const start = source.indexOf('export const projects: Project[] = [')
  if (start === -1) throw new Error('Could not find the projects array in lib/data.ts')

  const end = source.indexOf('\n]', start)
  const body = source.slice(start, end)

  const entries = body
    .split(/\n  \{\n/)
    .slice(1)
    .map((chunk, index) => {
      const links = chunk.match(/links:\s*\{([^}]*)\}/)
      const entry = {
        id: field(chunk, 'id'),
        slug: field(chunk, 'slug'),
        title: field(chunk, 'title'),
        status: field(chunk, 'status'),
        live: links ? field(links[1], 'live') : undefined,
      }

      const missing = []
      if (!entry.id) missing.push('id')
      if (!entry.status) missing.push('status')
      if (missing.length > 0) {
        const label = entry.id ? `id "${entry.id}"` : `index ${index}`
        throw new Error(
          `Project chunk at ${label} is missing required field(s): ${missing.join(', ')}`
        )
      }

      return entry
    })

  // Independent cross-check: count `slug:` occurrences in the raw array body
  // and compare against how many chunks the splitter produced. If the
  // splitter merges two entries or misses a boundary (e.g. because of an
  // unusual indent or a stray column-0 `]`/two-space `{` inside a value),
  // the chunk count and the slug count will disagree.
  const slugCount = (body.match(/\bslug:\s*'/g) || []).length
  if (slugCount !== entries.length) {
    throw new Error(
      `Parsed ${entries.length} project chunk(s) but found ${slugCount} 'slug:' occurrence(s) in lib/data.ts — the chunk splitter may have missed or merged an entry`
    )
  }

  return entries
}

export function readProjects() {
  // Normalize CRLF -> LF: this file is checked out with CRLF line endings on
  // Windows (core.autocrlf=true), and these scripts only ever run there.
  const source = fs.readFileSync(DATA_FILE, 'utf8').replace(/\r\n/g, '\n')
  return parseProjects(source)
}
