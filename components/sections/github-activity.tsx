import { ArrowUpRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { githubContent, sectionContent } from '@/lib/data'
import { fetchGithubActivity, type ContributionDay, type ContributionLevel, type GithubActivity as Activity } from '@/lib/github'
import { cn } from '@/lib/utils'

// One SVG that scales with its column: 10px cells on a 13px pitch, a week per
// column, Sunday at the top (GitHub's own layout).
const CELL = 10
const PITCH = 13
const PHONE_WEEKS = 26

// Monochrome: an empty day is a hairline gray, a busy one is black.
const LEVEL_FILL: Record<ContributionLevel, string> = {
  0: 'fill-gray-line',
  1: 'fill-ink [fill-opacity:0.25]',
  2: 'fill-ink [fill-opacity:0.45]',
  3: 'fill-ink [fill-opacity:0.7]',
  4: 'fill-ink',
}

const weekday = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay()
const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
const count = (value: number) => value.toLocaleString('en-US')

function Calendar({ weeks, label, className }: { weeks: ContributionDay[][]; label: string; className?: string }) {
  const width = weeks.length * PITCH - (PITCH - CELL)
  const height = 7 * PITCH - (PITCH - CELL)
  return (
    <svg role="img" aria-label={label} viewBox={`0 0 ${width} ${height}`} className={cn('block h-auto w-full', className)}>
      {weeks.map((week, x) =>
        week.map((day) => (
          <rect key={day.date} x={x * PITCH} y={weekday(day.date) * PITCH} width={CELL} height={CELL} rx={2.5} className={LEVEL_FILL[day.level]}>
            <title>{`${day.date}: ${day.count}`}</title>
          </rect>
        )),
      )}
    </svg>
  )
}

function Figure({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col-reverse justify-end gap-2">
      <dt className="text-sm text-gray-text">{label}</dt>
      <dd className="display-num">{count(value)}</dd>
    </div>
  )
}

/** The section's markup, from data already fetched; split from the fetch so it can be rendered in tests. */
export function GithubActivityPanel({ activity }: { activity: Activity }) {
  const { weeks, repos } = activity
  const summary = `${count(activity.total)} ${githubContent.totalLabel}, on ${count(activity.activeDays)} ${githubContent.activeDaysLabel}`

  return (
    <section id="github" aria-labelledby="github-title" className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 md:pb-32">
      <SectionHeader
        id="github-title"
        label={sectionContent.github.eyebrow}
        title={sectionContent.github.title}
        aside={
          <a href={activity.profileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            github.com/{activity.login}
            <ArrowUpRight aria-hidden="true" className="nudge nudge-up h-4 w-4" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="card reveal p-6 sm:p-8">
          <dl className="grid grid-cols-3 gap-6">
            <Figure value={activity.total} label={githubContent.totalLabel} />
            <Figure value={activity.activeDays} label={githubContent.activeDaysLabel} />
            <Figure value={activity.longestStreak} label={githubContent.streakLabel} />
          </dl>
          {/* A phone cannot hold 53 columns at a readable size: it gets the latest half. */}
          <Calendar weeks={weeks} label={summary} className="mt-8 hidden sm:block" />
          <Calendar weeks={weeks.slice(-PHONE_WEEKS)} label={summary} className="mt-8 sm:hidden" />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-text">
            <p className="sm:hidden">{githubContent.phoneRange}</p>
            <p aria-hidden="true" className="ml-auto flex items-center gap-1.5">
              {githubContent.less}
              {([0, 1, 2, 3, 4] as ContributionLevel[]).map((level) => (
                <svg key={level} viewBox="0 0 10 10" className="h-2.5 w-2.5">
                  <rect width={10} height={10} rx={2.5} className={LEVEL_FILL[level]} />
                </svg>
              ))}
              {githubContent.more}
            </p>
          </div>
        </div>

        {repos.length > 0 && (
          <div className="reveal">
            <h3 className="label mb-3 px-1">{githubContent.reposLabel}</h3>
            <ul className="group-list">
              {repos.map((repo) => (
                <li key={repo.url}>
                  <a href={repo.url} target="_blank" rel="noopener noreferrer" className="block p-4 transition-colors hover:bg-gray-fill sm:px-6">
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="min-w-0 truncate font-medium">
                        {repo.name}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </span>
                      <span className="shrink-0 text-xs tabular-nums text-gray-text">{monthYear.format(new Date(repo.pushedAt))}</span>
                    </span>
                    {(repo.description || repo.language) && (
                      <span className="mt-0.5 block text-sm text-gray-text">
                        {[repo.language, repo.description].filter(Boolean).join(' · ')}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

/** A year of GitHub activity, read on the server and refreshed hourly. Renders nothing without GITHUB_TOKEN. */
export async function GithubActivity() {
  const activity = await fetchGithubActivity()
  return activity ? <GithubActivityPanel activity={activity} /> : null
}
