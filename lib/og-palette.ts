// The dark theme's tokens as hex, for the social card. ImageResponse renders
// outside the page and cannot read CSS variables, so the card needs literal
// colours. tests/design/og-palette.test.ts converts each `.dark` oklch triplet
// in app/globals.css to sRGB and fails if these drift from it.
export const ogPalette = {
  bg: '#171310',
  ink: '#F2EEE6',
  muted: '#9E978E',
  line: '#322D29',
  accent: '#EEAE7B',
} as const

export type OgToken = keyof typeof ogPalette
