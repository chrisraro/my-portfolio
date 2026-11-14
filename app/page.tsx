import type { Metadata } from 'next'
import Link from 'next/link'
import { availability, contactInfo, heroContent, projects } from '@/lib/data'
import { projectHref } from '@/lib/project-page'

// The layout's metadata has no canonical (it would leak to the 404 page), so
// the homepage sets its own.
export const metadata: Metadata = { alternates: { canonical: '/' } }

// Clean slate: plain, unstyled markup straight from lib/data.ts, so the site
// builds and every project page stays reachable while the new design is made.
export default function HomePage() {
  return (
    <>
      <h1>{heroContent.name}</h1>
      <p>{heroContent.title}</p>
      <p>{heroContent.lede}</p>
      <p>{availability}</p>
      <p>
        <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
      </p>
      <h2>
        <Link href="/projects">Projects</Link>
      </h2>
      <ul>
        {projects.map((project) => (
          <li key={project.slug}>
            <Link href={projectHref(project)}>{project.title}</Link>: {project.summary}
          </li>
        ))}
      </ul>
    </>
  )
}
