import { experience } from '@/lib/data'
import { buildTimeline } from '@/lib/timeline'

interface WorkHistoryProps {
  /** Add each role's responsibilities (/hire). /about shows the dated route only. */
  detailed?: boolean
}

/**
 * The dated route (spec §5): every role and degree, newest first, from
 * buildTimeline(). Each is an h3 under its section's h2: dates in a map label,
 * the title, the employer or school with the role's locality, and the note on
 * a role that overlapped another.
 */
export function WorkHistory({ detailed = false }: WorkHistoryProps) {
  return (
    <ol className="grid gap-8">
      {buildTimeline().map((e) => {
        const role = e.type === 'work' ? experience.find((x) => x.title === e.title && x.company === e.subtitle) : undefined
        return (
          <li key={`${e.title}-${e.sortKey}`} className="grid gap-2 border-t border-line pt-4 md:grid-cols-[12rem_1fr] md:gap-8">
            <p className="tabular text-sm text-muted">{e.date}</p>
            <div className="min-w-0">
              <h3 className="text-title text-ink">{e.title}</h3>
              <p className="mt-1 text-muted-strong">{role ? `${e.subtitle} · ${role.location}` : e.subtitle}</p>
              {e.note && <p className="mt-2 max-w-[40ch] text-sm text-muted">{e.note}</p>}
              {detailed && role && (
                <ul className="mt-4 grid max-w-[62ch] list-disc gap-2 pl-5 leading-relaxed text-muted-strong">
                  {role.responsibilities.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
