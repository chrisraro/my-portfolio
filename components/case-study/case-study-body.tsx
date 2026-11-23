import type { ReactNode } from 'react'
import { ReadSpread } from '@/components/case-study/read-spread'
import { SpotHeight } from '@/components/map/spot-height'
import { SECTION_WIDE as SECTION } from '@/components/ui/grid'
import { ProjectRow } from '@/components/ui/project-row'
import { TrailLink } from '@/components/ui/trail-link'
import { FLAGSHIP_SLUGS, caseStudies } from '@/lib/case-studies'
import { caseStudyContent, projects } from '@/lib/data'
import { nextInOrder, projectHref, recommendationFor } from '@/lib/project-page'
import type { CaseStudy, Project } from '@/types'

const P = 'mt-3 text-base leading-relaxed text-muted-strong'

interface EntryProps {
  id: string
  title: string
  children: ReactNode
}

/** One part of a case study: its heading and prose. */
function Entry({ id, title, children }: EntryProps) {
  return (
    <section aria-labelledby={id} className="journal-entry mt-14 first:mt-0">
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

  return (
    <>
      <ReadSpread
        lead={
          <Entry id="brief" title={h.brief}>
            {study.brief.map((p) => (
              <p key={p} className={P}>
                {p}
              </p>
            ))}
          </Entry>
        }
        rail={screenshots}
      >
        <Entry id="built" title={h.built}>
          {study.built.map((p) => (
            <p key={p} className={P}>
              {p}
            </p>
          ))}
        </Entry>

        <Entry id="decisions" title={h.decisions}>
          {/* Each decision: what was chosen, over what, and why. */}
          <ol className="mt-5 grid gap-4">
            {study.decisions.map((d) => (
              <li data-decision key={d.chose} className="grid gap-x-3 border-t border-line pt-4">
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

        <Entry id="stack" title={h.stack}>
          <dl className="mt-4 grid gap-3">
            {study.stack.map((s) => (
              <div key={s.name} className="grid gap-1 border-t border-line pt-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="font-medium text-ink">{s.name}</dt>
                <dd className="text-sm leading-relaxed text-muted-strong">{s.why}</dd>
              </div>
            ))}
          </dl>
        </Entry>

        <Entry id="outcome" title={h.outcome}>
          {study.outcome.map((p) => (
            <p key={p} className={P}>
              {p}
            </p>
          ))}
          {study.metrics && study.metrics.length > 0 && (
            // A legend row of spot heights, as the elevation strip prints its counts:
            // the figure beside its glyph, its label after it. dt comes first, as
            // HTML requires; order-last sets it after the figure.
            <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-y border-line py-5">
              {study.metrics.map((m) => (
                <div key={m.label} className="flex items-baseline gap-2">
                  <dt className="order-last text-sm leading-snug text-muted-strong">{m.label}</dt>
                  <dd className="flex items-baseline gap-2 text-title tabular break-words text-ink">
                    <SpotHeight />
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </Entry>

        {quote && (
          <Entry id="client" title={h.client}>
            <figure className="mt-4">
              <blockquote className="text-lede text-ink">{quote.quote}</blockquote>
              <figcaption className="mt-4 text-sm text-muted-strong">
                {quote.authorName}, {quote.authorTitle}
              </figcaption>
            </figure>
          </Entry>
        )}

        {/* Work told inside this story that also has its own page, e.g. the BeachBus NFC system. */}
        {related.length > 0 && (
          <div className="mt-14">
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
          <p className="text-list pb-3 text-ink">{h.next}</p>
          {/* One row, as on /projects: its link reads its label first, since the nav's name is not part of it. */}
          <ul className="rows border-t border-line">
            <ProjectRow project={next} labelPrefix={h.next} />
          </ul>
        </nav>
      )}
    </>
  )
}
