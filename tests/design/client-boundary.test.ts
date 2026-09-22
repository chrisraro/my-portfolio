import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Spec §5: only components that need interactivity are client components.
// Everything that renders static data stays on the server. Target: under 10.
function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return full.endsWith('.tsx') ? [full] : []
  })
}

describe('client boundary', () => {
  const clientFiles = ['app', 'components']
    .flatMap(sourceFiles)
    .filter((f) => /^['"]use client['"]/.test(readFileSync(f, 'utf8').trimStart()))

  it('keeps fewer than 10 client components', () => {
    expect(clientFiles.length, clientFiles.join('\n')).toBeLessThan(10)
  })

  it('renders the homepage and /projects on the server', () => {
    expect(clientFiles).not.toContain(join('app', 'page.tsx'))
    expect(clientFiles).not.toContain(join('app', 'projects', 'page.tsx'))
  })
})
