import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BoardFilter } from '@/components/ui/board-filter'
import { RackTier } from '@/components/ui/rack-tier'
import { groupByBand, parseBandParam } from '@/lib/board'
import { projects, projectsPageContent } from '@/lib/data'
import { buildProjectsMetadata } from '@/lib/site-metadata'

interface ProjectsPageProps {
  searchParams: { band?: string | string[] }
}

export function generateMetadata({ searchParams }: ProjectsPageProps): Metadata {
  // Every filtered view (?band=...) is the same page to a search engine, so
  // they all canonicalise to the unfiltered /projects.
  return buildProjectsMetadata(parseBandParam(searchParams.band))
}

// Filters on the server from ?band=, so this page ships no JavaScript of its
// own. Reading search params makes it render dynamically rather than at build
// time; for eighteen cards of static data that costs nothing a visitor notices.
//
// The whole inventory as the lobby rack: one tier per band, in BAND_ORDER, of
// the same pocket cards the homepage uses. Edge codes count over the unfiltered
// strip, so a card keeps its number when a filter narrows the rack.
export default function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const band = parseBandParam(searchParams.band)
  const strip = groupByBand(projects).flatMap((g) => g.projects)
  const visible = band ? projects.filter((p) => p.band === band) : projects
  const count = band ? `${visible.length} of ${projects.length} projects` : `${projects.length} projects`

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 md:pb-24 md:pt-16">
      <p className="eyebrow mb-3">{projectsPageContent.eyebrow}</p>
      <h1 className="text-page-h1 max-w-[14ch] text-ink">{projectsPageContent.title}</h1>
      <p className="text-lede mt-5 max-w-2xl text-muted-strong">{projectsPageContent.description}</p>
      <p className="mt-8">
        <Link
          href="/#contact"
          className="press button-label inline-flex min-h-[44px] items-center gap-2 rounded bg-accent px-5 py-2.5 text-on-accent"
        >
          Start a project
          <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
        </Link>
      </p>

      <div className="mb-12 mt-14 sm:mb-16">
        <BoardFilter active={band} />
        <p className="edge-code mt-3 text-xs text-muted" aria-live="polite">
          {count}
        </p>
      </div>

      <div className="grid gap-14 sm:gap-20">
        {groupByBand(visible).map((group) => (
          <RackTier key={group.heading} heading={group.heading} projects={group.projects} order={strip} headingLevel="h2" />
        ))}
      </div>

      <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-3 border-t-2 border-line-strong pt-8">
        <Link
          href="/#contact"
          className="press button-label inline-flex min-h-[44px] items-center gap-2 rounded bg-accent px-5 py-2.5 text-on-accent"
        >
          Start a project
          <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
        </Link>
        <Link href="/" className="button-label inline-flex min-h-[44px] items-center text-ink hover:text-accent">
          <span className="link-draw">Back to the homepage</span>
        </Link>
      </div>
    </div>
  )
}
