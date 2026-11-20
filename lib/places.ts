import type { Project, ProjectPlace } from '@/types'

/** One pin on the field map: a verified place and the projects that run there. */
export interface PlaceGroup extends Omit<ProjectPlace, 'evidence'> {
  projects: Project[]
}

/**
 * Pinned projects grouped by place name, north to south (the map's reading
 * order). Within a place, projects keep their order in lib/data.ts, so the
 * first one is the pin's link.
 */
export function placeGroups(list: Project[]): PlaceGroup[] {
  const groups: PlaceGroup[] = []
  for (const project of list) {
    const place = project.place
    if (!place) continue
    const group = groups.find((g) => g.name === place.name)
    if (group) {
      group.projects.push(project)
    } else {
      groups.push({ name: place.name, region: place.region, lat: place.lat, lng: place.lng, precision: place.precision, projects: [project] })
    }
  }
  return groups.sort((a, b) => b.lat - a.lat)
}

/** Projects whose own data names no place: listed beside the map, never pinned. */
export function unplacedProjects(list: Project[]): Project[] {
  return list.filter((p) => !p.place)
}
