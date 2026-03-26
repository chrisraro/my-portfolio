'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LinkPreviewProps {
  url: string
  children: React.ReactNode
  className?: string
}

interface PreviewData {
  screenshot: string | null
  loading: boolean
  error: boolean
}

// Cache for storing preview data to avoid re-fetching
const previewCache = new Map<string, PreviewData>()

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

export function LinkPreview({ url, children, className = '' }: LinkPreviewProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState<PreviewData>({
    screenshot: null,
    loading: false,
    error: false,
  })
  const [position, setPosition] = useState<'top' | 'bottom'>('top')
  
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Determine if preview should be shown above or below based on viewport position
  const updatePosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const spaceAbove = rect.top
      const previewHeight = 220 // Approximate height of preview popover
      
      if (spaceAbove < previewHeight + 20) {
        setPosition('bottom')
      } else {
        setPosition('top')
      }
    }
  }, [])

  // Fetch preview data from microlink API
  const fetchPreview = useCallback(async () => {
    // Check cache first
    if (previewCache.has(url)) {
      const cached = previewCache.get(url)!
      setPreviewData(cached)
      return
    }

    // Set loading state
    const loadingState = { screenshot: null, loading: true, error: false }
    setPreviewData(loadingState)

    try {
      const apiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`
      const response = await fetch(apiUrl)
      const data = await response.json()

      if (data.status === 'success' && data.data?.screenshot?.url) {
        const successState = {
          screenshot: data.data.screenshot.url,
          loading: false,
          error: false,
        }
        previewCache.set(url, successState)
        setPreviewData(successState)
      } else {
        const errorState = { screenshot: null, loading: false, error: true }
        previewCache.set(url, errorState)
        setPreviewData(errorState)
      }
    } catch {
      const errorState = { screenshot: null, loading: false, error: true }
      previewCache.set(url, errorState)
      setPreviewData(errorState)
    }
  }, [url])

  // Handle mouse enter with delay
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
    updatePosition()
    
    // Clear any pending leave timeout
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current)
      leaveTimeoutRef.current = null
    }
    
    // Clear any existing hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    // Set a delay before showing preview (300ms)
    hoverTimeoutRef.current = setTimeout(() => {
      setShowPreview(true)
      fetchPreview()
    }, 300)
  }, [updatePosition, fetchPreview])

  // Handle mouse leave with grace period
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    
    // Clear hover timeout if mouse leaves before delay completes
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    
    // Add a small grace period before hiding (150ms)
    // This prevents flickering when mouse moves between trigger and popover
    leaveTimeoutRef.current = setTimeout(() => {
      setShowPreview(false)
    }, 150)
  }, [])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current)
      }
    }
  }, [])

  // Don't show preview for invalid URLs or # links
  const shouldShowPreview = url && url !== '#' && (url.startsWith('http://') || url.startsWith('https://'))

  if (!shouldShowPreview) {
    return <>{children}</>
  }

  const domain = extractDomain(url)

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {showPreview && !previewData.error && (
          <motion.div
            initial={{ opacity: 0, y: position === 'top' ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === 'top' ? 10 : -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute z-50 w-80 bg-background border border-border rounded-lg shadow-lg overflow-hidden pointer-events-none ${
              position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
            } left-1/2 -translate-x-1/2`}
            style={{ maxWidth: '320px' }}
          >
            {/* Screenshot or Loading Skeleton */}
            <div className="relative w-full h-44 bg-muted">
              {previewData.loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full animate-pulse bg-muted">
                    <div className="flex items-center justify-center h-full">
                      <svg
                        className="w-8 h-8 text-muted-foreground/50 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : previewData.screenshot ? (
                <img
                  src={previewData.screenshot}
                  alt={`Preview of ${domain}`}
                  className="w-full h-full object-cover object-top"
                />
              ) : null}
            </div>
            
            {/* Domain name */}
            <div className="px-3 py-2 border-t border-border bg-muted/50">
              <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5">
                <svg
                  className="w-3 h-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                {domain}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
