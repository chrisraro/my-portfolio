import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { PlanTheRoute } from '@/components/sections/plan-the-route'
import { SECTION } from '@/components/ui/grid'
import { PageIntro } from '@/components/ui/page-intro'
import { ProjectPlate } from '@/components/ui/project-plate'
import { SectionHeading } from '@/components/ui/section-heading'
import { TrailLink } from '@/components/ui/trail-link'
import { catalogOrder, projectCode } from '@/lib/board'
import { ctaLabels, pagesUpdated, projects, servicePages, servicesPageContent } from '@/lib/data'
import { hasFullShot } from '@/lib/project-page'
import { buildPageMetadata } from '@/lib/site-metadata'
import { cn } from '@/lib/utils'
import type { Project, ServiceComparison } from '@/types'

interface ServicePageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }))
}

// Three services, known at build time; any other slug is a 404.
export const dynamicParams = false

export function generateMetadata({ params }: ServicePageProps): Metadata {
  const service = servicePages.find((s) => s.slug === params.slug)
  if (!service) return {}
  return buildPageMetadata(service.title, service.answer, `/services/${service.slug}`, [service.keyword])
}

// tests/content/new-pages.test.ts holds every id to a real project.
function byId(id: string): Project {
  const project = projects.find((p) => p.id === id)
  if (!project) throw new Error(`Unknown project id: ${id}`)
  return project
}

/**
 * A comparison as a real table. On a phone it is wider than the screen, so it
 * scrolls sideways inside a labelled region that takes focus (keyboard users
 * can scroll it), never the page.
 */
function Comparison({ comparison }: { comparison: ServiceComparison }) {
  return (
    <div role="region" aria-label={comparison.caption} tabIndex={0} className="overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-left">
        <caption className="text-title mb-5 text-left text-ink">{comparison.caption}</caption>
        <thead>
          <tr>
            {comparison.columns.map((column) => (
              <th key={column} scope="col" className="map-label border-b border-line-strong pb-2 pr-6 text-muted-strong">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparison.rows.map((row) => (
            <tr key={row.need} className="border-b border-line align-top">
              <th scope="row" className="py-4 pr-6 font-semibold text-ink">
                {row.need}
              </th>
              <td className="py-4 pr-6 text-muted-strong">{row.choice}</td>
              <td className="py-4 text-muted-strong">{row.projectIds.map((id) => byId(id).title).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * A service (spec §5, §6): the answer that opens it, question-style h2s with
 * short answers, an honest comparison where the data holds one, the projects
 * that prove it as plates (catalog numbers as on /projects), then the form.
 */
export default function ServicePage({ params }: ServicePageProps) {
  const service = servicePages.find((s) => s.slug === params.slug)
  if (!service) notFound()
  const order = catalogOrder(projects, hasFullShot)
  const { proof } = servicesPageContent

  return (
    <>
      <PageIntro eyebrow={servicesPageContent.eyebrow} title={service.name} answer={service.answer} updated={pagesUpdated}>
        <a href="#contact" className="press button-primary">
          {ctaLabels.startProject}
          <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
        </a>
        <TrailLink href="/services" text={ctaLabels.allServices} />
      </PageIntro>

      <div className={cn(SECTION, 'grid gap-12 pb-[72px] md:pb-[112px]')}>
        {service.sections.map((s, i) => (
          <section key={s.question} aria-labelledby={`question-${i + 1}`} className="max-w-3xl border-t border-line pt-8">
            <h2 id={`question-${i + 1}`} className="text-title text-ink">
              {s.question}
            </h2>
            {s.answer.map((p) => (
              <p key={p} className="mt-4 max-w-[62ch] leading-relaxed text-muted-strong">
                {p}
              </p>
            ))}
          </section>
        ))}
        {service.comparison && <Comparison comparison={service.comparison} />}
      </div>

      <section aria-labelledby="proof-title" className={cn(SECTION, 'pb-[72px] md:pb-[112px]')}>
        <SectionHeading id="proof-title" eyebrow={proof.eyebrow} title={proof.title} />
        <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {service.projectIds.map(byId).map((p) => (
            <ProjectPlate key={p.id} project={p} code={projectCode(p, order)} />
          ))}
        </ul>
      </section>

      <PlanTheRoute />
    </>
  )
}
