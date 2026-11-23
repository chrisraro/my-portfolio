// Where the fireflies (alitaptap) sit, as percentages of the window, and which
// of them twinkle. Layout, not content.
const FIREFLIES = [
  { x: 22, y: 12, twinkle: false },
  { x: 20.5, y: 46, twinkle: true },
  { x: 23.5, y: 24, twinkle: false },
  { x: 97, y: 48, twinkle: false },
  { x: 95, y: 14, twinkle: true },
  { x: 97.5, y: 31, twinkle: false },
  { x: 21.5, y: 66, twinkle: false },
  { x: 94.5, y: 60, twinkle: true },
]

/**
 * The land behind every page: Mount Isarog over the Naga plain, fixed to the
 * window, drawn by scripts/build-scene.mjs as one-bit masks that theme tokens
 * colour (.scene-* in app/globals.css). Its one move follows the page: first
 * light rises behind the summit between the top of a page and its end. A scrim
 * under the reading column keeps every word on near-flat colour. Decorative.
 */
export function Scene() {
  return (
    <div aria-hidden="true" className="scene">
      <span className="scene-layer scene-dawn" />
      <span className="scene-layer scene-far" />
      <span className="scene-layer scene-near" />
      <span className="scene-layer scene-lit" />
      <span className="scene-scrim" />
      {FIREFLIES.map((f) => (
        <span
          key={`${f.x}-${f.y}`}
          className={f.twinkle ? 'firefly firefly--twinkle' : 'firefly'}
          style={{ left: `${f.x}%`, top: `${f.y}%` }}
        />
      ))}
    </div>
  )
}
