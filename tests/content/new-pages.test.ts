import { describe, expect, it } from 'vitest'
import { caseStudies, caseStudyText, getCaseStudy } from '@/lib/case-studies'
import {
  aboutPageContent,
  ctaLabels,
  experience,
  hirePageContent,
  paymentGateways,
  projects,
  servicePages,
  servicesPageContent,
  skills,
} from '@/lib/data'
import { isShipped, numberWord } from '@/lib/proof'
import { hasPhone } from '@/tests/helpers/privacy'
import type { ServicePage } from '@/types'

// S4: the copy of /services, its three pages, /about and /hire. Draft copy for
// Christian's review; these checks hold it to the spec and to the data.
const words = (text: string) => text.trim().split(/\s+/).length
const tokens = (text: string) => text.toLowerCase().split(/[^a-z0-9-]+/).filter((w) => w !== '')
const ids = projects.map((p) => p.id)

// Spec §6, citability: each page opens with a self-contained 40-60 word answer.
const ANSWERS: { route: string; answer: string }[] = [
  { route: '/services', answer: servicesPageContent.answer },
  ...servicePages.map((s) => ({ route: `/services/${s.slug}`, answer: s.answer })),
  { route: '/about', answer: aboutPageContent.answer },
  { route: '/hire', answer: hirePageContent.answer },
]

describe('the opening answers', () => {
  it.each(ANSWERS)('$route opens with a 40-60 word answer about Christian in Naga City', ({ answer }) => {
    expect(words(answer)).toBeGreaterThanOrEqual(40)
    expect(words(answer)).toBeLessThanOrEqual(60)
    expect(answer).toMatch(/^Christian Raro is an? /)
    expect(answer).toContain('Naga City')
  })
})

// A keyword's words all appear in the answer, none more than three times.
function answersKeyword(keyword: string, answer: string) {
  const said = tokens(answer)
  for (const word of tokens(keyword).filter((w) => w !== 'and')) {
    const n = said.filter((w) => w === word).length
    expect(n, word).toBeGreaterThanOrEqual(1)
    expect(n, word).toBeLessThanOrEqual(3)
  }
}

// What the site says about a project: its entry, its case study, and the
// work-history lines that name it.
function projectText(id: string): string {
  const p = projects.find((x) => x.id === id)!
  const study = getCaseStudy(p.slug)
  const history = experience.flatMap((e) => e.responsibilities).filter((r) => r.indexOf(p.title) !== -1)
  return [p.title, p.description, ...p.technologies, ...(study ? caseStudyText(study) : []), ...history].join(' ')
}

const SUPPORT: Record<string, RegExp> = {
  'full-stack-development': /Next\.js|React|Node\.js|Supabase/,
  'wordpress-woocommerce': /WordPress|WooCommerce/,
  'ai-automation': /\bAI\b|language model|\bLLM\b|\bMCP\b|n8n/,
}

const prose = (s: ServicePage) => [s.answer, ...s.sections.flatMap((x) => [x.question, ...x.answer])].join(' ')

describe('service pages', () => {
  it('are the three the spec names, titled as its titles table says', () => {
    expect(servicePages.map((s) => [s.slug, s.title])).toEqual([
      ['full-stack-development', 'Full-Stack Web Developer (Next.js, React) · Philippines, remote'],
      ['wordpress-woocommerce', 'WordPress & WooCommerce Developer · PayMongo, Maya, Xendit, PayPal'],
      ['ai-automation', 'AI Automation Engineer · n8n, LLM workflows, MCP'],
    ])
  })

  it('count themselves in the /services answer', () => {
    expect(servicesPageContent.answer).toContain(`offering ${numberWord(servicePages.length)} services`)
  })

  it.each(servicePages)('$slug answers its keyword without stuffing it', (s) => {
    answersKeyword(s.keyword, s.answer)
  })

  it.each(servicePages)('$slug asks at least three questions, each answered', (s) => {
    expect(s.sections.length).toBeGreaterThanOrEqual(3)
    for (const q of s.sections) {
      expect(q.question).toMatch(/\?$/)
      expect(q.answer.length).toBeGreaterThan(0)
    }
  })

  it.each(servicePages)('$slug lists only real projects whose own data supports it', (s) => {
    expect(s.projectIds.length).toBeGreaterThanOrEqual(2)
    expect(new Set(s.projectIds).size).toBe(s.projectIds.length)
    for (const id of s.projectIds) {
      expect(ids, id).toContain(id)
      expect(projectText(id), `${s.slug}: ${id}`).toMatch(SUPPORT[s.slug])
    }
  })

  it.each(servicePages)('$slug proves every project its copy names', (s) => {
    const text = prose(s)
    for (const p of projects) {
      if (text.indexOf(p.title) !== -1) expect(s.projectIds, `${s.slug} names ${p.title}`).toContain(p.id)
    }
  })

  it.each(servicePages)('$slug compares only real projects', (s) => {
    for (const row of s.comparison?.rows ?? []) {
      expect(row.projectIds.length, row.need).toBeGreaterThan(0)
      for (const id of row.projectIds) expect(ids, `${row.need}: ${id}`).toContain(id)
    }
  })

  it('sets every gateway beside the projects that take it', () => {
    const table = servicePages.find((s) => s.slug === 'wordpress-woocommerce')!.comparison!
    expect(table.rows.map((r) => r.need)).toEqual([...paymentGateways])
    for (const row of table.rows) {
      expect(row.choice.trim(), row.need).not.toBe('')
      for (const id of row.projectIds) expect(projects.find((p) => p.id === id)!.technologies).toContain(row.need)
    }
  })
})

