import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { Footer } from '@/components/footer'
import { TopBar } from '@/components/top-bar'
import { CaseStudies } from '@/components/sections/case-studies'
import { FieldLog } from '@/components/sections/field-log'
import { Hero } from '@/components/sections/hero'
import { Products } from '@/components/sections/products'
import { Rack } from '@/components/sections/rack'
import { RouteLine } from '@/components/sections/route-line'
import { Stack } from '@/components/sections/stack'
import { noPreviewCopy } from '@/components/ui/no-preview-tag'
import { groupForHomepage } from '@/lib/board'
import { FLAGSHIP_SLUGS, briefLead, getCaseStudy } from '@/lib/case-studies'
import {
  availability,
  contactInfo,
  education,
  experience,
  footerContent,
  galleryContent,
  galleryImages,
  heroContent,
  projects,
  recommendations,
  sectionContent,
  skills,
} from '@/lib/data'
import { buildFieldLog } from '@/lib/field-log'
import { canLinkLive, fullShotFor, isEmbeddable } from '@/lib/project-page'
import type { Project } from '@/types'

// The top bar reads the route; outside the App Router there is none.
vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

const products = projects.filter((p) => p.band === 'Products')
const racked = projects.filter((p) => p.band !== 'Products')
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')

describe('Hero', () => {
  const html = renderToStaticMarkup(<Hero />)

  it('renders the AI line from data, in plain text under the title', () => {
    expect(heroContent.aiLine).toBe('AI-enabled engineer and automations: Claude Code, Codex, Qwen Code, n8n')
    expect(html).toContain(`>${heroContent.aiLine}</p>`)
    expect(html.indexOf('</h1>')).toBeLessThan(html.indexOf(heroContent.aiLine))
  })

  // Confirm critique: the proof panel spread its two groups apart (a ~234px
  // void), and at 1440x900 the fold cut the Products heading in half.
  // R5 critique: at 1440 the panel's bottom third stood empty. The proof grid
  // now grows to fill it (its rows share the height), still from the top.
  it('stacks the proof panel from the top, fills it, and leaves the next heading inside the first viewport', () => {
    const panel = html.match(/<div class="hero-unfold-right[^"]*"/)?.[0] ?? ''
    expect(panel).toContain('justify-start')
    expect(panel).not.toContain('justify-between')
    const grid = html.match(/<ul class="([^"]*grid-cols-2[^"]*)"/)?.[1] ?? ''
    expect(grid).toContain('md:flex-1')
    expect(grid).toContain('md:auto-rows-fr')
    const section = html.match(/<section id="top"[^>]*class="([^"]*)"/)?.[1] ?? ''
    expect(section).toContain('md:pb-[72px]')
  })

  it('states availability in the first mobile viewport, where the top bar hides it', () => {
    const line = html.match(/<p class="([^"]*)">(?:(?!<\/p>).)*Open to freelance/)
    expect(html).toContain(availability)
    expect(line?.[1]).toContain('sm:hidden')
  })

  it('sets the title as the H1, word by word, with the lede and specialism', () => {
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? ''
    expect(h1.replace(/<[^>]+>/g, '')).toBe(heroContent.title)
    expect(html).toContain(escape(heroContent.lede))
    expect(html).toContain(heroContent.specialism)
  })

  it('leads with Start a project and the résumé', () => {
    expect(html).toMatch(/<a [^>]*href="#contact"[^>]*>Start a project/)
    expect(html).toContain('Résumé')
  })

  it('reads each proof point as its sentence, with a plain numeral beside it', () => {
    for (const point of heroContent.proofPoints) expect(html).toContain(`<span class="sr-only">${point}</span>`)
    expect(html).not.toMatch(/aria-hidden="true" class="text-numeral[^"]*">0\d</)
  })

  it('does not repeat the portrait’s name inside its labelled button', () => {
    expect(html).toContain(`aria-label="View larger image: ${heroContent.portraitAlt}"`)
    expect(html).not.toMatch(/<img[^>]*alt="(Christian Raro|Portrait of)/)
  })

  it('keeps amber off the stack chips: colour arrives only as whole planes', () => {
    const chips = html.match(/<ul aria-label="Core stack"[\s\S]*?<\/ul>/)?.[0] ?? ''
    expect(chips).not.toContain('accent')
  })
})

