import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Catalogue } from '@/components/ui/catalogue'
import { SectionHeader } from '@/components/ui/section-header'
import { groupByBand } from '@/lib/board'
import { toCardItem } from '@/lib/catalog'
import { projects, sectionContent } from '@/lib/data'
import { BAND_ORDER } from '@/types'

/** Everything built for someone else: sites, applications and custom systems, filterable. */
export function ClientWork() {
  const rest = projects.filter((p) => p.band !== 'Products')
  // Work with a picture leads; the systems with no public screen close the grid.
  const all = groupByBand(rest).flatMap((group) => group.projects).map(toCardItem)
  const items = [...all.filter((item) => item.image), ...all.filter((item) => !item.image)]
  const bands = [...BAND_ORDER].reverse().filter((band) => items.some((item) => item.band === band))

  return (
    <section id="systems" aria-labelledby="systems-title" className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 md:pb-32">
      <SectionHeader
        id="systems-title"
        label={sectionContent.systems.eyebrow}
        title={sectionContent.systems.title}
        aside={
          <Link href="/projects" className="btn btn-secondary">
            {sectionContent.systems.cta}
            <ArrowRight aria-hidden="true" className="nudge h-4 w-4" />
          </Link>
        }
      />
      <Catalogue items={items} bands={bands} label="Filter client work by type" preview={6} />
    </section>
  )
}
