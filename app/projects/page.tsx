import type { Metadata } from 'next'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { JsonLd } from '@/components/json-ld'
import { MapKey } from '@/components/map/map-key'
import { PlaceMap } from '@/components/map/place-map'
import { SECTION_WIDE } from '@/components/ui/grid'
import { LegendFilter } from '@/components/ui/legend-filter'
import { ProjectRow } from '@/components/ui/project-row'
import { TrailLink } from '@/components/ui/trail-link'
import { groupByBand, parseBandParam, projectCount } from '@/lib/board'
import { ctaLabels, projects, projectsPageContent, sectionContent } from '@/lib/data'
import { project as toMap } from '@/lib/geo'
import { IDENTITY_PAN, panStyle, panTo } from '@/lib/map-pan'
import { placeGroups, unplacedProjects } from '@/lib/places'
import { hasFullShot } from '@/lib/project-page'
import { buildProjectsMetadata } from '@/lib/site-metadata'
import { graphFor } from '@/lib/structured-data'
import { cn } from '@/lib/utils'
import { bandTransitionName } from '@/lib/view-transition'

interface ProjectsPageProps {
  searchParams: { band?: string | string[] }
}

export function generateMetadata({ searchParams }: ProjectsPageProps): Metadata {
  // Every filtered view (?band=...) is the same page to a search engine, so
  // they all canonicalise to the unfiltered /projects.
  return buildProjectsMetadata(parseBandParam(searchParams.band))
}

// Filters on the server from ?band=, so this page ships no JavaScript of its
// own. Reading search params makes it render per request; for rows of
// static data that costs nothing a visitor notices.
//
// The whole inventory as a list, band by band in BAND_ORDER, with the map of
// its verified places beside it; a pin jumps to its row. A filter frames the
// band's pins (lib/map-pan.ts); on a client navigation the layer glides there
// (.map-pan), inside the view-transition island's filter transition.
export default function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const band = parseBandParam(searchParams.band)
  const visible = band ? projects.filter((p) => p.band === band) : projects
  const count = projectCount(visible, projects, band !== null)
  const places = placeGroups(visible)
  const pan = band ? panTo(places.map((g) => toMap(g.lat, g.lng))) : IDENTITY_PAN
  const unpinned = unplacedProjects(visible).length

  return (
    <div className={cn(SECTION_WIDE, 'pb-20 pt-12 lg:pt-24')}>
      <JsonLd data={graphFor('/projects')} />
      <h1 className="text-page-h1 text-ink">{band ?? projectsPageContent.title}</h1>
      <p className="text-lede mt-3 max-w-2xl text-muted-strong">{projectsPageContent.description}</p>

      <div className="mb-10 mt-8">
        <LegendFilter active={band} projects={projects} />
        <p className="tabular mt-3 text-sm text-muted" aria-live="polite">
          {count}
        </p>
      </div>

      <div className="grid gap-12 xl:grid-cols-[1fr_15rem] xl:items-start">
        <div className="grid min-w-0 gap-16">
          {groupByBand(visible, hasFullShot).map((group, bandIndex) => {
            const id = bandTransitionName(group.heading)
            return (
              <section
                key={group.heading}
                aria-labelledby={id}
                className="plate-band min-w-0"
                // Names the band heading while a filter re-lays the list out (.vt-filter).
                style={{ '--vt-band': id } as CSSProperties}
              >
                {/* At the title step under the page's h1, the count tabular and muted. */}
                <h2 id={id} className="text-list flex items-baseline justify-between border-b border-line pb-3 text-ink">
                  {group.heading}
                  <span className="tabular text-sm font-normal text-muted">{group.projects.length}</span>
                </h2>
                <ul className="rows">
                  {group.projects.map((p, i) => (
                    <ProjectRow key={p.id} project={p} eager={bandIndex === 0 && i < 4} />
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
        <figure className="order-first mx-auto w-full max-w-[15rem] xl:order-last xl:sticky xl:top-24 xl:max-w-none">
          {/* The frame clips the pan layer; the layer is the whole map, moved and scaled. */}
          <div className="overflow-hidden rounded">
            <div className="map-pan" style={panStyle(pan)}>
              <PlaceMap places={places} hrefFor={(g) => `#plate-${g.projects[0].slug}`} />
            </div>
          </div>
          <figcaption className="mt-3 text-sm text-muted">
            {sectionContent.fieldMap.caption}
            {unpinned > 0 && ` ${projectsPageContent.unpinned.replace('{count}', String(unpinned))}`}
            <MapKey className="mt-2" />
          </figcaption>
        </figure>
      </div>

      <div className="mt-20 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link href="/#contact" className="press button-primary">
          {ctaLabels.startProject}
          <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
        </Link>
        <TrailLink href="/" text={ctaLabels.backHome} />
      </div>
    </div>
  )
}
