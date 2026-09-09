import { describe, expect, it } from 'vitest'
import { buildTimeline } from '@/lib/timeline'

describe('buildTimeline', () => {
  // This is the regression test for the bug this task exists to fix: sorting
  // the first four-digit number in a date string ranked an ongoing role by
  // its start year, merging work and education into 2024, 2025, 2024, 2023.
  // Testing `experience` in isolation can't catch a broken comparator in the
  // merge step itself, so this asserts the merged, sorted output directly.
  it('merges and sorts work and education strictly descending by end date', () => {
    const timeline = buildTimeline()

    expect(timeline.map((entry) => entry.title)).toEqual([
      'Web Developer',
      'IT Staff / Web Developer',
      'B.S. in Computer Science',
    ])

    const keys = timeline.map((entry) => entry.sortKey)
    for (let i = 0; i < keys.length - 1; i++) {
      expect(keys[i]).toBeGreaterThan(keys[i + 1])
    }
  })
})
