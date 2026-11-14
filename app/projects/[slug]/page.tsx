import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/json-ld'
import { getCaseStudy } from '@/lib/case-studies'
import { projects } from '@/lib/data'
import { canLinkLive, projectHref } from '@/lib/project-page'
import { buildProjectPageMetadata } from '@/lib/site-metadata'
import { breadcrumbSchema, caseStudySchema, graph } from '@/lib/structured-data'

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

// Clean slate: the project, and its case study when it has one, as plain markup.
export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) notFound()
  const study = getCaseStudy(project.slug)
  const live = canLinkLive(project) ? project.links.live : undefined

  return (
    <article>
      <JsonLd data={study ? graph(breadcrumbSchema(project), caseStudySchema(project, study)) : graph(breadcrumbSchema(project))} />
      <p>
        <Link href="/projects">All projects</Link>
      </p>
      <h1>{project.title}</h1>
      <p>{project.summary}</p>
      <p>{project.description}</p>
      {live && (
        <p>
          <a href={live} target="_blank" rel="noopener noreferrer">
            {live}
          </a>
        </p>
      )}
      <p>{project.technologies.join(', ')}</p>
      {study && (
        <>
          <p>{study.role}</p>
          <h2>Brief</h2>
          {study.brief.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <h2>Outcome</h2>
          {study.outcome.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </>
      )}
    </article>
  )
}
