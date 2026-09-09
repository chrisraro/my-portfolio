import { describe, expect, it } from 'vitest'
import { OFFLINE_REPLY, SYSTEM_PROMPT, buildPortfolioContext, numberToWords } from '@/lib/chat-context'
import { experience, projects, skills } from '@/lib/data'

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

  it('leaks no private contact details', () => {
    // Phone numbers, street addresses and birthdays were removed from this
    // prompt deliberately and must not return.
    expect(context).not.toMatch(/(?:\+?63|\b0)9[\d\s-]{8,}/)
    expect(context).not.toMatch(/birthday|date of birth/i)
    expect(context).not.toMatch(/\b(barangay|purok|zone \d)\b/i)
  })

  it('carries no PERSONAL section', () => {
    // The removed prose block sat under a PERSONAL heading with Hobbies &
    // Interests. Its shape must not come back even under different wording.
    expect(context).not.toMatch(/\bPERSONAL\b/)
    expect(context).not.toMatch(/\bHobbies\b/i)
    expect(context).not.toMatch(/\bInterests\b/i)
  })

  it('names no third party removed from the prompt for privacy', () => {
    for (const name of REMOVED_THIRD_PARTY_NAMES) {
      expect(context).not.toContain(name)
    }
  })

  it('mentions no abandoned tooling', () => {
    expect(context).not.toMatch(/bubble/i)
    expect(context).not.toMatch(/muramart/i)
  })

  it('claims no years-of-experience figure', () => {
    expect(context).not.toMatch(/\d+\+?\s*years? of experience/i)
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
