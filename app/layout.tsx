import type { Metadata } from 'next'
import { Recursive } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ToastProvider } from '@/components/ui/toaster'
import { ChatWidget } from '@/components/ui/chat-widget'
import { buildSiteMetadata } from '@/lib/site-metadata'

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://christian-digital-portfolio.vercel.app'

export const metadata: Metadata = buildSiteMetadata(siteUrl)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={recursive.variable}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <ToastProvider>
            <div className="min-h-screen bg-canvas text-ink">
              <Navigation />
              <main>
                {children}
              </main>
              <Footer />
              <ChatWidget />
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
