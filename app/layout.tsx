import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Archivo } from 'next/font/google'
import './globals.css'
import { JsonLd } from '@/components/json-ld'
import { ThemeProvider } from '@/components/theme-provider'
import { SiteLegend } from '@/components/site-legend'
import { Footer } from '@/components/footer'
import { ToastProvider } from '@/components/ui/toaster'
import { ChatWidget } from '@/components/ui/chat-widget'
import { ViewTransitions } from '@/components/ui/view-transitions'
import { SITE_URL, buildSiteMetadata } from '@/lib/site-metadata'
import { graph, personSchema, serviceSchema, websiteSchema } from '@/lib/structured-data'

// One variable family on its width axis (spec §3): condensed uppercase for
// display and map labels, normal width for body, forms and chat. The fallback
// is plain Arial: a metric-adjusted local() face cost ~200ms of main thread
// per first layout (traced in Portfolio 4.0).
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-sans',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['Arial', 'sans-serif'],
})

export const metadata: Metadata = buildSiteMetadata(SITE_URL)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={archivo.variable}>
      <body>
        <JsonLd data={graph(personSchema(), serviceSchema(), websiteSchema())} />
        <ThemeProvider attribute="class" defaultTheme="light">
          <ToastProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent-plane focus:font-display focus:px-4 focus:py-2 focus:text-on-accent"
            >
              Skip to content
            </a>
            <div className="min-h-screen bg-canvas text-ink">
              <SiteLegend />
              <main id="main">{children}</main>
              <Footer />
              <ChatWidget />
            </div>
            {/* Catalog view transitions. It reads the query string, so it sits in its
             * own Suspense boundary and the static pages around it stay static. */}
            <Suspense fallback={null}>
              <ViewTransitions />
            </Suspense>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
