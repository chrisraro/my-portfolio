import type { Metadata } from 'next'
import { heroContent } from '@/lib/data'
import type { Project, ProjectBand } from '@/types'

/** Strips a trailing slash so URLs built by concatenation never double one. */
export function normaliseSiteUrl(url: string): string {
  return url.replace(/\/+$/, '')
}

/** Falls back to this when NEXT_PUBLIC_SITE_URL is unset (CI, local builds). */
export const SITE_URL = normaliseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || 'https://christian-digital-portfolio.vercel.app')

// A page that sets its own openGraph replaces the layout's whole object, so
// these ride along with every one.
const OPEN_GRAPH_BASE = { locale: 'en_US', siteName: heroContent.name }

/** The social card app/opengraph-image.tsx renders, and the route it serves at. */
export const OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: `${heroContent.name} · ${heroContent.title}. ${heroContent.specialism}.`,
}

// Built from heroContent so the page, the chat assistant and every link preview
// state the same positioning. The old hand-typed metadata said "Software
// Engineer & Frontend Developer" long after the page stopped saying it.
// The link-preview image comes from app/opengraph-image.tsx through Next's file
// convention, which fills in openGraph.images and twitter.images itself.
export function buildSiteMetadata(
  siteUrl: string,
  googleVerification: string | undefined = process.env.GOOGLE_SITE_VERIFICATION,
): Metadata {
  const title = `${heroContent.name} · ${heroContent.title}`
  const description = heroContent.lede

  return {
    metadataBase: new URL(siteUrl),
    ...(googleVerification ? { verification: { google: googleVerification } } : {}),
    title,
    description,
    keywords: [
      heroContent.name,
      heroContent.title,
      'WordPress specialist',
      'Next.js',
      'WooCommerce',
      'Naga City',
      'Philippines',
    ],
    authors: [{ name: heroContent.name }],
    creator: heroContent.name,
    openGraph: {
      ...OPEN_GRAPH_BASE,
      type: 'website',
      url: siteUrl,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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

/** /projects gets its own title, naming the band when a filter is applied. */
export function buildProjectsTitle(band: ProjectBand | null): string {
  return band ? `${band} · Projects · ${heroContent.name}` : `Projects · ${heroContent.name}`
}

/**
 * /projects's own metadata: every ?band= filter canonicalises to the
 * unfiltered page, and setting openGraph here (rather than inheriting the
 * layout's) keeps og:url off the homepage. Images are named explicitly
 * because setting openGraph drops the layout's file-convention image.
 */
export function buildProjectsMetadata(band: ProjectBand | null): Metadata {
  const title = buildProjectsTitle(band)
  return {
    title,
    alternates: { canonical: '/projects' },
    openGraph: { ...OPEN_GRAPH_BASE, type: 'website', title, url: '/projects', images: [OG_IMAGE] },
  }
}

/** Each project page is titled for its project. */
export function buildProjectPageTitle(project: Project): string {
  return `${project.title} · ${heroContent.name}`
}

/**
 * A project page's own link preview: an article card with its title and
 * description, and its own canonical URL. `path` is relative; the layout's
 * metadataBase resolves it. Setting openGraph here drops the layout's
 * file-convention image, so the same card (app/opengraph-image.tsx) is named.
 */
export function buildProjectPageMetadata(project: Project, description: string, path: string): Metadata {
  const title = buildProjectPageTitle(project)
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...OPEN_GRAPH_BASE, type: 'article', title, description, url: path, images: [OG_IMAGE] },
    twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE] },
  }
}
