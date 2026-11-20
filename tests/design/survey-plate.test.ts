import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { describe, expect, it } from 'vitest'
import { FieldMap } from '@/components/sections/field-map'
import { OwnProducts } from '@/components/sections/own-products'
import { PlanTheRoute } from '@/components/sections/plan-the-route'
import { Trailhead } from '@/components/sections/trailhead'
import { ToastProvider } from '@/components/ui/toaster'

// Spec §3: every photo, screenshot and map sits in one plate frame, every
// screenshot at one scale. S2 final review, carry-over 2: the homepage's four
// hand-rolled plates go through SurveyPlate.
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

  it('frame the portrait, the field map, each own product and the form', () => {
    const sections = [
      createElement(Trailhead),
      createElement(FieldMap),
      createElement(OwnProducts),
      createElement(ToastProvider, null, createElement(PlanTheRoute)),
    ]
    for (const node of sections) expect(renderToStaticMarkup(node)).toContain('class="survey-plate')
  })
})

describe('one screenshot scale', () => {
  it('frames every ProjectShot at 3:4, with no ratio to choose', () => {
    const src = readFileSync('components/ui/project-shot.tsx', 'utf8')
    expect(src).not.toMatch(/\bratio\b/)
    expect(src).not.toContain('aspect-[9/16]')
    expect(src).toContain("'aspect-[3/4]'")
  })
})
