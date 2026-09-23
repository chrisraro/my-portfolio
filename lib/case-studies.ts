import type { CaseStudy } from '@/types'

// The five projects with a full case study, in reading order: the "next case
// study" link follows it. Every other project gets a short page built from
// lib/data.ts alone. Spec: docs/superpowers/specs/2026-09-23-case-studies-design.md
export const FLAGSHIP_SLUGS: readonly string[] = [
  'el-nido-guide-ph',
  'beachbus-palawan',
  'acad1-review-center',
  'aman-group-web-app',
  'giya',
]

// Entries are added as Christian answers each research dossier's questions.
// Nothing here is drafted from memory: see the dossiers in
// docs/case-studies/research/ (gitignored, may hold client numbers).
export const caseStudies: CaseStudy[] = []

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((s) => s.slug === slug)
}

/** Every string a visitor can read on the case study, for copy checks. */
export function caseStudyText(s: CaseStudy): string[] {
  return [
    s.role,
    ...s.brief,
    ...s.built,
    ...s.decisions.map((d) => `${d.chose} ${d.over} ${d.because}`),
    ...s.stack.map((i) => `${i.name} ${i.why}`),
    ...s.outcome,
    ...(s.metrics ?? []).map((m) => `${m.value} ${m.label}`),
  ]
}
