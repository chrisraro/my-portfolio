import type { Metadata } from 'next'
import { heroContent } from '@/lib/data'
import type { ProjectBand } from '@/types'

/** Falls back to this when NEXT_PUBLIC_SITE_URL is unset (CI, local builds). */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://christian-digital-portfolio.vercel.app'

// Built from heroContent so the page, the chat assistant and every link preview
// state the same positioning. The old hand-typed metadata said "Software
// Engineer & Frontend Developer" long after the page stopped saying it.
// The link-preview image comes from app/opengraph-image.tsx through Next's file
// convention, which fills in openGraph.images and twitter.images itself.
export function buildSiteMetadata(siteUrl: string): Metadata {
  const title = `${heroContent.name} · ${heroContent.title}`
  const description = heroContent.lede

  return {
    metadataBase: new URL(siteUrl),
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
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      title,
      description,
      siteName: heroContent.name,
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
