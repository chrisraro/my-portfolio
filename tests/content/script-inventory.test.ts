import { describe, expect, it } from 'vitest'
import { projects } from '@/lib/data'
import { parseProjects, readProjects } from '@/scripts/lib/read-projects.mjs'

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

  it('reads each slug correctly', () => {
    for (const project of projects) {
      const match = parsed.find((p) => p.id === project.id)
      expect(match?.slug).toBe(project.slug)
    }
  })

  it('reads each title correctly', () => {
    for (const project of projects) {
      const match = parsed.find((p) => p.id === project.id)
      expect(match?.title).toBe(project.title)
    }
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

// parseProjects() takes the source text directly, so these edge cases build
// small synthetic `lib/data.ts`-shaped strings instead of relying on
// lib/data.ts to happen to contain a tricky value. None of the 15 real
// entries currently has an apostrophe in a title or a missing status, which
// is exactly why the guard test above wouldn't have caught either bug.
describe('script inventory parser edge cases', () => {
  it('throws instead of silently truncating a title containing an apostrophe', () => {
    const source = `export const projects: Project[] = [
  {
    id: 'bobs-site',
    slug: 'bobs-site',
    title: 'Bob's Site',
    status: 'live',
  },
]
`
    expect(() => parseProjects(source)).toThrow(/truncated/)
  })

  it('throws when a chunk is missing its status field', () => {
    const source = `export const projects: Project[] = [
  {
    id: 'no-status',
    slug: 'no-status',
    title: 'No Status',
  },
]
`
    expect(() => parseProjects(source)).toThrow(/no-status.*status/)
  })

  it('throws when the chunk count disagrees with the slug: count in the source', () => {
    const source = `export const projects: Project[] = [
  {
    id: 'first',
    slug: 'first-slug',
    title: 'First Project',
    status: 'live',
  slug: 'stray-slug',
  },
]
`
    expect(() => parseProjects(source)).toThrow(/1 project chunk.*2 'slug:'/)
  })

  it('parses a well-formed two-entry source into both entries', () => {
    const source = `export const projects: Project[] = [
  {
    id: 'first',
    slug: 'first-slug',
    title: 'First Project',
    status: 'live',
    links: { live: 'https://first.example.com' },
  },
  {
    id: 'second',
    slug: 'second-slug',
    title: 'Second Project',
    status: 'archived',
  },
]
`
    const parsed = parseProjects(source)
    expect(parsed).toEqual([
      {
        id: 'first',
        slug: 'first-slug',
        title: 'First Project',
        status: 'live',
        live: 'https://first.example.com',
      },
      {
        id: 'second',
        slug: 'second-slug',
        title: 'Second Project',
        status: 'archived',
        live: undefined,
      },
    ])
  })
})