// A /services copy string that calls its projects shipped must not prove a
// service with a project still in staging.
describe('shipped claims on /services', () => {
  const served = [
    servicesPageContent.answer,
    servicesPageContent.proof.title,
    ...servicePages.flatMap((s) => [s.title, s.name, s.summary, s.answer, ...s.sections.flatMap((x) => [x.question, ...x.answer])]),
  ]

  it('proves a shipped claim only with projects that are not in staging', () => {
    const claimsShipped = served.some((text) => /\bshipped\b/i.test(text))
    if (!claimsShipped) return
    for (const s of servicePages) {
      for (const id of s.projectIds) {
        const project = projects.find((p) => p.id === id)!
        expect(project.status, `${s.slug}: ${id}`).not.toBe('staging')
      }
    }
  })
})

describe('/about copy', () => {
  it('is titled as the spec says and answers its keyword', () => {
    expect(aboutPageContent.title).toBe('About Christian Raro · Web Developer in Naga City, Bicol')
    answersKeyword(aboutPageContent.keyword, aboutPageContent.answer)
  })

  it('claims no products of his own, and names the work the story points to', () => {
    expect(projects.some((p) => p.band === ('Products' as string))).toBe(false)
    expect(aboutPageContent.answer).not.toMatch(/products? of (his|my) own|his own products/i)
    const story = aboutPageContent.story.paragraphs.join(' ')
    expect(story).not.toMatch(/products? of (his|my) own/i)
    for (const title of ['Naga City Guide', 'Iskotify']) expect(story, title).toContain(title)
  })
})

describe('/hire copy', () => {
  it('is titled as the spec says, its h1 the hire label', () => {
    expect(hirePageContent.title).toBe('Hire a Mid-Level Full-Stack Developer · Remote, Philippines')
    expect(hirePageContent.heading).toBe(ctaLabels.hireForRole)
    answersKeyword(hirePageContent.keyword, hirePageContent.answer)
  })

  it('counts what has shipped from the data', () => {
    const shipped = projects.filter(isShipped).length
    expect(hirePageContent.answer).toContain(`shipped ${numberWord(shipped)} projects`)
    expect(hirePageContent.answer).not.toMatch(/his own products?/i)
    expect(hirePageContent.answer).toContain(`${numberWord(caseStudies.length)} written up as case studies`)
  })

  it('calls core only the skills that run in projects on this site', () => {
    for (const id of hirePageContent.stack.coreIds) {
      const skill = skills.find((s) => s.id === id)
      expect(skill, id).toBeDefined()
      expect(projects.some((p) => p.technologies.indexOf(skill!.name) !== -1), skill!.name).toBe(true)
    }
  })

  it('claims sole development only where every case study says so', () => {
    for (const s of caseStudies) expect(s.role, s.slug).toMatch(/^Sole developer/)
    const note = hirePageContent.howIWork.notes.find((n) => n.body.indexOf('sole developer') !== -1)
    expect(note?.body).toContain(`all ${numberWord(caseStudies.length)} case studies`)
  })

  it('links each AI tool in use to a real project page', () => {
    for (const item of hirePageContent.howIWork.aiInUse) {
      if (item.href) expect(projects.map((p) => `/projects/${p.slug}`), item.label).toContain(item.href)
    }
  })
})

describe('the new copy', () => {
  const copy = [
    servicesPageContent.answer,
    ...servicePages.flatMap((s) => [
      s.title,
      s.name,
      s.summary,
      s.answer,
      ...s.sections.flatMap((x) => [x.question, ...x.answer]),
      ...(s.comparison ? [s.comparison.caption, ...s.comparison.columns, ...s.comparison.rows.flatMap((r) => [r.need, r.choice])] : []),
    ]),
    aboutPageContent.answer,
    ...aboutPageContent.story.paragraphs,
    hirePageContent.answer,
    ...hirePageContent.howIWork.notes.flatMap((n) => [n.title, n.body]),
  ]

  it('carries no phone number, street, em-dash or years-of-experience claim', () => {
    for (const text of copy) {
      expect(hasPhone(text), text).toBe(false)
      expect(text).not.toMatch(/\bStreet\b|\bSt\.\s|\bBarangay\b|\bPurok\b/i)
      expect(text).not.toContain('—')
      expect(text).not.toMatch(/\d+\+?\s*years?/i)
    }
  })

  it('writes apostrophes typographically, so the markup needs no escaping', () => {
    for (const text of copy) expect(text, text).not.toContain("'")
  })
})
