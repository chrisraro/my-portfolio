'use client'

import { useState } from 'react'
import { AlertOctagon, ArrowRight, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/toaster'
import { availability, contactInfo, resumeUrl, sectionContent } from '@/lib/data'

const FIELD =
  'w-full rounded border border-field-border bg-canvas px-3 py-2.5 text-ink placeholder:text-muted focus-visible:border-accent aria-[invalid=true]:border-ink'

// On the amber plane: on-accent text only; the drawn underline marks hover.
const CONTACT_LINK = 'inline-flex min-h-[44px] items-center text-on-accent sm:min-h-[32px]'

type Field = 'name' | 'email' | 'message'

interface FormError {
  message: string
  /** The field the server named, when it named one. */
  field?: Field
}

const ERROR_ID = 'contact-error'

/** The API names the offending field in its message ("Please fill in your email."). */
function fieldFromMessage(message: string): Field | undefined {
  const match = message.match(/\b(name|email|message)\b/i)
  return match ? (match[1].toLowerCase() as Field) : undefined
}

export function ContactConsole() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<FormError | null>(null)
  const { showToast } = useToast()
  const facebook = contactInfo.socialLinks.find((link) => link.icon === 'facebook')

  // The toast announces an error; this inline copy stays beside the form and is
  // tied to the field it concerns, so it survives the toast being dismissed.
  const fail = (message: string, field?: Field) => {
    setError({ message, field })
    showToast({ type: 'error', message })
  }

  const fieldProps = (field: Field) => ({
    'aria-invalid': error?.field === field ? true : undefined,
    'aria-describedby': error?.field === field ? ERROR_ID : undefined,
  })

  /**
   * Hand the message off to the visitor's own mail client. Used when the server
   * has no mail provider configured, so the form still reaches a real inbox
   * instead of quietly dropping the message.
   */
  const openMailClient = () => {
    const subject = encodeURIComponent(`Portfolio message from ${formData.name}`)
    const body = encodeURIComponent(`${formData.message}\n\n- ${formData.name} (${formData.email})`)
    window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await response.json()

      if (!response.ok) {
        const message = result.error || `Something went wrong. Email me at ${contactInfo.email}.`
        fail(message, response.status === 400 ? fieldFromMessage(message) : undefined)
        return
      }

      if (result.delivered) {
        setFormData({ name: '', email: '', message: '' })
        showToast({ type: 'success', message: "Message sent. I'll get back to you soon." })
        return
      }

      // No mail provider configured server-side: fall back to mailto:.
      showToast({ type: 'info', message: 'Opening your email app to send this message...' })
      openMailClient()
    } catch {
      fail(`Couldn't reach the server. Email me directly at ${contactInfo.email}.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error?.field === e.target.name) setError(null)
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-6xl px-5 pb-[72px] sm:px-8 md:pb-[112px]">
      {/*
        A business reply card: the amber address side, perforated to the
        paper leaf you fill in. It slides up as it arrives and the perforation
        draws; at rest (reduced motion, no support) it is simply there.
      */}
      <div className="reveal-reply grid md:grid-cols-[5fr_auto_7fr]">
        <div className="on-plane flex flex-col rounded-t bg-accent p-6 text-on-accent sm:p-8 md:rounded-l md:rounded-tr-none lg:p-10">
          <p className="eyebrow mb-3 text-on-accent">{sectionContent.contact.eyebrow}</p>
          <h2 id="contact-title" className="text-fluid-h2">
            {sectionContent.contact.title}
          </h2>
          <p className="edge-code mt-5 text-sm">{availability}</p>
          <ul className="mt-8 space-y-1 md:mt-auto md:pt-10">
            <li>
              <a href={`mailto:${contactInfo.email}`} className={CONTACT_LINK}>
                <span className="link-draw">{contactInfo.email}</span>
              </a>
            </li>
            <li>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className={CONTACT_LINK}>
                <span className="link-draw">Download résumé</span>
                <span className="sr-only">(PDF, opens in a new tab)</span>
              </a>
            </li>
            {facebook && (
              <li>
                <a href={facebook.url} target="_blank" rel="noopener noreferrer" className={CONTACT_LINK}>
                  <span className="link-draw">{facebook.name}</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            )}
            <li className="edge-code pt-2 text-sm">{contactInfo.location}</li>
          </ul>
        </div>

        {/* The perforation: dotted, with a half-circle notch at each end. */}
        <span aria-hidden="true" className="perforation reveal-perf" />

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-b border border-line bg-panel p-6 sm:p-8 md:rounded-r md:rounded-bl-none lg:p-10"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="mb-1.5 block edge-code text-[0.8125rem] text-muted-strong">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                maxLength={100}
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className={FIELD}
                {...fieldProps('name')}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-1.5 block edge-code text-[0.8125rem] text-muted-strong">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={FIELD}
                {...fieldProps('email')}
              />
            </div>
          </div>
          <div>
            <label htmlFor="contact-message" className="mb-1.5 block edge-code text-[0.8125rem] text-muted-strong">
              What are you building?
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              maxLength={5000}
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className={FIELD}
              {...fieldProps('message')}
            />
          </div>
          {error && (
            <p id={ERROR_ID} className="flex items-start gap-2 text-sm text-ink">
              <AlertOctagon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              {error.message}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            aria-describedby={error && !error.field ? ERROR_ID : undefined}
            className="press button-primary disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                Sending
              </>
            ) : (
              <>
                Send message
                <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
