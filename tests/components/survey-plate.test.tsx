import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { SurveyPlate } from '@/components/ui/survey-plate'

// Spec §3: every photo and screenshot sits in one pale plate frame.
describe('SurveyPlate', () => {
  it('is a block by default, the plate class and nothing else', () => {
    expect(renderToStaticMarkup(<SurveyPlate>x</SurveyPlate>)).toBe('<div class="survey-plate">x</div>')
  })

  it('can be the figure around a map and its caption, or a span inside a link', () => {
    expect(renderToStaticMarkup(<SurveyPlate as="figure" className="mx-auto">x</SurveyPlate>)).toBe(
      '<figure class="survey-plate mx-auto">x</figure>',
    )
    expect(renderToStaticMarkup(<SurveyPlate as="span">x</SurveyPlate>)).toBe('<span class="survey-plate">x</span>')
  })

  it('can itself be the link, named by its own content', () => {
    const html = renderToStaticMarkup(
      <SurveyPlate href="/projects/graceland-bicolano-dining" className="lift-card">
        x
      </SurveyPlate>,
    )
    expect(html).toMatch(/^<a /)
    expect(html).toContain('href="/projects/graceland-bicolano-dining"')
    expect(html).not.toContain('aria-labelledby')
    expect(html).toContain('class="survey-plate lift-card"')
  })
})
