import { BOARD_COLUMNS, BoardRow } from '@/components/ui/board-row'
import type { BoardGroup } from '@/lib/board'
import { cn } from '@/lib/utils'

interface SystemsBoardProps {
  groups: BoardGroup[]
  /** h3 on the homepage, where the section title is the h2; h2 on /projects. */
  groupHeading: 'h2' | 'h3'
  /** The unfiltered total, when a filter is narrowing the board ("9 of 15"). */
  outOf?: number
}

// A group needs a band per row only when it mixes bands, as "Client work"
// does. Inside a group already named for its band, the label is noise.
function mixesBands(group: BoardGroup): boolean {
  return group.projects.some((p) => p.band !== group.projects[0]?.band)
}

export function SystemsBoard({ groups, groupHeading: Heading, outOf }: SystemsBoardProps) {
  const total = groups.reduce((n, g) => n + g.projects.length, 0)
  const count = outOf !== undefined && outOf !== total ? `${total} of ${outOf}` : String(total)

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-panel">
      {/* Column labels sit on the rows' own grid, so each names the column under it. */}
      <div className={cn(BOARD_COLUMNS, 'border-b border-line py-2.5 font-mono text-xs text-muted')}>
        <span>projects · {count}</span>
        <span className="hidden sm:block">domain</span>
        <span className="hidden md:block">what it does</span>
        <span className="justify-self-end">status</span>
      </div>
      {groups.map((group) => {
        const id = `board-${group.heading.toLowerCase().replace(/\s+/g, '-')}`
        const showBand = mixesBands(group)
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
                <BoardRow key={project.id} project={project} showBand={showBand} />
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
