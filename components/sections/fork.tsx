import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SECTION } from '@/components/ui/grid'
import { SectionHeading } from '@/components/ui/section-heading'
import { resumeUrl, sectionContent } from '@/lib/data'
import { cn } from '@/lib/utils'

const CARD = 'flex flex-col rounded border border-line bg-panel p-6 sm:p-8'

/**
 * The fork (spec §5): two paths up from the trailhead, one for a business and
 * one for a hiring team. The business path opens /services; the team path
 * opens /hire, the résumé beside it. Outline buttons: the trail-red primary stays the trailhead's.
 */
export function Fork() {
  const { fork } = sectionContent

  return (
    <section id="fork" aria-labelledby="fork-title" className={cn(SECTION, 'pb-[72px] md:pb-[112px]')}>
      <SectionHeading id="fork-title" eyebrow={fork.eyebrow} title={fork.title} />
      <ul className="grid gap-6 md:grid-cols-2">
        <li className={CARD}>
          <h3 className="text-title text-ink">{fork.business.title}</h3>
          <p className="mt-4 max-w-[46ch] leading-relaxed text-muted-strong">{fork.business.body}</p>
          <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-8">
            <Link href="/services" className="press button-secondary">
              {fork.business.cta}
              <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
            </Link>
          </div>
        </li>
        <li className={CARD}>
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
