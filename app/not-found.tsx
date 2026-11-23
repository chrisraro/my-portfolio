import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SECTION } from '@/components/ui/grid'
import { TrailLink } from '@/components/ui/trail-link'
import { ctaLabels, heroContent, notFoundContent } from '@/lib/data'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: `${notFoundContent.title} · ${heroContent.name}` }

// Every unknown address lands here, including an unknown /projects/<slug> or
// /services/<slug> (both routes set dynamicParams = false).
export default function NotFound() {
  return (
    <div className={cn(SECTION, 'pb-24 pt-20 lg:pt-40')}>
      <p className="text-figure tabular text-muted">{notFoundContent.eyebrow}</p>
      <h1 className="text-page-h1 mt-2 text-ink">{notFoundContent.title}</h1>
      <p className="text-lede mt-4 max-w-xl text-muted-strong">{notFoundContent.description}</p>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link href="/" className="press button-primary">
          {ctaLabels.backHome}
          <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
        </Link>
        <TrailLink href="/projects" text={ctaLabels.allProjects} />
      </div>
    </div>
  )
}
