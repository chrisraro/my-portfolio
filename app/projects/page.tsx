import type { Metadata } from 'next'
import Link from 'next/link'
import { groupByBand, parseBandParam } from '@/lib/board'
import { projects, projectsPageContent } from '@/lib/data'
import { projectHref } from '@/lib/project-page'
import { buildProjectsMetadata } from '@/lib/site-metadata'

interface ProjectsPageProps {
  searchParams: { band?: string | string[] }
}

export function generateMetadata({ searchParams }: ProjectsPageProps): Metadata {
  return buildProjectsMetadata(parseBandParam(searchParams.band))
}

// Clean slate: the whole inventory as plain lists, one per band (?band= filters).
export default function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const band = parseBandParam(searchParams.band)
  const groups = groupByBand(band ? projects.filter((p) => p.band === band) : projects)

  return (
    <>
      <p>
        <Link href="/">Home</Link>
      </p>
      <h1>{projectsPageContent.title}</h1>
      <p>{projectsPageContent.description}</p>
      {groups.map((group) => (
        <section key={group.heading}>
          <h2>{group.heading}</h2>
          <ul>
            {group.projects.map((project) => (
              <li key={project.slug}>
                <Link href={projectHref(project)}>{project.title}</Link>: {project.summary}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}
