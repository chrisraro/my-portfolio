import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { CaseStudyBody } from '@/components/case-study/case-study-body'
import { ProjectHeader } from '@/components/case-study/project-header'
import { ProjectScreenshots } from '@/components/case-study/project-screenshots'
import { ProjectSummary } from '@/components/case-study/project-summary'
import { getCaseStudy } from '@/lib/case-studies'
import { projects } from '@/lib/data'
import { projectHref } from '@/lib/project-page'
import { buildProjectPageMetadata } from '@/lib/site-metadata'

interface ProjectPageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

// Every project is known at build time; any other slug is a 404.
export const dynamicParams = false

export function generateMetadata({ params }: ProjectPageProps): Metadata {
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) return {}
  const study = getCaseStudy(project.slug)
  // The summary is a dot-separated fragment; the description reads as a sentence.
  const description = study ? study.brief[0] : project.description
  return buildProjectPageMetadata(project, description, projectHref(project))
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) notFound()
  const study = getCaseStudy(project.slug)

  return (
    <article>
      <ProjectHeader project={project} role={study?.role} isCaseStudy={Boolean(study)} />
      {/* A flagship leads with the brief; its screenshots follow it. */}
      {study ? (
        <CaseStudyBody study={study} project={project} screenshots={<ProjectScreenshots project={project} />} />
      ) : (
        <>
          <ProjectScreenshots project={project} />
          <ProjectSummary project={project} />
        </>
      )}
      <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 md:pb-24">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-8">
          <Link
            href="/#contact"
            className="inline-flex min-h-[44px] items-center gap-2 rounded bg-accent px-5 py-2.5 font-medium text-on-accent transition-colors hover:bg-accent/90"
          >
            Start a project
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link href="/projects" className="inline-flex min-h-[44px] items-center font-mono text-sm text-muted-strong hover:text-accent">
            All projects
          </Link>
        </div>
      </div>
    </article>
  )
}
