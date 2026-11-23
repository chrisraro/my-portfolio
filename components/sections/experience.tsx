import { ListHeading } from '@/components/ui/section-heading'
import { SECTION } from '@/components/ui/grid'
import { experience, sectionContent } from '@/lib/data'
import { buildTimeline } from '@/lib/timeline'
import { cn } from '@/lib/utils'

/**
 * Every role and degree, newest first: the title and place on one line with
 * its dates, the first responsibility under it, the rest behind a native
 * disclosure, so the whole record is in the server HTML and opens without
 * JavaScript.
 */
export function Experience() {
  const { timeline } = sectionContent

  return (
    <section id="timeline" aria-labelledby="timeline-title" className={cn(SECTION, 'pt-24')}>
      <ListHeading id="timeline-title" title={timeline.title} />
      <ol>
        {buildTimeline().map((e) => {
          const role = e.type === 'work' ? experience.find((x) => x.title === e.title && x.company === e.subtitle) : undefined
          const [first, ...rest] = role?.responsibilities ?? []
          return (
            <li key={`${e.title}-${e.sortKey}`} className="rise-in border-b border-line py-5">
              <div className="flex flex-col gap-x-6 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-row text-ink">
                  {e.title}
                  <span className="font-normal text-muted">{` · ${e.subtitle}`}</span>
                </h3>
                <p className="tabular shrink-0 text-sm text-muted">{e.date}</p>
              </div>
              {e.note && <p className="mt-1 text-sm text-muted">{e.note}</p>}
              {first && (
                <ul className="mt-2 list-disc pl-5 leading-relaxed text-muted-strong marker:text-muted">
                  <li>{first}</li>
                </ul>
              )}
              {rest.length > 0 && (
                <details className="more">
                  <summary className="more__summary text-sm text-muted-strong hover:text-ink">
                    <span className="more__closed">{`+ ${rest.length} more`}</span>
                    <span className="more__open">{timeline.less}</span>
                    <span className="sr-only">{` from ${e.subtitle}`}</span>
                  </summary>
                  <ul className="grid list-disc gap-1 pl-5 leading-relaxed text-muted-strong marker:text-muted">
                    {rest.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </details>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
