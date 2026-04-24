/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--brand-color, #FACC15)',
          50: '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15',
          500: '#EAB308',
          600: '#CA8A04',
          700: '#A16207',
        },
        ink: {
          DEFAULT: '#0A0A0A',
          900: '#0A0A0A',
          800: '#171717',
          700: '#262626',
          600: '#404040',
          500: '#525252',
        },
      },
      fontFamily: {
        display: ['Bebas Neue', 'Impact', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.08)',
        brand: '0 8px 24px rgba(250, 204, 21, 0.35)',
      },
    },
  },
  plugins: [],
}
