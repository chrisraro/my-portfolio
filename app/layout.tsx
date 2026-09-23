import type { Metadata } from 'next'
import { Recursive } from 'next/font/google'
import './globals.css'
import { JsonLd } from '@/components/json-ld'
import { ThemeProvider } from '@/components/theme-provider'
import { TopBar } from '@/components/top-bar'
import { Footer } from '@/components/footer'
import { ToastProvider } from '@/components/ui/toaster'
import { ChatWidget } from '@/components/ui/chat-widget'
import { SITE_URL, buildSiteMetadata } from '@/lib/site-metadata'
import { graph, personSchema, serviceSchema, websiteSchema } from '@/lib/structured-data'

// One variable family for both voices. Its MONO axis turns the same face
// monospaced for labels, numerals and domains — `.font-mono` and `.eyebrow`
// set it in globals.css. Loading only the MONO axis (weight is included by
// default for variable fonts) keeps the file small.
const recursive = Recursive({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  axes: ['MONO'],
})

export const metadata: Metadata = buildSiteMetadata(SITE_URL)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={recursive.variable}>
      <body>
        <JsonLd data={graph(personSchema(), serviceSchema(), websiteSchema())} />
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <ToastProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
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
