/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A3C5E',
        'primary-dark': '#002645',
        accent: '#E8A045',
        surface: '#F8F7F4',
        'surface-elevated': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'level-1': '0px 2px 8px rgba(0,0,0,0.07)',
        'level-2': '0px 4px 16px rgba(0,0,0,0.1)',
        'level-hover': '0px 8px 24px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        'card': '10px',
      }
    },
  },
  plugins: [],
}
