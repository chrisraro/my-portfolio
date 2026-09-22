import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { ProofBand } from '@/components/ui/proof-band'
import { heroContent, resumeUrl, skills } from '@/lib/data'
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
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-10 pt-14 sm:px-8 md:grid-cols-[1fr_auto] md:items-end md:pt-20">
        <div>
          <p className="eyebrow mb-4">
            {heroContent.name} · {heroContent.location}
          </p>
          <h1 id="hero-title" className="text-fluid-h1 text-ink">
            {heroContent.title}
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-5 max-w-[34rem] text-lg leading-relaxed text-muted-strong">{heroContent.lede}</p>
          <p className="mt-4 font-mono text-sm text-accent">{heroContent.specialism}</p>
          <ul aria-label="Core stack" className="mt-5 flex flex-wrap gap-2">
            {chips.map((skill) => (
              <li
                key={skill.id}
                className={cn(
                  'rounded border px-2.5 py-1 font-mono text-xs',
                  skill.id === 'wordpress'
                    ? 'border-accent text-accent'
                    : 'border-line-strong text-muted-strong',
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

        <ImageLightbox src={PORTRAIT} alt={heroContent.name} className="justify-self-start md:justify-self-end">
          <span className="block rounded-lg border border-line-strong bg-panel p-1.5">
            <Image
              src={PORTRAIT}
              alt={heroContent.name}
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
