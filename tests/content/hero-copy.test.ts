import { describe, expect, it } from 'vitest'
import { heroContent, projects } from '@/lib/data'

// The intro's copy. There are no products of Christian's own on the site: the
// subheadline names client work and nothing else.
describe('intro copy', () => {
  it('names the role and the base in the eyebrow', () => {
    expect(heroContent.eyebrow).toBe('Full-stack developer · Naga City, Philippines')
  })

  it('sets the headline as three authored lines that read as one sentence', () => {
    expect(heroContent.headlineLines).toEqual(['Built in Bicol.', 'Running across', 'the Philippines.'])
    expect(heroContent.headline).toBe('Built in Bicol. Running across the Philippines.')
  })

  it('names client work and availability, and claims no products of his own', () => {
    expect(heroContent.subheadline).toBe(
      'Booking and payment sites for travel businesses, web apps and AI automation for teams. Open to client projects and to full-time remote roles.',
    )
    expect(projects.some((p) => p.band === ('Products' as string))).toBe(false)
    expect(heroContent.subheadline).not.toMatch(/products? of my own|my own products?/i)
  })

  it('keeps the title the JSON-LD reads as jobTitle', () => {
    expect(heroContent.title).toBe('Mid-level full-stack developer')
  })

  it('uses no em-dash and claims no years of experience', () => {
    for (const text of [heroContent.eyebrow, heroContent.headline, heroContent.subheadline]) {
      expect(text).not.toContain('—')
      expect(text).not.toMatch(/\d+\+?\s*years?/i)
    }
  })
})
