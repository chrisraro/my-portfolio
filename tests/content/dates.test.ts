import { describe, expect, it } from 'vitest'
import { endOfRange, parseDateToken } from '@/lib/dates'

const NOW = new Date('2026-09-10T00:00:00Z')

describe('parseDateToken', () => {
  it('parses a month and year', () => {
    expect(parseDateToken('August 2023')).toBe(Date.UTC(2023, 7, 1))
  })

  it('parses an abbreviated month', () => {
    expect(parseDateToken('Nov 2024')).toBe(Date.UTC(2024, 10, 1))
  })

  it('parses a bare year as January', () => {
    expect(parseDateToken('2024')).toBe(Date.UTC(2024, 0, 1))
  })

  it('resolves Present to now', () => {
    expect(parseDateToken('Present', NOW)).toBe(NOW.getTime())
  })
})

describe('endOfRange', () => {
  it('takes the end of an en-dashed range', () => {
    expect(endOfRange('March 2025 – August 2025')).toBe(Date.UTC(2025, 7, 1))
  })

  it('takes the end of a hyphenated range', () => {
    expect(endOfRange('July 2023 - August 2023')).toBe(Date.UTC(2023, 7, 1))
  })

  it('handles a single date with no range', () => {
    expect(endOfRange('June 2026')).toBe(Date.UTC(2026, 5, 1))
  })

  it('ranks an ongoing role above a finished later one', () => {
    expect(endOfRange('November 2024 – Present', NOW)).toBeGreaterThan(
      endOfRange('March 2025 – August 2025', NOW)
    )
  })
})
