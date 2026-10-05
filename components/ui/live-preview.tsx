'use client'

import { useState, useEffect, useRef, useId, useCallback } from 'react'
import { createPortal, flushSync } from 'react-dom'
import * as m from 'motion/react-m'
import { LazyMotion, AnimatePresence, useReducedMotion, type Transition } from 'motion/react'
import { ExternalLink, Monitor, Smartphone, X } from 'lucide-react'
import { loadMotionFeatures } from '@/lib/motion-features'
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

/** How long the frame gets to fire `load` before the preview is called failed (6 x the crawl duration, 7.2 s). */
const LOAD_TIMEOUT_MS = Math.round(motionTokens.duration.crawl * 6 * 1000)

type LoadState = 'loading' | 'loaded' | 'failed'

const STATUS_TEXT: Record<LoadState, string> = {
  loading: 'Loading preview…',
  loaded: 'Preview loaded',
  failed: "This site can't be previewed here. Open it in a new tab.",
}

// A frame that has not loaded is tabIndex -1 (and hidden): the Tab cycle skips it.
const FOCUSABLE = 'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), iframe:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'

/**
 * Make everything in <body> inert except `keep`: the dialog and any region
 * marked data-keep-active (the toasts). Only a branch that holds a kept
 * element is descended into, so its siblings go inert and it stays live.
 * Anything already inert is skipped, so closing restores only what this made.
 */
function inertAllBut(keep: Element[]): Element[] {
  const made: Element[] = []
  const walk = (parent: Element) => {
    for (const child of Array.from(parent.children)) {
      if (keep.includes(child) || child.hasAttribute('inert')) continue
      if (keep.some((k) => child.contains(k))) {
        walk(child)
      } else {
        child.setAttribute('inert', '')
        made.push(child)
      }
    }
  }
  walk(document.body)
  return made
}

