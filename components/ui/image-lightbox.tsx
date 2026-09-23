'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion, type Transition } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageLightboxProps {
  /** Full-size image source shown in the overlay. */
  src: string
  alt: string
  /** The clickable trigger (e.g. the framed thumbnail). Its image should carry alt="": the button is labelled. */
  children: React.ReactNode
  /** Extra classes for the trigger button. */
  className?: string
  /** id of a visible caption that describes the photo, e.g. a figcaption. */
  describedBy?: string
}

/**
 * Click a thumbnail to view the image full-size in a modal overlay.
 *
 * Focus moves to the Close button on open, stays inside the dialog while it is
 * open (Close is its only control, so Tab stays there), and returns to the
 * trigger on close. Escape, the backdrop and Close all dismiss it.
 *
 * aria-modal alone does not stop a screen reader's browse mode reaching the
 * page behind, so the dialog is portalled to <body> and every other child of
 * <body> is made inert while it is open, then restored.
 */
export function ImageLightbox({ src, alt, children, className, describedBy }: ImageLightboxProps) {
  const [open, setOpen] = useState(false)
  // The portal target, document.body, exists only in the browser.
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const wasOpen = useRef(false)
  const reduce = useReducedMotion()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    // Skip anything already inert, so closing restores only what this opened.
    const made = Array.from(document.body.children).filter(
      (el) => el !== dialogRef.current && !el.hasAttribute('inert'),
    )
    made.forEach((el) => el.setAttribute('inert', ''))
    return () => made.forEach((el) => el.removeAttribute('inert'))
  }, [open])

  useEffect(() => {
    if (open) {
      closeRef.current?.focus()
    } else if (wasOpen.current) {
      triggerRef.current?.focus()
    }
    wasOpen.current = open
  }, [open])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'Tab') {
        e.preventDefault()
        closeRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const transition: Transition = reduce ? { duration: 0 } : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }

  const dialog = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-canvas/95 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded border border-line-strong bg-panel text-ink transition-colors hover:border-accent hover:text-accent"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* alt="" because the dialog is already labelled with the same text. */}
          <motion.img
            key={src}
            src={src}
            alt=""
            initial={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
            transition={transition}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-full rounded-lg border border-line object-contain shadow-2xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View larger image: ${alt}`}
        aria-describedby={describedBy}
        className={cn('group block cursor-zoom-in', className)}
      >
        {children}
      </button>

      {mounted && createPortal(dialog, document.body)}
    </>
  )
}
