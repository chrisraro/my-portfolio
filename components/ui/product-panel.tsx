import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { StatusBadge } from '@/components/ui/status-badge'
import { cn, extractDomain } from '@/lib/utils'
import type { Project } from '@/types'

// A product is a running system first and a picture second: the panel leads
// with its name, what it does and its status, then the detail and the link.
// The screenshot is a small supporting inset, never the panel's headline.
export function ProductPanel({ project }: { project: Project }) {
  const href = project.links.live

  return (
    <article
      className={cn(
        'grid gap-5 rounded-lg border border-line bg-panel p-5 md:p-6',
        project.image && 'sm:grid-cols-[1fr_12rem] sm:gap-8 md:grid-cols-[1fr_15rem]',
      )}
    >
      <div className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <h3 className="text-xl font-semibold text-ink">{project.title}</h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="mt-1.5 text-base text-ink">{project.summary}</p>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted-strong">{project.description}</p>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-[32px] items-center gap-1.5 self-start font-mono text-sm text-accent hover:underline sm:mt-auto sm:pt-4"
          >
            {extractDomain(href)}
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>
      {project.image && (
        <div className="relative aspect-[16/10] w-full max-w-[14rem] self-start overflow-hidden rounded border border-line bg-canvas sm:max-w-none">
          <Image
            src={project.image}
            alt={`Screenshot of ${href ? extractDomain(href) : project.title}`}
            fill
            sizes="(min-width: 768px) 240px, (min-width: 640px) 192px, 224px"
            className="object-cover object-top"
          />
        </div>
      )}
    </article>
  )
}
