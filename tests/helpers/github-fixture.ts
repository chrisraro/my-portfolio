// A GraphQL response in the shape GitHub's contributionCalendar returns, built
// deterministically: 53 weeks ending on a Wednesday, so the last week is partial.
const LEVEL_NAMES = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE']

export function githubPayload() {
  const start = Date.UTC(2025, 10, 9) // a Sunday
  const weeks = []
  let total = 0
  for (let w = 0; w < 53; w++) {
    const contributionDays = []
    for (let d = 0; d < 7; d++) {
      if (w === 52 && d > 3) break
      const n = w * 7 + d
      // Quiet weekends, a busy stretch in the middle of the year.
      const level = d === 0 || d === 6 ? 0 : (n * 7 + w) % 5
      const contributionCount = level * 3
      total += contributionCount
      contributionDays.push({
        date: new Date(start + n * 86_400_000).toISOString().slice(0, 10),
        contributionCount,
        contributionLevel: LEVEL_NAMES[level],
      })
    }
    weeks.push({ contributionDays })
  }
  return {
    data: {
      user: {
        contributionsCollection: { contributionCalendar: { totalContributions: total, weeks } },
        repositories: {
          nodes: [
            { name: 'my-portfolio', url: 'https://github.com/chrisraro/my-portfolio', description: 'This site.', pushedAt: '2026-11-10T08:00:00Z', primaryLanguage: { name: 'TypeScript' } },
            { name: 'SkimCare', url: 'https://github.com/chrisraro/SkimCare', description: null, pushedAt: '2026-09-02T08:00:00Z', primaryLanguage: null },
            { name: 'elsewhere', url: 'https://example.com/not-github', description: 'Dropped: not a github.com link.', pushedAt: '2026-08-01T08:00:00Z', primaryLanguage: null },
          ],
        },
      },
    },
  }
}
