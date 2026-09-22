'use client'

import Link from 'next/link'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion, type Transition } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'

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

const WELCOME =
  "I'm Chunks, Christian's portfolio assistant. Ask me about his projects, skills or experience."

// Questions sent as a chat message. "View projects" is a link instead: the
// answer to it is a page, not a sentence.
const SUGGESTIONS = ['Tell me about Christian', 'Skills and tech stack', 'Contact info']

const CHIP =
  'inline-flex min-h-[32px] items-center rounded border border-line-strong px-3 font-mono text-xs text-muted-strong transition-colors hover:border-accent hover:text-accent'

// One short ease-out fade for everything that enters. Nothing springs or
// bounces: the widget sits beside the page's CTAs and must not outshout them.
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

/**
 * A non-modal dialog: the page stays usable behind it, so there is no focus
 * trap and no aria-modal. Focus moves into the input on open and back to the
 * launcher on close, and Escape closes it (WCAG 2.4.3, 2.1.1).
 */
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showLabel, setShowLabel] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)
  const reduce = useReducedMotion()

  const fade: Transition = reduce ? { duration: 0 } : { duration: 0.2, ease: EASE_OUT }

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

  const sendToAPI = async (userMessage: string, messageHistory: Message[]): Promise<string> => {
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
      return data.response
    } catch (error) {
      console.error('Chat API error:', error)
      return "I'm having trouble connecting right now. Explore the portfolio directly, or use the contact form to reach Christian."
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

      const response = await sendToAPI(userMessage.text, messages)

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: response, sender: 'bot', timestamp: new Date() },
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
    }
  }

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fade}
                  aria-hidden="true"
                  className="hidden cursor-pointer rounded-lg border border-line bg-panel px-4 py-2 shadow-lg sm:block"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="whitespace-nowrap font-mono text-xs text-ink">Ask Chunks about my work</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              ref={launcherRef}
              type="button"
              onClick={() => setIsOpen(true)}
              aria-haspopup="dialog"
              className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-line-strong bg-panel text-accent shadow-lg transition-colors hover:border-accent sm:h-14 sm:w-14"
              aria-label="Open chat"
            >
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              <span
                aria-hidden="true"
                className="live-pulse absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-canvas bg-live"
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : 8 }}
            transition={fade}
            className="fixed bottom-4 right-4 z-50 flex h-[520px] max-h-[calc(100vh-2rem)] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-line bg-panel shadow-2xl sm:bottom-6 sm:right-6 sm:max-h-[calc(100vh-3rem)]"
            role="dialog"
            aria-labelledby="chat-title"
            onKeyDown={handleDialogKeyDown}
          >
            <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-3">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="live-pulse relative h-2 w-2 rounded-full bg-live" />
                <div>
                  <h3 id="chat-title" className="font-mono text-sm text-ink">~/ask chunks</h3>
                  <p className="font-mono text-xs text-muted">AI assistant · answers about my work</p>
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
                  <motion.div
                    key={message.id}
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={fade}
                    className={mine ? 'flex flex-col items-end' : 'flex flex-col items-start'}
                  >
                    <p className="mb-1 font-mono text-xs text-muted">
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
                  </motion.div>
                )
              })}

              {isTyping && (
                <div className="flex items-center gap-2 font-mono text-xs text-muted">
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
                  className="min-h-[40px] flex-1 rounded border border-line-strong bg-canvas px-3 text-sm text-ink placeholder:text-muted focus-visible:border-accent"
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
              <p className="mt-2 text-center font-mono text-xs text-muted">Powered by AI · portfolio questions only</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
