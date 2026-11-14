import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { ProductCard } from '@/components/ui/product-card'
import { StatusPill } from '@/components/ui/status-pill'
import { toCardItem } from '@/lib/catalog'
import { JsonLd } from '@/components/json-ld'
import { FLAGSHIP_SLUGS, getCaseStudy } from '@/lib/case-studies'
import { caseStudyContent, projects } from '@/lib/data'
import { canLinkLive, fullShotFor, liveLinkLabel, nextInOrder, projectHref, recommendationFor, screenshotsFor } from '@/lib/project-page'
import { extractDomain } from '@/lib/utils'
import { buildProjectPageMetadata } from '@/lib/site-metadata'
import { breadcrumbSchema, caseStudySchema, graph } from '@/lib/structured-data'

interface ProjectPageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

// Every project is known at build time; any other slug is a 404.
export const dynamicParams = false

export function generateMetadata({ params }: ProjectPageProps): Metadata {
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) return {}
  const study = getCaseStudy(project.slug)
  // The summary is a dot-separated fragment; the description reads as a sentence.
  const description = study ? study.brief[0] : project.description
  return buildProjectPageMetadata(project, description, projectHref(project))
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="reveal grid gap-4 border-t border-gray-line py-10 md:grid-cols-12 md:gap-10 md:py-14">
      <h2 className="display-md md:col-span-4">{title}</h2>
      <div className="md:col-span-8">{children}</div>
    </section>
  )
}

/**
 * A project as a product page: its pictures on the left, and on the right a
 * panel that stays in view with its name, status, what it is and the way to
 * see it live, then its details as a grouped list. A flagship continues below
 * with its case study; every page ends on the next thing to read.
 */
