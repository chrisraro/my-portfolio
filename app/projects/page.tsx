import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BoardFilter } from '@/components/ui/board-filter'
import { SystemsBoard } from '@/components/ui/systems-board'
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
// time; for fifteen rows of static data that costs nothing a visitor notices.
export default function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const band = parseBandParam(searchParams.band)
  const visible = band ? projects.filter((p) => p.band === band) : projects

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
      <p className="eyebrow mb-3">{projectsPageContent.eyebrow}</p>
      <h1 className="text-fluid-h1 mb-4 text-ink">{projectsPageContent.title}</h1>
      <p className="mb-8 max-w-2xl text-lg text-muted-strong">{projectsPageContent.description}</p>
      <div className="mb-6">
        <BoardFilter active={band} />
      </div>
      <SystemsBoard groups={groupByBand(visible)} groupHeading="h2" outOf={projects.length} />
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-8">
        <Link
          href="/#contact"
          className="inline-flex min-h-[44px] items-center gap-2 rounded bg-accent px-5 font-medium text-on-accent transition-colors hover:bg-accent/90"
        >
          Start a project
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
        <Link href="/" className="inline-flex min-h-[44px] items-center font-mono text-sm text-muted-strong hover:text-accent">
          Back to the homepage
        </Link>
      </div>
    </div>
  )
}
