import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScrollPreviewProps {
  /** The full-page shot, e.g. from fullShotFor(project). */
  src: string
  /** Accessible name, e.g. "<Title>: scroll preview". With href, ", opens project page" is appended. */
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
  /**
   * What scrolls the shot besides hover or focus, where scroll timelines exist:
   * 'view' as the frame crosses the viewport (a product), 'page' with the
   * page's own scroll (a project page's sticky rail). Default: hover only.
   */
  scroll?: 'hover' | 'view' | 'page'
  /** 3:4 (product, project page) or 9:16 (rack). */
  ratio?: 'portrait' | 'tall'
  /** The shot's pixel height; scales the scroll duration (see .scroll-preview in globals.css). */
  shotHeight?: number
  /** next/image sizes hint. */
  sizes?: string
  /**
   * Inside a card that is already the link (the rack): render a silent frame,
   * with no link, focus stop or name of its own. The card around it carries
   * `.scroll-preview-host`, so hovering or focusing the card scrolls the shot.
   */
  decorative?: boolean
}

/**
 * A fixed-aspect frame over a full-page screenshot. On hover or keyboard focus
 * the shot scrolls from top to bottom (object-position, CSS only) while a thin
 * rule on the right edge fills its track to show how far through the page it
 * is; with `scroll`, it also follows the page's scroll, so it moves on touch
 * and without hover. A printed "scroll" cue says it moves. It stops at the
 * bottom and never loops; under reduced motion it stays at the top, cue and
 * rule hidden. All motion lives in app/globals.css (.scroll-preview).
 */
export function ScrollPreview({
  src,
  label,
  className,
  href,
  ratio = 'portrait',
  shotHeight,
  sizes = '(min-width: 1024px) 480px, 100vw',
  decorative = false,
  duplicateLink = false,
  scroll = 'hover',
}: ScrollPreviewProps) {
  const style = shotHeight ? ({ '--shot-h': shotHeight } as CSSProperties) : undefined
  const classes = cn(
    'scroll-preview relative block overflow-hidden rounded border border-line bg-panel',
    ratio === 'tall' ? 'aspect-[9/16]' : 'aspect-[3/4]',
    scroll === 'view' && 'scroll-preview--view',
    scroll === 'page' && 'scroll-preview--page',
    className,
  )

  // Quality 50: at frame size a web page's screenshot looks the same as at the
  // default 75 and weighs about a quarter less, and on a project page this
  // shot is the first viewport's largest paint.
  const inner = (
    <>
      <Image src={src} alt="" fill sizes={sizes} quality={50} className="scroll-preview__shot" />
      <span className="scroll-preview__track" aria-hidden="true" />
      <span className="scroll-preview__progress" aria-hidden="true" />
      <span className="scroll-preview__cue edge-code" aria-hidden="true">
        <ArrowDown className="h-3 w-3" />
        scroll
      </span>
    </>
  )

  if (decorative) {
    return (
      <span aria-hidden="true" className={classes} style={style}>
        {inner}
      </span>
    )
  }

  if (href && duplicateLink) {
    return (
      <Link href={href} tabIndex={-1} aria-hidden="true" className={classes} style={style}>
        {inner}
      </Link>
    )
  }

  if (href) {
    return (
      <Link href={href} aria-label={`${label}, opens project page`} className={classes} style={style}>
        {inner}
      </Link>
    )
  }

  return (
    <div role="img" aria-label={label} className={classes} style={style}>
      {inner}
    </div>
  )
}
