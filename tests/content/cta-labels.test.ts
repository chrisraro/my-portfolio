import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { ctaLabels, projectsPageContent, sectionContent } from '@/lib/data'

// S2 final review, carry-over 10: one source for call-to-action labels. Each
// is spelled out once, in ctaLabels; every button, link and heading that says
// it reads it from there. Comments may name a label; code may not.
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return files(full)
    return /\.tsx?$/.test(full) ? [full] : []
  })
}
const stripComments = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
const sources = ['app', 'components', 'lib']
  .flatMap(files)
  .map((f) => ({ f: f.replace(/\\/g, '/'), src: stripComments(readFileSync(f, 'utf8')) }))
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

describe('call-to-action labels', () => {
  it('are each spelled out once, in ctaLabels', () => {
    for (const label of Object.values(ctaLabels)) {
      const quoted = new RegExp(`(['"\`])${esc(label)}\\1`, 'g')
      const hits = sources.flatMap(({ f, src }) => (src.match(quoted) ?? []).map(() => f))
      expect(hits, label).toEqual(['lib/data.ts'])
    }
  })

  it('never appear as bare JSX text', () => {
    for (const label of Object.values(ctaLabels)) {
      const text = new RegExp(`>\\s*${esc(label)}\\s*<`)
      for (const { f, src } of sources) expect(src, `${f}: ${label}`).not.toMatch(text)
    }
  })

  it('feed the section copy that repeats them', () => {
    expect(sectionContent.fork.business.cta).toBe(ctaLabels.startProject)
    expect(sectionContent.fork.team.cta).toBe(ctaLabels.hireForRole)
    expect(sectionContent.fork.team.resume).toBe(ctaLabels.downloadResume)
    expect(sectionContent.contact.title).toBe(ctaLabels.startProject)
    expect(sectionContent.fieldMap.cta).toBe(ctaLabels.browseProjects)
    expect(projectsPageContent.eyebrow).toBe(ctaLabels.allProjects)
  })
})
