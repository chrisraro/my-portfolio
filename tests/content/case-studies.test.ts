import { describe, expect, it } from 'vitest'
import { FLAGSHIP_SLUGS, caseStudies, caseStudyFor, caseStudyText, getCaseStudy } from '@/lib/case-studies'
import { contactInfo, projects } from '@/lib/data'
import { hasPhone } from '@/tests/helpers/privacy'
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
        expect(hasPhone(text)).toBe(false)
        for (const email of text.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) ?? []) expect(email).toBe(contactInfo.email)
        expect(text).not.toContain('—')
      }
    }
  })

  it('catch every phone format and pass years and ranges', () => {
    for (const t of ['(054) 884-5188', '054-884-5188', '884-5188', '+63 917 123 4567', '09171234567']) {
      expect(hasPhone(t), t).toBe(true)
    }
    for (const t of ['Built in 2025', 'May – July 2025', '2019-2025', '1, 3 and 5 day passes', 'Giya 2.0', 'since 1989']) {
      expect(hasPhone(t), t).toBe(false)
    }
  })

  it('keep the El Nido operator count in approved metrics, not in prose', () => {
    const s = getCaseStudy('el-nido-guide-ph')!
    expect(s.metrics).toEqual([{ value: '41', label: 'verified local operators listed on the site', clientApproved: true }])
    for (const p of [...s.brief, ...s.built, ...s.outcome]) expect(p).not.toContain('41')
    expect(s.outcome.join(' ')).toContain('every booking pays the operator directly')
  })

  it('say "partly live" once in the Giya study', () => {
    const text = caseStudyText(getCaseStudy('giya')!).join(' ')
    expect(text.split('partly live')).toHaveLength(2)
  })

  it('find the case study a related project belongs to', () => {
    expect(caseStudyFor('beachbus-nfc-card-system')?.slug).toBe('beachbus-palawan')
    expect(caseStudyFor('latag')).toBeUndefined()
  })

  it('has a case study for every flagship', () => {
    expect(caseStudies.map((s) => s.slug).sort()).toEqual(FLAGSHIP_SLUGS.slice().sort())
  })

  it('looks a case study up by slug', () => {
    expect(getCaseStudy('no-such-project')).toBeUndefined()
    for (const s of caseStudies) expect(getCaseStudy(s.slug)).toBe(s)
  })
})
