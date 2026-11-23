import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import HirePage, { metadata } from '@/app/hire/page'
import { ToastProvider } from '@/components/ui/toaster'
import { availability, contactInfo, experience, hirePageContent, resumeUrl, skills, socialLinks } from '@/lib/data'

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')
const re = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const tag = (html: string, href: string) => html.match(new RegExp(`<a [^>]*href="${re(href)}"[^>]*>`))?.[0] ?? ''
const CHIP = 'class="chip"'

describe('/hire', () => {
  const html = renderToStaticMarkup(
    <ToastProvider>
      <HirePage />
    </ToastProvider>,
  )
  const c = hirePageContent

  it('opens with its answer under the one h1', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain(`>${escape(c.heading)}</h1>`)
    const answer = html.indexOf(`>${escape(c.answer)}</p>`)
    expect(answer).toBeGreaterThan(html.indexOf('</h1>'))
    expect(answer).toBeLessThan(html.indexOf('<h2'))
  })

  it('makes the résumé the primary action, the email beside it', () => {
    const resume = tag(html, resumeUrl)
    expect(resume).toContain('class="press button-primary"')
    expect(resume).toContain('target="_blank"')
    expect(tag(html, `mailto:${contactInfo.email}`)).toContain('class="press button-secondary"')
  })

  it('sets the stack by depth: the core first, then every other skill once, under its category', () => {
    const core = html.indexOf(`>${c.stack.coreLabel}</h3>`)
    const more = html.indexOf(`>${c.stack.moreLabel}</h3>`)
    expect(core).toBeGreaterThan(-1)
    expect(more).toBeGreaterThan(core)
    for (const id of c.stack.coreIds) {
      const name = skills.find((s) => s.id === id)!.name
      const at = html.indexOf(`<li ${CHIP}>${escape(name)}</li>`)
      expect(at, name).toBeGreaterThan(core)
      expect(at, name).toBeLessThan(more)
    }
    expect(html.split(CHIP).length - 1).toBe(skills.length)
    for (const s of skills.filter((x) => c.stack.coreIds.indexOf(x.id) === -1)) {
      expect(html.indexOf(`<li ${CHIP}>${escape(s.name)}</li>`), s.name).toBeGreaterThan(more)
      expect(html).toContain(`<dt class="text-sm text-muted-strong">${escape(s.category)}</dt>`)
    }
  })

  it('states availability, the public base and the code, never a phone', () => {
    expect(html).toContain(`>${escape(availability)}</dd>`)
    expect(html).toContain(`>${escape(contactInfo.location)}</dd>`)
    expect(html).toContain(`href="${socialLinks.find((l) => l.icon === 'github')!.url}"`)
    expect(html).not.toMatch(/href="tel:/)
  })

  it('says how I work, with the AI tools in use', () => {
    for (const n of c.howIWork.notes) {
      expect(html).toContain(`>${escape(n.title)}</h3>`)
      expect(html).toContain(`>${escape(n.body)}</p>`)
    }
    for (const item of c.howIWork.aiInUse) {
      expect(html).toContain(escape(item.label))
      if (item.href) expect(html).toContain(`href="${item.href}"`)
    }
  })

  it('gives the full work history, responsibilities and all, then ends in the form', () => {
    for (const r of experience[0].responsibilities) expect(html).toContain(escape(r))
    expect(html.indexOf('<section id="contact"')).toBeGreaterThan(html.indexOf(escape(experience[0].responsibilities[0])))
  })

  it('is titled and canonical', () => {
    expect(metadata.title).toBe(c.title)
    expect(metadata.description).toBe(c.metaDescription)
    expect(metadata.alternates?.canonical).toBe('/hire')
  })
})
