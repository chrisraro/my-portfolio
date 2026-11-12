import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { GithubActivityPanel } from '@/components/sections/github-activity'
import { githubContent, sectionContent } from '@/lib/data'
import { shapeActivity } from '@/lib/github'
import { githubPayload } from '../helpers/github-fixture'

const activity = shapeActivity(githubPayload(), 'chrisraro', 'https://github.com/chrisraro')
if (!activity) throw new Error('fixture did not shape')
const html = renderToStaticMarkup(<GithubActivityPanel activity={activity} />)

describe('GithubActivityPanel', () => {
  it('is a labelled section with its heading from the data', () => {
    expect(html).toContain('<section id="github" aria-labelledby="github-title"')
    expect(html).toContain(sectionContent.github.title)
    expect(html).toContain(githubContent.reposLabel)
  })

  it('draws one cell per day and names the chart in words', () => {
    // The full year, plus the phone's latest 26 weeks.
    const days = activity.weeks.flat().length + activity.weeks.slice(-26).flat().length
    expect(html.match(/<rect x=/g)).toHaveLength(days)
    expect(html).toContain(githubContent.phoneRange)
    expect(html).toMatch(/role="img" aria-label="[\d,]+ contributions in the last year, on [\d,]+ active days"/)
  })

  it('never uses green: green means a live system', () => {
    expect(html).not.toMatch(/\b(fill|bg|text)-live\b/)
    expect(html).not.toContain('live-pulse')
  })

  it('is at rest in the server HTML', () => {
    expect(html).not.toMatch(/opacity:\s*0/)
  })

  it('links out safely to the profile and each repository', () => {
    expect(html).toContain('href="https://github.com/chrisraro"')
    expect(html).toContain('href="https://github.com/chrisraro/my-portfolio"')
    const externals = html.match(/<a [^>]*target="_blank"[^>]*>/g) ?? []
    expect(externals).toHaveLength(1 + activity.repos.length)
    expect(externals.every((a) => a.includes('rel="noopener noreferrer"'))).toBe(true)
  })
})
