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
    for (let i = 0; i < keys.length - 1; i++) {
      expect(keys[i]).toBeGreaterThan(keys[i + 1])
    }
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

  it('spans the gap before the OCS role', () => {
    expect(endOfRange(education[0].dates)).toBe(Date.UTC(2024, 6, 1))
  })
})

describe('dates shape', () => {
  // parseDateToken/endOfRange are deliberately tolerant: an unrecognised
  // month silently becomes January and an unparseable token becomes 0
  // rather than throwing. That tolerance means a typo like 'Agust 2025' or
  // 'Nov. 2024' would otherwise slip through unnoticed and quietly mis-order
  // the timeline. Guard the content itself against that instead.
  const DATE_SHAPE = /^([A-Z][a-z]+ )?\d{4}( – (([A-Z][a-z]+ )?\d{4}|Present))?$/

  it('writes every dates string in a recognised shape', () => {
    for (const item of [...experience, ...education]) {
      expect(item.dates, `unrecognised date shape: ${JSON.stringify(item.dates)}`).toMatch(
        DATE_SHAPE
      )
    }
  })
})
