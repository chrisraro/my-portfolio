import { NextRequest, NextResponse } from 'next/server'
import { contactInfo } from '@/lib/data'

// Resend's REST API is called directly with fetch — no SDK dependency needed.
const RESEND_ENDPOINT = 'https://api.resend.com/emails'

const LIMITS = { name: 100, email: 254, message: 5000 } as const

type ContactPayload = { name: string; email: string; message: string }

/**
 * Validate and normalize the request body.
 * Returns the trimmed payload, or an error message describing the first problem.
 */
function parseBody(body: unknown): { data: ContactPayload } | { error: string } {
  if (typeof body !== 'object' || body === null) {
    return { error: 'Invalid request body.' }
  }

  const { name, email, message } = body as Record<string, unknown>

  for (const [field, value] of Object.entries({ name, email, message })) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      return { error: `Please fill in your ${field}.` }
    }
    if (value.trim().length > LIMITS[field as keyof typeof LIMITS]) {
      return { error: `Your ${field} is too long.` }
    }
  }

  const trimmedEmail = (email as string).trim()
  // Deliberately permissive: catches obvious typos without rejecting valid
  // addresses that a stricter pattern would refuse.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return { error: 'Please enter a valid email address.' }
  }

  return {
    data: {
      name: (name as string).trim(),
      email: trimmedEmail,
      message: (message as string).trim(),
    },
  }
}

/** Escape user input before interpolating it into the HTML email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = parseBody(body)
  if ('error' in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const { name, email, message } = parsed.data
  const apiKey = process.env.RESEND_API_KEY

  // Graceful degradation, mirroring /api/chat: with no mail provider configured
  // we tell the client to fall back to a mailto: link rather than silently
  // pretending the message was delivered.
  if (!apiKey) {
    return NextResponse.json({ delivered: false, fallback: 'mailto' })
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Portfolio Contact <${process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev'}>`,
        to: [contactInfo.email],
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error('Resend error:', response.status, detail)
      return NextResponse.json(
        { error: "Your message couldn't be sent. Please email me directly." },
        { status: 502 }
      )
    }

    return NextResponse.json({ delivered: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: "Your message couldn't be sent. Please email me directly." },
      { status: 502 }
    )
  }
}
