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
 * One product as a card: a still screenshot of the real site across the top,
 * wide enough to read, then who it is for, its status, what it does and the
 * ways in. In the markup the text comes first and the picture last (it repeats
 * the "Read more" link, so it is out of the tab order); the grid shows the
 * picture first. Nothing about it moves with scroll.
 */
function ProductCard({ project, code }: { project: Project; code: string }) {
  const shot = fullShotFor(project)
  const live = canLinkLive(project) ? project.links.live : undefined
  const domain = live ? extractDomain(live) : undefined
  const titleId = `product-${project.slug}`
  const preview = previewFor(project)

  return (
    <article aria-labelledby={titleId} className="flex flex-col rounded border border-line bg-panel">
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <p aria-hidden="true" className="edge-code text-[0.8125rem] text-muted">
          {code}
        </p>
        <h3 id={titleId} className="text-fluid-h2 mt-3 text-ink">
          {project.title}
        </h3>
        <p className="text-lede mt-3 text-ink">{project.summary}</p>
        <p className="mt-4">
          <StatusBadge status={project.status} />
        </p>
        <p className="mt-4 max-w-[60ch] leading-relaxed text-muted-strong">{project.description}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-6">
          {preview && <LivePreview {...preview} />}
          <Link
            href={projectHref(project)}
            className="button-label inline-flex min-h-[44px] items-center gap-2 text-ink hover:text-accent"
          >
            <span className="link-draw">Read more</span>
            <span className="sr-only">{` about ${project.title}`}</span>
            <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
          </Link>
          {live && domain && (
            <a
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              className="edge-code inline-flex min-h-[44px] items-center gap-1.5 text-sm text-accent"
            >
              <span className="link-draw">{domain}</span>
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
      <div className="order-first p-2 pb-0">
        {shot ? (
          <ProjectShot
            src={shot}
            label={`Screenshot of ${domain ?? project.title}`}
            href={projectHref(project)}
            duplicateLink
            slug={project.slug}
            sizes="(min-width: 1152px) 540px, (min-width: 768px) 48vw, calc(100vw - 56px)"
            className="aspect-[16/10] w-full"
          />
        ) : (
          <NoPreviewTag project={project} className="aspect-[16/10] w-full" />
        )}
      </div>
    </article>
  )
}

export function Products() {
  const order = catalogOrder(projects, hasFullShot)
  const products = order.filter((p) => p.band === 'Products')

  return (
    <section id="work" aria-labelledby="work-title" className="overflow-x-clip mx-auto max-w-6xl px-5 pb-[72px] sm:px-8 md:pb-[112px]">
      <SectionHeading
        id="work-title"
        eyebrow={sectionContent.work.eyebrow}
        title={sectionContent.work.title}
      />
      <div className="grid gap-6 md:grid-cols-2">
        {products.map((project) => (
          <ProductCard key={project.id} project={project} code={projectCode(project, order)} />
        ))}
      </div>
    </section>
  )
}
