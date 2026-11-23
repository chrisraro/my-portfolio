import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SECTION } from '@/components/ui/grid'
import { StatusBadge } from '@/components/ui/status-badge'
import { projects, sectionContent } from '@/lib/data'
import { canLinkLive, fullShotFor, projectHref } from '@/lib/project-page'
import { cn, extractDomain } from '@/lib/utils'

/**
 * What is being built now: each project in development as one wide banner, its
 * real site cropped into the right side, with the live address beside the link
 * to its page. Nothing renders when nothing is in development.
 */
export function NowBuilding() {
  const building = projects.filter((p) => p.status === 'in-development')
  if (building.length === 0) return null
  const { building: copy } = sectionContent

  return (
    <section id="building" aria-label={copy.title} className={cn(SECTION, 'pt-10')}>
      {building.map((p) => {
        const shot = fullShotFor(p)
        const live = canLinkLive(p) ? p.links.live : undefined
        return (
          <article key={p.id} className="banner glass relative grid overflow-hidden sm:grid-cols-[1fr_17rem]">
            <div className="p-6">
              <StatusBadge status={p.status} />
              <h2 className="mt-3 text-title text-ink">{p.title}</h2>
              <p className="mt-2 max-w-[42ch] leading-relaxed text-muted-strong">{copy.lines[p.id] ?? p.summary}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-6">
                {/* The name's link covers the banner; the live link sits above it. */}
                <Link href={projectHref(p)} className="banner__link inline-flex min-h-[44px] items-center font-medium text-ink">
                  <span className="link-draw">{copy.more}</span>
                  <span className="sr-only">{`: ${p.title}`}</span>
                </Link>
                {live && (
                  <a
                    href={live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 inline-flex min-h-[44px] items-center gap-1.5 font-medium text-ink"
                  >
                    <span className="link-draw">{extractDomain(live)}</span>
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </div>
            </div>
            {shot && (
              <div aria-hidden="true" className="banner__shot relative min-h-[11rem] sm:min-h-full">
                <Image src={shot} alt="" fill sizes="(min-width: 640px) 272px, 100vw" quality={50} loading="eager" fetchPriority="high" className="object-cover object-top" />
              </div>
            )}
          </article>
        )
      })}
    </section>
  )
}
