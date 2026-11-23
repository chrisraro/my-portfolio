import { describe, expect, it } from 'vitest'
import { projects } from '@/lib/data'
import { isShipped, numberWord } from '@/lib/proof'

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

describe('isShipped', () => {
  it('is everything but staging and work still in development', () => {
    const statuses = ['live', 'ua-gated', 'auth-gated', 'internal', 'staging', 'in-development'] as const
    expect(statuses.filter((status) => isShipped({ status }))).toEqual(['live', 'ua-gated', 'auth-gated', 'internal'])
  })

  it('counts fifteen of the seventeen projects as shipped', () => {
    expect(projects).toHaveLength(17)
    expect(projects.filter(isShipped)).toHaveLength(15)
    expect(projects.filter((p) => !isShipped(p)).map((p) => p.id).sort()).toEqual(['iskotify', 'lunad'])
  })
})
