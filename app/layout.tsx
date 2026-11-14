import type { Metadata } from 'next'
import './globals.css'
import { JsonLd } from '@/components/json-ld'
import { SITE_URL, buildSiteMetadata } from '@/lib/site-metadata'
import { graph, personSchema, serviceSchema, websiteSchema } from '@/lib/structured-data'

// Clean slate: no fonts, theme, header, footer or chat widget yet. The layout
// carries only what is not design: the site metadata and the JSON-LD.
export const metadata: Metadata = buildSiteMetadata(SITE_URL)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={graph(personSchema(), serviceSchema(), websiteSchema())} />
        <main id="main">{children}</main>
      </body>
    </html>
  )
}
