// The night theme's tokens as hex, for the link-preview cards (app/og). The
// site opens at night (ThemeProvider defaultTheme="dark"), so the cards do too.
// ImageResponse renders outside the page and cannot read CSS variables;
// tests/design/og-palette.test.ts converts each `.dark` oklch triplet in
// app/globals.css to sRGB and fails if these drift from it.
export const ogPalette = {
  bg: '#090F15',
  ink: '#F2F0EA',
  muted: '#96A0A7',
  line: '#232B33',
  'land-far': '#03090F',
  'land-lit': '#1F303B',
  dawn: '#BC5A29',
  trail: '#FB9D62',
} as const

export type OgToken = keyof typeof ogPalette
