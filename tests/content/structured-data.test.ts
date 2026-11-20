import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { getCaseStudy } from '@/lib/case-studies'
import { contactInfo, education, projects, servicePages, socialLinks } from '@/lib/data'
import { SITE_URL } from '@/lib/site-metadata'
import { siteRoutes } from '@/lib/site-routes'
import {
  NODE_TYPES,
  PERSON_ID,
  WEBSITE_ID,
  graph,
  graphFor,
  personSchema,
  projectSchema,
  projectSchemaType,
  routeGraph,
  websiteSchema,
  type JsonLdNode,
} from '@/lib/structured-data'
import { danglingRefs, missingFields } from '@/tests/helpers/json-ld'
import { privacyIssues } from '@/tests/helpers/privacy'

type NodeType = (typeof NODE_TYPES)[number]

// What each node needs to say anything useful (spec §6, entity graph).
const REQUIRED: Record<NodeType, readonly string[]> = {
  Person: ['@id', 'name', 'jobTitle', 'url', 'address', 'knowsAbout', 'sameAs'],
  WebSite: ['@id', 'url', 'name', 'publisher'],
  BreadcrumbList: ['itemListElement'],
  ProfilePage: ['@id', 'url', 'name', 'dateModified', 'mainEntity'],
  Service: ['@id', 'name', 'description', 'url', 'provider', 'areaServed'],
  CreativeWork: ['@id', 'name', 'description', 'url', 'creator'],
  SoftwareApplication: ['@id', 'name', 'description', 'url', 'creator'],
}

const nodesOf = (g: JsonLdNode) => g['@graph'] as JsonLdNode[]
const typed = (g: JsonLdNode, type: NodeType) => nodesOf(g).filter((n) => n['@type'] === type)
const routes = siteRoutes()

describe('the graph validators can fail', () => {
  it('find a reference to a node the graph does not hold', () => {
    const broken = graph({ '@type': 'WebSite', '@id': 'a', publisher: { '@id': 'missing' } })
    expect(danglingRefs(broken)).toEqual(['missing'])
  })

  it('find a missing or empty required field', () => {
    expect(missingFields({ '@type': 'Person', name: '', sameAs: [] }, ['name', 'sameAs', 'url'])).toEqual(['name', 'sameAs', 'url'])
  })
})

describe('every page’s graph', () => {
  it.each(routes.map((r) => [r.path, r] as const))('%s: known types, required fields, references that resolve', (_path, route) => {
    const g = routeGraph(route)
    expect(g['@context']).toBe('https://schema.org')
    for (const node of nodesOf(g)) {
      const type = node['@type'] as NodeType
      expect(NODE_TYPES).toContain(type)
      expect(missingFields(node, REQUIRED[type]), `${route.path} ${type}`).toEqual([])
    }
    expect(danglingRefs(g)).toEqual([])
    const ids = nodesOf(g).map((n) => n['@id']).filter(Boolean)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('carries one Person with the one @id, and the WebSite', () => {
    for (const r of routes) {
      const g = routeGraph(r)
      expect(typed(g, 'Person'), r.path).toHaveLength(1)
      expect(typed(g, 'Person')[0]['@id']).toBe(PERSON_ID)
      expect(typed(g, 'WebSite')[0]['@id']).toBe(WEBSITE_ID)
    }
  })

  it('breadcrumbs every page but the homepage, Home first and the page last', () => {
    for (const r of routes) {
      const crumbs = typed(routeGraph(r), 'BreadcrumbList')
      if (r.kind === 'home') {
        expect(crumbs).toHaveLength(0)
        continue
      }
      const items = crumbs[0].itemListElement as { position: number; name: string; item: string }[]
      expect(items.map((i) => i.position)).toEqual(r.crumbs.map((_c, i) => i + 1))
      expect(items[0]).toMatchObject({ name: 'Home', item: SITE_URL })
      expect(items[items.length - 1].item).toBe(`${SITE_URL}${r.path}`)
    }
  })

  it('publishes no FAQPage, rating or review, and nothing private', () => {
    for (const r of routes) {
      const text = JSON.stringify(routeGraph(r))
      expect(text).not.toMatch(/"@type":"(?:FAQPage|AggregateRating|Review)"/)
      expect(privacyIssues(text), r.path).toEqual([])
      expect(text).not.toContain('—')
    }
  })
})

describe('the Person', () => {
  const person = personSchema()

  it('is located by locality only', () => {
    expect(person.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Naga City',
      addressRegion: 'Camarines Sur',
      addressCountry: 'PH',
    })
  })

  it('links only the profiles socialLinks holds, and the public email', () => {
    expect(person.sameAs).toEqual(socialLinks.filter((l) => l.url.startsWith('https://')).map((l) => l.url))
    expect(person.email).toBe(contactInfo.email)
  })

  it('works for Online Creative Solutions and studied at Bicol University, as the data says', () => {
    expect(person.worksFor).toEqual([{ '@type': 'Organization', name: 'Online Creative Solutions' }])
    expect(person.alumniOf).toEqual(education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school })))
    expect(education[0].school).toMatch(/^Bicol University/)
  })

  it('lists the AI and automation tools in knowsAbout', () => {
    const known = person.knowsAbout as string[]
    for (const tool of ['Claude Code', 'Codex', 'Qwen Code', 'n8n', 'Groq / LLM APIs', 'Render']) expect(known).toContain(tool)
  })
})

