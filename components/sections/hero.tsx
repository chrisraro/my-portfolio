import Image from 'next/image'
import Link from 'next/link'
import { Fragment, type CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { ProofBand } from '@/components/ui/proof-band'
import { availability, heroContent, projects, resumeUrl, skills } from '@/lib/data'
import { canLinkLive, fullShotFor, projectHref } from '@/lib/project-page'
import { cn, extractDomain } from '@/lib/utils'
import type { Skill } from '@/types'

// An outline button on the amber plane: on-accent ink, never a tint.
const PLANE_SECONDARY =
  'press button-label inline-flex min-h-[44px] items-center rounded border border-on-accent/70 px-5 text-on-accent hover:border-on-accent'

/**
 * The opening spread. Front panel (amber plane) says what a client gets, who
 * builds it and how to start. Beside it, a real site he built, large enough to
 * read, over a strip of proof. On load the H1 words rise, then the right-hand
 * leaves unfold from the hinge and the crease draws (CSS only, `.hero-*` in
 * globals.css, once). Under reduced motion everything is at rest from the
 * first paint.
 */
export function Hero() {
  const chips = heroContent.stack
    .map((id) => skills.find((s) => s.id === id))
    .filter((s): s is Skill => Boolean(s))
  const words = heroContent.headline.split(' ')
  const featured = projects.find((p) => p.slug === heroContent.featuredSlug)
  const shot = featured ? fullShotFor(featured) : undefined
  const domain = featured && canLinkLive(featured) && featured.links.live ? extractDomain(featured.links.live) : undefined

  return (
    <section id="top" aria-labelledby="hero-title" className="overflow-x-clip mx-auto max-w-6xl px-5 pb-[72px] pt-6 sm:px-8 md:pb-[72px] md:pt-8">
      <div className="hero-fold grid md:min-h-[640px] md:grid-cols-[5fr_auto_7fr]">
        {/* Front panel: the LCP surface, static from the first frame. */}
        <div className="on-plane hero-front relative z-10 flex flex-col rounded-t bg-accent-plane p-6 text-on-accent sm:p-8 md:rounded-l md:rounded-tr-none lg:p-10">
          <p className="eyebrow text-on-accent">
            {heroContent.name} · {heroContent.title} · {heroContent.location}
          </p>
          {/* The top bar hides availability below sm; it is stated here instead. */}
          <p className="eyebrow mt-2 text-on-accent sm:hidden">{availability}</p>
          <h1 id="hero-title" className="text-page-h1 hero-title mt-6 md:mt-auto">
            {words.map((word, i) => (
              // The space sits outside the word: inside an inline-block it collapses at a line end.
              <Fragment key={`${word}-${i}`}>
                <span className="hero-word" style={{ '--i': i } as CSSProperties}>
                  {word}
                </span>
                {i < words.length - 1 ? ' ' : ''}
              </Fragment>
            ))}
          </h1>
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
          {/* The AI line and its proof: things in use, one per line (so a font
           * swap cannot re-wrap them), each linked where it has a page. No
           * prefetch: it sits in the first viewport. */}
          <div className="mt-8 border-t border-on-accent/30 pt-4">
            <p className="edge-code text-[0.8125rem]">{heroContent.aiLine}</p>
            <div className="edge-code mt-2 flex gap-2 text-[0.8125rem]">
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
          </div>
        </div>

        <span aria-hidden="true" className="hero-crease-1 crease-fold" />

        <div className="flex min-w-0 flex-col">
          {/* A site he built, at a size where its own headline reads. 4:3 when stacked. */}
          {featured && shot && (
            <div className="hero-unfold-mid relative aspect-[4/3] md:aspect-auto md:flex-1">
              <Link
                href={projectHref(featured)}
                prefetch={false}
                aria-label={`${featured.title}: ${featured.summary}, opens project page`}
                className="group absolute inset-0 block overflow-hidden bg-panel focus-visible:outline-offset-[-6px] md:rounded-tr"
              >
                <Image
                  src={shot}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1152px) 660px, (min-width: 768px) 58vw, calc(100vw - 40px)"
                  quality={60}
                  className="object-cover object-top"
                />
                <span className="edge-code absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t border-line bg-canvas px-4 py-3 text-xs text-ink sm:px-6">
                  <span className="min-w-0 truncate">
                    {featured.title}
                    {domain && <span className="text-muted"> · {domain}</span>}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-accent">
                    <span className="link-draw">{heroContent.featuredCta}</span>
                    <ArrowRight aria-hidden="true" className="arrow-nudge h-3.5 w-3.5" />
                  </span>
                </span>
              </Link>
            </div>
          )}

          {/* The proof, on paper, under the site. */}
          <div className="hero-unfold-right flex flex-col justify-start gap-5 rounded-b bg-panel p-6 sm:px-8 md:rounded-bl-none md:rounded-br">
            <ProofBand />
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
      </div>
    </section>
  )
}
