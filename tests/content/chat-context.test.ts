import { describe, expect, it } from 'vitest'
import { SYSTEM_PROMPT, buildPortfolioContext } from '@/lib/chat-context'
import { experience, projects, skills } from '@/lib/data'

describe('chat portfolio context', () => {
  const context = buildPortfolioContext()

  it('names every project in the inventory', () => {
    for (const project of projects) {
      expect(context).toContain(project.title)
    }
  })

  it('names no project that is not in the inventory', () => {
    const block = context.split('PROJECTS')[1].split('TECHNICAL SKILLS')[0]
    const listed = block.split('\n').filter((line) => line.startsWith('- '))
    expect(listed).toHaveLength(projects.length)
  })

  it('names every skill in the trimmed list', () => {
    for (const skill of skills) {
      expect(context).toContain(skill.name)
    }
  })

  it('names every current role', () => {
    for (const role of experience) {
      expect(context).toContain(role.company)
    }
  })

  it('leaks no private contact details', () => {
    // Phone numbers, street addresses and birthdays were removed from this
    // prompt deliberately and must not return.
    expect(context).not.toMatch(/\+63|09\d{9}/)
    expect(context).not.toMatch(/birthday|date of birth/i)
    expect(context).not.toMatch(/\b(barangay|purok|zone \d)\b/i)
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
