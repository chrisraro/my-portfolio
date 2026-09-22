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
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        // Same family as sans: globals.css adds font-variation-settings 'MONO' 1
        // to .font-mono, which is what makes Recursive monospaced.
        mono: ['var(--font-sans)', 'ui-monospace', 'monospace'],
        // Temporary alias so legacy `font-display` headings render in Recursive
        // until their sections are replaced. Removed in Task 13.
        display: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },
    },
  },
  plugins: [],
}
