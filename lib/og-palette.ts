// The dark theme's tokens as hex, for the social card. ImageResponse renders
// outside the page and cannot read CSS variables, so the card needs literal
// colours. tests/design/og-palette.test.ts converts each `.dark` oklch triplet
// in app/globals.css to sRGB and fails if these drift from it.
export const ogPalette = {
  bg: '#05212E',
  ink: '#F5F3EB',
  muted: '#87A0AB',
  line: '#213D4B',
  accent: '#F0BB3B',
} as const

export type OgToken = keyof typeof ogPalette
