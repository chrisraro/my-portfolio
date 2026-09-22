import Link from 'next/link'
import { Reveal } from '@/components/ui/reveal'
import { SystemsBoard } from '@/components/ui/systems-board'
import { groupForHomepage } from '@/lib/board'
import { projects, sectionContent } from '@/lib/data'

export function Systems() {
  const rest = projects.filter((p) => p.band !== 'Products')

  return (
    <section id="systems" aria-labelledby="systems-title" className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 md:pb-20">
      <p className="eyebrow mb-3">{sectionContent.systems.eyebrow}</p>
      <h2 id="systems-title" className="text-fluid-h2 mb-8 text-ink">
        {sectionContent.systems.title}
      </h2>
      <Reveal>
        <SystemsBoard groups={groupForHomepage(rest)} label="systems" groupHeading="h3" />
      </Reveal>
      <p className="mt-5">
        <Link href="/projects" className="inline-flex min-h-[32px] items-center font-mono text-sm text-accent hover:underline">
          {sectionContent.systems.cta} →
        </Link>
      </p>
    </section>
  )
}
