import Image from 'next/image'
import type { CSSProperties } from 'react'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { NoPreviewTag } from '@/components/ui/no-preview-tag'
import { ProjectShot, SHOT_ASPECT } from '@/components/ui/project-shot'
import { SurveyPlate } from '@/components/ui/survey-plate'
import { fullShotFor, screenshotsFor } from '@/lib/project-page'
import { extractDomain } from '@/lib/utils'
import { shotTransitionName } from '@/lib/view-transition'
import type { Project } from '@/types'

// The plate is capped so the sticky rail (a 4:3 plate from 1024px, the gap,
// the 180px phone shot under it) fits a laptop viewport under the 96px offset,
// and never narrower than 16rem on a short window (100vh - 35rem reaches 0 at 560px).
const FRAME = 'w-full sm:max-w-[22rem] lg:max-w-[min(100%,max(16rem,calc((100vh_-_35rem)_*_1.33)))]'

/**
 * The screenshot rail of a project page, on a survey plate: the top of the
 * site's full-page shot, still, at the one scale every screenshot shares (the
 * end of the plate-to-page morph), with the phone shot beside or below it in a
 * lightbox. A project with no full-page shot falls back to its desktop
 * screenshot; one with no public screen at all keeps the plate with the
 * printed reason in the same shot frame.
 */
export function ProjectScreenshots({ project }: { project: Project }) {
  const full = fullShotFor(project)
  const shots = screenshotsFor(project)
  const name = project.links.live ? extractDomain(project.links.live) : project.title

  if (!full && !shots.desktop) {
    // A printed tag, not a picture-sized hole: it keeps the plate without pretending.
    return (
      <SurveyPlate className={`plate-rise ${FRAME}`}>
        <NoPreviewTag project={project} className={`${SHOT_ASPECT} w-full`} />
      </SurveyPlate>
    )
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end lg:flex-col lg:items-start">
      {full ? (
        <SurveyPlate className={FRAME}>
          <ProjectShot
            src={full}
            label={`Screenshot of ${name}`}
            slug={project.slug}
            morphTarget
            sizes="(min-width: 1024px) 448px, (min-width: 640px) 336px, calc(100vw - 58px)"
            className="w-full"
          />
        </SurveyPlate>
      ) : (
        shots.desktop && (
          <SurveyPlate className={FRAME}>
            <ImageLightbox src={shots.desktop} alt={`Desktop screenshot of ${name}`} className="w-full">
              {/* The end of the plate-to-page morph, like ProjectShot's morphTarget. */}
              <span
                data-vt-shot={project.slug}
                style={{ viewTransitionName: shotTransitionName(project.slug) } as CSSProperties}
                className="block overflow-hidden"
              >
                {/* alt="" because the button around it carries the description. */}
                <Image
                  src={shots.desktop}
                  alt=""
                  width={1440}
                  height={900}
                  priority
                  sizes="(min-width: 1024px) 448px, (min-width: 640px) 336px, 100vw"
                  className="h-auto w-full"
                />
              </span>
            </ImageLightbox>
          </SurveyPlate>
        )
      )}
      {shots.mobile && (
        // Below sm the plate already fills the screen; the phone shot would only repeat it.
        // At plate scale (180px), beside the plate from 640px and under it from 1024px.
        <ImageLightbox src={shots.mobile} alt={`Mobile screenshot of ${name}`} className="plate-rise hidden w-[11.25rem] shrink-0 sm:block">
          <SurveyPlate as="span">
            <Image src={shots.mobile} alt="" width={390} height={844} sizes="180px" className="h-auto w-full" />
          </SurveyPlate>
        </ImageLightbox>
      )}
    </div>
  )
}
