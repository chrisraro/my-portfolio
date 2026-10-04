import { BAND_ORDER, SECTOR_ORDER, type Project, type ProjectBand } from '@/types'

export interface BoardGroup {
  heading: string
  projects: Project[]
}

/**
 * Hospitality first, by SECTOR_ORDER. Stable: projects in the same sector keep
 * their order in `lib/data.ts`, whose own order a test pins and this leaves alone.
 */
export function bySector(projects: Project[]): Project[] {
  return projects
    .map((project, index) => ({ project, index }))
    .sort(
      (a, b) =>
        SECTOR_ORDER.indexOf(a.project.sector) - SECTOR_ORDER.indexOf(b.project.sector) || a.index - b.index,
    )
    .map(({ project }) => project)
}

/** One group per band, in the canonical BAND_ORDER, with empty groups dropped. */
export function groupByBand(projects: Project[]): BoardGroup[] {
  return BAND_ORDER.map((band) => ({
    heading: band,
    projects: bySector(projects.filter((p) => p.band === band)),
  })).filter((group) => group.projects.length > 0)
}

/**
 * The homepage shows Applications and Sites together as "Client work" — that is
 * the distinction a visiting client cares about. /projects keeps every band.
 */
export function groupForHomepage(projects: Project[]): BoardGroup[] {
  return [
    { heading: 'Custom systems', projects: bySector(projects.filter((p) => p.band === 'Custom systems')) },
    {
      heading: 'Client work',
      projects: bySector(projects.filter((p) => p.band === 'Applications' || p.band === 'Sites')),
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

/**
 * Every project in the order the homepage shows it: Products first, then the
 * rack's tiers. The running index on each card's edge code counts in this order.
 */
export function homepageOrder(projects: Project[]): Project[] {
  const products = projects.filter((p) => p.band === 'Products')
  const rest = groupForHomepage(projects.filter((p) => p.band !== 'Products'))
  return [...products, ...rest.flatMap((group) => group.projects)]
}

/**
 * A card's edge code: a running index over the whole rack plus a label, so
 * the page reads as one numbered strip ("04 / 18 · Products").
 */
export function edgeCode(position: number, total: number, label: string): string {
  const pad = (n: number) => String(n).padStart(String(total).length, '0')
  return `${pad(position)} / ${pad(total)} · ${label}`
}
