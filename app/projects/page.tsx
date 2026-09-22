import { BoardFilter } from '@/components/ui/board-filter'
import { SystemsBoard } from '@/components/ui/systems-board'
import { groupByBand, parseBandParam } from '@/lib/board'
import { projects, projectsPageContent } from '@/lib/data'

interface ProjectsPageProps {
  searchParams: { band?: string | string[] }
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
      <SystemsBoard groups={groupByBand(visible)} label={band ?? 'all projects'} groupHeading="h2" />
    </div>
  )
}
