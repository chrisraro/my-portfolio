import type { Project } from '@/types'

/** Shipped: everything but a pre-launch site and work still in development. */
export function isShipped(project: Pick<Project, 'status'>): boolean {
  return project.status !== 'staging' && project.status !== 'in-development'
}

const NUMBER_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
}

/** 4 → 'four': a count as the copy writes it. Throws rather than guessing outside 1-20. */
export function numberWord(n: number): string {
  const word = Object.keys(NUMBER_WORDS).find((w) => NUMBER_WORDS[w] === n)
  if (word === undefined) throw new Error(`No number word for ${n}`)
  return word
}
