import { SECTION } from '@/components/ui/grid'
import { SectionHeading } from '@/components/ui/section-heading'
import { elevationProfile } from '@/lib/contours'
import { sectionContent } from '@/lib/data'
import { buildElevationStrip, elevationFigures, type StripEntry } from '@/lib/elevation'
import { cn } from '@/lib/utils'

const pct = (n: number) => `${(n * 100).toFixed(2)}%`

/** A survey spot height: the glyph a map uses for a measured point. */
function SpotHeight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 10 10" className="h-2.5 w-2.5 shrink-0 fill-current text-ink">
      <path d="M5 1 9 9H1Z" />
    </svg>
  )
}

function Lane({ entries, className }: { entries: StripEntry[]; className: string }) {
  return (
    <>
      {entries.map((e) => (
        <span
          key={`${e.title}-${e.sortKey}`}
          className={cn('absolute h-1.5 rounded-full', className)}
          style={{ left: pct(e.start), width: pct(Math.max(e.end - e.start, 0.01)) }}
        />
      ))}
    </>
  )
}

/**
 * The elevation strip (spec §5): the proof counts as the strip's legend of spot heights, then the
 * route from 2020 to now as a ridge with each role (ink) and degree
 * (line-strong) as a span along it, and the "you are here" marker at now. The
 * drawn strip is decorative; the dated list under it carries the facts. The
 * marker travels to now as the strip enters view and rests there
 * (.elevation-marker on the .elevation-track view timeline in globals.css);
 * at rest, and without support, it sits at now.
 */
export function ElevationStrip() {
  const strip = buildElevationStrip()
  const figures = elevationFigures()
  const { timeline } = sectionContent

  return (
    <section id="timeline" aria-labelledby="timeline-title" className={cn(SECTION, 'pb-[72px] md:pb-[112px]')}>
      <SectionHeading id="timeline-title" title={timeline.title} />
      {/* The strip's legend: each count beside its spot height, the way a map prints one. */}
      <ul className="flex flex-wrap gap-x-10 gap-y-4 border-y border-line py-5">
        {figures.map((f) => (
          <li key={f.label} className="flex items-baseline gap-2">
            <SpotHeight />
            <span className="text-title tabular text-ink">{f.value}</span>
            <span className="text-sm leading-snug text-muted-strong">{f.label}</span>
          </li>
        ))}
      </ul>
      <div aria-hidden="true" className="elevation-track relative mt-12 h-28 overflow-x-clip">
        <svg
          viewBox={elevationProfile.viewBox}
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-0 h-14 w-full text-contour"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path d={elevationProfile.d} vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="absolute inset-x-0 top-16 h-1.5">
          <Lane entries={strip.entries.filter((e) => e.type === 'work')} className="bg-ink" />
        </div>
        <div className="absolute inset-x-0 top-[4.75rem] h-1.5">
          <Lane entries={strip.entries.filter((e) => e.type === 'education')} className="bg-line-strong" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-6 border-t border-line">
          {strip.years.map((y) => (
            <span key={y.year} className="absolute top-0 h-full border-l border-line-strong pl-1" style={{ left: pct(y.at) }}>
              <span className="map-label tabular text-muted">{y.year}</span>
            </span>
          ))}
        </div>
        <div className="elevation-marker pointer-events-none absolute inset-0">
          <span className="absolute right-0 top-0 h-full w-0.5 bg-trail" />
          <span className="map-label absolute right-2 top-0 text-trail">{timeline.here}</span>
        </div>
      </div>
      <ol className="mt-8 grid gap-6 md:grid-cols-3">
        {strip.entries.map((e) => (
          <li key={`${e.title}-${e.sortKey}`} className="border-t border-line pt-3">
            <p className="map-label tabular text-muted">{e.date}</p>
            <p className="text-title mt-2 text-ink">{e.title}</p>
            <p className="mt-1 text-muted-strong">{e.subtitle}</p>
            {e.note && <p className="mt-2 max-w-[32ch] text-sm text-muted">{e.note}</p>}
          </li>
        ))}
      </ol>
    </section>
  )
}
