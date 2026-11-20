// The field map's projection (spec §5): equirectangular over the Philippines'
// bounding box, one scale on both axes. Plain TypeScript with no imports, so
// scripts/build-ph-outline.mjs can import this file under Node's type
// stripping: the generated outline and the pins share these numbers.
export const MAP_BOUNDS = { west: 116.9, east: 126.7, south: 4.5, north: 21.2 } as const

export const MAP_WIDTH = 600
const SCALE = MAP_WIDTH / (MAP_BOUNDS.east - MAP_BOUNDS.west)
export const MAP_HEIGHT = Math.round((MAP_BOUNDS.north - MAP_BOUNDS.south) * SCALE)
export const MAP_VIEWBOX = `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`

const round = (v: number): number => Math.round(v * 10) / 10

/** A latitude and longitude as map units, x right and y down, one decimal. */
export function project(lat: number, lng: number): { x: number; y: number } {
  return { x: round((lng - MAP_BOUNDS.west) * SCALE), y: round((MAP_BOUNDS.north - lat) * SCALE) }
}
