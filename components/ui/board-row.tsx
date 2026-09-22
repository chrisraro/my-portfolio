import { ArrowUpRight } from 'lucide-react'
import { StatusBadge } from '@/components/ui/status-badge'
import { cn, extractDomain } from '@/lib/utils'
import type { Project } from '@/types'

const GRID =
  'grid grid-cols-[1fr_auto] items-center gap-4 border-t border-line px-4 py-3 ' +
  'sm:grid-cols-[1.2fr_1fr_auto] md:grid-cols-[1.2fr_1fr_1.3fr_auto]'

// A row links only when there is somewhere to go. A project with no live URL
// renders as a plain row rather than a focusable href="#".
export function BoardRow({ project }: { project: Project }) {
  const href = project.links.live

  const cells = (
    <>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 font-medium text-ink">
          {project.title}
          {href && (
            <ArrowUpRight
              aria-hidden="true"
              className="h-3.5 w-3.5 text-accent opacity-0 transition-opacity group-hover:opacity-100"
            />
          )}
        </span>
        <span className="block font-mono text-xs text-muted">{project.band}</span>
      </span>
      <span className="hidden truncate font-mono text-xs text-muted sm:block">
        {href ? extractDomain(href) : '—'}
      </span>
      <span className="hidden truncate font-mono text-xs text-muted md:block">
        {project.technologies.slice(0, 3).join(' · ')}
      </span>
      <StatusBadge status={project.status} className="justify-self-end" />
    </>
  )

  if (!href) return <li className={GRID}>{cells}</li>

  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          GRID,
          'group relative transition-colors hover:bg-canvas/60',
          'before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-accent',
          'before:opacity-0 before:transition-opacity hover:before:opacity-100',
        )}
      >
        {cells}
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </li>
  )
}