describe('page nodes', () => {
  it('sets a ProfilePage on /about only, its main entity the Person', () => {
    const [page] = typed(graphFor('/about'), 'ProfilePage')
    expect(page).toMatchObject({ url: `${SITE_URL}/about`, mainEntity: { '@id': PERSON_ID }, isPartOf: { '@id': WEBSITE_ID } })
    for (const r of routes.filter((x) => x.kind !== 'about')) expect(typed(routeGraph(r), 'ProfilePage'), r.path).toHaveLength(0)
  })

  it('sets a Service on each service page, provided by the Person, serving Naga City, Bicol, the Philippines and remote', () => {
    for (const s of servicePages) {
      const [service] = typed(graphFor(`/services/${s.slug}`), 'Service')
      expect(service).toMatchObject({
        '@id': `${SITE_URL}/services/${s.slug}#service`,
        name: s.name,
        description: s.answer,
        provider: { '@id': PERSON_ID },
        availableChannel: { '@type': 'ServiceChannel', name: 'Remote' },
      })
      expect((service.areaServed as { name: string }[]).map((a) => a.name)).toEqual(['Naga City', 'Bicol', 'Philippines'])
    }
    expect(typed(graphFor('/services'), 'Service')).toHaveLength(servicePages.length)
  })

  it('types software a visitor runs as SoftwareApplication, and sites and custom systems as CreativeWork', () => {
    for (const p of projects) {
      const expected = p.band === 'Products' || p.band === 'Applications' ? 'SoftwareApplication' : 'CreativeWork'
      expect(projectSchemaType(p), p.slug).toBe(expected)
      const [node] = typed(graphFor(`/projects/${p.slug}`), expected)
      expect(node).toMatchObject({ '@id': `${SITE_URL}/projects/${p.slug}#work`, name: p.title, creator: { '@id': PERSON_ID } })
      expect(node.description).toBe(getCaseStudy(p.slug)?.brief[0] ?? p.description)
    }
  })

  it('links a project live only when it can (canLinkLive)', () => {
    const giya = projects.find((p) => p.slug === 'giya')!
    expect(projectSchema(giya).sameAs).toBe(giya.links.live)
    expect(projectSchema({ ...giya, status: 'internal', links: {} }).sameAs).toBeUndefined()
  })

  it('names the site, published by the Person', () => {
    expect(websiteSchema()).toMatchObject({ '@type': 'WebSite', '@id': WEBSITE_ID, url: SITE_URL, publisher: { '@id': PERSON_ID } })
  })
})

describe('wiring', () => {
  const PAGES: Record<string, string> = {
    'app/page.tsx': "graphFor('/')",
    'app/projects/page.tsx': "graphFor('/projects')",
    'app/projects/[slug]/page.tsx': 'graphFor(projectHref(project))',
    'app/services/page.tsx': "graphFor('/services')",
    'app/services/[slug]/page.tsx': 'graphFor(`/services/${service.slug}`)',
    'app/about/page.tsx': "graphFor('/about')",
    'app/hire/page.tsx': "graphFor('/hire')",
  }

  it.each(Object.entries(PAGES))('%s renders its own graph', (file, call) => {
    expect(readFileSync(file, 'utf8')).toContain(`<JsonLd data={${call}} />`)
  })

  it('leaves the layout without a graph, so no page carries two', () => {
    expect(readFileSync('app/layout.tsx', 'utf8')).not.toMatch(/JsonLd|structured-data/)
  })
})
