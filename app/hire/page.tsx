import type { Metadata } from 'next'
import { Download } from 'lucide-react'
import { PlanTheRoute } from '@/components/sections/plan-the-route'
import { SECTION } from '@/components/ui/grid'
import { PageIntro } from '@/components/ui/page-intro'
import { SectionHeading } from '@/components/ui/section-heading'
import { TrailLink } from '@/components/ui/trail-link'
import { WorkHistory } from '@/components/ui/work-history'
import { availability, contactInfo, ctaLabels, hirePageContent, pagesUpdated, resumeUrl, skills, socialLinks } from '@/lib/data'
import { buildPageMetadata } from '@/lib/site-metadata'
import { cn } from '@/lib/utils'
import type { Skill } from '@/types'

export const metadata: Metadata = buildPageMetadata(hirePageContent.title, hirePageContent.answer, '/hire')

const BLOCK = 'pb-[72px] md:pb-[112px]'
const CHIP = 'map-label rounded-sm border border-line-strong px-3 py-2 text-ink'

/**
 * Hire (spec §5), the team path from the fork: the answer, the résumé
 * (primary) and the email; the stack by depth beside the facts at a glance;
 * how I work, with the AI tools in use; the full work history; then the form,
 * whose copy already invites a hiring note.
 */
export default function HirePage() {
  const c = hirePageContent
  const github = socialLinks.find((l) => l.icon === 'github')
  const core = c.stack.coreIds
    .map((id) => skills.find((s) => s.id === id))
    .filter((s): s is Skill => Boolean(s))
  const rest = skills.filter((s) => c.stack.coreIds.indexOf(s.id) === -1)
  const categories = rest.map((s) => s.category).filter((cat, i, all) => all.indexOf(cat) === i)

  return (
    <>
      <PageIntro eyebrow={c.eyebrow} title={c.heading} answer={c.answer} updated={pagesUpdated}>
        <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="press button-primary">
          {ctaLabels.downloadResume}
          <Download aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only">(PDF, opens in a new tab)</span>
        </a>
        <a href={`mailto:${contactInfo.email}`} className="press button-secondary">
          {contactInfo.email}
        </a>
      </PageIntro>

      <div className={cn(SECTION, BLOCK, 'grid gap-12 lg:grid-cols-[7fr_5fr] lg:items-start')}>
        <section aria-labelledby="stack-title" className="min-w-0">
          <SectionHeading id="stack-title" eyebrow={c.stack.eyebrow} title={c.stack.title} />
          <h3 className="map-label text-ink">{c.stack.coreLabel}</h3>
          <p className="mt-1 text-sm text-muted">{c.stack.coreNote}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {core.map((s) => (
              <li key={s.id} className={CHIP}>
                {s.name}
              </li>
            ))}
          </ul>
          <h3 className="map-label mt-10 text-ink">{c.stack.moreLabel}</h3>
          <dl className="mt-4 grid gap-4">
            {categories.map((cat) => (
              <div key={cat} className="grid gap-2 sm:grid-cols-[11rem_1fr]">
                <dt className="text-sm text-muted-strong">{cat}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-2">
                    {rest
                      .filter((s) => s.category === cat)
                      .map((s) => (
                        <li key={s.id} className={CHIP}>
                          {s.name}
                        </li>
                      ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <aside aria-labelledby="facts-title" className="rounded-sm border border-line bg-panel p-6 sm:p-8">
          <h2 id="facts-title" className="map-label text-ink">
            {c.facts.title}
          </h2>
          <dl className="mt-5 grid gap-4">
            <div>
              <dt className="map-label text-muted">{c.facts.labels.availability}</dt>
              <dd className="mt-1 text-ink">{availability}</dd>
            </div>
            <div>
              <dt className="map-label text-muted">{c.facts.labels.base}</dt>
              <dd className="mt-1 text-ink">{contactInfo.location}</dd>
            </div>
            {github && (
              <div>
                <dt className="map-label text-muted">{c.facts.labels.code}</dt>
                <dd className="mt-1">
                  <TrailLink href={github.url} text={github.name} kind="label" external />
                </dd>
              </div>
            )}
          </dl>
        </aside>
      </div>

      <section aria-labelledby="practice-title" className={cn(SECTION, BLOCK)}>
        <SectionHeading id="practice-title" eyebrow={c.howIWork.eyebrow} title={c.howIWork.title} />
        <ul className="grid gap-6 md:grid-cols-3">
          {c.howIWork.notes.map((n) => (
            <li key={n.title} className="border-t border-line pt-4">
              <h3 className="text-title text-ink">{n.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-strong">{n.body}</p>
            </li>
          ))}
        </ul>
        <p className="map-label mt-10 text-muted-strong">{c.howIWork.aiLead}</p>
        <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
          {c.howIWork.aiInUse.map((item) => (
            <li key={item.label}>
              {item.href ? (
                <TrailLink href={item.href} text={item.label} kind="label" />
              ) : (
                <span className="map-label inline-flex min-h-[44px] items-center text-ink sm:min-h-[32px]">{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="history-title" className={cn(SECTION, BLOCK)}>
        <SectionHeading id="history-title" eyebrow={c.history.eyebrow} title={c.history.title} />
        <WorkHistory detailed />
      </section>

      <PlanTheRoute />
    </>
  )
}
