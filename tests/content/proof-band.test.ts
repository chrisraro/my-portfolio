import { describe, expect, it } from 'vitest'
import {
  galleryImages,
  heroContent,
  paymentGateways,
  projects,
} from '@/lib/data'

describe('hero proof band', () => {
  it('states four proof points', () => {
    expect(heroContent.proofPoints).toHaveLength(4)
  })

  it('claims as many products as the inventory holds', () => {
    const products = projects.filter((p) => p.band === 'Products')
    expect(products).toHaveLength(3)
    expect(heroContent.proofPoints[0]).toBe('Three products of my own')
  })

  it('claims as many shipped projects as the inventory holds', () => {
    expect(projects).toHaveLength(15)
    expect(heroContent.proofPoints[1]).toBe('Fifteen projects shipped')
  })

  it('claims as many payment gateways as are actually integrated', () => {
    expect(paymentGateways).toHaveLength(4)
    expect(heroContent.proofPoints[2]).toBe('Four payment gateways')
  })

  // The count above compares two hand-typed values; this is what makes the claim
  // real. Each gateway must appear on a project that actually integrated it.
  it('attaches every claimed gateway to a project that used it', () => {
    const onProjects = projects.flatMap((p) => p.technologies)
    for (const gateway of paymentGateways) {
      expect(onProjects, `${gateway} is on no project`).toContain(gateway)
    }
  })

  it('claims one NFC card system and has the project to back it', () => {
    const nfc = projects.filter((p) => p.technologies.includes('NFC'))
    expect(nfc).toHaveLength(1)
    expect(heroContent.proofPoints[3]).toBe('One NFC card system')
  })

  it('claims no years-of-experience figure', () => {
    const blob = JSON.stringify(heroContent)
    expect(blob).not.toMatch(/\d+\+?\s*years?/i)
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
