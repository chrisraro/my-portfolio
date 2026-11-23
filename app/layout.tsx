import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Instrument_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { SiteLegend } from '@/components/site-legend'
import { Scene } from '@/components/scene'
import { Footer } from '@/components/footer'
import { ToastProvider } from '@/components/ui/toaster'
import { ChatWidget } from '@/components/ui/chat-widget'
import { ViewTransitions } from '@/components/ui/view-transitions'
import { SITE_URL, buildSiteMetadata } from '@/lib/site-metadata'

// One variable family for everything. The fallback is Arial resized to its
// metrics (Next's size-adjusted face), so the swap re-wraps nothing.
const sans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  adjustFontFallback: true,
  fallback: ['Arial', 'sans-serif'],
})

export const metadata: Metadata = buildSiteMetadata(SITE_URL)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={sans.variable}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ToastProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:font-sans focus:px-4 focus:py-2 focus:text-canvas"
            >
              Skip to content
            </a>
            {/* main grows, so on a page shorter than the window (the 404) the footer meets its bottom. */}
            <Scene />
            {/* From 1024px the page sits beside the fixed panel. */}
            <div className="relative flex min-h-screen flex-col text-ink lg:pl-[17.5rem]">
              <SiteLegend />
              <main id="main" className="flex-1">{children}</main>
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
