import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ContourField } from '@/components/map/contour-field'
import { SECTION } from '@/components/ui/grid'
import { SurveyPlate } from '@/components/ui/survey-plate'
import { TrailLink } from '@/components/ui/trail-link'
import { offTrail } from '@/lib/contours'
import { ctaLabels, heroContent, notFoundContent } from '@/lib/data'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: `${notFoundContent.title} · ${heroContent.name}` }

// Every unknown address lands here, including an unknown /projects/<slug> or
// /services/<slug> (both routes set dynamicParams = false).
//
// Off the trail (spec §5): an empty square of survey map on a plate, contours
// and no pins, a trail-red dot where you are (the page's only trail red: the
// current position) and a faint dashed route from it to the edge. The route
// home is the primary button.
export default function NotFound() {
  return (
    <div className={cn(SECTION, 'pb-16 pt-12 md:pb-24 md:pt-16')}>
      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-16">
        <SurveyPlate className="w-full max-w-[18rem] md:max-w-none">
          <div className="relative aspect-square overflow-hidden border border-dashed border-line-strong">
            <ContourField paths={offTrail.contours} viewBox={offTrail.viewBox} />
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox={offTrail.viewBox}
              className="pointer-events-none absolute inset-0 h-full w-full text-muted-strong"
              fill="none"
            >
              <path d={offTrail.route} stroke="currentColor" strokeWidth={2} strokeDasharray="6 8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
            <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-trail" />
            <span className="map-label absolute left-1/2 top-1/2 ml-4 -translate-y-1/2 bg-panel px-1 text-ink">{notFoundContent.here}</span>
          </div>
        </SurveyPlate>
        <div>
          <p className="eyebrow mb-3">{notFoundContent.eyebrow}</p>
          <h1 className="text-page-h1 max-w-[16ch] text-ink">{notFoundContent.title}</h1>
          <p className="text-lede mt-5 max-w-2xl text-muted-strong">{notFoundContent.description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/" className="press button-primary">
              {ctaLabels.backHome}
              <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
            </Link>
            <TrailLink href="/projects" text={ctaLabels.allProjects} />
          </div>
        </div>
      </div>
    </div>
  )
}
