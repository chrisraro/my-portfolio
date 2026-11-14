/** @type {import('tailwindcss').Config} */
// Monochrome: ghost white, snow, four grays and black. Nothing else.
// The same values are CSS variables in app/globals.css.
module.exports = {
  content: ['./components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ghost: 'var(--ghost)',
      snow: 'var(--snow)',
      ink: 'var(--ink)',
      gray: {
        text: 'var(--gray-text)',
        mid: 'var(--gray-mid)',
        line: 'var(--gray-line)',
        fill: 'var(--gray-fill)',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '1.75rem',
        field: '0.875rem',
      },
      boxShadow: {
        card: '0 1px 2px rgb(0 0 0 / 0.04), 0 12px 32px -16px rgb(0 0 0 / 0.12)',
        float: '0 2px 6px rgb(0 0 0 / 0.06), 0 24px 48px -20px rgb(0 0 0 / 0.22)',
      },
    },
  },
  plugins: [],
}
