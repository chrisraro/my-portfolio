import { describe, expect, it } from 'vitest'
import { buildPortfolioContext } from '@/lib/chat-context'
import {
  galleryImages,
  heroContent,
  paymentGateways,
  projects,
} from '@/lib/data'
import { elevationFigures } from '@/lib/elevation'

// heroContent.proofPoints was retired in S5: the elevation strip's figures,
// counted from the data, are the proof, and the chat prompt reads them too.
describe('proof figures', () => {
  it('count the shipped projects the inventory holds, not staging and not in development', () => {
    const [shipped] = elevationFigures()
    expect(shipped.value).toBe(projects.filter((p) => p.status !== 'staging' && p.status !== 'in-development').length)
    expect(shipped.value).toBe(15)
  })

  it('reach the chat assistant as the same figures', () => {
    const context = buildPortfolioContext()
    for (const f of elevationFigures()) expect(context).toContain(`${f.value} ${f.label}`)
  })

  it('leave no hand-typed proof or lede on heroContent', () => {
    expect('proofPoints' in heroContent).toBe(false)
    expect('lede' in heroContent).toBe(false)
  })

  it('claim no years-of-experience figure', () => {
    expect(JSON.stringify(heroContent)).not.toMatch(/\d+\+?\s*years?/i)
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
