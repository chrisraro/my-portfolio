import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Figtree, Fraunces } from 'next/font/google'
import './globals.css'
import { JsonLd } from '@/components/json-ld'
import { ThemeProvider } from '@/components/theme-provider'
import { TopBar } from '@/components/top-bar'
import { Footer } from '@/components/footer'
import { ToastProvider } from '@/components/ui/toaster'
import { ChatWidget } from '@/components/ui/chat-widget'
import { ViewTransitions } from '@/components/ui/view-transitions'
import { SITE_URL, buildSiteMetadata } from '@/lib/site-metadata'
import { graph, personSchema, serviceSchema, websiteSchema } from '@/lib/structured-data'

// Two families. Fraunces is the display voice: every heading, card name and
// numeral. Figtree reads and labels: body, ledes, forms, chat, eyebrows, edge
// codes, buttons. Both are variable.
//
// The fallbacks are plain system faces (Georgia, Arial), not next/font's
// metric-adjusted local() faces: a local() face is instantiated afresh for
// every weight and size on the page, which cost ~200ms of main thread on the
// first layout (traced).
// The display serif: Fraunces, variable (weight and optical size), from
// Google's latin subset. Georgia stands in until it arrives.
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['opsz'],
  adjustFontFallback: false,
  fallback: ['Georgia', 'serif'],
})

const figtree = Figtree({
  subsets: ['latin'],
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
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${figtree.variable}`}>
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
              <TopBar />
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
