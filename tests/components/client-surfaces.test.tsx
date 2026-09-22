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
    expect(html).toMatch(/href="https:\/\/www\.facebook\.com\/[^"]+"[^>]*>Facebook<span class="sr-only">\(opens in a new tab\)<\/span>/)
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

  it('stays non-modal: no aria-modal, by decision', () => {
    expect(source).not.toMatch(/aria-modal=/)
  })

  it('names its input and keeps the global focus outline', () => {
    expect(source).toMatch(/<label htmlFor="chat-input" className="sr-only">/)
    expect(source).not.toContain('focus:outline-none')
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

  it('reflects the filter in the board header', () => {
    const sites = projects.filter((p) => p.band === 'Sites').length
    const html = renderToStaticMarkup(ProjectsPage({ searchParams: { band: 'Sites' } }))
    expect(html).toContain(`projects · ${sites} of ${projects.length}`)
  })
})
