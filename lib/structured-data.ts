import { contactInfo, heroContent, services, skills } from '@/lib/data'
import { canLinkLive, projectHref } from '@/lib/project-page'
import { OG_IMAGE, SITE_URL } from '@/lib/site-metadata'
import type { CaseStudy, Project } from '@/types'

// JSON-LD for search engines and AI tools, built from the content modules so it
// cannot drift from the page. Privacy: public email and social links only; the
// address is the public locality, never a street, and there is no telephone.

export type JsonLdNode = Record<string, unknown>

export const PERSON_ID = `${SITE_URL}/#person`
export const SERVICE_ID = `${SITE_URL}/#service`
export const WEBSITE_ID = `${SITE_URL}/#website`

const absolute = (path: string) => `${SITE_URL}${path}`

// contactInfo.location reads "Naga City, Camarines Sur, Philippines".
const [locality, region, country] = contactInfo.location.split(', ')

const publicLinks = () => contactInfo.socialLinks.filter((l) => l.url.startsWith('https://')).map((l) => l.url)

// Shared by Person and ProfessionalService so the two addresses can never
// drift apart. Locality only, never a street: privacy constraint.
function localityAddress(): JsonLdNode {
  return { '@type': 'PostalAddress', addressLocality: locality, addressRegion: region, addressCountry: 'PH' }
}

export function personSchema(): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: heroContent.name,
    jobTitle: heroContent.title,
    description: heroContent.lede,
    url: SITE_URL,
    email: contactInfo.email,
    image: absolute(OG_IMAGE.url),
    address: localityAddress(),
    knowsAbout: skills.map((s) => s.name),
    sameAs: publicLinks(),
  }
}

export function serviceSchema(): JsonLdNode {
  return {
    '@type': 'ProfessionalService',
    '@id': SERVICE_ID,
    name: `${heroContent.name}, ${heroContent.title.toLowerCase()}`,
    url: SITE_URL,
    email: contactInfo.email,
    image: absolute(OG_IMAGE.url),
    address: localityAddress(),
    areaServed: [
      { '@type': 'City', name: locality },
      { '@type': 'Country', name: country },
    ],
    founder: { '@id': PERSON_ID },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: services.map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
    },
  }
}

export function websiteSchema(): JsonLdNode {
  return { '@type': 'WebSite', '@id': WEBSITE_ID, url: SITE_URL, name: heroContent.name, publisher: { '@id': PERSON_ID } }
}

export function breadcrumbSchema(project: Project): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: absolute('/projects') },
      { '@type': 'ListItem', position: 3, name: project.title, item: absolute(projectHref(project)) },
    ],
  }
}

export function caseStudySchema(project: Project, study: CaseStudy): JsonLdNode {
  const node: JsonLdNode = {
    '@type': 'CreativeWork',
    '@id': `${absolute(projectHref(project))}#work`,
    name: project.title,
    description: study.brief[0],
    abstract: study.outcome.join(' '),
    keywords: study.stack.map((s) => s.name).join(', '),
    creator: { '@id': PERSON_ID },
    url: absolute(projectHref(project)),
  }
  if (canLinkLive(project)) node.sameAs = project.links.live
  return node
}

export function graph(...nodes: JsonLdNode[]): JsonLdNode {
  return { '@context': 'https://schema.org', '@graph': nodes }
}
