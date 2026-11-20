import type { CSSProperties } from 'react'
import { MAP_HEIGHT, MAP_WIDTH } from '@/lib/geo'

// The /projects map pan (spec §4, "pan"). The map layer is the whole map,
// moved and scaled by transform (origin top left) inside a frame of the same
// size: point p lands at translate + scale * p. Pure, so it is tested without
// a browser; the page writes the result as custom properties (.map-pan).

export interface MapPan {
  /** Translate, in % of the layer's own width. */
  x: number
  /** Translate, in % of the layer's own height. */
  y: number
  scale: number
}

/** The whole map, at rest. */
export const IDENTITY_PAN: MapPan = { x: 0, y: 0, scale: 1 }

/** A lone pin zooms no further than this: labels and strokes scale with it. */
export const MAX_PAN_SCALE = 1.75

/** Room kept around the framed pins, in map units (a label runs about 90 units). */
export const PAN_PADDING = 90

const round2 = (v: number) => Math.round(v * 100) / 100
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/**
 * Frame these map points: centre their box in the frame at the largest scale
 * that fits it with padding, between 1 (the whole map) and MAX_PAN_SCALE, then
 * slide back where centring would show past the map's edge.
 */
export function panTo(points: readonly { x: number; y: number }[]): MapPan {
  if (points.length === 0) return IDENTITY_PAN
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const fit = Math.min(MAP_WIDTH / (maxX - minX + 2 * PAN_PADDING), MAP_HEIGHT / (maxY - minY + 2 * PAN_PADDING))
  const scale = clamp(fit, 1, MAX_PAN_SCALE)
  const tx = clamp(MAP_WIDTH / 2 - scale * ((minX + maxX) / 2), MAP_WIDTH * (1 - scale), 0)
  const ty = clamp(MAP_HEIGHT / 2 - scale * ((minY + maxY) / 2), MAP_HEIGHT * (1 - scale), 0)
  return { x: round2((tx / MAP_WIDTH) * 100), y: round2((ty / MAP_HEIGHT) * 100), scale: round2(scale) }
}

/** The pan as the custom properties .map-pan reads (app/globals.css). */
export function panStyle(pan: MapPan): CSSProperties {
  return { '--pan-x': `${pan.x}%`, '--pan-y': `${pan.y}%`, '--pan-s': String(pan.scale) } as CSSProperties
}
