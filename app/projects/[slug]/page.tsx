import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { CaseStudyBody } from '@/components/case-study/case-study-body'
import { ProjectHeader } from '@/components/case-study/project-header'
import { ProjectScreenshots } from '@/components/case-study/project-screenshots'
import { ProjectSummary } from '@/components/case-study/project-summary'
import { ReadSpread } from '@/components/case-study/read-spread'
import { JsonLd } from '@/components/json-ld'
import { SECTION } from '@/components/ui/grid'
import { TrailLink } from '@/components/ui/trail-link'
import { getCaseStudy } from '@/lib/case-studies'
import { ctaLabels, projects } from '@/lib/data'
import { projectHref } from '@/lib/project-page'
import { buildProjectPageMetadata } from '@/lib/site-metadata'
import { breadcrumbSchema, caseStudySchema, graph } from '@/lib/structured-data'
import { cn } from '@/lib/utils'

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
      <JsonLd data={study ? graph(breadcrumbSchema(project), caseStudySchema(project, study)) : graph(breadcrumbSchema(project))} />
      <ProjectHeader project={project} role={study?.role} isCaseStudy={Boolean(study)} />
      {/* A flagship walks its journal from the brief; below 1024px its screenshot rail follows the brief. */}
      {study ? (
        <CaseStudyBody study={study} project={project} screenshots={<ProjectScreenshots project={project} />} />
      ) : (
        <ReadSpread rail={<ProjectScreenshots project={project} />}>
          <ProjectSummary project={project} />
        </ReadSpread>
      )}
      <div className={cn(SECTION, 'pb-16 pt-14 md:pb-24')}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/#contact" className="press button-primary">
            {ctaLabels.startProject}
            <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
          </Link>
          <TrailLink href="/projects" text={ctaLabels.allProjects} />
        </div>
      </div>
    </article>
  )
}
