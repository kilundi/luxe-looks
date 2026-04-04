/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D4AF37', // Classic Gold
        secondary: '#1A1A1A', // Deep Charcoal
        accent: '#FDFDFD', // Off White/Ivory
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        'glass': '12px',
      }
    },
  },
  plugins: [],
}
