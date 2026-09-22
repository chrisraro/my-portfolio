'use client'

import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/toaster'
import { availability, contactInfo, resumeUrl, sectionContent } from '@/lib/data'

const FIELD =
  'w-full rounded border border-line-strong bg-canvas px-3 py-2.5 text-ink placeholder:text-muted focus-visible:border-accent'

export function ContactConsole() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  /**
   * Hand the message off to the visitor's own mail client. Used when the server
   * has no mail provider configured, so the form still reaches a real inbox
   * instead of quietly dropping the message.
   */
  const openMailClient = () => {
    const subject = encodeURIComponent(`Portfolio message from ${formData.name}`)
    const body = encodeURIComponent(`${formData.message}\n\n— ${formData.name} (${formData.email})`)
    window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await response.json()

      if (!response.ok) {
        showToast({
          type: 'error',
          message: result.error || `Something went wrong. Email me at ${contactInfo.email}.`,
        })
        return
      }

      if (result.delivered) {
        setFormData({ name: '', email: '', message: '' })
        showToast({ type: 'success', message: "Message sent — I'll get back to you soon!" })
        return
      }

      // No mail provider configured server-side: fall back to mailto:.
      showToast({ type: 'info', message: 'Opening your email app to send this message...' })
      openMailClient()
    } catch {
      showToast({
        type: 'error',
        message: `Couldn't reach the server. Email me directly at ${contactInfo.email}.`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1fr_1.2fr] md:py-20">
        <div>
          <p className="eyebrow mb-3">{sectionContent.contact.eyebrow}</p>
          <h2 id="contact-title" className="text-fluid-h2 mb-5 text-ink">
            {sectionContent.contact.title}
          </h2>
          <p className="mb-6 inline-flex items-center gap-2 font-mono text-sm text-accent">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            {availability}
          </p>
          <ul className="space-y-2 font-mono text-sm">
            <li>
              <a href={`mailto:${contactInfo.email}`} className="inline-flex min-h-[32px] items-center text-ink hover:text-accent">
                {contactInfo.email}
              </a>
            </li>
            <li>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[32px] items-center text-ink hover:text-accent"
              >
                Download résumé
                <span className="sr-only">(PDF, opens in a new tab)</span>
              </a>
            </li>
            <li className="text-muted">{contactInfo.location}</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-line bg-panel p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="mb-1.5 block font-mono text-xs text-muted-strong">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className={FIELD}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-1.5 block font-mono text-xs text-muted-strong">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={FIELD}
              />
            </div>
          </div>
          <div>
            <label htmlFor="contact-message" className="mb-1.5 block font-mono text-xs text-muted-strong">
              What are you building?
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className={FIELD}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-[44px] items-center gap-2 rounded bg-accent px-5 font-medium text-on-accent transition-colors hover:bg-accent/90 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                Sending
              </>
            ) : (
              <>
                Send message
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
