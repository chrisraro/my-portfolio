import { describe, expect, it } from 'vitest'
import { projects, recommendations } from '@/lib/data'

function projectIdFor(name: string): string | undefined {
  return recommendations.find((r) => r.authorName === name)?.projectId
}

describe('testimonials', () => {
  it('keeps all four real, named, attributed quotes', () => {
    expect(recommendations).toHaveLength(4)
    for (const rec of recommendations) {
      expect(rec.authorName.trim()).not.toBe('')
      expect(rec.authorTitle.trim()).not.toBe('')
      expect(rec.quote.trim()).not.toBe('')
    }
  })

  it('resolves every attached projectId to a real project', () => {
    const ids = projects.map((p) => p.id)
    for (const rec of recommendations) {
      if (rec.projectId !== undefined) {
        expect(ids).toContain(rec.projectId)
      }
    }
  })

  it('attaches the three quotes whose organisations appear in the inventory', () => {
    expect(projectIdFor('Alec Santos')).toBe('beachbus')
    expect(projectIdFor('Brian Labilles')).toBe('aman-webapp')
    expect(projectIdFor('Bryden Elizan')).toBe('ocs-wp-control')
  })

  it('leaves the quote with no matching project unattached', () => {
    expect(projectIdFor('Joseph Cua')).toBeUndefined()
  })
})
