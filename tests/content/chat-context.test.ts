import { describe, expect, it } from 'vitest'
import { OFFLINE_REPLY, SYSTEM_PROMPT, buildCaseStudyContext, buildPortfolioContext, numberToWords } from '@/lib/chat-context'
import { experience, projects, skills } from '@/lib/data'
import type { CaseStudy } from '@/types'

// Third-party names that appeared in the hand-written prose this task removed
// from a client-facing LLM prompt (a passage naming two people and their
// occupation: "sneaker/buying content creators such as Rami and Frankie from
// Coolkicks"). They must never resurface in the generated context.
const REMOVED_THIRD_PARTY_NAMES = ['Coolkicks', 'Rami', 'Frankie']

describe('chat portfolio context', () => {
  const context = buildPortfolioContext()
  const projectsBlock = context.split('PROJECTS')[1].split('TECHNICAL SKILLS')[0]
  const skillsBlock = context.split('TECHNICAL SKILLS:')[1].split('WORK EXPERIENCE:')[0]
  const experienceBlock = context.split('WORK EXPERIENCE:')[1].split('EDUCATION:')[0]

  it('names every project in the inventory', () => {
    for (const project of projects) {
      expect(context).toContain(project.title)
    }
  })

  it('names no project that is not in the inventory', () => {
    const listedTitles = projectsBlock
      .split('\n')
      .filter((line) => line.startsWith('- '))
      .map((line) => line.slice(2).split(' (')[0])
    // The set comparison alone would still pass if a project were rendered
    // twice — duplicates collapse on both sides of a Set equality check. The
    // length assertion catches that case.
    expect(listedTitles).toHaveLength(projects.length)
    expect(new Set(listedTitles)).toEqual(new Set(projects.map((p) => p.title)))
  })

  it('names every skill in the trimmed list', () => {
    for (const skill of skills) {
      expect(skillsBlock).toContain(skill.name)
    }
  })

  it('names every current role', () => {
    for (const role of experience) {
      expect(experienceBlock).toContain(role.company)
    }
  })

  it('carries no PERSONAL section', () => {
    // The removed prose block sat under a PERSONAL heading with Hobbies &
    // Interests. Its shape must not come back even under different wording.
    expect(context).not.toMatch(/\bPERSONAL\b/)
    expect(context).not.toMatch(/\bHobbies\b/i)
    expect(context).not.toMatch(/\bInterests\b/i)
  })

  it('mentions no abandoned tooling', () => {
    expect(context).not.toMatch(/bubble/i)
    expect(context).not.toMatch(/muramart/i)
  })
})

describe('system prompt', () => {
  it('keeps the rule forbidding private contact details', () => {
    expect(SYSTEM_PROMPT).toMatch(/Never share personal contact details/)
  })

  it('embeds the derived context', () => {
    expect(SYSTEM_PROMPT).toContain('PORTFOLIO DATA:')
    expect(SYSTEM_PROMPT).toContain(projects[0].title)
  })
})

describe('offline reply', () => {
  it('derives its counts from the data rather than hand-typed digits', () => {
    // If a project (or a Products-band project) is added to lib/data.ts,
    // these expectations recompute from the same source and would catch a
    // stale hand-typed count.
    const productCount = projects.filter((p) => p.band === 'Products').length
    const projectCount = projects.length
    expect(OFFLINE_REPLY).toContain(`${numberToWords(productCount)} products of his own`)
    expect(OFFLINE_REPLY).toContain(`${numberToWords(projectCount)} projects shipped`)
  })

  it('renders the counts as words, not digits', () => {
    expect(OFFLINE_REPLY).not.toMatch(/\d/)
  })
})

describe('numberToWords', () => {
  // The offline-reply test above calls numberToWords on both sides of its
  // assertion, so a wrong word table would produce a wrong-but-matching
  // string and still pass. These literal cases pin the actual words.
  it('spells out representative small numbers', () => {
    expect(numberToWords(3)).toBe('three')
    expect(numberToWords(15)).toBe('fifteen')
    expect(numberToWords(21)).toBe('twenty-one')
  })
})

// SYSTEM_PROMPT (shipped to the model) and OFFLINE_REPLY (shipped to visitors
// with no GROQ_API_KEY set) are hand-written strings, not just wrappers around
// buildPortfolioContext() — SYSTEM_PROMPT adds its own rules text and
// OFFLINE_REPLY is entirely separate prose. A guard that only inspected
// buildPortfolioContext() would miss a leak hand-typed into either of them.
describe('privacy and factual guards apply to every shipped string', () => {
  const shippedStrings: Array<[string, string]> = [
    ['buildPortfolioContext()', buildPortfolioContext()],
    ['SYSTEM_PROMPT', SYSTEM_PROMPT],
    ['OFFLINE_REPLY', OFFLINE_REPLY],
  ]

  it.each(shippedStrings)('leaks no private contact details in %s', (_label, text) => {
    // Phone numbers, street addresses and birthdays were removed from this
    // prompt deliberately and must not return.
    expect(text).not.toMatch(/(?:\+?63|\b0)9[\d\s-]{8,}/)
    expect(text).not.toMatch(/birthday|date of birth/i)
    expect(text).not.toMatch(/\b(barangay|purok|zone \d)\b/i)
  })

  it.each(shippedStrings)('names no third party removed from the prompt for privacy in %s', (_label, text) => {
    for (const name of REMOVED_THIRD_PARTY_NAMES) {
      // Word-boundary match, not substring — 'Rami' is a substring of
      // plausible future content such as a recommendation author named
      // "Ramil" or "Ramirez", which has nothing to do with this privacy rule.
      expect(text).not.toMatch(new RegExp(`\\b${name}\\b`))
    }
  })

  it.each(shippedStrings)('claims no years-of-experience figure in %s', (_label, text) => {
    expect(text).not.toMatch(/\d+\+?\s*years? of experience/i)
  })
})

describe('case study context', () => {
  const study: CaseStudy = {
    slug: 'giya',
    role: 'Sole developer',
    brief: ['The brief paragraph.'],
    built: ['What was built.'],
    decisions: [
      { chose: 'A', over: 'B', because: 'reason one' },
      { chose: 'C', over: 'D', because: 'reason two' },
    ],
    stack: [{ name: 'Next.js', why: 'server rendering' }],
    outcome: ['It shipped.'],
    metrics: [{ value: '10+', label: 'partners', clientApproved: true }],
  }

  it('states every section of a case study under its project title', () => {
    const text = buildCaseStudyContext([study])
    for (const s of ['Giya', 'Sole developer', 'The brief paragraph.', 'What was built.', 'A over B. Why: reason one', 'Next.js: server rendering', 'It shipped.', '10+ partners']) {
      expect(text).toContain(s)
    }
  })

  it('says nothing when there are no case studies', () => {
    expect(buildCaseStudyContext([])).toBe('')
  })
})
