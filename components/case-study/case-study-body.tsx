import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FLAGSHIP_SLUGS, caseStudies } from '@/lib/case-studies'
import { caseStudyContent, projects } from '@/lib/data'
import { nextInOrder, projectHref, recommendationFor } from '@/lib/project-page'
import type { CaseStudy, Project } from '@/types'

const H2 = 'text-xl font-semibold text-ink'
const P = 'mt-3 text-base leading-relaxed text-muted-strong'
// About 70 characters of Recursive at the body size. A `ch` cap measures the
// wide "0", so 68ch ran to ~87 characters a line.
const MEASURE = 'max-w-[36rem]'
const GRID = 'mx-auto max-w-6xl px-5 sm:px-8'

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-12 first:mt-0">
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
  /** Rendered full width between "The brief" and "What I built". */
  screenshots?: React.ReactNode
}

export function CaseStudyBody({ study, project, screenshots }: CaseStudyBodyProps) {
  const h = caseStudyContent.headings
  const quote = recommendationFor(project)
  // Only flagships that already have a case study are in the reading order.
  const order = FLAGSHIP_SLUGS.filter((slug) => caseStudies.some((s) => s.slug === slug))
  const nextSlug = nextInOrder(order, study.slug)
  const next = nextSlug ? projects.find((p) => p.slug === nextSlug) : undefined

  return (
    <>
      <div className={`${GRID} pt-12 md:pt-16`}>
        <div className={MEASURE}>
          <Section id="brief" title={h.brief}>
            {study.brief.map((p) => (
              <p key={p} className={P}>{p}</p>
            ))}
          </Section>
        </div>
      </div>

      {screenshots}

      <div className={`${GRID} py-12 md:py-16`}>
        <div className={MEASURE}>
          <Section id="built" title={h.built}>
            {study.built.map((p) => (
              <p key={p} className={P}>{p}</p>
            ))}
          </Section>

          <Section id="decisions" title={h.decisions}>
            <ol className="mt-4 grid gap-4">
              {study.decisions.map((d, i) => (
                <li data-decision key={d.chose} className="grid grid-cols-[2rem_1fr] gap-x-3 border-t border-line pt-4">
                  <span aria-hidden="true" className="font-mono text-sm text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-base text-ink">
                      {d.chose} <span className="text-muted">over</span> {d.over}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-strong">{d.because}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="stack" title={h.stack}>
            <dl className="mt-4 grid gap-3">
              {study.stack.map((s) => (
                <div key={s.name} className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-4">
                  <dt className="font-mono text-sm text-ink">{s.name}</dt>
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
                  <div key={m.label} className="flex flex-col-reverse rounded-lg border border-line bg-panel p-4">
                    <dt className="mt-1 text-sm text-muted-strong">{m.label}</dt>
                    <dd className="font-mono text-2xl text-ink">{m.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Section>

          {quote && (
            <Section id="client" title={h.client}>
              <figure className="mt-4 border-l-2 border-accent pl-5">
                <blockquote className="text-base leading-relaxed text-ink">{quote.quote}</blockquote>
                <figcaption className="mt-3 font-mono text-xs text-muted-strong">
                  {quote.authorName}, {quote.authorTitle}
                </figcaption>
              </figure>
            </Section>
          )}
        </div>

        {next && (
          <nav aria-label={h.next} className="mt-16 border-t border-line pt-8">
            <p className="font-mono text-xs text-muted">{h.next}</p>
            <Link
              href={projectHref(next)}
              className="mt-2 inline-flex min-h-[44px] items-center gap-2 text-xl font-semibold text-ink transition-colors hover:text-accent"
            >
              {/* The nav's label is not part of the link's name, so a links list would hear only the title. */}
              <span className="sr-only">{`${h.next}: `}</span>
              {next.title}
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Link>
          </nav>
        )}
      </div>
    </>
  )
}
