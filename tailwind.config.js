/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: { 50: '#eef1ff', 100: '#dfe4ff', 300: '#9aa7f2', 500: '#4a5fe0', 600: '#3b4cca', 700: '#2f3ca8' },
        paper: '#f5f6fa',
        ink: '#14161f',
        night: '#0e1018',
        surface: '#171a26',
        line: '#262a3a',
      },
    },
  },
  plugins: [],
};
