import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SurveyPlateProps {
  /** A block (default), the figure around a map and its caption, or a span inside a link or button. */
  as?: 'div' | 'figure' | 'span'
  /** The plate is itself the link (a project plate). */
  href?: string
  className?: string
  children: ReactNode
}

/**
 * A survey plate (spec §3): the pale frame every photo, screenshot and map
 * sits in, panel paper with a line-strong hairline and an 8px margin
 * (.survey-plate in app/globals.css). The only place the class is written:
 * tests/design/survey-plate.test.ts holds every plate to this component.
 */
export function SurveyPlate({ as: Tag = 'div', href, className, children }: SurveyPlateProps) {
  const classes = cn('survey-plate', className)
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }
  return (
    <Tag className={classes}>
      {children}
    </Tag>
  )
}
