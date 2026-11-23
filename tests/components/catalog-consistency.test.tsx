import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import ProjectsPage from '@/app/projects/page'
import ProjectPage from '@/app/projects/[slug]/page'
import { Intro } from '@/components/sections/intro'
import { projects, sectionContent } from '@/lib/data'
import { elevationFigures } from '@/lib/elevation'
import { isShipped } from '@/lib/proof'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

// The same counts mean the same thing everywhere: the homepage's figure, the
// /projects count line and the chat prompt all count "shipped" one way
// (isShipped), and no screen prints a catalog number any more.

const renderProjects = (band?: string) => renderToStaticMarkup(ProjectsPage({ searchParams: band ? { band } : {} }))

describe('project counts', () => {
  const shipped = projects.filter(isShipped).length
  const inProgress = projects.length - shipped

  it('states the shipped count the homepage claims, and the in-progress one, on /projects', () => {
    const figure = elevationFigures().find((f) => f.label === sectionContent.timeline.figures.shipped)!
    expect(figure.value).toBe(shipped)
    expect(renderToStaticMarkup(<Intro />)).toContain(`<span class="text-figure block text-ink">${shipped}</span>`)
    expect(renderProjects()).toContain(`${projects.length} projects · ${shipped} shipped, ${inProgress} in progress`)
  })

  it('counts a filtered view against the whole inventory', () => {
    const sites = projects.filter((p) => p.band === 'Sites')
    expect(renderProjects('sites')).toContain(`${sites.length} of ${projects.length} projects`)
    const apps = projects.filter((p) => p.band === 'Applications')
    expect(renderProjects('applications')).toContain(`${apps.length} of ${projects.length} projects · 1 in progress`)
  })

  it('counts the in-development project as in progress, not as shipped', () => {
    expect(projects.filter(isShipped).map((p) => p.id)).not.toContain('iskotify')
    expect(renderProjects()).not.toMatch(/in staging/)
  })
})

describe('no catalog numbers on screen', () => {
  it('prints none on /projects or on a project page', () => {
    expect(renderProjects()).not.toMatch(/\d{1,2} \/ \d{1,2} · /)
    for (const slug of ['el-nido-guide-ph', 'graceland-bicolano-dining', 'iskotify']) {
      expect(renderToStaticMarkup(ProjectPage({ params: { slug } })), slug).not.toMatch(/\d{1,2} \/ \d{1,2} · /)
    }
  })
})

describe('/projects heading', () => {
  it('has no "All projects" eyebrow above the h1; a filtered view names its band in the h1', () => {
    expect(renderProjects()).not.toContain('class="eyebrow')
    expect(renderProjects('sites')).toContain('>Sites</h1>')
  })
})
