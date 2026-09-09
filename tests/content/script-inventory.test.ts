import { describe, expect, it } from 'vitest'
import { projects } from '@/lib/data'
import { readProjects } from '../../scripts/lib/read-projects.mjs'

type ParsedProject = {
  id: string
  slug: string
  title: string
  status: string
  live?: string
}

describe('script inventory reader', () => {
  const parsed = readProjects() as ParsedProject[]

  it('finds every project the module exports, in order', () => {
    expect(parsed.map((p) => p.id)).toEqual(projects.map((p) => p.id))
  })

  it('reads each live URL correctly', () => {
    for (const project of projects) {
      const match = parsed.find((p) => p.id === project.id)
      expect(match?.live).toBe(project.links.live)
    }
  })

  it('reads each status correctly', () => {
    for (const project of projects) {
      const match = parsed.find((p) => p.id === project.id)
      expect(match?.status).toBe(project.status)
    }
  })
})
