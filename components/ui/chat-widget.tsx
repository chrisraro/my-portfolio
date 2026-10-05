'use client'

import Link from 'next/link'
import { useState, useRef, useEffect, useCallback } from 'react'
import * as m from 'motion/react-m'
import { LazyMotion, AnimatePresence, useReducedMotion, type Transition } from 'motion/react'
import { loadMotionFeatures } from '@/lib/motion-features'
import { motionTokens } from '@/lib/motion-tokens'
import { MessageCircle, X, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface ChatResponse {
  response: string
  offline?: boolean
  error?: boolean
}

interface Reply {
  text: string
  offline: boolean
}

const WELCOME =
  "I'm Chunks, Christian's portfolio assistant. Ask me about his projects, skills or experience."

// Questions sent as a chat message. "View projects" is a link instead: the
// answer to it is a page, not a sentence.
const SUGGESTIONS = ['Tell me about Christian', 'Skills and tech stack', 'Contact info']

const CHIP =
  'inline-flex min-h-[32px] items-center rounded border border-line-strong px-3 edge-code text-xs text-muted-strong transition-colors hover:border-accent hover:text-accent'

// The status dots are the accent (amber), never green: green means a live system and
// nothing else, and the widget cannot know the assistant is online until a
// reply arrives. Once the API answers `offline: true`, the header says so in
// words (status is never colour alone) and the launcher drops its dot.
const DOT_READY = 'bg-accent'
const DOT_OFFLINE = 'bg-muted'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Make everything outside `el` inert, level by level up to <body>, skipping
 * what is already inert and anything marked data-keep-active (the toasts).
 * Returns what it changed, so the caller restores exactly that.
 */
function inertOutside(el: HTMLElement): Element[] {
  const made: Element[] = []
  for (let node: HTMLElement | null = el; node && node !== document.body; node = node.parentElement) {
    const parent: HTMLElement | null = node.parentElement
    if (!parent) break
    const siblings: Element[] = Array.from(parent.children)
    for (const sibling of siblings) {
      if (sibling === node || sibling.hasAttribute('inert') || sibling.hasAttribute('data-keep-active')) continue
      sibling.setAttribute('inert', '')
      made.push(sibling)
    }
  }
  return made
}

/**
 * From sm up, a non-modal dialog: it sits in a corner and the page stays
 * usable beside it, so there is no focus trap and no aria-modal. Below sm it
 * covers nearly the whole viewport, so there it is modal: the page behind is
 * inert, Tab cycles inside it, and aria-modal says so (WCAG 2.4.11, 2.4.3).
 * Either way focus moves into the input on open and back to the launcher on
 * close, and Escape closes it (WCAG 2.1.1).
 */
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showLabel, setShowLabel] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const [isNarrow, setIsNarrow] = useState(false)
  const isModal = isOpen && isNarrow
  const wasOpen = useRef(false)
  const reduce = useReducedMotion()

  // One short ease-out fade for everything that enters. Nothing springs or
  // bounces: the widget sits beside the page's CTAs and must not outshout them.
  const fade: Transition = reduce ? { duration: 0 } : { duration: motionTokens.duration.fast, ease: motionTokens.easing.smooth }

  // Show the label briefly after mount, on wide screens only: below `sm` it
  // would sit over the page's content with nothing to dismiss it.
  useEffect(() => {
    if (!window.matchMedia('(min-width: 640px)').matches) return
    const showTimer = setTimeout(() => setShowLabel(true), 1200)
    const hideTimer = setTimeout(() => setShowLabel(false), 5200)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  // Phone widths: below sm the open chat is modal.
  useEffect(() => {
    const query = window.matchMedia('(max-width: 639px)')
    const update = () => setIsNarrow(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!isModal || !dialogRef.current) return
    const made = inertOutside(dialogRef.current)
    return () => made.forEach((el) => el.removeAttribute('inert'))
  }, [isModal])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' })
  }, [messages, isTyping, reduce])

  // Focus follows the dialog: into the input on open, back to the launcher on
  // close. The launcher remounts in the same commit that closes the dialog, so
  // its ref is set by the time this effect runs.
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    } else if (wasOpen.current) {
      launcherRef.current?.focus()
    }
    wasOpen.current = isOpen
  }, [isOpen])

  // The welcome message is built on first open, so its timestamp is the moment
  // the chat actually opened.
  useEffect(() => {
    if (!isOpen) return
    setMessages((prev) =>
      prev.length > 0 ? prev : [{ id: 'welcome', text: WELCOME, sender: 'bot', timestamp: new Date() }],
    )
  }, [isOpen])

  const sendToAPI = async (userMessage: string, messageHistory: Message[]): Promise<Reply> => {
    try {
      const history = messageHistory
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ sender: m.sender, text: m.text }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history }),
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data: ChatResponse = await response.json()
      return { text: data.response, offline: data.offline === true }
    } catch (error) {
      console.error('Chat API error:', error)
      return {
        text: "I'm having trouble connecting right now. Explore the portfolio directly, or use the contact form to reach Christian.",
        offline: false,
      }
    }
  }

  const handleSend = useCallback(
    async (overrideText?: string) => {
      const text = overrideText || inputValue.trim()
      if (!text || isTyping) return

      const userMessage: Message = {
        id: Date.now().toString(),
        text,
        sender: 'user',
        timestamp: new Date(),
      }

      setMessages([...messages, userMessage])
      setInputValue('')
      setIsTyping(true)

      const reply = await sendToAPI(userMessage.text, messages)

      setIsOffline(reply.offline)
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: reply.text, sender: 'bot', timestamp: new Date() },
      ])
      setIsTyping(false)
    },
    [inputValue, isTyping, messages],
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleDialogKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      setIsOpen(false)
      return
    }
    // Modal (below sm): Tab and Shift+Tab cycle inside the dialog.
    if (e.key === 'Tab' && isModal && dialogRef.current) {
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <AnimatePresence>
        {!isOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fade}
            className="fixed bottom-4 right-4 z-50 flex items-center gap-3 sm:bottom-6 sm:right-6"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AnimatePresence>
              {(showLabel || isHovered) && (
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fade}
                  aria-hidden="true"
                  className="hidden cursor-pointer rounded-lg border border-line bg-panel px-4 py-2 shadow-overlay sm:block"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="whitespace-nowrap edge-code text-xs text-ink">Ask Chunks about my work</span>
                </m.div>
              )}
            </AnimatePresence>

            <button
              ref={launcherRef}
              type="button"
              onClick={() => setIsOpen(true)}
              aria-haspopup="dialog"
              className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-line-strong bg-panel text-accent shadow-overlay transition-colors hover:border-accent sm:h-14 sm:w-14"
              aria-label="Open chat"
            >
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              {!isOffline && (
                <span
                  aria-hidden="true"
                  className={cn('absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-canvas', DOT_READY)}
                />
              )}
            </button>
          </m.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: reduce ? 0 : motionTokens.distance.sm }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : motionTokens.distance.sm }}
            transition={fade}
            className="fixed bottom-4 right-4 z-50 flex h-[520px] max-h-[calc(100vh-2rem)] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-line bg-panel shadow-overlay sm:bottom-6 sm:right-6 sm:max-h-[calc(100vh-3rem)]"
            ref={dialogRef}
            role="dialog"
            aria-modal={isModal ? 'true' : undefined}
            aria-labelledby="chat-title"
            onKeyDown={handleDialogKeyDown}
          >
            <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-3">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={cn('h-2 w-2 rounded-full', isOffline ? DOT_OFFLINE : DOT_READY)}
                />
                <div>
                  <h3 id="chat-title" className="edge-code text-sm text-ink">~/ask chunks</h3>
                  <p className="edge-code text-xs text-muted">
                    {isOffline ? 'offline · set replies only' : 'AI assistant · answers about my work'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded text-muted transition-colors hover:text-accent"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/*
              role="log" is a polite live region: each reply is announced as it
              arrives, and so is the typing line (WCAG 4.1.3).
            */}
            <div
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              aria-label="Conversation"
              className="flex-1 space-y-4 overflow-y-auto bg-canvas p-4"
            >
              {messages.map((message) => {
                const mine = message.sender === 'user'
                return (
                  <m.div
                    key={message.id}
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={fade}
                    className={mine ? 'flex flex-col items-end' : 'flex flex-col items-start'}
                  >
                    <p className="mb-1 edge-code text-xs text-muted">
                      {mine ? 'you' : 'chunks'} · {formatTime(message.timestamp)}
                    </p>
                    <div
                      className={
                        mine
                          ? 'max-w-[85%] rounded-lg border border-line-strong bg-line px-3 py-2 text-ink'
                          : 'max-w-[85%] rounded-lg border border-line bg-panel px-3 py-2 text-ink'
                      }
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </m.div>
                )
              })}

              {isTyping && (
                <div className="flex items-center gap-2 edge-code text-xs text-muted">
                  <span>chunks is typing</span>
                  <span aria-hidden="true" className="flex items-center gap-1">
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted [animation-delay:200ms]" />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted [animation-delay:400ms]" />
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 1 && !isTyping && (
              <div className="flex flex-wrap gap-2 bg-canvas px-4 pb-3">
                {SUGGESTIONS.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => handleSend(suggestion)} className={CHIP}>
                    {suggestion}
                  </button>
                ))}
                <Link href="/projects" onClick={() => setIsOpen(false)} className={CHIP}>
                  View projects
                </Link>
              </div>
            )}

            <div className="border-t border-line bg-panel p-3">
              <div className="flex items-center gap-2">
                <label htmlFor="chat-input" className="sr-only">
                  Message Chunks
                </label>
                <input
                  id="chat-input"
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about projects, skills, experience"
                  className="min-h-[40px] flex-1 rounded border border-field-border bg-canvas px-3 text-sm text-ink placeholder:text-muted focus-visible:border-accent"
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isTyping}
                  className="inline-flex h-10 w-10 items-center justify-center rounded bg-accent text-on-accent transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-2 text-center edge-code text-xs text-muted">Powered by AI · portfolio questions only</p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  )
}
