import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface ScrollPreviewProps {
  /** The full-page shot, e.g. from fullShotFor(project). */
  src: string
  /** Accessible name, "Scroll preview of <domain>". */
  label: string
  className?: string
  /** When given, the frame is the link; otherwise it is a focusable frame. */
  href?: string
  /** 3:4 (product, project page) or 9:16 (rack). */
  ratio?: 'portrait' | 'tall'
  /** The shot's pixel height; scales the scroll duration (see .scroll-preview in globals.css). */
  shotHeight?: number
  /** next/image sizes hint. */
  sizes?: string
}

/**
 * A fixed-aspect frame over a full-page screenshot. On hover or keyboard focus
 * the shot scrolls from top to bottom (object-position, CSS only) while a thin
 * rule on the right edge fills to show how far through the page it is. It stops
 * at the bottom and never loops; under reduced motion it stays at the top.
 * All motion lives in app/globals.css (.scroll-preview).
 */
export function ScrollPreview({
  src,
  label,
  className,
  href,
  ratio = 'portrait',
  shotHeight,
  sizes = '(min-width: 1024px) 480px, 100vw',
}: ScrollPreviewProps) {
  const style = shotHeight ? ({ '--shot-h': shotHeight } as CSSProperties) : undefined
  const classes = cn(
    'scroll-preview relative block overflow-hidden rounded border border-line bg-panel',
    ratio === 'tall' ? 'aspect-[9/16]' : 'aspect-[3/4]',
    className,
  )

  const inner = (
    <>
      <Image src={src} alt="" fill sizes={sizes} className="scroll-preview__shot" />
      <span className="scroll-preview__progress" aria-hidden="true" />
    </>
  )

  if (href) {
    return (
      <Link href={href} aria-label={label} className={classes} style={style}>
        {inner}
      </Link>
    )
  }

  return (
    <div role="img" tabIndex={0} aria-label={label} className={classes} style={style}>
      {inner}
    </div>
  )
}
