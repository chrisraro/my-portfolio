import { describe, expect, it } from 'vitest'
import { education, experience } from '@/lib/data'
import { endOfRange } from '@/lib/dates'

describe('experience', () => {
  it('holds exactly the two professional roles', () => {
    expect(experience.map((e) => e.id)).toEqual(['ocs-webdev', 'enjoy-it'])
  })

  it('labels the concurrent role rather than hiding the overlap', () => {
    const enjoy = experience.find((e) => e.id === 'enjoy-it')
    expect(enjoy?.concurrent).toBeTruthy()
    expect(enjoy?.concurrent).toContain('Online Creative Solutions')
  })

  it('sorts strictly descending by the end of each range', () => {
    const keys = experience.map((e) => endOfRange(e.dates))
    const sorted = [...keys].sort((a, b) => b - a)
    expect(keys).toEqual(sorted)
  })

  it('claims no years-of-experience figure anywhere in the entries', () => {
    const blob = JSON.stringify(experience)
    expect(blob).not.toMatch(/\d+\+?\s*years? of experience/i)
  })
})

describe('education', () => {
  it('carries only the degree, not the high-school strands', () => {
    expect(education).toHaveLength(1)
    expect(education[0].degree).toBe('B.S. in Computer Science')
  })

  it('spans the employment gap between the Muramart roles and OCS', () => {
    expect(endOfRange(education[0].dates)).toBe(Date.UTC(2024, 6, 1))
  })
})
