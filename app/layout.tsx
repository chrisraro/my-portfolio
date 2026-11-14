import type { Metadata, Viewport } from 'next'
import { Instrument_Serif, Inter } from 'next/font/google'
import './globals.css'
import { JsonLd } from '@/components/json-ld'
import { SiteFooter } from '@/components/site-footer'
import { SiteNav } from '@/components/site-nav'
import { TabBar } from '@/components/tab-bar'
import { SITE_URL, buildSiteMetadata } from '@/lib/site-metadata'
import { graph, personSchema, serviceSchema, websiteSchema } from '@/lib/structured-data'

// Two typefaces, no more. Instrument Serif speaks: headings, names, numerals.
// Inter works: body, labels, buttons, forms.
const display = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = buildSiteMetadata(SITE_URL)

export const viewport: Viewport = { themeColor: '#f8f8ff' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <JsonLd data={graph(personSchema(), serviceSchema(), websiteSchema())} />
        <a
          href="#main"
          className="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
        >
          Skip to content
        </a>
        <SiteNav />
        <main id="main">{children}</main>
        <SiteFooter />
        <TabBar />
      </body>
    </html>
  )
}
