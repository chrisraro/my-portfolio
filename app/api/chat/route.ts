import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'
import { OFFLINE_REPLY, SYSTEM_PROMPT } from '@/lib/chat-context'

// Groq retires models fairly often, and a retired id fails at request time with
// a 404 rather than at build time — so keep this overridable without a code change.
// List what a key can actually reach with:
//   curl https://api.groq.com/openai/v1/models -H "Authorization: Bearer $GROQ_API_KEY"
const MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b'

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GROQ_API_KEY

    // Graceful degradation if no API key
    if (!apiKey) {
      return NextResponse.json({
        response: OFFLINE_REPLY,
        offline: true
      })
    }

    const groq = new Groq({ apiKey })

    // Build conversation messages for Groq (OpenAI-compatible format)
    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ]

    // Add conversation history
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        })
      }
    }

    // Add the current user message
    messages.push({ role: 'user', content: message })

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: MODEL,
      temperature: 0.6,
      max_tokens: 300,
    })

    const response = chatCompletion.choices[0]?.message?.content || 
      "I couldn't generate a response. Please try again!"

    return NextResponse.json({ response })

  } catch (error: unknown) {
    console.error('Chat API error:', error)

    const status = (error as { status?: number }).status
    if (status === 404) {
      console.error(
        `Groq model "${MODEL}" is unavailable to this API key. ` +
        'Set GROQ_MODEL to a model returned by https://api.groq.com/openai/v1/models'
      )
    }
    if (status === 429) {
      return NextResponse.json({
        response: "I'm getting a lot of questions right now! Please try again in a few seconds.",
        error: true
      })
    }
    
    return NextResponse.json({
      response: "I apologize, but I'm having trouble connecting right now. In the meantime, you can explore Christian's portfolio directly. Check out the Work section for his projects, or use the contact form to reach out. He'd love to hear from you!",
      error: true
    })
  }
}
