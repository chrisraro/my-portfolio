import type { Metadata } from 'next'
import { heroContent } from '@/lib/data'
import { buildProjectsTitle, routeFor, type SiteRoute } from '@/lib/site-routes'
import type { ProjectBand } from '@/types'

/** Strips a trailing slash so URLs built by concatenation never double one. */
export function normaliseSiteUrl(url: string): string {
  return url.replace(/\/+$/, '')
}

/** Falls back to this when NEXT_PUBLIC_SITE_URL is unset (CI, local builds). */
export const SITE_URL = normaliseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || 'https://christian-digital-portfolio.vercel.app')

/** A site path as an absolute URL; the homepage is the bare origin. */
export function absoluteUrl(path: string): string {
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`
}

// A page that sets its own openGraph replaces the layout's whole object, so
// these ride along with every one.
const OPEN_GRAPH_BASE = { locale: 'en_US', siteName: heroContent.name }

export const OG_SIZE = { width: 1200, height: 630 } as const

export interface OgImage {
  url: string
  width: number
  height: number
  alt: string
}

/** A route's link-preview card (app/og/[[...path]]/route.tsx), at the route's own path under /og. */
export function ogImage(path: string): OgImage {
  return { url: path === '/' ? '/og' : `/og${path}`, ...OG_SIZE, alt: routeFor(path).title }
}

// Built from heroContent so the page, the chat assistant and every link preview
// state the same positioning. The old hand-typed metadata said "Software
// Engineer & Frontend Developer" long after the page stopped saying it.
// The link-preview card is app/og's homepage card, named here because there is no file-convention image any more.
export function buildSiteMetadata(
  siteUrl: string,
  googleVerification: string | undefined = process.env.GOOGLE_SITE_VERIFICATION,
): Metadata {
  const home = routeFor('/')
  const image = ogImage('/')

  return {
    metadataBase: new URL(siteUrl),
    ...(googleVerification ? { verification: { google: googleVerification } } : {}),
    title: home.title,
    description: home.metaDescription,
    keywords: [
      heroContent.name,
      heroContent.title,
      'full-stack developer Philippines',
      'Next.js',
      'WordPress',
      'WooCommerce',
      'AI automation',
      'Naga City',
      'Philippines',
    ],
    authors: [{ name: heroContent.name }],
    creator: heroContent.name,
    openGraph: {
      ...OPEN_GRAPH_BASE,
      type: 'website',
      url: siteUrl,
      title: home.title,
      description: home.metaDescription,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: home.title,
      description: home.metaDescription,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

// A page's own link preview: its title and description, its canonical URL and
// og:url (relative; the layout's metadataBase resolves them), and its own card.
// Without this a page inherits the layout's openGraph, whose url is the homepage.
function routeMetadata(route: SiteRoute, title: string): Metadata {
  const image = ogImage(route.path)
  const { metaDescription: description, path } = route
  return {
    title,
    description,
    ...(route.keywords ? { keywords: route.keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      ...OPEN_GRAPH_BASE,
      type: route.kind === 'project' ? 'article' : 'website',
      title,
      description,
      url: path,
      images: [image],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

/** Every page's metadata, from its route in lib/site-routes.ts. */
export function buildRouteMetadata(path: string): Metadata {
  const route = routeFor(path)
  return routeMetadata(route, route.title)
}

/**
 * /projects's metadata: every ?band= filter canonicalises to the unfiltered
 * page and shares its card; the title names the band.
 */
export function buildProjectsMetadata(band: ProjectBand | null): Metadata {
  return routeMetadata(routeFor('/projects'), buildProjectsTitle(band))
}
