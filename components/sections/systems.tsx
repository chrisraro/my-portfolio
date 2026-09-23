import Link from 'next/link'
import { SystemsBoard } from '@/components/ui/systems-board'
import { groupForHomepage } from '@/lib/board'
import { projects, sectionContent } from '@/lib/data'

// No entrance animation: the board is the page's primary proof, and it must be
// visible in the server HTML rather than waiting at opacity 0 for hydration.
export function Systems() {
  const rest = projects.filter((p) => p.band !== 'Products')

  return (
    <section id="systems" aria-labelledby="systems-title" className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 md:pb-20">
      <p className="eyebrow mb-3">{sectionContent.systems.eyebrow}</p>
      <h2 id="systems-title" className="text-fluid-h2 mb-8 text-ink">
        {sectionContent.systems.title}
      </h2>
      <SystemsBoard groups={groupForHomepage(rest)} groupHeading="h3" />
      <p className="mt-5">
        <Link href="/projects" className="inline-flex min-h-[44px] items-center font-mono text-sm text-accent hover:underline sm:min-h-[32px]">
          {sectionContent.systems.cta} →
        </Link>
      </p>
    </section>
  )
}
