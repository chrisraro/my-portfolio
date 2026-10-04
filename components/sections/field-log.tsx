import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { SectionHeading } from '@/components/ui/section-heading'
import { galleryContent, galleryImages, projects, recommendations } from '@/lib/data'
import { buildFieldLog } from '@/lib/field-log'
import { projectHref } from '@/lib/project-page'
import { cn } from '@/lib/utils'

// Postcards rest at alternating tilts: -1.5deg, then +1deg.
const TILTS = ['-1.5deg', '1deg'] as const

/**
 * People and places: postcards from site visits interleaved with what clients
 * said. Captions are always visible (they are the proof, and hover-only
 * overlays are unreachable on touch). Photos open full-size through real
 * buttons, each described by its caption. Postcards slide in at their resting
 * tilt; attention straightens and lifts them.
 */
export function FieldLog() {
  const entries = buildFieldLog(galleryImages, recommendations, projects)
  // At three columns a single leftover card would sit alone beside two empty
  // cells. When the last entry is a quote, it closes the section full width.
  const last = entries[entries.length - 1]
  const closingQuote = entries.length % 3 === 1 && last?.kind === 'quote'
  let photoIndex = 0

  return (
    <section id="field-log" aria-labelledby="field-log-title" className="overflow-x-clip mx-auto max-w-6xl px-5 pb-[72px] sm:px-8 md:pb-[112px]">
      <SectionHeading id="field-log-title" eyebrow={galleryContent.eyebrow} title={galleryContent.title} />
      <ul className="grid items-start gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, i) => {
          if (entry.kind === 'photo') {
            const captionId = `field-log-caption-${entry.image.id}`
            const tilt = TILTS[photoIndex++ % 2]
            return (
              <li key={`photo-${entry.image.id}`} className="reveal-postcard">
                <figure className="postcard rounded-sm border border-line bg-panel p-3 pb-4" style={{ '--tilt': tilt } as CSSProperties}>
                  <ImageLightbox src={entry.image.src} alt={entry.image.alt} describedBy={captionId} className="w-full">
                    <span className="relative block aspect-[4/3] overflow-hidden rounded-sm">
                      <Image
                        src={entry.image.src}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </span>
                  </ImageLightbox>
                  <figcaption id={captionId} className="mt-3 px-1 text-sm leading-snug text-muted-strong">
                    {entry.image.caption}
                  </figcaption>
                </figure>
              </li>
            )
          }

          const wide = closingQuote && i === entries.length - 1
          return (
            <li key={`quote-${entry.recommendation.id}`} className={cn('reveal', wide && 'lg:col-span-3')}>
              <figure
                className={cn(
                  'flex h-full flex-col justify-between gap-6 rounded border border-line bg-panel p-6',
                  wide && 'lg:flex-row lg:items-end lg:gap-10',
                )}
              >
                <blockquote className={cn('text-lg leading-relaxed text-ink', wide && 'lg:max-w-3xl')}>
                  {'“'}
                  {entry.recommendation.quote}
                  {'”'}
                </blockquote>
                <figcaption className={cn('text-sm leading-relaxed text-muted', wide && 'lg:shrink-0 lg:text-right')}>
                  <span className="font-medium text-ink">{entry.recommendation.authorName}</span>
                  <span className="block">{entry.recommendation.authorTitle}</span>
                  {entry.project && (
                    <Link
                      href={projectHref(entry.project)}
                      className="edge-code mt-2 inline-flex min-h-[44px] items-center text-accent sm:min-h-[32px]"
                    >
                      <span className="link-draw">re: {entry.project.title}</span>
                    </Link>
                  )}
                </figcaption>
              </figure>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
