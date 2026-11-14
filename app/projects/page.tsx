import type { Metadata } from 'next'
import { Catalogue } from '@/components/ui/catalogue'
import { groupByBand, parseBandParam, projectCount } from '@/lib/board'
import { toCardItem } from '@/lib/catalog'
import { projects, projectsPageContent } from '@/lib/data'
import { buildProjectsMetadata } from '@/lib/site-metadata'
import { BAND_ORDER } from '@/types'

interface ProjectsPageProps {
  searchParams: { band?: string | string[] }
}

export function generateMetadata({ searchParams }: ProjectsPageProps): Metadata {
  return buildProjectsMetadata(parseBandParam(searchParams.band))
}

// The whole catalogue. ?band= opens it on one segment; the control filters from there.
export default function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const band = parseBandParam(searchParams.band)
  const items = groupByBand(projects).flatMap((group) => group.projects).map(toCardItem)

  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 md:pb-32 md:pt-16">
      <header className="mb-10 md:mb-14">
        <p className="enter label mb-3">{projectsPageContent.eyebrow}</p>
        <h1 className="display-lg max-w-[16ch]">
          <span className="mask">
            <span>{projectsPageContent.title}</span>
          </span>
        </h1>
        <p className="enter lede mt-5 max-w-[36rem] text-gray-text">{projectsPageContent.description}</p>
        <p className="enter mt-4 text-sm tabular-nums text-gray-text">{projectCount(projects, projects, false)}</p>
      </header>
      <Catalogue key={band ?? 'all'} items={items} bands={[...BAND_ORDER]} initial={band} label="Filter projects by type" />
    </div>
  )
}
