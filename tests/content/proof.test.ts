import { describe, expect, it } from 'vitest'
import { heroContent, projects } from '@/lib/data'
import { numberWord, splitProofPoint } from '@/lib/proof'

describe('splitProofPoint', () => {
  it('turns the leading number word into a plain numeral, not zero-padded', () => {
    expect(splitProofPoint('Fifteen projects shipped')).toEqual({ value: '15', label: 'projects shipped' })
    expect(splitProofPoint('One NFC card system')).toEqual({ value: '1', label: 'NFC card system' })
  })

  it('parses every proof point on the page', () => {
    for (const point of heroContent.proofPoints) {
      expect(splitProofPoint(point).value).toMatch(/^[1-9]\d*$/)
    }
  })

  it('shows numerals that agree with the data', () => {
    const [products, shipped] = heroContent.proofPoints.map((p) => Number(splitProofPoint(p).value))
    expect(products).toBe(projects.filter((p) => p.band === 'Products').length)
    expect(shipped).toBe(projects.filter((p) => p.status !== 'staging').length)
  })

  it('refuses a point that does not start with a number word', () => {
    expect(() => splitProofPoint('Several projects')).toThrow()
  })
})

describe('numberWord', () => {
  it('writes a count as a word, the way copy reads', () => {
    expect(numberWord(4)).toBe('four')
    expect(numberWord(19)).toBe('nineteen')
  })

  it('round-trips with splitProofPoint', () => {
    for (const n of [1, 6, 11, 20]) expect(splitProofPoint(`${numberWord(n)} things`).value).toBe(String(n))
  })

  it('refuses a count it has no word for', () => {
    expect(() => numberWord(0)).toThrow()
    expect(() => numberWord(21)).toThrow()
  })
})
