/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-navy': '#192837',
        'brand-accent': '#7342E2',
        'brand-blue': '#087FC1',
        'brand-cyan': '#18C7E8',
        'brand-success': '#00B978',
        skyrovix: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
          accent: '#06b6d4',
          dark: '#0f172a',
          navy: '#0b132b',
        }
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Helvetica Now Display Bold', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'sans-serif'],
        sans: ['var(--font-body)', 'Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
