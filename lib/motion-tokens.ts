// Motion tokens. Mirrored as --dur-* / --ease-* custom properties in app/globals.css;
// tests/design/motion-tokens.test.ts keeps the two in step.
export const motionTokens = {
  duration: { fast: 0.18, normal: 0.35, slow: 0.6, crawl: 1.2 },
  easing: {
    smooth: [0.22, 1, 0.36, 1],
    sharp: [0.4, 0, 0.2, 1],
  },
  distance: { sm: 8, md: 16, lg: 24, xl: 40 },
  // A dialog's image settles from just under full size.
  scale: { settle: 0.98 },
} as const

export const springs = {
  snappy: { type: 'spring', stiffness: 400, damping: 32, mass: 1 },
  gentle: { type: 'spring', stiffness: 180, damping: 26, mass: 1 },
} as const
