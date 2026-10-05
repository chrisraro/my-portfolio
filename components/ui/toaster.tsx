'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import * as m from 'motion/react-m'
import { LazyMotion, AnimatePresence, useReducedMotion, type Transition } from 'motion/react'
import { loadMotionFeatures } from '@/lib/motion-features'
import { motionTokens } from '@/lib/motion-tokens'
import { X, Check, AlertTriangle, Info, AlertOctagon } from 'lucide-react'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

const isUrgent = (type: Toast['type']) => type === 'error' || type === 'warning'

/** A confirmation stays at least this long (WCAG 2.2.1), and the clock stops while it is hovered or focused. */
const TOAST_MS = 8000
const MIN_TOAST_MS = 6000

// Tokens only, and no green: green means a live system and nothing else. Each
// type has its own glyph shape, so the kind of message is never colour alone.
function ToastIcon({ type }: { type: Toast['type'] }) {
  const cls = 'h-4 w-4 shrink-0'
  switch (type) {
    case 'success':
      return <Check aria-hidden="true" className={`${cls} text-accent`} />
    case 'info':
      return <Info aria-hidden="true" className={`${cls} text-accent`} />
    case 'warning':
      return <AlertTriangle aria-hidden="true" className={`${cls} text-ink`} />
    case 'error':
      return <AlertOctagon aria-hidden="true" className={`${cls} text-ink`} />
  }
}

interface ToastItemProps {
  toast: Toast
  onDismiss: (id: string) => void
  transition: Transition
  reduce: boolean | null
}

/**
 * One toast. A confirmation counts down from max(duration, 6 s); hovering it
 * or moving focus into it (its Dismiss button) stops the clock, and leaving
 * restarts it with the time that was left.
 */
function ToastItem({ toast, onDismiss, transition, reduce }: ToastItemProps) {
  const [paused, setPaused] = useState(false)
  const remaining = useRef(Math.max(toast.duration ?? TOAST_MS, MIN_TOAST_MS))
  const urgent = isUrgent(toast.type)

  useEffect(() => {
    if (urgent || paused) return
    const started = Date.now()
    const timer = window.setTimeout(() => onDismiss(toast.id), remaining.current)
    return () => {
      window.clearTimeout(timer)
      remaining.current -= Date.now() - started
    }
  }, [urgent, paused, onDismiss, toast.id])

  return (
    <m.div
      initial={{ opacity: 0, y: reduce ? 0 : -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={transition}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={`flex max-w-sm items-start gap-3 rounded-lg border bg-panel p-4 shadow-overlay ${
        urgent ? 'border-ink' : 'border-line-strong'
      }`}
    >
      <span className="mt-0.5">
        <ToastIcon type={toast.type} />
      </span>
      <p className="flex-1 text-sm text-ink">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="inline-flex h-6 w-6 items-center justify-center rounded text-muted transition-colors hover:text-ink"
      >
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
    </m.div>
  )
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const reduce = useReducedMotion()

  // Stable, so a toast's countdown is not restarted by an unrelated render.
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  // Errors and warnings stay until dismissed: they carry the recovery (an
  // email address), and a timer would take it away mid-read. Confirmations
  // time out in ToastItem, which pauses while the toast is hovered or focused.
  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 11)
    setToasts((prev) => [...prev, { ...toast, id }])
  }

  const transition: Transition = reduce ? { duration: 0 } : { duration: motionTokens.duration.fast, ease: motionTokens.easing.smooth }

  const renderList = (list: Toast[]) => (
    <AnimatePresence>
      {list.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} transition={transition} reduce={reduce} />
      ))}
    </AnimatePresence>
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/*
        Two regions, both present from first render so assistive technology is
        already watching them: confirmations are polite, errors interrupt.
      */}
      <LazyMotion features={loadMotionFeatures} strict>
        {/* Below the sticky top bar (two rows below md, 64px from md), never over it.
            data-keep-active: the chat's phone-width modal leaves this region live. */}
        <div data-keep-active="" className="fixed right-4 top-28 z-50 space-y-2 md:top-20">
          <div role="alert" className="space-y-2">
            {renderList(toasts.filter((t) => isUrgent(t.type)))}
          </div>
          <div role="status" aria-live="polite" className="space-y-2">
            {renderList(toasts.filter((t) => !isUrgent(t.type)))}
          </div>
        </div>
      </LazyMotion>
    </ToastContext.Provider>
  )
}
