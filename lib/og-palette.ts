// The day theme's tokens as hex, for the link-preview cards (app/og). The site
// opens in the day theme (ThemeProvider defaultTheme="light"), so the cards do
// too. ImageResponse renders outside the page and cannot read CSS variables;
// tests/design/og-palette.test.ts converts each `:root` oklch triplet in
// app/globals.css to sRGB and fails if these drift from it.
export const ogPalette = {
  bg: '#EAEFE4',
  ink: '#1A1F15',
  muted: '#575E4F',
  line: '#D1D7C9',
  contour: '#91976D',
  trail: '#B71C0E',
} as const

export type OgToken = keyof typeof ogPalette
