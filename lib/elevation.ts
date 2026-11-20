import { caseStudies } from '@/lib/case-studies'
import { projects, sectionContent } from '@/lib/data'
import { endOfRange, startOfRange } from '@/lib/dates'
import { placeGroups } from '@/lib/places'
import { buildTimeline, type TimelineEntry } from '@/lib/timeline'

/** A role or degree on the strip: `start` and `end` are fractions of its width. */
export interface StripEntry extends TimelineEntry {
  start: number
  end: number
}

export interface ElevationStripData {
  /** One tick per January, from the earliest start year to now. */
  years: { year: number; at: number }[]
  /** Newest first, as buildTimeline() orders them. */
  entries: StripEntry[]
}

/**
 * The elevation strip (spec §5): the dated route from January of the earliest
 * start to now. `now` is the build time on the static homepage.
 */
export function buildElevationStrip(now: Date = new Date()): ElevationStripData {
  const timeline = buildTimeline()
  const starts = timeline.map((e) => startOfRange(e.date, now))
  const firstYear = new Date(Math.min(...starts)).getUTCFullYear()
  const origin = Date.UTC(firstYear, 0, 1)
  const span = now.getTime() - origin
  const at = (t: number) => Math.min(1, Math.max(0, (t - origin) / span))

  const entries = timeline.map((e, i) => ({ ...e, start: at(starts[i]), end: at(endOfRange(e.date, now)) }))
  const years: { year: number; at: number }[] = []
  for (let year = firstYear; year <= now.getUTCFullYear(); year++) years.push({ year, at: at(Date.UTC(year, 0, 1)) })
  return { years, entries }
}

export interface ElevationFigure {
  value: number
  label: string
}

/** The strip's spot heights: each a count taken from the data, never typed. */
export function elevationFigures(): ElevationFigure[] {
  const { figures } = sectionContent.timeline
  return [
    { value: projects.filter((p) => p.band === 'Products').length, label: figures.products },
    { value: projects.filter((p) => p.status !== 'staging').length, label: figures.shipped },
    { value: caseStudies.length, label: figures.caseStudies },
    { value: placeGroups(projects).length, label: figures.places },
  ]
}
