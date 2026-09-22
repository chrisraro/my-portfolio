'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { motion, AnimatePresence, useReducedMotion, type Transition } from 'framer-motion'
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

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const reduce = useReducedMotion()

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 11)
    setToasts((prev) => [...prev, { ...toast, id }])

    // Errors and warnings stay until dismissed: they carry the recovery (an
    // email address), and a timer would take it away mid-read.
    if (!isUrgent(toast.type)) {
      setTimeout(() => removeToast(id), toast.duration || 5000)
    }
  }

  const transition: Transition = reduce ? { duration: 0 } : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }

  const renderList = (list: Toast[]) => (
    <AnimatePresence>
      {list.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: reduce ? 0 : -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={transition}
          className={`flex max-w-sm items-start gap-3 rounded-lg border bg-panel p-4 shadow-lg ${
            isUrgent(toast.type) ? 'border-ink' : 'border-line-strong'
          }`}
        >
          <span className="mt-0.5">
            <ToastIcon type={toast.type} />
          </span>
          <p className="flex-1 text-sm text-ink">{toast.message}</p>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
            className="inline-flex h-6 w-6 items-center justify-center rounded text-muted transition-colors hover:text-ink"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </motion.div>
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
      <div className="fixed right-4 top-4 z-50 space-y-2">
        <div role="alert" className="space-y-2">
          {renderList(toasts.filter((t) => isUrgent(t.type)))}
        </div>
        <div role="status" aria-live="polite" className="space-y-2">
          {renderList(toasts.filter((t) => !isUrgent(t.type)))}
        </div>
      </div>
    </ToastContext.Provider>
  )
}