export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) notFound()
  const study = getCaseStudy(project.slug)
  const item = toCardItem(project)
  const shots = screenshotsFor(project)
  const full = fullShotFor(project)
  const live = canLinkLive(project) ? project.links.live : undefined
  const quote = recommendationFor(project)
  const headings = caseStudyContent.headings

  // After a flagship comes the next flagship; after any other page, the next project.
  const order = study ? FLAGSHIP_SLUGS : projects.map((p) => p.slug)
  const nextSlug = nextInOrder(order, project.slug)
  const next = projects.find((p) => p.slug === nextSlug)
  const related = (study?.related ?? []).flatMap((slug) => projects.filter((p) => p.slug === slug))
  const parent = projects.find((p) => getCaseStudy(p.slug)?.related?.includes(project.slug))

  const details: [string, string][] = [
    ['Type', project.band],
    ['Built for', item.sector],
    ...(project.dates ? [['When', project.dates] as [string, string]] : []),
    ...(study ? [['Role', study.role] as [string, string]] : project.contribution ? [['Role', project.contribution] as [string, string]] : []),
  ]

  return (
    <article className="mx-auto max-w-6xl px-5 pb-20 pt-6 sm:px-8 md:pb-32 md:pt-10">
      <JsonLd data={study ? graph(breadcrumbSchema(project), caseStudySchema(project, study)) : graph(breadcrumbSchema(project))} />
      <Link href="/projects" className="enter inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-gray-text hover:text-ink">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        All projects
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-12 lg:gap-12">
        {/* The pictures. On a phone they follow the panel. */}
        <div className="order-2 space-y-5 lg:order-1 lg:col-span-7">
          {shots.desktop ? (
            <div className="enter card relative aspect-[16/10] overflow-hidden bg-gray-fill">
              <Image
                src={shots.desktop}
                alt={`The first screen of ${item.domain ?? project.title}`}
                fill
                priority
                sizes="(min-width: 1024px) 640px, 100vw"
                quality={70}
                className="object-cover object-top"
              />
            </div>
          ) : (
            <div className="enter card flex aspect-[16/10] items-center justify-center bg-gray-fill p-10 text-center text-gray-text">
              {item.noImage}
            </div>
          )}
          {(full || shots.mobile) && (
            <div className="reveal grid grid-cols-[1.9fr_1fr] gap-5">
              {full && (
                <div className="card relative aspect-[4/5] overflow-hidden bg-gray-fill">
                  <Image src={full} alt={`More of the ${project.title} page`} fill sizes="(min-width: 1024px) 420px, 62vw" quality={60} className="object-cover object-[50%_18%]" />
                </div>
              )}
              {shots.mobile && (
                <div className="card relative aspect-[9/19] overflow-hidden bg-gray-fill">
                  <Image src={shots.mobile} alt={`${project.title} on a phone`} fill sizes="(min-width: 1024px) 220px, 34vw" quality={60} className="object-cover object-top" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* The panel. */}
        <div className="order-1 lg:order-2 lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <p className="enter label">
              {study ? caseStudyContent.eyebrow.caseStudy : caseStudyContent.eyebrow.project} · {project.band}
            </p>
            <h1 className="display-lg mt-3">
              <span className="mask">
                <span>{project.title}</span>
              </span>
            </h1>
            <p className="enter lede mt-4">{project.summary}</p>
            <p className="enter mt-4">
              <StatusPill status={item.status} label={item.statusLabel} />
            </p>
            <p className="enter mt-5 text-gray-text">{project.description}</p>
            <div className="enter mt-7 flex flex-wrap gap-3">
              {live && (
                <a href={live} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  {liveLinkLabel(project)}
                  <ArrowUpRight aria-hidden="true" className="nudge nudge-up h-4 w-4" />
                  <span className="sr-only">
                    {extractDomain(live)} (opens in a new tab)
                  </span>
                </a>
              )}
              <Link href="/#contact" className={live ? 'btn btn-secondary' : 'btn btn-primary'}>
                Start a project like this
              </Link>
            </div>
            {parent && (
              <p className="enter mt-5 text-sm">
                <Link href={projectHref(parent)} className="inline-flex items-center gap-1.5 font-medium">
                  <span className="underline-draw">{caseStudyContent.partOf.replace('{title}', parent.title)}</span>
                  <ArrowRight aria-hidden="true" className="nudge h-4 w-4" />
                </Link>
              </p>
            )}

            <dl className="group-list enter mt-8 text-sm">
              {details.map(([term, value]) => (
                <div key={term} className="flex items-baseline justify-between gap-6 px-5 py-3.5">
                  <dt className="shrink-0 text-gray-text">{term}</dt>
                  <dd className="text-right">{value}</dd>
                </div>
              ))}
              <div className="px-5 py-3.5">
                <dt className="text-gray-text">{headings.stack}</dt>
                <dd className="mt-2">
                  <ul className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <li key={tech} className="capsule">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {study && (
        <div className="mt-16 md:mt-24">
          {study.metrics && study.metrics.length > 0 && (
            <dl className="reveal mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {study.metrics.map((metric) => (
                <div key={metric.label} className="card flex flex-col-reverse justify-end gap-3 p-6 sm:p-8">
                  <dt className="text-gray-text">{metric.label}</dt>
                  <dd className="display-num">{metric.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <Block title={headings.brief}>
            <div className="lede space-y-4">
              {study.brief.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Block>
          <Block title={headings.built}>
            <ul className="group-list">
              {study.built.map((line) => (
                <li key={line} className="px-5 py-4 sm:px-7">
                  {line}
                </li>
              ))}
            </ul>
          </Block>
          {study.decisions.length > 0 && (
            <Block title={headings.decisions}>
              <ul className="grid gap-5">
                {study.decisions.map((decision) => (
                  <li key={decision.chose} className="card p-6 sm:p-7">
                    <p className="font-display text-[1.5rem] leading-tight tracking-[-0.015em]">{decision.chose}</p>
                    <p className="mt-1 text-sm text-gray-text">
                      over <span className="line-through decoration-gray-mid">{decision.over}</span>
                    </p>
                    <p className="mt-4">{decision.because}</p>
                  </li>
                ))}
              </ul>
            </Block>
          )}
          {study.stack.length > 0 && (
            <Block title={headings.stack}>
              <dl className="group-list">
                {study.stack.map((entry) => (
                  <div key={entry.name} className="grid gap-1 px-5 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6 sm:px-7">
                    <dt className="font-medium">{entry.name}</dt>
                    <dd className="text-gray-text">{entry.why}</dd>
                  </div>
                ))}
              </dl>
            </Block>
          )}
          <Block title={headings.outcome}>
            <div className="lede space-y-4">
              {study.outcome.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Block>
        </div>
      )}

      {quote && (
        <figure className="reveal mt-10 rounded-card bg-ink p-8 text-ghost sm:p-12 md:mt-16">
          <p className="text-[0.8125rem] font-medium text-gray-mid">{headings.client}</p>
          <blockquote className="display-md mt-4 max-w-[30ch]">“{quote.quote}”</blockquote>
          <figcaption className="mt-8 text-sm">
            <span className="block font-medium">{quote.authorName}</span>
            <span className="block text-gray-mid">{quote.authorTitle}</span>
          </figcaption>
        </figure>
      )}

      {(related.length > 0 || next) && (
        <aside aria-label="Keep reading" className="mt-16 md:mt-24">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug} className="reveal">
                <p className="label mb-3 px-1">{headings.related}</p>
                <ProductCard item={toCardItem(p)} />
              </li>
            ))}
            {next && !related.includes(next) && (
              <li className="reveal">
                <p className="label mb-3 px-1">{study ? headings.next : 'Next project'}</p>
                <ProductCard item={toCardItem(next)} />
              </li>
            )}
          </ul>
        </aside>
      )}
    </article>
  )
}
