import Link from 'next/link'
import { ArrowLinkText } from '@/components/case-study/arrow-link-text'
import { ReadSpread } from '@/components/case-study/read-spread'
import { RackCard } from '@/components/ui/rack-card'
import { edgeCode, homepageOrder } from '@/lib/board'
import { FLAGSHIP_SLUGS, caseStudies } from '@/lib/case-studies'
import { caseStudyContent, projects } from '@/lib/data'
import { hasFullShot, nextInOrder, projectHref, recommendationFor } from '@/lib/project-page'
import type { CaseStudy, Project } from '@/types'

// Section headings sit at the Title tier; prose reads in Figtree.
const H2 = 'text-title text-ink'
const P = 'mt-3 text-base leading-relaxed text-muted-strong'

// Sections render lazily (.defer-render) unless their content tilts out of
// their box: the decision panels fold in perspective.
function Section({ id, title, defer = true, children }: { id: string; title: string; defer?: boolean; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className={defer ? 'defer-render mt-14 first:mt-0' : 'mt-14 first:mt-0'}>
      <h2 id={id} className={H2}>
        {title}
      </h2>
      {children}
    </section>
  )
}

interface CaseStudyBodyProps {
  study: CaseStudy
  project: Project
  /** The preview rail: beside the prose from 1024px, after "The brief" below it. */
  screenshots?: React.ReactNode
}

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
  const strip = homepageOrder(projects, hasFullShot)

  return (
    <>
      <ReadSpread
        lead={
          <Section id="brief" title={h.brief}>
            {study.brief.map((p) => (
              <p key={p} className={P}>{p}</p>
            ))}
          </Section>
        }
        rail={screenshots}
      >
        <Section id="built" title={h.built}>
          {study.built.map((p) => (
            <p key={p} className={P}>{p}</p>
          ))}
        </Section>

        <Section id="decisions" title={h.decisions} defer={false}>
          {/* Numbered fold panels: what was chosen, over what, and why. */}
          <ol className="mt-5 grid gap-4 [perspective:1600px]">
            {study.decisions.map((d, i) => (
              <li
                data-decision
                key={d.chose}
                className="reveal-fold relative grid grid-cols-[2.25rem_1fr] gap-x-3 rounded border border-line bg-panel p-5"
              >
                <span aria-hidden="true" className="text-numeral text-[2rem] text-accent">
                  {i + 1}
                </span>
                <div>
                  <p className="text-base text-ink">
                    {d.chose} <span className="text-muted">over</span> {d.over}
                  </p>
                  <span aria-hidden="true" className="crease-h my-3 block" />
                  <p className="text-sm leading-relaxed text-muted-strong">{d.because}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="stack" title={h.stack}>
          <dl className="mt-4 grid gap-3">
            {study.stack.map((s) => (
              <div key={s.name} className="grid gap-1 border-t border-line pt-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="edge-code text-sm text-ink">{s.name}</dt>
                <dd className="text-sm leading-relaxed text-muted-strong">{s.why}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="outcome" title={h.outcome}>
          {study.outcome.map((p) => (
            <p key={p} className={P}>{p}</p>
          ))}
          {study.metrics && study.metrics.length > 0 && (
            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {study.metrics.map((m) => (
                // dt before dd, as HTML requires; flex-col-reverse puts the number on top.
                <div key={m.label} className="flex flex-col-reverse rounded border border-line bg-panel p-4">
                  <dt className="mt-1 text-sm text-muted-strong">{m.label}</dt>
                  <dd className="text-numeral text-[2.25rem] text-ink">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </Section>

        {quote && (
          <Section id="client" title={h.client}>
            <figure className="mt-4 rounded border border-line bg-panel p-6">
              <blockquote className="text-lede text-ink">{quote.quote}</blockquote>
              <figcaption className="edge-code mt-4 text-xs text-muted-strong">
                {quote.authorName}, {quote.authorTitle}
              </figcaption>
            </figure>
          </Section>
        )}

        {/* Work told inside this story that also has its own page, e.g. the BeachBus NFC system. */}
        {related.length > 0 && (
          <div className="mt-14 flex flex-wrap items-center gap-x-5 border-t border-line pt-4">
            <p className="edge-code text-xs text-muted-strong">{h.related}</p>
            <ul className="flex flex-wrap gap-x-5">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={projectHref(p)}
                    className="inline-block min-h-[44px] py-2.5 text-base font-medium text-ink transition-colors hover:text-accent"
                  >
                    <ArrowLinkText text={p.title} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </ReadSpread>

      {next && (
        <nav aria-label={h.next} className="rack-shelf mx-auto max-w-6xl px-5 sm:px-8">
          <p className="edge-code mb-5 text-sm text-ink sm:mb-8">{h.next}</p>
          {/* One pocket of the rack: the card's link reads its label first, since the nav's name is not part of it. */}
          <ul className="rack-row flex sm:grid sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            <RackCard
              project={next}
              code={edgeCode(strip.indexOf(next) + 1, strip.length, next.band)}
              column={0}
              labelPrefix={h.next}
            />
          </ul>
        </nav>
      )}
    </>
  )
}
