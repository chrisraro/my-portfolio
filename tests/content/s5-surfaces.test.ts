import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { describe, expect, it } from 'vitest'
import sitemap from '@/app/sitemap'
import { OFFLINE_REPLY, SYSTEM_PROMPT } from '@/lib/chat-context'
import { buildLlmsFullTxt, buildLlmsTxt } from '@/lib/llms'
import { absoluteUrl, buildRouteMetadata, buildSiteMetadata } from '@/lib/site-metadata'
import { siteRoutes, type SiteRoute } from '@/lib/site-routes'
import { routeGraph } from '@/lib/structured-data'
import { privacyIssues } from '@/tests/helpers/privacy'

// The S5 brief's tests: no telephone or street anywhere, every route in the
// sitemap and llms.txt. The guards themselves are shown failing in
// tests/content/privacy-guard.test.ts.

const MIN_ROUTES = 7

/** The route list, refusing to be empty or tiny so no loop below passes vacuously. */
function guardedRoutes(): SiteRoute[] {
  const list = siteRoutes()
  expect(list.length).toBeGreaterThan(MIN_ROUTES)
  return list
}

const routes = siteRoutes()

describe('S5: the route list cannot be empty', () => {
  it('has more than seven routes', () => {
    expect(routes.length).toBeGreaterThan(0)
    expect(guardedRoutes().length).toBeGreaterThan(MIN_ROUTES)
  })
})

describe('S5: nothing private on any public surface', () => {
  it.each(guardedRoutes().map((r) => [r.path, r] as const))('%s: metadata, JSON-LD and card words', (_path, r) => {
    for (const text of [JSON.stringify(buildRouteMetadata(r.path)), JSON.stringify(routeGraph(r)), JSON.stringify(r.card)]) {
      expect(privacyIssues(text)).toEqual([])
    }
  })

  it('the site metadata, both AI files and the chat assistant’s texts', () => {
    const texts = [
      JSON.stringify(buildSiteMetadata('https://example.test')),
      buildLlmsTxt(),
      buildLlmsFullTxt(),
      SYSTEM_PROMPT,
      OFFLINE_REPLY,
    ]
    for (const text of texts) expect(privacyIssues(text)).toEqual([])
  })
})

describe('S5: every route reaches every index', () => {
  const llms = buildLlmsTxt()
  const mapped = sitemap().map((e) => e.url)

  it.each(guardedRoutes().map((r) => r.path))('%s is in the sitemap and in llms.txt', (path) => {
    expect(mapped).toContain(absoluteUrl(path))
    expect(llms).toContain(`(${absoluteUrl(path)})`)
  })

  it('maps nothing that is not a route', () => {
    expect(mapped).toHaveLength(guardedRoutes().length)
  })
})

describe('S5: the chat prompt names every page that is not a project or a service', () => {
  const pages = guardedRoutes().filter((r) => r.kind !== 'project' && r.kind !== 'service')

  it('there are pages to name', () => {
    expect(pages.length).toBeGreaterThan(0)
  })

  it.each(pages.map((r) => r.path))('%s', (path) => {
    expect(SYSTEM_PROMPT).toContain(absoluteUrl(path))
  })

  it('and every service page too', () => {
    for (const r of guardedRoutes().filter((x) => x.kind === 'service')) {
      expect(SYSTEM_PROMPT, r.path).toContain(absoluteUrl(r.path))
    }
  })
})

// The registry must match the filesystem: a page added under app/ with no
// registry entry would otherwise fail nothing.
function pageFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) return name === 'api' ? [] : pageFiles(full)
    return name === 'page.tsx' ? [full] : []
  })
}

/** '/services/[slug]' -> { prefix: '/services/', dynamic: true }; '/about' -> { path: '/about' }. */
function routePattern(file: string, appDir: string) {
  const segments = relative(appDir, file).split(sep).slice(0, -1)
  const path = '/' + segments.join('/')
  const dynamic = segments.some((s) => s.startsWith('['))
  return { path, dynamic, file }
}

/** Page patterns that no registry route satisfies. A dynamic page is covered by routes under its prefix. */
function unregistered(patterns: { path: string; dynamic: boolean }[], registry: SiteRoute[]): string[] {
  return patterns
    .filter((p) => {
      if (!p.dynamic) return !registry.some((r) => r.path === p.path)
      const prefix = p.path.slice(0, p.path.indexOf('['))
      return !registry.some((r) => r.path.startsWith(prefix) && r.path.length > prefix.length)
    })
    .map((p) => p.path)
}

describe('S5: the route registry matches the filesystem', () => {
  const appDir = join(process.cwd(), 'app')
  const patterns = pageFiles(appDir).map((f) => routePattern(f, appDir))

  it('finds the pages', () => {
    expect(patterns.length).toBeGreaterThan(MIN_ROUTES - 1)
  })

  it('every app page maps to a registry route', () => {
    expect(unregistered(patterns, guardedRoutes())).toEqual([])
  })

  it('the helper catches a page with no registry entry', () => {
    const fake = [
      { path: '/about', dynamic: false },
      { path: '/services/[slug]', dynamic: true },
      { path: '/uses', dynamic: false },
      { path: '/notes/[slug]', dynamic: true },
    ]
    expect(unregistered(fake, guardedRoutes())).toEqual(['/uses', '/notes/[slug]'])
  })

  it('every dynamic page’s generated params are all in the registry', async () => {
    const dynamicPatterns = patterns.filter((p) => p.dynamic)
    expect(dynamicPatterns.length).toBeGreaterThan(0)
    const registryPaths = new Set(guardedRoutes().map((r) => r.path))
    for (const p of dynamicPatterns) {
      const mod = (await import(/* @vite-ignore */ p.file.split(sep).join('/'))) as {
        generateStaticParams?: () => { slug: string }[]
      }
      expect(mod.generateStaticParams, `${p.path} exports generateStaticParams`).toBeTypeOf('function')
      const params = mod.generateStaticParams!()
      expect(params.length, `${p.path} generates params`).toBeGreaterThan(0)
      for (const { slug } of params) {
        expect(registryPaths.has(p.path.replace('[slug]', slug)), `${p.path} with ${slug}`).toBe(true)
      }
    }
  })

  it('and every registry route comes from a page', () => {
    const covered = (path: string) =>
      patterns.some((p) =>
        p.dynamic ? path.startsWith(p.path.slice(0, p.path.indexOf('['))) && path.length > p.path.indexOf('[') : p.path === path,
      )
    expect(guardedRoutes().filter((r) => !covered(r.path)).map((r) => r.path)).toEqual([])
  })
})

describe('the docs', () => {
  it('describe the S5 routes, cards, graph and crawlers', () => {
    const doc = readFileSync('CLAUDE.md', 'utf8')
    for (const name of [
      'lib/site-routes.ts',
      'app/og/',
      'routeGraph',
      'ProfilePage',
      'SoftwareApplication',
      'OAI-SearchBot',
      'Claude-SearchBot',
      'PerplexityBot',
      'privacyIssues',
      's5-surfaces',
      'elevationFigures',
    ]) {
      expect(doc, name).toContain(name)
    }
    for (const gone of ['app/opengraph-image.tsx', 'proofPoints', 'ProfessionalService', 'until S5']) {
      expect(doc, gone).not.toContain(gone)
    }
  })
})
