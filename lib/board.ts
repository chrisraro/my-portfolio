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

/** Does a project have a picture to show (a full-page shot)? Answered by lib/project-page.ts on the server. */
export type HasPreview = (project: Project) => boolean

/**
 * Cards with a preview first, stable otherwise: a tier should open on a card
 * that lifts out to show a real site, not on a printed "no preview" tag.
 * Without a test, the order is unchanged.
 */
export function previewFirst(projects: Project[], hasPreview?: HasPreview): Project[] {
  if (!hasPreview) return projects
  return [...projects.filter((p) => hasPreview(p)), ...projects.filter((p) => !hasPreview(p))]
}

/** One group per band, in the canonical BAND_ORDER, with empty groups dropped. */
export function groupByBand(projects: Project[], hasPreview?: HasPreview): BoardGroup[] {
  return BAND_ORDER.map((band) => ({
    heading: band,
    projects: previewFirst(bySector(projects.filter((p) => p.band === band)), hasPreview),
  })).filter((group) => group.projects.length > 0)
}

/**
 * The homepage shows Applications and Sites together as "Client work" — that is
 * the distinction a visiting client cares about. /projects keeps every band.
 * With a preview test, a tier whose lead card has a preview comes before one
 * with nothing to show (stable otherwise).
 */
export function groupForHomepage(projects: Project[], hasPreview?: HasPreview): BoardGroup[] {
  const groups = [
    { heading: 'Custom systems', projects: previewFirst(bySector(projects.filter((p) => p.band === 'Custom systems')), hasPreview) },
    {
      heading: 'Client work',
      projects: previewFirst(
        bySector(projects.filter((p) => p.band === 'Applications' || p.band === 'Sites')),
        hasPreview,
      ),
    },
  ].filter((group) => group.projects.length > 0)
  if (!hasPreview) return groups
  const leads = (g: BoardGroup) => hasPreview(g.projects[0])
  return [...groups.filter(leads), ...groups.filter((g) => !leads(g))]
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
 * The one order every edge code counts in: the /projects index, band by band
 * in BAND_ORDER. A project keeps its number on the homepage, on /projects
 * (filtered or not) and on a case study's next card. (The gate's critique
 * found the homepage and /projects numbering the same project differently.)
 */
export function catalogOrder(projects: Project[], hasPreview?: HasPreview): Project[] {
  return groupByBand(projects, hasPreview).flatMap((group) => group.projects)
}

/** A project's edge code, e.g. "07 / 18 · Sites", from its place in catalogOrder. */
export function projectCode(project: Project, order: Project[]): string {
  return edgeCode(order.indexOf(project) + 1, order.length, project.band)
}

/**
 * The /projects count line. Unfiltered it states what the hero claims
 * (shipped = everything but staging) beside the whole inventory; filtered, it
 * counts the band against the whole.
 */
export function projectCount(visible: Project[], all: Project[], filtered: boolean): string {
  const staging = (list: Project[]) => list.filter((p) => p.status === 'staging').length
  if (!filtered) {
    const s = staging(all)
    return `${all.length} projects · ${all.length - s} shipped${s ? `, ${s} in staging` : ''}`
  }
  const s = staging(visible)
  return `${visible.length} of ${all.length} projects${s ? ` · ${s} in staging` : ''}`
}

/**
 * A card's edge code: a running index over the whole rack plus a label, so
 * the page reads as one numbered strip ("04 / 18 · Products").
 */
export function edgeCode(position: number, total: number, label: string): string {
  const pad = (n: number) => String(n).padStart(String(total).length, '0')
  return `${pad(position)} / ${pad(total)} · ${label}`
}
