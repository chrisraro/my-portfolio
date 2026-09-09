import { experience, education } from '@/lib/data'
import { endOfRange } from '@/lib/dates'
import { ExperienceItem, EducationItem } from '@/types'

export type TimelineEntry = {
  type: 'work' | 'education'
  title: string
  subtitle: string
  note?: string
  date: string
  sortKey: number
}

export function buildTimeline(): TimelineEntry[] {
  const entries: TimelineEntry[] = []

  experience.forEach((item: ExperienceItem) => {
    entries.push({
      type: 'work',
      title: item.title,
      subtitle: item.company,
      note: item.concurrent,
      date: item.dates.replace(/\s*–\s*/g, ' – '),
      sortKey: endOfRange(item.dates),
    })
  })

  education.forEach((item: EducationItem) => {
    entries.push({
      type: 'education',
      title: item.degree,
      subtitle: item.school,
      date: item.dates,
      sortKey: endOfRange(item.dates),
    })
  })

  return entries.sort((a, b) => b.sortKey - a.sortKey)
}
