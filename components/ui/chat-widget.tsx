'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'

// Types
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

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasShownWelcome, setHasShownWelcome] = useState(false)
  const [showLabel, setShowLabel] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Show the label shortly after mount, then hide it again. Mount-only: the
  // widget always starts closed, so there is nothing to guard against here.
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowLabel(true)
      setHasMounted(true)
    }, 500)

    const hideTimer = setTimeout(() => {
      setShowLabel(false)
    }, 4500)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
    // Show welcome message when chat opens for the first time. Built here so
    // its timestamp is the moment the chat actually opened.
    if (isOpen && !hasShownWelcome) {
      setMessages([
        {
          id: 'welcome',
          text: "Hey! 👋 I'm Chunks, Christian's portfolio assistant. Ask me about his projects, skills, or experience!",
          sender: 'bot',
          timestamp: new Date(),
        },
      ])
      setHasShownWelcome(true)
    }
  }, [isOpen, hasShownWelcome])

  const sendToAPI = async (userMessage: string, messageHistory: Message[]): Promise<string> => {
    try {
      // Filter out the welcome message and prepare history
      const history = messageHistory
        .filter(m => m.id !== 'welcome')
        .map(m => ({ sender: m.sender, text: m.text }))

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
      return "I'm having trouble connecting right now. Feel free to explore the portfolio directly or use the contact form to reach Christian!"
    }
  }

  const handleSend = useCallback(async (overrideText?: string) => {
    const text = overrideText || inputValue.trim()
    if (!text || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    }

    const currentMessages = [...messages, userMessage]
    setMessages(currentMessages)
    setInputValue('')
    setIsTyping(true)

    // Call API
    const response = await sendToAPI(userMessage.text, messages)

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      sender: 'bot',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, botMessage])
    setIsTyping(false)
  }, [inputValue, isTyping, messages])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <>
      {/* Floating Chat Button with Label */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: hasMounted ? 0 : [0, -12, 0, -6, 0] // Bounce only on first mount
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 260, 
              damping: 20,
              y: { duration: 0.6, ease: 'easeOut' }
            }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Slide-in Label */}
            <AnimatePresence>
              {(showLabel || isHovered) && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="cursor-pointer rounded-lg border border-line bg-panel px-4 py-2 shadow-lg"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="whitespace-nowrap font-mono text-xs text-ink">Ask Chunks about my work</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Chat Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex h-14 w-14 items-center justify-center rounded-lg border border-line-strong bg-panel text-accent shadow-lg transition-colors hover:border-accent"
              aria-label="Open chat"
            >
              <MessageCircle className="h-6 w-6" aria-hidden="true" />
              <span
                aria-hidden="true"
                className="live-pulse absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-canvas bg-live"
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] sm:max-w-[380px] h-[520px] max-h-[calc(100vh-3rem)] bg-panel border border-line rounded-lg shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-3">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="live-pulse relative h-2 w-2 rounded-full bg-live" />
                <div>
                  <h3 className="font-mono text-sm text-ink">~/ask chunks</h3>
                  <p className="font-mono text-xs text-muted">AI assistant · answers about my work</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded text-muted transition-colors hover:text-accent"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-canvas scroll-smooth">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index === messages.length - 1 ? 0.1 : 0 
                  }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-4 py-2.5 ${
                        message.sender === 'user'
                          ? 'bg-accent text-on-accent rounded-2xl rounded-br-md'
                          : 'bg-panel text-ink rounded-2xl rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    </div>
                    <span className="text-[10px] text-muted mt-1 px-1">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-start"
                  >
                    <div className="bg-panel px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1.5 items-center">
                        <span className="w-2 h-2 bg-muted/60 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.6s' }} />
                        <span className="w-2 h-2 bg-muted/60 rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '0.6s' }} />
                        <span className="w-2 h-2 bg-muted/60 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '0.6s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestions (shown when no messages or only welcome) */}
            {messages.length <= 1 && !isTyping && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {['Tell me about Christian', 'View projects', 'Skills & tech stack', 'Contact info'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSend(suggestion)}
                      className="text-xs px-3 py-1.5 bg-panel hover:bg-panel/80 text-ink rounded-full transition-colors border border-line/50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 border-t border-line bg-panel">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about projects, skills, experience..."
                  disabled={isTyping}
                  className="flex-1 px-4 py-2.5 bg-panel text-ink rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder:text-muted disabled:opacity-50 transition-all"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isTyping}
                  className="w-10 h-10 rounded-full bg-accent text-on-accent flex items-center justify-center hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-muted text-center mt-2">
                Powered by AI • Portfolio questions only
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
