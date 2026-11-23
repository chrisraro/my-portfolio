import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * The trail map's one text-link idiom, in two weights. An action ("Browse
 * every project", "Read more") is set in button-label type with an arrow that
 * slides on hover; a label (a project in a place list, a domain) is set in
 * map-label type. Both draw their underline from the left (.link-draw) and
 * keep a 44px hit area (32px for a label from 640px). The link is inline-flex,
 * so text that wraps keeps its arrow beside it, never alone on a line. An
 * external link opens in a new tab, says so, and points up and out instead.
 */
export type TrailLinkKind = 'action' | 'label'

const KIND: Record<TrailLinkKind, string> = {
  action: 'button-label inline-flex min-h-[44px] items-center gap-2 text-ink',
  label: 'map-label inline-flex min-h-[44px] items-center gap-1.5 text-ink sm:min-h-[32px]',
}

/** A trail link's classes, for a cue inside a link that is already open (a journal cover). */
export function trailLinkClass(kind: TrailLinkKind = 'action'): string {
  return KIND[kind]
}

interface TrailLinkTextProps {
  text: string
  kind?: TrailLinkKind
  external?: boolean
  /** Read after the text by screen readers only, e.g. " about Iskotify". */
  srText?: string
}

/** A trail link's inside: the underlined text, then its arrow. */
export function TrailLinkText({ text, kind = 'action', external = false, srText }: TrailLinkTextProps) {
  return (
    <>
      <span className="link-draw">{text}</span>
      {srText && <span className="sr-only">{srText}</span>}
      {external ? (
        <>
          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          <span className="sr-only">(opens in a new tab)</span>
        </>
      ) : (
        kind === 'action' && <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4 shrink-0" />
      )}
    </>
  )
}

interface TrailLinkProps extends TrailLinkTextProps {
  href: string
  className?: string
}

export function TrailLink({ href, text, kind = 'action', external = false, srText, className }: TrailLinkProps) {
  const classes = cn(KIND[kind], className)
  const inner = <TrailLinkText text={text} kind={kind} external={external} srText={srText} />
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {inner}
      </a>
    )
  }
  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  )
}
