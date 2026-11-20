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
        contour: token('contour'),
        // Trail red: the primary action and the current position only.
        trail: token('trail'),
        'on-trail': token('on-trail'),
        'field-border': token('field-border'),
        live: token('live'),
        'status-early': token('status-early'),
        'status-private': token('status-private'),
        'status-internal': token('status-internal'),
        // Transitional (Portfolio 4.0 sections); removed in S6.
        accent: token('accent'),
        'accent-plane': token('accent-plane'),
        'on-accent': token('on-accent'),
      },
      fontFamily: {
        // Archivo only. `display` is the same family; width and case come
        // from .text-display and .map-label.
        sans: ['var(--font-sans)', 'Arial', 'sans-serif'],
        display: ['var(--font-sans)', 'Arial', 'sans-serif'],
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
