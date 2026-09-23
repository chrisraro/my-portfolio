import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { StatusBadge } from '@/components/ui/status-badge'
import { projectHref } from '@/lib/project-page'
import { cn, extractDomain } from '@/lib/utils'
import type { Project } from '@/types'

// One column system for the header and every row. The status track is a fixed
// width: an `auto` track sized itself to each row's label ("Live" versus
// "Early access"), so the domain column started at a different x on each row.
// The "what it does" track is the widest: it is the column a client reads.
export const BOARD_COLUMNS =
  'grid grid-cols-[1fr_7.5rem] items-center gap-4 px-4 ' +
  'sm:grid-cols-[1.2fr_1fr_7.5rem] md:grid-cols-[1.1fr_1fr_1.7fr_7.5rem]'

const GRID = cn(BOARD_COLUMNS, 'border-t border-line py-3')

interface BoardRowProps {
  project: Project
  /** Show the band under the title. Off inside a group that is all one band. */
  showBand?: boolean
}

// Every row opens its project's page; the live site is linked from there.
export function BoardRow({ project, showBand = true }: BoardRowProps) {
  const href = project.links.live

  const cells = (
    <>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 font-medium text-ink">
          {project.title}
          <ArrowRight
            aria-hidden="true"
            className="h-3.5 w-3.5 text-muted transition-colors group-hover:text-accent"
          />
        </span>
        {/* Below md there is no summary column, so what it does sits under the name. */}
        <span className="mt-0.5 block text-sm text-muted-strong md:hidden">{project.summary}</span>
        {showBand && <span className="block font-mono text-xs text-muted">{project.band}</span>}
      </span>
      <span className="hidden truncate font-mono text-xs text-muted sm:block">
        {href ? extractDomain(href) : 'no public URL'}
      </span>
      <span className="hidden min-w-0 text-sm leading-snug text-muted-strong md:block">{project.summary}</span>
      <StatusBadge status={project.status} className="justify-self-end" />
    </>
  )

  return (
    <li>
      <Link
        href={projectHref(project)}
        className={cn(
          GRID,
          'group relative transition-colors hover:bg-canvas/60',
          // The board clips its overflow for the rounded frame, so the focus
          // ring is drawn inside the row rather than around it.
          'focus-visible:outline-offset-[-2px]',
          'before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-accent',
          'before:opacity-0 before:transition-opacity hover:before:opacity-100',
        )}
      >
        {cells}
      </Link>
    </li>
  )
}
