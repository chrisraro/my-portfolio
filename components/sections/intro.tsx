import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, FileText } from 'lucide-react'
import { SECTION } from '@/components/ui/grid'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { availability, ctaLabels, heroContent, resumeUrl } from '@/lib/data'
import { elevationFigures } from '@/lib/elevation'
import { cn } from '@/lib/utils'

const PORTRAIT = heroContent.portrait

/**
 * The first viewport: the portrait beside the name, the role, what he does and
 * the two ways in, then the proof counts, each one a link to what it counts.
 * On load the three lines of copy rise in turn (.rise, CSS only, once).
 */
export function Intro() {
  const line = (i: number) => ({ '--i': i }) as CSSProperties

  return (
    <section id="top" aria-labelledby="intro-title" className={cn(SECTION, 'pt-10 lg:pt-24')}>
      <div className="grid gap-8 sm:grid-cols-[15rem_1fr] sm:items-center sm:gap-10">
        <ImageLightbox src={PORTRAIT} alt={heroContent.portraitAlt} className="w-full max-w-[15rem]">
          <span className="portrait relative block aspect-square overflow-hidden">
            {/* alt="" on the image: the lightbox button around it carries the name. */}
            <Image
              src={PORTRAIT}
              alt=""
              fill
              priority
              sizes="480px"
              quality={70}
              className="portrait__photo object-cover"
            />
          </span>
        </ImageLightbox>

        <div className="min-w-0">
          <div className="rise flex items-start justify-between gap-4" style={line(0)}>
            <div>
              <h1 id="intro-title" className="text-name text-ink">
                {heroContent.name}
              </h1>
              <p className="text-lg text-muted">{heroContent.eyebrow}</p>
            </div>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="press glass-control h-11 w-11 shrink-0">
              <FileText aria-hidden="true" className="h-[1.125rem] w-[1.125rem]" />
              <span className="sr-only">{`${ctaLabels.downloadResume} (PDF, opens in a new tab)`}</span>
            </a>
          </div>
          <p className="rise text-lede mt-4 text-ink" style={line(1)}>
            {heroContent.headline}
          </p>
          <p className="rise mt-2 leading-relaxed text-muted-strong" style={line(2)}>
            {heroContent.subheadline}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a href="#contact" className="press button-primary">
          {ctaLabels.startProject}
          <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
        </a>
        <Link href="/hire" className="press button-secondary">
          {ctaLabels.hireForRole}
        </Link>
        <p className="text-sm text-muted sm:ml-auto">{availability}</p>
      </div>

      <ul className="mt-12 grid grid-cols-3 gap-4">
        {elevationFigures().map((f) => (
          <li key={f.label}>
            <Link href={f.href} className="group block min-h-[44px]">
              <span className="text-figure block text-ink">{f.value}</span>
              <span className="link-draw text-sm leading-snug text-muted-strong">{f.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
