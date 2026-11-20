import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PhilippinesOutline } from '@/components/map/philippines-outline'
import { SectionHeading } from '@/components/ui/section-heading'
import { projects, sectionContent } from '@/lib/data'
import { MAP_HEIGHT, MAP_VIEWBOX, MAP_WIDTH, project as toMap } from '@/lib/geo'
import { placeGroups, unplacedProjects, type PlaceGroup } from '@/lib/places'
import { projectHref } from '@/lib/project-page'
import type { PlacePrecision, Project } from '@/types'

// Where a place's label sits beside its pin, in map units (layout, not
// content). Naga City's and Bicol's centres are about 19 units apart, so their
// labels go opposite ways; a region's ring is wider than a city's dot.
const LABELS: Record<string, { dx: number; dy: number; anchor: 'start' | 'end' }> = {
  'Naga City': { dx: -14, dy: -10, anchor: 'end' },
  Bicol: { dx: 26, dy: 20, anchor: 'start' },
  Palawan: { dx: 26, dy: 8, anchor: 'start' },
}
const DEFAULT_LABEL = { dx: 14, dy: 7, anchor: 'start' as const }

/**
 * One pin: a ring for a region, a dot for a city, and the place's name. A real
 * link to the place's first project, for crawlers and pointers; it is out of
 * the tab order and the accessibility tree because the place list beside the
 * map links the same pages (one link per project for keyboard and screen
 * readers, as ProjectShot's duplicate link does).
 */
function Pin({ group }: { group: PlaceGroup }) {
  const { x, y } = toMap(group.lat, group.lng)
  const label = LABELS[group.name] ?? DEFAULT_LABEL
  return (
    <a href={projectHref(group.projects[0])} tabIndex={-1} aria-hidden="true" className="map-pin">
      {group.precision === 'region' ? (
        <circle cx={x} cy={y} r={18} className="map-ring fill-none stroke-ink" strokeWidth={2} strokeDasharray="4 3" />
      ) : (
        <circle cx={x} cy={y} r={6} className="map-dot fill-ink" />
      )}
      <text x={Math.round(x + label.dx)} y={Math.round(y + label.dy)} textAnchor={label.anchor} className="map-label fill-ink text-[22px]">
        {group.name}
      </text>
    </a>
  )
}

/** The pin's glyph again, as the key beside a place in the list. */
function PlaceGlyph({ precision }: { precision: PlacePrecision }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-ink">
      {precision === 'region' ? (
        <circle cx={8} cy={8} r={6} fill="none" stroke="currentColor" strokeWidth={1.5} strokeDasharray="3 2" />
      ) : (
        <circle cx={8} cy={8} r={3.5} fill="currentColor" />
      )}
    </svg>
  )
}

function ProjectLink({ project }: { project: Project }) {
  return (
    <Link href={projectHref(project)} className="map-label inline-flex min-h-[44px] items-center text-ink sm:min-h-[32px]">
      <span className="link-draw">{project.title}</span>
    </Link>
  )
}

/**
 * The field map (spec §5): the Philippines with a pin wherever a project's own
 * words name the place, the places listed beside it with their projects, and
 * every other project under "No fixed point", never at a guessed point. All in
 * the server HTML; nothing here runs on the client.
 */
export function FieldMap() {
  const places = placeGroups(projects)
  const unplaced = unplacedProjects(projects)
  const { fieldMap } = sectionContent

  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-6xl px-5 pb-[72px] sm:px-8 md:pb-[112px]">
      <SectionHeading id="work-title" eyebrow={fieldMap.eyebrow} title={fieldMap.title} />
      <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-12">
        <figure className="survey-plate mx-auto w-full max-w-md lg:max-w-none">
          <svg viewBox={MAP_VIEWBOX} aria-hidden="true" focusable="false" className="block h-auto w-full">
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} className="fill-canvas" />
            <PhilippinesOutline />
            {places.map((group) => (
              <Pin key={group.name} group={group} />
            ))}
          </svg>
          <figcaption className="mt-3 px-1 text-sm text-muted-strong">{fieldMap.caption}</figcaption>
        </figure>

        {/* An explicit width, as every grid child here: content-sized, it can collapse. */}
        <div className="w-full min-w-0">
          <h3 className="map-label text-ink">{fieldMap.placesHeading}</h3>
          <ol className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {places.map((group) => (
              <li key={group.name} className="border-t border-line pt-3">
                <p className="flex items-center gap-2 text-ink">
                  <PlaceGlyph precision={group.precision} />
                  <span className="text-title">{group.name}</span>
                </p>
                <p className="map-label mt-1 text-muted">{group.precision === 'region' ? fieldMap.regionNote : group.region}</p>
                <ul className="mt-2">
                  {group.projects.map((p) => (
                    <li key={p.id}>
                      <ProjectLink project={p} />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <h3 className="map-label mt-10 text-ink">{fieldMap.unplacedHeading}</h3>
          <p className="mt-2 max-w-[48ch] text-sm text-muted-strong">{fieldMap.unplacedNote}</p>
          <ul className="mt-3 flex flex-wrap gap-x-6">
            {unplaced.map((p) => (
              <li key={p.id}>
                <ProjectLink project={p} />
              </li>
            ))}
          </ul>

          <Link href="/projects" className="button-label mt-8 inline-flex min-h-[44px] items-center gap-2 text-ink">
            <span className="link-draw">{fieldMap.cta}</span>
            <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
