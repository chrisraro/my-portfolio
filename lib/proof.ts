const NUMBER_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
}

/**
 * "Fifteen projects shipped" → { value: '15', label: 'projects shipped' }.
 * The proof points are written as sentences so they read correctly anywhere;
 * the proof band sets the number as a plain numeral ("4", not "04"). Throws rather than guessing
 * when a point does not start with a number word.
 */
export function splitProofPoint(point: string): { value: string; label: string } {
  const [first, ...rest] = point.split(' ')
  const n = NUMBER_WORDS[first.toLowerCase()]
  if (n === undefined) throw new Error(`Proof point must start with a number word: "${point}"`)
  return { value: String(n), label: rest.join(' ') }
}

/** 4 → 'four': a count as the copy writes it. Throws rather than guessing outside 1-20. */
export function numberWord(n: number): string {
  const word = Object.keys(NUMBER_WORDS).find((w) => NUMBER_WORDS[w] === n)
  if (word === undefined) throw new Error(`No number word for ${n}`)
  return word
}
