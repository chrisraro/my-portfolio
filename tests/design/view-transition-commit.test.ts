import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { COMMIT_WAIT, createCommitTracker, routeKey } from '@/lib/view-transition'

// Final review, Important 2-3 and the rapid-click race: the island's frozen
// frame waits for the route it navigated to, never longer than COMMIT_WAIT;
// a late commit lands focus on the new page, and an earlier navigation's
// commit never releases a newer transition.
describe('routeKey', () => {
  it('keys a route by path and query, ignoring hash, origin and a trailing slash', () => {
    expect(routeKey('/projects?band=sites')).toBe('/projects?band=sites')
    expect(routeKey('https://example.com/projects/latag/#top')).toBe('/projects/latag')
    expect(routeKey('/projects?')).toBe('/projects')
    expect(routeKey('/')).toBe('/')
  })
})

describe('COMMIT_WAIT', () => {
  it('keeps the frozen frame to about 300ms', () => {
    expect(COMMIT_WAIT).toBeLessThanOrEqual(300)
    expect(COMMIT_WAIT).toBeGreaterThan(0)
  })
})

describe('createCommitTracker', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('resolves true when the awaited route commits in time', async () => {
    const t = createCommitTracker()
    const token = t.begin()
    const late = vi.fn()
    const done = t.wait(token, '/projects/latag', COMMIT_WAIT, late)
    t.committed('/projects/latag')
    await expect(done).resolves.toBe(true)
    vi.advanceTimersByTime(COMMIT_WAIT * 2)
    t.committed('/projects/latag')
    expect(late).not.toHaveBeenCalled()
  })

  it('resolves false on timeout and runs the late action only when that route lands', async () => {
    const t = createCommitTracker()
    const token = t.begin()
    const late = vi.fn()
    const done = t.wait(token, '/projects/latag', COMMIT_WAIT, late)
    vi.advanceTimersByTime(COMMIT_WAIT)
    await expect(done).resolves.toBe(false)
    expect(late).not.toHaveBeenCalled()
    t.committed('/projects/latag')
    expect(late).toHaveBeenCalledTimes(1)
    t.committed('/projects/latag')
    expect(late).toHaveBeenCalledTimes(1)
  })

  it('drops a late action if a different route lands first (e.g. the back button)', async () => {
    const t = createCommitTracker()
    const late = vi.fn()
    const done = t.wait(t.begin(), '/projects/latag', COMMIT_WAIT, late)
    vi.advanceTimersByTime(COMMIT_WAIT)
    await done
    t.committed('/')
    t.committed('/projects/latag')
    expect(late).not.toHaveBeenCalled()
  })

  it('does not let an earlier navigation’s commit release a newer transition (rapid clicks)', async () => {
    const t = createCommitTracker()
    const first = t.begin()
    const firstLate = vi.fn()
    const a = t.wait(first, '/projects/latag', COMMIT_WAIT, firstLate)
    const second = t.begin()
    // The superseded wait is released at once, as not committed.
    await expect(a).resolves.toBe(false)
    expect(t.isLatest(first)).toBe(false)
    expect(t.isLatest(second)).toBe(true)

    const secondLate = vi.fn()
    let settled: boolean | undefined
    const b = t.wait(second, '/projects/giya', COMMIT_WAIT, secondLate).then((ok) => (settled = ok))
    t.committed('/projects/latag')
    await Promise.resolve()
    expect(settled).toBeUndefined()
    expect(firstLate).not.toHaveBeenCalled()
    t.committed('/projects/giya')
    await b
    expect(settled).toBe(true)
  })

  it('never waits on a superseded token', async () => {
    const t = createCommitTracker()
    const stale = t.begin()
    t.begin()
    await expect(t.wait(stale, '/projects/latag', COMMIT_WAIT)).resolves.toBe(false)
  })
})
