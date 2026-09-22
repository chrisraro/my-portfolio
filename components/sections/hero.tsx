import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { ProofBand } from '@/components/ui/proof-band'
import { availability, heroContent, resumeUrl, skills } from '@/lib/data'
import { cn } from '@/lib/utils'
import type { Skill } from '@/types'

const PORTRAIT = '/assets/images/about/profile-hiking.jpg'

const SECONDARY_CTA =
  'inline-flex min-h-[44px] items-center rounded border border-line-strong px-5 font-medium text-ink transition-colors hover:border-accent hover:text-accent'

export function Hero() {
  const chips = heroContent.stack
    .map((id) => skills.find((s) => s.id === id))
    .filter((s): s is Skill => Boolean(s))

  return (
    <section id="top" aria-labelledby="hero-title" className="border-b border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-10 pt-10 sm:px-8 md:grid-cols-[1fr_auto] md:items-end md:pt-20">
        <div>
          {/*
            Below md the portrait shrinks to an avatar beside the name, so the
            proof band is not pushed under the fold by a 260px photo.
          */}
          <div className="mb-4 flex items-center gap-3">
            <Image
              src={PORTRAIT}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 rounded border border-line-strong object-cover md:hidden"
            />
            <p className="eyebrow">
              {heroContent.name} · {heroContent.location}
            </p>
          </div>
          {/* The top bar hides availability below sm; it is stated here instead. */}
          <p className="mb-4 inline-flex items-center gap-2 font-mono text-xs text-accent sm:hidden">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            {availability}
          </p>
          <h1 id="hero-title" className="text-fluid-h1 text-ink">
            {heroContent.title}
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-5 max-w-[34rem] text-lg leading-relaxed text-muted-strong">{heroContent.lede}</p>
          <p className="mt-4 font-mono text-sm text-accent">{heroContent.specialism}</p>
          {/*
            The specialism chip is marked by fill and ink, not amber: an amber
            outline is the board filter's "selected" state.
          */}
          <ul aria-label="Core stack" className="mt-5 flex flex-wrap gap-2">
            {chips.map((skill) => (
              <li
                key={skill.id}
                className={cn(
                  'rounded border border-line-strong px-2.5 py-1 font-mono text-xs',
                  skill.id === 'wordpress' ? 'bg-panel text-ink' : 'text-muted-strong',
                )}
              >
                {skill.name}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="inline-flex min-h-[44px] items-center gap-2 rounded bg-accent px-5 font-medium text-on-accent transition-colors hover:bg-accent/90"
            >
              Start a project
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className={SECONDARY_CTA}>
              Résumé
              <span className="sr-only">(PDF, opens in a new tab)</span>
            </a>
            <a href="#work" className={SECONDARY_CTA}>
              View work
            </a>
          </div>
        </div>

        <ImageLightbox src={PORTRAIT} alt={heroContent.name} className="hidden justify-self-end md:block">
          <span className="block rounded-lg border border-line-strong bg-panel p-1.5">
            {/* alt="" because the button around it is labelled with the same name. */}
            <Image
              src={PORTRAIT}
              alt=""
              width={220}
              height={260}
              priority
              className="h-[260px] w-[220px] rounded object-cover"
            />
          </span>
        </ImageLightbox>
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-14 sm:px-8">
        <ProofBand />
      </div>
    </section>
  )
}
