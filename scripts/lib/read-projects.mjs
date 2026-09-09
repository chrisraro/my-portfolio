// The Node scripts need the project inventory, but lib/data.ts is TypeScript
// and they run under bare node. Rather than let each script keep its own copy —
// which is exactly how the capture targets drifted three projects out of date —
// they read the array out of lib/data.ts. A vitest guard (tests/content/
// script-inventory.test.ts) fails if the parse stops matching the real export.

import fs from 'node:fs'
import path from 'node:path'

const DATA_FILE = path.resolve('lib/data.ts')

function field(chunk, name) {
  const match = chunk.match(new RegExp(`\\b${name}:\\s*'([^']*)'`))
  return match ? match[1] : undefined
}

export function readProjects() {
  // Normalize CRLF -> LF: this file is checked out with CRLF line endings on
  // Windows (core.autocrlf=true), and these scripts only ever run there.
  const source = fs.readFileSync(DATA_FILE, 'utf8').replace(/\r\n/g, '\n')
  const start = source.indexOf('export const projects: Project[] = [')
  if (start === -1) throw new Error('Could not find the projects array in lib/data.ts')

  const end = source.indexOf('\n]', start)
  const body = source.slice(start, end)

  return body
    .split(/\n  \{\n/)
    .slice(1)
    .map((chunk) => {
      const links = chunk.match(/links:\s*\{([^}]*)\}/)
      return {
        id: field(chunk, 'id'),
        slug: field(chunk, 'slug'),
        title: field(chunk, 'title'),
        status: field(chunk, 'status'),
        live: links ? field(links[1], 'live') : undefined,
      }
    })
}
