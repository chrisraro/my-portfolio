import { LivePreview } from '@/components/ui/live-preview'
import { NoPreviewTag } from '@/components/ui/no-preview-tag'
import { ProjectShot, SHOT_ASPECT } from '@/components/ui/project-shot'
import { SECTION } from '@/components/ui/grid'
import { SectionHeading } from '@/components/ui/section-heading'
import { StatusBadge } from '@/components/ui/status-badge'
import { SurveyPlate } from '@/components/ui/survey-plate'
import { TrailLink } from '@/components/ui/trail-link'
import { catalogOrder, projectCode } from '@/lib/board'
import { ctaLabels, projects, sectionContent } from '@/lib/data'
import { canLinkLive, fullShotFor, hasFullShot, previewFor, projectHref } from '@/lib/project-page'
import { cn, extractDomain } from '@/lib/utils'
import type { Project } from '@/types'

/**
 * One own product as a survey plate: a still of the real site (or the printed
 * reason there is none, in the same shot frame) on the plate, then its catalog
 * number (the one /projects shows), name, summary, status, the detail and the
 * ways in. The screenshot links to the page "Read more" names, so it stays out
 * of the tab order.
 */
function Plate({ project, code }: { project: Project; code: string }) {
  const shot = fullShotFor(project)
  const live = canLinkLive(project) ? project.links.live : undefined
  const domain = live ? extractDomain(live) : undefined
  const preview = previewFor(project)
  const titleId = `product-${project.slug}`

  return (
    <article aria-labelledby={titleId} className="flex flex-col">
      <SurveyPlate>
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
          <NoPreviewTag project={project} className={`${SHOT_ASPECT} w-full`} />
        )}
      </SurveyPlate>
      <p aria-hidden="true" className="map-label tabular mt-4 text-muted">{code}</p>
      <h3 id={titleId} className="text-title mt-2 text-ink">{project.title}</h3>
      <p className="mt-2 text-muted-strong">{project.summary}</p>
      <StatusBadge status={project.status} className="mt-3" />
      <p className="mt-4 max-w-[60ch] leading-relaxed text-muted-strong">{project.description}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        {preview && <LivePreview {...preview} />}
        <TrailLink href={projectHref(project)} text={ctaLabels.readMore} srText={` about ${project.title}`} />
        {live && domain && <TrailLink href={live} text={domain} kind="label" external className="text-muted-strong" />}
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
    <section id="products" aria-labelledby="products-title" className={cn(SECTION, 'pb-[72px] md:pb-[112px]')}>
      <SectionHeading id="products-title" title={sectionContent.ownProducts.title} />
      <div className="grid items-start gap-x-8 gap-y-14 md:grid-cols-2">
        {own.map((project) => (
          <Plate key={project.id} project={project} code={projectCode(project, order)} />
        ))}
      </div>
    </section>
  )
}
