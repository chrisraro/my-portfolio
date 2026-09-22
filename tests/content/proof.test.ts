import { describe, expect, it } from 'vitest'
import { heroContent, paymentGateways, projects } from '@/lib/data'
import { splitProofPoint } from '@/lib/proof'

describe('splitProofPoint', () => {
  it('turns the leading number word into a two-digit numeral', () => {
    expect(splitProofPoint('Fifteen projects shipped')).toEqual({ value: '15', label: 'projects shipped' })
    expect(splitProofPoint('One NFC card system')).toEqual({ value: '01', label: 'NFC card system' })
  })

  it('parses every proof point on the page', () => {
    for (const point of heroContent.proofPoints) {
      expect(splitProofPoint(point).value).toMatch(/^\d{2}$/)
    }
  })

  it('shows numerals that agree with the data', () => {
    const [products, shipped, gateways] = heroContent.proofPoints.map((p) => Number(splitProofPoint(p).value))
    expect(products).toBe(projects.filter((p) => p.band === 'Products').length)
    expect(shipped).toBe(projects.length)
    expect(gateways).toBe(paymentGateways.length)
  })

  it('refuses a point that does not start with a number word', () => {
    expect(() => splitProofPoint('Several projects')).toThrow()
  })
})