/**
 * A "Live preview" button that opens the real site in a sandboxed iframe.
 *
 * The dialog is portalled to <body>, and the rest of the page is made inert
 * while it is open (aria-modal alone does not stop browse mode), except the
 * toast region, which stays live as it does under the chat's modal. Focus moves to Close on open, Tab cycles inside the dialog,
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
  const [pressed, setPressed] = useState<Device>('desktop')
  const [load, setLoad] = useState<LoadState>('loading')
  // The status region mounts empty with the dialog and is filled a tick
  // later: text present at mount is not announced by every screen reader.
  const [announced, setAnnounced] = useState('')
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const wasOpen = useRef(false)
  const switching = useRef(false)
  const frameRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const titleId = useId()

  useEffect(() => setMounted(true), [])

  // A fresh open starts on desktop with the loading state showing. The reset
  // is batched with the open itself, so a reopen never paints one frame of
  // the previous visit's state (resetting on close would flash during the exit).
  const openPreview = () => {
    setDevice('desktop')
    setPressed('desktop')
    setLoad('loading')
    setOpen(true)
  }

  useEffect(() => {
    if (!open) {
      setAnnounced('')
      return
    }
    const timer = window.setTimeout(() => setAnnounced(STATUS_TEXT[load]), 100)
    return () => window.clearTimeout(timer)
  }, [open, load])

  // A frame that never fires load (blocked, offline) is reported as failed.
  useEffect(() => {
    if (!open || load !== 'loading') return
    const timer = window.setTimeout(() => setLoad('failed'), LOAD_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [open, load, url])

  useEffect(() => {
    if (!open || !dialogRef.current) return
    const keep = [dialogRef.current, ...Array.from(document.querySelectorAll('[data-keep-active]'))]
    const made = inertAllBut(keep)
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
    const previousOverflow = document.body.style.overflow
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
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const handleDevice = useCallback(
    async (next: Device) => {
      const el = frameRef.current
      if (next === device || switching.current || !el) return
      switching.current = true
      setPressed(next)
      try {
        const host = el.parentElement
        const hostStyle = host ? window.getComputedStyle(host) : null
        const padding = hostStyle ? parseFloat(hostStyle.paddingLeft) + parseFloat(hostStyle.paddingRight) : 0
        const available = host ? host.clientWidth - padding : el.offsetWidth
        const target = next === 'mobile' ? Math.min(MOBILE_WIDTH, available) : available
        // The browser's own animation (WAAPI) on transform: no animation
        // engine is loaded for one squeeze, and it runs on the compositor.
        const squeeze =
          !reduce && el.offsetWidth > 0
            ? el.animate([{ transform: 'scaleX(1)' }, { transform: `scaleX(${target / el.offsetWidth})` }], {
                duration: motionTokens.duration.normal * 1000,
                easing: `cubic-bezier(${motionTokens.easing.smooth.join(', ')})`,
                fill: 'forwards',
              })
            : undefined
        if (squeeze) await squeeze.finished
        flushSync(() => setDevice(next))
        squeeze?.cancel()
      } finally {
        switching.current = false
      }
    },
    [device, reduce],
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
    <LazyMotion features={loadMotionFeatures} strict>
      <AnimatePresence mode="wait">
        {open && (
          <m.div
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
            <m.div
              initial={{ opacity: 0, y: rise }}
              animate={{ opacity: 1, y: 0, transition: scrim }}
              exit={{ opacity: 0, y: rise, transition: exit }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-line-strong bg-panel shadow-overlay"
            >
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
                <h2 id={titleId} className="mr-auto text-base font-semibold text-ink">
                  Live preview: {title}
                  {staging && (
                    <span className="ml-3 rounded border border-line-strong px-2 py-0.5 edge-code text-xs font-normal text-muted-strong">
                      Staging site
                    </span>
                  )}
                </h2>

                <div role="group" aria-label="Preview width" className="flex gap-2">
                  <button
                    type="button"
                    aria-pressed={pressed === 'desktop'}
                    onClick={() => handleDevice('desktop')}
                    className={toggleClass(pressed === 'desktop')}
                  >
                    <Monitor className="h-4 w-4" aria-hidden="true" />
                    Desktop
                  </button>
                  <button
                    type="button"
                    aria-pressed={pressed === 'mobile'}
                    onClick={() => handleDevice('mobile')}
                    className={toggleClass(pressed === 'mobile')}
                  >
                    <Smartphone className="h-4 w-4" aria-hidden="true" />
                    Mobile
                  </button>
                </div>

                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex min-h-[44px] items-center gap-2 rounded border px-3 text-sm transition-colors hover:border-accent hover:text-accent',
                    load === 'failed' ? 'border-accent bg-accent font-medium text-on-accent hover:text-on-accent' : 'border-line-strong text-ink',
                  )}
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

              <div className="relative flex min-h-[60vh] flex-1 justify-center bg-canvas p-3">
                <div
                  ref={frameRef}
                  className={cn(
                    'relative h-full overflow-hidden rounded border border-line bg-panel',
                    device === 'mobile' ? 'w-full max-w-[390px]' : 'w-full',
                  )}
                >
                  {load !== 'loaded' && (
                    <p
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-0 flex items-center justify-center px-6 text-center edge-code text-sm',
                        load === 'failed' ? 'text-ink' : 'text-muted',
                      )}
                    >
                      {STATUS_TEXT[load]}
                    </p>
                  )}
                  <iframe
                    src={url}
                    title={`Live preview of ${title}`}
                    sandbox="allow-scripts allow-same-origin allow-popups"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    tabIndex={load === 'loaded' ? undefined : -1}
                    aria-hidden={load === 'loaded' ? undefined : 'true'}
                    onLoad={() => setLoad('loaded')}
                    className={cn('relative h-full w-full bg-panel', load !== 'loaded' && 'opacity-0')}
                  />
                </div>
              </div>
              <p role="status" className="sr-only">
                {announced}
              </p>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  )

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        onClick={openPreview}
        className="inline-flex min-h-[44px] items-center gap-2 rounded border border-line-strong px-5 py-2.5 font-medium text-ink transition-colors hover:border-accent hover:text-accent"
      >
        <Monitor className="h-4 w-4" aria-hidden="true" />
        Live preview<span className="sr-only">{` of ${title}`}</span>
      </button>

      {mounted && createPortal(dialog, document.body)}
    </>
  )
}
