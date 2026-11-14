import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { ProofBand } from '@/components/ui/proof-band'
import { availability, heroContent, heroPortraits, resumeUrl, skills } from '@/lib/data'
import { cn } from '@/lib/utils'
import type { Skill } from '@/types'

// The quiet button beside the primary one.
const SECONDARY =
  'press button-label inline-flex min-h-[44px] items-center rounded border border-line-strong px-5 text-ink hover:border-ink'

/**
 * The cover. A masthead rule, then three columns: the title, lede and the way
 * in; the portrait, cut out of its photo and standing on the clay plane; and
 * the proof, set like a product's details. On load the H1 words rise, the
 * plane grows from the floor and the figure steps onto it (CSS only, `.hero-*`
 * in globals.css, once). Under reduced motion everything is at rest from the
 * first paint.
 */
export function Hero() {
  const chips = heroContent.stack
    .map((id) => skills.find((s) => s.id === id))
    .filter((s): s is Skill => Boolean(s))
  const words = heroContent.title.split(' ')
  const portrait = heroPortraits[heroContent.portrait]

  return (
    <section id="top" aria-labelledby="hero-title" className="overflow-x-clip mx-auto max-w-6xl px-5 pb-[72px] pt-6 sm:px-8 md:pb-[72px] md:pt-8">
      <div className="hero-fold">
        <div className="flex items-baseline justify-between gap-6 border-b border-ink pb-3">
          <p className="eyebrow text-ink">
            {heroContent.name} · {heroContent.location}
          </p>
          <p className="eyebrow hidden text-right sm:block">{heroContent.coverLine}</p>
        </div>

        <div className="grid gap-y-10 pt-8 md:min-h-[600px] md:grid-cols-12 md:gap-x-8 md:pt-10">
          {/* The title column: the LCP text, static from the first frame. */}
          <div className="hero-front flex flex-col md:col-span-5">
            {/* The top bar hides availability below sm; it is stated here instead. */}
            <p className="eyebrow mb-4 sm:hidden">{availability}</p>
            <h1 id="hero-title" className="hero-title text-fluid-h1 text-ink">
              {words.map((word, i) => (
                <span key={word} className="hero-word" style={{ '--i': i } as CSSProperties}>
                  {word}
                  {i < words.length - 1 ? ' ' : ''}
                </span>
              ))}
            </h1>
            <p className="edge-code mt-5 text-sm text-muted-strong">{heroContent.aiLine}</p>
            {/* The AI line's proof: things in use, one per line (so a font swap
             * cannot re-wrap them), each linked where it has a page. No prefetch:
             * it sits in the first viewport, and prefetching a case study there
             * costs main-thread time during load. */}
            <div className="edge-code mt-2 flex gap-2 text-sm text-muted-strong">
              <p className="shrink-0">{heroContent.aiProof.lead}</p>
              <ul className="min-w-0">
                {heroContent.aiProof.items.map((item) => (
                  <li key={item.label}>
                    {item.href ? (
                      <Link href={item.href} prefetch={false} className="text-ink underline decoration-1 underline-offset-[0.2em] hover:decoration-2">
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
            <div className="hero-rise md:mt-auto md:pt-10">
              <p className="text-lede mt-6 max-w-[34rem] text-ink md:mt-0">{heroContent.lede}</p>
              <p className="edge-code mt-4 text-sm text-muted-strong">{heroContent.specialism}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="press button-primary"
                >
                  Start a project
                  <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
                </a>
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className={SECONDARY}>
                  Résumé
                  <span className="sr-only">(PDF, opens in a new tab)</span>
                </a>
              </div>
            </div>
          </div>

          {/* The portrait: a cut-out figure on the clay plane, his head clear of its top edge. */}
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[26rem] md:col-span-4 md:aspect-auto md:max-w-none">
            <span aria-hidden="true" className="hero-plane absolute inset-x-0 bottom-0 top-[16%] rounded-t-full bg-accent-plane" />
            {/* alt="" because the button around it is labelled with the same name. */}
            <ImageLightbox
              src={portrait.full}
              alt={heroContent.portraitAlt}
              className="hero-figure absolute inset-0 block h-full w-full focus-visible:outline-offset-[-6px]"
            >
              <Image
                src={portrait.cutout}
                alt=""
                fill
                priority
                sizes="(min-width: 1152px) 360px, (min-width: 768px) 32vw, 416px"
                quality={85}
                className="object-cover object-top"
              />
            </ImageLightbox>
          </div>

          {/* The proof, set like a product's details. */}
          <div className="flex flex-col justify-start gap-8 border-t border-line pt-6 md:col-span-3 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            {/* Its rows share the column's height, so the proof fills it. */}
            <ProofBand className="md:flex-1 md:auto-rows-fr" />
            <ul aria-label="Core stack" className="flex flex-wrap gap-2">
              {chips.map((skill) => (
                <li
                  key={skill.id}
                  className={cn(
                    'edge-code rounded-full border px-3 py-1 text-xs',
                    skill.id === 'wordpress' ? 'border-ink text-ink' : 'border-line-strong text-muted-strong',
                  )}
                >
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
