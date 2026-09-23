import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { StatusBadge } from '@/components/ui/status-badge'
import { caseStudyContent, paymentGateways, sectorNames } from '@/lib/data'
import { canLinkLive } from '@/lib/project-page'
import type { Project } from '@/types'

interface ProjectHeaderProps {
  project: Project
  /** A flagship's role line. Short pages have none. */
  role?: string
  isCaseStudy?: boolean
}

export function ProjectHeader({ project, role, isCaseStudy = false }: ProjectHeaderProps) {
  const gateways = project.technologies.filter((t) => paymentGateways.indexOf(t) !== -1)
  const meta = [role, project.dates, gateways.length ? `Payments: ${gateways.join(', ')}` : undefined].filter(
    (m): m is string => Boolean(m),
  )

  return (
    <header className="mx-auto max-w-6xl px-5 pt-10 sm:px-8 md:pt-14">
      <Link
        href="/projects"
        className="inline-flex min-h-[44px] items-center gap-2 font-mono text-sm text-muted-strong transition-colors hover:text-accent"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        All projects
      </Link>
      <p className="eyebrow mb-3 mt-6">
        {isCaseStudy ? caseStudyContent.eyebrow.caseStudy : caseStudyContent.eyebrow.project}
      </p>
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <h1 className="text-fluid-h1 text-ink">{project.title}</h1>
        <StatusBadge status={project.status} />
      </div>
      <p className="mt-4 max-w-2xl text-lg text-muted-strong">{project.summary}</p>
      <p className="mt-3 font-mono text-xs text-muted">
        {project.band} · {sectorNames[project.sector]}
      </p>
      {meta.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted-strong">
          {meta.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      )}
      {canLinkLive(project) && (
        <a
          href={project.links.live}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded bg-accent px-5 font-medium text-on-accent transition-colors hover:bg-accent/90"
        >
          Open live site
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      )}
    </header>
  )
}
