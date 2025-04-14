/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        primary: '#000000',
        secondary: '#A88FAC',
        tertiary: '#826C7F',
        background: '#FFFFFF',
      },
    },
  },
  plugins: [],
};