import type { GalleryImage, Project, Recommendation } from '@/types'

export type FieldLogEntry =
  | { kind: 'photo'; image: GalleryImage }
  | { kind: 'quote'; recommendation: Recommendation; project?: Project }

/**
 * Photos lead; a quote follows every second photo, and any quotes left over go
 * at the end. It keeps the section about people and places without turning it
 * into a testimonial carousel.
 */
export function buildFieldLog(
  images: GalleryImage[],
  recs: Recommendation[],
  projects: Project[],
): FieldLogEntry[] {
  const quote = (recommendation: Recommendation): FieldLogEntry => ({
    kind: 'quote',
    recommendation,
    project: projects.find((p) => p.id === recommendation.projectId),
  })

  const entries: FieldLogEntry[] = []
  let next = 0
  images.forEach((image, i) => {
    entries.push({ kind: 'photo', image })
    if (i % 2 === 1 && next < recs.length) entries.push(quote(recs[next++]))
  })
  while (next < recs.length) entries.push(quote(recs[next++]))
  return entries
}
