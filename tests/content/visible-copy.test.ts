import { describe, expect, it } from 'vitest'
import { OFFLINE_REPLY } from '@/lib/chat-context'
import { galleryImages, projects, projectsPageContent } from '@/lib/data'
import { buildProjectsTitle, buildSiteMetadata } from '@/lib/site-metadata'

// House style: no em-dash in copy a visitor reads. The hero lede is not
// covered here: its wording awaits Christian's decision.
const EM_DASH = '—'

describe('visible copy', () => {
  it('uses no em-dash in captions, descriptions, the offline reply or titles', () => {
    const surfaces = [
      ...galleryImages.map((g) => g.caption),
      ...projects.map((p) => p.description),
      projectsPageContent.description,
      OFFLINE_REPLY,
      String(buildSiteMetadata('https://example.test').title),
      buildProjectsTitle(null),
      buildProjectsTitle('Sites'),
    ]
    for (const text of surfaces) expect(text).not.toContain(EM_DASH)
  })

  it('titles /projects for itself, naming the band when filtered', () => {
    expect(buildProjectsTitle(null)).toMatch(/^Projects · /)
    expect(buildProjectsTitle('Custom systems')).toMatch(/^Custom systems · Projects · /)
  })
})
