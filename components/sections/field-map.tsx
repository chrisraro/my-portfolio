import { PlaceGlyph } from '@/components/map/pin'
import { PlaceMap } from '@/components/map/place-map'
import { SECTION } from '@/components/ui/grid'
import { SectionHeading } from '@/components/ui/section-heading'
import { SurveyPlate } from '@/components/ui/survey-plate'
import { TrailLink } from '@/components/ui/trail-link'
import { projects, sectionContent } from '@/lib/data'
import { placeGroups, unplacedProjects } from '@/lib/places'
import { projectHref } from '@/lib/project-page'
import { cn } from '@/lib/utils'

/**
 * The field map (spec §5): the Philippines with a pin wherever a project's own
 * words name the place, the places listed beside it with their projects, and
 * every other project under "No fixed point", never at a guessed point. A pin
 * opens its place's first project page. All in the server HTML; nothing here
 * runs on the client.
 */
export function FieldMap() {
  const places = placeGroups(projects)
  const unplaced = unplacedProjects(projects)
  const { fieldMap } = sectionContent

  return (
    <section id="work" aria-labelledby="work-title" className={cn(SECTION, 'pb-[72px] md:pb-[112px]')}>
      <SectionHeading id="work-title" eyebrow={fieldMap.eyebrow} title={fieldMap.title} />
      <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-12">
        <SurveyPlate as="figure" className="mx-auto w-full max-w-md lg:max-w-none">
          <PlaceMap places={places} hrefFor={(group) => projectHref(group.projects[0])} />
          <figcaption className="mt-3 px-1 text-sm text-muted-strong">{fieldMap.caption}</figcaption>
        </SurveyPlate>

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
                      <TrailLink href={projectHref(p)} text={p.title} kind="label" />
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
                <TrailLink href={projectHref(p)} text={p.title} kind="label" />
              </li>
            ))}
          </ul>

          <TrailLink href="/projects" text={fieldMap.cta} className="mt-8" />
        </div>
      </div>
    </section>
  )
}
