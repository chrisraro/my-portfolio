import type { Metadata } from 'next'
import { Anybody, Figtree } from 'next/font/google'
import './globals.css'
import { JsonLd } from '@/components/json-ld'
import { ThemeProvider } from '@/components/theme-provider'
import { TopBar } from '@/components/top-bar'
import { Footer } from '@/components/footer'
import { ToastProvider } from '@/components/ui/toaster'
import { ChatWidget } from '@/components/ui/chat-widget'
import { SITE_URL, buildSiteMetadata } from '@/lib/site-metadata'
import { graph, personSchema, serviceSchema, websiteSchema } from '@/lib/structured-data'

// Two families (see .impeccable/surfaces/app-page-tsx.md). Anybody is the
// display voice: headings condensed on its width axis, edge codes and numerals
// at normal width with tabular figures. Figtree reads: body, ledes, forms, chat.
// Both are variable; weight comes with the variable file, and Anybody also
// loads its wdth axis.
const anybody = Anybody({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['wdth'],
})

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = buildSiteMetadata(SITE_URL)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${anybody.variable} ${figtree.variable}`}>
      <body>
        <JsonLd data={graph(personSchema(), serviceSchema(), websiteSchema())} />
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <ToastProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:font-display focus:px-4 focus:py-2 focus:text-on-accent"
            >
              Skip to content
            </a>
            <div className="min-h-screen bg-canvas text-ink">
              <TopBar />
              <main id="main">{children}</main>
              <Footer />
              <ChatWidget />
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
