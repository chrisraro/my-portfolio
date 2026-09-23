import { describe, expect, it } from 'vitest'
import { FLAGSHIP_SLUGS, caseStudies, caseStudyText, getCaseStudy } from '@/lib/case-studies'
import { contactInfo, projects } from '@/lib/data'
import type { CaseStudyMetric } from '@/types'

const slugs = projects.map((p) => p.slug)

// Compile-time guard, checked by `npm run type-check`: a metric the client has
// not approved cannot be written down at all.
// @ts-expect-error clientApproved must be the literal `true`
const unapproved: CaseStudyMetric = { value: '1', label: 'x', clientApproved: false }
void unapproved

describe('case studies', () => {
  it('names five flagships, each a real project', () => {
    expect(FLAGSHIP_SLUGS).toHaveLength(5)
    for (const slug of FLAGSHIP_SLUGS) expect(slugs).toContain(slug)
  })

  it('exist only for flagships, once each', () => {
    const seen: string[] = []
    for (const study of caseStudies) {
      expect(FLAGSHIP_SLUGS).toContain(study.slug)
      expect(seen).not.toContain(study.slug)
      seen.push(study.slug)
    }
  })

  it('fill every body section', () => {
    for (const s of caseStudies) {
      expect(s.role.trim()).not.toBe('')
      for (const section of [s.brief, s.built, s.outcome]) {
        expect(section.length).toBeGreaterThan(0)
        for (const p of section) expect(p.trim()).not.toBe('')
      }
      expect(s.stack.length).toBeGreaterThan(0)
    }
  })

  it('record two to four decisions, each with its alternative and reason', () => {
    for (const s of caseStudies) {
      expect(s.decisions.length).toBeGreaterThanOrEqual(2)
      expect(s.decisions.length).toBeLessThanOrEqual(4)
      for (const d of s.decisions) for (const v of [d.chose, d.over, d.because]) expect(v.trim()).not.toBe('')
    }
  })

  it('publish only client-approved numbers', () => {
    for (const s of caseStudies) for (const m of s.metrics ?? []) expect(m.clientApproved).toBe(true)
  })

  it('link related work only to real projects', () => {
    for (const s of caseStudies) for (const r of s.related ?? []) expect(slugs).toContain(r)
  })

  it('contain no phone number, no private email and no em-dash', () => {
    for (const s of caseStudies) {
      for (const text of caseStudyText(s)) {
        expect(text).not.toMatch(/\+?\d[\d\s-]{8,}\d/)
        for (const email of text.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) ?? []) expect(email).toBe(contactInfo.email)
        expect(text).not.toContain('—')
      }
    }
  })

  it('looks a case study up by slug', () => {
    expect(getCaseStudy('no-such-project')).toBeUndefined()
    for (const s of caseStudies) expect(getCaseStudy(s.slug)).toBe(s)
  })
})
