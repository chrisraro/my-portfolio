import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { describe, expect, it } from 'vitest'
import { PlanTheRoute } from '@/components/sections/plan-the-route'
import { ToastProvider } from '@/components/ui/toaster'

// A framed photo, a screenshot rail and the contact form sit in one plate
// frame, every screenshot at one scale. The frame is written once, by
// SurveyPlate; the homepage's list rows frame nothing, they use a thumbnail.
function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return tsxFiles(full)
    return full.endsWith('.tsx') ? [full] : []
  })
}

describe('survey plates', () => {
  // The class name only: an import of the component's path is not a plate.
  it('are written only by SurveyPlate', () => {
    const offenders = ['app', 'components']
      .flatMap(tsxFiles)
      .map((f) => f.replace(/\\/g, '/'))
      .filter((f) => f !== 'components/ui/survey-plate.tsx')
      .filter((f) => /(?<![/\w-])survey-plate(?![/\w-])/.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })

  it('frame the contact form', () => {
    const html = renderToStaticMarkup(createElement(ToastProvider, null, createElement(PlanTheRoute)))
    expect(html).toContain('class="survey-plate ')
  })

  it('frame the about page’s photos and the project page’s screenshot rail, and nothing else writes one', () => {
    for (const f of ['app/about/page.tsx', 'components/case-study/project-screenshots.tsx']) {
      expect(readFileSync(f, 'utf8'), f).toContain('<SurveyPlate')
    }
  })
})

describe('one screenshot scale', () => {
  it('frames every ProjectShot at the one SHOT_ASPECT, with no ratio to choose', () => {
    const src = readFileSync('components/ui/project-shot.tsx', 'utf8')
    expect(src).not.toMatch(/\bratio\b/)
    expect(src).not.toContain('aspect-[9/16]')
    expect(src).toContain("export const SHOT_ASPECT = 'aspect-[4/3] sm:aspect-[3/4] lg:aspect-[4/3]'")
  })
})
