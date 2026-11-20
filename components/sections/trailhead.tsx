import Image from 'next/image'
import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { ContourField } from '@/components/map/contour-field'
import { TrailPath } from '@/components/map/trail-path'
import { SECTION } from '@/components/ui/grid'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { SurveyPlate } from '@/components/ui/survey-plate'
import { trailheadContours, trailheadTrail } from '@/lib/contours'
import { ctaLabels, heroContent } from '@/lib/data'
import { cn } from '@/lib/utils'

const PORTRAIT = '/assets/images/about/profile-hiking.jpg'

/**
 * The trailhead (spec §3, first viewport): the eyebrow and the condensed
 * headline over survey contours on the left, the two paths under them, and
 * the hiking portrait on a survey plate on the right, where the red trail
 * starts. On load the headline's lines rise in turn, the copy under them
 * rises and the trail draws out of the plate (CSS only, .trailhead-* and
 * .trail-draw--load in globals.css, 1.9s, once). Under reduced motion
 * everything is at rest from the first paint. Below 768px the plate stacks
 * under the buttons and the trail is not drawn: it would cross the text.
 */
export function Trailhead() {
  const lines = heroContent.headlineLines

  return (
    <section id="top" aria-labelledby="trailhead-title" className="trailhead relative overflow-x-clip">
      <ContourField paths={trailheadContours} viewBox={trailheadTrail.viewBox} />
      <TrailPath mode="load" d={trailheadTrail.d} viewBox={trailheadTrail.viewBox} className="hidden md:block" />
      <div className={cn(SECTION, 'relative grid gap-10 pb-16 pt-28 md:min-h-[44rem] md:grid-cols-[7fr_5fr] md:items-start md:gap-12 md:pb-20 md:pt-36')}>
        <div className="trailhead-copy min-w-0">
          <p className="eyebrow">{heroContent.eyebrow}</p>
          <h1 id="trailhead-title" className="text-display trailhead-title mt-6 text-ink">
            {lines.map((line, i) => (
              <span key={line} className="trailhead-line" style={{ '--i': i } as CSSProperties}>
                {i < lines.length - 1 ? `${line} ` : line}
              </span>
            ))}
          </h1>
          <div className="trailhead-rise">
            <p className="text-lede mt-8 max-w-[34rem] text-muted-strong">{heroContent.subheadline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="press button-primary">
                {ctaLabels.startProject}
                <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
              </a>
              {/* S4 points this at /hire. */}
              <a href="#contact" className="press button-secondary">
                {ctaLabels.hireForRole}
              </a>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[22rem] md:justify-self-end md:pt-2">
          {/* alt="" on the image: the lightbox button around it carries the name. */}
          <SurveyPlate>
            <ImageLightbox src={PORTRAIT} alt={heroContent.portraitAlt} className="w-full">
              <span className="relative block aspect-[4/5] overflow-hidden">
                {/* priority on its own line: tests/design/performance.test.ts finds it there. */}
                <Image
                  src={PORTRAIT}
                  alt=""
                  fill
                  priority
                  sizes="336px"
                  quality={85}
                  className="object-cover"
                />
              </span>
            </ImageLightbox>
          </SurveyPlate>
        </div>
      </div>
    </section>
  )
}
