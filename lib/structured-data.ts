import { getCaseStudy } from '@/lib/case-studies'
import {
  aboutPageContent,
  contactInfo,
  education,
  experience,
  heroContent,
  pagesUpdated,
  projects,
  serviceArea,
  servicePages,
  skills,
  socialLinks,
} from '@/lib/data'
import { canLinkLive } from '@/lib/project-page'
import { SITE_URL, absoluteUrl } from '@/lib/site-metadata'
import { projectHref, routeFor, type Crumb, type SiteRoute } from '@/lib/site-routes'
import type { Project, ServicePage } from '@/types'

// JSON-LD for search engines and AI tools (spec §6, entity graph), built from
// the content modules so it cannot drift from the page. Each page renders one
// graph: the Person and the WebSite every reference points at, its
// breadcrumbs (not on the homepage) and its own node, so every @id reference
// resolves inside the page's own graph. One Person @id site-wide.
// Privacy: public email and social links only; the address is the public
// locality, never a street; no telephone. No FAQPage, ratings or reviews.

export type JsonLdNode = Record<string, unknown>

export const PERSON_ID = `${SITE_URL}/#person`
export const WEBSITE_ID = `${SITE_URL}/#website`

/** The node types this site publishes; tests/content/structured-data.test.ts holds every graph to them. */
export const NODE_TYPES = [
  'Person',
  'WebSite',
  'BreadcrumbList',
  'ProfilePage',
  'Service',
  'CreativeWork',
  'SoftwareApplication',
] as const

const ref = (id: string) => ({ '@id': id })

// contactInfo.location reads "Naga City, Camarines Sur, Philippines".
const [locality, region] = contactInfo.location.split(', ')

export function personSchema(): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: heroContent.name,
    jobTitle: heroContent.title,
    description: aboutPageContent.answer,
    url: SITE_URL,
    email: contactInfo.email,
    // The hero portrait, as lib/data.ts says (heroContent.portrait).
    image: absoluteUrl(heroContent.portrait),
    // Locality only, never a street: privacy constraint.
    address: { '@type': 'PostalAddress', addressLocality: locality, addressRegion: region, addressCountry: 'PH' },
    knowsAbout: skills.map((s) => s.name),
    // Current roles: those whose dates run to "Present".
    worksFor: experience.filter((e) => /Present$/.test(e.dates)).map((e) => ({ '@type': 'Organization', name: e.company })),
    alumniOf: education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school })),
    // The profiles socialLinks holds; its mailto entry is the email above.
    sameAs: socialLinks.filter((l) => l.url.startsWith('https://')).map((l) => l.url),
  }
}

export function websiteSchema(): JsonLdNode {
  return { '@type': 'WebSite', '@id': WEBSITE_ID, url: SITE_URL, name: heroContent.name, inLanguage: 'en', publisher: ref(PERSON_ID) }
}

export function breadcrumbSchema(crumbs: Crumb[]): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: absoluteUrl(c.path) })),
  }
}

export function profilePageSchema(): JsonLdNode {
  const about = routeFor('/about')
  const url = absoluteUrl(about.path)
  return {
    '@type': 'ProfilePage',
    '@id': `${url}#page`,
    url,
    name: about.title,
    description: about.description,
    dateModified: pagesUpdated,
    isPartOf: ref(WEBSITE_ID),
    mainEntity: ref(PERSON_ID),
  }
}

export function serviceSchema(service: ServicePage): JsonLdNode {
  const url = absoluteUrl(`/services/${service.slug}`)
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: service.name,
    serviceType: service.name,
    description: service.answer,
    url,
    provider: ref(PERSON_ID),
    // Spec §6: Naga City, Bicol and the Philippines; remote is a channel, not a place.
    areaServed: [
      { '@type': 'City', name: serviceArea.city },
      { '@type': 'AdministrativeArea', name: serviceArea.region },
      { '@type': 'Country', name: serviceArea.country },
    ],
    availableChannel: { '@type': 'ServiceChannel', name: serviceArea.remote, serviceUrl: url },
  }
}

/**
 * The rule: software a visitor opens and uses (the Products and Applications
 * bands) is a SoftwareApplication; a client's site or a custom system is a
 * CreativeWork. No offers, ratings or reviews are claimed, so Google shows no
 * software rich result for these; the nodes name the work and its maker.
 */
export function projectSchemaType(project: Project): 'SoftwareApplication' | 'CreativeWork' {
  return project.band === 'Products' || project.band === 'Applications' ? 'SoftwareApplication' : 'CreativeWork'
}

export function projectSchema(project: Project): JsonLdNode {
  const url = absoluteUrl(projectHref(project))
  const study = getCaseStudy(project.slug)
  const node: JsonLdNode = {
    '@type': projectSchemaType(project),
    '@id': `${url}#work`,
    name: project.title,
    description: study ? study.brief[0] : project.description,
    url,
    creator: ref(PERSON_ID),
    keywords: (study ? study.stack.map((s) => s.name) : project.technologies).join(', '),
  }
  if (study) node.abstract = study.outcome.join(' ')
  if (canLinkLive(project)) node.sameAs = project.links.live
  return node
}

export function graph(...nodes: JsonLdNode[]): JsonLdNode {
  return { '@context': 'https://schema.org', '@graph': nodes }
}

/** One page's whole graph. */
export function routeGraph(route: SiteRoute): JsonLdNode {
  const nodes: JsonLdNode[] = [personSchema(), websiteSchema()]
  if (route.crumbs.length > 1) nodes.push(breadcrumbSchema(route.crumbs))
  if (route.kind === 'about') nodes.push(profilePageSchema())
  if (route.kind === 'services') nodes.push(...servicePages.map((s) => serviceSchema(s)))
  if (route.kind === 'service') nodes.push(serviceSchema(servicePages.find((s) => s.slug === route.slug)!))
  if (route.kind === 'project') nodes.push(projectSchema(projects.find((p) => p.slug === route.slug)!))
  return graph(...nodes)
}

/** The graph for the page at `path`; throws for a path that is not a page. */
export function graphFor(path: string): JsonLdNode {
  return routeGraph(routeFor(path))
}
