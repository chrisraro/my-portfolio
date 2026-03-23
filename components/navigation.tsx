'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sun, Moon, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function Navigation() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left side: Back arrow (if not home) + Site name */}
          <div className="flex items-center gap-3">
            {!isHomePage && (
              <Link
                href="/"
                className="p-1.5 -ml-1.5 rounded-md text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Back to home"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            )}
            <Link
              href="/"
              className="text-lg font-semibold text-foreground hover:text-foreground/80 transition-colors"
            >
              Christian Raro
            </Link>
          </div>

          {/* Right side: Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-md text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </motion.nav>
  )
}
