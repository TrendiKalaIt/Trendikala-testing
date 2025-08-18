/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        home: ['Libre Baskerville', 'serif'],
        heading: ['Playfair Display', 'serif'],
        body: ['Lato', 'sans-serif'],
        
      },
      colors: {
        luxuryGold: '#C5A880', // optional gold accent
      },
    },
  },
  plugins: [],
}

