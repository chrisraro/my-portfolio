import { cn } from '@/lib/utils'
import { DISPLAY_STATUS_LABEL, displayStatus } from '@/lib/display-status'
import type { DisplayStatus, ProjectStatus } from '@/types'

// Status is never colour alone: each one has its own glyph shape and always a
// text label. Amber is both the brand colour and the early-access colour, so
// the shape is what tells them apart.
function StatusGlyph({ status }: { status: DisplayStatus }) {
  if (status === 'private') {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 12 12"
        className="h-3 w-3 text-status-private"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="2.5" y="5.5" width="7" height="5" rx="1" />
        <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" />
      </svg>
    )
  }

  const shape: Record<Exclude<DisplayStatus, 'private'>, string> = {
    live: 'live-pulse relative h-2 w-2 rounded-full bg-live',
    'early-access': 'h-2 w-2 rounded-full border-[1.5px] border-status-early',
    internal: 'h-2 w-2 rounded-[1px] bg-status-internal',
  }
  return <span aria-hidden="true" className={cn('inline-block shrink-0', shape[status])} />
}

interface StatusBadgeProps {
  status: ProjectStatus
  /** Hide the label visually in dense layouts. It stays in the accessibility tree. */
  compact?: boolean
  className?: string
}

export function StatusBadge({ status, compact = false, className }: StatusBadgeProps) {
  const display = displayStatus(status)
  return (
    <span
      data-status={display}
      className={cn('inline-flex items-center gap-1.5 font-mono text-xs text-muted', className)}
    >
      <StatusGlyph status={display} />
      <span className={compact ? 'sr-only' : undefined}>{DISPLAY_STATUS_LABEL[display]}</span>
    </span>
  )
}
