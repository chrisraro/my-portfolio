import type { CSSProperties } from 'react'
import { SectionHeading } from '@/components/ui/section-heading'
import { sectionContent } from '@/lib/data'
import { buildTimeline, type TimelineEntry } from '@/lib/timeline'

/**
 * One lane of the route: a line with a stop per role, newest first.
 * Horizontal from 768px, vertical below. The line draws across the section as
 * it scrolls in and each stop pops as the line passes it (`.reveal-route`,
 * `.reveal-stop`); without that it is simply drawn.
 */
function Lane({ label, entries }: { label: string; entries: TimelineEntry[] }) {
  return (
    <div className="grid gap-5 border-t border-line pt-6 md:grid-cols-[9rem_1fr] md:gap-8">
      <h3 className="edge-code text-sm text-ink">{label}</h3>
      <div className="relative pl-8 md:pl-0 md:pt-10">
        <span
          aria-hidden="true"
          className="reveal-route absolute bottom-0 left-[7px] top-1 w-0.5 bg-line-strong md:bottom-auto md:left-0 md:right-0 md:top-[7px] md:h-0.5 md:w-auto"
        />
        <ol className="grid gap-8 md:grid-flow-col md:auto-cols-fr md:gap-6">
          {entries.map((entry, i) => (
            <li key={`${entry.title}-${entry.subtitle}-${entry.sortKey}`} className="relative">
              <span
                aria-hidden="true"
                className="reveal-stop absolute -left-8 top-1 h-4 w-4 rounded-full border-2 border-ink bg-canvas md:-top-10 md:left-0"
                style={{ '--i': i } as CSSProperties}
              />
              <p className="edge-code text-[0.8125rem] text-muted">{entry.date}</p>
              <p className="text-title mt-2 text-ink">{entry.title}</p>
              <p className="mt-1 text-muted-strong">{entry.subtitle}</p>
              {entry.note && <p className="mt-2 max-w-[32ch] text-sm text-muted">{entry.note}</p>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export function RouteLine() {
  const timeline = buildTimeline()

  return (
    <section id="changelog" aria-labelledby="changelog-title" className="route mx-auto max-w-6xl px-5 pb-[72px] sm:px-8 md:pb-[112px]">
      <SectionHeading id="changelog-title" eyebrow={sectionContent.changelog.eyebrow} title={sectionContent.changelog.title} />
      <div className="grid gap-10">
        <Lane label="Work" entries={timeline.filter((e) => e.type === 'work')} />
        <Lane label="Education" entries={timeline.filter((e) => e.type === 'education')} />
      </div>
    </section>
  )
}
