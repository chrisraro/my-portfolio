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
      },
      fontFamily: {
        // Instrument Sans only.
        sans: ['var(--font-sans)', 'Arial', 'sans-serif'],
        display: ['var(--font-sans)', 'Arial', 'sans-serif'],
      },
      // --radius is 16px: sm 10px (rows, fields), md 12px, DEFAULT/lg 16px
      // (glass, plates), xl 20px (dialog). Buttons and chips are rounded-full.
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) - 6px)',
        md: 'calc(var(--radius) - 4px)',
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
