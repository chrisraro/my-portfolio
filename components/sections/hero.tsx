import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { availability, heroContent, heroPortraits, resumeUrl, skills } from '@/lib/data'
import { splitProofPoint } from '@/lib/proof'
import type { Skill } from '@/types'

const i = (n: number) => ({ '--i': n }) as CSSProperties

/**
 * The cover. On the left the title, set very large in the serif, with what he
 * builds and the way in. On the right the portrait, cut out of its photo,
 * standing in a soft gray panel with two proof "widgets" floating over it.
 * On load the title's lines rise out of a mask, the copy fades up, the figure
 * steps in and the widgets pop (CSS only, once, about 1.3s).
 */
export function Hero() {
  const chips = heroContent.stack
    .map((id) => skills.find((s) => s.id === id))
    .filter((s): s is Skill => Boolean(s))
  const words = heroContent.title.split(' ')
  const portrait = heroPortraits[heroContent.portrait]
  const proof = heroContent.proofPoints.map((point) => ({ point, ...splitProofPoint(point) }))

  return (
    <section id="top" aria-labelledby="hero-title" className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 md:pb-24 md:pt-14">
      <div className="grid items-end gap-x-10 gap-y-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="enter capsule mb-6" style={i(0)}>
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ink" />
            {availability}
          </p>
          <h1 id="hero-title" className="display-xl">
            {words.map((word, n) => (
              <span key={word} className="mask block">
                <span style={i(n)} className={n === words.length - 1 ? 'italic' : undefined}>
                  {word}
                </span>
              </span>
            ))}
          </h1>
          <p className="enter lede mt-8 max-w-[33rem]" style={i(1)}>
            {heroContent.lede}
          </p>
          <p className="enter mt-3 text-sm text-gray-text" style={i(2)}>
            {heroContent.specialism}
          </p>
          <div className="enter mt-8 flex flex-wrap gap-3" style={i(3)}>
            <a href="#contact" className="btn btn-primary">
              Start a project
              <ArrowRight aria-hidden="true" className="nudge h-4 w-4" />
            </a>
            <a href="#work" className="btn btn-secondary">
              See the work
              <ArrowDown aria-hidden="true" className="h-4 w-4" />
            </a>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-quiet">
              Résumé
              <span className="sr-only">(PDF, opens in a new tab)</span>
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[26rem] md:col-span-5 md:max-w-none">
          <div className="relative aspect-[4/5] rounded-card bg-gray-fill">
            {/* The figure is taller than its panel: his head clears the top edge. */}
            <div className="enter-figure absolute inset-x-0 bottom-0 top-[-9%] overflow-hidden rounded-b-card">
              <Image
                src={portrait.cutout}
                alt={portrait.alt}
                width={portrait.width}
                height={portrait.height}
                priority
                sizes="(min-width: 768px) 260px, 240px"
                quality={90}
                className="drift mx-auto h-[112%] w-auto max-w-none"
              />
            </div>
            <ul aria-label="At a glance">
              {proof.map(({ point, value, label }, n) => (
                <li
                  key={point}
                  style={i(n)}
                  className={
                    n === 0
                      ? 'enter-pop card absolute -left-3 top-[18%] px-4 py-3 shadow-float sm:-left-8'
                      : 'enter-pop card absolute -right-3 bottom-[12%] px-4 py-3 shadow-float sm:-right-6'
                  }
                >
                  <span className="sr-only">{point}</span>
                  <span aria-hidden="true" className="display-num block">
                    {value}
                  </span>
                  <span aria-hidden="true" className="mt-1 block text-xs text-gray-text">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="enter mt-12 grid gap-6 border-t border-gray-line pt-6 md:mt-16 md:grid-cols-12 md:gap-10" style={i(4)}>
        <div className="text-sm text-gray-text md:col-span-7">
          <p>{heroContent.aiLine}</p>
          <div className="mt-1 flex gap-2">
            <p className="shrink-0">{heroContent.aiProof.lead}</p>
            <ul className="min-w-0">
              {heroContent.aiProof.items.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <Link href={item.href} className="text-ink">
                      <span className="underline-draw">{item.label}</span>
                      <ArrowRight aria-hidden="true" className="nudge ml-1 inline h-3.5 w-3.5 align-[-0.15em]" />
                    </Link>
                  ) : (
                    item.label
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ul aria-label="Core stack" className="flex flex-wrap content-start gap-2 md:col-span-5 md:justify-end">
          {chips.map((skill) => (
            <li key={skill.id} className="capsule">
              {skill.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
