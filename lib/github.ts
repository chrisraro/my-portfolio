import { socialLinks } from '@/lib/data'

// GitHub activity for the homepage: the contribution calendar and the most
// recently pushed public repositories, read from GitHub's GraphQL API on the
// server. Needs GITHUB_TOKEN; without it nothing is fetched and the section
// does not render, the same degraded-but-honest rule the API routes follow.
// The token never reaches the client: this module is only imported by server
// components.

export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export interface ContributionDay {
  /** ISO date, YYYY-MM-DD. */
  date: string
  count: number
  level: ContributionLevel
}

export interface GithubRepo {
  name: string
  url: string
  description: string | null
  language: string | null
  /** ISO timestamp of the last push. */
  pushedAt: string
}

export interface GithubActivity {
  login: string
  profileUrl: string
  /** Contributions in the last year, as GitHub counts them. */
  total: number
  /** Columns of the calendar, oldest first; the first and last may be partial. */
  weeks: ContributionDay[][]
  activeDays: number
  longestStreak: number
  repos: GithubRepo[]
}

/** How often the homepage re-reads GitHub, in seconds. */
export const GITHUB_REVALIDATE_SECONDS = 3600

const ENDPOINT = 'https://api.github.com/graphql'
const REPO_COUNT = 6

const LEVELS: Record<string, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

const QUERY = `
query ($login: String!, $repos: Int!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
    repositories(first: $repos, ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false, orderBy: { field: PUSHED_AT, direction: DESC }) {
      nodes { name url description pushedAt primaryLanguage { name } }
    }
  }
}`

/** The GitHub profile the site already links to (lib/data.ts), or null. */
export function githubProfile(): { login: string; profileUrl: string } | null {
  const link = socialLinks.find((s) => s.icon === 'github')
  const login = link?.url.match(/^https:\/\/github\.com\/([A-Za-z0-9-]+)\/?$/)?.[1]
  return link && login ? { login, profileUrl: link.url } : null
}

/** The longest run of consecutive days with at least one contribution. */
export function longestStreak(days: ContributionDay[]): number {
  let best = 0
  let run = 0
  for (const day of days) {
    run = day.count > 0 ? run + 1 : 0
    if (run > best) best = run
  }
  return best
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const text = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null

/**
 * Turns a GraphQL response into what the section draws. Returns null for
 * anything that is not the expected shape (an error payload, an unknown user),
 * so a surprise from GitHub removes the section instead of breaking the page.
 */
export function shapeActivity(payload: unknown, login: string, profileUrl: string): GithubActivity | null {
  if (!isRecord(payload) || !isRecord(payload.data) || !isRecord(payload.data.user)) return null
  const user = payload.data.user
  const collection = user.contributionsCollection
  const calendar = isRecord(collection) ? collection.contributionCalendar : null
  if (!isRecord(calendar) || typeof calendar.totalContributions !== 'number' || !Array.isArray(calendar.weeks)) {
    return null
  }

  const weeks: ContributionDay[][] = []
  for (const week of calendar.weeks) {
    if (!isRecord(week) || !Array.isArray(week.contributionDays)) return null
    const days: ContributionDay[] = []
    for (const day of week.contributionDays) {
      if (!isRecord(day) || typeof day.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day.date)) return null
      if (typeof day.contributionCount !== 'number') return null
      const level = typeof day.contributionLevel === 'string' ? LEVELS[day.contributionLevel] : undefined
      days.push({ date: day.date, count: day.contributionCount, level: level ?? (day.contributionCount > 0 ? 1 : 0) })
    }
    if (days.length) weeks.push(days)
  }
  if (!weeks.length) return null

  const nodes = isRecord(user.repositories) && Array.isArray(user.repositories.nodes) ? user.repositories.nodes : []
  const repos: GithubRepo[] = []
  for (const node of nodes) {
    if (!isRecord(node)) continue
    const name = text(node.name)
    const url = text(node.url)
    const pushedAt = text(node.pushedAt)
    // Only links back to github.com are rendered.
    if (!name || !url || !pushedAt || !url.startsWith('https://github.com/')) continue
    repos.push({
      name,
      url,
      description: text(node.description),
      language: isRecord(node.primaryLanguage) ? text(node.primaryLanguage.name) : null,
      pushedAt,
    })
  }

  const days = weeks.flat()
  return {
    login,
    profileUrl,
    total: calendar.totalContributions,
    weeks,
    activeDays: days.filter((d) => d.count > 0).length,
    longestStreak: longestStreak(days),
    repos: repos.slice(0, REPO_COUNT),
  }
}

/**
 * Reads the activity from GitHub, cached for an hour. Null when there is no
 * token, no GitHub link in the data, or GitHub does not answer as expected.
 */
export async function fetchGithubActivity(): Promise<GithubActivity | null> {
  const token = process.env.GITHUB_TOKEN
  const profile = githubProfile()
  if (!token || !profile) return null

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
        'user-agent': 'portfolio-site',
      },
      body: JSON.stringify({ query: QUERY, variables: { login: profile.login, repos: REPO_COUNT } }),
      next: { revalidate: GITHUB_REVALIDATE_SECONDS },
    })
    if (!response.ok) return null
    return shapeActivity(await response.json(), profile.login, profile.profileUrl)
  } catch {
    return null
  }
}
