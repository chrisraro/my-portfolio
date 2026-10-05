import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { LivePreview } from '@/components/ui/live-preview'
import { NoPreviewTag } from '@/components/ui/no-preview-tag'
import { ScrollPreview } from '@/components/ui/scroll-preview'
import { SectionHeading } from '@/components/ui/section-heading'
import { StatusBadge } from '@/components/ui/status-badge'
import { edgeCode, homepageOrder } from '@/lib/board'
import { projects, sectionContent } from '@/lib/data'
import { canLinkLive, fullShotFor, fullShotHeight, isEmbeddable, projectHref } from '@/lib/project-page'
import { cn, extractDomain } from '@/lib/utils'
import type { Project } from '@/types'

/**
 * One product as an open fold-out spread: a magenta flap (who it is, its
 * status, what it does) joined at a crease to a paper leaf (the detail, the
 * ways in, and the real site scrolling in a ScrollPreview). Flaps alternate
 * sides. As it scrolls in, the flap unfolds against its leaf and the leaf
 * slides toward the crease: transform only, so the server HTML is the page.
 */
function Spread({ project, index, position, total }: { project: Project; index: number; position: number; total: number }) {
  const flapRight = index % 2 === 1
  const shot = fullShotFor(project)
  const live = canLinkLive(project) ? project.links.live : undefined
  const domain = live ? extractDomain(live) : undefined
  const titleId = `product-${project.slug}`

  const flapStyle = {
    '--hinge': flapRight ? 'left' : 'right',
    '--flap-from': flapRight ? '-14deg' : '14deg',
    '--tilt-to': flapRight ? '4deg' : '-4deg',
  } as CSSProperties
  const leafStyle = { '--slide-from': flapRight ? '-24px' : '24px' } as CSSProperties

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        'spread grid',
        flapRight ? 'md:grid-cols-[8fr_auto_4fr]' : 'md:grid-cols-[4fr_auto_8fr]',
      )}
    >
      <div className={cn('reveal-flap', flapRight ? 'md:order-3' : 'md:order-1')} style={flapStyle}>
        <div
          className={cn(
            'flap-tilt flex h-full flex-col gap-4 rounded-t bg-accent p-6 text-on-accent sm:p-8',
            flapRight ? 'md:rounded-r md:rounded-tl-none' : 'md:rounded-l md:rounded-tr-none',
          )}
        >
          <p aria-hidden="true" className="edge-code text-[0.8125rem]">
            {edgeCode(position, total, project.band)}
          </p>
          <h3 id={titleId} className="text-fluid-h2">
            {project.title}
          </h3>
          <p className="text-lede">{project.summary}</p>
          <span className="mt-auto self-start rounded-full bg-panel px-3 py-1.5">
            <StatusBadge status={project.status} />
          </span>
        </div>
      </div>

      <span aria-hidden="true" className="crease-fold md:order-2" />

      <div
        className={cn(
          'reveal-leaf grid gap-6 rounded-b border border-line bg-panel p-6 sm:grid-cols-[1fr_minmax(0,15rem)] sm:p-8 lg:grid-cols-[1fr_17rem]',
          flapRight ? 'md:order-1 md:rounded-l md:rounded-br-none' : 'md:order-3 md:rounded-r md:rounded-bl-none',
        )}
        style={leafStyle}
      >
        <div className="flex min-w-0 flex-col">
          <p className="max-w-[60ch] leading-relaxed text-muted-strong">{project.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 sm:mt-auto sm:pt-6">
            {isEmbeddable(project) && live && (
              <LivePreview url={live} title={project.title} staging={project.status === 'staging'} />
            )}
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
        {shot ? (
          <ScrollPreview
            src={shot}
            label={`Scroll preview of ${domain ?? project.title}`}
            href={projectHref(project)}
            shotHeight={fullShotHeight(shot)}
            sizes="(min-width: 1024px) 272px, (min-width: 640px) 240px, calc(100vw - 40px)"
            className="w-full max-w-[17rem] sm:max-w-none"
          />
        ) : (
          <NoPreviewTag project={project} className="aspect-[3/4] w-full max-w-[17rem] sm:max-w-none" />
        )}
      </div>
    </article>
  )
}

export function Products() {
  const order = homepageOrder(projects)
  const products = order.filter((p) => p.band === 'Products')

  return (
    <section id="work" aria-labelledby="work-title" className="overflow-x-clip mx-auto max-w-6xl px-5 pb-[72px] sm:px-8 md:pb-[112px]">
      <SectionHeading
        id="work-title"
        eyebrow={sectionContent.work.eyebrow}
        title={sectionContent.work.title}
      />
      <div className="grid gap-8 md:gap-12">
        {products.map((project, i) => (
          <Spread key={project.id} project={project} index={i} position={i + 1} total={order.length} />
        ))}
      </div>
    </section>
  )
}
