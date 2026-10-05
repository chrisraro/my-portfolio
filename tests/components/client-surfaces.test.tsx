import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ContactConsole } from '@/components/sections/contact-console'
import { ChatWidget } from '@/components/ui/chat-widget'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { ToastProvider } from '@/components/ui/toaster'
import ProjectsPage from '@/app/projects/page'
import { projects } from '@/lib/data'

// Focus movement and Escape run in effects and handlers, which static markup
// cannot exercise. These tests pin the markup, plus source guards for the
// behaviour a static render cannot reach.

describe('ToastProvider', () => {
  it('has a polite region for confirmations and an alert region for errors', () => {
    const html = renderToStaticMarkup(<ToastProvider>page</ToastProvider>)
    expect(html).toContain('role="status"')
    expect(html).toContain('aria-live="polite"')
    expect(html).toContain('role="alert"')
  })

  it('gives a confirmation at least 6 s, paused while hovered or focused, below the sticky bar', () => {
    const source = readFileSync('components/ui/toaster.tsx', 'utf8')
    const ms = Number(source.match(/const TOAST_MS = (\d+)/)?.[1])
    expect(ms).toBeGreaterThanOrEqual(6000)
    expect(source).toContain('Math.max(')
    for (const handler of ['onMouseEnter', 'onMouseLeave', 'onFocus', 'onBlur']) expect(source).toContain(handler)
    // Below the two-row bar on phones (about 101px) and the 64px bar from md.
    expect(source).toMatch(/top-28[^"]*md:top-20/)
    expect(source).toContain('data-keep-active')
  })

  it('uses tokens only, and no green: green means live', () => {
    const source = readFileSync('components/ui/toaster.tsx', 'utf8')
    expect(source).not.toMatch(/(?:text|bg|border)-(?:green|red|yellow)-\d/)
    expect(source).not.toMatch(/dark:/)
  })
})

describe('ContactConsole', () => {
  const html = renderToStaticMarkup(
    <ToastProvider>
      <ContactConsole />
    </ToastProvider>,
  )

  it('offers the public Facebook link beside email, opening in a new tab', () => {
    expect(html).toMatch(/href="https:\/\/www\.facebook\.com\/[^"]+"[^>]*><span class="link-draw">Facebook<\/span><span class="sr-only">\(opens in a new tab\)<\/span>/)
  })

  it('starts with no field marked invalid', () => {
    expect(html).not.toContain('aria-invalid')
  })

  it('ties a server error to the field it names, beside the form', () => {
    const source = readFileSync('components/sections/contact-console.tsx', 'utf8')
    expect(source).toContain("'aria-describedby': error?.field === field ? ERROR_ID : undefined")
    expect(source).toContain('<p id={ERROR_ID}')
  })
})

describe('ImageLightbox', () => {
  it('links its trigger to a caption when given one', () => {
    const html = renderToStaticMarkup(
      <ImageLightbox src="/x.jpg" alt="A photo" describedBy="cap-1">
        <span />
      </ImageLightbox>,
    )
    expect(html).toContain('aria-label="View larger image: A photo"')
    expect(html).toContain('aria-describedby="cap-1"')
  })

  it('moves focus in on open, back to the trigger on close, and keeps Escape', () => {
    const source = readFileSync('components/ui/image-lightbox.tsx', 'utf8')
    expect(source).toContain('closeRef.current?.focus()')
    expect(source).toContain('triggerRef.current?.focus()')
    expect(source).toContain("e.key === 'Escape'")
  })

  // aria-modal is only a hint: browse-mode screen readers can still reach the
  // page behind. The dialog is portalled to <body> and every other body child
  // is made inert while it is open, then restored.
  it('portals the open dialog to body and makes the rest of the page inert', () => {
    const source = readFileSync('components/ui/image-lightbox.tsx', 'utf8')
    expect(source).toContain('createPortal(')
    expect(source).toContain('document.body')
    expect(source).toContain("setAttribute('inert', '')")
    expect(source).toContain("removeAttribute('inert')")
  })

  it('renders only its trigger on the server', () => {
    const html = renderToStaticMarkup(
      <ImageLightbox src="/x.jpg" alt="A photo">
        <span />
      </ImageLightbox>,
    )
    expect(html).toContain('<button')
    expect(html).not.toContain('role="dialog"')
  })
})

describe('ChatWidget', () => {
  const source = readFileSync('components/ui/chat-widget.tsx', 'utf8')

  it('renders a labelled launcher when closed', () => {
    expect(renderToStaticMarkup(<ChatWidget />)).toContain('aria-label="Open chat"')
  })

  it('announces replies through a polite log', () => {
    expect(source).toContain('role="log"')
    expect(source).toContain('aria-live="polite"')
  })

  it('closes on Escape and returns focus to the launcher', () => {
    expect(source).toContain("e.key === 'Escape'")
    expect(source).toContain('launcherRef.current?.focus()')
    expect(source).toContain('inputRef.current?.focus()')
  })

  // Desktop: non-modal, by decision (the page stays usable beside it). Below
  // sm the open chat covers nearly the whole viewport, so Shift+Tab used to
  // land on page controls hidden behind it (a11y gate P1-3): there it is modal.
  it('is non-modal from sm up, and modal below it: inert page, Tab trap, focus returned', () => {
    expect(source).toContain("matchMedia('(max-width: 639px)')")
    expect(source).toMatch(/aria-modal=\{isModal \? 'true' : undefined\}/)
    expect(source).toContain("setAttribute('inert', '')")
    expect(source).toContain("removeAttribute('inert')")
    expect(source).toContain("e.key === 'Tab'")
    expect(source).toContain('launcherRef.current?.focus()')
  })

  it('names its input and keeps the global focus outline', () => {
    expect(source).toMatch(/<label htmlFor="chat-input" className="sr-only">/)
    expect(source).not.toContain('focus:outline-none')
  })

  // Green means a live system and nothing else. The widget cannot know the
  // assistant is online until a reply arrives, and with no GROQ_API_KEY it
  // answers offline, so it must never wear the live dot or its pulse.
  it('never claims to be live: no green, no pulse', () => {
    expect(source).not.toMatch(/(?<![\w-])(?:bg|text|border|ring|fill|stroke)-live(?![\w-])/)
    expect(source).not.toContain('live-pulse')
    const html = renderToStaticMarkup(<ChatWidget />)
    expect(html).not.toContain('bg-live')
    expect(html).not.toContain('live-pulse')
  })

  it('marks the launcher with a still amber dot', () => {
    const html = renderToStaticMarkup(<ChatWidget />)
    expect(html).toMatch(/<span aria-hidden="true" class="[^"]*rounded-full[^"]*bg-accent"/)
  })

  it('says so in words, not colour alone, when the API answers offline', () => {
    expect(source).toContain('data.offline === true')
    expect(source).toContain("'offline · set replies only'")
  })

  it('speaks the Operator world: no bounce, no pill bubbles, no emoji', () => {
    expect(source).not.toContain('animate-bounce')
    expect(source).not.toMatch(/rounded-2xl|text-\[10px\]|type: 'spring'/)
    expect(source).not.toMatch(new RegExp('\\p{Extended_Pictographic}', 'u'))
  })
})

describe('/projects', () => {
  it('ends with a way to start a project', () => {
    const html = renderToStaticMarkup(ProjectsPage({ searchParams: {} }))
    expect(html).toContain('href="/#contact"')
  })

  it('states a filtered count against the whole inventory', () => {
    const sites = projects.filter((p) => p.band === 'Sites').length
    const html = renderToStaticMarkup(ProjectsPage({ searchParams: { band: 'Sites' } }))
    expect(html).toContain(`${sites} of ${projects.length} projects`)
  })
})
