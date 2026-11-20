import { describe, expect, it } from 'vitest'
import { numberWord } from '@/lib/proof'

describe('numberWord', () => {
  it('writes a count as a word, the way copy reads', () => {
    expect(numberWord(4)).toBe('four')
    expect(numberWord(19)).toBe('nineteen')
  })

  it('refuses a count it has no word for', () => {
    expect(() => numberWord(0)).toThrow()
    expect(() => numberWord(21)).toThrow()
  })
})
