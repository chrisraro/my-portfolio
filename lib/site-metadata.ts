import type { Metadata } from 'next'
import { heroContent } from '@/lib/data'

// Built from heroContent so the page, the chat assistant and every link preview
// state the same positioning. The old hand-typed metadata said "Software
// Engineer & Frontend Developer" long after the page stopped saying it.
export function buildSiteMetadata(siteUrl: string): Metadata {
  const title = `${heroContent.name} — ${heroContent.title}`
  const description = heroContent.lede
  const image = { url: '/assets/images/og-image.png', width: 1200, height: 630, alt: title }

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
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.url],
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
