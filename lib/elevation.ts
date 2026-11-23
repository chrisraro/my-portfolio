import { caseStudies } from '@/lib/case-studies'
import { projects, sectionContent } from '@/lib/data'
import { placeGroups } from '@/lib/places'
import { isShipped } from '@/lib/proof'

export interface ElevationFigure {
  value: number
  label: string
  /** What the figure counts: the page or homepage section that lists it. */
  href: string
}

/** The homepage's figures: each a count taken from the data, never typed. */
export function elevationFigures(): ElevationFigure[] {
  const { figures } = sectionContent.timeline
  return [
    { value: projects.filter(isShipped).length, label: figures.shipped, href: '/projects' },
    { value: caseStudies.length, label: figures.caseStudies, href: '#journals' },
    { value: placeGroups(projects).length, label: figures.places, href: '#places' },
  ]
}
