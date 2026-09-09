// Portfolio dates are written for humans ('November 2024 – Present'), so they
// need parsing before they can be sorted. The previous implementation took the
// first four-digit number in the string, which sorted an ongoing role by its
// start year and produced 2024, 2025, 2024, 2023 in the rendered timeline.

const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  jan: 0, feb: 1, mar: 2, apr: 3, jun: 5, jul: 6,
  aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11,
}

/**
 * Convert a single date token to epoch milliseconds.
 * 'Present', 'current' and 'now' resolve to `now`. An unparseable token
 * returns 0, which sorts last rather than throwing.
 */
export function parseDateToken(token: string, now: Date = new Date()): number {
  const cleaned = token.trim()
  if (/present|current|now/i.test(cleaned)) return now.getTime()

  const match = cleaned.match(/([A-Za-z]+)?\s*(\d{4})/)
  if (!match) return 0

  const monthName = match[1]
  const year = Number(match[2])
  const month = monthName ? MONTHS[monthName.toLowerCase()] ?? 0 : 0
  return Date.UTC(year, month, 1)
}

/**
 * The sort key for a human date range is its END — that is what "most recent"
 * means. Splits on en dash, em dash or hyphen.
 */
export function endOfRange(dates: string, now: Date = new Date()): number {
  const parts = dates.split(/\s*[–—-]\s*/)
  return parseDateToken(parts[parts.length - 1], now)
}
