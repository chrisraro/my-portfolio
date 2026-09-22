import { BAND_ORDER, type Project, type ProjectBand } from '@/types'

export interface BoardGroup {
  heading: string
  projects: Project[]
}

/** One group per band, in the canonical BAND_ORDER, with empty groups dropped. */
export function groupByBand(projects: Project[]): BoardGroup[] {
  return BAND_ORDER.map((band) => ({
    heading: band,
    projects: projects.filter((p) => p.band === band),
  })).filter((group) => group.projects.length > 0)
}

/**
 * The homepage shows Applications and Sites together as "Client work" — that is
 * the distinction a visiting client cares about. /projects keeps every band.
 */
export function groupForHomepage(projects: Project[]): BoardGroup[] {
  return [
    { heading: 'Custom systems', projects: projects.filter((p) => p.band === 'Custom systems') },
    {
      heading: 'Client work',
      projects: projects.filter((p) => p.band === 'Applications' || p.band === 'Sites'),
    },
  ].filter((group) => group.projects.length > 0)
}

export function bandSlug(band: ProjectBand): string {
  return band.toLowerCase().replace(/\s+/g, '-')
}

/**
 * Reads `?band=` from /projects. Missing or unknown means "show everything".
 * Case-insensitive: a hand-typed `?band=Sites` should not silently show all.
 */
export function parseBandParam(value: string | string[] | undefined): ProjectBand | null {
  const slug = (Array.isArray(value) ? value[0] : value)?.trim().toLowerCase()
  return BAND_ORDER.find((band) => bandSlug(band) === slug) ?? null
}
