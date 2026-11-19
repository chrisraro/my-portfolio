import { SectionHeader } from '@/components/ui/section-header'
import { sectionContent } from '@/lib/data'
import { buildTimeline, type TimelineEntry } from '@/lib/timeline'

function Group({ label, entries }: { label: string; entries: TimelineEntry[] }) {
  return (
    <div className="reveal">
      <h3 className="label mb-3 px-1">{label}</h3>
      <ul className="group-list">
        {entries.map((entry) => (
          <li key={`${entry.title}-${entry.subtitle}`} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 p-5 sm:px-7">
            <div>
              <p className="font-display text-[1.5rem] leading-tight tracking-[-0.015em]">{entry.title}</p>
              <p className="mt-0.5 text-gray-text">{entry.subtitle}</p>
              {entry.note && <p className="mt-1 text-sm text-gray-text">{entry.note}</p>}
            </div>
            <p className="text-sm tabular-nums text-gray-text">{entry.date}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Where he has worked and studied, as two iOS-style grouped lists, newest first. */
export function Experience() {
  const timeline = buildTimeline()
  return (
    <section id="changelog" aria-labelledby="changelog-title" className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 md:pb-32">
      <SectionHeader id="changelog-title" label={sectionContent.changelog.eyebrow} title={sectionContent.changelog.title} />
      <div className="grid gap-8 lg:grid-cols-2">
        <Group label="Work" entries={timeline.filter((e) => e.type === 'work')} />
        <Group label="Education" entries={timeline.filter((e) => e.type === 'education')} />
      </div>
    </section>
  )
}
