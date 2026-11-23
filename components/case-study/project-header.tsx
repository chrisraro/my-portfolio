import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SECTION_WIDE as SECTION } from '@/components/ui/grid'
import { LivePreview } from '@/components/ui/live-preview'
import { StatusBadge } from '@/components/ui/status-badge'
import { TrailLink } from '@/components/ui/trail-link'
import { caseStudyContent, ctaLabels, paymentGateways, sectorNames } from '@/lib/data'
import { canLinkLive, liveLinkLabel, previewFor } from '@/lib/project-page'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'

interface ProjectHeaderProps {
  project: Project
  /** A flagship's role line. Short pages have none. */
  role?: string
  isCaseStudy?: boolean
}

/**
 * A project page's header, in the trail map's world: the way back to every
 * project, then on the left the eyebrow, the name, what it does and its
 * status; on the right a legend card with the role (a flagship's), the facts
 * in map labels (kind of work, the verified place, when it was built, how it
 * takes payment) and the ways in. "Start a project" is the page's trail-red
 * primary; the live site is the outlined secondary beside it.
 */
export function ProjectHeader({ project, role, isCaseStudy = false }: ProjectHeaderProps) {
  const gateways = project.technologies.filter((t) => paymentGateways.indexOf(t) !== -1)
  const facts = [
    project.sector !== 'product' ? `${project.band} · ${sectorNames[project.sector]}` : project.band,
    project.place ? `Place: ${project.place.name}` : undefined,
    project.dates ? `Built ${project.dates}` : undefined,
    gateways.length ? `Payments: ${gateways.join(', ')}` : undefined,
  ].filter((f): f is string => Boolean(f))
  const live = canLinkLive(project) ? project.links.live : undefined
  const preview = previewFor(project)

  return (
    <header className={cn(SECTION, 'pt-8 lg:pt-16')}>
      <TrailLink href="/projects" text={ctaLabels.allProjects} kind="label" className="text-muted-strong" />

      <div className="mt-6 grid gap-8 md:grid-cols-[7fr_5fr] md:items-start md:gap-12">
        <div className="min-w-0">
          {/* Focusable by script only: a plate navigation moves focus here (components/ui/view-transitions.tsx). */}
          <h1 tabIndex={-1} className="text-page-h1 text-ink">
            {project.title}
          </h1>
          <p className="text-lede mt-5 max-w-[34rem] text-muted-strong">{project.summary}</p>
          <StatusBadge status={project.status} className="mt-6" />
        </div>

        <div className="flex flex-col glass rounded p-6">
          {/* The role is the fact a hiring reader came for: its own line, in readable type. */}
          {role && <p className="max-w-[30rem] text-base text-ink">{role}</p>}
          <ul className={cn('grid gap-1 text-sm text-muted-strong', role && 'mt-5')}>
            {facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/#contact" className="press button-primary">
              {ctaLabels.startProject}
              <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
            </Link>
            {preview && <LivePreview {...preview} />}
            {live && (
              <a href={live} target="_blank" rel="noopener noreferrer" className="press button-secondary">
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
