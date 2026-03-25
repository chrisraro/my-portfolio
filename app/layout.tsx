import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/toaster'

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Christian Raro | Software Engineer',
  description: 'Christian Raro - Software Engineer specializing in modern web applications, mobile development, and innovative digital solutions.',
  keywords: ['Christian Raro', 'Software Engineer', 'Web Development', 'Mobile Apps', 'Philippines'],
  authors: [{ name: 'Christian Raro' }],
  creator: 'Christian Raro',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://chrisraro.github.io',
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
    <html lang="en" suppressHydrationWarning className={plusJakartaSans.variable}>
      <body className={plusJakartaSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <main>
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
