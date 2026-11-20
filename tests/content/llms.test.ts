import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { caseStudies } from '@/lib/case-studies'
import { aboutPageContent, availability, contactInfo, experience, hirePageContent, projects, servicePages } from '@/lib/data'
import { buildLlmsFullTxt, buildLlmsTxt } from '@/lib/llms'
import { SITE_URL, absoluteUrl } from '@/lib/site-metadata'
import { siteRoutes } from '@/lib/site-routes'
import { privacyIssues } from '@/tests/helpers/privacy'

const count = (text: string, part: string) => text.split(part).length - 1

describe('llms.txt', () => {
  const text = buildLlmsTxt()

  it('follows the llms.txt shape: a title, then a summary line', () => {
    const lines = text.split('\n')
    expect(lines[0]).toBe('# Christian Raro')
    expect(lines.some((l) => l.startsWith('> '))).toBe(true)
  })

  it('opens with the citable answer about Christian as its summary', () => {
    expect(text.split('\n')[2]).toBe(`> ${aboutPageContent.answer}`)
  })

  it('states availability once, after the location, in one voice', () => {
    const line = text.split(String.fromCharCode(10)).find((l) => l.startsWith('Based in'))
    expect(line).toBe(`Based in ${contactInfo.location}. ${availability}.`)
    expect(count(text, availability)).toBe(1)
  })

  it('links every page on the site exactly once, and the full text', () => {
    for (const r of siteRoutes()) expect(count(text, `(${absoluteUrl(r.path)})`), r.path).toBe(1)
    expect(text).toContain(`(${SITE_URL}/llms-full.txt)`)
  })

  it('lists every service page with its summary', () => {
    for (const s of servicePages) expect(text).toContain(`- [${s.name}](${SITE_URL}/services/${s.slug}): ${s.summary}`)
  })
})

describe('llms-full.txt', () => {
  const text = buildLlmsFullTxt()

  it('carries every case study in full', () => {
    for (const s of caseStudies) {
      expect(text).toContain(s.role)
      for (const d of s.decisions) expect(text).toContain(d.over)
      for (const p of s.outcome) expect(text).toContain(p)
    }
  })

  it('carries every service page in full: answer, questions, proof', () => {
    for (const s of servicePages) {
      expect(text).toContain(`Page: ${SITE_URL}/services/${s.slug}`)
      expect(text).toContain(s.answer)
      for (const q of s.sections) {
        expect(text).toContain(`#### ${q.question}`)
        for (const a of q.answer) expect(text).toContain(a)
      }
      for (const id of s.projectIds) expect(text).toContain(projects.find((p) => p.id === id)!.title)
    }
  })

  it('carries /about and /hire', () => {
    expect(text).toContain(`Page: ${SITE_URL}/about`)
    expect(text).toContain(aboutPageContent.answer)
    for (const p of aboutPageContent.story.paragraphs) expect(text).toContain(p)
    expect(text).toContain(`Page: ${SITE_URL}/hire`)
    expect(text).toContain(hirePageContent.answer)
    for (const n of hirePageContent.howIWork.notes) expect(text).toContain(`- ${n.title}: ${n.body}`)
  })

  it('carries every project description', () => {
    for (const p of projects) expect(text).toContain(p.description)
  })

  it('semicolon-joins each role\'s responsibilities, as the chat prompt does', () => {
    for (const e of experience) expect(text).toContain(e.responsibilities.join('; '))
  })
})

describe('both AI files', () => {
  it('carry nothing private and no em-dash', () => {
    for (const text of [buildLlmsTxt(), buildLlmsFullTxt()]) {
      expect(privacyIssues(text)).toEqual([])
      expect(text).not.toContain('—')
    }
  })
})

describe('AI route handlers', () => {
  const ROUTES = [
    ['app/llms.txt/route.ts', '@/app/llms.txt/route', '# Christian Raro'],
    ['app/llms-full.txt/route.ts', '@/app/llms-full.txt/route', '# Christian Raro'],
  ] as const

  it('are force-static and serve text/plain', async () => {
    for (const [sourcePath, modulePath, bodyStart] of ROUTES) {
      expect(readFileSync(sourcePath, 'utf8')).toMatch(/export const dynamic = 'force-static'/)
      const { GET } = await import(modulePath)
      const response: Response = GET()
      expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8')
      expect(await response.text()).toMatch(new RegExp(`^${bodyStart}`))
    }
  })
})
