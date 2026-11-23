import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { MapKey } from '@/components/map/map-key'
import { PlaceGlyph } from '@/components/map/pin'
import { PlaceMap } from '@/components/map/place-map'
import { ListHeading } from '@/components/ui/section-heading'
import { SECTION } from '@/components/ui/grid'
import { TrailLink } from '@/components/ui/trail-link'
import { projects, sectionContent, servicePages } from '@/lib/data'
import { placeGroups } from '@/lib/places'
import { projectHref } from '@/lib/project-page'
import { cn } from '@/lib/utils'

/** The two ways to work together: one row to /services, one to /hire, and the services under the first. */
export function WorkWithMe() {
  const { fork } = sectionContent
  const rows = [
    { ...fork.business, href: '/services' },
    { ...fork.team, href: '/hire' },
  ]

  return (
    <section id="fork" aria-labelledby="fork-title" className={cn(SECTION, 'pt-24')}>
      <ListHeading id="fork-title" title={fork.title} />
      <ul className="rows">
        {rows.map((r) => (
          <li key={r.href} className="rise-in">
            <Link href={r.href} className="row group flex items-center gap-6">
              <div className="min-w-0 flex-1">
                <h3 className="text-row text-ink">{r.title}</h3>
                <span className="mt-1 block leading-relaxed text-muted-strong">{r.body}</span>
              </div>
              <ArrowRight aria-hidden="true" className="arrow-nudge h-5 w-5 shrink-0 text-muted" />
              <span className="sr-only">{r.cta}</span>
            </Link>
          </li>
        ))}
      </ul>
      <ul className="mt-5 flex flex-wrap gap-2">
        {servicePages.map((s) => (
          <li key={s.slug}>
            <Link href={`/services/${s.slug}`} className="press chip">
              {s.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * Where the work runs: the Philippines with a pin wherever a project's own
 * words name the place, and those places listed beside it with their projects.
 */
export function Places() {
  const places = placeGroups(projects)
  const { fieldMap } = sectionContent

  return (
    <section id="places" aria-labelledby="places-title" className={cn(SECTION, 'pt-24')}>
      <ListHeading id="places-title" title={fieldMap.title} count={places.length} />
      <div className="mt-6 grid gap-8 sm:grid-cols-[15rem_1fr]">
        <figure className="mx-auto w-full max-w-[15rem]">
          <PlaceMap places={places} hrefFor={(group) => projectHref(group.projects[0])} />
          <figcaption className="mt-3 text-sm text-muted">
            {fieldMap.caption}
            <MapKey className="mt-2" />
          </figcaption>
        </figure>
        <ol className="grid min-w-0 content-start">
          {places.map((group) => (
            <li key={group.name} className="grid gap-x-4 border-b border-line py-3 first:pt-0 xl:grid-cols-[9rem_1fr]">
              <p className="flex items-center gap-2 text-ink">
                <PlaceGlyph precision={group.precision} />
                <span className="text-row">{group.name}</span>
              </p>
              <ul className="flex flex-wrap gap-x-5">
                {group.projects.map((p) => (
                  <li key={p.id}>
                    <TrailLink href={projectHref(p)} text={p.title} kind="label" className="text-muted-strong" />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
