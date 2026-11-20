import { FLAGSHIP_SLUGS, getCaseStudy } from '@/lib/case-studies'
import {
  aboutPageContent,
  availability,
  contactInfo,
  heroContent,
  hirePageContent,
  projects,
  projectsPageContent,
  servicePages,
  servicesPageContent,
} from '@/lib/data'
import type { Project, ProjectBand } from '@/types'

// Every page a visitor or a crawler can reach, once. The metadata, the
// link-preview cards (app/og), the JSON-LD, the sitemap, the AI files and the
// chat prompt all read this list, so a page added here reaches all of them.
// Pure (no filesystem), so the edge card route can import it; that is why
// projectHref lives here and lib/project-page.ts only re-exports it.

export type RouteKind = 'home' | 'projects' | 'services' | 'service' | 'about' | 'hire' | 'project'

export interface Crumb {
  name: string
  path: string
}

/** What a route's link-preview card says (app/og/[[...path]]/route.tsx). */
export interface OgCard {
  eyebrow: string
  title: string
  detail: string
}

export interface SiteRoute {
  kind: RouteKind
  path: string
  /** The service or project slug, for the kinds that have one. */
  slug?: string
  /** The <title>: spec §6's table where it has a row. */
  title: string
  /** The meta description: the page's own opening answer or description. */
  description: string
  keywords?: string[]
  card: OgCard
  /** Home first, the page itself last. */
  crumbs: Crumb[]
  /** Sitemap priority: the fork's paths above the inventory, case studies above short pages. */
  priority: number
}

export function projectHref(project: Project): string {
  return `/projects/${project.slug}`
}

/** /projects's title, naming the band when a filter is applied. */
export function buildProjectsTitle(band: ProjectBand | null): string {
  return band ? `${band} · Projects · ${heroContent.name}` : `Projects · ${heroContent.name}`
}

/** Spec §6: {Project} · {summary} · Christian Raro. */
export function buildProjectPageTitle(project: Project): string {
  return `${project.title} · ${project.summary} · ${heroContent.name}`
}

// Breadcrumb names for the two pages with no eyebrow of their own: interface chrome.
const HOME: Crumb = { name: 'Home', path: '/' }
const PROJECTS: Crumb = { name: 'Projects', path: '/projects' }

export function siteRoutes(): SiteRoute[] {
  const services: Crumb = { name: servicesPageContent.eyebrow, path: '/services' }

  const projectRoutes = projects.map((p): SiteRoute => {
    const study = getCaseStudy(p.slug)
    return {
      kind: 'project',
      path: projectHref(p),
      slug: p.slug,
      title: buildProjectPageTitle(p),
      // The summary is a dot-separated fragment; the description reads as a sentence.
      description: study ? study.brief[0] : p.description,
      card: { eyebrow: p.band, title: p.title, detail: p.summary },
      crumbs: [HOME, PROJECTS, { name: p.title, path: projectHref(p) }],
      priority: FLAGSHIP_SLUGS.indexOf(p.slug) === -1 ? 0.5 : 0.7,
    }
  })

  return [
    {
      kind: 'home',
      path: '/',
      title: heroContent.pageTitle,
      description: heroContent.subheadline,
      card: { eyebrow: heroContent.eyebrow, title: heroContent.headline, detail: availability },
      crumbs: [HOME],
      priority: 1,
    },
    {
      kind: 'services',
      path: '/services',
      title: servicesPageContent.title,
      description: servicesPageContent.answer,
      card: {
        eyebrow: servicesPageContent.eyebrow,
        title: servicesPageContent.heading,
        detail: servicePages.map((s) => s.name).join(' · '),
      },
      crumbs: [HOME, services],
      priority: 0.9,
    },
    ...servicePages.map(
      (s): SiteRoute => ({
        kind: 'service',
        path: `/services/${s.slug}`,
        slug: s.slug,
        title: s.title,
        description: s.answer,
        keywords: [s.keyword],
        card: { eyebrow: servicesPageContent.eyebrow, title: s.name, detail: s.summary },
        crumbs: [HOME, services, { name: s.name, path: `/services/${s.slug}` }],
        priority: 0.9,
      }),
    ),
    {
      kind: 'hire',
      path: '/hire',
      title: hirePageContent.title,
      description: hirePageContent.answer,
      keywords: [hirePageContent.keyword],
      card: { eyebrow: hirePageContent.eyebrow, title: hirePageContent.heading, detail: availability },
      crumbs: [HOME, { name: hirePageContent.eyebrow, path: '/hire' }],
      priority: 0.9,
    },
    {
      kind: 'about',
      path: '/about',
      title: aboutPageContent.title,
      description: aboutPageContent.answer,
      keywords: [aboutPageContent.keyword],
      card: { eyebrow: aboutPageContent.eyebrow, title: aboutPageContent.heading, detail: contactInfo.location },
      crumbs: [HOME, { name: aboutPageContent.eyebrow, path: '/about' }],
      priority: 0.8,
    },
    {
      kind: 'projects',
      path: '/projects',
      title: buildProjectsTitle(null),
      description: projectsPageContent.description,
      card: {
        eyebrow: projectsPageContent.eyebrow,
        title: projectsPageContent.title,
        detail: projectsPageContent.description,
      },
      crumbs: [HOME, PROJECTS],
      priority: 0.8,
    },
    ...projectRoutes,
  ]
}

export function findRoute(path: string): SiteRoute | undefined {
  return siteRoutes().find((r) => r.path === path)
}

export function routeFor(path: string): SiteRoute {
  const route = findRoute(path)
  if (!route) throw new Error(`No route at ${path}`)
  return route
}
