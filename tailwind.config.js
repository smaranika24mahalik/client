/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f5ff',
          100: '#e0eaff',
          200: '#c7d8fe',
          300: '#a4bbfd',
          400: '#8096f9',
          500: '#5e72e4',
          600: '#4a56c4',
          700: '#3d4499',
          800: '#2f3575',
          900: '#1e234f',
          950: '#141838',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
