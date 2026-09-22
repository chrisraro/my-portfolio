import { describe, expect, it } from 'vitest'
import { galleryImages, projects, recommendations } from '@/lib/data'
import { buildFieldLog } from '@/lib/field-log'

describe('buildFieldLog', () => {
  const entries = buildFieldLog(galleryImages, recommendations, projects)

  it('includes every photo and every quote exactly once', () => {
    const photos = entries.filter((e) => e.kind === 'photo')
    const quotes = entries.filter((e) => e.kind === 'quote')
    expect(photos).toHaveLength(galleryImages.length)
    expect(quotes).toHaveLength(recommendations.length)
  })

  it('opens with a photo, so the section leads with people on site', () => {
    expect(entries[0].kind).toBe('photo')
  })

  it('places a quote after every second photo', () => {
    expect(entries.slice(0, 3).map((e) => e.kind)).toEqual(['photo', 'photo', 'quote'])
  })

  it('attaches each quote to its project when it has one', () => {
    for (const entry of entries) {
      if (entry.kind !== 'quote') continue
      if (entry.recommendation.projectId) {
        expect(entry.project?.id).toBe(entry.recommendation.projectId)
      } else {
        expect(entry.project).toBeUndefined()
      }
    }
  })
})
