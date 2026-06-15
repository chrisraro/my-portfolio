'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { Project } from '@/types'
import { LinkPreview } from '@/components/ui/link-preview'
import { extractDomain } from '@/lib/utils'

export function ProjectCard({ project }: { project: Project }) {
  const href = project.links.live || project.links.github || '#'
  const isExternal = href !== '#'
  const label = project.links.live
    ? extractDomain(project.links.live)
    : project.technologies.slice(0, 3).join(' · ')
  const [imgError, setImgError] = useState(!project.image)

  return (
    <LinkPreview url={href} fallbackImage={project.image} className="block h-full">
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="group block h-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      >
        {/* Thumbnail */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          {!imgError ? (
            <Image
              src={project.image}
              alt={`${project.title} screenshot`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              role="img"
              aria-label={`${project.title} screenshot`}
              className="flex h-full w-full items-center justify-center text-xs text-muted-foreground"
            >
              {project.title}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
            {project.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {project.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="mt-3 inline-flex items-center gap-1 text-xs text-primary">
            {isExternal && <ExternalLink className="h-3 w-3" />}
            {label}
          </p>
        </div>
      </a>
    </LinkPreview>
  )
}
