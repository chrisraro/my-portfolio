import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { LivePreview } from '@/components/ui/live-preview'
import { NoPreviewTag } from '@/components/ui/no-preview-tag'
import { ProjectShot } from '@/components/ui/project-shot'
import { SectionHeading } from '@/components/ui/section-heading'
import { StatusBadge } from '@/components/ui/status-badge'
import { catalogOrder, projectCode } from '@/lib/board'
import { projects, sectionContent } from '@/lib/data'
import { canLinkLive, fullShotFor, hasFullShot, previewFor, projectHref } from '@/lib/project-page'
import { extractDomain } from '@/lib/utils'
import type { Project } from '@/types'

/**
 * One own product as a survey plate: a still of the real site (or the printed
 * reason there is none) in the plate frame, then its catalog number (the one
 * /projects shows), name, summary, status, the detail and the ways in. The
 * screenshot links to the page "Read more" names, so it stays out of the tab
 * order.
 */
function Plate({ project, code }: { project: Project; code: string }) {
  const shot = fullShotFor(project)
  const live = canLinkLive(project) ? project.links.live : undefined
  const domain = live ? extractDomain(live) : undefined
  const preview = previewFor(project)
  const titleId = `product-${project.slug}`

  return (
    <article aria-labelledby={titleId} className="flex flex-col">
      <div className="survey-plate">
        {shot ? (
          <ProjectShot
            src={shot}
            label={`Screenshot of ${domain ?? project.title}`}
            href={projectHref(project)}
            duplicateLink
            slug={project.slug}
            sizes="(min-width: 768px) 520px, calc(100vw - 58px)"
            className="w-full"
          />
        ) : (
          <NoPreviewTag project={project} className="aspect-[3/4] w-full" />
        )}
      </div>
      <p aria-hidden="true" className="map-label tabular mt-4 text-muted">{code}</p>
      <h3 id={titleId} className="text-title mt-2 text-ink">{project.title}</h3>
      <p className="mt-2 text-muted-strong">{project.summary}</p>
      <StatusBadge status={project.status} className="mt-3" />
      <p className="mt-4 max-w-[60ch] leading-relaxed text-muted-strong">{project.description}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        {preview && <LivePreview {...preview} />}
        <Link href={projectHref(project)} className="button-label inline-flex min-h-[44px] items-center gap-2 text-ink">
          <span className="link-draw">Read more</span>
          <span className="sr-only">{` about ${project.title}`}</span>
          <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
        </Link>
        {live && domain && (
          <a href={live} target="_blank" rel="noopener noreferrer" className="map-label inline-flex min-h-[44px] items-center gap-1.5 text-muted-strong">
            <span className="link-draw">{domain}</span>
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  )
}

/**
 * His own products (spec §5) as the page's largest plates: two to a row from
 * 768px, every plate at one scale on one baseline.
 */
export function OwnProducts() {
  const order = catalogOrder(projects, hasFullShot)
  const own = order.filter((p) => p.band === 'Products')

  return (
    <section id="products" aria-labelledby="products-title" className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 md:pb-24">
      <SectionHeading id="products-title" eyebrow={sectionContent.ownProducts.eyebrow} title={sectionContent.ownProducts.title} />
      <div className="grid items-start gap-x-8 gap-y-14 md:grid-cols-2">
        {own.map((project) => (
          <Plate key={project.id} project={project} code={projectCode(project, order)} />
        ))}
      </div>
    </section>
  )
}
