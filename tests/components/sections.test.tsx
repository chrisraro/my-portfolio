import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { CaseStudies } from '@/components/sections/case-studies'
import { FLAGSHIP_SLUGS, briefLead, getCaseStudy } from '@/lib/case-studies'
import { sectionContent } from '@/lib/data'

// The last Portfolio 4.0 homepage section, retired in S2 Task 11
// (docs/superpowers/plans/2026-11-20-portfolio-v5-s2.md). The new sections are
// tested in tests/components/homepage.test.tsx.

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')

describe('Case studies', () => {
  const html = renderToStaticMarkup(<CaseStudies />)

  it('takes its heading from lib/data.ts', () => {
    expect(html).toContain(`>${sectionContent.caseStudies.eyebrow}<`)
    expect(html).toMatch(new RegExp(`<h2 id="case-studies-title"[^>]*>${sectionContent.caseStudies.title}<`))
  })

  it('shows a cover for every flagship, in reading order, with role and brief', () => {
    let last = -1
    for (const slug of FLAGSHIP_SLUGS) {
      const study = getCaseStudy(slug)!
      const at = html.indexOf(`href="/projects/${slug}"`)
      expect(at, slug).toBeGreaterThan(last)
      last = at
      expect(html).toContain(escape(study.role))
      expect(html).toContain(escape(briefLead(study)))
    }
  })
})
