import Image from 'next/image'
import Link from 'next/link'
import { SectionHeader } from '@/components/ui/section-header'
import { galleryContent, galleryImages, projects, recommendations } from '@/lib/data'
import { projectHref } from '@/lib/project-page'

/** People and places: what clients said, then photographs from the work, each with its caption. */
export function FieldNotes() {
  return (
    <section id="field-notes" aria-labelledby="field-notes-title" className="pb-20 md:pb-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader id="field-notes-title" label={galleryContent.eyebrow} title={galleryContent.title} />
        <ul className="grid gap-5 md:grid-cols-2">
          {recommendations.map((rec) => {
            const project = projects.find((p) => p.id === rec.projectId)
            return (
              <li key={rec.id} className="reveal">
                <figure className="card flex h-full flex-col p-6 sm:p-8">
                  <blockquote className="font-display text-[1.5rem] leading-[1.25] tracking-[-0.01em] sm:text-[1.75rem]">
                    “{rec.quote}”
                  </blockquote>
                  <figcaption className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-8 text-sm">
                    <span>
                      <span className="block font-medium">{rec.authorName}</span>
                      <span className="block text-gray-text">{rec.authorTitle}</span>
                    </span>
                    {project && (
                      <Link href={projectHref(project)} className="capsule">
                        {project.title}
                      </Link>
                    )}
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>
      </div>
      <ul className="shelf reveal mt-5 scroll-px-5 px-5 pb-4 sm:scroll-px-8 sm:px-8 lg:scroll-px-[max(2rem,calc((100vw-72rem)/2+2rem))] lg:px-[max(2rem,calc((100vw-72rem)/2+2rem))]">
        {galleryImages.map((image) => (
          <li key={image.id} className="w-[70vw] max-w-[22rem] shrink-0 snap-start">
            <figure>
              <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-gray-fill">
                <Image src={image.src} alt={image.alt} fill sizes="(min-width: 640px) 352px, 70vw" quality={70} className="object-cover" />
              </div>
              <figcaption className="mt-3 px-1 text-sm text-gray-text">{image.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}
