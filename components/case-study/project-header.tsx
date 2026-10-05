import Link from 'next/link'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { LivePreview } from '@/components/ui/live-preview'
import { StatusBadge } from '@/components/ui/status-badge'
import { caseStudyContent, paymentGateways, sectorNames } from '@/lib/data'
import { canLinkLive, isEmbeddable, liveLinkLabel } from '@/lib/project-page'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'

interface ProjectHeaderProps {
  project: Project
  /** A flagship's role line. Short pages have none. */
  role?: string
  isCaseStudy?: boolean
}

/**
 * The project's front cover: an amber flap (what it is, its name, what it
 * does, its status) joined at a fold crease to a paper leaf (the role, the
 * facts, and the ways in). "Start a project" is the page's one amber fill.
 */
export function ProjectHeader({ project, role, isCaseStudy = false }: ProjectHeaderProps) {
  const gateways = project.technologies.filter((t) => paymentGateways.indexOf(t) !== -1)
  const meta = [
    project.dates ? `Built ${project.dates}` : undefined,
    gateways.length ? `Payments: ${gateways.join(', ')}` : undefined,
  ].filter((m): m is string => Boolean(m))
  const live = canLinkLive(project) ? project.links.live : undefined

  return (
    <header className="mx-auto max-w-6xl px-5 pt-6 sm:px-8 md:pt-8">
      <Link
        href="/projects"
        className="edge-code inline-flex min-h-[44px] items-center gap-2 text-sm text-muted-strong transition-colors hover:text-accent"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        <span className="link-draw">All projects</span>
      </Link>

      <div className="mt-4 grid md:grid-cols-[7fr_auto_5fr]">
        <div
          className={cn(
            'on-plane flex flex-col rounded-t bg-accent p-6 text-on-accent sm:p-8 md:rounded-l md:rounded-tr-none lg:p-10',
            // A flagship's leaf carries the role and meta; a short page's cover stays compact.
            role && 'md:min-h-[26rem]',
          )}
        >
          <p className="eyebrow text-on-accent">
            {isCaseStudy ? caseStudyContent.eyebrow.caseStudy : caseStudyContent.eyebrow.project}
          </p>
          <h1 className="text-page-h1 mt-8 md:mt-auto md:pt-10">{project.title}</h1>
          <p className="text-lede mt-5 max-w-[34rem]">{project.summary}</p>
          {/* Status sits on a paper chip: its glyph colours are tuned for paper, not amber. */}
          <span className="mt-6 self-start rounded-full bg-panel px-3 py-1.5">
            <StatusBadge status={project.status} />
          </span>
        </div>

        <span aria-hidden="true" className="crease-fold" />

        <div className="flex flex-col rounded-b border border-line bg-panel p-6 sm:p-8 md:rounded-r md:rounded-bl-none md:border-l-0">
          {/* The role is the fact a hiring reader came for: its own line, in readable type. */}
          {role && <p className="max-w-[30rem] text-base text-ink">{role}</p>}
          <p className={role ? 'edge-code mt-4 text-xs text-muted' : 'edge-code text-xs text-muted'}>
            {project.band}
            {project.sector !== 'product' ? ` · ${sectorNames[project.sector]}` : ''}
          </p>
          {meta.length > 0 && (
            <ul className="edge-code mt-2 grid gap-1 text-xs text-muted-strong">
              {meta.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-auto md:pt-8">
            <Link
              href="/#contact"
              className="press button-primary"
            >
              Start a project
              <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
            </Link>
            {live && isEmbeddable(project) && (
              <LivePreview url={live} title={project.title} staging={project.status === 'staging'} />
            )}
            {live && (
              <a
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                // Secondary: it leaves the site, so it is outlined; "Start a project" beside it is the filled primary.
                className="press inline-flex min-h-[44px] items-center gap-2 rounded border border-line-strong px-5 py-2.5 font-medium text-ink hover:border-accent hover:text-accent"
              >
                {liveLinkLabel(project)}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
