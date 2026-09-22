import { BoardRow } from '@/components/ui/board-row'
import type { BoardGroup } from '@/lib/board'

interface SystemsBoardProps {
  groups: BoardGroup[]
  /** Shown in the board's header bar, e.g. "systems". */
  label: string
  /** h3 on the homepage, where the section title is the h2; h2 on /projects. */
  groupHeading: 'h2' | 'h3'
}

export function SystemsBoard({ groups, label, groupHeading: Heading }: SystemsBoardProps) {
  const total = groups.reduce((n, g) => n + g.projects.length, 0)

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-panel">
      <div className="flex justify-between border-b border-line px-4 py-2.5 font-mono text-xs text-muted">
        <span>
          {label} · {total}
        </span>
        <span>status</span>
      </div>
      {groups.map((group) => {
        const id = `board-${group.heading.toLowerCase().replace(/\s+/g, '-')}`
        return (
          <section key={group.heading} aria-labelledby={id}>
            <Heading
              id={id}
              className="px-4 pb-2 pt-5 font-mono text-xs font-medium uppercase tracking-[0.1em] text-accent"
            >
              {group.heading}
            </Heading>
            <ul>
              {group.projects.map((project) => (
                <BoardRow key={project.id} project={project} />
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
