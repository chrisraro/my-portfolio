import type { Metadata } from 'next'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { JsonLd } from '@/components/json-ld'
import { PlaceMap } from '@/components/map/place-map'
import { SECTION } from '@/components/ui/grid'
import { LegendFilter } from '@/components/ui/legend-filter'
import { ProjectPlate } from '@/components/ui/project-plate'
import { SurveyPlate } from '@/components/ui/survey-plate'
import { TrailLink } from '@/components/ui/trail-link'
import { catalogOrder, groupByBand, parseBandParam, projectCode, projectCount } from '@/lib/board'
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
// own. Reading search params makes it render per request; for twenty plates of
// static data that costs nothing a visitor notices.
//
// The whole inventory as a map and a list of the same data (spec §5): the map
// pins every verified place of the projects shown, each pin jumping to its
// plate; the list stands every project as a plate, band by band in BAND_ORDER.
// Catalog numbers count in catalogOrder, so a plate keeps its number when a
// filter narrows the list, and matches the homepage. A filter frames the
// band's pins (lib/map-pan.ts); on a client navigation the layer glides there
// (.map-pan), inside the view-transition island's filter transition.
export default function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const band = parseBandParam(searchParams.band)
  const order = catalogOrder(projects, hasFullShot)
  const visible = band ? projects.filter((p) => p.band === band) : projects
  const count = projectCount(visible, projects, band !== null)
  const eyebrow = band ? projectsPageContent.bandEyebrow.replace('{band}', band) : projectsPageContent.eyebrow
  const places = placeGroups(visible)
  const pan = band ? panTo(places.map((g) => toMap(g.lat, g.lng))) : IDENTITY_PAN
  const unpinned = unplacedProjects(visible).length

  return (
    <div className={cn(SECTION, 'pb-16 pt-12 md:pb-24 md:pt-16')}>
      <JsonLd data={graphFor('/projects')} />
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h1 className="text-page-h1 max-w-[14ch] text-ink">{projectsPageContent.title}</h1>
      <p className="text-lede mt-5 max-w-2xl text-muted-strong">{projectsPageContent.description}</p>

      <div className="mb-12 mt-12">
        <LegendFilter active={band} projects={projects} />
        <p className="map-label tabular mt-3 text-muted" aria-live="polite">
          {count}
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:items-start">
        <SurveyPlate as="figure" className="mx-auto w-full max-w-[20rem] sm:max-w-sm lg:sticky lg:top-24 lg:max-w-none">
          {/* The frame clips the pan layer; the layer is the whole map, moved and scaled. */}
          <div className="overflow-hidden">
            <div className="map-pan" style={panStyle(pan)}>
              <PlaceMap places={places} hrefFor={(g) => `#plate-${g.projects[0].slug}`} />
            </div>
          </div>
          <figcaption className="mt-3 px-1 text-sm text-muted-strong">
            {sectionContent.fieldMap.caption}
            {unpinned > 0 && ` ${projectsPageContent.unpinned.replace('{count}', String(unpinned))}`}
          </figcaption>
        </SurveyPlate>

        <div className="grid min-w-0 gap-16">
          {groupByBand(visible, hasFullShot).map((group) => {
            const id = bandTransitionName(group.heading)
            return (
              <section
                key={group.heading}
                aria-labelledby={id}
                className="plate-band min-w-0"
                // Names the band heading while a filter re-lays the list out (.vt-filter).
                style={{ '--vt-band': id } as CSSProperties}
              >
                <h2 id={id} className="map-label mb-5 text-ink">
                  {group.heading}
                  <span className="tabular text-muted"> · {group.projects.length}</span>
                </h2>
                <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2">
                  {group.projects.map((p) => (
                    <ProjectPlate key={p.id} project={p} code={projectCode(p, order)} />
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
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
