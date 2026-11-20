import { describe, expect, it } from 'vitest'
import { heroContent, projects } from '@/lib/data'
import { numberWord } from '@/lib/proof'

// Spec §6: the trailhead copy. The own-products count is derived from the
// Products band, never typed by hand.
describe('trailhead copy', () => {
  it('names the role and the base in the eyebrow', () => {
    expect(heroContent.eyebrow).toBe('Full-stack developer · Naga City, Philippines')
  })

  it('sets the headline as three authored lines that read as one sentence', () => {
    expect(heroContent.headlineLines).toEqual(['Built in Bicol.', 'Running across', 'the Philippines.'])
    expect(heroContent.headline).toBe('Built in Bicol. Running across the Philippines.')
  })

  it('derives the own-products count in the subheadline from the Products band', () => {
    const count = projects.filter((p) => p.band === 'Products').length
    expect(heroContent.subheadline).toContain(`and ${numberWord(count)} products of my own.`)
    expect(heroContent.subheadline).toBe(
      'Booking and payment sites for travel businesses, AI automation for teams, and four products of my own. Open to client projects and to full-time remote roles.',
    )
  })

  it('keeps the title that metadata and JSON-LD read until S5', () => {
    expect(heroContent.title).toBe('Mid-level full-stack developer')
  })

  it('uses no em-dash and claims no years of experience', () => {
    for (const text of [heroContent.eyebrow, heroContent.headline, heroContent.subheadline]) {
      expect(text).not.toContain('—')
      expect(text).not.toMatch(/\d+\+?\s*years?/i)
    }
  })
})
