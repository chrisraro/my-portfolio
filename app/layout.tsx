import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Figtree } from 'next/font/google'
import localFont from 'next/font/local'
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

// Two families (see .impeccable/surfaces/app-page-tsx.md). Anybody is the
// display voice: headings condensed on its width axis, edge codes and numerals
// at normal width with tabular figures. Figtree reads: body, ledes, forms, chat.
// Both are variable; weight comes with the variable file, and Anybody also
// loads its wdth axis.
//
// The fallback is plain Arial, not next/font's metric-adjusted
// `local("Arial")` face. Until the woff2 files arrive the page is laid out in
// the fallback, and a local() face is instantiated afresh for every weight,
// width and size on the page: on the first layout that cost ~200ms of main
// thread (traced). The adjustment matched ascent and size only, never
// Anybody's condensed width, so it saved little shift for what it cost.
//
// Anybody is self-hosted, instanced to the axis ranges the site uses (wght
// 400-800, wdth 75-100) from Google's latin subset: 38 KB instead of 57 KB for
// the full 100-900 / 50-150 font, on the critical path of every page (R6 perf).
// Regenerate with fontTools:
//   python -m fontTools.varLib.instancer <anybody-latin>.woff2 wght=400:800 wdth=75:100 -o out.ttf
// then save as woff2. Content outside Latin-1 and General Punctuation falls back to Arial.
const anybody = localFont({
  src: './fonts/anybody-latin-wght400-800-wdth75-100.woff2',
  variable: '--font-display',
  display: 'swap',
  weight: '400 800',
  declarations: [{ prop: 'font-stretch', value: '75% 100%' }],
  adjustFontFallback: false,
  fallback: ['Arial', 'sans-serif'],
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
    <html lang="en" suppressHydrationWarning className={`${anybody.variable} ${figtree.variable}`}>
      <body>
        <JsonLd data={graph(personSchema(), serviceSchema(), websiteSchema())} />
        <ThemeProvider attribute="class" defaultTheme="dark">
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
