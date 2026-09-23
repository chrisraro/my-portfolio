import { describe, expect, it } from 'vitest'
import { caseStudies } from '@/lib/case-studies'
import { contactInfo, projects, services } from '@/lib/data'
import { SITE_URL } from '@/lib/site-metadata'
import {
  PERSON_ID,
  SERVICE_ID,
  WEBSITE_ID,
  breadcrumbSchema,
  caseStudySchema,
  graph,
  personSchema,
  serviceSchema,
  websiteSchema,
} from '@/lib/structured-data'
import { hasPhone } from '@/tests/helpers/privacy'

const all = () => {
  const nodes = [personSchema(), serviceSchema(), websiteSchema()]
  for (const p of projects) nodes.push(breadcrumbSchema(p))
  for (const s of caseStudies) nodes.push(caseStudySchema(projects.find((p) => p.slug === s.slug)!, s))
  return nodes
}

describe('structured data', () => {
  it('describes Christian as a Person with public links only', () => {
    const person = personSchema()
    expect(person['@type']).toBe('Person')
    expect(person['@id']).toBe(`${SITE_URL}/#person`)
    expect(person.email).toBe(contactInfo.email)
    const sameAs = person.sameAs as string[]
    expect(sameAs.length).toBeGreaterThan(0)
    for (const url of sameAs) expect(url.startsWith('https://')).toBe(true)
    expect(person.address).toMatchObject({ '@type': 'PostalAddress', addressLocality: 'Naga City', addressCountry: 'PH' })
  })

  it('offers every service, founded by the Person', () => {
    const service = serviceSchema()
    expect(service['@type']).toBe('ProfessionalService')
    expect(service['@id']).toBe(SERVICE_ID)
    expect(service.founder).toEqual({ '@id': PERSON_ID })
    const text = JSON.stringify(service)
    for (const s of services) expect(text).toContain(JSON.stringify(s))
  })

  it('names the site, published by the Person', () => {
    expect(websiteSchema()).toMatchObject({ '@type': 'WebSite', '@id': WEBSITE_ID, url: SITE_URL, publisher: { '@id': PERSON_ID } })
  })

  it('breadcrumbs each project Home, Projects, title', () => {
    const giya = projects.find((p) => p.slug === 'giya')!
    const items = breadcrumbSchema(giya).itemListElement as { position: number; name: string; item: string }[]
    expect(items.map((i) => i.position)).toEqual([1, 2, 3])
    expect(items[2]).toMatchObject({ name: giya.title, item: `${SITE_URL}/projects/giya` })
  })

  it('describes each case study as the Person\'s CreativeWork', () => {
    for (const s of caseStudies) {
      const project = projects.find((p) => p.slug === s.slug)!
      const work = caseStudySchema(project, s)
      expect(work['@type']).toBe('CreativeWork')
      expect(work['@id']).toBe(`${SITE_URL}/projects/${s.slug}#work`)
      expect(work.creator).toEqual({ '@id': PERSON_ID })
      expect(work.description).toBe(s.brief[0])
    }
  })

  it('wraps nodes in one schema.org graph', () => {
    expect(graph(personSchema())).toEqual({ '@context': 'https://schema.org', '@graph': [personSchema()] })
  })

  it('never carries a phone, a street address or a private email', () => {
    for (const node of all()) {
      const text = JSON.stringify(node)
      expect(hasPhone(text)).toBe(false)
      expect(text).not.toMatch(/telephone|streetAddress/)
      for (const email of text.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) ?? []) expect(email).toBe(contactInfo.email)
      expect(text).not.toContain('—')
    }
  })
})
