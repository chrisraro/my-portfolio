import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { caseStudies } from '@/lib/case-studies'
import { SYSTEM_PROMPT, buildPortfolioContext } from '@/lib/chat-context'
import { projects, recommendations } from '@/lib/data'
import { buildLlmsFullTxt, buildLlmsTxt } from '@/lib/llms'
import { siteRoutes } from '@/lib/site-routes'
import { graphFor } from '@/lib/structured-data'

// Giya, Latag and Connecta PH were taken off the portfolio on 2026-11-23: no
// project, no case study, no image, no mention anywhere the site is built
// from. Their old project addresses lead to the list. The one place their
// slugs may still be written is next.config.js, which does the redirecting.
const RETIRED = /giya|latag|connecta/i
const SLUGS = ['giya', 'latag', 'connecta-ph']

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return files(full)
    return /\.(tsx?|mjs|js|json|css|svg|txt)$/.test(full) ? [full] : []
  })
}

describe('the removed projects', () => {
  it('catches every spelling, so the guard can fail', () => {
    for (const s of ['Giya', 'giya.ph', 'latag.vercel.app', 'Latag', 'connecta-ph', 'Connecta PH']) expect(s).toMatch(RETIRED)
    expect('Iskotify and SkimCare').not.toMatch(RETIRED)
  })

  it('are in no source file of lib, components, app or scripts', () => {
    const offenders = ['lib', 'components', 'app', 'scripts', 'types'].flatMap(files).filter((f) => RETIRED.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })

  it('are in no project, case study or testimonial the data holds', () => {
    expect(projects.filter((p) => RETIRED.test(JSON.stringify(p))).map((p) => p.slug)).toEqual([])
    expect(caseStudies.filter((s) => RETIRED.test(JSON.stringify(s))).map((s) => s.slug)).toEqual([])
    expect(recommendations.filter((r) => RETIRED.test(JSON.stringify(r)))).toEqual([])
    for (const slug of SLUGS) expect(projects.some((p) => p.slug === slug), slug).toBe(false)
  })

  it('are in no route, no structured-data graph, no AI file and not the chat prompt', () => {
    expect(JSON.stringify(siteRoutes())).not.toMatch(RETIRED)
    for (const route of siteRoutes()) expect(JSON.stringify(graphFor(route.path)), route.path).not.toMatch(RETIRED)
    expect(buildLlmsTxt()).not.toMatch(RETIRED)
    expect(buildLlmsFullTxt()).not.toMatch(RETIRED)
    expect(SYSTEM_PROMPT).not.toMatch(RETIRED)
    expect(buildPortfolioContext()).not.toMatch(RETIRED)
  })

  it('leave no image behind', () => {
    for (const f of files('public')) expect(f, f).not.toMatch(RETIRED)
    expect(existsSync('lib/embeddable.json') ? readFileSync('lib/embeddable.json', 'utf8') : '').not.toMatch(RETIRED)
  })
})

describe('their old addresses', () => {
  const nextConfig = createRequire(import.meta.url)(join(process.cwd(), 'next.config.js')) as {
    redirects: () => Promise<{ source: string; destination: string; permanent: boolean }[]>
  }

  it('lead to /projects, permanently (308), one redirect each', async () => {
    const redirects = await nextConfig.redirects()
    expect(redirects).toHaveLength(SLUGS.length)
    for (const slug of SLUGS) {
      expect(redirects, slug).toContainEqual({ source: `/projects/${slug}`, destination: '/projects', permanent: true })
    }
  })

  it('are the only place the retired slugs are written: next.config.js', () => {
    expect(RETIRED.test(readFileSync('next.config.js', 'utf8'))).toBe(true)
  })

  it('are not pages any more, nor in the sitemap', () => {
    const paths = siteRoutes().map((r) => r.path)
    for (const slug of SLUGS) expect(paths).not.toContain(`/projects/${slug}`)
  })
})
