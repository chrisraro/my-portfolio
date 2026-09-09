import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOTS = ['app', 'components', 'lib']
const EXTENSIONS = ['.ts', '.tsx']

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return EXTENSIONS.some((ext) => full.endsWith(ext)) ? [full] : []
  })
}

const FILES = ROOTS.flatMap(sourceFiles)

describe('removed surfaces', () => {
  it('has no source file referencing the deleted /tech-stack route', () => {
    const offenders = FILES.filter((file) =>
      readFileSync(file, 'utf8').includes('/tech-stack')
    )
    expect(offenders).toEqual([])
  })

  it('has no source file referencing the deleted credentials sidebar', () => {
    const offenders = FILES.filter((file) =>
      readFileSync(file, 'utf8').includes('credentials-sidebar')
    )
    expect(offenders).toEqual([])
  })
})
