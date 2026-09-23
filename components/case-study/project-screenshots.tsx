import Image from 'next/image'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { caseStudyContent } from '@/lib/data'
import { screenshotsFor } from '@/lib/project-page'
import { extractDomain } from '@/lib/utils'
import type { Project } from '@/types'

function noPreviewText(project: Project): string {
  if (project.status === 'auth-gated') return caseStudyContent.noPreview['auth-gated']
  if (project.status === 'internal') return caseStudyContent.noPreview.internal
  return caseStudyContent.noPreview.fallback
}

export function ProjectScreenshots({ project }: { project: Project }) {
  const shots = screenshotsFor(project)
  const name = project.links.live ? extractDomain(project.links.live) : project.title

  if (!shots.desktop) {
    return (
      <div className="mx-auto max-w-6xl px-5 pt-10 sm:px-8">
        <p className="rounded-lg border border-line bg-panel p-6 text-sm text-muted-strong">{noPreviewText(project)}</p>
      </div>
    )
  }

  return (
    <div
      className={
        shots.mobile
          ? 'mx-auto grid max-w-6xl items-start gap-4 px-5 pt-10 sm:grid-cols-[1fr_11rem] sm:px-8'
          : 'mx-auto max-w-6xl px-5 pt-10 sm:px-8'
      }
    >
      <ImageLightbox src={shots.desktop} alt={`Desktop screenshot of ${name}`} className="w-full">
        <span className="block overflow-hidden rounded-lg border border-line bg-panel">
          {/* alt="" because the button around it carries the description. */}
          <Image
            src={shots.desktop}
            alt=""
            width={1440}
            height={900}
            priority
            sizes="(min-width: 1152px) 900px, 100vw"
            className="h-auto w-full"
          />
        </span>
      </ImageLightbox>
      {shots.mobile && (
        <ImageLightbox src={shots.mobile} alt={`Mobile screenshot of ${name}`} className="mx-auto w-40 sm:w-full">
          <span className="block overflow-hidden rounded-lg border border-line bg-panel">
            <Image src={shots.mobile} alt="" width={390} height={844} sizes="176px" className="h-auto w-full" />
          </span>
        </ImageLightbox>
      )}
    </div>
  )
}
