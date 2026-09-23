import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { caseStudies } from '@/lib/case-studies'
import { contactInfo, experience, projects, services } from '@/lib/data'
import { buildLlmsFullTxt, buildLlmsTxt } from '@/lib/llms'
import { SITE_URL } from '@/lib/site-metadata'
import { hasPhone } from '@/tests/helpers/privacy'

const count = (text: string, part: string) => text.split(part).length - 1

describe('llms.txt', () => {
  const text = buildLlmsTxt()

  it('follows the llms.txt shape: a title, then a summary line', () => {
    const lines = text.split('\n')
    expect(lines[0]).toBe('# Christian Raro')
    expect(lines.some((l) => l.startsWith('> '))).toBe(true)
  })

  it('links every project page exactly once, and the full text', () => {
    for (const p of projects) expect(count(text, `(${SITE_URL}/projects/${p.slug})`)).toBe(1)
    expect(text).toContain(`(${SITE_URL}/llms-full.txt)`)
  })

  it('lists every service', () => {
    for (const s of services) expect(text).toContain(`- ${s}`)
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

  it('carries every project description', () => {
    for (const p of projects) expect(text).toContain(p.description)
  })

  it('semicolon-joins each role\'s responsibilities, as the chat prompt does', () => {
    for (const e of experience) expect(text).toContain(e.responsibilities.join('; '))
  })
})

describe('both AI files', () => {
  it('carry no phone, no private email and no em-dash', () => {
    for (const text of [buildLlmsTxt(), buildLlmsFullTxt()]) {
      expect(hasPhone(text)).toBe(false)
      for (const email of text.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) ?? []) expect(email).toBe(contactInfo.email)
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
