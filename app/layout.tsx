import type { Metadata } from 'next'
import { Recursive } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ToastProvider } from '@/components/ui/toaster'
import { ChatWidget } from '@/components/ui/chat-widget'

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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Christian Raro | Software Engineer',
  description: 'Christian Raro - Software Engineer specializing in modern web applications, mobile development, and innovative digital solutions.',
  keywords: ['Christian Raro', 'Software Engineer', 'Web Development', 'Mobile Apps', 'Philippines'],
  authors: [{ name: 'Christian Raro' }],
  creator: 'Christian Raro',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Christian Raro | Software Engineer',
    description: 'Portfolio showcasing innovative web and mobile development projects',
    siteName: 'Christian Raro Portfolio',
    images: [
      {
        url: '/assets/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Christian Raro Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Christian Raro | Software Engineer & Frontend Developer',
    description: 'Portfolio showcasing innovative web and mobile development projects',
    images: ['/assets/images/og-image.png'],
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
