import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { LivePreview } from '@/components/ui/live-preview'

// The dialog mounts in a portal after hydration, so static markup shows only
// the trigger. Source guards pin the dialog behaviour a static render cannot reach.

describe('LivePreview markup', () => {
  const html = renderToStaticMarkup(<LivePreview url="https://latag.ph" title="Latag" />)

  it('renders only the trigger on the server', () => {
    expect(html).toMatch(/^<button[^>]*type="button"/)
    expect(html).toContain('Live preview')
    expect(html).toContain('<span class="sr-only"> of Latag</span>')
    expect(html).toContain('aria-haspopup="dialog"')
    expect(html).not.toContain('<iframe')
    expect(html).not.toContain('role="dialog"')
  })
})

describe('LivePreview source', () => {
  const source = readFileSync('components/ui/live-preview.tsx', 'utf8')

  it('is a client component on motion/react', () => {
    expect(source.trimStart()).toMatch(/^'use client'/)
    expect(source).toMatch(/from 'motion\/react'/)
    expect(source).toContain('useReducedMotion')
  })

  it('animates through AnimatePresence mode="wait" with keyed children and exits', () => {
    expect(source).toContain('<AnimatePresence mode="wait">')
    expect(source).toMatch(/key="live-preview-dialog"/)
    expect(source).toMatch(/exit=\{/)
  })

  it('is a labelled modal that inerts the page behind it', () => {
    expect(source).toContain('role="dialog"')
    expect(source).toContain('aria-modal="true"')
    expect(source).toContain('aria-labelledby={titleId}')
    expect(source).toContain("setAttribute('inert', '')")
    expect(source).toContain('createPortal')
    expect(source).toContain("e.key === 'Escape'")
    expect(source).toContain("e.key === 'Tab'")
    expect(source).toContain('triggerRef.current?.focus()')
    expect(source).toContain("document.body.style.overflow = 'hidden'")
  })

  it('sandboxes the iframe and names it', () => {
    expect(source).toContain('sandbox="allow-scripts allow-same-origin allow-popups"')
    expect(source).not.toContain('allow-forms')
    expect(source).toContain('loading="lazy"')
    expect(source).toContain('referrerPolicy="no-referrer"')
    expect(source).toContain('title={`Live preview of ${title}`}')
  })

  it('has a failure path: a token-derived timeout, a message and an inert frame until loaded', () => {
    expect(source).toContain('LOAD_TIMEOUT_MS = Math.round(motionTokens.duration.crawl')
    expect(source).toContain("setLoad('failed')")
    expect(source).toContain("This site can't be previewed here. Open it in a new tab.")
    expect(source).toContain("tabIndex={load === 'loaded' ? undefined : -1}")
    expect(source).toContain("aria-hidden={load === 'loaded' ? undefined : 'true'}")
  })

  it('keeps one always-mounted polite status region whose text changes', () => {
    expect(source.match(/role="status"/g)).toHaveLength(1)
    expect(source).toContain('<p role="status" className="sr-only">')
    expect(source).toContain('{STATUS_TEXT[load]}')
    expect(source).toContain("loading: 'Loading preview…'")
    expect(source).toContain("loaded: 'Preview loaded'")
  })

  it('scrolls the body, restores overflow and presses toggles immediately', () => {
    expect(source).toContain('overflow-y-auto')
    expect(source).toContain('min-h-[60vh]')
    expect(source).toContain('document.body.style.overflow = previousOverflow')
    expect(source).toContain("aria-pressed={pressed === 'mobile'}")
  })

  it('has a pressed-state width toggle, a new-tab link and a staging note', () => {
    expect(source).toContain('aria-pressed=')
    expect(source).toContain('Open site in a new tab')
    expect(source).toContain('(opens in a new tab)')
    expect(source).toContain('Staging site')
  })

  it('uses tokens only: no green, no dark: pairs', () => {
    expect(source).not.toMatch(/(?:text|bg|border)-(?:green|red|yellow)-\d/)
    expect(source).not.toMatch(/dark:/)
    expect(source).not.toMatch(/(?:text|bg|border)-live\b/)
  })
})
