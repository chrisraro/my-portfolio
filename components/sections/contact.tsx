'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, ArrowUpRight, Check, Loader2 } from 'lucide-react'
import { availability, contactInfo, resumeUrl, sectionContent } from '@/lib/data'

type State = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'mailto' } | { kind: 'error'; message: string }

const FIELD = 'w-full bg-transparent px-5 py-3.5 text-ink placeholder:text-gray-mid focus:bg-gray-fill focus:outline-none sm:px-6'

/**
 * The way in: on the left, the invitation and the direct lines; on the right,
 * a form built like an iOS grouped list. It posts to /api/contact. When the
 * server has no mail provider it says so honestly and opens the visitor's own
 * mail app with the message filled in.
 */
export function Contact() {
  const [state, setState] = useState<State>({ kind: 'idle' })
  const reduce = useReducedMotion()
  const profiles = contactInfo.socialLinks.filter((link) => link.icon !== 'mail')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    setState({ kind: 'sending' })
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = (await response.json()) as { delivered?: boolean; fallback?: string; error?: string }
      if (!response.ok) {
        setState({ kind: 'error', message: result.error ?? 'Something went wrong. Please email me directly.' })
      } else if (result.delivered) {
        form.reset()
        setState({ kind: 'sent' })
      } else {
        const subject = encodeURIComponent(`Project enquiry from ${data.name}`)
        const body = encodeURIComponent(`${data.message}\n\n${data.name}\n${data.email}`)
        window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`
        setState({ kind: 'mailto' })
      }
    } catch {
      setState({ kind: 'error', message: `The message could not be sent. Please email ${contactInfo.email}.` })
    }
  }

  const sending = state.kind === 'sending'

  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 md:pb-32">
      <div className="reveal grid gap-10 rounded-card bg-ink p-6 text-ghost sm:p-10 md:grid-cols-2 md:gap-14 lg:p-14">
        <div className="flex flex-col">
          <p className="text-[0.8125rem] font-medium text-gray-mid">{sectionContent.contact.eyebrow}</p>
          <h2 id="contact-title" className="display-lg mt-3">
            {sectionContent.contact.title}
          </h2>
          <p className="mt-4 text-gray-mid">{availability}</p>
          <ul className="mt-10 space-y-1 md:mt-auto md:pt-10">
            <li>
              <a href={`mailto:${contactInfo.email}`} className="inline-flex min-h-[44px] items-center md:min-h-[32px]">
                <span className="underline-draw">{contactInfo.email}</span>
              </a>
            </li>
            <li>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center md:min-h-[32px]">
                <span className="underline-draw">Résumé</span>
                <span className="sr-only">(PDF, opens in a new tab)</span>
              </a>
            </li>
            {profiles.map((profile) => (
              <li key={profile.name}>
                <a href={profile.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-1 md:min-h-[32px]">
                  <span className="underline-draw">{profile.name}</span>
                  <ArrowUpRight aria-hidden="true" className="nudge nudge-up h-3.5 w-3.5 text-gray-mid" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li className="pt-2 text-sm text-gray-mid">{contactInfo.location}</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="text-ink">
          <div className="group-list">
            <div>
              <label htmlFor="contact-name" className="sr-only">
                Name
              </label>
              <input id="contact-name" name="name" type="text" required maxLength={100} autoComplete="name" placeholder="Name" className={FIELD} />
            </div>
            <div>
              <label htmlFor="contact-email" className="sr-only">
                Email
              </label>
              <input id="contact-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="Email" className={FIELD} />
            </div>
            <div>
              <label htmlFor="contact-message" className="sr-only">
                What are you building?
              </label>
              <textarea id="contact-message" name="message" required maxLength={5000} rows={6} placeholder="What are you building?" className={`${FIELD} block resize-y`} />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button type="submit" disabled={sending} className="btn bg-ghost text-ink hover:bg-snow">
              {sending ? (
                <>
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                  Sending
                </>
              ) : (
                <>
                  Send message
                  <ArrowRight aria-hidden="true" className="nudge h-4 w-4" />
                </>
              )}
            </button>
            <div role="status" className="min-h-[1.5rem] text-sm text-ghost">
              <AnimatePresence mode="wait">
                {state.kind === 'sent' && (
                  <motion.p
                    key="sent"
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ghost text-ink">
                      <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    Sent. I will reply by email.
                  </motion.p>
                )}
                {state.kind === 'mailto' && (
                  <motion.p key="mailto" initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    Your mail app should now be open with the message ready to send.
                  </motion.p>
                )}
                {state.kind === 'error' && (
                  <motion.p key="error" initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {state.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
