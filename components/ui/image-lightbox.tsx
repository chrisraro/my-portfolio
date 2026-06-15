'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ImageLightboxProps {
  /** Full-size image source shown in the overlay. */
  src: string
  alt: string
  /** The clickable trigger (e.g. the framed thumbnail). */
  children: React.ReactNode
  /** Extra classes for the trigger button. */
  className?: string
}

/** Click a thumbnail to view the image full-size in a dismissible overlay. */
export function ImageLightbox({ src, alt, children, className = '' }: ImageLightboxProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View larger image: ${alt}`}
        className={`group block cursor-zoom-in ${className}`}
      >
        {children}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={alt}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            <motion.img
              key={src}
              src={src}
              alt={alt}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
