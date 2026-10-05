import { describe, expect, it } from 'vitest'
import {
  galleryImages,
  heroContent,
  paymentGateways,
  projects,
} from '@/lib/data'

describe('hero proof band', () => {
  it('states two proof points: products and shipped projects', () => {
    expect(heroContent.proofPoints).toHaveLength(2)
  })

  // Christian asked for the gateway and NFC labels to come off the hero.
  it('makes no payment-gateway or NFC claim in the hero', () => {
    for (const point of heroContent.proofPoints) expect(point).not.toMatch(/gateway|NFC/i)
  })

  it('claims as many products as the inventory holds', () => {
    const products = projects.filter((p) => p.band === 'Products')
    expect(products).toHaveLength(4)
    expect(heroContent.proofPoints[0]).toBe('Four products of my own')
  })

  it('claims as many shipped projects as the inventory holds', () => {
    const shipped = projects.filter((p) => p.status !== 'staging')
    expect(shipped).toHaveLength(17)
    expect(heroContent.proofPoints[1]).toBe('Seventeen projects shipped')
  })

  it('claims no years-of-experience figure', () => {
    const blob = JSON.stringify(heroContent)
    expect(blob).not.toMatch(/\d+\+?\s*years?/i)
  })
})

// The gateway list is no longer a hero claim, but project pages still print it.
describe('payment gateways', () => {
  it('attaches every listed gateway to a project that used it', () => {
    const onProjects = projects.flatMap((p) => p.technologies)
    for (const gateway of paymentGateways) {
      expect(onProjects, `${gateway} is on no project`).toContain(gateway)
    }
  })
})

describe('gallery', () => {
  it('gives every image a visible caption and a distinct alt', () => {
    for (const image of galleryImages) {
      expect(image.caption.trim()).not.toBe('')
      expect(image.alt.trim()).not.toBe('')
      expect(image.alt).not.toBe(image.caption)
    }
  })
})
