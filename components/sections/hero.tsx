import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { ProofBand } from '@/components/ui/proof-band'
import { availability, heroContent, resumeUrl, skills } from '@/lib/data'
import { cn } from '@/lib/utils'
import type { Skill } from '@/types'

const PORTRAIT = '/assets/images/about/profile-hiking.jpg'

// An outline button on the amber plane: on-accent ink, never a tint.
const PLANE_SECONDARY =
  'press button-label inline-flex min-h-[44px] items-center rounded border border-on-accent/70 px-5 text-on-accent hover:border-on-accent'

/**
 * The opening brochure: a tri-fold. Front panel (amber plane) says who and
 * what, middle panel is the portrait, back panel holds the proof. On load the
 * H1 words rise, then the two inner panels unfold from their hinges and the
 * creases draw (CSS only, `.hero-*` in globals.css, 1.9s, once). Under reduced
 * motion everything is at rest from the first paint.
 */
export function Hero() {
  const chips = heroContent.stack
    .map((id) => skills.find((s) => s.id === id))
    .filter((s): s is Skill => Boolean(s))
  const words = heroContent.title.split(' ')

  return (
    <section id="top" aria-labelledby="hero-title" className="overflow-x-clip mx-auto max-w-6xl px-5 pb-[72px] pt-6 sm:px-8 md:pb-[72px] md:pt-8">
      <div className="hero-fold grid md:min-h-[640px] md:grid-cols-[1.3fr_auto_0.85fr_auto_0.85fr]">
        {/* Front panel: the LCP surface, static from the first frame. */}
        <div className="on-plane hero-front relative z-10 flex flex-col rounded-t bg-accent-plane p-6 text-on-accent sm:p-8 md:rounded-l md:rounded-tr-none lg:p-10">
          <p className="eyebrow text-on-accent">
            {heroContent.name} · {heroContent.location}
          </p>
          {/* The top bar hides availability below sm; it is stated here instead. */}
          <p className="eyebrow mt-2 text-on-accent sm:hidden">{availability}</p>
          <h1 id="hero-title" className="hero-title text-fluid-h1 mt-6 md:mt-auto">
            {words.map((word, i) => (
              <span key={word} className="hero-word" style={{ '--i': i } as CSSProperties}>
                {word}
                {i < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>
          <p className="edge-code mt-4 text-sm">{heroContent.aiLine}</p>
          {/* The AI line's proof: things in use, one per line (so a font swap
           * cannot re-wrap them), each linked where it has a page. No prefetch:
           * it sits in the first viewport, and prefetching a case study there
           * costs main-thread time during load. */}
          <div className="edge-code mt-2 flex gap-2 text-sm">
            <p className="shrink-0">{heroContent.aiProof.lead}</p>
            <ul className="min-w-0">
              {heroContent.aiProof.items.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <Link href={item.href} prefetch={false} className="underline decoration-1 underline-offset-[0.2em] hover:decoration-2">
                      {item.label}
                      <ArrowRight aria-hidden="true" className="ml-1 inline h-3.5 w-3.5 align-[-0.15em]" />
                    </Link>
                  ) : (
                    item.label
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="hero-rise">
            <p className="text-lede mt-5 max-w-[34rem]">{heroContent.lede}</p>
            <p className="edge-code mt-4 text-sm">{heroContent.specialism}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="press button-primary"
              >
                Start a project
                <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
              </a>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className={PLANE_SECONDARY}>
                Résumé
                <span className="sr-only">(PDF, opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>

        <span aria-hidden="true" className="hero-crease-1 crease-fold" />

        {/* Middle panel: the portrait, full bleed. 4:3 band when stacked. */}
        <div className="hero-unfold-mid relative aspect-[4/3] md:aspect-auto">
          {/* The ring is drawn inside the photo: outside, the front plane (z-10) and the hero's edges would cover it. */}
          {/* Focus: an amber ring inside a canvas ring, so it holds against any part of the photo. */}
          <ImageLightbox
            src={PORTRAIT}
            alt={heroContent.portraitAlt}
            className="absolute inset-0 h-full w-full focus-visible:outline-offset-[-8px] focus-visible:after:absolute focus-visible:after:inset-[3px] focus-visible:after:rounded focus-visible:after:border-[3px] focus-visible:after:border-canvas focus-visible:after:content-['']"
          >
            {/* The square photo is cover-scaled to the panel's HEIGHT (~640px at 768 to 1440), not its ~300px width, so `sizes` names that cover width. */}
            {/* alt="" because the button around it is labelled with the same name. */}
            <Image
              src={PORTRAIT}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 700px, calc(100vw - 40px)"
              quality={85}
              className="object-cover"
            />
          </ImageLightbox>
        </div>

        <span aria-hidden="true" className="hero-crease-2 crease-fold" />

        {/* Back panel: the proof, on paper. */}
        <div className="hero-unfold-right flex flex-col justify-start gap-8 rounded-b bg-panel p-6 sm:p-8 md:rounded-r md:rounded-bl-none">
          {/* Its rows share the panel's height, so the proof fills it rather than leaving the bottom third empty. */}
          <ProofBand className="md:flex-1 md:auto-rows-fr" />
          <ul aria-label="Core stack" className="flex flex-wrap gap-2">
            {chips.map((skill) => (
              <li
                key={skill.id}
                className={cn(
                  'edge-code rounded-full border px-3 py-1 text-xs',
                  skill.id === 'wordpress' ? 'border-line-strong bg-canvas text-ink' : 'border-line text-muted-strong',
                )}
              >
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
