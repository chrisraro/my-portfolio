import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'
import { githubContent, sectionContent } from '@/lib/data'
import { fetchGithubActivity, type ContributionDay, type ContributionLevel, type GithubActivity as Activity } from '@/lib/github'
import { cn } from '@/lib/utils'

// The calendar is one SVG that scales with the column: 10px cells on a 13px
// pitch, a week per column, Sunday at the top (GitHub's own layout).
const CELL = 10
const PITCH = 13
const PHONE_WEEKS = 26

// Amber as ink, in four strengths over a hairline for an empty day. Never
// green: green means a live system and nothing else.
const LEVEL_FILL: Record<ContributionLevel, string> = {
  0: 'fill-line',
  1: 'fill-accent/30',
  2: 'fill-accent/50',
  3: 'fill-accent/75',
  4: 'fill-accent',
}

const weekday = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay()

const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })

const count = (value: number) => value.toLocaleString('en-US')

function Figure({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col-reverse justify-end gap-2">
      <dt className="text-sm text-muted-strong">{label}</dt>
      <dd className="text-numeral text-ink">{count(value)}</dd>
    </div>
  )
}

function Calendar({ weeks, label, className }: { weeks: ContributionDay[][]; label: string; className?: string }) {
  const width = weeks.length * PITCH - (PITCH - CELL)
  const height = 7 * PITCH - (PITCH - CELL)
  return (
    <svg role="img" aria-label={label} viewBox={`0 0 ${width} ${height}`} className={cn('block h-auto w-full', className)}>
      {weeks.map((week, x) =>
        week.map((day) => (
          <rect
            key={day.date}
            x={x * PITCH}
            y={weekday(day.date) * PITCH}
            width={CELL}
            height={CELL}
            rx={2}
            className={LEVEL_FILL[day.level]}
          >
            <title>{`${day.date}: ${day.count}`}</title>
          </rect>
        )),
      )}
    </svg>
  )
}

/**
 * The section's markup, from data already fetched. Split from the fetch so it
 * can be rendered in tests. No motion: a still chart, like the screenshots.
 */
export function GithubActivityPanel({ activity }: { activity: Activity }) {
  const { weeks, repos } = activity
  const summary = `${count(activity.total)} ${githubContent.totalLabel}, on ${count(activity.activeDays)} ${githubContent.activeDaysLabel}`

  return (
    <section id="github" aria-labelledby="github-title" className="defer-render mx-auto max-w-6xl px-5 pb-[72px] sm:px-8 md:pb-[112px]">
      <SectionHeading id="github-title" eyebrow={sectionContent.github.eyebrow} title={sectionContent.github.title} />
      <div className="grid gap-10 border-t border-line pt-6 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
        <div>
          <dl className="grid grid-cols-3 gap-6">
            <Figure value={activity.total} label={githubContent.totalLabel} />
            <Figure value={activity.activeDays} label={githubContent.activeDaysLabel} />
            <Figure value={activity.longestStreak} label={githubContent.streakLabel} />
          </dl>
          {/* A phone cannot hold 53 columns at a readable size: it gets the latest half. */}
          <Calendar weeks={weeks} label={summary} className="mt-8 hidden sm:block" />
          <Calendar weeks={weeks.slice(-PHONE_WEEKS)} label={summary} className="mt-8 sm:hidden" />
          <p className="edge-code mt-3 text-xs text-muted sm:hidden">{githubContent.phoneRange}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <p aria-hidden="true" className="edge-code flex items-center gap-1.5 text-xs text-muted">
              {githubContent.less}
              {([0, 1, 2, 3, 4] as ContributionLevel[]).map((level) => (
                <svg key={level} viewBox="0 0 10 10" className="h-2.5 w-2.5">
                  <rect width={10} height={10} rx={2} className={LEVEL_FILL[level]} />
                </svg>
              ))}
              {githubContent.more}
            </p>
            <a
              href={activity.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="edge-code inline-flex min-h-[44px] items-center gap-1 text-sm text-accent underline-offset-4 hover:underline"
            >
              github.com/{activity.login}
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>

        {repos.length > 0 && (
          <div>
            <h3 className="edge-code text-sm text-ink">{githubContent.reposLabel}</h3>
            <ul className="mt-2">
              {repos.map((repo) => (
                <li key={repo.url} className="border-b border-line py-3 last:border-b-0">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-baseline justify-between gap-4"
                  >
                    <span className="min-w-0 truncate font-medium text-ink underline-offset-4 group-hover:underline">
                      {repo.name}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                    <span className="edge-code shrink-0 text-xs text-muted">{monthYear.format(new Date(repo.pushedAt))}</span>
                  </a>
                  {(repo.description || repo.language) && (
                    <p className="mt-1 text-sm text-muted-strong">
                      {repo.language && <span className={cn('edge-code text-xs text-muted', repo.description && 'mr-2')}>{repo.language}</span>}
                      {repo.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * A year of GitHub activity, read on the server and refreshed hourly. Renders
 * nothing when GITHUB_TOKEN is unset or GitHub does not answer.
 */
export async function GithubActivity() {
  const activity = await fetchGithubActivity()
  return activity ? <GithubActivityPanel activity={activity} /> : null
}
