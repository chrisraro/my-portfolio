'use client'

import { useState, useEffect, useRef, useId, useCallback } from 'react'
import { createPortal, flushSync } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion, useAnimate, type Transition } from 'motion/react'
import { ExternalLink, Monitor, Smartphone, X } from 'lucide-react'
import { motionTokens } from '@/lib/motion-tokens'
import { cn } from '@/lib/utils'

interface LivePreviewProps {
  /** The live site to embed. Only pass one that isEmbeddable() approved. */
  url: string
  /** Project name, used in the trigger, dialog title and iframe title. */
  title: string
  /** The embedded site is a staging build. */
  staging?: boolean
}

type Device = 'desktop' | 'mobile'

/** CSS pixel width of the mobile frame (a common phone viewport). */
const MOBILE_WIDTH = 390

const FOCUSABLE = 'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'

/**
 * A "Live preview" button that opens the real site in a sandboxed iframe.
 *
 * The dialog is portalled to <body>, and every other child of <body> is made
 * inert while it is open (aria-modal alone does not stop browse mode), as in
 * ImageLightbox. Focus moves to Close on open, Tab cycles inside the dialog,
 * Escape and Close dismiss it, and focus returns to the trigger.
 *
 * The desktop/mobile toggle squeezes the frame with a scaleX transform, then
 * swaps its width once at the end, so layout runs once rather than per frame.
 * Under reduced motion the width swaps instantly and the dialog only fades.
 */
export function LivePreview({ url, title, staging = false }: LivePreviewProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [device, setDevice] = useState<Device>('desktop')
  const [loaded, setLoaded] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const wasOpen = useRef(false)
  const switching = useRef(false)
  const [frameRef, animate] = useAnimate<HTMLDivElement>()
  const reduce = useReducedMotion()
  const titleId = useId()

  useEffect(() => setMounted(true), [])

  // A fresh open starts on desktop with the loading state showing.
  useEffect(() => {
    if (open) {
      setDevice('desktop')
      setLoaded(false)
    }
  }, [open, url])

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
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
        if (items.length === 0) return
        const first = items[0]
        const last = items[items.length - 1]
        const active = document.activeElement
        const inside = active instanceof Node && dialogRef.current.contains(active)
        if (e.shiftKey && (active === first || !inside)) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && (active === last || !inside)) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const handleDevice = useCallback(
    async (next: Device) => {
      const el = frameRef.current
      if (next === device || switching.current || !el) return
      switching.current = true
      try {
        const available = el.parentElement?.clientWidth ?? el.offsetWidth
        const target = next === 'mobile' ? Math.min(MOBILE_WIDTH, available) : available
        if (!reduce && el.offsetWidth > 0) {
          await animate(
            el,
            { scaleX: target / el.offsetWidth },
            { duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth },
          )
        }
        flushSync(() => setDevice(next))
        await animate(el, { scaleX: 1 }, { duration: 0 })
      } finally {
        switching.current = false
      }
    },
    [animate, device, frameRef, reduce],
  )

  const scrim: Transition = reduce
    ? { duration: motionTokens.duration.fast }
    : { duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }
  const exit: Transition = { duration: motionTokens.duration.fast, ease: motionTokens.easing.smooth }
  const rise = reduce ? 0 : motionTokens.distance.md

  const toggleClass = (active: boolean) =>
    cn(
      'inline-flex min-h-[44px] items-center gap-2 rounded border px-3 text-sm transition-colors',
      active ? 'border-accent text-accent' : 'border-line-strong text-muted-strong hover:border-accent hover:text-accent',
    )

  const dialog = (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          key="live-preview-dialog"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: scrim }}
          exit={{ opacity: 0, transition: exit }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-canvas/90 p-3 sm:p-6"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: rise }}
            animate={{ opacity: 1, y: 0, transition: scrim }}
            exit={{ opacity: 0, y: rise, transition: exit }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-full max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-line-strong bg-panel shadow-2xl"
          >
            <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
              <h2 id={titleId} className="mr-auto text-base font-semibold text-ink">
                Live preview: {title}
                {staging && (
                  <span className="ml-3 rounded border border-line-strong px-2 py-0.5 font-mono text-xs font-normal text-muted-strong">
                    Staging site
                  </span>
                )}
              </h2>

              <div role="group" aria-label="Preview width" className="flex gap-2">
                <button
                  type="button"
                  aria-pressed={device === 'desktop'}
                  onClick={() => handleDevice('desktop')}
                  className={toggleClass(device === 'desktop')}
                >
                  <Monitor className="h-4 w-4" aria-hidden="true" />
                  Desktop
                </button>
                <button
                  type="button"
                  aria-pressed={device === 'mobile'}
                  onClick={() => handleDevice('mobile')}
                  className={toggleClass(device === 'mobile')}
                >
                  <Smartphone className="h-4 w-4" aria-hidden="true" />
                  Mobile
                </button>
              </div>

              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded border border-line-strong px-3 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
              >
                Open site in a new tab
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>

              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="inline-flex h-11 w-11 items-center justify-center rounded border border-line-strong text-ink transition-colors hover:border-accent hover:text-accent"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 justify-center bg-canvas p-3">
              <div
                ref={frameRef}
                className={cn(
                  'relative h-full overflow-hidden rounded border border-line bg-panel',
                  device === 'mobile' ? 'w-full max-w-[390px]' : 'w-full',
                )}
              >
                {!loaded && (
                  <p role="status" className="absolute inset-0 flex items-center justify-center font-mono text-sm text-muted">
                    Loading preview…
                  </p>
                )}
                <iframe
                  src={url}
                  title={`Live preview of ${title}`}
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onLoad={() => setLoaded(true)}
                  className={cn('relative h-full w-full bg-panel', !loaded && 'opacity-0')}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-[44px] items-center gap-2 rounded border border-line-strong px-5 py-2.5 font-medium text-ink transition-colors hover:border-accent hover:text-accent"
      >
        <Monitor className="h-4 w-4" aria-hidden="true" />
        Live preview<span className="sr-only">{` of ${title}`}</span>
      </button>

      {mounted && createPortal(dialog, document.body)}
    </>
  )
}
