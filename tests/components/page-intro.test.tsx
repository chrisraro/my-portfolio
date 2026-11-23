import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { PageIntro } from '@/components/ui/page-intro'
import { WorkHistory } from '@/components/ui/work-history'
import { experience } from '@/lib/data'
import { buildTimeline } from '@/lib/timeline'

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')

describe('PageIntro', () => {
  const html = renderToStaticMarkup(
    <PageIntro title="What I build" answer="The answer." updated="2026-11-20">
      <a href="#contact">Go</a>
    </PageIntro>,
  )

  it('opens on the one grid: one h1 first, with no eyebrow over it, then the answer', () => {
    expect(html).toMatch(/^<header class="mx-auto w-full max-w-\[49rem\] px-5 sm:px-8 /)
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toMatch(/^<header[^>]*><h1 /)
    expect(html).not.toContain('eyebrow')
    expect(html).toMatch(/<\/h1><p class="text-lede[^"]*">The answer\.<\/p>/)
  })

  it('shows when the copy was last updated, machine-readable', () => {
    expect(html).toMatch(/Updated <time datetime="2026-11-20">20 November 2026<\/time>/i)
  })

  it('sets the page’s actions under the answer', () => {
    expect(html.indexOf('href="#contact"')).toBeGreaterThan(html.indexOf('The answer.'))
  })

  it('renders no empty action row when there are none', () => {
    const bare = renderToStaticMarkup(<PageIntro title="T" answer="A." updated="2026-11-20" />)
    expect(bare).not.toContain('flex-wrap')
  })
})

describe('WorkHistory', () => {
  it('lists every role and degree with its dates, newest first, each an h3', () => {
    const html = renderToStaticMarkup(<WorkHistory />)
    let last = -1
    for (const e of buildTimeline()) {
      const at = html.indexOf(`>${escape(e.title)}</h3>`)
      expect(at, e.title).toBeGreaterThan(last)
      last = at
      expect(html).toContain(e.date)
      expect(html).toContain(escape(e.subtitle))
    }
  })

  it('keeps responsibilities to the detailed history', () => {
    const plain = renderToStaticMarkup(<WorkHistory />)
    const detailed = renderToStaticMarkup(<WorkHistory detailed />)
    for (const role of experience) {
      for (const r of role.responsibilities) {
        expect(plain).not.toContain(escape(r))
        expect(detailed).toContain(escape(r))
      }
    }
  })

  it('names the overlap between two roles', () => {
    const html = renderToStaticMarkup(<WorkHistory />)
    for (const role of experience.filter((x) => x.concurrent)) expect(html).toContain(escape(role.concurrent!))
  })
})
