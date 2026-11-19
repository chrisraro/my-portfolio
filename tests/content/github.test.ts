import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchGithubActivity, githubProfile, longestStreak, shapeActivity, type ContributionDay } from '@/lib/github'
import { socialLinks } from '@/lib/data'
import { githubPayload } from '../helpers/github-fixture'

const day = (count: number): ContributionDay => ({ date: '2026-01-01', count, level: count ? 1 : 0 })

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('githubProfile', () => {
  it('is the GitHub link the site already publishes', () => {
    const link = socialLinks.find((s) => s.icon === 'github')
    expect(githubProfile()).toEqual({ login: 'chrisraro', profileUrl: link?.url })
  })
})

describe('longestStreak', () => {
  it('counts the longest run of days with a contribution', () => {
    expect(longestStreak([1, 2, 0, 3, 1, 4, 0, 1].map(day))).toBe(3)
    expect(longestStreak([0, 0].map(day))).toBe(0)
    expect(longestStreak([])).toBe(0)
  })
})

describe('shapeActivity', () => {
  const activity = shapeActivity(githubPayload(), 'chrisraro', 'https://github.com/chrisraro')

  it('keeps every week and day, with levels 0 to 4', () => {
    expect(activity).not.toBeNull()
    expect(activity?.weeks).toHaveLength(53)
    expect(activity?.weeks[52]).toHaveLength(4)
    const days = activity?.weeks.flat() ?? []
    expect(days.every((d) => d.level >= 0 && d.level <= 4)).toBe(true)
    expect(days.reduce((sum, d) => sum + d.count, 0)).toBe(activity?.total)
    expect(activity?.activeDays).toBe(days.filter((d) => d.count > 0).length)
  })

  it('keeps only repositories that link to github.com', () => {
    expect(activity?.repos.map((r) => r.name)).toEqual(['my-portfolio', 'SkimCare'])
    expect(activity?.repos[0].language).toBe('TypeScript')
    expect(activity?.repos[1].description).toBeNull()
  })

  it('returns null for anything that is not the expected shape', () => {
    expect(shapeActivity(null, 'a', 'b')).toBeNull()
    expect(shapeActivity({ errors: [{ message: 'Bad credentials' }] }, 'a', 'b')).toBeNull()
    expect(shapeActivity({ data: { user: null } }, 'a', 'b')).toBeNull()
    expect(shapeActivity({ data: { user: { contributionsCollection: { contributionCalendar: { totalContributions: 1, weeks: [] } } } } }, 'a', 'b')).toBeNull()
  })
})

describe('fetchGithubActivity', () => {
  it('fetches nothing without GITHUB_TOKEN', async () => {
    vi.stubEnv('GITHUB_TOKEN', '')
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    expect(await fetchGithubActivity()).toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('sends the token only to api.github.com and shapes the answer', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'test-token')
    const fetchMock = vi.fn(async () => new Response(JSON.stringify(githubPayload()), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const activity = await fetchGithubActivity()
    expect(activity?.login).toBe('chrisraro')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://api.github.com/graphql')
    expect((init.headers as Record<string, string>).authorization).toBe('Bearer test-token')
  })

  it('is null when GitHub refuses or the network fails', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'test-token')
    vi.stubGlobal('fetch', vi.fn(async () => new Response('nope', { status: 401 })))
    expect(await fetchGithubActivity()).toBeNull()
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline') }))
    expect(await fetchGithubActivity()).toBeNull()
  })
})
