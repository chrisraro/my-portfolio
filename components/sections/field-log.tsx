import Image from 'next/image'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { galleryContent, galleryImages, projects, recommendations } from '@/lib/data'
import { buildFieldLog } from '@/lib/field-log'

// Captions are always visible: they are the proof, and hover-only overlays are
// unreachable on touch. Photos open full-size through real buttons.
export function FieldLog() {
  const entries = buildFieldLog(galleryImages, recommendations, projects)

  return (
    <section
      id="field-log"
      aria-labelledby="field-log-title"
      className="border-y border-line bg-panel/40"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
        <p className="eyebrow mb-3">{galleryContent.eyebrow}</p>
        <h2 id="field-log-title" className="text-fluid-h2 mb-8 text-ink">
          {galleryContent.title}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) =>
            entry.kind === 'photo' ? (
              <li key={`photo-${entry.image.id}`}>
                <figure className="overflow-hidden rounded-lg border border-line bg-panel">
                  <ImageLightbox src={entry.image.src} alt={entry.image.alt} className="w-full">
                    <span className="relative block aspect-[4/3]">
                      <Image
                        src={entry.image.src}
                        alt={entry.image.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </span>
                  </ImageLightbox>
                  <figcaption className="px-4 py-3 text-sm leading-snug text-muted-strong">
                    {entry.image.caption}
                  </figcaption>
                </figure>
              </li>
            ) : (
              <li key={`quote-${entry.recommendation.id}`}>
                <figure className="flex h-full flex-col justify-between gap-5 rounded-lg border border-line bg-panel p-5">
                  <blockquote className="leading-relaxed text-ink">
                    {'“'}
                    {entry.recommendation.quote}
                    {'”'}
                  </blockquote>
                  <figcaption className="font-mono text-xs leading-relaxed text-muted">
                    <span className="text-ink">{entry.recommendation.authorName}</span>
                    {' · '}
                    {entry.recommendation.authorTitle}
                    {entry.project && (
                      <span className="mt-1 block text-accent">re: {entry.project.title}</span>
                    )}
                  </figcaption>
                </figure>
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  )
}
