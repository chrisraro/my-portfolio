import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return sources(full)
    return /\.(tsx?|mjs)$/.test(full) ? [full] : []
  })
}

describe('one motion library', () => {
  it('never imports framer-motion', () => {
    const offenders = ['app', 'components', 'lib'].flatMap(sources).filter((f) => readFileSync(f, 'utf8').includes('framer-motion'))
    expect(offenders).toEqual([])
  })
  it('does not depend on framer-motion', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
    expect({ ...pkg.dependencies, ...pkg.devDependencies }).not.toHaveProperty('framer-motion')
    expect(pkg.dependencies).toHaveProperty('motion')
  })
})
