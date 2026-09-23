// The dark theme's tokens as hex, for the social card. ImageResponse renders
// outside the page and cannot read CSS variables, so the card needs literal
// colours. tests/design/og-palette.test.ts converts each `.dark` oklch triplet
// in app/globals.css to sRGB and fails if these drift from it.
export const ogPalette = {
  bg: '#141210',
  ink: '#F1ECE4',
  muted: '#968D82',
  line: '#2B2621',
  accent: '#F2A23A',
} as const

export type OgToken = keyof typeof ogPalette