describe('Products', () => {
  const html = renderToStaticMarkup(<Products />)
  const spreads = html.match(/<article[\s\S]*?<\/article>/g) ?? []

  it('takes its heading from lib/data.ts', () => {
    expect(html).toContain(`>${sectionContent.work.eyebrow}<`)
    expect(html).toMatch(new RegExp(`<h2 id="work-title"[^>]*>${sectionContent.work.title}<`))
  })

  it('opens one spread per product, in order', () => {
    expect(spreads).toHaveLength(products.length)
    products.forEach((p, i) => expect(spreads[i]).toContain(`>${p.title}<`))
  })

  it('leads each spread with name, summary and status, before the detail and the preview', () => {
    products.forEach((project, i) => {
      const spread = spreads[i]
      const at = (needle: string) => spread.indexOf(needle)
      const title = at(`>${project.title}<`)
      expect(title).toBeGreaterThan(-1)
      expect(at(`>${escape(project.summary)}<`)).toBeGreaterThan(title)
      expect(at('data-status=')).toBeGreaterThan(at(`>${escape(project.summary)}<`))
      expect(at(escape(project.description.slice(0, 40)))).toBeGreaterThan(at('data-status='))
    })
  })

  it('links each product to its page, and to the live site a visitor can open', () => {
    products.forEach((project, i) => {
      expect(spreads[i]).toContain(`href="/projects/${project.slug}"`)
      if (canLinkLive(project) && project.links.live) expect(spreads[i]).toContain(`href="${project.links.live}"`)
    })
  })

  it('shows the real site in a still screenshot, or says honestly why there is no picture', () => {
    products.forEach((project, i) => {
      if (fullShotFor(project)) {
        expect(spreads[i]).toContain('project-shot__frame')
        expect(spreads[i]).not.toMatch(/scroll-preview|animation-timeline/)
        // "Read more" is the named link to the same page: the screenshot is not a second tab stop.
        expect(spreads[i]).toMatch(/<a [^>]*tabindex="-1"[^>]*aria-hidden="true"[^>]*class="project-shot lift-card /)
      } else {
        expect(spreads[i]).not.toContain('project-shot__frame')
        expect(spreads[i]).toContain(escape(noPreviewCopy(project)))
      }
    })
  })

  it('offers a live preview exactly where the site can be framed', () => {
    products.forEach((project, i) => {
      expect(spreads[i].includes('aria-haspopup="dialog"'), project.slug).toBe(isEmbeddable(project))
    })
  })
})

describe('Rack', () => {
  const html = renderToStaticMarkup(<Rack />)
  const cards = html.match(/<a [^>]*class="rack-card[\s\S]*?<\/a>/g) ?? []
  const cardFor = (p: Project) => cards.find((c) => c.includes(`href="/projects/${p.slug}"`)) ?? ''

  it('takes its heading from lib/data.ts and names each tier', () => {
    expect(html).toMatch(new RegExp(`<h2 id="systems-title"[^>]*>${sectionContent.systems.title}<`))
    for (const group of groupForHomepage(racked)) expect(html).toMatch(new RegExp(`<h3 [^>]*>${group.heading}`))
  })

  it('puts every project that is not a product in the rack, once, linking to its page', () => {
    expect(cards).toHaveLength(racked.length)
    for (const p of racked) expect(cardFor(p), p.slug).toContain(`>${p.title}<`)
  })

  it('shows each card’s status through StatusBadge', () => {
    for (const p of racked) expect(cardFor(p), p.slug).toContain('data-status=')
  })

  it('numbers the cards as one strip across the whole rack', () => {
    const codes = html.match(/\d{2} \/ \d{2} · /g) ?? []
    expect(codes).toHaveLength(racked.length)
    expect(new Set(codes).size).toBe(racked.length)
    expect(codes.every((c) => c.includes(` / ${projects.length} · `))).toBe(true)
  })

  it('keeps one interactive target per card: nothing focusable inside it', () => {
    for (const card of cards) {
      expect(card.slice(3)).not.toContain('<a ')
      expect(card).not.toContain('<button')
      expect(card).not.toMatch(/tabindex/i)
    }
  })

  it('stands every card whole on the shelf: no pocket, no reserved lift', () => {
    expect(html).not.toMatch(/rack-pocket|rack-row--open|rack-card__sunk/)
  })

  it('keeps a card with no preview flat, its reason printed in the visible top', () => {
    for (const p of racked.filter((p) => !fullShotFor(p))) {
      const card = cards.find((c) => c.includes(`href="/projects/${p.slug}"`)) ?? ''
      expect(card, p.slug).toMatch(/class="rack-card lift-card rack-card--flat/)
      // The reason sits in the text block, not only in the (wide-screen hidden) picture half.
      const top = card.match(/<span class="rack-card__top[^"]*">([\s\S]*?)<\/span><span class="rack-card__shot/)?.[1] ?? ''
      expect(top, p.slug).toContain(escape(noPreviewCopy(p)))
    }
    for (const p of racked.filter((p) => fullShotFor(p))) {
      const card = cards.find((c) => c.includes(`href="/projects/${p.slug}"`)) ?? ''
      expect(card, p.slug).not.toContain('rack-card--flat')
    }
  })

  it('shows a still screenshot on each card, or a printed tag where there is none', () => {
    for (const p of racked) {
      const card = cardFor(p)
      if (fullShotFor(p)) expect(card, p.slug).toContain('project-shot__frame')
      else expect(card, p.slug).toContain(escape(noPreviewCopy(p)))
    }
  })

  it('marks a staging site on its card', () => {
    for (const p of racked.filter((x) => x.status === 'staging')) expect(cardFor(p)).toContain('>Staging<')
  })

  it('leads on to every project', () => {
    expect(html).toContain('href="/projects"')
  })
})

describe('every project is reachable from the homepage', () => {
  it('links each project page from Products or the rack', () => {
    const html = renderToStaticMarkup(<Products />) + renderToStaticMarkup(<Rack />)
    for (const p of projects) expect(html, p.slug).toContain(`href="/projects/${p.slug}"`)
  })
})

describe('Case studies', () => {
  const html = renderToStaticMarkup(<CaseStudies />)

  it('takes its heading from lib/data.ts', () => {
    expect(html).toContain(`>${sectionContent.caseStudies.eyebrow}<`)
    expect(html).toMatch(new RegExp(`<h2 id="case-studies-title"[^>]*>${sectionContent.caseStudies.title}<`))
  })

  it('shows a cover for every flagship, in reading order, with role and brief', () => {
    let last = -1
    for (const slug of FLAGSHIP_SLUGS) {
      const study = getCaseStudy(slug)!
      const at = html.indexOf(`href="/projects/${slug}"`)
      expect(at, slug).toBeGreaterThan(last)
      last = at
      expect(html).toContain(escape(study.role))
      expect(html).toContain(escape(briefLead(study)))
    }
  })
})

describe('Field log', () => {
  const html = renderToStaticMarkup(<FieldLog />)

  it('takes its heading from lib/data.ts', () => {
    expect(html).toMatch(new RegExp(`<h2 id="field-log-title"[^>]*>${galleryContent.title}<`))
  })

  it('ties every photo button to its visible caption', () => {
    for (const image of galleryImages) {
      const id = `field-log-caption-${image.id}`
      expect(html).toContain(`aria-describedby="${id}"`)
      expect(html).toContain(`id="${id}"`)
    }
  })

  it('marks thumbnails decorative, since their buttons carry the description', () => {
    for (const image of galleryImages) {
      expect(html).not.toMatch(new RegExp(`<img[^>]*alt="${image.alt}"`))
    }
  })

  it('attributes every testimonial and links it to the project it is about', () => {
    for (const r of recommendations) {
      expect(html).toContain(escape(r.authorName))
      const project = projects.find((p) => p.id === r.projectId)
      if (project) expect(html).toContain(`href="/projects/${project.slug}"`)
    }
  })

  it('never leaves a single card alone on the last three-column row', () => {
    const entries = buildFieldLog(galleryImages, recommendations, projects)
    if (entries.length % 3 === 1) expect(html).toContain('lg:col-span-3')
  })
})

describe('Route line', () => {
  const html = renderToStaticMarkup(<RouteLine />)

  it('keeps the #changelog anchor and its heading from lib/data.ts', () => {
    expect(html).toContain('id="changelog"')
    expect(html).toMatch(new RegExp(`<h2 id="changelog-title"[^>]*>${escape(sectionContent.changelog.title)}<`))
  })

  it('stops at every role and every degree, in two lanes', () => {
    for (const e of experience) expect(html).toContain(escape(e.title))
    for (const e of education) expect(html).toContain(escape(e.degree))
    expect(html).toContain('>Work<')
    expect(html).toContain('>Education<')
  })
})

describe('Stack', () => {
  const html = renderToStaticMarkup(<Stack />)

  it('lists every skill under its category', () => {
    for (const s of skills) expect(html).toContain(`>${s.name}<`)
  })

  it('renders the AI & automation group', () => {
    expect(html).toContain('>AI &amp; automation<')
    for (const name of ['Claude Code', 'Codex', 'Qwen Code', 'n8n', 'Groq / LLM APIs']) expect(html).toContain(`>${name}<`)
  })
})

describe('primary proof renders visible without JavaScript', () => {
  it.each([
    ['Hero', <Hero key="h" />],
    ['Products', <Products key="p" />],
    ['Rack', <Rack key="r" />],
  ])('%s ships no opacity:0 entrance', (_name, node) => {
    expect(renderToStaticMarkup(node)).not.toMatch(/opacity:\s*0/)
  })

  it('moves proof by transform only as it scrolls in, never by opacity', () => {
    const css = readFileSync('app/globals.css', 'utf8')
    for (const name of ['reveal-slide', 'reveal-stagger', 'reveal-draw-x']) {
      const frames = css.match(new RegExp(`@keyframes ${name} \\{[\\s\\S]*?\\n\\t\\t\\}`))?.[0]
      expect(frames, name).toBeDefined()
      expect(frames).not.toContain('opacity')
    }
    // The lede block rises by transform only too (a11y gate R5, P2-7).
    const rise = css.match(/@keyframes hero-rise \{[\s\S]*?\n\t\}/)?.[0]
    expect(rise).toBeDefined()
    expect(rise).not.toContain('opacity')
    // The hero proof numerals rise on their own transform-only keyframes.
    const lift = css.match(/@keyframes hero-lift \{[\s\S]*?\n\t+\}/)?.[0]
    expect(lift).toBeDefined()
    expect(lift).not.toContain('opacity')
    expect(css).toMatch(/\.hero-proof-item \{[^}]*animation: hero-lift/)
  })
})

describe('Lobby Rack type', () => {
  it('sets no homepage label in the retired B3 caps-and-tracking style', () => {
    const dir = 'components/sections'
    for (const f of readdirSync(dir)) {
      const source = readFileSync(join(dir, f), 'utf8')
      expect(source, f).not.toMatch(/\buppercase\b|tracking-\[0\.1em\]/)
    }
  })
})

describe('Top bar', () => {
  it('scrolls the nav only below md, padded so the focus ring is not clipped', () => {
    const source = readFileSync('components/top-bar.tsx', 'utf8')
    const ul = source.match(/<ul className="([^"]*)"/)?.[1] ?? ''
    expect(ul).toContain('max-md:overflow-x-auto')
    expect(ul).not.toMatch(/(^|\s)overflow-x-auto/)
    expect(ul).toMatch(/max-md:p-1\.5/)
  })

  it('names the theme toggle neutrally until mount, so hydration cannot leave a wrong label', () => {
    const source = readFileSync('components/top-bar.tsx', 'utf8')
    // The label is gated on mount, like the icon: the server cannot know the theme.
    expect(source).toMatch(/aria-label=\{themeLabel\}/)
    expect(source).toMatch(/const themeLabel = !mounted \? 'Toggle theme'/)
    // The server render (mounted false) is the neutral name.
    const html = renderToStaticMarkup(<TopBar />)
    expect(html).toContain('aria-label="Toggle theme"')
  })
})

describe('Footer', () => {
  it('tells screen readers each social link opens a new tab', () => {
    const html = renderToStaticMarkup(<Footer />)
    const links = contactInfo.socialLinks.filter((l) => l.icon !== 'mail')
    expect(html.match(/\(opens in a new tab\)/g)).toHaveLength(links.length)
  })

  it('signs off with the colophon from lib/data.ts', () => {
    expect(renderToStaticMarkup(<Footer />)).toContain(footerContent.colophon)
  })
})
