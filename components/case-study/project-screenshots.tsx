import Image from 'next/image'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { NoPreviewTag } from '@/components/ui/no-preview-tag'
import { ScrollPreview } from '@/components/ui/scroll-preview'
import { fullShotFor, fullShotHeight, screenshotsFor } from '@/lib/project-page'
import { extractDomain } from '@/lib/utils'
import type { Project } from '@/types'

// The 3:4 frame is capped so the sticky rail (frame, gap, phone shot) fits a
// laptop viewport under the 96px offset.
const FRAME = 'w-full sm:max-w-[22rem] lg:max-w-[min(100%,calc((100vh_-_22rem)_*_0.75))]'

/**
 * The preview rail of a project page: the whole site scrolling in a 3:4
 * ScrollPreview (hover or focus scrolls it; a tap focuses it on touch), with
 * the phone shot beside or below it in a lightbox. A project with no full-page
 * shot falls back to its desktop screenshot; one with no public screen at all
 * keeps the slot with a printed tag saying why.
 */
export function ProjectScreenshots({ project }: { project: Project }) {
  const full = fullShotFor(project)
  const shots = screenshotsFor(project)
  const name = project.links.live ? extractDomain(project.links.live) : project.title

  if (!full && !shots.desktop) {
    // A printed tag, not a picture-sized hole: it keeps the slot without pretending.
    return <NoPreviewTag project={project} className={`aspect-[4/3] ${FRAME}`} />
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end lg:flex-col lg:items-start">
      {full ? (
        <ScrollPreview
          src={full}
          label={`Scroll preview of ${name}`}
          shotHeight={fullShotHeight(full)}
          sizes="(min-width: 1024px) 420px, (min-width: 640px) 352px, calc(100vw - 40px)"
          className={FRAME}
        />
      ) : (
        shots.desktop && (
          <ImageLightbox src={shots.desktop} alt={`Desktop screenshot of ${name}`} className={FRAME}>
            <span className="block overflow-hidden rounded border border-line bg-panel">
              {/* alt="" because the button around it carries the description. */}
              <Image
                src={shots.desktop}
                alt=""
                width={1440}
                height={900}
                priority
                sizes="(min-width: 1024px) 420px, (min-width: 640px) 352px, 100vw"
                className="h-auto w-full"
              />
            </span>
          </ImageLightbox>
        )
      )}
      {shots.mobile && (
        // Below sm the frame already fills the screen; the phone shot would only repeat it.
        <ImageLightbox src={shots.mobile} alt={`Mobile screenshot of ${name}`} className="hidden w-32 shrink-0 sm:block lg:w-24">
          <span className="block overflow-hidden rounded border border-line bg-panel">
            <Image src={shots.mobile} alt="" width={390} height={844} sizes="128px" className="h-auto w-full" />
          </span>
        </ImageLightbox>
      )}
    </div>
  )
}
