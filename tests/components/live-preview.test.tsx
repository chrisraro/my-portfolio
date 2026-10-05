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
    expect(html).toContain('data-preview="live"')
  })

  it('marks a capture-mode trigger, with the same name and popup', () => {
    const capture = renderToStaticMarkup(
      <LivePreview url="https://giya.ph" title="Giya" capture={{ desktop: '/a-full.webp', mobile: '/a-mobile.png' }} />,
    )
    expect(capture).toContain('data-preview="capture"')
    expect(capture).toContain('aria-haspopup="dialog"')
    expect(capture).toContain('<span class="sr-only"> of Giya</span>')
    expect(capture).not.toContain('<img')
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

  it('keeps the toast region live while the rest of the page is inert', () => {
    expect(source).toContain("document.querySelectorAll('[data-keep-active]')")
    expect(source).toContain('inertAllBut(keep)')
    expect(source).toContain("removeAttribute('inert')")
  })

  it('resets the load state in the same update that opens, so no stale frame paints', () => {
    expect(source).toMatch(/const openPreview = \(\) => \{\s*setDevice\('desktop'\)\s*setPressed\('desktop'\)\s*setLoad\('loading'\)\s*setOpen\(true\)/)
    expect(source).toContain('onClick={openPreview}')
    expect(source).not.toMatch(/if \(open\) \{\s*setDevice/)
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

  it('never cycles to a frame that is out of the tab order', () => {
    expect(source).toContain(`const FOCUSABLE = 'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), iframe:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'`)
  })

  it('keeps one always-mounted polite status region whose text changes', () => {
    expect(source.match(/role="status"/g)).toHaveLength(1)
    expect(source).toContain('<p role="status" className="sr-only">')
    // Mounted empty, filled a tick later, so the first message is announced.
    expect(source).toContain('{announced}')
    expect(source).toContain('setAnnounced((capture ? CAPTURE_TEXT : STATUS_TEXT)[load])')
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

  it('shows a capture, not an iframe, for a site that refuses framing, and says so', () => {
    expect(source).toMatch(/\{capture \? \(/)
    expect(source).toContain("This site doesn't allow embedding, so this is a capture of it.")
    expect(source).toContain('Open the live site')
    // The capture scrolls inside a named, keyboard-reachable region.
    expect(source).toMatch(/role="region"\s+aria-label=\{`Capture of \$\{title\}`\}\s+tabIndex=\{0\}/)
    // The mobile toggle switches to the mobile shot where there is one.
    expect(source).toContain("device === 'mobile' && capture.mobile ? capture.mobile : capture.desktop")
    expect(source).toContain("loading: 'Loading capture…'")
    expect(source).toContain('(capture ? CAPTURE_TEXT : STATUS_TEXT)[load]')
    expect(source).toContain('Capture')
  })

  it('uses tokens only: no green, no dark: pairs', () => {
    expect(source).not.toMatch(/(?:text|bg|border)-(?:green|red|yellow)-\d/)
    expect(source).not.toMatch(/dark:/)
    expect(source).not.toMatch(/(?:text|bg|border)-live\b/)
  })
})
