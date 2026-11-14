import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DisplayStatus } from '@/types'

// Status is never colour: each has its own glyph shape beside its label.
function Glyph({ status }: { status: DisplayStatus }) {
  if (status === 'private') return <Lock aria-hidden="true" className="h-3 w-3" strokeWidth={2.25} />
  return (
    <span
      aria-hidden="true"
      className={cn(
        'h-2 w-2',
        status === 'live' && 'rounded-full bg-ink',
        status === 'early-access' && 'rounded-full border-[1.5px] border-ink',
        status === 'internal' && 'rounded-[2px] bg-gray-mid',
        status === 'staging' && 'rounded-[2px] border-[1.5px] border-dashed border-ink',
      )}
    />
  )
}

export function StatusPill({ status, label, className }: { status: DisplayStatus; label: string; className?: string }) {
  return (
    <span data-status={status} className={cn('capsule', className)}>
      <Glyph status={status} />
      {label}
    </span>
  )
}
