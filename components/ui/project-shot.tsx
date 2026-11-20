import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { shotTransitionName } from '@/lib/view-transition'

interface ProjectShotProps {
  /** The full-page shot, e.g. from fullShotFor(project); the frame shows its top. */
  src: string
  /** Accessible name, e.g. "Screenshot of <domain>". With href, ", opens project page" is appended. */
  label: string
  className?: string
  /** When given, the frame is the link; otherwise it is a named image (not a tab stop). */
  href?: string
  /**
   * The link duplicates a visible, named link to the same page (a product's
   * "Read more"): keep it clickable but take it out of the tab order and the
   * accessibility tree, so keyboard and screen-reader users meet one link.
   */
  duplicateLink?: boolean
  /** next/image sizes hint. */
  sizes?: string
  /**
   * Inside a plate that is already the link (a /projects plate): render a silent frame,
   * with no link, focus stop, name or hover of its own. The plate's hover
   * (.lift-card) scales the shot inside it.
   */
  decorative?: boolean
  /**
   * The project this shot shows. Marks it (data-vt-shot) as the start of the
   * card-to-case-study morph: components/ui/view-transitions.tsx names the
   * clicked one for the length of the transition.
   */
  slug?: string
  /**
   * The case-study header shot, the end of the morph: it carries the shared
   * view-transition-name statically. Only one per page.
   */
  morphTarget?: boolean
}

/**
 * Every screenshot frame (and the printed no-preview frame in its place): 4:3
 * on a phone, where one column of 3:4 shots made /projects 15,000px tall, and
 * 3:4 from 640px. One scale per width, every plate on one baseline.
 */
export const SHOT_ASPECT = 'aspect-[4/3] sm:aspect-[3/4]'

/**
 * A still screenshot in the frame every screenshot shares (SHOT_ASPECT) (one scale, spec §3): the top of a project's full-page
 * shot. Nothing scrolls. As a link it takes the catalog hover
 * (.lift-card in app/globals.css): on a fine pointer it lifts 2px, its border
 * turns ink and the shot scales to 1.02 inside the clipping frame.
 */
export function ProjectShot({
  src,
  label,
  className,
  href,
  sizes = '(min-width: 1024px) 480px, 100vw',
  decorative = false,
  duplicateLink = false,
  slug,
  morphTarget = false,
}: ProjectShotProps) {
  const linked = Boolean(href) && !decorative
  const classes = cn(
    'project-shot',
    linked && 'lift-card',
    'relative block rounded border border-line bg-panel',
    SHOT_ASPECT,
    className,
  )

  // Quality 50: at frame size a web page's screenshot looks the same as at the
  // default 75 and weighs about a quarter less, and on a project page this
  // shot is the first viewport's largest paint. The frame clips the shot (and
  // its hover scale) inside the border; the link around it stays unclipped so
  // the hover shadow can paint outside it.
  const morph = slug
    ? {
        'data-vt-shot': slug,
        style: morphTarget ? ({ viewTransitionName: shotTransitionName(slug) } as CSSProperties) : undefined,
      }
    : {}
  const inner = (
    <span className="project-shot__frame absolute inset-0 overflow-hidden rounded-md">
      <Image src={src} alt="" fill sizes={sizes} quality={50} className="lift-card__shot object-cover object-top" />
    </span>
  )

  if (decorative) {
    return (
      <span aria-hidden="true" className={classes} {...morph}>
        {inner}
      </span>
    )
  }

  if (href && duplicateLink) {
    return (
      <Link href={href} tabIndex={-1} aria-hidden="true" className={classes} {...morph}>
        {inner}
      </Link>
    )
  }

  if (href) {
    return (
      <Link href={href} aria-label={`${label}, opens project page`} className={classes} {...morph}>
        {inner}
      </Link>
    )
  }

  return (
    <div role="img" aria-label={label} className={classes} {...morph}>
      {inner}
    </div>
  )
}
