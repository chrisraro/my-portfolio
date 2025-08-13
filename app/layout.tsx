import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Christian Raro | Software Engineer & Frontend Developer',
  description: 'Christian Raro - Software Engineer and Frontend Developer specializing in modern web applications, mobile development, and innovative digital solutions.',
  keywords: ['Christian Raro', 'Software Engineer', 'Frontend Developer', 'Web Development', 'Mobile Apps', 'Philippines'],
  authors: [{ name: 'Christian Raro' }],
  creator: 'Christian Raro',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://chrisraro.github.io',
    title: 'Christian Raro | Software Engineer & Frontend Developer',
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
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navigation />
            <main className="pt-16">
              {children}
            </main>
            <Footer />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
