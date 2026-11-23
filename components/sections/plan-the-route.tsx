'use client'

import { useState } from 'react'
import { AlertOctagon, ArrowRight, Loader2 } from 'lucide-react'
import { SECTION } from '@/components/ui/grid'
import { SectionHeading } from '@/components/ui/section-heading'
import { SurveyPlate } from '@/components/ui/survey-plate'
import { useToast } from '@/components/ui/toaster'
import { CHAT_OPEN_EVENT } from '@/lib/chat-events'
import { availability, contactInfo, ctaLabels, resumeUrl, sectionContent } from '@/lib/data'
import { cn } from '@/lib/utils'

const FIELD =
  'w-full rounded-sm border border-field-border bg-canvas/70 px-3.5 py-2.5 text-ink placeholder:text-muted focus-visible:border-ink aria-[invalid=true]:border-ink'

const LABEL = 'mb-1.5 block text-sm font-medium text-muted-strong'

// On paper: ink text over a line-strong underline (more than colour, WCAG 1.4.1)
// that turns ink on hover and focus. The offset is the base rule's (a, 0.2em).
const CONTACT_LINK =
  'inline-flex min-h-[44px] items-center text-ink underline decoration-line-strong hover:decoration-ink focus-visible:decoration-ink '

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

/**
 * Plan the route (spec §5): the contact form, last on the homepage. The left
 * leg says how to reach Christian and puts Chunks, the site's assistant, a
 * click away; the right leg is the form on a survey plate. Behaviour is the
 * old contact console's: it posts to /api/contact, announces through a toast,
 * ties a server error to the field it names, and hands off to the visitor's
 * mail app when no mail provider is configured.
 */
export function PlanTheRoute() {
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

  const openChat = () => window.dispatchEvent(new Event(CHAT_OPEN_EVENT))

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
    <section id="contact" aria-labelledby="contact-title" className={cn(SECTION, 'pb-20 pt-24')}>
      <div className="grid gap-8">
        <div className="flex flex-col">
          <SectionHeading id="contact-title" title={sectionContent.contact.title} className="mb-0" />
          <p className="text-lede mt-3 max-w-[34rem] text-muted-strong">{sectionContent.contact.lede}</p>
          <p className="mt-2 text-muted">{availability}</p>
          <ul className="mt-4 flex flex-wrap items-center gap-x-6">
            <li>
              <a href={`mailto:${contactInfo.email}`} className={CONTACT_LINK}>
                {contactInfo.email}
              </a>
            </li>
            <li>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className={CONTACT_LINK}>
                {ctaLabels.downloadResume}
                <span className="sr-only">(PDF, opens in a new tab)</span>
              </a>
            </li>
            {facebook && (
              <li>
                <a href={facebook.url} target="_blank" rel="noopener noreferrer" className={CONTACT_LINK}>
                  {facebook.name}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            )}
            <li className="text-muted">{contactInfo.location}</li>
          </ul>
          <button type="button" aria-haspopup="dialog" onClick={openChat} className="press button-secondary mt-5 self-start">
            {sectionContent.contact.chunks}
          </button>
        </div>

        {/* Sized to the form, not stretched to the left column. */}
        <SurveyPlate className="glass p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className={LABEL}>
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
                <label htmlFor="contact-email" className={LABEL}>
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
              <label htmlFor="contact-message" className={LABEL}>
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
        </SurveyPlate>
      </div>
    </section>
  )
}
