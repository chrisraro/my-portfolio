import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SECTION } from '@/components/ui/grid'
import { SectionHeading } from '@/components/ui/section-heading'
import { resumeUrl, sectionContent } from '@/lib/data'
import { cn } from '@/lib/utils'

/** The split: one leg up from the trailhead dividing in two, one over each path (decorative). */
function ForkRoute() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 100 48"
      preserveAspectRatio="none"
      className="fork-route mb-2 hidden h-12 w-full text-ink md:block"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeDasharray="6 5"
    >
      <path d="M50 0 V14 C50 30 25 30 25 48" vectorEffect="non-scaling-stroke" />
      <path d="M50 14 C50 30 75 30 75 48" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/**
 * The fork (spec §5): two paths up from the trailhead, one for a business and
 * one for a hiring team. The business path opens /services; the team path
 * opens /hire, the résumé beside it. Two legs on open paper under the drawn split; outline buttons, since the trail-red primary stays the trailhead's.
 */
export function Fork() {
  const { fork } = sectionContent

  return (
    <section id="fork" aria-labelledby="fork-title" className={cn(SECTION, 'pb-[72px] md:pb-[112px]')}>
      <SectionHeading id="fork-title" title={fork.title} />
      <ForkRoute />
      <ul className="grid gap-12 md:grid-cols-2 md:gap-16">
        <li className="flex flex-col border-t-2 border-ink pt-6">
          <h3 className="text-title text-ink">{fork.business.title}</h3>
          <p className="mt-4 max-w-[46ch] leading-relaxed text-muted-strong">{fork.business.body}</p>
          <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-8">
            <Link href="/services" className="press button-secondary">
              {fork.business.cta}
              <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
            </Link>
          </div>
        </li>
        <li className="flex flex-col border-t-2 border-ink pt-6">
          <h3 className="text-title text-ink">{fork.team.title}</h3>
          <p className="mt-4 max-w-[46ch] leading-relaxed text-muted-strong">{fork.team.body}</p>
          <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-8">
            <Link href="/hire" className="press button-secondary">
              {fork.team.cta}
              <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
            </Link>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="button-label inline-flex min-h-[48px] items-center text-ink">
              <span className="link-draw">{fork.team.resume}</span>
              <span className="sr-only">(PDF, opens in a new tab)</span>
            </a>
          </div>
        </li>
      </ul>
    </section>
  )
}
