/** @type {import('tailwindcss').Config} */
const token = (name) => `oklch(var(--${name}) / <alpha-value>)`

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: token('bg'),
        panel: token('panel'),
        ink: token('ink'),
        muted: token('muted'),
        'muted-strong': token('muted-strong'),
        line: token('line'),
        'line-strong': token('line-strong'),
        accent: token('accent'),
        'on-accent': token('on-accent'),
        live: token('live'),
        'status-early': token('status-early'),
        'status-private': token('status-private'),
        'status-internal': token('status-internal'),
      },
      fontFamily: {
        // Figtree reads; Anybody (variable, with a width axis) shouts. There is
        // no mono family: edge codes use .edge-code (Anybody, tabular numerals).
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      // --radius is 6px: sm 2px (postcards), md 4px, DEFAULT/lg 6px (cards,
      // panels, buttons), xl 10px (dialog). Chips use rounded-full.
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },
      boxShadow: {
        lift: 'var(--shadow-lift)',
        overlay: 'var(--shadow-overlay)',
      },
    },
  },
  plugins: [],
}
