import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { FLAGSHIP_SLUGS, briefLead, getCaseStudy } from '@/lib/case-studies'
import { caseStudyContent, projects, sectionContent, sectorNames } from '@/lib/data'
import { projectHref, screenshotsFor } from '@/lib/project-page'

/**
 * The case studies as editorials: a shelf of wide cards that pages sideways,
 * each a still of the site, the brief's first line and his role.
 */
export function Editorials() {
  const stories = FLAGSHIP_SLUGS.flatMap((slug) => {
    const project = projects.find((p) => p.slug === slug)
    const study = getCaseStudy(slug)
    return project && study ? [{ project, study }] : []
  })

  return (
    <section id="case-studies" aria-labelledby="case-studies-title" className="pb-20 md:pb-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          id="case-studies-title"
          label={sectionContent.caseStudies.eyebrow}
          title={sectionContent.caseStudies.title}
          aside={<p className="capsule tabular-nums">{stories.length} stories</p>}
        />
      </div>
      {/* The shelf bleeds to the screen edge and starts on the page's left margin. */}
      <ul className="shelf reveal scroll-px-5 px-5 pb-4 sm:scroll-px-8 sm:px-8 lg:scroll-px-[max(2rem,calc((100vw-72rem)/2+2rem))] lg:px-[max(2rem,calc((100vw-72rem)/2+2rem))]">
        {stories.map(({ project, study }, n) => {
          const image = screenshotsFor(project).desktop
          return (
            <li key={project.slug} className="w-[85vw] max-w-[34rem] shrink-0 snap-start">
              <Link href={projectHref(project)} className="product card group flex h-full flex-col overflow-hidden">
                {image && (
                  <span className="relative block aspect-[16/9] overflow-hidden bg-gray-fill">
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 544px, 85vw"
                      quality={60}
                      className="product__image object-cover object-top"
                    />
                  </span>
                )}
                <span className="flex flex-1 flex-col p-6 sm:p-8">
                  <span className="label">
                    {caseStudyContent.eyebrow.caseStudy} {n + 1} of {stories.length} · {sectorNames[project.sector]}
                  </span>
                  <span className="display-md mt-3">{project.title}</span>
                  <span className="mt-3 text-gray-text">{briefLead(study)}</span>
                  <span className="mt-6 border-t border-gray-line pt-4 text-sm">{study.role}</span>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium">
                    <span className="underline-draw">Read the case study</span>
                    <ArrowRight aria-hidden="true" className="nudge h-4 w-4" />
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
