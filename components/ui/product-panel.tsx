import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { StatusBadge } from '@/components/ui/status-badge'
import { extractDomain } from '@/lib/utils'
import type { Project } from '@/types'

export function ProductPanel({ project }: { project: Project }) {
  const href = project.links.live

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-panel">
      <div className="relative aspect-[16/10] border-b border-line bg-canvas">
        {/*
          The screenshot is decorative (the heading names it) and, when there is
          a live site, a pointer shortcut to it. It is kept out of the tab order
          and the accessibility tree: the domain link below is the real link.
        */}
        {project.image && href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true" className="absolute inset-0">
            <Image src={project.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover object-top" />
          </a>
        ) : project.image ? (
          <Image src={project.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover object-top" />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-sm text-muted">
            {project.title}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-ink">{project.title}</h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="text-sm leading-relaxed text-muted-strong">{project.description}</p>
        <p className="font-mono text-xs text-muted">{project.technologies.slice(0, 4).join(' · ')}</p>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex min-h-[32px] items-center gap-1.5 font-mono text-sm text-accent hover:underline"
          >
            {extractDomain(href)}
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  )
}
