import { sectionContent } from '@/lib/data'
import { buildTimeline, type TimelineEntry } from '@/lib/timeline'

// Two labelled groups replace the old filled-versus-hollow dot, which encoded
// work versus education with no legend.
function Group({ label, entries }: { label: string; entries: TimelineEntry[] }) {
  return (
    <div>
      <h3 className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.1em] text-accent">{label}</h3>
      <ol className="border-l border-line">
        {entries.map((entry) => (
          <li key={`${entry.title}-${entry.subtitle}-${entry.sortKey}`} className="relative pb-6 pl-5 last:pb-0">
            <span aria-hidden="true" className="absolute -left-[3.5px] top-2 h-1.5 w-1.5 rounded-full bg-line-strong" />
            <p className="font-mono text-xs text-muted">{entry.date}</p>
            <p className="mt-1 font-medium text-ink">{entry.title}</p>
            <p className="text-sm text-muted-strong">{entry.subtitle}</p>
            {entry.note && <p className="mt-1 text-sm italic text-muted">{entry.note}</p>}
          </li>
        ))}
      </ol>
    </div>
  )
}

export function Changelog() {
  const timeline = buildTimeline()

  return (
    // Changelog and Stack sit last before the ask. They share the page's 8px
    // panel language, and a tighter gap between them, so the descent to
    // Contact reads as one closing run rather than two bare afterthoughts.
    <section id="changelog" aria-labelledby="changelog-title" className="mx-auto max-w-6xl px-5 pb-12 pt-16 sm:px-8 md:pb-14 md:pt-20">
      <p className="eyebrow mb-3">{sectionContent.changelog.eyebrow}</p>
      <h2 id="changelog-title" className="text-fluid-h2 mb-8 text-ink">
        {sectionContent.changelog.title}
      </h2>
      <div className="grid gap-10 rounded-lg border border-line bg-panel p-5 sm:p-6 md:grid-cols-[2fr_1fr]">
        <Group label="Work" entries={timeline.filter((e) => e.type === 'work')} />
        <Group label="Education" entries={timeline.filter((e) => e.type === 'education')} />
      </div>
    </section>
  )
}
