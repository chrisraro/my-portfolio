/** @type {import('tailwindcss').Config} */
// Clean slate: Tailwind's defaults only. The next design direction adds its tokens here.
module.exports = {
  content: ['./components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: {} },
  plugins: [],
}
