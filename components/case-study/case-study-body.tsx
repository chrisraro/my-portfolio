import type { ReactNode } from 'react'
import { ReadSpread } from '@/components/case-study/read-spread'
import { SECTION } from '@/components/ui/grid'
import { ProjectPlate } from '@/components/ui/project-plate'
import { TrailLink } from '@/components/ui/trail-link'
import { catalogOrder, projectCode } from '@/lib/board'
import { FLAGSHIP_SLUGS, caseStudies } from '@/lib/case-studies'
import { caseStudyContent, projects } from '@/lib/data'
import { hasFullShot, nextInOrder, projectHref, recommendationFor } from '@/lib/project-page'
import type { CaseStudy, Project } from '@/types'

const P = 'mt-3 text-base leading-relaxed text-muted-strong'

interface EntryProps {
  id: string
  /** Its place on the route, in reading order. */
  step: number
  title: string
  children: ReactNode
}

/**
 * One entry of the trail journal: a waypoint on a dashed route line, numbered
 * in reading order (an ink ring), then its heading and prose. Nothing defers
 * or moves: the ring sits outside the entry's box, which containment would clip.
 */
function Entry({ id, step, title, children }: EntryProps) {
  return (
    <section aria-labelledby={id} className="journal-entry relative mt-14 border-l border-dashed border-line-strong pb-2 pl-8 first:mt-0">
      <span
        aria-hidden="true"
        className="journal-step map-label tabular absolute -left-[13px] top-0 flex h-[26px] w-[26px] items-center justify-center rounded-full border-2 border-ink bg-canvas text-ink"
      >
        {step}
      </span>
      <h2 id={id} className="text-title text-ink">
        {title}
      </h2>
      {children}
    </section>
  )
}

interface CaseStudyBodyProps {
  study: CaseStudy
  project: Project
  /** The screenshot rail: beside the prose from 1024px, after "The brief" below it. */
  screenshots?: ReactNode
}

/**
 * A flagship as a trail journal (spec §5): the brief, what was built, the
 * decisions (what was chosen, over what, and why), the stack, the outcome and
 * the client's own words, each a numbered waypoint on one route. Work told
 * inside this story that has its own page follows; the next case study is the
 * route's next stop, a plate as on /projects.
 */
export function CaseStudyBody({ study, project, screenshots }: CaseStudyBodyProps) {
  const h = caseStudyContent.headings
  const quote = recommendationFor(project)
  // Only flagships that already have a case study are in the reading order.
  const order = FLAGSHIP_SLUGS.filter((slug) => caseStudies.some((s) => s.slug === slug))
  const nextSlug = nextInOrder(order, study.slug)
  const next = nextSlug ? projects.find((p) => p.slug === nextSlug) : undefined
  const related = (study.related ?? [])
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p))
  const strip = catalogOrder(projects, hasFullShot)

  return (
    <>
      <ReadSpread
        lead={
          <Entry id="brief" step={1} title={h.brief}>
            {study.brief.map((p) => (
              <p key={p} className={P}>
                {p}
              </p>
            ))}
          </Entry>
        }
        rail={screenshots}
      >
        <Entry id="built" step={2} title={h.built}>
          {study.built.map((p) => (
            <p key={p} className={P}>
              {p}
            </p>
          ))}
        </Entry>

        <Entry id="decisions" step={3} title={h.decisions}>
          {/* Each decision: what was chosen, over what, and why. */}
          <ol className="mt-5 grid gap-4">
            {study.decisions.map((d, i) => (
              <li data-decision key={d.chose} className="grid grid-cols-[2.25rem_1fr] gap-x-3 rounded-sm border border-line bg-panel p-5">
                <span aria-hidden="true" className="map-label tabular pt-1 text-muted">
                  {i + 1}
                </span>
                <div>
                  <p className="text-base text-ink">
                    {d.chose} <span className="text-muted">over</span> {d.over}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-strong">{d.because}</p>
                </div>
              </li>
            ))}
          </ol>
        </Entry>

        <Entry id="stack" step={4} title={h.stack}>
          <dl className="mt-4 grid gap-3">
            {study.stack.map((s) => (
              <div key={s.name} className="grid gap-1 border-t border-line pt-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="map-label pt-0.5 text-ink">{s.name}</dt>
                <dd className="text-sm leading-relaxed text-muted-strong">{s.why}</dd>
              </div>
            ))}
          </dl>
        </Entry>

        <Entry id="outcome" step={5} title={h.outcome}>
          {study.outcome.map((p) => (
            <p key={p} className={P}>
              {p}
            </p>
          ))}
          {study.metrics && study.metrics.length > 0 && (
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {study.metrics.map((m) => (
                // dt before dd, as HTML requires; flex-col-reverse puts the number on top.
                <div key={m.label} className="flex flex-col-reverse rounded-sm border border-line bg-panel p-4">
                  <dt className="mt-1 text-sm text-muted-strong">{m.label}</dt>
                  <dd className="text-numeral break-words text-ink">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </Entry>

        {quote && (
          <Entry id="client" step={6} title={h.client}>
            <figure className="mt-4 rounded-sm border border-line bg-panel p-6">
              <blockquote className="text-lede text-ink">{quote.quote}</blockquote>
              <figcaption className="map-label mt-4 text-muted-strong">
                {quote.authorName}, {quote.authorTitle}
              </figcaption>
            </figure>
          </Entry>
        )}

        {/* Work told inside this story that also has its own page, e.g. the BeachBus NFC system. */}
        {related.length > 0 && (
          <div className="mt-14 pl-8">
            <p className="map-label text-muted-strong">{h.related}</p>
            <ul className="mt-2 flex flex-wrap gap-x-6">
              {related.map((p) => (
                <li key={p.slug}>
                  <TrailLink href={projectHref(p)} text={p.title} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </ReadSpread>

      {next && (
        <nav aria-label={h.next} className={SECTION}>
          <p className="map-label mb-5 text-ink">{h.next}</p>
          {/* One plate, as on /projects: its link reads its label first, since the nav's name is not part of it. */}
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ProjectPlate project={next} code={projectCode(next, strip)} labelPrefix={h.next} />
          </ul>
        </nav>
      )}
    </>
  )
}
