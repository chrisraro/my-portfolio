import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { JsonLd } from '@/components/json-ld'
import { SECTION } from '@/components/ui/grid'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { PageIntro } from '@/components/ui/page-intro'
import { SectionHeading } from '@/components/ui/section-heading'
import { SurveyPlate } from '@/components/ui/survey-plate'
import { TrailLink } from '@/components/ui/trail-link'
import { WorkHistory } from '@/components/ui/work-history'
import {
  aboutPageContent,
  ctaLabels,
  galleryContent,
  galleryImages,
  pagesUpdated,
  projects,
  recommendations,
  resumeUrl,
} from '@/lib/data'
import { projectHref } from '@/lib/project-page'
import { buildRouteMetadata } from '@/lib/site-metadata'
import { graphFor } from '@/lib/structured-data'
import { cn } from '@/lib/utils'

export const metadata: Metadata = buildRouteMetadata('/about')

const BLOCK = 'pb-[72px] md:pb-[112px]'

/**
 * About (spec §5), a Read page: the answer, the story, the dated route, the
 * six field photos on survey plates (each opens larger; its caption is the
 * proof, so it is always visible), the four attributed quotes, then the two
 * ways on. Nothing here is new fact: it all comes from lib/data.ts.
 */
export default function AboutPage() {
  const c = aboutPageContent

  return (
    <>
      <JsonLd data={graphFor('/about')} />
      <PageIntro eyebrow={c.eyebrow} title={c.heading} answer={c.answer} updated={pagesUpdated}>
        <Link href="/#contact" className="press button-primary">
          {ctaLabels.startProject}
          <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
        </Link>
        <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="press button-secondary">
          {ctaLabels.downloadResume}
          <span className="sr-only">(PDF, opens in a new tab)</span>
        </a>
      </PageIntro>

      <section id="story" aria-labelledby="story-title" className={cn(SECTION, BLOCK)}>
        <SectionHeading id="story-title" eyebrow={c.story.eyebrow} title={c.story.title} />
        <div className="grid max-w-[62ch] gap-5 text-lg leading-relaxed text-muted-strong">
          {c.story.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <section id="route" aria-labelledby="route-title" className={cn(SECTION, BLOCK)}>
        <SectionHeading id="route-title" eyebrow={c.timeline.eyebrow} title={c.timeline.title} />
        <WorkHistory />
      </section>

      <section id="field-log" aria-labelledby="field-log-title" className={cn(SECTION, BLOCK)}>
        <SectionHeading id="field-log-title" eyebrow={galleryContent.eyebrow} title={galleryContent.title} />
        <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {galleryImages.map((img) => (
            <li key={img.id}>
              <SurveyPlate as="figure">
                {/* alt="" on the image: the lightbox button carries the name, the caption describes it. */}
                <ImageLightbox src={img.src} alt={img.alt} describedBy={`photo-${img.id}`} className="w-full">
                  <span className="relative block aspect-[4/3] overflow-hidden">
                    <Image
                      src={img.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 352px, (min-width: 640px) 45vw, calc(100vw - 58px)"
                      className="object-cover"
                    />
                  </span>
                </ImageLightbox>
                <figcaption id={`photo-${img.id}`} className="mt-3 px-1 text-sm leading-snug text-muted-strong">
                  {img.caption}
                </figcaption>
              </SurveyPlate>
            </li>
          ))}
        </ul>
      </section>

      <section id="testimonials" aria-labelledby="testimonials-title" className={cn(SECTION, BLOCK)}>
        <SectionHeading id="testimonials-title" eyebrow={c.testimonials.eyebrow} title={c.testimonials.title} />
        <ul className="grid gap-6 md:grid-cols-2">
          {recommendations.map((r) => {
            const project = projects.find((p) => p.id === r.projectId)
            return (
              <li key={r.id}>
                <figure className="flex h-full flex-col rounded border border-line bg-panel p-6 sm:p-8">
                  <blockquote className="text-lg leading-relaxed text-ink">
                    <p>{`“${r.quote}”`}</p>
                  </blockquote>
                  <figcaption className="mt-auto pt-6">
                    <span className="block font-semibold text-ink">{r.authorName}</span>
                    <span className="block text-sm text-muted-strong">{r.authorTitle}</span>
                    {project && <TrailLink href={projectHref(project)} text={project.title} kind="label" className="mt-2" />}
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>
      </section>

      <div className={cn(SECTION, 'flex flex-wrap items-center gap-x-6 gap-y-3 pb-16 md:pb-24')}>
        <TrailLink href="/hire" text={ctaLabels.hireForRole} />
        <TrailLink href="/services" text={ctaLabels.viewServices} />
      </div>
    </>
  )
}
